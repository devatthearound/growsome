'use client';

import React, { useState, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BlogNavigation from '@/components/blog/BlogNavigation';

// GraphQL 쿼리
const GET_CATEGORIES_QUERY = `
  query GetCategories {
    categories(isVisible: true) {
      id
      name
      slug
      description
      contentCount
      sortOrder
    }
  }
`;

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  contentCount: number;
  sortOrder: number;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // GraphQL 요청 함수
  const graphqlRequest = async (query: string, variables: any = {}) => {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching categories with GraphQL...');
      
      const data = await graphqlRequest(GET_CATEGORIES_QUERY);
      
      console.log('Categories GraphQL response:', data);
      
      if (data && Array.isArray(data.categories)) {
        // 정렬 순서에 따라 정렬
        const sortedCategories = data.categories.sort((a: Category, b: Category) => 
          a.sortOrder - b.sortOrder
        );
        setCategories(sortedCategories);
      } else {
        setCategories([]);
        console.warn('Invalid categories data received:', data);
      }
    } catch (error) {
      console.error('카테고리 로딩 중 에러:', error);
      setError(error instanceof Error ? error.message : '카테고리를 불러올 수 없습니다. 나중에 다시 시도해주세요.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 카테고리 아이콘 매핑
  const getCategoryIcon = (name: string) => {
    const iconMap: { [key: string]: string } = {
      '기술': '💻',
      '비즈니스': '💼',
      '디자인': '🎨',
      '라이프스타일': '🌟',
      'Technology': '💻',
      'Business': '💼',
      'Design': '🎨',
      'Lifestyle': '🌟',
      'Programming': '⌨️',
      'Marketing': '📊',
      'Travel': '✈️',
      'Food': '🍽️',
      'Health': '💪',
      'Education': '📚'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    
    return '📝'; // 기본 아이콘
  };

  // 카테고리 색상 매핑
  const getCategoryColor = (index: number) => {
    const colors = [
      { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
      { bg: '#ecfdf5', text: '#059669', border: '#6ee7b7' },
      { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
      { bg: '#ede9fe', text: '#7c3aed', border: '#c4b5fd' },
      { bg: '#fce7f3', text: '#db2777', border: '#f9a8d4' },
      { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' }
    ];
    
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <PageContainer>
        <Suspense fallback={<div>Loading...</div>}>
          <BlogNavigation 
            categories={[]}
            onCategoryChange={() => {}}
            onSearch={() => {}}
          />
        </Suspense>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>카테고리를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Suspense fallback={<div>Loading...</div>}>
          <BlogNavigation 
            categories={[]}
            onCategoryChange={() => {}}
            onSearch={() => {}}
          />
        </Suspense>
        <ErrorContainer>
          <ErrorIcon>😅</ErrorIcon>
          <ErrorTitle>오류가 발생했습니다</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={fetchCategories}>다시 시도</RetryButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogNavigation 
          categories={categories}
          onCategoryChange={() => {}}
          onSearch={() => {}}
        />
      </Suspense>
      
      <MainContent>
        <Header>
          <Title>카테고리</Title>
          <Subtitle>관심 있는 주제의 글들을 찾아보세요</Subtitle>
        </Header>

        {categories.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📝</EmptyIcon>
            <EmptyTitle>카테고리가 없습니다</EmptyTitle>
            <EmptyDescription>아직 생성된 카테고리가 없습니다.</EmptyDescription>
          </EmptyState>
        ) : (
          <CategoriesGrid>
            {categories.map((category, index) => {
              const colors = getCategoryColor(index);
              return (
                <CategoryCard
                  key={category.id}
                  as={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" 
                  }}
                  colors={colors}
                >
                  <Link href={`/blog?category=${category.id}`}>
                    <CategoryIcon>{getCategoryIcon(category.name)}</CategoryIcon>
                    <CategoryName>{category.name}</CategoryName>
                    {category.description && (
                      <CategoryDescription>{category.description}</CategoryDescription>
                    )}
                    <CategoryStats>
                      <PostCount>{category.contentCount}개의 포스트</PostCount>
                      <ViewAllText>전체 보기 →</ViewAllText>
                    </CategoryStats>
                  </Link>
                </CategoryCard>
              );
            })}
          </CategoriesGrid>
        )}

        <CallToAction>
          <CTATitle>더 많은 콘텐츠를 찾고 계신가요?</CTATitle>
          <CTADescription>
            새로운 포스트가 정기적으로 업데이트됩니다. 
            관심 있는 카테고리를 팔로우하고 최신 소식을 받아보세요.
          </CTADescription>
          <CTAButton href="/blog">
            모든 포스트 보기
          </CTAButton>
        </CallToAction>
      </MainContent>
    </PageContainer>
  );
};

// 스타일드 컴포넌트들
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CategoryCard = styled.div<{ colors: { bg: string; text: string; border: string } }>`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  
  &:hover {
    border-color: ${props => props.colors.border};
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
`;

const CategoryIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const CategoryName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const CategoryDescription = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const CategoryStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const PostCount = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ViewAllText = styled.span`
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 600;
`;

const CallToAction = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 400px;
`;

const RetryButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #2563eb;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  color: #6b7280;
  max-width: 400px;
  margin: 0 auto;
`;

export default CategoriesPage;
