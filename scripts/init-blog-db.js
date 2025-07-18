// 블로그 시스템 데이터베이스 초기화 및 샘플 데이터 생성
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// 데이터베이스 연결 설정
const client = new Client({
  connectionString: process.env.BLOG_DATABASE_URL
});

// 테이블 생성 SQL
const createTablesSQL = `
-- 블로그 카테고리 테이블
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

-- 블로그 컨텐츠 테이블
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

-- 블로그 태그 테이블
CREATE TABLE IF NOT EXISTS blog_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- 컨텐츠-태그 관계 테이블
CREATE TABLE IF NOT EXISTS blog_content_tags (
  content_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (content_id, tag_id),
  FOREIGN KEY (content_id) REFERENCES blog_contents(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE
);

-- 블로그 댓글 테이블
CREATE TABLE IF NOT EXISTS blog_comments (
  id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  parent_id INTEGER,
  body TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES blog_contents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES blog_comments(id)
);

-- 블로그 좋아요 테이블
CREATE TABLE IF NOT EXISTS blog_likes (
  id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(content_id, user_id),
  FOREIGN KEY (content_id) REFERENCES blog_contents(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_blog_contents_slug ON blog_contents(slug);
CREATE INDEX IF NOT EXISTS idx_blog_contents_status ON blog_contents(status);
CREATE INDEX IF NOT EXISTS idx_blog_contents_author ON blog_contents(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_contents_category ON blog_contents(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_contents_published ON blog_contents(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_visible ON blog_categories(is_visible);
`;

// 샘플 데이터 삽입 SQL
const insertSampleDataSQL = `
-- 카테고리 샘플 데이터
INSERT INTO blog_categories (slug, name, description, is_visible, sort_order) VALUES
('web-development', '웹 개발', '웹 개발 관련 최신 트렌드와 기술', true, 1),
('marketing', '마케팅', '디지털 마케팅 전략과 인사이트', true, 2),
('design', '디자인', 'UI/UX 디자인과 브랜딩', true, 3),
('business', '비즈니스', '스타트업과 비즈니스 성장 전략', true, 4),
('tech-trends', '기술 트렌드', '최신 기술 동향과 미래 전망', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- 테스트 사용자가 없다면 생성
INSERT INTO users (email, username, company_name, position, phone_number, status)
VALUES ('test@example.com', 'Test User', 'Test Company', 'Developer', '010-1234-5678', 'active')
ON CONFLICT (email) DO NOTHING;

-- 블로그 컨텐츠 샘플 데이터
INSERT INTO blog_contents (
  slug, title, content_body, author_id, category_id, status, is_featured, is_hero, 
  thumbnail_url, view_count, like_count, comment_count, meta_title, meta_description, published_at
) VALUES
(
  'nextjs-15-new-features',
  'Next.js 15의 새로운 기능들: 개발자가 알아야 할 핵심 업데이트',
  '<h2>Next.js 15 주요 업데이트</h2>
<p>Next.js 15가 드디어 출시되었습니다! 이번 버전에서는 성능 향상과 개발 경험 개선에 중점을 두었습니다.</p>

<h3>1. React 19 지원</h3>
<p>Next.js 15는 React 19와 완벽하게 호환됩니다. 새로운 React Compiler와 Server Components의 향상된 기능을 활용할 수 있습니다.</p>

<h3>2. 향상된 App Router</h3>
<p>App Router의 성능이 크게 개선되었으며, 새로운 caching 전략이 도입되었습니다:</p>
<ul>
<li>개선된 동적 라우팅</li>
<li>더 나은 SEO 최적화</li>
<li>향상된 메타데이터 API</li>
</ul>

<h3>3. Turbopack 안정화</h3>
<p>Turbopack이 더욱 안정화되어 빌드 시간이 평균 30% 단축되었습니다.</p>

<pre><code>// next.config.js 설정 예시
module.exports = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js"
        }
      }
    }
  }
}
</code></pre>

<h3>4. 새로운 이미지 최적화</h3>
<p>Image 컴포넌트가 개선되어 더 빠른 로딩과 더 나은 성능을 제공합니다.</p>

<blockquote>
<p>"Next.js 15는 개발자 경험과 성능 모든 면에서 한 단계 더 발전했습니다." - Vercel 팀</p>
</blockquote>

<h3>마이그레이션 가이드</h3>
<p>기존 Next.js 14에서 15로 업그레이드하는 방법:</p>
<ol>
<li>패키지 업데이트: <code>npm install next@latest</code></li>
<li>React 19 설치: <code>npm install react@19 react-dom@19</code></li>
<li>설정 파일 검토 및 업데이트</li>
<li>deprecated API 대체</li>
</ol>

<p>더 자세한 정보는 <a href="https://nextjs.org/docs">공식 문서</a>를 참조하세요.</p>',
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
  'Next.js 15의 주요 업데이트와 새로운 기능들을 자세히 알아보세요. React 19 지원, 향상된 App Router, Turbopack 안정화 등',
  NOW() - INTERVAL '1 day'
),
(
  'prisma-graphql-blog-system',
  'Prisma와 GraphQL로 구축하는 현대적인 블로그 시스템',
  '<h2>현대적인 블로그 시스템 구축하기</h2>
<p>이 글에서는 Prisma ORM과 GraphQL을 활용해 확장 가능한 블로그 시스템을 구축하는 방법을 다룹니다.</p>

<h3>기술 스택</h3>
<ul>
<li><strong>Database:</strong> PostgreSQL</li>
<li><strong>ORM:</strong> Prisma</li>
<li><strong>API:</strong> GraphQL (Apollo Server)</li>
<li><strong>Frontend:</strong> Next.js + TypeScript</li>
<li><strong>Styling:</strong> Tailwind CSS</li>
</ul>

<h3>데이터베이스 스키마 설계</h3>
<p>블로그 시스템의 핵심 엔티티들을 설계해보겠습니다:</p>

<pre><code>// schema.prisma
model BlogCategory {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  name        String
  description String?
  isVisible   Boolean   @default(true)
  sortOrder   Int       @default(0)
  
  contents    Content[]
  
  @@map("blog_categories")
}

model Content {
  id           Int           @id @default(autoincrement())
  slug         String        @unique
  title        String
  contentBody  String
  authorId     Int
  categoryId   Int
  status       ContentStatus @default(DRAFT)
  thumbnailUrl String?
  
  author       User          @relation(fields: [authorId], references: [id])
  category     BlogCategory  @relation(fields: [categoryId], references: [id])
  
  @@map("blog_contents")
}
</code></pre>

<h3>GraphQL 스키마 정의</h3>
<p>타입 안전성을 보장하는 GraphQL 스키마를 정의합니다:</p>

<pre><code>type Query {
  contents(first: Int, categoryId: Int): [Content!]!
  content(slug: String!): Content
  categories: [Category!]!
}

type Content {
  id: Int!
  slug: String!
  title: String!
  contentBody: String!
  author: User!
  category: Category!
  publishedAt: DateTime
}
</code></pre>

<h3>Apollo Server 설정</h3>
<p>Next.js API Routes와 Apollo Server를 통합합니다:</p>

<pre><code>// api/graphql/route.ts
import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
})

const handler = startServerAndCreateNextHandler(server)
export { handler as GET, handler as POST }
</code></pre>

<h3>프론트엔드 구현</h3>
<p>React 컴포넌트에서 GraphQL 쿼리를 사용하여 데이터를 가져옵니다:</p>

<pre><code>const GET_CONTENT = \`
  query GetContent($slug: String!) {
    content(slug: $slug) {
      id
      title
      contentBody
      author {
        username
        email
      }
      category {
        name
      }
    }
  }
\`
</code></pre>

<h3>성능 최적화</h3>
<p>블로그 시스템의 성능을 최적화하는 방법들:</p>
<ol>
<li><strong>데이터베이스 인덱싱:</strong> slug, status, published_at 필드에 인덱스 추가</li>
<li><strong>GraphQL DataLoader:</strong> N+1 쿼리 문제 해결</li>
<li><strong>캐싱 전략:</strong> Redis를 활용한 쿼리 결과 캐싱</li>
<li><strong>이미지 최적화:</strong> Next.js Image 컴포넌트 활용</li>
</ol>

<h3>보안 고려사항</h3>
<ul>
<li>SQL Injection 방지 (Prisma가 기본 제공)</li>
<li>GraphQL Query Depth Limiting</li>
<li>Rate Limiting 구현</li>
<li>인증/인가 시스템 구축</li>
</ul>

<blockquote>
<p>"좋은 아키텍처는 확장성과 유지보수성을 동시에 고려해야 합니다."</p>
</blockquote>

<h3>배포 전략</h3>
<p>Vercel을 활용한 배포 및 데이터베이스 마이그레이션 자동화:</p>

<pre><code># package.json scripts
{
  "build": "prisma generate && next build",
  "deploy": "prisma migrate deploy && npm run build"
}
</code></pre>

<p>이러한 구조로 구축된 블로그 시스템은 높은 성능과 확장성을 제공하며, 개발자 경험도 우수합니다.</p>',
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
),
(
  'react-19-server-components',
  'React 19 Server Components: 완전히 새로운 패러다임',
  '<h2>React 19 Server Components의 혁신</h2>
<p>React 19에서 도입된 Server Components는 웹 개발의 패러다임을 완전히 바꾸고 있습니다.</p>

<h3>Server Components란?</h3>
<p>Server Components는 서버에서 렌더링되는 컴포넌트로, 클라이언트에 JavaScript 번들을 보내지 않고도 동적인 콘텐츠를 제공할 수 있습니다.</p>

<h3>주요 장점</h3>
<ul>
<li>번들 크기 감소</li>
<li>초기 로딩 속도 향상</li>
<li>SEO 최적화</li>
<li>서버 리소스 직접 접근</li>
</ul>

<h3>사용 예시</h3>
<pre><code>// UserProfile.server.js
import { db } from "./db"

export default async function UserProfile({ userId }) {
  const user = await db.user.findUnique({
    where: { id: userId }
  })
  
  return (
    &lt;div&gt;
      &lt;h1&gt;{user.name}&lt;/h1&gt;
      &lt;p&gt;{user.email}&lt;/p&gt;
    &lt;/div&gt;
  )
}
</code></pre>

<p>Server Components는 현재 Next.js에서 안정적으로 지원되며, 점점 더 많은 프레임워크에서 채택되고 있습니다.</p>',
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
  (SELECT id FROM blog_categories WHERE slug = 'web-development' LIMIT 1),
  'PUBLISHED',
  true,
  false,
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&auto=format',
  203,
  18,
  5,
  'React 19 Server Components 완벽 가이드',
  'React 19의 혁신적인 Server Components 기능에 대해 자세히 알아보고 실제 프로젝트에 적용하는 방법을 배워보세요',
  NOW() - INTERVAL '5 days'
),
(
  'modern-css-techniques',
  '2024년 알아야 할 현대적인 CSS 기법들',
  '<h2>현대적인 CSS의 진화</h2>
<p>CSS는 계속 발전하고 있으며, 2024년 현재 알아야 할 최신 기법들을 정리해보겠습니다.</p>

<h3>1. Container Queries</h3>
<p>반응형 디자인의 새로운 패러다임:</p>
<pre><code>.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card-content {
    display: flex;
    gap: 1rem;
  }
}
</code></pre>

<h3>2. CSS Grid Subgrid</h3>
<p>중첩된 그리드 레이아웃을 더 쉽게:</p>
<pre><code>.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  display: grid;
  grid-column: span 2;
  grid-template-columns: subgrid;
}
</code></pre>

<h3>3. :has() 선택자</h3>
<p>부모 선택이 가능한 혁신적인 선택자:</p>
<pre><code>/* 이미지가 있는 카드만 스타일링 */
.card:has(img) {
  border: 2px solid blue;
}

/* 체크된 input의 부모 label 스타일링 */
label:has(input:checked) {
  background: green;
}
</code></pre>

<h3>4. CSS Cascade Layers</h3>
<p>스타일 우선순위를 명확하게 관리:</p>
<pre><code>@layer reset, base, components, utilities;

@layer base {
  h1 { font-size: 2rem; }
}

@layer components {
  .btn { padding: 1rem; }
}
</code></pre>

<h3>5. 새로운 컬러 함수들</h3>
<p>더 정확한 색상 제어:</p>
<pre><code>:root {
  --primary: oklch(0.7 0.15 200);
  --accent: color-mix(in srgb, var(--primary) 70%, white);
}
</code></pre>

<h3>6. View Transitions API</h3>
<p>부드러운 페이지 전환:</p>
<pre><code>/* CSS */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}

/* JavaScript */
document.startViewTransition(() => {
  // DOM 업데이트
});
</code></pre>

<h3>7. 논리적 속성들</h3>
<p>국제화를 고려한 스타일링:</p>
<pre><code>.element {
  margin-inline-start: 1rem;
  margin-inline-end: 2rem;
  border-inline: 1px solid black;
}
</code></pre>

<h3>브라우저 지원 현황</h3>
<p>대부분의 현대적 기능들이 주요 브라우저에서 지원되고 있습니다:</p>
<ul>
<li>Container Queries: Chrome 105+, Firefox 110+, Safari 16+</li>
<li>:has() 선택자: Chrome 105+, Firefox 121+, Safari 15.4+</li>
<li>Cascade Layers: Chrome 99+, Firefox 97+, Safari 15.4+</li>
</ul>

<blockquote>
<p>"CSS의 미래는 더 직관적이고 강력해지고 있습니다. 이제는 JavaScript 없이도 복잡한 인터랙션을 구현할 수 있습니다."</p>
</blockquote>

<p>이러한 기법들을 적절히 활용하면 더 효율적이고 유지보수하기 쉬운 스타일시트를 작성할 수 있습니다.</p>',
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
  (SELECT id FROM blog_categories WHERE slug = 'design' LIMIT 1),
  'PUBLISHED',
  false,
  false,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format',
  167,
  14,
  8,
  '2024년 현대적인 CSS 기법 완벽 가이드',
  'Container Queries, CSS Grid Subgrid, :has() 선택자 등 2024년 알아야 할 최신 CSS 기법들을 실제 예제와 함께 소개합니다',
  NOW() - INTERVAL '7 days'
)
ON CONFLICT (slug) DO NOTHING;

-- 태그 샘플 데이터
INSERT INTO blog_tags (name, slug) VALUES
('Next.js', 'nextjs'),
('React', 'react'),
('JavaScript', 'javascript'),
('TypeScript', 'typescript'),
('CSS', 'css'),
('Prisma', 'prisma'),
('GraphQL', 'graphql'),
('Performance', 'performance'),
('Tutorial', 'tutorial'),
('Web Development', 'web-development')
ON CONFLICT (slug) DO NOTHING;

-- 컨텐츠-태그 관계 추가
INSERT INTO blog_content_tags (content_id, tag_id)
SELECT 
  bc.id,
  bt.id
FROM blog_contents bc, blog_tags bt
WHERE 
  (bc.slug = 'nextjs-15-new-features' AND bt.slug IN ('nextjs', 'react', 'web-development', 'tutorial')) OR
  (bc.slug = 'prisma-graphql-blog-system' AND bt.slug IN ('prisma', 'graphql', 'typescript', 'web-development')) OR
  (bc.slug = 'react-19-server-components' AND bt.slug IN ('react', 'nextjs', 'performance', 'tutorial')) OR
  (bc.slug = 'modern-css-techniques' AND bt.slug IN ('css', 'web-development', 'tutorial'))
ON CONFLICT (content_id, tag_id) DO NOTHING;
`;

async function initializeBlogDB() {
  try {
    console.log('🚀 블로그 데이터베이스 초기화 시작...');
    
    await client.connect();
    console.log('✅ 데이터베이스 연결 성공');
    
    // 테이블 생성
    console.log('📋 테이블 생성 중...');
    await client.query(createTablesSQL);
    console.log('✅ 테이블 생성 완료');
    
    // 샘플 데이터 삽입
    console.log('📝 샘플 데이터 삽입 중...');
    await client.query(insertSampleDataSQL);
    console.log('✅ 샘플 데이터 삽입 완료');
    
    // 데이터 확인
    const categoryCount = await client.query('SELECT COUNT(*) FROM blog_categories');
    const contentCount = await client.query('SELECT COUNT(*) FROM blog_contents');
    const tagCount = await client.query('SELECT COUNT(*) FROM blog_tags');
    
    console.log('\n📊 생성된 데이터 현황:');
    console.log(`   - 카테고리: ${categoryCount.rows[0].count}개`);
    console.log(`   - 컨텐츠: ${contentCount.rows[0].count}개`);
    console.log(`   - 태그: ${tagCount.rows[0].count}개`);
    
    console.log('\n🎉 블로그 데이터베이스 초기화 완료!');
    console.log('\n📍 다음 URL에서 블로그를 확인할 수 있습니다:');
    console.log('   - http://localhost:3000/blog');
    console.log('   - http://localhost:3000/blog/nextjs-15-new-features');
    console.log('   - http://localhost:3000/blog/prisma-graphql-blog-system');
    console.log('   - http://localhost:3000/api/graphql (GraphQL Playground)');
    
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error.message);
    if (error.detail) {
      console.error('   상세 정보:', error.detail);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

// 스크립트 실행
if (require.main === module) {
  initializeBlogDB();
}

module.exports = { initializeBlogDB };
