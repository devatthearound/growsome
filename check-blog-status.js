const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBlogStatus() {
  try {
    console.log('📊 블로그 현황 확인 중...\n');

    // 블로그 포스트 개수 확인
    const totalPosts = await prisma.blog_contents.count();
    console.log(`📝 총 블로그 포스트: ${totalPosts}개`);

    // 포스트별 상세 정보
    const posts = await prisma.blog_contents.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        is_hero: true,
        is_featured: true,
        view_count: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    console.log('\n📋 블로그 포스트 목록:');
    console.log('----------------------------------------');
    
    posts.forEach((post, index) => {
      const status = post.status === 'PUBLISHED' ? '✅' : '⏸️';
      const hero = post.is_hero ? '🦸' : '';
      const featured = post.is_featured ? '⭐' : '';
      
      console.log(`${index + 1}. ${status} ${hero}${featured} ${post.title}`);
      console.log(`   🔗 Slug: ${post.slug}`);
      console.log(`   👀 조회수: ${post.view_count || 0}`);
      console.log(`   📅 생성일: ${post.created_at.toLocaleDateString('ko-KR')}`);
      console.log('');
    });

    // 카테고리 확인
    const categories = await prisma.blog_categories.count();
    console.log(`📂 카테고리: ${categories}개`);

    // 태그 확인
    const tags = await prisma.blog_tags.count();
    console.log(`🏷️ 태그: ${tags}개`);

    // 상태별 포스트 수
    const publishedPosts = await prisma.blog_contents.count({
      where: { status: 'PUBLISHED' }
    });
    
    const draftPosts = await prisma.blog_contents.count({
      where: { status: 'DRAFT' }
    });

    console.log(`\n📊 상태별 현황:`);
    console.log(`   ✅ 게시됨: ${publishedPosts}개`);
    console.log(`   📝 초안: ${draftPosts}개`);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBlogStatus();