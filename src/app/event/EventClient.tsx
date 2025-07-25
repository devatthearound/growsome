"use client"

import React, { Suspense } from 'react';
import styled from 'styled-components';

const EventLanding = () => {
  return (
    <EventPageContainer>
      <HeroSection>
        <Container>
          <Title>그로우썸 이벤트 페이지</Title>
          <Description>
            특별한 이벤트와 프로모션을 확인하세요!
          </Description>
        </Container>
      </HeroSection>
      
      <ContentSection>
        <Container>
          <h2>진행 중인 이벤트</h2>
          <p>현재 진행 중인 이벤트가 없습니다.</p>
        </Container>
      </ContentSection>
    </EventPageContainer>
  );
};

const EventPageContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 0;
  color: white;
  text-align: center;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
`;

const ContentSection = styled.section`
  padding: 80px 0;
  background: white;
`;

export default function EventClient() {
  return (
    <Suspense fallback={<div>이벤트 페이지 로딩중...</div>}>
      <EventLanding />
    </Suspense>
  );
} 