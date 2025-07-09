import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 환경변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('🔍 Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl,
      keyLength: supabaseKey?.length
    });

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey
        }
      });
    }

    // 수동으로 Supabase REST API 호출 테스트
    const response = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=id,title&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      data: data,
      url: `${supabaseUrl}/rest/v1/blog_posts`,
      hasValidCredentials: response.ok
    });

  } catch (error) {
    console.error('❌ Direct API test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
