'use client'

import React from 'react';
import styled from 'styled-components';
import Hero from './components/home/Hero'; 
import Partner from './components/home/Partner';
import Letters from './components/home/Letters';
import Solutions from './components/home/Solutions';
import Newsletters from './components/home/Newsletters';
import Blog from './components/home/Blog';
import JoinUs from './components/home/JoinUs';

const Home = () => {
  return (
    <HomeContainer>
      <Hero />
      <Partner />
      <Letters />
      <Solutions />
      {/*<Newsletters />*/}
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