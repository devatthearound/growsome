'use client';

import React, { useState, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BlogNavigation from '@/components/blog/BlogNavigation';

interface Tag {
  name: string;
  count: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const TagsPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      
      // 모든 포스트에서 태그 추출 및 카운트
      const tagCounts: { [key: string]: number } = {};
      
      data.posts.forEach((post: any) => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });

      // 태그를 카운트 순으로 정렬
      const sortedTags = Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      setTags(sortedTags);
    } catch (error) {
      console.error('태그 로딩 중 에러:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('카테고리 로딩 중 에러:', error);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchCategories();
  }, []);

  const getTagSize = (count: number) => {
    const maxCount = Math.max(...tags.map(tag => tag.count));
    const minSize = 0.8;
    const maxSize = 2.0;
    return minSize + (count / maxCount) * (maxSize - minSize);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogNavigation 
          categories={categories}
          onSearch={() => {}}
          onCategoryChange={() => {}}
        />
      </Suspense>
      <Container>
        <Header>
          <h1>태그</h1>
          <SubTitle>다양한 태그로 원하는 내용을 빠르게 찾아보세요</SubTitle>
        </Header>

        {tags.length > 0 && (
          <TagCloud
            as={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tags.map((tag, index) => (
              <TagItem
                key={tag.name}
                as={motion.div}
                variants={itemVariants}
                $size={getTagSize(tag.count)}
                $selected={selectedTag === tag.name}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTag(selectedTag === tag.name ? '' : tag.name)}
              >
                <Link href={`/blog?tag=${encodeURIComponent(tag.name)}`}>
                  <TagName>#{tag.name}</TagName>
                  <TagCount>{tag.count}</TagCount>
                </Link>
              </TagItem>
            ))}
          </TagCloud>
        )}

        {selectedTag && (
          <SelectedTagInfo
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SelectedTagTitle>
              선택된 태그: <span>#{selectedTag}</span>
            </SelectedTagTitle>
            <ViewPostsButton>
              <Link href={`/blog?tag=${encodeURIComponent(selectedTag)}`}>
                이 태그의 포스트 보기
              </Link>
            </ViewPostsButton>
          </SelectedTagInfo>
        )}

        {tags.length === 0 && (
          <EmptyState>
            <EmptyIcon>🏷️</EmptyIcon>
            <EmptyTitle>아직 태그가 없습니다</EmptyTitle>
            <EmptyDescription>
              블로그 포스트에 태그를 추가하면 여기에 표시됩니다.
            </EmptyDescription>
          </EmptyState>
        )}

        <TagStats>
          <StatsCard>
            <StatsNumber>{tags.length}</StatsNumber>
            <StatsLabel>총 태그 수</StatsLabel>
          </StatsCard>
          <StatsCard>
            <StatsNumber>{tags.reduce((sum, tag) => sum + tag.count, 0)}</StatsNumber>
            <StatsLabel>태그 사용 횟수</StatsLabel>
          </StatsCard>
          <StatsCard>
            <StatsNumber>
              {tags.length > 0 ? Math.max(...tags.map(tag => tag.count)) : 0}
            </StatsNumber>
            <StatsLabel>가장 많이 사용된 태그</StatsLabel>
          </StatsCard>
        </TagStats>
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

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 20px;
`;

const TagItem = styled.div<{ $size: number; $selected: boolean }>`
  cursor: pointer;
  transition: all 0.3s ease;
  
  a {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 1rem;
    background: ${props => props.$selected ? '#514FE4' : 'white'};
    color: ${props => props.$selected ? 'white' : '#333'};
    border-radius: 50px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transform: scale(${props => props.$size});
    
    &:hover {
      background: ${props => props.$selected ? '#4338ca' : '#514FE4'};
      color: white;
      box-shadow: 0 4px 20px rgba(81, 79, 228, 0.3);
    }
  }
`;

const TagName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const TagCount = styled.span`
  font-size: 0.7rem;
  opacity: 0.8;
  margin-top: 0.2rem;
`;

const SelectedTagInfo = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #514FE4, #6366f1);
  border-radius: 16px;
  margin-bottom: 3rem;
  color: white;
`;

const SelectedTagTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  
  span {
    color: #e0e7ff;
  }
`;

const ViewPostsButton = styled.div`
  a {
    display: inline-block;
    padding: 0.8rem 2rem;
    background: white;
    color: #514FE4;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
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

const TagStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
`;

const StatsCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const StatsNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #514FE4;
  margin-bottom: 0.5rem;
`;

const StatsLabel = styled.div`
  color: #666;
  font-weight: 500;
`;

export default TagsPage;