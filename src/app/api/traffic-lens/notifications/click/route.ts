import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// POST /api/traffic-lens/notifications/click - 알림 클릭 추적
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, notificationId, timestamp, userAgent } = body;

    if (!campaignId && !notificationId) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'MISSING_IDENTIFIER',
          message: 'campaignId 또는 notificationId가 필요합니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    let notification = null;

    if (notificationId) {
      // 특정 알림 ID로 조회
      notification = await prisma.tLNotification.findUnique({
        where: { id: parseInt(notificationId) },
      });
    } else if (campaignId) {
      // 캠페인 ID로 최근 알림 조회 (구독자별로 여러 알림이 있을 수 있음)
      // 실제로는 구독자 식별이 더 정확해야 하지만, 간단히 최근 알림으로 처리
      notification = await prisma.tLNotification.findFirst({
        where: {
          campaignId: parseInt(campaignId),
          status: 'sent',
        },
        orderBy: {
          sentAt: 'desc',
        },
      });
    }

    if (!notification) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: '알림을 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 이미 클릭된 알림인지 확인
    if (notification.status === 'clicked') {
      const response: APIResponse = {
        success: true,
        message: '이미 클릭 처리된 알림입니다.',
      };
      return NextResponse.json(response);
    }

    // 클릭 상태로 업데이트
    await prisma.tLNotification.update({
      where: { id: notification.id },
      data: {
        status: 'clicked',
        clickedAt: new Date(timestamp || new Date()),
        userAgent: userAgent || notification.userAgent,
      },
    });

    // 구독자의 마지막 활동 시간 업데이트
    await prisma.tLSubscriber.update({
      where: { id: notification.subscriberId },
      data: {
        lastSeen: new Date(),
      },
    });

    const response: APIResponse = {
      success: true,
      message: '클릭이 성공적으로 추적되었습니다.',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to track notification click:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'TRACK_CLICK_ERROR',
        message: '클릭 추적에 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
