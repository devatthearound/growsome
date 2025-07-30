// prisma/seed.ts - 수정된 버전 (status null 사용)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('데이터베이스 시드 시작...')

  try {
    // 기존 데이터가 있는지 확인
    const existingContents = await prisma.blog_contents.count()
    const existingUsers = await prisma.user.count()
    
    if (existingContents > 0 || existingUsers > 0) {
      console.log('기존 데이터가 존재합니다. 데이터를 보존합니다.')
      console.log(`- 기존 블로그 컨텐츠: ${existingContents}개`)
      console.log(`- 기존 사용자: ${existingUsers}명`)
      return
    }

    console.log('새로운 데이터 생성 시작...')

    // 사용자 생성
    const user1 = await prisma.user.create({
      data: {
        email: 'admin@growsome.com',
        username: 'Admin User',
        companyName: 'Growsome',
        position: 'Developer',
        phoneNumber: '010-1234-5678',
        status: 'active'
      }
    })

    const user2 = await prisma.user.create({
      data: {
        email: 'editor@growsome.com',
        username: 'Editor',
        companyName: 'Growsome',
        position: 'Content Editor',
        phoneNumber: '010-2345-6789',
        status: 'active'
      }
    })

    console.log(`사용자 생성됨: ${user1.username}, ${user2.username}`)

    // 카테고리 생성
    const categories = await Promise.all([
      prisma.blog_categories.create({
        data: {
          slug: 'tech',
          name: '기술',
          description: '최신 기술 트렌드와 개발 정보',
          is_visible: true,
          sort_order: 1
        }
      }),
      prisma.blog_categories.create({
        data: {
          slug: 'business',
          name: '비즈니스',
          description: '비즈니스 인사이트와 전략',
          is_visible: true,
          sort_order: 2
        }
      }),
      prisma.blog_categories.create({
        data: {
          slug: 'design',
          name: '디자인',
          description: 'UI/UX 디자인과 트렌드',
          is_visible: true,
          sort_order: 3
        }
      }),
      prisma.blog_categories.create({
        data: {
          slug: 'startup',
          name: '스타트업',
          description: '스타트업 이야기와 경험담',
          is_visible: true,
          sort_order: 4
        }
      })
    ])

    console.log(`카테고리 생성됨: ${categories.length}개`)

    // 태그 생성
    const tags = await Promise.all([
      prisma.blog_tags.create({
        data: {
          name: 'React',
          slug: 'react'
        }
      }),
      prisma.blog_tags.create({
        data: {
          name: 'Next.js',
          slug: 'nextjs'
        }
      }),
      prisma.blog_tags.create({
        data: {
          name: 'TypeScript',
          slug: 'typescript'
        }
      }),
      prisma.blog_tags.create({
        data: {
          name: 'GraphQL',
          slug: 'graphql'
        }
      }),
      prisma.blog_tags.create({
        data: {
          name: 'Prisma',
          slug: 'prisma'
        }
      })
    ])

    console.log(`태그 생성됨: ${tags.length}개`)

    // 블로그 컨텐츠 생성 - status 필드를 생략하여 기본값 사용
    console.log('블로그 컨텐츠 생성 시작...')
    
    // 첫 번째 컨텐츠 (발행됨)
    const content1 = await prisma.blog_contents.create({
      data: {
        slug: 'getting-started-with-nextjs',
        title: 'Next.js로 시작하는 현대적인 웹 개발',
        content_body: `# Next.js로 시작하는 현대적인 웹 개발

Next.js는 React 기반의 프레임워크로, 현대적인 웹 애플리케이션을 빠르고 효율적으로 개발할 수 있게 해줍니다.

## 주요 특징

### 1. 서버사이드 렌더링 (SSR)
Next.js는 기본적으로 서버사이드 렌더링을 지원합니다.

### 2. 정적 사이트 생성 (SSG)
정적 사이트 생성을 통해 빌드 시점에 페이지를 미리 생성하여 더욱 빠른 로딩 속도를 제공합니다.

### 3. API Routes
백엔드 API를 별도로 구성하지 않고도 Next.js 내에서 API 엔드포인트를 만들 수 있습니다.

## 시작하기

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## 결론

Next.js는 React 개발자들에게 강력한 도구를 제공하며, 모던 웹 개발의 표준이 되어가고 있습니다.`,
        author_id: user1.id,
        category_id: categories[0].id,
        status: 'PUBLISHED',
        is_featured: true,
        is_hero: false,
        meta_title: 'Next.js로 시작하는 현대적인 웹 개발',
        meta_description: 'Next.js의 주요 특징과 시작하는 방법을 알아보세요.',
        published_at: new Date(),
        view_count: 125,
        like_count: 8,
        comment_count: 3
      }
    })
    console.log('첫 번째 컨텐츠 생성 완료')

    // 두 번째 컨텐츠
    const content2 = await prisma.blog_contents.create({
      data: {
        slug: 'building-scalable-applications',
        title: '확장 가능한 애플리케이션 아키텍처 설계',
        content_body: `# 확장 가능한 애플리케이션 아키텍처 설계

대규모 서비스를 운영하다 보면 확장성은 필수적인 요소가 됩니다.

## 마이크로서비스 아키텍처

### 장점
- 독립적인 배포와 확장
- 기술 스택의 다양성

### 단점
- 복잡한 네트워크 통신
- 데이터 일관성 문제

## 결론

확장 가능한 아키텍처는 점진적으로 개선해 나가는 것이 중요합니다.`,
        author_id: user1.id,
        category_id: categories[0].id,
        status: 'PUBLISHED',
        is_featured: true,
        is_hero: true,
        meta_title: '확장 가능한 애플리케이션 아키텍처 설계 가이드',
        meta_description: '대규모 서비스를 위한 확장 가능한 아키텍처 설계 방법을 알아보세요.',
        published_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
        view_count: 89,
        like_count: 12,
        comment_count: 5
      }
    })
    console.log('두 번째 컨텐츠 생성 완료')

    // 세 번째 컨텐츠
    const content3 = await prisma.blog_contents.create({
      data: {
        slug: 'ux-design-principles',
        title: '사용자 경험을 향상시키는 디자인 원칙',
        content_body: `# 사용자 경험을 향상시키는 디자인 원칙

좋은 사용자 경험(UX)은 제품의 성공에 핵심적인 역할을 합니다.

## 1. 사용자 중심 설계

### 사용자 리서치
- 사용자 인터뷰
- 설문조사
- 사용성 테스트

## 결론

좋은 UX 디자인은 사용자의 니즈를 깊이 이해하는 것에서 시작됩니다.`,
        author_id: user2.id,
        category_id: categories[2].id,
        status: 'PUBLISHED',
        is_featured: false,
        is_hero: false,
        meta_title: 'UX 디자인 원칙: 사용자 경험 향상 가이드',
        meta_description: '효과적인 UX 디자인을 위한 핵심 원칙들을 알아보세요.',
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        view_count: 67,
        like_count: 5,
        comment_count: 2
      }
    })
    console.log('세 번째 컨텐츠 생성 완료')

    const contents = [content1, content2, content3]
    console.log(`블로그 컨텐츠 생성됨: ${contents.length}개`)

    // 컨텐츠-태그 관계 생성
    await Promise.all([
      prisma.blog_content_tags.create({
        data: {
          content_id: contents[0].id,
          tag_id: tags[0].id // React
        }
      }),
      prisma.blog_content_tags.create({
        data: {
          content_id: contents[0].id,
          tag_id: tags[1].id // Next.js
        }
      }),
      prisma.blog_content_tags.create({
        data: {
          content_id: contents[1].id,
          tag_id: tags[3].id // GraphQL
        }
      })
    ])

    console.log('컨텐츠-태그 관계 생성 완료')

    // 샘플 댓글 생성
    await Promise.all([
      prisma.blog_comments.create({
        data: {
          content_id: contents[0].id,
          user_id: user2.id,
          body: '정말 유용한 글이네요! Next.js 시작하는데 많은 도움이 되었습니다.',
          is_approved: true
        }
      }),
      prisma.blog_comments.create({
        data: {
          content_id: contents[1].id,
          user_id: user2.id,
          body: '마이크로서비스 아키텍처 부분이 특히 인상깊었습니다.',
          is_approved: true
        }
      })
    ])

    console.log('샘플 댓글 생성 완료')

    // 샘플 좋아요 생성
    await Promise.all([
      prisma.blog_likes.create({
        data: {
          content_id: contents[0].id,
          user_id: user2.id
        }
      }),
      prisma.blog_likes.create({
        data: {
          content_id: contents[1].id,
          user_id: user2.id
        }
      })
    ])

    console.log('샘플 좋아요 생성 완료')

    console.log('✅ 데이터베이스 시드 완료!')
    console.log(`
생성된 데이터:
- 사용자: 2명
- 카테고리: 4개
- 태그: 5개
- 블로그 컨텐츠: 3개
- 댓글: 2개
- 좋아요: 2개
    `)

  } catch (error) {
    console.error('시드 실행 중 상세 오류:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('시드 실행 중 오류:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
