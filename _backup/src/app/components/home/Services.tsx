'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

const Services = () => {
  const [activeMainTab, setActiveMainTab] = useState('coaching');
  const [activeSubTab, setActiveSubTab] = useState('serviceTarget');
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  type MainTabKey = 'coaching' | 'development';

  const mainTabs: Record<MainTabKey, {
    title: string;
    subTabs: { id: string; label: string }[];
  }> = {
    coaching: {
      title: "올라운드 개발",
      subTabs: [
        { id: 'serviceTarget', label: '서비스 대상' },
        { id: 'process', label: '프로세스' },
        { id: 'statusCheck', label: '작업상황확인' },
        { id: 'estimate', label: '견적' },
        { id: 'benefit', label: '비용절감 혜택' },
        { id: 'qna', label: 'QnA' }
      ]
    },
    development: {
      title: "개발팀 구독",
      subTabs: [
        { id: 'serviceTarget', label: '서비스 대상' },
        { id: 'process', label: '프로세스' },
        { id: 'payment', label: '정산 방식' },
        { id: 'workerManagement', label: '작업자 관리' },
        { id: 'qna', label: 'QnA' }
      ]
    }
  };

  const processSteps = [
    {
      step: "STEP 1",
      title: "프로덕트 분석",
      description: "비즈니스 / 프로덕트 컨설팅",
      icon: "📊" // 또는 FontAwesome 아이콘 사용 가능
    },
    {
      step: "STEP 2",
      title: "기획 및 디자인 제작",
      description: "서비스 기획서, IA, 와이어 프레임, 화면 설계서, 디자인 기획서, GUI 디자인",
      icon: "✏️"
    },
    {
      step: "STEP 3",
      title: "개발팀 매칭 및 개발 착수",
      description: "리모트 개발팀으로 개발 가이드 라인 및 코드 템플릿을 통한 체계적인 개발",
      icon: "</>"
    },
    {
      step: "STEP 4",
      title: "QC/QA를 통한 하자율 관리",
      description: "기획 단계부터 프로젝트 마무리까지 진행하는 기획 QC, 단위테스트, UAT 시나리오 테스트",
      icon: "⚙️"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSubTab((entry.target as HTMLElement).dataset.tabId!);
          }
                  });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    const currentRefs = contentRefs.current;

    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [activeMainTab]);

  const scrollToSection = (tabId: string) => {
    const element = contentRefs.current.find(
      ref => ref?.dataset.tabId === tabId
    );
    if (element) {
      const yOffset = -200;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleMainTabClick = (key: MainTabKey) => {
    setActiveMainTab(key);
    setTimeout(() => {
      scrollToSection(mainTabs[key].subTabs[0].id);
    }, 0);
  };

  const handleInquiryClick = () => {
    router.push('/inquiry', { 
      // state: { 
      //   source: 'services',
      //   type: 'development'
      // }
    });
  };

  const handleSubscriptionClick = () => {
    router.push('/subscription', {
      // state: {
      //   source: 'services',
      //   type: 'team'
      // }
    });
  };

  const renderContent = (tabId: string) => {
    const tab = mainTabs[activeMainTab as MainTabKey].subTabs.find((tab: { id: string }) => tab.id === tabId);
    
    switch (tabId) {
      case 'serviceTarget':
        if (activeMainTab === 'development') {
          return (
            <ServiceTargetSection>
              <ServiceTargetTitle>
                필요할 때 필요한 만큼만 작업자를 사용하고 싶어요!
              </ServiceTargetTitle>
              <TargetList>
                <TargetItem>
                  <IconWrapper>
                    <FontAwesomeIcon icon={faCheck} />
                  </IconWrapper>
                  <ItemContent>
                    <ItemTitle>저비용으로 운영 가능한 장기적인 개발팀이 필요해요.</ItemTitle>
                    <ItemDescription>
                      정규직 채용 대비 50% 이상 비용 절감이 가능하며, 안정적인 장기 운영이 가능합니다.
                    </ItemDescription>
                  </ItemContent>
                </TargetItem>

                <TargetItem>
                  <IconWrapper>
                    <FontAwesomeIcon icon={faCheck} />
                  </IconWrapper>
                  <ItemContent>
                    <ItemTitle>촉박한 일정 때문에 빠른 인력 충원이 필요해요.</ItemTitle>
                    <ItemDescription>
                      평균 1주일 이내 매칭 완료! 긴급한 인력 공백도 빠르게 해결해드립니다.
                    </ItemDescription>
                  </ItemContent>
                </TargetItem>

                <TargetItem>
                  <IconWrapper>
                    <FontAwesomeIcon icon={faCheck} />
                  </IconWrapper>
                  <ItemContent>
                    <ItemTitle>개발자 채용 부담 및 잦은 퇴사로 개발팀 운영이 어려워요.</ItemTitle>
                    <ItemDescription>
                      채용/퇴사 리스크 없이 안정적인 개발팀 운영이 가능합니다.
                    </ItemDescription>
                  </ItemContent>
                </TargetItem>

                <TargetItem>
                  <IconWrapper>
                    <FontAwesomeIcon icon={faCheck} />
                  </IconWrapper>
                  <ItemContent>
                    <ItemTitle>인하우스 개발팀의 퍼포먼스 개선이 필요해요.</ItemTitle>
                    <ItemDescription>
                      기존 개발팀과 협업하여 개발 생산성을 향상시키고 프로젝트 일정을 단축시킵니다.
                    </ItemDescription>
                  </ItemContent>
                </TargetItem>
              </TargetList>
            </ServiceTargetSection>
          );
        }
        return (
          <ServiceTargetSection>
            <ServiceTargetTitle>
              프로젝트 [기획, 디자인, 개발] 전체를 맡기고 싶어요!
            </ServiceTargetTitle>
            <TargetList>
              <TargetItem>
                <IconWrapper>
                  <FontAwesomeIcon icon={faCheck} />
                </IconWrapper>
                <ItemContent>
                  <ItemTitle>아이디어가 있는데, 개발이 처음이에요.</ItemTitle>
                  <ItemDescription>
                    기술적 지식이 없어도 시작할 수 있습니다.
                  </ItemDescription>
                </ItemContent>
              </TargetItem>

              <TargetItem>
                <IconWrapper>
                  <FontAwesomeIcon icon={faCheck} />
                </IconWrapper>
                <ItemContent>
                  <ItemTitle>IT 전문가가 팀에 없어요.</ItemTitle>
                  <ItemDescription>
                    전문 개발자 없이도 프로젝트를 진행할 수 있습니다.
                  </ItemDescription>
                </ItemContent>
              </TargetItem>

              <TargetItem>
                <IconWrapper>
                  <FontAwesomeIcon icon={faCheck} />
                </IconWrapper>
                <ItemContent>
                  <ItemTitle>어떤 개발자를 어디서 구해야 하는지 모르겠어요.</ItemTitle>
                  <ItemDescription>
                    필요한 인재를 찾고 프로젝트를 시작할 수 있도록 도와드립니다.
                  </ItemDescription>
                </ItemContent>
              </TargetItem>
            </TargetList>
          </ServiceTargetSection>
        );
      case 'estimate':
        return (
          <EstimateSection>
            <EstimateTitle>요구사항정제 후 꼭 필요한 기능만 작업하고 싶어요!</EstimateTitle>
            <EstimateContent>
              <ChatBubble>
                예산에 맞게, 필요한 개발범위만 저렴하게 견적 받아보세요!
              </ChatBubble>
              <EstimateList>
                <EstimateItem>
                  <ItemTitle>사용자 및 업체용 반응형 웹</ItemTitle>
                </EstimateItem>
                <EstimateItem>
                  <ItemTitle>Android와 iOS 앱 모두 개발</ItemTitle>
                </EstimateItem>
                <EstimateItem>
                  <ItemTitle>관리자용 웹 개발</ItemTitle>
                </EstimateItem>
                <EstimateItem>
                  <ItemTitle>지속적인 유지보수 가능한 형태</ItemTitle>
                </EstimateItem>
              </EstimateList>
            </EstimateContent>
          </EstimateSection>
        );
      case 'benefit':
        return (
          <VoucherSection>
            <VoucherTag>비용 절감 혜택</VoucherTag>
            <VoucherTitle>정부지원사업으로 최대 5천만원의 비용 부담을 줄이세요</VoucherTitle>
            <VoucherSubtitle>정부지원사업 활용 시 최대 90%까지 비용 절감이 가능합니다</VoucherSubtitle>
            
            <VoucherGrid>
              <VoucherCard>
                <VoucherBadge>혁신바우처</VoucherBadge>
                <VoucherName>최대 5,000만원 지원</VoucherName>
                <VoucherDesc>기업 혁신을 위한 정부지원금</VoucherDesc>
                <VoucherRate>자부담 10%~40%</VoucherRate>
                <VoucherNote>기업 규모에 따라 차등 지원</VoucherNote>
                <VoucherFeatures>
                  <li>✓ 프리미엄 패키지 이용 가능</li>
                  <li>✓ 정부지원금으로 비용 절감</li>
                  <li>✓ 전문 컨설팅 무료 제공</li>
                </VoucherFeatures>
              </VoucherCard>

              <VoucherCard>
                <VoucherBadge>데이터바우처</VoucherBadge>
                <VoucherName>최대 2,000만원 지원</VoucherName>
                <VoucherDesc>데이터 활용 지원금</VoucherDesc>
                <VoucherRate>자부담 20%</VoucherRate>
                <VoucherNote>중소기업 대상 지원</VoucherNote>
                <VoucherFeatures>
                  <li>✓ 데이터 기반 AI 구축</li>
                  <li>✓ 맞춤형 데이터 가공</li>
                  <li>✓ AI 모델 개발 지원</li>
                </VoucherFeatures>
              </VoucherCard>
            </VoucherGrid>


          </VoucherSection>
        );
      case 'process':
        if (activeMainTab === 'development') {
          const developmentSteps = [
            {
              step: "STEP 1",
              title: "맞춤형 개발팀 제안",
              description: "매칭 담당자와 미팅을 통해 프로젝트에 적합한 맞춤형 개발팀 제안",
              icon: "💡"
            },
            {
              step: "STEP 2",
              title: "개발팀 빌딩",
              description: "프로젝트 투입 전 작업자 개별 프로젝트 적합 평가",
              icon: "👥"
            },
            {
              step: "STEP 3",
              title: "프로젝트 수행",
              description: "기획, 디자인, 개발, QC/QA 모두 가능",
              icon: "💻"
            },
            {
              step: "STEP 4",
              title: "프로젝트 보고서 발송",
              description: "프로젝트 진행 상황 검토를 위한 일일/월간 보고서 발송",
              icon: "📊"
            }
          ];

          return (
            <ProcessSection>
              <ProcessTitle>프로세스</ProcessTitle>
              <ProcessList>
                {developmentSteps.map((step, index) => (
                  <ProcessItem key={index}>
                    <StepBadge>{step.step}</StepBadge>
                    <ProcessIcon>{step.icon}</ProcessIcon>
                    <ProcessContent>
                      <ProcessItemTitle>{step.title}</ProcessItemTitle>
                      <ProcessDescription>{step.description}</ProcessDescription>
                    </ProcessContent>
                    {index < developmentSteps.length - 1 && <ArrowIcon>→</ArrowIcon>}
                  </ProcessItem>
                ))}
              </ProcessList>
              <ProcessNote>* 상세 일정 변경 가능</ProcessNote>
            </ProcessSection>
          );
        }
        return (
          <ProcessSection>
            <ProcessTitle>프로세스</ProcessTitle>
            <ProcessList>
              {processSteps.map((step, index) => (
                <ProcessItem key={index}>
                  <StepBadge>{step.step}</StepBadge>
                  <ProcessIcon>{step.icon}</ProcessIcon>
                  <ProcessContent>
                    <ProcessItemTitle>{step.title}</ProcessItemTitle>
                    <ProcessDescription>{step.description}</ProcessDescription>
                  </ProcessContent>
                  {index < processSteps.length - 1 && <ArrowIcon>→</ArrowIcon>}
                </ProcessItem>
              ))}
            </ProcessList>
          </ProcessSection>
        );
      case 'statusCheck':
        return (
          <StatusSection>
            <ProcessTitle>작업상황 확인</ProcessTitle>
            <StatusGrid>
              <StatusCard>
                <StatusTitle>월간 정기 브리핑</StatusTitle>
                <StatusContent>
                  <GradeBox>
                    <GradeText>A+ <GradeScore>(4.5)</GradeScore></GradeText>
                  </GradeBox>
                  <StatusList>
                    <StatusItem>• Grading : 5점 만점</StatusItem>
                    <StatusItem>• 일정관리 : WBS</StatusItem>
                    <StatusItem>• 예상 진행률</StatusItem>
                    <StatusItem>• 실제 진행률</StatusItem>
                  </StatusList>
                  <QualityControl>
                    <QualityTitle>품질 관리</QualityTitle>
                    <QualityText>• AI 보고서를 통해 사람+AI 이중 이슈 트래킹</QualityText>
                  </QualityControl>
                </StatusContent>
              </StatusCard>

              <StatusCard>
                <StatusTitle>준비된 커뮤니케이션 시트</StatusTitle>
                <StatusContent>
                  <ProcessSteps>
                    <ProcessStep>PLANNING</ProcessStep>
                    <ProcessStep>DESIGN</ProcessStep>
                    <ProcessStep>DEVELOP</ProcessStep>
                  </ProcessSteps>
                  <BenefitList>
                    <BenefitItem>• 데일리로 업데이트 되는 프로젝트 관리 시각화 시트</BenefitItem>
                    <BenefitItem>• 프로젝트 히스토리 관리가 편해요</BenefitItem>
                    <BenefitItem>• 이슈 사항이 모두 기재돼요</BenefitItem>
                    <BenefitItem>• 기획/개발 변경사항을 쉽게 확인해요</BenefitItem>
                    <BenefitItem>• 별도의 소통 채널을 통하지 않아도 프로젝트 진행 현황을 쉽게 확인해요</BenefitItem>
                  </BenefitList>
                </StatusContent>
              </StatusCard>
            </StatusGrid>
          </StatusSection>
        );
      case 'qna':
        if (activeMainTab === 'development') {
          return (
            <QuestionBox>
              <ProcessTitle>자주 묻는 질문</ProcessTitle>
              <FAQList>
                <FAQItem>
                  <FAQTitle>Q1. 정산 방식 때문에 금액이 무제한으로 늘어나는 건 아닌가요?</FAQTitle>
                  <FAQAnswer>
                    개발팀 구독 방식의 경우 주당 최소 시간, 최대 투입 시간을 설정하게 됩니다. 예상 상한선 안에서 탄력적으로 작업자 운영이 가능하니다. 설정해 둔 예산 범위 안에서 운영이 가능합니다.
                  </FAQAnswer>
                </FAQItem>

                <FAQItem>
                  <FAQTitle>Q2. 작업자 시간 트래킹은 어떻게 되나요? 정확한가요?</FAQTitle>
                  <FAQAnswer>
                    각 task가 적정한 공수별로 작업이 진행될 수 있도록 담당 프로젝트 매니저가 1차, 리스크 매니저가 2차로 작업 시간을 더블 체크합니다. 해당 작업에 적정한 공수가 쓰였는지 체크한 내용에 대해 정산이 되는 시스템입니다.
                  </FAQAnswer>
                </FAQItem>

                <FAQItem>
                  <FAQTitle>Q3. 작업자 관리는 어떻게 하나요?</FAQTitle>
                  <FAQAnswer>
                    매월 고과 평가를 통해 작업자의 퍼포먼스를 체크하고, 리스크 매니저가 매일 작업 상황을 모니터링합니다. 또한 AI 자동 트래킹 시스템으로 이슈를 사전에 감지하여 관리합니다.
                  </FAQAnswer>
                </FAQItem>

                <FAQItem>
                  <FAQTitle>Q4. 작업자 교체도 가능한가요?</FAQTitle>
                  <FAQAnswer>
                    네, 가능합니다. 매월 고과 평가 결과를 바탕으로 성과가 좋지 않은 작업자는 교체가 가능하며, 프로젝트의 니즈에 따라 필요한 스킬셋을 가진 작업자로 교체도 가능합니다.
                  </FAQAnswer>
                </FAQItem>
              </FAQList>
              <ActionButtonGroup>
                <TopActionButtons>
                  <ActionButton onClick={handleSubscriptionClick}>
                    <ButtonIcon>👥</ButtonIcon>
                    개발팀 구독
                  </ActionButton>
                  <PrimaryActionButton onClick={handleInquiryClick}>
                    <ButtonIcon>💻</ButtonIcon>
                    개발 의뢰
                  </PrimaryActionButton>
                </TopActionButtons>
              </ActionButtonGroup>
            </QuestionBox>
          );
        }
        return (
          <QuestionBox>
            <ProcessTitle>자주 묻는 질문</ProcessTitle>
            <FAQList>
              <FAQItem>
                <FAQTitle>Q1. 그로우썸에서 개발하면 좋은 점이 뭔가요?</FAQTitle>
                <FAQAnswer>
                  그로우썸에서는 내 프로젝트에 포함되는 기능을 구현해 본 작업자가 매칭됩니다.
                  자체적으로 개발 품질을 준수할 수 있도록 2주 단위로 QA, QC를 관장하여 최종 납품시 메이저 이슈 1% 미만, 마이너 이슈 5% 미만의 기준을 통과시켜 퀄리티를 보장하고 있습니다.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQTitle>Q2. 개발사에서 코로나 상황을 제대로 못 받는 경우도 있다던데요?</FAQTitle>
                <FAQAnswer>
                  그로우썸에서는 계약 원금시 소스코드 및 원본파일을 제공합니다.
                  다른 중개플랫폼과 달리 그로우썸이 책임지고 계약을 하는 시스템이기 때문에
                  보장 받을 수 없는 경우는 없습니다.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQTitle>Q3. 그로우썸에서 개발 후에 유지보수는 어떻게 되나요?</FAQTitle>
                <FAQAnswer>
                  그로우썸에서는 용이한 유지보수를 위하여 체계적인 코드 템플릿과 가이드가 제공됩니다.
                  또한 개발 완료 후에도 지속적인 유지보수 서비스를 제공하여 안정적인 서비스 운영을 보장합니다.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQTitle>Q4. 개발 기간과 비용은 어떻게 되나요?</FAQTitle>
                <FAQAnswer>
                  프로젝트의 규모와 복잡도에 따라 다르지만, 일반적으로 3-6개월 정도 소요됩니다.
                  비용은 정부지원사업을 활용하면 최대 90%까지 지원받을 수 있어 부담을 크게 줄일 수 있습니다.
                </FAQAnswer>
              </FAQItem>

              <FAQItem>
                <FAQTitle>Q5. 정부지원사업이나 바우처는 어떻게 받을 수 있나요?</FAQTitle>
                <FAQAnswer>
                  그로우썸은 공식 바우처 공급기업으로서, 다년간의 정부지원사업 수행 경험을 보유하고 있습니다. 
                  사업계획서 작성부터 선정까지 전 과정을 AI 기반 시스템으로 지원해드립니다.<br/><br/>
                  • 정부지원사업 선정률 90% 이상 달성<br/>
                  • AI 기반 맞춤형 사업계획서 작성 가이드 제공<br/>
                  • 최대 5천만원 지원금 획득 지원<br/>
                  • 바우처 사업 전담 매니저 배정<br/><br/>
                  특히 AI 학습 시스템을 통해 복잡한 사업계획서 작성을 쉽고 체계적으로 도와드리며, 
                  선정 가능성을 극대화할 수 있는 실전 노하우를 전수해드립니다.
                </FAQAnswer>
              </FAQItem>
            </FAQList>
            <ActionButtonGroup>
              <TopActionButtons>
                <ActionButton onClick={handleSubscriptionClick}>
                  <ButtonIcon>👥</ButtonIcon>
                  개발팀 구독
                </ActionButton>
                <PrimaryActionButton onClick={handleInquiryClick}>
                  <ButtonIcon>💻</ButtonIcon>
                  개발 의뢰
                </PrimaryActionButton>
              </TopActionButtons>
            </ActionButtonGroup>
          </QuestionBox>
        );
      case 'payment':
        return (
          <PaymentSection>
            <ProcessTitle>정산 방식</ProcessTitle>
            <PaymentHeader>
              매월 1일 ~ 말일 작업한 범위에 대해서 후불 정산 시스템
            </PaymentHeader>
            <PaymentGrid>
              <PaymentCard>
                <PaymentTitle>장점1</PaymentTitle>
                <PaymentContent>
                  <PaymentLabel>순수 작업시간만큼만 정산</PaymentLabel>
                  <PaymentDescription>
                    유휴시간 없이 오로지 작업자가 작업한 만큼만 정산돼요.
                  </PaymentDescription>
                  <PaymentFormula>
                    <FormulaItem>20시간 작업</FormulaItem>
                    <FormulaOperator>×</FormulaOperator>
                    <FormulaItem>시급</FormulaItem>
                    <FormulaEquals>=</FormulaEquals>
                    <FormulaResult>NNN,NNN원</FormulaResult>
                  </PaymentFormula>
                </PaymentContent>
              </PaymentCard>

              <PaymentCard>
                <PaymentTitle>장점2</PaymentTitle>
                <PaymentContent>
                  <PaymentLabel>일일보고서로 작업 범위 모니터링</PaymentLabel>
                  <PaymentDescription>
                    작업자가 하루에 얼마나 작업했는지,<br />
                    얼마를 소진했는지 매일 보고서를 보내드려요.
                  </PaymentDescription>
                  <PaymentImage src="/images/report-example.png" alt="일일 보고서 예시" />
                </PaymentContent>
              </PaymentCard>

              <PaymentCard>
                <PaymentTitle>장점3</PaymentTitle>
                <PaymentContent>
                  <PaymentLabel>맞춤 결제 방식 제공</PaymentLabel>
                  <PaymentDescription>
                    일정 금액을 넣고 사용하는 만큼만 소진하는 충전제,<br />
                    작업자 사용 내역만큼 지불하는 후불제가 제공돼요.
                  </PaymentDescription>
                  <PaymentIcon>💳</PaymentIcon>
                </PaymentContent>
              </PaymentCard>
            </PaymentGrid>
          </PaymentSection>
        );
      case 'workerManagement':
        return (
          <WorkerManagementSection>
            <ProcessTitle>작업자 관리</ProcessTitle>
            <ManagementGrid>
              <ManagementCard>
                <ManagementLabel>작업자에 대한</ManagementLabel>
                <ManagementTitle>매월 고과 평가 실시</ManagementTitle>
                <ManagementDescription>
                  정량적인 평가 기준으로 작업자 수행 능력 및 피드백
                </ManagementDescription>
                <GradeChart>
                  <ChartImage src="/images/grade-chart.png" alt="고과 평가 차트" />
                  <GradeScore>A+</GradeScore>
                </GradeChart>
              </ManagementCard>

              <ManagementCard>
                <ManagementLabel>프로젝트 담당해줄</ManagementLabel>
                <ManagementTitle>리스크 매니저</ManagementTitle>
                <ManagementDescription>
                  프로젝트에 이슈가 발생하지 않도록 매일 체크하는 담당 매니저 배정
                </ManagementDescription>
                <RiskGraph>
                  <GraphImage src="/images/risk-graph.png" alt="리스크 관리 그래프" />
                </RiskGraph>
              </ManagementCard>

              <ManagementCard>
                <ManagementLabel>정확도를 높여주는</ManagementLabel>
                <ManagementTitle>AI 자동 트래킹</ManagementTitle>
                <ManagementDescription>
                  담당 리스크 매니저 + AI 더블 체킹으로 정확한 이슈 트래킹 시스템
                </ManagementDescription>
                <AITrackingImage>
                  <TrackingImage src="/images/ai-tracking.png" alt="AI 트래킹 시스템" />
                </AITrackingImage>
              </ManagementCard>
            </ManagementGrid>
          </WorkerManagementSection>
        );
      default:
        return (
          <QuestionBox>
            <Question>{tab?.label}</Question>
            <AnswerList>
              <AnswerItem>
                <CheckIcon>✓</CheckIcon>
                {tab?.id} 내용입니다.
              </AnswerItem>
            </AnswerList>
          </QuestionBox>
        );
    }
  };

  return (
    <ServicesSection id="services">
      <MainTabContainer>
        {Object.keys(mainTabs).map((key) => (
          <MainTab
            key={key}
            isActive={activeMainTab === key}
            onClick={() => handleMainTabClick(key as MainTabKey)}
          >
            {mainTabs[key as MainTabKey].title}
          </MainTab>
        ))}
      </MainTabContainer>
      <ContentWrapper>
        <ContentContainer>
          <SubTabContainer>
            {mainTabs[activeMainTab as MainTabKey].subTabs.map((tab) => (
              <SubTab
                key={tab.id}
                isActive={activeSubTab === tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                  scrollToSection(tab.id);
                }}
              >
                {tab.label}
              </SubTab>
            ))}
          </SubTabContainer>
          <Content>
            {mainTabs[activeMainTab as MainTabKey].subTabs.map((tab, index) => (
              <ContentSection
                key={tab.id}
                ref={(el: HTMLDivElement | null): void => { contentRefs.current[index] = el }}
                data-tab-id={tab.id}
                scroll-margin-top="200px"
              >
                {renderContent(tab.id)}
              </ContentSection>
            ))}
          </Content>
        </ContentContainer>
      </ContentWrapper>
      
    </ServicesSection>
  );
};

const ServicesSection = styled.section`
  padding-top: 0;
  padding-bottom: 120px;
  background: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainTabContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 1000px;
  margin: 0 auto;
  position: sticky;
  top: 80px;
  background: #f8f9fa;
  z-index: 98;
  border-bottom: 1px solid #eee;
  padding: 0;

  @media (max-width: 1000px) {
    width: 100%;
    padding: 0;
  }
`;

const MainTab = styled.button<{ isActive: boolean }>`
  flex: 1;
  background: none;
  color: ${props => props.isActive ? '#514FE4' : '#666'};
  border: none;
  padding: 1.5rem 0;
  font-size: 2rem;
  font-weight: ${props => props.isActive ? '700' : '500'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  text-align: center;
  max-width: 50%;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    padding: 1rem 0;
  }

  &:hover {
    color: #514FE4;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.isActive ? '#514FE4' : 'transparent'};
    transition: background-color 0.3s ease;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  margin-top: 0;
`;

const ContentContainer = styled.div`
  width: 1000px;
  margin: 0 auto;
  display: flex;
  padding: 0;
  position: relative;
  gap: 2rem;

  @media (max-width: 1000px) {
    flex-direction: column;
    width: 100%;
    padding: 0;
    gap: 0;
  }
`;

const SubTabContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-right: 2rem;
  width: 100px;
  position: sticky;
  top: 250px;
  height: fit-content;
  z-index: 97;

  @media (max-width: 768px) {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    gap: 0;
    margin: 0;
    padding: 1rem;
    position: sticky;
    top: 124px;
    background: #f8f9fa;
    box-shadow: 0 1px 0 rgba(0,0,0,0.1);
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const SubTab = styled.button<{ isActive: boolean }>`
  background: none;
  color: ${props => props.isActive ? '#514FE4' : '#666'};
  border: none;
  font-size: 1rem;
  font-weight: ${props => props.isActive ? '700' : '500'};
  cursor: pointer;
  transition: color 0.3s ease;
  text-align: left;
  white-space: nowrap;
  width: 100%;

  @media (max-width: 768px) {
    text-align: center;
    padding: 0.5rem;
    width: 20%;
    font-size: 0.9rem;
    background: none;
    color: ${props => props.isActive ? '#514FE4' : '#666'};

    &:hover {
      background: none;
      color: #514FE4;
    }
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 0;
  overflow-y: auto;
  scroll-behavior: smooth;

  @media (max-width: 768px) {
    margin-top: 0;
    padding: 0 2rem;
  }
`;

const ContentSection = styled.div`
  padding: 4rem 0;
  display: flex;
  align-items: center;
  scroll-margin-top: 200px;
`;

const QuestionBox = styled.div`
  padding: 0;
  text-align: left;
  max-width: 1000px;
  margin: 0 auto;
`;

const Question = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const AnswerList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AnswerItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #666;
`;

const CheckIcon = styled.span`
  color: #514FE4;
  margin-right: 1rem;
  font-weight: bold;
`;

const VoucherSection = styled.div`
  margin-top: 2rem;
`;

const VoucherTag = styled.span`
  background: #514FE4;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const VoucherTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 1.5rem 0 1rem;
  color: #333;
`;

const VoucherSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 3rem;
`;

const VoucherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const VoucherCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const VoucherBadge = styled.span`
  background: #EEEFFE;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const VoucherName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
`;

const VoucherDesc = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const VoucherRate = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #514FE4;
  margin-bottom: 0.5rem;
`;

const VoucherNote = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const VoucherFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  flex: 1;

  li {
    margin-bottom: 0.8rem;
    color: #333;
  }
`;

const TargetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TargetItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const IconWrapper = styled.div`
  color: #03FF01;
  font-size: 1.2rem;
  margin-top: 0.2rem;
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ItemDescription = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
`;

const ProcessSection = styled.div`
  width: 100%;
`;

const ProcessTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4rem;
  color: #333;
`;

const ProcessList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const ProcessItem = styled.div`
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
`;

const StepBadge = styled.span`
  background: #514FE4;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ProcessIcon = styled.div`
  font-size: 1.5rem;
  color: #514FE4;
`;

const ProcessContent = styled.div`
  flex: 1;
`;

const ProcessItemTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const ProcessDescription = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  word-break: keep-all;
`;

const ArrowIcon = styled.div`
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  color: #514FE4;
`;

const StatusSection = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatusCard = styled.div`
  background: #514FE4;
  border-radius: 20px;
  padding: 2rem;
  color: white;
`;

const StatusTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const StatusContent = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
`;

const GradeBox = styled.div`
  margin-bottom: 2rem;
`;

const GradeText = styled.span`
  font-size: 2rem;
  font-weight: 700;
`;

const GradeScore = styled.span`
  font-size: 1.2rem;
  opacity: 0.8;
`;

const StatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2rem;
`;

const StatusItem = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const QualityControl = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1.5rem;
`;

const QualityTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const QualityText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const ProcessSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ProcessStep = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  font-size: 1.1rem;
`;

const BenefitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const BenefitItem = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.4;
`;

const ServiceTargetSection = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const ServiceTargetTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
  word-break: keep-all;
`;

const EstimateSection = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const EstimateTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #333;
  word-break: keep-all;
`;

const EstimateContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ChatBubble = styled.div`
  background: #514FE4;
  color: white;
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
`;

const EstimateList = styled.div`
  display: grid;
  gap: 1rem;
`;

const EstimateItem = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FAQItem = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const FAQTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 700;
  color: #514FE4;
  margin-bottom: 1rem;
`;

const FAQAnswer = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
  word-break: keep-all;

  br {
    content: '';
    display: block;
    margin: 0.5rem 0;
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 4rem;
`;

const TopActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    border-color: #514FE4;
    color: #514FE4;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1rem;
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.2rem;
`;

const PrimaryActionButton = styled(ActionButton)`
  background: #514FE4;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(81, 79, 228, 0.3);

  &:hover {
    background: #4340c0;
    color: white;
    border: none;
    box-shadow: 0 6px 16px rgba(81, 79, 228, 0.4);
  }
`;

const ProcessNote = styled.p`
  text-align: right;
  color: #666;
  font-size: 0.9rem;
  margin-top: 2rem;
  font-style: italic;
`;

const PaymentSection = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const PaymentHeader = styled.div`
  background: linear-gradient(135deg, #00C9FF 0%, #00B4E6 100%);
  color: white;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 3rem;
  box-shadow: 0 4px 15px rgba(0, 185, 230, 0.2);
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const PaymentCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const PaymentTitle = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  font-weight: 600;
  color: #514FE4;
`;

const PaymentContent = styled.div`
  padding: 2rem;
`;

const PaymentLabel = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const PaymentDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const PaymentFormula = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 1.5rem;
`;

const FormulaItem = styled.span`
  font-weight: 500;
`;

const FormulaOperator = styled.span`
  color: #666;
`;

const FormulaEquals = styled.span`
  color: #666;
`;

const FormulaResult = styled.span`
  font-weight: 700;
  color: #514FE4;
`;

const PaymentImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-top: 1rem;
`;

const PaymentIcon = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-top: 1rem;
`;

const WorkerManagementSection = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const ManagementGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const ManagementCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
  }
`;

const ManagementLabel = styled.span`
  color: #514FE4;
  font-size: 1rem;
  font-weight: 500;
  display: block;
  margin-bottom: 0.5rem;
`;

const ManagementTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
`;

const ManagementDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const GradeChart = styled.div`
  position: relative;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartImage = styled.img`
  width: 60%;
  height: auto;
`;

const RiskGraph = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
`;

const GraphImage = styled.img`
  width: 100%;
  height: auto;
`;

const AITrackingImage = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
`;

const TrackingImage = styled.img`
  width: 100%;
  height: auto;
`;

export default Services;