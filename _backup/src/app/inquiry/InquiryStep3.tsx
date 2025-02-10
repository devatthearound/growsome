import React from 'react';
import styled from 'styled-components';

interface InquiryStep3Props {
  selectedBusinessModel: string;
  handleBusinessModelSelect: (model: string) => void;
  selectedFeatures: string[];
  handleFeatureToggle: (feature: string) => void;
  allFeatures: string[];
  requiredFeatures: string[];
}

const InquiryStep3 = ({
  selectedBusinessModel,
  handleBusinessModelSelect,
  selectedFeatures,
  handleFeatureToggle,
  allFeatures,
  requiredFeatures
}: InquiryStep3Props) => (
  <StepContent>
    <h2>1. 비즈니스 모델을 선택해주세요</h2>
    <Step3ModelRow>
      {[
        '소셜 네트워크(SNS)', 
        '커뮤니티 플랫폼', 
        '중개/매칭', 
        '구독 모델 플랫폼', 
        '마켓 플레이스', 
        '이커머스', 
        '예약/신청', 
        'IOT 플랫폼',
        '기타'
      ].map((model) => (
        <SquareOptionCard
          key={model}
          selected={selectedBusinessModel === model}
          onClick={() => handleBusinessModelSelect(model)}
        >
          <TextContent>
            <h4>{model}</h4>
          </TextContent>
        </SquareOptionCard>
      ))}
    </Step3ModelRow>
    <h2>1-1. 모델에서 꼭 필요한 기능만 선택해주세요</h2>
    <Step3FeatureRow>
      {allFeatures.map((feature) => (
        <SquareOptionCard
          key={feature}
          selected={selectedFeatures.includes(feature)}
          onClick={() => handleFeatureToggle(feature)}
        >
          <Step3TextContent>
            <h4>{feature}</h4>
            {requiredFeatures.includes(feature) && <Chip>필수</Chip>}
          </Step3TextContent>
        </SquareOptionCard>
      ))}
    </Step3FeatureRow>
  </StepContent>
);

export default InquiryStep3;

// Styled components
const StepContent = styled.div`
  text-align: left;
  margin-bottom: 150px;
`;

const Step3ModelRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 6rem;
`;

const SquareOptionCard = styled.div<{ selected: boolean }>`
  background: ${(props) => (props.selected ? '#EEEFFE' : 'white')};
  border: 1px solid ${(props) => (props.selected ? '#514FE3' : '#ddd')};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  flex-grow: 1;
  height: 100%;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;

  &:hover {
    background: #EEEFFE;
  }
`;

const TextContent = styled.div`
  text-align: left;

  h4 {
    margin: 0;
    color: #333;
  }
`;

const Step3FeatureRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const Step3TextContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;

  h4 {
    margin: 0;
    color: #333;
    flex-grow: 1;
  }
`;

const Chip = styled.span`
  background-color: #514FE4;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  display: inline-block;
`; 