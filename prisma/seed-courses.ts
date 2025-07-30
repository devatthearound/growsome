import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('강의 카테고리 및 강의 데이터 시드 시작...');

  // 기존 강의 데이터가 있는지 확인
  const existingCourses = await prisma.course.count()
  
  if (existingCourses > 0) {
    console.log(`기존 강의 데이터가 존재합니다. (${existingCourses}개 강의)`)
    console.log('데이터를 보존합니다.')
    return
  }

  // 강의 카테고리 생성
  const category = await prisma.courseCategory.upsert({
    where: { slug: 'business-plan' },
    update: {},
    create: {
      name: '사업계획서 작성',
      slug: 'business-plan',
      description: 'AI를 활용한 사업계획서 작성 및 MVP 개발 강의',
      color: '#5C59E8',
      sortOrder: 1,
      isVisible: true
    }
  });

  console.log(`카테고리 생성됨: ${category.name}`);

  // 샘플 강의 데이터
  const courses = [
    {
      title: '1강. 혁신적인 사업계획서 작성법',
      slug: 'business-plan-fundamentals',
      description: 'AI를 활용한 체계적인 사업계획서 작성 방법론을 배웁니다. 실제 사례를 통해 성공하는 사업계획서의 핵심 요소들을 익혀보세요.',
      shortDescription: 'AI를 활용한 체계적인 사업계획서 작성 방법론을 배웁니다.',
      vimeoId: '123456789',
      vimeoUrl: 'https://vimeo.com/123456789',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop',
      duration: 234,
      level: 'beginner',
      tags: ['사업계획서', 'AI', '기초'],
      isPublic: true, // 미리보기 가능
      isPremium: false,
      sortOrder: 1
    },
    {
      title: '2강. 시장 분석과 경쟁사 분석',
      slug: 'market-analysis',
      description: '효과적인 시장 조사 방법과 경쟁사 분석 프레임워크를 학습합니다. 데이터 기반의 시장 분석으로 성공 확률을 높여보세요.',
      shortDescription: '효과적인 시장 조사 방법과 경쟁사 분석 프레임워크를 학습합니다.',
      vimeoId: '123456790',
      vimeoUrl: 'https://vimeo.com/123456790',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
      duration: 279,
      level: 'beginner',
      tags: ['시장분석', '경쟁분석', '리서치'],
      isPublic: false,
      isPremium: true,
      sortOrder: 2
    },
    {
      title: '3강. 재무 계획 수립하기',
      slug: 'financial-planning',
      description: '사업의 재무 모델링과 수익성 분석 방법을 익힙니다. 투자자를 설득할 수 있는 탄탄한 재무 계획을 세워보세요.',
      shortDescription: '사업의 재무 모델링과 수익성 분석 방법을 익힙니다.',
      vimeoId: '123456791',
      vimeoUrl: 'https://vimeo.com/123456791',
      thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
      duration: 361,
      level: 'intermediate',
      tags: ['재무계획', '수익모델', '투자'],
      isPublic: false,
      isPremium: true,
      sortOrder: 3
    },
    {
      title: '4강. MVP 설계와 검증',
      slug: 'mvp-design-validation',
      description: '최소기능제품(MVP) 설계 및 시장 검증 전략을 다룹니다. 빠른 시장 진입과 효과적인 피드백 수집 방법을 배워보세요.',
      shortDescription: '최소기능제품(MVP) 설계 및 시장 검증 전략을 다룹니다.',
      vimeoId: '123456792',
      vimeoUrl: 'https://vimeo.com/123456792',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop',
      duration: 307,
      level: 'intermediate',
      tags: ['MVP', '제품검증', '프로토타입'],
      isPublic: false,
      isPremium: true,
      sortOrder: 4
    },
    {
      title: '5강. 투자 유치 전략과 피칭',
      slug: 'investment-pitching',
      description: '투자자를 설득하는 효과적인 피칭 전략과 투자 유치 방법을 학습합니다. 성공적인 투자 유치 사례를 분석해보세요.',
      shortDescription: '투자자를 설득하는 효과적인 피칭 전략과 투자 유치 방법을 학습합니다.',
      vimeoId: '123456793',
      vimeoUrl: 'https://vimeo.com/123456793',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=200&fit=crop',
      duration: 425,
      level: 'intermediate',
      tags: ['투자유치', '피칭', '프레젠테이션'],
      isPublic: false,
      isPremium: true,
      sortOrder: 5
    },
    {
      title: '6강. AI 기반 비즈니스 모델 혁신',
      slug: 'ai-business-model',
      description: 'AI 기술을 활용한 혁신적인 비즈니스 모델 설계 방법을 배웁니다. 미래 지향적인 사업 전략을 수립해보세요.',
      shortDescription: 'AI 기술을 활용한 혁신적인 비즈니스 모델 설계 방법을 배웁니다.',
      vimeoId: '123456794',
      vimeoUrl: 'https://vimeo.com/123456794',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop',
      duration: 398,
      level: 'advanced',
      tags: ['AI', '비즈니스모델', '혁신'],
      isPublic: false,
      isPremium: true,
      sortOrder: 6
    },
    {
      title: '7강. 데이터 기반 의사결정',
      slug: 'data-driven-decision',
      description: '빅데이터와 AI를 활용한 과학적 의사결정 방법론을 학습합니다. 데이터 기반의 전략 수립으로 성공 확률을 높여보세요.',
      shortDescription: '빅데이터와 AI를 활용한 과학적 의사결정 방법론을 학습합니다.',
      vimeoId: '123456795',
      vimeoUrl: 'https://vimeo.com/123456795',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
      duration: 342,
      level: 'advanced',
      tags: ['데이터분석', '의사결정', 'AI'],
      isPublic: false,
      isPremium: true,
      sortOrder: 7
    },
    {
      title: '8강. 글로벌 시장 진출 전략',
      slug: 'global-market-entry',
      description: '해외 시장 진출을 위한 전략적 접근 방법을 다룹니다. 글로벌 경쟁에서 승리하는 방법을 배워보세요.',
      shortDescription: '해외 시장 진출을 위한 전략적 접근 방법을 다룹니다.',
      vimeoId: '123456796',
      vimeoUrl: 'https://vimeo.com/123456796',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop',
      duration: 376,
      level: 'advanced',
      tags: ['글로벌진출', '해외시장', '전략'],
      isPublic: false,
      isPremium: true,
      sortOrder: 8
    }
  ];

  // 강의 생성
  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: courseData,
      create: {
        ...courseData,
        categoryId: category.id,
        publishedAt: new Date()
      }
    });
    console.log(`강의 생성됨: ${course.title}`);
  }

  console.log('시드 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });