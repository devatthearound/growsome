'use client';

import styled from 'styled-components';

const ProductsPage = () => {
  return (
    <Container>
      <Header>
        <h1>📦 상품 관리</h1>
      </Header>

      <ComingSoonCard>
        <h2>🚧 개발 중인 기능</h2>
        <p>상품 관리 기능은 현재 개발 중입니다.</p>
        
        <FeatureList>
          <h3>🎯 예정된 기능들:</h3>
          <ul>
            <li>상품 등록 및 관리</li>
            <li>카테고리 관리</li>
            <li>재고 관리</li>
            <li>가격 설정</li>
            <li>상품 이미지 업로드</li>
            <li>상품 상태 관리 (판매중/품절/중단)</li>
          </ul>
        </FeatureList>

        <CurrentStatus>
          <h3>📊 현재 상태:</h3>
          <StatusItem>
            <span>등록된 상품:</span>
            <span>0개</span>
          </StatusItem>
          <StatusItem>
            <span>활성 상품:</span>
            <span>0개</span>
          </StatusItem>
          <StatusItem>
            <span>카테고리:</span>
            <span>0개</span>
          </StatusItem>
        </CurrentStatus>
      </ComingSoonCard>

      <InfoCard>
        <h3>💡 상품 관리 시스템 소개</h3>
        <p>
          Growsome의 상품 관리 시스템은 다음과 같은 특징을 가질 예정입니다:
        </p>
        <ul>
          <li><strong>직관적인 UI:</strong> 사용하기 쉬운 관리 인터페이스</li>
          <li><strong>실시간 업데이트:</strong> 재고 및 주문 상태 실시간 반영</li>
          <li><strong>다양한 상품 유형:</strong> 디지털/물리적 상품 모두 지원</li>
          <li><strong>SEO 최적화:</strong> 검색 엔진 최적화된 상품 페이지</li>
        </ul>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    margin: 0 0 1rem 0;
    color: #666;
    line-height: 1.6;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #666;
  }
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  
  strong {
    color: #333;
  }
`;

export default ProductsPage;
