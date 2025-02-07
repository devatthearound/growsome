import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateAuth } from '@/utils/auth';
import { createSlug } from '@/utils/slugify';

// 블로그 포스트 목록 조회
export async function GET(request: Request) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);

    const result = await client.query(
      `SELECT 
        id,
        title,
        slug,
        content,
        excerpt,
        featured_image,
        author_id,
        category_id,
        status,
        published_at,
        seo_title,
        seo_description,
        view_count,
        tags,
        created_at,
        updated_at
      FROM posts
      ORDER BY created_at DESC`
    );

    return NextResponse.json({
      success: true,
      posts: result.rows
    });
  } catch (error: any) {
    console.error('포스트 조회 중 에러:', error);
    return NextResponse.json(
      { error: '포스트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// 새 블로그 포스트 생성
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);
    const {
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

    const slug = createSlug(title);

    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO posts (
        title,
        slug,
        content,
        excerpt,
        featured_image,
        author_id,
        category_id,
        status,
        published_at,
        seo_title,
        seo_description,
        tags
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id`,
      [
        title,
        slug,
        content,
        excerpt,
        featured_image,
        userId,
        category_id,
        status,
        status === 'published' ? 'CURRENT_TIMESTAMP' : null,
        seo_title,
        seo_description,
        tags
      ]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      postId: result.rows[0].id
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('포스트 생성 중 에러:', error);
    return NextResponse.json(
      { error: '포스트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// 블로그 포스트 수정
export async function PUT(request: Request) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);
    const {
      id,
      title,
      description,
      content,
      thumbnail,
      tags,
      status
    } = await request.json();

    await client.query('BEGIN');

    await client.query(
      `UPDATE blog_posts
      SET 
        title = $1,
        description = $2,
        content = $3,
        thumbnail = $4,
        tags = $5,
        status = $6,
        published_at = CASE 
          WHEN status = 'published' AND published_at IS NULL 
          THEN CURRENT_TIMESTAMP 
          ELSE published_at 
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7`,
      [title, description, content, thumbnail, tags, status, id]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('블로그 포스트 수정 중 에러:', error);
    return NextResponse.json(
      { error: '블로그 포스트 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 