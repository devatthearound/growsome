#!/usr/bin/env node

// 🔍 Claude API 키 설정 검증 스크립트
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Claude API 키 설정 검증 시작\n');

// 환경 변수 확인
console.log('📋 환경 변수 체크:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const claudeKey = process.env.CLAUDE_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;
const aiProvider = process.env.AI_PROVIDER || 'auto';

console.log(`🟣 Claude API Key 존재: ${!!claudeKey}`);
console.log(`🔵 OpenAI API Key 존재: ${!!openaiKey}`);
console.log(`🎯 AI Provider 설정: ${aiProvider.toUpperCase()}`);

if (claudeKey) {
  console.log(`🔑 Claude Key 길이: ${claudeKey.length}자`);
  console.log(`🔑 Claude Key 시작: ${claudeKey.substring(0, 15)}...`);
  console.log(`✅ Claude Key 형식: ${claudeKey.startsWith('sk-ant-') ? '정상' : '⚠️ 확인 필요'}`);
} else {
  console.log('❌ Claude API 키가 설정되지 않았습니다');
}

if (openaiKey) {
  console.log(`🔑 OpenAI Key 길이: ${openaiKey.length}자`);
  console.log(`🔑 OpenAI Key 시작: ${openaiKey.substring(0, 15)}...`);
  console.log(`✅ OpenAI Key 형식: ${openaiKey.startsWith('sk-') ? '정상' : '⚠️ 확인 필요'}`);
} else {
  console.log('❌ OpenAI API 키가 설정되지 않았습니다');
}

console.log('\n📊 설정 상태 요약:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (aiProvider === 'auto') {
  if (claudeKey && openaiKey) {
    console.log('🎉 완벽! 다중 AI 시스템 준비 완료');
    console.log('   - Claude 우선 시도 → OpenAI 백업');
  } else if (claudeKey) {
    console.log('✅ Claude만 사용 가능');
    console.log('   - OpenAI 키 추가하면 백업 시스템 구축');
  } else if (openaiKey) {
    console.log('✅ OpenAI만 사용 가능');
    console.log('   - Claude 키 추가하면 다중 AI 시스템 완성');
  } else {
    console.log('❌ 사용 가능한 AI 키가 없습니다');
  }
} else if (aiProvider === 'claude') {
  console.log(claudeKey ? '✅ Claude 전용 모드 준비 완료' : '❌ Claude 키가 필요합니다');
} else if (aiProvider === 'openai') {
  console.log(openaiKey ? '✅ OpenAI 전용 모드 준비 완료' : '❌ OpenAI 키가 필요합니다');
}

console.log('\n🚀 다음 단계:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. 키 설정이 완료되었다면:');
console.log('   node multi-ai-blog.js');
console.log('');
console.log('2. Claude만 테스트하려면:');
console.log('   AI_PROVIDER=claude node multi-ai-blog.js');
console.log('');
console.log('3. OpenAI만 테스트하려면:');
console.log('   AI_PROVIDER=openai node multi-ai-blog.js');

console.log('\n🔧 문제 해결:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('- Claude API 키 발급: https://console.anthropic.com');
console.log('- OpenAI API 키 발급: https://platform.openai.com');
console.log('- .env.local 파일 편집: code .env.local');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');