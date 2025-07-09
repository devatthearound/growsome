import { NextResponse } from 'next/server';
import { blogSupabase as supabase } from '@/lib/supabase-blog';

export async function GET() {
  try {
    console.log('🧪 Supabase 연결 테스트 시작');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // 1. 기본 연결 테스트
    const { data: healthCheck, error: healthError } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.error('❌ Supabase 연결 실패:', healthError);
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: healthError
      });
    }
    
    console.log('✅ Supabase 연결 성공');
    
    // 2. 테이블 존재 확인
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(5);
    
    if (postsError) {
      console.error('❌ blog_posts 테이블 조회 실패:', postsError);
      return NextResponse.json({
        success: false,
        error: 'blog_posts table access failed',
        details: postsError
      });
    }
    
    console.log(`📊 blog_posts 테이블에서 ${posts?.length || 0}개 포스트 발견`);
    
    // 3. published 포스트만 조회
    const { data: publishedPosts, error: publishedError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published');
    
    if (publishedError) {
      console.error('❌ published 포스트 조회 실패:', publishedError);
      return NextResponse.json({
        success: false,
        error: 'Failed to query published posts',
        details: publishedError
      });
    }
    
    console.log(`📝 published 상태 포스트: ${publishedPosts?.length || 0}개`);
    
    // 4. 카테고리 테이블 확인
    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('*')
      .limit(5);
    
    const categoryStatus = categoriesError 
      ? `❌ 오류: ${categoriesError.message}` 
      : `✅ ${categories?.length || 0}개 카테고리`;
    
    // 5. profiles 테이블 확인  
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    const profileStatus = profilesError 
      ? `❌ 오류: ${profilesError.message}` 
      : `✅ ${profiles?.length || 0}개 프로필`;
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection test completed',
      results: {
        connection: '✅ 연결 성공',
        blog_posts_total: posts?.length || 0,
        blog_posts_published: publishedPosts?.length || 0,
        blog_categories: categoryStatus,
        profiles: profileStatus,
        sample_posts: publishedPosts?.slice(0, 3).map(post => ({
          id: post.id,
          title: post.title,
          status: post.status,
          published_at: post.published_at
        })) || []
      }
    });
    
  } catch (error) {
    console.error('❌ 테스트 중 예외 발생:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed with exception',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
