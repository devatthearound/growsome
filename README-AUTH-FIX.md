# 그로우썸 인증 시스템 문제 해결 가이드

## 🔍 발견된 문제들

1. **AuthContext 임시 수정**: 실제 API 호출이 제거되고 더미 데이터로 교체됨
2. **DB 연결 이슈**: PostgreSQL 연결과 관련된 문제
3. **토큰 갱신 로직**: 쿠파스와 그로우썸 간 일부 불일치

## 🔧 수정 사항

### 1. AuthContext 복원
- 실제 API 호출로 인증 상태 확인
- 토큰 갱신 메커니즘 추가
- 에러 처리 개선

### 2. API 엔드포인트 수정
- `/api/auth/check`: 인증 상태 확인 API
- `/api/auth/refresh`: 토큰 갱신 API
- DB 연결 이슈 임시 우회 (토큰 기반 인증)

### 3. 임시 해결책
DB 연결 문제로 인해 임시로 토큰 정보만으로 사용자 인증을 처리하도록 수정

## 🚀 테스트 방법

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 인증 테스트 페이지 접속
```
http://localhost:3000/test-auth
```

### 3. 테스트 시나리오
1. **인증 API 테스트**: 현재 인증 상태 확인
2. **토큰 갱신 테스트**: 토큰 갱신 기능 확인
3. **로그인 API 테스트**: 로그인 기능 확인

## 📁 수정된 파일들

```
src/
├── app/
│   ├── contexts/
│   │   └── AuthContext.tsx           # ✅ 복원됨
│   ├── api/
│   │   └── auth/
│   │       ├── check/
│   │       │   └── route.ts          # ✅ 새로 생성
│   │       └── refresh/
│   │           └── route.ts          # ✅ 수정됨
│   └── test-auth/
│       └── page.tsx                  # ✅ 새로 생성 (테스트용)
└── lib/
    └── auth.ts                       # ✅ 수정됨
```

## ⚠️ 현재 제한사항

### 임시 해결책
- DB 연결 이슈로 인해 PostgreSQL 쿼리를 건너뛰고 토큰 정보만 사용
- 사용자 상세 정보 (company_name, position 등)는 임시로 null 반환

### 장기 해결 방안
1. **DB 연결 문제 해결**
   ```bash
   # DB 연결 테스트
   npm run db:status
   ```

2. **사용자 정보 완전 복원**
   - `src/app/api/auth/check/route.ts`에서 주석 처리된 DB 쿼리 복원
   - PostgreSQL 연결 안정화 후 적용

## 🔧 문제 해결 단계

### 1단계: 즉시 해결 (완료)
- [x] AuthContext 복원
- [x] 기본 인증 API 동작
- [x] 토큰 갱신 메커니즘

### 2단계: DB 연결 해결 (진행 중)
- [ ] PostgreSQL 연결 상태 확인
- [ ] DB 쿼리 복원
- [ ] 사용자 정보 완전 복원

### 3단계: 최적화 (예정)
- [ ] 에러 처리 개선
- [ ] 로그인 UI/UX 개선
- [ ] 세션 관리 최적화

## 🔍 디버깅 도구

### 1. 브라우저 개발자 도구
- **쿠키 확인**: Application > Cookies
- **네트워크 탭**: API 호출 상태 확인
- **콘솔**: 에러 메시지 확인

### 2. 서버 로그
```bash
# 개발 서버 로그 확인
npm run dev

# 인증 관련 로그 확인
# 콘솔에서 "토큰 갱신", "인증 체크" 등의 메시지 확인
```

### 3. API 직접 테스트
```bash
# 인증 상태 확인
curl -b "coupas_access_token=your_token" http://localhost:3000/api/auth/check

# 토큰 갱신
curl -X POST -b "coupas_refresh_token=your_token" http://localhost:3000/api/auth/refresh
```

## 📞 문제 해결

### 자주 발생하는 문제

1. **"인증되지 않은 사용자" 에러**
   - 쿠키 확인: `coupas_access_token`, `coupas_refresh_token`
   - 토큰 만료 시 갱신 시도

2. **DB 연결 에러**
   - 환경변수 확인: `DATABASE_URL`
   - PostgreSQL 서버 상태 확인

3. **토큰 갱신 실패**
   - JWT_SECRET 환경변수 확인
   - 쿠키 설정 확인 (httpOnly, secure, sameSite)

### 긴급 복구 방법

만약 인증 시스템이 완전히 작동하지 않는 경우:

1. **임시 우회 모드**
   ```typescript
   // AuthContext.tsx에서 임시로 사용
   setUser({
     id: '1',
     email: 'admin@growsome.com',
     username: 'admin',
     // ... 기타 필드
   });
   ```

2. **쿠키 초기화**
   ```javascript
   // 브라우저 콘솔에서 실행
   document.cookie = "coupas_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   document.cookie = "coupas_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   ```

## 🎯 다음 단계

1. **http://localhost:3000/test-auth** 에서 현재 상태 확인
2. DB 연결 문제 해결 후 완전한 사용자 정보 복원
3. 쿠파스와 그로우썸 간 인증 시스템 동기화 확인

## 🔄 쿠파스 연동 확인

### 토큰 이름 통일
- 그로우썸: `coupas_access_token`, `coupas_refresh_token`
- 쿠파스: `coupas_access_token`, `coupas_refresh_token`
- ✅ **일치함** - 동일한 쿠키명 사용

### JWT 비밀키 확인
```bash
# .env 파일에서 확인
JWT_SECRET='2d25633b8e2543b9a347c28713c92b5f7c7c3d8a1e4f5b2c9d8e7f6a5b4c3d2e1f9g8h7i6j5k4l3m2n1o0p9q8r7s6t5u4v3w2x1y0z'
```

### 크로스 도메인 이슈
일렉트론 앱(쿠파스)에서 웹 앱(그로우썸)으로 인증 정보 전달 시:
- 동일한 쿠키 도메인 사용 필요
- CORS 설정 확인 필요

---

**⚡ 현재 상태**: 기본 인증 기능 복원 완료, DB 연결 이슈 해결 대기  
**🔄 마지막 업데이트**: 2025년 7월 12일

## 🚨 즉시 테스트해야 할 항목

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **인증 테스트 페이지 접속**
   ```
   http://localhost:3000/test-auth
   ```

3. **현재 상태 확인**
   - 로그인 상태 표시
   - 쿠키 정보 확인
   - API 응답 테스트

4. **GraphQL + 블로그 테스트**
   ```
   http://localhost:3000/test-graphql
   ```

문제가 지속되면 브라우저 개발자 도구의 콘솔과 네트워크 탭에서 구체적인 에러 메시지를 확인해주세요.
