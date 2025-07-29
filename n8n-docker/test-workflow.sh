#!/bin/bash

# n8n 워크플로우 수동 테스트 스크립트
echo "🚀 n8n 워크플로우 수동 테스트 시작"

# 워크플로우 웹훅 트리거 (테스트용)
echo "📡 워크플로우 트리거 중..."

curl -X POST "https://n8n.growsome.kr/webhook/test-blog-automation" \
  -H "Content-Type: application/json" \
  -d '{
    "test": true,
    "trigger_time": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "message": "Manual test trigger"
  }'

echo ""
echo "✅ 테스트 요청 완료"
echo "📊 결과는 n8n 웹 인터페이스에서 확인하세요: https://n8n.growsome.kr"
