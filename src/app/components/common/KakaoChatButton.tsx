'use client';

import React from 'react';
import styled from 'styled-components';

const KakaoChatButton = () => {
  return (
    <ChatButtonContainer>
      <ChatButton 
        href="http://pf.kakao.com/_Lpaln/chat" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="카카오채널 문의하기"
      >
        <ChatIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C17.799 3 22.5 6.925 22.5 12C22.5 17.075 17.799 21 12 21C10.5 21 9.075 20.625 7.8 19.95L3 21L4.2 16.5C3.525 15.225 3 13.65 3 12C3 6.925 7.701 3 12 3Z" fill="#FEE500"/>
            <path d="M12 3C17.799 3 22.5 6.925 22.5 12C22.5 17.075 17.799 21 12 21C10.5 21 9.075 20.625 7.8 19.95L3 21L4.2 16.5C3.525 15.225 3 13.65 3 12C3 6.925 7.701 3 12 3Z" stroke="#3C1E1E" strokeWidth="1.5"/>
            <path d="M8 10C8.55228 10 9 9.55228 9 9C9 8.44772 8.55228 8 8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10Z" fill="#3C1E1E"/>
            <path d="M16 10C16.5523 10 17 9.55228 17 9C17 8.44772 16.5523 8 16 8C15.4477 8 15 8.44772 15 9C15 9.55228 15.4477 10 16 10Z" fill="#3C1E1E"/>
            <path d="M8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13Z" fill="#3C1E1E"/>
            <path d="M16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13Z" fill="#3C1E1E"/>
          </svg>
        </ChatIcon>
        <ChatText>문의하기</ChatText>
      </ChatButton>
    </ChatButtonContainer>
  );
};

const ChatButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
  }
`;

const ChatButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FEE500;
  color: #3C1E1E;
  padding: 12px 16px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  border: 2px solid #FEE500;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    background: #FFD700;
    border-color: #FFD700;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
    gap: 6px;
  }
`;

const ChatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ChatText = styled.span`
  white-space: nowrap;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

export default KakaoChatButton; 