'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { Suspense } from 'react';

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (paymentKey && orderId && amount) {
      setPaymentInfo({
        paymentKey,
        orderId,
        amount: parseInt(amount),
      });
    }
  }, [searchParams]);

  return (
    <Container>
      <Title>결제가 완료되었습니다</Title>
      {paymentInfo && (
        <PaymentInfo>
          <InfoItem>
            <Label>주문번호</Label>
            <Value>{paymentInfo.orderId}</Value>
          </InfoItem>
          <InfoItem>
            <Label>결제금액</Label>
            <Value>{paymentInfo.amount.toLocaleString()}원</Value>
          </InfoItem>
        </PaymentInfo>
      )}
      <Button onClick={() => window.location.href = '/'}>
        홈으로 돌아가기
      </Button>
    </Container>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <SuccessContent />
    </Suspense>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 100px auto;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 30px;
`;

const PaymentInfo = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Label = styled.span`
  color: #666;
`;

const Value = styled.span`
  font-weight: bold;
`;

const Button = styled.button`
  background: #0066ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #0052cc;
  }
`;

export default SuccessPage;