import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/utils/jwt';

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    console.log('Middleware - Token:', token?.substring(0, 20) + '...'); // 토큰 일부만 로그

    if (!token) {
      console.log('Middleware - No token found');
      throw new Error('토큰이 없습니다');
    }

    try {
      const payload = await verifyToken(token);
      console.log('Middleware - Token verified:', !!payload);
      
      if (!payload || !payload.userId) { // userId 존재 여부도 확인
        throw new Error('유효하지 않은 토큰입니다');
      }

      return NextResponse.next();
    } catch (verifyError) {
      console.log('Middleware - Token verification failed:', verifyError);
      throw new Error('토큰 검증 실패');
    }
    
  } catch (error) {
    console.log('Middleware - Error:', error);
    const currentPath = request.nextUrl.pathname + request.nextUrl.search;
    return NextResponse.redirect(
      new URL(`/login?redirect_to=${encodeURIComponent(currentPath)}`, request.url)
    );
  }
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: [
    // 로그인 페이지 제외하고, 특정 경로만 보호
    '/payment/:path*',
    '/mypage/:path*',
    // 다른 보호가 필요한 경로들...
  ]
}; 