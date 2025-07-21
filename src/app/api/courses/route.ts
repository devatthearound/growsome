import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const preview = searchParams.get('preview') === 'true';
    const category = searchParams.get('category');
    
    // 미리보기용 강의만 가져오기 (공개 강의 + 일부 프리미엄 강의)
    if (preview) {
      const courses = await prisma.course.findMany({
        where: {
          isVisible: true,
          OR: [
            { isPublic: true }, // 무료 미리보기 강의
            { 
              isPublic: false,
              isPremium: true // 프리미엄 강의 (미리보기용)
            }
          ]
        },
        include: {
          category: true
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        take: 8 // 최대 8개 강의만
      });

      return NextResponse.json({
        success: true,
        courses: courses.map(course => ({
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDescription: course.shortDescription,
          thumbnailUrl: course.thumbnailUrl,
          duration: course.duration,
          level: course.level,
          tags: course.tags,
          isPublic: course.isPublic,
          isPremium: course.isPremium,
          viewCount: course.viewCount,
          likeCount: course.likeCount,
          category: {
            id: course.category.id,
            name: course.category.name,
            slug: course.category.slug,
            color: course.category.color
          },
          // Vimeo URL은 공개 강의만 제공
          vimeoUrl: course.isPublic ? course.vimeoUrl : null,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt
        }))
      });
    }

    // 전체 강의 목록 (인증된 사용자용)
    const whereClause: any = {
      isVisible: true
    };

    if (category) {
      whereClause.category = {
        slug: category
      };
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      courses: courses.map(course => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.shortDescription,
        vimeoId: course.vimeoId,
        vimeoUrl: course.vimeoUrl,
        thumbnailUrl: course.thumbnailUrl,
        duration: course.duration,
        level: course.level,
        tags: course.tags,
        isPublic: course.isPublic,
        isPremium: course.isPremium,
        viewCount: course.viewCount,
        likeCount: course.likeCount,
        category: {
          id: course.category.id,
          name: course.category.name,
          slug: course.category.slug,
          color: course.category.color
        },
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        publishedAt: course.publishedAt
      }))
    });

  } catch (error: any) {
    console.error('Courses fetch error:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    
    return NextResponse.json(
      { 
        error: '강의 목록을 가져오는 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      title,
      slug,
      description,
      shortDescription,
      vimeoId,
      vimeoUrl,
      thumbnailUrl,
      duration,
      categoryId,
      level = 'beginner',
      tags = [],
      isPublic = false,
      isPremium = true,
      isVisible = true,
      sortOrder = 0
    } = body;

    // 필수 필드 검증
    if (!title || !slug || !vimeoId || !vimeoUrl || !categoryId) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // slug 중복 체크
    const existingCourse = await prisma.course.findUnique({
      where: { slug }
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: '이미 존재하는 슬러그입니다.' },
        { status: 409 }
      );
    }

    // 카테고리 존재 확인
    const category = await prisma.courseCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: '존재하지 않는 카테고리입니다.' },
        { status: 404 }
      );
    }

    // 강의 생성
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDescription,
        vimeoId,
        vimeoUrl,
        thumbnailUrl,
        duration,
        categoryId,
        level,
        tags,
        isPublic,
        isPremium,
        isVisible,
        sortOrder,
        publishedAt: isVisible ? new Date() : null
      },
      include: {
        category: true
      }
    });

    return NextResponse.json({
      success: true,
      message: '강의가 성공적으로 생성되었습니다.',
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        category: course.category,
        createdAt: course.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Course creation error:', error);
    
    return NextResponse.json(
      { error: '강의 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}