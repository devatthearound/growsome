import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 API 테스트 시작...');
    
    // 1. 기본 응답 테스트
    console.log('✅ API 엔드포인트 접근 성공');
    
    // 2. Prisma 연결 테스트
    console.log('🔗 Prisma 연결 테스트...');
    
    // 3. 데이터베이스 연결 확인
    await prisma.$connect();
    console.log('✅ 데이터베이스 연결 성공');
    
    // 4. 테이블 존재 확인
    try {
      const courseCount = await prisma.course.count();
      console.log(`📊 Course 테이블 - 레코드 수: ${courseCount}`);
      
      const categoryCount = await prisma.courseCategory.count();
      console.log(`📊 CourseCategory 테이블 - 레코드 수: ${categoryCount}`);
      
      return NextResponse.json({
        success: true,
        message: 'API 및 데이터베이스 연결 정상',
        data: {
          courses: courseCount,
          categories: categoryCount,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (tableError) {
      console.error('❌ 테이블 접근 오류:', tableError);
      
      return NextResponse.json({
        success: false,
        error: '테이블 접근 실패',
        details: (tableError as any).message,
        suggestion: '데이터베이스 마이그레이션이 필요합니다. npm run db:push 실행하세요.'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ API 테스트 실패:', error);
    
    return NextResponse.json({
      success: false,
      error: '데이터베이스 연결 실패',
      details: (error as any).message,
      suggestion: '환경변수 DATABASE_URL을 확인하고 데이터베이스가 실행 중인지 확인하세요.'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}