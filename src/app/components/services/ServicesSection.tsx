'use client';

import React from 'react';
import styled from 'styled-components';
import { growsomeTheme } from '@/components/design-system/theme';
import { Typography } from '@/components/design-system/Typography';
import { ColumnBox, Container, Card } from '@/components/design-system/Layout';
import { PrimaryButton } from '@/components/design-system/Button';

interface ServicesSectionProps {
  onDiagnosisClick: () => void;
}

const ServicesSectionContainer = styled.section`
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  background: ${growsomeTheme.color.White};
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing["2xl"]} 0;
  }
`;

const ServicesSectionTitle = styled(Typography.DisplayL600)`
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.5rem !important;
  }
  
  @media ${growsomeTheme.device.tablet} {
    font-size: 2rem !important;
  }
`;

const SectionTitleWrapper = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const TargetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  column-gap: 1.5rem;
  row-gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
  }
`;

const TargetCard = styled(Card)`
  background: #fff;
  border: 1.5px solid ${growsomeTheme.color.Gray100};
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(81,79,228,0.07);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  min-width: 0;
  max-width: 420px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.mobile} {
    padding: 1rem;
    gap: 0.8rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  margin-bottom: 0.7rem;
`;

const CardIcon = styled.div`
  font-size: 2.3rem;
  background: ${growsomeTheme.color.Primary50};
  border-radius: 50%;
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
`;

const CardTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${growsomeTheme.color.Black800};
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.1rem;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 0.5rem;
`;

const FeatureItem = styled.li`
  font-size: 1.05rem;
  color: ${growsomeTheme.color.Black700};
  font-weight: 500;
  display: flex; align-items: flex-start; gap: 0.5rem;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 0.95rem;
  }
`;

const FeatureCheck = styled.span`
  color: ${growsomeTheme.color.GreenSafe500};
  font-size: 1.1rem;
  margin-top: 0.1rem;
`;

const RoiHighlight = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: ${growsomeTheme.color.Primary500};
  margin: 0.7rem 0 0.2rem 0;
  letter-spacing: -1px;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.6rem;
  }
`;

const RoiSub = styled.div`
  font-size: 1.1rem;
  color: ${growsomeTheme.color.Black600};
  margin-bottom: 0.5rem;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 0.9rem;
  }
`;

const ServicesSection: React.FC<ServicesSectionProps> = ({ onDiagnosisClick }) => {
  return (
    <ServicesSectionContainer>
      <Container>
        <ColumnBox $ai="center" $gap={4}>
          <SectionTitleWrapper>
            <ServicesSectionTitle style={{textAlign: 'center'}}>
              🚀 우리가 제공하는 서비스
            </ServicesSectionTitle>
          </SectionTitleWrapper>
          
          <TargetGrid>
            {/* AI 개발 구축 */}
            <TargetCard>
              <CardHeader>
                <CardIcon>🤖</CardIcon>
                <CardTitle>AI 개발 구축</CardTitle>
              </CardHeader>
              <FeaturesList>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>WP 마이그레이션</FeatureItem>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>Next.js SEO 최적화 개발</FeatureItem>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>구독결제, 일반결제</FeatureItem>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>일정등록, 카카오톡 알림 개발</FeatureItem>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>LMS 개발</FeatureItem>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>N8n 자동화 개발</FeatureItem>
              </FeaturesList>
              <RoiHighlight>개발 기간 50% 단축</RoiHighlight>
              <RoiSub>* 최신 기술 스택 + 자동화 시스템</RoiSub>
              <PrimaryButton $color="primary" $size="medium" style={{marginTop:'0.5rem', width:'100%'}} onClick={onDiagnosisClick}>
                상담 신청
              </PrimaryButton>
            </TargetCard>

            {/* UX/UI 디자인 */}
            <TargetCard>
              <CardHeader>
                <CardIcon>🎨</CardIcon>
                <CardTitle>UX/UI 디자인</CardTitle>
              </CardHeader>
              <FeaturesList>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>UI 컴포넌트 시스템 개발</FeatureItem>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>브랜드 로고 개발</FeatureItem>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>BI 적용 포함</FeatureItem>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>반응형 웹 디자인</FeatureItem>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>사용자 경험 최적화</FeatureItem>
                <FeatureItem><FeatureCheck>✅</FeatureCheck>브랜드 아이덴티티 구축</FeatureItem>
              </FeaturesList>
              <RoiHighlight>사용자 만족도 3배 향상</RoiHighlight>
              <RoiSub>* 직관적 UI + 일관된 브랜딩</RoiSub>
              <PrimaryButton $color="primary" $size="medium" style={{marginTop:'0.5rem', width:'100%'}} onClick={onDiagnosisClick}>
                상담 신청
              </PrimaryButton>
            </TargetCard>
          </TargetGrid>
        </ColumnBox>
      </Container>
    </ServicesSectionContainer>
  );
};

export default ServicesSection; 