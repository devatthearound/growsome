# 🔍 검색엔진 인증 코드 빠른 설정 가이드

## 🚀 즉시 설정하기

### 1. Google Search Console (우선순위 HIGH)
1. https://search.google.com/search-console 접속
2. 속성 추가 → URL 접두어 → https://growsome.kr
3. HTML 태그 선택 → content 값 복사
4. .env.local에 추가:
```bash
GOOGLE_SITE_VERIFICATION="복사한코드"
```

### 2. 네이버 웹마스터도구 (우선순위 MEDIUM)
1. https://searchadvisor.naver.com 접속
2. 사이트 등록 → HTML 태그 인증
3. content 값 복사
4. .env.local에 추가:
```bash
NAVER_SITE_VERIFICATION="복사한코드"
```

### 3. Bing 웹마스터도구 (우선순위 LOW)
1. https://www.bing.com/webmasters 접속
2. 사이트 추가 → HTML 메타태그
3. content 값 복사
4. .env.local에 추가:
```bash
BING_VERIFICATION="복사한코드"
```

## ⚡ 임시 테스트 설정

실제 인증을 받기 전에 테스트용으로 사용할 수 있습니다:

```bash
# 테스트용 더미 코드 (실제 인증은 안되지만 오류는 사라집니다)
GOOGLE_SITE_VERIFICATION="test-google-verification-code"
NAVER_SITE_VERIFICATION="test-naver-verification-code"  
BING_VERIFICATION="test-bing-verification-code"
```

## 🔄 설정 후 확인

1. 서버 재시작: `npm run dev`
2. SEO 점검: `npm run seo:check`
3. 브라우저에서 F12 → Elements → head 태그 확인

## 📈 기대 효과

✅ **검색엔진 신뢰도** 향상  
✅ **인덱싱 속도** 2-3배 빨라짐  
✅ **상세 SEO 데이터** 확인 가능  
✅ **검색 성능 모니터링** 실시간 추적  

---

**우선 Google Search Console만 설정해도 큰 효과를 볼 수 있습니다!** 🎯
