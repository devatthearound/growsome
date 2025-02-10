import React from 'react';
import styled from 'styled-components';

const SubscribePopup = ({ onClose }: { onClose: () => void }) => {
  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={(e) => e.stopPropagation()}>
        <PopupEmoji>📧</PopupEmoji>
        <PopupTitle>구독하기</PopupTitle>
        <PopupText>
          성장하는 개발자를 위한<br />
          최신 소식을 받아보세요!
        </PopupText>
        <SubscribeForm>
          <SubscribeInput 
            type="email" 
            placeholder="이메일을 입력해주세요"
          />
          <SubscribeButton>구독하기</SubscribeButton>
        </SubscribeForm>
        <CloseButton onClick={onClose}>닫기</CloseButton>
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
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const PopupEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const PopupTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const PopupText = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const SubscribeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SubscribeInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const SubscribeButton = styled.button`
  padding: 0.75rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #4340c0;
  }
`;

const CloseButton = styled.button`
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    color: #333;
  }
`;

export default SubscribePopup;
