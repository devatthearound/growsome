"use client"
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
}

export default function BlogPage() {
  const samplePosts: BlogPost[] = [
    {
      id: "1",
      title: "Next.js와 TypeScript로 블로그 만들기",
      description: "현대적인 웹 개발 스택을 활용하여 개인 블로그를 만드는 방법을 소개합니다.",
      date: "2024.03.15",
      category: "개발",
      readTime: "5분"
    },
    {
      id: "2",
      title: "AI 프롬프트 엔지니어링 기초",
      description: "ChatGPT와 같은 AI 모델을 효과적으로 활용하기 위한 프롬프트 작성법을 알아봅니다.",
      date: "2024.03.14",
      category: "AI",
      readTime: "7분"
    },
    {
      id: "3",
      title: "프리랜서 개발자 생존기",
      description: "1년간의 프리랜서 개발자 경험과 노하우를 공유합니다.",
      date: "2024.03.13",
      category: "커리어",
      readTime: "10분"
    }
  ];

  return (
    <Container>
      <Header>
        <h1>블로그</h1>
        <p>개발, AI, 그리고 디지털 노마드 라이프스타일</p>
      </Header>
      <BlogGrid>
        {samplePosts.map((post) => (
          <BlogCard 
            key={post.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryTag>{post.category}</CategoryTag>
            <Title>{post.title}</Title>
            <Description>{post.description}</Description>
            <MetaInfo>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime} 읽기</span>
            </MetaInfo>
          </BlogCard>
        ))}
      </BlogGrid>
    </Container>
  );
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 150px 20px 100px 20px;
  
  @media (min-width: 700px) {
    padding: 150px 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  p {
    font-size: 1.1rem;
    color: #666;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px 0;
`;

const BlogCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  border: 1px solid #eaeaea;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ddd;
  }
`;

const CategoryTag = styled.span`
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #666;
  display: inline-block;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 12px;
  color: #333;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #888;

  span {
    &:nth-child(2) {
      color: #ddd;
    }
  }
`; 