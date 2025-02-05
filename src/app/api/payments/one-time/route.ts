import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { validateAuth } from '@/app/utils/auth';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);

    const {
      paymentId,
      orderId
    } = await request.json();

    await client.query('BEGIN');

    try {
      // 1. 주문 정보 조회 (orders, order_items, product_plans, products 테이블 조인)
      const orderResult = await client.query(
        `SELECT 
          o.*,
          oi.product_plan_id,
          oi.quantity,
          pp.features,
          pp.price,
          p.name as product_name
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN product_plans pp ON pp.id = oi.product_plan_id
        JOIN products p ON p.id = pp.product_id
        WHERE o.id = $1 AND o.user_id = $2`,
        [orderId, userId]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('Order not found');
      }

      const order = orderResult.rows[0];

      // 2. 포트원 결제 내역 조회 및 검증
      const portoneResponse = await fetch(
        `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
        {
          headers: { 
            'Authorization': `PortOne ${process.env.PORTONE_V2_API_SECRET}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (!portoneResponse.ok) {
        const errorData = await portoneResponse.json();
        console.error('PortOne API Error:', errorData);
        throw new Error(`PortOne API Error: ${errorData.code}: ${errorData.params?.reason || '알 수 없는 오류'}`);
      }

      const payment = await portoneResponse.json();
      console.log('PortOne payment response:', payment);

      // 3. 결제 금액 검증
      const paidAmount = payment.amount?.total;
      if (!paidAmount) {
        throw new Error('Payment amount not found in PortOne response');
      }

      if (paidAmount !== order.final_amount) {
        throw new Error(`Payment amount mismatch: expected ${order.final_amount}, got ${paidAmount}`);
      }

      // 4. 결제 상태 검증
      if (payment.status !== 'PAID') {
        throw new Error(`Invalid payment status: ${payment.status}`);
      }

      // 5. 주문 상태 업데이트 (orders 테이블)
      await client.query(
        `UPDATE orders 
        SET order_status = 'completed',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1`,
        [orderId]
      );

      // 6. 쿠폰 사용 상태 업데이트 (coupon_usages 테이블)
      if (order.coupon_id) {  // 쿠폰이 사용된 경우에만 실행
        await client.query(
          `UPDATE coupon_usages
          SET is_used = true,
              used_at = CURRENT_TIMESTAMP
          WHERE coupon_id = $1 AND user_id = $2`,
          [order.coupon_id, userId]
        );
      }

      // 7. 결제 정보 저장 (payments 테이블)
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
          original_amount
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8)`,
        [
          userId,
          orderId,
          order.product_plan_id,
          order.final_amount,
          payment.method?.card?.name || payment.method?.type || 'unknown',
          'completed',
          paymentId,
          order.total_amount
        ]
      );

      // 8. 이용권 생성 (user_tickets 테이블)
      const features = order.features || {};
      await client.query(
        `INSERT INTO user_tickets (
          user_id,
          product_plan_id,
          order_id,
          status,
          start_date,
          end_date,
          remaining_uses,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 
          CASE 
            WHEN $5::jsonb->>'duration_days' IS NOT NULL 
            THEN CURRENT_TIMESTAMP + ($5::jsonb->>'duration_days')::INTEGER * INTERVAL '1 day'
            ELSE NULL 
          END,
          ($5::jsonb->>'usage_limit')::INTEGER,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP)`,
        [userId, order.product_plan_id, orderId, 'active', features]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: '결제가 완료되었습니다.',
        order: {
          id: orderId,
          amount: order.final_amount,
          productName: order.product_name,
          paymentId
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    if (error.message === '인증되지 않은 사용자입니다.' || 
        error.message === '세션이 만료되었습니다.') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    console.error('결제 처리 중 에러:', error);
    return NextResponse.json(
      { 
        error: '결제 처리 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 