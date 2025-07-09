// ✅ Centralized Blog Types with correct UUID support

export interface BlogPost {
  id: string; // UUID string, not number
  title: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  category_id: string; // UUID string
  category_name?: string;
  tags: string[];
  published_at: string;
  view_count?: number;
  status: 'draft' | 'published' | 'archived';
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  seo_title?: string;
  seo_description?: string;
  meta_keywords?: string[];
  featured?: boolean;
  reading_time?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogCategory {
  id: string; // UUID string, not number
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  description?: string;
  post_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  post_count?: number;
}

export interface BlogAuthor {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

// API Response types
export interface BlogPostsResponse {
  success: boolean;
  posts: BlogPost[];
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
}

export interface BlogPostResponse {
  success: boolean;
  post: BlogPost;
  error?: string;
}

export interface BlogCategoriesResponse {
  success: boolean;
  categories: BlogCategory[];
  error?: string;
}

// Query parameters
export interface BlogPostsQueryParams {
  search?: string;
  categoryId?: string;
  tag?: string;
  status?: 'draft' | 'published' | 'archived';
  page?: number;
  limit?: number;
  sort?: 'created_at' | 'updated_at' | 'published_at' | 'view_count';
  order?: 'asc' | 'desc';
}
