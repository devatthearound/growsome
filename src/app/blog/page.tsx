'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { blogAPI, BlogContent, BlogCategory } from '@/lib/graphql-client'

export default function BlogMainPage() {
  const [contents, setContents] = useState<BlogContent[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [featuredContents, setFeaturedContents] = useState<BlogContent[]>([])
  const [heroContent, setHeroContent] = useState<BlogContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    loadBlogData()
  }, [selectedCategory])

  const loadBlogData = async () => {
    try {
      setLoading(true)

      // 병렬로 데이터 로드
      const [
        contentsRes,
        categoriesRes,
        featuredRes,
        heroRes
      ] = await Promise.all([
        blogAPI.getContents({ 
          first: 12, 
          categoryId: selectedCategory || undefined,
          status: 'PUBLISHED' 
        }),
        blogAPI.getCategories({ isVisible: true }),
        blogAPI.getFeaturedContents({ limit: 3 }),
        blogAPI.getHeroContent()
      ])

      if (contentsRes.data) setContents(contentsRes.data.contents)
      if (categoriesRes.data) setCategories(categoriesRes.data.categories)
      if (featuredRes.data) setFeaturedContents(featuredRes.data.featuredContents)
      if (heroRes.data) setHeroContent(heroRes.data.heroContent)

    } catch (error) {
      console.error('블로그 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-48 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {heroContent && (
        <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <div className="mb-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {heroContent.category?.name}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {heroContent.title}
              </h1>
              <p className="text-xl mb-6 text-blue-100">
                {heroContent.excerpt}
              </p>
              <div className="flex items-center space-x-4 text-blue-100">
                <span>{heroContent.author?.username}</span>
                <span>•</span>
                <span>{formatDate(heroContent.publishedAt!)}</span>
                <span>•</span>
                <span>조회 {heroContent.viewCount}</span>
              </div>
              <Link 
                href={`/blog/${heroContent.slug}`}
                className="inline-block mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                자세히 읽기
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Growsome 블로그</h1>
            <p className="text-gray-600">성장하는 기업을 위한 인사이트와 노하우</p>
          </div>
          
          {/* Category Filter */}
          <div className="mt-4 md:mt-0">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                전체
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredContents.length > 0 && !selectedCategory && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">추천 글</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredContents.map((content) => (
                <Link key={content.id} href={`/blog/${content.slug}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                    {content.thumbnailUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={content.thumbnailUrl}
                          alt={content.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                            ⭐ 추천
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {content.category?.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(content.publishedAt!)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {content.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {content.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                        <span>{content.author?.username}</span>
                        <div className="flex items-center space-x-3">
                          <span>👁 {content.viewCount}</span>
                          <span>❤️ {content.likeCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory 
                ? `${categories.find(c => c.id === selectedCategory)?.name} 글` 
                : '최신 글'}
            </h2>
            <span className="text-gray-500 text-sm">
              총 {contents.length}개의 글
            </span>
          </div>

          {contents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">😔</div>
              <p className="text-gray-500">아직 게시된 글이 없습니다.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content) => (
                <Link key={content.id} href={`/blog/${content.slug}`}>
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                    {content.thumbnailUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={content.thumbnailUrl}
                          alt={content.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                          {content.category?.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(content.publishedAt!)}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {content.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {content.excerpt}
                      </p>

                      {content.tags && content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {content.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span>{content.author?.username}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span>👁 {content.viewCount}</span>
                          <span>❤️ {content.likeCount}</span>
                          <span>💬 {content.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Load More */}
        {contents.length >= 12 && (
          <div className="text-center mt-12">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              더 많은 글 보기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
