import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Subscription = () => {
  const location = useLocation();
  const { source, type, productInfo } = location.state || {};

  useEffect(() => {
    if (productInfo) {
      // 초기화 작업
      console.log('Initialize Subscription:', {
        source,
        type,
        productInfo
      });
    }
  }, [productInfo, source, type]);

  return (
    <SubscriptionContainer>
      <SubscriptionHeader>
        <h1>개발팀 구독 서비스</h1>
        <p>필요할 때 필요한 만큼만 작업자를 사용하세요</p>
      </SubscriptionHeader>
      
      <SubscriptionContent>
        {/* 구독 서비스 신청 폼 등 컨텐츠 추가 */}
        <p>구독 서비스 신청 페이지 준비 중입니다.</p>
      </SubscriptionContent>
    </SubscriptionContainer>
  );
};

// Styled Components
const SubscriptionContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SubscriptionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  p {
    font-size: 1.2rem;
    color: #666;
  }
`;

const SubscriptionContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export default Subscription; 