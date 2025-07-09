# Prisma 간단 가이드

## 🚀 모델 추가/수정 후 필수 명령어

### 1. Prisma 클라이언트 재생성
```bash
npm run db:generate
```

### 2. 데이터베이스에 적용
```bash
# 마이그레이션 생성
npm run db:migrate
```

## 📝 사용 예시

### 새 모델 추가 시
1. `prisma/schema.prisma`에 모델 작성
2. `npm run db:generate`
3. `npm run db:migrate`

### 기존 모델 수정 시
1. `prisma/schema.prisma`에서 모델 수정
2. `npm run db:generate`
3. `npm run db:migrate`

## 🛠️ 유용한 명령어

```bash
npm run db:studio    # 데이터베이스 GUI (http://localhost:5555)
npm run db:status    # 마이그레이션 상태 확인
npm run db:reset     # 개발환경 DB 초기화 (주의!)
```