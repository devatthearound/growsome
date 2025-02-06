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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <MainTitle>
            <span className="accent">AI</span>로<br />
            더 똑똑하게,<br />
            <span className="highlight">더 창의적으로</span>
          </MainTitle>
          <SubTitle>우리는 문제를 해결합니다</SubTitle>
          <ContactButton 
            href="https://discord.gg/W8dZjdEa3w" 
            target="_blank"
            rel="noopener noreferrer"
          >
            비밀연구소 입장 🚀
          </ContactButton>
        </motion.div>
      </HeroContent>
      <GridBackground />
    </HeroSection>
  );
};

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  min-height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #514FE4;
  padding: 20px;
  text-align: center;
`;

const HeroContent = styled.div`
  position: relative;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  z-index: 3;
  width: 100%;
`;

const MainTitle = styled.h1`
  font-size: min(10rem, 12vh);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  position: relative;
  letter-spacing: -3px;
  margin-bottom: 2rem;
  text-align: center;
  word-wrap: break-word;

  .accent {
    color: white;
  }

  .highlight {
    color: #03ff01;
  }

  @media (max-width: 768px) {
    font-size: min(7rem, 10vh);
  }

  @media (max-height: 800px) {
    font-size: min(8rem, 10vh);
    margin-bottom: 1rem;
  }

  @media (max-height: 600px) {
    font-size: min(6rem, 8vh);
    margin-bottom: 0.5rem;
  }
`;

const SubTitle = styled.p`
  font-size: min(2.5rem, 4vh);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  font-weight: 500;
  text-align: center;
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

const GridBackground = styled.div`
  // 여기에 GridBackground 스타일을 추가하세요
`;

export default Hero;