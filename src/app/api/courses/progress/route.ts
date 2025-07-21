import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, isCompleted, watchTime, lastPosition } = body;

    // TODO: 실제 사용자 인증 구현
    // 현재는 테스트용으로 임시 사용자 ID 사용
    const userId = 1; // 실제로는 JWT 토큰에서 추출

    // 필수 필드 검증
    if (!courseId) {
      return NextResponse.json(
        { error: '강의 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 강의 존재 확인
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json(
        { error: '존재하지 않는 강의입니다.' },
        { status: 404 }
      );
    }

    // 사용자 진도 업데이트 또는 생성
    const progress = await prisma.userCourseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      update: {
        isCompleted: isCompleted || false,
        watchTime: watchTime || 0,
        lastPosition: lastPosition || 0,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date()
      },
      create: {
        userId,
        courseId,
        isCompleted: isCompleted || false,
        watchTime: watchTime || 0,
        lastPosition: lastPosition || 0,
        completedAt: isCompleted ? new Date() : null
      }
    });

    return NextResponse.json({
      success: true,
      message: '진도가 업데이트되었습니다.',
      progress: {
        courseId: progress.courseId,
        isCompleted: progress.isCompleted,
        watchTime: progress.watchTime,
        lastPosition: progress.lastPosition,
        completedAt: progress.completedAt
      }
    });

  } catch (error) {
    console.error('Progress update error:', error);
    
    return NextResponse.json(
      { error: '진도 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    // TODO: 실제 사용자 인증 구현
    const userId = 1;

    const whereClause: any = courseId 
      ? { userId, courseId: parseInt(courseId) }
      : { userId };

    const progressList = await prisma.userCourseProgress.findMany({
      where: whereClause,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            duration: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      progress: progressList.map(p => ({
        courseId: p.courseId,
        course: p.course,
        isCompleted: p.isCompleted,
        watchTime: p.watchTime,
        lastPosition: p.lastPosition,
        completedAt: p.completedAt,
        updatedAt: p.updatedAt
      }))
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    
    return NextResponse.json(
      { error: '진도 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}