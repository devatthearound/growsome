import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken, generateToken } from '@/utils/jwt';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: '리프레시 토큰이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 리프레시 토큰 검증
    const payload = await verifyToken(refreshToken);

    // DB에서 세션 확인
    const sessionResult = await client.query(
      `SELECT s.* 
      FROM sessions s
      WHERE s.access_token = $1 
      AND s.expires_at > CURRENT_TIMESTAMP`,
      [refreshToken]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { error: '유효하지 않거나 만료된 리프레시 토큰입니다.' },
        { status: 401 }
      );
    }

    // 새로운 토큰 생성
    const newAccessToken = await generateToken({
      userId: payload.userId,
      email: payload.email
    }, '7d');

    const newRefreshToken = await generateToken({
      userId: payload.userId,
      email: payload.email
    }, '30d');

    // DB 세션 업데이트
    await client.query(
      `UPDATE sessions 
      SET access_token = $1, 
          refresh_token = $2,
          expires_at = CASE 
            WHEN expires_at < NOW() + INTERVAL '30 days' 
            THEN NOW() + INTERVAL '30 days'
            ELSE expires_at
          END
      WHERE access_token = $3`,
      [newAccessToken, newRefreshToken, refreshToken]
    );

    const response = NextResponse.json({
      success: true,
      newAccessToken,
      newRefreshToken
    });

    // 쿠키 업데이트
    response.cookies.set({
      name: 'coupas_access_token',
      value: newAccessToken,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7일
    });

    response.cookies.set({
      name: 'coupas_refresh_token',
      value: newRefreshToken,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30일
    });

    return response;

  } catch (error) {
    console.error('토큰 갱신 에러:', error);
    return NextResponse.json(
      { error: '토큰 갱신 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 