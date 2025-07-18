import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('로그아웃 요청');

    // 쿠키 삭제를 위한 응답 생성
    const response = NextResponse.json({
      success: true,
      message: '로그아웃 성공'
    });

    // 인증 토큰 쿠키 삭제
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 즉시 만료
      path: '/'
    });

    // 로그인 상태 유지 쿠키 삭제
    response.cookies.set('remember-me', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 즉시 만료
      path: '/'
    });

    console.log('로그아웃 완료');

    return response;

  } catch (error) {
    console.error('로그아웃 처리 중 오류:', error);
    return NextResponse.json(
      { error: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
