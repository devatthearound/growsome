import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT 
        id,
        title,
        description,
        url,
        tags::text[] as tags,
        is_active,
        created_at,
        updated_at
      FROM toy_projects
      WHERE is_active = true
      ORDER BY created_at DESC`
    );

    // PostgreSQL 배열 문자열에서 실제 값만 추출
    const projects = result.rows.map(project => ({
      ...project,
      tags: project.tags.map((tag: string) => 
        tag.replace(/[{}"]/g, '').trim()
      )
    }));

    return NextResponse.json({
      success: true,
      projects
    });

  } catch (error) {
    console.error('토이 프로젝트 조회 중 에러:', error);
    return NextResponse.json(
      { error: '토이 프로젝트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 