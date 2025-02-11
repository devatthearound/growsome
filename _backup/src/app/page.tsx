'use client'

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Hero from './components/home/Hero'; 
import Partner from './components/home/Partner';
import Letters from './components/home/Letters';
import Solutions from './components/home/Solutions';
import JoinUs from './components/home/JoinUs';

const Home = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // 또는 로딩 컴포넌트
  }

  return (
    <HomeContainer>
      <Hero />
      <Partner />
      <Letters />
      <Solutions />
      <JoinUs />
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  width: 100%;
  padding: 0;
  background-color: #f0f0f0;
`;

export default Home;