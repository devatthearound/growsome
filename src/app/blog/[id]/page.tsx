'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Clock, 
  Eye, 
  ChevronUp,
  Copy,
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Building2,
  Calendar,
  Tag
} from 'lucide-react';

// BlogPost 인터페이스
interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category_id?: string;
  status: string;
  published_at?: string;
  view_count?: number;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  reading_time?: number;
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

// Reading Progress Component
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Author Info Component
const AuthorInfo = ({ author }: { author: any }) => {
  if (!author) return null;

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">저자 정보</h3>
      
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500">
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
            {(author.full_name || author.email || 'A')[0].toUpperCase()}
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-2">{author.full_name || 'Anonymous'}</h4>
          
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <User size={14} />
            <span>{author.email || 'author@example.com'}</span>
          </div>
          
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            마케팅 트렌드와 인사이트를 전하는 블로거입니다.
          </p>
          
          <button className="text-sm bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition-colors">
            프로필 보기
          </button>
        </div>
      </div>
    </div>
  );
};

// Related Posts Component
const RelatedPosts = ({ currentPostId }: { currentPostId: string }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // 실제 API에서 관련 포스트들을 가져오기
        const response = await fetch('/api/blog/posts?limit=4');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.posts) {
            // 현재 포스트를 제외한 다른 포스트들
            const filteredPosts = data.posts
              .filter((post: any) => post.id !== currentPostId)
              .slice(0, 2)
              .map((post: any) => ({
                id: post.id,
                title: post.title,
                excerpt: post.excerpt || post.content?.substring(0, 100) + '...' || '',
                thumbnail: post.featured_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop&auto=format',
                readTime: post.reading_time ? `${post.reading_time}분` : '5분',
                publishedAt: post.published_at ? new Date(post.published_at).toLocaleDateString('ko-KR') : '최근'
              }));
            
            setRelatedPosts(filteredPosts);
          }
        } else {
          // API 실패 시 기본 데이터 사용
          setRelatedPosts([
            {
              id: 'mock-1',
              title: 'Next.js와 React로 현대적인 웹앱 구축하기',
              excerpt: 'Next.js의 최신 기능들을 활용해서 현대적인 웹 애플리케이션을 만드는 방법...',
              thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&auto=format',
              readTime: '7분',
              publishedAt: '2일 전'
            },
            {
              id: 'mock-2', 
              title: 'AI 도구를 활용한 개발 효율성 향상',
              excerpt: 'AI 도구들을 개발 프로세스에 통합하여 생산성을 높이는 실용적인 방법들...',
              thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&auto=format',
              readTime: '5분',
              publishedAt: '5일 전'
            }
          ]);
        }
      } catch (error) {
        console.error('관련 포스트 로딩 실패:', error);
        // 에러 시 빈 배열로 설정
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId]);

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">관련 글</h3>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
              <div className="relative aspect-video bg-gray-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : relatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedPosts.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-lg transition-all">
                <div className="relative aspect-video">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">관련 글이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default function BlogPostContent() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 포스트 데이터 로드
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/blog/posts/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.post) {
          setPost(data.post);
        } else {
          throw new Error(data.error || '포스트 데이터를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('포스트 로딩 중 에러:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // HTML 콘텐츠를 안전하게 렌더링하기 위한 처리
  const getSafeHTML = (htmlContent: string) => {
    return DOMPurify.sanitize(htmlContent);
  };

  // 수정하기 버튼 클릭 핸들러
  const handleEdit = () => {
    router.push(`/write?edit=${id}`);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  // 삭제 확인
  const confirmDelete = async () => {
    if (!post) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blog/posts/${post.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('포스트가 삭제되었습니다.');
        router.push('/blog');
      } else {
        alert('삭제 실패: ' + data.error);
      }
    } catch (error) {
      console.error('삭제 중 오류:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 삭제 취소
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // 스크롤 투 탑
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 링크 복사
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다!');
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <ReadingProgress />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">포스트를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <ReadingProgress />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 포스트 없음
  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <ReadingProgress />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-4xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">포스트를 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-4">요청하신 포스트가 존재하지 않습니다.</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <ReadingProgress />

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-40">
        <Link href="/blog" className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:shadow-xl transition-all">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
      </div>

      {/* Floating Action Buttons - PC: 우측, 모바일: 하단 */}
      {/* PC (md 이상) */}
      <div className="hidden md:flex fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex-col gap-3">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`w-12 h-12 rounded-full shadow-lg transition-all hover:shadow-xl ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          title="좋아요"
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} className="mx-auto" />
        </button>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`w-12 h-12 rounded-full shadow-lg transition-all hover:shadow-xl ${
            isBookmarked ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          title="북마크"
        >
          <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} className="mx-auto" />
        </button>
        <button
          onClick={copyToClipboard}
          className="w-12 h-12 rounded-full shadow-lg bg-white text-gray-600 hover:bg-gray-50 hover:shadow-xl transition-all"
          title="링크 복사"
        >
          <Copy size={20} className="mx-auto" />
        </button>
        <button
          onClick={handleEdit}
          className="w-12 h-12 rounded-full shadow-lg bg-green-500 text-white hover:bg-green-600 hover:shadow-xl transition-all"
          title="수정하기"
        >
          <Edit size={20} className="mx-auto" />
        </button>
        <button
          onClick={handleDelete}
          className="w-12 h-12 rounded-full shadow-lg bg-red-500 text-white hover:bg-red-600 hover:shadow-xl transition-all"
          title="삭제"
        >
          <Trash2 size={20} className="mx-auto" />
        </button>
      </div>

      {/* 모바일 (md 미만) */}
      <div className="flex md:hidden fixed bottom-0 left-0 w-full z-40 bg-white/90 border-t border-gray-200 py-3 flex-row justify-center gap-4 shadow-xl">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`w-12 h-12 rounded-full shadow transition-all ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          title="좋아요"
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} className="mx-auto" />
        </button>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`w-12 h-12 rounded-full shadow transition-all ${
            isBookmarked ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          title="북마크"
        >
          <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} className="mx-auto" />
        </button>
        <button
          onClick={copyToClipboard}
          className="w-12 h-12 rounded-full shadow transition-all bg-white text-gray-600 hover:bg-gray-100"
          title="링크 복사"
        >
          <Copy size={20} className="mx-auto" />
        </button>
        <button
          onClick={handleEdit}
          className="w-12 h-12 rounded-full shadow transition-all bg-green-500 text-white hover:bg-green-600"
          title="수정하기"
        >
          <Edit size={20} className="mx-auto" />
        </button>
        <button
          onClick={handleDelete}
          className="w-12 h-12 rounded-full shadow transition-all bg-red-500 text-white hover:bg-red-600"
          title="삭제"
        >
          <Trash2 size={20} className="mx-auto" />
        </button>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-lg bg-white text-gray-600 hover:bg-gray-50 hover:shadow-xl transition-all"
        >
          <ChevronUp size={20} className="mx-auto" />
        </button>
      )}

      <div className="w-full max-w-[1280px] mx-auto">
        {/* Header - Full Width within container */}
        <div className="w-full px-6 py-12">
          {/* Category & Tags */}
          <div className="flex items-center gap-3 mb-4">
            {post.blog_categories && (
              <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                {post.blog_categories.name}
              </span>
            )}
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {post.status === 'published' ? '발행됨' : '임시저장'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500">
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                  {(post.profiles?.full_name || 'A')[0].toUpperCase()}
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{post.profiles?.full_name || 'Anonymous'}</div>
                <div className="text-sm text-gray-500">
                  {post.profiles?.email || 'author@example.com'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{post.reading_time || 5}분</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{post.view_count || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('ko-KR') : '날짜 없음'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image - Full Width within container */}
        {post.featured_image && (
          <div className="w-full mb-8">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Tags - Full Width within container */}
        <div className="w-full px-6 mb-8">
          <div className="flex gap-2 flex-wrap">
            {post.tags.map(tag => (
              <span 
                key={tag} 
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Two Column Layout from Content */}
        <div className="px-6 flex gap-8">
          {/* Main Content Column */}
          <div className="flex-1 max-w-4xl">
            {/* Content */}
            <article className="prose prose-lg max-w-none mb-16">
              <div
                className="content-html"
                dangerouslySetInnerHTML={{
                  __html: getSafeHTML(post.content)
                }}
              />
            </article>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-8 mb-12">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isLiked ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                  <span>좋아요</span>
                </button>
                
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isBookmarked ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                  <span>북마크</span>
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-full transition-all"
                >
                  <Copy size={20} />
                  <span>링크복사</span>
                </button>
                
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 text-green-600 hover:bg-green-50 px-4 py-2 rounded-full transition-all"
                >
                  <Edit size={20} />
                  <span>수정하기</span>
                </button>
                
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-full transition-all"
                >
                  <Trash2 size={20} />
                  <span>삭제</span>
                </button>
              </div>
            </div>

            {/* Related Posts */}
            <RelatedPosts currentPostId={post.id} />
          </div>
          
          {/* Sidebar Column */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-32 space-y-6">
              {/* Author Info */}
              <AuthorInfo author={post.profiles} />
              
              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center">
                <h4 className="font-bold text-gray-900 mb-2">주간 개발 인사이트</h4>
                <p className="text-sm text-gray-600 mb-4">매주 새로운 개발 트렌드와 인사이트를 받아보세요</p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  구독하기
                </button>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">포스트 정보</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">조회수</span>
                    <span className="font-medium">{post.view_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">읽기 시간</span>
                    <span className="font-medium">{post.reading_time || 5}분</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">발행일</span>
                    <span className="font-medium">{post.published_at ? new Date(post.published_at).toLocaleDateString('ko-KR') : '날짜 없음'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">상태</span>
                    <span className={`font-medium ${post.status === 'published' ? 'text-green-600' : 'text-orange-600'}`}>
                      {post.status === 'published' ? '발행됨' : '임시저장'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-400px w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">포스트 삭제</h3>
            <p className="text-gray-600 mb-4">정말로 이 포스트를 삭제하시겠습니까?</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 font-medium">"{post.title}"</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? '삭제 중...' : '삭제 확인'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for content */}
      <style jsx global>{`
        .content-html {
          line-height: 1.8;
          color: #374151;
          font-size: 1.125rem;
        }

        .content-html h1, 
        .content-html h2, 
        .content-html h3, 
        .content-html h4, 
        .content-html h5, 
        .content-html h6 {
          font-weight: 700;
          margin: 2.5rem 0 1rem 0;
          color: #1a1a1a;
          line-height: 1.3;
        }

        .content-html h1 { font-size: 2.5rem; margin: 3rem 0 1.5rem 0; }
        .content-html h2 { font-size: 2rem; margin: 2.5rem 0 1rem 0; }
        .content-html h3 { font-size: 1.5rem; }
        .content-html h4 { font-size: 1.25rem; }
        .content-html h5 { font-size: 1.125rem; }
        .content-html h6 { font-size: 1rem; }

        .content-html p {
          margin: 1.5rem 0;
          line-height: 1.8;
        }

        .content-html a {
          color: #3b82f6;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
        }

        .content-html a:hover {
          border-bottom-color: #3b82f6;
        }

        .content-html ul, 
        .content-html ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }

        .content-html li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        .content-html img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 2rem 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .content-html pre {
          background: #1f2937;
          color: #f9fafb;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 2rem 0;
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .content-html code {
          background: #f1f3f4;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
          color: #e11d48;
        }

        .content-html pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        .content-html blockquote {
          border-left: 4px solid #3b82f6;
          margin: 2rem 0;
          padding: 1rem 0 1rem 2rem;
          background: #f8faff;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #6b7280;
        }

        .content-html table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          overflow: hidden;
        }

        .content-html th, 
        .content-html td {
          border: 1px solid #e5e7eb;
          padding: 1rem;
          text-align: left;
        }

        .content-html th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .content-html tr:nth-child(even) {
          background: #f9fafb;
        }

        .content-html tr:hover {
          background: #e0f2fe;
        }

        .content-html strong {
          font-weight: 600;
          color: #1a1a1a;
        }

        .content-html em {
          font-style: italic;
        }

        .content-html ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }

        .content-html ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .content-html ul[data-type="taskList"] li input[type="checkbox"] {
          margin-top: 0.2rem;
          cursor: pointer;
        }

        .content-html hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 3rem 0;
        }

        .content-html mark {
          background: #fef3c7;
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
        }

        .content-html s {
          text-decoration: line-through;
          opacity: 0.7;
        }

        .content-html u {
          text-decoration: underline;
          text-decoration-color: #3b82f6;
        }

        @media (max-width: 768px) {
          .content-html {
            font-size: 1rem;
          }
          
          .content-html h1 { font-size: 2rem; }
          .content-html h2 { font-size: 1.75rem; }
          .content-html h3 { font-size: 1.375rem; }
        }
      `}</style>
    </div>
  );
}
