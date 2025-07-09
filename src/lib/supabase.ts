// Supabase 클라이언트 설정
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey
  });
  throw new Error('Missing Supabase environment variables');
}

console.log('🔗 Supabase 설정 확인:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey,
  keyLength: supabaseKey?.length
});

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

// 타입 정의 (실제 Supabase 스키마에 맞게 수정)
export interface BlogPost {
  id: string; // UUID
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id?: string; // UUID
  category_id?: string; // UUID
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at?: string;
  scheduled_at?: string;
  seo_title?: string;
  seo_description?: string;
  meta_keywords?: string[];
  view_count: number;
  reading_time?: number;
  tags: string[];
  featured: boolean;
  allow_comments: boolean;
  created_at: string;
  updated_at: string;
  // 관계 테이블
  blog_categories?: {
    name: string;
    slug: string;
    color?: string;
    icon?: string;
  };
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

export interface BlogCategory {
  id: string; // UUID
  name: string;
  slug: string;
  description?: string;
  parent_id?: string; // UUID
  color: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  post_count?: number;
}

export interface BlogComment {
  id: string; // UUID
  post_id: string; // UUID
  author_id?: string; // UUID
  parent_id?: string; // UUID
  author_name?: string;
  author_email?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
  // 관계
  profiles?: {
    full_name?: string;
  };
  replies?: BlogComment[];
}

export interface BlogTag {
  id: string; // UUID
  name: string;
  slug: string;
  description?: string;
  color: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}