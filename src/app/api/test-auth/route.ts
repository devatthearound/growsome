import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    console.log('=== 테스트 로그인 API 호출됨 ===');

    // 먼저 실제 데이터베이스에서 사용자 확인
    let testUserId = 1;
    let testUser = {
      email: 'test@example.com',
      username: 'testuser'
    };

    try {
      // 실제 사용자가 있는지 확인
      const existingUser = await prisma.user.findFirst({
        select: {
          id: true,
          email: true,
          username: true
        }
      });

      if (existingUser) {
        console.log('실제 사용자 발견:', existingUser);
        testUserId = existingUser.id;
        testUser = {
          email: existingUser.email,
          username: existingUser.username
        };
      } else {
        console.log('실제 사용자가 없으므로 테스트 사용자 생성 시도...');
        // 테스트 사용자가 없으면 생성
        const newUser = await prisma.user.create({
          data: {
            email: 'test@example.com',
            username: 'testuser',
            status: 'active'
          }
        });
        
        testUserId = newUser.id;
        testUser = {
          email: newUser.email,
          username: newUser.username
        };
        console.log('테스트 사용자 생성됨:', newUser);
      }
    } catch (dbError: any) {
      console.log('DB 오류, 기본값 사용:', dbError.message);
    }

    console.log('사용할 테스트 사용자:', { id: testUserId, ...testUser });

    // JWT 토큰 생성
    const token = jwt.sign(
      { 
        userId: testUserId,
        email: testUser.email,
        username: testUser.username
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('토큰 생성 완료, 쿠키 설정 중...');

    // 응답 생성
    const response = NextResponse.json({
      success: true,
      message: '테스트 로그인 성공',
      user: { id: testUserId, ...testUser }
    });

    // 쿠키 설정
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24시간
      path: '/'
    });

    response.cookies.set('remember-me', 'false', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/'
    });

    console.log('테스트 로그인 완료');

    return response;

  } catch (error: any) {
    console.error('테스트 로그인 오류:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('=== 테스트 로그아웃 API 호출됨 ===');

    const response = NextResponse.json({
      success: true,
      message: '테스트 로그아웃 성공'
    });

    // 쿠키 삭제
    response.cookies.delete('auth-token');
    response.cookies.delete('remember-me');

    console.log('테스트 로그아웃 완료');

    return response;

  } catch (error: any) {
    console.error('테스트 로그아웃 오류:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
