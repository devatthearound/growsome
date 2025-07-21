'use client';

import React, { useEffect, useState, Suspense } from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { growsomeTheme } from '@/components/design-system/theme';
import { Typography } from '@/components/design-system/Typography';

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
  background: ${growsomeTheme.color.White};
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
            <Typography.DisplayS600 color={growsomeTheme.color.Black800} style={{ marginBottom: '1rem' }}>
              진단 완료!
            </Typography.DisplayS600>
            <Typography.TextL400 color={growsomeTheme.color.Black600} style={{ textAlign: 'center', lineHeight: '1.6' }}>
              설문에 참여해주셔서 감사합니다.<br/>
              맞춤형 성장 전략을 준비해드리겠습니다.
            </Typography.TextL400>
          </SuccessHeader>

          {/* Personalized Recommendation */}
          {recommendation && (
            <RecommendationSection>
              <Typography.DisplayS600 color={growsomeTheme.color.Black800} style={{ textAlign: 'center', marginBottom: '2rem' }}>
                🎁 귀하만을 위한 맞춤형 추천
              </Typography.DisplayS600>
              
              <RecommendationCard>
                <RecommendationHeader>
                  <Typography.DisplayS600 color={growsomeTheme.color.Primary600}>
                    {recommendation.primary}
                  </Typography.DisplayS600>
                  <RecommendationPrice>
                    <Typography.TextXL600 color={growsomeTheme.color.GreenSafe600} className="price">
                      {recommendation.price}
                    </Typography.TextXL600>
                  </RecommendationPrice>
                </RecommendationHeader>
                
                <RecommendationDetails>
                  <Typography.TextL400 color={growsomeTheme.color.Black700} style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    {recommendation.description}
                  </Typography.TextL400>
                  <Typography.TextM500 color={growsomeTheme.color.Primary600}>
                    예상 기간: {recommendation.timeline}
                  </Typography.TextM500>
                </RecommendationDetails>
                
                <FeaturesList>
                  <Typography.TextL500 color={growsomeTheme.color.Black800} style={{ marginBottom: '1rem' }}>
                    주요 기능:
                  </Typography.TextL500>
                  {recommendation.features.map((feature, index) => (
                    <FeatureItem key={index}>
                      <Typography.TextM400 color={growsomeTheme.color.Black700}>
                        ✓ {feature}
                      </Typography.TextM400>
                    </FeatureItem>
                  ))}
                </FeaturesList>
                
                <RecommendationCTA>
                  <CTAButton onClick={handleSubscription}>
                    🚀 이 패키지 선택하기
                  </CTAButton>
                </RecommendationCTA>
              </RecommendationCard>
            </RecommendationSection>
          )}

          {/* Next Steps */}
          <NextStepsSection>
            <Typography.DisplayS600 color={growsomeTheme.color.Black800} style={{ textAlign: 'center', marginBottom: '2rem' }}>
              📋 다음 단계
            </Typography.DisplayS600>

            <StepsGrid>
              <StepCard>
                <StepNumber>1</StepNumber>
                <Typography.TextL500 color={growsomeTheme.color.Black800} style={{ marginBottom: '0.5rem' }}>
                  진단 분석
                </Typography.TextL500>
                <Typography.TextM400 color={growsomeTheme.color.Black600} style={{ textAlign: 'center', lineHeight: '1.5' }}>
                  전문가가 귀하의 설문 내용을 바탕으로 맞춤형 성장 전략을 분석합니다.
                </Typography.TextM400>
              </StepCard>

              <StepCard>
                <StepNumber>2</StepNumber>
                <Typography.TextL500 color={growsomeTheme.color.Black800} style={{ marginBottom: '0.5rem' }}>
                  개별 연락
                </Typography.TextL500>
                <Typography.TextM400 color={growsomeTheme.color.Black600} style={{ textAlign: 'center', lineHeight: '1.5' }}>
                  24시간 내 담당자가 진단 결과와 함께 개별 상담을 위해 연락드립니다.
                </Typography.TextM400>
              </StepCard>

              <StepCard>
                <StepNumber>3</StepNumber>
                <Typography.TextL500 color={growsomeTheme.color.Black800} style={{ marginBottom: '0.5rem' }}>
                  맞춤 제안
                </Typography.TextL500>
                <Typography.TextM400 color={growsomeTheme.color.Black600} style={{ textAlign: 'center', lineHeight: '1.5' }}>
                  귀하의 비즈니스에 최적화된 AI 개발, 데이터 운영, 브랜딩 솔루션을 제안합니다.
                </Typography.TextM400>
              </StepCard>
            </StepsGrid>
          </NextStepsSection>

          {/* Expected Benefits */}
          <BenefitsSection>
            <Typography.DisplayS600 color={growsomeTheme.color.Black800} style={{ textAlign: 'center', marginBottom: '2rem' }}>
              🚀 기대 효과
            </Typography.DisplayS600>

            <BenefitsGrid>
              <BenefitCard>
                <BenefitIcon>📈</BenefitIcon>
                <div>
                  <Typography.TextL500 color={growsomeTheme.color.GreenSafe600} style={{ marginBottom: '0.5rem' }}>
                    매출 10배 성장
                  </Typography.TextL500>
                  <Typography.TextM400 color={growsomeTheme.color.Black600} style={{ lineHeight: '1.5' }}>
                    AI 자동화와 데이터 기반 최적화로 기존 대비 10배 매출 증대
                  </Typography.TextM400>
                </div>
              </BenefitCard>

              <BenefitCard>
                <BenefitIcon>⚡</BenefitIcon>
                <div>
                  <Typography.TextL500 color={growsomeTheme.color.Blue600} style={{ marginBottom: '0.5rem' }}>
                    운영 효율 극대화
                  </Typography.TextL500>
                  <Typography.TextM400 color={growsomeTheme.color.Black600} style={{ lineHeight: '1.5' }}>
                    1인이 10명 규모 업무를 처리할 수 있는 완전 자동화 시스템
                  </Typography.TextM400>
                </div>
              </BenefitCard>

              <BenefitCard>
                <BenefitIcon>💰</BenefitIcon>
                <div>
                  <Typography.TextL500 color={growsomeTheme.color.Orange600} style={{ marginBottom: '0.5rem' }}>
                    비용 75% 절감
                  </Typography.TextL500>
                  <Typography.TextM400 color={growsomeTheme.color.Black600} style={{ lineHeight: '1.5' }}>
                    기존 개발 비용 대비 75% 절감하면서 더 나은 결과 달성
                  </Typography.TextM400>
                </div>
              </BenefitCard>

              <BenefitCard>
                <BenefitIcon>🎯</BenefitIcon>
                <div>
                  <Typography.TextL500 color={growsomeTheme.color.Primary600} style={{ marginBottom: '0.5rem' }}>
                    브랜드 차별화
                  </Typography.TextL500>
                  <Typography.TextM400 color={growsomeTheme.color.Black600} style={{ lineHeight: '1.5' }}>
                    경쟁사 대비 독보적인 브랜드 포지셔닝과 고객 경험 제공
                  </Typography.TextM400>
                </div>
              </BenefitCard>
            </BenefitsGrid>
          </BenefitsSection>

          {/* Urgent Message */}
          <UrgentCard>
            <UrgentIcon>⏰</UrgentIcon>
            <Typography.TextXL500 color={growsomeTheme.color.Red600} style={{ marginBottom: '1rem' }}>
              한정 특가 진행 중!
            </Typography.TextXL500>
            <Typography.TextM400 color={growsomeTheme.color.Black700} style={{ marginBottom: '1rem', lineHeight: '1.5', textAlign: 'center' }}>
              설문 참여자 한정으로 최대 55% 할인가로 제공합니다.<br/>
              이 기회를 놓치지 마세요!
            </Typography.TextM400>
            <DiscountBadge>
              <Typography.TextL600 color={growsomeTheme.color.White}>
                최대 55% 할인
              </Typography.TextL600>
            </DiscountBadge>
          </UrgentCard>

          {/* CTA Buttons */}
          <CTAButtons>
            <CTAButton onClick={handleConsultation}>
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
                <Typography.TextM500 color={growsomeTheme.color.Black800} style={{ marginBottom: '0.5rem' }}>
                  개인정보 보호
                </Typography.TextM500>
                <Typography.TextS400 color={growsomeTheme.color.Black600} style={{ lineHeight: '1.5' }}>
                  귀하의 정보는 진단 및 상담 목적으로만 사용되며, 별도 동의 없이 마케팅에 활용되지 않습니다.
                </Typography.TextS400>
              </div>
            </InfoCard>

            <InfoCard>
              <InfoIcon>📞</InfoIcon>
              <div>
                <Typography.TextM500 color={growsomeTheme.color.Black800} style={{ marginBottom: '0.5rem' }}>
                  빠른 응답 보장
                </Typography.TextM500>
                <Typography.TextS400 color={growsomeTheme.color.Black600} style={{ lineHeight: '1.5' }}>
                  설문 제출 후 24시간 내 담당자가 직접 연락드려 맞춤형 상담을 진행합니다.
                </Typography.TextS400>
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

// Styled Components - 반응형 개선
const Container = styled.div`
  max-width: 1200px; /* PC에서 더 넓게 */
  margin: 0 auto;
  padding: 0 ${growsomeTheme.spacing.lg};
  
  @media ${growsomeTheme.device.mobile} {
    max-width: 600px; /* 모바일에서는 600px로 제한 */
    padding: 0 ${growsomeTheme.spacing.md};
  }
  
  @media ${growsomeTheme.device.tablet} {
    max-width: 800px; /* 태블릿에서는 800px */
    padding: 0 ${growsomeTheme.spacing.lg};
  }
`;

const ResultContainer = styled.div`
  min-height: 100vh;
  background: ${growsomeTheme.color.White};
  padding: ${growsomeTheme.spacing.xl} 0;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', sans-serif;
`;

const ResultWrapper = styled.div`
  animation: ${slideUp} 0.6s ease-out;
`;

const SuccessHeader = styled.div`
  text-align: center;
  margin-bottom: ${growsomeTheme.spacing.xl};
  padding: ${growsomeTheme.spacing.xl};
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  animation: ${bounce} 2s ease-in-out infinite;
  margin-bottom: ${growsomeTheme.spacing.lg};
`;

const NextStepsSection = styled.div`
  margin-bottom: ${growsomeTheme.spacing.xl};
  padding: ${growsomeTheme.spacing.xl};
  background: ${growsomeTheme.color.Gray50};
  border-radius: ${growsomeTheme.radius.radius2};
`;

const StepsGrid = styled.div`
  display: grid;
  gap: ${growsomeTheme.spacing.lg};
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
  }
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StepCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${growsomeTheme.spacing.lg};
  border: 1px solid ${growsomeTheme.color.Gray200};
  border-radius: ${growsomeTheme.radius.radius2};
  background: ${growsomeTheme.color.White};
  flex: 1;
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  background: ${growsomeTheme.color.Primary500};
  color: ${growsomeTheme.color.White};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${growsomeTheme.fontSize.TextL};
  font-weight: ${growsomeTheme.fontWeight.Bold};
  margin-bottom: ${growsomeTheme.spacing.md};
`;

const RecommendationSection = styled.div`
  background: ${growsomeTheme.color.Primary25};
  border-radius: ${growsomeTheme.radius.radius2};
  padding: ${growsomeTheme.spacing.xl};
  margin-bottom: ${growsomeTheme.spacing.xl};
  border: 1px solid ${growsomeTheme.color.Primary200};
`;

const RecommendationCard = styled.div`
  background: ${growsomeTheme.color.White};
  border-radius: ${growsomeTheme.radius.radius2};
  padding: ${growsomeTheme.spacing.xl};
  border: 1px solid ${growsomeTheme.color.Primary300};
`;

const RecommendationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${growsomeTheme.spacing.lg};
  
  @media ${growsomeTheme.device.mobile} {
    flex-direction: column;
    gap: ${growsomeTheme.spacing.md};
    text-align: center;
  }
`;

const RecommendationPrice = styled.div`
  background: ${growsomeTheme.color.GreenSafe50};
  padding: ${growsomeTheme.spacing.sm} ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius1};
  border: 1px solid ${growsomeTheme.color.GreenSafe200};
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
`;

const RecommendationDetails = styled.div`
  margin-bottom: ${growsomeTheme.spacing.lg};
`;

const FeaturesList = styled.div`
  margin-bottom: ${growsomeTheme.spacing.lg};
`;

const FeatureItem = styled.div`
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
  background: ${growsomeTheme.color.Gray50};
  border-radius: ${growsomeTheme.radius.radius2};
  padding: ${growsomeTheme.spacing.xl};
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const BenefitsGrid = styled.div`
  display: grid;
  gap: ${growsomeTheme.spacing.lg};
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
  }
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BenefitCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.md};
  padding: ${growsomeTheme.spacing.lg};
  background: ${growsomeTheme.color.White};
  border-radius: ${growsomeTheme.radius.radius2};
  border: 1px solid ${growsomeTheme.color.Gray200};
`;

const BenefitIcon = styled.div`
  font-size: 2rem;
  background: ${growsomeTheme.color.Primary50};
  padding: ${growsomeTheme.spacing.sm};
  border-radius: ${growsomeTheme.radius.radius1};
  flex-shrink: 0;
`;

const UrgentCard = styled.div`
  background: ${growsomeTheme.color.Red25};
  border: 1px solid ${growsomeTheme.color.Red200};
  border-radius: ${growsomeTheme.radius.radius2};
  padding: ${growsomeTheme.spacing.xl};
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const UrgentIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${growsomeTheme.spacing.lg};
`;

const DiscountBadge = styled.div`
  background: linear-gradient(90deg, ${growsomeTheme.color.Red500}, ${growsomeTheme.color.Orange500});
  color: ${growsomeTheme.color.White};
  padding: ${growsomeTheme.spacing.sm} ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius5};
  display: inline-block;
`;

const CTAButtons = styled.div`
  display: grid;
  gap: ${growsomeTheme.spacing.md};
  margin-bottom: ${growsomeTheme.spacing.xl};
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
  }
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CTAButton = styled.button`
  width: 100%;
  padding: ${growsomeTheme.spacing.lg};
  font-size: ${growsomeTheme.fontSize.TextL};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  border: none;
  border-radius: ${growsomeTheme.radius.radius2};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${growsomeTheme.color.Primary500};
  color: ${growsomeTheme.color.White};
  font-family: 'Pretendard', sans-serif;
  
  &:hover {
    background: ${growsomeTheme.color.Primary600};
    transform: translateY(-2px);
  }
  
  /* 첫 번째 버튼도 Primary 색상 사용 (흰색 배경이므로) */
  &:first-child {
    background: ${growsomeTheme.color.Primary500};
    
    &:hover {
      background: ${growsomeTheme.color.Primary600};
    }
  }
`;

const InfoSection = styled.div`
  display: grid;
  gap: ${growsomeTheme.spacing.lg};
  margin-bottom: ${growsomeTheme.spacing.xl};
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
  }
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.md};
  background: ${growsomeTheme.color.Gray50};
  padding: ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius2};
  flex: 1;
`;

const InfoIcon = styled.div`
  font-size: 1.5rem;
  background: ${growsomeTheme.color.Primary50};
  padding: ${growsomeTheme.spacing.sm};
  border-radius: ${growsomeTheme.radius.radius1};
  flex-shrink: 0;
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
  font-family: 'Pretendard', sans-serif;
  
  &:hover {
    background: ${growsomeTheme.color.Gray300};
    transform: translateY(-1px);
  }
`;

export default DiagnosisResult;