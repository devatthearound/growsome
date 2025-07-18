import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('=== 데이터베이스 연결 테스트 ===');
    
    // 1. 기본 환경 확인
    const environment = {
      NODE_ENV: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
      databaseUrl: process.env.DATABASE_URL ? 'CONFIGURED' : 'NOT_CONFIGURED'
    };
    
    console.log('환경 설정:', environment);
    
    // 2. 데이터베이스 연결 테스트
    console.log('데이터베이스 연결 시도...');
    await prisma.$connect();
    console.log('✅ 데이터베이스 연결 성공');
    
    // 3. 사용자 테이블 확인
    const userCount = await prisma.user.count();
    console.log('사용자 수:', userCount);
    
    // 4. 처음 5명의 사용자 조회
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        email: true,
        username: true,
        companyName: true,
        position: true,
        status: true,
        createdAt: true
      }
    });
    
    console.log('사용자 목록:', users);
    
    const result = {
      success: true,
      message: '데이터베이스 연결 성공',
      timestamp: new Date().toISOString(),
      environment,
      database: {
        connected: true,
        userCount,
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          username: user.username,
          company: user.companyName,
          position: user.position,
          status: user.status,
          createdAt: user.createdAt
        }))
      }
    };
    
    console.log('✅ 디버깅 완료');
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    return NextResponse.json(
      {
        success: false,
        error: '데이터베이스 연결 실패',
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasJwtSecret: !!process.env.JWT_SECRET
        }
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}