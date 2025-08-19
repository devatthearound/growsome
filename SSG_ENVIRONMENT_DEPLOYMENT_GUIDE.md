# 🔧 Growsome SSG 환경변수 배포 가이드

## 📊 현재 상황 분석
- ✅ Next.js SSG(정적 사이트 생성) 사용 중
- ✅ 강력한 캐시 설정 (1년)
- ⚠️ 환경변수 변경 후 재빌드 필요
- ⚠️ 메타태그 아직 프로덕션에 반영 안됨

## 🚀 해결 방법

### A. Vercel 배포 (가장 가능성 높음)

#### 1. Vercel Dashboard 접속
1. https://vercel.com 로그인
2. growsome 프로젝트 선택
3. Settings → Environment Variables

#### 2. 환경변수 추가
```bash
# 키-값 쌍 추가
Key: GOOGLE_SITE_VERIFICATION
Value: Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc
Environment: Production, Preview, Development
```

#### 3. 재배포 트리거
- **방법 1**: Git에 커밋 푸시
- **방법 2**: Vercel Dashboard에서 "Redeploy" 클릭

### B. Netlify 배포

#### 1. Netlify Dashboard
1. https://app.netlify.com 로그인
2. growsome 사이트 선택
3. Site settings → Environment variables

#### 2. 환경변수 추가 및 재배포
```bash
GOOGLE_SITE_VERIFICATION = Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc
```

### C. AWS 직접 배포

#### 1. 서버 접속 후 재빌드
```bash
# 서버 접속
ssh -i your-key.pem ubuntu@your-server

# 프로젝트 디렉토리
cd /path/to/growsome

# 환경변수 추가
echo 'GOOGLE_SITE_VERIFICATION=Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc' >> .env.local

# 재빌드 (중요!)
npm run build

# 서비스 재시작
pm2 restart all
```

### D. GitHub Actions CI/CD

#### 1. GitHub Repository Secrets
1. GitHub → Repository → Settings → Secrets and variables → Actions
2. New repository secret:
```bash
Name: GOOGLE_SITE_VERIFICATION
Value: Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc
```

#### 2. 워크플로우 파일 확인
`.github/workflows/deploy.yml`에서 환경변수 사용 확인

## 🔍 즉시 테스트 방법

### 로컬 테스트 (재빌드 시뮬레이션)
```bash
# 1. 환경변수 적용된 빌드
npm run build

# 2. 프로덕션 모드 실행
npm run start

# 3. 새 터미널에서 확인
curl -s http://localhost:3000 | grep "google-site-verification"

# 기대 결과:
# <meta name="google-site-verification" content="Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc"/>
```

### 배포 후 캐시 우회 확인
```bash
# 캐시 우회하여 확인
curl -s "https://growsome.kr?cache-bust=$(date +%s)" | grep "google-site-verification"

# 또는 브라우저에서 Ctrl+Shift+R (하드 리프레시)
```

## ⚡ 빠른 해결 순서

### 1. 즉시 확인 (5분)
```bash
# 로컬에서 테스트
npm run build && npm run start
# 새 터미널: curl -s http://localhost:3000 | grep "google-site-verification"
```

### 2. 배포 플랫폼 식별 (5분)
다음 중 어디서 배포하고 계신지 확인:
- [ ] Vercel (vercel.com)
- [ ] Netlify (netlify.com)  
- [ ] AWS Amplify
- [ ] 직접 서버 관리
- [ ] GitHub Pages
- [ ] 기타 클라우드 서비스

### 3. 환경변수 설정 (10분)
배포 플랫폼에서 환경변수 추가

### 4. 재배포 실행 (5-15분)
자동 배포 또는 수동 재배포

### 5. 결과 확인 (5분)
```bash
curl -s https://growsome.kr | grep "google-site-verification"
```

## 🎯 성공 지표

### ✅ 성공 시 나타날 결과
```bash
# 명령어 실행
curl -s https://growsome.kr | grep "google-site-verification"

# 기대 출력
<meta name="google-site-verification" content="Mbj7I_kpnhGQluMctu-sd0qEW437g-_7YwjeZWRrvcc"/>
```

### 🔄 캐시 때문에 안 보이는 경우
1. **시간 대기**: 배포 후 5-10분 대기
2. **하드 리프레시**: Ctrl+Shift+R
3. **캐시 무효화**: 플랫폼별 캐시 클리어
4. **시크릿 모드**: 브라우저 시크릿 창에서 확인

---

## 🆘 문제 해결

### 배포 플랫폼을 모르는 경우
```bash
# DNS 정보로 추측
nslookup growsome.kr

# Vercel: *.vercel-dns.com
# Netlify: *.netlify.app
# Cloudflare: *.cloudflare.com
# AWS: *.amazonaws.com
```

### 재배포가 안 되는 경우
1. **Git 커밋 푸시**: 변경사항을 Git에 커밋 후 푸시
2. **수동 트리거**: 대시보드에서 수동 배포 실행
3. **캐시 클리어**: CDN/캐시 무효화

---

**배포 플랫폼만 알려주시면 정확한 단계별 가이드를 드리겠습니다!** 🚀

먼저 로컬에서 `npm run build && npm run start` 후 메타태그가 나오는지 확인해보세요.
