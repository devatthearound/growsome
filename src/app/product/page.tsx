"use client"

import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faRocket, faClock, faUsers, faLightbulb, faChartLine, faComments, faFileAlt, faPlay, faLock, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Check, X, TrendingUp, CheckCircle, Clock, AlertTriangle, ArrowRight, Smile, Frown, HelpCircle, Wallet, Users, FileCheck, Rocket } from 'lucide-react';
import Link from 'next/link';
import CoursePreviewTable from '@/components/CoursePreviewTable';



// Global style to remove underline from all links
const GlobalStyle = createGlobalStyle`
  a {
    text-decoration: none;
  }
  
  /* Suppress console warnings for styled-components */
  * {
    box-sizing: border-box;
  }
`;

// 새로운 색상 팔레트 정의 (이미지의 Five 그라디언트 스타일 적용)
const colors = {
  primary: '#080d34',    // 순수 블랙
  secondary: '#FFFFFF',  // 순수 화이트
  accent: '#5C59E8',     // 포인트 컬러 변경
  text: {
    primary: '#080d34',
    secondary: '#666666',
    light: '#FFFFFF'
  },
  gradient: {
    hero: 'linear-gradient(135deg, rgba(92, 89, 232, 0.08) 0%, rgba(92, 89, 232, 0.02) 100%)',
    accent: 'linear-gradient(135deg, #5C59E8 0%, #4A47D5 100%)'
  }
};

const ProductPage = styled.div`
  width: 100%;
  background: ${colors.secondary};
  color: ${colors.primary};
  padding-top: 0;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 3;
`;

// Gradient animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HeroContainer = styled.div`
  width: 100%;
  height: 600px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  background: #5C59E8;

  @media (max-width: 768px) {
    height: 500px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%);
    z-index: 1;
  }
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #5C59E8;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 900px;
  padding: 0 24px;
`;

const Title = styled(motion.h1).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'transition'].includes(prop)
})`
  font-size: 5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  span {
    color: #FFF;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 8px;
      background: rgba(255,255,255,0.3);
      border-radius: 4px;
      z-index: -1;
    }
  }

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
`;

const Subtitle = styled(motion.p).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'transition'].includes(prop)
})`
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 24px;
  line-height: 1.6;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const PackageSection = styled.section`
  padding: 120px 0;
  background: ${colors.secondary};
`;

const PackageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;

  @media (max-width: 1200px) {
    gap: 24px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
`;

interface PackageCardProps {
  $isPremium?: boolean;
}

const PurchaseButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => !['$isPremium', 'whileHover', 'whileTap'].includes(prop)
})<{ $isPremium?: boolean }>`
  width: 100%;
  background: ${props => props.$isPremium ? colors.gradient.accent : 'transparent'};
  color: ${props => props.$isPremium ? colors.text.light : colors.text.primary};
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  border: 2px solid ${props => props.$isPremium ? 'transparent' : colors.accent};
  cursor: pointer;
  margin-top: 32px;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.gradient.accent};
    color: ${colors.text.light};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(92, 89, 232, 0.3);
  }
`;

const PackageCard = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['$isPremium', 'whileHover', 'transition'].includes(prop)
})<PackageCardProps>`
  background: ${colors.secondary};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 40px;
  position: relative;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${props => props.$isPremium && `
    background: linear-gradient(135deg, rgba(92, 89, 232, 0.05) 0%, rgba(92, 89, 232, 0.1) 100%);
    border: 2px solid ${colors.accent};
    box-shadow: 0 4px 20px rgba(92, 89, 232, 0.1);
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 1200px) {
    padding: 32px;
  }
`;

const PackageHeader = styled.div`
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    margin-bottom: 24px;
  }
`;

const PackageType = styled.div`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  margin-bottom: 8px;
`;

const PackageTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #080d34;

  @media (max-width: 1200px) {
    font-size: 1.5rem;
  }
`;

const Price = styled.div`
  font-size: 2.75rem;
  font-weight: 700;
  color: #080d34;
  margin-bottom: 12px;

  span {
    font-size: 1.1rem;
    color: ${colors.text.secondary};
  }

  @media (max-width: 1200px) {
    font-size: 2.5rem;
  }
`;

const PackageDescription = styled.p`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  margin-bottom: 32px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 1200px) {
    gap: 12px;
  }
`;

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 1.1rem;
  color: ${colors.text.secondary};
  line-height: 1.5;

  svg {
    color: ${colors.accent};
    font-size: 1.2rem;
    margin-top: 4px;
  }

  @media (max-width: 1200px) {
    font-size: 1rem;
  }
`;

const TimelineSection = styled.section`
  padding: 120px 0;
  background: ${colors.secondary};
`;

const TimelineTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 80px;
  text-align: center;
  color: ${colors.text.primary};

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 60px;
  }
`;

const TimelineContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: ${colors.accent};
    opacity: 0.3;
    z-index: 1;
  }
`;

const TimelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  position: relative;
  z-index: 2;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const TimelineStep = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['initial', 'whileInView', 'transition', 'viewport'].includes(prop)
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${colors.secondary};
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 1024px) {
    flex-direction: row;
    text-align: left;
    gap: 24px;
  }
`;

const StepIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${colors.gradient.accent};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
  font-size: 24px;

  @media (max-width: 1024px) {
    margin-bottom: 0;
    flex-shrink: 0;
  }
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #080d34;
`;

const StepDescription = styled.p`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  line-height: 1.5;
`;

const Timeline = () => {
  const steps = [
    {
      icon: faComments,
      title: "Discovery Call",
      description: "초기 상담을 통해 프로젝트 범위와 요구사항을 파악합니다"
    },
    {
      icon: faLightbulb,
      title: "기획 및 분석",
      description: "사업 아이템 분석 및 시장 조사를 진행합니다"
    },
    {
      icon: faFileAlt,
      title: "초안 작성",
      description: "사업계획서 초안과 기본 목업을 제작합니다"
    },
    {
      icon: faRocket,
      title: "완성 및 검토",
      description: "최종 사업계획서와 상세 목업을 완성합니다"
    },
    {
      icon: faCheck,
      title: "최종 전달",
      description: "모든 산출물을 검토하고 최종 전달합니다"
    }
  ];

  return (
    <TimelineSection>
      <TimelineTitle>2주 완성 플랜</TimelineTitle>
      <TimelineContainer>
        <TimelineGrid>
          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StepIcon>
                <FontAwesomeIcon icon={step.icon} />
              </StepIcon>
              <StepContent>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepContent>
            </TimelineStep>
          ))}
        </TimelineGrid>
      </TimelineContainer>
    </TimelineSection>
  );
};

const HeroButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'transition', 'as'].includes(prop)
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #06FF01;
  color: #000000;
  font-size: 1.4rem;
  font-weight: 800;
  padding: 20px 40px;
  border-radius: 100px;
  border: none;
  text-decoration: none;
  margin-top: 32px;
  box-shadow: 0 6px 25px rgba(6, 255, 1, 0.4);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 35px rgba(6, 255, 1, 0.5);
    background: #00F100;
  }

  svg {
    color: #000000;
  }
`;

const SaleBadge = styled.span`
  background: rgb(255, 255, 255);
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 16px;
  display: inline-block;
`;


const StatsSection = styled.section`
  padding: 60px 0;
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: center;
  gap: 60px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
    align-items: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${colors.accent};
  margin-bottom: 8px;
  
  span {
    font-size: 1.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: ${colors.text.secondary};
`;

const FeaturedReview = styled.div`
  max-width: 800px;
  margin: 40px auto 0;
  padding: 24px;
  background: ${colors.secondary};
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  font-size: 1.8rem;
  border-radius: 16px;
  text-align: center;
`;

const ReviewQuote = styled.blockquote`
  font-size: 1.3rem;
  color: ${colors.text.primary};
  font-weight: 600;
  margin-bottom: 24px;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  font-family: "Noto Serif KR", serif;
`;

const ReviewAuthor = styled.div`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;

  &::before {
    content: '';
    width: 40px;
    height: 2px;
    background: ${colors.accent};
    display: inline-block;
    opacity: 0.5;
  }

  &::after {
    content: '';
    width: 40px;
    height: 2px;
    background: ${colors.accent};
    display: inline-block;
    opacity: 0.5;
  }
`;

const Stats = () => {
  return (
    <StatsSection>
      <StatsContainer>
        <StatItem>
          <StatNumber>4.9<span>/5</span></StatNumber>
          <StatLabel>수강생 평점</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>50<span>명</span></StatNumber>
          <StatLabel>초기 선발 인원</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>95<span>%</span></StatNumber>
          <StatLabel>수강생 재등록률</StatLabel>
        </StatItem>
      </StatsContainer>
      
      <FeaturedReview>
        <ReviewQuote>
          "실제 사업 계획과 MVP 구축에 큰 도움이 되었습니다.<br />특히 전문가의 실시간 피드백이 가장 큰 장점이었습니다."
        </ReviewQuote>
        <ReviewAuthor>
          김OO 님 - 1기 수강생
        </ReviewAuthor>
      </FeaturedReview>
    </StatsSection>
  );
};

const CTASection = styled.section`
  padding: 120px 0;
  background: ${colors.gradient.hero};
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${colors.text.primary};
  margin-bottom: 40px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTAButton = styled(motion.a).withConfig({
  shouldForwardProp: (prop) => !['whileHover', 'whileTap'].includes(prop)
})`
  background: ${colors.gradient.accent};
  color: ${colors.text.light};
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  box-shadow: 0 4px 12px rgba(92, 89, 232, 0.25);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(92, 89, 232, 0.3);
  }
`;

const OnboardingInfo = styled.div`
  max-width: 600px;
  margin: 0 auto;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const OnboardingTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #080d34;
  margin-bottom: 24px;
`;

const OnboardingStep = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(92, 89, 232, 0.05);
  border-radius: 12px;
  margin-bottom: 16px;
  text-align: left;
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  background: ${colors.gradient.accent};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
`;

const StepContentAlt = styled.div`
  flex: 1;
`;

const StepTitleAlt = styled.h4`
  font-weight: 600;
  margin-bottom: 4px;
  color: #080d34;
`;

const StepDescriptionAlt = styled.p`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  line-height: 1.5;
`;

const NewSection = styled.section`
  padding: 80px 0;
  background: ${colors.secondary};
  text-align: center;
`;

const NewSectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${colors.text.primary};
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const NewSectionContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
  line-height: 1.6;
`;

const Highlight = styled.p`
  font-size: 1.2rem;
  color: ${colors.accent};
  font-weight: 600;
  margin-bottom: 20px;
`;

const Paragraph = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
  margin-bottom: 20px;
`;

const TestimonialSection = styled.section`
  padding: 80px 0;
  background: ${colors.secondary};
  text-align: center;
`;

const TestimonialTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${colors.text.primary};
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TestimonialList = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const TestimonialItem = styled.div`
  flex: 1 1 300px;
  max-width: 300px;
  padding: 20px;
  background: rgba(92, 89, 232, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CustomerAvatar = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const CustomerName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 10px;
`;

const CustomerFeedback = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
  line-height: 1.6;
  text-align: center;
`;

const Section = styled.section`
  width: 100%;
  padding: 80px 0;
  background: #fff;
  text-align: center;
`;

const Header = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'transition'].includes(prop)
})`
  text-align: center;
  margin-bottom: 40px;
`;

const PriceIncreaseContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
`;

const PriceIncreaseLine = styled.div`
  position: absolute;
  left: 24px;
  top: 40px;
  bottom: 40px;
  width: 2px;
  background: #E5E7EB;
`;

const PriceIncreaseItem = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'transition'].includes(prop)
})`
  position: relative;
  padding-left: 48px;
  margin-bottom: 24px;
`;

const PriceIncreaseCircle = styled.div<{ $active?: boolean; $warning?: boolean }>`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$warning ? '#5C59E8' : props.$active ? '#5C59E8' : '#E5E7EB'};
  border: ${props => props.$active ? '2px solid #fff' : 'none'};
  box-shadow: ${props => props.$active ? '0 0 0 2px #5C59E8' : 'none'};
  z-index: 2;
`;

const PriceBox = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['$active', '$warning', '$completed'].includes(prop)
})<{ $active?: boolean; $warning?: boolean; $completed?: boolean }>`
  background: ${props => props.$warning ? '#FFF5F5' : props.$active ? '#efefff' : '#fff'};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.$warning ? '#FFCCCC' : props.$active ? '#5C59E8' : '#E5E7EB'};
  box-shadow: ${props => props.$active ? '0 4px 6px rgba(92, 89, 232, 0.1)' : '0 1px 3px rgba(0,0,0,0.1)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${props => props.$completed ? 0.5 : 1};
`;

const PriceContent = styled.div`
  text-align: left;
`;

const SaleStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9CA3AF;
  font-size: 14px;
`;

const StatusChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(92, 89, 232, 0.1);
  color: #5C59E8;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
`;

const PriceLabel = styled.div`
  font-size: 16px;
  color: #080d34;
  margin-bottom: 8px;
`;

const PriceAmount = styled.div<{ $active?: boolean; $completed?: boolean }>`
  font-size: ${props => props.$active ? '32px' : '24px'};
  font-weight: 700;
  color: ${props => props.$active ? '#5C59E8' : props.$completed ? '#9CA3AF' : '#666'};
  margin-bottom: 8px;
  
  span {
    font-size: 14px;
    color: ${props => props.$completed ? '#9CA3AF' : '#666'};
    margin-left: 8px;
  }
`;

const SubText = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 12px;
`;

const WarningBox = styled(PriceBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #FF4D4D;
  font-weight: 500;
`;

const PricingDetails = styled.p`
  font-size: 1.2rem;
  color: ${colors.text.secondary};
  margin-bottom: 24px;
`;

const UrgencyMessage = styled.p`
  font-size: 1rem;
  color: #FF4D4D;
  font-weight: 600;
  margin-bottom: 32px;
`;

const PriceIncrease = () => {
  return (
    <Section>
      <PriceIncreaseContainer>
        <Header>
          <StatusChip>
            <TrendingUp size={16} />
            가격 인상 예정
          </StatusChip>
          <h2 className="text-3xl font-bold mb-4">
            매달 한정 인원 선착순 소진시<br />가격이 인상됩니다
          </h2>
          <p className="text-gray-600">
            지금 등록하시고 가장 좋은 조건으로 시작하세요
          </p>
        </Header>

        <PriceIncreaseLine />

        <PriceIncreaseItem>
          <PriceIncreaseCircle />
          <PriceBox $completed>
            <PriceContent>
              <PriceLabel>슈퍼 얼리버드</PriceLabel>
              <PriceAmount $completed>₩495,000</PriceAmount>
            </PriceContent>
            <SaleStatus>
              <CheckCircle size={16} />
              <span>판매 완료</span>
            </SaleStatus>
          </PriceBox>
        </PriceIncreaseItem>

        <PriceIncreaseItem>
          <PriceIncreaseCircle />
          <PriceBox $completed>
            <PriceContent>
              <PriceLabel>1차 판매가</PriceLabel>
              <PriceAmount $completed>₩742,500</PriceAmount>
            </PriceContent>
            <SaleStatus>
              <CheckCircle size={16} />
              <span>판매 완료</span>
            </SaleStatus>
          </PriceBox>
        </PriceIncreaseItem>

        <PriceIncreaseItem>
          <PriceIncreaseCircle $active />
          <PriceBox $active>
            <PriceContent>
              <StatusChip>
                <Clock size={16} />
                현재 판매 중
              </StatusChip>
              <PriceLabel>2차 판매가</PriceLabel>
              <PriceAmount $active>월 82,500원 <span>(12개월 할부 기준)</span></PriceAmount>
              <SubText>
                카카오톡 채널 친구 쿠폰 할인 적용시
              </SubText>
            </PriceContent>
          </PriceBox>
        </PriceIncreaseItem>

        <PriceIncreaseItem>
          <PriceIncreaseCircle $warning />
          <WarningBox $warning>
            <AlertTriangle size={16} />
            예고없이 가격이 인상될 수 있습니다
          </WarningBox>
        </PriceIncreaseItem>

        <PriceIncreaseItem>
          <PriceIncreaseCircle />
          <PriceBox>
            <PriceContent>
              <PriceLabel>3차 판매가</PriceLabel>
              <PriceAmount>₩1,237,500</PriceAmount>
            </PriceContent>
          </PriceBox>
        </PriceIncreaseItem>

        <PriceIncreaseItem>
          <PriceIncreaseCircle />
          <PriceBox>
            <PriceContent>
              <PriceLabel>4차 판매가</PriceLabel>
              <PriceAmount>₩1,485,000</PriceAmount>
            </PriceContent>
          </PriceBox>
        </PriceIncreaseItem>
      </PriceIncreaseContainer>
    </Section>
  );
};

const WhySection = styled.section`
  padding: 80px 0;
  background: linear-gradient(180deg, #F7F9FC 0%, #FFFFFF 100%);
`;

const WhyContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 24px;
`;

const WhyTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 60px;
  color: ${colors.text.primary};
`;

const WhyGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const WhyCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

const CardNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.accent};
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${colors.text.primary};
`;

const CardDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${colors.text.secondary};
`;

const WhyGrowsome = () => {
  return (
    <WhySection>
      <WhyContainer>
        <WhyTitle>왜 그로우썸부스터인가요?</WhyTitle>
        <WhyGrid>
          <WhyCard>
            <CardNumber>01</CardNumber>
            <CardTitle>AI가 실행하는 완벽한 사업계획!</CardTitle>
            <CardDescription>
              사업계획서 작성부터 MVP 목업까지,
              AI가 실행력을 더해 완벽한 결과물을 만듭니다.
              이제 혼자 고민하지 마세요.
            </CardDescription>
          </WhyCard>

          <WhyCard>
            <CardNumber>02</CardNumber>
            <CardTitle>2주 만에 완성되는 실전 준비</CardTitle>
            <CardDescription>
              지원사업 신청 마감에 쫓기지 마세요.
              2주 만에 전문가와 AI의 협업으로
              실전에 필요한 모든 준비를 마칠 수 있습니다.
            </CardDescription>
          </WhyCard>

          <WhyCard>
            <CardNumber>03</CardNumber>
            <CardTitle>전문가의 실시간 피드백</CardTitle>
            <CardDescription>
              AI가 만든 결과물에 대해
              현직 전문가의 피드백이 더해집니다.
              실제 심사 기준에 맞는 완성도 높은
              산출물을 보장합니다.
            </CardDescription>
          </WhyCard>
        </WhyGrid>
      </WhyContainer>
    </WhySection>
  );
};

const HookSection = styled.section`
  padding: 80px 0;
  background: #F8F9FF;
`;

const HookContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
`;

const TimingBadge = styled.div`
  background: ${colors.accent};
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 24px;
  text-align: center;
`;

const MainTitle = styled.h2`
  font-size: 4rem;
  font-weight: 800;
  color: ${colors.accent};
  margin-bottom: 16px;
  line-height: 1.3;
  text-align: center;
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: ${colors.text.secondary};
  margin-bottom: 40px;
  text-align: center;
  line-height: 1.6;
`;

const ActionBox = styled.div`
  background: linear-gradient(135deg, #5C59E8 0%, #4A47E3 100%);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  color: white;
  margin-top: 40px;
`;

const ActionTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: white;
`;

const ActionText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  opacity: 0.95;
  margin-bottom: 0;
`;

const Hook = () => {
  return (
    <HookSection>
      <HookContainer>
        <TimingBadge>2025년 정부지원금 8조 원 규모</TimingBadge>
        
        <MainTitle>
          창업 3년차,<br />
          당신의 골든타임이 <br />얼마 남지 않았습니다
        </MainTitle>
        
        <SubTitle>
          매년 수많은 스타트업이 놓치는 기회,<br />
          이제는 더 이상 지원금을 받지 못하는 후회를 하지 마세요
        </SubTitle>

        <ActionBox>
          <ActionTitle>
            AI로 단번에 해결하세요!
          </ActionTitle>
          <ActionText>
            누구나 시도할 수 있지만 아무나 성공하지 못했던 지원사업,<br />
            이제 AI와 전문가의 협업으로<br />
            당신의 사업을 성장시킬 자금을 확보하세요.
          </ActionText>
        </ActionBox>
      </HookContainer>
    </HookSection>
  );
};

// 강의 미리보기 섹션 - 테이블 형태로 데이타 변경
const CoursePreviewSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(135deg, #F7F9FC 0%, #FFFFFF 100%);
`;

const CoursePreviewContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const CoursePreviewTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 20px;
  color: ${colors.text.primary};
`;

const CoursePreviewSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: ${colors.text.secondary};
  margin-bottom: 60px;
  line-height: 1.6;
`;

// 테이블 스타일 컴포넌트들
const CourseTable = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 60px;
`;

const CourseTableHeader = styled.div`
  background: #f8fafc;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: 60px 1fr 100px 120px 80px;
  gap: 20px;
  align-items: center;
  font-weight: 600;
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr 80px;
    gap: 12px;
    
    > span:nth-child(3),
    > span:nth-child(4) {
      display: none;
    }
  }
`;

const CourseTableRow = styled.div<{ $isPublic?: boolean }>`
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: grid;
  grid-template-columns: 60px 1fr 100px 120px 80px;
  gap: 20px;
  align-items: center;
  transition: all 0.2s ease;
  cursor: ${props => props.$isPublic ? 'pointer' : 'default'};
  opacity: ${props => props.$isPublic ? 1 : 0.6};
  
  &:hover {
    background: ${props => props.$isPublic ? '#f8fafc' : 'transparent'};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 40px 1fr 80px;
    gap: 12px;
    
    > div:nth-child(3),
    > div:nth-child(4) {
      display: none;
    }
  }
`;

const CourseNumber = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.text.secondary};
  text-align: center;
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CourseTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0;
  line-height: 1.4;
`;

const CourseDescription = styled.p`
  font-size: 0.9rem;
  color: ${colors.text.secondary};
  margin: 0;
  line-height: 1.4;
`;



const CourseLevel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(92, 89, 232, 0.1);
  color: ${colors.accent};
  text-align: center;
`;

const CourseStatus = styled.div<{ $isPublic?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  background: ${props => props.$isPublic ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)'};
  color: ${props => props.$isPublic ? '#10B981' : '#6B7280'};
`;

const CoursePreviewCTA = styled.div`
  text-align: center;
  margin-top: 40px;
`;



const CouponSection = styled.section`
  padding: 80px 24px;
  background: linear-gradient(135deg, #EEF2FF 0%,rgb(247, 245, 255) 50%,rgb(255, 255, 255) 100%);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(63, 17, 201, 0.03) 0%, rgba(107, 71, 227, 0) 100%);
    z-index: 1;
  }
`;

const CouponContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  cursor: pointer;
`;

const CouponTitle = styled.h2`
  color: #5c59e7;
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const CouponSubtitle = styled.h3`
  color:#060D34
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 40px;
`;

const CouponEnvelope = styled.div`
  background: #4A47E3;
  border-radius: 24px;
  padding: 40px;
  margin: 40px auto;
  position: relative;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(74, 71, 227, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    border-radius: 24px;
  }
`;

const EnvelopeContent = styled.div`
  color: white;
  font-size: 3rem;
  font-weight: 800;
`;

const FreeBadge = styled.div`
  background: #4A47E3;
  color: white;
  padding: 12px 24px;
  border-radius: 100px;
  font-weight: 700;
  font-size: 1.2rem;
  position: absolute;
  top: -20px;
  right: -20px;
  box-shadow: 0 4px 12px rgba(74, 71, 227, 0.3);
`;

const CouponMessage = styled.p`
  color: #666;
  font-size: 1.4rem;
  margin-top: 40px;
  line-height: 1.6;
`;

const Coupon = () => {
  return (
    <CouponSection>
      <a href="http://pf.kakao.com/_Lpaln/chat" target="_blank" rel="noopener noreferrer">
        <CouponContainer>
          <CouponTitle>선착순 특가</CouponTitle>
          <CouponSubtitle>종료 주의</CouponSubtitle>
          
          <CouponEnvelope>
            <EnvelopeContent>39,000원 할인</EnvelopeContent>
            <FreeBadge>Coupon</FreeBadge>
          </CouponEnvelope>

          <CouponMessage>
            카카오톡 채널 추가하고 쿠폰 받으세요!
          </CouponMessage>
        </CouponContainer>
      </a>
    </CouponSection>
  );
};

const PostPurchaseSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(135deg, #4A47E3 0%, #5C59E8 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`;

const PostPurchaseContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
`;

const ChangeHighlight = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 60px;
  text-align: center;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);

  span {
    color: #06FF01;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 4px;
      width: 100%;
      height: 8px;
      background: rgba(6, 255, 1, 0.3);
      border-radius: 4px;
      z-index: -1;
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ChangeList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const ChangeItem = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['initial', 'whileInView', 'transition', 'viewport'].includes(prop)
})`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 40px 30px;
  text-align: left;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`;

const ItemIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #06FF01;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 8px 16px rgba(6, 255, 1, 0.3);

  svg {
    width: 32px;
    height: 32px;
    color: #000;
  }
`;

const ItemTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
`;

const ItemDescription = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

const PostPurchase = () => {
  return (
    <PostPurchaseSection>
      <PostPurchaseContainer>
        <ChangeHighlight>
          2주 후, <span>당신의 변화</span>가<br />시작됩니다
        </ChangeHighlight>
        <ChangeList>
          <ChangeItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <ItemIcon>
              <FileCheck size={32} />
            </ItemIcon>
            <ItemTitle>완벽한 서류 준비</ItemTitle>
            <ItemDescription>
              AI의 도움으로 지원사업 서류가 완벽하게 준비됩니다. 더 이상 고민하지 마세요.
            </ItemDescription>
          </ChangeItem>

          <ChangeItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ItemIcon>
              <Rocket size={32} />
            </ItemIcon>
            <ItemTitle>MVP 완성</ItemTitle>
            <ItemDescription>
              사업계획서와 MVP, 전문가 피드백까지 한 번에 해결됩니다. 이제 실행만 남았습니다.
            </ItemDescription>
          </ChangeItem>

          <ChangeItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <ItemIcon>
              <TrendingUp size={32} />
            </ItemIcon>
            <ItemTitle>성장 준비 완료</ItemTitle>
            <ItemDescription>
              자금 확보를 위한 모든 준비가 끝났습니다. 이제 당신의 사업이 성장할 차례입니다.
            </ItemDescription>
          </ChangeItem>
        </ChangeList>
      </PostPurchaseContainer>
    </PostPurchaseSection>
  );
};

// Define the reviews array
const reviews = [
  {
    text: "정말 유용한 프로그램입니다. 사업계획서 작성에 큰 도움이 되었습니다.",
    author: "스타트업 대표"
  },
  {
    text: "AI의 도움으로 지원사업 신청이 훨씬 수월해졌습니다.",
    author: "예비창업자"
  },
  {
    text: "전문가의 피드백이 정말 유익했습니다. 추천합니다!",
    author: "1인사업자"
  }
];

const SocialProof = () => {
  return (
    <SocialProofSection>
      <SocialProofContainer>
        <StatsGrid>
          <StatCard>
            <h3>4.9/5 평점</h3>
            <p>고객 만족도</p>
          </StatCard>
          <StatCard>
            <h3>95% 재등록률</h3>
            <p>높은 재구매율</p>
          </StatCard>
          <StatCard>
            <h3>150+ 고객</h3>
            <p>신뢰받는 서비스</p>
          </StatCard>
          <StatCard>
            <h3>100% 실전 경험</h3>
            <p>검증된 프로그램</p>
          </StatCard>
        </StatsGrid>
        <ReviewGrid>
          {reviews.map((review, index) => (
            <ReviewCard key={index}>
              <ReviewStars>★★★★★</ReviewStars>
              <ReviewText>{review.text}</ReviewText>
              <p>{review.author}</p>
            </ReviewCard>
          ))}
        </ReviewGrid>
      </SocialProofContainer>
    </SocialProofSection>
  );
};

// Add styled components for SocialProof
const SocialProofSection = styled.section`
  padding: 80px 0;
  background: #f9f9f9;
  text-align: center;
`;

const SocialProofContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  text-align: center;

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #080d34;
    margin-bottom: 8px;
  }

  p {
    font-size: 1rem;
    color: ${colors.text.secondary};
  }
`;

const ReviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const ReviewCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  text-align: left;
`;

const ReviewStars = styled.div`
  color: #FFD700;
  margin-bottom: 8px;
`;

const ReviewText = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
  margin-bottom: 8px;
`;

const PainPoints = () => {
  return (
    <PainPointsSection>
      <PainPointsContainer>
        <PainPoint>
          <h3>사업계획서 작성이 막막하다?</h3>
          <p>AI가 도움드립니다!</p>
        </PainPoint>
        <PainPoint>
          <h3>지원사업 신청, 매번 미루다 기회를 놓치고 있나요?</h3>
          <p>지금이 기회입니다!</p>
        </PainPoint>
      </PainPointsContainer>
    </PainPointsSection>
  );
};

// Add styled components for PainPoints
const PainPointsSection = styled.section`
  padding: 80px 0;
  background: #f9f9f9;
  text-align: center;
`;

const PainPointsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PainPoint = styled.div`
  margin-bottom: 40px;

  h3 {
    font-size: 2.4rem;
    font-weight: 800;
    color: #080d34;
    margin-bottom: 16px;
  }

  p {
    font-size: 2.1rem;
    color: ${colors.text.secondary};
  }
`;

const FinalCTASection = styled.section`
  padding: 80px 0;
  background: #060D34;
  text-align: center;
`;

const FinalCTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${colors.text.light};
  margin-bottom: 40px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FinalCTAButton = styled(HeroButton).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'transition', 'as'].includes(prop)
})`
  background: #06FF01;
  box-shadow: 0 6px 25px rgba(6, 255, 1, 0.4);

  &:hover {
    background: #00F100;
    box-shadow: 0 10px 35px rgba(6, 255, 1, 0.5);
  }
`;

// Class Section Components
const ClassSection = styled.section`
  padding: 80px 0;
  background: #FAFAFA;
`;

const ClassContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ClassTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  color: ${colors.primary};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ClassDescription = styled.p`
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 50px;
  color: ${colors.text.secondary};
  line-height: 1.6;
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const CourseCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid #f0f0f0;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  }
`;

const CourseHeader = styled.div`
  margin-bottom: 20px;
`;

const ClassCourseTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${colors.primary};
`;

const ClassCourseDescription = styled.p`
  font-size: 0.95rem;
  color: ${colors.text.secondary};
  line-height: 1.5;
  margin-bottom: 15px;
`;

const CourseMeta = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: ${colors.text.secondary};
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ClassPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${colors.accent};
`;

const ClassOriginalPrice = styled.div`
  font-size: 1rem;
  color: ${colors.text.secondary};
  text-decoration: line-through;
  margin-bottom: 5px;
`;

const ClassDiscountBadge = styled.span`
  background: #FF6B6B;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ClassCourseButton = styled.button`
  background: ${colors.gradient.accent};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(92, 89, 232, 0.3);
  }
`;

const ClassFeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;

const ClassFeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: ${colors.text.secondary};
`;

const ClassCheckIcon = styled.span`
  color: #4CAF50;
  font-size: 0.8rem;
`;

const Class = () => {
  const courses = [
    {
      id: 1,
      title: "AI 기초 마스터 과정",
      description: "ChatGPT와 AI 도구 활용의 기초부터 실전까지",
      level: "입문",
      duration: "4주",
      price: "99,000원",
      originalPrice: "198,000원",
      color: "#3B82F6",
      features: [
        "실습 자료 제공",
        "수료증 발급",
        "커뮤니티 접근 권한",
        "1:1 질문 답변",
        "5만원 상당 유료 AI 프로그램 무료 제공"
      ]
    },
    {
      id: 2,
      title: "AI 프롬프트 엔지니어링 심화",
      description: "고급 프롬프트 작성법과 AI 모델 자동화 실전",
      level: "중급",
      duration: "6주",
      price: "890,000원",
      originalPrice: "1,500,000원",
      color: "#F59E0B",
      features: [
        "실전 프로젝트 피드백",
        "고급 실습 자료",
        "전문가 멘토링",
        "프로젝트 리뷰",
        "80만원 상당 유료 AI 프로그램 무료 제공"
      ]
    },
    {
      id: 3,
      title: "AI 비즈니스 전략 과정",
      description: "AI를 활용한 BM 설계부터 투자·매각 전략까지",
      level: "고급",
      duration: "8주",
      price: "2,490,000원",
      originalPrice: "3,500,000원",
      color: "#EF4444",
      features: [
        "AI 기반 BM 설계 워크숍",
        "투자 유치 전략 및 피칭 시뮬레이션",
        "실전 사례 분석",
        "네트워킹 이벤트",
        "600만원 상당 유료 AI 개발 무료 제공"
      ]
    }
  ];

  return (
    <ClassSection>
      <ClassContainer>
        <ClassTitle>AI 사업 교육 과정</ClassTitle>
        <ClassDescription>
          100만 원 상당 유료 AI 툴까지 무료 제공!<br />
          단 1만 원 강의 결제로 시작하는<br />
          체계적이고 실전 중심의 AI 비즈니스 교육<br /><br />
          기초 → 개발 → 사업화까지<br />
          단계별 커리큘럼으로<br />
          당신의 AI 실행력과 수익화 역량을 완성하세요.
        </ClassDescription>
        
        <CourseGrid>
          {courses.map(course => (
            <CourseCard key={course.id}>
              <CourseHeader>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: course.color, 
                  borderRadius: '50%', 
                  marginBottom: '10px' 
                }}></div>
                <ClassCourseTitle>{course.title}</ClassCourseTitle>
                <ClassCourseDescription>{course.description}</ClassCourseDescription>
                <CourseMeta>
                  <MetaItem>
                    <FontAwesomeIcon icon={faUsers} />
                    난이도: {course.level}
                  </MetaItem>
                  <MetaItem>
                    <FontAwesomeIcon icon={faClock} />
                    기간: {course.duration}
                  </MetaItem>
                </CourseMeta>
              </CourseHeader>
              
              <PriceSection>
                <div>
                  <ClassOriginalPrice>정가: {course.originalPrice}</ClassOriginalPrice>
                  <ClassPrice>할인가: {course.price}</ClassPrice>
                </div>
              </PriceSection>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>📦 포함 혜택</h4>
                <ClassFeatureList>
                  {course.features.map((feature, index) => (
                    <ClassFeatureItem key={index}>
                      <ClassCheckIcon>
                        <FontAwesomeIcon icon={faCheck} />
                      </ClassCheckIcon>
                      {feature}
                    </ClassFeatureItem>
                  ))}
                </ClassFeatureList>
              </div>
              
              <ClassCourseButton style={{ backgroundColor: course.color }}>
                수강 신청하기
              </ClassCourseButton>
            </CourseCard>
          ))}
        </CourseGrid>
      </ClassContainer>
    </ClassSection>
  );
};

const FinalCTA = () => (
  <FinalCTASection>
    <FinalCTATitle>
      이제 실행만 남았다!<br />
      고민하는 순간, 가격이 오릅니다.
    </FinalCTATitle>
    <Link href="/courses" passHref>
      <FinalCTAButton
        as="button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        onClick={() => {}}
      >
        1만원 사업계획서 작성 패키지 시작하기
        <ArrowRight size={20} />
      </FinalCTAButton>
    </Link>
  </FinalCTASection>
);

// GlobalStyle을 별도의 컴포넌트로 분리
const GlobalStyleWrapper = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      setMounted(true);
    } catch (error) {
      console.error('Error mounting GlobalStyleWrapper:', error);
    }
  }, []);

  if (!mounted) return null;

  return <GlobalStyle />;
};

const ProductLanding = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      setIsMounted(true);
    } catch (error) {
      console.error('Error mounting ProductLanding:', error);
    }
  }, []);

  if (!isMounted) {
    return null; // 또는 로딩 상태를 표시하는 컴포넌트
  }

  return (
    <ProductPage>
      <GlobalStyleWrapper />
      <PainPoints />
      <Hook />
      <CoursePreviewTable />
      <Class />
{/*   <WhyGrowsome />
      <Timeline />
      <PostPurchase />
       <Coupon />
      <PriceIncrease />*/}
      <FinalCTA />
    </ProductPage>
  );
};

export default ProductLanding;