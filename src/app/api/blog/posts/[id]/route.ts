import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET: 특정 슬러그의 포스트 조회
export async function GET(
  request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const id = (await params).id // 'a', 'b', or 'c'

    if (!id) {
      return Response.json(
          { error: 'ID is required' },
          { status: 400 }
      );
  }


    const result = await client.query(
      `SELECT 
        p.*,
        pc.name as category_name
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      WHERE p.id = $1 AND p.status = 'published'`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '포스트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await client.query(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = $1',
      [result.rows[0].id]
    );

    return NextResponse.json({
      success: true,
      post: result.rows[0]
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