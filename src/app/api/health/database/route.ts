import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // 데이터베이스 연결 테스트
    const client = await pool.connect();
    
    try {
      // 간단한 쿼리로 연결 확인
      const result = await client.query('SELECT NOW() as current_time, version() as db_version');
      
      // 테이블 존재 여부 확인
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('blog_categories', 'blog_contents', 'users')
        ORDER BY table_name;
      `);

      // 데이터 개수 확인
      const counts = { categories: 0, posts: 0, users: 0 };
      
      for (const table of tables.rows) {
        try {
          const countResult = await client.query(`SELECT COUNT(*) FROM ${table.table_name}`);
          const key = table.table_name.replace('blog_', '') as keyof typeof counts;
          counts[key] = parseInt(countResult.rows[0].count);
        } catch (e) {
          // 테이블이 없으면 0으로 유지
        }
      }

      return NextResponse.json({
        success: true,
        message: '데이터베이스 연결 성공',
        connection: {
          time: result.rows[0].current_time,
          version: result.rows[0].db_version
        },
        tables: tables.rows.map(row => row.table_name),
        counts,
        environment: {
          node_env: process.env.NODE_ENV,
          database_url_configured: !!process.env.DATABASE_URL,
          database_url_host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'undefined'
        }
      });

    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('데이터베이스 연결 테스트 실패:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      environment: {
        node_env: process.env.NODE_ENV,
        database_url_configured: !!process.env.DATABASE_URL,
        database_url_host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'undefined'
      }
    }, { status: 500 });
  }
}
