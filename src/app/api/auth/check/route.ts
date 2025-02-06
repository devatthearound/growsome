import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/app/lib/db';
import { verifyToken } from '@/app/utils/jwt';

export async function GET() {
  const client = await pool.connect();
  
  try {
    // 쿠키에서 토큰 가져오기
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    console.log('token', token);
    if (!token) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    // 토큰 검증
    const payload = await verifyToken(token);

    // 세션 확인
    const sessionResult = await client.query(
      `SELECT s.* 
      FROM sessions s
      WHERE s.token = $1 
      AND s.expires_at > CURRENT_TIMESTAMP`,
      [token]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { error: '세션이 만료되었습니다.' },
        { status: 401 }
      );
    }

    // 사용자 정보 조회
    const userResult = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.username,
        u.company_name,
        u.position
      FROM users u
      WHERE u.id = $1`,
      [payload.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    return NextResponse.json({
      isLoggedIn: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        company_name: user.company_name,
        position: user.position
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: '인증 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 