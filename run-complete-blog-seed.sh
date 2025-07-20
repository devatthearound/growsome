#!/bin/bash

echo "🌱 그로우썸 전체 블로그 포스트 생성"
echo "===================================="

cd /Users/hyunjucho/Documents/GitHub/growsome

# TypeScript 컴파일 및 실행
echo "📦 TypeScript 스크립트 실행 중..."

# ts-node로 실행
npx ts-node scripts/seed-all-blog-posts.ts

echo ""
echo "✅ 전체 블로그 포스트 생성 완료!"
echo ""
echo "🔍 생성된 블로그 포스트 확인:"
echo "1. http://localhost:3001/blog/ai-powered-business-automation-2025"
echo "2. http://localhost:3001/blog/startup-growth-strategy-data-driven"
echo "3. http://localhost:3001/blog/digital-marketing-roi-optimization"
echo "4. http://localhost:3001/blog/small-business-digital-transformation-guide"
echo "5. http://localhost:3001/blog/startup-funding-preparation-guide"
echo "6. http://localhost:3001/blog/data-analytics-business-insights"
echo "7. http://localhost:3001/blog/content-marketing-strategy-roi"
echo "8. http://localhost:3001/blog/saas-business-model-korean-market"