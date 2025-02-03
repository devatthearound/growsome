import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';

const Payment = () => {
  const { state } = useLocation();
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('kakaopay');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  const product = state?.product || {
    id: 'default',
    name: state?.product?.title || 'AI 기초 마스터 과정',
    price: state?.product?.price || '99,000',
    type: 'store',
    image: state?.product?.image || '',
    description: state?.product?.description || ''
  };

  useEffect(() => {
    if (state?.product) {
      console.log('Payment initialized:', state.product);
    }
  }, [state]);

  const handlePayment = async () => {
    if (!agreed) {
      alert('구매조건 확인 및 결제진행 동의가 필요합니다.');
      return;
    }

    try {
      // 실제 결제 구현
      alert('카카오페이 결제 페이지로 이동합니다.');
    } catch (error) {
      console.error('결제 처리 중 오류가 발생했습니다:', error);
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleCouponApply = () => {
    if (!couponCode) {
      alert('쿠폰 코드를 입력해주세요.');
      return;
    }
    
    // TODO: API 호출하여 쿠폰 유효성 검증
    // 임시 검증 로직
    if (couponCode === 'WELCOME2024') {
      setAppliedCoupon({
        code: couponCode,
        discount: 10000,
        name: '신규가입 환영 쿠폰'
      });
      setCouponCode('');
    } else {
      alert('유효하지 않은 쿠폰 코드입니다.');
    }
  };

  return (
    <PaymentPage>
      <Container>
        <PageHeader>
          <h1>결제하기</h1>
          <p>안전한 결제를 위해 SSL 보안 인증을 사용합니다</p>
        </PageHeader>

        <PaymentGrid>
          <OrderSummary>
            <SectionTitle>주문 내역</SectionTitle>
            <ProductCard>
              {product.image && (
                <ProductImage src={product.image} alt={product.title} />
              )}
              <h3>{product.title || product.name}</h3>
              <Price>{typeof product.price === 'number' ? 
                product.price.toLocaleString() : product.price}원</Price>
              {product.description && (
                <Description>{product.description}</Description>
              )}
              {product.features && (
                <FeatureList>
                  {product.features.map((feature, index) => (
                    <FeatureItem key={index}>
                      <FontAwesomeIcon icon={faCheck} />
                      {feature}
                    </FeatureItem>
                  ))}
                </FeatureList>
              )}
            </ProductCard>
          </OrderSummary>

          <PaymentSection>
            <SectionTitle>결제 수단 선택</SectionTitle>
            <PaymentMethods>
              <PaymentMethod
                selected={paymentMethod === 'kakaopay'}
                onClick={() => setPaymentMethod('kakaopay')}
              >
                <img src="/images/payment/kakaopay.png" alt="카카오페이" />
                카카오페이
              </PaymentMethod>
              <PaymentMethod
                selected={paymentMethod === 'card'}
                onClick={() => setPaymentMethod('card')}
              >
                <img src="/images/payment/card.png" alt="신용카드" />
                신용카드
              </PaymentMethod>
            </PaymentMethods>

            <AgreementSection>
              <Agreement>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>구매조건 확인 및 결제진행 동의</span>
              </Agreement>
              <SecurityInfo>
                <FontAwesomeIcon icon={faLock} />
                <span>SSL 보안 인증이 적용된 안전한 결제 시스템입니다</span>
              </SecurityInfo>
            </AgreementSection>

            <TotalSection>
              <TotalLabel>총 결제금액</TotalLabel>
              <TotalPrice>{product.price}원</TotalPrice>
            </TotalSection>

            <CouponSection>
              <SectionTitle>쿠폰 등록</SectionTitle>
              <CouponInputWrapper>
                <CouponInput
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="쿠폰 코드를 입력하세요"
                />
                <ApplyButton onClick={handleCouponApply}>적용</ApplyButton>
              </CouponInputWrapper>
              {appliedCoupon && (
                <AppliedCoupon>
                  <CouponName>{appliedCoupon.name}</CouponName>
                  <CouponDiscount>-{appliedCoupon.discount.toLocaleString()}원</CouponDiscount>
                </AppliedCoupon>
              )}
            </CouponSection>

            <PayButton onClick={handlePayment}>
              결제하기
            </PayButton>
          </PaymentSection>
        </PaymentGrid>
      </Container>
    </PaymentPage>
  );
};

const PaymentPage = styled.div`
  background: #FAFAFA;
  min-height: 100vh;
  padding: 80px 0;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  p {
    color: #666;
  }
`;

const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const OrderSummary = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const ProductCard = styled.div`
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 16px;
  }
  padding: 20px;
  background: white;
  border-radius: 12px;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #514FE4;
  margin-bottom: 24px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #666;
  font-size: 0.95rem;

  svg {
    color: #514FE4;
    font-size: 0.9rem;
  }
`;

const PaymentSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid ${props => props.selected ? '#514FE4' : '#eee'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  &:hover {
    border-color: #514FE4;
  }
`;

const AgreementSection = styled.div`
  margin-bottom: 32px;
`;

const Agreement = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
  }
`;

const SecurityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;

  svg {
    color: #514FE4;
  }
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 8px;
`;

const TotalLabel = styled.span`
  font-weight: 600;
`;

const TotalPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #514FE4;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4340c0;
    transform: translateY(-1px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const CouponSection = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
`;

const CouponInputWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CouponInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #514FE4;
  }
`;

const ApplyButton = styled.button`
  padding: 0.75rem 2rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4340c0;
  }
`;

const AppliedCoupon = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
`;

const CouponName = styled.span`
  font-weight: 500;
`;

const CouponDiscount = styled.span`
  color: #514FE4;
  font-weight: 600;
`;

const Description = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 12px 0;
`;

export default Payment; 