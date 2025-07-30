'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { growsomeTheme } from '@/components/design-system/theme';
import { Typography } from '@/components/design-system/Typography';
import { Container } from '@/components/design-system/Layout';
import { SecondaryButton } from '@/components/design-system/Button';

const portfolioPreview = [
  {
    id: 'skykey',
    image: '/images/projects/skykey/main_thumb_800x500.png',
    title: '스카이키',
    description: '급매 부동산 데이터를 제공하는 투자 지원 플랫폼',
  },
  {
    id: 'withslow',
    image: '/images/projects/withslow/main_thumb_800x500.png',
    title: '느린걸음 플러스',
    description: '발달장애인을 위한 비대면 교육과 중개 플랫폼',
  },
  {
    id: 'cupas',
    image: '/images/projects/cupas/main_thumb_800x500.png',
    title: '쿠파스 자동화',
    description: 'N잡러를 위한 쿠팡파트너스 자동화 솔루션',
  },
  {
    id: 'pickup',
    image: '/images/projects/pickup/main_thumb_800x500.png',
    title: '픽업해',
    description: '0% 배달수수료 픽업해',
  },
];

const PortfolioSectionContainer = styled.section`
  background: ${growsomeTheme.color.Gray50};
  padding: 80px 0 100px 0;
  
  @media ${growsomeTheme.device.mobile} {
    padding: 40px 0 60px 0;
  }
`;

const PortfolioTitle = styled(Typography.DisplayL600)`
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.5rem !important;
  }
  
  @media ${growsomeTheme.device.tablet} {
    font-size: 2rem !important;
  }
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 ${growsomeTheme.spacing.md};
  }
`;

const PortfolioCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  
  &:hover, &:focus {
    box-shadow: 0 8px 32px rgba(68,63,207,0.15);
    transform: translateY(-4px) scale(1.02);
    outline: 2px solid ${growsomeTheme.color.Primary500};
  }
`;

const PortfolioImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;
`;

const PortfolioInfo = styled.div`
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media ${growsomeTheme.device.mobile} {
    padding: 1.5rem 1rem 1rem 1rem;
  }
`;

const PortfolioSection: React.FC = () => {
  return (
    <PortfolioSectionContainer>
      <Container>
        <PortfolioTitle style={{textAlign:'center', marginBottom:'2rem', fontWeight: 700, color: growsomeTheme.color.Black800}}>
          우리가 만든 결과물
        </PortfolioTitle>
        <PortfolioGrid>
          {portfolioPreview.map((item) => (
            <Link key={item.id} href={`/portfolio/${item.id}`} style={{textDecoration: 'none'}}>
              <PortfolioCard role="link" tabIndex={0}>
                <PortfolioImage>
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                    style={{objectFit:'cover', borderRadius:16}} 
                  />
                </PortfolioImage>
                <PortfolioInfo>
                  <Typography.TextL600 style={{marginBottom:'0.5rem', color: growsomeTheme.color.Black800, fontWeight: 600}}>
                    {item.title}
                  </Typography.TextL600>
                  <Typography.TextM400 style={{marginBottom:'1rem', color: growsomeTheme.color.Black600}}>
                    {item.description}
                  </Typography.TextM400>
                </PortfolioInfo>
              </PortfolioCard>
            </Link>
          ))}
        </PortfolioGrid>

      </Container>
    </PortfolioSectionContainer>
  );
};

export default PortfolioSection; 