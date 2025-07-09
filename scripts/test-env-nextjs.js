// scripts/test-env-nextjs.js
// Next.js 환경에서 환경변수 확인

console.log('🔍 Next.js 환경변수 확인');
console.log('========================');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
console.log('NODE_ENV:', process.env.NODE_ENV);

// 직접 Supabase 클라이언트 테스트
async function testDirectSupabase() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('\n📡 직접 Supabase 테스트');
    console.log('======================');
    
    // 1. 모든 카테고리 조회
    const { data: all, error: allError } = await supabase
      .from('blog_categories')
      .select('*');
      
    console.log('전체 카테고리:', { count: all?.length, error: allError?.message });
    
    if (all && all.length > 0) {
      console.log('첫 번째 카테고리:', all[0]);
    }
    
    // 2. 활성 카테고리만 조회
    const { data: active, error: activeError } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true);
      
    console.log('활성 카테고리:', { count: active?.length, error: activeError?.message });
    
  } catch (error) {
    console.error('테스트 실패:', error.message);
  }
}

testDirectSupabase();
