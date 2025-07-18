// 데이터베이스 연결 및 데이터 확인 스크립트
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.BLOG_DATABASE_URL
});

async function testDatabase() {
  try {
    console.log('🔌 데이터베이스 연결 중...');
    await client.connect();
    console.log('✅ 데이터베이스 연결 성공');

    // 테이블 존재 확인
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'blog_%'
      ORDER BY table_name;
    `;
    
    const tables = await client.query(tablesQuery);
    console.log('\n📋 블로그 테이블 목록:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    // 카테고리 데이터 확인
    try {
      const categoriesResult = await client.query('SELECT COUNT(*) as count FROM blog_categories');
      console.log(`\n📁 카테고리 개수: ${categoriesResult.rows[0].count}`);
      
      if (parseInt(categoriesResult.rows[0].count) > 0) {
        const categoryList = await client.query('SELECT id, name, slug FROM blog_categories ORDER BY sort_order');
        console.log('   카테고리 목록:');
        categoryList.rows.forEach(cat => {
          console.log(`   - ${cat.id}: ${cat.name} (${cat.slug})`);
        });
      }
    } catch (error) {
      console.log('❌ blog_categories 테이블이 존재하지 않습니다.');
    }

    // 컨텐츠 데이터 확인
    try {
      const contentsResult = await client.query('SELECT COUNT(*) as count FROM blog_contents');
      console.log(`\n📝 컨텐츠 개수: ${contentsResult.rows[0].count}`);
      
      if (parseInt(contentsResult.rows[0].count) > 0) {
        const contentList = await client.query('SELECT id, title, slug, status FROM blog_contents ORDER BY created_at DESC LIMIT 5');
        console.log('   최근 컨텐츠 목록:');
        contentList.rows.forEach(content => {
          console.log(`   - ${content.id}: ${content.title} (${content.slug}) [${content.status}]`);
        });
      }
    } catch (error) {
      console.log('❌ blog_contents 테이블이 존재하지 않습니다.');
    }

    // 사용자 데이터 확인
    try {
      const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
      console.log(`\n👤 사용자 개수: ${usersResult.rows[0].count}`);
      
      if (parseInt(usersResult.rows[0].count) > 0) {
        const userList = await client.query('SELECT id, username, email FROM users LIMIT 3');
        console.log('   사용자 목록:');
        userList.rows.forEach(user => {
          console.log(`   - ${user.id}: ${user.username} (${user.email})`);
        });
      }
    } catch (error) {
      console.log('❌ users 테이블이 존재하지 않습니다.');
    }

    // GraphQL 테스트 쿼리 실행
    console.log('\n🔍 GraphQL 테스트 쿼리 실행 중...');
    
    try {
      const testQuery = `
        SELECT 
          bc.id, bc.slug, bc.title, bc.status,
          u.username, cat.name as category_name
        FROM blog_contents bc
        LEFT JOIN users u ON bc.author_id = u.id
        LEFT JOIN blog_categories cat ON bc.category_id = cat.id
        WHERE bc.status = 'PUBLISHED'
        LIMIT 3
      `;
      
      const testResult = await client.query(testQuery);
      console.log('✅ GraphQL 스타일 쿼리 성공:');
      testResult.rows.forEach(row => {
        console.log(`   - ${row.title} by ${row.username} in ${row.category_name}`);
      });
      
    } catch (error) {
      console.log('❌ GraphQL 스타일 쿼리 실패:', error.message);
    }

    console.log('\n🎉 데이터베이스 테스트 완료!');

  } catch (error) {
    console.error('❌ 데이터베이스 오류:', error.message);
  } finally {
    await client.end();
  }
}

// 필요한 테이블 생성 및 데이터 삽입 함수
async function setupDatabase() {
  try {
    await client.connect();
    
    // 테이블 생성
    console.log('📋 테이블 생성 중...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_categories (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        is_visible BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_contents (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        content_body TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'PRIVATE')),
        is_featured BOOLEAN DEFAULT false,
        is_hero BOOLEAN DEFAULT false,
        thumbnail_url VARCHAR(500),
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        meta_title VARCHAR(500),
        meta_description VARCHAR(1000),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP WITH TIME ZONE,
        FOREIGN KEY (author_id) REFERENCES users(id),
        FOREIGN KEY (category_id) REFERENCES blog_categories(id)
      );
    `);

    // 기본 데이터 삽입
    console.log('📝 기본 데이터 삽입 중...');
    
    // 카테고리 삽입
    await client.query(`
      INSERT INTO blog_categories (slug, name, description, is_visible, sort_order) VALUES
      ('web-development', '웹 개발', '웹 개발 관련 최신 트렌드와 기술', true, 1),
      ('marketing', '마케팅', '디지털 마케팅 전략과 인사이트', true, 2),
      ('design', '디자인', 'UI/UX 디자인과 브랜딩', true, 3),
      ('business', '비즈니스', '스타트업과 비즈니스 성장 전략', true, 4)
      ON CONFLICT (slug) DO NOTHING;
    `);

    // 테스트 사용자 삽입 (이미 존재하지 않는 경우)
    await client.query(`
      INSERT INTO users (email, username, company_name, position, phone_number, status)
      VALUES ('test@example.com', 'Test User', 'Test Company', 'Developer', '010-1234-5678', 'active')
      ON CONFLICT (email) DO NOTHING;
    `);

    // 블로그 컨텐츠 삽입
    await client.query(`
      INSERT INTO blog_contents (
        slug, title, content_body, author_id, category_id, status, is_featured, is_hero, 
        thumbnail_url, view_count, like_count, comment_count, meta_title, meta_description, published_at
      ) VALUES
      (
        'nextjs-15-new-features',
        'Next.js 15의 새로운 기능들: 개발자가 알아야 할 핵심 업데이트',
        '<h2>Next.js 15 주요 업데이트</h2><p>Next.js 15가 드디어 출시되었습니다! 이번 버전에서는 성능 향상과 개발 경험 개선에 중점을 두었습니다.</p>',
        (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
        (SELECT id FROM blog_categories WHERE slug = 'web-development' LIMIT 1),
        'PUBLISHED',
        true,
        true,
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&auto=format',
        150,
        12,
        3,
        'Next.js 15 새로운 기능 완벽 가이드',
        'Next.js 15의 주요 업데이트와 새로운 기능들을 자세히 알아보세요.',
        NOW() - INTERVAL '1 day'
      ),
      (
        'prisma-graphql-blog-system',
        'Prisma와 GraphQL로 구축하는 현대적인 블로그 시스템',
        '<h2>현대적인 블로그 시스템 구축하기</h2><p>이 글에서는 Prisma ORM과 GraphQL을 활용해 확장 가능한 블로그 시스템을 구축하는 방법을 다룹니다.</p>',
        (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
        (SELECT id FROM blog_categories WHERE slug = 'web-development' LIMIT 1),
        'PUBLISHED',
        false,
        false,
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop&auto=format',
        89,
        7,
        2,
        'Prisma GraphQL 블로그 시스템 구축 가이드',
        'Prisma ORM과 GraphQL을 활용해 현대적이고 확장 가능한 블로그 시스템을 구축하는 완벽한 가이드',
        NOW() - INTERVAL '3 days'
      )
      ON CONFLICT (slug) DO NOTHING;
    `);

    console.log('✅ 데이터베이스 설정 완료!');
    
  } catch (error) {
    console.error('❌ 데이터베이스 설정 실패:', error.message);
  } finally {
    await client.end();
  }
}

// 명령줄 인수에 따라 실행할 함수 결정
if (process.argv.includes('--setup')) {
  setupDatabase();
} else {
  testDatabase();
}
