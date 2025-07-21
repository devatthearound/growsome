const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetBlogStats() {
  try {
    console.log('블로그 통계 초기화 시작...');
    
    const result = await prisma.blog_contents.updateMany({
      data: {
        view_count: 0,
        like_count: 0,
        comment_count: 0
      }
    });
    
    console.log(`✅ ${result.count}개의 블로그 글 통계가 초기화되었습니다.`);
    console.log('- 뷰 수: 0');
    console.log('- 좋아요 수: 0');
    console.log('- 댓글 수: 0');
    
  } catch (error) {
    console.error('❌ 블로그 통계 초기화 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetBlogStats(); 