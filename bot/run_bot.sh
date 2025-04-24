#!/bin/bash

# 스크립트 디렉토리로 이동
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 가상환경 활성화 (있는 경우)
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# 환경변수 로드 (있는 경우)
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 필요한 패키지 설치 확인
pip3 install -r requirements.txt

# 봇 실행
echo "🤖 크몽 키워드 봇 실행 시작: $(date)"
python3 growsome_keyword_bot.py
echo "✅ 봇 실행 완료: $(date)" 