'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { blogAPI, BlogContent, BlogComment } from '../../../lib/graphql-client'

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [content, setContent] = useState<BlogContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      loadContent()
    }
  }, [slug])

  const loadContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await blogAPI.getContent({ slug })
      
      if (response.data?.content) {
        setContent(response.data.content)
      } else {
        setError('블로그 글을 찾을 수 없습니다.')
      }
    } catch (err) {
      console.error('컨텐츠 로드 실패:', err)
      setError('블로그 글을 불러오는데 실패했습니다.')
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
            <div className="h-10 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
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
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || '페이지를 찾을 수 없습니다'}
          </h1>
          <p className="text-gray-600 mb-6">요청하신 블로그 글이 존재하지 않거나 삭제되었습니다.</p>
          <Link 
            href="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            블로그 홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">홈</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-blue-600">블로그</Link>
            <span>›</span>
            <Link href={`/blog?category=${content.category?.slug}`} className="hover:text-blue-600">
              {content.category?.name}
            </Link>
            <span>›</span>
            <span className="text-gray-900">{content.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4">
            <Link 
              href={`/blog?category=${content.category?.slug}`}
              className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {content.category?.name}
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {content.title}
          </h1>
          
          {content.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {content.excerpt}
            </p>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-6 border-t border-b border-gray-200">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {content.author?.avatar && (
                <Image
                  src={content.author.avatar}
                  alt={content.author.username || ''}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <div className="font-semibold text-gray-900">
                  {content.author?.username}
                </div>
                {content.author?.position && (
                  <div className="text-sm text-gray-600">
                    {content.author.position}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>{formatDate(content.publishedAt!)}</span>
              <span>조회 {content.viewCount}</span>
              <span>❤️ {content.likeCount}</span>
              <span>💬 {content.commentCount}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {content.thumbnailUrl && (
          <div className="mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={content.thumbnailUrl}
                alt={content.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            dangerouslySetInnerHTML={{ __html: content.contentBody }}
            className="leading-relaxed"
          />
        </div>

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">태그</h3>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-4">
            {content.author?.avatar && (
              <Image
                src={content.author.avatar}
                alt={content.author.username || ''}
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {content.author?.username}
              </h3>
              {content.author?.position && (
                <p className="text-gray-600 mb-2">{content.author.position}</p>
              )}
              <p className="text-gray-600 text-sm">
                Growsome에서 다양한 인사이트를 공유하고 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            댓글 {content.commentCount}개
          </h3>
          
          {/* Comment Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <textarea
              placeholder="댓글을 작성해주세요..."
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end mt-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                댓글 작성
              </button>
            </div>
          </div>

          {/* Comments List */}
          {content.comments && content.comments.length > 0 ? (
            <div className="space-y-6">
              {content.comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start space-x-4">
                    {comment.user?.avatar && (
                      <Image
                        src={comment.user.avatar}
                        alt={comment.user.username || ''}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {comment.user?.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {comment.body}
                      </p>
                      
                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-4">
                              {reply.user?.avatar && (
                                <Image
                                  src={reply.user.avatar}
                                  alt={reply.user.username || ''}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-gray-900 text-sm">
                                    {reply.user?.username}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {reply.body}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
            </div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            관련 글
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* 관련 글은 나중에 구현 */}
            <div className="text-center text-gray-500 col-span-2">
              관련 글 기능은 곧 추가될 예정입니다.
            </div>
          </div>
        </div>
      </div>

      {/* Back to Blog */}
      <div className="text-center py-8">
        <Link 
          href="/blog"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← 블로그 목록으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
