import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/app/lib/db';
import { verifyToken } from '@/app/utils/jwt';
import { validateAuth } from '@/app/utils/auth';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);
    const { billingKey, productPlanId, couponCode } = await request.json();

    await client.query('BEGIN');

    try {
    //   // 1. 빌링키 조회
    //   const billingKeyResult = await client.query(
    //     `SELECT billing_key 
    //     FROM billing_keys 
    //     WHERE user_id = $1 AND status = 'active'`,
    //     [userId]
    //   );

    //   if (billingKeyResult.rows.length === 0) {
    //     throw new Error('유효한 빌링키가 없습니다.');
    //   }

    //   const billingKey = billingKeyResult.rows[0].billing_key;

      // 2. 상품 정보 조회
      const planResult = await client.query(
        `SELECT 
          pp.*,
          p.name as product_name
        FROM product_plans pp
        JOIN products p ON p.id = pp.product_id
        WHERE pp.id = $1 AND pp.billing_type = 'subscription'`,
        [productPlanId]
      );

      if (planResult.rows.length === 0) {
        throw new Error('유효하지 않은 구독 상품입니다.');
      }

      const plan = planResult.rows[0];
      
      // 3. 주문 생성
      const orderResult = await client.query(
        `INSERT INTO orders (
          user_id,
          order_status,
          total_amount,
          final_amount,
          created_at
        ) VALUES ($1, $2, $3, $3, CURRENT_TIMESTAMP)
        RETURNING id`,
        [userId, 'pending', plan.price]
      );

      const orderId = orderResult.rows[0].id;
      const timestamp = Date.now();
      const paymentId = `ORDER${orderId}${timestamp}`; // 단순히 ORDER + orderId + timestamp 형식으로 변경

      // 4. 포트원 결제 요청
      const paymentResponse = await fetch(
        `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/billing-key`,
        {
          method: 'POST',
          headers: {
            'Authorization': `PortOne ${process.env.PORTONE_V2_API_SECRET}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            billingKey,
            orderName: plan.product_name,
            customer: {
                customerId: '1234567890',
                name: {
                  full: '이가은',
                },
                phoneNumber: '010-1234-5678',
                email: "dev@the-around.com",
            },
            amount: {
              total: plan.price
            },
            currency: 'KRW'
          })
        }
      );

      if (!paymentResponse.ok) {
        throw new Error('결제 요청 실패');
      }

      const payment = await paymentResponse.json();

      // 5. 결제 정보 저장
      await client.query(
        `INSERT INTO payments (
          user_id,
          order_id,
          product_plan_id,
          amount,
          payment_method,
          payment_status,
          payment_id,
          payment_date,
          original_amount,
          is_subscription
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, true)`,
        [
          userId,
          orderId,
          productPlanId,
          plan.price,
          'card',
          'completed',
          paymentId,
          plan.price
        ]
      );

      // 6. 구독 정보 저장 (기존 subscriptions 테이블 구조에 맞게 수정)
      await client.query(
        `INSERT INTO subscriptions (
          user_id,
          product_plan_id,
          status,
          start_date,
          end_date,
          payment_date,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 
          CURRENT_TIMESTAMP + INTERVAL '1 month',
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP)`,
        [
          userId,
          productPlanId,
          'active'
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: '구독이 시작되었습니다.',
        subscription: {
          orderId,
          paymentId,
          amount: plan.price
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('구독 결제 중 에러:', error);
    return NextResponse.json(
      { 
        error: '구독 결제 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// 구독 취소 API
export async function DELETE(request: Request) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: '구독 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // 구독 상태 업데이트
    const result = await client.query(
      `UPDATE subscriptions 
      SET 
        status = 'cancelled',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *`,
      [subscriptionId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Subscription not found');
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: '구독이 취소되었습니다.'
    });

  } catch (error: any) {
    if (error.message === '인증되지 않은 사용자입니다.' || 
        error.message === '세션이 만료되었습니다.') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    console.error('구독 취소 중 에러:', error);
    return NextResponse.json(
      { error: '구독 취소 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 