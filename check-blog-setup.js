// 블로그 포스트 추가를 위한 간단한 실행 스크립트
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

console.log('Growsome 블로그 포스트 추가를 시작합니다...');

// 스크립트 실행 안내
console.log('\n다음 명령어를 터미널에서 실행해주세요:');
console.log('cd /Users/hyunjucho/Documents/GitHub/growsome');
console.log('node add-blog-posts.js');
console.log('\n또는');
console.log('npm run prisma:seed');
console.log('\n스크립트가 성공적으로 실행되면 7개의 블로그 포스트가 추가됩니다.');

// 현재 블로그 포스트 수 확인
async function checkCurrentPosts() {
  try {
    const count = await prisma.blog_contents.count();
    console.log(`\n현재 데이터베이스에 ${count}개의 블로그 포스트가 있습니다.`);
  } catch (error) {
    console.log('\n데이터베이스 연결을 확인해주세요.');
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentPosts();
