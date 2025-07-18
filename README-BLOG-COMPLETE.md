# Growsome 블로그 시스템 설정 가이드

## 📝 개요

Growsome 블로그는 GraphQL + Prisma + Next.js로 구축된 현대적인 블로그 시스템입니다.

## 🛠 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Apollo Server, GraphQL
- **Database**: PostgreSQL, Prisma ORM
- **Styling**: Styled Components, Tailwind CSS
- **Editor**: Tiptap (WYSIWYG Editor)

## 🚀 빠른 시작

### 1. 데이터베이스 초기화 및 시드 데이터 생성

```bash
# 데이터베이스 스키마 적용
npm run db:push

# 블로그 시드 데이터 생성
npm run db:seed-blog
```

### 2. 개발 서버 시작

```bash
npm run dev
```

### 3. 블로그 확인

- **블로그 메인페이지**: http://localhost:3000/blog
- **홈페이지 블로그 섹션**: http://localhost:3000 (메인 페이지 하단)
- **GraphQL Playground**: http://localhost:3000/api/graphql

## 📚 주요 기능

### ✅ 구현 완료된 기능

- [x] 블로그 글 목록 조회
- [x] 블로그 글 상세 보기
- [x] 카테고리별 필터링
- [x] 추천글 표시
- [x] 히어로 섹션
- [x] 태그 시스템
- [x] 댓글 시스템 (UI)
- [x] 좋아요 기능 (UI)
- [x] 조회수 카운트
- [x] SEO 메타태그
- [x] 반응형 디자인
- [x] 로딩 스켈레톤
- [x] 홈페이지 블로그 섹션

### 🔧 관리자 기능

- [x] 블로그 글 작성/수정
- [x] WYSIWYG 에디터 (Tiptap)
- [x] 이미지 업로드 (UI)
- [x] 카테고리 관리
- [x] 태그 관리
- [x] 발행 상태 관리
- [x] SEO 설정

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── blog/                    # 블로그 라우트
│   │   ├── [slug]/             # 블로그 글 상세 페이지
│   │   ├── write/              # 블로그 글 작성 페이지
│   │   └── page.tsx            # 블로그 메인 페이지
│   ├── api/graphql/            # GraphQL API
│   └── components/
│       └── home/Blog.tsx       # 홈페이지 블로그 섹션
├── components/
│   ├── blog/                   # 블로그 관련 컴포넌트
│   └── editor/                 # 에디터 컴포넌트
├── lib/
│   └── graphql-client.ts       # GraphQL 클라이언트
├── hooks/
│   └── use-blog.ts            # 블로그 관련 훅
└── prisma/
    └── schema.prisma          # 데이터베이스 스키마
```

## 🎯 GraphQL API

### 주요 쿼리

```graphql
# 블로그 글 목록 조회
query GetContents($first: Int, $categoryId: Int, $status: String) {
  contents(first: $first, categoryId: $categoryId, status: $status) {
    id
    slug
    title
    excerpt
    thumbnailUrl
    author { username avatar }
    category { name slug }
    tags { name slug }
    viewCount
    likeCount
    commentCount
    publishedAt
  }
}

# 블로그 글 상세 조회
query GetContent($slug: String!) {
  content(slug: $slug) {
    id
    title
    contentBody
    # ... 기타 필드
    comments {
      id
      body
      user { username avatar }
      replies { # ... }
    }
  }
}

# 카테고리 목록 조회
query GetCategories($isVisible: Boolean) {
  categories(isVisible: $isVisible) {
    id
    slug
    name
    description
    contentCount
  }
}
```

### 주요 뮤테이션

```graphql
# 블로그 글 생성
mutation CreateContent($input: CreateContentInput!) {
  createContent(input: $input) {
    id
    slug
    title
    # ... 기타 필드
  }
}

# 댓글 생성
mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    body
    user { username }
  }
}

# 좋아요 토글
mutation ToggleLike($contentId: Int!, $userId: Int!) {
  toggleLike(contentId: $contentId, userId: $userId) {
    success
    isLiked
    likeCount
  }
}
```

## 🗄 데이터베이스 스키마

### 주요 테이블

- **users**: 사용자 정보
- **blog_categories**: 블로그 카테고리
- **blog_contents**: 블로그 글
- **blog_tags**: 태그
- **blog_content_tags**: 글-태그 연결
- **blog_comments**: 댓글
- **blog_likes**: 좋아요

## 🎨 디자인 특징

- **모던 UI**: 깔끔하고 현대적인 디자인
- **반응형**: 모바일, 태블릿, 데스크톱 지원
- **다크모드 준비**: 스타일 시스템 구축
- **애니메이션**: Framer Motion 활용
- **로딩 UX**: 스켈레톤 로딩 적용

## 📱 모바일 최적화

- 터치 친화적 UI
- 모바일 네비게이션
- 이미지 최적화
- 빠른 로딩 속도

## 🔧 개발 명령어

```bash
# 데이터베이스 관련
npm run db:push          # 스키마 푸시
npm run db:migrate       # 마이그레이션 실행
npm run db:studio        # Prisma Studio 열기
npm run db:seed-blog     # 블로그 시드 데이터 생성
npm run db:blog-fresh    # 데이터베이스 리셋 + 블로그 시드

# 개발
npm run dev              # 개발 서버 시작
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버 시작
```

## 🚧 향후 개선 계획

### 인증 시스템
- [ ] 로그인 기능 통합
- [ ] 사용자별 댓글 작성
- [ ] 관리자 권한 관리

### 고급 기능
- [ ] 검색 기능
- [ ] 관련 글 추천
- [ ] 태그 기반 필터링
- [ ] RSS 피드
- [ ] 사이트맵

### 성능 최적화
- [ ] 이미지 최적화
- [ ] 무한 스크롤
- [ ] 캐싱 전략
- [ ] CDN 연동

### SEO 강화
- [ ] 메타태그 완성
- [ ] 구조화된 데이터
- [ ] 오픈그래프 최적화

## 🤝 기여하기

1. 기능 개발 시 해당 브랜치 생성
2. GraphQL 스키마 변경 시 타입 재생성 필요
3. 데이터베이스 변경 시 마이그레이션 생성

## 📞 문의

블로그 시스템 관련 문의사항이 있으시면 개발팀에 연락 주세요.

---

**Growsome Blog System v1.0** - Built with ❤️ by Growsome Team