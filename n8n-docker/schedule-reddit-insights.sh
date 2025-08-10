#!/bin/bash

# Reddit Insights Workflow Scheduler
# 매일 오전 9시에 레딧 인사이트 분석을 실행합니다.

# 환경 변수 설정
N8N_WEBHOOK_URL="https://n8n.growsome.kr/webhook/reddit-insights"
LOG_FILE="/var/log/reddit-insights.log"
LOCK_FILE="/tmp/reddit-insights.lock"

# 로그 함수
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# 중복 실행 방지
if [ -f "$LOCK_FILE" ]; then
    log_message "이미 실행 중입니다. LOCK_FILE: $LOCK_FILE"
    exit 1
fi

# 락 파일 생성
echo $$ > "$LOCK_FILE"

# 함수: 워크플로우 실행
run_insights_workflow() {
    log_message "레딧 인사이트 워크플로우 시작"
    
    # HTTP 요청 실행
    response=$(curl -s -w "%{http_code}" -X GET "$N8N_WEBHOOK_URL" -o /tmp/response.json)
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 200 ]; then
        log_message "워크플로우 실행 성공 (HTTP $http_code)"
        
        # 응답 내용 로그
        if [ -f "/tmp/response.json" ]; then
            log_message "응답 내용: $(cat /tmp/response.json | head -c 200)..."
        fi
    else
        log_message "워크플로우 실행 실패 (HTTP $http_code)"
        log_message "응답: $response"
    fi
}

# 함수: 텔레그램 알림 전송
send_telegram_notification() {
    local message="$1"
    local bot_token="${TELEGRAM_BOT_TOKEN:-}"
    local chat_id="${TELEGRAM_CHAT_ID:-}"
    
    if [ -n "$bot_token" ] && [ -n "$chat_id" ]; then
        curl -s -X POST "https://api.telegram.org/bot$bot_token/sendMessage" \
            -H "Content-Type: application/json" \
            -d "{\"chat_id\":\"$chat_id\",\"text\":\"$message\",\"parse_mode\":\"Markdown\"}"
    fi
}

# 메인 실행
main() {
    log_message "=== 레딧 인사이트 스케줄러 시작 ==="
    
    # 워크플로우 실행
    run_insights_workflow
    
    # 성공 알림
    if [ "$http_code" -eq 200 ]; then
        send_telegram_notification "✅ 레딧 인사이트 분석 완료\\n\\n📊 오늘의 비즈니스 기회 분석이 완료되었습니다.\\n📈 Google Sheets에서 자세한 결과를 확인하세요."
    else
        send_telegram_notification "❌ 레딧 인사이트 분석 실패\\n\\n🔧 워크플로우 실행 중 오류가 발생했습니다.\\n📋 로그를 확인해주세요."
    fi
    
    log_message "=== 레딧 인사이트 스케줄러 종료 ==="
}

# 트랩 설정 (스크립트 종료 시 락 파일 제거)
trap 'rm -f "$LOCK_FILE"; exit' EXIT

# 메인 함수 실행
main "$@" 