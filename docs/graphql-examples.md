# GraphQL 쿼리 예제

## 목차
- [기본 쿼리](#기본-쿼리)
- [콘텐츠 관리](#콘텐츠-관리)
- [사용자 인증](#사용자-인증)
- [인터랙션](#인터랙션)
- [댓글 시스템](#댓글-시스템)

## 기본 쿼리

### 1. 모든 카테고리 조회
```graphql
query GetCategories {
  categories(isVisible: true) {
    id
    name
    slug
    description
    contentCount
    sortOrder
  }
}
```

### 2. 인기 태그 조회
```graphql
query GetPopularTags {
  tags(limit: 10) {
    id
    name
    slug
    usageCount
    tagType
  }
}
```

### 3. 최신 콘텐츠 목록
```graphql
query GetLatestContents($first: Int = 10) {
  contents(first: $first, sortBy: PUBLISHED_AT, sortOrder: DESC) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        viewCount
        likeCount
        commentCount
        publishedAt
        author {
          username
          profileImage
        }
        category {
          name
          slug
        }
        contentTags {
          tag {
            name
            slug
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### 4. 추천 콘텐츠 (Featured)
```graphql
query GetFeaturedContents {
  contents(filters: { isFeatured: true }) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        author {
          username
          profileImage
        }
        provider {
          name
          expertise
          isVerified
        }
      }
    }
  }
}
```

### 5. 히어로 콘텐츠
```graphql
query GetHeroContent {
  contents(filters: { isHero: true }, first: 1) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        viewCount
        likeCount
        publishedAt
        author {
          username
          profileImage
        }
        category {
          name
          slug
        }
      }
    }
  }
}
```

## 콘텐츠 관리

### 1. 단일 콘텐츠 상세 조회
```graphql
query GetContentBySlug($slug: String!, $userId: String) {
  content(slug: $slug) {
    id
    title
    contentBody
    slug
    viewCount
    likeCount
    commentCount
    publishedAt
    seoTitle
    seoDescription
    readingTime
    isLikedByUser(userId: $userId)
    isBookmarkedByUser(userId: $userId)
    author {
      username
      profileImage
      bio
    }
    provider {
      name
      profileImage
      bio
      expertise
      isVerified
    }
    category {
      name
      slug
    }
    contentTags {
      tag {
        name
        slug
      }
    }
  }
}
```

### 2. 카테고리별 콘텐츠 조회
```graphql
query GetContentsByCategory($categoryId: Int!, $first: Int = 10) {
  contents(
    filters: { categoryId: $categoryId, status: PUBLISHED }
    first: $first
    sortBy: PUBLISHED_AT
    sortOrder: DESC
  ) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        viewCount
        likeCount
        publishedAt
        author {
          username
          profileImage
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### 3. 태그별 콘텐츠 조회
```graphql
query GetContentsByTags($tags: [String!]!, $first: Int = 10) {
  contents(
    filters: { tags: $tags, status: PUBLISHED }
    first: $first
    sortBy: PUBLISHED_AT
    sortOrder: DESC
  ) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        viewCount
        likeCount
        publishedAt
        author {
          username
          profileImage
        }
        contentTags {
          tag {
            name
            slug
          }
        }
      }
    }
  }
}
```

### 4. 콘텐츠 검색
```graphql
query SearchContents($search: String!, $first: Int = 10) {
  contents(
    filters: { search: $search, status: PUBLISHED }
    first: $first
    sortBy: PUBLISHED_AT
    sortOrder: DESC
  ) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        viewCount
        likeCount
        publishedAt
        author {
          username
          profileImage
        }
        category {
          name
          slug
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### 5. 작성자별 콘텐츠 조회
```graphql
query GetContentsByAuthor($authorId: String!, $first: Int = 10) {
  contents(
    filters: { authorId: $authorId, status: PUBLISHED }
    first: $first
    sortBy: PUBLISHED_AT
    sortOrder: DESC
  ) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        viewCount
        likeCount
        publishedAt
        category {
          name
          slug
        }
      }
    }
  }
}
```

### 6. 공급자별 콘텐츠 조회
```graphql
query GetContentsByProvider($providerId: String!, $first: Int = 10) {
  contents(
    filters: { providerId: $providerId, status: PUBLISHED }
    first: $first
    sortBy: PUBLISHED_AT
    sortOrder: DESC
  ) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        viewCount
        likeCount
        publishedAt
        author {
          username
        }
        provider {
          name
          expertise
        }
      }
    }
  }
}
```

## 사용자 인증

### 1. 현재 사용자 정보
```graphql
query Me {
  me {
    id
    username
    email
    profileImage
    bio
    role
    canWriteContent
    canWriteAsProvider
    contentCount
    followerCount
    provider {
      id
      name
      expertise
      isVerified
      publishedContentCount
    }
  }
}
```

### 2. 사용자 프로필 조회
```graphql
query GetUserProfile($slug: String!) {
  user(slug: $slug) {
    id
    username
    profileImage
    bio
    socialLinks
    role
    contentCount
    followerCount
    createdAt
    provider {
      name
      expertise
      isVerified
      publishedContentCount
    }
  }
}
```

### 3. 공급자 프로필 조회
```graphql
query GetProviderProfile($slug: String!) {
  provider(slug: $slug) {
    id
    name
    profileImage
    bio
    expertise
    tags
    isVerified
    publishedContentCount
    createdAt
    user {
      username
      socialLinks
    }
  }
}
```

### 4. 검증된 공급자 목록
```graphql
query GetVerifiedProviders($first: Int = 10) {
  providers(isVerified: true, first: $first) {
    edges {
      node {
        id
        slug
        name
        profileImage
        bio
        expertise
        publishedContentCount
        user {
          username
        }
      }
    }
  }
}
```

## 인터랙션

### 1. 사용자의 좋아요한 콘텐츠
```graphql
query GetLikedContents($userId: String!, $first: Int = 10) {
  userInteractions(
    filters: { userId: $userId, type: LIKE }
    first: $first
  ) {
    edges {
      node {
        content {
          id
          title
          slug
          excerpt
          thumbnailUrl
          author {
            username
          }
        }
        createdAt
      }
    }
  }
}
```

### 2. 사용자의 북마크한 콘텐츠
```graphql
query GetBookmarkedContents($userId: String!, $first: Int = 10) {
  userInteractions(
    filters: { userId: $userId, type: BOOKMARK }
    first: $first
  ) {
    edges {
      node {
        content {
          id
          title
          slug
          excerpt
          thumbnailUrl
          author {
            username
          }
        }
        createdAt
      }
    }
  }
}
```

## 댓글 시스템

### 1. 콘텐츠 댓글 조회
```graphql
query GetComments($contentId: Int!, $first: Int = 20) {
  comments(contentId: $contentId, first: $first) {
    edges {
      node {
        id
        commentText
        createdAt
        updatedAt
        isDeleted
        replyCount
        user {
          username
          profileImage
        }
        replies {
          id
          commentText
          createdAt
          user {
            username
            profileImage
          }
        }
      }
    }
  }
}
```

### 2. 사용자의 댓글 목록
```graphql
query GetUserComments($userId: String!, $first: Int = 10) {
  comments(
    filters: { userId: $userId }
    first: $first
    sortBy: CREATED_AT
    sortOrder: DESC
  ) {
    edges {
      node {
        id
        commentText
        createdAt
        content {
          title
          slug
        }
      }
    }
  }
}
```

## 뮤테이션 예제

### 1. 콘텐츠 작성
```graphql
mutation CreateContent($input: CreateContentInput!) {
  createContent(input: $input) {
    id
    title
    slug
    status
    author {
      username
    }
    provider {
      name
    }
  }
}

# Variables:
{
  "input": {
    "slug": "my-new-post",
    "title": "새로운 블로그 포스트",
    "contentBody": "# 제목\n\n본문 내용...",
    "categoryId": 1,
    "status": "PUBLISHED",
    "thumbnailUrl": "https://example.com/thumbnail.jpg",
    "seoTitle": "SEO 제목",
    "seoDescription": "SEO 설명",
    "asProvider": false
  }
}
```

### 2. 콘텐츠 수정
```graphql
mutation UpdateContent($id: Int!, $input: UpdateContentInput!) {
  updateContent(id: $id, input: $input) {
    id
    title
    slug
    status
    updatedAt
  }
}

# Variables:
{
  "id": 1,
  "input": {
    "title": "수정된 제목",
    "contentBody": "수정된 내용",
    "status": "PUBLISHED"
  }
}
```

### 3. 댓글 작성
```graphql
mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    commentText
    createdAt
    user {
      username
    }
  }
}

# Variables:
{
  "input": {
    "contentId": 1,
    "commentText": "좋은 글이네요!",
    "parentCommentId": null
  }
}
```

### 4. 대댓글 작성
```graphql
mutation CreateReply($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    commentText
    createdAt
    user {
      username
    }
    parentComment {
      id
      user {
        username
      }
    }
  }
}

# Variables:
{
  "input": {
    "contentId": 1,
    "commentText": "저도 동감합니다!",
    "parentCommentId": 1
  }
}
```

### 5. 좋아요 토글
```graphql
mutation ToggleLike($contentId: Int!) {
  toggleLike(contentId: $contentId)
}

# Variables:
{
  "contentId": 1
}
```

### 6. 북마크 토글
```graphql
mutation ToggleBookmark($contentId: Int!) {
  toggleBookmark(contentId: $contentId)
}

# Variables:
{
  "contentId": 1
}
```

### 7. 사용자 프로필 업데이트
```graphql
mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    username
    profileImage
    bio
    socialLinks
    updatedAt
  }
}

# Variables:
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "input": {
    "username": "새로운닉네임",
    "bio": "업데이트된 자기소개",
    "profileImage": "https://example.com/new-avatar.jpg",
    "socialLinks": {
      "github": "https://github.com/newusername",
      "twitter": "https://twitter.com/newusername"
    }
  }
}
```

### 8. 공급자 프로필 생성
```graphql
mutation CreateProvider($input: CreateProviderInput!) {
  createProvider(input: $input) {
    id
    slug
    name
    expertise
    isVerified
    user {
      username
    }
  }
}

# Variables:
{
  "input": {
    "slug": "expert-developer",
    "name": "전문 개발자",
    "bio": "10년 경력의 풀스택 개발자입니다.",
    "expertise": "웹 개발, 시스템 설계",
    "tags": ["javascript", "react", "nodejs"]
  }
}
```

### 9. 카테고리 생성 (관리자 전용)
```graphql
mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    id
    slug
    name
    description
    sortOrder
  }
}

# Variables:
{
  "input": {
    "slug": "artificial-intelligence",
    "name": "인공지능",
    "description": "AI, 머신러닝 관련 콘텐츠",
    "isVisible": true,
    "sortOrder": 5
  }
}
```

## 복합 쿼리 예제

### 1. 홈페이지 데이터 한 번에 가져오기
```graphql
query GetHomepageData {
  # 히어로 콘텐츠
  heroContent: contents(filters: { isHero: true }, first: 1) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        author {
          username
          profileImage
        }
      }
    }
  }
  
  # 추천 콘텐츠
  featuredContents: contents(filters: { isFeatured: true }, first: 6) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        viewCount
        likeCount
        author {
          username
        }
        category {
          name
          slug
        }
      }
    }
  }
  
  # 최신 콘텐츠
  latestContents: contents(first: 8, sortBy: PUBLISHED_AT, sortOrder: DESC) {
    edges {
      node {
        id
        title
        slug
        excerpt
        thumbnailUrl
        publishedAt
        author {
          username
        }
      }
    }
  }
  
  # 인기 카테고리
  categories(isVisible: true) {
    id
    name
    slug
    contentCount
  }
  
  # 인기 태그
  popularTags: tags(limit: 10) {
    id
    name
    slug
    usageCount
  }
}
```

### 2. 사용자 대시보드 데이터
```graphql
query GetUserDashboard($userId: String!) {
  # 사용자 정보
  user(id: $userId) {
    id
    username
    profileImage
    contentCount
    provider {
      publishedContentCount
    }
  }
  
  # 사용자의 최근 콘텐츠
  myContents: contents(
    filters: { authorId: $userId }
    first: 5
    sortBy: UPDATED_AT
    sortOrder: DESC
  ) {
    edges {
      node {
        id
        title
        slug
        status
        viewCount
        likeCount
        commentCount
        updatedAt
      }
    }
  }
  
  # 최근 댓글
  myComments: comments(
    filters: { userId: $userId }
    first: 5
    sortBy: CREATED_AT
    sortOrder: DESC
  ) {
    edges {
      node {
        id
        commentText
        createdAt
        content {
          title
          slug
        }
      }
    }
  }
  
  # 북마크한 콘텐츠
  bookmarks: userInteractions(
    filters: { userId: $userId, type: BOOKMARK }
    first: 5
  ) {
    edges {
      node {
        content {
          id
          title
          slug
          thumbnailUrl
        }
      }
    }
  }
}
```

이 예제들을 참고하여 GraphQL Playground에서 테스트해보세요!
