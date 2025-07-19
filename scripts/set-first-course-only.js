// scripts/set-first-course-only.js
// 첫 번째 강의(OT)만 공개하고 나머지는 비공개로 설정

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setFirstCourseOnly() {
  try {
    console.log('🔒 첫 번째 강의만 공개로 설정 중...');
    console.log('='.repeat(50));
    
    // 모든 강의를 순서대로 가져오기
    const allCourses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        sortOrder: true,
        isPublic: true
      }
    });
    
    if (allCourses.length === 0) {
      console.log('❌ 강의가 없습니다. 먼저 강의를 생성하세요.');
      return;
    }
    
    // 첫 번째 강의는 공개, 나머지는 비공개
    for (let i = 0; i < allCourses.length; i++) {
      const course = allCourses[i];
      const shouldBePublic = i === 0; // 첫 번째만 공개
      
      try {
        await prisma.course.update({
          where: { id: course.id },
          data: {
            isPublic: shouldBePublic,
            publishedAt: shouldBePublic ? new Date() : null
          }
        });
        
        const status = shouldBePublic ? '🆓 공개' : '🔒 비공개';
        console.log(`${status} ${i + 1}. ${course.title}`);
        
      } catch (error) {
        console.error(`❌ ${course.title} 업데이트 실패:`, error.message);
      }
    }
    
    console.log('\n📊 최종 결과:');
    console.log(`🆓 공개 강의: 1개 (${allCourses[0]?.title})`);
    console.log(`🔒 비공개 강의: ${allCourses.length - 1}개`);
    
    console.log('\n💡 이제 첫 번째 강의(OT)만 접근 가능합니다!');
    
  } catch (error) {
    console.error('❌ 설정 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function showCurrentStatus() {
  try {
    console.log('📋 현재 강의 공개 상태:');
    console.log('='.repeat(60));
    
    const courses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        title: true,
        slug: true,
        isPublic: true,
        vimeoId: true
      }
    });
    
    courses.forEach((course, index) => {
      const status = course.isPublic ? '🆓' : '🔒';
      const hasVideo = course.vimeoId ? '🎥' : '❌';
      console.log(`${status} ${hasVideo} ${index + 1}. ${course.title}`);
    });
    
    const publicCount = courses.filter(c => c.isPublic).length;
    const privateCount = courses.length - publicCount;
    
    console.log('');
    console.log(`📊 요약: 공개 ${publicCount}개, 비공개 ${privateCount}개`);
    
  } catch (error) {
    console.error('❌ 상태 확인 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const command = process.argv[2];
  
  if (command === 'set') {
    await setFirstCourseOnly();
  } else if (command === 'status') {
    await showCurrentStatus();
  } else {
    console.log('🔒 강의 공개 설정 도구');
    console.log('');
    console.log('사용 가능한 명령:');
    console.log('  set    - 첫 번째 강의만 공개, 나머지 비공개');
    console.log('  status - 현재 공개 상태 확인');
    console.log('');
    console.log('💡 권장: npm run set-first-only set');
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
