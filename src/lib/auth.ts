// lib/auth.ts - 수정된 버전
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// 일관된 토큰 이름 사용
export const ACCESS_TOKEN_NAME = 'coupas_access_token';
export const REFRESH_TOKEN_NAME = 'coupas_refresh_token';

// 토큰 검증을 위한 비밀 키
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 페이로드 타입 정의
export interface TokenPayload {
  userId: string; 
  email: string;
}

// 쿠키 설정 함수
export function setAuthCookies(accessToken: string, refreshToken: string, response: NextResponse, redirectUrl?: string) {
  // Access Token 쿠키 설정 (짧은 유효기간)
  response.cookies.set(ACCESS_TOKEN_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2, // 2시간
  });

  // Refresh Token 쿠키 설정 (긴 유효기간)
  response.cookies.set(REFRESH_TOKEN_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7일
  });

  // 리다이렉트 URL이 있는 경우
  if(redirectUrl) {
    response.cookies.set('redirect_url', redirectUrl, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  return response;
}

// 쿠키 삭제 함수
export function removeAuthCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_TOKEN_NAME);
  response.cookies.delete(REFRESH_TOKEN_NAME);
  response.cookies.delete('redirect_url');
  return response;
}

// 현재 사용자의 토큰을 가져오는 함수
export async function getAuthTokens() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get(ACCESS_TOKEN_NAME)?.value,
    refreshToken: cookieStore.get(REFRESH_TOKEN_NAME)?.value
  };
}

// JWT 토큰 검증 함수
export async function verifyToken(token: string): Promise<TokenPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as TokenPayload);
      }
    });
  });
}

// 토큰 생성 함수
export async function generateToken(payload: TokenPayload, expiresIn: string | number): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload, 
      JWT_SECRET, 
      { 
        expiresIn: expiresIn as jwt.SignOptions['expiresIn']
      }, 
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      }
    );
  });
}

// 중앙화된 토큰 갱신 함수
export async function refreshTokens(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
} | null> {
  try {
    // 리프레시 토큰 검증
    const payload = await verifyToken(refreshToken);
    const userId = payload.userId;
    const email = payload.email;

    console.log('토큰 갱신 시도:', { userId, email });
    
    // 새 토큰 생성
    const newAccessToken = await generateToken({ userId, email }, '2h');
    const newRefreshToken = await generateToken({ userId, email }, '7d');

    console.log('새 토큰 생성 완료');

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId,
      email
    };
    
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    return null;
  }
}

// 사용자 인증 가드 (API 엔드포인트 보호용)
export async function withAuth<T>(
  request: Request,
  handler: (request: Request, user: TokenPayload) => Promise<T>
): Promise<T | NextResponse> {
  try {
    console.log('🔐 withAuth 시작');
    
    // 1. 쿠키에서 토큰 가져오기
    const { accessToken, refreshToken } = await getAuthTokens();
    
    console.log('🍪 토큰 확인:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken
    });

    // 2. 토큰이 없는 경우
    if (!accessToken && !refreshToken) {
      console.log('❌ 토큰이 없음');
      return NextResponse.json(
        { isLoggedIn: false, error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    let userId: string | null = null;
    let userEmail: string | null = null;
    let isTokenRefreshed = false;
    let newAccessToken: string | undefined;
    let newRefreshToken: string | undefined;

    // 3. 액세스 토큰 검증
    if (accessToken) {
      try {
        console.log('🔍 액세스 토큰 검증 중...');
        const payload = await verifyToken(accessToken);
        userId = payload.userId;
        userEmail = payload.email;
        console.log('✅ 액세스 토큰 유효:', { userId, userEmail });
      } catch (error: any) {
        console.log('⚠️ 액세스 토큰 무효:', error.message);
        // 액세스 토큰이 유효하지 않은 경우
        if (!refreshToken) {
          return NextResponse.json(
            { isLoggedIn: false, error: '인증이 만료되었습니다. 다시 로그인해주세요.' },
            { status: 401 }
          );
        }
      }
    }

    // 4. 액세스 토큰이 유효하지 않고 리프레시 토큰이 있는 경우
    if (!userId && refreshToken) {
      console.log('🔄 토큰 갱신 시도 중...');
      // 중앙화된 토큰 갱신 함수 사용
      const refreshResult = await refreshTokens(refreshToken);
      
      if (!refreshResult) {
        console.log('❌ 토큰 갱신 실패');
        return NextResponse.json(
          { isLoggedIn: false, error: '인증이 만료되었습니다. 다시 로그인해주세요.' },
          { status: 401 }
        );
      }
      
      userId = refreshResult.userId;
      userEmail = refreshResult.email;
      newAccessToken = refreshResult.accessToken;
      newRefreshToken = refreshResult.refreshToken;
      isTokenRefreshed = true;
      console.log('✅ 토큰 갱신 성공:', { userId, userEmail });
    }

    // 5. 인증된 사용자 정보 구성
    const user: TokenPayload = {
      userId: userId!,
      email: userEmail!
    };

    console.log('🎯 핸들러 호출:', user);

    // 6. 원래 API 핸들러 호출
    const result = await handler(request, user);

    // 7. 결과가 NextResponse인 경우 토큰 갱신 적용
    if (result instanceof NextResponse && isTokenRefreshed && newAccessToken && newRefreshToken) {
      console.log('🍪 새 토큰으로 쿠키 설정');
      return setAuthCookies(newAccessToken, newRefreshToken, result);
    }

    return result;
  } catch (error: any) {
    console.error('❌ API 인증 오류:', error);
    return NextResponse.json(
      { 
        isLoggedIn: false,
        error: '인증 처리 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}