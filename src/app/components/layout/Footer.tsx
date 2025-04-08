import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <TopSection>
          <LogoSection>
            <FooterLogo>GrowSome</FooterLogo>
            <LogoDescription>
              그로우썸은 디지털 전환 시대에 필요한 모든 솔루션을 제공합니다.
              강의, SaaS, 컨설팅, 콘텐츠를 통해 비즈니스 성장을 지원합니다.
            </LogoDescription>
            <SocialLinks>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </SocialLink>
              <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </SocialLink>
              <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </SocialLink>
            </SocialLinks>
          </LogoSection>
          
          <ContactSection>
            <ContactTitle>연락처</ContactTitle>
            <ContactInfo>
              <ContactText>서울시 영등포구 영등포로 19길 15, 301-14호</ContactText>
              <ContactText>T. 010-8309-5227</ContactText>
              <ContactText>E. master@growsome.co.kr</ContactText>
            </ContactInfo>
          </ContactSection>
        </TopSection>
        
        <Divider />
        
        <BottomSection>
          <CopyrightText>
            © 2025 디어라운드 주식회사. All rights reserved.
          </CopyrightText>
          <LegalLinks>
            <LegalLink href="/terms-of-service">이용약관</LegalLink>
            <LegalLink href="/privacy-policy">개인정보처리방침</LegalLink>
            <LegalLink href="/refund-policy">환불정책</LegalLink>
          </LegalLinks>
        </BottomSection>
        
        <CompanyInfo>
          <InfoText>사업자등록번호 573-86-01025 | 대표 조현주</InfoText>
          <InfoText>통신판매업신고번호 제2025-서울영등포-0150호</InfoText>
        </CompanyInfo>
      </FooterContainer>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  background: #f8f9fa;
  padding: 60px 0 30px;
  margin-top: auto;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 4rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const LogoSection = styled.div`
  flex: 1;
`;

const FooterLogo = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #514FE4;
`;

const LogoDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const SocialLink = styled.a`
  color: #666;
  font-size: 1.2rem;
  transition: color 0.3s ease;

  &:hover {
    color: #514FE4;
  }
`;

const ContactSection = styled.div`
  flex: 1;
`;

const ContactTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactText = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 2rem 0;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const CopyrightText = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LegalLink = styled(Link)`
  color: #666;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #514FE4;
  }
`;

const CompanyInfo = styled.div`
  text-align: center;
  margin-top: 1.5rem;
`;

const InfoText = styled.p`
  color: #999;
  font-size: 0.8rem;
  margin: 0.3rem 0;
`;

export default Footer;