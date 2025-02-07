import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateAuth } from '@/utils/auth';
import { createSlug } from '@/utils/slugify';

// GET: 블로그 포스트 목록 조회
export async function GET() {
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
  } catch (error) {
    console.error('블로그 포스트 조회 중 에러:', error);
    return NextResponse.json(
      { error: '블로그 포스트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST: 새 블로그 포스트 생성
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
        category_id,
        tags,
        status,
        seo_title,
        seo_description,
        author_id,
        published_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
        userId,
        status === 'published' ? new Date() : null
      ]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      post: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('블로그 포스트 생성 중 에러:', error);
    return NextResponse.json(
      { error: '블로그 포스트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// PUT: 블로그 포스트 수정
export async function PUT(request: Request) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);
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
        userId
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
  } catch (error) {
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