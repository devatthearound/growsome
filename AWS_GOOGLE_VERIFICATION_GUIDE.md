# 🔧 AWS 도메인 + Google Site Verification 완벽 설정 가이드

## ✅ 설정 완료 체크리스트

### 1. 로컬 환경 설정 ✅
- [x] .env.local에 인증 코드 추가
- [ ] 로컬 테스트 (`npm run dev`)
- [ ] SEO 점검 (`npm run seo:check`)
- [ ] 브라우저에서 메타태그 확인

### 2. AWS 환경 설정
선택하세요:

#### A. AWS Amplify 사용
- [ ] Amplify Console → Environment variables 설정
- [ ] GOOGLE_SITE_VERIFICATION 추가
- [ ] 재배포 실행
- [ ] 배포 완료 확인

#### B. AWS EC2 사용  
- [ ] EC2 서버 접속
- [ ] .env.local 파일 수정
- [ ] 애플리케이션 재시작
- [ ] 서비스 정상 동작 확인

#### C. Vercel/Netlify 사용
- [ ] 플랫폼 대시보드에서 환경변수 설정
- [ ] 자동 재배포 대기
- [ ] 배포 완료 확인

### 3. 프로덕션 확인
- [ ] https://growsome.kr 접속 가능
- [ ] F12 → Elements → head에서 메타태그 확인
- [ ] Google Search Console에서 인증 완료
- [ ] 사이트맵 제출 (https://growsome.kr/sitemap.xml)

## 🚀 즉시 실행 명령어

### 로컬 테스트
```bash
npm run dev
# 브라우저: http://localhost:3000
# F12 → Elements → 다음 태그 확인:
# <meta name="google-site-verification" content="Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc" />
```

### 프로덕션 확인
```bash
# 메타태그 확인
curl -s https://growsome.kr | grep "google-site-verification"

# 사이트맵 확인  
curl -s https://growsome.kr/sitemap.xml | head -20

# 로봇텍스트 확인
curl -s https://growsome.kr/robots.txt
```

## 🔧 AWS 환경변수 설정 상세

### Amplify 콘솔 설정
1. AWS Amplify Console 접속
2. 앱 선택
3. App settings → Environment variables
4. Add variable:
   - Key: `GOOGLE_SITE_VERIFICATION`
   - Value: `Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc`
5. Save → Redeploy

### EC2 서버 설정
```bash
# 서버 접속
ssh -i your-key.pem ubuntu@your-server

# 프로젝트 디렉토리
cd /path/to/growsome

# 환경변수 수정
echo 'GOOGLE_SITE_VERIFICATION=Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc' >> .env.local

# 서비스 재시작
pm2 restart all  # 또는 docker-compose restart
```

## 📊 Google Search Console 최종 설정

### 1. 인증 완료 후 할 일
1. **사이트맵 제출**:
   - URL: `https://growsome.kr/sitemap.xml`
   - Sitemaps 메뉴에서 추가

2. **URL 검사**:
   - 주요 페이지들 인덱싱 요청
   - https://growsome.kr
   - https://growsome.kr/blog

3. **성능 모니터링**:
   - Search Performance 메뉴 확인
   - Core Web Vitals 점검

### 2. 예상 효과
- ✅ **빠른 인덱싱**: 새 콘텐츠 24시간 내 검색 노출
- ✅ **상세 분석**: 검색 키워드, 클릭률, 순위 데이터
- ✅ **문제 감지**: 크롤링 오류, 모바일 이슈 자동 알림
- ✅ **성능 추적**: Core Web Vitals, 페이지 경험 점수

---

## 🆘 문제 해결

### 인증 실패 시
1. **캐시 문제**: 브라우저 새로고침 (Ctrl+F5)
2. **배포 확인**: 실제 서버에 변경사항 반영되었는지 확인
3. **메타태그 확인**: view-source:https://growsome.kr에서 직접 확인

### AWS 배포 문제 시
1. **환경변수 확인**: AWS 콘솔에서 정확히 설정되었는지 점검
2. **재배포**: 환경변수 변경 후 반드시 재배포 실행
3. **로그 확인**: CloudWatch 또는 서버 로그에서 오류 메시지 점검

---

**설정 완료 후 Google Search Console에서 "소유권 확인됨" 메시지가 나오면 성공입니다!** 🎉
