import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/utils/jwt';

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      throw new Error('No token found');
    }

    const payload = verifyToken(token);
    
    // 토큰이 유효하면 요청 진행
    return NextResponse.next();
    
  } catch (error) {
    // 인증 실패시 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    // 보호가 필요한 다른 경로들...
  ]
}; 