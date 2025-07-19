// scripts/seed-courses.ts
// 강의 데이터를 데이터베이스에 추가하는 스크립트

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCourses() {
  try {
    // 1. 먼저 카테고리 생성 (없다면)
    const category = await prisma.courseCategory.upsert({
      where: { slug: 'business-plan' },
      update: {},
      create: {
        name: 'AI 사업계획서 작성',
        slug: 'business-plan',
        description: 'AI를 활용한 사업계획서 작성 강의',
        color: '#5C59E8',
        sortOrder: 1,
        isVisible: true
      }
    });

    // 2. 강의 데이터 생성
    const coursesData = [
      {
        title: '1강. 혁신적인 사업계획서 작성법',
        slug: 'innovative-business-plan-writing',
        description: `AI를 활용한 체계적인 사업계획서 작성 방법론을 배웁니다. 
        
이 강의에서는:
• 사업계획서의 핵심 구성 요소 이해
• AI 도구를 활용한 효율적인 작성법
• 투자자가 주목하는 포인트 분석
• 실전 사례를 통한 학습

강의를 완료하면 전문적인 사업계획서를 작성할 수 있는 기초 지식을 갖추게 됩니다.`,
        shortDescription: 'AI를 활용한 체계적인 사업계획서 작성 방법론을 배웁니다.',
        vimeoId: '1234567890', // 실제 Vimeo 영상 ID로 교체
        vimeoUrl: 'https://player.vimeo.com/video/1234567890?badge=0&autopause=0&player_id=0', // 실제 URL로 교체
        thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop',
        duration: 1234, // 초 단위 (20분 34초)
        level: '초급',
        tags: ['사업계획서', 'AI', '창업', '기초'],
        isPublic: true, // 무료 미리보기
        isPremium: false,
        isVisible: true,
        sortOrder: 1
      },
      {
        title: '2강. 시장 분석과 경쟁사 분석',
        slug: 'market-and-competitor-analysis',
        description: `효과적인 시장 조사 방법과 경쟁사 분석 프레임워크를 학습합니다.
        
이 강의에서는:
• 시장 규모 산정 방법 (TAM, SAM, SOM)
• 경쟁사 분석 프레임워크
• 시장 트렌드 파악 방법
• AI를 활용한 데이터 수집 및 분석

실제 사례를 통해 시장 분석 보고서를 작성하는 방법을 익힙니다.`,
        shortDescription: '효과적인 시장 조사 방법과 경쟁사 분석 프레임워크를 학습합니다.',
        vimeoId: '1234567891',
        vimeoUrl: 'https://player.vimeo.com/video/1234567891?badge=0&autopause=0&player_id=0',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
        duration: 1567, // 26분 7초
        level: '초급',
        tags: ['시장분석', '경쟁사분석', '리서치'],
        isPublic: false,
        isPremium: true,
        isVisible: true,
        sortOrder: 2
      },
      {
        title: '3강. 재무 계획 수립하기',
        slug: 'financial-planning',
        description: `사업의 재무 모델링과 수익성 분석 방법을 익힙니다.
        
이 강의에서는:
• 손익계산서 작성 방법
• 현금흐름표 구성
• 투자수익률(ROI) 계산
• 손익분기점 분석
• 자금조달 계획 수립

실제 스타트업 사례를 통해 재무 계획서를 완성해봅니다.`,
        shortDescription: '사업의 재무 모델링과 수익성 분석 방법을 익힙니다.',
        vimeoId: '1234567892',
        vimeoUrl: 'https://player.vimeo.com/video/1234567892?badge=0&autopause=0&player_id=0',
        thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
        duration: 2134, // 35분 34초
        level: '중급',
        tags: ['재무계획', '수익성분석', '자금조달'],
        isPublic: false,
        isPremium: true,
        isVisible: true,
        sortOrder: 3
      },
      {
        title: '4강. MVP 설계와 검증',
        slug: 'mvp-design-validation',
        description: `최소기능제품(MVP) 설계 및 시장 검증 전략을 다룹니다.
        
이 강의에서는:
• MVP의 개념과 중요성
• 기능 우선순위 결정 방법
• 프로토타입 제작 도구 활용
• 고객 피드백 수집 및 분석
• 제품 개선 전략

AI 도구를 활용하여 실제 MVP를 설계해보는 실습을 진행합니다.`,
        shortDescription: '최소기능제품(MVP) 설계 및 시장 검증 전략을 다룹니다.',
        vimeoId: '1234567893',
        vimeoUrl: 'https://player.vimeo.com/video/1234567893?badge=0&autopause=0&player_id=0',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop',
        duration: 1876, // 31분 16초
        level: '중급',
        tags: ['MVP', '제품설계', '시장검증'],
        isPublic: false,
        isPremium: true,
        isVisible: true,
        sortOrder: 4
      },
      {
        title: '5강. AI 도구 실전 활용법',
        slug: 'ai-tools-practical-usage',
        description: `사업계획서 작성에 도움이 되는 다양한 AI 도구들의 실전 활용법을 배웁니다.
        
이 강의에서는:
• ChatGPT를 활용한 문서 작성
• Claude를 이용한 분석 및 검토
• Midjourney로 비주얼 자료 제작
• 노션 AI로 업무 자동화
• AI 도구 조합 활용법

각 도구별 프롬프트 작성법과 효율적인 워크플로우를 익힙니다.`,
        shortDescription: '사업계획서 작성에 도움이 되는 다양한 AI 도구들의 실전 활용법을 배웁니다.',
        vimeoId: '1234567894',
        vimeoUrl: 'https://player.vimeo.com/video/1234567894?badge=0&autopause=0&player_id=0',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
        duration: 2456, // 40분 56초
        level: '중급',
        tags: ['AI도구', 'ChatGPT', 'Claude', '자동화'],
        isPublic: false,
        isPremium: true,
        isVisible: true,
        sortOrder: 5
      }
    ];

    // 3. 강의 생성
    for (const courseData of coursesData) {
      const course = await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: courseData,
        create: {
          ...courseData,
          categoryId: category.id,
          publishedAt: new Date()
        }
      });

      console.log(`Created/Updated course: ${course.title}`);
    }

    console.log('✅ 강의 시드 데이터 생성 완료!');

  } catch (error) {
    console.error('❌ 시드 데이터 생성 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
seedCourses();