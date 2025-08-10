import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// DELETE /api/traffic-lens/subscribers/[id] - 특정 구독자 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriberId = parseInt(params.id);

    if (isNaN(subscriberId)) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'INVALID_SUBSCRIBER_ID',
          message: '유효하지 않은 구독자 ID입니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 구독자 존재 확인
    const subscriber = await prisma.tLSubscriber.findUnique({
      where: { id: subscriberId }
    });

    if (!subscriber) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'SUBSCRIBER_NOT_FOUND',
          message: '구독자를 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 관련 알림 기록 삭제
    await prisma.tLNotification.deleteMany({
      where: { subscriberId }
    });

    // 구독자 삭제
    await prisma.tLSubscriber.delete({
      where: { id: subscriberId }
    });

    const response: APIResponse = {
      success: true,
      message: '구독자가 성공적으로 삭제되었습니다.',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to delete subscriber:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'DELETE_SUBSCRIBER_ERROR',
        message: '구독자 삭제에 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// PATCH /api/traffic-lens/subscribers/[id] - 구독자 정보 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriberId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(subscriberId)) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'INVALID_SUBSCRIBER_ID',
          message: '유효하지 않은 구독자 ID입니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 구독자 존재 확인
    const existingSubscriber = await prisma.tLSubscriber.findUnique({
      where: { id: subscriberId }
    });

    if (!existingSubscriber) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'SUBSCRIBER_NOT_FOUND',
          message: '구독자를 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 업데이트 가능한 필드만 추출
    const updateData: any = {};
    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive;
    }
    if (body.userAgent) {
      updateData.userAgent = body.userAgent;
    }

    // 구독자 정보 업데이트
    const updatedSubscriber = await prisma.tLSubscriber.update({
      where: { id: subscriberId },
      data: {
        ...updateData,
        lastSeen: new Date()
      },
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
    });

    const response: APIResponse = {
      success: true,
      data: updatedSubscriber,
      message: '구독자 정보가 성공적으로 업데이트되었습니다.',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to update subscriber:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'UPDATE_SUBSCRIBER_ERROR',
        message: '구독자 정보 업데이트에 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// GET /api/traffic-lens/subscribers/[id] - 특정 구독자 상세 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriberId = parseInt(params.id);

    if (isNaN(subscriberId)) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'INVALID_SUBSCRIBER_ID',
          message: '유효하지 않은 구독자 ID입니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 구독자 상세 정보 조회
    const subscriber = await prisma.tLSubscriber.findUnique({
      where: { id: subscriberId },
      include: {
        domain: {
          select: {
            id: true,
            domain: true,
            siteName: true,
            isActive: true,
          },
        },
        notifications: {
          include: {
            campaign: {
              select: {
                id: true,
                title: true,
                body: true,
                sentAt: true,
              }
            }
          },
          orderBy: {
            sentAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            notifications: true,
          },
        },
      },
    });

    if (!subscriber) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'SUBSCRIBER_NOT_FOUND',
          message: '구독자를 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: APIResponse = {
      success: true,
      data: subscriber,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch subscriber details:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'FETCH_SUBSCRIBER_ERROR',
        message: '구독자 정보를 가져오는데 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}