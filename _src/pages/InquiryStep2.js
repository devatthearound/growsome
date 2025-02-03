import React from 'react';
import styled from 'styled-components';

const InquiryStep2 = ({
  projectDescription,
  handleDescriptionChange,
  isDescriptionComplete,
  selectedPreparation,
  setSelectedPreparation,
  selectedMethod,
  setSelectedMethod,
  selectedBudget,
  setSelectedBudget,
  references,
  handleReferenceChange,
  handleAddReference
}) => (
  <StepContent>
    <h2>1. 프로젝트를 한 줄로 설명해주세요</h2>
    <InputWrapper>
      <Input
        type="text"
        value={projectDescription}
        onChange={handleDescriptionChange}
        placeholder="예시) MZ 타겟을 위한 아티스트 거래 플랫폼 개발"
      />
    </InputWrapper>
    {isDescriptionComplete && (
      <AdditionalFields>
        <Section>
          <h3>2. 현재 프로젝트는 어느 정도 준비되어 있나요?</h3>
          <Step2SelectRow>
            <SquareOptionCard
              selected={selectedPreparation === 'idea'}
              onClick={() => setSelectedPreparation('idea')}
            >
              <TextContent>
                <h4>아이디어 단계</h4>
                <p>아직 구체적인 계획은 없지만, 아이디어는 있습니다.</p>
              </TextContent>
              <SmallEmoji>💡</SmallEmoji>
            </SquareOptionCard>
            <SquareOptionCard
              selected={selectedPreparation === 'prototype'}
              onClick={() => setSelectedPreparation('prototype')}
            >
              <TextContent>
                <h4>프로토타입 단계</h4>
                <p>기본적인 프로토타입이 준비되어 있습니다.</p>
              </TextContent>
              <SmallEmoji>🔧</SmallEmoji>
            </SquareOptionCard>
            <SquareOptionCard
              selected={selectedPreparation === 'ready'}
              onClick={() => setSelectedPreparation('ready')}
            >
              <TextContent>
                <h4>와이어프레임, 스토리보드가 있어요</h4>
                <p>구체적인 계획이 준비되어 있습니다.</p>
              </TextContent>
              <SmallEmoji>📑</SmallEmoji>
            </SquareOptionCard>
          </Step2SelectRow>
        </Section>
        <Section>
          <h3>3. 참고할 수 있는 자료가 있다면 첨부해주세요</h3>
          <p>5MB 이하의 .xlsx, .pdf, .jpg, .png 파일만 업로드 가능합니다.</p>
          <FileButton>
            + 첨부파일
            <input
              type="file"
              accept=".xlsx,.pdf,.jpg,.png"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.size > 5 * 1024 * 1024) {
                  alert('파일 크기는 5MB 이하로 제한됩니다.');
                  e.target.value = null; // Clear the input
                }
              }}
            />
          </FileButton>
        </Section>
        <Section>
          <h3>3-1. 현재 사용하고 있는 서비스의 명칭이나 주소를 알려주세요</h3>
          {references.map((reference, index) => (
            <Input
              key={index}
              type="text"
              value={reference}
              onChange={(e) => handleReferenceChange(index, e.target.value)}
              placeholder="예시) 쿠팡 - https://coupang.com"
            />
          ))}
          <LineButton onClick={handleAddReference}>+ 추가하기</LineButton>
        </Section>
        <Section>
          <h3>4. 어떤 방법으로 개발되기를 원하시나요?</h3>
          <Step2OptionsRow>
            <RadioOptionCard
              selected={selectedMethod === 'web'}
              onClick={() => setSelectedMethod('web')}
            >
              <TextContent>
                <h4>WEB</h4>
              </TextContent>
              <RadioButton
                type="radio"
                name="method"
                checked={selectedMethod === 'web'}
                readOnly
              />
            </RadioOptionCard>
            <RadioOptionCard
              selected={selectedMethod === 'app'}
              onClick={() => setSelectedMethod('app')}
            >
              <TextContent>
                <h4>APP</h4>
              </TextContent>
              <RadioButton
                type="radio"
                name="method"
                checked={selectedMethod === 'app'}
                readOnly
              />
            </RadioOptionCard>
            <RadioOptionCard
              selected={selectedMethod === 'both'}
              onClick={() => setSelectedMethod('both')}
            >
              <TextContent>
                <h4>APP와 WEB 둘 다 원해요</h4>
              </TextContent>
              <RadioButton
                type="radio"
                name="method"
                checked={selectedMethod === 'both'}
                readOnly
              />
            </RadioOptionCard>
            <RadioOptionCard
              selected={selectedMethod === 'other'}
              onClick={() => setSelectedMethod('other')}
            >
              <TextContent>
                <h4>잘 모르겠어요</h4>
              </TextContent>
              <RadioButton
                type="radio"
                name="method"
                checked={selectedMethod === 'other'}
                readOnly
              />
            </RadioOptionCard>
          </Step2OptionsRow>
        </Section>
        <Section>
          <h3>5. 총 예산이 얼마인가요?</h3>
          <Step2BudgetRow>
            <RadioOptionCard
              selected={selectedBudget === 'low'}
              onClick={() => setSelectedBudget('low')}
            >
              <TextContent>
                <h4>1,000만원 미만</h4>
              </TextContent>
              <RadioButton
                type="radio"
                name="budget"
                checked={selectedBudget === 'low'}
                readOnly
              />
            </RadioOptionCard>
            <RadioOptionCard
              selected={selectedBudget === 'medium'}
              onClick={() => setSelectedBudget('medium')}
            >
              <TextContent>
                <h4>1,000 - 3,000만원</h4>
              </TextContent>
              <RadioButton
                type="radio"
                name="budget"
                checked={selectedBudget === 'medium'}
                readOnly
              />
            </RadioOptionCard>
            <RadioOptionCard
              selected={selectedBudget === 'high'}
              onClick={() => setSelectedBudget('high')}
            >
              <TextContent>
                <h4>3,000 - 5,000만원</h4>
              </TextContent>
              <RadioButton
                type="radio"
                name="budget"
                checked={selectedBudget === 'high'}
                readOnly
              />
            </RadioOptionCard>
            <RadioOptionCard
              selected={selectedBudget === 'veryHigh'}
              onClick={() => setSelectedBudget('veryHigh')}
            >
              <TextContent>
                <h4>5,000 - 9,000만원</h4>
              </TextContent>
              <RadioButton
                type="radio"
                name="budget"
                checked={selectedBudget === 'veryHigh'}
                readOnly
              />
            </RadioOptionCard>
            <RadioOptionCard
              selected={selectedBudget === 'soveryHigh'}
              onClick={() => setSelectedBudget('soveryHigh')}
            >
              <TextContent>
                <h4>9,000만원 이상</h4>
              </TextContent>
              <RadioButton
                type="radio"
                name="budget"
                checked={selectedBudget === 'soveryHigh'}
                readOnly
              />
            </RadioOptionCard>
          </Step2BudgetRow>
        </Section>
      </AdditionalFields>
    )}
  </StepContent>
);

export default InquiryStep2;

// Styled components
const StepContent = styled.div`
  text-align: left;
  margin-bottom: 150px;
`;

const InputWrapper = styled.div`
  margin-bottom: 2rem;
  text-align: left;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: #514FE4;
  }
`;

const AdditionalFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
  text-align: left;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const Step2SelectRow = styled.div`
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

  h4 {
    margin: 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
  }
`;

const SmallEmoji = styled.div`
  font-size: 1.5rem;
  align-self: flex-end;
  margin-top: auto;
`;

const FileButton = styled.label`
  display: inline-block;
  background-color: white;
  color: #333;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: background 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  input {
    display: none;
  }
`;

const LineButton = styled.button`
  background: none;
  border: 1px dashed #ddd;
  color: #555;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;
  text-decoration: none;
  width: 100%;
  padding: 0.75rem;
  text-align: center;
  transition: background 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Step2OptionsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
`;

const RadioOptionCard = styled.div`
  background: ${(props) => (props.selected ? '#EEEFFE' : 'white')};
  border: 1px solid ${(props) => (props.selected ? '#514FE3' : '#ddd')};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: left;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;

  &:hover {
    background: #EEEFFE;
  }
`;

const RadioButton = styled.input`
  margin: 0;
`;

const Step2BudgetRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  width: 100%;
`; 