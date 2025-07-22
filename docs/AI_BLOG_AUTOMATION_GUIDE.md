# 🤖 AI 블로그 자동화 시스템 완벽 가이드

## 🚀 시스템 개요

이 시스템은 **GPT AI + n8n + Growsome GraphQL API + GA4 추적**을 연동해서 다음 과정을 완전 자동화합니다:

1. 📰 **원본 글 입력** → AI가 한국어로 요약 
2. ✍️ **GPT 요약** → 마크다운 형식으로 재작성
3. 📤 **자동 업로드** → Growsome 블로그에 즉시 게시
4. 📊 **GA4 추적** → 자동 업로드 이벤트 분석

## 🔧 설정 방법

### 1단계: JWT 토큰 발급

#### 방법 A: API를 통한 자동 발급 (권장)
```bash
curl -X POST https://growsome.kr/api/auth/generate-token \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "growsome-n8n-secure-key-2025",
    "purpose": "blog_automation"
  }'
```

**응답 예시:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "30d",
  "purpose": "blog_automation"
}
```

#### 방법 B: 수동 로그인 후 토큰 추출
1. 브라우저에서 `https://growsome.kr` 로그인
2. 개발자 도구 → Application → Cookies → `accessToken` 값 복사

### 2단계: n8n 워크플로우 설정

#### 워크플로우 JSON (복사해서 n8n에 import)

```json
{
  "name": "AI Blog Auto Upload to Growsome",
  "nodes": [
    {
      "parameters": {},
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [520, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://growsome.kr/api/auth/generate-token",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {"name": "Content-Type", "value": "application/json"}
          ]
        },
        "sendBody": true,
        "contentType": "json",
        "body": "{\\n  \\"apiKey\\": \\"growsome-n8n-secure-key-2025\\",\\n  \\"purpose\\": \\"blog_automation\\"\\n}"
      },
      "name": "Get JWT Token",
      "type": "n8n-nodes-base.httpRequest",
      "position": [720, 300]
    },
    {
      "parameters": {
        "content": "={\\n  \\"original_url\\": \\"https://example.com/article\\",\\n  \\"source_title\\": \\"원본 글 제목\\",\\n  \\"content_text\\": \\"여기에 요약할 원본 텍스트 내용이 들어갑니다...\\",\\n  \\"jwt_token\\": \\"{{ $('Get JWT Token').first().json.token }}\\"\\n}"
      },
      "name": "Input Data",
      "type": "n8n-nodes-base.set",
      "position": [920, 240]
    },
    {
      "parameters": {
        "resource": "chat",
        "operation": "create",
        "chatInput": "다음 글을 한국어로 요약해주세요...\\n\\n응답 형식:\\n```json\\n{\\n  \\"title\\": \\"요약된 제목\\",\\n  \\"content\\": \\"마크다운 형식의 본문 내용\\",\\n  \\"summary\\": \\"150자 이내 한줄 요약\\"\\n}\\n```"
      },
      "name": "GPT Summarize",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "position": [1120, 240]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://growsome.kr/api/graphql",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {"name": "Content-Type", "value": "application/json"},
            {"name": "Authorization", "value": "=Bearer {{ $json.jwtToken }}"}
          ]
        },
        "sendBody": true,
        "contentType": "json",
        "body": "{\\n  \\"query\\": \\"mutation CreateContent($input: CreateContentInput!) { createContent(input: $input) { id slug title status createdAt publishedAt } }\\",\\n  \\"variables\\": {\\n    \\"input\\": {\\n      \\"title\\": \\"{{ $json.title }}\\",\\n      \\"slug\\": \\"{{ $json.slug }}\\",\\n      \\"contentBody\\": \\"{{ $json.content }}\\",\\n      \\"authorId\\": 1,\\n      \\"categoryId\\": 1,\\n      \\"status\\": \\"PUBLISHED\\",\\n      \\"tags\\": [\\"AI요약\\", \\"자동생성\\", \\"GPT\\"]\\n    }\\n  }\\n}"
      },
      "name": "Upload to Growsome",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1320, 240]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{"node": "Get JWT Token", "type": "main", "index": 0}]]
    },
    "Get JWT Token": {
      "main": [[{"node": "Input Data", "type": "main", "index": 0}]]
    },
    "Input Data": {
      "main": [[{"node": "GPT Summarize", "type": "main", "index": 0}]]
    },
    "GPT Summarize": {
      "main": [[{"node": "Upload to Growsome", "type": "main", "index": 0}]]
    }
  }
}
```

### 3단계: OpenAI API 키 설정

n8n에서 OpenAI credential 생성:
- API Key: `your-openai-api-key`
- Organization ID: (선택사항)

### 4단계: 테스트 실행

#### 입력 데이터 예시:
```json
{
  "original_url": "https://techcrunch.com/2025/01/15/ai-breakthrough",
  "source_title": "Revolutionary AI Breakthrough Changes Everything",
  "content_text": "A new AI model has been developed that can process information 10x faster than previous models. The breakthrough comes from researchers at Stanford who discovered a new neural network architecture..."
}
```

#### 예상 결과:
```
✅ 블로그 글 업로드 성공!

📝 제목: AI 혁신으로 변화하는 기술의 미래
🔗 URL: https://growsome.kr/blog/ai-혁신으로-변화하는-기술의-미래-1737890123456
🆔 글 ID: 42
📅 게시일: 2025-01-26T10:30:00Z
🔍 상태: PUBLISHED

원본 URL: https://techcrunch.com/2025/01/15/ai-breakthrough
```

## 🔄 자동화 시나리오

### 시나리오 1: RSS 피드 자동 모니터링
```yaml
트리거: RSS Feed Reader (매 1시간)
입력: TechCrunch, AI News 등
출력: 새 글이 올라오면 자동 요약 → 게시
```

### 시나리오 2: 웹훅을 통한 수동 업로드
```bash
curl -X POST https://your-n8n-instance.com/webhook/blog-upload \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/article",
    "title": "제목",
    "content": "내용"
  }'
```

### 시나리오 3: 일정 기반 자동 실행
```yaml
트리거: Cron Job (매일 오전 9시)
동작: 
  1. 저장된 URL 목록에서 랜덤 선택
  2. GPT로 요약
  3. 자동 게시
  4. Slack 알림
```

## 📊 GA4 추적 데이터

자동 업로드된 모든 글은 GA4에서 다음 이벤트로 추적됩니다:

### 커스텀 이벤트: `blog_auto_upload`
```json
{
  "event_category": "content_automation",
  "blog_title": "AI 혁신으로 변화하는 기술의 미래",
  "blog_slug": "ai-breakthrough-summary-1737890123456",
  "blog_id": 42,
  "source_url": "https://techcrunch.com/article",
  "upload_success": true,
  "automation_source": "n8n",
  "created_at": "2025-01-26T10:30:00Z"
}
```

## 🛠️ 고급 설정

### 카테고리 자동 분류
```javascript
// GPT 프롬프트에 추가
"글의 내용을 분석해서 다음 카테고리 중 하나를 선택해주세요:
- 기술/AI (categoryId: 1)  
- 비즈니스 (categoryId: 2)
- 마케팅 (categoryId: 3)
- 개발 (categoryId: 4)"
```

### 이미지 자동 생성
```yaml
추가 노드:
1. DALL-E API → 썸네일 이미지 생성
2. AWS S3 Upload → 이미지 업로드  
3. thumbnailUrl 필드에 이미지 URL 추가
```

### 다국어 지원
```javascript
// 언어별 다른 프롬프트
const prompts = {
  ko: "다음 글을 한국어로 요약해주세요...",
  en: "Please summarize the following article in English...",
  ja: "次の記事を日本語で要約してください..."
}
```

## 🚨 에러 처리

### 자주 발생하는 오류들

1. **JWT 토큰 만료**
```json
{"errors": [{"message": "Authentication failed"}]}
```
**해결**: 토큰 재발급 노드 추가

2. **GraphQL 스키마 오류**  
```json
{"errors": [{"message": "Field 'authorId' is required"}]}
```
**해결**: 필수 필드 누락 확인

3. **GPT 응답 파싱 실패**
```javascript
// 더 강력한 파싱 로직 추가
try {
  const jsonMatch = gptResponse.match(/```json\\s*([\\s\\S]*?)\\s*```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }
  // 대체 파싱 로직...
} catch (error) {
  // 에러 처리...
}
```

## 🎯 성능 최적화

### 배치 처리
```yaml
한 번에 여러 글 처리:
1. 입력: URL 배열 [url1, url2, url3]
2. 병렬 처리: 동시에 3개 GPT 요청
3. 순차 업로드: GraphQL API 부하 방지
```

### 캐싱
```javascript
// 중복 URL 방지
const processedUrls = new Set();
if (processedUrls.has(url)) {
  return "이미 처리된 URL입니다";
}
```

## 📈 모니터링 대시보드

### GA4 대시보드에서 확인할 수 있는 지표:
- ✅ 일별 자동 업로드 글 수
- 📊 AI 요약 글의 조회수/참여도  
- 🎯 어떤 소스에서 가장 좋은 콘텐츠가 나오는지
- ⏱️ 자동화 성공/실패율

### 알림 설정
```yaml
Slack 웹훅:
- 업로드 성공/실패 알림
- 일일 자동화 리포트  
- 에러 발생 시 즉시 알림
```

## 🔒 보안 고려사항

1. **API 키 보안**
```bash
# 환경변수 사용
N8N_API_KEY=your-secure-key-here
OPENAI_API_KEY=sk-...
```

2. **IP 제한**
```javascript
// 허용된 IP에서만 webhook 접근
const allowedIPs = ['your.n8n.server.ip'];
```

3. **Rate Limiting**
```yaml
# 1시간당 최대 10개 글만 업로드
rate_limit: 10/hour
```

이 시스템으로 완전 자동화된 AI 블로그 운영이 가능합니다! 🚀

필요한 부분이 있으면 언제든 알려주세요. 추가 기능이나 문제 해결을 도와드리겠습니다.
