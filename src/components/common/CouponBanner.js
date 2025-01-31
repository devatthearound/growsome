import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

const CouponBanner = ({ message, expiration }) => {
  return (
    <BannerContainer>
      <CouponIcon>
        <FontAwesomeIcon icon={faTag} />
      </CouponIcon>
      <CouponTitle>특별 쿠폰 안내</CouponTitle>
      <CouponDiscount>
        <DiscountText>21%</DiscountText>
      </CouponDiscount>
      <CouponMessage>{message}</CouponMessage>
      <CouponExpiration>{expiration}</CouponExpiration>
    </BannerContainer>
  );
};

// 스타일 컴포넌트
const BannerContainer = styled.div`
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 10px;
  margin: 2rem 0;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CouponIcon = styled.div`
  font-size: 3rem;
  color: #ffcc00;
  margin-bottom: 0.5rem;
`;

const CouponTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: bold;
  color: #00ff00;
  margin: 0;
`;

const CouponDiscount = styled.div`
  background: linear-gradient(90deg, #00ff00, #00cc99);
  border-radius: 8px;
  padding: 1rem;
  display: inline-block;
  margin: 1rem 0;
`;

const DiscountText = styled.span`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
`;

const CouponMessage = styled.p`
  font-size: 1.2rem;
  color: #f0f0f0;
  margin: 0.5rem 0 0;
`;

const CouponExpiration = styled.p`
  font-size: 1rem;
  color: #e0e0e0;
  margin: 0;
  margin-top: 0.5rem;
  font-style: italic;
`;

export default CouponBanner;