'use client';

import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faChartLine, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Tools = () => {
  const tools = [
    {
      id: 'affiliate',
      title: "제휴자동화",
      subtitle: "Affiliate Automation",
      description: "쿠팡 파트너스 API를 활용한 자동화된 제휴 마케팅 솔루션",
      features: [
        "쿠팡 파트너스 API 자동 연동",
        "상품 검색 및 영상 자동 생성",
        "유튜브 자동 업로드",
        "템플릿 기반 영상 제작"
      ],
      color: "#514FE4",
      icon: <FontAwesomeIcon icon={faRocket} />,
      link: "/affil"
    },
    {
      id: 'funnel',
      title: "퍼널자동화",
      subtitle: "Funnel Automation", 
      description: "AI 기반 퍼널 자동화로 리드 생성부터 전환까지 완벽 자동화",
      features: [
        "AI 기반 퍼널 설계",
        "자동 리드 생성",
        "스마트 전환 최적화",
        "실시간 퍼널 분석"
      ],
      color: "#667eea",
      icon: <FontAwesomeIcon icon={faChartLine} />,
      link: "/funnel"
    }
  ];

  return (
    <ToolsSection>
      <Container>
        <SectionHeader>
          <Title>
            Growsome <Accent>Tools</Accent>
          </Title>
          <Subtitle>
            AI 기반 자동화 도구로 비즈니스 성장을 가속화하세요
          </Subtitle>
          <Description>
            제휴마케팅부터 퍼널 자동화까지, 모든 것을 한 곳에서
          </Description>
        </SectionHeader>

        <ToolsGrid>
          {tools.map((tool) => (
            <ToolCard key={tool.id} color={tool.color}>
              <ToolHeader>
                <ToolIcon color={tool.color}>
                  {tool.icon}
                </ToolIcon>
                <ToolSubtitle>{tool.subtitle}</ToolSubtitle>
              </ToolHeader>
              
              <ToolTitle>{tool.title}</ToolTitle>
              <ToolDescription>{tool.description}</ToolDescription>
              
              <ToolFeatures>
                {tool.features.map((feature, index) => (
                  <FeatureItem key={index}>
                    <FeatureDot color={tool.color} />
                    {feature}
                  </FeatureItem>
                ))}
              </ToolFeatures>
              
              <ToolLink href={tool.link}>
                자세히 보기
                <FontAwesomeIcon icon={faArrowRight} />
              </ToolLink>
            </ToolCard>
          ))}
        </ToolsGrid>


      </Container>
    </ToolsSection>
  );
};

const ToolsSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);

  @media (max-width: 1024px) {
    padding: 60px 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1024px) {
    max-width: 900px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;

  @media (max-width: 1024px) {
    margin-bottom: 40px;
  }
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c;
  
  @media (max-width: 1024px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Accent = styled.span`
  color: #514FE4;
`;

const Subtitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
  
  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ToolCard = styled.div<{ color: string }>`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.color}20;
  }

  @media (max-width: 1024px) {
    padding: 30px;
  }
`;

const ToolHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ToolIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const ToolSubtitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ToolTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #1a202c;

  @media (max-width: 1024px) {
    font-size: 1.6rem;
  }
`;

const ToolDescription = styled.p`
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 25px;
  line-height: 1.6;
`;

const ToolFeatures = styled.ul`
  list-style: none;
  margin-bottom: 30px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #4a5568;
`;

const FeatureDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color};
  margin-right: 12px;
  flex-shrink: 0;
`;

const ToolLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #514FE4;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    gap: 12px;
  }
`;

const CTASection = styled.div`
  text-align: center;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #514FE4;
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(81, 79, 228, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(81, 79, 228, 0.4);
    color: white;
  }
`;

export default Tools; 