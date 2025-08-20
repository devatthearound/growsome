import { Metadata } from 'next'

// 기본 메타데이터 설정
export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://growsome.kr'),
  title: {
    default: 'Growsome | AI 기반 비즈니스 성장 플랫폼',
    template: '%s | Growsome'
  },
  description: 'AI 자동화와 데이터 분석으로 비즈니스 성장을 가속화하는 그로우썸. 스타트업부터 대기업까지 검증된 성장 솔루션을 제공합니다.',
  keywords: [
    'AI', 
    '비즈니스성장', 
    '디지털마케팅', 
    '자동화', 
    '데이터분석', 
    '스타트업', 
    '그로우썸', 
    '마케팅자동화',
    '비즈니스컨설팅',
    '성장전략'
  ],
  authors: [{ name: 'Growsome Team', url: 'https://growsome.kr' }],
  creator: 'Growsome',
  publisher: 'Growsome',
  applicationName: 'Growsome Platform',
  category: 'Business',
  
  // Open Graph 설정
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://growsome.kr',
    siteName: 'Growsome',
    title: 'Growsome | AI 기반 비즈니스 성장 플랫폼',
    description: 'AI 자동화와 데이터 분석으로 비즈니스 성장을 가속화하는 그로우썸',
    images: [
      {
        url: '/images/og/growsome-main.jpg',
        width: 1200,
        height: 630,
        alt: 'Growsome - AI 기반 비즈니스 성장 플랫폼',
      }
    ],
  },
  
  // Twitter Cards 설정
  twitter: {
    card: 'summary_large_image',
    site: '@growsome_kr',
    creator: '@growsome_kr',
    title: 'Growsome | AI 기반 비즈니스 성장 플랫폼',
    description: 'AI 자동화와 데이터 분석으로 비즈니스 성장을 가속화하는 그로우썸',
    images: ['/images/og/growsome-main.jpg'],
  },
  
  // 로봇 크롤링 설정
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Canonical URL 설정
  alternates: {
    canonical: 'https://growsome.kr',
    languages: {
      'ko-KR': 'https://growsome.kr',
    },
  },
  
  // 추가 링크 태그
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // 검증 메타태그
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  
  // 추가 메타태그
  other: {
    ...(process.env.NAVER_SITE_VERIFICATION && { 'naver-site-verification': process.env.NAVER_SITE_VERIFICATION }),
    ...(process.env.BING_VERIFICATION && { 'msvalidate.01': process.env.BING_VERIFICATION }),
    'theme-color': '#667eea',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
}

// 페이지별 메타데이터 생성 유틸리티
export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '',
  image?: string,
  keywords?: string[]
): Metadata {
  const url = `https://growsome.kr${path}`
  
  return {
    title,
    description,
    keywords: keywords || defaultMetadata.keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url,
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: image ? [image] : defaultMetadata.twitter?.images,
    },
    alternates: {
      canonical: url,
    },
  }
}

// 블로그 포스트 메타데이터 생성
export function generateBlogMetadata(
  title: string,
  description: string,
  slug: string,
  publishedTime?: string,
  modifiedTime?: string,
  author?: string,
  category?: string,
  tags?: string[],
  image?: string
): Metadata {
  const url = `https://growsome.kr/blog/${slug}`
  
  return {
    title,
    description,
    keywords: tags || defaultMetadata.keywords,
    authors: [{ name: author || 'Growsome Team' }],
    
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'Growsome',
      locale: 'ko_KR',
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [
        {
          url: `/api/og/blog?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      publishedTime,
      modifiedTime,
      authors: [author || 'Growsome Team'],
      section: category,
      tags,
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [`/api/og/blog?title=${encodeURIComponent(title)}`],
    },
    
    alternates: {
      canonical: url,
    },
    
    other: {
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      'article:author': author || 'Growsome Team',
      ...(category && { 'article:section': category }),
      ...(tags && tags.length > 0 && { 'article:tag': tags.join(',') }),
    },
  }
}
