import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 매우 간단한 포스트 목록 API
export async function GET() {
  try {
    console.log('=== 간단한 포스트 API 테스트 ===');
    
    // 환경 변수 확인
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Key 길이:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
    
    // 매우 간단한 쿼리
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, content, status, published_at')
      .limit(5);
    
    console.log('Supabase 쿼리 결과:', { data, error });
    
    if (error) {
      console.error('Supabase 오류:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 });
    }
    
    console.log(`✅ ${data?.length || 0}개의 포스트 조회됨`);
    
    return NextResponse.json({
      success: true,
      posts: data || [],
      count: data?.length || 0,
      pagination: {
        total: data?.length || 0,
        currentPage: 1,
        totalPages: 1,
        hasMore: false
      }
    });
    
  } catch (error) {
    console.error('예외 발생:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
