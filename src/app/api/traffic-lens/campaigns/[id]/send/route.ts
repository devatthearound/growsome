import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import webpush from 'web-push';
import { APIResponse } from '@/types/traffic-lens';

const prisma = new PrismaClient();

// Web Push 설정
webpush.setVapidDetails(
  'mailto:support@growsome.com', // 이메일 주소
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

// 배치 크기 (한 번에 처리할 구독자 수)
const BATCH_SIZE = 100;

// 구독자 필터링 함수
function filterSubscribers(subscribers: any[], targetFilter: any) {
  if (!targetFilter) return subscribers;

  return subscribers.filter(subscriber => {
    // 국가 필터
    if (targetFilter.countries && targetFilter.countries.length > 0) {
      if (!targetFilter.countries.includes(subscriber.country)) {
        return false;
      }
    }

    // 도시 필터
    if (targetFilter.cities && targetFilter.cities.length > 0) {
      if (!targetFilter.cities.includes(subscriber.city)) {
        return false;
      }
    }

    // 구독 날짜 필터
    if (targetFilter.subscribedAfter) {
      if (new Date(subscriber.subscribedAt) < new Date(targetFilter.subscribedAfter)) {
        return false;
      }
    }

    if (targetFilter.subscribedBefore) {
      if (new Date(subscriber.subscribedAt) > new Date(targetFilter.subscribedBefore)) {
        return false;
      }
    }

    // 마지막 활동 날짜 필터
    if (targetFilter.lastSeenAfter) {
      if (new Date(subscriber.lastSeen) < new Date(targetFilter.lastSeenAfter)) {
        return false;
      }
    }

    // 활성 상태 필터
    if (typeof targetFilter.isActive === 'boolean') {
      if (subscriber.isActive !== targetFilter.isActive) {
        return false;
      }
    }

    return true;
  });
}

// 단일 구독자에게 알림 발송
async function sendNotificationToSubscriber(
  subscriber: any,
  campaign: any,
  domain: any
) {
  try {
    const pushSubscription = {
      endpoint: subscriber.endpoint,
      keys: {
        p256dh: subscriber.p256dhKey,
        auth: subscriber.authKey,
      },
    };

    const payload = JSON.stringify({
      title: campaign.title,
      body: campaign.body,
      icon: campaign.iconUrl,
      image: campaign.imageUrl,
      badge: campaign.badgeUrl,
      url: campaign.clickUrl,
      campaignId: campaign.id,
      tag: `campaign-${campaign.id}`,
    });

    const options = {
      vapidDetails: {
        subject: 'mailto:support@growsome.com',
        publicKey: domain.vapidPublicKey,
        privateKey: domain.vapidPrivateKey,
      },
      TTL: 86400, // 24시간
    };

    await webpush.sendNotification(pushSubscription, payload, options);

    // 발송 성공 기록
    await prisma.tLNotification.create({
      data: {
        campaignId: campaign.id,
        subscriberId: subscriber.id,
        status: 'sent',
        userAgent: subscriber.userAgent,
      },
    });

    return { success: true, subscriberId: subscriber.id };
  } catch (error) {
    console.error(`Failed to send notification to subscriber ${subscriber.id}:`, error);

    // 발송 실패 기록
    await prisma.tLNotification.create({
      data: {
        campaignId: campaign.id,
        subscriberId: subscriber.id,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        userAgent: subscriber.userAgent,
      },
    });

    // 410 Gone 오류인 경우 구독자 비활성화
    if (error instanceof Error && (error.message.includes('410') || error.message.includes('gone'))) {
      await prisma.tLSubscriber.update({
        where: { id: subscriber.id },
        data: { isActive: false },
      });
    }

    return { success: false, subscriberId: subscriber.id, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// 배치 발송 함수
async function sendNotificationBatch(
  subscribers: any[],
  campaign: any,
  domain: any
) {
  const results = await Promise.allSettled(
    subscribers.map(subscriber =>
      sendNotificationToSubscriber(subscriber, campaign, domain)
    )
  );

  const successful = results.filter(result => 
    result.status === 'fulfilled' && result.value.success
  ).length;

  const failed = results.length - successful;

  return { successful, failed, total: results.length };
}

// POST /api/traffic-lens/campaigns/[id]/send - 캠페인 발송
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id);
    
    if (isNaN(campaignId)) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'INVALID_CAMPAIGN_ID',
          message: '올바른 캠페인 ID가 아닙니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 캠페인 조회
    const campaign = await prisma.tLCampaign.findUnique({
      where: { id: campaignId },
      include: {
        domain: true,
      },
    });

    if (!campaign) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'CAMPAIGN_NOT_FOUND',
          message: '캠페인을 찾을 수 없습니다.',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // 캠페인 상태 확인
    if (campaign.status === 'sent') {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'CAMPAIGN_ALREADY_SENT',
          message: '이미 발송된 캠페인입니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (campaign.status === 'sending') {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'CAMPAIGN_SENDING',
          message: '현재 발송 중인 캠페인입니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 도메인의 VAPID 키 확인
    if (!campaign.domain.vapidPublicKey || !campaign.domain.vapidPrivateKey) {
      const response: APIResponse = {
        success: false,
        error: {
          code: 'MISSING_VAPID_KEYS',
          message: '도메인의 VAPID 키가 설정되지 않았습니다.',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 캠페인 상태를 '발송 중'으로 변경
    await prisma.tLCampaign.update({
      where: { id: campaignId },
      data: { status: 'sending' },
    });

    // 대상 구독자 조회
    let subscribers = await prisma.tLSubscriber.findMany({
      where: {
        domainId: campaign.domainId,
        isActive: true,
      },
    });

    // 타겟 필터 적용
    if (campaign.targetType === 'segment' && campaign.targetFilter) {
      subscribers = filterSubscribers(subscribers, campaign.targetFilter);
    }

    if (subscribers.length === 0) {
      // 발송할 구독자가 없는 경우
      await prisma.tLCampaign.update({
        where: { id: campaignId },
        data: { 
          status: 'sent',
          sentAt: new Date(),
        },
      });

      const response: APIResponse = {
        success: true,
        data: {
          totalSubscribers: 0,
          successful: 0,
          failed: 0,
        },
        message: '발송할 구독자가 없습니다.',
      };
      return NextResponse.json(response);
    }

    // 백그라운드에서 배치 발송 시작 (실제로는 큐 시스템을 사용해야 함)
    const sendPromise = (async () => {
      let totalSuccessful = 0;
      let totalFailed = 0;

      // 배치별로 발송
      for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
        const batch = subscribers.slice(i, i + BATCH_SIZE);
        
        try {
          const batchResult = await sendNotificationBatch(
            batch,
            campaign,
            campaign.domain
          );
          
          totalSuccessful += batchResult.successful;
          totalFailed += batchResult.failed;

          // 배치 간 지연 (API 제한 고려)
          if (i + BATCH_SIZE < subscribers.length) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
          }
        } catch (error) {
          console.error(`Batch ${i}-${i + BATCH_SIZE} failed:`, error);
          totalFailed += batch.length;
        }
      }

      // 캠페인 상태 업데이트
      await prisma.tLCampaign.update({
        where: { id: campaignId },
        data: {
          status: 'sent',
          sentAt: new Date(),
        },
      });

      console.log(`Campaign ${campaignId} sent: ${totalSuccessful} successful, ${totalFailed} failed`);
    })();

    // 즉시 응답 반환 (발송은 백그라운드에서 계속)
    const response: APIResponse = {
      success: true,
      data: {
        totalSubscribers: subscribers.length,
        message: '발송이 시작되었습니다. 진행 상황은 캠페인 상세 페이지에서 확인할 수 있습니다.',
      },
      message: '캠페인 발송이 시작되었습니다.',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to send campaign:', error);
    
    // 에러 발생 시 캠페인 상태 되돌리기
    try {
      await prisma.tLCampaign.update({
        where: { id: parseInt(params.id) },
        data: { status: 'draft' },
      });
    } catch (rollbackError) {
      console.error('Failed to rollback campaign status:', rollbackError);
    }
    
    const response: APIResponse = {
      success: false,
      error: {
        code: 'SEND_CAMPAIGN_ERROR',
        message: '캠페인 발송에 실패했습니다.',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
