'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useBlogContent } from '@/hooks/use-blog'
import { Calendar, User, Eye, Heart, MessageSquare, Tag, ArrowLeft, Share2, Edit } from 'lucide-react'

interface BlogDetailProps {
  slug: string
  showEditButton?: boolean
  onViewIncrement?: (id: number) => void
}

const BlogDetail = ({ slug, showEditButton = false, onViewIncrement }: BlogDetailProps) => {
  const { content, loading, error } = useBlogContent(undefined, slug)

  // 조회수 증가 (페이지 로드 시)
  useEffect(() => {
    if (content && onViewIncrement) {
      onViewIncrement(content.id)
    }
  }, [content, onViewIncrement])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const handleShare = async () => {
    if (navigator.share && content) {
      try {
        await navigator.share({
          title: content.title,
          text: content.excerpt || content.metaDescription || '',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('링크가 클립보드에 복사되었습니다!')
      } catch (error) {
        console.error('Failed to copy:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            <div className="h-10 w-24 bg-gray-200 rounded mb-8"></div>
            
            {/* Title skeleton */}
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
            
            {/* Meta info skeleton */}
            <div className="flex gap-4 mb-8">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            
            {/* Image skeleton */}
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            
            {/* Content skeleton */}
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || '페이지를 찾을 수 없습니다'}
          </h1>
          <p className="text-gray-600 mb-6">
            요청하신 블로그 포스트가 존재하지 않거나 삭제되었습니다.
          </p>
          <Link 
            href="/blog"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            블로그 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            블로그 목록으로 돌아가기
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          {/* Category */}
          {content.category && (
            <div className="flex items-center mb-4">
              <Tag size={16} className="text-blue-500 mr-2" />
              <Link 
                href={`/blog?category=${content.category.id}`}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                {content.category.name}
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {content.title}
          </h1>

          {/* Meta Description */}
          {content.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {content.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-6">
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span>{content.author.username}</span>
              {content.author.position && (
                <span className="ml-1 text-sm">({content.author.position})</span>
              )}
            </div>
            
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(content.publishedAt || content.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Eye size={16} className="mr-1" />
                <span>{content.viewCount}</span>
              </div>
              <div className="flex items-center">
                <Heart size={16} className="mr-1" />
                <span>{content.likeCount}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-1" />
                <span>{content.commentCount}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 size={16} className="mr-2" />
              공유하기
            </button>
            
            {showEditButton && (
              <Link
                href={`/blog/edit/${content.id}`}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit size={16} className="mr-2" />
                수정하기
              </Link>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {content.thumbnailUrl && (
          <div className="mb-8">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={content.thumbnailUrl}
                alt={content.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div 
            className="prose prose-lg max-w-none p-8"
            dangerouslySetInnerHTML={{ __html: content.contentBody }}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          {/* Author Info */}
          <div className="flex items-center mb-8">
            {content.author.avatar && (
              <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                <Image
                  src={content.author.avatar}
                  alt={content.author.username}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {content.author.username}
              </h3>
              {content.author.position && (
                <p className="text-gray-600">{content.author.position}</p>
              )}
              {content.author.companyName && (
                <p className="text-sm text-gray-500">{content.author.companyName}</p>
              )}
            </div>
          </div>

          {/* Related Posts or Categories */}
          <div className="flex justify-between items-center">
            <div>
              <Link 
                href="/blog"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                ← 다른 글 보기
              </Link>
            </div>
            
            {content.category && (
              <div>
                <Link 
                  href={`/blog?category=${content.category.id}`}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  {content.category.name} 카테고리의 다른 글 →
                </Link>
              </div>
            )}
          </div>
        </footer>
      </article>

      {/* SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <h1>{content.metaTitle || content.title}</h1>
        <meta name="description" content={content.metaDescription || content.excerpt} />
        <meta property="og:title" content={content.metaTitle || content.title} />
        <meta property="og:description" content={content.metaDescription || content.excerpt} />
        {content.thumbnailUrl && (
          <meta property="og:image" content={content.thumbnailUrl} />
        )}
      </div>
    </div>
  )
}

export default BlogDetail
