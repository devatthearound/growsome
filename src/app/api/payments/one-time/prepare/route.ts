import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { validateAuth } from '@/utils/auth';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);

    const {
      productPlanId,
      quantity = 1,
      couponCode
    } = await request.json();

    await client.query('BEGIN');

    try {
      // 1. 상품 요금제 정보 조회 및 검증
      const planResult = await client.query(
        `SELECT 
          pp.id,
          pp.price,
          pp.billing_type,
          p.id as product_id,
          p.name as product_name
        FROM product_plans pp
        JOIN products p ON p.id = pp.product_id
        WHERE pp.id = $1 AND pp.billing_type = 'one_time'`,
        [productPlanId]
      );

      if (planResult.rows.length === 0) {
        throw new Error('Invalid one-time product plan');
      }

      const plan = planResult.rows[0];
      const subtotal = plan.price * quantity;
      let discountAmount = 0;
      let couponId = null;

      // 2. 쿠폰 처리
      if (couponCode) {
        // 쿠폰 유효성 검증
        const couponResult = await client.query(
          `SELECT 
            c.*,
            EXISTS (
              SELECT 1 
              FROM coupon_products cp 
              WHERE cp.coupon_id = c.id 
              AND cp.product_id = $1
            ) as is_applicable
          FROM coupons c
          WHERE c.code = $2
          AND c.start_date <= CURRENT_TIMESTAMP
          AND (c.end_date IS NULL OR c.end_date > CURRENT_TIMESTAMP)
          AND c.is_active = true
          AND (
            c.usage_limit IS NULL 
            OR c.usage_limit > (
              SELECT COUNT(*) 
              FROM coupon_usages cu 
              WHERE cu.coupon_id = c.id
            )
          )`,
          [plan.product_id, couponCode]
        );

        if (couponResult.rows.length === 0) {
          throw new Error('Invalid or expired coupon');
        }

        const coupon = couponResult.rows[0];

        if (!coupon.is_applicable) {
          throw new Error('Coupon not applicable to this product');
        }

        // 사용자별 쿠폰 사용 제한 확인
        const userUsageResult = await client.query(
          `SELECT COUNT(*) 
          FROM coupon_usages 
          WHERE coupon_id = $1 AND user_id = $2`,
          [coupon.id, userId]
        );

        if (userUsageResult.rows[0].count >= coupon.user_usage_limit) {
          throw new Error('Coupon usage limit exceeded for user');
        }

        // 할인 금액 계산
        if (coupon.discount_type === 'percentage') {
          discountAmount = Math.floor(subtotal * (coupon.discount_value / 100));
        } else {
          discountAmount = coupon.discount_value;
        }

        // 최대 할인 금액 제한
        if (coupon.max_discount_amount) {
          discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
        }

        couponId = coupon.id;
      }

      const finalAmount = subtotal - discountAmount;

      // 3. 주문 생성
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

      // 4. 주문 상품 추가
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

      // 6. paymentId 생성 (특수문자 제거)
      const timestamp = Date.now();
      const paymentId = `ORDER${orderId}${timestamp}`; // 단순히 ORDER + orderId + timestamp 형식으로 변경

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        order: {
          id: orderId,
          paymentId,
          amount: finalAmount,
          originalAmount: subtotal,
          discountAmount,
          productName: plan.product_name,
          couponCode: couponCode || null
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

    if (error.message === 'Invalid or expired coupon' ||
        error.message === 'Coupon not applicable to this product' ||
        error.message === 'Coupon usage limit exceeded for user') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    console.error('주문 준비 중 에러:', error);
    return NextResponse.json(
      { 
        error: '주문 준비 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 