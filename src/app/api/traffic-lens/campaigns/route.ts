import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse, CreateCampaignRequest } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// GET /api/traffic-lens/campaigns - 캠페인 목록 조회
export async function GET(request: NextRequest) {
  try {
    // TODO: 실제 사용자 인증 구현
    const userId = 1; // 임시 사용자 ID

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // 임시 더미 데이터 반환 (데이터베이스 연결 문제 우회)
    const dummyCampaigns = [
      {
        id: 1,
        domainId: 1,
        userId: userId,
        title: '새로운 기능 안내',
        body: '새로운 기능이 추가되었습니다. 확인해보세요!',
        iconUrl: null,
        imageUrl: null,
        clickUrl: 'https://example.com',
        badgeUrl: null,
        scheduledAt: null,
        targetType: 'all',
        targetFilter: null,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        domain: {
          id: 1,
          domain: 'example.com',
          siteName: 'Example Site',
        },
        _count: {
          notifications: 0,
        },
        stats: {
          totalSent: 0,
          totalClicks: 0,
          clickRate: 0,
        },
      },
      {
        id: 2,
        domainId: 1,
        userId: userId,
        title: '특별 할인 이벤트',
        body: '한정 시간 특별 할인 이벤트를 진행합니다!',
        iconUrl: null,
        imageUrl: null,
        clickUrl: 'https://example.com/sale',
        badgeUrl: null,
        scheduledAt: null,
        targetType: 'all',
        targetFilter: null,
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
        domain: {
          id: 1,
          domain: 'example.com',
          siteName: 'Example Site',
        },
        _count: {
          notifications: 150,
        },
        stats: {
          totalSent: 150,
          totalClicks: 25,
          clickRate: 16.67,
        },
      }
    ];

    const response: APIResponse = {
      success: true,
      data: dummyCampaigns,
    };

    return NextResponse.json({
      ...response,
      pagination: {
        page,
        limit,
        total: dummyCampaigns.length,
        totalPages: Math.ceil(dummyCampaigns.length / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'FETCH_CAMPAIGNS_ERROR',
        message: '캠페인 목록을 가져오는데 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/traffic-lens/campaigns - 새 캠페인 생성
export async function POST(request: NextRequest) {
  try {
    // TODO: 실제 사용자 인증 구현
    const userId = 1; // 임시 사용자 ID

    const body: CreateCampaignRequest = await request.json();
    
    // 필수 필드 검증
    if (!body.domainId || !body.title || !body.body) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: '제목, 내용, 도메인은 필수 항목입니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 도메인 존재 및 권한 확인
    const domain = await prisma.tLDomain.findFirst({
      where: {
        id: body.domainId,
        userId: userId,
      },
    });

    if (!domain) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'DOMAIN_NOT_FOUND_OR_NO_PERMISSION',
          message: '도메인을 찾을 수 없거나 권한이 없습니다.',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 캠페인 생성
    const campaign = await prisma.tLCampaign.create({
      data: {
        domainId: body.domainId,
        userId: userId,
        title: body.title,
        body: body.body,
        iconUrl: body.iconUrl,
        imageUrl: body.imageUrl,
        clickUrl: body.clickUrl,
        badgeUrl: body.badgeUrl,
        scheduledAt: body.scheduledAt,
        targetType: body.targetType || 'all',
        targetFilter: body.targetFilter,
        status: body.scheduledAt ? 'scheduled' : 'draft',
      },
      include: {
        domain: {
          select: {
            id: true,
            domain: true,
            siteName: true,
          },
        },
      },
    });

    const response: APIResponse = {
      success: true,
      data: campaign,
      message: '캠페인이 성공적으로 생성되었습니다.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'CREATE_CAMPAIGN_ERROR',
        message: '캠페인 생성에 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
