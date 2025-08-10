#!/usr/bin/env node

/**
 * VAPID 키 생성 스크립트
 * 
 * 사용법:
 * node scripts/generate-vapid-keys.js
 */

const webpush = require('web-push');

function generateVAPIDKeys() {
  try {
    const vapidKeys = webpush.generateVAPIDKeys();
    
    console.log('🔐 VAPID 키가 성공적으로 생성되었습니다!\n');
    console.log('📋 다음 환경 변수를 .env 파일에 추가하세요:\n');
    console.log(`VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"`);
    console.log(`VAPID_PRIVATE_KEY="${vapidKeys.privateKey}"`);
    console.log('\n💡 이 키들은 웹 푸시 알림을 위해 필요합니다.');
    console.log('📧 이메일 주소도 web-push 라이브러리 설정에 필요합니다.');
    console.log('\n⚠️  보안상 이 키들을 안전한 곳에 저장하고 공개하지 마세요!');
    
    return vapidKeys;
  } catch (error) {
    console.error('❌ VAPID 키 생성 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

// 스크립트가 직접 실행될 때만 키 생성
if (require.main === module) {
  generateVAPIDKeys();
}

module.exports = { generateVAPIDKeys };
