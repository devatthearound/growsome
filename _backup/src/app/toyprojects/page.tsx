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
  status: string;
  icon: string;
  rating: number;
  reviews: string[];
  imageUrl?: string;
}

const ToyProjects = () => {
  const projects = [
    {
      id: "1",
      title: "AI 자동화 챗봇 시스템",
      description: "기업 고객 상담을 자동화하는 AI 챗봇 솔루션.",
      tags: ["AI 챗봇", "NLP", "자동화"],
      status: "운영 중",
      icon: "🤖",
      rating: 9,
      reviews: ["응답 속도가 빠르고 정확해요!", "업무 효율이 크게 향상됐어요."],
      imageUrl: "https://via.placeholder.com/300x150"
    },
    {
      id: "2",
      title: "AI 기반 문서 요약 시스템",
      description: "긴 문서를 빠르게 요약해주는 AI 텍스트 분석 도구.",
      tags: ["NLP", "문서 요약", "AI 자동화"],
      status: "베타 테스트 중",
      icon: "📄",
      rating: 8,
      reviews: ["요약이 정말 정확해요!", "시간 절약에 큰 도움이 됩니다."],
      imageUrl: "https://via.placeholder.com/300x150"
    },
    {
      id: "3",
      title: "AI 자동화 데이터 태깅 시스템",
      description: "데이터 라벨링을 자동화하여 학습 데이터를 효율적으로 구축.",
      tags: ["데이터 라벨링", "AI 자동화", "ML 데이터"],
      status: "운영 중",
      icon: "🏷️",
      rating: 8,
      reviews: ["라벨링 속도가 3배 빨라졌어요!", "데이터 정밀도가 높아요."],
      imageUrl: "https://via.placeholder.com/300x150"
    }
  ];

  const textOnlyProjects = [
    {
      id: "4",
      title: "AI 기반 의료 문서 분석",
      description: "의료 보고서를 자동 분석하여 주요 인사이트 제공.",
      tags: ["AI", "의료 데이터", "자동 분석"],
      status: "진행 중",
      icon: "⚕️",
      rating: 7,
      reviews: []
    },
    {
      id: "5",
      title: "AI 기반 광고 최적화 시스템",
      description: "사용자 데이터를 분석하여 광고 퍼포먼스를 극대화.",
      tags: ["AI 마케팅", "광고 최적화", "머신러닝"],
      status: "완료",
      icon: "📈",
      rating: 9,
      reviews: []
    },
    {
      id: "6",
      title: "AI 음성 비서 자동화",
      description: "스마트 디바이스에서 음성을 인식하고 자동 실행.",
      tags: ["음성 인식", "자동화", "AI 비서"],
      status: "테스트 중",
      icon: "🎙️",
      rating: 6,
      reviews: []
    }
  ];

 
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
        <ProjectGrid>
          {projects.map((project) => (
            <ProjectCard key={project.id}>
              {project.imageUrl && <ProjectImage src={project.imageUrl} alt={project.title} />}
              <ProjectHeader>
                <ProjectStatus>{project.status}</ProjectStatus>
              </ProjectHeader>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <TagContainer>
                {project.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagContainer>
              <ProfileImages />
              <ProjectFooter>
                <FundingInfo>
                  {project.reviews.length}명 참여
                </FundingInfo>
                <LikeButton>
                  좋아요
                </LikeButton>
              </ProjectFooter>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>이런 자동화 필요한가요?</SectionTitle>
        <ProjectGrid>
          {textOnlyProjects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectHeader>
                <ProjectIcon>{project.icon}</ProjectIcon>
                <ProjectStatus>{project.status}</ProjectStatus>
              </ProjectHeader>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <TagContainer>
                {project.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </TagContainer>
              <FundingProgress>
                <ProgressBar style={{ width: `${project.rating * 10}%` }} />
              </FundingProgress>
              <ProjectFooter>
                <FundingInfo>
                  {project.reviews.length}명 참여
                </FundingInfo>
                <ViewButton>
                  보기
                </ViewButton>
              </ProjectFooter>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </SectionContainer>
    </HomeContainer>
  );
};

export default ToyProjects;