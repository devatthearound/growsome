// scripts/seed-blog-data.ts
// 블로그 샘플 데이터 추가 스크립트

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 블로그 샘플 데이터 생성 시작...')

  try {
    // 1. 기존 데이터 정리 (선택사항)
    console.log('📝 기존 데이터 정리 중...')
    await prisma.blog_content_tags.deleteMany()
    await prisma.blog_comments.deleteMany()
    await prisma.blog_likes.deleteMany()
    await prisma.blog_contents.deleteMany()
    await prisma.blog_categories.deleteMany()
    await prisma.blog_tags.deleteMany()
    await prisma.user.deleteMany()

    // 2. 사용자 생성
    console.log('👤 사용자 생성 중...')
    const users = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin@growsome.com',
          username: '관리자',
          companyName: 'Growsome',
          position: 'CEO',
          phoneNumber: '010-1234-5678',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
          status: 'active'
        }
      }),
      prisma.user.create({
        data: {
          email: 'writer@growsome.com',
          username: '작가',
          companyName: 'Growsome',
          position: 'Content Writer',
          phoneNumber: '010-2345-6789',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b39b5d7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
          status: 'active'
        }
      }),
      prisma.user.create({
        data: {
          email: 'editor@growsome.com',
          username: '편집자',
          companyName: 'Growsome',
          position: 'Editor',
          phoneNumber: '010-3456-7890',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
          status: 'active'
        }
      })
    ])

    console.log(`✅ ${users.length}명의 사용자 생성 완료`)

    // 3. 카테고리 생성
    console.log('📂 카테고리 생성 중...')
    const categories = await Promise.all([
      prisma.blog_categories.create({
        data: {
          slug: 'technology',
          name: '기술',
          description: '최신 기술 트렌드와 개발 관련 소식',
          is_visible: true,
          sort_order: 1
        }
      }),
      prisma.blog_categories.create({
        data: {
          slug: 'business',
          name: '비즈니스',
          description: '비즈니스 인사이트와 경영 전략',
          is_visible: true,
          sort_order: 2
        }
      }),
      prisma.blog_categories.create({
        data: {
          slug: 'design',
          name: '디자인',
          description: 'UI/UX 디자인과 크리에이티브 아이디어',
          is_visible: true,
          sort_order: 3
        }
      }),
      prisma.blog_categories.create({
        data: {
          slug: 'marketing',
          name: '마케팅',
          description: '디지털 마케팅과 브랜딩 전략',
          is_visible: true,
          sort_order: 4
        }
      }),
      prisma.blog_categories.create({
        data: {
          slug: 'productivity',
          name: '생산성',
          description: '업무 효율성과 생산성 향상 팁',
          is_visible: true,
          sort_order: 5
        }
      })
    ])

    console.log(`✅ ${categories.length}개의 카테고리 생성 완료`)

    // 4. 태그 생성
    console.log('🏷️ 태그 생성 중...')
    const tags = await Promise.all([
      prisma.blog_tags.create({
        data: { name: 'React', slug: 'react' }
      }),
      prisma.blog_tags.create({
        data: { name: 'Next.js', slug: 'nextjs' }
      }),
      prisma.blog_tags.create({
        data: { name: 'TypeScript', slug: 'typescript' }
      }),
      prisma.blog_tags.create({
        data: { name: 'GraphQL', slug: 'graphql' }
      }),
      prisma.blog_tags.create({
        data: { name: 'Prisma', slug: 'prisma' }
      }),
      prisma.blog_tags.create({
        data: { name: 'Node.js', slug: 'nodejs' }
      }),
      prisma.blog_tags.create({
        data: { name: 'AI', slug: 'ai' }
      }),
      prisma.blog_tags.create({
        data: { name: '스타트업', slug: 'startup' }
      }),
      prisma.blog_tags.create({
        data: { name: 'UX', slug: 'ux' }
      }),
      prisma.blog_tags.create({
        data: { name: 'SEO', slug: 'seo' }
      })
    ])

    console.log(`✅ ${tags.length}개의 태그 생성 완료`)

    // 5. 블로그 컨텐츠 생성
    console.log('📝 블로그 컨텐츠 생성 중...')
    
    const sampleContents = [
      {
        slug: 'next-js-app-router-guide',
        title: 'Next.js App Router 완벽 가이드',
        content_body: `# Next.js App Router 완벽 가이드

Next.js 13에서 도입된 App Router는 React의 최신 기능들을 활용하여 더욱 강력하고 유연한 라우팅 시스템을 제공합니다.

## 주요 특징

### 1. 파일 기반 라우팅
App Router는 \`app\` 디렉토리 내의 폴더 구조를 기반으로 라우팅을 생성합니다.

### 2. 레이아웃 시스템
각 경로에 대해 공유 레이아웃을 정의할 수 있습니다.

### 3. 서버 컴포넌트
기본적으로 모든 컴포넌트는 서버 컴포넌트로 렌더링됩니다.

## 실제 사용 예시

\`\`\`typescript
// app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>홈페이지</h1>
      <p>Next.js App Router를 사용한 홈페이지입니다.</p>
    </div>
  )
}
\`\`\`

## 결론

App Router는 Next.js의 미래이며, 더 나은 개발 경험과 성능을 제공합니다.`,
        meta_description: 'Next.js 13의 App Router 기능에 대한 완벽한 가이드입니다. 파일 기반 라우팅, 레이아웃 시스템, 서버 컴포넌트에 대해 알아보세요.',
        author_id: users[0].id,
        category_id: categories[0].id,
        status: 'PUBLISHED',
        is_featured: true,
        is_hero: true,
        thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
        view_count: 150,
        like_count: 12,
        published_at: new Date('2024-01-15')
      },
      {
        slug: 'graphql-prisma-integration',
        title: 'GraphQL과 Prisma 통합하기',
        content_body: `# GraphQL과 Prisma 통합하기

GraphQL과 Prisma를 함께 사용하면 강력하고 타입 안전한 API를 구축할 수 있습니다.

## GraphQL의 장점

- **타입 안전성**: 스키마 기반의 강타입 시스템
- **효율적인 데이터 페칭**: 필요한 데이터만 요청
- **단일 엔드포인트**: 모든 데이터를 하나의 엔드포인트로 처리

## Prisma의 장점

- **타입 안전한 ORM**: TypeScript와 완벽한 통합
- **자동 마이그레이션**: 스키마 변경사항 자동 관리
- **강력한 쿼리 빌더**: 복잡한 쿼리도 간단하게

## 실제 구현

\`\`\`typescript
// GraphQL 리졸버 예시
const resolvers = {
  Query: {
    posts: async () => {
      return await prisma.post.findMany({
        include: {
          author: true,
          comments: true
        }
      })
    }
  }
}
\`\`\`

이렇게 두 기술을 조합하면 최고의 개발 경험을 얻을 수 있습니다.`,
        meta_description: 'GraphQL과 Prisma를 통합하여 타입 안전한 API를 구축하는 방법을 알아보세요.',
        author_id: users[1].id,
        category_id: categories[0].id,
        status: 'PUBLISHED',
        is_featured: true,
        thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
        view_count: 98,
        like_count: 8,
        published_at: new Date('2024-01-10')
      },
      {
        slug: 'startup-growth-strategy',
        title: '스타트업 성장 전략: 0에서 1까지',
        content_body: `# 스타트업 성장 전략: 0에서 1까지

스타트업이 성공하기 위해서는 체계적인 성장 전략이 필요합니다.

## 1단계: 문제 정의

먼저 해결하고자 하는 문제를 명확히 정의해야 합니다.

- 실제 존재하는 문제인가?
- 충분히 큰 시장이 있는가?
- 사람들이 돈을 낼 만한 문제인가?

## 2단계: MVP 개발

최소 기능 제품(MVP)을 빠르게 개발하여 시장에 출시합니다.

## 3단계: 사용자 피드백

초기 사용자들로부터 피드백을 수집하고 제품을 개선합니다.

## 4단계: 확장

검증된 비즈니스 모델을 바탕으로 사업을 확장합니다.

성공하는 스타트업은 이 과정을 반복하며 지속적으로 성장합니다.`,
        meta_description: '스타트업이 0에서 1까지 성장하기 위한 체계적인 전략을 알아보세요.',
        author_id: users[0].id,
        category_id: categories[1].id,
        status: 'PUBLISHED',
        thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
        view_count: 203,
        like_count: 25,
        published_at: new Date('2024-01-08')
      },
      {
        slug: 'ux-design-principles',
        title: 'UX 디자인의 핵심 원칙',
        content_body: `# UX 디자인의 핵심 원칙

좋은 사용자 경험을 만들기 위한 핵심 원칙들을 알아보겠습니다.

## 1. 사용자 중심 설계

모든 디자인 결정은 사용자의 니즈와 목표를 중심으로 이루어져야 합니다.

## 2. 일관성

인터페이스 전반에 걸쳐 일관된 패턴과 스타일을 유지해야 합니다.

## 3. 단순성

복잡함보다는 단순함을 추구하여 사용자가 쉽게 이해할 수 있도록 합니다.

## 4. 피드백

사용자의 행동에 대해 명확한 피드백을 제공해야 합니다.

## 5. 접근성

모든 사용자가 제품을 사용할 수 있도록 접근성을 고려해야 합니다.

이러한 원칙들을 지키면 사용자가 만족하는 제품을 만들 수 있습니다.`,
        meta_description: '좋은 사용자 경험을 만들기 위한 UX 디자인의 핵심 원칙들을 알아보세요.',
        author_id: users[2].id,
        category_id: categories[2].id,
        status: 'PUBLISHED',
        is_featured: false,
        thumbnail_url: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
        view_count: 87,
        like_count: 6,
        published_at: new Date('2024-01-05')
      },
      {
        slug: 'digital-marketing-trends-2024',
        title: '2024 디지털 마케팅 트렌드',
        content_body: `# 2024 디지털 마케팅 트렌드

2024년에 주목해야 할 디지털 마케팅 트렌드를 살펴보겠습니다.

## 1. AI 기반 개인화

인공지능을 활용한 개인화된 마케팅이 더욱 중요해집니다.

## 2. 비디오 콘텐츠 우선

짧은 형태의 비디오 콘텐츠가 마케팅의 핵심이 됩니다.

## 3. 음성 검색 최적화

음성 검색에 최적화된 SEO 전략이 필요합니다.

## 4. 소셜 커머스

소셜 미디어 플랫폼에서 직접 구매가 가능한 기능들이 확산됩니다.

## 5. 지속가능성 마케팅

환경과 사회에 대한 관심이 높아지면서 지속가능성을 강조하는 마케팅이 중요해집니다.

이러한 트렌드를 따라가며 마케팅 전략을 수립해야 합니다.`,
        meta_description: '2024년에 주목해야 할 디지털 마케팅 트렌드와 전략을 알아보세요.',
        author_id: users[1].id,
        category_id: categories[3].id,
        status: 'PUBLISHED',
        thumbnail_url: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
        view_count: 134,
        like_count: 15,
        published_at: new Date('2024-01-03')
      }
    ]

    const contents = []
    for (const contentData of sampleContents) {
      const content = await prisma.blog_contents.create({
        data: contentData
      })
      contents.push(content)
    }

    console.log(`✅ ${contents.length}개의 블로그 컨텐츠 생성 완료`)

    // 6. 컨텐츠-태그 연결
    console.log('🔗 컨텐츠-태그 연결 중...')
    
    const contentTagMappings = [
      { contentIndex: 0, tagIndices: [0, 1, 2] }, // Next.js 글에 React, Next.js, TypeScript 태그
      { contentIndex: 1, tagIndices: [3, 4, 2] }, // GraphQL 글에 GraphQL, Prisma, TypeScript 태그
      { contentIndex: 2, tagIndices: [7] }, // 스타트업 글에 스타트업 태그
      { contentIndex: 3, tagIndices: [8] }, // UX 글에 UX 태그
      { contentIndex: 4, tagIndices: [9] }, // 마케팅 글에 SEO 태그
    ]

    for (const mapping of contentTagMappings) {
      for (const tagIndex of mapping.tagIndices) {
        await prisma.blog_content_tags.create({
          data: {
            content_id: contents[mapping.contentIndex].id,
            tag_id: tags[tagIndex].id
          }
        })
      }
    }

    console.log('✅ 컨텐츠-태그 연결 완료')

    // 7. 샘플 댓글 생성
    console.log('💬 샘플 댓글 생성 중...')
    
    const comments = await Promise.all([
      prisma.blog_comments.create({
        data: {
          content_id: contents[0].id,
          user_id: users[1].id,
          body: '정말 유용한 가이드네요! Next.js App Router에 대해 많이 배웠습니다.',
          is_approved: true
        }
      }),
      prisma.blog_comments.create({
        data: {
          content_id: contents[0].id,
          user_id: users[2].id,
          body: '실제 예시 코드가 있어서 이해하기 쉬웠어요. 감사합니다!',
          is_approved: true
        }
      }),
      prisma.blog_comments.create({
        data: {
          content_id: contents[1].id,
          user_id: users[0].id,
          body: 'GraphQL과 Prisma 조합은 정말 강력하죠. 좋은 설명 감사합니다.',
          is_approved: true
        }
      })
    ])

    console.log(`✅ ${comments.length}개의 댓글 생성 완료`)

    // 8. 좋아요 생성
    console.log('❤️ 좋아요 생성 중...')
    
    const likes = await Promise.all([
      prisma.blog_likes.create({
        data: {
          content_id: contents[0].id,
          user_id: users[1].id
        }
      }),
      prisma.blog_likes.create({
        data: {
          content_id: contents[0].id,
          user_id: users[2].id
        }
      }),
      prisma.blog_likes.create({
        data: {
          content_id: contents[1].id,
          user_id: users[0].id
        }
      }),
      prisma.blog_likes.create({
        data: {
          content_id: contents[2].id,
          user_id: users[1].id
        }
      })
    ])

    console.log(`✅ ${likes.length}개의 좋아요 생성 완료`)

    // 최종 통계
    console.log('\n🎉 샘플 데이터 생성 완료!')
    console.log(`
📊 생성된 데이터 요약:
- 👤 사용자: ${users.length}명
- 📂 카테고리: ${categories.length}개
- 🏷️ 태그: ${tags.length}개
- 📝 블로그 글: ${contents.length}개
- 💬 댓글: ${comments.length}개
- ❤️ 좋아요: ${likes.length}개
    `)

    console.log('\n🚀 이제 http://localhost:3000/test-graphql 에서 테스트해보세요!')

  } catch (error) {
    console.error('❌ 샘플 데이터 생성 중 오류 발생:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
