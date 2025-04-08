'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { processPayment } from '@/services/tossPaymentService';
import { validateCoupon } from '@/services/couponService';
import { useAuth } from '../contexts/AuthContext';
import { getProductData } from '../../lib/getProductData';

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
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          throw new Error('상품 ID가 필요합니다.');
        }
        const data = await getProductData(productId);
        if (!data) {
          throw new Error('상품을 찾을 수 없습니다.');
        }
        setProduct(data);
      } catch (err: any) {
        console.error('상품 정보 로딩 중 에러:', err);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  useEffect(() => {
    // 로그인 상태 확인
    if (!user && !loading) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect_to=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router]);

  const handlePayment = useCallback(async () => {
    if (!user) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect_to=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!agreed) {
      alert('구매조건 확인 및 결제진행 동의가 필요합니다.');
      return;
    }

    console.log(user);
    try {
      const customerInfo = {
        customerId: user.id.toString(),
        email: user.email,
        phoneNumber: user.phone_number
      };

      await processPayment(
        {
          productPlanId: parseInt(productId || '0'),
          quantity: 1,
          couponCode: appliedCoupon?.code || undefined,
          customerInfo,
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
    
    setApplyingCoupon(true);
    setCouponError(null);

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
      setDiscountAmount(coupon.discountAmount);
    } catch (error: any) {
      alert(error.message || '쿠폰 적용 중 오류가 발생했습니다.');
      setCouponCode('');
      setCouponError(error.message);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const calculateDiscountPercentage = (originalPrice: number, discountAmount: number) => {
    return ((discountAmount / originalPrice) * 100).toFixed(1);
  };

  // 결제 금액 계산 로직 추가
  const calculateFinalAmount = () => {
    const price = parseInt(product.price.replace(/,/g, ''));
    const couponDiscount = appliedCoupon?.discount || 0;
    return price - couponDiscount;
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

  const finalAmount = calculateFinalAmount();

  return (
    <PaymentPage>
      <Container>
        <Title>결제하기</Title>
        <SubTitle>안전한 결제를 위해 SSL 보안 인증을 사용합니다</SubTitle>

        <Grid>
          <OrderSection>
            <SectionTitle>주문 내역</SectionTitle>
            <ProductInfo>
              <ProductName>{product.title}</ProductName>
              <PriceInfo>
                <OriginalPrice>{product.originPrice.toLocaleString()}원</OriginalPrice>
                {product.discountAmount > 0 && (
                  <DiscountBadge>
                    {calculateDiscountPercentage(
                      parseInt(product.originPrice.replace(/,/g, '')), 
                      product.discountAmount
                    )}% 할인
                  </DiscountBadge>
                )}
                <FinalPrice>{product.price.toLocaleString()}원</FinalPrice>
              </PriceInfo>
              <Description>{product.description}</Description>
              {product.features && (
                <Features>
                  {product.features.map((feature: string, index: number) => (
                    <Feature key={index}>
                      <FontAwesomeIcon icon={faCheck} />
                      {feature}
                    </Feature>
                  ))}
                </Features>
              )}
            </ProductInfo>
          </OrderSection>

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
                <div>{product.originPrice.toLocaleString()}원</div>
                {product.discountAmount > 0 && (
                  <>
                    <TotalLabel>상품 할인</TotalLabel>
                    <div>-{(product.originPrice - product.price).toLocaleString()}원</div>
                  </>
                )}
                {appliedCoupon && (
                  <>
                    <TotalLabel>쿠폰 할인</TotalLabel>
                    <div>-{appliedCoupon.discount.toLocaleString()}원</div>
                  </>
                )}
                <TotalLabel>최종 결제 금액</TotalLabel>
                <TotalPrice>{finalAmount.toLocaleString()}원</TotalPrice>
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
                <ApplyButton
                  onClick={handleCouponApply}
                  disabled={applyingCoupon}
                >
                  {applyingCoupon ? '적용 중...' : '적용하기'}
                </ApplyButton>
              </CouponInputWrapper>
              {couponError && <ErrorMessage>{couponError}</ErrorMessage>}
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
        </Grid>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 28px;
  margin-bottom: 10px;
`;

const SubTitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 20px;
`;

const OrderSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const ProductInfo = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ProductName = styled.h3`
  font-size: 20px;
  margin-bottom: 15px;
`;

const PriceInfo = styled.div`
  margin-bottom: 20px;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  margin-right: 10px;
`;

const DiscountBadge = styled.span`
  background: #ff4b4b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 10px;
`;

const FinalPrice = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #4a4fff;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
`;

const PaymentSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;

  svg {
    color: #4a4fff;
  }
`;

export default Payment;