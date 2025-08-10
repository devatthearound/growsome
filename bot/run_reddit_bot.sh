#!/bin/bash

# Reddit Bot 실행 스크립트
echo "🤖 Reddit Business Analyzer Bot 시작..."

# Node.js 의존성 확인
if ! command -v node &> /dev/null; then
    echo "❌ Node.js가 설치되지 않았습니다."
    echo "💡 Node.js를 설치해주세요: https://nodejs.org/"
    exit 1
fi

# npm 의존성 설치
echo "📦 의존성 설치 중..."
npm install

# 봇 실행
echo "🚀 Reddit 분석 봇 실행..."
node reddit_bot.js
