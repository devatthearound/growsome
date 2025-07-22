#!/bin/bash

# 🚀 Growsome AI 블로그 자동화 빠른 테스트
echo "🤖 Growsome AI 블로그 자동화 시스템 테스트"
echo "================================================"
echo ""

# 서버 상태 확인
echo "🔍 1. 서버 상태 확인 중..."
if curl -s --max-time 5 https://growsome.kr/api/health > /dev/null; then
    echo "✅ Growsome 서버 정상 작동"
else
    echo "❌ Growsome 서버 연결 실패 - localhost로 테스트합니다"
    export GROWSOME_URL="http://localhost:3000"
fi
echo ""

# JWT 토큰 테스트
echo "🎫 2. JWT 토큰 발급 테스트..."
JWT_RESPONSE=$(curl -s -X POST https://growsome.kr/api/auth/generate-token \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "growsome-n8n-secure-key-2025",
    "purpose": "blog_automation"
  }' 2>/dev/null)

if [[ $JWT_RESPONSE == *"success"* && $JWT_RESPONSE == *"token"* ]]; then
    echo "✅ JWT 토큰 발급 성공"
    # JWT 토큰 길이 확인
    TOKEN_LENGTH=$(echo "$JWT_RESPONSE" | grep -o '"token":"[^"]*"' | wc -c)
    echo "   토큰 길이: ${TOKEN_LENGTH}자"
else
    echo "❌ JWT 토큰 발급 실패"
    echo "   응답: $JWT_RESPONSE"
fi
echo ""

# GraphQL API 테스트
echo "🔗 3. GraphQL API 연결 테스트..."
GRAPHQL_RESPONSE=$(curl -s -X POST https://growsome.kr/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { hello version }"
  }' 2>/dev/null)

if [[ $GRAPHQL_RESPONSE == *"Hello"* ]]; then
    echo "✅ GraphQL API 정상 작동"
    VERSION=$(echo "$GRAPHQL_RESPONSE" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    echo "   API 버전: $VERSION"
else
    echo "❌ GraphQL API 연결 실패"
    echo "   응답: $GRAPHQL_RESPONSE"
fi
echo ""

# 블로그 카테고리 확인
echo "📂 4. 블로그 카테고리 확인..."
CATEGORIES_RESPONSE=$(curl -s -X POST https://growsome.kr/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { categories { id name slug } }"
  }' 2>/dev/null)

if [[ $CATEGORIES_RESPONSE == *"categories"* ]]; then
    echo "✅ 블로그 카테고리 로드 성공"
    CATEGORY_COUNT=$(echo "$CATEGORIES_RESPONSE" | grep -o '"id":[0-9]*' | wc -l)
    echo "   카테고리 수: $CATEGORY_COUNT개"
else
    echo "❌ 블로그 카테고리 로드 실패"
fi
echo ""

# Node.js 테스트 스크립트 실행
echo "🧪 5. 전체 자동화 플로우 테스트..."
if command -v node >/dev/null 2>&1; then
    echo "   Node.js 버전: $(node --version)"
    echo "   테스트 시작..."
    echo ""
    
    # 실제 Node.js 테스트 실행
    node test-blog-automation.js
    
    TEST_EXIT_CODE=$?
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        echo ""
        echo "🎉 전체 테스트 성공!"
    else
        echo ""
        echo "❌ 테스트 실패 (종료 코드: $TEST_EXIT_CODE)"
    fi
else
    echo "❌ Node.js가 설치되지 않았습니다"
    echo "   npm run test:blog-automation 명령으로 테스트하세요"
fi

echo ""
echo "================================================"
echo "📋 테스트 완료 요약:"
echo ""
echo "다음 명령어들로 개별 테스트를 실행할 수 있습니다:"
echo "  npm run test:blog-automation  # 전체 자동화 테스트"
echo "  npm run blog:auto-upload      # 동일 (별칭)"
echo "  ./quick-test.sh               # 이 스크립트 재실행"
echo ""
echo "🔧 문제가 있다면:"
echo "1. Growsome 서버가 실행 중인지 확인 (npm run dev)"
echo "2. 데이터베이스 연결 상태 확인 (npm run db:status)"
echo "3. .env 파일의 N8N_API_KEY 설정 확인"
echo "4. JWT 토큰 생성 API 엔드포인트 확인"
echo ""
echo "🚀 n8n 워크플로우 설정은 다음 파일을 참조하세요:"
echo "   docs/AI_BLOG_AUTOMATION_GUIDE.md"
echo ""
