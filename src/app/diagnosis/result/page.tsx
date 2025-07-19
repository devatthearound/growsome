'use client';

import React, { useEffect, useState, Suspense } from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { growsomeTheme } from '@/components/design-system/theme';

interface Recommendation {
  primary: string;
  price: string;
  description: string;
  timeline: string;
  features: string[];
}

// Loading 컴포넌트
const Loading = () => (
  <LoadingContainer>
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
      <div>로딩 중...</div>
    </div>
  </LoadingContainer>
);

const LoadingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${growsomeTheme.color.Green50} 0%, ${growsomeTheme.color.Primary50} 100%);
  padding: ${growsomeTheme.spacing.xl} 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// useSearchParams를 사용하는 컴포넌트를 분리
const DiagnosisResultContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [surveyId, setSurveyId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('surveyId');
    const recommendationData = searchParams.get('recommendation');
    
    if (id) setSurveyId(id);
    
    if (recommendationData) {
      try {
        const parsed = JSON.parse(recommendationData);
        setRecommendation(parsed);
      } catch (error) {
        console.error('추천 데이터 파싱 오류:', error);
      }
    }
  }, [searchParams]);

  const handleConsultation = () => {
    window.open('https://pf.kakao.com/_Lpaln/chat', '_blank');
  };

  const handleSubscription = () => {
    router.push('/subscription');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <ResultContainer>
      <Container>
        <ResultWrapper>
          {/* Success Header */}
          <SuccessHeader>
            <SuccessIcon>🎉</SuccessIcon>
            <Title>진단 완료!</Title>
            <Subtitle>
              설문에 참여해주셔서 감사합니다.<br/>
              맞춤형 10배 성장 전략을 준비해드리겠습니다.
            </Subtitle>
          </SuccessHeader>

          {/* Next Steps */}
          <NextStepsSection>
            <SectionTitle>📋 다음 단계</SectionTitle>

            <StepsGrid>
              <StepCard>
                <StepNumber>1</StepNumber>
                <StepTitle>진단 분석</StepTitle>
                <StepDescription>
                  전문가가 귀하의 설문 내용을 바탕으로 맞춤형 성장 전략을 분석합니다.
                </StepDescription>
              </StepCard>

              <StepCard>
                <StepNumber>2</StepNumber>
                <StepTitle>개별 연락</StepTitle>
                <StepDescription>
                  24시간 내 담당자가 진단 결과와 함께 개별 상담을 위해 연락드립니다.
                </StepDescription>
              </StepCard>

              <StepCard>
                <StepNumber>3</StepNumber>
                <StepTitle>맞춤 제안</StepTitle>
                <StepDescription>
                  귀하의 비즈니스에 최적화된 AI 개발, 데이터 운영, 브랜딩 솔루션을 제안합니다.
                </StepDescription>
              </StepCard>
            </StepsGrid>
          </NextStepsSection>

          {/* Personalized Recommendation */}
          {recommendation && (
            <RecommendationSection>
              <SectionTitle>🎁 귀하만을 위한 맞춤형 추천</SectionTitle>
              
              <RecommendationCard>
                <RecommendationHeader>
                  <RecommendationTitle>{recommendation.primary}</RecommendationTitle>
                  <RecommendationPrice>{recommendation.price}</RecommendationPrice>
                </RecommendationHeader>
                
                <RecommendationDetails>
                  <RecommendationDescription>
                    {recommendation.description}
                  </RecommendationDescription>
                  <RecommendationTimeline>
                    예상 기간: {recommendation.timeline}
                  </RecommendationTimeline>
                </RecommendationDetails>
                
                <FeaturesList>
                  <FeaturesTitle>주요 기능:</FeaturesTitle>
                  {recommendation.features.map((feature, index) => (
                    <FeatureItem key={index}>
                      ✓ {feature}
                    </FeatureItem>
                  ))}
                </FeaturesList>
                
                <RecommendationCTA>
                  <CTAButton primary onClick={handleSubscription}>
                    🚀 이 패키지 선택하기
                  </CTAButton>
                </RecommendationCTA>
              </RecommendationCard>
            </RecommendationSection>
          )}

          {/* Expected Benefits */}
          <BenefitsSection>
            <SectionTitle>🚀 기대 효과</SectionTitle>

            <BenefitsGrid>
              <BenefitCard>
                <BenefitIcon>📈</BenefitIcon>
                <div>
                  <BenefitTitle style={{color: growsomeTheme.color.Green600}}>
                    매출 10배 성장
                  </BenefitTitle>
                  <BenefitDescription>
                    AI 자동화와 데이터 기반 최적화로 기존 대비 10배 매출 증대
                  </BenefitDescription>
                </div>
              </BenefitCard>

              <BenefitCard>
                <BenefitIcon>⚡</BenefitIcon>
                <div>
                  <BenefitTitle style={{color: growsomeTheme.color.Blue600}}>
                    운영 효율 극대화
                  </BenefitTitle>
                  <BenefitDescription>
                    1인이 10명 규모 업무를 처리할 수 있는 완전 자동화 시스템
                  </BenefitDescription>
                </div>
              </BenefitCard>

              <BenefitCard>
                <BenefitIcon>🎯</BenefitIcon>
                <div>
                  <BenefitTitle style={{color: growsomeTheme.color.Primary600}}>
                    브랜드 차별화
                  </BenefitTitle>
                  <BenefitDescription>
                    경쟁사 대비 독보적인 브랜드 포지셔닝과 고객 경험 제공
                  </BenefitDescription>
                </div>
              </BenefitCard>

              <BenefitCard>
                <BenefitIcon>💰</BenefitIcon>
                <div>
                  <BenefitTitle style={{color: growsomeTheme.color.Orange600}}>
                    비용 75% 절감
                  </BenefitTitle>
                  <BenefitDescription>
                    기존 개발 비용 대비 75% 절감하면서 더 나은 결과 달성
                  </BenefitDescription>
                </div>
              </BenefitCard>
            </BenefitsGrid>
          </BenefitsSection>

          {/* Urgent Message */}
          <UrgentCard>
            <UrgentIcon>⏰</UrgentIcon>
            <UrgentTitle>한정 특가 진행 중!</UrgentTitle>
            <UrgentDescription>
              설문 참여자 한정으로 최대 55% 할인가로 제공합니다.<br/>
              이 기회를 놓치지 마세요!
            </UrgentDescription>
            <DiscountBadge>최대 55% 할인</DiscountBadge>
          </UrgentCard>

          {/* CTA Buttons */}
          <CTAButtons>
            <CTAButton primary onClick={handleConsultation}>
              💬 즉시 상담 받기 (카카오톡)
            </CTAButton>
            <CTAButton onClick={handleSubscription}>
              📦 패키지 둘러보기
            </CTAButton>
          </CTAButtons>

          {/* Additional Info */}
          <InfoSection>
            <InfoCard>
              <InfoIcon>🔒</InfoIcon>
              <div>
                <InfoTitle>개인정보 보호</InfoTitle>
                <InfoDescription>
                  귀하의 정보는 진단 및 상담 목적으로만 사용되며, 별도 동의 없이 마케팅에 활용되지 않습니다.
                </InfoDescription>
              </div>
            </InfoCard>

            <InfoCard>
              <InfoIcon>📞</InfoIcon>
              <div>
                <InfoTitle>빠른 응답 보장</InfoTitle>
                <InfoDescription>
                  설문 제출 후 24시간 내 담당자가 직접 연락드려 맞춤형 상담을 진행합니다.
                </InfoDescription>
              </div>
            </InfoCard>
          </InfoSection>

          {/* Back Button */}
          <BackSection>
            <BackButton onClick={handleBackToHome}>
              🏠 홈으로 돌아가기
            </BackButton>
          </BackSection>
        </ResultWrapper>
      </Container>
    </ResultContainer>
  );
};

// 메인 컴포넌트 (Suspense로 감싸진 컴포넌트)
const DiagnosisResult = () => {
  return (
    <ThemeProvider theme={growsomeTheme}>
      <Suspense fallback={<Loading />}>
        <DiagnosisResultContent />
      </Suspense>
    </ThemeProvider>
  );
};

// Animations
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${growsomeTheme.spacing.lg};
`;

const ResultContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${growsomeTheme.color.Green50} 0%, ${growsomeTheme.color.Primary50} 100%);
  padding: ${growsomeTheme.spacing.xl} 0;
`;

const ResultWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  animation: ${slideUp} 0.6s ease-out;
`;

const SuccessHeader = styled.div`
  background: ${growsomeTheme.color.White};
  border-radius: ${growsomeTheme.radius.radius3};
  padding: ${growsomeTheme.spacing["3xl"]};
  text-align: center;
  box-shadow: ${growsomeTheme.shadow.Elevation2};
  margin-bottom: ${growsomeTheme.spacing["2xl"]};
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  animation: ${bounce} 2s ease-in-out infinite;
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${growsomeTheme.fontSize.DisplayL};
  font-weight: ${growsomeTheme.fontWeight.Bold};
  color: ${growsomeTheme.color.Black800};
  margin: 0 0 ${growsomeTheme.spacing.lg} 0;
`;

const Subtitle = styled.p`
  font-size: ${growsomeTheme.fontSize.TextL};
  color: ${growsomeTheme.color.Black600};
  margin: 0;
  line-height: 1.6;
`;

const NextStepsSection = styled.div`
  background: ${growsomeTheme.color.White};
  border-radius: ${growsomeTheme.radius.radius3};
  padding: ${growsomeTheme.spacing["2xl"]};
  box-shadow: ${growsomeTheme.shadow.Elevation1};
  margin-bottom: ${growsomeTheme.spacing["2xl"]};
`;

const SectionTitle = styled.h2`
  font-size: ${growsomeTheme.fontSize.DisplayS};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  color: ${growsomeTheme.color.Black800};
  text-align: center;
  margin: 0 0 ${growsomeTheme.spacing["2xl"]} 0;
`;

const StepsGrid = styled.div`
  display: grid;
  gap: ${growsomeTheme.spacing.xl};
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StepCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${growsomeTheme.spacing.xl};
  border: 1px solid ${growsomeTheme.color.Gray200};
  border-radius: ${growsomeTheme.radius.radius2};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${growsomeTheme.shadow.Elevation1};
  }
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  background: ${growsomeTheme.color.Primary500};
  color: ${growsomeTheme.color.White};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${growsomeTheme.fontSize.TextL};
  font-weight: ${growsomeTheme.fontWeight.Bold};
  margin-bottom: ${growsomeTheme.spacing.lg};
`;

const StepTitle = styled.h3`
  font-size: ${growsomeTheme.fontSize.TextL};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  color: ${growsomeTheme.color.Black800};
  margin: 0 0 ${growsomeTheme.spacing.sm} 0;
`;

const StepDescription = styled.p`
  font-size: ${growsomeTheme.fontSize.TextM};
  color: ${growsomeTheme.color.Black600};
  margin: 0;
  line-height: 1.5;
`;

const RecommendationSection = styled.div`
  background: linear-gradient(135deg, ${growsomeTheme.color.Primary50} 0%, ${growsomeTheme.color.Green50} 100%);
  border-radius: ${growsomeTheme.radius.radius3};
  padding: ${growsomeTheme.spacing["2xl"]};
  margin-bottom: ${growsomeTheme.spacing["2xl"]};
  border: 2px solid ${growsomeTheme.color.Primary200};
`;

const RecommendationCard = styled.div`
  background: ${growsomeTheme.color.White};
  border-radius: ${growsomeTheme.radius.radius3};
  padding: ${growsomeTheme.spacing["2xl"]};
  box-shadow: ${growsomeTheme.shadow.Elevation2};
  border: 2px solid ${growsomeTheme.color.Primary300};
`;

const RecommendationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${growsomeTheme.spacing.xl};
  
  @media ${growsomeTheme.device.mobile} {
    flex-direction: column;
    gap: ${growsomeTheme.spacing.md};
  }
`;

const RecommendationTitle = styled.h3`
  font-size: ${growsomeTheme.fontSize.DisplayS};
  font-weight: ${growsomeTheme.fontWeight.Bold};
  color: ${growsomeTheme.color.Primary600};
  margin: 0;
`;

const RecommendationPrice = styled.div`
  font-size: ${growsomeTheme.fontSize.TextXL};
  font-weight: ${growsomeTheme.fontWeight.Bold};
  color: ${growsomeTheme.color.Green600};
  background: ${growsomeTheme.color.Green50};
  padding: ${growsomeTheme.spacing.md} ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius2};
  border: 2px solid ${growsomeTheme.color.Green200};
`;

const RecommendationDetails = styled.div`
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const RecommendationDescription = styled.p`
  font-size: ${growsomeTheme.fontSize.TextL};
  color: ${growsomeTheme.color.Black700};
  margin: 0 0 ${growsomeTheme.spacing.md} 0;
  line-height: 1.6;
`;

const RecommendationTimeline = styled.p`
  font-size: ${growsomeTheme.fontSize.TextM};
  color: ${growsomeTheme.color.Primary600};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  margin: 0;
`;

const FeaturesList = styled.div`
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const FeaturesTitle = styled.h4`
  font-size: ${growsomeTheme.fontSize.TextL};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  color: ${growsomeTheme.color.Black800};
  margin: 0 0 ${growsomeTheme.spacing.md} 0;
`;

const FeatureItem = styled.div`
  font-size: ${growsomeTheme.fontSize.TextM};
  color: ${growsomeTheme.color.Black700};
  margin-bottom: ${growsomeTheme.spacing.sm};
  padding-left: ${growsomeTheme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RecommendationCTA = styled.div`
  text-align: center;
  padding-top: ${growsomeTheme.spacing.lg};
  border-top: 1px solid ${growsomeTheme.color.Gray200};
`;

const BenefitsSection = styled.div`
  background: ${growsomeTheme.color.White};
  border-radius: ${growsomeTheme.radius.radius3};
  padding: ${growsomeTheme.spacing["2xl"]};
  box-shadow: ${growsomeTheme.shadow.Elevation1};
  margin-bottom: ${growsomeTheme.spacing["2xl"]};
`;

const BenefitsGrid = styled.div`
  display: grid;
  gap: ${growsomeTheme.spacing.xl};
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BenefitCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.lg};
  padding: ${growsomeTheme.spacing.xl};
  background: ${growsomeTheme.color.Gray50};
  border-radius: ${growsomeTheme.radius.radius2};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const BenefitIcon = styled.div`
  font-size: 2.5rem;
  background: ${growsomeTheme.color.White};
  padding: ${growsomeTheme.spacing.md};
  border-radius: ${growsomeTheme.radius.radius2};
  box-shadow: ${growsomeTheme.shadow.Elevation1};
  flex-shrink: 0;
`;

const BenefitTitle = styled.h4`
  font-size: ${growsomeTheme.fontSize.TextL};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  margin: 0 0 ${growsomeTheme.spacing.sm} 0;
`;

const BenefitDescription = styled.p`
  font-size: ${growsomeTheme.fontSize.TextM};
  color: ${growsomeTheme.color.Black600};
  margin: 0;
  line-height: 1.5;
`;

const UrgentCard = styled.div`
  background: linear-gradient(135deg, ${growsomeTheme.color.Red50} 0%, ${growsomeTheme.color.Orange50} 100%);
  border: 2px solid ${growsomeTheme.color.Red200};
  border-radius: ${growsomeTheme.radius.radius3};
  padding: ${growsomeTheme.spacing["2xl"]};
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
  margin-bottom: ${growsomeTheme.spacing["2xl"]};
`;

const UrgentIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${growsomeTheme.spacing.lg};
`;

const UrgentTitle = styled.h3`
  font-size: ${growsomeTheme.fontSize.TextXL};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  color: ${growsomeTheme.color.Red600};
  margin: 0 0 ${growsomeTheme.spacing.lg} 0;
`;

const UrgentDescription = styled.p`
  font-size: ${growsomeTheme.fontSize.TextM};
  color: ${growsomeTheme.color.Black700};
  margin: 0 0 ${growsomeTheme.spacing.lg} 0;
  line-height: 1.5;
`;

const DiscountBadge = styled.div`
  background: linear-gradient(90deg, ${growsomeTheme.color.Red500}, ${growsomeTheme.color.Orange500});
  color: ${growsomeTheme.color.White};
  padding: ${growsomeTheme.spacing.md} ${growsomeTheme.spacing.xl};
  border-radius: ${growsomeTheme.radius.radius5};
  display: inline-block;
  box-shadow: ${growsomeTheme.shadow.Elevation1};
  font-size: ${growsomeTheme.fontSize.TextL};
  font-weight: ${growsomeTheme.fontWeight.Bold};
`;

const CTAButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.lg};
  max-width: 400px;
  margin: 0 auto ${growsomeTheme.spacing["2xl"]};
`;

const CTAButton = styled.button<{primary?: boolean}>`
  width: 100%;
  padding: ${growsomeTheme.spacing.lg} ${growsomeTheme.spacing.xl};
  font-size: ${growsomeTheme.fontSize.TextL};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  border: none;
  border-radius: ${growsomeTheme.radius.radius2};
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.primary ? `
    background: ${growsomeTheme.color.Green500};
    color: ${growsomeTheme.color.White};
    
    &:hover {
      background: ${growsomeTheme.color.Green600};
      transform: translateY(-2px);
    }
  ` : `
    background: ${growsomeTheme.color.Primary500};
    color: ${growsomeTheme.color.White};
    
    &:hover {
      background: ${growsomeTheme.color.Primary600};
      transform: translateY(-2px);
    }
  `}
`;

const InfoSection = styled.div`
  display: grid;
  gap: ${growsomeTheme.spacing.lg};
  margin-bottom: ${growsomeTheme.spacing["2xl"]};
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.lg};
  background: ${growsomeTheme.color.White};
  padding: ${growsomeTheme.spacing.xl};
  border-radius: ${growsomeTheme.radius.radius2};
  box-shadow: ${growsomeTheme.shadow.Elevation1};
`;

const InfoIcon = styled.div`
  font-size: 1.5rem;
  background: ${growsomeTheme.color.Primary50};
  padding: ${growsomeTheme.spacing.sm};
  border-radius: ${growsomeTheme.radius.radius1};
  flex-shrink: 0;
`;

const InfoTitle = styled.h4`
  font-size: ${growsomeTheme.fontSize.TextM};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  color: ${growsomeTheme.color.Black800};
  margin: 0 0 ${growsomeTheme.spacing.sm} 0;
`;

const InfoDescription = styled.p`
  font-size: ${growsomeTheme.fontSize.TextS};
  color: ${growsomeTheme.color.Black600};
  margin: 0;
  line-height: 1.5;
`;

const BackSection = styled.div`
  text-align: center;
`;

const BackButton = styled.button`
  background: ${growsomeTheme.color.Gray200};
  color: ${growsomeTheme.color.Black700};
  border: none;
  padding: ${growsomeTheme.spacing.md} ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius2};
  font-size: ${growsomeTheme.fontSize.TextM};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${growsomeTheme.color.Gray300};
    transform: translateY(-1px);
  }
`;

export default DiagnosisResult;