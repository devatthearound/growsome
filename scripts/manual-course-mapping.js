// scripts/manual-course-mapping.js
// 비메오 제목과 강의를 수동으로 매핑하는 스크립트

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 수동 매핑 (실제 비메오 제목 확인 후 수정하세요)
const manualMapping = [
  {
    vimeoId: '1026865398',
    vimeoTitle: '실제_비메오_제목_1', // 실제 제목으로 교체
    courseSlug: '1-black-spoon',
    courseTitle: '1강 흑수저'
  },
  {
    vimeoId: '1027515090',
    vimeoTitle: '실제_비메오_제목_2', // 실제 제목으로 교체
    courseSlug: '2-market-analysis', 
    courseTitle: '2강 시장 분석의 핵심'
  },
  {
    vimeoId: '1027151927',
    vimeoTitle: '실제_비메오_제목_3', // 실제 제목으로 교체
    courseSlug: '3-financial-planning',
    courseTitle: '3강 재무 계획 수립'
  },
  {
    vimeoId: '1027182303',
    vimeoTitle: '실제_비메오_제목_4', // 실제 제목으로 교체
    courseSlug: '4-marketing-strategy',
    courseTitle: '4강 마케팅 전략 설계'
  },
  {
    vimeoId: '1029888375',
    vimeoTitle: '실제_비메오_제목_5', // 실제 제목으로 교체
    courseSlug: '5-operations-organization',
    courseTitle: '5강 운영 계획과 조직 구성'
  },
  {
    vimeoId: '1029890528',
    vimeoTitle: '실제_비메오_제목_6', // 실제 제목으로 교체
    courseSlug: '6-risk-management',
    courseTitle: '6강 위험 관리와 대안 시나리오'
  },
  {
    vimeoId: '1029899863',
    vimeoTitle: '실제_비메오_제목_7', // 실제 제목으로 교체
    courseSlug: '7-investment-strategy',
    courseTitle: '7강 투자 유치 전략'
  },
  {
    vimeoId: '1027233606',
    vimeoTitle: '실제_비메오_제목_8', // 실제 제목으로 교체
    courseSlug: '8-final-review',
    courseTitle: '8강 완성된 사업계획서 검토와 최종 정리'
  }
  // 나머지 4개 비메오는 새로운 강의로 생성하거나 필요시 추가
];

async function applyManualMapping() {
  try {
    console.log('🔧 수동 매핑 적용 시작...');
    console.log('='.repeat(60));
    
    let successCount = 0;
    let failCount = 0;
    
    for (const mapping of manualMapping) {
      try {
        console.log(`🎥 ${mapping.courseTitle} 업데이트 중...`);
        
        const vimeoUrl = `https://player.vimeo.com/video/${mapping.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
        
        // 강의 제목을 비메오 제목으로 할지, 기존 제목으로 할지 선택
        const finalTitle = mapping.courseTitle; // 또는 mapping.vimeoTitle
        
        const course = await prisma.course.update({
          where: { slug: mapping.courseSlug },
          data: {
            vimeoId: mapping.vimeoId,
            vimeoUrl: vimeoUrl,
            title: finalTitle
          }
        });
        
        console.log(`✅ 성공: ${course.title} (${mapping.vimeoId})`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ 실패: ${mapping.courseSlug} - ${error.message}`);
        failCount++;
      }
    }
    
    console.log('\n📊 매핑 결과:');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${failCount}개`);
    
    // 결과 확인
    console.log('\n📋 현재 강의 상태:');
    const courses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        title: true,
        slug: true,
        vimeoId: true,
        isPublic: true
      }
    });
    
    courses.forEach((course, index) => {
      const hasVideo = course.vimeoId ? '🎥' : '❌';
      const visibility = course.isPublic ? '🆓' : '🔒';
      console.log(`${hasVideo} ${visibility} ${index + 1}. ${course.title} ${course.vimeoId ? `(${course.vimeoId})` : ''}`);
    });
    
  } catch (error) {
    console.error('❌ 수동 매핑 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function showMappingPreview() {
  console.log('📋 수동 매핑 미리보기:');
  console.log('='.repeat(60));
  
  manualMapping.forEach((mapping, index) => {
    console.log(`${index + 1}. ${mapping.courseTitle}`);
    console.log(`   슬러그: ${mapping.courseSlug}`);
    console.log(`   비메오 ID: ${mapping.vimeoId}`);
    console.log(`   비메오 제목: ${mapping.vimeoTitle}`);
    console.log(`   URL: https://vimeo.com/${mapping.vimeoId}`);
    console.log('');
  });
  
  console.log('⚠️ 주의: 실제 비메오 제목을 확인하고 manualMapping을 수정한 후 실행하세요!');
  console.log('💡 실행: npm run manual-course-mapping apply');
}

async function main() {
  const command = process.argv[2];
  
  if (command === 'apply') {
    await applyManualMapping();
  } else if (command === 'preview') {
    await showMappingPreview();
  } else {
    console.log('🎯 수동 강의 매핑 도구');
    console.log('');
    console.log('사용 가능한 명령:');
    console.log('  preview - 매핑 계획 미리보기');
    console.log('  apply   - 실제 매핑 적용');
    console.log('');
    console.log('💡 순서:');
    console.log('1. npm run fetch-vimeo-titles fetch - 비메오 제목 확인');
    console.log('2. scripts/manual-course-mapping.js 파일에서 실제 제목 수정');
    console.log('3. npm run manual-course-mapping preview - 미리보기');
    console.log('4. npm run manual-course-mapping apply - 적용');
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('✨ 작업 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 작업 실패:', error);
      process.exit(1);
    });
}
