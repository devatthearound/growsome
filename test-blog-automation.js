#!/usr/bin/env node

// 🤖 AI 블로그 자동화 테스트 스크립트 (디버깅 버전)
// 사용법: node test-blog-automation.js

const https = require('https');
const http = require('http');

// 설정
const config = {
  growsomeUrl: 'http://localhost:3000', // 원래 포트로 되돌림
  // growsomeUrl: 'https://growsome.kr', // 프로덕션용
  apiKey: 'growsome-n8n-secure-key-2025',
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

// HTTP 요청 헬퍼 함수
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    
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
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 1단계: JWT 토큰 발급 (디버깅 강화 버전)
async function getJWTToken() {
  console.log('🎫 JWT 토큰 발급 중...');
  
  // 먼저 API 연결 테스트
  const testUrl = new URL(`${config.growsomeUrl}/api/test-connection`);
  
  try {
    console.log('🔍 API 연결 테스트:', testUrl.href);
    const testResponse = await makeRequest({
      hostname: testUrl.hostname,
      port: testUrl.port || (testUrl.protocol === 'https:' ? 443 : 80),
      path: testUrl.pathname,
      method: 'GET',
      protocol: testUrl.protocol,
      headers: {
        'User-Agent': 'Growsome-Blog-Automation/1.0'
      }
    });
    
    console.log('🔍 테스트 API 응답:', testResponse.statusCode, JSON.stringify(testResponse.data));
  } catch (testError) {
    console.log('⚠️ 테스트 API 실패:', testError.message);
  }
  
  const url = new URL(`${config.growsomeUrl}/api/auth/generate-token`);
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    protocol: url.protocol,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Growsome-Blog-Automation/1.0'
    }
  };
  
  const requestData = {
    apiKey: config.apiKey,
    purpose: 'blog_automation'
  };
  
  console.log('📡 요청 정보:', {
    url: url.href,
    method: 'POST',
    headers: options.headers,
    body: { ...requestData, apiKey: requestData.apiKey.substring(0, 10) + '...' }
  });
  
  try {
    const response = await makeRequest(options, requestData);
    
    console.log('📥 응답 상태:', response.statusCode);
    console.log('📥 응답 헤더:', response.headers);
    console.log('📥 응답 본문:', JSON.stringify(response.data, null, 2));
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ JWT 토큰 발급 성공');
      console.log(`   토큰 길이: ${response.data.token.length}자`);
      console.log(`   만료시간: ${response.data.expiresIn}`);
      return response.data.token;
    } else {
      throw new Error(`JWT 토큰 발급 실패: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('❌ JWT 토큰 발급 실패:', error.message);
    throw error;
  }
}

// 2단계: AI 요약 (실제로는 GPT API를 사용하지만, 여기서는 시뮬레이션)
function simulateGPTSummary(originalData) {
  console.log('🤖 AI 요약 시뮬레이션...');
  
  // 실제로는 OpenAI API를 호출해야 함
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
  
  console.log('✅ AI 요약 완료');
  console.log(`   제목: ${summary.title}`);
  console.log(`   slug: ${slug}`);
  console.log(`   내용 길이: ${summary.content.length}자`);
  
  return { ...summary, slug };
}

// 메인 실행 함수
async function main() {
  console.log('🚀 AI 블로그 자동화 테스트 시작 (디버깅 모드)\n');
  
  try {
    // 1단계: JWT 토큰 발급
    const jwtToken = await getJWTToken();
    console.log('');
    
    // 2단계: AI 요약 (시뮬레이션)
    const summary = simulateGPTSummary(config.testData);
    console.log('');
    
    console.log('🎉 테스트 완료 (토큰 발급까지)!');
    console.log('📝 JWT Token:', jwtToken.substring(0, 50) + '...');
    console.log('📝 Summary:', summary.title);
    
  } catch (error) {
    console.error('\n💥 자동화 테스트 실패:');
    console.error(`   오류: ${error.message}`);
    
    console.log('\n🔧 문제 해결 방법:');
    console.log('   1. Growsome 서버가 실행 중인지 확인 (npm run dev)');
    console.log('   2. 포트 3001에서 서버가 실행 중인지 확인');
    console.log('   3. /api/auth/generate-token 엔드포인트 확인');
    console.log('   4. 콘솔에서 API 응답 상세 정보 확인');
    
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = {
  getJWTToken,
  simulateGPTSummary,
  config
};
