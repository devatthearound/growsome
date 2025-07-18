# Growsome Blog System

Prisma + GraphQL + Tiptap을 활용한 모던 블로그 시스템입니다.

## 🚀 주요 기능

- **📝 Tiptap 에디터**: 풍부한 텍스트 편집 기능
- **🔧 GraphQL API**: 효율적인 데이터 쿼리
- **🗄️ Prisma ORM**: 타입 안전한 데이터베이스 접근
- **📱 반응형 디자인**: 모바일 친화적 UI
- **🔍 SEO 최적화**: 메타 태그 및 구조화된 데이터
- **🏷️ 카테고리 및 태그**: 효율적인 콘텐츠 분류
- **👤 사용자 관리**: 작성자 정보 및 권한 관리

## 🛠️ 기술 스택

### Frontend
- **Next.js 15**: React 프레임워크
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Tiptap**: 리치 텍스트 에디터
- **Lucide React**: 아이콘 라이브러리

### Backend
- **GraphQL**: API 쿼리 언어
- **Apollo Server**: GraphQL 서버
- **Prisma**: 데이터베이스 ORM
- **PostgreSQL**: 메인 데이터베이스

### DevOps
- **Vercel**: 배포 플랫폼
- **GitHub Actions**: CI/CD

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── blog/                 # 블로그 관련 페이지
│   │   ├── [slug]/          # 개별 포스트 페이지
│   │   ├── write/           # 포스트 작성 페이지
│   │   └── edit/[id]/       # 포스트 편집 페이지
│   └── api/
│       └── graphql/         # GraphQL API 엔드포인트
├── components/
│   ├── blog/                # 블로그 컴포넌트
│   │   ├── blog-list.tsx    # 포스트 목록
│   │   ├── blog-detail.tsx  # 포스트 상세
│   │   └── blog-writer.tsx  # 포스트 에디터
│   └── editor/
│       └── tiptap-editor.tsx # Tiptap 에디터
├── hooks/
│   └── use-blog.ts          # 블로그 관련 훅
├── lib/
│   └── graphql-client.ts    # GraphQL 클라이언트
├── styles/
│   └── tiptap.css          # 에디터 스타일
└── generated/
    └── prisma-blog/        # Prisma 클라이언트
```

## 🏁 빠른 시작

### 1. 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd growsome

# 환경 변수 설정
cp .env.example .env.local
```

### 2. 환경 변수 구성

`.env.local` 파일에 다음 변수들을 설정하세요:

```env
# 블로그 데이터베이스 URL
BLOG_DATABASE_URL="postgresql://user:password@localhost:5432/growsome_blog"

# 기타 필요한 환경 변수들...
```

### 3. 자동 설정 (권장)

```bash
# 블로그 시스템 자동 설정
npm run blog:setup
```

### 4. 수동 설정

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npm run blog:generate

# 데이터베이스 마이그레이션
npm run blog:migrate

# 시드 데이터 생성
npm run blog:seed

# 개발 서버 시작
npm run dev
```

## 📝 사용법

### 블로그 포스트 작성

1. http://localhost:3000/blog/write 접속
2. Tiptap 에디터로 풍부한 콘텐츠 작성
3. 카테고리, 태그, SEO 정보 설정
4. 초안 저장 또는 바로 발행

### GraphQL API 사용

GraphQL Playground: http://localhost:3000/api/graphql

#### 예시 쿼리

```graphql
# 모든 포스트 조회
query GetPosts {
  contents(first: 10, status: PUBLISHED) {
    id
    title
    slug
    excerpt
    publishedAt
    author {
      username
    }
    category {
      name
    }
  }
}

# 포스트 생성
mutation CreatePost {
  createContent(input: {
    title: "새로운 포스트"
    slug: "new-post"
    content: "<p>포스트 내용</p>"
    categoryId: 1
    status: "PUBLISHED"
  }) {
    id
    title
    slug
  }
}
```

## 🎨 Tiptap 에디터 기능

- **기본 포매팅**: Bold, Italic, Underline, Strikethrough
- **제목**: H1~H6 헤딩
- **목록**: 순서 있는/없는 목록, 체크리스트
- **미디어**: 이미지, 링크
- **테이블**: 동적 테이블 생성/편집
- **코드**: 인라인 코드, 코드 블록 (Syntax Highlighting)
- **정렬**: 좌측, 가운데, 우측 정렬
- **색상**: 텍스트 색상, 하이라이트
- **되돌리기/다시하기**: Undo/Redo

## 🔧 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 린팅
npm run lint

# 데이터베이스 관련
npm run blog:generate    # Prisma 클라이언트 생성
npm run blog:migrate     # 데이터베이스 마이그레이션
npm run blog:push        # 스키마 푸시 (개발용)
npm run blog:studio      # Prisma Studio 실행
npm run blog:seed        # 시드 데이터 생성
npm run blog:reset       # 데이터베이스 리셋
```

## 🗄️ 데이터베이스 스키마

### 주요 테이블

- **users**: 사용자 정보
- **blog_categories**: 블로그 카테고리
- **blog_contents**: 블로그 포스트
- **blog_tags**: 태그
- **blog_content_tags**: 포스트-태그 관계
- **blog_comments**: 댓글
- **blog_likes**: 좋아요

### 관계

- User 1:N Content (작성자)
- Category 1:N Content (카테고리)
- Content N:M Tag (태그)
- Content 1:N Comment (댓글)
- Content 1:N Like (좋아요)

## 🚀 배포

### Vercel 배포

1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 임포트
3. 환경 변수 설정
4. 자동 배포 완료

### 환경 변수 (프로덕션)

```env
BLOG_DATABASE_URL=your_production_database_url
NEXT_PUBLIC_SITE_URL=your_site_url
```

## 🔍 문제해결

### 일반적인 문제들

1. **Prisma 클라이언트 오류**
   ```bash
   npm run blog:generate
   ```

2. **데이터베이스 연결 오류**
   - `.env.local`의 `BLOG_DATABASE_URL` 확인
   - 데이터베이스 서버 상태 확인

3. **GraphQL 스키마 오류**
   - 서버 재시작: `npm run dev`
   - 캐시 클리어: `rm -rf .next`

4. **Tiptap 에디터 스타일 문제**
   - 글로벌 CSS에 Tiptap 스타일 포함 확인
   - 브라우저 캐시 클리어

## 📚 추가 자료

- [Tiptap 문서](https://tiptap.dev/)
- [Prisma 문서](https://www.prisma.io/docs)
- [GraphQL 문서](https://graphql.org/learn/)
- [Next.js 문서](https://nextjs.org/docs)

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
