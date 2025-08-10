import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { APIResponse } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// POST /api/traffic-lens/subscribers/bulk - 벌크 작업 수행
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, subscriberIds } = body;

    if (!action || !Array.isArray(subscriberIds) || subscriberIds.length === 0) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: '액션과 구독자 ID 목록이 필요합니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    let result;
    let successCount = 0;

    switch (action) {
      case 'activate':
        result = await prisma.tLSubscriber.updateMany({
          where: {
            id: {
              in: subscriberIds
            }
          },
          data: {
            isActive: true,
            lastSeen: new Date()
          }
        });
        successCount = result.count;
        break;

      case 'deactivate':
        result = await prisma.tLSubscriber.updateMany({
          where: {
            id: {
              in: subscriberIds
            }
          },
          data: {
            isActive: false
          }
        });
        successCount = result.count;
        break;

      case 'delete':
        // 먼저 관련 알림 기록 삭제
        await prisma.tLNotification.deleteMany({
          where: {
            subscriberId: {
              in: subscriberIds
            }
          }
        });

        // 구독자 삭제
        result = await prisma.tLSubscriber.deleteMany({
          where: {
            id: {
              in: subscriberIds
            }
          }
        });
        successCount = result.count;
        break;

      default:
        const response: APIResponse = {
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: '유효하지 않은 액션입니다. (activate, deactivate, delete 중 하나)',
          },
        };
        return NextResponse.json(response, { status: 400 });
    }

    const response: APIResponse = {
      success: true,
      data: {
        action,
        requestedCount: subscriberIds.length,
        successCount,
        failedCount: subscriberIds.length - successCount
      },
      message: `${successCount}개의 구독자에 대해 ${action} 작업이 성공적으로 완료되었습니다.`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to perform bulk action:', error);
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'BULK_ACTION_ERROR',
        message: '벌크 작업 수행 중 오류가 발생했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}