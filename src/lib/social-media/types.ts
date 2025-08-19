// 소셜 미디어 자동 배포 시스템 타입 정의

export interface BlogPost {
  id?: number;
  title: string;
  content: string;
  slug: string;
  thumbnail_url?: string;
  tags?: string[];
  category?: string;
  author?: string;
  published_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface SocialMediaPost {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram';
  title: string;
  content: string;
  image_url?: string;
  hashtags?: string[];
  scheduled_at?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
}

export interface AutoPostConfig {
  enabled: boolean;
  platforms: string[];
  template: string;
  schedule_delay: number; // minutes
  max_content_length: number;
}