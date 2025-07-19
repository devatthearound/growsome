// scripts/clear-comments.js
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearComments() {
  try {
    console.log('댓글 데이터 삭제 시작...');
    
    // 모든 댓글 삭제
    const deletedComments = await prisma.blog_comments.deleteMany({});
    console.log(`삭제된 댓글 수: ${deletedComments.count}`);
    
    // 모든 좋아요 삭제 (선택사항)
    const deletedLikes = await prisma.blog_likes.deleteMany({});
    console.log(`삭제된 좋아요 수: ${deletedLikes.count}`);
    
    // 포스트의 댓글 카운트와 좋아요 카운트 재설정
    await prisma.blog_contents.updateMany({
      data: {
        comment_count: 0,
        like_count: 0
      }
    });
    
    console.log('✅ 댓글 데이터 삭제 완료!');
    console.log('✅ 포스트 카운트 재설정 완료!');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearComments();
