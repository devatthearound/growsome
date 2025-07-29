'use client';

import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { useRouter } from 'next/navigation';
import { growsomeTheme } from '@/components/design-system/theme';
import { Typography } from '@/components/design-system/Typography';
import { ColumnBox, RowBox, Container, Section, Card } from '@/components/design-system/Layout';
import { GreenButton, SecondaryButton, PrimaryButton } from '@/components/design-system/Button';
import Link from 'next/link';
import Image from 'next/image';

// Custom styled component for the bright green diagnosis button
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
`;

// 모바일 최적화된 진단 버튼
const MobileDiagnosisButton = styled(DiagnosisButton)`
  @media ${growsomeTheme.device.mobile} {
    font-size: 1rem !important;
    padding: 1rem 1.5rem !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// Services Page Component
const Services = () => {
  const router = useRouter();

  const handleGetPriceClick = () => {
    router.push('/subscription');
  };

  const handleFreeDiagnosisClick = () => {
    router.push('/diagnosis');
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
        {/* Hero Section */}
        <HeroSection>
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
                  <MobileDiagnosisButton $size="large" onClick={handleFreeDiagnosisClick}>
                    💡 무료 10배 성장 진단 (5분 완료)
                  </MobileDiagnosisButton>

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

        {/* Portfolio Section */}
        <PortfolioSection>
          <Container>
            <PortfolioTitle style={{textAlign:'center', marginBottom:'2rem', fontWeight: 700, color: growsomeTheme.color.Black800}}>우리가 만든 결과물</PortfolioTitle>
          <PortfolioGrid>
            {portfolioPreview.map((item) => (
              <Link key={item.id} href={`/portfolio/${item.id}`} style={{textDecoration: 'none'}}>
                <PortfolioCard role="link" tabIndex={0}>
                  <PortfolioImage>
                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{objectFit:'cover', borderRadius:16}} />
                  </PortfolioImage>
                  <PortfolioInfo>
                    <Typography.TextL600 style={{marginBottom:'0.5rem', color: growsomeTheme.color.Black800, fontWeight: 600}}>{item.title}</Typography.TextL600>
                    <Typography.TextM400 style={{marginBottom:'1rem', color: growsomeTheme.color.Black600}}>{item.description}</Typography.TextM400>
                  </PortfolioInfo>
                </PortfolioCard>
              </Link>
            ))}
          </PortfolioGrid>
            <div style={{textAlign:'center', marginTop:'2rem'}}>
              <Link href="/portfolio">
                <SecondaryButton $color="customPurple" $size="medium">포트폴리오 전체보기</SecondaryButton>
              </Link>
            </div>
          </Container>
        </PortfolioSection>

        {/* Problems Section */}
        <ProblemsSection>
          <Container>
            <ColumnBox $gap={4} $ai="center">
              <SectionHeader>
              <ProblemsTitle style={{textAlign: 'center', marginBottom: '2rem'}}>
              <span style={{color: growsomeTheme.color.Red500}}>⚠️</span> 아직도 이런 고민 하고 계신가요?
              </ProblemsTitle>
              </SectionHeader>
              
              <ProblemsGrid>
                {problems.map((problem, index) => (
                  <ProblemCard key={index}>
                    <ProblemIcon>
                      <CrossIcon>❌</CrossIcon>
                    </ProblemIcon>
                    <Typography.TextL400 style={{color: growsomeTheme.color.Black700, fontWeight: 500}}>
                      "{problem}"
                    </Typography.TextL400>
                  </ProblemCard>
                ))}
              </ProblemsGrid>
              
              <WarningCard>
                <WarningIcon>⏰</WarningIcon>
                <ColumnBox $gap={1} $ai="center">
                  <Typography.TextL600 color={growsomeTheme.color.Black800} style={{textAlign: 'center'}}>
                    ChatGPT, Claude 등<br />AI가 비즈니스를 바꾸고 있는데,
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
              <MobileSectionBadge style={{justifyContent:'center', display:'flex', margin:'0 auto 1.5rem auto'}}>
              <BadgeIcon>✨</BadgeIcon>
              <SolutionBadgeTitle style={{fontWeight:800, color: growsomeTheme.color.Black800, textAlign:'center', marginLeft:'0.5rem'}}>그로우썸 10배 성장 모델!</SolutionBadgeTitle>
              </MobileSectionBadge>
              
              <SolutionsGrid>
                {solutions.map((solution, index) => (
                  <SolutionCard key={index}>
                    <SolutionIcon>{solution.icon}</SolutionIcon>
                    <ColumnBox $gap={1}>
                      <Typography.TextL600 style={{color: growsomeTheme.color.Primary500, fontWeight: 700, marginBottom: '0.5rem'}}>
                        {solution.title}
                      </Typography.TextL600>
                      <Typography.TextM400 style={{color: growsomeTheme.color.Black600}}>
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
                <TargetSectionTitle style={{textAlign: 'center'}}>
                  🎯 당신의 비즈니스 단계는?
                </TargetSectionTitle>
              </SectionTitleWrapper>
              
              <TargetGrid>
                {/* 예비 1인 창업가 */}
                <TargetCard>
                  <CardHeader>
                    <CardIcon>👤</CardIcon>
                    <CardTitle>예비 1인 창업가</CardTitle>
                  </CardHeader>
                  <FeaturesList>
                    <FeatureItem><FeatureCheck>✅</FeatureCheck>혼자서도 10명 규모 운영 가능한 자동화 시스템</FeatureItem>
                    <FeatureItem><FeatureCheck>✅</FeatureCheck>500만원으로 시작 (최대 75% 비용 절감)</FeatureItem>
                    <FeatureItem><FeatureCheck>✅</FeatureCheck>6주 만에 시장 진입 (최대 6배 빠름)</FeatureItem>
                    <FeatureItem><FeatureCheck>✅</FeatureCheck>24시간 AI 자동화</FeatureItem>
                  </FeaturesList>
                  <RoiHighlight>21배 투자수익률</RoiHighlight>
                  <RoiSub>* 시간 절감 + 인력 절감 + 자동화 효과</RoiSub>
                  <PrimaryButton $color="primary" $size="medium" style={{marginTop:'0.5rem', width:'100%'}} onClick={handleFreeDiagnosisClick}>
                    상담 신청
                  </PrimaryButton>
                </TargetCard>

                {/* 100억 매출 기업 */}
                <TargetCard>
                  <CardHeader>
                    <CardIcon>🏢</CardIcon>
                    <CardTitle>100억 매출 기업</CardTitle>
                  </CardHeader>
                  <FeaturesList>
                    <FeatureItem><FeatureCheck>✅</FeatureCheck>이미 고객 확보, 다음 단계 확장 준비</FeatureItem>
                    <FeatureItem><FeatureCheck>✅</FeatureCheck>2,000만원으로 고도화 (최대 50% 비용 절감)</FeatureItem>
                    <FeatureItem><FeatureCheck>✅</FeatureCheck>빅데이터 분석/예측 시스템</FeatureItem>
                    <FeatureItem><FeatureCheck>✅</FeatureCheck>글로벌 확장 지원</FeatureItem>
                  </FeaturesList>
                  <RoiHighlight>132배 매출 성장</RoiHighlight>
                  <RoiSub>* 시장 선점 + 효율화 + 매출 증대</RoiSub>
                  <PrimaryButton $color="primary" $size="medium" style={{marginTop:'0.5rem', width:'100%'}} onClick={handleFreeDiagnosisClick}>
                    상담 신청
                  </PrimaryButton>
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

              {/* UrgencyCard(마감 임박 알림) 섹션 제거 */}
              {/* <UrgencyCard>
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
              </UrgencyCard> */}

              <CTAButtons>
              <MobileDiagnosisButton $size="large" onClick={handleFreeDiagnosisClick}>
              💡 지금 무료 진단 받기 (5분 완료)
              </MobileDiagnosisButton>
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
            <FinalMessage style={{
              color: '#fff',
              textAlign: 'center',
              lineHeight: '1.7',
              fontWeight: 600,
              textShadow: '0 2px 8px rgba(0,0,0,0.25)'
            }}>
              일반적으로 에이전시는 홈페이지를 만들지만, <br />
              스타트업 경험팀은 사업을 탄생시킵니다. <br /><br />
              <span style={{color: '#A5B4FC', fontWeight:700}}>완성도 중심 vs 사업 성공 중심</span><br />
              <span style={{color: '#A5B4FC', fontWeight:700}}>단발성 작품 vs 성장하는 생명체</span><br />
              <span style={{color: '#A5B4FC', fontWeight:700}}>디자이너 감성 vs 고객 중심 데이터</span><br /><br />
              남들이 예쁜 홈페이지를 만드는 동안,<br />
              당신은 AI와 스타트업 경험이 결합된<br />
              진짜 성장 엔진을 얻으세요.<br /><br />
              <span style={{color: '#22FF5F', fontWeight:700}}>선택은 당신의 몫입니다.<br />그로우썸은 준비되어 있습니다.</span>
            </FinalMessage>
          </Container>
        </FinalSection>

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
  padding: 0 ${growsomeTheme.spacing.lg};
  
  @media ${growsomeTheme.device.mobile} {
    padding: 0 ${growsomeTheme.spacing.md};
  }
`;

// 모바일 최적화된 히어로 텍스트 컴포넌트들
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

const ProblemsSection = styled.section`
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  background: ${growsomeTheme.color.White};
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing["2xl"]} 0;
  }
`;

const ProblemsTitle = styled(Typography.DisplayL600)`
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.5rem !important;
  }
  
  @media ${growsomeTheme.device.tablet} {
    font-size: 2rem !important;
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
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing.lg};
    gap: ${growsomeTheme.spacing.md};
    
    .Typography.TextL400 {
      font-size: 1rem !important;
    }
  }
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
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing["2xl"]} 0;
  }
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

const SolutionBadgeTitle = styled(Typography.DisplayL700)`
  font-size: 2.2rem;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.2rem !important;
    line-height: 1.3;
  }
  
  @media ${growsomeTheme.device.tablet} {
    font-size: 1.8rem !important;
  }
`;

const MobileSectionBadge = styled(SectionBadge)`
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing.md} ${growsomeTheme.spacing.lg};
    flex-direction: row;
    align-items: center;
    gap: ${growsomeTheme.spacing.sm};
    margin: 0 auto 1rem auto;
    background: ${growsomeTheme.color.Primary50};
    border: 1px solid ${growsomeTheme.color.Primary200};
    border-radius: ${growsomeTheme.radius.radius3};
  }
`;

const BadgeIcon = styled.span`
  font-size: 2.5rem;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.8rem;
  }
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
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing.lg};
  }
`;

const SolutionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${growsomeTheme.spacing.lg};
  animation: ${float} 3s ease-in-out infinite;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 2.5rem;
    margin-bottom: ${growsomeTheme.spacing.md};
  }
`;

const SolutionCTA = styled.div`
  text-align: center;
  margin-top: ${growsomeTheme.spacing.xl};
`;

const TargetSection = styled.section`
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  background: ${growsomeTheme.color.White};
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing["2xl"]} 0;
  }
`;

const TargetSectionTitle = styled(Typography.DisplayL600)`
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

// TargetCard SaaS 스타일 업그레이드
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

const DiagnosisSection = styled.section`
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  background: ${growsomeTheme.color.Gray50};
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing["2xl"]} 0;
  }
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
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing.lg};
    gap: ${growsomeTheme.spacing.md};
    flex-direction: column;
    text-align: center;
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  background: ${growsomeTheme.color.Primary100};
  padding: ${growsomeTheme.spacing.md};
  border-radius: ${growsomeTheme.radius.radius2};
  flex-shrink: 0;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 2rem;
    padding: ${growsomeTheme.spacing.sm};
    align-self: center;
  }
`;

const FeatureContent = styled.div`
  flex: 1;
`;

// UrgencyCard(마감 임박 알림) 섹션 제거
// const UrgencyCard = styled.div`
//   background: ${growsomeTheme.color.Red50};
//   border: 1px solid ${growsomeTheme.color.Red200};
//   border-radius: ${growsomeTheme.radius.radius2};
//   padding: ${growsomeTheme.spacing.xl};
//   max-width: 800px;
//   margin: 0 auto;
// `;

// const UrgencyHeader = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: ${growsomeTheme.spacing.lg};
//   margin-bottom: ${growsomeTheme.spacing.xl};
// `;

// const UrgencyIcon = styled.div`
//   font-size: 2rem;
//   animation: ${pulse} 1s ease-in-out infinite;
// `;

// const UrgencyList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: ${growsomeTheme.spacing.md};
// `;

// const UrgencyItem = styled.div`
//   display: flex;
//   align-items: flex-start;
//   gap: ${growsomeTheme.spacing.md};
// `;

// const UrgencyBullet = styled.div`
//   font-size: 1rem;
//   flex-shrink: 0;
//   margin-top: 0.2rem;
// `;

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
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing["2xl"]} 0;
  }
`;

const FinalMessage = styled(Typography.DisplayM600)`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.1rem !important;
    line-height: 1.6;
    padding: 0 ${growsomeTheme.spacing.md};
  }
  
  @media ${growsomeTheme.device.tablet} {
    font-size: 1.3rem !important;
  }
`;

const MessageHighlight = styled.strong`
  color: ${growsomeTheme.color.Primary400};
  text-shadow: 0 0 20px rgba(81, 79, 228, 0.5);
`;

const FinalCTA = styled.strong`
  color: ${growsomeTheme.color.Green400};
  text-shadow: 0 0 20px rgba(6, 255, 1, 0.5);
`;

// styled-components 정의를 export default Services 위에 위치시킴
const PortfolioSection = styled.section`
  background: ${growsomeTheme.color.Gray50};
  padding: 80px 0 100px 0;
  
  @media ${growsomeTheme.device.mobile} {
    padding: 40px 0 60px 0;
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

// styled-components for FOMO modal - 브라우저 하단 고정, 딤드 없음
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