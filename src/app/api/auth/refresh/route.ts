// app/api/auth/refresh/route.ts
import { NextResponse } from 'next/server';
import { refreshTokens, getAuthTokens, setAuthCookies } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 쿠키에서 리프레시 토큰 가져오기
    const { refreshToken } = await getAuthTokens();

    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false,
          error: '리프레시 토큰이 없습니다.' 
        },
        { status: 401 }
      );
    }

    // 중앙화된 토큰 갱신 함수 사용
    const refreshResult = await refreshTokens(refreshToken);

    if (!refreshResult) {
      return NextResponse.json(
        { 
          success: false,
          error: '토큰 갱신에 실패했습니다. 다시 로그인해주세요.' 
        },
        { status: 401 }
      );
    }

    // 성공 응답 생성
    const response = NextResponse.json({
      success: true,
      message: '토큰이 성공적으로 갱신되었습니다.'
    });

    // 새로운 토큰을 쿠키에 설정
    return setAuthCookies(
      refreshResult.accessToken, 
      refreshResult.refreshToken, 
      response
    );

  } catch (error: any) {
    console.error('토큰 갱신 에러:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '토큰 갱신 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
