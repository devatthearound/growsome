import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse, SubscribeRequest } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// IP 주소에서 국가/도시 정보 추출 (간단한 예시)
function getLocationFromIP(ip: string): { country?: string; city?: string } {
  // 실제로는 GeoIP 서비스를 사용해야 합니다
  // 예: MaxMind GeoLite2, ip-api.com 등
  return {
    country: 'KR', // 임시값
    city: 'Seoul', // 임시값
  };
}

// 클라이언트 IP 주소 추출
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// GET /api/traffic-lens/subscribers - 구독자 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const isActive = searchParams.get('isActive');
    const country = searchParams.get('country');
    
    const skip = (page - 1) * limit;
    
    // 필터 조건 구성
    const where: any = {};
    
    if (domainId) {
      where.domainId = parseInt(domainId);
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (country) {
      where.country = country;
    }

    // 총 개수 조회
    const total = await prisma.tLSubscriber.count({ where });
    
    // 구독자 목록 조회
    const subscribers = await prisma.tLSubscriber.findMany({
      where,
      include: {
        domain: {
          select: {
            id: true,
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
        subscribedAt: 'desc',
      },
      skip,
      take: limit,
    });

    const response: APIResponse = {
      success: true,
      data: subscribers,
    };

    return NextResponse.json({
      ...response,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch subscribers:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'FETCH_SUBSCRIBERS_ERROR',
        message: '구독자 목록을 가져오는데 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/traffic-lens/subscribers - 새 구독자 등록
export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json();
    const { domainId, endpoint, keys, userAgent } = body;
    
    // 필수 필드 검증
    if (!domainId || !endpoint || !keys?.p256dh || !keys?.auth) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: '필수 필드가 누락되었습니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 도메인 존재 확인
    const domain = await prisma.tLDomain.findUnique({
      where: { id: domainId },
    });

    if (!domain) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'DOMAIN_NOT_FOUND',
          message: '도메인을 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // IP 주소 및 위치 정보 추출
    const ipAddress = getClientIP(request);
    const location = getLocationFromIP(ipAddress);

    // 기존 구독자 확인 (upsert 방식)
    const subscriber = await prisma.tLSubscriber.upsert({
      where: {
        domainId_endpoint: {
          domainId: domainId,
          endpoint: endpoint,
        },
      },
      update: {
        p256dhKey: keys.p256dh,
        authKey: keys.auth,
        userAgent: userAgent,
        lastSeen: new Date(),
        isActive: true,
      },
      create: {
        domainId: domainId,
        endpoint: endpoint,
        p256dhKey: keys.p256dh,
        authKey: keys.auth,
        userAgent: userAgent,
        ipAddress: ipAddress,
        country: location.country,
        city: location.city,
      },
    });

    const response: APIResponse = {
      success: true,
      data: subscriber,
      message: '구독이 성공적으로 등록되었습니다.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Failed to create subscriber:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'CREATE_SUBSCRIBER_ERROR',
        message: '구독 등록에 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
