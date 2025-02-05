import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/app/lib/db';
import { verifyToken } from '@/app/utils/jwt';

// 결제 생성 API
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    // 인증 확인
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    const userId = payload.userId;

    // 요청 데이터 파싱
    const {
      productPlanId,
      paymentMethod,
      merchantUid,
      couponCode,
      quantity = 1
    } = await request.json();

    await client.query('BEGIN');

    try {
      // 상품 요금제 정보 조회
      const planResult = await client.query(
        `SELECT 
          pp.id,
          pp.price,
          pp.billing_type,
          pp.billing_cycle,
          pp.features,
          p.name as product_name
        FROM product_plans pp
        JOIN products p ON p.id = pp.product_id
        WHERE pp.id = $1`,
        [productPlanId]
      );

      if (planResult.rows.length === 0) {
        throw new Error('Invalid product plan');
      }

      const plan = planResult.rows[0];
      let discountAmount = 0;
      let couponId = null;

      // 쿠폰 처리
      if (couponCode) {
        const couponResult = await client.query(
          `SELECT 
            c.id,
            c.discount_type,
            c.discount_value,
            c.min_purchase_amount,
            c.max_discount_amount
          FROM coupons c
          WHERE c.code = $1
          AND c.is_active = true
          AND (c.end_date IS NULL OR c.end_date > CURRENT_TIMESTAMP)
          AND (
            c.usage_limit IS NULL 
            OR c.usage_limit > (
              SELECT COUNT(*) FROM coupon_usages WHERE coupon_id = c.id
            )
          )`,
          [couponCode]
        );

        if (couponResult.rows.length > 0) {
          const coupon = couponResult.rows[0];
          couponId = coupon.id;

          // 쿠폰 할인 계산
          if (coupon.discount_type === 'percentage') {
            discountAmount = Math.floor(plan.price * (coupon.discount_value / 100));
            if (coupon.max_discount_amount) {
              discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
            }
          } else {
            discountAmount = coupon.discount_value;
          }
        }
      }

      const subtotal = plan.price * quantity;
      const finalAmount = subtotal - discountAmount;

      // 1. 주문 생성
      const orderResult = await client.query(
        `INSERT INTO orders (
          user_id,
          order_status,
          total_amount,
          discount_amount,
          final_amount
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`,
        [userId, 'pending', subtotal, discountAmount, finalAmount]
      );

      const orderId = orderResult.rows[0].id;

      // 2. 주문 상품 상세 추가
      await client.query(
        `INSERT INTO order_items (
          order_id,
          product_plan_id,
          quantity,
          unit_price,
          subtotal
        )
        VALUES ($1, $2, $3, $4, $5)`,
        [orderId, productPlanId, quantity, plan.price, subtotal]
      );

      // 3. 결제 정보 저장
      const paymentResult = await client.query(
        `INSERT INTO payments (
          user_id,
          order_id,
          product_plan_id,
          amount,
          payment_method,
          payment_status,
          merchant_uid,
          payment_date,
          coupon_id,
          discount_amount,
          original_amount
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, $9, $10)
        RETURNING id`,
        [
          userId,
          orderId,
          productPlanId,
          finalAmount,
          paymentMethod,
          'completed',
          merchantUid,
          couponId,
          discountAmount,
          subtotal
        ]
      );

      // 4. 주문 상태 업데이트
      await client.query(
        'UPDATE orders SET order_status = $1 WHERE id = $2',
        ['completed', orderId]
      );

      // 5. 이용권 또는 구독 생성
      if (plan.billing_type === 'subscription') {
        // 구독 정보 생성
        await client.query(
          `INSERT INTO subscriptions (
            user_id,
            product_plan_id,
            status,
            start_date,
            end_date,
            next_billing_date
          )
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 
            CURRENT_TIMESTAMP + INTERVAL '1 month' * $4,
            CURRENT_TIMESTAMP + INTERVAL '1 month')`,
          [userId, productPlanId, 'active', plan.billing_cycle]
        );
      } else {
        // 이용권 생성
        const features = plan.features || {};
        await client.query(
          `INSERT INTO user_tickets (
            user_id,
            product_plan_id,
            order_id,
            status,
            start_date,
            end_date,
            remaining_uses
          )
          VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 
            CASE 
              WHEN $5::jsonb->>'duration_days' IS NOT NULL 
              THEN CURRENT_TIMESTAMP + ($5::jsonb->>'duration_days')::INTEGER * INTERVAL '1 day'
              ELSE NULL 
            END,
            $5::jsonb->>'usage_limit'::INTEGER)`,
          [userId, productPlanId, orderId, 'active', features]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: '결제가 완료되었습니다.',
        order: {
          id: orderId,
          amount: finalAmount,
          originalAmount: subtotal,
          discountAmount,
          productName: plan.product_name,
          merchantUid
        }
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
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

// 결제 내역 조회 API
export async function GET(request: Request) {
  const client = await pool.connect();
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    const userId = payload.userId;

    // URL 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const ordersResult = await client.query(
      `SELECT 
        o.id as order_id,
        o.order_status,
        o.total_amount,
        o.discount_amount,
        o.final_amount,
        o.order_date,
        p.id as payment_id,
        p.payment_method,
        p.payment_status,
        p.merchant_uid,
        oi.quantity,
        pp.name as plan_name,
        pr.name as product_name,
        c.code as coupon_code,
        c.name as coupon_name,
        COALESCE(s.status, ut.status) as subscription_or_ticket_status
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN product_plans pp ON pp.id = oi.product_plan_id
      JOIN products pr ON pr.id = pp.product_id
      LEFT JOIN payments p ON p.order_id = o.id
      LEFT JOIN coupons c ON c.id = p.coupon_id
      LEFT JOIN subscriptions s ON s.user_id = o.user_id AND s.product_plan_id = pp.id
      LEFT JOIN user_tickets ut ON ut.order_id = o.id
      WHERE o.user_id = $1
      ORDER BY o.order_date DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await client.query(
      'SELECT COUNT(*) FROM orders WHERE user_id = $1',
      [userId]
    );

    return NextResponse.json({
      orders: ordersResult.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    });

  } catch (error) {
    console.error('주문 내역 조회 중 에러:', error);
    return NextResponse.json(
      { error: '주문 내역 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 