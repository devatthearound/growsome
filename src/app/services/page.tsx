'use client';

import React from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { useRouter } from 'next/navigation';
import { growsomeTheme } from '@/components/design-system/theme';
import { Typography } from '@/components/design-system/Typography';
import { ColumnBox, RowBox, Container, Section, Card } from '@/components/design-system/Layout';
import { GreenButton, SecondaryButton, PrimaryButton } from '@/components/design-system/Button';

// Services Page Component
const Services = () => {
  const router = useRouter();

  const handleGetPriceClick = () => {
    router.push('/subscription');
  };

  const handleFreeDiagnosisClick = () => {
    window.open('https://pf.kakao.com/_Lpaln/chat', '_blank');
  };

  const problems = [
    "AI 붙이고 싶은데 PHP 홈페이지로는 불가능해요",
    "6개월 기다렸는데 결과물이 2020년 수준이에요",
    "해외 개발자와 소통이 안 돼서 스트레스받아요",
    "만들고 나니 운영을 어떻게 해야 할지 모르겠어요",
    "브랜드 아이덴티티가 없어서 경쟁력이 떨어져요"
  ];

  const solutions = [
    {
      icon: "🚀",
      title: "개발 기간 50% 단축",
      description: "3개월 → 6주",
    },
    {
      icon: "💰",
      title: "비용 75% 절감",
      description: "2,000만원 → 500만원",
    },
    {
      icon: "📈",
      title: "광고 효율 10배",
      description: "ROAS 200% → 2,000%",
    },
    {
      icon: "📊",
      title: "데이터 수집 10배",
      description: "월 100건 → 1,000건",
    },
    {
      icon: "🤖",
      title: "1인 운영 가능",
      description: "완전 자동화 시스템",
    }
  ];

  const features = [
    {
      icon: "🤖",
      title: "AI 확장 가능성 점수",
      description: "현재 비즈니스의 AI 적용 가능성을 점수로 측정하고 맞춤형 기술 스택을 추천합니다."
    },
    {
      icon: "📊",
      title: "10배 성장 전략 분석",
      description: "광고 효율 10배 달성을 위한 구체적인 전략과 데이터 수집 방법을 제시합니다."
    },
    {
      icon: "🎯",
      title: "브랜드 포지셔닝 진단",
      description: "시장에서의 차별화 포인트를 발굴하고 브랜드 아이덴티티를 구체화합니다."
    },
    {
      icon: "💡",
      title: "투자 효율성 분석",
      description: "예상 개발 기간과 총 투자 비용을 정확히 산출하여 명확한 로드맵을 제공합니다."
    },
    {
      icon: "🚀",
      title: "단계별 ROI 예측",
      description: "10배 성장을 위한 단계별 계획과 각 단계별 예상 수익률을 상세히 분석합니다."
    }
  ];

  const urgencyItems = [
    "🔴 예비 1인 창업가: 월 5팀 → 3팀으로 축소",
    "🔴 100억 매출 기업: 분기 3팀 → 반기 3팀으로 축소",
    "🔴 2025년 하반기 일정 조기 마감 예상"
  ];

  return (
    <ThemeProvider theme={growsomeTheme}>
      <ServicesContainer>
        {/* Hero Section */}
        <HeroSection>
          <HeroBackground />
          <Container>
            <HeroContent>
              <ColumnBox $gap={4} $ai="center">
                <ColumnBox $gap={3} $ai="center">
                  <HeroTitle>
                    <Typography.DisplayXL700 color={growsomeTheme.color.White} style={{textAlign: 'center', lineHeight: '1.1'}}>
                      <span style={{display: 'block', marginBottom: '1rem'}}>🚀 잘 만든 홈페이지 하나로</span>
                      <GradientText>광고도, 데이터도 모두 10배 성장</GradientText>
                    </Typography.DisplayXL700>
                  </HeroTitle>
                  
                  <HeroSubtitle>
                    <Typography.TextXL500 color={growsomeTheme.color.White} style={{textAlign: 'center', opacity: 0.9}}>
                      AI 시대, 타겟별 맞춤형 비즈니스 성장 엔진
                    </Typography.TextXL500>
                    <Typography.TextL400 color={growsomeTheme.color.White} style={{textAlign: 'center', opacity: 0.8}}>
                      예비 1인 창업가부터 100억 매출 기업까지 - 10배 성장 보장
                    </Typography.TextL400>
                  </HeroSubtitle>
                </ColumnBox>

                <CTAButtonsHero>
                  <GreenButton $size="large" onClick={handleFreeDiagnosisClick}>
                    💡 무료 10배 성장 진단 (5분 완료)
                  </GreenButton>

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
        </HeroSection>

        {/* Problems Section */}
        <ProblemsSection>
          <Container>
            <ColumnBox $gap={4} $ai="center">
              <SectionHeader>
                <Typography.DisplayL600 style={{textAlign: 'center', marginBottom: '2rem'}}>
                  <span style={{color: growsomeTheme.color.Red500}}>⚠️</span> 아직도 이런 고민 하고 계신가요?
                </Typography.DisplayL600>
              </SectionHeader>
              
              <ProblemsGrid>
                {problems.map((problem, index) => (
                  <ProblemCard key={index}>
                    <ProblemIcon>
                      <CrossIcon>❌</CrossIcon>
                    </ProblemIcon>
                    <Typography.TextL400 color={growsomeTheme.color.Black800}>
                      "{problem}"
                    </Typography.TextL400>
                  </ProblemCard>
                ))}
              </ProblemsGrid>
              
              <WarningCard>
                <WarningIcon>⏰</WarningIcon>
                <ColumnBox $gap={1} $ai="center">
                  <Typography.TextL600 color={growsomeTheme.color.Black800} style={{textAlign: 'center'}}>
                    ChatGPT, Claude 등 AI가 비즈니스를 바꾸고 있는데,
                  </Typography.TextL600>
                  <Typography.TextL600 color={growsomeTheme.color.Red500} style={{textAlign: 'center'}}>
                    매월 뒤처지고 있습니다
                  </Typography.TextL600>
                </ColumnBox>
              </WarningCard>
            </ColumnBox>
          </Container>
        </ProblemsSection>

        {/* Solution Section */}
        <SolutionSection>
          <Container>
            <ColumnBox $gap={4} $ai="center">
              <SectionBadge>
                <span style={{fontSize: '2rem'}}>✨</span>
                <Typography.TextL500 color={growsomeTheme.color.Primary600}>
                  그로우썸 10배 성장 모델!
                </Typography.TextL500>
              </SectionBadge>
              
              <SolutionsGrid>
                {solutions.map((solution, index) => (
                  <SolutionCard key={index}>
                    <SolutionIcon>{solution.icon}</SolutionIcon>
                    <ColumnBox $gap={1}>
                      <Typography.TextL600 color={growsomeTheme.color.Black800}>
                        {solution.title}
                      </Typography.TextL600>
                      <Typography.TextM400 color={growsomeTheme.color.Black600}>
                        {solution.description}
                      </Typography.TextM400>
                    </ColumnBox>
                  </SolutionCard>
                ))}
              </SolutionsGrid>
              
              <SolutionCTA>
                <Typography.DisplayS600 color={growsomeTheme.color.Black800} style={{textAlign: 'center'}}>
                  AI 시대에 맞는 진짜 성장 파트너
                </Typography.DisplayS600>
                <Typography.TextL400 color={growsomeTheme.color.Black600} style={{textAlign: 'center'}}>
                  지금 바로 시작하세요!
                </Typography.TextL400>
              </SolutionCTA>
            </ColumnBox>
          </Container>
        </SolutionSection>

        {/* Target Section */}
        <TargetSection>
          <Container>
            <ColumnBox $ai="center" $gap={4}>
              <SectionTitleWrapper>
                <Typography.DisplayL600 style={{textAlign: 'center'}}>
                  🎯 당신의 비즈니스 단계는?
                </Typography.DisplayL600>
              </SectionTitleWrapper>
              
              <TargetGrid>
                {/* 예비 1인 창업가 */}
                <TargetCard>
                  <CardHeader>
                    <TargetIconWrapper>
                      <TargetIcon>👤</TargetIcon>
                    </TargetIconWrapper>
                    <ColumnBox $gap={1}>
                      <Typography.TextXL500 color={growsomeTheme.color.Black800}>
                        예비 1인 창업가
                      </Typography.TextXL500>
                      <Typography.TextM400 color={growsomeTheme.color.Black600}>
                        백만원 단위 투자로 시작하는 성장 엔진
                      </Typography.TextM400>
                    </ColumnBox>
                  </CardHeader>
                  
                  <FeaturesList>
                    <FeatureItem>
                      <CheckIcon>✓</CheckIcon>
                      <Typography.TextM400 color={growsomeTheme.color.Black700}>
                        혼자서도 10명 규모 운영 가능한 자동화 시스템
                      </Typography.TextM400>
                    </FeatureItem>
                    <FeatureItem>
                      <CheckIcon>✓</CheckIcon>
                      <Typography.TextM400 color={growsomeTheme.color.Black700}>
                        500만원으로 시작 (기존 2,000만원 대비 75% 절감)
                      </Typography.TextM400>
                    </FeatureItem>
                    <FeatureItem>
                      <CheckIcon>✓</CheckIcon>
                      <Typography.TextM400 color={growsomeTheme.color.Black700}>
                        3개월 → 6주로 빠른 시장 진입
                      </Typography.TextM400>
                    </FeatureItem>
                    <FeatureItem>
                      <CheckIcon>✓</CheckIcon>
                      <Typography.TextM400 color={growsomeTheme.color.Black700}>
                        24시간 AI 고객 응대 시스템
                      </Typography.TextM400>
                    </FeatureItem>
                  </FeaturesList>
                  
                  <ROICard>
                    <ROIIcon>🚀</ROIIcon>
                    <ColumnBox $gap={1}>
                      <Typography.TextL600 color={growsomeTheme.color.Green600}>
                        투자 수익률: 2,100% (21배 수익)
                      </Typography.TextL600>
                      <Typography.TextS400 color={growsomeTheme.color.Black600}>
                        * 시간 가치 + 인력 절감 + 자동화 효과 합산
                      </Typography.TextS400>
                    </ColumnBox>
                  </ROICard>
                  
                  <GreenButton $size="large" $width="100%" onClick={handleFreeDiagnosisClick}>
                    예비 창업가 상담 신청
                  </GreenButton>
                </TargetCard>

                {/* 100억 매출 기업 */}
                <TargetCard>
                  <CardHeader>
                    <TargetIconWrapper>
                      <TargetIcon>🏢</TargetIcon>
                    </TargetIconWrapper>
                    <ColumnBox $gap={1}>
                      <Typography.TextXL500 color={growsomeTheme.color.Black800}>
                        100억 매출 기업
                      </Typography.TextXL500>
                      <Typography.TextM400 color={growsomeTheme.color.Black600}>
                        천만원 단위 투자로 시스템 고도화
                      </Typography.TextM400>
                    </ColumnBox>
                  </CardHeader>
                  
                  <FeaturesList>
                    <FeatureItem>
                      <CheckIcon>✓</CheckIcon>
                      <Typography.TextM400 color={growsomeTheme.color.Black700}>
                        이미 고객 확보 완료, 다음 단계 확장 준비
                      </Typography.TextM400>
                    </FeatureItem>
                    <FeatureItem>
                      <CheckIcon>✓</CheckIcon>
                      <Typography.TextM400 color={growsomeTheme.color.Black700}>
                        2,000만원으로 시스템 고도화 (기존 4,000만원 대비 50% 절감)
                      </Typography.TextM400>
                    </FeatureItem>
                    <FeatureItem>
                      <CheckIcon>✓</CheckIcon>
                      <Typography.TextM400 color={growsomeTheme.color.Black700}>
                        빅데이터 분석 및 예측 시스템
                      </Typography.TextM400>
                    </FeatureItem>
                    <FeatureItem>
                      <CheckIcon>✓</CheckIcon>
                      <Typography.TextM400 color={growsomeTheme.color.Black700}>
                        글로벌 확장 대응 시스템
                      </Typography.TextM400>
                    </FeatureItem>
                  </FeaturesList>
                  
                  <ROICard>
                    <ROIIcon>🚀</ROIIcon>
                    <ColumnBox $gap={1}>
                      <Typography.TextL600 color={growsomeTheme.color.Green600}>
                        투자 수익률: 13,200% (132배 수익)
                      </Typography.TextL600>
                      <Typography.TextS400 color={growsomeTheme.color.Black600}>
                        * 시장 선점 + 운영 효율화 + 매출 증대 합산
                      </Typography.TextS400>
                    </ColumnBox>
                  </ROICard>
                  
                  <GreenButton $size="large" $width="100%" onClick={handleFreeDiagnosisClick}>
                    대기업 상담 신청
                  </GreenButton>
                </TargetCard>
              </TargetGrid>
            </ColumnBox>
          </Container>
        </TargetSection>

        {/* Diagnosis Section - 개선된 버전 */}
        <DiagnosisSection>
          <Container>
            <ColumnBox $ai="center" $gap={5}>
              <SectionHeaderDiagnosis>
                <SectionBadge>
                  <span style={{fontSize: '2rem'}}>💡</span>
                  <Typography.TextL600 color={growsomeTheme.color.Green600}>
                    무료 10배 성장 진단 (5분 완료)
                  </Typography.TextL600>
                </SectionBadge>
                
                <Typography.TextL400 color={growsomeTheme.color.Black600} style={{textAlign: 'center', maxWidth: '600px'}}>
                  현재 보유한 서비스/아이디어의 10배 성장 가능성을 무료로 진단해드립니다.
                </Typography.TextL400>
              </SectionHeaderDiagnosis>

              <FeaturesGrid>
                {features.map((feature, index) => (
                  <FeatureCard key={index}>
                    <FeatureIcon>{feature.icon}</FeatureIcon>
                    <FeatureContent>
                      <Typography.TextL600 color={growsomeTheme.color.Black800} style={{marginBottom: '1rem'}}>
                        {feature.title}
                      </Typography.TextL600>
                      <Typography.TextM400 color={growsomeTheme.color.Black600} style={{lineHeight: '1.6'}}>
                        {feature.description}
                      </Typography.TextM400>
                    </FeatureContent>
                  </FeatureCard>
                ))}
              </FeaturesGrid>

              <UrgencyCard>
                <UrgencyHeader>
                  <UrgencyIcon>⏰</UrgencyIcon>
                  <Typography.TextXL500 color={growsomeTheme.color.Red500}>
                    마감 임박 알림
                  </Typography.TextXL500>
                </UrgencyHeader>
                
                <UrgencyList>
                  {urgencyItems.map((item, index) => (
                    <UrgencyItem key={index}>
                      <UrgencyBullet>🔴</UrgencyBullet>
                      <Typography.TextM500 color={growsomeTheme.color.Black700}>
                        {item.replace('🔴 ', '')}
                      </Typography.TextM500>
                    </UrgencyItem>
                  ))}
                </UrgencyList>
              </UrgencyCard>

              <CTAButtons>
                <GreenButton $size="large" onClick={handleFreeDiagnosisClick}>
                  💡 지금 무료 진단 받기 (5분 완료)
                </GreenButton>
                <Typography.TextS400 color={growsomeTheme.color.Black600} style={{textAlign: 'center'}}>
                  * 진단 결과는 24시간 내 개별 연락드립니다
                </Typography.TextS400>
              </CTAButtons>
            </ColumnBox>
          </Container>
        </DiagnosisSection>

        {/* Final Message Section */}
        <FinalSection>
          <Container>
            <ColumnBox $ai="center">
              <FinalMessage>
                <Typography.DisplayM600 color={growsomeTheme.color.Gray200} style={{textAlign: 'center', lineHeight: '1.7'}}>
                  "단순 에이전시는 홈페이지를 만들지만,<br />
                  스타트업 경험팀은 사업을 탄생시킵니다.<br /><br />
                  
                  <MessageHighlight>완성도 중심 vs 사업 성공 중심</MessageHighlight><br />
                  <MessageHighlight>단발성 작품 vs 성장하는 생명체</MessageHighlight><br />
                  <MessageHighlight>디자이너 감성 vs 고객 중심 데이터</MessageHighlight><br /><br />
                  
                  남들이 예쁜 홈페이지를 만드는 동안,<br />
                  당신은 AI와 스타트업 경험이 결합된<br />
                  진짜 성장 엔진을 얻으세요.<br /><br />
                  
                  <FinalCTA>
                    선택은 당신의 몫입니다.<br />
                    그로우썸은 준비되어 있습니다.
                  </FinalCTA>
                </Typography.DisplayM600>
              </FinalMessage>
            </ColumnBox>
          </Container>
        </FinalSection>
      </ServicesContainer>
    </ThemeProvider>
  );
};

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const ServicesContainer = styled.div`
  width: 100%;
  background: ${growsomeTheme.color.Gray50};
  min-height: 100vh;
  overflow-x: hidden;
`;

const HeroSection = styled.section`
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
`;

const HeroTitle = styled.div`
  position: relative;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${growsomeTheme.spacing.lg};
  max-width: 600px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(4, 1fr);
    max-width: 800px;
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
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: ${growsomeTheme.fontWeight.Bold};
  color: ${growsomeTheme.color.Green400};
  margin-bottom: ${growsomeTheme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${growsomeTheme.fontSize.TextS};
  opacity: 0.8;
`;

const ProblemsSection = styled.section`
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  background: ${growsomeTheme.color.White};
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const ProblemsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const ProblemCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.lg};
  padding: ${growsomeTheme.spacing.xl};
  background: ${growsomeTheme.color.White};
  border-radius: ${growsomeTheme.radius.radius2};
  box-shadow: ${growsomeTheme.shadow.Elevation1};
  border: 1px solid ${growsomeTheme.color.Gray200};
  text-align: left;
`;

const ProblemIcon = styled.div`
  background: ${growsomeTheme.color.Gray50};
  padding: ${growsomeTheme.spacing.sm};
  border-radius: ${growsomeTheme.radius.radius1};
  flex-shrink: 0;
`;

const CrossIcon = styled.div`
  width: 20px;
  height: 20px;
  color: ${growsomeTheme.color.Red500};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WarningCard = styled.div`
  background: ${growsomeTheme.color.Gray50};
  border: 1px solid ${growsomeTheme.color.Yellow300};
  border-radius: ${growsomeTheme.radius.radius2};
  padding: ${growsomeTheme.spacing.xl};
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const WarningIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${growsomeTheme.spacing.md};
`;

const SolutionSection = styled.section`
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  background: ${growsomeTheme.color.Gray50};
`;

const SectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${growsomeTheme.spacing.sm};
  background: ${growsomeTheme.color.Gray50};
  color: ${growsomeTheme.color.Primary600};
  padding: ${growsomeTheme.spacing.sm} ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius5};
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const SolutionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${growsomeTheme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media ${growsomeTheme.device.pc} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SolutionCard = styled.div`
  background: ${growsomeTheme.color.White};
  padding: ${growsomeTheme.spacing.xl};
  border-radius: ${growsomeTheme.radius.radius2};
  box-shadow: ${growsomeTheme.shadow.Elevation1};
  border: 1px solid ${growsomeTheme.color.Gray200};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${growsomeTheme.shadow.Elevation2};
  }
`;

const SolutionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${growsomeTheme.spacing.lg};
  animation: ${float} 3s ease-in-out infinite;
`;

const SolutionCTA = styled.div`
  text-align: center;
  margin-top: ${growsomeTheme.spacing.xl};
`;

const TargetSection = styled.section`
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  background: ${growsomeTheme.color.White};
`;

const SectionTitleWrapper = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const TargetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${growsomeTheme.spacing["3xl"]};
  max-width: 1200px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
  }
`;

const TargetCard = styled(Card)`
  background: ${growsomeTheme.color.White};
  border: 1px solid ${growsomeTheme.color.Gray200};
  padding: ${growsomeTheme.spacing.xl};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${growsomeTheme.shadow.Elevation2};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${growsomeTheme.spacing.lg};
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const TargetIconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background: ${growsomeTheme.color.Primary50};
  border-radius: ${growsomeTheme.radius.radius2};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TargetIcon = styled.div`
  font-size: 2rem;
  animation: ${float} 4s ease-in-out infinite;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.lg};
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.md};
`;

const CheckIcon = styled.span`
  color: ${growsomeTheme.color.Green500};
  font-weight: ${growsomeTheme.fontWeight.Bold};
  font-size: 1.2rem;
  margin-top: 0.2rem;
  flex-shrink: 0;
`;

const ROICard = styled.div`
  background: ${growsomeTheme.color.Green50};
  border: 1px solid ${growsomeTheme.color.Green200};
  padding: ${growsomeTheme.spacing.xl};
  border-radius: ${growsomeTheme.radius.radius2};
  display: flex;
  align-items: center;
  gap: ${growsomeTheme.spacing.lg};
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const ROIIcon = styled.div`
  font-size: 2rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const DiagnosisSection = styled.section`
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  background: ${growsomeTheme.color.Gray50};
`;

const SectionHeaderDiagnosis = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${growsomeTheme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.mobile} {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${growsomeTheme.color.Primary50};
  border: 1px solid ${growsomeTheme.color.Primary100};
  border-radius: ${growsomeTheme.radius.radius2};
  padding: ${growsomeTheme.spacing.xl};
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.lg};
  text-align: left;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${growsomeTheme.shadow.Elevation1};
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  background: ${growsomeTheme.color.Primary100};
  padding: ${growsomeTheme.spacing.md};
  border-radius: ${growsomeTheme.radius.radius2};
  flex-shrink: 0;
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const UrgencyCard = styled.div`
  background: ${growsomeTheme.color.Red50};
  border: 1px solid ${growsomeTheme.color.Red200};
  border-radius: ${growsomeTheme.radius.radius2};
  padding: ${growsomeTheme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;
`;

const UrgencyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${growsomeTheme.spacing.lg};
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const UrgencyIcon = styled.div`
  font-size: 2rem;
  animation: ${pulse} 1s ease-in-out infinite;
`;

const UrgencyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.md};
`;

const UrgencyItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.md};
`;

const UrgencyBullet = styled.div`
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
`;

const CTAButtons = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.lg};
  align-items: center;
`;

const FinalSection = styled.section`
  background: linear-gradient(135deg, ${growsomeTheme.color.Black800} 0%, ${growsomeTheme.color.Black700} 100%);
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(81, 79, 228, 0.1) 0%, transparent 70%);
  }
`;

const FinalMessage = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
`;

const MessageHighlight = styled.strong`
  color: ${growsomeTheme.color.Primary400};
  text-shadow: 0 0 20px rgba(81, 79, 228, 0.5);
`;

const FinalCTA = styled.strong`
  color: ${growsomeTheme.color.Green400};
  text-shadow: 0 0 20px rgba(6, 255, 1, 0.5);
`;

export default Services;