import React from 'react';
import styled, { keyframes } from 'styled-components';

const numberReveal = keyframes`
  0% {
    transform: translateY(100%) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: translateY(-20%) scale(1.2);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const sparkle = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RankNumber = styled.div`
  font-size: 180px;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  animation: ${numberReveal} 1.5s ease-out forwards;
  position: relative;

  &::after {
    content: '위';
    font-size: 60px;
    position: absolute;
    right: -70px;
    bottom: 40px;
    animation: ${sparkle} 2s infinite;
  }
`;

const RankAnimation = ({ rank }) => {
  return (
    <Container>
      <RankNumber>{rank}</RankNumber>
    </Container>
  );
};

export default RankAnimation;
