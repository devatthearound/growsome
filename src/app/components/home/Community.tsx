"use client"
import React from 'react';
import styled from 'styled-components';

const Community: React.FC = () => {
  return (
    <Section>
      <Title>함께 성장하는 메이커 커뮤니티</Title>
      <Description>
        수익형 프로젝트를 만드는 과정에서 서로의 경험을 나누고,
        실전 노하우를 공유하며 더 큰 성장을 만듭니다.
      </Description>
      <CardGrid>
        {[
          { title: "실전 경험 공유", desc: "성공과 실패의 생생한 경험을 나눕니다" },
          { title: "프로젝트 협업", desc: "함께 만들며 더 큰 가치를 창출합니다" },
          { title: "수익화 노하우", desc: "실제 수익을 만드는 방법을 공유합니다" }
        ].map((item, index) => (
          <Card key={index}>
            <CardTitle>{item.title}</CardTitle>
            <CardDesc>{item.desc}</CardDesc>
          </Card>
        ))}
      </CardGrid>
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
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const CardDesc = styled.p`
  color: #666;
  line-height: 1.5;
`;

export default Community; 