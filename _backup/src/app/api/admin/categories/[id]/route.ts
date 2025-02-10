import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateAuth } from '@/utils/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);
    const categoryId = parseInt(params.id);

    // 하위 카테고리 존재 여부 확인
    const subCategoriesCheck = await client.query(
      'SELECT id FROM post_categories WHERE parent_id = $1',
      [categoryId]
    );

    if (subCategoriesCheck.rows.length > 0) {
      return NextResponse.json(
        { error: '하위 카테고리가 있는 카테고리는 삭제할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 카테고리에 속한 포스트 처리 (null로 설정)
    await client.query(
      'UPDATE posts SET category_id = NULL WHERE category_id = $1',
      [categoryId]
    );

    // 카테고리 삭제
    const result = await client.query(
      'DELETE FROM post_categories WHERE id = $1 RETURNING id',
      [categoryId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '카테고리를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '카테고리가 삭제되었습니다.'
    });

  } catch (error: any) {
    console.error('카테고리 삭제 중 에러:', error);
    return NextResponse.json(
      { error: '카테고리 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 