'use client';

import React from 'react';
import styled from 'styled-components';
import { Typography } from '@/components/design-system/Typography';
import { Container } from '@/components/design-system/Layout';
import { growsomeTheme } from '@/components/design-system/theme';
import Link from 'next/link';

const CompletePage = () => {
  return (
    <PageContainer>
      <Container>
        <ContentWrapper>
          <IconContainer>
            <CheckIcon>✓</CheckIcon>
          </IconContainer>
          
          <Title>
            당신의 프로젝트에 대해<br />
            이야기 해주셔서 감사합니다.
          </Title>
          
          <Message>
            우리가 잘 해낼 수 있는 프로젝트인지 검토 후<br />
            <strong>3일 이내</strong> 연락 드리겠습니다.
          </Message>
          
          <ContactInfo>
            <ContactLabel>문의 메일:</ContactLabel>
            <ContactEmail>master@growsome.kr</ContactEmail>
          </ContactInfo>
          
          <ActionButtons>
            <HomeButton href="/">
              홈으로 돌아가기
            </HomeButton>
            <ServicesButton href="/services">
              서비스 더 알아보기
            </ServicesButton>
          </ActionButtons>
        </ContentWrapper>
      </Container>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${growsomeTheme.color.Primary50} 0%, ${growsomeTheme.color.White} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${growsomeTheme.spacing.xl};
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
  background: ${growsomeTheme.color.White};
  padding: ${growsomeTheme.spacing.xl};
  border-radius: ${growsomeTheme.radius.radius2};
  box-shadow: ${growsomeTheme.shadow.Elevation2};
  animation: fadeInUp 0.6s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const IconContainer = styled.div`
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const CheckIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${growsomeTheme.color.Green500};
  color: ${growsomeTheme.color.White};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 auto;
  animation: scaleIn 0.5s ease-out 0.2s both;
  
  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: ${growsomeTheme.fontWeight.Bold};
  color: ${growsomeTheme.color.Black800};
  margin-bottom: ${growsomeTheme.spacing.lg};
  line-height: 1.4;
  
  @media ${growsomeTheme.device.mobile} {
    font-size: 1.5rem;
  }
`;

const Message = styled.p`
  font-size: ${growsomeTheme.fontSize.TextL};
  color: ${growsomeTheme.color.Black600};
  margin-bottom: ${growsomeTheme.spacing.xl};
  line-height: 1.6;
  
  strong {
    color: ${growsomeTheme.color.Primary600};
  }
`;

const ContactInfo = styled.div`
  background: ${growsomeTheme.color.Gray50};
  padding: ${growsomeTheme.spacing.lg};
  border-radius: ${growsomeTheme.radius.radius2};
  margin-bottom: ${growsomeTheme.spacing.xl};
  border: 1px solid ${growsomeTheme.color.Gray200};
`;

const ContactLabel = styled.div`
  font-size: ${growsomeTheme.fontSize.TextM};
  color: ${growsomeTheme.color.Black600};
  margin-bottom: ${growsomeTheme.spacing.sm};
`;

const ContactEmail = styled.div`
  font-size: ${growsomeTheme.fontSize.TextL};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  color: ${growsomeTheme.color.Primary600};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${growsomeTheme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  
  @media ${growsomeTheme.device.mobile} {
    flex-direction: column;
  }
`;

const Button = styled(Link)`
  padding: ${growsomeTheme.spacing.md} ${growsomeTheme.spacing.xl};
  border-radius: ${growsomeTheme.radius.radius2};
  text-decoration: none;
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  transition: all 0.2s ease;
  display: inline-block;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${growsomeTheme.shadow.Elevation2};
  }
`;

const HomeButton = styled(Button)`
  background: ${growsomeTheme.color.Gray100};
  color: ${growsomeTheme.color.Black700};
  border: 1px solid ${growsomeTheme.color.Gray300};
  
  &:hover {
    background: ${growsomeTheme.color.Gray200};
  }
`;

const ServicesButton = styled(Button)`
  background: ${growsomeTheme.color.Primary500};
  color: ${growsomeTheme.color.White};
  
  &:hover {
    background: ${growsomeTheme.color.Primary600};
  }
`;

export default CompletePage; 