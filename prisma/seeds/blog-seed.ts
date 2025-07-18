import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting blog seed...')

  // 연결 테스트
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }

  // 카테고리 생성 (직접 테이블명 사용)
  const categories = [
    {
      slug: 'tech',
      name: '기술',
      description: '최신 기술 동향과 개발 관련 정보',
      is_visible: true,
      sort_order: 1
    },
    {
      slug: 'business',
      name: '비즈니스',
      description: '사업과 마케팅에 관한 인사이트',
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
      slug: 'productivity',
      name: '생산성',
      description: '업무 효율성과 도구 활용법',
      is_visible: true,
      sort_order: 4
    },
    {
      slug: 'news',
      name: '뉴스',
      description: '업계 소식과 중요한 발표',
      is_visible: true,
      sort_order: 5
    }
  ]

  console.log('📂 Creating categories...')
  for (const category of categories) {
    try {
      const existing = await prisma.$queryRaw`
        SELECT * FROM blog_categories WHERE slug = ${category.slug} LIMIT 1
      `
      
      if (Array.isArray(existing) && existing.length === 0) {
        await prisma.$executeRaw`
          INSERT INTO blog_categories (slug, name, description, is_visible, sort_order, created_at, updated_at)
          VALUES (${category.slug}, ${category.name}, ${category.description}, ${category.is_visible}, ${category.sort_order}, NOW(), NOW())
        `
        console.log(`✅ Created category: ${category.name}`)
      } else {
        console.log(`⏭️  Category already exists: ${category.name}`)
      }
    } catch (error) {
      console.error(`❌ Failed to create category ${category.name}:`, error)
    }
  }

  // 사용자 확인 (기존 users 테이블 사용)
  let user
  try {
    const users = await prisma.$queryRaw`SELECT * FROM users LIMIT 1`
    
    if (Array.isArray(users) && users.length === 0) {
      console.log('👤 Creating default user...')
      await prisma.$executeRaw`
        INSERT INTO users (email, username, company_name, position, phone_number, avatar, status, created_at, updated_at)
        VALUES ('admin@growsome.com', 'Admin', 'Growsome', 'Content Manager', '010-0000-0000', NULL, 'active', NOW(), NOW())
      `
      
      const newUsers = await prisma.$queryRaw`SELECT * FROM users WHERE email = 'admin@growsome.com' LIMIT 1`
      user = Array.isArray(newUsers) ? newUsers[0] : null
      console.log(`✅ Created user: Admin`)
    } else {
      user = Array.isArray(users) ? users[0] : null
      console.log(`⏭️  Using existing user: ${user?.username || 'Unknown'}`)
    }
    
    if (!user) {
      console.error('❌ Could not find or create user')
      return
    }
  } catch (error) {
    console.error('❌ Failed to handle user:', error)
    return
  }

  // 샘플 블로그 포스트 생성
  const samplePosts = [
    {
      slug: 'getting-started-with-nextjs',
      title: 'Next.js로 시작하는 모던 웹 개발',
      content_body: '<h2>Next.js란?</h2><p>Next.js는 React 기반의 풀스택 웹 프레임워크입니다.</p>',
      categorySlug: 'tech',
      status: 'PUBLISHED',
      is_featured: true,
      is_hero: false,
      meta_title: 'Next.js로 시작하는 모던 웹 개발 가이드',
      meta_description: 'Next.js의 주요 특징과 시작 방법을 알아보고, 모던 웹 개발의 새로운 패러다임을 경험해보세요.'
    },
    {
      slug: 'ux-design-principles',
      title: '사용자 중심의 UX 디자인 원칙',
      content_body: '<h2>UX 디자인이란?</h2><p>User Experience 디자인은 사용자가 제품이나 서비스를 사용할 때의 전체적인 경험을 디자인하는 것입니다.</p>',
      categorySlug: 'design',
      status: 'PUBLISHED',
      is_featured: false,
      is_hero: false,
      meta_title: '사용자 중심의 UX 디자인 원칙과 실무 적용법',
      meta_description: 'UX 디자인의 핵심 원칙들과 실무에 적용할 수 있는 실용적인 팁들을 알아보세요.'
    }
  ]

  console.log('📝 Creating sample blog posts...')
  
  for (const post of samplePosts) {
    try {
      const existing = await prisma.$queryRaw`
        SELECT * FROM blog_contents WHERE slug = ${post.slug} LIMIT 1
      `
      
      if (Array.isArray(existing) && existing.length === 0) {
        // 카테고리 찾기
        const categoryResult = await prisma.$queryRaw`
          SELECT * FROM blog_categories WHERE slug = ${post.categorySlug} LIMIT 1
        `
        
        if (Array.isArray(categoryResult) && categoryResult.length > 0) {
          const category = categoryResult[0] as any
          
          // 먼저 스키마 구조를 확인해보자
          console.log(`📋 Creating post: ${post.title}`)
          
          await prisma.$executeRaw`
            INSERT INTO blog_contents (
              slug, 
              title, 
              content_body, 
              author_id, 
              category_id, 
              status, 
              is_featured, 
              is_hero, 
              meta_title, 
              meta_description, 
              published_at, 
              view_count, 
              like_count, 
              comment_count, 
              created_at, 
              updated_at
            )
            VALUES (
              ${post.slug}, 
              ${post.title}, 
              ${post.content_body}, 
              ${user.id}, 
              ${category.id}, 
              'PUBLISHED', 
              ${post.is_featured}, 
              ${post.is_hero}, 
              ${post.meta_title}, 
              ${post.meta_description}, 
              NOW(), 
              ${Math.floor(Math.random() * 1000) + 100}, 
              ${Math.floor(Math.random() * 50) + 5}, 
              ${Math.floor(Math.random() * 20)}, 
              NOW(), 
              NOW()
            )
          `
          console.log(`✅ Created post: ${post.title}`)
        } else {
          console.log(`❌ Category not found: ${post.categorySlug}`)
        }
      } else {
        console.log(`⏭️  Post already exists: ${post.title}`)
      }
    } catch (error) {
      console.error(`❌ Failed to create post ${post.title}:`, error.message)
      
      // 스키마 정보 확인
      try {
        const columns = await prisma.$queryRaw`
          SELECT column_name, data_type, is_nullable, column_default 
          FROM information_schema.columns 
          WHERE table_name = 'blog_contents' 
          ORDER BY ordinal_position;
        `
        console.log('📋 Table schema:', columns)
      } catch (schemaError) {
        console.error('❌ Failed to get schema:', schemaError)
      }
    }
  }

  console.log('🎉 Blog seed completed!')
  
  // 최종 상태 출력
  try {
    const categoryCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM blog_categories`
    const postCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM blog_contents`
    const userCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users`
    
    const catCount = Array.isArray(categoryCount) ? categoryCount[0]?.count : 0
    const postCnt = Array.isArray(postCount) ? postCount[0]?.count : 0
    const userCnt = Array.isArray(userCount) ? userCount[0]?.count : 0
    
    console.log(`
📊 Final Status:
   🗂️  Categories: ${catCount}
   📝 Posts: ${postCnt}
   👥 Users: ${userCnt}
    `)
  } catch (error) {
    console.error('❌ Failed to get final counts:', error)
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
