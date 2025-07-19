import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const client = await pool.connect();
    
    try {
      // 블로그 관련 테이블 생성
      await client.query(`
        -- 포스트 카테고리 테이블
        CREATE TABLE IF NOT EXISTS post_categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          parent_id INTEGER REFERENCES post_categories(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        -- 포스트 테이블
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          slug VARCHAR(200) NOT NULL UNIQUE,
          content TEXT NOT NULL,
          excerpt TEXT,
          featured_image VARCHAR(255),
          author_id INTEGER,
          category_id INTEGER REFERENCES post_categories(id),
          status VARCHAR(20) NOT NULL DEFAULT 'draft',
          published_at TIMESTAMP WITH TIME ZONE,
          seo_title VARCHAR(200),
          seo_description TEXT,
          view_count INTEGER DEFAULT 0,
          like_count INTEGER DEFAULT 0,
          comment_count INTEGER DEFAULT 0,
          tags VARCHAR(50)[] NOT NULL DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        -- 포스트 댓글 테이블
        CREATE TABLE IF NOT EXISTS post_comments (
          id SERIAL PRIMARY KEY,
          post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
          user_id INTEGER,
          parent_id INTEGER REFERENCES post_comments(id),
          content TEXT NOT NULL,
          is_approved BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        -- 포스트 좋아요 테이블
        CREATE TABLE IF NOT EXISTS post_likes (
          id SERIAL PRIMARY KEY,
          post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
          user_id INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(post_id, user_id)
        );
      `);

      // 인덱스 생성
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
        CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
        CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
        CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
        CREATE INDEX IF NOT EXISTS idx_post_categories_slug ON post_categories(slug);
        CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
        CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
      `);

      // 기본 카테고리 데이터 삽입
      await client.query(`
        INSERT INTO post_categories (name, slug, description) 
        VALUES 
          ('AI/ML', 'ai-ml', 'AI와 머신러닝 관련 포스트'),
          ('개발 팁', 'dev-tips', '개발 팁과 노하우'),
          ('비즈니스', 'business', '비즈니스 인사이트'),
          ('트렌드', 'trends', '최신 기술 트렌드'),
          ('튜토리얼', 'tutorials', '단계별 가이드')
        ON CONFLICT (slug) DO NOTHING;
      `);

      // updated_at 트리거 함수 생성
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);

      // updated_at 트리거 생성
      await client.query(`
        DROP TRIGGER IF EXISTS update_post_categories_updated_at ON post_categories;
        CREATE TRIGGER update_post_categories_updated_at
            BEFORE UPDATE ON post_categories
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
      `);

      await client.query(`
        DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
        CREATE TRIGGER update_posts_updated_at
            BEFORE UPDATE ON posts
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
      `);

      await client.query(`
        DROP TRIGGER IF EXISTS update_post_comments_updated_at ON post_comments;
        CREATE TRIGGER update_post_comments_updated_at
            BEFORE UPDATE ON post_comments
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
      `);

      return NextResponse.json({
        success: true,
        message: '블로그 데이터베이스가 성공적으로 초기화되었습니다.'
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('데이터베이스 초기화 중 에러:', error);
    return NextResponse.json(
      { error: '데이터베이스 초기화 중 오류가 발생했습니다.', details: error },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const client = await pool.connect();
    
    try {
      // 테이블 존재 여부 확인
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('post_categories', 'posts', 'post_comments', 'post_likes')
        ORDER BY table_name;
      `);

      const categoryCount = await client.query('SELECT COUNT(*) FROM post_categories');
      const postCount = await client.query('SELECT COUNT(*) FROM posts');

      return NextResponse.json({
        success: true,
        tables: tables.rows.map(row => row.table_name),
        counts: {
          categories: parseInt(categoryCount.rows[0].count),
          posts: parseInt(postCount.rows[0].count)
        }
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('데이터베이스 상태 확인 중 에러:', error);
    return NextResponse.json({
      success: false,
      error: '데이터베이스 연결 실패',
      tables: [],
      counts: { categories: 0, posts: 0 }
    });
  }
}
