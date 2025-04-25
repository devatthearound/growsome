// app/api/auth/check/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { 
  getAuthTokens, 
  verifyToken, 
  refreshTokens, 
  setAuthCookies,
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME
} from '@/lib/auth';

export async function GET(request: Request) {
  const client = await pool.connect();
  
  try {
    // URL에서 searchParams 가져오기
    const { searchParams } = new URL(request.url);
    const callbackUrl = searchParams.get('callback-url');
    
    // 쿠키에서 토큰 가져오기
    const { accessToken, refreshToken } = await getAuthTokens();

    // 토큰이 없는 경우
    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { isLoggedIn: false, error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    let userId: string | null = null;
    let userInfo: any = null;
    let isTokenRefreshed = false;
    let newAccessToken: string | undefined;
    let newRefreshToken: string | undefined;

    // 1. 액세스 토큰 검증
    if (accessToken) {
      try {
        const payload = await verifyToken(accessToken);
        userId = payload.userId;
      } catch (error) {
        // 액세스 토큰이 유효하지 않은 경우(만료 등)
        // 리프레시 토큰 처리로 넘어감
        if (!refreshToken) {
          return NextResponse.json(
            { isLoggedIn: false, error: '세션이 만료되었습니다. 다시 로그인해주세요.' },
            { status: 401 }
          );
        }
      }
    }

    // 2. 액세스 토큰이 유효하지 않고 리프레시 토큰이 있는 경우
    if (!userId && refreshToken) {
      // 중앙화된 토큰 갱신 함수 사용
      const refreshResult = await refreshTokens(refreshToken);
      
      if (!refreshResult) {
        return NextResponse.json(
          { isLoggedIn: false, error: '인증이 만료되었습니다. 다시 로그인해주세요.' },
          { status: 401 }
        );
      }
      
      userId = refreshResult.userId;
      newAccessToken = refreshResult.accessToken;
      newRefreshToken = refreshResult.refreshToken;
      isTokenRefreshed = true;
    }

    // 3. 사용자 정보 가져오기
    if (userId) {
      const userResult = await client.query(
        `SELECT 
          id, 
          email, 
          username, 
          company_name, 
          position,
          phone_number
        FROM users
        WHERE id = $1`,
        [userId]
      );
      
      if (userResult.rows.length === 0) {
        return NextResponse.json(
          { isLoggedIn: false, error: '사용자를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      
      userInfo = userResult.rows[0];
    }

    // 응답 객체 생성
    const response = NextResponse.json({
      isLoggedIn: true,
      user: {
        id: userInfo.id,
        email: userInfo.email,
        username: userInfo.username,
        company_name: userInfo.company_name,
        position: userInfo.position,
        phone_number: userInfo.phone_number
      }
    });

    // 4. 토큰이 갱신된 경우 새 쿠키 설정
    if (isTokenRefreshed && newAccessToken && newRefreshToken) {
      return setAuthCookies(newAccessToken, newRefreshToken, response);
    }

    // 5. Electron 앱을 위한 처리 (잠시 주석 해제하고 개선)
    if (callbackUrl) {
      // 이미 auth_code 매개변수가 있는지 확인
      const callbackURL = new URL(callbackUrl, new URL(request.url).origin);
      
      // 기존 auth_code 매개변수 제거 (리다이렉션 루프 방지)
      callbackURL.searchParams.delete('auth_code');
      
      // 임시 인증 코드 생성
      const temporaryCode = Buffer.from(Math.random().toString(36)).toString('base64').substring(2, 15);
      
      // 새 auth_code 추가
      callbackURL.searchParams.set('auth_code', temporaryCode);
      
      // 절대 URL 생성
      const redirectUrl = callbackURL.toString();
      
      // 실제 애플리케이션에서는 임시 코드를 DB에 저장
      try {
        // 기존 임시 코드 삭제
        await client.query(
          `DELETE FROM auth_codes WHERE user_id = $1`,
          [userInfo.id]
        );
        
        // 새 임시 코드 저장
        await client.query(
          `INSERT INTO auth_codes(code, user_id, expires_at)
           VALUES($1, $2, NOW() + INTERVAL '5 minutes')`,
          [temporaryCode, userInfo.id]
        );
      } catch (error) {
        console.log('임시 인증 코드 저장 실패 (테이블이 없을 수 있음):', error);
      }
      
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { 
        isLoggedIn: false, 
        error: '인증 확인 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}