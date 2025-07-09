import { NextResponse } from 'next/server';
import { blogSupabase as supabase } from '@/lib/supabase-blog';

export async function GET() {
  try {
    console.log('🧪 Simple Supabase table test');
    
    // 가장 간단한 테스트
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title')
      .limit(1);

    console.log('📊 Test result:', { data, error });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Table access successful'
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
