import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withApiAuth, ApiTokenPayload } from '@/lib/auth-api'; // API 자동화용 인증

// slug 생성 함수
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/[\s가-힣]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now();
}

// GET: 블로그 포스트 목록 조회
export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT 
          bc.id,
          bc.slug,
          bc.title,
          bc.content_body as content,
          bc.author_id,
          bc.category_id,
          bc.status,
          bc.is_featured,
          bc.is_hero,
          bc.thumbnail_url,
          bc.view_count,
          bc.like_count,
          bc.comment_count,
          bc.meta_title,
          bc.meta_description,
          bc.created_at,
          bc.updated_at,
          bc.published_at,
          cat.name as category_name,
          u.username as author_name
        FROM blog_contents bc
        LEFT JOIN blog_categories cat ON bc.category_id = cat.id
        LEFT JOIN users u ON bc.author_id = u.id
        ORDER BY bc.created_at DESC`
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
    
    return NextResponse.json({
      success: true,
      posts: [],
      message: '데이터베이스 조회 중 오류가 발생했습니다.'
    });
  }
}

/**
 * POST: 새 블로그 포스트 생성
 */
export async function POST(request: Request) {
  return withApiAuth(request, createBlogPost);
}

async function createBlogPost(request: Request, user: ApiTokenPayload): Promise<NextResponse> {
  console.log('📝 블로그 포스트 생성 API 호출됨');
  console.log('👤 사용자 정보:', user);

  try {
    const client = await pool.connect();
    
    try {
      const body = await request.json();
      console.log('📤 요청 데이터:', body);

      const {
        title,
        content,
        category_id = 1, // 기본 카테고리
        status = 'published',
        is_featured = false,
        is_hero = false,
        thumbnail_url = null,
        meta_title = null,
        meta_description = null
      } = body;

      // 필수 필드 검증
      if (!title || !content) {
        console.log('❌ 필수 필드 누락');
        return NextResponse.json(
          { 
            success: false,
            error: '제목과 내용은 필수입니다.' 
          },
          { status: 400 }
        );
      }

      // slug 생성
      const slug = createSlug(title);
      console.log('🔗 생성된 slug:', slug);

      // 카테고리 존재 확인
      const categoryCheck = await client.query(
        'SELECT id FROM blog_categories WHERE id = $1',
        [category_id]
      );

      if (categoryCheck.rows.length === 0) {
        console.log('❌ 카테고리가 존재하지 않음');
        return NextResponse.json(
          { 
            success: false,
            error: '존재하지 않는 카테고리입니다.' 
          },
          { status: 400 }
        );
      }

      await client.query('BEGIN');

      console.log('💾 데이터베이스에 삽입 중...');
      const result = await client.query(
        `INSERT INTO blog_contents (
          slug,
          title,
          content_body,
          author_id,
          category_id,
          status,
          is_featured,
          is_hero,
          thumbnail_url,
          view_count,
          like_count,
          comment_count,
          meta_title,
          meta_description,
          created_at,
          updated_at,
          published_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $15)
        RETURNING *`,
        [
          slug,
          title,
          content,
          user.userId,
          category_id,
          status,
          is_featured,
          is_hero,
          thumbnail_url,
          0, // view_count
          0, // like_count
          0, // comment_count
          meta_title || title,
          meta_description,
          status === 'published' ? new Date() : null
        ]
      );

      await client.query('COMMIT');

      console.log('✅ 블로그 포스트 생성 성공');
      console.log('📊 생성된 포스트:', result.rows[0]);

      return NextResponse.json({
        success: true,
        post: result.rows[0],
        message: '블로그 포스트가 성공적으로 생성되었습니다.'
      });

    } catch (dbError: any) {
      await client.query('ROLLBACK');
      console.error('❌ 데이터베이스 오류:', dbError);
      throw dbError;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('❌ 블로그 포스트 생성 중 에러:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '블로그 포스트 생성 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * PUT: 블로그 포스트 수정
 */
export async function PUT(request: Request) {
  return withApiAuth(request, updateBlogPost);
}

async function updateBlogPost(request: Request, user: ApiTokenPayload): Promise<NextResponse> {
  try {
    const client = await pool.connect();
    
    try {
      const {
        id,
        title,
        content,
        category_id,
        status,
        is_featured,
        is_hero,
        thumbnail_url,
        meta_title,
        meta_description
      } = await request.json();

      // 필수 필드 검증
      if (!id || !title || !content) {
        return NextResponse.json(
          { 
            success: false,
            error: 'ID, 제목, 내용은 필수입니다.' 
          },
          { status: 400 }
        );
      }

      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE blog_contents
        SET 
          title = $1,
          content_body = $2,
          category_id = $3,
          status = $4,
          is_featured = $5,
          is_hero = $6,
          thumbnail_url = $7,
          meta_title = $8,
          meta_description = $9,
          published_at = $10,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $11 AND author_id = $12
        RETURNING *`,
        [
          title,
          content,
          category_id,
          status,
          is_featured,
          is_hero,
          thumbnail_url,
          meta_title || title,
          meta_description,
          status === 'published' ? new Date() : null,
          id,
          user.userId
        ]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { 
            success: false,
            error: '포스트를 찾을 수 없거나 수정 권한이 없습니다.' 
          },
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
  } catch (error: any) {
    console.error('블로그 포스트 수정 중 에러:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '블로그 포스트 수정 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 블로그 포스트 삭제
 */
export async function DELETE(request: Request) {
  return withApiAuth(request, deleteBlogPost);
}

async function deleteBlogPost(request: Request, user: ApiTokenPayload): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: '포스트 ID가 필요합니다.' 
        },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'DELETE FROM blog_contents WHERE id = $1 AND author_id = $2 RETURNING id',
        [id, user.userId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { 
            success: false,
            error: '포스트를 찾을 수 없거나 삭제 권한이 없습니다.' 
          },
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
  } catch (error: any) {
    console.error('블로그 포스트 삭제 중 에러:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '블로그 포스트 삭제 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
