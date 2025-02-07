'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTag, faRocket, faStar, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { EmailContext } from '@/app/contexts/EmailContext';

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #fff;
`;

const HeroSection = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  text-align: center;
  padding: 60px 20px;
  background: #636DF1;
  color: white;
  border-radius: 0;
  margin-bottom: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const HeroTitle = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 20px;
  font-weight: 700;
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
  color: #636DF1;
  padding: 14px 28px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CouponBanner = styled(motion.div)`
  background: #FFF4E6;
  border: 1px solid #FF922B;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CouponText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #F76707;
  font-weight: bold;
`;

const CouponCode = styled.span`
  background: white;
  padding: 6px 14px;
  border-radius: 5px;
  margin-left: 8px;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 25px;
  margin-top: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)<{ bgColor: string }>`
  background: ${({ bgColor }) => bgColor || 'linear-gradient(135deg, #e0f7fa, #e8eaf6)'};
  border-radius: 15px;
  padding: 20px;
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  cursor: pointer;

  &:hover {
    transform: rotateY(180deg);
  }
`;

const ProjectContent = styled.div`
  flex-grow: 1;
  backface-visibility: hidden;
`;

const ProjectBack = styled.div<{ bgColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ bgColor }) => bgColor || 'linear-gradient(135deg, #e0f7fa, #e8eaf6)'};
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  transform: rotateY(180deg);
  backface-visibility: hidden;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #514FE4;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
  opacity: 0.8;
  color: #514FE4;
`;

const Participants = styled.div`
  font-size: 0.9rem;
  margin-top: 10px;
  color: #514FE4;
`;

const ProfileImages = styled.div`
  display: flex;
  margin-top: 10px;
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

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
`;

const ViewButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #3D39A1;
  }
`;

const ProjectLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const TryButton = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ProjectTag = styled.span`
  display: inline-block;
  padding: 3px 10px;
  background: #fff;
  color: #636DF1;
  border-radius: 15px;
  font-size: 0.75rem;
  margin-bottom: 10px;
`;

const SocialSection = styled.div`
  padding: 20px;
  background: white;
  border-radius: 15px;
  text-align: center;
`;

const SocialTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 700;
  color: #636DF1;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  justify-items: center;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FilterPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  background: #fff;
  border-radius: 10px;
`;

const FilterButton = styled.button`
  background: #fff;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  border-radius: 20px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #ff4d4f;
    color: #fff;
  }
`;

const SortGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const SortButton = styled.button`
  background: #fff;
  color: #636DF1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #f0f0f0;
  }
`;

const ContributorProfile = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const ContributorImage = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 8px;
`;

const ContributorName = styled.span`
  font-size: 0.85rem;
  color: #636DF1;
`;

const Review = styled.div`
  margin-top: 8px;
  font-size: 0.8rem;
  color: #fff;
`;

const Rating = styled.div`
  color: #FFD700; /* Gold color for stars */
  margin-top: 4px;
`;

interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  is_active: boolean;
  reviews: string[];
  rating: number;
}

const ToyProjects = () => {
  const emailContext = useContext(EmailContext);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "AffiliSmart",
      description: "클릭 한 번으로 매력적인 상품 홍보 영상을 자동으로 생성하세요. AI가 당신의 마케팅을 더 스마트하게 만들어줍니다.",
      url: "/projects/affilismart",
      tags: ["수익화"],
      is_active: true,
      reviews: ["정말 유용한 프로젝트네요!", "마케팅이 훨씬 쉬워졌어요"],
      rating: 4.8
    },
    {
      id: "2",
      title: "AI 이미지 생성기",
      description: "간단한 텍스트로 원하는 이미지를 생성하세요. 전문 디자이너 없이도 멋진 이미지를 만들 수 있습니다.",
      url: "/projects/image-generator",
      tags: ["디자인"],
      is_active: true,
      reviews: ["이미지 퀄리티가 놀랍습니다", "사용하기 너무 편해요"],
      rating: 4.5
    },
    {
      id: "3",
      title: "자동 콘텐츠 작성기",
      description: "블로그 포스트, SNS 게시물을 AI가 자동으로 작성해줍니다. 시간을 절약하세요.",
      url: "/projects/content-writer",
      tags: ["생산성"],
      is_active: true,
      reviews: ["콘텐츠 제작 시간이 확 줄었어요"],
      rating: 4.6
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [sortOption, setSortOption] = useState<string>('popular');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  if (!emailContext) {
    throw new Error('EmailContext must be used within EmailProvider');
  }

  const { setShowEmailPopup } = emailContext;

  useEffect(() => {
    // 배너 표시 여부 확인
    const hasVisited = localStorage.getItem('hasVisitedToyProjects');
    if (!hasVisited) {
      setShowBanner(true);
      localStorage.setItem('hasVisitedToyProjects', 'true');
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/toyprojects');
        if (!response.ok) {
          throw new Error('프로젝트를 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        const projectsWithReviews = data.projects.map((project: Project) => ({
          ...project,
          reviews: project.reviews || [],
        }));
        setProjects(projectsWithReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const sortProjects = (option: string) => {
    let sortedProjects = [...projects];
    if (option === 'popular') {
      sortedProjects.sort((a, b) => b.rating - a.rating); // Example sorting by rating
    } else if (option === 'recommended') {
      // Implement your logic for recommended sorting
    }
    setProjects(sortedProjects);
    setSortOption(option);
  };

  const filterProjectsByCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.tags.includes(selectedCategory));

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <Container>
      {showBanner && (
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
      )}
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
          나도 참여하기 <FontAwesomeIcon icon={faArrowRight} />
        </CTA>
      </HeroSection>

      <FilterPanel>
        <FilterButton>Filters</FilterButton>
        <SortGroup>
          <SortButton>최신순</SortButton>
          <SortButton>인기순</SortButton>
        </SortGroup>
      </FilterPanel>

      <GridWrapper>
        <ProjectGrid>
          {filteredProjects.map((project, index) => {
            const gradients = [
              'linear-gradient(135deg, #e0f7fa, #e8eaf6)',
              'linear-gradient(135deg, #f3e5f5, #e1bee7)',
              'linear-gradient(135deg, #e1f5fe, #b3e5fc)',
            ];
            const bgColor = gradients[index % gradients.length];

            return (
              <ProjectCard
                key={project.id}
                bgColor={bgColor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProjectLink href={`${project.url}`}>
                  <ProjectContent>
                    <ProjectTag>{project.tags[0]}</ProjectTag>
                    <ProjectTitle>{project.title}</ProjectTitle>
                    <ProjectDescription>{project.description}</ProjectDescription>
                    <Participants>참여자: {project.reviews.length}명</Participants>
                    <ProfileImages>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <ProfileImage key={i} src="/path/to/profile.jpg" alt="User" />
                      ))}
                    </ProfileImages>
                    <Review>
                      {project.reviews[0] && <p>{project.reviews[0]}</p>}
                    </Review>
                  </ProjectContent>
                  <ProjectBack bgColor={bgColor}>
                    <p>More Info</p>
                  </ProjectBack>
                </ProjectLink>
              </ProjectCard>
            );
          })}

          {/* Duplicate the card 6 more times */}
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCard
              key={`duplicate-${index}`}
              bgColor={index % 2 === 0 ? '#e0f7fa' : '#f3e5f5'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProjectLink href="#">
                <ProjectContent>
                  <ProjectTag>Sample Tag</ProjectTag>
                  <ProjectTitle>Sample Project</ProjectTitle>
                  <ProjectDescription>This is a sample project description.</ProjectDescription>
                  <Participants>0 participants</Participants>
                  <ProfileImages>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <ProfileImage key={index} src="/path/to/profile.jpg" alt="User" />
                    ))}
                  </ProfileImages>
                  <Review>
                    <p>Sample review 1</p>
                  </Review>
                </ProjectContent>
              </ProjectLink>
            </ProjectCard>
          ))}
        </ProjectGrid>

        <SocialSection>
          <SocialTitle>🚀 함께 만드는 AI자동화 (32)</SocialTitle>
          <ProfileGrid>
            {/* Replace with dynamic data as needed */}
            {Array.from({ length: 20 }).map((_, index) => (
              <ProfileImage key={index} src="/path/to/profile.jpg" alt="User" />
            ))}
          </ProfileGrid>
        </SocialSection>
      </GridWrapper>
    </Container>
  );
};

export default ToyProjects;