#!/usr/bin/env node

// 슬랙 알림 테스트 스크립트
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const { URL } = require('url');

const sendSlackNotification = async (options) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('❌ SLACK_WEBHOOK_URL이 설정되지 않았습니다.');
    return false;
  }

  const emoji = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };

  const payload = {
    channel: process.env.SLACK_CHANNEL || '#growsome-alerts',
    username: process.env.SLACK_BOT_NAME || 'Growsome 자동화봇',
    icon_emoji: ':robot_face:',
    text: `${emoji[options.level]} ${options.title}`,
    attachments: [{
      color: options.level === 'success' ? '#28a745' : options.level === 'error' ? '#dc3545' : '#ffc107',
      text: options.message,
      fields: options.details ? Object.entries(options.details).map(([key, value]) => ({
        title: key,
        value: String(value),
        short: true
      })) : [],
      ts: Math.floor(Date.now() / 1000)
    }]
  };

  try {
    const url = new URL(webhookUrl);
    
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(payload);
      
      const req = https.request({
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ 슬랙 알림 전송 성공!');
            resolve(true);
          } else {
            console.error(`❌ 슬랙 알림 실패: ${res.statusCode} ${data}`);
            resolve(false);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('❌ 슬랙 요청 오류:', error.message);
        resolve(false);
      });
      
      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.error('❌ 슬랙 알림 실패:', error.message);
    return false;
  }
};

// 테스트 실행
async function testSlackNotifications() {
  console.log('🧪 슬랙 알림 테스트 시작...\n');
  
  // 1. 성공 알림 테스트
  console.log('1️⃣ 성공 알림 테스트');
  await sendSlackNotification({
    level: 'success',
    title: '블로그 자동화 테스트 성공',
    message: '슬랙 알림 시스템이 정상적으로 작동합니다! 🎉',
    details: {
      '테스트 시간': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      '시스템': 'Growsome 블로그 자동화',
      '상태': '정상 작동'
    }
  });

  // 2초 대기
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 2. 오류 알림 테스트
  console.log('\n2️⃣ 오류 알림 테스트');
  await sendSlackNotification({
    level: 'error',
    title: '테스트용 오류 알림',
    message: '이것은 오류 알림 테스트입니다. 실제 오류가 아닙니다.',
    details: {
      '오류 유형': '테스트 오류',
      '해결 상태': '해결 필요 없음',
      '테스트 시간': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    }
  });

  // 2초 대기
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. 정보 알림 테스트
  console.log('\n3️⃣ 정보 알림 테스트');
  await sendSlackNotification({
    level: 'info',
    title: '자동화 시스템 준비 완료',
    message: '매일 아침 8시 RSS 피드 모니터링 및 블로그 자동 생성이 준비되었습니다.',
    details: {
      '스케줄': '매일 08:00 KST',
      'RSS 피드': '활성화됨',
      'AI 글 생성': 'ChatGPT 연동 완료',
      '알림 시스템': '설정 완료'
    }
  });

  console.log('\n🎯 테스트 완료! 슬랙에서 알림을 확인해주세요.');
}

testSlackNotifications().catch(console.error);
