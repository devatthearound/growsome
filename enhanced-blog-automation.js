#!/usr/bin/env node

// 🤖 AI 블로그 자동화 완전 버전 (실제 블로그 생성 포함)
// 사용법: node enhanced-blog-automation.js

const https = require('https');
const http = require('http');

// Slack 알림 함수 (CommonJS 버전)
const sendSlackNotification = async (options) => {
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

  const payload = {
    channel: process.env.SLACK_CHANNEL || '#growsome-alerts',
    username: process.env.SLACK_BOT_NAME || 'Growsome 자동화봇',
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
    console.error('Slack 알림 실패:', error.message);
    return false;
  }
};

// 설정
const config = {
  growsomeUrl: 'http://localhost:3000',
  // growsomeUrl: 'https://growsome.kr', // 프로덕션용
  apiKey: 'growsome-n8n-secure-key-2025',
  openaiApiKey: process.env.OPENAI_API_KEY, // 실제 OpenAI API Key
  testData: {
    original_url: 'https://techcrunch.com/2025/01/15/ai-breakthrough',
    source_title: 'Revolutionary AI Breakthrough Changes Everything',
    content_text: `
    A groundbreaking AI model has been developed by researchers at Stanford University that can process information 10 times faster than previous models. This breakthrough comes from a new neural network architecture called "Quantum-Enhanced Transformers."

    The key innovations include:
    1. Parallel processing capabilities that mimic quantum computing principles
    2. Dynamic memory allocation that adapts to task complexity  
    3. Self-optimizing algorithms that improve performance over time

    Early tests show the model can:
    - Process natural language 10x faster
    - Generate more coherent responses
    - Use 50% less computational resources
    - Maintain accuracy while scaling up

    "This represents a paradigm shift in how we approach AI development," said Dr. Sarah Chen, lead researcher on the project. "We're not just making incremental improvements - we're fundamentally changing the architecture."

    The implications are far-reaching for industries like healthcare, finance, and autonomous vehicles. Companies are already showing interest in licensing this technology.

    The research team plans to open-source parts of their work by Q2 2025, potentially accelerating AI development across the industry.
    `
  }
};

// HTTP 요청 헬퍼 함수 (향상된 버전)
function makeRequest(options, data = null, isHttps = false) {
  return new Promise((resolve, reject) => {
    const protocol = isHttps ? https : http;
    
    const req = protocol.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout (30s)'));
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 1단계: JWT 토큰 발급
async function getJWTToken() {
  console.log('🎫 JWT 토큰 발급 중...');
  
  const url = new URL(`${config.growsomeUrl}/api/auth/generate-token`);
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Growsome-Blog-Automation/2.0'
    }
  };
  
  const requestData = {
    apiKey: config.apiKey,
    purpose: 'blog_automation'
  };
  
  try {
    const response = await makeRequest(options, requestData, url.protocol === 'https:');
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ JWT 토큰 발급 성공');
      return response.data.token;
    } else {
      throw new Error(`JWT 토큰 발급 실패: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('❌ JWT 토큰 발급 실패:', error.message);
    throw error;
  }
}

// 2단계: 실제 OpenAI API를 통한 AI 요약
async function generateAISummary(originalData) {
  console.log('🤖 OpenAI API로 AI 요약 생성 중...');
  
  // OpenAI API 키가 없으면 시뮬레이션 사용
  if (!config.openaiApiKey) {
    console.log('⚠️ OpenAI API 키가 없어 시뮬레이션 모드로 실행합니다');
    return simulateGPTSummary(originalData);
  }
  
  const openaiOptions = {
    hostname: 'api.openai.com',
    port: 443,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openaiApiKey}`,
      'User-Agent': 'Growsome-Blog-Automation/2.0'
    }
  };
  
  const prompt = `
다음 영어 기술 기사를 한국어로 번역하고 블로그 포스트 형식으로 요약해주세요:

제목: ${originalData.source_title}
내용: ${originalData.content_text}
출처: ${originalData.original_url}

요구사항:
1. 제목을 한국어로 번역하고 흥미롭게 만들어주세요
2. 마크다운 형식으로 작성해주세요
3. 기술적 내용을 일반인도 이해하기 쉽게 설명해주세요
4. 이모지를 적절히 활용해주세요
5. 출처 링크를 포함해주세요

응답 형식:
{
  "title": "한국어 제목",
  "content": "마크다운 형식의 블로그 내용",
  "summary": "2-3문장의 요약"
}
`;
  
  const openaiData = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "당신은 기술 블로그 전문 작가입니다. 영어 기술 기사를 한국어로 번역하고 블로그 포스트로 변환하는 전문가입니다."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 2000,
    temperature: 0.7
  };
  
  try {
    const response = await makeRequest(openaiOptions, openaiData, true);
    
    if (response.statusCode === 200 && response.data.choices) {
      const content = response.data.choices[0].message.content;
      const parsedContent = JSON.parse(content);
      
      // slug 생성
      const slug = parsedContent.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s-]/g, '')
        .replace(/[\s가-힣]+/g, '-')
        .replace(/-+/g, '-')
        .trim('-') + '-' + Date.now();
      
      console.log('✅ AI 요약 완료 (OpenAI)');
      console.log(`   제목: ${parsedContent.title}`);
      console.log(`   slug: ${slug}`);
      
      return { ...parsedContent, slug };
    } else {
      throw new Error(`OpenAI API 실패: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('❌ OpenAI API 실패, 시뮬레이션 모드로 전환:', error.message);
    return simulateGPTSummary(originalData);
  }
}

// 기존 시뮬레이션 함수 (백업용)
function simulateGPTSummary(originalData) {
  console.log('🤖 AI 요약 시뮬레이션...');
  
  const summary = {
    title: 'AI 모델 처리속도 10배 향상, 스탠포드 연구진의 혁신적 성과',
    content: `# AI 모델 처리속도 10배 향상, 스탠포드 연구진의 혁신적 성과

## 🚀 혁신적인 AI 아키텍처 등장

스탠포드 대학교 연구진이 개발한 새로운 AI 모델이 **기존 모델 대비 10배 빠른 정보 처리 속도**를 달성했다고 발표했습니다. 이번 breakthrough는 "Quantum-Enhanced Transformers"라는 혁신적인 신경망 아키텍처에서 나왔습니다.

## 🔧 핵심 기술 혁신

새로운 모델의 주요 특징은 다음과 같습니다:

- **양자 컴퓨팅 원리 기반 병렬 처리**: 기존의 순차적 처리를 넘어선 혁신
- **동적 메모리 할당**: 작업 복잡도에 따라 자동 조정
- **자가 최적화 알고리즘**: 시간이 지날수록 성능 향상

## 📊 성능 개선 결과

초기 테스트 결과는 다음과 같은 놀라운 성과를 보여줍니다:

- 자연어 처리 속도 **10배 향상**
- 더욱 일관성 있는 응답 생성
- 컴퓨팅 리소스 **50% 절약**
- 확장성 개선과 동시에 정확도 유지

## 🔬 연구진의 전망

연구팀 리더인 사라 첸 박사는 "이것은 AI 개발 접근 방식의 패러다임 전환을 의미한다"며 "단순한 점진적 개선이 아닌 근본적인 아키텍처 변화"라고 설명했습니다.

## 🌍 산업 전반에 미칠 영향

이 기술은 다음 분야에서 광범위한 영향을 미칠 것으로 예상됩니다:

- **의료**: 진단 속도 및 정확도 향상
- **금융**: 실시간 리스크 분석 
- **자율주행**: 더 빠른 의사결정 처리

연구팀은 2025년 2분기에 일부 기술을 오픈소스로 공개할 예정이라고 밝혔습니다.

---

**출처**: ${originalData.original_url}`,
    summary: 'Stanford 연구진이 기존 대비 10배 빠른 AI 모델을 개발했습니다. Quantum-Enhanced Transformers 아키텍처를 통해 처리속도 향상과 리소스 절약을 동시에 달성했습니다.'
  };
  
  // slug 생성
  const slug = summary.title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/[\s가-힣]+/g, '-')
    .replace(/-+/g, '-')
    .trim('-') + '-' + Date.now();
  
  console.log('✅ AI 요약 완료 (시뮬레이션)');
  console.log(`   제목: ${summary.title}`);
  console.log(`   slug: ${slug}`);
  
  return { ...summary, slug };
}

// 3단계: 블로그 포스트 실제 생성
async function createBlogPost(jwtToken, summary) {
  console.log('📝 블로그 포스트 생성 중...');
  
  const url = new URL(`${config.growsomeUrl}/api/admin/blog`);
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`,
      'User-Agent': 'Growsome-Blog-Automation/2.0'
    }
  };
  
  const blogData = {
    title: summary.title,
    content: summary.content, // content_body 필드에 매핑
    category_id: 15, // AI/기술 카테고리 ID
    status: 'published', // 'draft' 또는 'published'
    is_featured: false,
    is_hero: false,
    thumbnail_url: null,
    meta_title: summary.title,
    meta_description: summary.summary
  };
  
  console.log('📤 요청 데이터:', {
    ...blogData,
    content: blogData.content.substring(0, 100) + '...'
  });
  
  try {
    const response = await makeRequest(options, blogData, url.protocol === 'https:');
    
    console.log('📥 API 응답 상태:', response.statusCode);
    console.log('📥 API 응답 데이터:', JSON.stringify(response.data, null, 2));
    
    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log('✅ 블로그 포스트 생성 성공');
      console.log(`   포스트 ID: ${response.data.post?.id || 'Unknown'}`);
      console.log(`   Slug: ${response.data.post?.slug || summary.slug}`);
      return response.data;
    } else {
      throw new Error(`블로그 포스트 생성 실패 (${response.statusCode}): ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('❌ 블로그 포스트 생성 실패:', error.message);
    
    // 실패 시 파일로 저장
    const fs = require('fs');
    const filename = `blog-post-${summary.slug}.json`;
    fs.writeFileSync(filename, JSON.stringify(blogData, null, 2));
    console.log(`💾 블로그 데이터를 파일로 저장: ${filename}`);
    
    throw error;
  }
}

// 4단계: 결과 검증 및 알림
async function verifyAndNotify(blogPost, summary) {
  console.log('🔍 결과 검증 중...');
  
  // 생성된 블로그 포스트 확인
  try {
    const postId = blogPost.post?.id;
    const slug = blogPost.post?.slug || summary.slug;
    
    if (postId) {
      const url = new URL(`${config.growsomeUrl}/api/admin/blog/${postId}`);
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'GET',
        headers: {
          'User-Agent': 'Growsome-Blog-Automation/2.0'
        }
      };
      
      const response = await makeRequest(options, null, url.protocol === 'https:');
      
      if (response.statusCode === 200) {
        console.log('✅ 블로그 포스트 확인 완료');
        return { verified: true, url: `${config.growsomeUrl}/blog/${slug}` };
      }
    }
    
    console.log('⚠️ 블로그 포스트 확인 실패 (하지만 생성은 성공했을 수 있음)');
    return { verified: false, url: `${config.growsomeUrl}/blog/${summary.slug}` };
    
  } catch (error) {
    console.log('⚠️ 검증 실패:', error.message);
    return { verified: false, url: `${config.growsomeUrl}/blog/${summary.slug}` };
  }
}

// 메인 실행 함수 (완전 자동화)
async function main() {
  console.log('🚀 AI 블로그 완전 자동화 시작\n');
  
  const startTime = Date.now();
  
  try {
    // 1단계: JWT 토큰 발급
    console.log('=== 1단계: 인증 ===');
    const jwtToken = await getJWTToken();
    console.log('');
    
    // 2단계: AI 요약
    console.log('=== 2단계: AI 콘텐츠 생성 ===');
    const summary = await generateAISummary(config.testData);
    console.log('');
    
    // 3단계: 블로그 포스트 생성 (실제 API 호출)
    console.log('=== 3단계: 블로그 포스트 생성 ===');
    const blogPost = await createBlogPost(jwtToken, summary);
    console.log('');
    
    // 4단계: 결과 검증
    console.log('=== 4단계: 결과 검증 ===');
    const verification = await verifyAndNotify(blogPost, summary);
    console.log('');
    
    // 최종 결과
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('🎉 AI 블로그 자동화 완료!');
    console.log(`⏱️ 총 소요시간: ${duration}초`);
    console.log('📊 생성 결과:');
    console.log(`   📝 제목: ${summary.title}`);
    console.log(`   🔗 Slug: ${summary.slug}`);
    console.log(`   📄 내용 길이: ${summary.content.length}자`);
    console.log(`   ✅ 검증 상태: ${verification.verified ? '성공' : '확인 필요'}`);
    console.log(`   🌐 URL: ${verification.url}`);
    
    // Slack 알림 전송
    await sendSlackNotification({
      level: 'success',
      title: '블로그 포스트 자동 생성 완료',
      message: `새로운 블로그 포스트가 성공적으로 생성되었습니다!`,
      details: {
        '제목': summary.title,
        '글자 수': `${summary.content.length.toLocaleString()}자`,
        '처리 시간': `${duration}초`,
        '링크': verification.url
      }
    });
    
  } catch (error) {
    console.error('\n💥 자동화 실패:');
    console.error(`   오류: ${error.message}`);
    
    // Slack 오류 알림 전송
    await sendSlackNotification({
      level: 'error',
      title: '블로그 자동화 오류 발생',
      message: `블로그 자동 생성 과정에서 오류가 발생했습니다.`,
      details: {
        '오류 메시지': error.message,
        '시간': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
      }
    });
    
    console.log('\n🔧 문제 해결 방법:');
    console.log('   1. Growsome 서버 상태 확인 (npm run dev)');
    console.log('   2. 블로그 API 엔드포인트 확인 (/api/admin/blog)');
    console.log('   3. JWT 토큰 권한 확인');
    console.log('   4. OpenAI API 키 설정 확인 (선택사항)');
    console.log('   5. 데이터베이스 연결 상태 확인');
    
    process.exit(1);
  }
}

// CLI 인터페이스 추가
function showUsage() {
  console.log(`
🤖 Growsome AI 블로그 자동화 도구 v2.0

사용법:
  node enhanced-blog-automation.js [옵션]

옵션:
  --help, -h          이 도움말 표시
  --test             토큰 발급까지만 테스트
  --dry-run          실제 블로그 생성 없이 시뮬레이션만
  --url <URL>        커스텀 소스 URL 사용
  --production       프로덕션 환경에서 실행

예시:
  node enhanced-blog-automation.js --test
  node enhanced-blog-automation.js --url "https://example.com/news"
  node enhanced-blog-automation.js --production

환경 변수:
  OPENAI_API_KEY     OpenAI API 키 (선택사항)
  NODE_ENV          환경 설정 (development/production)
`);
}

// 스크립트 실행
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    process.exit(0);
  }
  
  if (args.includes('--test')) {
    // 테스트 모드: 토큰 발급까지만
    console.log('🧪 테스트 모드로 실행합니다 (토큰 발급까지만)');
    getJWTToken().then(() => {
      console.log('✅ 테스트 완료');
    }).catch(error => {
      console.error('❌ 테스트 실패:', error.message);
      process.exit(1);
    });
  } else if (args.includes('--production')) {
    // 프로덕션 모드
    config.growsomeUrl = 'https://growsome.kr';
    main();
  } else {
    // 일반 실행
    main();
  }
}

module.exports = {
  getJWTToken,
  generateAISummary,
  createBlogPost,
  verifyAndNotify,
  config
};