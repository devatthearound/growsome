'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import BlogNavigation from '@/components/blog/BlogNavigation';

// ✅ FIXED: Updated BlogPost interface with correct types
interface BlogPost {
  id: string; // ← Changed from number to string (UUID)
  title: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  category_id: string; // ← Changed to string for consistency
  category_name?: string;
  tags: string[];
  published_at: string;
  view_count?: number;
  status: 'draft' | 'published';
  author?: {
    name: string;
    avatar?: string;
  };
  seo_title?: string;
  seo_description?: string;
}

// ✅ FIXED: Updated BlogCategory interface
interface BlogCategory {
  id: string; // ← Changed from number to string
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // HTML 제거 함수
  const stripHTML = (html: string) => {
    if (typeof window !== 'undefined') {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || '';
    }
    // 서버 사이드에서는 기본적인 HTML 태그 제거
    return html.replace(/<[^>]*>/g, '');
  };

  // 텍스트 자르기 함수
  const truncateText = (text: string, maxLength: number = 150) => {
    const cleanText = stripHTML(text);
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength).trim() + '...';
  };

  // 기본 이미지 선택 함수
  const getDefaultImage = (title: string, categoryName?: string) => {
    const images = {
      tech: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
      programming: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
      design: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
      business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      lifestyle: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
      food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
      health: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      education: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
      science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
      art: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      music: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
      nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      default: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop'
    };

    // 카테고리에 따라 이미지 선택
    if (categoryName) {
      const category = categoryName.toLowerCase();
      if (category.includes('기술') || category.includes('tech')) return images.tech;
      if (category.includes('프로그래밍') || category.includes('code')) return images.programming;
      if (category.includes('디자인') || category.includes('design')) return images.design;
      if (category.includes('비즈니스') || category.includes('business')) return images.business;
      if (category.includes('라이프스타일') || category.includes('lifestyle')) return images.lifestyle;
      if (category.includes('여행') || category.includes('travel')) return images.travel;
      if (category.includes('음식') || category.includes('food')) return images.food;
      if (category.includes('건강') || category.includes('health')) return images.health;
      if (category.includes('교육') || category.includes('education')) return images.education;
      if (category.includes('과학') || category.includes('science')) return images.science;
      if (category.includes('예술') || category.includes('art')) return images.art;
      if (category.includes('음악') || category.includes('music')) return images.music;
      if (category.includes('스포츠') || category.includes('sport')) return images.sports;
      if (category.includes('자연') || category.includes('nature')) return images.nature;
    }

    // 제목에 따라 이미지 선택
    const titleLower = title.toLowerCase();
    if (titleLower.includes('react') || titleLower.includes('next') || titleLower.includes('javascript')) return images.programming;
    if (titleLower.includes('디자인') || titleLower.includes('ui') || titleLower.includes('ux')) return images.design;
    if (titleLower.includes('비즈니스') || titleLower.includes('마케팅')) return images.business;
    if (titleLower.includes('여행') || titleLower.includes('휴가')) return images.travel;
    if (titleLower.includes('음식') || titleLower.includes('요리')) return images.food;
    if (titleLower.includes('건강') || titleLower.includes('운동')) return images.health;
    if (titleLower.includes('공부') || titleLower.includes('배우기')) return images.education;

    return images.default;
  };

  const fetchPosts = async (params: { search?: string; category?: string; tag?: string } = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append('search', params.search);
      if (params.category && params.category !== 'all') searchParams.append('categoryId', params.category);
      if (params.tag) searchParams.append('tag', params.tag);
      
      console.log('Fetching posts with params:', params); // Debug log
      
      const response = await fetch(`/api/blog/posts?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('Posts API response:', data); // Debug log
      
      if (data.success) {
        // ✅ ADDED: Validate that posts have UUID format IDs
        const validPosts = (data.posts || []).filter((post: BlogPost) => {
          if (!post.id || typeof post.id !== 'string') {
            console.warn('Invalid post ID found:', post);
            return false;
          }
          return true;
        });
        
        setPosts(validPosts);
        setFilteredPosts(validPosts);
      } else {
        console.warn('Invalid posts data received:', data);
        setPosts([]);
        setFilteredPosts([]);
        setError(data.error || '포스트를 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error('포스트 로딩 중 에러:', error);
      setPosts([]);
      setFilteredPosts([]);
      setError('포스트를 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();
      console.log('Categories API response:', data); // Debug log
      setCategories(data.categories || []);
    } catch (error) {
      console.error('카테고리 로딩 중 에러:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // URL에서 쿼리 파라미터 읽기
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category') || 'all';
    const searchParam = urlParams.get('search') || '';
    const tagParam = urlParams.get('tag') || '';
    
    setSelectedCategory(categoryParam);
    setSearchQuery(searchParam);
    
    // API 호출로 필터링된 데이터 가져오기
    fetchPosts({
      search: searchParam,
      category: categoryParam,
      tag: tagParam
    });
  }, []);

  const updateURL = (params: { search?: string; category?: string; tag?: string }) => {
    const url = new URL(window.location.href);
    
    if (params.search) {
      url.searchParams.set('search', params.search);
    } else {
      url.searchParams.delete('search');
    }
    
    if (params.category && params.category !== 'all') {
      url.searchParams.set('category', params.category);
    } else {
      url.searchParams.delete('category');
    }
    
    if (params.tag) {
      url.searchParams.set('tag', params.tag);
    } else {
      url.searchParams.delete('tag');
    }
    
    window.history.pushState({}, '', url.toString());
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateURL({ search: query, category: selectedCategory });
    fetchPosts({ search: query, category: selectedCategory });
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateURL({ search: searchQuery, category: categoryId });
    fetchPosts({ search: searchQuery, category: categoryId });
  };

  return (
    <>
      <BlogNavigation 
        categories={categories}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />
      <BlogContainer>
        <Header>
          <div>
            <h1>블로그</h1>
            <PostCount>
              {searchQuery ? `"${searchQuery}" 검색 결과: ` : ''}
              총 {filteredPosts.length}개의 포스트
            </PostCount>
          </div>
          <Link href="/write">
            <WriteButton>
              ✏️ 글쓰기
            </WriteButton>
          </Link>
        </Header>

        <PostGrid>
          {loading ? (
            // 로딩 상태
            Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index}>
                <div className="skeleton-image" />
                <div className="skeleton-content">
                  <div className="skeleton-title" />
                  <div className="skeleton-excerpt" />
                  <div className="skeleton-excerpt" />
                  <div className="skeleton-excerpt" />
                  <div className="skeleton-meta">
                    <div className="skeleton-date" />
                    <div className="skeleton-tags">
                      <div className="skeleton-tag" />
                      <div className="skeleton-tag" />
                    </div>
                  </div>
                </div>
              </LoadingSkeleton>
            ))
          ) : error ? (
            // 에러 상태
            <ErrorState>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorTitle>오류가 발생했습니다</ErrorTitle>
              <ErrorDescription>{error}</ErrorDescription>
              <RetryButton onClick={() => fetchPosts({ search: searchQuery, category: selectedCategory })}>
                다시 시도
              </RetryButton>
            </ErrorState>
          ) : filteredPosts.length > 0 ? (
            // 포스트 목록
            filteredPosts.map(post => {
              console.log(`링크 생성: /blog/${post.id} (제목: ${post.title})`);
              return (
                <PostCard key={post.id}>
                  {/* ✅ FIXED: Using actual UUID from post.id */}
                  <Link href={`/blog/${post.id}`}>
                  <PostImage 
                    src={post.featured_image || getDefaultImage(post.title, post.category_name)} 
                    alt={post.title} 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getDefaultImage(post.title, post.category_name);
                    }}
                  />
                  <PostContent>
                    <PostTitle>{post.title}</PostTitle>
                    <PostExcerpt>
                      {post.excerpt 
                        ? truncateText(post.excerpt, 120)
                        : truncateText(post.content, 120)
                      }
                    </PostExcerpt>
                    <PostMeta>
                      <PostDate>
                        {new Date(post.published_at || '').toLocaleDateString('ko-KR')}
                      </PostDate>
                      <TagList>
                        {(post.tags || []).map((tag, index) => (
                          <Tag key={index}>#{tag}</Tag>
                        ))}
                      </TagList>
                    </PostMeta>
                  </PostContent>
                  </Link>
                </PostCard>
              );
            })
          ) : (
            // 빈 상태
            <EmptyState>
              <EmptyIcon>📄</EmptyIcon>
              <EmptyTitle>포스트가 없습니다</EmptyTitle>
              <EmptyDescription>
                {searchQuery ? `"${searchQuery}" 검색 결과가 없습니다.` : '첫 번째 블로그 포스트를 작성해보세요!'}
              </EmptyDescription>
            </EmptyState>
          )}
        </PostGrid>
      </BlogContainer>
    </>
  );
};

const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  h1 {
    font-size: 2.5rem;
    color: #333;
    margin: 0;
  }
`;

const WriteButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #4338ca;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    align-self: stretch;
    justify-content: center;
  }
`;

const PostCount = styled.div`
  color: #666;
  font-size: 1rem;
  font-weight: 500;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PostCard = styled.article`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: #e0e0e0;
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${PostCard}:hover & {
    transform: scale(1.05);
  }
`;

const PostContent = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const PostTitle = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  
  ${PostCard}:hover & {
    color: #514FE4;
  }
  
  transition: color 0.3s ease;
`;

const PostExcerpt = styled.p`
  color: #666;
  margin: 0 0 1.25rem 0;
  line-height: 1.6;
  font-size: 0.95rem;
  min-height: 3rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const PostDate = styled.span`
  color: #888;
  font-size: 0.875rem;
  font-weight: 500;
`;

const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  color: #514FE4;
  background: rgba(81, 79, 228, 0.1);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(81, 79, 228, 0.2);
    transform: translateY(-1px);
  }
`;


// 로딩 스켈레톤 컴포넌트
const LoadingSkeleton = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  
  .skeleton-image {
    width: 100%;
    height: 220px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  .skeleton-content {
    padding: 1.5rem;
    
    .skeleton-title {
      height: 1.25rem;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 0.75rem;
      width: 80%;
    }
    
    .skeleton-excerpt {
      height: 0.95rem;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      
      &:nth-child(2) { width: 100%; }
      &:nth-child(3) { width: 90%; }
      &:nth-child(4) { width: 60%; }
    }
    
    .skeleton-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 1.25rem;
      
      .skeleton-date {
        height: 0.875rem;
        width: 80px;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 4px;
      }
      
      .skeleton-tags {
        display: flex;
        gap: 0.5rem;
        
        .skeleton-tag {
          height: 1.5rem;
          width: 60px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 12px;
        }
      }
    }
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

// 빈 상태 컴포넌트
const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
`;

// 에러 상태 컴포너트
const ErrorState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #d73527;
`;

const ErrorDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 2rem;
  color: #666;
`;

const RetryButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #4338ca;
  }
`;

export default BlogPage;
