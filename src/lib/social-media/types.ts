// 소셜 미디어 자동 배포 시스템 타입 정의

export interface BlogPost {
  id?: number;
  title: string;
  content: string;
  slug: string;
  thumbnail_url?: string;
  tags?: string[];
  category?: string;
  author