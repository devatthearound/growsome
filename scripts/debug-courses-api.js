// scripts/debug-courses-api.js
// courses API 디버깅 스크립트

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugCoursesAPI() {
  try {
    console.log('🔍 강의 API 디버깅 시작...');
    console.log('='.repeat(50));

    // 1. 데이터베이스 연결 테스트
    console.log('1️⃣ 데이터베이스 연결 테스트...');
    try {
      await prisma.$connect();
      console.log('✅ 데이터베이스 연결 성공');
    } catch (error) {
      console.log('❌ 데이터베이스 연결 실패:', error.message);
      return;
    }

    // 2. 강의 카테고리 확인
    console.log('\n2️⃣ 강의 카테고리 확인...');
    const categories = await prisma.courseCategory.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    console.log(`📁 카테고리 수: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    // 3. 전체 강의 확인
    console.log('\n3️⃣ 전체 강의 확인...');
    const allCourses = await prisma.course.findMany({
      include: {
        category: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    
    console.log(`🎥 전체 강의 수: ${allCourses.length}`);
    allCourses.forEach((course, index) => {
      const status = course.isPublic ? '🆓' : '🔒';
      const visible = course.isVisible ? '👁️' : '🙈';
      console.log(`   ${status} ${visible} ${index + 1}. ${course.title}`);
      console.log(`      - 슬러그: ${course.slug}`);
      console.log(`      - 카테고리: ${course.category?.name || '없음'}`);
      console.log(`      - 비메오 ID: ${course.vimeoId || '없음'}`);
      console.log(`      - 생성일: ${course.createdAt}`);
      console.log('');
    });

    // 4. API에서 반환할 강의 확인 (실제 API 로직과 동일)
    console.log('\n4️⃣ API 반환 강의 확인...');
    const apiCourses = await prisma.course.findMany({
      where: {
        isVisible: true
      },
      include: {
        category: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    console.log(`📡 API가 반환할 강의 수: ${apiCourses.length}`);
    if (apiCourses.length === 0) {
      console.log('⚠️ API가 반환할 강의가 없습니다!');
      console.log('💡 해결 방법: npm run db:seed-comprehensive 실행');
    } else {
      console.log('✅ API 응답 데이터:');
      apiCourses.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.title} (${course.slug})`);
      });
    }

    // 5. 흑수저 강의 특별 확인
    console.log('\n5️⃣ "흑수저" 강의 특별 확인...');
    const blackSpoonCourse = await prisma.course.findFirst({
      where: {
        OR: [
          { title: { contains: '흑수저' } },
          { slug: '1-black-spoon' }
        ]
      },
      include: {
        category: true
      }
    });

    if (blackSpoonCourse) {
      console.log('✅ 흑수저 강의 발견!');
      console.log(`   제목: ${blackSpoonCourse.title}`);
      console.log(`   슬러그: ${blackSpoonCourse.slug}`);
      console.log(`   공개: ${blackSpoonCourse.isPublic ? 'YES' : 'NO'}`);
      console.log(`   보이기: ${blackSpoonCourse.isVisible ? 'YES' : 'NO'}`);
      console.log(`   비메오 ID: ${blackSpoonCourse.vimeoId}`);
      console.log(`   비메오 URL: ${blackSpoonCourse.vimeoUrl}`);
    } else {
      console.log('❌ 흑수저 강의를 찾을 수 없습니다!');
      console.log('💡 해결 방법: npm run db:add-black-spoon 또는 npm run db:seed-comprehensive 실행');
    }

  } catch (error) {
    console.error('❌ 디버깅 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  debugCoursesAPI()
    .then(() => {
      console.log('\n🎯 디버깅 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 디버깅 실패:', error);
      process.exit(1);
    });
}

module.exports = { debugCoursesAPI };
