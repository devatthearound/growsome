#!/usr/bin/env node

// 🐛 디버깅 버전 - OpenAI API 오류 분석
require('dotenv').config({ path: '.env.local' });

const https = require('https');
const http = require('http');
const { URL } = require('url');

console.log('🔍 디버깅 모드: OpenAI API 오류 분석');
console.log('📋 환경 변수 체크...\n');

// 환경 변수 검증
console.log('OPENAI_API_KEY 존재:', !!process.env.OPENAI_API_KEY);
console.log('API Key 길이:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
console.log('API Key 시작:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'N/A');

// HTTP 요청 함수 (디버깅 강화)
const makeRequest = (options, body = null) => {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    
    console.log('📤 요청 보내는 중...');
    console.log('🎯 URL:', `${options.protocol}//${options.hostname}${options.path}`);
    console.log('📝 Headers:', JSON.stringify(options.headers, null, 2));
    if (body) {
      console.log('📦 Body 크기:', typeof body === 'string' ? body.length : JSON.stringify(body).length, '바이트');
    }
    
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('📥 응답 받음:');
        console.log('🔢 Status Code:', res.statusCode);
        console.log('📋 Response Headers:', JSON.stringify(res.headers, null, 2));
        console.log('📄 Response Body (first 500 chars):', data.substring(0, 500));
        
        try {
          if (res.headers['content-type']?.includes('json')) {
            resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
          } else {
            resolve({ statusCode: res.statusCode, body: data });
          }
        } catch (error) {
          console.log('❌ JSON 파싱 오류:', error.message);
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ 요청 오류:', error);
      reject(error);
    });
    
    if (body) {
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      req.write(bodyStr);
    }
    req.end();
  });
};

// 간단한 테스트 실행
async function testOpenAI() {
  try {
    console.log('\n1️⃣ OpenAI API 간단 테스트 중...');
    
    const testPayload = {
      model: "gpt-4o-mini", // 더 안정적인 모델로 테스트
      messages: [{
        role: "user",
        content: "Hello, just testing API connection. Please respond with 'API working!'"
      }],
      max_tokens: 50,
      temperature: 0.1
    };

    console.log('🧪 테스트 페이로드:', JSON.stringify(testPayload, null, 2));

    const response = await makeRequest({
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      protocol: 'https:',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Growsome-Bot/1.0'
      }
    }, testPayload);

    if (response.statusCode === 200) {
      console.log('✅ OpenAI API 테스트 성공!');
      console.log('🤖 AI 응답:', response.body.choices[0].message.content);
      return true;
    } else {
      console.log('❌ OpenAI API 테스트 실패');
      console.log('📄 오류 응답:', JSON.stringify(response.body, null, 2));
      return false;
    }

  } catch (error) {
    console.error('❌ 테스트 중 오류:', error);
    return false;
  }
}

// RSS 피드 테스트
async function testRSSFeed() {
  try {
    console.log('\n2️⃣ RSS 피드 테스트 중...');
    
    const rssResponse = await makeRequest({
      hostname: 'techcrunch.com',
      path: '/feed/',
      method: 'GET',
      protocol: 'https:',
      headers: { 
        'User-Agent': 'Mozilla/5.0 (compatible; Growsome-Bot/2.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (rssResponse.statusCode === 200) {
      console.log('✅ RSS 피드 수집 성공!');
      console.log('📄 RSS 크기:', rssResponse.body.length, '바이트');
      
      // 첫 번째 아이템 파싱 테스트
      const itemMatch = rssResponse.body.match(/<item[^>]*>[\s\S]*?<\/item>/);
      if (itemMatch) {
        console.log('📰 첫 번째 기사 찾음');
        const titleMatch = itemMatch[0].match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) || 
                          itemMatch[0].match(/<title>([^<]+)<\/title>/);
        if (titleMatch) {
          console.log('📝 제목:', titleMatch[1].substring(0, 80) + '...');
          return { success: true, sampleTitle: titleMatch[1] };
        }
      }
      return { success: true };
    } else {
      console.log('❌ RSS 피드 수집 실패:', rssResponse.statusCode);
      return { success: false };
    }

  } catch (error) {
    console.error('❌ RSS 테스트 중 오류:', error);
    return { success: false };
  }
}

// 메인 디버깅 실행
async function runDiagnostics() {
  console.log('🔍 그로우썸 블로그 자동화 진단 시작\n');
  
  // OpenAI API 테스트
  const openaiResult = await testOpenAI();
  
  // RSS 테스트
  const rssResult = await testRSSFeed();
  
  console.log('\n📊 진단 결과:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🤖 OpenAI API: ${openaiResult ? '✅ 정상' : '❌ 오류'}`);
  console.log(`📰 RSS 피드: ${rssResult.success ? '✅ 정상' : '❌ 오류'}`);
  
  if (openaiResult && rssResult.success) {
    console.log('\n🎉 모든 시스템이 정상 작동합니다!');
    console.log('💡 원본 블로그 자동화 스크립트를 다시 실행해보세요.');
  } else {
    console.log('\n⚠️ 문제가 발견되었습니다:');
    if (!openaiResult) {
      console.log('- OpenAI API 키 또는 권한 문제');
      console.log('- API 키가 유효한지 확인하세요');
      console.log('- OpenAI 계정에 크레딧이 있는지 확인하세요');
    }
    if (!rssResult.success) {
      console.log('- RSS 피드 접근 문제');
      console.log('- 네트워크 연결을 확인하세요');
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// 실행
if (require.main === module) {
  runDiagnostics()
    .then(() => {
      console.log('\n🏁 진단 완료!');
      process.exit(0);
    })
    .catch(error => {
      console.error('진단 실행 오류:', error);
      process.exit(1);
    });
}

module.exports = { testOpenAI, testRSSFeed };