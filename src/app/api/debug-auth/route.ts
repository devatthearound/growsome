import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('=== 인증 디버그 시작 ===');

    // 1. 환경 변수 확인
    const envCheck = {
      JWT_SECRET: !!process.env.JWT_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    };
    console.log('환경 변수:', envCheck);

    // 2. 쿠키 확인
    const cookies = {
      'auth-token': request.cookies.get('auth-token')?.value || null,
      'remember-me': request.cookies.get('remember-me')?.value || null,
    };
    console.log('쿠키:', {
      hasAuthToken: !!cookies['auth-token'],
      authTokenLength: cookies['auth-token']?.length || 0,
      rememberMe: cookies['remember-me']
    });

    // 3. 데이터베이스 연결 테스트
    let dbTest = { connected: false, error: null, userCount: 0 };
    try {
      const userCount = await prisma.user.count();
      dbTest = { connected: true, error: null, userCount };
      console.log('DB 연결 성공, 사용자 수:', userCount);
    } catch (dbError: any) {
      dbTest = { connected: false, error: dbError.message, userCount: 0 };
      console.log('DB 연결 실패:', dbError.message);
    }

    // 4. JWT 토큰 검증 (있는 경우)
    let tokenTest = { valid: false, decoded: null, error: null };
    if (cookies['auth-token']) {
      try {
        const jwt = await import('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const decoded = jwt.default.verify(cookies['auth-token'], JWT_SECRET);
        tokenTest = { valid: true, decoded: decoded as any, error: null };
        console.log('JWT 토큰 유효함:', decoded);
      } catch (jwtError: any) {
        tokenTest = { valid: false, decoded: null, error: jwtError.message };
        console.log('JWT 토큰 무효함:', jwtError.message);
      }
    }

    return NextResponse.json({
      success: true,
      debug: {
        environment: envCheck,
        cookies,
        database: dbTest,
        token: tokenTest,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('디버그 API 오류:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
