# 🔧 AWS Route 53 + Growsome SEO 배포 가이드

## 현재 상황
- ✅ Route 53에서 growsome.kr 도메인 관리 중
- ✅ ALB (Application Load Balancer) 사용
- ✅ 로컬 환경변수 설정 완료
- ⏳ 프로덕션 서버 배포 대기

## 🚀 배포 단계별 가이드

### 1. 현재 서버 접속 방법 확인
```bash
# 서버 상태 확인
curl -I https://growsome.kr

# 서버 정보 확인
nslookup growsome.kr
```

### 2. 배포 방식별 설정

#### A. EC2 직접 배포 (가장 일반적)
```bash
# 1. EC2 서버 접속
ssh -i your-key.pem ubuntu@43.200.174.22

# 2. 프로젝트 디렉토리로 이동
cd /home/ubuntu/growsome
# 또는
cd /var/www/growsome

# 3. 환경변수 파일 수정
nano .env.local
# 또는
vim .env.local

# 4. 다음 라인 추가/수정
GOOGLE_SITE_VERIFICATION=Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc

# 5. 애플리케이션 재시작
pm2 restart all
# 또는
npm run build && npm run start
# 또는
docker-compose restart
```

#### B. Docker 사용하는 경우
```bash
# 1. docker-compose.yml 환경변수 추가
environment:
  - GOOGLE_SITE_VERIFICATION=Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc

# 2. 컨테이너 재시작
docker-compose down && docker-compose up -d
```

#### C. CI/CD 파이프라인 사용
```bash
# GitHub Actions, CodePipeline 등에서 환경변수 설정
GOOGLE_SITE_VERIFICATION=Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc
```

### 3. 배포 완료 후 확인

#### 즉시 확인 명령어
```bash
# 1. 메타태그 확인
curl -s https://growsome.kr | grep "google-site-verification"

# 2. SEO 엔드포인트 확인
curl -s https://growsome.kr/sitemap.xml | head -10
curl -s https://growsome.kr/robots.txt

# 3. OG 이미지 API 확인
curl -I "https://growsome.kr/api/og/blog?title=테스트"
```

#### 브라우저 확인
1. https://growsome.kr 접속
2. F12 → Elements → head 태그에서 확인:
```html
<meta name="google-site-verification" content="Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc" />
```

### 4. Google Search Console 인증

#### 인증 완료 단계
1. [Google Search Console](https://search.google.com/search-console) 접속
2. growsome.kr 속성 선택
3. **확인** 버튼 클릭
4. "소유권이 확인되었습니다" 메시지 확인

#### 사이트맵 제출
1. Sitemaps 메뉴 클릭
2. 새 사이트맵 추가: `https://growsome.kr/sitemap.xml`
3. 제출 클릭
4. "성공" 상태 확인

## 🔧 문제 해결

### 배포 후 메타태그가 안 보이는 경우
```bash
# 1. 서버 재시작 확인
sudo systemctl status nginx  # nginx 사용하는 경우
pm2 status  # PM2 사용하는 경우

# 2. 캐시 클리어
# CloudFront 사용하는 경우 캐시 무효화
# nginx 사용하는 경우 캐시 클리어

# 3. 환경변수 확인
echo $GOOGLE_SITE_VERIFICATION
```

### ALB/CloudFront 캐시 이슈
```bash
# CloudFront 캐시 무효화 (AWS CLI)
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

# ALB 헬스체크 확인
# Target Group에서 healthy 상태 확인
```

## 📊 성공 지표

### ✅ 배포 성공 체크리스트
- [ ] curl로 메타태그 확인됨
- [ ] 브라우저에서 메타태그 보임
- [ ] Google Search Console 인증 성공
- [ ] 사이트맵 제출 완료
- [ ] robots.txt 접근 가능
- [ ] OG 이미지 API 작동

### 📈 SEO 성과 예상
- **24시간 내**: Google 인덱싱 시작
- **1주일 내**: 검색 결과 노출 시작  
- **1개월 내**: 검색 트래픽 증가 확인

---

## 🆘 즉시 도움 요청

현재 서버 접속 방법을 모르시는 경우:

1. **서버 관리자에게 문의**: 환경변수 추가 요청
2. **DevOps 팀에게 전달**: 이 가이드 문서 공유
3. **임시 테스트**: 로컬에서 npm run dev로 기능 확인

**배포 방식을 알려주시면 더 구체적인 가이드를 제공할 수 있습니다!**
