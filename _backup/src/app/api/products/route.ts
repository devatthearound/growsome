import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// 상품 목록 조회 API
export async function GET(request: Request) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category_id,
        c.name as category_name,
        p.created_at,
        p.updated_at,
        json_agg(
          json_build_object(
            'id', pp.id,
            'name', pp.name,
            'origin_price', pp.origin_price,
            'discount_amount', pp.discount_amount,
            'price', pp.price,
            'billing_type', pp.billing_type,
            'billing_cycle', pp.billing_cycle,
            'features', pp.features
          )
        ) as plans
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_plans pp ON pp.product_id = p.id
    `;

    const params: any[] = [];
    let whereClause = '';

    if (categoryId) {
      whereClause = 'WHERE p.category_id = $1';
      params.push(categoryId);
    }

    query += whereClause;
    query += `
      GROUP BY p.id, c.name
      ORDER BY p.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(limit, offset);

    const result = await client.query(query, params);

    // 전체 상품 수 조회
    let countQuery = 'SELECT COUNT(*) FROM products';
    if (categoryId) {
      countQuery += ' WHERE category_id = $1';
    }
    const countResult = await client.query(countQuery, categoryId ? [categoryId] : []);

    return NextResponse.json({
      success: true,
      products: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset
    });

  } catch (error: any) {
    console.error('상품 조회 중 에러:', error);
    return NextResponse.json(
      { 
        error: '상품 조회 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// 상품 생성 API (관리자용)
export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { name, description, categoryId, plans } = await request.json();

    await client.query('BEGIN');

    // 상품 생성
    const productResult = await client.query(
      `INSERT INTO products (
        name, 
        description, 
        category_id, 
        created_at, 
        updated_at
      )
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id`,
      [name, description, categoryId]
    );

    const productId = productResult.rows[0].id;

    // 요금제 생성
    if (plans && Array.isArray(plans)) {
      for (const plan of plans) {
        await client.query(
          `INSERT INTO product_plans (
            product_id,
            name,
            origin_price,
            discount_amount,
            billing_type,
            billing_cycle,
            features,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [
            productId,
            plan.name,
            plan.origin_price,
            plan.discount_amount || null,
            plan.billing_type,
            plan.billing_cycle || null,
            plan.features || {}
          ]
        );
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: '상품이 생성되었습니다.',
      productId
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('상품 생성 중 에러:', error);
    return NextResponse.json(
      { 
        error: '상품 생성 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
} 