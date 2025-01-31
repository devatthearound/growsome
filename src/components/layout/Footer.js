import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faInstagram, faLinkedin, faBehance } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <TopSection>
          <LogoSection>
            <FooterLogo>Growsome</FooterLogo>
            <LogoDescription>
              혁신적인 디지털 솔루션으로<br />
              비즈니스의 성장을 함께합니다.
            </LogoDescription>
            <SocialLinks>
              <SocialLink href="https://github.com/growsome" target="_blank">
                <FontAwesomeIcon icon={faGithub} />
              </SocialLink>
              <SocialLink href="https://instagram.com/growsome" target="_blank">
                <FontAwesomeIcon icon={faInstagram} />
              </SocialLink>
              <SocialLink href="https://linkedin.com/company/growsome" target="_blank">
                <FontAwesomeIcon icon={faLinkedin} />
              </SocialLink>
              <SocialLink href="https://behance.net/growsome" target="_blank">
                <FontAwesomeIcon icon={faBehance} />
              </SocialLink>
            </SocialLinks>
          </LogoSection>

          <LinksSection>
            <LinkColumn>
              <ColumnTitle>Services</ColumnTitle>
              <LinkList>
                <StyledLink to="/services">개발구독</StyledLink>
                <StyledLink to="/inquiry">개발문의</StyledLink>
                <StyledLink to="/consulting">컨설팅</StyledLink>
              </LinkList>
            </LinkColumn>

            <LinkColumn>
              <ColumnTitle>Projects</ColumnTitle>
              <LinkList>
                <StyledLink to="/projects">포트폴리오</StyledLink>
                <StyledLink to="/toy-projects">토이 프로젝트</StyledLink>
                <StyledLink to="/store">스토어</StyledLink>
              </LinkList>
            </LinkColumn>

            <LinkColumn>
              <ColumnTitle>Resources</ColumnTitle>
              <LinkList>
                <StyledLink to="/blog">블로그</StyledLink>
                <StyledLink to="/class">강의</StyledLink>
                <StyledLink to="https://discord.gg/W8dZjdEa3w" target="_blank">커뮤니티</StyledLink>
              </LinkList>
            </LinkColumn>

            <LinkColumn>
              <ColumnTitle>Contact</ColumnTitle>
              <ContactInfo>
                <ContactText>경기도 평택시 중앙로 199, 4층 19호</ContactText>
                <ContactText>master@growsome.com</ContactText>
                <ContactText>0107554-2397</ContactText>
              </ContactInfo>
            </LinkColumn>
            
          </LinksSection>
        </TopSection>

        <Divider />

        <BottomSection>
          <CopyrightText>
            © 2024 Growsome. All rights reserved.
          </CopyrightText>
          <LegalLinks>
            <LegalLink>Privacy Policy</LegalLink>
            <LegalLink>Terms of Service</LegalLink>
            <LegalLink>Cookies Settings</LegalLink>
          </LegalLinks>
        </BottomSection>
      </FooterContainer>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  background: #f8f9fa;
  color: #333;
  padding: 80px 0 40px;
`;

const FooterContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const TopSection = styled.div`
  display: flex;
  gap: 4rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const LogoSection = styled.div`
  flex: 1;
  max-width: 300px;
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
  margin-bottom: 2rem;
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

const LinksSection = styled.div`
  flex: 2;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 1440px) {
    padding: 0 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const LinkColumn = styled.div``;

const ColumnTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
`;

const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledLink = styled(Link)`
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    color: #514FE4;
  }
`;

const ContactInfo = styled.div`
  margin-bottom: 1.5rem;
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
`;

const LegalLink = styled.a`
  color: #666;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #514FE4;
  }
`;

export default Footer;