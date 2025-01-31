import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Store = () => {
  const navigate = useNavigate();

  const handlePurchase = (product) => {
    // 함수나 복잡한 객체 대신 필요한 데이터만 전달
    const simpleProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      type: 'store'
    };
    
    navigate('/payment', {
      state: { 
        product: simpleProduct
      }
    });
  };

  const products = [
    {
      id: 'dev_subscription',
      name: '개발팀 구독',
      price: '가격 협의',
      description: '필요할 때 필요한 만큼만 작업자를 사용하세요'
    },
    {
      id: 'dev_inquiry',
      name: '개발 의뢰',
      price: '가격 협의',
      description: '프로젝트 [기획, 디자인, 개발] 전체를 맡기세요'
    }
  ];

  return (
    <StoreContainer>
      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product.id}>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>{product.price}</ProductPrice>
            <ProductDescription>{product.description}</ProductDescription>
            <PurchaseButton onClick={() => handlePurchase(product)}>
              구매하기
            </PurchaseButton>
          </ProductCard>
        ))}
      </ProductGrid>
    </StoreContainer>
  );
};

// Styled Components
const StoreContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProductName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ProductPrice = styled.div`
  font-size: 1.2rem;
  color: #514FE4;
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const PurchaseButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4340c0;
    transform: translateY(-2px);
  }
`;

export default Store; 