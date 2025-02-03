import React, { useState } from 'react';
import styled from 'styled-components';

const ApiKeyPopup = ({ onSubmit, onClose }) => {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [subId, setSubId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      accessKey, 
      secretKey, 
      subId: subId || 'AF2672682'
    });
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <h2>쿠팡 파트너스 API 설정</h2>
        <InfoSection>
          <InfoTitle>💡 쿠팡 파트너스 이용 안내</InfoTitle>
          <InfoText>
            1. 쿠팡 파트너스 가입이 필요합니다.
            2. 가입 후 API 키를 발급받을 수 있습니다.
            3. API 키가 없어도 트렌드 검색은 이용 가능합니다.
            4. 상품 검색 및 영상 생성은 API 키 입력 후 이용 가능합니다.
          </InfoText>
          <InfoLink href="https://partners.coupang.com/" target="_blank" rel="noopener noreferrer">
            쿠팡 파트너스 가입하기 →
          </InfoLink>
        </InfoSection>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label>Access Key</label>
            <input
              type="text"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Access Key를 입력하세요"
              required
            />
          </InputGroup>
          
          <InputGroup>
            <label>Secret Key</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Secret Key를 입력하세요"
              required
            />
          </InputGroup>

          <ButtonGroup>
            <SubmitButton type="submit">API 키 저장</SubmitButton>
            <SkipButton type="button" onClick={onClose}>나중에 하기</SkipButton>
          </ButtonGroup>
        </Form>
      </PopupContent>
    </PopupOverlay>
  );
};

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  
  h2 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    color: #666;
    margin-bottom: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-weight: 500;
    color: #333;
  }
  
  input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #514FE4;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
`;

const SubmitButton = styled(Button)`
  background: #514FE4;
  color: white;
  border: none;
  
  &:hover {
    background: #4340c0;
  }
`;

const CancelButton = styled(Button)`
  background: white;
  color: #666;
  border: 1px solid #ddd;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const InfoTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
`;

const InfoText = styled.div`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-line;
`;

const InfoLink = styled.a`
  color: #514FE4;
  text-decoration: none;
  display: inline-block;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SkipButton = styled(CancelButton)`
  color: #514FE4;
  background: white;
  border: 1px solid #514FE4;
  
  &:hover {
    background: #f8f9fa;
  }
`;

export default ApiKeyPopup; 