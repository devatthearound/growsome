import React from 'react';
import styled from 'styled-components';

const InquiryFinal = ({
  projectDescription,
  selectedPreparation,
  selectedMethod,
  selectedBudget,
  selectedBusinessModel,
  selectedFeatures
}) => {
  // 준비 단계 텍스트 매핑
  const preparationText = {
    'idea': '아이디어 단계',
    'prototype': '프로토타입 단계',
    'ready': '와이어프레임/스토리보드 준비'
  };

  // 개발 방법 텍스트 매핑
  const methodText = {
    'build': '구축',
    'maintenance': '유지보수'
  };

  // 예산 텍스트 매핑
  const budgetText = {
    'low': '1,000만원 이하',
    'medium': '1,000 - 3,000만원',
    'high': '3,000 - 5,000만원',
    'veryHigh': '5,000 - 9,000만원',
    'soveryHigh': '9,000만원 이상'
  };

  return (
    <FinalContent>
      <SuccessBadge>🎉 개발팀 구성 완료</SuccessBadge>
      <h2>맞춤형 개발팀이 구성되었습니다!</h2>
      <Subtitle>
        <Highlight>48시간</Highlight> 이내 상담 신청 시,
        <br />프로젝트 기획 컨설팅을 무료로 제공해드립니다.
      </Subtitle>
      
      <SummarySection>
        <h3>프로젝트 요약</h3>
        <SummaryList>
          <SummaryItem>
            <Label>프로젝트 설명</Label>
            <Value>{projectDescription}</Value>
          </SummaryItem>
          <SummaryItem>
            <Label>준비 단계</Label>
            <Value>{preparationText[selectedPreparation] || selectedPreparation}</Value>
          </SummaryItem>
          <SummaryItem>
            <Label>개발 방법</Label>
            <Value>{methodText[selectedMethod] || selectedMethod}</Value>
          </SummaryItem>
          <SummaryItem>
            <Label>예산</Label>
            <Value>{budgetText[selectedBudget] || selectedBudget}</Value>
          </SummaryItem>
          <SummaryItem>
            <Label>비즈니스 모델</Label>
            <Value>{selectedBusinessModel}</Value>
          </SummaryItem>
          <SummaryItem>
            <Label>선택한 기능</Label>
            <Value>{selectedFeatures.join(', ')}</Value>
          </SummaryItem>
        </SummaryList>
      </SummarySection>

      <CommunitySection>
        <h3>함께 성장하는 개발 문화</h3>
        <p>
          매일 아침 6시, 모닝 스터디로 꾸준한 성장을 이어가고 있습니다.
          현직 개발자&사업가가 모인 디스코드 커뮤니티에서 실시간으로 기술 지원과 피드백을 주고받으며 더 나은 결과물을 만들어갑니다.
        </p>
        <SuccessMetrics>
          <MetricItem>
            <MetricValue>97%</MetricValue>
            <MetricLabel>프로젝트 완주율</MetricLabel>
          </MetricItem>
          <MetricItem>
            <MetricValue>89%</MetricValue>
            <MetricLabel>고객 만족도</MetricLabel>
          </MetricItem>
          <MetricItem>
            <MetricValue>3주</MetricValue>
            <MetricLabel>평균 첫 배포 기간</MetricLabel>
          </MetricItem>
        </SuccessMetrics>
      </CommunitySection>

      <BenefitsSection>
        <h3>개발팀 상담 시 추가 혜택</h3>
        <BenefitsList>
          <BenefitItem>
            <CheckIcon>✓</CheckIcon>
            <BenefitContent>
              <BenefitTitle>무료 기획 컨설팅</BenefitTitle>
              <BenefitDesc>프로젝트 성공률을 높이는 기획 전략 제공</BenefitDesc>
            </BenefitContent>
          </BenefitItem>
          <BenefitItem>
            <CheckIcon>✓</CheckIcon>
            <BenefitContent>
              <BenefitTitle>개발자 커뮤니티 초대</BenefitTitle>
              <BenefitDesc>1,000명 이상의 현직자들과 네트워킹</BenefitDesc>
            </BenefitContent>
          </BenefitItem>
          <BenefitItem>
            <CheckIcon>✓</CheckIcon>
            <BenefitContent>
              <BenefitTitle>전담 매니저 배정</BenefitTitle>
              <BenefitDesc>프로젝트 전체 과정 밀착 관리</BenefitDesc>
            </BenefitContent>
          </BenefitItem>
        </BenefitsList>
      </BenefitsSection>

      <EstimateSection>
        <h3>예상 개발 일정</h3>
        <TimelineGrid>
          <TimelineItem>
            <h4>기획 단계</h4>
            <p>2주</p>
            <small>요구사항 분석 및 상세 기획</small>
          </TimelineItem>
          <TimelineItem>
            <h4>개발 단계</h4>
            <p>8주</p>
            <small>실제 개발 및 테스트</small>
          </TimelineItem>
          <TimelineItem>
            <h4>런칭 준비</h4>
            <p>2주</p>
            <small>최종 테스트 및 배포</small>
          </TimelineItem>
        </TimelineGrid>
      </EstimateSection>

      <TimerSection>
        <TimerText>무료 기획 컨설팅 혜택 종료까지</TimerText>
        <CountdownTimer>47:59:59</CountdownTimer>
      </TimerSection>
    </FinalContent>
  );
};

export default InquiryFinal;

// Styled components
const FinalContent = styled.div`
  text-align: center;
  margin-bottom: 150px;
`;

const SummarySection = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: left;

  h3 {
    margin-bottom: 1rem;
    color: #333;
  }
`;

const SummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.5rem 0;
`;

const Label = styled.span`
  flex: 0 0 120px;
  font-weight: 500;
  color: #514FE4;
`;

const Value = styled.span`
  flex: 1;
  color: #666;
`;

const CommunitySection = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #EEEFFE;
  border-radius: 8px;
  text-align: left;

  h3 {
    color: #514FE4;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

const EstimateSection = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 8px;
  text-align: left;

  h3 {
    color: #333;
    margin-bottom: 1.5rem;
  }
`;

const TimelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;
`;

const TimelineItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 8px;

  h4 {
    color: #514FE4;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin: 0.5rem 0;
  }

  small {
    color: #666;
    display: block;
  }
`;

const SuccessBadge = styled.div`
  background: #514FE4;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 1rem 0 2rem;
  line-height: 1.6;
`;

const Highlight = styled.span`
  color: #514FE4;
  font-weight: bold;
`;

const SuccessMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
`;

const MetricItem = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #514FE4;
`;

const MetricLabel = styled.div`
  color: #666;
  margin-top: 0.5rem;
`;

const BenefitsSection = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
  text-align: left;

  h3 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 0.5rem 1rem;

  &:hover {
    background: #f9f9f9;
    border-radius: 8px;
  }
`;

const CheckIcon = styled.span`
  color: #514FE4;
  font-size: 1.2rem;
  font-weight: bold;
  flex: 0 0 24px;
  text-align: center;
`;

const BenefitContent = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.h4`
  margin: 0;
  color: #333;
  font-size: 1.1rem;
`;

const BenefitDesc = styled.p`
  margin: 0.2rem 0 0;
  color: #666;
  font-size: 0.95rem;
`;

const TimerSection = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const TimerText = styled.div`
  color: #666;
  margin-bottom: 0.5rem;
`;

const CountdownTimer = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #514FE4;
`; 