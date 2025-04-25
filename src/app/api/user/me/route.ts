// app/api/user/me/route.ts
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth, TokenPayload } from '@/lib/auth';

/**
 * 현재 로그인한 사용자의 정보를 반환하는 API
 */
export async function GET(request: Request) {
  return withAuth(request, getUserInfo);
}

/**
 * 사용자 정보를 조회하는 핸들러 함수
 */
async function getUserInfo(request: Request, user: TokenPayload): Promise<NextResponse> {
  const client = await pool.connect();
  
  try {
    // 사용자 기본 정보 조회
    const userResult = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.username,
        u.company_name,
        u.position,
        u.phone_number,
        u.created_at,
        u.updated_at,
        u.last_login,
        rs.source_name as referral_source
      FROM users u
      LEFT JOIN referral_sources rs ON u.referral_source_id = rs.id
      WHERE u.id = $1`,
      [user.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          isLoggedIn: true,
          error: '사용자를 찾을 수 없습니다.' 
        },
        { status: 404 }
      );
    }

    const userData = userResult.rows[0];

    // 사용자 설정 정보 조회 (선택적)
    let userSettings = {};
    try {
      const settingsResult = await client.query(
        `SELECT settings FROM user_settings WHERE user_id = $1`,
        [user.userId]
      );
      
      if (settingsResult.rows.length > 0) {
        userSettings = settingsResult.rows[0].settings;
      }
    } catch (settingsError) {
      console.log('사용자 설정 조회 실패 (테이블이 없을 수 있음):', settingsError);
    }

    // 구독 정보 조회 (선택적)
    let subscriptions = [];
    try {
      const subscriptionResult = await client.query(
        `SELECT 
          s.id,
          s.product_plan_id,
          s.status,
          s.start_date,
          s.end_date,
          pp.name as plan_name,
          p.name as product_name
        FROM subscriptions s
        JOIN product_plans pp ON s.product_plan_id = pp.id
        JOIN products p ON pp.product_id = p.id
        WHERE s.user_id = $1 AND s.status != 'cancelled'
        ORDER BY s.created_at DESC`,
        [user.userId]
      );
      
      subscriptions = subscriptionResult.rows;
    } catch (subscriptionError) {
      console.log('구독 정보 조회 실패 (테이블이 없을 수 있음):', subscriptionError);
    }

    // 이용권 정보 조회 (선택적)
    let tickets = [];
    try {
      const ticketResult = await client.query(
        `SELECT 
          t.id,
          t.product_plan_id,
          t.status,
          t.start_date,
          t.end_date,
          t.remaining_uses,
          pp.name as plan_name,
          p.name as product_name
        FROM user_tickets t
        JOIN product_plans pp ON t.product_plan_id = pp.id
        JOIN products p ON pp.product_id = p.id
        WHERE t.user_id = $1 AND t.status = 'active'
        ORDER BY t.created_at DESC`,
        [user.userId]
      );
      
      tickets = ticketResult.rows;
    } catch (ticketError) {
      console.log('이용권 정보 조회 실패 (테이블이 없을 수 있음):', ticketError);
    }

    return NextResponse.json({
      success: true,
      isLoggedIn: true,
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        company_name: userData.company_name,
        position: userData.position,
        phone_number: userData.phone_number,
        created_at: userData.created_at,
        last_login_at: userData.last_login_at,
        referral_source: userData.referral_source,
        settings: userSettings,
        subscriptions: subscriptions.length > 0 ? subscriptions : undefined,
        tickets: tickets.length > 0 ? tickets : undefined
      }
    });

  } catch (error: any) {
    console.error('사용자 정보 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false,
        isLoggedIn: true,
        error: '사용자 정보를 조회하는 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}