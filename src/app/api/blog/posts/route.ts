import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: 포스트 목록 조회
export async function GET(request: Request) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag');
    const categoryId = searchParams.get('categoryId');
    
    const offset = (page - 1) * limit;
    const params: any[] = [limit, offset];
    let paramIndex = 3;

    let query = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.content,
        p.excerpt,
        p.featured_image,
        p.author_id,
        p.category_id,
        p.status,
        p.published_at,
        p.seo_title,
        p.seo_description,
        p.view_count,
        p.tags,
        p.created_at,
        p.updated_at,
        pc.name as category_name
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      WHERE p.status = 'published'
    `;

    if (tag) {
      query += ` AND $${paramIndex} = ANY(p.tags)`;
      params.push(tag);
      paramIndex++;
    }

    if (categoryId) {
      query += ` AND pc.id = $${paramIndex}`;
      params.push(categoryId);
    }

    query += `
      ORDER BY p.published_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await client.query(query, params);

    // 전체 포스트 수 조회
    let countQuery = `
      SELECT COUNT(*) 
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      WHERE p.status = 'published'
    `;

    if (tag) {
      countQuery += ` AND $1 = ANY(p.tags)`;
    }

    if (categoryId) {
      countQuery += ` AND pc.id = $${tag ? '2' : '1'}`;
    }

    const countParams = [];
    if (tag) countParams.push(tag);
    if (categoryId) countParams.push(categoryId);

    const countResult = await client.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      success: true,
      posts: result.rows,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('포스트 조회 중 에러:', error);
    return NextResponse.json(
      { error: '포스트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 