'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  featured_image: string;
  category_id: number;
  tags: string[];
  published_at: string;
  status: 'published' | 'draft';
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      setPosts(data.posts.filter((post: BlogPost) => post.status === 'published'));
    } catch (error) {
      console.error('포스트 로딩 중 에러:', error);
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
    fetchPosts();
    fetchCategories();
  }, []);

  const filteredPosts = posts.filter(post => 
    selectedCategory === 'all' || 
    post.category_id === parseInt(selectedCategory)
  );

  return (
    <BlogContainer>
      <Header>
        <h1>블로그</h1>
        <CategoryFilter>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">전체 보기</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </CategoryFilter>
      </Header>

      <PostGrid>
        {filteredPosts.map(post => (
          <PostCard key={post.id}>
            <Link href={`/blog/${post.id}`}>
              {post.featured_image && (
                <PostImage src={post.featured_image} alt={post.title} />
              )}
              <PostContent>
                <PostTitle>{post.title}</PostTitle>
                <PostExcerpt>{post.excerpt}</PostExcerpt>
                <PostMeta>
                  <PostDate>
                    {new Date(post.published_at).toLocaleDateString('ko-KR')}
                  </PostDate>
                  <TagList>
                    {post.tags.map((tag, index) => (
                      <Tag key={index}>#{tag}</Tag>
                    ))}
                  </TagList>
                </PostMeta>
              </PostContent>
            </Link>
          </PostCard>
        ))}
      </PostGrid>
    </BlogContainer>
  );
};

const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    color: #333;
  }
`;

const CategoryFilter = styled.div`
  select {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const PostCard = styled.article`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PostContent = styled.div`
  padding: 1.5rem;
`;

const PostTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #333;
`;

const PostExcerpt = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostDate = styled.span`
  color: #888;
  font-size: 0.9rem;
`;

const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Tag = styled.span`
  color: #514FE4;
  font-size: 0.9rem;
`;

export default BlogPage;