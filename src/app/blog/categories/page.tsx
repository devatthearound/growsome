'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BlogNavigation from '@/components/blog/BlogNavigation';

interface Category {
  id: string; // UUID
  name: string;
  slug: string;
  description?: string;
  post_count?: number;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/blog/categories');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Safely handle the response data
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
        console.warn('Invalid categories data received:', data);
      }
    } catch (error) {
      console.error('카테고리 로딩 중 에러:', error);
      setError('카테고리를 불러올 수 없습니다. 나중에 다시 시도해주세요.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <BlogNavigation 
          categories={[]}
          onSearch={() => {}}
          onCategoryChange={() => {}}
        />
        <Container>
          <Header>
            <h1>카테고리</h1>
            <SubTitle>관심 있는 주제별로 포스트를 찾아보세요</SubTitle>
          </Header>
          <LoadingState>
            <LoadingSpinner />
            <LoadingText>카테고리를 불러오는 중...</LoadingText>
          </LoadingState>
        </Container>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <BlogNavigation 
          categories={[]}
          onSearch={() => {}}
          onCategoryChange={() => {}}
        />
        <Container>
          <Header>
            <h1>카테고리</h1>
            <SubTitle>관심 있는 주제별로 포스트를 찾아보세요</SubTitle>
          </Header>
          <ErrorState>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorTitle>오류가 발생했습니다</ErrorTitle>
            <ErrorDescription>{error}</ErrorDescription>
            <RetryButton onClick={fetchCategories}>
              다시 시도
            </RetryButton>
          </ErrorState>
        </Container>
      </>
    );
  }

  return (
    <>
      <BlogNavigation 
        categories={categories}
        onSearch={() => {}}
        onCategoryChange={() => {}}
      />
      <Container>
        <Header>
          <h1>카테고리</h1>
          <SubTitle>관심 있는 주제별로 포스트를 찾아보세요</SubTitle>
        </Header>

        {categories && categories.length > 0 ? (
          <CategoriesGrid
            as={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map(category => (
              <CategoryCard
                key={category.id}
                as={motion.div}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/blog?category=${category.id}`}>
                  <CategoryIcon>
                    {category.name ? category.name.charAt(0) : '?'}
                  </CategoryIcon>
                  <CategoryInfo>
                    <CategoryName>{category.name || 'Unknown Category'}</CategoryName>
                    {category.description && (
                      <CategoryDescription>{category.description}</CategoryDescription>
                    )}
                    <PostCount>
                      {category.post_count || 0}개의 포스트
                    </PostCount>
                  </CategoryInfo>
                </Link>
              </CategoryCard>
            ))}
          </CategoriesGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>📁</EmptyIcon>
            <EmptyTitle>아직 카테고리가 없습니다</EmptyTitle>
            <EmptyDescription>
              첫 번째 블로그 포스트를 작성하고 카테고리를 만들어보세요.
            </EmptyDescription>
          </EmptyState>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 1rem;
  }
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const CategoryCard = styled.article`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const CategoryIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #514FE4, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
`;

const CategoryInfo = styled.div`
  width: 100%;
`;

const CategoryName = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 1rem 0;
  font-weight: 600;
`;

const CategoryDescription = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const PostCount = styled.div`
  color: #514FE4;
  font-weight: 500;
  font-size: 0.9rem;
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
  color: #333;
  margin-bottom: 1rem;
`;

const EmptyDescription = styled.p`
  color: #666;
  font-size: 1rem;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
`;

// Loading state styles
const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #514FE4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1rem;
`;

// Error state styles
const ErrorState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  color: #d73527;
  margin-bottom: 1rem;
`;

const ErrorDescription = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
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

export default CategoriesPage;