import { NextResponse } from 'next/server';
import { blogSupabase as supabase } from '@/lib/supabase-blog';

// GET: 카테고리 목록 조회
export async function GET() {
  try {
    console.log('📂 카테고리 목록 조회 시작');

    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('❌ 카테고리 조회 중 에러:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        categories: []
      }, { status: 500 });
    }

    console.log(`✅ ${categories?.length || 0}개의 카테고리 발견`);

    return NextResponse.json({
      success: true,
      categories: categories || []
    });

  } catch (error) {
    console.error('❌ 카테고리 조회 중 예외:', error);
    return NextResponse.json({
      success: false,
      error: '카테고리 조회 중 오류가 발생했습니다.',
      categories: []
    }, { status: 500 });
  }
}

// POST: 새 카테고리 생성
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.slug) {
      return NextResponse.json({
        success: false,
        error: 'Name and slug are required'
      }, { status: 400 });
    }

    const { data: category, error } = await supabase
      .from('blog_categories')
      .insert([{
        name: body.name,
        slug: body.slug,
        description: body.description,
        color: body.color || '#007bff',
        icon: body.icon,
        sort_order: body.sort_order || 0,
        is_active: body.is_active !== false
      }])
      .select()
      .single();

    if (error) {
      console.error('카테고리 생성 중 에러:', error);
      return NextResponse.json({
        success: false,
        error: '카테고리 생성 중 오류가 발생했습니다.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('카테고리 생성 중 예외:', error);
    return NextResponse.json({
      success: false,
      error: '카테고리 생성 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}
