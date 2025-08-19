'use client'

import React from 'react';
import styled from 'styled-components';
import SEOHead from '@/components/seo/SEOHead';
import Hero from './components/home/Hero'; 
import Partner from './components/home/Partner';
import Letters from './components/home/Letters';
import Solutions from './components/home/Solutions';
import Tools from './components/home/Tools';
import Portfolio from './components/home/Portfolio';
import Newsletters from './components/home/Newsletters';
import Blog from './components/home/Blog';
import JoinUs from './components/home/JoinUs';

export default function HomeClient() {
  // 메인 페이지용 구조화된 데이터
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Growsome",
    "description": "AI 기반 비즈니스 성장 플랫폼",
    "url": "https://growsome.kr",
    "logo": "https://growsome.kr/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+82-2-1234-5678",
      "contactType": "customer service",
      "areaServed": "KR",
      "availableLanguage": ["Korean", "English"]
    },
    "sameAs": [
      "https://www.linkedin.com/company/growsome",
      "https://twitter.com/growsome_kr"
    ]
  }

  return (
    <>
      <SEOHead
        title="Growsome | AI 기반 비즈니스 성장 플랫폼"
        description="AI 자동화와 데이터 분석으로 비즈니스 성장을 가속화하는 그로우썸. 스타트업부터 대기업까지 검증된 성장 솔루션을 제공합니다."
        keywords={['AI', '비즈니스성장', '디지털마케팅', '자동화', '데이터분석', '스타트업', '그로우썸', '마케팅자동화', '비즈니스컨설팅']}
        canonicalUrl="/"
        structuredData={organizationSchema}
      />
      <HomeContainer>
      <Hero />
      <Partner />
      <Letters />
      <Solutions />
      <Tools />
      <Portfolio />
      {/*<Newsletters />*/}
        <JoinUs />
      </HomeContainer>
    </>
  )
}

const HomeContainer = styled.div`
  width: 100%;
  padding: 0;
  background-color: #f0f0f0;
`;

