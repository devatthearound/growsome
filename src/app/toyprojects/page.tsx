'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTag, faRocket } from '@fortawesome/free-solid-svg-icons';
import { EmailContext } from '@/app/contexts/EmailContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #514FE4 0%, #6B7BF7 100%);
  color: white;
  border-radius: 20px;
  margin-bottom: 60px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const HeroDescription = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 30px;
  opacity: 0.9;
`;

const CTA = styled(Link)`
  display: inline-block;
  background: white;
  color: #514FE4;
  padding: 15px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CouponBanner = styled(motion.div)`
  background: #FFF4E6;
  border: 2px dashed #FF922B;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CouponText = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #F76707;
  font-weight: bold;
`;

const CouponCode = styled.span`
  background: white;
  padding: 8px 16px;
  border-radius: 6px;
  margin-left: 10px;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const ProjectCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProjectContent = styled.div`
  padding: 20px;
`;

const ProjectTitle = styled.h3`
  font-size: 1.2rem;
  color: #514FE4;
  margin-bottom: 10px;
`;

const ProjectDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

const ProjectLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const TryButton = styled.div`
  background: #514FE4;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
  
  &:hover {
    background: #4340c0;
  }
`;

const ProjectTag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: #f3f0ff;
  color: #514FE4;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 12px;
`;

interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  is_active: boolean;
}

const ToyProjects = () => {
  const emailContext = useContext(EmailContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  if (!emailContext) {
    throw new Error('EmailContext must be used within EmailProvider');
  }

  const { setShowEmailPopup } = emailContext;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/toyprojects');
        if (!response.ok) {
          throw new Error('프로젝트를 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <Container>
      <HeroSection>
        <HeroTitle>
          <span role="img" aria-label="rocket">🚀</span> 
          상상을 현실로 만드는 실험실
        </HeroTitle>
        <HeroDescription>
          "이런 게 있으면 좋겠다" 생각한 적 있나요?
          우리가 먼저 만들어보았습니다.
          당신의 일상을 더 효율적이고 재미있게 만들어줄 프로젝트들을 만나보세요.
        </HeroDescription>
        <CTA href="#" onClick={() => setShowEmailPopup(true)}>
          제일 먼저 만나보기 <FontAwesomeIcon icon={faArrowRight} />
        </CTA>
      </HeroSection>

      <CouponBanner
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CouponText>
          <FontAwesomeIcon icon={faTag} />
          얼리버드 특별 할인
          <CouponCode>EARLY2024</CouponCode>
        </CouponText>
        <span>첫 구매 50% 할인</span>
      </CouponBanner>

      <ProjectGrid>
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProjectLink href={`${project.url}`}>
              <ProjectContent>
                <ProjectTag>{project.tags[0]}</ProjectTag>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <TryButton>
                  지금 시작하기 <FontAwesomeIcon icon={faRocket} />
                </TryButton>
              </ProjectContent>
            </ProjectLink>
          </ProjectCard>
        ))}
      </ProjectGrid>
    </Container>
  );
};

export default ToyProjects;