// src/app/api/auth/logout/route.ts - 수정된 버전
import { NextResponse } from 'next/server';
import { getAuthTokens, verifyToken, removeAuthCookies } from '@/lib/auth';

export async function POST(request: Request) {
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
        console.log('로그아웃 처리 중 - 사용자 ID:', userId);
      } catch (error) {
        // 액세스 토큰이 유효하지 않은 경우 리프레시 토큰 시도
        if (refreshToken) {
          try {
            const payload = await verifyToken(refreshToken);
            userId = payload.userId;
            console.log('리프레시 토큰으로 사용자 ID 확인:', userId);
          } catch (refreshError) {
            console.log('두 토큰 모두 유효하지 않음 - 쿠키만 제거');
          }
        }
      }
    }
    
    // 현재는 데이터베이스에 세션 정보를 저장하지 않으므로
    // 토큰만 무효화 (쿠키 제거)
    
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
  }
}