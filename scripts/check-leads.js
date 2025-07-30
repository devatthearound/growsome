const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLeads() {
  try {
    console.log('🔍 리드 데이터 확인 중...\n');
    
    // 전체 리드 수 확인
    const totalLeads = await prisma.surveyResponse.count();
    console.log(`📊 전체 리드 수: ${totalLeads}개`);
    
    // 최근 10개 리드 확인
    const recentLeads = await prisma.surveyResponse.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        company: true,
        businessStage: true,
        status: true,
        createdAt: true,
        notes: true
      }
    });
    
    console.log('\n📋 최근 10개 리드:');
    recentLeads.forEach((lead, index) => {
      console.log(`\n${index + 1}. ID: ${lead.id}`);
      console.log(`   이름: ${lead.name}`);
      console.log(`   전화번호: ${lead.phone}`);
      console.log(`   이메일: ${lead.email}`);
      console.log(`   회사: ${lead.company || '없음'}`);
      console.log(`   상태: ${lead.status}`);
      console.log(`   등록일: ${lead.createdAt.toLocaleString('ko-KR')}`);
      console.log(`   메모: ${lead.notes}`);
    });
    
    // 소스별 통계
    const sourceStats = await prisma.surveyResponse.groupBy({
      by: ['businessStage'],
      _count: {
        id: true
      }
    });
    
    console.log('\n📈 소스별 통계:');
    sourceStats.forEach(stat => {
      console.log(`   ${stat.businessStage}: ${stat._count.id}개`);
    });
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLeads(); 