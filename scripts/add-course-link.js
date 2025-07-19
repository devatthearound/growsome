// scripts/add-course-link.js
// 특정 강의에 비메오 링크 추가하는 스크립트

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addCourseLink(slug, vimeoId, title = null) {
  try {
    console.log(`🎥 강의 링크 추가: ${slug} -> ${vimeoId}`);
    
    // 비메오 URL 생성
    const vimeoUrl = `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
    
    // 강의 업데이트
    const updateData = {
      vimeoId: vimeoId,
      vimeoUrl: vimeoUrl
    };
    
    // 타이틀도 업데이트하려면
    if (title) {
      updateData.title = title;
    }
    
    const course = await prisma.course.update({
      where: { slug: slug },
      data: updateData,
      include: { category: true }
    });
    
    console.log('✅ 강의 링크 추가 완료!');
    console.log(`📋 강의 정보:`);
    console.log(`   - 제목: ${course.title}`);
    console.log(`   - 슬러그: ${course.slug}`);
    console.log(`   - 비메오 ID: ${course.vimeoId}`);
    console.log(`   - 비메오 URL: ${course.vimeoUrl}`);
    console.log(`   - 카테고리: ${course.category.name}`);
    
    return course;
    
  } catch (error) {
    if (error.code === 'P2025') {
      console.error(`❌ 강의를 찾을 수 없습니다: ${slug}`);
      console.log('💡 사용 가능한 강의 목록을 확인하려면: npm run course-utils list');
    } else {
      console.error('❌ 강의 링크 추가 실패:', error.message);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 여러 강의 한번에 추가
async function addMultipleCourseLinks(courseLinks) {
  try {
    console.log('🚀 여러 강의 링크 일괄 추가 시작...');
    
    for (const { slug, vimeoId, title } of courseLinks) {
      try {
        await addCourseLink(slug, vimeoId, title);
        console.log('');
      } catch (error) {
        console.log(`⚠️ ${slug} 추가 실패, 다음 강의로 계속...`);
      }
    }
    
    console.log('🎉 일괄 추가 완료!');
    
  } catch (error) {
    console.error('❌ 일괄 추가 실패:', error);
  }
}

// CLI 사용법
async function main() {
  const command = process.argv[2];
  const slug = process.argv[3];
  const vimeoId = process.argv[4];
  const title = process.argv[5];

  if (command === 'add') {
    if (!slug || !vimeoId) {
      console.log('📚 강의 링크 추가 도구');
      console.log('');
      console.log('사용법:');
      console.log('  npm run add-course-link add <slug> <vimeoId> [title]');
      console.log('');
      console.log('예시:');
      console.log('  npm run add-course-link add 2-market-analysis 1234567890');
      console.log('  npm run add-course-link add 2-market-analysis 1234567890 "2강 시장분석 새제목"');
      console.log('');
      console.log('💡 사용 가능한 강의 슬러그 확인: npm run course-utils list');
      return;
    }
    
    await addCourseLink(slug, vimeoId, title);
    
  } else if (command === 'batch') {
    // 예시: 여러 강의 한번에 추가
    const exampleCourseLinks = [
      { slug: '2-market-analysis', vimeoId: '1027151928', title: '2강 시장 분석의 핵심' },
      { slug: '3-financial-planning', vimeoId: '1027151929', title: '3강 재무 계획 수립' },
      // 더 추가...
    ];
    
    console.log('⚠️ 예시 데이터로 일괄 추가를 시도합니다.');
    console.log('실제 비메오 ID로 수정한 후 사용하세요!');
    // await addMultipleCourseLinks(exampleCourseLinks);
    
  } else {
    console.log('📚 강의 링크 추가 도구');
    console.log('');
    console.log('사용 가능한 명령:');
    console.log('  add <slug> <vimeoId> [title] - 단일 강의 링크 추가');
    console.log('  batch                       - 여러 강의 일괄 추가 (예시)');
    console.log('');
    console.log('💡 먼저 강의 목록 확인: npm run course-utils list');
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

module.exports = { addCourseLink, addMultipleCourseLinks };
