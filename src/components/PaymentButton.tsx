'use client';

import { useState } from 'react';
import { load } from '@tosspayments/payment-sdk';
import styled from 'styled-components';
import { Product } from '@/types/product';

interface PaymentButtonProps {
  product: Product;
}

const PaymentButton = ({ product }: PaymentButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // 토스 페이먼츠 초기화
      const tossPayments = await load(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);
      
      // 결제 요청
      await tossPayments.requestPayment('카드', {
        amount: product.price,
        orderId: `${product.id}_${Date.now()}`,
        orderName: product.name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading}
    >
      {isLoading ? '결제 처리 중...' : '결제하기'}
    </Button>
  );
};

const Button = styled.button`
  background: #0066ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background: #0052cc;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export default PaymentButton; 