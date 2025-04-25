// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/lib/db';
import { generateToken, setAuthCookies } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const { email, password, rememberMe, callbackUrl } = await request.json();
    
    // 이메일 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 조회
    const userResult = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.password,
        u.username,
        u.company_name,
        u.position,
        u.phone_number
      FROM users u
      WHERE u.email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // 비밀번호 검증
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 로그인 시간 업데이트
    try {
      await client.query(
        'UPDATE users SET last_login_at = NOW() WHERE id = $1',
        [user.id]
      );
    } catch (updateError) {
      // 로그인 시간 업데이트 실패는 무시 (중요하지 않음)
      console.log('로그인 시간 업데이트 실패:', updateError);
    }

    // JWT 토큰 생성
    const accessToken = await generateToken({
      userId: user.id,
      email: user.email
    }, rememberMe ? '24h' : '2h'); // 로그인 유지 옵션에 따라 유효 시간 조정

    const refreshToken = await generateToken({
      userId: user.id,
      email: user.email
    }, rememberMe ? '30d' : '7d'); // 로그인 유지 옵션에 따라 유효 시간 조정

    // 리프레시 토큰을 데이터베이스에 저장
    try {
      // 토큰 해시 생성 (토큰 자체를 저장하지 않음)
      const tokenHash = hashToken(refreshToken);
      
      await client.query(
        `INSERT INTO refresh_tokens(user_id, token_hash, expires_at)
         VALUES($1, $2, NOW() + INTERVAL $3)
         ON CONFLICT (user_id) DO UPDATE 
         SET token_hash = $2, expires_at = NOW() + INTERVAL $3`,
        [user.id, tokenHash, rememberMe ? '30 days' : '7 days']
      );
    } catch (tokenError) {
      // 토큰 저장 실패는 로그만 기록 (테이블이 없을 수 있음)
      console.log('리프레시 토큰 저장 실패:', tokenError);
    }

    // 사용자 정보에서 민감한 정보 제거
    delete user.password;
    
    // 로그인 응답
    const response = NextResponse.json({
      success: true,
      message: '로그인이 완료되었습니다.',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        company_name: user.company_name,  
        position: user.position,
        phone_number: user.phone_number
      }
    });

    // HTTP Only 쿠키 설정
    return setAuthCookies(accessToken, refreshToken, response, callbackUrl);
  } catch (error: any) {  
    console.error('로그인 처리 중 에러:', error);
    return NextResponse.json(
      { 
        error: '로그인 처리 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// 토큰 해싱 함수 (DB 저장용)
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}