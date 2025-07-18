'use client';

import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useRouter } from 'next/navigation';
import {
  growsomeTheme,
  Typography,
  ColumnBox,
  RowBox,
  Container,
  Section,
  Card,
  Grid,
  PrimaryButton,
  GreenButton,
  SecondaryButton,
} from '@/components/design-system';

// Services Page Component
const Services = () => {
  const router = useRouter();

  const handleGetPriceClick = () => {
    router.push('/subscription');
  };

  const handleFreeDiagnosisClick = () => {
    window.open('https://pf.kakao.com/_Lpaln/chat', '_blank');
  };

  return (
    <ThemeProvider theme={growsomeTheme}>
      <ServicesContainer>
        {/* Hero Section */}
        <HeroSection>
          <Container>
            <ColumnBox $gap={4} $ai="center">
              <RowBox $gap={4} $ai="flex-start" style={{flexWrap: 'wrap', width: '100%'}}>
                {/* Problem Section */}
                <ColumnBox $f={1} $gap={2} style={{minWidth: '300px'}}>
                  <Typography.DisplayS600 color={growsomeTheme.color.White}>
                    ⚠️ 아직도 이런 고민 하고 계신가요?
                  </Typography.DisplayS600>
                  
                  <ColumnBox $gap={1}>
                    <ProblemItem>
                      <span>❌</span>
                      <Typography.TextM400 color={growsomeTheme.color.White}>
                        "AI 붙이고 싶은데 PHP 홈페이지로는 불가능해요"
                      </Typography.TextM400>
                    </ProblemItem>
                    
                    <ProblemItem>
                      <span>❌</span>
                      <Typography.TextM400 color={growsomeTheme.color.White}>
                        "6개월 기다렸는데 결과물이 2020년 수준이에요"
                      </Typography.TextM400>
                    </ProblemItem>
                    
                    <ProblemItem>
                      <span>❌</span>
                      <Typography.TextM400 color={growsomeTheme.color.White}>
                        "해외 개발자와 소통이 안 돼서 스트레스받아요"
                      </Typography.TextM400>
                    </ProblemItem>
                    
                    <ProblemItem>
                      <span>❌</span>
                      <Typography.TextM400 color={growsomeTheme.color.White}>
                        "AI 시대인데 우리 서비스만 뒤처지는 것 같아요"
                      </Typography.TextM400>
                    </ProblemItem>
                  </ColumnBox>
                  
                  <EndingCard>
                    <Typography.TextL500 color={growsomeTheme.color.White}>
                      이제 그런 고민 끝내세요!
                    </Typography.TextL500>
                  </EndingCard>
                </ColumnBox>

                {/* Solution Section */}
                <ColumnBox $f={1} $gap={2} style={{minWidth: '300px'}}>
                  <Typography.DisplayS600 color={growsomeTheme.color.White}>
                    ✨ 그로우썸은 다릅니다!
                  </Typography.DisplayS600>
                  
                  <ColumnBox $gap={1}>
                    <SolutionItem>
                      <span>✅</span>
                      <Typography.TextM400 color={growsomeTheme.color.White}>
                        처음부터 AI 확장을 고려한 Next.js 14 아키텍처
                      </Typography.TextM400>
                    </SolutionItem>
                    
                    <SolutionItem>
                      <span>✅</span>
                      <Typography.TextM400 color={growsomeTheme.color.White}>
                        6주만에 완성하는 초고속 개발 프로세스
                      </Typography.TextM400>
                    </SolutionItem>
                    
                    <SolutionItem>
                      <span>✅</span>
                      <Typography.TextM400 color={growsomeTheme.color.White}>
                        10년+ 경력 국내 시니어 개발팀 전담 배정
                      </Typography.TextM400>
                    </SolutionItem>
                    
                    <SolutionItem>
                      <span>✅</span>
                      <Typography.TextM400 color={growsomeTheme.color.White}>
                        AI API 연동부터 클라우드 배포까지 원스톱
                      </Typography.TextM400>
                    </SolutionItem>
                  </ColumnBox>
                  
                  <SolutionCard>
                    <Typography.TextL500 color={growsomeTheme.color.White}>
                      AI 시대의 승자가 되고 싶다면<br />
                      <strong style={{color: growsomeTheme.color.Green500}}>지금 바로 시작하세요.</strong>
                    </Typography.TextL500>
                  </SolutionCard>
                </ColumnBox>
              </RowBox>
            </ColumnBox>
          </Container>
        </HeroSection>

        {/* Main Message Section */}
        <Section $bg={growsomeTheme.color.White}>
          <Container>
            <ColumnBox $ai="center" $gap={2}>
              <Typography.DisplayXL700 style={{textAlign: 'center', lineHeight: '1.2'}}>
                AI 시대, 6주만에 완성하는<br />
                <span style={{color: growsomeTheme.color.Primary500}}>월 매출 1억 서비스</span>를 만드세요
              </Typography.DisplayXL700>
              
              <Typography.TextL400 style={{textAlign: 'center', maxWidth: '600px'}} color={growsomeTheme.color.Black600}>
                최신 기술 + 국내 시니어팀 + AI 확장성<br />
                레거시는 버리고 미래를 선택하세요
              </Typography.TextL400>
            </ColumnBox>
          </Container>
        </Section>

        {/* Differentiation Section */}
        <Section $bg={growsomeTheme.color.Gray50}>
          <Container>
            <ColumnBox $ai="center" $gap={4}>
              <Typography.DisplayL600 style={{textAlign: 'center'}}>
                💎 5대 핵심 차별화 포인트
              </Typography.DisplayL600>
              
              <Grid $minColumnWidth="400px">
                {/* 1. 최신 기술 스택 */}
                <Card>
                  <ColumnBox $gap={2}>
                    <Typography.DisplayS600>🔥</Typography.DisplayS600>
                    <Typography.DisplayS600>최신 기술 스택 + AI 확장성</Typography.DisplayS600>
                    <Typography.TextM500 color={growsomeTheme.color.Primary500}>
                      "레거시 PHP는 이제 그만! Next.js 14 + AI API로 미래를 준비하세요"
                    </Typography.TextM500>
                    
                    <ColumnBox $gap={1}>
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          2025년 최신 기술 스택 (Next.js 14, TypeScript, Prisma)
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          AI 확장성 100% 보장 (OpenAI, Claude API 즉시 연결)
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          글로벌 스탠다드 아키텍처 (AWS 클라우드 네이티브)
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <AntiFeatureItem>
                        <CrossIcon>✗</CrossIcon>
                        <Typography.TextM400 color={growsomeTheme.color.Black600}>
                          구식 PHP/그누보드는 AI 시대에 도태됩니다
                        </Typography.TextM400>
                      </AntiFeatureItem>
                    </ColumnBox>
                  </ColumnBox>
                </Card>

                {/* 2. 초고속 개발 */}
                <Card>
                  <ColumnBox $gap={2}>
                    <Typography.DisplayS600>⚡</Typography.DisplayS600>
                    <Typography.DisplayS600>6주 초고속 개발</Typography.DisplayS600>
                    <Typography.TextM500 color={growsomeTheme.color.Primary500}>
                      "6개월 기다릴 시간에 이미 수익을 창출하세요"
                    </Typography.TextM500>
                    
                    <ColumnBox $gap={1}>
                      <ComparisonCard>
                        <AntiFeatureItem>
                          <CrossIcon>✗</CrossIcon>
                          <Typography.TextM400 color={growsomeTheme.color.Black600}>
                            일반 개발사: 6개월 + 2,000만원
                          </Typography.TextM400>
                        </AntiFeatureItem>
                        
                        <FeatureItem>
                          <CheckIcon>✓</CheckIcon>
                          <Typography.TextM400>
                            그로우썸: 6주 + 600만원 (70% 절감)
                          </Typography.TextM400>
                        </FeatureItem>
                      </ComparisonCard>
                      
                      <Typography.TextM400>
                        🚀 빠른 시장 진입 = 경쟁 우위 선점
                      </Typography.TextM400>
                    </ColumnBox>
                  </ColumnBox>
                </Card>

                {/* 3. 국내 시니어팀 */}
                <Card>
                  <ColumnBox $gap={2}>
                    <Typography.DisplayS600>🇰🇷</Typography.DisplayS600>
                    <Typography.DisplayS600>국내 시니어 개발팀</Typography.DisplayS600>
                    <Typography.TextM500 color={growsomeTheme.color.Primary500}>
                      "해외 개발자 커뮤니케이션 스트레스는 이제 그만!"
                    </Typography.TextM500>
                    
                    <ColumnBox $gap={1}>
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          실시간 한국어 소통 (슬랙/노션 실시간 협업)
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          한국 비즈니스 환경 완벽 이해
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          3개월 무료 애프터서비스 책임감
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <AntiFeatureItem>
                        <CrossIcon>✗</CrossIcon>
                        <Typography.TextM400 color={growsomeTheme.color.Black600}>
                          해외 개발자 시차/언어 장벽/책임감 부족 걱정 끝
                        </Typography.TextM400>
                      </AntiFeatureItem>
                    </ColumnBox>
                  </ColumnBox>
                </Card>

                {/* 4. 데이터 기반 성장 엔진 */}
                <Card>
                  <ColumnBox $gap={2}>
                    <Typography.DisplayS600>📊</Typography.DisplayS600>
                    <Typography.DisplayS600>데이터 기반 성장 엔진</Typography.DisplayS600>
                    <Typography.TextM500 color={growsomeTheme.color.Primary500}>
                      "감으로 사업하지 마세요! 데이터로 매출을 증명하세요"
                    </Typography.TextM500>
                    
                    <ColumnBox $gap={1}>
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          Microsoft Clarity 히트맵 실시간 사용자 행동 분석
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          GA4 고급 설정 및 맞춤 이벤트 트래킹
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          데이터 기반 UX 개선 컨설팅 제공
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          월간 성과 리포트 및 개선 제안
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <AntiFeatureItem>
                        <CrossIcon>✗</CrossIcon>
                        <Typography.TextM400 color={growsomeTheme.color.Black600}>
                          일반 개발사는 "만들고 끝", 성과 측정 불가
                        </Typography.TextM400>
                      </AntiFeatureItem>
                    </ColumnBox>
                  </ColumnBox>
                </Card>

                {/* 5. 콘텐츠 자동화 */}
                <Card>
                  <ColumnBox $gap={2}>
                    <Typography.DisplayS600>🤖</Typography.DisplayS600>
                    <Typography.DisplayS600>n8n 콘텐츠 자동화 엔진</Typography.DisplayS600>
                    <Typography.TextM500 color={growsomeTheme.color.Primary500}>
                      "콘텐츠 제작에 시간 낭비하지 마세요!"
                    </Typography.TextM500>
                    
                    <ColumnBox $gap={1}>
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          n8n 워크플로우 자동화 시스템 구축
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          AI 콘텐츠 생성 + 소셜미디어 자동 발행
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          멀티 채널 동시 배포 (블로그, SNS, 뉴스레터)
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <FeatureItem>
                        <CheckIcon>✓</CheckIcon>
                        <Typography.TextM400>
                          고객 여정별 자동화된 마케팅 시퀀스
                        </Typography.TextM400>
                      </FeatureItem>
                      
                      <AntiFeatureItem>
                        <CrossIcon>✗</CrossIcon>
                        <Typography.TextM400 color={growsomeTheme.color.Black600}>
                          일반 개발사는 콘텐츠 마케팅까지 지원 불가
                        </Typography.TextM400>
                      </AntiFeatureItem>
                    </ColumnBox>
                  </ColumnBox>
                </Card>
              </Grid>
            </ColumnBox>
          </Container>
        </Section>

        {/* CTA Section */}
        <CTASection>
          <Container>
            <ColumnBox $ai="center" $gap={3}>
              <Typography.DisplayL600 color={growsomeTheme.color.White} style={{textAlign: 'center'}}>
                💡 무료 AI 확장성 진단받기
              </Typography.DisplayL600>
              
              <Typography.TextL400 color={growsomeTheme.color.White} style={{textAlign: 'center', maxWidth: '600px'}}>
                현재 보유한 서비스/아이디어의<br />
                AI 확장 가능성을 무료로 진단해드립니다.
              </Typography.TextL400>

              <RowBox $gap={2} $jc="center" style={{flexWrap: 'wrap'}}>
                <GreenButton $size="large" onClick={handleFreeDiagnosisClick}>
                  🚀 무료 진단 신청하기
                </GreenButton>
                <SecondaryButton 
                  $size="large"
                  onClick={handleGetPriceClick}
                  style={{
                    color: growsomeTheme.color.White, 
                    borderColor: growsomeTheme.color.White
                  }}
                >
                  💰 가격 확인하기
                </SecondaryButton>
              </RowBox>

              <LimitedOfferCard>
                <ColumnBox $gap={2} $ai="center">
                  <Typography.DisplayS600 color={growsomeTheme.color.Green500}>
                    🔥 지금 주문하면 특별 혜택
                  </Typography.DisplayS600>
                  
                  <ColumnBox $gap={1} style={{textAlign: 'left', maxWidth: '500px'}}>
                    <Typography.TextM400 color={growsomeTheme.color.White}>
                      • 얼리버드 할인: 추가 20% 할인
                    </Typography.TextM400>
                    <Typography.TextM400 color={growsomeTheme.color.White}>
                      • 무료 기술 지원: 6개월 → 12개월 연장
                    </Typography.TextM400>
                    <Typography.TextM400 color={growsomeTheme.color.White}>
                      • AI 확장성 보장: 추후 AI 기능 추가 시 50% 할인
                    </Typography.TextM400>
                  </ColumnBox>
                  
                  <Typography.TextM600 color={growsomeTheme.color.Red500} style={{animation: 'pulse 2s infinite'}}>
                    ⏰ 한정 혜택입니다. 놓치면 후회합니다.
                  </Typography.TextM600>
                </ColumnBox>
              </LimitedOfferCard>
            </ColumnBox>
          </Container>
        </CTASection>

        {/* Final Message Section */}
        <Section $bg={growsomeTheme.color.Black800}>
          <Container>
            <ColumnBox $ai="center">
              <Typography.DisplayM600 color={growsomeTheme.color.Gray200} style={{textAlign: 'center', lineHeight: '1.8'}}>
                "AI 시대의 기술 선택이<br />
                5년 후 당신의 비즈니스를 결정합니다.<br /><br />
                
                레거시 기술로 과거에 머물 것인가?<br />
                최신 기술로 미래를 선점할 것인가?<br /><br />
                
                <strong style={{color: growsomeTheme.color.Green500}}>
                  선택은 당신의 몫입니다.<br />
                  그로우썸은 준비되어 있습니다.
                </strong>
              </Typography.DisplayM600>
            </ColumnBox>
          </Container>
        </Section>
      </ServicesContainer>
    </ThemeProvider>
  );
};

// Styled Components (for custom elements not covered by design system)
const ServicesContainer = styled.div`
  width: 100%;
  background: ${growsomeTheme.color.Gray50};
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${growsomeTheme.color.Primary500} 0%, ${growsomeTheme.color.Primary700} 100%);
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing["3xl"]} 0;
  }
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, ${growsomeTheme.color.Primary500} 0%, ${growsomeTheme.color.Primary700} 100%);
  padding: ${growsomeTheme.spacing["4xl"]} 0;
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing["3xl"]} 0;
  }
`;

const ProblemItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.md};
  
  span {
    margin-top: 0.2rem;
    flex-shrink: 0;
  }
`;

const SolutionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.md};
  
  span {
    margin-top: 0.2rem;
    flex-shrink: 0;
  }
`;

const EndingCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius2};
  text-align: center;
  backdrop-filter: blur(10px);
`;

const SolutionCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius2};
  text-align: center;
  backdrop-filter: blur(10px);
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.sm};
`;

const AntiFeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${growsomeTheme.spacing.sm};
`;

const CheckIcon = styled.span`
  color: ${growsomeTheme.color.Green500};
  font-weight: ${growsomeTheme.fontWeight.Bold};
  margin-top: 0.2rem;
  flex-shrink: 0;
`;

const CrossIcon = styled.span`
  color: ${growsomeTheme.color.Red500};
  font-weight: ${growsomeTheme.fontWeight.Bold};
  margin-top: 0.2rem;
  flex-shrink: 0;
`;

const ComparisonCard = styled.div`
  background: ${growsomeTheme.color.Gray50};
  padding: ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius2};
  gap: ${growsomeTheme.spacing.sm};
  display: flex;
  flex-direction: column;
`;

const LimitedOfferCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${growsomeTheme.radius.radius3};
  padding: ${growsomeTheme.spacing["2xl"]};
  backdrop-filter: blur(10px);
  max-width: 600px;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

export default Services;