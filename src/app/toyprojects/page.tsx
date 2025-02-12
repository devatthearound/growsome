'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTag } from '@fortawesome/free-solid-svg-icons';
import { EmailContext } from '@/app/contexts/EmailContext';

const HomeContainer = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  text-align: center;
  color: white;
  border-radius: 0;
`;

const SectionContainer = styled.div`
  background: #f2f5fa;
  padding: 40px 0;
`;

const HeroSection = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  text-align: center;
  padding: 180px 20px;
  background: #080d34;
  color: white;
  border-radius: 0;
`;

const HeroTitle = styled.h1`
  font-size: 4.5rem;
  margin-bottom: 20px;
  font-weight: 800;
  line-height: 1.2;
  
  span {
    color: #06ff01;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto 40px;
  line-height: 1.6;
  color: #94A3B8;
`;

const CTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #514fe4;
  color: white;
  padding: 16px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgb(50, 48, 178);
    transform: translateY(-2px);
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin: 40px 0 20px;
  color: #333;
`;

const ProjectCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 300px;
  width: 100%;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
  margin-bottom: 10px;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ProjectIcon = styled.div`
  font-size: 1.5rem;
`;

const ProjectStatus = styled.span`
  background: #514fe4;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 10px;
  color: #555;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background: #f0f0f0;
  color: #333;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
`;

const FundingProgress = styled.div`
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: 70%; /* Example progress percentage */
  background: #06ff01;
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const FundingInfo = styled.div`
  font-size: 0.8rem;
  color: #777;
`;

const ViewButton = styled.button`
  background: #514fe4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: #3d39a1;
    transform: scale(1.05);
  }
`;

const ProfileImageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -10px;

  &:first-child {
    margin-left: 0;
  }
`;

const LikeButton = styled.button`
  background: #ff4081;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: #e73370;
    transform: scale(1.05);
  }
`;

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail_img?: string;
  url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ToyProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/toyprojects');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || '프로젝트를 불러오는데 실패했습니다.');
        }
        
        setProjects(data.projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const profileImages = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop'
  ];

  const ProfileImages = () => (
    <ProfileImageContainer>
      {profileImages.map((url, index) => (
        <ProfileImage key={index} src={url} alt={`Profile ${index + 1}`} />
      ))}
    </ProfileImageContainer>
  );

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>
          흥미로운 <span>프로젝트 탐색</span>
        </HeroTitle>
        <HeroDescription>
          혁신적인 아이디어와 창의적인 프로젝트를 발견하세요. 우리의 커뮤니티에 참여하여 웹을 더 재미있고 흥미롭게 만들어보세요.
        </HeroDescription>
        <CTA href="#projects">
          프로젝트 보기
          <FontAwesomeIcon icon={faArrowRight} />
        </CTA>
      </HeroSection>

      <SectionContainer>
        <SectionTitle>바로 사용할 수 있어요!</SectionTitle>
        {loading && <p>프로젝트를 불러오는 중...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ProjectGrid>
          {projects.map((project) => (
            <ProjectCard key={project.id}>
              {project.thumbnail_img && (
                <ProjectImage 
                  src={project.thumbnail_img} 
                  alt={project.title} 
                />
              )}
              <ProjectHeader>
                <ProjectStatus>
                  {project.is_active ? '운영 중' : '준비 중'}
                </ProjectStatus>
              </ProjectHeader>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <TagContainer>
                {project.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagContainer>
              <ProjectFooter>
                {project.url && (
                  <ViewButton onClick={() => window.open(project.url, '_blank')}>
                    보기
                  </ViewButton>
                )}
              </ProjectFooter>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </SectionContainer>
    </HomeContainer>
  );
};

export default ToyProjects;