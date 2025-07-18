# Growsome 블로그 시스템 설정 가이드

Prisma + GraphQL을 사용한 블로그 시스템이 성공적으로 구성되었습니다.

## 🚀 빠른 시작

### 1. 환경 설정

`.env` 파일에 데이터베이스 연결 정보가 설정되어 있는지 확인하세요:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### 2. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 스키마 푸시
npm run db:push

# 블로그 샘플 데이터 추가
npm run db:seed-blog
```

또는 한 번에:

```bash
# 데이터베이스 초기화 + 블로그 샘플 데이터 추가
npm run db:blog-fresh
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. GraphQL API 테스트

브라우저에서 다음 URL로 이동:
- **테스트 페이지**: http://localhost:3000/test-graphql
- **GraphQL Playground**: http://localhost:3000/api/graphql

## 📝 GraphQL API 사용법

### 기본 쿼리 예시

```graphql
# 블로그 컨텐츠 목록 조회
query GetContents {
  contents(first: 10, status: "PUBLISHED") {
    id
    title
    slug
    excerpt
    viewCount
    likeCount
    author {
      username
    }
    category {
      name
    }
    tags {
      name
    }
  }
}

# 특정 컨텐츠 조회
query GetContent {
  content(slug: "next-js-app-router-guide") {
    id
    title
    contentBody
    author {
      username
      avatar
    }
    category {
      name
    }
    comments {
      body
      user {
        username
      }
    }
  }
}

# 카테고리 목록 조회
query GetCategories {
  categories(isVisible: true) {
    id
    name
    slug
    contentCount
  }
}
```

### 뮤테이션 예시

```graphql
# 새 블로그 글 작성
mutation CreateContent {
  createContent(input: {
    title: "새로운 블로그 글"
    slug: "new-blog-post"
    contentBody: "# 새로운 블로그 글\n\n내용을 여기에 작성하세요."
    authorId: 1
    categoryId: 1
    status: "PUBLISHED"
    metaDescription: "새로운 블로그 글에 대한 설명"
    tags: ["React", "Next.js"]
  }) {
    id
    title
    slug
    status
  }
}

# 좋아요 토글
mutation ToggleLike {
  toggleLike(contentId: 1, userId: 1) {
    success
    isLiked
    likeCount
  }
}
```

## 🗂️ 데이터베이스 구조

### 주요 테이블

- **users**: 사용자 정보
- **blog_categories**: 블로그 카테고리
- **blog_contents**: 블로그 글
- **blog_tags**: 태그
- **blog_content_tags**: 글-태그 연결
- **blog_comments**: 댓글
- **blog_likes**: 좋아요

### 테이블 관계

```
users (1) -----> (N) blog_contents
blog_categories (1) -----> (N) blog_contents
blog_contents (1) -----> (N) blog_comments
blog_contents (1) -----> (N) blog_likes
blog_contents (N) <-----> (N) blog_tags (through blog_content_tags)
```

## 🔧 주요 기능

### ✅ 구현 완료

- **GraphQL API**: 타입 안전한 API 엔드포인트
- **Prisma ORM**: 데이터베이스 연동
- **CRUD 기능**: 생성, 조회, 수정, 삭제
- **관계형 데이터**: 작성자, 카테고리, 태그, 댓글, 좋아요
- **검색 및 필터링**: 카테고리별, 상태별 필터링
- **페이지네이션**: 컨텐츠 목록 페이징
- **조회수 카운팅**: 자동 조회수 증가
- **댓글 시스템**: 중첩 댓글 지원
- **좋아요 시스템**: 토글 기능

### 🚧 향후 추가 예정

- **인증/권한**: JWT 기반 사용자 인증
- **파일 업로드**: 이미지 업로드 기능
- **검색 기능**: 전문 검색
- **관리자 패널**: 컨텐츠 관리 UI
- **SEO 최적화**: 메타 태그, 사이트맵

## 📁 파일 구조

```
src/
├── app/
│   ├── api/
│   │   └── graphql/
│   │       └── route.ts          # GraphQL API 엔드포인트
│   └── test-graphql/
│       └── page.tsx               # GraphQL 테스트 페이지
├── lib/
│   └── graphql-client.ts          # GraphQL 클라이언트 & 타입 정의
├── graphql/                       # GraphQL 스키마 파일들
└── prisma/
    └── schema.prisma              # Prisma 데이터베이스 스키마

scripts/
└── seed-blog-data.ts              # 블로그 샘플 데이터 생성 스크립트
```

## 🎯 핵심 개선사항

### ✅ 해결된 문제들

1. **테이블명 불일치**: Prisma 모델명과 GraphQL 타입명 정확히 매핑
2. **Transform 함수**: DB 필드명을 GraphQL 필드명으로 변환
3. **타입 안전성**: TypeScript 인터페이스로 완전한 타입 정의
4. **에러 처리**: 상세한 에러 메시지와 로깅
5. **성능 최적화**: 효율적인 쿼리와 인덱싱

### 🔥 주요 특징

- **완전한 타입 안전성**: Prisma + GraphQL + TypeScript
- **유연한 관계형 쿼리**: 필요한 데이터만 선택적으로 조회
- **확장 가능한 구조**: 새로운 기능 추가 용이
- **개발자 친화적**: 명확한 스키마와 문서화

## 📞 문제 해결

### 자주 발생하는 문제

1. **GraphQL 연결 실패**
   ```bash
   # Prisma 클라이언트 재생성
   npm run db:generate
   ```

2. **데이터베이스 연결 오류**
   ```bash
   # 데이터베이스 상태 확인
   npm run db:status
   ```

3. **스키마 동기화 문제**
   ```bash
   # 스키마 강제 푸시
   npm run db:push -- --force-reset
   ```

### 로그 확인

개발 모드에서 GraphQL 쿼리와 Prisma 쿼리 로그를 확인할 수 있습니다:

```javascript
// 브라우저 개발자 도구 콘솔에서 확인 가능
console.log('GraphQL Operation:', operationName)
console.log('Prisma Query:', query)
```

## 🚀 배포 준비

1. **환경변수 설정**
   ```env
   DATABASE_URL="your_production_database_url"
   NODE_ENV="production"
   ```

2. **데이터베이스 마이그레이션**
   ```bash
   npm run db:deploy
   ```

3. **빌드**
   ```bash
   npm run build
   ```

---

## 🎉 완료!

이제 Prisma와 GraphQL을 사용한 강력한 블로그 시스템이 준비되었습니다. 
`http://localhost:3000/test-graphql`에서 모든 기능을 테스트해보세요!

문제가 발생하면 GraphQL 에러 메시지와 서버 로그를 확인하시고, 
필요시 `npm run db:blog-fresh` 명령어로 데이터베이스를 초기화해주세요.
