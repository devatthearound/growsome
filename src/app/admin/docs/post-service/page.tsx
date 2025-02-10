'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const PostServiceDocs = () => {
  return (
    <DocsContainer>
      <Header>
        <h1>PostService 사용 가이드</h1>
        <p>블로그 포스트 관련 서비스 함수들의 사용법을 설명합니다.</p>
        <TestButton href="/admin/docs/post-service/test">
          🧪 함수 테스트 페이지
        </TestButton>
      </Header>

      <Section>
        <h2>함수 목록</h2>

        <ApiBlock>
          <h3>1. getCategories</h3>
          <Description>
            모든 카테고리 목록을 조회합니다.
          </Description>
          <CodeBlock>
            {`import { getCategories } from '@/services/postService';

// 사용 예시
const fetchCategories = async () => {
  try {
    const categories = await getCategories();
    console.log(categories); // PostCategory[] 타입의 배열 반환
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
  }
};`}
          </CodeBlock>
        </ApiBlock>

        <ApiBlock>
          <h3>2. getPosts</h3>
          <Description>
            포스트 목록을 조회합니다. 페이지네이션, 카테고리 필터, 태그 필터를 지원합니다.
          </Description>
          <CodeBlock>
            {`import { getPosts } from '@/services/postService';

// 기본 사용
const fetchPosts = async () => {
  const response = await getPosts();  // 기본값: page=1, limit=10
};

// 페이지네이션과 필터 적용
const fetchFilteredPosts = async () => {
  const response = await getPosts({
    categoryId: '1',
    page: 2,
    limit: 20,
    tag: 'react'
  });
  
  console.log(response.posts);      // 포스트 목록
  console.log(response.total);      // 전체 포스트 수
  console.log(response.hasMore);    // 다음 페이지 존재 여부
  console.log(response.totalPages); // 전체 페이지 수
};`}
          </CodeBlock>
        </ApiBlock>

        <ApiBlock>
          <h3>3. getPostById</h3>
          <Description>
            특정 포스트의 상세 정보를 ID로 조회합니다.
          </Description>
          <CodeBlock>
            {`import { getPostById } from '@/services/postService';

const fetchPostDetail = async () => {
  try {
    const post = await getPostById('1');
    console.log(post); // Post 타입의 객체 반환
  } catch (error) {
    console.error('포스트 조회 실패:', error);
  }
};`}
          </CodeBlock>
        </ApiBlock>

        <ApiBlock>
          <h3>인터페이스 정의</h3>
          <Description>
            서비스에서 사용되는 주요 타입들입니다.
          </Description>
          <CodeBlock>
            {`// 포스트 타입
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: number;
  category_id?: number;
  status: 'draft' | 'published' | 'private';
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  view_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// 카테고리 타입
interface PostCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
}

// 포스트 목록 조회 파라미터
interface PostListParams {
  categorySlug?: string;
  page?: number;
  limit?: number;
  tag?: string;
}`}
          </CodeBlock>
        </ApiBlock>
      </Section>
    </DocsContainer>
  );
};

const DocsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: #333;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const Section = styled.section`
  margin-bottom: 4rem;
  
  h2 {
    font-size: 1.8rem;
    color: #444;
    margin-bottom: 2rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #eee;
  }
`;

const ApiBlock = styled.div`
  margin-bottom: 3rem;
  
  h3 {
    font-size: 1.4rem;
    color: #666;
    margin-bottom: 1rem;
  }
`;

const CodeBlock = styled.pre`
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
  margin: 1rem 0;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const TestButton = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357abd;
  }
`;

export default PostServiceDocs; 