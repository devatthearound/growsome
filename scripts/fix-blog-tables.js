// 데이터베이스 상태 확인 및 수정 스크립트 (수정된 버전)
// scripts/fix-blog-tables.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndFixTables() {
  try {
    console.log('🔍 데이터베이스 상태 확인 중...');

    // 1. 기존 테이블 확인
    const tablesResult = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE 'blog_%'
      ORDER BY table_name;
    `);

    console.log('📋 발견된 블로그 테이블:', tablesResult);

    // 2. 모든 블로그 테이블 삭제 (깔끔하게 다시 시작)
    console.log('🗑️  기존 블로그 테이블 정리 중...');
    
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS blog_content_tags CASCADE;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS blog_comments CASCADE;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS blog_likes CASCADE;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS blog_contents CASCADE;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS blog_categories CASCADE;');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS blog_tags CASCADE;');

    console.log('✅ 기존 테이블 정리 완료');

    // 3. 새로운 테이블 개별 생성
    console.log('🏗️  새로운 블로그 테이블 생성 중...');

    // 블로그 카테고리 테이블
    await prisma.$executeRawUnsafe(`
      CREATE TABLE blog_categories (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_visible BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 블로그 태그 테이블  
    await prisma.$executeRawUnsafe(`
      CREATE TABLE blog_tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL
      );
    `);

    // 블로그 컨텐츠 테이블
    await prisma.$executeRawUnsafe(`
      CREATE TABLE blog_contents (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content_body TEXT NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id),
        category_id INTEGER NOT NULL REFERENCES blog_categories(id),
        status VARCHAR(20) DEFAULT 'DRAFT',
        is_featured BOOLEAN DEFAULT FALSE,
        is_hero BOOLEAN DEFAULT FALSE,
        thumbnail_url TEXT,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        meta_title TEXT,
        meta_description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        published_at TIMESTAMP
      );
    `);

    // 블로그 컨텐츠-태그 관계 테이블
    await prisma.$executeRawUnsafe(`
      CREATE TABLE blog_content_tags (
        content_id INTEGER NOT NULL REFERENCES blog_contents(id) ON DELETE CASCADE,
        tag_id INTEGER NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
        PRIMARY KEY (content_id, tag_id)
      );
    `);

    // 블로그 댓글 테이블
    await prisma.$executeRawUnsafe(`
      CREATE TABLE blog_comments (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL REFERENCES blog_contents(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        parent_id INTEGER REFERENCES blog_comments(id),
        body TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 블로그 좋아요 테이블
    await prisma.$executeRawUnsafe(`
      CREATE TABLE blog_likes (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL REFERENCES blog_contents(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(content_id, user_id)
      );
    `);

    // 인덱스 생성
    await prisma.$executeRawUnsafe('CREATE INDEX idx_blog_contents_slug ON blog_contents(slug);');
    await prisma.$executeRawUnsafe('CREATE INDEX idx_blog_contents_status ON blog_contents(status);');
    await prisma.$executeRawUnsafe('CREATE INDEX idx_blog_contents_published_at ON blog_contents(published_at);');
    await prisma.$executeRawUnsafe('CREATE INDEX idx_blog_contents_category_id ON blog_contents(category_id);');

    console.log('✅ 블로그 테이블 생성 완료');

    // 4. 기본 데이터 삽입
    console.log('📝 기본 데이터 삽입 중...');

    // 블로그 카테고리 생성 (개별 INSERT)
    await prisma.$executeRawUnsafe(`
      INSERT INTO blog_categories (slug, name, description, is_visible, sort_order)
      VALUES ('tech', '기술', '개발 및 기술 관련 포스트', TRUE, 1)
    `);
    await prisma.$executeRawUnsafe(`
      INSERT INTO blog_categories (slug, name, description, is_visible, sort_order)
      VALUES ('marketing', '마케팅', '마케팅 및 비즈니스 인사이트', TRUE, 2)
    `);
    await prisma.$executeRawUnsafe(`
      INSERT INTO blog_categories (slug, name, description, is_visible, sort_order)
      VALUES ('design', '디자인', 'UI/UX 및 디자인 관련 글', TRUE, 3)
    `);
    await prisma.$executeRawUnsafe(`
      INSERT INTO blog_categories (slug, name, description, is_visible, sort_order)
      VALUES ('startup', '스타트업', '창업 및 스타트업 이야기', TRUE, 4)
    `);

    // 블로그 태그 생성 (개별 INSERT)
    const tags = [
      ['Next.js', 'nextjs'],
      ['React', 'react'],
      ['JavaScript', 'javascript'],
      ['TypeScript', 'typescript'],
      ['GraphQL', 'graphql'],
      ['Prisma', 'prisma'],
      ['마케팅', 'marketing'],
      ['SEO', 'seo'],
      ['개발', 'development'],
      ['프론트엔드', 'frontend']
    ];

    for (const [name, slug] of tags) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO blog_tags (name, slug) VALUES ($1, $2)
      `, name, slug);
    }

    // 사용자 확인/생성
    let user = await prisma.$queryRawUnsafe(`
      SELECT id FROM users LIMIT 1
    `);

    if (!user || user.length === 0) {
      // 기본 사용자 생성 (필수 필드만 사용)
      console.log('👥 사용자가 없어서 기본 사용자를 생성합니다...');
      
      try {
        // 최소한의 필드만 사용해서 사용자 생성
        await prisma.$executeRawUnsafe(`
          INSERT INTO users (email, username, phone_number) 
          VALUES ('blog@growsome.com', 'Blog Writer', '010-0000-0000')
        `);
        
        user = await prisma.$queryRawUnsafe(`
          SELECT id FROM users WHERE email = 'blog@growsome.com' LIMIT 1
        `);
        
        console.log('✅ 기본 사용자 생성 완료 (ID:', user[0]?.id, ')');
      } catch (userError) {
        console.log('⚠️  사용자 생성 실패, 다른 방법 시도 중...');
        
        // 다른 방법: password 필드 포함
        try {
          await prisma.$executeRawUnsafe(`
            INSERT INTO users (email, password, username, phone_number) 
            VALUES ('blog@growsome.com', 'temp123', 'Blog Writer', '010-0000-0000')
          `);
          
          user = await prisma.$queryRawUnsafe(`
            SELECT id FROM users WHERE email = 'blog@growsome.com' LIMIT 1
          `);
          
          console.log('✅ 기본 사용자 생성 완료 (ID:', user[0]?.id, ')');
        } catch (finalError) {
          console.error('❌ 사용자 생성 실패:', finalError.message);
          throw new Error('사용자를 생성할 수 없습니다. 수동으로 사용자를 등록해주세요.');
        }
      }
    } else {
      console.log('ℹ️  기존 사용자 ID', user[0].id, '를 블로그 작성자로 사용합니다.');
    }

    const userId = user[0]?.id;
    const categoryResult = await prisma.$queryRawUnsafe(`
      SELECT id FROM blog_categories WHERE slug = 'tech' LIMIT 1
    `);
    const categoryId = categoryResult[0]?.id;

    // 테스트 블로그 포스트 생성
    await prisma.$executeRawUnsafe(`
      INSERT INTO blog_contents (
        slug, title, content_body, author_id, category_id, status, 
        is_featured, thumbnail_url, view_count, like_count, comment_count,
        meta_title, meta_description, published_at, created_at, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16
      )
    `, 
      'nextjs-15-new-features',
      'Next.js 15의 새로운 기능들',
      '<h2>Next.js 15가 출시되었습니다!</h2><p>Next.js 15는 많은 흥미로운 새로운 기능들을 선보입니다. 이번 포스트에서는 주요 업데이트를 살펴보겠습니다.</p><h3>1. React 19 지원</h3><p>Next.js 15는 React 19를 완전히 지원합니다. 새로운 React Compiler와 함께 더욱 빠른 성능을 제공합니다.</p><h3>2. 향상된 App Router</h3><p>App Router의 성능이 크게 개선되었으며, 새로운 라우팅 기능들이 추가되었습니다.</p><pre><code>// app/layout.tsx\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode\n}) {\n  return (\n    <html lang="ko">\n      <body>{children}</body>\n    </html>\n  )\n}</code></pre><h3>3. 서버 컴포넌트 개선</h3><p>서버 컴포넌트의 성능과 개발 경험이 크게 향상되었습니다.</p><blockquote><p>Next.js 15는 현대적인 웹 개발의 새로운 표준을 제시합니다.</p></blockquote><p>더 자세한 내용은 <a href="https://nextjs.org">Next.js 공식 사이트</a>에서 확인하실 수 있습니다.</p>',
      userId, categoryId, 'PUBLISHED',
      true, 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=400&fit=crop&auto=format',
      125, 15, 3,
      'Next.js 15의 새로운 기능들 - 완전 가이드',
      'Next.js 15의 주요 업데이트와 새로운 기능들에 대해 자세히 알아보세요. React 19 지원, App Router 개선 등.',
      new Date(), new Date(), new Date()
    );

    // 두 번째 테스트 포스트
    await prisma.$executeRawUnsafe(`
      INSERT INTO blog_contents (
        slug, title, content_body, author_id, category_id, status,
        thumbnail_url, view_count, like_count, comment_count,
        published_at, created_at, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13
      )
    `, 
      'react-performance-optimization',
      'React 성능 최적화 가이드',
      '<h2>React 애플리케이션 성능 최적화</h2><p>React 애플리케이션의 성능을 향상시키는 다양한 방법들을 알아보겠습니다.</p><h3>1. useMemo와 useCallback 활용</h3><p>불필요한 리렌더링을 방지하기 위해 메모이제이션을 활용하세요.</p><h3>2. React.memo 사용</h3><p>컴포넌트 레벨에서의 최적화를 위해 React.memo를 활용할 수 있습니다.</p><h3>3. 코드 스플리팅</h3><p>Dynamic import를 통해 번들 크기를 줄이고 로딩 성능을 개선하세요.</p>',
      userId, categoryId, 'PUBLISHED',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=400&fit=crop&auto=format',
      89, 8, 1,
      new Date(), new Date(), new Date()
    );

    // 컨텐츠-태그 관계 생성
    const contentIds = await prisma.$queryRawUnsafe(`
      SELECT id FROM blog_contents WHERE slug IN ('nextjs-15-new-features', 'react-performance-optimization')
    `);
    
    const tagIds = await prisma.$queryRawUnsafe(`
      SELECT id, slug FROM blog_tags WHERE slug IN ('nextjs', 'react', 'javascript', 'frontend')
    `);

    if (contentIds.length > 0 && tagIds.length > 0) {
      for (const content of contentIds) {
        for (const tag of tagIds.slice(0, 3)) {
          await prisma.$executeRawUnsafe(`
            INSERT INTO blog_content_tags (content_id, tag_id)
            VALUES ($1, $2)
          `, content.id, tag.id);
        }
      }
    }

    // 5. 최종 확인
    const finalCheck = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE 'blog_%'
      ORDER BY table_name;
    `);

    console.log('✅ 최종 생성된 테이블:', finalCheck);

    const contentCount = await prisma.$queryRawUnsafe(`
      SELECT COUNT(*) as count FROM blog_contents;
    `);

    console.log('📊 생성된 컨텐츠 수:', contentCount[0]?.count);

    console.log('🎉 블로그 시스템 초기화 완료!');
    console.log('🌐 테스트 URL: http://localhost:3000/blog/nextjs-15-new-features');
    console.log('🐛 디버깅 URL: http://localhost:3000/blog/debug');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    
    // 구체적인 오류 정보 출력
    if (error.code) {
      console.error('오류 코드:', error.code);
    }
    if (error.meta) {
      console.error('오류 메타:', error.meta);
    }
  }
}

async function main() {
  await checkAndFixTables();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
