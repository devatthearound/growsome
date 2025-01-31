import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  20%, 80% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.05);
  }
`;

const slideInOut = keyframes`
  0% {
    transform: translateX(-100%);
  }
  20%, 80% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
`;

const TransitionContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const FadeTransition = styled.div`
  width: 100%;
  height: 100%;
  background: black;
  animation: ${fadeInOut} ${props => props.duration || '2s'} ease-in-out;
`;

const SlideTransition = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, #000, transparent);
  animation: ${slideInOut} ${props => props.duration || '2s'} ease-in-out;
`;

const TransitionEffects = ({ type = 'fade', duration = '2s' }) => {
  return (
    <TransitionContainer>
      {type === 'fade' ? (
        <FadeTransition duration={duration} />
      ) : (
        <SlideTransition duration={duration} />
      )}
    </TransitionContainer>
  );
};

export default TransitionEffects;
