import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('강의 카테고리 및 강의 데이터 시드 시작...');

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