import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// POST /api/traffic-lens/notifications/close - 알림 닫힘 추적
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, notificationId, timestamp } = body;

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

    // 선택적으로 닫힘 이벤트를 별도 테이블에 기록하거나
    // 기존 notification에 closedAt 필드를 추가할 수 있습니다.
    // 여기서는 간단히 로그만 남기고 구독자의 마지막 활동 시간을 업데이트합니다.

    let notification = null;

    if (notificationId) {
      notification = await prisma.tLNotification.findUnique({
        where: { id: parseInt(notificationId) },
      });
    } else if (campaignId) {
      notification = await prisma.tLNotification.findFirst({
        where: {
          campaignId: parseInt(campaignId),
        },
        orderBy: {
          sentAt: 'desc',
        },
      });
    }

    if (notification) {
      // 구독자의 마지막 활동 시간 업데이트
      await prisma.tLSubscriber.update({
        where: { id: notification.subscriberId },
        data: {
          lastSeen: new Date(),
        },
      });
    }

    console.log('Notification closed:', {
      campaignId,
      notificationId,
      timestamp: timestamp || new Date(),
    });

    const response: APIResponse = {
      success: true,
      message: '닫힘이 성공적으로 추적되었습니다.',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to track notification close:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'TRACK_CLOSE_ERROR',
        message: '닫힘 추적에 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
