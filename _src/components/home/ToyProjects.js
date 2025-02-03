import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

const ToyProjects = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const projects = [
    {
      id: 'affili-smart',
      title: '🎥 AffiliSmart',
      description: '클릭 한 번으로 매력적인 상품 홍보 영상을 자동으로 생성하세요. AI가 당신의 마케팅을 더 스마트하게 만들어줍니다.',
      features: [
        '상품 자동 검색',
        '영상 자동 생성',
        '마케팅 최적화',
        '수익 분석 대시보드'
      ],
      path: '/toyprojects/affili-smart',
      tag: '수익화',
      status: 'beta'
    },
    {
      id: 'time-block',
      title: '⏰ 타임블록',
      description: '시간을 블록처럼 쌓아가세요. 하루 24시간이 더 가치있게 변화합니다.',
      features: [
        '블록 단위 시간 관리',
        '일정 자동 조정',
        '목표 설정 및 추적',
        '생산성 분석'
      ],
      path: '/toyprojects/time-block',
      tag: '생산성',
      status: 'alpha'
    },
    {
      id: 'blog-auto',
      title: '✍️ 블로그 오토파일럿',
      description: 'AI가 당신의 블로그를 24시간 운영합니다. 잠자는 동안에도 성장하는 블로그를 경험하세요.',
      features: [
        'AI 컨텐츠 생성',
        '자동 발행 스케줄링',
        'SEO 최적화',
        '성과 분석'
      ],
      path: '/toyprojects/blog-auto',
      tag: '자동화',
      status: 'development'
    }
  ];

  return (
    <PageContainer>
      <PageHeader
        as={motion.div}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Title>토이 프로젝트</Title>
        <Description>
          실험적이고 혁신적인 아이디어를 실현하는 우리의 토이 프로젝트들을 소개합니다.
        </Description>
      </PageHeader>

      <ProjectGrid>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            as={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <Link to={project.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ProjectContent>
                <ProjectTag>{project.tag}</ProjectTag>
                <ProjectHeader>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <StatusBadge status={project.status}>
                    {project.status === 'beta' && 'Beta'}
                    {project.status === 'alpha' && 'Alpha'}
                    {project.status === 'development' && '개발중'}
                  </StatusBadge>
                </ProjectHeader>
                <ProjectDescription>{project.description}</ProjectDescription>
                <FeatureList>
                  {project.features.map((feature, index) => (
                    <FeatureItem key={index}>
                      <FeatureIcon>✓</FeatureIcon>
                      {feature}
                    </FeatureItem>
                  ))}
                </FeatureList>
                <TryButton>
                  지금 시작하기 <FontAwesomeIcon icon={faRocket} />
                </TryButton>
              </ProjectContent>
            </Link>
          </ProjectCard>
        ))}
      </ProjectGrid>
    </PageContainer>
  );
};

// 스타일 컴포넌트들을 pages/ToyProjects.js와 동일하게 수정
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
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

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.2rem;
  color: #514FE4;
  margin-bottom: 10px;
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

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'beta': return '#e3f2fd';
      case 'alpha': return '#f3e5f5';
      case 'development': return '#f5f5f5';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'beta': return '#1976d2';
      case 'alpha': return '#9c27b0';
      case 'development': return '#666';
      default: return '#666';
    }
  }};
`;

const ProjectDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #444;
  font-size: 0.9rem;
`;

const FeatureIcon = styled.span`
  color: #514FE4;
  margin-right: 8px;
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

export default ToyProjects; 