'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Check, CreditCard, Shield, Clock, Users, Star, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

// 포트원 스마트로 결제 설정
const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;

if (!storeId || !channelKey) {
  console.error('포트원 Store ID 또는 Channel Key가 설정되지 않았습니다.');
}

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  period: string;
  features: string[];
  popular?: boolean;
  description: string;
  monthlyPrice: number;
}

const plans: PaymentPlan[] = [
  {
    id: '4',
    name: '베이직 솔루션',
    price: 300000,
    originalPrice: 500000,
    period: '1주',
    monthlyPrice: 25000,
    description: '사업계획서 초안과 MVP 예시 아이디어를 통한 스타트업에 적합',
    features: [
      '40만원 상당의 강의 무료 제공',
      '사업계획서 초안 원본 제공',
      '대화한 챗GPTs 모두 제공',
      '빌드업 마케팅 전자책 제공'
    ]
  },
  {
    id: '5',
    name: '스탠다드 솔루션',
    price: 990000,
    originalPrice: 1500000,
    period: '2주',
    monthlyPrice: 82500,
    description: '10페이지 내의 사업계획서 초안과 러버블 목업 제작 지원',
    features: [
      '기본 패키지의 모든 혜택 포함',
      '러버블 목업 제작 지원',
      '실제 개발 연계 시 30% 할인',
      '우선순위 지원'
    ],
    popular: true
  },
  {
    id: '6',
    name: '프리미엄 솔루션',
    price: 9900000,
    originalPrice: 15000000,
    period: '4주',
    monthlyPrice: 825000,
    description: '프로젝트 제작까지 완료한 완전한 솔루션에 적합',
    features: [
      '스탠다드 패키지의 모든 혜택 포함',
      '프로젝트 제작 완료까지 지원',
      '무제한 페이지 작성'
    ]
  }
];

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const productId = searchParams.get('product_id') || '5'; // 기본값은 스탠다드 솔루션
  
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>(() => {
    const plan = plans.find(p => p.id === productId);
    return plan || plans[1]; // 기본값은 스탠다드 솔루션
  });
  const [portOneReady, setPortOneReady] = useState(false);
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

  // 포트원 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && window.PortOne) {
      setPortOneReady(true);
    }
  }, []);

  // 포트원 스크립트 로드 콜백
  const handlePortOneLoad = () => {
    if (window.PortOne) {
      setPortOneReady(true);
    }
  };

  // 이메일 형식 검증 함수
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 전화번호 형식 정리 함수
  const formatPhoneNumber = (phone: string) => {
    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, '');
    // 010으로 시작하는 11자리 번호로 변환
    if (numbers.length === 11 && numbers.startsWith('010')) {
      return numbers;
    } else if (numbers.length === 10 && numbers.startsWith('10')) {
      return '0' + numbers;
    }
    return numbers;
  };

  // 스마트로 호환 주문번호 생성 함수 (영문자+숫자만)
  const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 8); // 6자리 랜덤 문자
    return `growsome${timestamp}${randomString}`.replace(/[^a-zA-Z0-9]/g, '').substring(0, 40); // 최대 40자로 제한
  };

  const handlePayment = async () => {
    if (!storeId || !channelKey) {
      alert('결제 시스템이 설정되지 않았습니다. 관리자에게 문의하세요.');
      return;
    }

    if (!portOneReady || !userInfo.name || !userInfo.email || !userInfo.phone) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    // 이메일 형식 검증
    if (!isValidEmail(userInfo.email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 전화번호 형식 검증
    const formattedPhone = formatPhoneNumber(userInfo.phone);
    if (formattedPhone.length !== 11) {
      alert('올바른 전화번호를 입력해주세요. (010-1234-5678 형식)');
      return;
    }

    setLoading(true);
    
    try {
      const orderId = generateOrderId();
      console.log('Generated Order ID:', orderId);
      
      // 포트원 결제 요청
      if (!window.PortOne) {
        throw new Error('PortOne SDK가 로드되지 않았습니다.');
      }
      
      const response = await window.PortOne.requestPayment({
        storeId: storeId?.replace(/'/g, ''), // 문자열에서 따옴표 제거
        channelKey: channelKey?.replace(/'/g, ''), // 문자열에서 따옴표 제거
        paymentId: orderId,
        orderName: `그로우썸 ${selectedPlan.name} - AI 사업계획서 작성 완성 솔루션`,
        totalAmount: finalPrice,
        currency: "KRW" as any,
        payMethod: "CARD",
        customer: {
          fullName: userInfo.name.trim(),
          phoneNumber: formattedPhone,
          email: userInfo.email.trim().toLowerCase(),
        },
        redirectUrl: window.location.origin + "/payment/success",
        noticeUrls: [
          window.location.origin + "/api/payments/webhook"
        ]
      });
      
      if (response.code != null) {
        // 결제 실패
        alert(`결제에 실패했습니다: ${response.message}`);
      } else {
        // 결제 성공
        alert('결제가 성공적으로 완료되었습니다!');
        router.push(`/payment/success?paymentId=${response.paymentId}&txId=${response.txId}`);
      }
    } catch (error) {
      console.error('결제 요청 실패:', error);
      alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 포트원(PortOne) SDK 로드 */}
      <Script 
        src="https://cdn.portone.io/v2/browser-sdk.js" 
        onLoad={handlePortOneLoad}
        strategy="beforeInteractive"
      />
      
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
            {/* 플랜 선택 섹션 */}
            <PlanSelectionSection>
              <SectionTitle>솔루션 선택</SectionTitle>
              <PlansGrid>
                {plans.map((plan) => {
                  const discountRate = Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100);
                  return (
                    <PlanSelectionCard
                      key={plan.id}
                      $selected={selectedPlan.id === plan.id}
                      $popular={plan.popular}
                      onClick={() => {
                        console.log('Selecting plan:', plan.id, plan.name);
                        setSelectedPlan(plan);
                      }}
                    >
                      {plan.popular && <PopularBadge>추천</PopularBadge>}
                      <PlanName>{plan.name}</PlanName>
                      <PlanDescription>{plan.description}</PlanDescription>
                      <PlanPricing>
                        <PlanPrice>
                          <span className="price">₩{plan.price.toLocaleString()}</span>
                          <span className="period">/{plan.period}</span>
                        </PlanPrice>
                        <OriginalPrice>₩{plan.originalPrice.toLocaleString()}</OriginalPrice>
                        <MonthlyPrice>월 {plan.monthlyPrice?.toLocaleString()}원 (12개월 할부시)</MonthlyPrice>
                      </PlanPricing>
                      <DiscountBadge>{discountRate}% 할인</DiscountBadge>
                      <PlanFeatures>
                        {plan.features.map((feature, index) => (
                          <FeatureItem key={index}>
                            <Check size={16} color="#10B981" />
                            {feature}
                          </FeatureItem>
                        ))}
                      </PlanFeatures>
                    </PlanSelectionCard>
                  );
                })}
              </PlansGrid>
            </PlanSelectionSection>

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
                  style={{
                    borderColor: userInfo.email && !isValidEmail(userInfo.email) ? '#ef4444' : undefined
                  }}
                />
              </InputGroup>
              <InputGroup>
                <Label>휴대폰 번호 *</Label>
                <Input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={userInfo.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // 자동 하이픈 추가
                    let formatted = value.replace(/[^0-9]/g, '');
                    if (formatted.length > 3 && formatted.length <= 7) {
                      formatted = formatted.replace(/(\d{3})(\d+)/, '$1-$2');
                    } else if (formatted.length > 7) {
                      formatted = formatted.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
                    }
                    if (formatted.length <= 13) { // 010-1234-5678 최대 길이
                      setUserInfo(prev => ({ ...prev, phone: formatted }));
                    }
                  }}
                  style={{
                    borderColor: userInfo.phone && formatPhoneNumber(userInfo.phone).length !== 11 ? '#ef4444' : undefined
                  }}
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
                  disabled={!portOneReady}
                />
                <label htmlFor="coupon">
                  <span>신규 가입 쿠폰 적용 (5,000원 할인)</span>
                </label>
              </CouponCheckbox>
            </CouponSection>

            <PaymentSection>
              <SectionTitle>결제 수단</SectionTitle>
              <PaymentMethodCard>
                <CreditCard size={24} color="#3b82f6" />
                <div>
                  <div style={{fontWeight: '600', color: '#1e293b'}}>신용카드 결제</div>
                  <div style={{fontSize: '0.875rem', color: '#64748b'}}>포트원 스마트로 보안 결제 시스템</div>
                </div>
              </PaymentMethodCard>
            </PaymentSection>

            <AgreementSection>
              <SectionTitle>이용약관</SectionTitle>
              <AgreementCard>
                <AgreementItem>
                  <input type="checkbox" id="agreement1" required />
                  <label htmlFor="agreement1">결제 서비스 이용약관에 동의합니다 (필수)</label>
                </AgreementItem>
                <AgreementItem>
                  <input type="checkbox" id="agreement2" required />
                  <label htmlFor="agreement2">개인정보 수집 및 이용에 동의합니다 (필수)</label>
                </AgreementItem>
              </AgreementCard>
            </AgreementSection>

            <PaymentButton
              onClick={handlePayment}
              disabled={!portOneReady || loading}
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
    </>
  );
}

// 스타일 컴포넌트들
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Header = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
  
  &:hover {
    background: #f1f5f9;
    color: #475569;
    border-color: #cbd5e1;
    transform: translateX(-2px);
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  background: linear-gradient(135deg, #5d4ac7, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 320px;
    gap: 2rem;
  }
  
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

const PlanSelectionSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 120px;
  height: fit-content;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 28px;
    background: linear-gradient(135deg, #5d4ac7, #8b5cf6);
    border-radius: 2px;
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding-top: 1rem;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PlanSelectionCard = styled.div<{ $selected: boolean; $popular?: boolean }>`
  background: white;
  border: 2px solid ${props => props.$selected ? '#5d4ac7' : '#e2e8f0'};
  border-radius: 16px;
  padding: 1.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  ${props => props.$selected && `
    border-color: #5d4ac7;
    background: linear-gradient(135deg, #faf9ff, #ffffff);
    box-shadow: 0 8px 25px rgba(93, 74, 199, 0.15);
    transform: translateY(-2px);
  `}
  
  &:hover {
    border-color: #5d4ac7;
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(93, 74, 199, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.$selected ? 
      'linear-gradient(90deg, #5d4ac7, #8b5cf6)' : 
      'transparent'};
    transition: background 0.3s ease;
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 1rem;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const PlanName = styled.h3`
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlanDescription = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const PlanPricing = styled.div`
  margin-bottom: 1rem;
`;

const PlanPrice = styled.div`
  margin-bottom: 0.5rem;
  
  .price {
    font-size: 2rem;
    font-weight: 800;
    color: #5d4ac7;
    background: linear-gradient(135deg, #5d4ac7, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .period {
    font-size: 1.125rem;
    color: #64748b;
    font-weight: 500;
  }
`;

const OriginalPrice = styled.div`
  font-size: 1rem;
  color: #94a3b8;
  text-decoration: line-through;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const MonthlyPrice = styled.div`
  font-size: 0.875rem;
  color: #5d4ac7;
  font-weight: 600;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(93, 74, 199, 0.08);
  border-radius: 8px;
  border: 1px solid rgba(93, 74, 199, 0.15);
`;

const DiscountBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 24px;
    height: 2px;
    background: linear-gradient(135deg, #5d4ac7, #8b5cf6);
    border-radius: 1px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fafafa;
  
  &:focus {
    outline: none;
    border-color: #5d4ac7;
    background: white;
    box-shadow: 0 0 0 3px rgba(93, 74, 199, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
  
  &:hover {
    border-color: #cbd5e1;
    background: white;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
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

const PaymentMethodCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
`;

const AgreementSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
`;

const AgreementCard = styled.div`
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f9fafb;
`;

const AgreementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #3b82f6;
  }
  
  label {
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
  }
`;

const PaymentButton = styled.button<{ $loading: boolean }>`
  width: 100%;
  padding: 1.25rem;
  background: ${props => props.$loading ? '#9ca3af' : 'linear-gradient(135deg, #5d4ac7, #8b5cf6)'};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: ${props => props.$loading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(93, 74, 199, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const SecurityNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const TrustSection = styled.div`
  background: white;
  padding: 2.5rem 2rem;
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  gap: 4rem;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #475569;
  font-weight: 600;
  
  svg {
    color: #10b981;
  }
`;
