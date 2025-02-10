import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { verifyToken } from '@/utils/jwt';

export async function POST() {
  const client = await pool.connect();
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (token) {
      try {
        const payload = await verifyToken(token);
        
        // 세션 삭제
        await client.query(
          'DELETE FROM sessions WHERE user_id = $1 AND token = $2',
          [payload.userId, token]
        );
      } catch (error) {
        // 토큰이 유효하지 않아도 계속 진행
        console.error('Invalid token during logout:', error);
      }
    }

    const response = NextResponse.json({
      success: true,
      message: '로그아웃되었습니다.'
    });

    // 쿠키 삭제 설정 업데이트
    response.cookies.delete({
      name: 'auth_token',
      secure: true,
      sameSite: 'strict',
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('로그아웃 에러:', error);
    return NextResponse.json(
      { error: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}