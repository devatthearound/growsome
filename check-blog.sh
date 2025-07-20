#!/bin/bash

echo "📊 그로우썸 블로그 현황 확인"
echo "================================"

cd /Users/hyunjucho/Documents/GitHub/growsome

# package.json 확인
if [ -f "package.json" ]; then
    echo "✅ package.json 존재"
else
    echo "❌ package.json 없음"
fi

# node_modules 확인
if [ -d "node_modules" ]; then
    echo "✅ node_modules 존재"
else
    echo "❌ node_modules 없음 - npm install 필요"
fi

# Prisma 설정 확인
if [ -f "prisma/schema.prisma" ]; then
    echo "✅ Prisma 스키마 존재"
else
    echo "❌ Prisma 스키마 없음"
fi

echo ""
echo "🔄 블로그 현황 확인 스크립트 실행 중..."

# Node.js 스크립트 실행
if command -v node &> /dev/null; then
    node check-blog-status.js
else
    echo "❌ Node.js가 설치되지 않음"
fi