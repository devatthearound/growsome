import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEnvelope, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const SubscribePopup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // 여기에 실제 구독 API 호출 로직 추가
    setIsSubmitted(true);
    localStorage.setItem('hasSubscribed', 'true');
    
    // 3초 후 팝업 닫기
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        
        {!isSubmitted ? (
          <>
            <PopupIcon>
              <FontAwesomeIcon icon={faEnvelope} />
            </PopupIcon>
            <PopupTitle>AI 업데이트 소식을 받아보세요</PopupTitle>
            <PopupDescription>
              최신 AI 트렌드와 인사이트를 매주 받아보실 수 있습니다.
            </PopupDescription>
            <SubscribeForm onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <SubscribeButton type="submit">구독하기</SubscribeButton>
            </SubscribeForm>
            <PrivacyNote>
              구독 신청 시 개인정보 처리방침에 동의하게 됩니다
            </PrivacyNote>
          </>
        ) : (
          <SuccessMessage>
            <SuccessIcon>
              <FontAwesomeIcon icon={faCheckCircle} />
            </SuccessIcon>
            <h3>구독이 완료되었습니다!</h3>
            <p>환영합니다 🎉</p>
          </SuccessMessage>
        )}
      </PopupContent>
    </PopupOverlay>
  );
};

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const PopupContent = styled(motion.div)`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  position: relative;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const PopupIcon = styled.div`
  font-size: 2.5rem;
  color: #514FE4;
  margin-bottom: 1.5rem;
`;

const PopupTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
`;

const PopupDescription = styled.p`
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const SubscribeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #514FE4;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: -0.5rem;
`;

const SubscribeButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4340c0;
    transform: translateY(-2px);
  }
`;

const PrivacyNote = styled.p`
  font-size: 0.8rem;
  color: #999;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem 0;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1rem 0;
  }

  p {
    color: #666;
  }
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 1rem;
`;

export default SubscribePopup;
