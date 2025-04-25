import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { withAuth, TokenPayload } from '@/lib/auth';

export async function GET(request: Request) {
  return withAuth(request, getUserInfo);
}


async function getUserInfo(request: Request, user: TokenPayload): Promise<NextResponse> {
  const client = await pool.connect();
  
  try {
    // 사용자 정보 조회
    const queryResult = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.username,
        u.company_name,
        u.position,
        u.phone_number
      FROM users u
      WHERE u.id = $1`,
      [user.userId]
    );

    if (queryResult.rows.length === 0) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const userResult = queryResult.rows[0];

    return NextResponse.json({
      isLoggedIn: true,
      user: {
        id: userResult.id,
        email: userResult.email,
        username: userResult.username,
        company_name: userResult.company_name,
        position: userResult.position,
        phone_number : userResult.phone_number
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