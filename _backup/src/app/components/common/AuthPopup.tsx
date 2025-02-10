import React, { useState } from 'react';
import styled from 'styled-components';
import SignUp from '../../signup/page';
import Auth from '../../auth/page';

const AuthPopup = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [isSignUp, setIsSignUp] = useState(true);

  if (!isOpen) return null;

  return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={onClose}>X</CloseButton>
        {isSignUp ? <SignUp /> : <Auth />}
        <ToggleLink onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? '이미 회원이신가요? 로그인 하기' : '회원가입 하기'}
        </ToggleLink>
      </PopupContent>
    </PopupOverlay>
  );
};

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  /* max-width: 500px;
  width: 500px; */
  height: 670px;
  margin: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ToggleLink = styled.p`
  text-align: center;
  color: #514FE4;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1rem;
`;

export default AuthPopup; 