# 그로우썸 블로그 자동 발행 Cron 설정 가이드

## 🔄 기존 설정 교체하기

### 1. 현재 cron 설정 확인
```bash
crontab -l
```

### 2. cron 편집기 열기
```bash
crontab -e
```

### 3. 기존 Python 봇 설정 삭제/주석 처리
기존에 있는 Python 관련 설정들을 찾아서 앞에 # 을 붙여 주석 처리하세요.

### 4. 새로운 SEO 최적화 블로그 설정 추가

#### A. 매일 오전 8시 자동 발행 (추천)
```bash
0 8 * * * /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.sh
```

#### B. 매일 오전 8시, 오후 2시 (2회 발행)
```bash
0 8,14 * * * /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.sh
```

#### C. 주중(월~금) 오전 8시만 발행
```bash
0 8 * * 1-5 /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.sh
```

## 🚀 설정 적용하기

### 1. 스크립트 실행 권한 부여
```bash
chmod +x /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.sh
```

### 2. 수동 테스트 실행
```bash
/Users/hyunjucho/Documents/GitHub/growsome/auto-blog.sh
```

### 3. 로그 확인
```bash
tail -f /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.log
```

## 📊 시스템별 특징

| 시스템 | 파일명 | 특징 | 추천도 |
|--------|--------|------|--------|
| **SEO 최적화** | `seo-blog.js` | 검색엔진 최적화, 키워드 분석 | ⭐⭐⭐⭐⭐ |
| 가독성 최적화 | `readable-blog.js` | 읽기 쉬운 구조화 | ⭐⭐⭐⭐ |
| 다중 AI | `multi-ai-blog.js` | Claude+OpenAI 안정성 | ⭐⭐⭐ |
| 기존 시스템 | `hybrid-blog.js` | 기본 기능 | ⭐⭐ |

## 🎯 권장 설정

**8시 자동 발행용으로는 `seo-blog.js` 사용을 강력 추천**합니다!

이유:
- ✅ SEO 최적화로 검색 트래픽 증가
- ✅ 구조화된 콘텐츠로 가독성 향상  
- ✅ 다중 AI로 안정성 보장
- ✅ 그로우썸 서비스 자연스러운 연결

## 🔧 문제 해결

### cron이 실행되지 않을 때
```bash
# cron 서비스 상태 확인
sudo launchctl list | grep cron

# cron 재시작 (필요시)
sudo launchctl stop com.vix.cron
sudo launchctl start com.vix.cron
```

### Node.js 경로 문제
```bash
# Node.js 경로 확인
which node

# 스크립트에 정확한 경로 추가
/usr/local/bin/node seo-blog.js
```

## 📝 로그 모니터링

```bash
# 실시간 로그 확인
tail -f /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.log

# 최근 10번의 실행 결과
tail -20 /Users/hyunjucho/Documents/GitHub/growsome/auto-blog.log
```