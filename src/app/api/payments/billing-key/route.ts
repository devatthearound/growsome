import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateAuth } from '@/utils/auth';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);
    const { billingKey } = await request.json();

    await client.query('BEGIN');

    try {
      // 1. 기존 빌링키 확인
      const existingKeyResult = await client.query(
        `SELECT id FROM billing_keys 
        WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );

      // 2. 기존 빌링키가 있다면 비활성화
      if (existingKeyResult.rows.length > 0) {
        await client.query(
          `UPDATE billing_keys 
          SET status = 'inactive', 
              deactivated_at = CURRENT_TIMESTAMP 
          WHERE user_id = $1 AND status = 'active'`,
          [userId]
        );
      }

      // 3. 새 빌링키 저장
      const billingKeyResult = await client.query(
        `INSERT INTO billing_keys (
          user_id,
          billing_key,
          status,
          created_at
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING id`,
        [userId, billingKey, 'active']
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: '빌링키가 성공적으로 저장되었습니다.',
        billingKeyId: billingKeyResult.rows[0].id
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('빌링키 저장 중 에러:', error);
    return NextResponse.json(
      { 
        error: '빌링키 저장 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 