// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { getAuthTokens } from '@/lib/auth';

export async function GET() {
  try {
    const { accessToken, refreshToken } = await getAuthTokens();
    
    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    // 리다이렉트 URL 생성
    const redirectUrl = `coupas-auth://login?coupas_access_token=${accessToken}&coupas_refresh_token=${refreshToken}`;
    
    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error('리다이렉트 처리 중 오류:', error);
    return NextResponse.json(
      { error: '리다이렉트 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}