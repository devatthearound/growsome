import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTag, faRocket } from '@fortawesome/free-solid-svg-icons';
import { EmailContext } from '../contexts/EmailContext';

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

const ToyProjects = () => {
  const { setShowEmailPopup } = useContext(EmailContext);
  
  const projects = [
    {
      id: 'affili-smart',
      title: '🎥 AffiliSmart',
      description: '클릭 한 번으로 매력적인 상품 홍보 영상을 자동으로 생성하세요. AI가 당신의 마케팅을 더 스마트하게 만들어줍니다.',
      path: '/toyprojects/affili-smart',
      tag: '수익화'
    },
    {
      id: 'time-block',
      title: '⏰ 타임블록',
      description: '시간을 블록처럼 쌓아가세요. 하루 24시간이 더 가치있게 변화합니다.',
      path: '/toyprojects/time-block',
      tag: '생산성'
    },
    {
      id: 'blog-auto',
      title: '✍️ 블로그 오토파일럿',
      description: 'AI가 당신의 블로그를 24시간 운영합니다. 잠자는 동안에도 성장하는 블로그를 경험하세요.',
      path: '/toyprojects/blog-auto',
      tag: '자동화'
    }
  ];

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
        <CTA onClick={() => setShowEmailPopup(true)}>
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
            <ProjectLink to={project.path}>
              <ProjectContent>
                <ProjectTag>{project.tag}</ProjectTag>
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