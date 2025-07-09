import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('🔍 환경변수 확인:', {
      url: supabaseUrl,
      hasKey: !!supabaseKey,
      keyStart: supabaseKey?.substring(0, 20) + '...'
    });

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables'
      });
    }

    // 1. 헬스 체크
    console.log('🔗 Supabase 헬스 체크 시도...');
    const healthResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    console.log('🏥 헬스 체크 결과:', {
      status: healthResponse.status,
      ok: healthResponse.ok
    });

    // 2. 테이블 목록 조회
    console.log('📋 테이블 목록 조회 시도...');
    const tablesResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=id&limit=1`, {
      method: 'HEAD', // HEAD 요청으로 테이블 존재 여부만 확인
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 테이블 접근 결과:', {
      status: tablesResponse.status,
      ok: tablesResponse.ok,
      headers: Object.fromEntries(tablesResponse.headers.entries())
    });

    // 3. 실제 데이터 조회 시도
    console.log('📝 데이터 조회 시도...');
    const dataResponse = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=id,title&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await dataResponse.text();
    console.log('📄 응답 내용:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    return NextResponse.json({
      success: dataResponse.ok,
      status: dataResponse.status,
      headers: Object.fromEntries(dataResponse.headers.entries()),
      data: responseData,
      tests: {
        health: {
          status: healthResponse.status,
          ok: healthResponse.ok
        },
        tableAccess: {
          status: tablesResponse.status,
          ok: tablesResponse.ok
        },
        dataFetch: {
          status: dataResponse.status,
          ok: dataResponse.ok
        }
      }
    });

  } catch (error) {
    console.error('❌ Raw API test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
