'use client'

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Hero = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <HeroSection id="hero">
      <FloatingAgents>
        <FloatingAgent left="20%" top="15%">
          <Image src="/images/home/ai-agent1.png" alt="Floating Agent 1" width={200} height={200} />
        </FloatingAgent>
        <FloatingAgent right="25%" top="40%">
          <Image src="/images/home/ai-agent2.png" alt="Floating Agent 2" width={200} height={200} />
        </FloatingAgent>
        <FloatingAgent left="35%" bottom="20%">
          <Image src="/images/home/ai-agent3.png" alt="Floating Agent 3" width={200} height={200} />
        </FloatingAgent>
      </FloatingAgents>
      <HeroContent>
          <MainTitle>
            <span className="accent">똑똑하고 창의적으로</span><br />
            <span className="highlight">답을 찾다</span>
          </MainTitle>

      </HeroContent>
      <JoinSection>
        <JoinColumn>
          <JoinText>비밀연구소에 합류하세요!</JoinText>
          <JoinDescription>
          AI와 함께 온라인 SW사업을 시작하고, 성장시키고, 수익을 창출하기 위한 팁, 전략 및 리소스를 알아보세요.
          </JoinDescription>
        </JoinColumn>
        <JoinColumn>
          <JoinForm>
            <a href="https://open.kakao.com/o/gqWxH1Zg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <SubscribeButton>
                비밀연구소 참여하기
              </SubscribeButton>
            </a>
          </JoinForm>
        </JoinColumn>
      </JoinSection>
      <GridBackground />
    </HeroSection>
  );
};

const HeroSection = styled.section`
  position: relative;
  height: 1000px; /* Set height for desktop */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  background: #514FE4;
  padding: 20px;
  text-align: left;

  @media (max-width: 768px) {
    height: auto; /* Adjust height for mobile */
    align-items: center; /* Center align for mobile */
    text-align: center; /* Center text for mobile */
    padding-top: 150px; /* Add padding to avoid overlap with navigation */
  }
`;

const HeroContent = styled.div`
  position: relative;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  z-index: 3;
  width: 100%;
  flex-grow: 1; /* Allow content to grow and fill space */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically */
  margin-bottom: 50px;

  @media (max-width: 768px) {
    align-items: center; /* Center content horizontally for mobile */
  }
`;

const MainTitle = styled.h1`
  font-size: 8rem; /* Set a fixed size for desktop */
  font-weight: 800;
  color: white;
  line-height: 1.1;
  position: relative;
  letter-spacing: -3px;
  margin-bottom: 1rem;
  text-align: left;
  word-wrap: break-word;

  .accent {
    color: white;
  }

  .highlight {
    color: #03ff01;
  }

  @media (max-width: 768px) {
    font-size: 4rem; /* Adjust size for mobile */
    text-align: center; /* Center text for mobile */
  }
`;

const SubTitle = styled.p`
  font-size: min(2.5rem, 4vh);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  font-weight: 500;
  text-align: left;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: min(1.8rem, 3vh);
  }

  @media (max-height: 800px) {
    margin-bottom: 2rem;
  }

  @media (max-height: 600px) {
    margin-bottom: 1rem;
    font-size: min(1.5rem, 2.5vh);
  }
`;

const FloatingAgents = styled.div`
  display: none;
`;

const FloatingAgent = styled.div<{ left?: string; right?: string; top?: string; bottom?: string }>`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  padding: 20px;
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  top: ${props => props.top || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  z-index: 2;

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  @keyframes float {
    0% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(-8px); opacity: 0.95; }
    100% { transform: translateY(0); opacity: 1; }
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    padding: 10px;
  }

  @media (max-height: 600px) {
    width: 90px;
    height: 90px;
    padding: 8px;
  }
`;

const ContactButton = styled.a`
  display: inline-block;
  padding: 15px 30px;
  background: #03FF01;
  font-size: min(1.2rem, 2.5vh);
  font-weight: 600;
  color: black;
  border-radius: 30px;
  text-decoration: none;
  margin-top: 20px;
  transition: background 0.3s;

  &:hover {
    background: #02cc00;
  }
`;

const JoinSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  color: white;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column; /* Stack elements vertically for mobile */
  }
`;

const JoinColumn = styled.div`
  flex: 1;
  padding: 10px;
`;

const JoinText = styled.h2`
  font-size: 2rem;
  margin-bottom: 10px;
  font-weight: 500;
`;

const JoinDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 400;
`;

const JoinForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap; /* Prevent wrapping */

  @media (max-width: 768px) {
    flex-direction: row; /* Keep elements in a row for mobile */
  }
`;

const EmailInput = styled.input`
  padding: 15px 30px;
  font-size: min(1.2rem, 2.5vh);
  border: none;
  border-radius: 30px;
  width: 250px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
`;

const SubscribeButton = styled.div`
  display: inline-block;
  padding: 15px 30px;
  background: #06FF01;
  color: #080D34;
  font-size: 1.2rem;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const GridBackground = styled.div`
  // ... existing GridBackground styles ...
`;

export default Hero;