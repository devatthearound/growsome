import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    console.log('=== /api/auth/check 호출됨 ===');
    
    // 쿠키에서 토큰 가져오기
    const token = request.cookies.get('auth-token')?.value;
    const allCookies = request.cookies.getAll();
    
    console.log('요청 쿠키들:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));

    if (!token) {
      console.log('auth-token 쿠키가 없습니다.');
      return NextResponse.json(
        { 
          isLoggedIn: false, 
          message: '토큰이 없습니다.' 
        },
        { status: 401 }
      );
    }
    
    console.log('토큰 길이:', token.length);

    // 토큰 검증
    let decoded;
    try {
      console.log('JWT 토큰 검증 중...');
      decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('토큰 검증 성공:', { userId: decoded.userId, email: decoded.email });
    } catch (jwtError: any) {
      console.log('토큰 검증 실패:', {
        name: jwtError.name,
        message: jwtError.message
      });
      
      // 만료된 토큰인 경우 쿠키 삭제
      const response = NextResponse.json(
        { 
          isLoggedIn: false, 
          message: '토큰이 유효하지 않습니다.' 
        },
        { status: 401 }
      );
      
      response.cookies.delete('auth-token');
      response.cookies.delete('remember-me');
      
      return response;
    }

    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        companyName: true,
        position: true,
        phoneNumber: true,
        avatar: true,
        status: true,
      }
    });

    if (!user) {
      console.log('사용자를 찾을 수 없음:', decoded.userId);
      
      const response = NextResponse.json(
        { 
          isLoggedIn: false, 
          message: '사용자를 찾을 수 없습니다.' 
        },
        { status: 401 }
      );
      
      response.cookies.delete('auth-token');
      response.cookies.delete('remember-me');
      
      return response;
    }

    // 계정 상태 확인
    if (user.status !== 'active') {
      console.log('비활성화된 계정:', user.email);
      
      const response = NextResponse.json(
        { 
          isLoggedIn: false, 
          message: '비활성화된 계정입니다.' 
        },
        { status: 401 }
      );
      
      response.cookies.delete('auth-token');
      response.cookies.delete('remember-me');
      
      return response;
    }

    // 응답할 사용자 정보
    const userResponse = {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      slug: createSlugFromUsername(user.username),
      company_name: user.companyName,
      position: user.position,
      phone_number: user.phoneNumber,
      profileImage: user.avatar,
      role: 'user',
      canWriteContent: true
    };

    console.log('인증 체크 성공:', { userId: user.id, email: user.email });

    return NextResponse.json({
      isLoggedIn: true,
      user: userResponse,
      message: '인증 성공'
    });

  } catch (error) {
    console.error('인증 체크 중 오류:', error);
    
    const response = NextResponse.json(
      { 
        isLoggedIn: false, 
        message: '서버 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
    
    return response;
  } finally {
    // Prisma 싱글톤을 사용하므로 연결 해제하지 않음
  }
}

// 유틸리티 함수: 사용자명에서 슬러그 생성
function createSlugFromUsername(username: string): string {
  return username
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
