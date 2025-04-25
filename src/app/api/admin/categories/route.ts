import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createSlug } from '@/utils/slugify';

// 카테고리 목록 조회
export async function GET(request: Request) {
  const client = await pool.connect();
  
  try {

    const result = await client.query(
      `SELECT 
        id,
        name,
        slug,
        description,
        parent_id,
        created_at,
        updated_at
      FROM post_categories
      ORDER BY 
        CASE WHEN parent_id IS NULL THEN 0 ELSE 1 END,
        created_at ASC`
    );

    return NextResponse.json({
      success: true,
      categories: result.rows
    });
  } catch (error: any) {
    console.error('카테고리 조회 중 에러:', error);
    return NextResponse.json(
      { error: '카테고리 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// 새 카테고리 생성
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { name, description, parent_id } = await request.json();

    // 필수 필드 검증
    if (!name) {
      return NextResponse.json(
        { error: '카테고리명은 필수입니다.' },
        { status: 400 }
      );
    }

    const slug = createSlug(name);

    // 슬러그 중복 검사
    const slugCheck = await client.query(
      'SELECT id FROM post_categories WHERE slug = $1',
      [slug]
    );

    if (slugCheck.rows.length > 0) {
      return NextResponse.json(
        { error: '이미 존재하는 카테고리입니다.' },
        { status: 400 }
      );
    }

    // 부모 카테고리 존재 여부 확인 (parent_id가 있는 경우)
    if (parent_id) {
      const parentCheck = await client.query(
        'SELECT id FROM post_categories WHERE id = $1',
        [parent_id]
      );

      if (parentCheck.rows.length === 0) {
        return NextResponse.json(
          { error: '존재하지 않는 상위 카테고리입니다.' },
          { status: 400 }
        );
      }
    }

    const result = await client.query(
      `INSERT INTO post_categories (
        name,
        slug,
        description,
        parent_id,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, name, slug, description, parent_id`,
      [name, slug, description, parent_id]
    );

    return NextResponse.json({
      success: true,
      category: result.rows[0]
    });

  } catch (error: any) {
    console.error('카테고리 생성 중 에러:', error);
    return NextResponse.json(
      { error: '카테고리 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 