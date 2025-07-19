// scripts/complete-course-setup.js
// 모든 강의를 올바른 순서와 제목으로 완성

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 완전한 강의 목록 (순서대로)
const completeCourseList = [
  {
    title: '#작성팁1. 챗GPT로 사업계획서 작성하기_ 초보자를 위한 가이드',
    vimeoId: '1027515090',
    slug: 'chatgpt-business-plan-guide',
    sortOrder: 1,
    isPublic: true, // 첫 번째만 공개
    duration: 1800
  },
  {
    title: '1강. 흑수저의 실패자금 정부지원금으로 창업의 꿈을 이루세요',
    vimeoId: '1027151927',
    slug: 'government-funding-startup',
    sortOrder: 2,
    isPublic: false,
    duration: 2100
  },
  {
    title: '2강. 정부지원 사업 정보는 어디에 있는 걸까?',
    vimeoId: '1027182303',
    slug: 'government-support-info',
    sortOrder: 3,
    isPublic: false,
    duration: 1800
  },
  {
    title: '2주차1강 합격하는 무적의 사업계획서의 비밀',
    vimeoId: '1029888375',
    slug: 'winning-business-plan-secret',
    sortOrder: 4,
    isPublic: false,
    duration: 2400
  },
  {
    title: '2주차3강읽고 싶게 만드는 사업계획서 글쓰기 원칙',
    vimeoId: '1029890528',
    slug: 'engaging-writing-principles',
    sortOrder: 5,
    isPublic: false,
    duration: 2100
  },
  {
    title: '2주차5강작성팁 02: 미드저니 인공지능으로 비전 시각화하기',
    vimeoId: '1029899863',
    slug: 'midjourney-vision-visualization',
    sortOrder: 6,
    isPublic: false,
    duration: 1500
  },
  {
    title: '3강. 선정 확률을 높이는 나만의 정부 지원 사업 골라내기',
    vimeoId: '1027233606',
    slug: 'government-program-selection',
    sortOrder: 7,
    isPublic: false,
    duration: 2700
  },
  {
    title: '3주차1강 심사에 통과하는 팜플렛 전략',
    vimeoId: '1032201295',
    slug: 'pamphlet-strategy',
    sortOrder: 8,
    isPublic: false,
    duration: 2400
  },
  {
    title: '3주차2강시장 규모 분석 방법, 문제의 크기와 돈그릇의 관계',
    vimeoId: '1032219649',
    slug: 'market-size-analysis',
    sortOrder: 9,
    isPublic: false,
    duration: 2100
  },
  {
    title: '3주차3강경쟁자 분석 방법',
    vimeoId: '1032240366',
    slug: 'competitor-analysis',
    sortOrder: 10,
    isPublic: false,
    duration: 1800
  },
  {
    title: '3주차4강수익 창출 모델 구축',
    vimeoId: '1032252001',
    slug: 'revenue-model-building',
    sortOrder: 11,
    isPublic: false,
    duration: 2400
  },
  {
    title: '3주차5강작성팁 03: make.com과 Zapier로 고객 마케팅 자동화하기',
    vimeoId: '1032311272',
    slug: 'marketing-automation-tools',
    sortOrder: 12,
    isPublic: false,
    duration: 1800
  },
  {
    title: "4강. 무적의 사업계획서 핵심구조 'PSST' 짜기로 1분 스피치도 가능해요",
    vimeoId: '1027285856',
    slug: 'psst-framework-speech',
    sortOrder: 13,
    isPublic: false,
    duration: 3000
  },
  {
    title: "'내가 사겠습니다!' 심사위원도 소비자로 만드는 아이템명 작성 방법",
    vimeoId: '1029888986',
    slug: 'compelling-product-naming',
    sortOrder: 14,
    isPublic: false,
    duration: 2100
  },
  {
    title: '우리 타겟 고객 정의하기: 누구를 위한 제품인가?',
    vimeoId: '1029894587',
    slug: 'target-customer-definition',
    sortOrder: 15,
    isPublic: false,
    duration: 1800
  }
];

async function setupCompleteCourses() {
  try {
    console.log('🚀 완전한 강의 목록 설정 시작...');
    console.log('='.repeat(70));
    
    // 카테고리 확인/생성
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
    
    console.log(`✅ 카테고리 확인: ${category.name}`);
    
    // 기존 강의들 모두 삭제하고 새로 시작
    console.log('\n🗑️ 기존 강의 정리 중...');
    await prisma.userCourseProgress.deleteMany({}); // 진도 데이터 먼저 삭제
    await prisma.course.deleteMany({}); // 모든 강의 삭제
    
    console.log('\n📝 새로운 강의 생성 중...');
    let createdCount = 0;
    
    for (const courseData of completeCourseList) {
      try {
        const cleanVimeoId = courseData.vimeoId.split('/')[0]; // 해시 제거
        const vimeoUrl = `https://player.vimeo.com/video/${cleanVimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
        
        const course = await prisma.course.create({
          data: {
            title: courseData.title,
            slug: courseData.slug,
            description: `${courseData.title}에 대한 상세한 내용을 다룹니다.`,
            shortDescription: courseData.title.length > 50 ? courseData.title.substring(0, 50) + '...' : courseData.title,
            vimeoId: cleanVimeoId,
            vimeoUrl: vimeoUrl,
            duration: courseData.duration,
            categoryId: category.id,
            level: 'beginner',
            tags: ['정부지원사업', '사업계획서', '창업', 'AI'],
            isPublic: courseData.isPublic,
            isPremium: true,
            isVisible: true,
            sortOrder: courseData.sortOrder,
            publishedAt: courseData.isPublic ? new Date() : null
          }
        });
        
        const status = courseData.isPublic ? '🆓' : '🔒';
        console.log(`${status} ${courseData.sortOrder}. ${course.title}`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ 생성 실패: ${courseData.title} - ${error.message}`);
      }
    }
    
    console.log(`\n📊 생성 완료: ${createdCount}개 강의`);
    
    // 최종 결과 확인
    console.log('\n📋 최종 강의 목록:');
    console.log('='.repeat(70));
    
    const finalCourses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        title: true,
        vimeoId: true,
        isPublic: true,
        sortOrder: true
      }
    });
    
    finalCourses.forEach((course) => {
      const status = course.isPublic ? '🆓' : '🔒';
      console.log(`${status} 🎥 ${course.sortOrder}. ${course.title}`);
    });
    
    const publicCount = finalCourses.filter(c => c.isPublic).length;
    const privateCount = finalCourses.length - publicCount;
    
    console.log(`\n🎯 요약:`);
    console.log(`📚 전체 강의: ${finalCourses.length}개`);
    console.log(`🆓 공개 강의: ${publicCount}개 (첫 번째 강의만)`);
    console.log(`🔒 비공개 강의: ${privateCount}개`);
    console.log(`\n💡 http://localhost:3000/courses 에서 확인하세요!`);
    
  } catch (error) {
    console.error('❌ 설정 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const command = process.argv[2];
  
  if (command === 'setup') {
    await setupCompleteCourses();
  } else {
    console.log('🎯 완전한 강의 설정 도구');
    console.log('');
    console.log('사용법:');
    console.log('  npm run complete-setup setup - 모든 강의를 올바른 순서로 설정');
    console.log('');
    console.log('⚠️ 주의: 기존 강의 데이터가 모두 삭제되고 새로 생성됩니다!');
    console.log('💡 실행: npm run complete-setup setup');
  }
}

if (require.main === module) {
  main()
    .then(() => {
      console.log('✨ 모든 작업 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 작업 실패:', error);
      process.exit(1);
    });
}
