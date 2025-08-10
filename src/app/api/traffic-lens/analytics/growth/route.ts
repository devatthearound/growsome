import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse } from '@/types/traffic-lens';

const prisma = new PrismaClient();

interface GrowthData {
  date: string;
  totalSubscribers: number;
  newSubscribers: number;
  unsubscribed: number;
  netGrowth: number;
  activeSubscribers: number;
}

interface CountryData {
  country: string;
  countryName: string;
  subscribers: number;
  percentage: number;
  growth: number;
}

// GET /api/traffic-lens/analytics/growth - 구독자 증가 및 지역 분석
export async function GET(request: NextRequest) {
  try {
    console.log('Growth API 호출 시작');
    
    // TODO: 실제 사용자 인증 구현
    const userId = 1; // 임시 사용자 ID

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');
    const period = searchParams.get('period') || '30';
    
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    console.log('Growth API 파라미터:', { domainId, period, startDate });

    // 사용자 도메인 확인
    const userDomains = await prisma.tLDomain.findMany({
      where: { userId },
      select: { id: true },
    });
    const userDomainIds = userDomains.map(d => d.id);
    
    console.log('사용자 도메인:', userDomainIds);

    // 도메인이 없는 경우 빈 데이터 반환
    if (userDomainIds.length === 0) {
      console.log('사용자 도메인이 없음');
      return NextResponse.json({
        success: true,
        data: {
          growthData: [],
          countryData: [],
          summary: {
            totalSubscribers: 0,
            periodGrowth: 0,
            periodUnsubscribed: 0,
            netGrowth: 0,
            averageActiveRate: 0,
          },
        },
      });
    }

    // 도메인 필터링
    const domainFilter = domainId && userDomainIds.includes(parseInt(domainId))
      ? { domainId: parseInt(domainId) }
      : { domainId: { in: userDomainIds } };

    console.log('도메인 필터:', domainFilter);

    // 총 구독자 수 (간단한 쿼리)
    const totalSubscribers = await prisma.tLSubscriber.count({
      where: {
        isActive: true,
        ...domainFilter,
      },
    });
    
    console.log('총 구독자 수:', totalSubscribers);

    // 기간 내 신규 구독자 수
    const newSubscribers = await prisma.tLSubscriber.count({
      where: {
        subscribedAt: {
          gte: startDate,
        },
        isActive: true,
        ...domainFilter,
      },
    });
    
    console.log('신규 구독자 수:', newSubscribers);

    // 활성 구독자 수 (최근 30일 내 활동)
    const activeSubscribers = await prisma.tLSubscriber.count({
      where: {
        isActive: true,
        lastSeen: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        ...domainFilter,
      },
    });
    
    console.log('활성 구독자 수:', activeSubscribers);

    // 간단한 성장 데이터 생성 (최근 7일)
    const growthData: GrowthData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      // 해당 날짜의 신규 구독자
      const dayNewSubscribers = await prisma.tLSubscriber.count({
        where: {
          subscribedAt: {
            gte: dayStart,
            lte: dayEnd,
          },
          ...domainFilter,
        },
      });
      
      growthData.push({
        date: dateStr,
        totalSubscribers: totalSubscribers,
        newSubscribers: dayNewSubscribers,
        unsubscribed: 0, // 임시로 0
        netGrowth: dayNewSubscribers,
        activeSubscribers: activeSubscribers,
      });
    }
    
    console.log('성장 데이터 생성 완료:', growthData.length);

    // 국가별 구독자 분포 (간단한 버전)
    const countryStats = await prisma.tLSubscriber.groupBy({
      by: ['country'],
      where: {
        isActive: true,
        country: {
          not: null,
        },
        ...domainFilter,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10, // 상위 10개 국가만
    });
    
    console.log('국가 통계:', countryStats.length);

    // 국가명 매핑
    const countryNames: Record<string, string> = {
      'KR': '대한민국',
      'US': '미국',
      'JP': '일본',
      'CN': '중국',
      'GB': '영국',
      'DE': '독일',
      'FR': '프랑스',
      'CA': '캐나다',
      'AU': '호주',
      'IN': '인도',
    };

    const countryData: CountryData[] = countryStats.map(item => {
      const current = item._count.id;
      const percentage = totalSubscribers > 0 ? (current / totalSubscribers) * 100 : 0;

      return {
        country: item.country || 'Unknown',
        countryName: countryNames[item.country || ''] || item.country || 'Unknown',
        subscribers: current,
        percentage: parseFloat(percentage.toFixed(1)),
        growth: 0, // 임시로 0
      };
    });
    
    console.log('국가 데이터 생성 완료:', countryData.length);

    const response: APIResponse = {
      success: true,
      data: {
        growthData,
        countryData,
        summary: {
          totalSubscribers,
          periodGrowth: newSubscribers,
          periodUnsubscribed: 0,
          netGrowth: newSubscribers,
          averageActiveRate: totalSubscribers > 0 ? (activeSubscribers / totalSubscribers) * 100 : 0,
        },
      },
    };
    
    console.log('Growth API 응답 준비 완료');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Growth API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'FETCH_GROWTH_ANALYTICS_ERROR',
        message: '성장 분석 데이터를 가져오는데 실패했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
