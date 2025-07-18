// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('데이터베이스 연결 테스트 시작...');
    
    // 데이터베이스 연결 테스트
    await prisma.$connect();
    console.log('Prisma 연결 성공');
    
    // 사용자 수 확인
    const userCount = await prisma.user.count();
    console.log('사용자 수:', userCount);
    
    // 모든 사용자 조회 (이메일만)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        status: true
      }
    });
    
    console.log('등록된 사용자들:', users);
    
    return NextResponse.json({
      success: true,
      message: '데이터베이스 연결 성공',
      userCount,
      users
    });
    
  } catch (error: any) {
    console.error('데이터베이스 테스트 오류:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '데이터베이스 연결 실패',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}