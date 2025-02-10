"use client"
import React from 'react';
import styled from 'styled-components';

const JoinUs = () => {
  return (
    <Section>
      <Content>
        <FreedomSection>
          <FreedomItem>
            <MainText>내 방식대로 일하고,<br /> 내 시간대로 살아간다.</MainText>
          </FreedomItem>
          
          <FreedomItem>
            <MainText>AI로 더 스마트하게,<br />더 자유롭게</MainText>
          </FreedomItem>
          
          <FreedomItem>
            <HighlightText>그로우썸</HighlightText>
            <MainText>가능성을 확장하는 공간.</MainText>
          </FreedomItem>
        </FreedomSection>

        <ArrowDown>↓</ArrowDown>

        <SubscribeSection>
          <SubscribeTitle>비밀연구소에 참여하세요.</SubscribeTitle>
          <SubscribeDescription>
            함께 배우고, 성장하고, 만들어갑니다.
          </SubscribeDescription>

          <a href="https://open.kakao.com/o/gqWxH1Zg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <MobileSecretLabButton>
              비밀연구소 참여하기
            </MobileSecretLabButton>
          </a>
        </SubscribeSection>
      </Content>
    </Section>
  );
};

const Section = styled.section`
  padding: 120px 20px;
  background: linear-gradient(135deg, #f0f4ff, #e0e7ff);
  color: #001C46;
`;

const Content = styled.div`
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
`;

const FreedomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-bottom: 80px;
`;

const FreedomItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const HighlightText = styled.span`
  color: #514fe4;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -1px;
`;

const MainText = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  color: #080d34;
  letter-spacing: -1px;
`;

const ArrowDown = styled.div`
  font-size: 3rem;
  margin: 50px 0;
  color: #514fe4;
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const SubscribeSection = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const SubscribeTitle = styled.h2`
  font-size: 2.0rem;
  margin-bottom: 10px;
  font-weight: 600;
  color: #080d34;
  letter-spacing: -1px;
`;

const SubscribeDescription = styled.p`
  font-size: 1.6rem;
  line-height: 1.5;
  color: #666;
  margin-bottom: 40px;
`;

const MobileSecretLabButton = styled.button`
  padding: 18px 36px;
  background: #514fe4;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background:rgb(59, 57, 210);
    transform: translateY(-3px);
  }
`;

const Disclaimer = styled.p`
  font-size: 0.9rem;
  color: #888;
`;

export default JoinUs; 