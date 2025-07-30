'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { growsomeTheme } from '@/components/design-system/theme';
import { Typography } from '@/components/design-system/Typography';
import { ColumnBox, Container } from '@/components/design-system/Layout';
import { GreenButton } from '@/components/design-system/Button';

interface HeroSectionProps {
  onDiagnosisClick: () => void;
}

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const HeroSectionContainer = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, ${growsomeTheme.color.Primary500} 0%, ${growsomeTheme.color.Primary700} 100%);
  color: ${growsomeTheme.color.White};
  
  @media ${growsomeTheme.device.mobile} {
    min-height: 80vh;
    padding: ${growsomeTheme.spacing["3xl"]} 0;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(6, 255, 1, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(81, 79, 228, 0.1) 0%, transparent 50%);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 ${growsomeTheme.spacing.lg};
  
  @media ${growsomeTheme.device.mobile} {
    padding: 0 ${growsomeTheme.spacing.md};
  }
`;

const HeroMainTitle = styled(Typography.DisplayXL700)`
  text-align: center;
  line-height: 1.1;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 2rem !important;
    line-height: 1.2;
  }
  
  @media ${growsomeTheme.device.tablet} {
    font-size: 2.5rem !important;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(90deg, ${growsomeTheme.color.Green400}, ${growsomeTheme.color.Green500});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 3s ease-in-out infinite;
  background-size: 200% 200%;
  font-weight: bold;
`;

const HeroSubText = styled(Typography.TextXL500)`
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.1rem !important;
  }
  
  @media ${growsomeTheme.device.tablet} {
    font-size: 1.25rem !important;
  }
`;

const HeroDescText = styled(Typography.TextL400)`
  @media ${growsomeTheme.device.mobile} {
    font-size: 1rem !important;
  }
`;

const HeroTitle = styled.div`
  position: relative;
`;

const HeroSubtitle = styled.div`
  animation: ${float} 6s ease-in-out infinite;
`;

const CTAButtonsHero = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.lg};
  align-items: center;
  
  @media ${growsomeTheme.device.tablet} {
    flex-direction: row;
    justify-content: center;
  }
`;

const DiagnosisButton = styled(GreenButton)`
  background: #1EFF19 !important;
  color: ${growsomeTheme.color.Black800} !important;
  font-weight: ${growsomeTheme.fontWeight.Bold} !important;
  
  &:hover:not(:disabled) {
    background: #0AE00A !important;
    color: ${growsomeTheme.color.Black800} !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(30, 255, 25, 0.4) !important;
  }
  
  &:active:not(:disabled) {
    background: #08B808 !important;
    transform: translateY(0) !important;
    box-shadow: 0 4px 15px rgba(30, 255, 25, 0.3) !important;
  }
  
  &:focus-visible {
    outline: 2px solid #1EFF19 !important;
    outline-offset: 2px;
  }
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 1rem !important;
    padding: 1rem 1.5rem !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${growsomeTheme.spacing.md};
  max-width: 600px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.mobile} {
    gap: ${growsomeTheme.spacing.sm};
    max-width: 100%;
  }
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(4, 1fr);
    max-width: 800px;
    gap: ${growsomeTheme.spacing.lg};
  }
  
  @media ${growsomeTheme.device.pc} {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1000px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: ${growsomeTheme.spacing.xl};
  border-radius: ${growsomeTheme.radius.radius2};
  text-align: center;
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing.lg};
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: ${growsomeTheme.fontWeight.Bold};
  color: ${growsomeTheme.color.Green400};
  margin-bottom: ${growsomeTheme.spacing.sm};
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: ${growsomeTheme.fontSize.TextS};
  opacity: 0.8;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 0.8rem;
  }
`;

const HeroSection: React.FC<HeroSectionProps> = ({ onDiagnosisClick }) => {
  return (
    <HeroSectionContainer>
      <HeroBackground />
      <Container>
        <HeroContent>
          <ColumnBox $gap={4} $ai="center">
            <ColumnBox $gap={3} $ai="center">
              <HeroTitle>
                <HeroMainTitle color={growsomeTheme.color.White}>
                  <span style={{display: 'block', marginBottom: '1rem'}}>🚀 잘 만든 홈페이지 하나로</span>
                  <GradientText>광고도, 데이터도 모두 10배 성장</GradientText>
                </HeroMainTitle>
              </HeroTitle>
              
              <HeroSubtitle>
                <HeroSubText color={growsomeTheme.color.White} style={{textAlign: 'center', opacity: 0.9}}>
                  AI 시대, 타겟별 맞춤형 비즈니스 성장 엔진
                </HeroSubText>
                <HeroDescText color={growsomeTheme.color.White} style={{textAlign: 'center', opacity: 0.8}}>
                  예비 1인 창업가부터 100억 매출 기업까지 - 10배 성장 보장
                </HeroDescText>
              </HeroSubtitle>
            </ColumnBox>

            <CTAButtonsHero>
              <DiagnosisButton $size="large" onClick={onDiagnosisClick}>
                �� 무료 10배 성장 진단 (5분 완료)
              </DiagnosisButton>
            </CTAButtonsHero>

            <StatsGrid>
              <StatCard>
                <StatNumber>50%</StatNumber>
                <StatLabel>개발 기간 단축</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>75%</StatNumber>
                <StatLabel>비용 절감</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>10배</StatNumber>
                <StatLabel>광고 효율</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>10배</StatNumber>
                <StatLabel>데이터 수집</StatLabel>
              </StatCard>
            </StatsGrid>
          </ColumnBox>
        </HeroContent>
      </Container>
    </HeroSectionContainer>
  );
};

export default HeroSection; 