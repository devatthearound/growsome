import styled from 'styled-components';

const ChoiceSection = () => {
  return (
    <SectionContainer>
      <CardGrid>
        <Card>
          <CardTitle>🚀 AI 실행 패키지</CardTitle>
          <CardSubtitle>2주 만에 완성되는 실전 프로그램</CardSubtitle>
          
          <StepsList>
            <Step>
              <StepNumber>1️⃣</StepNumber>
              <StepText>Discovery Call – 프로젝트 목표와 방향을 설정합니다.</StepText>
            </Step>
            <Step>
              <StepNumber>2️⃣</StepNumber>
              <StepText>기획 및 분석 – AI 활용 전략과 시장 조사를 진행합니다.</StepText>
            </Step>
            <Step>
              <StepNumber>3️⃣</StepNumber>
              <StepText>AI 실행 – 사업계획서, MVP, 마케팅 자동화를 완성합니다.</StepText>
            </Step>
            <Step>
              <StepNumber>4️⃣</StepNumber>
              <StepText>전문가 피드백 – 실제 투자 기준에 맞춰 검토 후 최종 완료.</StepText>
            </Step>
          </StepsList>

          <CardFooter>
            2주 후, AI가 당신의 비즈니스를 실행합니다.
          </CardFooter>
        </Card>

        <Card>
          <CardTitle>함께 미래를 만들어가세요</CardTitle>
          
          <BenefitsList>
            <Benefit>
              🚀 누구보다 빠르게 아이디어를 실현하세요.
            </Benefit>
            <Benefit>
              🌱 기여하는 시스템을 통해 새로운 아이디어를 함께 만들어갑니다.
            </Benefit>
          </BenefitsList>

          <UrgencyMessage>
            <WarningIcon>📢</WarningIcon>
            <WarningText>
              고민하는 순간, 기회를 놓칩니다.
              <br />
              AI는 모든 걸 바꾸고 있습니다. 당신이 준비되지 않았다면, 누군가 먼저 움직일 것입니다.
            </WarningText>
          </UrgencyMessage>
        </Card>
      </CardGrid>
    </SectionContainer>
  );
};

const SectionContainer = styled.section`
  padding: 80px 20px;
  background: white;
`;

const CardGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const Card = styled.div`
  background: #f8f9fa;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  color: #514FE4;
  margin-bottom: 15px;
`;

const CardSubtitle = styled.h4`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 30px;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const StepNumber = styled.span`
  flex-shrink: 0;
`;

const StepText = styled.p`
  font-size: 1rem;
  color: #444;
`;

const CardFooter = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #514FE4;
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

const Benefit = styled.p`
  font-size: 1.1rem;
  color: #444;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const UrgencyMessage = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-top: 30px;
`;

const WarningIcon = styled.span`
  font-size: 1.5rem;
  display: block;
  text-align: center;
  margin-bottom: 10px;
`;

const WarningText = styled.p`
  font-size: 1rem;
  color: #333;
  text-align: center;
  line-height: 1.6;
`;

export default ChoiceSection; 