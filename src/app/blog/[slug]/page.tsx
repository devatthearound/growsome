import { Metadata } from 'next'
import { PrismaClient } from '@prisma/client'
import { generateBlogMetadata } from '@/lib/metadata'
import BlogDetailClient from './BlogDetailClient'
import StructuredData from '@/components/seo/StructuredData'
import Link from 'next/link'

const prisma = new PrismaClient()

interface Props {
  params: Promise<{ slug: string }>
}

// 메타데이터 생성 함수
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await prisma.blog_contents.findUnique({
      where: { slug },
      include: {
        users: {
          select: { username: true }
        },
        blog_categories: {
          select: { name: true }
        },
        blog_content_tags: {
          include: {
            blog_tags: {
              select: { name: true }
            }
          }
        }
      }
    })

    if (!post) {
      return {
        title: '페이지를 찾을 수 없습니다',
        description: '요청하신 블로그 포스트를 찾을 수 없습니다.',
        robots: { index: false, follow: false }
      }
    }

    const tags = post.blog_content_tags.map(tag => tag.blog_tags.name)
    
    return generateBlogMetadata(
      post.meta_title || post.title,
      post.meta_description || post.content_body.substring(0, 150) + '...',
      post.slug,
      post.published_at?.toISOString(),
      post.updated_at?.toISOString(),
      post.users.username,
      post.blog_categories.name,
      tags,
      post.thumbnail_url || `/api/og/blog?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.blog_categories.name)}&author=${encodeURIComponent(post.users.username)}`
    )
  } catch (error) {
    console.error('메타데이터 생성 오류:', error)
    return {
      title: '오류가 발생했습니다',
      description: '페이지를 로드하는 중 오류가 발생했습니다.',
    }
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  let post = null
  let error = null

  try {
    post = await prisma.blog_contents.findUnique({
      where: { slug },
      include: {
        users: {
          select: { id: true, username: true }
        },
        blog_categories: {
          select: { id: true, name: true, slug: true }
        },
        blog_content_tags: {
          include: {
            blog_tags: {
              select: { id: true, name: true, slug: true }
            }
          }
        }
      }
    })

    if (!post) {
      error = '포스트를 찾을 수 없습니다.'
    }
  } catch (err) {
    console.error('포스트 로딩 오류:', err)
    error = '포스트를 로드하는 중 오류가 발생했습니다.'
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">페이지를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            블로그 홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // 구조화된 데이터 준비
  const tags = post.blog_content_tags.map(tag => tag.blog_tags.name)
  const articleData = {
    headline: post.title,
    description: post.meta_description || post.content_body.substring(0, 200) + '...',
    image: post.thumbnail_url || `/api/og/blog?title=${encodeURIComponent(post.title)}`,
    datePublished: post.published_at?.toISOString() || post.created_at?.toISOString(),
    dateModified: post.updated_at?.toISOString(),
    author: {
      name: post.users.username,
      url: `https://growsome.kr/author/${post.users.id}`
    },
    publisher: {
      name: 'Growsome',
      logo: 'https://growsome.kr/images/logo.png'
    },
    mainEntityOfPage: `https://growsome.kr/blog/${post.slug}`,
    wordCount: post.content_body.replace(/<[^>]*>/g, '').split(/\s+/).length,
    keywords: tags,
    category: post.blog_categories.name
  }

  // 빵부스러기 데이터
  const breadcrumbData = {
    items: [
      { name: 'Home', url: 'https://growsome.kr' },
      { name: 'Blog', url: 'https://growsome.kr/blog' },
      { name: post.blog_categories.name, url: `https://growsome.kr/blog/categories/${post.blog_categories.slug}` },
      { name: post.title, url: `https://growsome.kr/blog/${post.slug}` }
    ]
  }

  return (
    <>
      {/* 구조화된 데이터 */}
      <StructuredData type="article" data={articleData} />
      <StructuredData type="breadcrumb" data={breadcrumbData} />
      
      {/* 실제 페이지 콘텐츠 */}
      <BlogDetailClient 
        initialPost={post}
        slug={slug}
      />
    </>
  )
}
