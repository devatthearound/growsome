// prisma/seed-simple.ts - 가장 간단한 시드 스크립트
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('간단한 데이터베이스 시드 시작...')

  try {
    // 기존 데이터 정리
    await prisma.blog_content_tags.deleteMany()
    await prisma.blog_likes.deleteMany()
    await prisma.blog_comments.deleteMany()
    await prisma.blog_contents.deleteMany()
    await prisma.blog_categories.deleteMany()
    await prisma.blog_tags.deleteMany()
    await prisma.user.deleteMany()

    console.log('기존 데이터 정리 완료')

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

    console.log(`사용자 생성: ${user1.username}`)

    // 카테고리 생성
    const category = await prisma.blog_categories.create({
      data: {
        slug: 'tech',
        name: '기술',
        description: '기술 관련 글',
        is_visible: true,
        sort_order: 1
      }
    })

    console.log(`카테고리 생성: ${category.name}`)

    // Raw SQL로 직접 컨텐츠 삽입 시도
    try {
      await prisma.$executeRaw`
        INSERT INTO blog_contents (
          slug, title, content_body, author_id, category_id, 
          status, is_featured, is_hero, published_at, 
          view_count, like_count, comment_count,
          created_at, updated_at
        ) VALUES (
          'test-post',
          '테스트 포스트',
          '# 테스트 포스트\n\n이것은 테스트입니다.',
          ${user1.id},
          ${category.id},
          'PUBLISHED',
          false,
          false,
          NOW(),
          0,
          0,
          0,
          NOW(),
          NOW()
        )
      `
      console.log('Raw SQL로 컨텐츠 생성 성공!')
    } catch (error) {
      console.error('Raw SQL 컨텐츠 생성 실패:', error instanceof Error ? error.message : 'Unknown error')
      
      // 실패 시 기본값으로 다시 시도
      try {
        await prisma.$executeRaw`
          INSERT INTO blog_contents (
            slug, title, content_body, author_id, category_id, 
            is_featured, is_hero, published_at, 
            view_count, like_count, comment_count,
            created_at, updated_at
          ) VALUES (
            'test-post',
            '테스트 포스트',
            '# 테스트 포스트\n\n이것은 테스트입니다.',
            ${user1.id},
            ${category.id},
            false,
            false,
            NOW(),
            0,
            0,
            0,
            NOW(),
            NOW()
          )
        `
        console.log('기본값으로 컨텐츠 생성 성공!')
      } catch (error2) {
        console.error('기본값 컨텐츠 생성도 실패:', error2 instanceof Error ? error2.message : 'Unknown error')
      }
    }

    // 생성된 컨텐츠 확인
    const contents = await prisma.blog_contents.findMany()
    console.log(`생성된 컨텐츠 수: ${contents.length}`)
    
    if (contents.length > 0) {
      console.log('첫 번째 컨텐츠:', {
        id: contents[0].id,
        title: contents[0].title,
        status: contents[0].status
      })
    }

    console.log('✅ 간단한 시드 완료!')

  } catch (error) {
    console.error('❌ 시드 중 오류:', error instanceof Error ? error.message : 'Unknown error')
  } finally {
    await prisma.$disconnect()
  }
}

main()