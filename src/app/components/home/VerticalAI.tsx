"use client"
import React from 'react';
import styled from 'styled-components';

const VerticalAI = () => {
  return (
    <Section>
      <Title>소상공인을 위한 맞춤형 AI 솔루션</Title>
      <Description>
        복잡한 AI가 아닌, 당신의 비즈니스에 실질적 도움이 되는 AI를 만듭니다.
        세무, 마케팅, 고객 응대 - 실제 매출 증대에 집중합니다.
      </Description>
      <SolutionsGrid>
        {[
          { title: "자동 세무 처리", desc: "복잡한 세무 업무를 AI가 자동으로 처리" },
          { title: "맞춤형 마케팅 카피", desc: "타겟에 맞는 효과적인 마케팅 문구 생성" },
          { title: "24/7 고객 응대", desc: "실시간 고객 문의 대응 자동화" },
          { title: "매출 데이터 분석", desc: "데이터 기반 비즈니스 인사이트 제공" }
        ].map((solution, index) => (
          <SolutionCard key={index}>
            <SolutionTitle>{solution.title}</SolutionTitle>
            <SolutionDesc>{solution.desc}</SolutionDesc>
          </SolutionCard>
        ))}
      </SolutionsGrid>
    </Section>
  );
};

const Section = styled.section`
  padding: 100px 20px;
  background: #f8f9fa;
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

const SolutionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SolutionCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const SolutionTitle = styled.h3`
  font-size: 1.3rem;
  color: #4F46E5;
  margin-bottom: 1rem;
`;

const SolutionDesc = styled.p`
  color: #666;
  line-height: 1.5;
`;

export default VerticalAI; 