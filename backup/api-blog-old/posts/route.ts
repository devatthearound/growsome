import { NextResponse } from 'next/server';
import { blogSupabase as supabase } from '@/lib/supabase-blog';

// GET: 포스트 목록 조회
export async function GET(request: Request) {
  try {
    // Environment variables 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Supabase environment variables not set');
      return NextResponse.json(
        { 
          success: false,
          error: 'Database configuration error',
          posts: [],
          pagination: { total: 0, currentPage: 1, totalPages: 0, hasMore: false }
        },
        { status: 500 }
      );
    }

    console.log('🔍 포스트 목록 API 호출 시작');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    
    console.log('검색 파라미터:', { page, limit, tag, categoryId, search });
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    console.log('📊 Supabase에서 blog_posts 조회 시작...');

    // ✅ 먼저 간단한 쿼리로 테스트 (관계 테이블 없이)
    console.log('🔍 Supabase 테이블 접근 시도: blog_posts');
    
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // 필터 적용
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // 페이지네이션 적용
    query = query.range(from, to);

    const { data: posts, error, count } = await query;

    console.log('Supabase 응답:', { 
      postsCount: posts?.length || 0, 
      error: error?.message,
      errorCode: error?.code 
    });

    if (error) {
      console.error('❌ 포스트 조회 중 Supabase 에러:', error);
      console.error('에러 코드:', error.code);
      console.error('에러 메시지:', error.message);
      console.error('에러 세부사항:', error.details);
      
      return NextResponse.json(
        { 
          success: false,
          error: `포스트 조회 중 오류가 발생했습니다: ${error.message}`,
          posts: [],
          pagination: { total: 0, currentPage: page, totalPages: 0, hasMore: false },
          details: error
        },
        { status: 500 }
      );
    }

    if (!posts || posts.length === 0) {
      console.log('⚠️ 조회된 포스트가 없습니다');
      return NextResponse.json({
        success: true,
        posts: [],
        pagination: { total: 0, currentPage: page, totalPages: 0, hasMore: false },
        message: 'No published posts found'
      });
    }

    console.log(`✅ ${posts.length}개의 포스트 발견`);
    
    // 첫 번째 포스트 정보 로깅
    if (posts.length > 0) {
      console.log('첫 번째 포스트:', {
        id: posts[0].id,
        title: posts[0].title,
        status: posts[0].status,
        published_at: posts[0].published_at,
        category: posts[0].blog_categories?.name,
        author: posts[0].profiles?.full_name
      });
    }

    // 전체 개수 조회
    let total = 0;
    try {
      let countQuery = supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      if (categoryId && categoryId !== 'all') {
        countQuery = countQuery.eq('category_id', categoryId);
      }

      if (tag) {
        countQuery = countQuery.contains('tags', [tag]);
      }

      if (search) {
        countQuery = countQuery.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
      }

      const { count: totalCount, error: countError } = await countQuery;
      
      if (countError) {
        console.warn('포스트 카운트 조회 실패:', countError.message);
        total = posts.length; // fallback
      } else {
        total = totalCount || 0;
      }
    } catch (countErr) {
      console.warn('포스트 카운트 조회 중 예외:', countErr);
      total = posts.length;
    }

    const responseData = {
      success: true,
      posts: posts || [],
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasMore: to < total - 1
      }
    };

    console.log('✅ API 응답 준비 완료:', {
      postCount: responseData.posts.length,
      total: responseData.pagination.total
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ 포스트 조회 중 예상치 못한 에러:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '포스트 조회 중 오류가 발생했습니다.',
        posts: [],
        pagination: { total: 0, currentPage: 1, totalPages: 0, hasMore: false },
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}

// POST: 새 포스트 생성
export async function POST(request: Request) {
  try {
    // Environment variables 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Database configuration error'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // 입력 데이터 검증
    if (!body.title || !body.content) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Title and content are required'
        },
        { status: 400 }
      );
    }
    
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert([{
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        featured_image: body.featured_image,
        author_id: body.author_id,
        category_id: body.category_id,
        status: body.status || 'draft',
        published_at: body.status === 'published' ? new Date().toISOString() : null,
        seo_title: body.seo_title,
        seo_description: body.seo_description,
        meta_keywords: body.meta_keywords,
        tags: body.tags || [],
        featured: body.featured || false,
        reading_time: body.reading_time
      }])
      .select()
      .single();

    if (error) {
      console.error('포스트 생성 중 에러:', error);
      return NextResponse.json(
        { 
          success: false,
          error: '포스트 생성 중 오류가 발생했습니다.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post
    });

  } catch (error) {
    console.error('포스트 생성 중 예상치 못한 에러:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '포스트 생성 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}
