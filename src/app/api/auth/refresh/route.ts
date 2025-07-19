import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    // 현재 토큰 가져오기
    const currentToken = request.cookies.get('auth-token')?.value;
    const rememberMe = request.cookies.get('remember-me')?.value === 'true';

    if (!currentToken) {
      return NextResponse.json(
        { success: false, message: '토큰이 없습니다.' },
        { status: 401 }
      );
    }

    // 토큰 검증 (만료된 토큰도 허용하여 갱신 시도)
    let decoded;
    try {
      decoded = jwt.verify(currentToken, JWT_SECRET) as any;
    } catch (jwtError: any) {
      // 토큰이 만료된 경우에만 갱신 시도
      if (jwtError.name === 'TokenExpiredError') {
        try {
          decoded = jwt.decode(currentToken) as any;
        } catch (decodeError) {
          return NextResponse.json(
            { success: false, message: '토큰을 디코드할 수 없습니다.' },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json(
          { success: false, message: '유효하지 않은 토큰입니다.' },
          { status: 401 }
        );
      }
    }

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, message: '토큰에서 사용자 정보를 찾을 수 없습니다.' },
        { status: 401 }
      );
    }

    // 사용자 존재 확인
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        status: true,
      }
    });

    if (!user || user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: '사용자를 찾을 수 없거나 비활성 상태입니다.' },
        { status: 401 }
      );
    }

    // 새 토큰 생성
    const tokenExpiry = rememberMe ? '30d' : '24h';
    const newToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    console.log('토큰 갱신 성공:', { userId: user.id, email: user.email });

    // 응답 생성
    const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30일 또는 1일
    const response = NextResponse.json({
      success: true,
      message: '토큰 갱신 성공'
    });

    // 새 토큰을 쿠키로 설정
    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('토큰 갱신 중 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    // Prisma 싱글톤을 사용하므로 연결 해제하지 않음
  }
}
