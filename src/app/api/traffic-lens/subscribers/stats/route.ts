import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// GET /api/traffic-lens/subscribers/stats - 구독자 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');

    // 기본 필터 조건
    const where: any = {};
    if (domainId) {
      where.domainId = parseInt(domainId);
    }

    // 총 구독자 수
    const totalSubscribers = await prisma.tLSubscriber.count({ where });
    
    // 활성 구독자 수
    const activeSubscribers = await prisma.tLSubscriber.count({
      where: { ...where, isActive: true }
    });

    // 오늘 신규 구독자 수
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySubscribers = await prisma.tLSubscriber.count({
      where: {
        ...where,
        subscribedAt: {
          gte: today
        }
      }
    });

    // 클릭률 계산 (최근 30일)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const totalNotifications = await prisma.tLNotification.count({
      where: {
        sentAt: { gte: thirtyDaysAgo }
      }
    });
    
    const clickedNotifications = await prisma.tLNotification.count({
      where: {
        sentAt: { gte: thirtyDaysAgo },
        clickedAt: { not: null }
      }
    });

    const clickThroughRate = totalNotifications > 0 
      ? (clickedNotifications / totalNotifications) * 100 
      : 0;

    // 국가별 구독자 수 (상위 5개)
    const topCountries = await prisma.tLSubscriber.groupBy({
      by: ['country'],
      where: { ...where, country: { not: null } },
      _count: {
        country: true
      },
      orderBy: {
        _count: {
          country: 'desc'
        }
      },
      take: 5
    });

    // 최근 7일간 구독자 증가 추이
    const subscriberGrowth = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await prisma.tLSubscriber.count({
        where: {
          ...where,
          subscribedAt: {
            gte: date,
            lt: nextDate
          }
        }
      });

      subscriberGrowth.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    const stats = {
      totalSubscribers,
      activeSubscribers,
      todaySubscribers,
      clickThroughRate,
      topCountries: topCountries.map(item => ({
        country: item.country || 'Unknown',
        count: item._count.country
      })),
      subscriberGrowth
    };

    const response: APIResponse = {
      success: true,
      data: stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch subscriber stats:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'FETCH_STATS_ERROR',
        message: '통계 데이터를 가져오는데 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}