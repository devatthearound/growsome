// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { validateSignupData } from '@/utils/validators';
import pool from '@/lib/db';
import { generateToken, setAuthCookies } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const data = await request.json();

    // 입력값 검증
    const validationErrors = validateSignupData(data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: '입력값이 올바르지 않습니다.',
          validationErrors 
        },
        { status: 400 }
      );
    }

    // 트랜잭션 시작
    await client.query('BEGIN');

    try {
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
          company_name, position, referral_source_id,
          created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, email, username, company_name, position, phone_number`,
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
      const accessToken = await generateToken({
        userId: user.id,
        email: user.email
      }, '24h');

      const refreshToken = await generateToken({
        userId: user.id,
        email: user.email
      }, '30d');

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
              `INSERT INTO user_agreements (user_id, terms_version_id, agreed_at)
              VALUES ($1, $2, CURRENT_TIMESTAMP)`,
              [user.id, version.id]
            );
          }
        }
      }

      // 마케팅 수신 동의 기록
      // if (data.marketingAccepted) {
      //   await client.query(
      //     `INSERT INTO marketing_consents(user_id, channel, is_agreed, updated_at)
      //      VALUES($1, 'email', true, CURRENT_TIMESTAMP),
      //            ($1, 'sms', true, CURRENT_TIMESTAMP)`,
      //     [user.id]
      //   );
      // }

      // 트랜잭션 커밋
      await client.query('COMMIT');
      
      // 쿠키에 토큰 설정
      const response = NextResponse.json({
        success: true,
        message: '회원가입이 완료되었습니다.',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          company_name: user.company_name,  
          position: user.position,
          phone_number: user.phone_number,
          isExtension: data?.isExtension || false
        }
      });

      // 콜백 URL 설정
      const callbackUrl = data.callbackUrl || undefined;
      return setAuthCookies(accessToken, refreshToken, response, callbackUrl);

    } catch (error: any) {
      // 트랜잭션 롤백
      await client.query('ROLLBACK');
      throw error;
    }
    
  } catch (error: any) {
    console.error('회원가입 에러:', error);
    
    if (error.message === 'Invalid visit path') {
      return NextResponse.json(
        { 
          success: false,
          error: '올바르지 않은 방문 경로입니다.' 
        },
        { status: 400 }
      );
    }
    
    if (error.code === '23505') { // PostgreSQL 중복 키 오류 코드
      return NextResponse.json(
        { 
          success: false,
          error: '이미 사용 중인 이메일입니다.' 
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: '회원가입 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}