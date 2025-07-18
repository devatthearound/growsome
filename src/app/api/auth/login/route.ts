import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    console.log('로그인 API 호출됨');
    
    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    console.log('로그인 시도:', { email, rememberMe });

    // 입력 유효성 검사
    if (!email || !password) {
      console.log('입력 유효성 검사 실패');
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    console.log('데이터베이스에서 사용자 조회 중...');
    
    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        companyName: true,
        position: true,
        phoneNumber: true,
        avatar: true,
        status: true,
      }
    });

    console.log('사용자 조회 결과:', user ? '사용자 찾음' : '사용자 없음');

    if (!user) {
      console.log('사용자를 찾을 수 없음:', email);
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 계정 상태 확인
    if (user.status !== 'active') {
      console.log('비활성화된 계정:', email);
      return NextResponse.json(
        { error: '비활성화된 계정입니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 확인
    console.log('비밀번호 확인 중...');
    let isValidPassword = false;
    
    if (user.password) {
      // 평문 비밀번호 비교
      isValidPassword = password === user.password;
      console.log('비밀번호 검증 결과:', isValidPassword);
    } else {
      console.log('사용자에게 비밀번호가 설정되어 있지 않음');
    }

    if (!isValidPassword) {
      console.log('비밀번호 불일치:', email);
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    console.log('JWT 토큰 생성 중...');
    
    // JWT 토큰 생성
    const tokenExpiry = rememberMe ? '30d' : '24h';
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    console.log('JWT 토큰 생성 완료');

    // 응답할 사용자 정보 (비밀번호 제외)
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

    console.log('로그인 성공:', { userId: user.id, email: user.email });

    // 쿠키 설정
    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30일 또는 1일
    const response = NextResponse.json({
      success: true,
      message: '로그인 성공',
      user: userResponse,
      redirectUrl: body.callbackUrl || '/'
    });

    // JWT 토큰을 HttpOnly 쿠키로 설정
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/'
    });

    // 로그인 상태 유지 여부를 별도 쿠키로 저장
    response.cookies.set('remember-me', rememberMe.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/'
    });

    console.log('로그인 응답 전송 완료');
    return response;

  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다: ' + (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
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
