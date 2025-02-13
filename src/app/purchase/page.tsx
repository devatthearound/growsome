"use client";

import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const TitleSection = styled.div`
  margin-top: 100px;
  padding: 60px 0 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #080d34;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const InquiryButton = styled.a`
  display: inline-block;
  background: #f5f5f5;
  color: #666;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;

  &:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
  }
`;

const PackageSection = styled.section`
  padding: 80px 0;
`;

const PackageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RecommendBadge = styled.div`
  position: absolute;
  top: -5px;
  right: 13px;
  background: #5C59E8;
  color: white;
  padding: 0px 16px 8px;
  font-size: 0.9rem;
  font-weight: 600;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
  height: 80px;
  width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(92, 89, 232, 0.3);
  writing-mode: vertical-rl;
  text-orientation: upright;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    clip-path: polygon(0 0, 100% 0, 100% 15%, 0 15%);
  }
`;

const PackageCard = styled.div<{ isHighlighted?: boolean }>`
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 40px;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  border: ${({ isHighlighted }) => (isHighlighted ? '2px solid #5C59E8' : '1px solid #e0e0e0')};
  box-shadow: ${({ isHighlighted }) => (isHighlighted ? '0 30px 50px rgba(92, 89, 232, 0.3)' : 'none')};

  &:hover {
    transform: scale(1.02);
  }
`;

const PackageContent = styled.div`
  flex: 1;
`;

const PackageHeader = styled.div`
  margin-bottom: 24px;
`;

const PackageType = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
`;

const PackageTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #5c59e8;
`;

const OriginalPrice = styled.div`
  text-decoration: line-through;
  color: #999;
  font-size: 1.2rem;
  margin-bottom: 8px;
`;

const MonthlyPrice = styled.div`
  color: #5c59e8;
  font-size: 1.1rem;
  margin-top: 8px;
  font-weight: 600;
`;

const Price = styled.div`
  font-size: 2.75rem;
  font-weight: 700;
  color: #080d34;
  margin-bottom: 12px;

  span {
    font-size: 1.1rem;
    color: #666;
  }
`;

const PackageDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 24px 0 32px;
  line-height: 1.6;
  min-height: 60px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 32px;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #666;
  margin-bottom: 8px;

  svg {
    color: #5C59E8;
    margin-right: 8px;
  }
`;

const PurchaseButton = styled.a<{ isHighlighted?: boolean }>`
  display: inline-block;
  background: ${({ isHighlighted }) => (isHighlighted ? '#5C59E8' : '#f8f9fa')};
  color: ${({ isHighlighted }) => (isHighlighted ? '#fff' : '#666')};
  width: 100%;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: #5C59E8;
    color: #fff;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 32px;
`;

const BannerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const Banner = styled.div`
  background: #4A47D5;
  color: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1200px;
`;

const BannerText = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const BannerButton = styled.a`
  display: inline-block;
  background: #fff;
  color: #4A47D5;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  transition: background 0.3s ease, color 0.3s ease;
  text-decoration: none;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }
`;

const PromoBanner = styled.div`
  background: #1E3A8A;
  color: #fff;
  text-align: center;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  margin-top: 40px;
  width: 100%;
  max-width: 1200px;
`;

const PromoText = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 20px;
`;

const PromoSubText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const PromoButton = styled.a`
  display: inline-block;
  background: #fff;
  color: #1E3A8A;
  padding: 15px 35px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  transition: background 0.3s ease, color 0.3s ease;
  text-decoration: none;

  &:hover {
    background: #e0e0e0;
    color: #080d34;
  }
`;

const PurchasePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <TitleSection>
        <Title>우리의 <span style={{ color: '#5c59e7' }}>특별한 실전솔루션</span>을 <br />선택하세요</Title>
        <Subtitle>궁금한 점이 있으신가요? 전문가와 상담하세요.</Subtitle>
        <a href="http://pf.kakao.com/_Lpaln/chat" target="_blank" rel="noopener noreferrer">
          <InquiryButton>문의하기</InquiryButton>
        </a>
      </TitleSection>
      <div className="container mx-auto px-4">
        <PackageSection>
          <PackageContainer>
            <PackageGrid>
              <PackageCard>
                <PackageContent>
                  <PackageHeader>
                    <PackageTitle>베이직 솔루션</PackageTitle>
                    <OriginalPrice>정가 50만원</OriginalPrice>
                    <Price>30만원 <span>/ 2주</span></Price>
                    <MonthlyPrice>월 25,000원 (12개월 할부시)</MonthlyPrice>
                    <PackageDescription>
                      사업계획서 초안과 MVP 예시 이미지가 필요한 스타트업에 적합
                    </PackageDescription>
                  </PackageHeader>
                  <FeatureList>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      40만원 상당의 강의 무료 제공
                    </Feature>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      사업계획서 초안 원본 제공
                    </Feature>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      대화한 챗GPTs 모두 제공
                    </Feature>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      빌드업 마케팅 전자책 제공
                    </Feature>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      주 1회 1시간 줌 미팅
                    </Feature>
                  </FeatureList>
                </PackageContent>
                <ButtonWrapper>
                  <PurchaseButton
                    href="/payment?product_id=4"
                    rel="noopener noreferrer"
                  >
                    구매하기
                  </PurchaseButton>
                </ButtonWrapper>
              </PackageCard>

              <PackageCard isHighlighted>
                <RecommendBadge>추천</RecommendBadge>
                <PackageContent>
                  <PackageHeader>
                    <PackageTitle>스탠다드 솔루션</PackageTitle>
                    <OriginalPrice>정가 150만원</OriginalPrice>
                    <Price>99만원 <span>/ 2주</span></Price>
                    <MonthlyPrice>월 82,500원 (12개월 할부시)</MonthlyPrice>
                    <PackageDescription>
                      10페이지 내외 사업계획서 초안과 커서AI 목업이 필요한 기업에 적합
                    </PackageDescription>
                  </PackageHeader>
                  <FeatureList>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      기본 패키지의 모든 혜택 포함
                    </Feature>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      넥스트(NexT)기반 개발 파일 원본 제공
                    </Feature>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      실제 개발 연계 시 30% 할인
                    </Feature>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      우선순위 지원 및 빠른 피드백
                    </Feature>
                  </FeatureList>
                </PackageContent>
                <ButtonWrapper>
                  <PurchaseButton
                    href="/payment?product_id=5"
                    rel="noopener noreferrer"
                    isHighlighted
                  >
                    구매하기
                  </PurchaseButton>
                </ButtonWrapper>
              </PackageCard>

              <PackageCard>
                <PackageContent>
                  <PackageHeader>
                    <PackageTitle>프리미엄 솔루션</PackageTitle>
                    <OriginalPrice>정가 1,500만원</OriginalPrice>
                    <Price>990만원 <span>/ 2주</span></Price>
                    <MonthlyPrice>월 825,000원 (12개월 할부시)</MonthlyPrice>
                    <PackageDescription>
                      대규모 프로젝트나 특별한 요구사항이 있는 기업에 적합
                    </PackageDescription>
                  </PackageHeader>
                  <FeatureList>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      프리미엄 패키지의 모든 혜택 포함
                    </Feature>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      맞춤형 컨설팅 제공
                    </Feature>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      전담 매니저 배정
                    </Feature>
                    <Feature>
                      <FontAwesomeIcon icon={faCheck} />
                      무제한 페이지 작성
                    </Feature>
                  </FeatureList>
                </PackageContent>
                <ButtonWrapper>
                  <PurchaseButton
                    href="/payment?product_id=6"
                    rel="noopener noreferrer"
                  >
                    구매하기
                  </PurchaseButton>
                </ButtonWrapper>
              </PackageCard>
            </PackageGrid>
          </PackageContainer>
        </PackageSection>
        <BannerContainer>
          <Banner>
            <BannerText>카카오채널 추가하고 특별 <span style={{ color: '#03ff00' }}>39,000원 할인</span> 쿠폰을 받으세요!</BannerText>
            <BannerButton href="http://pf.kakao.com/_Lpaln/chat" target="_blank" rel="noopener noreferrer">
              그로우썸 카톡채널 추가하기
            </BannerButton>
          </Banner>
        </BannerContainer>
      </div>
    </div>
  );
};

export default PurchasePage;