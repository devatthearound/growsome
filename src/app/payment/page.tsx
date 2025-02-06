'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { processPayment } from '@/services/paymentService';
import { validateCoupon } from '@/services/couponService';
import { useAuth } from '../contexts/AuthContext';

// ?productId=123"
const PaymentContent = () => {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product_id');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          throw new Error('상품 ID가 필요합니다.');
        }

        const response = await fetch(`/api/products?productId=${productId}`);
        if (!response.ok) {
          throw new Error('상품 정보를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        if (!data.products?.[0]) {
          throw new Error('상품을 찾을 수 없습니다.');
        }

        const productData = data.products[0];
        setProduct({
          id: productData.id,
          title: productData.name,
          description: productData.description,
          price: productData.plans?.[0]?.price?.toLocaleString() || '가격 정보 없음',
          features: productData.plans?.[0]?.features?.features || [],
          image: productData.image || '',
          type: productData.plans?.[0]?.billing_type || 'one_time'
        });
      } catch (err: any) {
        console.error('상품 정보 로딩 중 에러:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handlePayment = useCallback(async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!agreed) {
      alert('구매조건 확인 및 결제진행 동의가 필요합니다.');
      return;
    }

    try {
      await processPayment(
        {
          productPlanId: 4,
          quantity: 1,
          couponCode: appliedCoupon?.code,
          customerInfo: {
            customerId: user.id.toString(),
            email: user.email,
            phoneNumber: user.phone_number
          }
        },
        product.title
      );

      alert('결제가 완료되었습니다.');
      router.push('/payment/complete');
    } catch (error: any) {
      console.error('결제 처리 중 오류가 발생했습니다:', error);
      alert(error.message || '결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  }, [user, agreed, appliedCoupon, product, router]);

  const handleCouponApply = async () => {
    if (!couponCode) {
      alert('쿠폰 코드를 입력해주세요.');
      return;
    }
    
    try {
      const { coupon } = await validateCoupon({
        code: couponCode,
        productId: product.id
      });

      setAppliedCoupon({
        code: coupon.code,
        discount: coupon.discountAmount,
        name: coupon.name
      });
      setCouponCode('');
    } catch (error: any) {
      alert(error.message || '쿠폰 적용 중 오류가 발생했습니다.');
      setCouponCode('');
    }
  };

  const calculateDiscountPercentage = (originalPrice: number, discountAmount: number) => {
    return ((discountAmount / originalPrice) * 100).toFixed(1);
  };

  // 결제 금액 계산 로직 추가
  const calculateFinalAmount = () => {
    const originalPrice = parseInt(product.price.replace(/,/g, ''));
    const discountAmount = appliedCoupon?.discount || 0;
    return originalPrice - discountAmount;
  };

  if (loading) {
    return (
      <PaymentPage>
        <Container>
          <div>로딩 중...</div>
        </Container>
      </PaymentPage>
    );
  }

  if (error || !product) {
    return (
      <PaymentPage>
        <Container>
          <div>
            {error || '상품 정보를 불러올 수 없습니다.'}
          </div>
        </Container>
      </PaymentPage>
    );
  }

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
              <h3>{product.title}</h3>
              <PriceWrapper>
                <OriginalPrice>{product.originalPrice?.toLocaleString() || 'N/A'}원</OriginalPrice>
                <Price>{product.price}원</Price>
              </PriceWrapper>
              {product.description && (
                <Description>{product.description}</Description>
              )}
              {product.features && (
                <FeatureList>
                  {product.features.map((feature: string, index: number) => (
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
              {/* <PaymentMethod
                selected={paymentMethod === 'kakaopay'}
                onClick={() => setPaymentMethod('kakaopay')}
              >
                <img src="/images/payment/kakaopay.png" alt="카카오페이" />
                카카오페이
              </PaymentMethod> */}
              <PaymentMethod
                selected={paymentMethod === 'card'}
                onClick={() => setPaymentMethod('card')}
              >
                {/* <img src="/images/payment/card.png" alt="신용카드" /> */}
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
              <div>
                <TotalLabel>정가</TotalLabel>
                <div>{product.price}원</div>
                {appliedCoupon && (
                  <>
                    <TotalLabel>할인 금액</TotalLabel>
                    <div>-{appliedCoupon.discount.toLocaleString()}원</div>
                    <TotalLabel>할인 퍼센트</TotalLabel>
                    <div>{calculateDiscountPercentage(parseInt(product.price.replace(/,/g, '')), appliedCoupon.discount)}%</div>
                  </>
                )}
                <TotalLabel>최종 결제 금액</TotalLabel>
                <TotalPrice>{calculateFinalAmount().toLocaleString()}원</TotalPrice>
              </div>
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

const Payment = () => {
  return (
    <Suspense fallback={
      <PaymentPage>
        <Container>
          <div>로딩 중...</div>
        </Container>
      </PaymentPage>
    }>
      <PaymentContent />
    </Suspense>
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

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const OriginalPrice = styled.span`
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
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

const PaymentMethod = styled.div<{ selected: boolean }>`
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
  height: auto;
  max-height: 150px;
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