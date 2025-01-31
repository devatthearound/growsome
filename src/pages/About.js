import React from 'react';
import styled from 'styled-components';
import AboutComponent from '../components/home/About';

const About = () => {
  return (
    <AboutPage>
      <AboutComponent />
    </AboutPage>
  );
};

const AboutPage = styled.div`
  padding-top: 80px;
`;

export default About; 