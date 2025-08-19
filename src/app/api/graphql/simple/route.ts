// 임시 목업 데이터가 포함된 간단한 GraphQL API
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Simple GraphQL endpoint called');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { query, variables } = body;
    
    // 목업 카테고리 데이터
    const mockCategories = [
      { id: 1, name: '기술', slug: 'tech', contentCount: 2 },
      { id: 2, name: '디자인', slug: 'design', contentCount: 1 },
      { id: 3, name: '비즈니스', slug: 'business', contentCount: 1 },
      { id: 4, name: '라이프스타일', slug: 'life', contentCount: 0 }
    ];
    
    // 목업 컨텐츠 데이터
    const mockContents = [
      {
        id: 1,
        title: 'Prisma와 GraphQL로 블로그 시스템 구축하기',
        slug: 'prisma-graphql-blog-system',
        contentBody: 'Prisma와 GraphQL을 사용해서 현대적인 블로그 시스템을 구축하는 방법을 알아보겠습니다. TypeScript와 완벽하게 통합되는 차세대 ORM인 Prisma의 장점과 GraphQL API 설계 방법을 다룹니다.',
        excerpt: 'Prisma와 GraphQL을 사용해서 현대적인 블로그 시스템을 구축하는 방법을 알아보겠습니다.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        viewCount: 1250,
        likeCount: 23,
        commentCount: 5,
        publishedAt: new Date().toISOString(),
        author: {
          username: '관리자',
          avatar: null
        },
        category: {
          id: 1,
          name: '기술',
          slug: 'tech'
        }
      },
      {
        id: 2,
        title: 'Next.js 15의 새로운 기능들',
        slug: 'nextjs-15-new-features',
        contentBody: 'Next.js 15가 출시되면서 많은 새로운 기능들이 추가되었습니다. 향상된 성능, 새로운 개발자 경험, 실험적 기능들에 대해 자세히 알아보겠습니다.',
        excerpt: 'Next.js 15가 출시되면서 많은 새로운 기능들이 추가되었습니다.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
        viewCount: 987,
        likeCount: 18,
        commentCount: 3,
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        author: {
          username: '관리자',
          avatar: null
        },
        category: {
          id: 1,
          name: '기술',
          slug: 'tech'
        }
      },
      {
        id: 3,
        title: 'UI/UX 디자인의 기본 원칙',
        slug: 'ui-ux-design-principles',
        contentBody: '좋은 사용자 경험을 제공하는 것은 성공적인 디지털 제품의 핵심입니다. 사용자 중심 설계, 일관성, 단순함 등의 기본 원칙들을 알아보겠습니다.',
        excerpt: '좋은 사용자 경험을 제공하는 것은 성공적인 디지털 제품의 핵심입니다.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
        viewCount: 756,
        likeCount: 15,
        commentCount: 2,
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        author: {
          username: '관리자',
          avatar: null
        },
        category: {
          id: 2,
          name: '디자인',
          slug: 'design'
        }
      },
      {
        id: 4,
        title: '스타트업 창업 가이드',
        slug: 'startup-guide',
        contentBody: '스타트업을 시작하는 것은 도전적이지만 보람 있는 여정입니다. 아이디어 검증부터 자금 조달까지 성공적인 창업을 위한 단계별 가이드를 제공합니다.',
        excerpt: '스타트업을 시작하는 것은 도전적이지만 보람 있는 여정입니다.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
        viewCount: 543,
        likeCount: 12,
        commentCount: 1,
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        author: {
          username: '관리자',
          avatar: null
        },
        category: {
          id: 3,
          name: '비즈니스',
          slug: 'business'
        }
      }
    ];
    
    // 간단한 쿼리 파싱
    if (query.includes('categories')) {
      console.log('Categories query detected - returning mock data');
      
      return NextResponse.json({
        data: {
          categories: mockCategories
        }
      });
    }
    
    if (query.includes('contents')) {
      console.log('Contents query detected - returning mock data');
      
      let filteredContents = mockContents;
      
      // 카테고리 필터링
      if (variables?.categoryId) {
        filteredContents = mockContents.filter(content => 
          content.category.id === variables.categoryId
        );
      }
      
      // 개수 제한
      const limit = variables?.first || 10;
      filteredContents = filteredContents.slice(0, limit);
      
      console.log(`Returning ${filteredContents.length} mock contents`);
      
      return NextResponse.json({
        data: {
          contents: filteredContents
        }
      });
    }
    
    // 기본 응답
    return NextResponse.json({
      data: {
        hello: "GraphQL is working with mock data!",
        version: "1.0.0"
      }
    });
    
  } catch (error) {
    console.error('GraphQL endpoint error:', error);
    return NextResponse.json({
      errors: [{
        message: (error as any).message,
        extensions: { code: 'INTERNAL_ERROR' }
      }]
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "GraphQL endpoint is running with mock data. Use POST method for queries.",
    status: "healthy",
    mockDataEnabled: true
  });
}
