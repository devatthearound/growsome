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
    category: '부동산 투자'
  },
  {
    id: 'withslow',
    image: '/images/projects/withslow/main_thumb_800x500.png',
    title: '느린걸음 플러스',
    description: '발달장애인을 위한 비대면 교육과 중개 플랫폼',
    category: '교육 플랫폼'
  },
  {
    id: 'cupas',
    image: '/images/projects/cupas/main_thumb_800x500.png',
    title: '쿠파스 자동화',
    description: 'N잡러를 위한 쿠팡파트너스 자동화 솔루션',
    category: '자동화 솔루션'
  },
  {
    id: 'pickup',
    image: '/images/projects/pickup/main_thumb_800x500.png',
    title: '픽업해',
    description: '0% 배달수수료 픽업해',
    category: '배달 서비스'
  },
];

const PortfolioSection = styled.section`
  background: ${growsomeTheme.color.White};
  padding: 80px 0;
  
  @media ${growsomeTheme.device.tablet} {
    padding: 60px 0;
  }
  
  @media ${growsomeTheme.device.mobile} {
    padding: 60px 0;
  }
`;

const PortfolioHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
  
  @media ${growsomeTheme.device.tablet} {
    margin-bottom: 50px;
  }
  
  @media ${growsomeTheme.device.mobile} {
    margin-bottom: 40px;
  }
`;

// IntroText와 동일한 스타일로 수정
const PortfolioTitle = styled.p`
  font-size: 2.5rem;
  font-weight: 700;
  max-width: 600px;
  margin: 0 auto 16px auto;
  letter-spacing: -1px;
  color: ${growsomeTheme.color.Black800};
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.8rem !important;
  }
  
  @media ${growsomeTheme.device.tablet} {
    font-size: 2.2rem !important;
  }
`;

const PortfolioSubtitle = styled(Typography.TextL400)`
  color: ${growsomeTheme.color.Black600};
  max-width: 600px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 0.8rem !important; 
  }
`;

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0 16px;
  }
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
    max-width: 900px;
  }
  
  @media ${growsomeTheme.device.pc} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

// 카드 라운딩 수정 - 더 세련된 디자인
const PortfolioCard = styled.div`
  background: #fff;
  border-radius: 12px; // 20px에서 12px로 변경
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${growsomeTheme.color.Gray100};
  
  &:hover, &:focus {
    box-shadow: 0 8px 32px rgba(68,63,207,0.15);
    transform: translateY(-4px);
    border-color: ${growsomeTheme.color.Primary300};
    border-radius: 16px; // 호버 시 더 부드러운 라운딩
  }
`;

const PortfolioImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;
  overflow: hidden;
  border-radius: 12px 12px 0 0; // 상단만 라운딩
`;

const PortfolioInfo = styled.div`
  padding: 24px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media ${growsomeTheme.device.tablet} {
    padding: 22px 18px;
  }
  
  @media ${growsomeTheme.device.mobile} {
    padding: 20px 16px;
  }
`;

const PortfolioCategory = styled.div`
  font-size: 0.875rem;
  color: ${growsomeTheme.color.Primary500};
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PortfolioCardTitle = styled(Typography.TextL600)`
  color: ${growsomeTheme.color.Black800};
  margin-bottom: 8px;
  font-weight: 700;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.1rem !important;
  }
`;

const PortfolioCardDescription = styled(Typography.TextM400)`
  color: ${growsomeTheme.color.Black600};
  line-height: 1.5;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 0.9rem !important;
  }
`;

const PortfolioCTA = styled.div`
  text-align: center;
  margin-top: 48px;
  
  @media ${growsomeTheme.device.mobile} {
    margin-top: 32px;
  }
`;

const Portfolio: React.FC = () => {
  return (
    <PortfolioSection>
      <Container>
        <PortfolioHeader>
          <PortfolioTitle>
            우리가 만든 결과물
          </PortfolioTitle>
          <PortfolioSubtitle>
            다양한 산업 분야의 고객들과 함께 성장한 프로젝트들을 소개합니다
          </PortfolioSubtitle>
        </PortfolioHeader>
        
        <PortfolioGrid>
          {portfolioPreview.map((item) => (
            <Link key={item.id} href={`/portfolio/${item.id}`} style={{textDecoration: 'none'}}>
              <PortfolioCard role="link" tabIndex={0}>
                <PortfolioImage>
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" 
                    style={{objectFit:'cover'}} 
                  />
                </PortfolioImage>
                <PortfolioInfo>
                  <PortfolioCategory>{item.category}</PortfolioCategory>
                  <PortfolioCardTitle>{item.title}</PortfolioCardTitle>
                  <PortfolioCardDescription>{item.description}</PortfolioCardDescription>
                </PortfolioInfo>
              </PortfolioCard>
            </Link>
          ))}
        </PortfolioGrid>
        

      </Container>
    </PortfolioSection>
  );
};

export default Portfolio; 