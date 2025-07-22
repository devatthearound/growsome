#!/usr/bin/env node

// 🧪 API 엔드포인트 테스트 스크립트
require('dotenv').config({ path: '.env.local' });

const https = require('https');

const testEndpoint = async (baseUrl) => {
  console.log(`\n🔍 ${baseUrl} API 테스트 중...`);

  try {
    // 1. GET 요청으로 엔드포인트 존재 확인
    console.log('1️⃣ GET 요청으로 엔드포인트 확인...');
    
    const url = new URL(`${baseUrl}/api/auth/generate-token`);
    
    const getResponse = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: 'GET',
        headers: {
          'User-Agent': 'Growsome-Test/1.0'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
        });
      });
      
      req.on('error', reject);
      req.end();
    });

    console.log(`   상태 코드: ${getResponse.statusCode}`);
    console.log(`   응답 길이: ${getResponse.body.length}자`);
    
    if (getResponse.statusCode === 200) {
      try {
        const parsed = JSON.parse(getResponse.body);
        console.log(`   ✅ API 응답:`, parsed);
      } catch (e) {
        console.log(`   ⚠️  JSON 파싱 실패 (HTML 응답일 가능성)`);
      }
    } else if (getResponse.statusCode === 404) {
      console.log(`   ❌ 엔드포인트가 존재하지 않습니다`);
      console.log(`   첫 100자: ${getResponse.body.substring(0, 100)}...`);
    } else {
      console.log(`   ⚠️  예상치 못한 응답: ${getResponse.statusCode}`);
    }

    // 2. POST 요청으로 토큰 생성 테스트
    if (getResponse.statusCode !== 404) {
      console.log('\n2️⃣ POST 요청으로 토큰 생성 테스트...');
      
      const postData = JSON.stringify({
        apiKey: 'growsome-n8n-secure-key-2025',
        purpose: 'blog_automation'
      });

      const postResponse = await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'Growsome-Test/1.0'
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
          });
        });
        
        req.on('error', reject);
        req.write(postData);
        req.end();
      });

      console.log(`   POST 상태 코드: ${postResponse.statusCode}`);
      
      if (postResponse.statusCode === 200) {
        try {
          const result = JSON.parse(postResponse.body);
          console.log(`   ✅ 토큰 생성 성공!`);
          console.log(`   토큰 길이: ${result.token?.length || 0}자`);
          console.log(`   만료: ${result.expiresIn}`);
        } catch (e) {
          console.log(`   ⚠️  응답 파싱 실패`);
        }
      } else {
        console.log(`   ❌ 토큰 생성 실패: ${postResponse.statusCode}`);
        console.log(`   응답: ${postResponse.body.substring(0, 200)}...`);
      }
    }

  } catch (error) {
    console.error(`❌ 테스트 실패:`, error.message);
  }
};

// 테스트 실행
const runTests = async () => {
  console.log('🧪 Growsome API 엔드포인트 테스트\n');
  
  // 로컬 테스트
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await testEndpoint('http://localhost:3000');
  
  // 라이브 테스트  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await testEndpoint('https://growsome.kr');
  
  console.log('\n🏁 테스트 완료');
};

runTests().catch(console.error);
