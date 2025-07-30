'use client';

import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useRouter } from 'next/navigation';
import { growsomeTheme } from '@/components/design-system/theme';
import HeroSection from '@/app/components/services/HeroSection';
import PortfolioSection from '@/app/components/services/PortfolioSection';
import ProblemsSection from '@/app/components/services/ProblemsSection';
import ServicesSection from '@/app/components/services/ServicesSection';

// Services Page Component
const Services = () => {
  const router = useRouter();

  const handleFreeDiagnosisClick = () => {
    router.push('/diagnosis');
  };

  // FOMO 모달 팝업 구현
  const [showFomo, setShowFomo] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('fomoClosed')) return;
    const onScroll = () => {
      if (window.scrollY > 400 && !showFomo) {
        setShowFomo(true);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [showFomo]);
  
  const handleCloseFomo = () => {
    setShowFomo(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fomoClosed', '1');
    }
  };

  return (
    <ThemeProvider theme={growsomeTheme}>
      <ServicesContainer>
        <HeroSection onDiagnosisClick={handleFreeDiagnosisClick} />
        <PortfolioSection />
        <ProblemsSection />
        <ServicesSection onDiagnosisClick={handleFreeDiagnosisClick} />
        
        {/* FOMO 마감 임박 모달 */}
        {showFomo && (
          <FomoOverlay>
            <FomoModal>
              <FomoHeader>
                <FomoTitleRow>
                  <span style={{fontSize:'1.8rem'}}>⏰</span>
                  <FomoTitle>마감 임박 알림</FomoTitle>
                </FomoTitleRow>
                <FomoClose onClick={handleCloseFomo}>×</FomoClose>
              </FomoHeader>
              <FomoList>
                <FomoItem>🔴 예비 1인 창업가: 월 5팀 → 3팀으로 축소</FomoItem>
                <FomoItem>🔴 100억 매출 기업: 분기 3팀 → 반기 3팀으로 축소</FomoItem>
                <FomoItem>🔴 2025년 하반기 일정 조기 마감 예상</FomoItem>
              </FomoList>
            </FomoModal>
          </FomoOverlay>
        )}
      </ServicesContainer>
    </ThemeProvider>
  );
};

// Styled Components
const ServicesContainer = styled.div`
  width: 100%;
  background: ${growsomeTheme.color.Gray50};
  min-height: 100vh;
  overflow-x: hidden;
`;

// FOMO Modal Styled Components
const FomoOverlay = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000;
  pointer-events: none;
  
  @media ${growsomeTheme.device.mobile} {
    bottom: 10px;
    right: 10px;
    left: 10px;
  }
`;

const FomoModal = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  border: 1px solid ${growsomeTheme.color.Gray200};
  max-width: 400px;
  width: 380px;
  padding: 1.5rem;
  position: relative;
  pointer-events: auto;
  animation: slideUpFomo 0.4s ease-out;
  
  @media ${growsomeTheme.device.mobile} {
    width: 100%;
    max-width: none;
  }
  
  @keyframes slideUpFomo {
    from { 
      opacity: 0; 
      transform: translateY(60px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
`;

const FomoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const FomoTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FomoTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${growsomeTheme.color.Red500};
`;

const FomoClose = styled.button`
  background: none;
  border: none;
  font-size: 1.3rem;
  color: ${growsomeTheme.color.Gray400};
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
  transition: all 0.15s;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${growsomeTheme.color.Gray100};
    color: ${growsomeTheme.color.Red500};
  }
`;

const FomoList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const FomoItem = styled.li`
  font-size: 0.9rem;
  color: ${growsomeTheme.color.Black700};
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  line-height: 1.4;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export default Services;