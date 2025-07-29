#!/bin/bash

# 블로그 포스트 업데이트 스크립트
echo "📝 블로그 포스트 업데이트 시작"

# Growsome 프로젝트 디렉토리로 이동
cd /Users/hyunjucho/Documents/GitHub/growsome

# npm 의존성 확인
if [ ! -d "node_modules" ]; then
    echo "📦 npm 의존성 설치 중..."
    npm install
fi

# Prisma 클라이언트 생성
echo "🔄 Prisma 클라이언트 생성 중..."
npx prisma generate

# 블로그 포스트 업데이트 실행
echo "🚀 블로그 포스트 업데이트 실행 중..."
node update-blog-post.js

echo "✅ 업데이트 완료!"
echo "🌐 업데이트된 글 확인: http://localhost:3001/blog/web-development-trends-2025"
