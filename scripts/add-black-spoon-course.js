// scripts/add-black-spoon-course.js
// 데이터베이스에 "흑수저" 강의를 추가하는 스크립트

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addBlackSpoonCourse() {
  try {
    console.log('🚀 강의 추가를 시작합니다...');

    // 1. 카테고리 확인/생성
    const category = await prisma.courseCategory.upsert({
      where: { slug: 'ai-business-plan' },
      update: {},
      create: {
        name: 'AI 사업계획서 작성',
        slug: 'ai-business-plan',
        description: 'AI를 활용한 사업계획서 작성 완성 솔루션',
        color: '#3B82F6',
        sortOrder: 1,
        isVisible: true
      }
    });

    console.log('✅ 카테고리 준비 완료:', category.name);

    // 2. 강의 추가
    const course = await prisma.course.create({
      data: {
        title: '1강 흑수저',
        slug: '1-black-spoon',
        description: 'AI 사업계획서 작성의 첫 번째 강의입니다. 기본 개념과 시작 방법을 배웁니다. 성공하는 사업계획서의 핵심 요소들을 알아보고, AI를 활용한 효율적인 작성 방법을 익힙니다.',
        shortDescription: '사업계획서 작성의 기본 개념과 시작점을 다루는 첫 번째 강의',
        vimeoId: '1027151927',
        vimeoUrl: 'https://player.vimeo.com/video/1027151927?badge=0&autopause=0&player_id=0&app_id=58479',
        thumbnailUrl: null,
        duration: 1800, // 30분 (실제 시간으로 업데이트하세요)
        categoryId: category.id,
        level: 'beginner',
        tags: ['AI', '사업계획서', '기본개념', '시작', '흑수저'],
        isPublic: true, // 미리보기 가능
        isPremium: true,
        isVisible: true,
        sortOrder: 1,
        publishedAt: new Date()
      }
    });

    console.log('✅ 강의 추가 완료!');
    console.log('📋 강의 정보:');
    console.log(`   - ID: ${course.id}`);
    console.log(`   - 제목: ${course.title}`);
    console.log(`   - 슬러그: ${course.slug}`);
    console.log(`   - 비메오 ID: ${course.vimeoId}`);
    console.log(`   - 공개 여부: ${course.isPublic ? '공개' : '비공개'}`);
    console.log(`   - 생성일: ${course.createdAt}`);

    return course;
  } catch (error) {
    console.error('❌ 강의 추가 중 오류 발생:', error);
    
    if (error.code === 'P2002') {
      console.log('💡 이미 같은 슬러그의 강의가 존재합니다. 다른 슬러그를 사용해주세요.');
    }
    
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
if (require.main === module) {
  addBlackSpoonCourse()
    .then(() => {
      console.log('🎉 스크립트 실행 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

module.exports = { addBlackSpoonCourse };
