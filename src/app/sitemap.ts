import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://growsome.kr'
  const currentDate = new Date()
  
  // 정적 페이지들
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/consulting`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/traffic-lens`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  try {
    // 블로그 게시물들
    const blogPosts = await prisma.blog_contents.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        slug: true,
        updated_at: true,
      },
      orderBy: {
        published_at: 'desc',
      },
    })

    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || currentDate),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // 블로그 카테고리들
    const categories = await prisma.blog_categories.findMany({
      where: {
        is_visible: true,
      },
      select: {
        slug: true,
        updated_at: true,
      },
    })

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/blog/categories/${category.slug}`,
      lastModified: new Date(category.updated_at || currentDate),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 블로그 태그들 (created_at 없으므로 기본 날짜 사용)
    const tags = await prisma.blog_tags.findMany({
      select: {
        slug: true,
      },
    })

    const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
      url: `${baseUrl}/blog/tags/${tag.slug}`,
      lastModified: currentDate, // 기본값 사용
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...blogRoutes, ...categoryRoutes, ...tagRoutes]

  } catch (error) {
    console.error('Sitemap generation error:', error)
    return staticRoutes
  } finally {
    await prisma.$disconnect()
  }
}
