// scripts/debug-and-fix-titles.js
// 현재 상태 확인하고 제목 수정

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugAndFixTitles() {
  try {
    console.log('🔍 현재 강의 상태 확인 중...');
    console.log('='.repeat(60));
    
    // 현재 모든 강의 확인
    const currentCourses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        vimeoId: true,
        sortOrder: true,
        isPublic: true
      }
    });
    
    console.log('📋 현재 강의 목록:');
    currentCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}`);
      console.log(`   ID: ${course.id}, 슬러그: ${course.slug}, 비메오: ${course.vimeoId}`);
      console.log('');
    });
    
    // 실제 비메오 제목 매핑 (정확한 순서로)
    const correctMappings = [
      { oldTitle: '1강 흑수저', newTitle: '#작성팁1. 챗GPT로 사업계획서 작성하기_ 초보자를 위한 가이드', vimeoId: '1027515090' },
      { oldTitle: '1강. 혁신적인 사업계획서 작성법', newTitle: '1강. 흑수저의 실패자금 정부지원금으로 창업의 꿈을 이루세요', vimeoId: '1027151927' },
      { oldTitle: '2강. 시장 분석과 경쟁사 분석', newTitle: '2강. 정부지원 사업 정보는 어디에 있는 걸까?', vimeoId: '1027182303' },
      { oldTitle: '2강 시장 분석의 핵심', newTitle: '2주차1강 합격하는 무적의 사업계획서의 비밀', vimeoId: '1029888375' },
      { oldTitle: '3강 재무 계획 수립', newTitle: '2주차3강읽고 싶게 만드는 사업계획서 글쓰기 원칙', vimeoId: '1029890528' },
      { oldTitle: '3강. 재무 계획 수립하기', newTitle: '2주차5강작성팁 02: 미드저니 인공지능으로 비전 시각화하기', vimeoId: '1029899863' },
      { oldTitle: '4강 마케팅 전략 설계', newTitle: '3강. 선정 확률을 높이는 나만의 정부 지원 사업 골라내기', vimeoId: '1027233606' },
      { oldTitle: '4강. MVP 설계와 검증', newTitle: '3주차1강 심사에 통과하는 팜플렛 전략', vimeoId: '1032201295' }
    ];
    
    console.log('\n🔄 제목 수정 시작...');
    console.log('='.repeat(60));
    
    let updateCount = 0;
    
    for (const mapping of correctMappings) {
      try {
        // 기존 제목으로 강의 찾기
        const course = await prisma.course.findFirst({
          where: { title: mapping.oldTitle }
        });
        
        if (course) {
          // 제목과 비메오 ID 업데이트
          await prisma.course.update({
            where: { id: course.id },
            data: {
              title: mapping.newTitle,
              vimeoId: mapping.vimeoId,
              vimeoUrl: `https://player.vimeo.com/video/${mapping.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`
            }
          });
          
          console.log(`✅ "${mapping.oldTitle}"`);
          console.log(`   → "${mapping.newTitle}"`);
          console.log(`   비메오 ID: ${mapping.vimeoId}`);
          console.log('');
          updateCount++;
        } else {
          console.log(`⚠️ 강의를 찾을 수 없음: "${mapping.oldTitle}"`);
        }
      } catch (error) {
        console.error(`❌ 수정 실패: ${mapping.oldTitle} - ${error.message}`);
      }
    }
    
    console.log(`📊 업데이트 완료: ${updateCount}개 강의`);
    
    // 업데이트된 결과 확인
    console.log('\n📋 업데이트된 강의 목록:');
    console.log('='.repeat(60));
    
    const updatedCourses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        title: true,
        vimeoId: true,
        isPublic: true,
        sortOrder: true
      }
    });
    
    updatedCourses.forEach((course, index) => {
      const status = course.isPublic ? '🆓' : '🔒';
      const hasVideo = course.vimeoId ? '🎥' : '❌';
      console.log(`${status} ${hasVideo} ${index + 1}. ${course.title}`);
    });
    
  } catch (error) {
    console.error('❌ 작업 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  debugAndFixTitles()
    .then(() => {
      console.log('\n✨ 모든 작업 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 작업 실패:', error);
      process.exit(1);
    });
}
