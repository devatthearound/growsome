# n8n Reddit Business Insights Workflow

Reddit에서 비즈니스 관련 포스트를 수집하고 AI로 분석하여 비즈니스 기회와 시장 인사이트를 추출하는 자동화 시스템입니다.

## 🚀 주요 기능

- **자동 데이터 수집**: Reddit r/entrepreneur에서 인기 포스트 자동 수집
- **AI 분석**: Google Gemini를 사용한 비즈니스 기회 분석
- **실행 가능한 액션**: 구체적인 비즈니스 실행 계획 생성
- **결과 저장**: Google Sheets에 구조화된 데이터 저장
- **Telegram 봇**: 실시간 알림 및 수동 실행 기능
- **자동 스케줄링**: 매일 자동 실행

## 📁 파일 구조

```
n8n-docker/
├── docker-compose.yml              # n8n Docker 설정
├── reddit-insights-workflow.json   # 메인 워크플로우
├── telegram-reddit-bot.json        # Telegram 봇 워크플로우
├── schedule-reddit-insights.sh     # 자동 실행 스크립트
├── REDDIT_INSIGHTS_SETUP.md       # 상세 설정 가이드
└── README.md                      # 이 파일
```

## 🛠️ 빠른 시작

### 1. 환경 변수 설정

```bash
# .env 파일 생성 (또는 시스템 환경 변수 설정)
export GOOGLE_GEMINI_API_KEY="your_gemini_api_key"
export GOOGLE_SHEETS_ID="your_google_sheets_id"
export GOOGLE_SHEETS_TOKEN="your_google_sheets_token"
export TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
export TELEGRAM_CHAT_ID="your_chat_id"
```

### 2. n8n 실행

```bash
cd n8n-docker
docker-compose up -d
```

### 3. 워크플로우 임포트

1. n8n 대시보드 접속: `https://n8n.growsome.kr`
2. `reddit-insights-workflow.json` 파일 임포트
3. `telegram-reddit-bot.json` 파일 임포트
4. 환경 변수 연결 확인

### 4. 자동 실행 설정

```bash
# crontab 편집
crontab -e

# 매일 오전 9시 실행
0 9 * * * /path/to/growsome/n8n-docker/schedule-reddit-insights.sh
```

## 📊 워크플로우 구성

### 메인 워크플로우 (reddit-insights-workflow.json)

1. **Webhook Trigger**: 워크플로우 시작점
2. **Get Reddit Posts**: Reddit API로 포스트 수집
3. **Filter Posts**: 비즈니스 키워드로 필터링
4. **Analyze Content by AI**: Google Gemini로 분석
5. **Extract Insights**: 인사이트 추출
6. **Generate Action Plan**: 실행 계획 생성
7. **Merge Final Report**: 최종 리포트 통합
8. **Update Google Sheets**: 결과 저장

### Telegram 봇 워크플로우 (telegram-reddit-bot.json)

1. **Telegram Webhook**: 봇 메시지 수신
2. **Parse Command**: 명령어 파싱
3. **Trigger Insights Workflow**: 메인 워크플로우 실행
4. **Send Telegram Response**: 결과 전송

## 🔧 설정 가이드

### Google Gemini API 설정

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 방문
2. API 키 생성
3. 환경 변수에 추가

### Google Sheets 설정

1. 새로운 Google Sheets 생성
2. Google Sheets API 활성화
3. 서비스 계정 생성
4. JSON 키 다운로드
5. Sheets ID와 토큰 설정

### Telegram 봇 설정

1. [@BotFather](https://t.me/botfather)에서 봇 생성
2. 봇 토큰 획득
3. 웹훅 URL 설정: `https://n8n.growsome.kr/webhook/telegram-webhook`
4. 환경 변수 설정

## 📈 결과 데이터

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

## 🎯 사용 방법

### 수동 실행

```bash
# 웹훅으로 직접 실행
curl -X GET "https://n8n.growsome.kr/webhook/reddit-insights"

# 스크립트로 실행
./schedule-reddit-insights.sh
```

### Telegram 봇 사용

```
/start - 봇 시작
/insights - 레딧 인사이트 분석 실행
/help - 도움말 보기
```

### 자동 실행

```bash
# 매일 오전 9시 실행
0 9 * * * /path/to/schedule-reddit-insights.sh

# 매시간 실행
0 * * * * /path/to/schedule-reddit-insights.sh
```

## 🔍 모니터링

### 로그 확인

```bash
# n8n 로그
docker logs n8n-docker-n8n-1

# 스케줄러 로그
tail -f /var/log/reddit-insights.log
```

### 실행 상태 확인

- n8n 대시보드: 워크플로우 실행 히스토리
- Google Sheets: 결과 데이터 확인
- Telegram: 알림 메시지 확인

## 🚨 문제 해결

### Reddit API 제한

- User-Agent 헤더 설정
- 요청 간격 조정
- 인증된 Reddit API 사용

### Google Sheets 권한

- 서비스 계정 접근 권한 확인
- Sheets ID 정확성 확인

### AI API 제한

- Gemini API 할당량 확인
- 요청 간격 조정

## 🔄 커스터마이징

### 서브레딧 변경

`Get Reddit Posts` 노드의 URL 수정:
```
https://www.reddit.com/r/[서브레딧명]/hot.json
```

### 키워드 추가/수정

`Filter Posts` 노드의 `businessKeywords` 배열 수정

### AI 프롬프트 커스터마이징

`Analyze Content by AI`와 `Generate Action Plan` 노드의 프롬프트 수정

## 📈 확장 가능성

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
- Discord 알림

## 📞 지원

문제가 발생하거나 질문이 있으시면:

1. 로그 파일 확인
2. n8n 대시보드에서 워크플로우 상태 확인
3. 환경 변수 설정 확인
4. API 키 유효성 확인

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 