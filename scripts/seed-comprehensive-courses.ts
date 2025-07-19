// scripts/seed-comprehensive-courses.ts
// AI 사업계획서 작성 완성 솔루션 전체 강의 시리즈 시드

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 강의 카테고리 데이터
const courseCategories = [
  {
    name: 'AI 사업계획서 작성',
    slug: 'ai-business-plan',
    description: 'AI를 활용한 사업계획서 작성 완성 솔루션',
    color: '#3B82F6',
    sortOrder: 1,
    isVisible: true,
  },
  {
    name: '고급 전략 수립',
    slug: 'advanced-strategy',
    description: '심화 사업 전략 수립 과정',
    color: '#8B5CF6',
    sortOrder: 2,
    isVisible: true,
  }
];

// 전체 강의 데이터
const coursesData = [
  // 기본 강의 시리즈
  {
    title: '1강 흑수저',
    slug: '1-black-spoon',
    description: 'AI 사업계획서 작성의 첫 번째 강의입니다. 기본 개념과 시작 방법을 배웁니다. 성공하는 사업계획서의 핵심 요소들을 알아보고, AI를 활용한 효율적인 작성 방법을 익힙니다.',
    shortDescription: '사업계획서 작성의 기본 개념과 시작점을 다루는 첫 번째 강의',
    vimeoId: '1027151927',
    vimeoUrl: 'https://player.vimeo.com/video/1027151927?badge=0&autopause=0&player_id=0&app_id=58479',
    duration: 1800, // 30분
    categorySlug: 'ai-business-plan',
    level: 'beginner',
    tags: ['AI', '사업계획서', '기본개념', '시작', '흑수저'],
    isPublic: true,
    isPremium: true,
    sortOrder: 1,
  },
  {
    title: '2강 시장 분석의 핵심',
    slug: '2-market-analysis',
    description: '효과적인 시장 분석 방법론을 배웁니다. AI 도구를 활용한 시장 조사와 경쟁사 분석, 그리고 타겟 고객 설정 방법을 학습합니다.',
    shortDescription: 'AI를 활용한 시장 분석과 경쟁사 분석 방법',
    vimeoId: 'placeholder-2', // 실제 비메오 ID로 교체
    vimeoUrl: 'https://player.vimeo.com/video/placeholder-2',
    duration: 2100, // 35분
    categorySlug: 'ai-business-plan',
    level: 'beginner',
    tags: ['시장분석', '경쟁사분석', '타겟고객', 'AI'],
    isPublic: false,
    isPremium: true,
    sortOrder: 2,
  },
  {
    title: '3강 재무 계획 수립',
    slug: '3-financial-planning',
    description: '체계적인 재무 계획 수립 방법을 배웁니다. 손익계산서, 현금흐름표, 손익분기점 분석 등 핵심 재무 요소들을 AI와 함께 작성하는 방법을 학습합니다.',
    shortDescription: 'AI를 활용한 체계적인 재무 계획 수립',
    vimeoId: 'placeholder-3',
    vimeoUrl: 'https://player.vimeo.com/video/placeholder-3',
    duration: 2400, // 40분
    categorySlug: 'ai-business-plan',
    level: 'intermediate',
    tags: ['재무계획', '손익계산서', '현금흐름', 'AI'],
    isPublic: false,
    isPremium: true,
    sortOrder: 3,
  },
  {
    title: '4강 마케팅 전략 설계',
    slug: '4-marketing-strategy',
    description: '효과적인 마케팅 전략을 설계하고 실행 계획을 수립합니다. 디지털 마케팅, 브랜딩, 고객 획득 전략을 AI 도구와 함께 구체화하는 방법을 배웁니다.',
    shortDescription: 'AI 기반 마케팅 전략 설계와 실행 계획',
    vimeoId: 'placeholder-4',
    vimeoUrl: 'https://player.vimeo.com/video/placeholder-4',
    duration: 2700, // 45분
    categorySlug: 'ai-business-plan',
    level: 'intermediate',
    tags: ['마케팅전략', '디지털마케팅', '브랜딩', 'AI'],
    isPublic: false,
    isPremium: true,
    sortOrder: 4,
  },
  {
    title: '5강 운영 계획과 조직 구성',
    slug: '5-operations-organization',
    description: '비즈니스 운영 계획과 조직 구성 방안을 수립합니다. 인력 계획, 운영 프로세스, 품질 관리 등 실무에 필요한 모든 요소를 다룹니다.',
    shortDescription: '체계적인 운영 계획과 조직 구성 방안',
    vimeoId: 'placeholder-5',
    vimeoUrl: 'https://player.vimeo.com/video/placeholder-5',
    duration: 2100, // 35분
    categorySlug: 'ai-business-plan',
    level: 'intermediate',
    tags: ['운영계획', '조직구성', '인력계획', '프로세스'],
    isPublic: false,
    isPremium: true,
    sortOrder: 5,
  },
  {
    title: '6강 위험 관리와 대안 시나리오',
    slug: '6-risk-management',
    description: '사업 위험을 식별하고 관리하는 방법을 배웁니다. 위험 분석, 대안 시나리오 작성, 위기 대응 계획 수립 등을 통해 견고한 사업계획서를 완성합니다.',
    shortDescription: '사업 위험 관리와 대안 시나리오 작성',
    vimeoId: 'placeholder-6',
    vimeoUrl: 'https://player.vimeo.com/video/placeholder-6',
    duration: 1800, // 30분
    categorySlug: 'ai-business-plan',
    level: 'advanced',
    tags: ['위험관리', '시나리오분석', '위기대응', '리스크'],
    isPublic: false,
    isPremium: true,
    sortOrder: 6,
  },
  {
    title: '7강 투자 유치 전략',
    slug: '7-investment-strategy',
    description: '투자 유치를 위한 전략과 피칭 방법을 배웁니다. 투자자 관점에서의 사업계획서 작성, 밸류에이션, 투자 제안서 작성 등을 다룹니다.',
    shortDescription: '성공적인 투자 유치를 위한 전략과 피칭',
    vimeoId: 'placeholder-7',
    vimeoUrl: 'https://player.vimeo.com/video/placeholder-7',
    duration: 3000, // 50분
    categorySlug: 'ai-business-plan',
    level: 'advanced',
    tags: ['투자유치', '피칭', '밸류에이션', '투자제안서'],
    isPublic: false,
    isPremium: true,
    sortOrder: 7,
  },
  {
    title: '8강 완성된 사업계획서 검토와 최종 정리',
    slug: '8-final-review',
    description: '완성된 사업계획서를 체계적으로 검토하고 최종 정리하는 방법을 배웁니다. 실제 사례 분석과 함께 완벽한 사업계획서 완성 노하우를 전수합니다.',
    shortDescription: '사업계획서 최종 검토와 완성',
    vimeoId: 'placeholder-8',
    vimeoUrl: 'https://player.vimeo.com/video/placeholder-8',
    duration: 2400, // 40분
    categorySlug: 'ai-business-plan',
    level: 'advanced',
    tags: ['최종검토', '사례분석', '완성', '정리'],
    isPublic: false,
    isPremium: true,
    sortOrder: 8,
  }
];

async function seedComprehensiveCourses() {
  try {
    console.log('🚀 종합 강의 데이터 시딩을 시작합니다...');

    // 1. 기존 데이터 정리 (선택사항)
    console.log('📝 기존 강의 데이터 확인 중...');
    const existingCourses = await prisma.course.findMany();
    if (existingCourses.length > 0) {
      console.log(`⚠️  기존에 ${existingCourses.length}개의 강의가 있습니다.`);
      console.log('💡 기존 데이터를 유지하고 새 데이터를 추가합니다.');
    }

    // 2. 카테고리 생성/업데이트
    console.log('📁 카테고리 생성 중...');
    const categories = [];
    for (const categoryData of courseCategories) {
      const category = await prisma.courseCategory.upsert({
        where: { slug: categoryData.slug },
        update: categoryData,
        create: categoryData,
      });
      categories.push(category);
      console.log(`✅ 카테고리 생성/업데이트: ${category.name}`);
    }

    // 3. 강의 생성
    console.log('🎥 강의 생성 중...');
    const createdCourses = [];
    
    for (const courseData of coursesData) {
      const { categorySlug, ...courseInfo } = courseData;
      
      // 해당 카테고리 찾기
      const category = categories.find(cat => cat.slug === categorySlug);
      if (!category) {
        console.error(`❌ 카테고리를 찾을 수 없습니다: ${categorySlug}`);
        continue;
      }

      try {
        const course = await prisma.course.upsert({
          where: { slug: courseInfo.slug },
          update: {
            ...courseInfo,
            categoryId: category.id,
            isVisible: true,
            publishedAt: courseInfo.isPublic ? new Date() : null,
          },
          create: {
            ...courseInfo,
            categoryId: category.id,
            isVisible: true,
            publishedAt: courseInfo.isPublic ? new Date() : null,
          },
        });
        
        createdCourses.push(course);
        console.log(`✅ 강의 생성/업데이트: ${course.title}`);
      } catch (error) {
        console.error(`❌ 강의 생성 실패 (${courseInfo.title}):`, error.message);
      }
    }

    // 4. 결과 요약
    console.log('\n📊 시딩 완료 요약:');
    console.log(`📁 카테고리: ${categories.length}개`);
    console.log(`🎥 강의: ${createdCourses.length}개`);
    console.log(`🆓 공개 강의: ${createdCourses.filter(c => c.isPublic).length}개`);
    console.log(`💎 프리미엄 강의: ${createdCourses.filter(c => c.isPremium).length}개`);

    // 5. 강의 목록 출력
    console.log('\n📋 생성된 강의 목록:');
    createdCourses.forEach((course, index) => {
      const status = course.isPublic ? '🆓' : '🔒';
      const level = course.level === 'beginner' ? '🟢' : course.level === 'intermediate' ? '🟡' : '🔴';
      console.log(`${status} ${level} ${index + 1}. ${course.title} (${Math.floor(course.duration / 60)}분)`);
    });

    console.log('\n🎉 모든 강의 데이터 시딩이 완료되었습니다!');
    console.log('💡 이제 http://localhost:3000/courses 에서 확인해보세요.');

    return {
      categories,
      courses: createdCourses,
    };

  } catch (error) {
    console.error('❌ 시딩 중 오류 발생:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 테스트 사용자와 진도 데이터 생성 (선택사항)
async function seedTestUserProgress() {
  try {
    console.log('👤 테스트 사용자 진도 데이터 생성 중...');
    
    // 테스트 사용자 확인/생성
    const testUser = await prisma.user.upsert({
      where: { email: 'test@growsome.com' },
      update: {},
      create: {
        email: 'test@growsome.com',
        username: '테스트사용자',
        phoneNumber: '010-0000-0000',
        status: 'active',
      },
    });

    // 첫 번째 강의만 완료 상태로 설정
    const firstCourse = await prisma.course.findFirst({
      where: { slug: '1-black-spoon' },
    });

    if (firstCourse) {
      await prisma.userCourseProgress.upsert({
        where: {
          userId_courseId: {
            userId: testUser.id,
            courseId: firstCourse.id,
          },
        },
        update: {},
        create: {
          userId: testUser.id,
          courseId: firstCourse.id,
          isCompleted: true,
          watchTime: firstCourse.duration,
          lastPosition: firstCourse.duration,
          completedAt: new Date(),
        },
      });
      
      console.log('✅ 테스트 사용자 진도 데이터 생성 완료');
    }

  } catch (error) {
    console.error('❌ 테스트 데이터 생성 실패:', error);
  }
}

// 스크립트 실행
if (require.main === module) {
  seedComprehensiveCourses()
    .then(async () => {
      await seedTestUserProgress();
      console.log('🎯 모든 작업이 완료되었습니다!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export { seedComprehensiveCourses, seedTestUserProgress };
