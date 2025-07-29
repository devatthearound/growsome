#!/bin/bash

# Growsome 블로그 자동화 스케줄 체크 스크립트

echo "🔍 Growsome n8n 스케줄 상태 체크"
echo "================================"

# 1. n8n 컨테이너 상태 확인
echo "📦 n8n 컨테이너 상태:"
docker ps | grep n8n

echo ""
echo "🕐 n8n 컨테이너 로그 (최근 50줄):"
docker logs --tail 50 $(docker ps -q --filter "name=n8n")

echo ""
echo "⏰ 서버 시간대 확인:"
echo "현재 시간: $(date)"
echo "Asia/Seoul 시간: $(TZ=Asia/Seoul date)"

echo ""
echo "🔧 cron 표현식 확인:"
echo "0 8 * * * = 매일 8시 (UTC 기준)"
echo "현재 UTC 시간: $(TZ=UTC date)"

echo ""
echo "💡 문제 해결 방법:"
echo "1. n8n 워크플로우가 활성화되어 있는지 확인"
echo "2. 시간대 설정이 올바른지 확인 (GENERIC_TIMEZONE=Asia/Seoul)"
echo "3. n8n 웹 인터페이스에서 워크플로우 실행 이력 확인"
echo "4. 수동 실행 테스트"
