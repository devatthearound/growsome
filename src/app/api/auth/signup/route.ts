// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateToken, setAuthCookies } from '@/lib/auth';
import { isAdminUser } from '@/utils/admin';

const prisma = new PrismaClient();

// 입력값 검증 함수
function validateSignupData(data: any) {
  const errors: string[] = [];

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('올바른 이메일을 입력해주세요.');
  }

  if (!data.password || data.password.length < 6) {
    errors.push('비밀번호는 6자 이상이어야 합니다.');
  }

  if (!data.name || data.name.trim().length < 2) {
    errors.push('이름은 2자 이상이어야 합니다.');
  }

  if (!data.phone || !/^[0-9-+\s()]+$/.test(data.phone)) {
    errors.push('올바른 전화번호를 입력해주세요.');
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('회원가입 시도:', { email: data.email, name: data.name });

    // 입력값 검증
    const validationErrors = validateSignupData(data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: '입력값이 올바르지 않습니다.',
          validationErrors 
        },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: '이미 사용 중인 이메일입니다.' 
        },
        { status: 409 }
      );
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        username: data.name.trim(),
        phoneNumber: data.phone.trim(),
        companyName: data.company?.trim() || null,
        position: data.level?.trim() || null,
        status: 'active'
      }
    });

    console.log('회원가입 성공:', { userId: user.id, email: user.email });

    // 관리자 권한 확인
    const isAdmin = isAdminUser(user.email);

    // JWT 토큰 생성
    const accessToken = await generateToken({
      userId: user.id.toString(),
      email: user.email
    }, '24h');

    const refreshToken = await generateToken({
      userId: user.id.toString(),
      email: user.email
    }, '30d');

    // 사용자 데이터
    const userData = {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      companyName: user.companyName,
      position: user.position,
      phoneNumber: user.phoneNumber,
      status: user.status,
      isAdmin,
      canWriteContent: true
    };

    // 성공 응답
    const response = NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: userData
    });

    // 쿠키 설정
    return setAuthCookies(accessToken, refreshToken, response);

  } catch (error: any) {
    console.error('회원가입 에러:', error);
    
    // Prisma 에러 처리
    if (error.code === 'P2002') { // Unique constraint 위반
      return NextResponse.json(
        { 
          success: false,
          error: '이미 사용 중인 이메일입니다.' 
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: '회원가입 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}