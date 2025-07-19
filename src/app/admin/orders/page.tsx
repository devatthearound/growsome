'use client';

import styled from 'styled-components';

const OrdersPage = () => {
  return (
    <Container>
      <Header>
        <h1>📋 주문 관리</h1>
      </Header>

      <ComingSoonCard>
        <h2>🚧 개발 중인 기능</h2>
        <p>주문 관리 시스템은 현재 개발 중입니다.</p>
        
        <FeatureList>
          <h3>🎯 예정된 기능들:</h3>
          <ul>
            <li>실시간 주문 현황 모니터링</li>
            <li>주문 상태 관리 (접수/처리중/배송중/완료)</li>
            <li>고객 정보 및 배송 정보 관리</li>
            <li>결제 상태 확인</li>
            <li>주문 통계 및 분석</li>
            <li>환불 및 취소 처리</li>
            <li>주문 알림 시스템</li>
          </ul>
        </FeatureList>

        <CurrentStatus>
          <h3>📊 현재 상태:</h3>
          <StatusItem>
            <span>총 주문 수:</span>
            <span>0개</span>
          </StatusItem>
          <StatusItem>
            <span>오늘 주문:</span>
            <span>0개</span>
          </StatusItem>
          <StatusItem>
            <span>처리 대기:</span>
            <span>0개</span>
          </StatusItem>
          <StatusItem>
            <span>총 매출:</span>
            <span>₩0</span>
          </StatusItem>
        </CurrentStatus>
      </ComingSoonCard>

      <InfoCard>
        <h3>🎯 주문 관리 시스템 특징</h3>
        <p>
          Growsome의 주문 관리 시스템은 효율적인 주문 처리를 위해 설계될 예정입니다:
        </p>
        
        <FeatureGrid>
          <FeatureItem>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>실시간 처리</FeatureTitle>
            <FeatureDesc>주문이 들어오는 즉시 알림과 함께 처리 시작</FeatureDesc>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>상세 분석</FeatureTitle>
            <FeatureDesc>매출 통계, 인기 상품, 고객 분석 등 다양한 리포트</FeatureDesc>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>🔄</FeatureIcon>
            <FeatureTitle>자동화</FeatureTitle>
            <FeatureDesc>반복적인 작업을 자동화하여 효율성 극대화</FeatureDesc>
          </FeatureItem>
          
          <FeatureItem>
            <FeatureIcon>🛡️</FeatureIcon>
            <FeatureTitle>보안</FeatureTitle>
            <FeatureDesc>고객 정보와 결제 데이터의 안전한 보호</FeatureDesc>
          </FeatureItem>
        </FeatureGrid>
      </InfoCard>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
    color: #333;
  }
`;

const ComingSoonCard = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  
  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.8rem;
  }
  
  p {
    margin: 0 0 2rem 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const FeatureList = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
  
  h3 {
    margin: 0 0 1rem 0;
    text-align: center;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
`;

const CurrentStatus = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: left;
  
  h3 {
    margin: 0 0 1rem 0;
    text-align: center;
  }
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }
  
  p {
    margin: 0 0 1.5rem 0;
    color: #666;
    line-height: 1.6;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FeatureItem = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const FeatureTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const FeatureDesc = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export default OrdersPage;
