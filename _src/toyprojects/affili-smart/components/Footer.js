import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 1rem;
  text-align: center;
  background-color: #f1f1f1;
  color: #666;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; {new Date().getFullYear()} AffiliSmart. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;