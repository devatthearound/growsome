import React from 'react';
import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterText>
        디어라운드 주식회사<br /> 사업자등록번호 573-86-01025 대표 조현주<br /> 
        서울시 영등포구 영등포로 19길 15, 301-14호
        T.02-583-8228 E.master@growsome.co.kr<br />통신판매업신고번호 제2025-서울영등포-0150호
        </FooterText>
        <ComingSoon>NEW SERVICE COMING SOON</ComingSoon>
      </FooterContent>
    </FooterWrapper>
  );
};

const FooterWrapper = styled.footer`
  background: #f8f9fa;
  padding: 40px 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`;

const FooterText = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ComingSoon = styled.div`
  color: #514FE4;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 1px;
`;

// const FooterContainer = styled.div`
//   max-width: 1440px;
//   margin: 0 auto;
//   padding: 0 2rem;
// `;

// const TopSection = styled.div`
//   display: flex;
//   gap: 4rem;
//   margin-bottom: 4rem;

//   @media (max-width: 1024px) {
//     flex-direction: column;
//     gap: 3rem;
//   }
// `;

// const LogoSection = styled.div`
//   flex: 1;
//   max-width: 300px;
// `;

// const FooterLogo = styled.h2`
//   font-size: 1.8rem;
//   font-weight: 700;
//   margin-bottom: 1rem;
//   color: #514FE4;
// `;

// const LogoDescription = styled.p`
//   color: #666;
//   line-height: 1.6;
//   margin-bottom: 2rem;
// `;

// const SocialLinks = styled.div`
//   display: flex;
//   gap: 1.5rem;
// `;

// const SocialLink = styled.a`
//   color: #666;
//   font-size: 1.2rem;
//   transition: color 0.3s ease;

//   &:hover {
//     color: #514FE4;
//   }
// `;

// const LinksSection = styled.div`
//   flex: 2;
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 2rem;

//   @media (max-width: 1440px) {
//     padding: 0 1rem;
//   }

//   @media (max-width: 768px) {
//     grid-template-columns: repeat(2, 1fr);
//   }

//   @media (max-width: 480px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const LinkColumn = styled.div``;

// const ColumnTitle = styled.h3`
//   font-size: 1rem;
//   font-weight: 600;
//   margin-bottom: 1.5rem;
//   color: #333;
// `;

// const LinkList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.8rem;
// `;

// const StyledLink = styled(Link)`
//   color: #666;
//   text-decoration: none;
//   transition: color 0.3s ease;
//   font-size: 0.9rem;

//   &:hover {
//     color: #514FE4;
//   }
// `;

// const ContactInfo = styled.div`
//   margin-bottom: 1.5rem;
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// `;

// const ContactText = styled.p`
//   color: #666;
//   font-size: 0.9rem;
//   margin: 0;
// `;

// const Divider = styled.hr`
//   border: none;
//   border-top: 1px solid #ddd;
//   margin: 2rem 0;
// `;

// const BottomSection = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
  
//   @media (max-width: 768px) {
//     flex-direction: column;
//     gap: 1rem;
//     text-align: center;
//   }
// `;

// const CopyrightText = styled.p`
//   color: #666;
//   font-size: 0.9rem;
// `;

// const LegalLinks = styled.div`
//   display: flex;
//   gap: 2rem;
// `;

// const LegalLink = styled.a`
//   color: #666;
//   font-size: 0.9rem;
//   text-decoration: none;
//   cursor: pointer;
//   transition: color 0.3s ease;

//   &:hover {
//     color: #514FE4;
//   }
// `;

export default Footer;