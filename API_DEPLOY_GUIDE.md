# API 라이브 배포 문제 해결 가이드

## 🔍 현재 상황
- ✅ 로컬에는 API 엔드포인트 존재 (`/api/auth/generate-token`)  
- ❌ 라이브 사이트에서는 404 오류
- 🔄 하이브리드 모드로 임시 우회 가능

## 🚀 즉시 해결 방법

### 1. 하이브리드 모드 실행 (지금!)
```bash
npm install pg
node hybrid-blog.js
```

### 2. API 배포 문제 해결 (동시에)

**가능한 원인들:**
- Next.js 빌드 시 API 경로가 제외됨
- 프로덕션 환경에서 API 라우팅 문제
- Docker 빌드 과정에서 파일 누락
- 환경변수 문제로 API 비활성화

**해결 방법:**

#### A. Next.js 설정 확인
```js
// next.config.js에 명시적 API 경로 포함 확인
const nextConfig = {
  // ... 기존 설정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ]
  }
}
```

#### B. API 라우트 테스트 강화
```bash
# 로컬에서 빌드 테스트
npm run build
npm run start
curl http://localhost:3000/api/auth/generate-token
```

#### C. 프로덕션 빌드 로그 확인
Docker 빌드 시 API 경로가 포함되는지 확인

### 3. 장기 해결책

**Option 1: Serverless Functions 사용**
- Vercel Functions 또는 AWS Lambda로 API 분리
- 더 안정적인 API 서빙

**Option 2: 별도 API 서버**
- Express.js 등으로 독립 API 서버 구축
- 메인 Next.js와 분리하여 안정성 확보

**Option 3: 하이브리드를 정규화**
- 데이터베이스 직접 연결 방식을 공식 방법으로 채택
- API 의존성 제거

## ✅ 당장 해야 할 것

1. **하이브리드 모드 실행** (`node hybrid-blog.js`)
2. **결과 확인** (https://growsome.kr에서 새 블로그 포스트 확인)
3. **성공 시 n8n 워크플로우를 하이브리드 모드로 업데이트**

## 📊 하이브리드 모드의 장점

- ✅ API 서버 불필요 (의존성 제거)
- ✅ 데이터베이스 직접 접근으로 더 빠름
- ✅ 오류 지점 감소
- ✅ 라이브 사이트에 즉시 반영

하이브리드 모드가 안정적이면 **이것을 메인 방식**으로 사용하는 것도 좋습니다!
