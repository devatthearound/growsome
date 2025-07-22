// lib/auth-api.ts - API 자동화용 별도 인증 함수
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface ApiTokenPayload {
  userId: string; 
  email: string;
  role?: string;
  permissions?: string[];
}

// API 자동화용 토큰 검증 함수
export async function verifyApiToken(token: string): Promise<ApiTokenPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as ApiTokenPayload);
      }
    });
  });
}

// API 자동화용 인증 가드 (Authorization 헤더 지원)
export async function withApiAuth<T>(
  request: Request,
  handler: (request: Request, user: ApiTokenPayload) => Promise<T>
): Promise<T | NextResponse> {
  try {
    console.log('🔐 withApiAuth 시작');
    
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization');
    console.log('📥 Authorization 헤더:', authHeader ? 'Bearer [토큰]' : '없음');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Bearer 토큰이 없음');
      return NextResponse.json(
        { 
          success: false,
          isLoggedIn: false, 
          error: '인증 토큰이 필요합니다.' 
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // 'Bearer ' 제거
    console.log('🎫 토큰 길이:', token.length);
    console.log('🎫 토큰 앞부분:', token.substring(0, 50) + '...');

    // JWT 토큰 검증
    try {
      const payload = await verifyApiToken(token);
      console.log('✅ 토큰 검증 성공');
      console.log('👤 API 사용자 정보:', payload);

      // API 자동화 권한 체크 (선택사항)
      if (payload.role === 'blog_automation' && payload.permissions?.includes('create_content')) {
        console.log('🔑 블로그 자동화 권한 확인됨');
      }

      // 원래 핸들러 호출
      return await handler(request, payload);

    } catch (tokenError: any) {
      console.error('❌ 토큰 검증 실패:', tokenError.message);
      return NextResponse.json(
        { 
          success: false,
          isLoggedIn: false,
          error: '유효하지 않은 인증 토큰입니다.',
          details: process.env.NODE_ENV === 'development' ? tokenError.message : undefined
        },
        { status: 401 }
      );
    }

  } catch (error: any) {
    console.error('❌ API 인증 오류:', error);
    return NextResponse.json(
      { 
        success: false,
        isLoggedIn: false,
        error: '인증 처리 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
