#!/bin/bash

echo "🚀 Traffic-Lens 설정 시작..."

# 1. 필요한 패키지 설치
echo "📦 패키지 설치 중..."
npm install web-push recharts firebase-admin

# 2. 개발 의존성 패키지 설치
echo "📦 개발 의존성 패키지 설치 중..."
npm install --save-dev @types/web-push

# 3. VAPID 키 생성
echo "🔑 VAPID 키 생성 중..."
node scripts/generate-vapid-keys.js

echo "✅ Traffic-Lens 기본 설정이 완료되었습니다!"
echo ""
echo "📋 다음 단계:"
echo "1. 생성된 VAPID 키를 .env 파일에 추가하세요"
echo "2. 데이터베이스 마이그레이션을 실행하세요: npm run db:generate && npm run db:push"
echo "3. 개발 서버를 실행하세요: npm run dev"
echo "4. http://localhost:3000/store 에서 Traffic-Lens 카드를 확인하세요"
echo ""
echo "🎉 Traffic-Lens가 성공적으로 설정되었습니다!"
