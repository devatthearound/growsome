"use client"
import React from 'react';
import styled from 'styled-components';

const Ecosystem = () => {
  return (
    <Section>
      <Title>토이 프로젝트가 수익화되는 순간</Title>
      <Description>
        단순한 포트폴리오가 아닌, 실제 수익을 만드는 프로젝트를 함께 만듭니다.
        그로우썸의 토이 프로젝트는 처음부터 비즈니스입니다.
      </Description>
      <FeatureGrid>
        {["실전 프로젝트 경험", "실제 유저 피드백", "수익화 노하우 공유", "커뮤니티 협업"].map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureText>{feature}</FeatureText>
          </FeatureCard>
        ))}
      </FeatureGrid>
    </Section>
  );
};

const Section = styled.section`
  padding: 100px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureText = styled.h3`
  font-size: 1.2rem;
  color: #333;
  text-align: center;
`;

export default Ecosystem; 