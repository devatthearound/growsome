// scripts/batch-add-course-links.js
// 여러 강의 링크를 한번에 추가하는 스크립트

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 제공받은 비메오 링크들을 강의 순서에 맞게 매핑
const courseLinksMapping = [
  { slug: '1-black-spoon', vimeoId: '1026865398', title: '1강 흑수저' },
  { slug: '2-market-analysis', vimeoId: '1027515090', title: '2강 시장 분석의 핵심' },
  { slug: '3-financial-planning', vimeoId: '1027151927', title: '3강 재무 계획 수립' },
  { slug: '4-marketing-strategy', vimeoId: '1027182303', title: '4강 마케팅 전략 설계' },
  { slug: '5-operations-organization', vimeoId: '1029888375', title: '5강 운영 계획과 조직 구성' },
  { slug: '6-risk-management', vimeoId: '1029890528', title: '6강 위험 관리와 대안 시나리오' },
  { slug: '7-investment-strategy', vimeoId: '1029899863', title: '7강 투자 유치 전략' },
  { slug: '8-final-review', vimeoId: '1027233606', title: '8강 완성된 사업계획서 검토와 최종 정리' },
  // 추가 강의들 (순서는 조정 가능)
  { slug: 'bonus-1', vimeoId: '1032311272', title: '보너스 1강', needsCreate: true },
  { slug: 'bonus-2', vimeoId: '1027285856', title: '보너스 2강', needsCreate: true },
  { slug: 'bonus-3', vimeoId: '1029888986', title: '보너스 3강', needsCreate: true },
  { slug: 'bonus-4', vimeoId: '1029894587', title: '보너스 4강', needsCreate: true },
];

async function addCourseLink(slug, vimeoId, title) {
  try {
    // 비메오 URL 생성 (해시 부분 제거)
    const cleanVimeoId = vimeoId.split('/')[0]; // /94681a24cb 같은 부분 제거
    const vimeoUrl = `https://player.vimeo.com/video/${cleanVimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
    
    const course = await prisma.course.update({
      where: { slug: slug },
      data: {
        vimeoId: cleanVimeoId,
        vimeoUrl: vimeoUrl,
        title: title
      },
      include: { category: true }
    });
    
    console.log(`✅ ${course.title} - 비메오 ID: ${cleanVimeoId}`);
    return course;
    
  } catch (error) {
    if (error.code === 'P2025') {
      console.log(`⚠️ 강의를 찾을 수 없음: ${slug} (새로 생성 필요)`);
    } else {
      console.error(`❌ ${slug} 업데이트 실패:`, error.message);
    }
    return null;
  }
}

async function batchAddCourseLinks() {
  try {
    console.log('🚀 전체 강의 링크 일괄 추가 시작...');
    console.log('='.repeat(60));
    
    let successCount = 0;
    let failCount = 0;
    
    for (const { slug, vimeoId, title, needsCreate } of courseLinksMapping) {
      if (needsCreate) {
        console.log(`⏭️ ${title} - 새로 생성 필요 (건너뜀)`);
        continue;
      }
      
      const result = await addCourseLink(slug, vimeoId, title);
      if (result) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    console.log('');
    console.log('📊 작업 완료 요약:');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${failCount}개`);
    
    // 모든 강의 상태 확인
    console.log('');
    console.log('📋 현재 강의 링크 상태:');
    const allCourses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        title: true,
        slug: true,
        vimeoId: true,
        isPublic: true
      }
    });
    
    allCourses.forEach((course, index) => {
      const status = course.vimeoId ? '🎥' : '❌';
      const visibility = course.isPublic ? '🆓' : '🔒';
      console.log(`${status} ${visibility} ${index + 1}. ${course.title} ${course.vimeoId ? `(ID: ${course.vimeoId})` : '(링크 없음)'}`);
    });
    
    console.log('');
    console.log('💡 다음 단계:');
    console.log('1. npm run course-utils toggle-public <slug> true - 강의 공개');
    console.log('2. http://localhost:3000/courses - 강의 페이지 확인');
    
  } catch (error) {
    console.error('❌ 일괄 추가 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// CLI 사용법
async function main() {
  const command = process.argv[2];

  if (command === 'run') {
    await batchAddCourseLinks();
  } else if (command === 'preview') {
    console.log('📋 추가할 강의 링크 미리보기:');
    console.log('');
    courseLinksMapping.forEach((course, index) => {
      const status = course.needsCreate ? '🆕' : '🔄';
      console.log(`${status} ${index + 1}. ${course.title}`);
      console.log(`   슬러그: ${course.slug}`);
      console.log(`   비메오 ID: ${course.vimeoId}`);
      console.log('');
    });
    console.log('💡 실제 추가하려면: npm run batch-course-links run');
  } else {
    console.log('📚 강의 링크 일괄 추가 도구');
    console.log('');
    console.log('사용 가능한 명령:');
    console.log('  preview - 추가할 링크 미리보기');
    console.log('  run     - 실제 링크 추가 실행');
    console.log('');
    console.log('💡 먼저 미리보기로 확인 후 실행하세요!');
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

module.exports = { batchAddCourseLinks };
