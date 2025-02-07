import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: 카테고리 목록 조회
export async function GET() {
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
        name ASC`
    );

    return NextResponse.json({
      success: true,
      categories: result.rows
    });

  } catch (error) {
    console.error('카테고리 조회 중 에러:', error);
    return NextResponse.json(
      { error: '카테고리 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 