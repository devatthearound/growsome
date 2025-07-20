#!/bin/bash

cd /Users/hyunjucho/Documents/GitHub/growsome

echo "🌱 그로우썸 블로그 시딩 시작..."
echo "================================"

# TypeScript 스크립트를 JavaScript로 변환하여 실행
npx ts-node scripts/seed-growsome-blog.ts

echo ""
echo "✅ 블로그 시딩 완료!"
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