# Reddit Business Insights Workflow Setup Guide

## 개요
이 워크플로우는 Reddit에서 비즈니스 관련 포스트를 수집하고, AI로 분석하여 비즈니스 기회와 시장 인사이트를 추출하는 자동화 시스템입니다.

## 워크플로우 구성

### 1. 데이터 수집 단계
- **Webhook Trigger**: 워크플로우 시작점
- **Get Reddit Posts**: r/entrepreneur 서브레딧에서 인기 포스트 수집
- **Filter Posts**: 비즈니스 관련 키워드로 필터링

### 2. AI 분석 단계
- **Analyze Content by AI**: Google Gemini로 포스트 분석
- **Extract Insights**: 분석 결과에서 인사이트 추출
- **Generate Action Plan**: 실행 가능한 액션 플랜 생성

### 3. 결과 저장 단계
- **Merge Final Report**: 최종 리포트 통합
- **Update Google Sheets**: Google Sheets에 결과 저장

## 설정 방법

### 1. 환경 변수 설정
n8n 대시보드에서 다음 환경 변수를 설정하세요:

```bash
# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Google Sheets API
GOOGLE_SHEETS_ID=your_google_sheets_id_here
GOOGLE_SHEETS_TOKEN=your_google_sheets_token_here
```

### 2. Google Gemini API 키 발급
1. [Google AI Studio](https://makersuite.google.com/app/apikey) 방문
2. API 키 생성
3. n8n 환경 변수에 추가

### 3. Google Sheets 설정
1. 새로운 Google Sheets 생성
2. Google Sheets API 활성화
3. 서비스 계정 생성 및 JSON 키 다운로드
4. Sheets ID와 토큰을 환경 변수에 설정

### 4. 워크플로우 임포트
1. n8n 대시보드 접속
2. `reddit-insights-workflow.json` 파일 임포트
3. 환경 변수 연결 확인

## 사용 방법

### 수동 실행
```bash
curl -X GET "https://n8n.growsome.kr/webhook/reddit-insights"
```

### 자동 실행 (Cron)
```bash
# 매일 오전 9시 실행
0 9 * * * curl -X GET "https://n8n.growsome.kr/webhook/reddit-insights"
```

### Telegram 봇 연동
Telegram 봇을 통해 수동으로 실행할 수 있습니다.

## 결과 데이터

### Google Sheets 구조
| 컬럼 | 설명 |
|------|------|
| A | 리포트 날짜 |
| B | 분석된 포스트 수 |
| C | 발견된 기회 수 |
| D | 주요 기회 (JSON) |
| E | 분석 요약 |
| F | 즉시 실행 액션 |
| G | 단기 목표 |
| H | 장기 전략 |

### 분석 키워드
- startup, business, entrepreneur
- revenue, profit, market
- customer, product, service
- funding, growth, scaling
- strategy, opportunity, problem
- solution, idea, validation
- traction, monetization

## 커스터마이징

### 서브레딧 변경
`Get Reddit Posts` 노드의 URL을 수정:
```
https://www.reddit.com/r/[서브레딧명]/hot.json
```

### 키워드 추가/수정
`Filter Posts` 노드의 `businessKeywords` 배열 수정

### AI 프롬프트 커스터마이징
`Analyze Content by AI`와 `Generate Action Plan` 노드의 프롬프트 수정

## 모니터링

### 로그 확인
```bash
docker logs n8n-docker-n8n-1
```

### 실행 상태 확인
n8n 대시보드에서 워크플로우 실행 히스토리 확인

## 문제 해결

### Reddit API 제한
- User-Agent 헤더 설정
- 요청 간격 조정
- 인증된 Reddit API 사용

### Google Sheets 권한
- 서비스 계정이 Sheets에 접근 권한 있는지 확인
- Sheets ID가 올바른지 확인

### AI API 제한
- Gemini API 할당량 확인
- 요청 간격 조정

## 확장 가능성

### 추가 소스
- Twitter/X API
- LinkedIn API
- Hacker News API
- Product Hunt API

### 추가 분석
- 감정 분석
- 트렌드 분석
- 경쟁사 분석
- 시장 규모 추정

### 알림 시스템
- Slack 알림
- Email 알림
- Telegram 알림 