const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const prisma = new PrismaClient();

async function restoreBlogContent() {
  try {
    console.log('기존 블로그 컨텐츠 복원 시작...');

    // content/blog 디렉토리 읽기
    const blogDir = path.join(process.cwd(), 'content', 'blog');
    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

    console.log(`발견된 마크다운 파일: ${files.length}개`);

    for (const file of files) {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content: markdownContent } = matter(content);

      console.log(`처리 중: ${file}`);
      console.log('Frontmatter:', frontmatter);

      // 기존 사용자 확인 또는 생성
      let user = await prisma.user.findFirst({
        where: { email: 'admin@growsome.kr' }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'admin@growsome.kr',
            username: 'admin',
            password: 'hashed_password_here',
            phoneNumber: '010-0000-0000',
            role: 'ADMIN'
          }
        });
        console.log('관리자 사용자 생성됨');
      }

      // 카테고리 확인 또는 생성
      let category = await prisma.blog_categories.findFirst({
        where: { name: frontmatter.category || 'AI 기술' }
      });

      if (!category) {
        category = await prisma.blog_categories.create({
          data: {
            name: frontmatter.category || 'AI 기술',
            slug: frontmatter.category?.toLowerCase().replace(/\s+/g, '-') || 'ai-technology',
            description: `${frontmatter.category || 'AI 기술'} 관련 글`,
            sort_order: 1,
            is_visible: true
          }
        });
        console.log(`카테고리 생성됨: ${category.name}`);
      }

      // 태그 처리
      const tags = frontmatter.tags || [];
      const tagIds = [];

      for (const tagName of tags) {
        let tag = await prisma.blog_tags.findFirst({
          where: { name: tagName }
        });

        if (!tag) {
                  tag = await prisma.blog_tags.create({
          data: {
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-')
          }
        });
          console.log(`태그 생성됨: ${tag.name}`);
        }
        tagIds.push(tag.id);
      }

      // 블로그 컨텐츠 생성
      const blogContent = await prisma.blog_contents.create({
        data: {
          title: frontmatter.title,
          slug: frontmatter.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '') || `blog-${Date.now()}`,
          content_body: markdownContent,
          thumbnail_url: frontmatter.image || '/images/blog/default.jpg',
          status: 'PUBLISHED',
          is_featured: true,
          is_hero: false,
          view_count: 0,
          like_count: 0,
          comment_count: 0,
          published_at: frontmatter.date ? new Date(frontmatter.date) : new Date(),
          author_id: user.id,
          category_id: category.id
        }
      });

      console.log(`블로그 컨텐츠 생성됨: ${blogContent.title}`);

      // 태그 연결
      for (const tagId of tagIds) {
        await prisma.blog_content_tags.create({
          data: {
            content_id: blogContent.id,
            tag_id: tagId
          }
        });
      }

      console.log(`태그 연결 완료: ${tags.join(', ')}`);
    }

    console.log('모든 블로그 컨텐츠 복원 완료!');

  } catch (error) {
    console.error('블로그 컨텐츠 복원 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreBlogContent(); 