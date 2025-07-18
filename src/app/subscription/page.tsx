'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faShoppingCart, faCreditCard, faUser, faBuilding, faStar, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

interface ServiceItem {
  id: string;
  name: string;
  category: 'ai-development' | 'data-operation' | 'brand-building';
  price: number;
  originalPrice?: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

interface CartItem extends ServiceItem {
  quantity: number;
}

const Subscription = () => {
  const [activeCategory, setActiveCategory] = useState<'ai-development' | 'data-operation' | 'brand-building'>('ai-development');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<'select' | 'cart' | 'checkout' | 'payment'>('select');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const router = useRouter();

  const services: ServiceItem[] = [
    // AI 개발 서비스 (실제 견적 기준)
    {
      id: 'ai-mvp',
      name: 'AI MVP 개발',
      category: 'ai-development',
      price: 10000000,
      originalPrice: 15000000,
      duration: '6주',
      features: [
        'Next.js + Supabase 풀스택 개발',
        'AI API 통합 및 확장성 보장',
        'CMS 시스템 구축',
        'AWS 인프라 및 배포',
        'Microsoft Clarity + GA4 설정',
        '1개월 무상 오류 수정',
        '월 35만원부터 운영 지원'
      ]
    },
    {
      id: 'ai-full',
      name: 'AI 풀서비스 + Fast Track',
      category: 'ai-development',
      price: 13000000,
      originalPrice: 22500000,
      duration: '4주',
      features: [
        'AI MVP 모든 항목 포함',
        'Fast Track 개발 (4-5주 완성)',
        '통합 로그인(SSO) 연동',
        'n8n 콘텐츠 자동화 시스템',
        '데이터 기반 최적화 컨설팅',
        'A/B 테스트 설계',
        '3개월 무료 기술지원'
      ],
      popular: true
    },
    {
      id: 'ai-enterprise',
      name: 'AI 엔터프라이즈',
      category: 'ai-development',
      price: 20000000,
      originalPrice: 35000000,
      duration: '8주',
      features: [
        'AI 풀서비스 모든 항목 포함',
        '맞춤형 AI 모델 개발',
        '마케팅 자동화 시스템',
        '실시간 데이터 대시보드',
        '월간 성과 분석 리포트',
        '브랜드 전략 컨설팅',
        '6개월 무료 기술지원'
      ]
    },
    // 데이터 운영 서비스
    {
      id: 'data-starter',
      name: '데이터 스타터',
      category: 'data-operation',
      price: 2000000,
      duration: '초기 구축',
      features: [
        'GA4 설정 및 최적화',
        '기본 KPI 대시보드',
        '월간 데이터 리포트',
        '기본 전환율 분석',
        '월 1회 컨설팅',
        '+ 월 450,000원 운영비'
      ]
    },
    {
      id: 'data-pro',
      name: '데이터 프로',
      category: 'data-operation',
      price: 3500000,
      duration: '초기 구축',
      features: [
        '데이터 스타터 모든 항목 포함',
        '사용자 행동 분석 (히트맵)',
        'A/B 테스트 설계 및 분석',
        '실시간 알림 시스템',
        '주간 성과 리뷰',
        '맞춤형 개선 제안',
        '+ 월 750,000원 운영비'
      ],
      popular: true
    },
    {
      id: 'data-enterprise',
      name: '데이터 엔터프라이즈',
      category: 'data-operation',
      price: 6000000,
      duration: '초기 구축',
      features: [
        '데이터 프로 모든 항목 포함',
        '예측 분석 모델링',
        '통합 데이터 웨어하우스',
        '실시간 성과 대시보드',
        '데이터 팀 교육',
        '24시간 모니터링',
        '+ 월 1,200,000원 운영비'
      ]
    },
    // 브랜드 구축 서비스
    {
      id: 'brand-basic',
      name: '브랜딩 베이직',
      category: 'brand-building',
      price: 1500000,
      duration: '2주',
      features: [
        '로고 디자인 (3안 제시)',
        '브랜드 컬러 팔레트',
        '폰트 가이드라인',
        '명함 디자인',
        '브랜드 가이드북 (20페이지)'
      ]
    },
    {
      id: 'brand-pro',
      name: '브랜딩 프로',
      category: 'brand-building',
      price: 3500000,
      originalPrice: 4500000,
      duration: '4주',
      features: [
        '브랜딩 베이직 모든 항목 포함',
        '브랜드 스토리텔링 전략',
        '마케팅 콘텐츠 템플릿 (10종)',
        '소셜미디어 브랜딩 키트',
        '패키징 디자인 (1종)',
        '브랜드 적용 사례 목업'
      ],
      popular: true
    },
    {
      id: 'brand-enterprise',
      name: '브랜딩 엔터프라이즈',
      category: 'brand-building',
      price: 6000000,
      originalPrice: 8000000,
      duration: '6주',
      features: [
        '브랜딩 프로 모든 항목 포함',
        '브랜드 전략 컨설팅',
        '경쟁사 분석 리포트',
        '사무용품 일체 디자인',
        '웹사이트 브랜딩 적용',
        '브랜드 런칭 지원'
      ]
    }
  ];

  const categories = {
    'ai-development': { name: 'AI 개발', icon: '🤖' },
    'data-operation': { name: '데이터 운영', icon: '📊' },
    'brand-building': { name: '브랜드 구축', icon: '🎨' }
  };

  const filteredServices = services.filter(service => service.category === activeCategory);

  const addToCart = (service: ServiceItem) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
  };

  const removeFromCart = (serviceId: string) => {
    setCart(cart.filter(item => item.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === serviceId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getOriginalTotalPrice = () => {
    return cart.reduce((total, item) => {
      const originalPrice = item.originalPrice || item.price;
      return total + (originalPrice * item.quantity);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = () => {
    // 주문 처리 로직
    console.log('주문 정보:', {
      cart,
      customerInfo,
      totalPrice: getTotalPrice()
    });
    setStep('payment');
  };

  const renderServiceSelection = () => (
    <>
      <PageHeader>
        <HeaderTitle>AI + 데이터 + 자동화로 완성하는<br/>월 매출 1억 서비스</HeaderTitle>
        <HeaderSubtitle>정상가 2,250만원 → 파트너 할인 1,000만원 (55% 절약)<br/>더 이상 6개월 기다리지 마세요. 6주만에 완성합니다.</HeaderSubtitle>
      </PageHeader>

      <CategoryTabs>
        {Object.entries(categories).map(([key, category]) => (
          <CategoryTab
            key={key}
            $active={activeCategory === key}
            onClick={() => setActiveCategory(key as any)}
          >
            <TabIcon>{category.icon}</TabIcon>
            <TabText>{category.name}</TabText>
          </CategoryTab>
        ))}
      </CategoryTabs>

      <ServicesGrid>
        {filteredServices.map(service => (
          <ServiceCard key={service.id} $popular={service.popular}>
            {service.popular && <PopularBadge><FontAwesomeIcon icon={faStar} /> 인기</PopularBadge>}
            
            <ServiceHeader>
              <ServiceName>{service.name}</ServiceName>
              <ServiceDuration>{service.duration}</ServiceDuration>
            </ServiceHeader>

            <ServicePricing>
              {service.originalPrice && (
                <OriginalPrice>₩{formatPrice(service.originalPrice)}</OriginalPrice>
              )}
              <ServicePrice>₩{formatPrice(service.price)}</ServicePrice>
              {service.originalPrice && (
                <DiscountBadge>
                  {Math.round((1 - service.price / service.originalPrice) * 100)}% 할인
                </DiscountBadge>
              )}
            </ServicePricing>

            <ServiceFeatures>
              {service.features.map((feature, index) => (
                <FeatureItem key={index}>
                  <FontAwesomeIcon icon={faCheck} />
                  {feature}
                </FeatureItem>
              ))}
            </ServiceFeatures>

            <AddToCartButton onClick={() => addToCart(service)}>
              <FontAwesomeIcon icon={faShoppingCart} />
              장바구니 담기
            </AddToCartButton>
          </ServiceCard>
        ))}
      </ServicesGrid>

      {cart.length > 0 && (
        <FloatingCart onClick={() => setStep('cart')}>
          <CartIcon>
            <FontAwesomeIcon icon={faShoppingCart} />
            <CartBadge>{cart.length}</CartBadge>
          </CartIcon>
          <CartText>장바구니 보기</CartText>
          <CartTotal>₩{formatPrice(getTotalPrice())}</CartTotal>
        </FloatingCart>
      )}
    </>
  );

  const renderCart = () => (
    <>
      <PageHeader>
        <HeaderTitle>장바구니</HeaderTitle>
        <HeaderSubtitle>선택한 서비스를 확인하고 수량을 조정하세요</HeaderSubtitle>
      </PageHeader>

      {cart.length === 0 ? (
        <EmptyCart>
          <EmptyCartIcon>🛒</EmptyCartIcon>
          <EmptyCartText>장바구니가 비어있습니다</EmptyCartText>
          <BackButton onClick={() => setStep('select')}>서비스 선택하기</BackButton>
        </EmptyCart>
      ) : (
        <CartContainer>
          <CartItems>
            {cart.map(item => (
              <CartItem key={item.id}>
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemDuration>{item.duration}</ItemDuration>
                  <ItemFeatures>
                    {item.features.slice(0, 3).map((feature, index) => (
                      <span key={index}>• {feature}</span>
                    ))}
                    {item.features.length > 3 && <span>외 {item.features.length - 3}개</span>}
                  </ItemFeatures>
                </ItemInfo>
                
                <ItemControls>
                  <QuantityControls>
                    <QuantityButton onClick={() => updateQuantity(item.id, -1)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </QuantityButton>
                    <QuantityDisplay>{item.quantity}</QuantityDisplay>
                    <QuantityButton onClick={() => updateQuantity(item.id, 1)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </QuantityButton>
                  </QuantityControls>
                  
                  <ItemPrice>
                    {item.originalPrice && (
                      <OriginalItemPrice>₩{formatPrice(item.originalPrice * item.quantity)}</OriginalItemPrice>
                    )}
                    <CurrentItemPrice>₩{formatPrice(item.price * item.quantity)}</CurrentItemPrice>
                  </ItemPrice>
                  
                  <RemoveButton onClick={() => removeFromCart(item.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </RemoveButton>
                </ItemControls>
              </CartItem>
            ))}
          </CartItems>

          <CartSummary>
            <SummaryRow>
              <SummaryLabel>상품 금액</SummaryLabel>
              <SummaryValue>₩{formatPrice(getOriginalTotalPrice())}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>할인 금액</SummaryLabel>
              <SummaryValue $discount>-₩{formatPrice(getOriginalTotalPrice() - getTotalPrice())}</SummaryValue>
            </SummaryRow>
            <SummaryDivider />
            <SummaryRow $total>
              <SummaryLabel>총 결제 금액</SummaryLabel>
              <SummaryValue>₩{formatPrice(getTotalPrice())}</SummaryValue>
            </SummaryRow>
          </CartSummary>

          <CartActions>
            <BackButton onClick={() => setStep('select')}>서비스 더 보기</BackButton>
            <CheckoutButton onClick={() => setStep('checkout')}>주문하기</CheckoutButton>
          </CartActions>
        </CartContainer>
      )}
    </>
  );

  const renderCheckout = () => (
    <>
      <PageHeader>
        <HeaderTitle>주문 정보 입력</HeaderTitle>
        <HeaderSubtitle>서비스 제공을 위한 정보를 입력해주세요</HeaderSubtitle>
      </PageHeader>

      <CheckoutContainer>
        <CheckoutForm>
          <FormSection>
            <SectionTitle>
              <FontAwesomeIcon icon={faUser} />
              고객 정보
            </SectionTitle>
            
            <FormGroup>
              <Label>이름 *</Label>
              <Input
                type="text"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="이름을 입력해주세요"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>이메일 *</Label>
              <Input
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="이메일을 입력해주세요"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>연락처 *</Label>
              <Input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="연락처를 입력해주세요"
                required
              />
            </FormGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FontAwesomeIcon icon={faBuilding} />
              회사 정보
            </SectionTitle>
            
            <FormGroup>
              <Label>회사명</Label>
              <Input
                type="text"
                value={customerInfo.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="회사명을 입력해주세요 (선택사항)"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>프로젝트 요구사항</Label>
              <Textarea
                value={customerInfo.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="프로젝트에 대한 요구사항이나 특별한 사항이 있으시면 입력해주세요"
                rows={4}
              />
            </FormGroup>
          </FormSection>
        </CheckoutForm>

        <OrderSummary>
          <SummaryTitle>주문 요약</SummaryTitle>
          
          {cart.map(item => (
            <SummaryItem key={item.id}>
              <SummaryItemName>{item.name}</SummaryItemName>
              <SummaryItemDetail>
                {item.duration} × {item.quantity}
              </SummaryItemDetail>
              <SummaryItemPrice>₩{formatPrice(item.price * item.quantity)}</SummaryItemPrice>
            </SummaryItem>
          ))}
          
          <SummaryDivider />
          
          <SummaryTotal>
            <SummaryLabel>총 결제 금액</SummaryLabel>
            <SummaryValue>₩{formatPrice(getTotalPrice())}</SummaryValue>
          </SummaryTotal>
          
          <CheckoutActions>
            <BackButton onClick={() => setStep('cart')}>장바구니로</BackButton>
            <SubmitButton 
              onClick={handleSubmitOrder}
              disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
            >
              <FontAwesomeIcon icon={faCreditCard} />
              주문 완료
            </SubmitButton>
          </CheckoutActions>
        </OrderSummary>
      </CheckoutContainer>
    </>
  );

  const renderPayment = () => (
    <PaymentSuccess>
      <SuccessIcon>✅</SuccessIcon>
      <SuccessTitle>주문이 완료되었습니다!</SuccessTitle>
      <SuccessMessage>
        고객님의 주문을 접수했습니다.<br/>
        24시간 내에 담당자가 연락드려 상세한 상담을 진행하겠습니다.
      </SuccessMessage>
      
      <OrderInfo>
        <InfoTitle>주문 정보</InfoTitle>
        <InfoItem>
          <InfoLabel>고객명:</InfoLabel>
          <InfoValue>{customerInfo.name}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>이메일:</InfoLabel>
          <InfoValue>{customerInfo.email}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>연락처:</InfoLabel>
          <InfoValue>{customerInfo.phone}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>총 금액:</InfoLabel>
          <InfoValue>₩{formatPrice(getTotalPrice())}</InfoValue>
        </InfoItem>
      </OrderInfo>
      
      <PaymentActions>
        <HomeButton onClick={() => router.push('/')}>홈으로</HomeButton>
        <ServicesButton onClick={() => router.push('/services')}>서비스 상세보기</ServicesButton>
      </PaymentActions>
    </PaymentSuccess>
  );

  return (
    <SubscriptionContainer>
      <ProgressBar>
        <ProgressStep $active={step === 'select'}>
          <StepNumber $completed={step !== 'select'}>1</StepNumber>
          <StepLabel>서비스 선택</StepLabel>
        </ProgressStep>
        <ProgressLine $completed={step !== 'select'} />
        <ProgressStep $active={step === 'cart'}>
          <StepNumber $completed={step === 'checkout' || step === 'payment'}>2</StepNumber>
          <StepLabel>장바구니</StepLabel>
        </ProgressStep>
        <ProgressLine $completed={step === 'checkout' || step === 'payment'} />
        <ProgressStep $active={step === 'checkout'}>
          <StepNumber $completed={step === 'payment'}>3</StepNumber>
          <StepLabel>주문 정보</StepLabel>
        </ProgressStep>
        <ProgressLine $completed={step === 'payment'} />
        <ProgressStep $active={step === 'payment'}>
          <StepNumber $completed={false}>4</StepNumber>
          <StepLabel>완료</StepLabel>
        </ProgressStep>
      </ProgressBar>

      <ContentArea>
        {step === 'select' && renderServiceSelection()}
        {step === 'cart' && renderCart()}
        {step === 'checkout' && renderCheckout()}
        {step === 'payment' && renderPayment()}
      </ContentArea>
    </SubscriptionContainer>
  );
};

// 스타일드 컴포넌트들
const SubscriptionContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding-top: 2rem;
`;

const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  padding: 0 2rem;
`;

const ProgressStep = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const StepNumber = styled.div<{ $completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.$completed ? '#514FE4' : '#e9ecef'};
  color: ${props => props.$completed ? 'white' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
`;

const StepLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const ProgressLine = styled.div<{ $completed: boolean }>`
  width: 80px;
  height: 2px;
  background: ${props => props.$completed ? '#514FE4' : '#e9ecef'};
  margin: 0 1rem;
`;

const ContentArea = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const HeaderSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 2rem;
  background: ${props => props.$active ? '#514FE4' : 'white'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: 2px solid ${props => props.$active ? '#514FE4' : '#e9ecef'};
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const TabIcon = styled.span`
  font-size: 2rem;
`;

const TabText = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ServiceCard = styled.div<{ $popular?: boolean }>`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  position: relative;
  border: ${props => props.$popular ? '3px solid #514FE4' : 'none'};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -10px;
  right: 20px;
  background: #514FE4;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  
  svg {
    margin-right: 0.3rem;
  }
`;

const ServiceHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const ServiceName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ServiceDuration = styled.span`
  background: #f8f9fa;
  color: #666;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ServicePricing = styled.div`
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const OriginalPrice = styled.span`
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
`;

const ServicePrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #514FE4;
`;

const DiscountBadge = styled.span`
  background: #ff4757;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  color: #333;
  font-size: 0.95rem;
  
  svg {
    color: #514FE4;
    font-size: 0.8rem;
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4340c0;
    transform: translateY(-2px);
  }
`;

const FloatingCart = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 60px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(81, 79, 228, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(81, 79, 228, 0.5);
  }
`;

const CartIcon = styled.div`
  position: relative;
  font-size: 1.2rem;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
`;

const CartText = styled.span`
  font-weight: 600;
`;

const CartTotal = styled.span`
  font-weight: 700;
  font-size: 1.1rem;
`;

// Cart 페이지 스타일
const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyCartText = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: white;
  color: #514FE4;
  border: 2px solid #514FE4;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #514FE4;
    color: white;
  }
`;

const CartContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ItemDuration = styled.span`
  background: #f8f9fa;
  color: #666;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  display: inline-block;
`;

const ItemFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  
  span {
    font-size: 0.9rem;
    color: #666;
  }
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  background: white;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    border-color: #514FE4;
    color: #514FE4;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #333;
`;

const ItemPrice = styled.div`
  text-align: right;
  min-width: 120px;
`;

const OriginalItemPrice = styled.div`
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
  margin-bottom: 0.2rem;
`;

const CurrentItemPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #514FE4;
`;

const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  background: white;
  color: #ff4757;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #ff4757;
    color: white;
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SummaryRow = styled.div<{ $total?: boolean; $discount?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.$total ? '0' : '1rem'};
  font-size: ${props => props.$total ? '1.2rem' : '1rem'};
  font-weight: ${props => props.$total ? '700' : '500'};
  color: ${props => props.$total ? '#333' : '#666'};
`;

const SummaryLabel = styled.span``;

const SummaryValue = styled.span<{ $discount?: boolean }>`
  color: ${props => props.$discount ? '#ff4757' : 'inherit'};
  font-weight: 600;
`;

const SummaryDivider = styled.hr`
  border: none;
  height: 1px;
  background: #f0f0f0;
  margin: 1.5rem 0;
`;

const CartActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CheckoutButton = styled.button`
  flex: 1;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4340c0;
    transform: translateY(-2px);
  }
`;

// Checkout 페이지 스타일
const CheckoutContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CheckoutForm = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: #514FE4;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #514FE4;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #514FE4;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const SummaryItemName = styled.span`
  font-weight: 600;
  color: #333;
`;

const SummaryItemDetail = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const SummaryItemPrice = styled.span`
  font-weight: 600;
  color: #514FE4;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-top: 1rem;
`;

const CheckoutActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  background: ${props => props.disabled ? '#ccc' : '#514FE4'};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.disabled ? '#ccc' : '#4340c0'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

// Payment Success 페이지 스타일
const PaymentSuccess = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const OrderInfo = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: left;
`;

const InfoTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 0.8rem;
    border-top: 1px solid #f0f0f0;
    font-weight: 700;
  }
`;

const InfoLabel = styled.span`
  color: #666;
`;

const InfoValue = styled.span`
  color: #333;
  font-weight: 600;
`;

const PaymentActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const HomeButton = styled.button`
  background: white;
  color: #514FE4;
  border: 2px solid #514FE4;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #514FE4;
    color: white;
  }
`;

const ServicesButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4340c0;
    transform: translateY(-2px);
  }
`;

export default Subscription;