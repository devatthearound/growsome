import React from 'react';
import styled from 'styled-components';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Store from '../components/home/Store';
import Blog from '../components/home/Blog';
import Works from '../components/home/Works';
import ToyProjects from '../components/home/ToyProjects';

const Home = () => {
  return (
    <HomeContainer>
      <Hero />
      <ToyProjects />
      <Store />
      <Blog />
      <Works />
      <Services />
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  width: 100%;
`;

export default Home; 