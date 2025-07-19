import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth, TokenPayload } from '@/lib/auth';
import { createSlug } from '@/utils/slugify';

// GET: 블로그 포스트 목록 조회
export async function GET() {
  try {
    // 데이터베이스 연결 확인
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT 
          p.id,
          p.title,
          p.content,
          p.excerpt,
          p.featured_image,
          p.category_id,
          p.tags,
          p.status,
          p.published_at,
          p.seo_title,
          p.seo_description,
          p.created_at,
          p.updated_at,
          pc.name as category_name
        FROM posts p
        LEFT JOIN post_categories pc ON p.category_id = pc.id
        ORDER BY p.created_at DESC`
      );

      return NextResponse.json({
        success: true,
        posts: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('블로그 포스트 조회 중 에러:', error);
    
    // 데이터베이스 연결 실패나 테이블이 없는 경우 빈 배열 반환
    return NextResponse.json({
      success: true,
      posts: [],
      message: '데이터베이스가 초기화되지 않았습니다.'
    });
  }
}

/**
 * POST: 새 블로그 포스트 생성
 */
export async function POST(request: Request) {
  return withAuth(request, createBlogPost);
}

async function createBlogPost(request: Request, user: TokenPayload): Promise<NextResponse> {
  try {
    const client = await pool.connect();
    
    try {
      const {
        title,
        content,
        excerpt,
        featured_image,
        category_id,
        tags,
        status = 'draft',
        seo_title,
        seo_description
      } = await request.json();

      // 필수 필드 검증
      if (!title || !content) {
        return NextResponse.json(
          { error: '제목과 내용은 필수입니다.' },
          { status: 400 }
        );
      }

      const slug = createSlug(title);

      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO posts (
          title,
          slug,
          content,
          excerpt,
          featured_image,
          category_id,
          tags,
          status,
          seo_title,
          seo_description,
          author_id,
          published_at,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *`,
        [
          title,
          slug,
          content,
          excerpt,
          featured_image,
          category_id,
          tags,
          status,
          seo_title,
          seo_description,
          user.userId,
          status === 'published' ? new Date() : null
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        post: result.rows[0]
      });
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('블로그 포스트 생성 중 에러:', error);
    return NextResponse.json(
      { error: '블로그 포스트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * PUT: 블로그 포스트 수정
 */
export async function PUT(request: Request) {
  return withAuth(request, updateBlogPost);
}

async function updateBlogPost(request: Request, user: TokenPayload): Promise<NextResponse> {
  try {
    const client = await pool.connect();
    
    try {
      const {
        id,
        title,
        content,
        excerpt,
        featured_image,
        category_id,
        tags,
        status,
        seo_title,
        seo_description
      } = await request.json();

      // 필수 필드 검증
      if (!id || !title || !content) {
        return NextResponse.json(
          { error: 'ID, 제목, 내용은 필수입니다.' },
          { status: 400 }
        );
      }

      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE posts
        SET 
          title = $1,
          content = $2,
          excerpt = $3,
          featured_image = $4,
          category_id = $5,
          tags = $6,
          status = $7,
          seo_title = $8,
          seo_description = $9,
          published_at = $10,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $11 AND author_id = $12
        RETURNING *`,
        [
          title,
          content,
          excerpt,
          featured_image,
          category_id,
          tags,
          status,
          seo_title,
          seo_description,
          status === 'published' ? new Date() : null,
          id,
          user.userId
        ]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: '포스트를 찾을 수 없거나 수정 권한이 없습니다.' },
          { status: 404 }
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        post: result.rows[0]
      });
    } catch (dbError) {
      await client.query('ROLLBACK');
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('블로그 포스트 수정 중 에러:', error);
    return NextResponse.json(
      { error: '블로그 포스트 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 블로그 포스트 삭제
 */
export async function DELETE(request: Request) {
  return withAuth(request, deleteBlogPost);
}

async function deleteBlogPost(request: Request, user: TokenPayload): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '포스트 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'DELETE FROM posts WHERE id = $1 AND author_id = $2 RETURNING id',
        [id, user.userId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: '포스트를 찾을 수 없거나 삭제 권한이 없습니다.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '포스트가 삭제되었습니다.'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('블로그 포스트 삭제 중 에러:', error);
    return NextResponse.json(
      { error: '블로그 포스트 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
