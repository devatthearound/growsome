import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: 개별 포스트 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const includeAll = url.searchParams.get('includeAll') === 'true';
    
    console.log('=== 상세페이지 API 호출 ===');
    console.log('요청된 ID:', id);
    console.log('ID 타입:', typeof id);
    console.log('UUID 유효성:', /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id));
    console.log('모든 상태 포함:', includeAll);

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id);
    
    // includeAll이 false이면 published 만 조회
    if (!includeAll) {
      query = query.eq('status', 'published');
    }

    const { data: post, error } = await query.single();

    if (error) {
      console.error('❌ Supabase 에러:', error);
      console.error('에러 코드:', error.code);
      console.error('에러 메시지:', error.message);
      console.error('에러 세부사항:', error.details);
      return NextResponse.json(
        { 
          success: false,
          error: `포스트를 찾을 수 없습니다. (ID: ${id})`,
          details: error.message
        },
        { status: 404 }
      );
    }
    
    if (!post) {
      console.warn('⚠️ 포스트를 찾을 수 없음 (null/undefined)');
      return NextResponse.json(
        { 
          success: false,
          error: `해당 ID의 발행된 포스트를 찾을 수 없습니다. (ID: ${id})`
        },
        { status: 404 }
      );
    }
    
    console.log('✅ 포스트 찾기 성공!');
    console.log('포스트 데이터:', {
      id: post.id,
      title: post.title,
      status: post.status,
      published_at: post.published_at,
      content_length: post.content?.length || 0
    });

    // 조회수 증가
    await supabase
      .from('blog_posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', id);

    // 조회 로그 기록 (선택사항)
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    
    await supabase
      .from('blog_post_views')
      .insert([{
        post_id: id,
        ip_address: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1',
        user_agent: userAgent,
        referrer: referer,
        device_type: userAgent.toLowerCase().includes('mobile') ? 'mobile' : 'desktop'
      }]);

    const responseData = {
      success: true,
      post: {
        ...post,
        view_count: (post.view_count || 0) + 1
      }
    };
    
    console.log('✅ 응답 데이터 준비 완료');
    console.log('응답 키들:', Object.keys(responseData.post));
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('포스트 조회 중 에러:', error);
    return NextResponse.json(
      { error: '포스트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 포스트 수정
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: any = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      featured_image: body.featured_image,
      category_id: body.category_id,
      status: body.status,
      seo_title: body.seo_title,
      seo_description: body.seo_description,
      meta_keywords: body.meta_keywords,
      tags: body.tags || [],
      featured: body.featured || false,
      reading_time: body.reading_time,
      updated_at: new Date().toISOString()
    };

    // 상태가 published로 변경되면 published_at 설정
    if (body.status === 'published' && !body.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    const { data: post, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('포스트 수정 중 에러:', error);
      return NextResponse.json(
        { error: '포스트 수정 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post
    });

  } catch (error) {
    console.error('포스트 수정 중 에러:', error);
    return NextResponse.json(
      { error: '포스트 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 포스트 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('포스트 삭제 중 에러:', error);
      return NextResponse.json(
        { error: '포스트 삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '포스트가 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('포스트 삭제 중 에러:', error);
    return NextResponse.json(
      { error: '포스트 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}