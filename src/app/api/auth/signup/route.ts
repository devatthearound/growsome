import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { validateSignupData } from '@/app/utils/validators';
import pool from '@/app/lib/db';
import { generateToken } from '@/app/utils/jwt';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const data = await request.json();

    // 입력값 검증
    const validationErrors = validateSignupData(data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: '입력값이 올바르지 않습니다.',
          validationErrors 
        },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 방문 경로 ID 조회
    const referralSourceResult = await client.query(
      'SELECT id FROM referral_sources WHERE source_name = $1',
      [data.visitPath]
    );

    if (referralSourceResult.rows.length === 0) {
      throw new Error('Invalid visit path');
    }

    const referral_source_id = referralSourceResult.rows[0].id;

    // 사용자 생성
    const userResult = await client.query(
      `INSERT INTO users (
        email, password, username, phone_number, 
        company_name, position, referral_source_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email`,
      [
        data.email,
        hashedPassword,
        data.name,
        data.phone,
        data.company,
        data.level,
        referral_source_id
      ]
    );

    const user = userResult.rows[0];

    // JWT 토큰 생성
    const token = await generateToken({
      userId: user.id,
      email: user.email
    });

    // 세션 테이블에 토큰 저장
    await client.query(
      `INSERT INTO sessions (user_id, token, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [user.id, token]
    );

    // 약관 동의 기록
    if (data.termsAccepted || data.privacyPolicyAccepted) {
      const termsVersionsResult = await client.query(
        `SELECT id, terms_type FROM terms_versions
        WHERE effective_date <= CURRENT_TIMESTAMP
        ORDER BY effective_date DESC
        LIMIT 2`
      );

      for (const version of termsVersionsResult.rows) {
        if ((version.terms_type === 'terms' && data.termsAccepted) ||
            (version.terms_type === 'privacy' && data.privacyPolicyAccepted)) {
          await client.query(
            `INSERT INTO user_agreements (user_id, terms_version_id)
            VALUES ($1, $2)`,
            [user.id, version.id]
          );
        }
      }
    }

    await client.query('COMMIT');

    // 쿠키에 토큰 설정
    const response = NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: {
        ...user,
        isExtension: data?.isExtension || false
      }
    });

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7일
    });

    return response;

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('회원가입 에러:', error);
    
    if (error.message === 'Invalid visit path') {
      return NextResponse.json(
        { error: '올바르지 않은 방문 경로입니다.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 