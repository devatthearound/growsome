import React from 'react';
import styled from 'styled-components';
import HomeServices from '../components/home/Services';

const Services = () => {
  return (
    <ServicesContainer>
      <HomeServices />
    </ServicesContainer>
  );
};

const ServicesContainer = styled.div`
  width: 100%;
  padding-top: 80px;
`;

export default Services;
