import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // 블로그 포스트 기본 통계
    const totalPosts = await prisma.post.count();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const publishedToday = await prisma.post.count({
      where: {
        published_at: {
          gte: today
        }
      }
    });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const publishedThisWeek = await prisma.post.count({
      where: {
        published_at: {
          gte: weekAgo
        }
      }
    });

    // AI 생성 포스트 수 (ai_generated 필드가 있는 경우)
    const aiGeneratedPosts = await prisma.post.count({
      where: {
        // AI 생성 포스트를 구분할 수 있는 조건 추가
        // 예: content에 특정 키워드가 있거나, 별도 필드가 있는 경우
        OR: [
          { title: { contains: 'AI' } },
          { content: { contains: 'AI' } },
          { meta_description: { contains: 'AI' } }
        ]
      }
    });

    // 참여도 지표
    const engagementStats = await prisma.post.aggregate({
      _sum: {
        view_count: true,
        like_count: true,
        comment_count: true
      }
    });

    // 인기 포스트 TOP 5
    const topPerformers = await prisma.post.findMany({
      orderBy: [
        { view_count: 'desc' },
        { like_count: 'desc' }
      ],
      take: 5,
      select: {
        id: true,
        title: true,
        view_count: true,
        like_count: true,
        comment_count: true
      }
    });

    // 평균 참여율 계산
    const avgEngagementRate = totalPosts > 0 
      ? ((engagementStats._sum.like_count || 0) + (engagementStats._sum.comment_count || 0) * 2) 
        / (engagementStats._sum.view_count || 1) 
      : 0;

    const metrics = {
      totalPosts,
      publishedToday,
      publishedThisWeek,
      aiGeneratedPosts,
      totalViews: engagementStats._sum.view_count || 0,
      totalLikes: engagementStats._sum.like_count || 0,
      totalComments: engagementStats._sum.comment_count || 0,
      avgEngagementRate: Math.min(avgEngagementRate, 1), // 최대 100%로 제한
      topPerformers,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Blog metrics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog metrics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}