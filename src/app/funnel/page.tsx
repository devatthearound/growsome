"use client";

import React from 'react';
import styled from 'styled-components';
import { Typography } from '@/components/design-system';
import growsomeTheme from '@/app/styles/theme';
import { faArrowRight, faCheck, faStar, faUsers, faChartLine, faRocket, faBolt, faWallet, faBullseye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import LeadCaptureModal from '@/components/common/LeadCaptureModal';
import { useState } from 'react';

// Styled Components
const DoasomeContainer = styled.div`
  min-height: 100vh;
  color: #333;
`;

const HeroSection = styled.section`
  padding: 120px 20px 80px;
  text-align: center;
  width: 100%;
  min-height: 100vh;
  background: #fffdf7;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeroIllustration = styled.div`
  width: 450px;
  height: 450px;
  opacity: 1;
  z-index: 1;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 12px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const HeroContent = styled.div`
  z-index: 10;
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  margin-bottom: 0.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  margin-bottom: 0.1rem;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 0.1rem;
  color: #333;
  margin-left: auto;
  margin-right: auto;
  
  &:last-of-type {
    margin-bottom: 5rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #bd6bed 0%, #5cd0ec 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
`;

const CTAButton = styled.button`
  background: linear-gradient(45deg, #bd6bed, #5cd0ec);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(189, 107, 237, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(189, 107, 237, 0.4);
  }
`;

const StatsSection = styled.section`
  padding: 80px 20px;
  background: #000;
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0rem;
  max-width: 900px;
  margin: 0 auto;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: transparent;
  border-radius: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    opacity: 0.1;
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: white;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #777;
  opacity: 0.9;
`;

const FeaturesSection = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
`;

const SectionTitle = styled.h2`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 800;
  color: #111;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: #fffdf7;
  padding: 4rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  }
`;

const FeatureImage = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: #6968f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #111;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const TestimonialsSection = styled.section`
  padding: 80px 20px;
  background: #000;
`;

const TestimonialsTitle = styled.h2`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 800;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const TestimonialsDescription = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #CCCCCC;
  line-height: 1.6;
`;

const TestimonialsFeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 0 auto;
`;

const TestimonialsFeatureCard = styled.div`
  padding: 4rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  text-align: left;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  }
`;

const TestimonialsFeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #fff;
`;

const TestimonialsFeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TestimonialCard = styled.div`
  background: rgba(255,255,255,0.05);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255,255,255,0.08);
  }
`;

const TestimonialText = styled.p`
  font-style: italic;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: white;
  font-size: 1.1rem;
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
  color: #667eea;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const TestimonialRole = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  color: #CCCCCC;
`;

const FAQSection = styled.section`
  padding: 80px 20px;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
`;

const FAQItem = styled.div`
  background: #fff;
  margin-bottom: 1rem;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border: 1px solid #f0f0f0;
`;

const FAQQuestion = styled.div`
  padding: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  color: #333;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const FAQAnswer = styled.div`
  padding: 0 1.5rem 1.5rem;
  color: #666;
  line-height: 1.6;
`;

const FinalCTASection = styled.section`
  padding: 80px 20px;
  text-align: center;
  background: #fff;
`;

// 3D 일러스트레이션 컴포넌트들
const FunnelIllustration = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FunnelShape = styled.div`
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transform: rotate(180deg);
  position: relative;
  box-shadow: 0 10px 30px rgba(74, 144, 226, 0.3);
`;

const FloatingShapes = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Shape = styled.div<{ $color: string; $size: number; $left: number; $top: number; $delay: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.$color};
  border-radius: 50%;
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  animation: float 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const StarShape = styled.div<{ $color: string; $size: number; $left: number; $top: number; $delay: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.$color};
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  left: ${props => props.$left}%;
  top: ${props => props.$top}%;
  animation: float 3s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
`;

const PlantIllustration = styled.div`
  width: 160px;
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }
`;

const DoasomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <DoasomeContainer>
      <HeroSection>
      <HeroContent>
          <HeroTitle>성과를 복사하세요</HeroTitle>
          <HeroSubtitle>
            <GradientText style={{ fontSize: '7rem', lineHeight: '0.8' }}>stress free.</GradientText>
          </HeroSubtitle>
          <HeroSubtitle style={{ marginTop: '1rem' }}>
            🔍 수천 개의 고성과 퍼널을 학습하여 효율만 남긴<GradientText>SkillBlock</GradientText>만 제공합니다. 
            광고 없이도 전환을 만든 구조만 복사하세요.
          </HeroSubtitle>
          <CTAButton onClick={handleOpenModal}>
            무료 상담 신청하기
          </CTAButton>
        </HeroContent>
        <HeroIllustration>
          <Image 
            src="/uploads/doasome_1.png" 
            alt="퍼널 자동화" 
            width={450} 
            height={450}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/store/product1.jpg';
            }}
          />
        </HeroIllustration>

      </HeroSection>

      <StatsSection>
        <HeroSubtitle style={{ textAlign: 'center', marginBottom: '3rem', color: 'white' }}>
        성과 기반 데이터 분석<br/>고성과 마케팅 퍼널 1,000개 이상을 분석해 만든 👉 <strong>SkillBlock</strong>
        <br/>우리는 수치 대신, 사법 기반 예측으로 설계합니다
        </HeroSubtitle>
        
        <StatsGrid>
          <StatCard>
            <StatNumber>5~12%</StatNumber>
            <StatLabel>언제나 높은 전환율</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>10분</StatNumber>
            <StatLabel>퍼널 실행까지 걸리는 최소 시간</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>무료</StatNumber>
            <StatLabel>성과가 없으면 과금도 없음</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      <FeaturesSection>
        <SectionTitle>전환을 가속하는 <br/>
        <GradientText>SkillBlock</GradientText> 구조</SectionTitle>
        <HeroSubtitle style={{ textAlign: 'center', marginBottom: '3rem' }}>
        누구나 10분 안에 성과 퍼널을 실행하고, <br />
        결과 기반 리포트까지 자동으로 받아보세요.
        </HeroSubtitle>
        
        <FeaturesGrid>
          <FeatureCard>
            <PlantIllustration>
              <Image 
                src="/images/tools/doasome_step1.png" 
                alt="SkillBlock 복사 실행" 
                width={160} 
                height={160}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/store/product1.jpg';
                }}
              />
            </PlantIllustration>
            <FeatureTitle>SkillBlock 복사 실행</FeatureTitle>
            <FeatureDescription>
            광고 설계 없이, 전환 퍼널을 1클릭으로 바로 실행
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <PlantIllustration>
              <Image 
                src="/images/tools/doasome_step2.png" 
                alt="전환 리포트 자동 생성" 
                width={160} 
                height={160}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/store/product1.jpg';
                }}
              />
            </PlantIllustration>
            <FeatureTitle>전환 리포트 자동 생성</FeatureTitle>
            <FeatureDescription>
            Bloom(전환) 발생 시 리포트가 자동 생성됩니다
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <PlantIllustration>
              <Image 
                src="/images/tools/doasome_step3.png" 
                alt="모바일 최적화 퍼널" 
                width={160} 
                height={160}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/store/product1.jpg';
                }}
              />
            </PlantIllustration>
            <FeatureTitle>모바일 최적화 퍼널</FeatureTitle>
            <FeatureDescription>모바일에서도 SkillBlock 실행 및 결과 확인 가능
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>


      <TestimonialsSection>
        <TestimonialsTitle>
          <GradientText>성과를 만드는 구조만</GradientText> <br/> 남겼습니다
        </TestimonialsTitle>
        <TestimonialsDescription>
          두어썸은 고성과 마케팅 퍼널의 공통 구조만 추출해  <br /> 
          누구나 복사하고 실행할 수 있도록 만들었습니다.
        </TestimonialsDescription>
        
        <TestimonialsFeaturesGrid>
          <TestimonialsFeatureCard>
            <FeatureImage>
              <FontAwesomeIcon icon={faBolt} className="w-8 h-8 text-white" />
            </FeatureImage>
            <TestimonialsFeatureTitle>빠르고 안전한 패널 실청</TestimonialsFeatureTitle>
            <TestimonialsFeatureDescription>
              복사만 하면 즉시 실행됩니다. 별도 광고 세팅 없이 구조가 작동합니다.
            </TestimonialsFeatureDescription>
          </TestimonialsFeatureCard>
          
          <TestimonialsFeatureCard>
            <FeatureImage>
              <FontAwesomeIcon icon={faChartLine} className="w-8 h-8 text-white" />
            </FeatureImage>
            <TestimonialsFeatureTitle>전한 리포트 자동 생성</TestimonialsFeatureTitle>
            <TestimonialsFeatureDescription>
              전환(Bloom)이 발생하면, 자동으로 성과 요약 리포트가 생성됩니다.
            </TestimonialsFeatureDescription>
          </TestimonialsFeatureCard>
          
          <TestimonialsFeatureCard>
            <FeatureImage>
              <FontAwesomeIcon icon={faWallet} className="w-8 h-8 text-white" />
            </FeatureImage>
            <TestimonialsFeatureTitle>성과 기반 과금 구조</TestimonialsFeatureTitle>
            <TestimonialsFeatureDescription>
              성과가 나기 전까지는 요금이 발생하지 않습니다. 과금은 전환 시에만 이뤄집니다.
            </TestimonialsFeatureDescription>
          </TestimonialsFeatureCard>
          
          <TestimonialsFeatureCard>
            <FeatureImage>
              <FontAwesomeIcon icon={faBullseye} className="w-8 h-8 text-white" />
            </FeatureImage>
            <TestimonialsFeatureTitle>업종별 맞춤 추천</TestimonialsFeatureTitle>
            <TestimonialsFeatureDescription>
              전환 확률이 높은 구조를 업종별로 자동 추천합니다.
            </TestimonialsFeatureDescription>
          </TestimonialsFeatureCard>
        </TestimonialsFeaturesGrid>

        <TestimonialsTitle>첫 사용자의 경험이 말해줍니다</TestimonialsTitle>
        <TestimonialsGrid>
          <TestimonialCard>
            <TestimonialText>
              광고 없이 전환 퍼널을 복사할 수 있다는 게 신세계였어요. 
              단 1건의 전환으로 수업료 다 뽑았습니다.
            </TestimonialText>
            <TestimonialAuthor>교육 전원티드</TestimonialAuthor>
            <TestimonialRole>CEO StarCross</TestimonialRole>
          </TestimonialCard>
          
          <TestimonialCard>
            <TestimonialText>
              하루 만에 결과를 봤어요. 
              디자이너인 제가 전환 퍼널을 직접 만들 수 있다니!
            </TestimonialText>
            <TestimonialAuthor>프리면서 디자이니</TestimonialAuthor>
            <TestimonialRole>COO Calipso</TestimonialRole>
          </TestimonialCard>
          
          <TestimonialCard>
            <TestimonialText>
              SkillBlock 복사만 했는데 상담 예약이 났어요. 
              광고비 대신 두어썸 쓸게요.
            </TestimonialText>
            <TestimonialAuthor>성담코치 대표</TestimonialAuthor>
            <TestimonialRole>080 Platinex</TestimonialRole>
          </TestimonialCard>
        </TestimonialsGrid>
      </TestimonialsSection>

      <FAQSection>
        <SectionTitle>FAQ</SectionTitle>
        
        <FAQItem>
          <FAQQuestion>전환 퍼널을 실행하려면 어떤 준비가 필요한가요?</FAQQuestion>
          <FAQAnswer>
            별도의 광고 세팅이나 복잡한 설정 없이, SkillBlock을 복사하기만 하면 즉시 실행됩니다. 
            누구나 쉽게 따라할 수 있도록 설계되어 있습니다.
          </FAQAnswer>
        </FAQItem>
        
        <FAQItem>
          <FAQQuestion>전환이 안 되면 비용이 정말 0원인가요?</FAQQuestion>
          <FAQAnswer>
            네, 맞습니다. 성과가 나기 전까지는 요금이 발생하지 않습니다. 
            과금은 전환(Bloom)이 발생했을 때만 이뤄집니다.
          </FAQAnswer>
        </FAQItem>
        
        <FAQItem>
          <FAQQuestion>어떤 업종에 가장 적합한가요?</FAQQuestion>
          <FAQAnswer>
            교육, 상담, 서비스업 등 다양한 업종에 최적화되어 있습니다. 
            업종별 맞춤 추천 시스템을 통해 전환 확률이 높은 구조를 자동으로 추천해드립니다.
          </FAQAnswer>
        </FAQItem>
      </FAQSection>

      <FinalCTASection>
        <SectionTitle>지금 바로 전환을 시작하세요.</SectionTitle>
        <HeroSubtitle style={{ marginBottom: '2rem' }}>
          지금 퍼널을 복사하면 10분 안에 전환 결과를 확인할 수 있습니다. 
          성과가 나기 전까지는 요금이 발생하지 않습니다.
        </HeroSubtitle>
        <CTAButton onClick={handleOpenModal}>
          무료 상담 신청하기
        </CTAButton>
      </FinalCTASection>
      
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="무료 상담 신청"
        subtitle="전환 퍼널에 대해 궁금한 점이 있으시면 언제든 연락주세요."
      />
    </DoasomeContainer>
  );
};

export default DoasomePage; 