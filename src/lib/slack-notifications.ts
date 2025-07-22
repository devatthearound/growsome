/**
 * 슬랙 알림 유틸리티 함수들
 * 블로그 자동화 시스템용 알림 전송
 */

interface SlackNotificationOptions {
  level: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  details?: Record<string, any>;
  mention?: boolean; // @channel 멘션 여부
}

/**
 * 슬랙으로 알림 전송
 */
export async function sendSlackNotification(options: SlackNotificationOptions): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl || webhookUrl.includes('YOUR/SLACK/WEBHOOK')) {
    console.warn('⚠️ Slack webhook URL이 설정되지 않았습니다.');
    return false;
  }

  const emoji = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };

  const color = {
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8'
  };

  const payload = {
    channel: process.env.SLACK_CHANNEL || '#growsome-alerts',
    username: process.env.SLACK_BOT_NAME || 'Growsome 자동화봇',
    icon_emoji: ':robot_face:',
    text: options.mention ? `${options.title} <!channel>` : options.title,
    attachments: [
      {
        color: color[options.level],
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${emoji[options.level]} ${options.title}`
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: options.message
            }
          },
          ...(options.details ? [{
            type: 'section',
            fields: Object.entries(options.details).map(([key, value]) => ({
              type: 'mrkdwn',
              text: `*${key}:* ${value}`
            }))
          }] : []),
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `⏰ ${new Date().toLocaleString('ko-KR', { 
                  timeZone: 'Asia/Seoul',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}`
              }
            ]
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Slack API 오류: ${response.status} ${response.statusText}`);
    }

    console.log(`✅ Slack 알림 전송 성공: ${options.title}`);
    return true;

  } catch (error) {
    console.error('❌ Slack 알림 전송 실패:', error);
    return false;
  }
}

/**
 * 블로그 자동화 성공 알림
 */
export async function notifyBlogSuccess(blogPost: {
  title: string;
  slug: string;
  category: string;
  wordCount: number;
  aiGenerated: boolean;
}) {
  return sendSlackNotification({
    level: 'success',
    title: '블로그 포스트 자동 발행 완료',
    message: `새로운 블로그 포스트가 성공적으로 발행되었습니다!`,
    details: {
      '제목': blogPost.title,
      '카테고리': blogPost.category,
      '글자 수': `${blogPost.wordCount.toLocaleString()}자`,
      'AI 생성': blogPost.aiGenerated ? '예' : '아니오',
      '링크': `https://growsome.kr/blog/${blogPost.slug}`
    }
  });
}

/**
 * 블로그 자동화 실패 알림
 */
export async function notifyBlogError(error: {
  step: string;
  message: string;
  sourceUrl?: string;
  retryCount?: number;
}) {
  return sendSlackNotification({
    level: 'error',
    title: '블로그 자동화 오류 발생',
    message: `블로그 자동 생성 과정에서 오류가 발생했습니다.`,
    details: {
      '단계': error.step,
      '오류 메시지': error.message,
      ...(error.sourceUrl && { '원본 URL': error.sourceUrl }),
      ...(error.retryCount && { '재시도 횟수': `${error.retryCount}회` })
    },
    mention: true // 긴급 알림이므로 @channel 멘션
  });
}

/**
 * RSS 피드 모니터링 결과 알림
 */
export async function notifyRSSMonitoring(result: {
  totalFeeds: number;
  newArticles: number;
  successfulPosts: number;
  failedPosts: number;
  processingTime: number;
}) {
  const level = result.failedPosts > 0 ? 'warning' : 'success';
  
  return sendSlackNotification({
    level,
    title: 'RSS 피드 모니터링 완료',
    message: `오늘 아침 RSS 피드 모니터링이 완료되었습니다.`,
    details: {
      '모니터링 피드 수': `${result.totalFeeds}개`,
      '새로운 기사': `${result.newArticles}개`,
      '성공적 발행': `${result.successfulPosts}개`,
      '실패한 발행': `${result.failedPosts}개`,
      '처리 시간': `${Math.round(result.processingTime / 1000)}초`
    }
  });
}

/**
 * 시스템 상태 알림 (주간 리포트)
 */
export async function notifyWeeklyReport(report: {
  totalPosts: number;
  averageWordsPerPost: number;
  topCategories: string[];
  successRate: number;
  costEstimate: number;
}) {
  return sendSlackNotification({
    level: 'info',
    title: '주간 블로그 자동화 리포트',
    message: `지난 주 블로그 자동화 시스템 성과를 알려드립니다.`,
    details: {
      '생성된 포스트': `${report.totalPosts}개`,
      '평균 글자 수': `${report.averageWordsPerPost.toLocaleString()}자`,
      '인기 카테고리': report.topCategories.join(', '),
      '성공률': `${Math.round(report.successRate * 100)}%`,
      '예상 비용': `약 $${report.costEstimate.toFixed(2)}`
    }
  });
}