import React from 'react';
import styled from 'styled-components';

const InquiryStep1 = ({ selectedMethod, setSelectedMethod }) => (
  <StepContent>
    <h2>어떤 개발팀을 찾으시나요?</h2>
    <OptionsRow>
      <SquareOptionCard
        selected={selectedMethod === 'build'}
        onClick={() => setSelectedMethod('build')}
      >
        <TextContent>
          <h3><Highlight>구축</Highlight>부터 필요해요</h3>
          <p>아직 제작되어 있는 서비스가 없어서 팀이 필요해요.</p>
        </TextContent>
        <LargeEmoji>💡</LargeEmoji>
      </SquareOptionCard>
      <SquareOptionCard
        selected={selectedMethod === 'maintenance'}
        onClick={() => setSelectedMethod('maintenance')}
      >
        <TextContent>
          <h3><Highlight>유지보수</Highlight>가 필요해요</h3>
          <p>이미 제작되어 있는 프로젝트를 개선해줄 팀이 필요해요.</p>
        </TextContent>
        <LargeEmoji>🔧</LargeEmoji>
      </SquareOptionCard>
    </OptionsRow>
  </StepContent>
);

export default InquiryStep1;

// Styled components
const StepContent = styled.div`
  text-align: left;
  margin-bottom: 150px;
`;

const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 1rem;
`;

const SquareOptionCard = styled.div`
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

  h3 {
    margin: 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

const Highlight = styled.span`
  color: #514FE4;
`;

const LargeEmoji = styled.div`
  font-size: 3rem;
  align-self: flex-end;
  margin-top: auto;
  text-align: right;
`; 