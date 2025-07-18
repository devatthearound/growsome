// scripts/seed-blog.ts
// 블로그 데이터 시드 스크립트

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 블로그 시드 데이터 생성 시작...')

  try {
    // 1. 사용자 생성 (테스트용)
    const user = await prisma.user.upsert({
      where: { email: 'admin@growsome.co.kr' },
      update: {},
      create: {
        email: 'admin@growsome.co.kr',
        username: 'Growsome 관리자',
        password: 'password123', // 개발용 단순 비밀번호
        companyName: 'Growsome',
        position: 'Admin',
        phoneNumber: '010-1234-5678',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        status: 'active'
      }
    })
    console.log('✅ 사용자 생성 완료:', user.username)

    // 2. 카테고리 생성
    const categories = [
      {
        slug: 'tech',
        name: '기술',
        description: '개발 기술과 트렌드에 관한 글',
        is_visible: true,
        sort_order: 1
      },
      {
        slug: 'business',
        name: '비즈니스',
        description: '비즈니스 전략과 인사이트',
        is_visible: true,
        sort_order: 2
      },
      {
        slug: 'design',
        name: '디자인',
        description: 'UI/UX 디자인과 트렌드',
        is_visible: true,
        sort_order: 3
      },
      {
        slug: 'marketing',
        name: '마케팅',
        description: '디지털 마케팅과 성장 전략',
        is_visible: true,
        sort_order: 4
      }
    ]

    const createdCategories = []
    for (const categoryData of categories) {
      const category = await prisma.blog_categories.upsert({
        where: { slug: categoryData.slug },
        update: categoryData,
        create: categoryData
      })
      createdCategories.push(category)
      console.log('✅ 카테고리 생성 완료:', category.name)
    }

    // 3. 태그 생성
    const tags = [
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'GraphQL', slug: 'graphql' },
      { name: 'Prisma', slug: 'prisma' },
      { name: 'Startup', slug: 'startup' },
      { name: 'Growth', slug: 'growth' },
      { name: 'UX', slug: 'ux' },
      { name: 'UI', slug: 'ui' },
      { name: 'SEO', slug: 'seo' }
    ]

    const createdTags = []
    for (const tagData of tags) {
      const tag = await prisma.blog_tags.upsert({
        where: { slug: tagData.slug },
        update: tagData,
        create: tagData
      })
      createdTags.push(tag)
    }
    console.log('✅ 태그 생성 완료:', tags.length + '개')

    // 4. 블로그 컨텐츠 생성
    const contents = [
      {
        slug: 'welcome-to-growsome-blog',
        title: 'Growsome 블로그에 오신 것을 환영합니다!',
        content_body: `
          <h2>안녕하세요! Growsome 블로그입니다</h2>
          
          <p>저희 Growsome 블로그에 오신 것을 진심으로 환영합니다. 이곳에서는 비즈니스 성장과 관련된 다양한 인사이트와 노하우를 공유하고 있습니다.</p>
          
          <h3>블로그에서 다루는 주제들</h3>
          
          <ul>
            <li><strong>기술</strong>: 최신 개발 기술과 트렌드</li>
            <li><strong>비즈니스</strong>: 성장 전략과 경영 인사이트</li>
            <li><strong>디자인</strong>: 사용자 경험과 UI/UX 디자인</li>
            <li><strong>마케팅</strong>: 디지털 마케팅과 브랜딩</li>
          </ul>
          
          <blockquote>
            <p>"성장하는 기업을 위한 실질적인 노하우와 인사이트를 제공하는 것이 저희의 목표입니다."</p>
          </blockquote>
          
          <p>앞으로 더 많은 유익한 콘텐츠로 찾아뵙겠습니다. 궁금한 점이나 다루었으면 하는 주제가 있다면 언제든 연락 주세요!</p>
        `,
        author_id: user.id,
        category_id: createdCategories[1].id, // 비즈니스
        status: 'PUBLISHED',
        is_featured: true,
        is_hero: true,
        thumbnail_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
        meta_title: 'Growsome 블로그에 오신 것을 환영합니다!',
        meta_description: '비즈니스 성장을 위한 인사이트와 노하우를 공유하는 Growsome 블로그입니다.',
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        published_at: new Date()
      },
      {
        slug: 'modern-web-development-stack',
        title: '현대적인 웹 개발 스택: Next.js, TypeScript, Prisma',
        content_body: `
          <h2>현대적인 웹 개발을 위한 필수 기술 스택</h2>
          
          <p>오늘날 웹 개발 환경은 빠르게 변화하고 있습니다. 효율적이고 확장 가능한 애플리케이션을 만들기 위해서는 적절한 기술 스택 선택이 중요합니다.</p>
          
          <h3>1. Next.js - React 기반 풀스택 프레임워크</h3>
          
          <p>Next.js는 React 기반의 프로덕션 레디 프레임워크로, 다음과 같은 장점을 제공합니다:</p>
          
          <ul>
            <li>서버 사이드 렌더링 (SSR)</li>
            <li>정적 사이트 생성 (SSG)</li>
            <li>API Routes를 통한 백엔드 기능</li>
            <li>자동 코드 분할</li>
            <li>내장 이미지 최적화</li>
          </ul>
          
          <h3>2. TypeScript - 타입 안정성</h3>
          
          <p>TypeScript는 JavaScript에 정적 타입을 추가한 언어입니다. 대규모 애플리케이션 개발에서 다음과 같은 이점을 제공합니다:</p>
          
          <ul>
            <li>컴파일 타임 오류 검증</li>
            <li>더 나은 IDE 지원</li>
            <li>코드 리팩토링 용이성</li>
            <li>개발자 경험 향상</li>
          </ul>
          
          <h3>3. Prisma - 모던 데이터베이스 툴킷</h3>
          
          <p>Prisma는 타입 안전한 데이터베이스 액세스를 제공하는 ORM입니다:</p>
          
          <ul>
            <li>타입 안전한 쿼리</li>
            <li>자동 생성되는 타입</li>
            <li>데이터베이스 마이그레이션</li>
            <li>강력한 쿼리 빌더</li>
          </ul>
          
          <h3>결론</h3>
          
          <p>이러한 기술들을 조합하면 개발 효율성과 코드 품질을 크게 향상시킬 수 있습니다. 특히 타입 안정성과 개발자 경험 측면에서 큰 이점을 얻을 수 있습니다.</p>
        `,
        author_id: user.id,
        category_id: createdCategories[0].id, // 기술
        status: 'PUBLISHED',
        is_featured: true,
        is_hero: false,
        thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        meta_title: '현대적인 웹 개발 스택: Next.js, TypeScript, Prisma',
        meta_description: 'Next.js, TypeScript, Prisma를 활용한 현대적인 웹 개발 스택에 대해 알아보세요.',
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        published_at: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1일 전
      },
      {
        slug: 'ux-design-principles',
        title: 'UX 디자인의 핵심 원칙 5가지',
        content_body: `
          <h2>사용자 경험을 향상시키는 핵심 원칙들</h2>
          
          <p>좋은 UX 디자인은 사용자의 목표 달성을 돕고, 제품과의 상호작용을 즐겁게 만듭니다. 다음은 UX 디자인의 핵심 원칙들입니다.</p>
          
          <h3>1. 사용자 중심 설계 (User-Centered Design)</h3>
          
          <p>모든 디자인 결정은 사용자의 needs, wants, limitations를 고려해야 합니다.</p>
          
          <ul>
            <li>사용자 리서치 수행</li>
            <li>페르소나 개발</li>
            <li>사용자 여정 맵핑</li>
          </ul>
          
          <h3>2. 일관성 (Consistency)</h3>
          
          <p>일관된 디자인은 사용자의 학습 부담을 줄이고 예측 가능한 경험을 제공합니다.</p>
          
          <h3>3. 단순성 (Simplicity)</h3>
          
          <p>불필요한 요소를 제거하고 핵심 기능에 집중하세요.</p>
          
          <blockquote>
            <p>"단순함은 궁극의 정교함이다." - 레오나르도 다빈치</p>
          </blockquote>
          
          <h3>4. 접근성 (Accessibility)</h3>
          
          <p>모든 사용자가 제품을 사용할 수 있도록 설계해야 합니다.</p>
          
          <h3>5. 피드백 (Feedback)</h3>
          
          <p>사용자의 행동에 대한 명확한 피드백을 제공하여 현재 상태를 알 수 있게 하세요.</p>
          
          <p>이러한 원칙들을 적용하면 사용자에게 더 나은 경험을 제공할 수 있습니다.</p>
        `,
        author_id: user.id,
        category_id: createdCategories[2].id, // 디자인
        status: 'PUBLISHED',
        is_featured: false,
        is_hero: false,
        thumbnail_url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=400&fit=crop',
        meta_title: 'UX 디자인의 핵심 원칙 5가지',
        meta_description: '효과적인 사용자 경험을 만들기 위한 UX 디자인의 핵심 원칙들을 알아보세요.',
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2일 전
      },
      {
        slug: 'digital-marketing-trends-2024',
        title: '2024년 디지털 마케팅 트렌드',
        content_body: `
          <h2>2024년에 주목해야 할 디지털 마케팅 트렌드</h2>
          
          <p>디지털 마케팅 환경은 계속 진화하고 있습니다. 2024년에는 어떤 트렌드가 마케팅 전략을 주도할까요?</p>
          
          <h3>1. AI 기반 개인화</h3>
          
          <p>인공지능을 활용한 개인화된 콘텐츠와 추천 시스템이 더욱 정교해지고 있습니다.</p>
          
          <h3>2. 음성 검색 최적화</h3>
          
          <p>스마트 스피커와 음성 어시스턴트의 확산으로 음성 검색 최적화가 중요해지고 있습니다.</p>
          
          <h3>3. 비디오 마케팅의 진화</h3>
          
          <ul>
            <li>숏폼 비디오 콘텐츠</li>
            <li>라이브 스트리밍</li>
            <li>인터랙티브 비디오</li>
          </ul>
          
          <h3>4. 지속가능성과 ESG</h3>
          
          <p>소비자들은 브랜드의 사회적 책임에 더 많은 관심을 보이고 있습니다.</p>
          
          <h3>5. 제로파티 데이터 활용</h3>
          
          <p>쿠키리스 시대에 대비하여 사용자가 직접 제공하는 데이터의 중요성이 커지고 있습니다.</p>
          
          <p>이러한 트렌드를 이해하고 적용하면 더 효과적인 마케팅 전략을 수립할 수 있습니다.</p>
        `,
        author_id: user.id,
        category_id: createdCategories[3].id, // 마케팅
        status: 'PUBLISHED',
        is_featured: true,
        is_hero: false,
        thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
        meta_title: '2024년 디지털 마케팅 트렌드',
        meta_description: '2024년에 주목해야 할 디지털 마케팅 트렌드와 전략에 대해 알아보세요.',
        view_count: 0,
        like_count: 0,
        comment_count: 0,
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3일 전
      }
    ]

    const createdContents = []
    for (const contentData of contents) {
      const content = await prisma.blog_contents.upsert({
        where: { slug: contentData.slug },
        update: {
          ...contentData,
          updated_at: new Date()
        },
        create: {
          ...contentData,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
      createdContents.push(content)
      console.log('✅ 컨텐츠 생성 완료:', content.title)
    }

    // 5. 태그-컨텐츠 연결
    const contentTagMappings = [
      { contentIndex: 0, tagSlugs: ['startup', 'growth'] }, // 웰컴 포스트
      { contentIndex: 1, tagSlugs: ['react', 'nextjs', 'typescript', 'prisma'] }, // 웹 개발 스택
      { contentIndex: 2, tagSlugs: ['ux', 'ui'] }, // UX 디자인
      { contentIndex: 3, tagSlugs: ['seo', 'growth'] } // 마케팅 트렌드
    ]

    for (const mapping of contentTagMappings) {
      const content = createdContents[mapping.contentIndex]
      
      for (const tagSlug of mapping.tagSlugs) {
        const tag = createdTags.find(t => t.slug === tagSlug)
        if (tag) {
          await prisma.blog_content_tags.upsert({
            where: {
              content_id_tag_id: {
                content_id: content.id,
                tag_id: tag.id
              }
            },
            update: {},
            create: {
              content_id: content.id,
              tag_id: tag.id
            }
          })
        }
      }
    }
    console.log('✅ 태그-컨텐츠 연결 완료')

    // 6. 샘플 댓글 생성
    const sampleComments = [
      {
        contentId: createdContents[0].id, // 웰컴 포스트
        body: '정말 유익한 블로그네요! 앞으로 자주 방문하겠습니다.',
        isApproved: true
      },
      {
        contentId: createdContents[1].id, // 웹 개발 스택
        body: 'Next.js와 Prisma 조합이 정말 강력하다고 생각합니다. 실제 프로젝트에서도 사용하고 있어요.',
        isApproved: true
      },
      {
        contentId: createdContents[1].id, // 웹 개발 스택
        body: 'TypeScript 도입을 고민하고 있었는데 이 글을 보고 확신이 섰습니다. 감사합니다!',
        isApproved: true
      },
      {
        contentId: createdContents[2].id, // UX 디자인
        body: 'UX 디자인 원칙들이 잘 정리되어 있네요. 특히 일관성 부분이 인상깊었습니다.',
        isApproved: true
      }
    ]

    for (const commentData of sampleComments) {
      await prisma.blog_comments.create({
        data: {
          content_id: commentData.contentId,
          user_id: user.id,
          parent_id: null,
          body: commentData.body,
          is_approved: commentData.isApproved,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    }
    console.log('✅ 샘플 댓글 생성 완료')

    // 7. 컨텐츠 통계 업데이트
    for (const content of createdContents) {
      const commentCount = await prisma.blog_comments.count({
        where: { content_id: content.id }
      })
      
      await prisma.blog_contents.update({
        where: { id: content.id },
        data: {
          comment_count: commentCount,
          view_count: Math.floor(Math.random() * 100) + 50, // 50-150 랜덤 조회수
          like_count: Math.floor(Math.random() * 20) + 5 // 5-25 랜덤 좋아요
        }
      })
    }
    console.log('✅ 컨텐츠 통계 업데이트 완료')

    console.log('\n🎉 블로그 시드 데이터 생성이 완료되었습니다!')
    console.log('\n📊 생성된 데이터:')
    console.log(`- 사용자: 1명 (${user.username})`)
    console.log(`- 카테고리: ${createdCategories.length}개`)
    console.log(`- 태그: ${createdTags.length}개`)
    console.log(`- 블로그 포스트: ${createdContents.length}개`)
    console.log(`- 댓글: ${sampleComments.length}개`)
    
    console.log('\n🌐 다음 URL에서 확인하세요:')
    console.log('- 블로그 메인: http://localhost:3000/blog')
    console.log('- GraphQL Playground: http://localhost:3000/api/graphql')

  } catch (error) {
    console.error('❌ 시드 데이터 생성 중 오류 발생:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })