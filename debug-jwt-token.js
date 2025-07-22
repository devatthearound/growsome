#!/usr/bin/env node

// 🔍 JWT 토큰 디버깅 스크립트

const https = require('https');
const http = require('http');
const jwt = require('jsonwebtoken');

const config = {
  growsomeUrl: 'http://localhost:3000',
  apiKey: 'growsome-n8n-secure-key-2025',
  jwtSecret: process.env.JWT_SECRET || '2d25633b8e2543b9a347c28713c92b5f7c7c3d8a1e4f5b2c9d8e7f6a5b4c3d2e1f9g8h7i6j5k4l3m2n1o0p9q8r7s6t5u4v3w2x1y0z'
};

// HTTP 요청 헬퍼
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

async function debugJWTToken() {
  console.log('🔍 JWT 토큰 디버깅 시작\n');
  
  try {
    // 1단계: JWT 토큰 발급
    console.log('1️⃣ JWT 토큰 발급 중...');
    const url = new URL(`${config.growsomeUrl}/api/auth/generate-token`);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'JWT-Debug/1.0'
      }
    };
    
    const requestData = {
      apiKey: config.apiKey,
      purpose: 'blog_automation'
    };
    
    const tokenResponse = await makeRequest(options, requestData);
    
    if (tokenResponse.statusCode !== 200 || !tokenResponse.data.success) {
      throw new Error(`토큰 발급 실패: ${JSON.stringify(tokenResponse.data)}`);
    }
    
    const token = tokenResponse.data.token;
    console.log('✅ 토큰 발급 성공');
    console.log(`📝 토큰 길이: ${token.length}자`);
    console.log(`🔗 토큰 앞부분: ${token.substring(0, 50)}...`);
    console.log('');
    
    // 2단계: 토큰 내용 디코딩
    console.log('2️⃣ JWT 토큰 내용 분석...');
    try {
      const decoded = jwt.decode(token, { complete: true });
      console.log('📋 토큰 헤더:', JSON.stringify(decoded.header, null, 2));
      console.log('📋 토큰 페이로드:', JSON.stringify(decoded.payload, null, 2));
      
      // 만료 시간 확인
      const now = Math.floor(Date.now() / 1000);
      const exp = decoded.payload.exp;
      const timeUntilExpiry = exp - now;
      
      console.log(`⏰ 현재 시간: ${new Date(now * 1000).toISOString()}`);
      console.log(`⏰ 만료 시간: ${new Date(exp * 1000).toISOString()}`);
      console.log(`⏱️ 남은 시간: ${timeUntilExpiry}초 (${Math.floor(timeUntilExpiry / 60)}분)`);
      console.log('');
    } catch (decodeError) {
      console.error('❌ 토큰 디코딩 실패:', decodeError.message);
    }
    
    // 3단계: 토큰 검증
    console.log('3️⃣ JWT 토큰 검증...');
    try {
      const verified = jwt.verify(token, config.jwtSecret);
      console.log('✅ 토큰 검증 성공');
      console.log('👤 검증된 사용자 정보:', JSON.stringify(verified, null, 2));
      console.log('');
    } catch (verifyError) {
      console.error('❌ 토큰 검증 실패:', verifyError.message);
      console.log('🔑 사용된 시크릿 키 길이:', config.jwtSecret.length);
      console.log('');
    }
    
    // 4단계: API 호출 테스트 - GET 먼저
    console.log('4️⃣ 블로그 API GET 테스트...');
    const getUrl = new URL(`${config.growsomeUrl}/api/admin/blog`);
    const getOptions = {
      hostname: getUrl.hostname,
      port: getUrl.port || 80,
      path: getUrl.pathname,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'JWT-Debug/1.0'
      }
    };
    
    const getResponse = await makeRequest(getOptions);
    console.log(`📡 GET 응답 상태: ${getResponse.statusCode}`);
    console.log(`📡 GET 응답 데이터:`, JSON.stringify(getResponse.data, null, 2));
    console.log('');
    
    // 5단계: API 호출 테스트 - POST (간단한 테스트 데이터)
    console.log('5️⃣ 블로그 API POST 테스트...');
    const postUrl = new URL(`${config.growsomeUrl}/api/admin/blog`);
    const postOptions = {
      hostname: postUrl.hostname,
      port: postUrl.port || 80,
      path: postUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'JWT-Debug/1.0'
      }
    };
    
    const testPostData = {
      title: '[테스트] JWT 디버깅 포스트',
      content: '# 테스트 포스트\n\n이것은 JWT 토큰 디버깅을 위한 테스트 포스트입니다.',
      category_id: 15,
      status: 'draft', // 테스트니까 draft로
      meta_title: '[테스트] JWT 디버깅 포스트',
      meta_description: 'JWT 토큰 테스트용 포스트입니다.'
    };
    
    const postResponse = await makeRequest(postOptions, testPostData);
    console.log(`📡 POST 응답 상태: ${postResponse.statusCode}`);
    console.log(`📡 POST 응답 데이터:`, JSON.stringify(postResponse.data, null, 2));
    
    if (postResponse.statusCode === 200 || postResponse.statusCode === 201) {
      console.log('🎉 JWT 토큰이 정상적으로 작동합니다!');
    } else {
      console.log('❌ JWT 토큰 사용 중 문제가 있습니다.');
    }
    
  } catch (error) {
    console.error('💥 JWT 디버깅 실패:', error.message);
  }
}

// 스크립트 실행
if (require.main === module) {
  debugJWTToken();
}

module.exports = { debugJWTToken };
