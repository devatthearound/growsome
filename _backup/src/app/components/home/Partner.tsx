'use client'

import React from 'react';
import styled from 'styled-components';

const Partner = () => {
  return (
    <PartnerSection>
      <LogoContainer>
        <Logo src="/images/partners/chatgpt-ai.png" alt="chatgpt" />
        <Logo src="/images/partners/claude-ai.png" alt="claude" />
        <Logo src="/images/partners/cursor-ai.png" alt="cursorai" />
        <Logo src="/images/partners/Midjourney-ai.png" alt="Midjourney" />
        {/* Add more logos as needed */}
      </LogoContainer>
    </PartnerSection>
  );
};

const PartnerSection = styled.section`
  background-color: #fff;
  padding: 40px 20px;
  text-align: center;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
`;

const Logo = styled.img`
  width: auto;
  height: 40px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

export default Partner;
