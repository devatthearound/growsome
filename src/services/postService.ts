/**
 * 블로그 포스트 관련 서비스 함수들
 */

interface PostCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: number;
  category_id?: number;
  status: 'draft' | 'published' | 'private';
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  view_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface PostListParams {
  /** 카테고리 슬러그 */
  categoryId?: string;
  /** 페이지 번호 (1부터 시작) */
  page?: number;
  /** 페이지당 항목 수 */
  limit?: number;
  /** 태그 필터 */
  tag?: string;
}

interface PostListResponse {
  posts: Post[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * 카테고리 목록을 조회합니다.
 * 
 * @returns 카테고리 목록
 */
export const getCategories = async (): Promise<PostCategory[]> => {
  const response = await fetch('/api/blog/categories');
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '카테고리 조회에 실패했습니다.');
  }

  return response.json().then(data => data.categories);
};

/**
 * 포스트 목록을 조회합니다.
 * 
 * @param params - 조회 파라미터
 * @returns 포스트 목록과 페이지네이션 정보
 */
export const getPosts = async (params: PostListParams = {}): Promise<PostListResponse> => {
  const {
    categoryId,
    page = 1,
    limit = 10,
    tag
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  if (categoryId) {
    queryParams.append('categoryId', categoryId);
  }

  if (tag) {
    queryParams.append('tag', tag);
  }

  const response = await fetch(`/api/blog/posts?${queryParams}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '포스트 조회에 실패했습니다.');
  }

  const data = await response.json();
  return {
    posts: data.posts,
    total: data.pagination.total,
    currentPage: data.pagination.currentPage,
    totalPages: data.pagination.totalPages,
    hasMore: data.pagination.hasMore
  };
};

/**
 * 특정 포스트의 상세 정보를 조회합니다.
 * 
 * @param id - 포스트 ID
 * @returns 포스트 상세 정보
 */
export const getPostById = async (id: string): Promise<Post> => {
  const response = await fetch(`/api/blog/posts/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '포스트 조회에 실패했습니다.');
  }

  return response.json().then(data => data.post);
};