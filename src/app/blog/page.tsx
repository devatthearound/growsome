"use client"
import React from 'react';
import styled from 'styled-components';

interface InsightPost {
  id: string;
  title: string;
  category: string;
  link: string;
}

const InsightPage = () => {
  const categories = {
    growth: {
      title: "성장과 학습",
      posts: [
        {
          id: "1",
          title: "AI 시대의 자기주도적 학습법",
          category: "성장",
          link: "/insights/self-learning"
        },
        {
          id: "2",
          title: "디지털 노마드의 성장 전략",
          category: "성장",
          link: "/insights/digital-nomad"
        },
      ]
    },
    business: {
      title: "비즈니스 전략",
      posts: [
        {
          id: "3",
          title: "프리랜서를 위한 수익화 전략",
          category: "비즈니스",
          link: "/insights/freelancer-monetization"
        },
        {
          id: "4",
          title: "AI 기반 비즈니스 로드맵 설계",
          category: "비즈니스",
          link: "/insights/ai-business"
        },
      ]
    },
    productivity: {
      title: "생산성과 시간관리",
      posts: [
        {
          id: "5",
          title: "AI 도구를 활용한 업무 자동화",
          category: "생산성",
          link: "/insights/ai-automation"
        },
        {
          id: "6",
          title: "효율적인 원격근무 시스템 구축",
          category: "생산성",
          link: "/insights/remote-work"
        },
      ]
    }
  };

  return (
    <Container>
      <Header>
        <SearchSection>
          <SearchTitle>
            똑똑하고 창의적인<br />
            그로우썸의 <span style={{ color: '#06ff01' }}>인사이트</span>
          </SearchTitle>
          {/*<SearchBox>
            <SearchInput 
              placeholder="원하는 인사이트를 검색해보세요" 
              type="text"
            />
            <SearchButton>검색</SearchButton>
          </SearchBox>*/}
        </SearchSection>
      </Header>

      <MainContent>
        <SectionTitle>주제별 인사이트</SectionTitle>
        
        {Object.entries(categories).map(([key, category]) => (
          <CategorySection key={key}>
            <CategoryTitle>{category.title}</CategoryTitle>
            <PostList>
              {category.posts.map((post) => (
                <PostItem key={post.id} href={post.link}>
                  <PostTitle>{post.title}</PostTitle>
                  <Arrow>→</Arrow>
                </PostItem>
              ))}
            </PostList>
          </CategorySection>
        ))}
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.div`
  background: #080d34;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding: 90px 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const SearchSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const SearchTitle = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  color: white;
  line-height: 1.3;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  background: #5c59e7
  border: 1px solid #5c59e7
  border-radius: 12px;
  padding: 8px;
  transition: all 0.3s ease;

  &:focus-within {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 16px;
  font-size: 1.1rem;
  color: white;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SearchButton = styled.button`
  background: #06FF01;
  color: #5c59e7;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const MainContent = styled.main`
  max-width: 700px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 40px;
  color: #5c59e7;
`;

const CategorySection = styled.section`
  margin-bottom: 40px;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  color: #5c59e7;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PostItem = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    transform: translateX(5px);
  }
`;

const PostTitle = styled.h4`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
`;

const Arrow = styled.span`
  color: #5c59e7;
`;

export default InsightPage; 