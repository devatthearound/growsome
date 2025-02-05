import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { validateAuth } from '@/app/utils/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    // 인증 확인
    const { userId } = await validateAuth(client);
    const productId = parseInt(params.id);

    // 유효한 이용권과 구독 정보 확인
    const result = await client.query(
      `WITH valid_access AS (
        -- 유효한 이용권 확인
        SELECT DISTINCT ut.user_id, true as has_access
        FROM user_tickets ut
        JOIN product_plans pp ON ut.product_plan_id = pp.id
        WHERE ut.user_id = $1
          AND pp.product_id = $2
          AND ut.status = 'active'
          AND (
              ut.end_date IS NULL 
              OR ut.end_date > CURRENT_TIMESTAMP
          )
          AND (
              ut.remaining_uses IS NULL 
              OR ut.remaining_uses > 0
          )
        
        UNION
        
        -- 유효한 구독 확인
        SELECT DISTINCT s.user_id, true as has_access
        FROM subscriptions s
        JOIN product_plans pp ON s.product_plan_id = pp.id
        WHERE s.user_id = $1
          AND pp.product_id = $2
          AND s.status = 'active'
          AND (
              s.end_date IS NULL 
              OR s.end_date > CURRENT_TIMESTAMP
          )
      )
      SELECT COALESCE(bool_or(has_access), false) as has_access
      FROM valid_access`,
      [userId, productId]
    );

    return NextResponse.json({
      success: true,
      hasAccess: result.rows[0].has_access
    });

  } catch (error: any) {
    if (error.message === '인증되지 않은 사용자입니다.' || 
        error.message === '세션이 만료되었습니다.') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    console.error('프로그램 접근 권한 확인 중 에러:', error);
    return NextResponse.json(
      { 
        error: '프로그램 접근 권한 확인 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 