const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 랜덤 숫자 생성 함수
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function setRandomBlogStats() {
  try {
    console.log('블로그 통계 랜덤 설정 시작...');
    
    // 모든 블로그 글 가져오기
    const blogPosts = await prisma.blog_contents.findMany({
      select: {
        id: true,
        title: true
      }
    });
    
    console.log(`📝 ${blogPosts.length}개의 블로그 글을 찾았습니다.`);
    
    // 각 글에 랜덤 통계 설정
    for (const post of blogPosts) {
      const viewCount = getRandomInt(10, 99); // 10~99회
      const likeCount = getRandomInt(0, 9);   // 0~9개
      
      await prisma.blog_contents.update({
        where: { id: post.id },
        data: {
          view_count: viewCount,
          like_count: likeCount,
          comment_count: 0 // 댓글은 0으로 유지
        }
      });
      
      console.log(`✅ "${post.title}" - 뷰: ${viewCount}, 좋아요: ${likeCount}`);
    }
    
    console.log('\n🎉 모든 블로그 글의 통계가 랜덤하게 설정되었습니다!');
    console.log('- 뷰 수: 10~99회');
    console.log('- 좋아요 수: 0~9개');
    console.log('- 댓글 수: 0개');
    
  } catch (error) {
    console.error('❌ 블로그 통계 설정 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setRandomBlogStats(); 