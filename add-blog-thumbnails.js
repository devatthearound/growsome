const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addBlogThumbnails() {
  try {
    console.log('블로그 포스트에 썸네일 이미지 추가 중...');

    // 각 블로그 포스트에 썸네일 URL 추가
    const updates = [
      {
        slug: '50-billion-rd-team-left-wordpress-detailed',
        thumbnail_url: '/images/blog/50billion-wordpress-migration.png',
        title: '50억 규모 R&D팀이 워드프레스를 포기한 진짜 이유'
      },
      {
        slug: 'startup-ai-adoption-complete-guide-2025',
        thumbnail_url: '/images/blog/startup-ai-adoption-guide.png',
        title: '2025년 스타트업이 꼭 알아야 할 AI 도입 가이드 (완전판)'
      },
      {
        slug: 'nextjs-vs-react-2025-complete',
        thumbnail_url: '/images/blog/nextjs-vs-react-2025.png',
        title: 'Next.js vs React: 2025년 완벽 선택 가이드'
      }
    ];

    for (const update of updates) {
      const result = await prisma.blog_contents.updateMany({
        where: { 
          OR: [
            { slug: update.slug },
            { title: { contains: update.title.substring(0, 20) } }
          ]
        },
        data: {
          thumbnail_url: update.thumbnail_url
        }
      });
      
      console.log(`${update.title} 썸네일 업데이트: ${result.count}개 포스트`);
    }

    // 블로그 이미지 폴더 생성 (없다면)
    console.log('\n블로그 이미지 폴더 구조 확인...');
    console.log('다음 경로에 이미지를 저장하세요:');
    console.log('- /Users/hyunjucho/Documents/GitHub/growsome/public/images/blog/');
    
    console.log('\n필요한 이미지 파일들:');
    updates.forEach(update => {
      console.log(`- ${update.thumbnail_url}`);
    });

    console.log('\n썸네일 이미지 추가가 완료되었습니다!');

  } catch (error) {
    console.error('썸네일 추가 중 오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addBlogThumbnails();
