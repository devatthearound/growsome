import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse, DashboardStats } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// GET /api/traffic-lens/analytics/overview - 대시보드 개요 데이터
export async function GET(request: NextRequest) {
  try {
    // TODO: 실제 사용자 인증 구현
    const userId = 1; // 임시 사용자 ID

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');
    const period = searchParams.get('period') || '30'; // 기본 30일
    
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    
    // 기본 필터 조건
    const baseWhere: any = {};
    const userDomains = await prisma.tLDomain.findMany({
      where: { userId },
      select: { id: true },
    });
    const userDomainIds = userDomains.map(d => d.id);

    if (domainId) {
      const targetDomainId = parseInt(domainId);
      if (userDomainIds.includes(targetDomainId)) {
        baseWhere.domainId = targetDomainId;
      } else {
        // 권한이 없는 도메인
        const response: APIResponse = {
          success: false,
          error: {
            code: 'DOMAIN_ACCESS_DENIED',
            message: '해당 도메인에 접근 권한이 없습니다.',
          },
        };
        return NextResponse.json(response, { status: 403 });
      }
    } else {
      baseWhere.domainId = { in: userDomainIds };
    }

    // 총 구독자 수
    const totalSubscribers = await prisma.tLSubscriber.count({
      where: {
        ...baseWhere,
        isActive: true,
      },
    });

    // 오늘 발송된 알림 수
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayNotifications = await prisma.tLNotification.count({
      where: {
        sentAt: {
          gte: today,
          lt: tomorrow,
        },
        campaign: {
          domainId: baseWhere.domainId,
        },
      },
    });

    // 활성 구독자 수 (최근 30일 내 활동)
    const activeSubscribers = await prisma.tLSubscriber.count({
      where: {
        ...baseWhere,
        isActive: true,
        lastSeen: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일 전
        },
      },
    });

    // 평균 클릭률 계산 - Prisma ORM 방식으로 변경
    let totalNotifications = 0;
    let totalClicks = 0;

    try {
      const notificationStats = await prisma.tLNotification.findMany({
        where: {
          sentAt: {
            gte: startDate,
          },
          campaign: {
            domainId: domainId ? parseInt(domainId) : { in: userDomainIds },
          },
        },
        select: {
          status: true,
        },
      });

      totalNotifications = notificationStats.length;
      totalClicks = notificationStats.filter(n => n.status === 'clicked').length;
    } catch (error) {
      console.warn('Failed to fetch notification stats:', error);
    }

    const averageClickRate = totalNotifications > 0 ? (totalClicks / totalNotifications) * 100 : 0;

    // 최근 캠페인 목록
    const recentCampaigns = await prisma.tLCampaign.findMany({
      where: {
        ...baseWhere,
        status: 'sent',
      },
      include: {
        domain: {
          select: {
            domain: true,
            siteName: true,
          },
        },
        _count: {
          select: {
            notifications: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: 5,
    });

    // 구독자 증가 데이터 (최근 30일) - Prisma ORM 방식으로 변경
    const subscriberGrowthData = await prisma.tLSubscriber.groupBy({
      by: ['subscribedAt'],
      where: {
        subscribedAt: {
          gte: startDate,
        },
        domainId: domainId ? parseInt(domainId) : { in: userDomainIds },
      },
      _count: {
        id: true,
      },
      orderBy: {
        subscribedAt: 'desc',
      },
      take: 30,
    });

    const subscriberGrowth = subscriberGrowthData.map(item => ({
      date: item.subscribedAt.toISOString().split('T')[0],
      subscribers: item._count.id,
    }));

    // 캠페인 성과 데이터
    const campaignPerformance = await Promise.all(
      recentCampaigns.map(async (campaign) => {
        const clickCount = await prisma.tLNotification.count({
          where: {
            campaignId: campaign.id,
            status: 'clicked',
          },
        });

        const sent = campaign._count.notifications;
        const clicked = clickCount;
        const clickRate = sent > 0 ? (clicked / sent) * 100 : 0;

        return {
          campaignId: campaign.id,
          title: campaign.title,
          sent,
          clicked,
          clickRate: parseFloat(clickRate.toFixed(2)),
        };
      })
    );

    // 총 캠페인 수
    const totalCampaigns = await prisma.tLCampaign.count({
      where: baseWhere,
    });

    // 전체 발송된 알림 수
    const sentNotifications = await prisma.tLNotification.count({
      where: {
        sentAt: {
          gte: startDate,
        },
        campaign: {
          domainId: domainId ? parseInt(domainId) : { in: userDomainIds },
        },
      },
    });

    const dashboardStats: DashboardStats = {
      totalSubscribers,
      activeSubscribers,
      totalCampaigns,
      sentNotifications,
      clickRate: parseFloat(averageClickRate.toFixed(2)),
      recentCampaigns,
      subscriberGrowth,
      topPerformingCampaigns: campaignPerformance,
      todayNotifications,
      averageClickRate: parseFloat(averageClickRate.toFixed(2)),
    };

    const response: APIResponse = {
      success: true,
      data: dashboardStats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch analytics overview:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'FETCH_ANALYTICS_ERROR',
        message: '분석 데이터를 가져오는데 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
