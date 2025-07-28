// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // jose는 Edge Runtime과 호환됨

// 토큰 이름 상수
const ACCESS_TOKEN_NAME = 'auth-token';
const REFRESH_TOKEN_NAME = 'remember-me';

// JWT 시크릿 키
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Edge Runtime 호환 토큰 검증 함수
async function verifyJWT(token: string) {
  try {
    // TextEncoder로 시크릿 키를 Uint8Array로 변환
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    // jose의 jwtVerify 사용
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    throw error;
  }
}

export async function middleware(request: NextRequest) {
  try {
    // auth_code 파라미터가 있는 경우 인증 처리 중이므로 미들웨어를 건너뜀
    const url = request.nextUrl;
    if (url.searchParams.has('auth_code')) {
      return NextResponse.next();
    }

    if(url.pathname === 'redirect_url') {
      console.log('Middleware - Redirecting to redirect_url', url.pathname);
    }
    
    // 1. 쿠키에서 토큰 가져오기
    const accessToken = request.cookies.get(ACCESS_TOKEN_NAME)?.value;
    const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;
    
    // 2. 토큰이 아예 없는 경우 즉시 로그인 페이지로 리다이렉트
    if (!accessToken && !refreshToken) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Middleware - No tokens found');
      }
      return redirectToLogin(request);
    }

    // 3. 액세스 토큰 검증
    if (accessToken) {
      try {
        const payload = await verifyJWT(accessToken);
        
        if (payload && payload.userId) {
          // 유효한 토큰이면 요청 진행
          return NextResponse.next();
        }
      } catch (verifyError) {
        // 액세스 토큰이 유효하지 않지만, 리프레시 토큰이 있는 경우
        if (refreshToken) {
          // /check API를 통해 토큰 갱신 처리
          const currentPath = request.nextUrl.pathname + request.nextUrl.search;
          const checkUrl = new URL('/api/auth/check', request.url);
          checkUrl.searchParams.set('callback-url', currentPath);
          
          if (process.env.NODE_ENV !== 'production') {
            console.log('Middleware - Redirecting to token check/refresh API');
          }
          
          return NextResponse.redirect(checkUrl);
        }
      }
    }

    // 4. 모든 인증 시도가 실패한 경우 로그인 페이지로 리다이렉트
    return redirectToLogin(request);
    
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Middleware - Error:', error);
    }
    
    return redirectToLogin(request);
  }
}

// 로그인 페이지로 리다이렉트하는 유틸리티 함수
function redirectToLogin(request: NextRequest) {
  const currentPath = request.nextUrl.pathname + request.nextUrl.search;
  return NextResponse.redirect(
    new URL(`/login?redirect_to=${encodeURIComponent(currentPath)}`, request.url)
  );
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: [
    // 인증이 필요한 경로만 보호
    '/mypage/:path*',
    // '/admin/:path*', // admin 경로는 클라이언트 사이드에서 보호
    '/dashboard/:path*',
    // API 경로와 홈페이지는 보호하지 않음
    // '/api/:path*', '/courses', '/' 등은 제외
  ]
};