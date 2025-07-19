'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBlogContents, useBlogCategories } from '@/hooks/use-blog';
import { BlogContent } from '@/lib/graphql-client';
import { Calendar, User, Eye, Heart, MessageSquare, Tag } from 'lucide-react';

interface BlogListProps {
  initialCategoryId?: number;
  showCategories?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
}

const BlogList = ({ 
  initialCategoryId, 
  showCategories = true, 
  showPagination = true,
  itemsPerPage = 12 
}: BlogListProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(initialCategoryId);
  const [currentPage, setCurrentPage] = useState(1);

  const { contents, loading: contentsLoading, error: contentsError } = useBlogContents({
    first: itemsPerPage,
    categoryId: selectedCategoryId,
    status: 'PUBLISHED'
  });

  const { categories, loading: categoriesLoading } = useBlogCategories(true);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateHtml = (html: string, maxLength: number = 150) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  if (contentsError) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{contentsError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">블로그</h1>
        <p className="text-xl text-gray-600">
          최신 인사이트와 업계 동향을 확인해보세요
        </p>
      </div>

      {/* Categories Filter */}
      {showCategories && (
        <div className="mb-8">
          {categoriesLoading ? (
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategoryId(undefined)}
                className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                  selectedCategoryId === undefined
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                전체
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                    selectedCategoryId === category.id
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                  {category.contentCount !== undefined && (
                    <span className="ml-1 text-xs opacity-75">
                      ({category.contentCount})
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Loading */}
      {contentsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : contents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">게시된 블로그 포스트가 없습니다.</p>
          <Link 
            href="/blog/write"
            className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            첫 번째 포스트 작성하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contents.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && contents.length > 0 && (
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="px-4 py-2 bg-blue-500 text-white rounded">
              {currentPage}
            </span>
            <button
              disabled={contents.length < itemsPerPage}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 개별 블로그 카드 컴포넌트
interface BlogCardProps {
  post: BlogContent;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const truncateHtml = (html: string, maxLength: number = 150) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Featured Image */}
      {post.thumbnailUrl ? (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          {post.isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded">
                추천
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center">
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            {post.isFeatured && (
              <span className="bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded">
                추천
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Category */}
        {post.category && (
          <div className="flex items-center mb-3">
            <Tag size={14} className="text-blue-500 mr-1" />
            <span className="text-blue-500 text-sm font-medium">
              {post.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
          <Link 
            href={`/blog/${post.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {post.excerpt || truncateHtml(post.contentBody)}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <User size={12} className="mr-1" />
              <span>{post.author.username}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Eye size={12} className="mr-1" />
              <span>{post.viewCount}</span>
            </div>
            <div className="flex items-center">
              <Heart size={12} className="mr-1" />
              <span>{post.likeCount}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={12} className="mr-1" />
              <span>{post.commentCount}</span>
            </div>
          </div>
        </div>

        {/* Read More Link */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Link 
            href={`/blog/${post.slug}`}
            className="text-blue-500 hover:text-blue-600 font-medium text-xs transition-colors"
          >
            자세히 읽기 →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogList;
