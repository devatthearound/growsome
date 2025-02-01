import React, { useState } from 'react';
import styled from 'styled-components';

const AffiliateSettingsPopup = ({ onSubmit, onClose, currentSettings }) => {
  const [activeTab, setActiveTab] = useState('coupang');
  const [settings, setSettings] = useState(currentSettings || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(settings);
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <PopupHeader>
          <h2>제휴 플랫폼 설정</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </PopupHeader>

        <TabContainer>
          <Tab 
            $active={activeTab === 'coupang'} 
            onClick={() => setActiveTab('coupang')}
          >
            🛒 쿠팡 파트너스
          </Tab>
          <Tab 
            $active={activeTab === 'aliexpress'} 
            onClick={() => setActiveTab('aliexpress')}
            $disabled
          >
            🌏 알리익스프레스 <ComingSoon>Coming Soon</ComingSoon>
          </Tab>
          <Tab 
            $active={activeTab === 'amazon'} 
            onClick={() => setActiveTab('amazon')}
            disabled
          >
            📦 아마존 <ComingSoon>Coming Soon</ComingSoon>
          </Tab>
        </TabContainer>

        <TabContent>
          {activeTab === 'coupang' && (
            <Form onSubmit={handleSubmit}>
              <InfoSection>
                <InfoTitle>💡 쿠팡 파트너스 이용 안내</InfoTitle>
                <InfoText>
                  1. 쿠팡 파트너스 가입이 필요합니다.
                  2. 가입 후 API 키를 발급받을 수 있습니다.
                  3. API 키 설정 후 상품 검색 및 영상 생성이 가능합니다.
                </InfoText>
                <InfoLink 
                  href="https://partners.coupang.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  쿠팡 파트너스 가입하기 →
                </InfoLink>
              </InfoSection>

              <InputGroup>
                <label>Access Key</label>
                <input
                  type="text"
                  value={settings.coupang?.accessKey || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    coupang: {
                      ...settings.coupang,
                      accessKey: e.target.value
                    }
                  })}
                  placeholder="Access Key를 입력하세요"
                />
              </InputGroup>
              
              <InputGroup>
                <label>Secret Key</label>
                <input
                  type="password"
                  value={settings.coupang?.secretKey || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    coupang: {
                      ...settings.coupang,
                      secretKey: e.target.value
                    }
                  })}
                  placeholder="Secret Key를 입력하세요"
                />
              </InputGroup>

              <ButtonGroup>
                <SaveButton type="submit">저장</SaveButton>
                <CancelButton type="button" onClick={onClose}>취소</CancelButton>
              </ButtonGroup>
            </Form>
          )}
        </TabContent>
      </PopupContent>
    </PopupOverlay>
  );
};

// Styled Components
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
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: #333;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 1rem;
  color: ${props => props.$active ? '#514FE4' : '#666'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  position: relative;
  
  &:hover {
    color: #514FE4;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -9px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.$active ? '#514FE4' : 'transparent'};
  }
`;

const TabContent = styled.div`
  padding: 20px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoSection = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const InfoTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 12px 0;
`;

const InfoText = styled.div`
  color: #666;
  line-height: 1.6;
  white-space: pre-line;
  margin-bottom: 12px;
`;

const InfoLink = styled.a`
  color: #514FE4;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 500;
    color: #333;
  }

  input {
    padding: 12px;
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
  gap: 12px;
  margin-top: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  transition: all 0.2s;
`;

const SaveButton = styled(Button)`
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

const ComingSoon = styled.span`
  background: #ff922b;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  margin-left: 8px;
`;

const StyledButton = styled.button`
  background: ${props => props.$active ? '#514FE4' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : '#666'};
`;

export default AffiliateSettingsPopup; 