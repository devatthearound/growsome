import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.courseCategory.findMany({
      where: {
        isVisible: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Course categories fetch error:', error);
    
    return NextResponse.json(
      { error: '카테고리 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      slug,
      description,
      color = '#5C59E8',
      sortOrder = 0,
      isVisible = true
    } = body;

    // 필수 필드 검증
    if (!name || !slug) {
      return NextResponse.json(
        { error: '이름과 슬러그는 필수입니다.' },
        { status: 400 }
      );
    }

    // slug 중복 체크
    const existingCategory = await prisma.courseCategory.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: '이미 존재하는 슬러그입니다.' },
        { status: 409 }
      );
    }

    // 카테고리 생성
    const category = await prisma.courseCategory.create({
      data: {
        name,
        slug,
        description,
        color,
        sortOrder,
        isVisible
      }
    });

    return NextResponse.json({
      success: true,
      message: '카테고리가 성공적으로 생성되었습니다.',
      category
    }, { status: 201 });

  } catch (error) {
    console.error('Course category creation error:', error);
    
    return NextResponse.json(
      { error: '카테고리 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}