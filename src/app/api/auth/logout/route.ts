// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthTokens, verifyToken, removeAuthCookies } from '@/lib/auth';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    // 현재 인증된 토큰 가져오기
    const { accessToken, refreshToken } = await getAuthTokens();
    
    // 액세스 토큰이 없으면 이미 로그아웃된 상태
    if (!accessToken && !refreshToken) {
      return NextResponse.json({ 
        success: true, 
        message: '이미 로그아웃되었습니다.' 
      });
    }
    
    let userId: string | null = null;
    
    // 토큰에서 사용자 ID 추출 시도
    if (accessToken) {
      try {
        const payload = await verifyToken(accessToken);
        userId = payload.userId;
      } catch (error) {
        // 액세스 토큰이 유효하지 않은 경우 리프레시 토큰 시도
        if (refreshToken) {
          try {
            const payload = await verifyToken(refreshToken);
            userId = payload.userId;
          } catch (refreshError) {
            // 두 토큰 모두 유효하지 않음 - 쿠키만 제거
          }
        }
      }
    }
    
    // 데이터베이스에서 세션 정보 삭제 (사용자 ID가 있는 경우)
    if (userId) {
      try {
        // 리프레시 토큰 블랙리스트에 추가 (선택적)
        // 실제 애플리케이션에서는 리프레시 토큰을 블랙리스트에 추가하여
        // 다시 사용할 수 없도록 만드는 것이 좋습니다.
        // if (refreshToken) {
        //   await client.query(
        //     `INSERT INTO token_blacklist(token, expires_at)
        //      VALUES($1, NOW() + INTERVAL '7 days')
        //      ON CONFLICT (token) DO NOTHING`,
        //     [refreshToken]
        //   );
        // }
        
        // 추가적인 세션 정보가 있다면 삭제
        try {
          await client.query(
            'DELETE FROM sessions WHERE user_id = $1',
            [userId]
          );
        } catch (sessionError) {
          // sessions 테이블이 없을 수 있으므로 오류 무시
          console.log('세션 테이블 삭제 실패 (테이블이 없을 수 있음):', sessionError);
        }
      } catch (dbError) {
        console.error('데이터베이스 처리 중 오류:', dbError);
        // 데이터베이스 오류가 있더라도 로그아웃은 진행
      }
    }
    
    // 응답 객체 생성
    const response = NextResponse.json({
      success: true,
      message: '로그아웃되었습니다.'
    });
    
    // 인증 쿠키 제거
    return removeAuthCookies(response);
  } catch (error: any) {
    console.error('로그아웃 처리 중 오류:', error);
    
    // 오류가 발생해도 쿠키는 제거해야 함
    const response = NextResponse.json(
      { 
        success: false, 
        error: '로그아웃 처리 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
    
    return removeAuthCookies(response);
  } finally {
    client.release();
  }
}