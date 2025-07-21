'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { loadTossPayments, ANONYMOUS, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { Check, CreditCard, Shield, Clock, Users, Star, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  period: string;
  features: string[];
  popular?: boolean;
}

const plans: PaymentPlan[] = [
  {
    id: 'monthly',
    name: '월간 플랜',
    price: 39000,
    originalPrice: 99000,
    period: '월',
    features: [
      '전체 20강의 평생 무제한 시청',
      '실전 템플릿 & 체크리스트 제공',
      '전용 커뮤니티 및 Q&A 지원',
      '수료증 발급 (선택사항)',
      '1:1 무료 상담 1회'
    ]
  },
  {
    id: 'yearly',
    name: '연간 플랜',
    price: 299000,
    originalPrice: 1188000,
    period: '년',
    features: [
      '월간 플랜의 모든 혜택',
      '추가 2개월 무료 (총 14개월)',
      '우선 1:1 상담 지원',
      '전용 멘토링 세션 2회',
      '사업계획서 검토 서비스'
    ],
    popular: true
  }
];

export default function PaymentPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>(plans[0]);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // 할인율 계산
  const discountRate = Math.round(((selectedPlan.originalPrice - selectedPlan.price) / selectedPlan.originalPrice) * 100);
  const finalPrice = couponApplied ? selectedPlan.price - 5000 : selectedPlan.price;

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        setWidgets(widgets);
      } catch (error) {
        console.error('결제 위젯 초기화 실패:', error);
      }
    }

    fetchPaymentWidgets();
  }, [clientKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets) return;

      try {
        await widgets.setAmount({
          currency: "KRW",
          value: finalPrice,
        });

        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);

        setReady(true);
      } catch (error) {
        console.error('결제 위젯 렌더링 실패:', error);
      }
    }

    renderPaymentWidgets();
  }, [widgets, finalPrice]);

  const handlePayment = async () => {
    if (!widgets || !userInfo.name || !userInfo.email || !userInfo.phone) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const orderId = `growsome_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await widgets.requestPayment({
        orderId,
        orderName: `그로우썸 ${selectedPlan.name} - AI 사업계획서 작성 완성 솔루션`,
        successUrl: window.location.origin + "/payment/success",
        failUrl: window.location.origin + "/payment/fail",
        customerEmail: userInfo.email,
        customerName: userInfo.name,
        customerMobilePhone: userInfo.phone,
      });
    } catch (error) {
      console.error('결제 요청 실패:', error);
      alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={20} />
          뒤로가기
        </BackButton>
        <HeaderTitle>결제하기</HeaderTitle>
      </Header>

      <Content>
        <LeftSection>
          <PlanSection>
            <SectionTitle>플랜 선택</SectionTitle>
            <PlanGrid>
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  $selected={selectedPlan.id === plan.id}
                  $popular={plan.popular}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {plan.popular && <PopularBadge>인기</PopularBadge>}
                  <PlanName>{plan.name}</PlanName>
                  <PlanPrice>
                    <span className="price">₩{plan.price.toLocaleString()}</span>
                    <span className="period">/{plan.period}</span>
                  </PlanPrice>
                  <OriginalPrice>₩{plan.originalPrice.toLocaleString()}</OriginalPrice>
                  <DiscountBadge>{discountRate}% 할인</DiscountBadge>
                  <PlanFeatures>
                    {plan.features.map((feature, index) => (
                      <FeatureItem key={index}>
                        <Check size={16} color="#10B981" />
                        {feature}
                      </FeatureItem>
                    ))}
                  </PlanFeatures>
                </PlanCard>
              ))}
            </PlanGrid>
          </PlanSection>

          <UserInfoSection>
            <SectionTitle>결제자 정보</SectionTitle>
            <InputGroup>
              <Label>이름 *</Label>
              <Input
                type="text"
                placeholder="이름을 입력하세요"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </InputGroup>
            <InputGroup>
              <Label>이메일 *</Label>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </InputGroup>
            <InputGroup>
              <Label>휴대폰 번호 *</Label>
              <Input
                type="tel"
                placeholder="010-0000-0000"
                value={userInfo.phone}
                onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
            </InputGroup>
          </UserInfoSection>
        </LeftSection>

        <RightSection>
          <OrderSummary>
            <SectionTitle>주문 요약</SectionTitle>
            <SummaryItem>
              <span>선택한 플랜</span>
              <span>{selectedPlan.name}</span>
            </SummaryItem>
            <SummaryItem>
              <span>정가</span>
              <span>₩{selectedPlan.originalPrice.toLocaleString()}</span>
            </SummaryItem>
            <SummaryItem>
              <span>할인</span>
              <span className="discount">-₩{(selectedPlan.originalPrice - selectedPlan.price).toLocaleString()}</span>
            </SummaryItem>
            {couponApplied && (
              <SummaryItem>
                <span>쿠폰 할인</span>
                <span className="discount">-₩5,000</span>
              </SummaryItem>
            )}
            <Divider />
            <SummaryItem className="total">
              <span>총 결제금액</span>
              <span>₩{finalPrice.toLocaleString()}</span>
            </SummaryItem>
          </OrderSummary>

          <CouponSection>
            <CouponCheckbox>
              <input
                type="checkbox"
                id="coupon"
                checked={couponApplied}
                onChange={(e) => setCouponApplied(e.target.checked)}
                disabled={!ready}
              />
              <label htmlFor="coupon">
                <span>신규 가입 쿠폰 적용 (5,000원 할인)</span>
              </label>
            </CouponCheckbox>
          </CouponSection>

          <PaymentSection>
            <SectionTitle>결제 수단</SectionTitle>
            <PaymentWidget id="payment-method" />
          </PaymentSection>

          <AgreementSection>
            <SectionTitle>이용약관</SectionTitle>
            <AgreementWidget id="agreement" />
          </AgreementSection>

          <PaymentButton
            onClick={handlePayment}
            disabled={!ready || loading}
            $loading={loading}
          >
            {loading ? '결제 처리 중...' : `₩${finalPrice.toLocaleString()} 결제하기`}
          </PaymentButton>

          <SecurityNotice>
            <Shield size={16} />
            <span>모든 결제 정보는 SSL 암호화로 안전하게 보호됩니다.</span>
          </SecurityNotice>
        </RightSection>
      </Content>

      <TrustSection>
        <TrustItem>
          <Users size={24} />
          <span>47명 수강생</span>
        </TrustItem>
        <TrustItem>
          <Star size={24} />
          <span>4.9/5.0 만족도</span>
        </TrustItem>
        <TrustItem>
          <Clock size={24} />
          <span>24시간 지원</span>
        </TrustItem>
      </TrustSection>
    </Container>
  );
}

// 스타일 컴포넌트들
const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Header = styled.div`
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    color: #475569;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PlanSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
`;

const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const PlanCard = styled.div<{ $selected: boolean; $popular?: boolean }>`
  background: white;
  border: 2px solid ${props => props.$selected ? '#3b82f6' : '#e2e8f0'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    border-color: ${props => props.$selected ? '#3b82f6' : '#cbd5e1'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.$popular && `
    border-color: #f59e0b;
    background: linear-gradient(135deg, #fff7ed, #ffffff);
  `}
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -8px;
  right: 1rem;
  background: #f59e0b;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const PlanName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const PlanPrice = styled.div`
  margin-bottom: 0.5rem;
  
  .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
  }
  
  .period {
    font-size: 1rem;
    color: #64748b;
  }
`;

const OriginalPrice = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
  text-decoration: line-through;
  margin-bottom: 0.5rem;
`;

const DiscountBadge = styled.div`
  display: inline-block;
  background: #dc2626;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const UserInfoSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  
  &.total {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin-top: 0.5rem;
  }
  
  .discount {
    color: #dc2626;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1rem 0;
`;

const CouponSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
`;

const CouponCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #10b981;
  }
  
  label {
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
  }
`;

const PaymentSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const PaymentWidget = styled.div`
  min-height: 200px;
`;

const AgreementSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const AgreementWidget = styled.div`
  min-height: 150px;
`;

const PaymentButton = styled.button<{ $loading: boolean }>`
  width: 100%;
  padding: 1rem;
  background: ${props => props.$loading ? '#9ca3af' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.$loading ? '#9ca3af' : '#2563eb'};
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const SecurityNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
`;

const TrustSection = styled.div`
  background: white;
  padding: 2rem;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 3rem;
  border-top: 1px solid #e2e8f0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;