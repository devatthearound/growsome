# Reddit Business Analyzer Discord Bot

Discord와 n8n을 연동한 Reddit 비즈니스 기회 분석 봇입니다.

## 🚀 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 봇 실행
```bash
# 방법 1: npm 스크립트 사용
npm run reddit

# 방법 2: 직접 실행
node reddit_bot.js

# 방법 3: 실행 스크립트 사용
chmod +x run_reddit_bot.sh
./run_reddit_bot.sh
```

## 📝 Discord 명령어

- `/reddit-analyze subreddit:서브레딧명` - Reddit 분석 실행
- `/reddit-help` - 봇 사용법 안내
- `/reddit-status` - 시스템 상태 확인

## 🎯 분석 예시

```
/reddit-analyze subreddit:Entrepreneur
/reddit-analyze subreddit:smallbusiness
/reddit-analyze subreddit:SaaS
```

## 🔧 설정

`.env` 파일에서 다음 설정을 확인하세요:

- `BOT_TOKEN`: Discord 봇 토큰
- `CLIENT_ID`: Discord 애플리케이션 ID
- `N8N_WEBHOOK_URL`: n8n 웹훅 URL

## 📊 분석 결과

분석 완료 후 Discord에서 다음 정보를 제공합니다:

- 비즈니스 점수 (1-10점)
- 솔루션 아이디어
- 타겟 시장
- 수익 모델
- MVP 기능 추천
- 구현 난이도
- 원본 Reddit 게시물 링크

## 🏗️ 시스템 구조

```
Discord Bot → n8n Webhook → Reddit API → AI Analysis → Discord Notification
```

## 📋 파일 구조

```
/Users/hyunjucho/Documents/GitHub/growsome/bot/
├── reddit_bot.js          # 메인 봇 코드
├── package.json           # npm 설정
├── .env                   # 환경 변수
├── run_reddit_bot.sh      # 실행 스크립트
└── README_reddit.md       # 이 파일
```
