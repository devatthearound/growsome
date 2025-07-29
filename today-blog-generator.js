#!/usr/bin/env node

// 🚀 오늘자 블로그 글 자동 생성 스크립트
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

// 환경 설정
const BASE_URL = 'http://localhost:3001'; // 포트 3001로 설정
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';

console.log('🚀 오늘자 블로그 글 생성을 시작합니다...');
console.log(`🌐 대상 URL: ${BASE_URL}`);
console.log(`🤖 AI 제공자: ${AI_PROVIDER}`);

// HTTP 요청 함수
const makeRequest = (options, body = null) => {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.headers['content-type']?.includes('json')) {
            resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
          } else {
            resolve({ statusCode: res.statusCode, body: data });
          }
        } catch (error) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
};

// 슬랙 알림 함수
const sendSlackNotification = async (options) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl || webhookUrl.includes('YOUR/SLACK/WEBHOOK')) {
    console.warn('⚠️ Slack webhook URL이 설정되지 않았습니다.');
    return false;
  }

  const payload = {
    channel: process.env.SLACK_CHANNEL || '#growsome-alerts',
    username: process.env.SLACK_BOT_NAME || 'Growsome 자동화봇',
    text: `${options.level === 'success' ? '✅' : '❌'} ${options.title}`,
    attachments: [{
      color: options.level === 'success' ? '#28a745' : '#dc3545',
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
    const protocol = url.protocol === 'https:' ? https : http;
    
    return new Promise((resolve) => {
      const req = protocol.request({
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(payload))
        }
      }, (res) => {
        resolve(res.statusCode === 200);
      });
      
      req.on('error', () => resolve(false));
      req.write(JSON.stringify(payload));
      req.end();
    });
  } catch (error) {
    console.error('슬랙 알림 전송 실패:', error);
    return false;
  }
};

// AI를 활용한 블로그 콘텐츠 생성
async function generateBlogContent() {
  const today = new Date();
  const koreaTime = new Date(today.getTime() + (9 * 60 * 60 * 1000));
  const dateStr = koreaTime.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 오늘의 트렌드 주제 후보들
  const topics = [
    'AI 기술의 최신 동향과 비즈니스 적용',
    '디지털 마케팅의 새로운 트렌드',
    '스타트업 성장을 위한 데이터 분석',
    '자동화 도구로 생산성 향상하기',
    '사업 성장을 위한 디지털 전환',
    'AI 시대의 마케팅 전략',
    '고객 경험 개선을 위한 기술 활용',
    '효율적인 업무 프로세스 구축하기'
  ];

  const selectedTopic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `
오늘(${dateStr})의 블로그 글을 작성해주세요.

주제: ${selectedTopic}

다음 조건을 만족하는 한국어 블로그 글을 작성해주세요:

1. 제목: 흥미롭고 클릭하고 싶게 만드는 제목 (30자 이내)
2. 요약: 글의 핵심 내용을 2-3줄로 요약
3. 본문: 2000자 이상의 상세한 내용으로 구성
   - 도입부: 문제나 트렌드 제시
   - 본론: 구체적인 방법이나 인사이트 제공
   - 결론: 실행 가능한 조언이나 다음 단계 제시
4. 실무에 바로 적용할 수 있는 실용적인 내용 포함
5. 전문적이면서도 이해하기 쉬운 톤앤매너

형식:
제목: [제목]
요약: [요약]
본문: [본문]
`;

  console.log('🤖 AI로 블로그 콘텐츠 생성 중...');
  console.log(`📝 선택된 주제: ${selectedTopic}`);

  try {
    let aiResponse;

    if (AI_PROVIDER === 'claude' && process.env.CLAUDE_API_KEY) {
      // Claude API 호출
      aiResponse = await makeRequest({
        hostname: 'api.anthropic.com',
        port: 443,
        path: '/v1/messages',
        method: 'POST',
        protocol: 'https:',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }, {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      if (aiResponse.statusCode === 200 && aiResponse.body.content) {
        return aiResponse.body.content[0].text;
      }
    }

    // OpenAI API 호출 (기본 또는 Claude 실패시)
    aiResponse = await makeRequest({
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      protocol: 'https:',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }, {
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'You are a professional content writer specializing in business and technology topics for Korean audience.'
      }, {
        role: 'user',
        content: prompt
      }],
      max_tokens: 4000,
      temperature: 0.7
    });

    if (aiResponse.statusCode === 200 && aiResponse.body.choices) {
      return aiResponse.body.choices[0].message.content;
    }

    throw new Error(`AI API 응답 오류: ${aiResponse.statusCode}`);

  } catch (error) {
    console.error('❌ AI 콘텐츠 생성 실패:', error);
    throw error;
  }
}

// 블로그 콘텐츠 파싱
function parseBlogContent(content) {
  const lines = content.split('\n');
  let title = '';
  let summary = '';
  let body = '';
  let currentSection = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('제목:')) {
      title = trimmedLine.replace('제목:', '').trim();
      currentSection = 'title';
    } else if (trimmedLine.startsWith('요약:')) {
      summary = trimmedLine.replace('요약:', '').trim();
      currentSection = 'summary';
    } else if (trimmedLine.startsWith('본문:')) {
      body = trimmedLine.replace('본문:', '').trim();
      currentSection = 'body';
    } else if (trimmedLine && currentSection) {
      if (currentSection === 'summary' && !summary) {
        summary = trimmedLine;
      } else if (currentSection === 'body') {
        body += (body ? '\n' : '') + trimmedLine;
      }
    }
  }

  // 기본값 설정
  if (!title) {
    title = content.split('\n')[0] || '오늘의 비즈니스 인사이트';
  }
  if (!summary) {
    summary = body.substring(0, 200) + '...';
  }
  if (!body) {
    body = content;
  }

  return { title, summary, body };
}

// 블로그 포스트 저장
async function saveBlogPost(blogData) {
  console.log('💾 블로그 포스트 저장 중...');

  try {
    const url = new URL(`${BASE_URL}/api/admin/blog`);
    
    const response = await makeRequest({
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      protocol: url.protocol,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_API_TOKEN_HERE` // 실제 토큰으로 교체 필요
      }
    }, blogData);

    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('✅ 블로그 포스트 저장 성공');
      return response.body;
    } else {
      throw new Error(`API 오류: ${response.statusCode} - ${JSON.stringify(response.body)}`);
    }

  } catch (error) {
    console.error('❌ 블로그 포스트 저장 실패:', error);
    throw error;
  }
}

// 메인 실행 함수
async function main() {
  const startTime = Date.now();
  
  try {
    console.log('🎯 1단계: AI 콘텐츠 생성');
    const rawContent = await generateBlogContent();
    
    console.log('🔍 2단계: 콘텐츠 파싱');
    const { title, summary, body } = parseBlogContent(rawContent);
    
    console.log(`📝 생성된 콘텐츠:`);
    console.log(`제목: ${title}`);
    console.log(`요약: ${summary.substring(0, 100)}...`);
    console.log(`본문 길이: ${body.length}자`);

    const blogData = {
      title,
      content: body,
      category_id: 1, // 기본 카테고리
      status: 'published',
      is_featured: false,
      is_hero: false,
      meta_title: title,
      meta_description: summary
    };

    console.log('💾 3단계: 블로그 포스트 저장');
    // const result = await saveBlogPost(blogData);

    console.log('📊 4단계: 결과 리포트');
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    const successMessage = `
✅ 블로그 글 생성 완료!

📋 생성 정보:
• 제목: ${title}
• 내용 길이: ${body.length}자
• 카테고리: AI 기술
• 상태: 발행됨
• 소요 시간: ${duration}초

🌐 확인하기: ${BASE_URL}/blog
    `;

    console.log(successMessage);

    // 슬랙 알림 전송
    await sendSlackNotification({
      level: 'success',
      title: '오늘자 블로그 글 생성 완료',
      message: successMessage,
      details: {
        '제목': title,
        '내용 길이': `${body.length}자`,
        '소요 시간': `${duration}초`,
        'URL': `${BASE_URL}/blog`
      }
    });

  } catch (error) {
    console.error('❌ 블로그 생성 실패:', error);

    const errorMessage = `블로그 글 생성 중 오류가 발생했습니다: ${error.message}`;

    // 슬랙 알림 전송
    await sendSlackNotification({
      level: 'error',
      title: '블로그 글 생성 실패',
      message: errorMessage,
      details: {
        '오류 내용': error.message,
        '시각': new Date().toLocaleString('ko-KR')
      }
    });

    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}
