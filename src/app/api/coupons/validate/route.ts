import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { validateAuth } from '@/app/utils/auth';

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { userId } = await validateAuth(client);
    const { code, productId } = await request.json();

    // 쿠폰 유효성 검증
    const result = await client.query(
      `SELECT 
        c.*,
        EXISTS (
          SELECT 1 
          FROM coupon_products cp 
          WHERE cp.coupon_id = c.id 
          AND cp.product_id = $3
        ) as is_applicable
      FROM coupons c
      WHERE c.code = $1
      AND c.is_active = true
      AND c.start_date <= CURRENT_TIMESTAMP
      AND (c.end_date IS NULL OR c.end_date > CURRENT_TIMESTAMP)
      AND (
        c.usage_limit IS NULL 
        OR c.usage_limit > (
          SELECT COUNT(*) 
          FROM coupon_usages cu 
          WHERE cu.coupon_id = c.id
        )
      )
      AND (
        SELECT COUNT(*) 
        FROM coupon_usages cu 
        WHERE cu.coupon_id = c.id 
        AND cu.user_id = $2
      ) < c.user_usage_limit`,
      [code, userId, productId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '유효하지 않은 쿠폰입니다.' },
        { status: 400 }
      );
    }

    const coupon = result.rows[0];

    if (!coupon.is_applicable) {
      return NextResponse.json(
        { error: '이 상품에는 적용할 수 없는 쿠폰입니다.' },
        { status: 400 }
      );
    }

    // 할인 금액 계산
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      // 상품 가격 조회
      const productResult = await client.query(
        `SELECT pp.price
        FROM product_plans pp
        WHERE pp.product_id = $1
        LIMIT 1`,
        [productId]
      );
      
      const price = productResult.rows[0]?.price || 0;
      discountAmount = Math.floor(price * (coupon.discount_value / 100));
      
      if (coupon.max_discount_amount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        name: coupon.name,
        discountAmount
      }
    });

  } catch (error: any) {
    console.error('쿠폰 검증 중 에러:', error);
    return NextResponse.json(
      { error: '쿠폰 검증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}