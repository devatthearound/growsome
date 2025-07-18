# 🔧 블로그 글 작성 오류 해결 가이드

## 문제 상황
**Foreign key constraint violated**: `blog_contents_author_id_fkey`

사용자 ID가 데이터베이스에 존재하지 않아서 발생하는 오류입니다.

## 해결 방법

### 방법 1: 시드 데이터 생성 (권장)

```bash
# 터미널에서 실행
npm run db:seed-blog
```

이 명령어가 성공하면 테스트 사용자와 카테고리가 생성됩니다.

### 방법 2: 수동으로 사용자 생성

만약 시드 스크립트가 작동하지 않는다면, 다음 SQL을 직접 실행:

```sql
-- 기본 사용자 생성
INSERT INTO users (email, username, password, company_name, position, phone_number, status, created_at, updated_at)
VALUES ('admin@growsome.co.kr', 'Growsome 관리자', 'password123', 'Growsome', 'Admin', '010-1234-5678', 'active', NOW(), NOW());

-- 기본 카테고리 생성
INSERT INTO blog_categories (slug, name, description, is_visible, sort_order, created_at, updated_at)
VALUES ('general', '일반', '일반적인 블로그 글', true, 0, NOW(), NOW());
```

### 방법 3: 코드 수정 (임시 해결)

현재 로그인된 사용자가 있다면 그 사용자의 ID를 사용하도록 수정:

1. `/write` 페이지에서 실제 로그인된 사용자 ID 사용
2. 또는 기본 사용자 자동 생성

## 확인 방법

### 1. 데이터베이스 확인
```bash
# Prisma Studio로 데이터 확인
npm run db:studio
```

브라우저에서 http://localhost:5555 접속하여 `users` 테이블과 `blog_categories` 테이블에 데이터가 있는지 확인

### 2. GraphQL 쿼리로 확인
http://localhost:3000/api/graphql 접속하여 다음 쿼리 실행:

```graphql
query {
  users {
    id
    username
    email
  }
  categories {
    id
    name
    slug
  }
}
```

## 임시 해결책

현재 상황에서 빠르게 테스트하려면 다음 단계를 따르세요:

1. **시드 스크립트 실행**:
```bash
npm run db:seed-blog
```

2. **로그인 확인**:
- http://localhost:3000/login 접속
- 이메일: `admin@growsome.co.kr`
- 비밀번호: `password123`

3. **글 작성 테스트**:
- http://localhost:3000/write 접속
- 제목과 내용 입력 후 저장

## 완전한 해결을 위한 코드 수정

인증된 사용자의 실제 ID를 사용하도록 `/write` 페이지 수정이 필요합니다. 현재는 하드코딩된 `authorId: 1`을 사용하고 있습니다.

```typescript
// AuthContext에서 현재 사용자 정보 가져오기
const { user } = useAuth();

// savePost 함수에서
const inputData: any = {
  // ...
  authorId: user?.id || 1, // 로그인된 사용자 ID 사용
  // ...
};
```

## 성공 확인

위 방법들 중 하나를 실행한 후:

1. 글 작성 페이지에서 오류 없이 저장 가능
2. http://localhost:3000/blog 에서 작성한 글 확인 가능
3. 개발자 도구 콘솔에 `Foreign key constraint` 오류 없음

---

가장 간단한 해결책은 **`npm run db:seed-blog`** 실행입니다! 🎯