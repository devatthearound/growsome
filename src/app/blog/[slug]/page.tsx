'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Bell, BellRing, MessageCircle, Eye, Trash2, Edit3, ThumbsUp, Flag, Edit } from 'lucide-react'
import { blogAPI, BlogContent, BlogComment } from '../../../lib/graphql-client'
import SubscriptionModal from '../../../components/SubscriptionModal'
import ReportModal from '../../../components/ReportModal'
import { useAuth } from '../../../hooks/useAuth'

// 카테고리별 기본 이미지 생성 함수
const getDefaultImageUrl = (categoryName?: string, title?: string, width = 400, height = 240) => {
  // 카테고리에 따른 시드값 생성
  const categorySeeds = {
    'AI 기술': 'tech',
    '사업성장': 'business', 
    '디지털 마케팅': 'marketing',
    '스타트업 인사이트': 'startup',
    '데이터 분석': 'data',
    '자동화': 'automation',
    '트렌드': 'trend'
  }
  
  const seed = categorySeeds[categoryName as keyof typeof categorySeeds] || 'business'
  const titleHash = title ? title.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0
  
  return `https://picsum.photos/seed/${seed}${titleHash}/${width}/${height}`
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { user, isLoading: authLoading, isLoggedIn } = useAuth()
  
  const [content, setContent] = useState<BlogContent | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [localComments, setLocalComments] = useState<any[]>([])
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportingCommentId, setReportingCommentId] = useState<string | null>(null)

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
        // 관련 글 로드
        await loadRelatedPosts(response.data.content)
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

  const loadRelatedPosts = async (currentContent: BlogContent) => {
    try {
      // 같은 카테고리의 다른 글들을 가져오기
      const response = await blogAPI.getContents({ 
        first: 6, 
        categoryId: currentContent.categoryId 
      })
      
      if (response.data?.contents) {
        // 현재 글을 제외하고 최대 4개만 가져오기
        const filtered = response.data.contents
          .filter(post => post.id !== currentContent.id)
          .slice(0, 4)
        setRelatedPosts(filtered)
      } else {
        // 데이터가 없으면 빈 배열 설정
        setRelatedPosts([])
      }
    } catch (err) {
      console.error('관련 글 로드 실패:', err)
      // 관련 글 로드 실패시 빈 배열 설정
      setRelatedPosts([])
    }
  }

  const handleEdit = () => {
    if (content) {
      router.push(`/blog/edit/${content.id}`)
    }
  }

  const handleDelete = async () => {
    if (!content || !user?.isAdmin) return
    
    if (window.confirm('정말로 이 글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        const response = await fetch(`/api/admin/blog/${content.id}`, {
          method: 'DELETE',
          credentials: 'include'
        })
        
        if (response.ok) {
          alert('글이 삭제되었습니다.')
          router.push('/blog')
        } else {
          const error = await response.json()
          alert(error.message || '삭제에 실패했습니다.')
        }
      } catch (error) {
        console.error('삭제 실패:', error)
        alert('삭제 중 오류가 발생했습니다.')
      }
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // TODO: API 호출로 좋아요 상태 업데이트
  }

  const handleSubscribe = () => {
    setShowSubscriptionModal(true)
  }

  const handleCommentDelete = (commentId: string) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      // 로컬 댓글 삭제
      setLocalComments(prev => prev.filter(comment => comment.id !== commentId))
      
      // 컨텐츠의 댓글 수도 업데이트
      if (content) {
        setContent({
          ...content,
          commentCount: Math.max(0, content.commentCount - 1)
        })
      }
    }
  }

  const handleCommentEdit = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId)
    setEditingText(currentText)
  }

  const handleCommentUpdate = (commentId: string) => {
    if (editingText.trim()) {
      setLocalComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, body: editingText, isEdited: true }
            : comment
        )
      )
      setEditingCommentId(null)
      setEditingText('')
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingText('')
  }

  const handleCommentLike = (commentId: string) => {
    setLocalComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          const isLiked = comment.isLiked || false
          const likeCount = comment.likeCount || 0
          return {
            ...comment,
            isLiked: !isLiked,
            likeCount: isLiked ? likeCount - 1 : likeCount + 1
          }
        }
        return comment
      })
    )
  }

  const handleCommentReport = (commentId: string) => {
    setReportingCommentId(commentId)
    setShowReportModal(true)
  }

  const handleReportSubmit = (reason: string, description: string) => {
    // 실제 API 연동시 여기에 신고 로직 추가
    console.log('Report submitted:', {
      commentId: reportingCommentId,
      reason,
      description
    })
    
    // 신고 완료 알림
    alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.')
    
    // 모달 닫기
    setShowReportModal(false)
    setReportingCommentId(null)
  }

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // 로컬에서 댓글 추가 (실제 API 연동 전까지)
      const newCommentObj = {
        id: Date.now().toString(),
        body: newComment,
        createdAt: new Date().toISOString(),
        user: {
          username: user?.username || '그로우썸',
          avatar: '/profile_growsome.png'
        },
        replies: [],
        likeCount: 0,
        isLiked: false,
        isEdited: false
      }
      setLocalComments(prev => [newCommentObj, ...prev])
      setNewComment('')
      
      // 컨텐츠의 댓글 수도 업데이트
      if (content) {
        setContent({
          ...content,
          commentCount: content.commentCount + 1
        })
      }
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
          <div className="mb-4 flex items-center justify-between">
            <Link 
              href={`/blog?category=${content.category?.slug}`}
              className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {content.category?.name}
            </Link>
            
            {/* 관리자 편집 버튼 */}
            {!authLoading && user?.isAdmin && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors text-sm"
                  title="글 편집"
                >
                  <Edit className="w-4 h-4" />
                  <span>편집</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm"
                  title="글 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>삭제</span>
                </button>
              </div>
            )}
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
              {/* 그로우썸 고정 프로필 */}
              <Image
                src="/profile_growsome.png"
                alt="그로우썸"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <div className="font-semibold text-gray-900">
                  그로우썸
                </div>
                {user?.isAdmin && (
                  <div className="text-xs text-green-600 font-medium">
                    관리자로 로그인됨
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{content.viewCount}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{content.likeCount}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{content.commentCount}</span>
              </span>
              <span>{formatDate(content.publishedAt!)}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={content.thumbnailUrl || getDefaultImageUrl(content.category?.name, content.title, 800, 400)}
              alt={content.title}
              fill
              sizes="(max-width: 768px) 100vw, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            dangerouslySetInnerHTML={{ __html: content.contentBody }}
            className="leading-relaxed"
          />
        </div>

        {/* 좋아요 및 구독 버튼 */}
        <div className="flex items-center justify-center space-x-4 mb-8 py-6 border-t border-b border-gray-200">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              isLiked 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>좋아요 {content.likeCount + (isLiked ? 1 : 0)}</span>
          </button>
          
          <button
            onClick={handleSubscribe}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            <Bell className="w-5 h-5" />
            <span>구독하기</span>
          </button>
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
            <Image
              src="/profile_growsome.png"
              alt="그로우썸"
              width={64}
              height={64}
              className="rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                그로우썸
              </h3>
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
          
          {/* Comment Form - 로그인한 사용자만 */}
          {isLoggedIn ? (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성해주세요..."
                rows={4}
                className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  댓글 작성
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
              <p className="text-gray-600 mb-4">댓글을 작성하려면 로그인이 필요합니다.</p>
              <Link 
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                로그인하기
              </Link>
            </div>
          )}

          {/* Comments List */}
          {(content.comments && content.comments.length > 0) || localComments.length > 0 ? (
            <div className="space-y-6">
              {/* 로컬 댓글 먼저 표시 */}
              {localComments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={comment.user.avatar}
                      alt={comment.user.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {comment.user.username}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            새 댓글
                          </span>
                          {comment.isEdited && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                              수정됨
                            </span>
                          )}
                        </div>
                        {user?.isAdmin && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleCommentEdit(comment.id, comment.body)}
                              className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                              title="댓글 수정"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCommentDelete(comment.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="댓글 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* 댓글 내용 또는 수정 폼 */}
                      {editingCommentId === comment.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              취소
                            </button>
                            <button
                              onClick={() => handleCommentUpdate(comment.id)}
                              disabled={!editingText.trim()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              수정
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {comment.body}
                          </p>
                          
                          {/* 댓글 액션 버튼들 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleCommentLike(comment.id)}
                                className={`flex items-center space-x-1 text-sm transition-colors ${
                                  comment.isLiked 
                                    ? 'text-blue-600 hover:text-blue-700' 
                                    : 'text-gray-500 hover:text-blue-600'
                                }`}
                              >
                                <ThumbsUp className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                                <span>좋아요 {comment.likeCount}</span>
                              </button>
                            </div>
                            
                            {/* 신고 버튼 - 관리자가 아닌 경우만 표시 */}
                            {!user?.isAdmin && (
                              <button
                                onClick={() => handleCommentReport(comment.id)}
                                className="flex items-center space-x-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                                title="댓글 신고"
                              >
                                <Flag className="w-4 h-4" />
                                <span>신고</span>
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 기존 댓글들 */}
              {content.comments?.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start space-x-4">
                    {comment.user?.avatar ? (
                      <Image
                        src={comment.user.avatar}
                        alt={comment.user.username || ''}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm">👤</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {comment.user?.username || '익명'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        {user?.isAdmin && (
                          <button
                            onClick={() => handleCommentDelete(comment.id.toString())}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="댓글 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {comment.body}
                      </p>
                      
                      {/* 기존 댓글 액션 */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4">
                          {/* 기존 댓글에는 좋아요 기능 없음 */}
                        </div>
                        
                        {/* 신고 버튼 */}
                        {!user?.isAdmin && (
                          <button
                            onClick={() => handleCommentReport(comment.id.toString())}
                            className="flex items-center space-x-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                            title="댓글 신고"
                          >
                            <Flag className="w-4 h-4" />
                            <span>신고</span>
                          </button>
                        )}
                      </div>
                      
                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-4">
                              {reply.user?.avatar ? (
                                <Image
                                  src={reply.user.avatar}
                                  alt={reply.user.username || ''}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-gray-600 text-xs">👤</span>
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-gray-900 text-sm">
                                    {reply.user?.username || '익명'}
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
      {/* Back to Blog */}
      <div className="text-center py-8">
        <Link 
          href="/blog"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← 블로그 목록으로 돌아가기
        </Link>
      </div>
      {/* Related Posts */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            관련 글
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.length > 0 ? (
              relatedPosts.map((post) => (
                <Link 
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* 썸네일 이미지 */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.thumbnailUrl || getDefaultImageUrl(post.category?.name, post.title, 400, 200)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    {/* 카테고리 */}
                    {post.category && (
                      <div className="mb-3">
                        <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {post.category.name}
                        </span>
                      </div>
                    )}
                    
                    {/* 제목 */}
                    <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    
                    {/* 요약 */}
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    
                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(post.publishedAt!)}</span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.viewCount}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{post.likeCount}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-500 col-span-2 py-8">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-lg font-medium mb-2">관련 글을 찾을 수 없습니다</p>
                <p className="text-sm">이 카테고리에는 다른 글이 아직 없네요.</p>
              </div>
            )}
          </div>
        </div>
      </div>


      
      {/* 구독 모달 */}
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
      
      {/* 신고 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  )
}