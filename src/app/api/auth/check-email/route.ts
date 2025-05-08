import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { email } = await request.json();
    
    const result = await client.query(
      'SELECT EXISTS (SELECT 1 FROM users WHERE email = $1 AND status = $2) as exists',
      [email, 'active']
    );
    
    return NextResponse.json({
      exists: result.rows[0].exists
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: `이메일 확인 중 오류가 발생했습니다. ${error}` },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 