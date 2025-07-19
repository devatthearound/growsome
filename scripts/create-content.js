// scripts/create-content.js
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const samplePosts = [
  {
    title: "Growsome과 함께하는 AI 시대의 비즈니스 성장 전략",
    slug: "ai-business-growth-strategy",
    content_body: `
# AI 시대의 비즈니스 성장 전략

## 서론
인공지능이 모든 산업을 변화시키고 있는 지금, 스마트한 비즈니스 성장 전략이 그 어느 때보다 중요합니다.

## 주요 전략
1. **데이터 기반 의사결정**
   - 고객 행동 분석
   - 시장 트렌드 파악
   - 예측 분석 활용

2. **AI 도구 도입**
   - 업무 자동화
   - 고객 서비스 개선
   - 마케팅 최적화

3. **인재 육성**
   - 디지털 리터러시 강화
   - AI 활용 교육
   - 창의적 사고 개발

## 결론
AI를 적극적으로 활용하는 기업만이 미래 시장에서 경쟁우위를 확보할 수 있습니다.
    `,
    category_id: 3, // 비즈니스
    meta_title: "AI 시대 비즈니스 성장 전략 - Growsome",
    meta_description: "AI 기술을 활용한 스마트한 비즈니스 성장 전략을 알아보세요. 데이터 기반 의사결정부터 인재 육성까지.",
    is_featured: true
  },
  {
    title: "개발자를 위한 Next.js 15 완벽 가이드",
    slug: "nextjs-15-complete-guide",
    content_body: `
# Next.js 15 완벽 가이드

## 새로운 기능들
Next.js 15에서 추가된 주요 기능들을 살펴보겠습니다.

### 1. 향상된 App Router
- 더 빠른 라우팅
- 개선된 레이아웃 시스템
- 중첩 라우팅 최적화

### 2. 서버 컴포넌트 개선
- React 18 완전 지원
- Streaming 성능 향상
- SEO 최적화

### 3. 개발자 경험 향상
- 더 나은 에러 메시지
- 개선된 Hot Reload
- TypeScript 지원 강화

## 실제 프로젝트 적용
Growsome 프로젝트에서 Next.js 15를 어떻게 활용했는지 알아보세요.
    `,
    category_id: 2, // 개발 팁
    meta_title: "Next.js 15 완벽 가이드 - 개발자 필독서",
    meta_description: "Next.js 15의 새로운 기능들과 실제 프로젝트 적용 방법을 상세히 알아보세요."
  },
  {
    title: "2024년 AI/ML 트렌드 분석",
    slug: "2024-ai-ml-trends",
    content_body: `
# 2024년 AI/ML 트렌드 분석

## 주요 트렌드
올해 AI/ML 분야에서 주목받고 있는 트렌드들을 분석합니다.

### 1. 생성형 AI의 진화
- GPT-4, Claude 등 대화형 AI 발전
- 이미지, 비디오 생성 AI 대중화
- 코드 생성 AI 도구 확산

### 2. 엣지 AI
- 모바일 디바이스에서의 AI 처리
- 실시간 추론 최적화
- 프라이버시 강화

### 3. AI 윤리와 규제
- AI 편향성 문제 해결
- 투명성과 설명 가능성
- 글로벌 AI 규제 동향

## 비즈니스 활용 방안
각 트렌드를 실제 비즈니스에 어떻게 적용할 수 있는지 알아보세요.
    `,
    category_id: 1, // AI/ML
    meta_title: "2024년 AI/ML 트렌드 완벽 분석",
    meta_description: "2024년 인공지능과 머신러닝 분야의 주요 트렌드와 비즈니스 활용 방안을 알아보세요."
  }
];

async function createContent() {
  try {
    console.log('🚀 콘텐츠 생성 시작...');
    
    // 사용자 ID 확인 (첫 번째 사용자 사용)
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ 사용자가 없습니다. 먼저 사용자를 생성해주세요.');
      return;
    }
    
    for (const post of samplePosts) {
      const created = await prisma.blog_contents.create({
        data: {
          ...post,
          author_id: user.id,
          status: 'PUBLISHED',
          published_at: new Date(),
          view_count: Math.floor(Math.random() * 1000) + 50,
          like_count: Math.floor(Math.random() * 50) + 5,
          comment_count: 0
        }
      });
      
      console.log(`✅ 포스트 생성: "${created.title}"`);
    }
    
    console.log('🎉 모든 콘텐츠 생성 완료!');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createContent();
