// GraphQL 쿼리와 뮤테이션 정의 (업데이트된 버전)

// ===== QUERIES =====
export const BLOG_QUERIES = {
  // 기본 정보 쿼리
  HELLO: `
    query Hello {
      hello
      version
    }
  `,

  // 컨텐츠 관련 쿼리들
  GET_CONTENTS: `
    query GetContents($first: Int = 10, $categoryId: Int, $status: String = "PUBLISHED") {
      contents(first: $first, categoryId: $categoryId, status: $status) {
        id
        slug
        title
        contentBody
        excerpt
        authorId
        categoryId
        status
        isFeatured
        isHero
        thumbnailUrl
        viewCount
        likeCount
        commentCount
        metaTitle
        metaDescription
        createdAt
        updatedAt
        publishedAt
        author {
          id
          username
          email
          avatar
          companyName
          position
          phoneNumber
          status
          createdAt
          updatedAt
        }
        category {
          id
          slug
          name
          description
          isVisible
          sortOrder
          createdAt
          updatedAt
        }
        tags {
          id
          name
          slug
        }
      }
    }
  `,

  GET_CONTENT: `
    query GetContent($id: Int, $slug: String) {
      content(id: $id, slug: $slug) {
        id
        slug
        title
        contentBody
        excerpt
        authorId
        categoryId
        status
        isFeatured
        isHero
        thumbnailUrl
        viewCount
        likeCount
        commentCount
        metaTitle
        metaDescription
        createdAt
        updatedAt
        publishedAt
        author {
          id
          username
          email
          avatar
          companyName
          position
          phoneNumber
          status
          createdAt
          updatedAt
        }
        category {
          id
          slug
          name
          description
          isVisible
          sortOrder
          createdAt
          updatedAt
        }
        tags {
          id
          name
          slug
        }
        comments {
          id
          contentId
          userId
          parentId
          body
          isApproved
          createdAt
          updatedAt
          user {
            id
            username
            avatar
          }
          replies {
            id
            contentId
            userId
            parentId
            body
            isApproved
            createdAt
            updatedAt
            user {
              id
              username
              avatar
            }
          }
        }
      }
    }
  `,

  GET_FEATURED_CONTENTS: `
    query GetFeaturedContents($limit: Int = 5) {
      featuredContents(limit: $limit) {
        id
        slug
        title
        excerpt
        thumbnailUrl
        viewCount
        likeCount
        commentCount
        publishedAt
        author {
          id
          username
          avatar
        }
        category {
          id
          slug
          name
        }
      }
    }
  `,

  GET_HERO_CONTENT: `
    query GetHeroContent {
      heroContent {
        id
        slug
        title
        excerpt
        thumbnailUrl
        viewCount
        likeCount
        commentCount
        publishedAt
        author {
          id
          username
          avatar
        }
        category {
          id
          slug
          name
        }
      }
    }
  `,

  // 카테고리 관련 쿼리들
  GET_CATEGORIES: `
    query GetCategories($isVisible: Boolean) {
      categories(isVisible: $isVisible) {
        id
        slug
        name
        description
        isVisible
        sortOrder
        createdAt
        updatedAt
        contentCount
      }
    }
  `,

  GET_CATEGORY: `
    query GetCategory($id: Int, $slug: String) {
      category(id: $id, slug: $slug) {
        id
        slug
        name
        description
        isVisible
        sortOrder
        createdAt
        updatedAt
        contentCount
        contents {
          id
          slug
          title
          excerpt
          thumbnailUrl
          viewCount
          likeCount
          commentCount
          publishedAt
          author {
            id
            username
            avatar
          }
        }
      }
    }
  `,

  // 사용자 관련 쿼리들
  GET_USER: `
    query GetUser($id: Int!) {
      user(id: $id) {
        id
        username
        email
        avatar
        companyName
        position
        phoneNumber
        status
        createdAt
        updatedAt
        contents {
          id
          slug
          title
          status
          publishedAt
          viewCount
          likeCount
          commentCount
        }
        comments {
          id
          body
          isApproved
          createdAt
        }
        likes {
          id
          createdAt
          content {
            id
            title
            slug
          }
        }
      }
    }
  `,

  GET_USERS: `
    query GetUsers($limit: Int = 10) {
      users(limit: $limit) {
        id
        username
        email
        avatar
        companyName
        position
        status
        createdAt
        updatedAt
      }
    }
  `,

  // 태그 관련 쿼리들
  GET_TAGS: `
    query GetTags {
      tags {
        id
        name
        slug
      }
    }
  `,

  GET_TAG: `
    query GetTag($id: Int, $slug: String) {
      tag(id: $id, slug: $slug) {
        id
        name
        slug
        contents {
          id
          slug
          title
          excerpt
          thumbnailUrl
          publishedAt
          author {
            id
            username
            avatar
          }
          category {
            id
            slug
            name
          }
        }
      }
    }
  `,

  // 댓글 관련 쿼리들
  GET_COMMENTS: `
    query GetComments($contentId: Int!) {
      comments(contentId: $contentId) {
        id
        contentId
        userId
        parentId
        body
        isApproved
        createdAt
        updatedAt
        user {
          id
          username
          avatar
        }
        replies {
          id
          contentId
          userId
          parentId
          body
          isApproved
          createdAt
          updatedAt
          user {
            id
            username
            avatar
          }
        }
      }
    }
  `
}

// ===== MUTATIONS =====
export const BLOG_MUTATIONS = {
  // 컨텐츠 관련 뮤테이션들
  CREATE_CONTENT: `
    mutation CreateContent($input: CreateContentInput!) {
      createContent(input: $input) {
        id
        slug
        title
        contentBody
        excerpt
        authorId
        categoryId
        status
        isFeatured
        isHero
        thumbnailUrl
        viewCount
        likeCount
        commentCount
        metaTitle
        metaDescription
        createdAt
        updatedAt
        publishedAt
        author {
          id
          username
          email
          avatar
        }
        category {
          id
          slug
          name
        }
      }
    }
  `,

  UPDATE_CONTENT: `
    mutation UpdateContent($id: Int!, $input: UpdateContentInput!) {
      updateContent(id: $id, input: $input) {
        id
        slug
        title
        contentBody
        excerpt
        authorId
        categoryId
        status
        isFeatured
        isHero
        thumbnailUrl
        viewCount
        likeCount
        commentCount
        metaTitle
        metaDescription
        createdAt
        updatedAt
        publishedAt
        author {
          id
          username
          email
          avatar
        }
        category {
          id
          slug
          name
        }
      }
    }
  `,

  DELETE_CONTENT: `
    mutation DeleteContent($id: Int!) {
      deleteContent(id: $id)
    }
  `,

  // 카테고리 관련 뮤테이션들
  CREATE_CATEGORY: `
    mutation CreateCategory($input: CreateCategoryInput!) {
      createCategory(input: $input) {
        id
        slug
        name
        description
        isVisible
        sortOrder
        createdAt
        updatedAt
      }
    }
  `,

  UPDATE_CATEGORY: `
    mutation UpdateCategory($id: Int!, $input: UpdateCategoryInput!) {
      updateCategory(id: $id, input: $input) {
        id
        slug
        name
        description
        isVisible
        sortOrder
        createdAt
        updatedAt
      }
    }
  `,

  DELETE_CATEGORY: `
    mutation DeleteCategory($id: Int!) {
      deleteCategory(id: $id)
    }
  `,

  // 댓글 관련 뮤테이션들
  CREATE_COMMENT: `
    mutation CreateComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        id
        contentId
        userId
        parentId
        body
        isApproved
        createdAt
        updatedAt
        user {
          id
          username
          avatar
        }
      }
    }
  `,

  UPDATE_COMMENT: `
    mutation UpdateComment($id: Int!, $input: UpdateCommentInput!) {
      updateComment(id: $id, input: $input) {
        id
        contentId
        userId
        parentId
        body
        isApproved
        createdAt
        updatedAt
        user {
          id
          username
          avatar
        }
      }
    }
  `,

  DELETE_COMMENT: `
    mutation DeleteComment($id: Int!) {
      deleteComment(id: $id)
    }
  `,

  // 좋아요 관련 뮤테이션
  TOGGLE_LIKE: `
    mutation ToggleLike($contentId: Int!, $userId: Int!) {
      toggleLike(contentId: $contentId, userId: $userId) {
        success
        isLiked
        likeCount
      }
    }
  `
}

// ===== TypeScript 인터페이스들 =====

// 기본 타입들
export interface BlogContent {
  id: number
  slug: string
  title: string
  contentBody: string
  excerpt?: string
  authorId: number
  categoryId: number
  status: string
  isFeatured: boolean
  isHero: boolean
  thumbnailUrl?: string
  viewCount: number
  likeCount: number
  commentCount: number
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  author: BlogUser
  category: BlogCategory
  tags?: BlogTag[]
  comments?: BlogComment[]
  likes?: BlogLike[]
}

export interface BlogUser {
  id: number
  username: string
  email: string
  avatar?: string
  companyName?: string
  position?: string
  phoneNumber: string
  status: string
  createdAt: string
  updatedAt: string
  contents?: BlogContent[]
  comments?: BlogComment[]
  likes?: BlogLike[]
}

export interface BlogCategory {
  id: number
  slug: string
  name: string
  description?: string
  isVisible: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  contentCount?: number
  contents?: BlogContent[]
}

export interface BlogTag {
  id: number
  name: string
  slug: string
  contents?: BlogContent[]
}

export interface BlogComment {
  id: number
  contentId: number
  userId: number
  parentId?: number
  body: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
  content?: BlogContent
  user?: BlogUser
  parent?: BlogComment
  replies?: BlogComment[]
}

export interface BlogLike {
  id: number
  contentId: number
  userId: number
  createdAt: string
  content?: BlogContent
  user?: BlogUser
}

// Input 타입들
export interface CreateContentInput {
  title: string
  slug: string
  contentBody: string
  authorId: number
  categoryId: number
  status?: string
  isFeatured?: boolean
  isHero?: boolean
  thumbnailUrl?: string
  metaTitle?: string
  metaDescription?: string
  tags?: string[]
}

export interface UpdateContentInput {
  title?: string
  slug?: string
  contentBody?: string
  categoryId?: number
  status?: string
  isFeatured?: boolean
  isHero?: boolean
  thumbnailUrl?: string
  metaTitle?: string
  metaDescription?: string
  tags?: string[]
}

export interface CreateCategoryInput {
  slug: string
  name: string
  description?: string
  isVisible?: boolean
  sortOrder?: number
}

export interface UpdateCategoryInput {
  slug?: string
  name?: string
  description?: string
  isVisible?: boolean
  sortOrder?: number
}

export interface CreateCommentInput {
  contentId: number
  userId: number
  parentId?: number
  body: string
}

export interface UpdateCommentInput {
  body?: string
  isApproved?: boolean
}

// Result 타입들
export interface LikeResult {
  success: boolean
  isLiked: boolean
  likeCount: number
}

// GraphQL 응답 타입들
export interface GraphQLResponse<T = any> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{
      line: number
      column: number
    }>
    path?: string[]
  }>
}

// ===== GraphQL 클라이언트 함수들 =====

// GraphQL 요청을 보내는 기본 함수
export async function graphqlRequest<T = any>(
  query: string,
  variables?: Record<string, any>,
  options?: {
    endpoint?: string
    headers?: Record<string, string>
  }
): Promise<GraphQLResponse<T>> {
  const endpoint = options?.endpoint || '/api/graphql'
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: JSON.stringify({
        query,
        variables
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: GraphQLResponse<T> = await response.json()
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors)
    }
    
    return result
  } catch (error) {
    console.error('GraphQL request error:', error)
    throw error
  }
}

// 편의 함수들
export const blogAPI = {
  // Content API
  async getContents(variables?: { first?: number; categoryId?: number; status?: string }) {
    return graphqlRequest<{ contents: BlogContent[] }>(BLOG_QUERIES.GET_CONTENTS, variables)
  },

  async getContent(variables: { id?: number; slug?: string }) {
    return graphqlRequest<{ content: BlogContent }>(BLOG_QUERIES.GET_CONTENT, variables)
  },

  async getFeaturedContents(variables?: { limit?: number }) {
    return graphqlRequest<{ featuredContents: BlogContent[] }>(BLOG_QUERIES.GET_FEATURED_CONTENTS, variables)
  },

  async getHeroContent() {
    return graphqlRequest<{ heroContent: BlogContent }>(BLOG_QUERIES.GET_HERO_CONTENT)
  },

  async createContent(input: CreateContentInput) {
    return graphqlRequest<{ createContent: BlogContent }>(BLOG_MUTATIONS.CREATE_CONTENT, { input })
  },

  async updateContent(id: number, input: UpdateContentInput) {
    return graphqlRequest<{ updateContent: BlogContent }>(BLOG_MUTATIONS.UPDATE_CONTENT, { id, input })
  },

  async deleteContent(id: number) {
    return graphqlRequest<{ deleteContent: boolean }>(BLOG_MUTATIONS.DELETE_CONTENT, { id })
  },

  // Category API
  async getCategories(variables?: { isVisible?: boolean }) {
    return graphqlRequest<{ categories: BlogCategory[] }>(BLOG_QUERIES.GET_CATEGORIES, variables)
  },

  async getCategory(variables: { id?: number; slug?: string }) {
    return graphqlRequest<{ category: BlogCategory }>(BLOG_QUERIES.GET_CATEGORY, variables)
  },

  async createCategory(input: CreateCategoryInput) {
    return graphqlRequest<{ createCategory: BlogCategory }>(BLOG_MUTATIONS.CREATE_CATEGORY, { input })
  },

  async updateCategory(id: number, input: UpdateCategoryInput) {
    return graphqlRequest<{ updateCategory: BlogCategory }>(BLOG_MUTATIONS.UPDATE_CATEGORY, { id, input })
  },

  async deleteCategory(id: number) {
    return graphqlRequest<{ deleteCategory: boolean }>(BLOG_MUTATIONS.DELETE_CATEGORY, { id })
  },

  // User API
  async getUser(id: number) {
    return graphqlRequest<{ user: BlogUser }>(BLOG_QUERIES.GET_USER, { id })
  },

  async getUsers(variables?: { limit?: number }) {
    return graphqlRequest<{ users: BlogUser[] }>(BLOG_QUERIES.GET_USERS, variables)
  },

  // Tag API
  async getTags() {
    return graphqlRequest<{ tags: BlogTag[] }>(BLOG_QUERIES.GET_TAGS)
  },

  async getTag(variables: { id?: number; slug?: string }) {
    return graphqlRequest<{ tag: BlogTag }>(BLOG_QUERIES.GET_TAG, variables)
  },

  // Comment API
  async getComments(contentId: number) {
    return graphqlRequest<{ comments: BlogComment[] }>(BLOG_QUERIES.GET_COMMENTS, { contentId })
  },

  async createComment(input: CreateCommentInput) {
    return graphqlRequest<{ createComment: BlogComment }>(BLOG_MUTATIONS.CREATE_COMMENT, { input })
  },

  async updateComment(id: number, input: UpdateCommentInput) {
    return graphqlRequest<{ updateComment: BlogComment }>(BLOG_MUTATIONS.UPDATE_COMMENT, { id, input })
  },

  async deleteComment(id: number) {
    return graphqlRequest<{ deleteComment: boolean }>(BLOG_MUTATIONS.DELETE_COMMENT, { id })
  },

  // Like API
  async toggleLike(contentId: number, userId: number) {
    return graphqlRequest<{ toggleLike: LikeResult }>(BLOG_MUTATIONS.TOGGLE_LIKE, { contentId, userId })
  },

  // Health Check
  async hello() {
    return graphqlRequest<{ hello: string; version: string }>(BLOG_QUERIES.HELLO)
  }
}

// React Hook을 위한 타입들 (React Query, SWR 등과 함께 사용)
export type UseContentQuery = {
  contents: BlogContent[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

export type UseContentDetailQuery = {
  content: BlogContent | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

// 에러 처리를 위한 유틸리티
export function isGraphQLError(error: any): error is { graphQLErrors: any[]; networkError: any } {
  return error && (error.graphQLErrors || error.networkError)
}

export function getErrorMessage(error: any): string {
  if (isGraphQLError(error)) {
    if (error.graphQLErrors?.length > 0) {
      return error.graphQLErrors[0].message
    }
    if (error.networkError) {
      return error.networkError.message
    }
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return '알 수 없는 오류가 발생했습니다.'
}
