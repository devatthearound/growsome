import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse } from '@/types/traffic-lens';

const prisma = new PrismaClient();

interface CampaignAnalytics {
  id: number;
  title: string;
  domain: string;
  sentAt: string;
  totalSent: number;
  totalClicks: number;
  totalViews: number;
  clickRate: number;
  viewRate: number;
  status: string;
  targetType: string;
}

// GET /api/traffic-lens/analytics/campaigns - 캠페인 성과 분석
export async function GET(request: NextRequest) {
  try {
    // TODO: 실제 사용자 인증 구현
    const userId = 1; // 임시 사용자 ID

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');
    const period = searchParams.get('period') || '30';
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    
    const skip = (page - 1) * limit;

    // 사용자 도메인 확인
    const userDomains = await prisma.tLDomain.findMany({
      where: { userId },
      select: { id: true },
    });
    const userDomainIds = userDomains.map(d => d.id);

    // 필터 조건 구성
    const where: any = {
      domainId: { in: userDomainIds },
      createdAt: { gte: startDate },
    };

    if (domainId) {
      const targetDomainId = parseInt(domainId);
      if (userDomainIds.includes(targetDomainId)) {
        where.domainId = targetDomainId;
      } else {
        return NextResponse.json({
          success: false,
          error: { code: 'DOMAIN_ACCESS_DENIED', message: '해당 도메인에 접근 권한이 없습니다.' }
        }, { status: 403 });
      }
    }

    if (status) {
      where.status = status;
    }

    // 총 개수 조회
    const total = await prisma.tLCampaign.count({ where });

    // 캠페인 목록 조회
    const campaigns = await prisma.tLCampaign.findMany({
      where,
      include: {
        domain: {
          select: {
            domain: true,
            siteName: true,
          },
        },
        notifications: {
          select: {
            id: true,
            status: true,
            sentAt: true,
            clickedAt: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
      skip,
      take: limit,
    });

    // 캠페인 분석 데이터 구성
    const campaignAnalytics: CampaignAnalytics[] = campaigns.map(campaign => {
      const totalSent = campaign.notifications.length;
      const totalClicks = campaign.notifications.filter(n => n.status === 'clicked').length;
      const totalViews = campaign.notifications.filter(n => n.sentAt).length;
      
      const clickRate = totalSent > 0 ? (totalClicks / totalSent) * 100 : 0;
      const viewRate = totalSent > 0 ? (totalViews / totalSent) * 100 : 0;

      return {
        id: campaign.id,
        title: campaign.title,
        domain: campaign.domain.siteName,
        sentAt: campaign.sentAt?.toISOString() || '',
        totalSent,
        totalClicks,
        totalViews,
        clickRate: parseFloat(clickRate.toFixed(2)),
        viewRate: parseFloat(viewRate.toFixed(2)),
        status: campaign.status,
        targetType: campaign.targetType,
      };
    });

    const response: APIResponse = {
      success: true,
      data: {
        campaigns: campaignAnalytics,
        totalCount: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch campaign analytics:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'FETCH_CAMPAIGN_ANALYTICS_ERROR',
        message: '캠페인 분석 데이터를 가져오는데 실패했습니다.',
      },
    }, { status: 500 });
  }
}