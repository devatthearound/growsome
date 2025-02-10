"use client"
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PaymentCompletePage() {
  const router = useRouter();

  const goToPurchaseHistory = () => {
    // 마이페이지의 구매내역 탭으로 이동
    router.push('/mypage?tab=purchases');
  };

  return (
    <Container>
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SuccessIcon>✓</SuccessIcon>
        <Title>결제가 완료되었습니다!</Title>
        <Description>
          결제 내역은 마이페이지에서 확인하실 수 있습니다.
        </Description>
        <ButtonGroup>
          <Button onClick={goToPurchaseHistory}>
            구매내역 확인하기
          </Button>
          <SecondaryButton onClick={() => router.push('/')}>
            홈으로 돌아가기
          </SecondaryButton>
        </ButtonGroup>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ContentWrapper = styled(motion.div)`
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #4F46E5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 32px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Button = styled.button`
  background: #4F46E5;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4338CA;
  }
`;

const SecondaryButton = styled(Button)`
  background: #F3F4F6;
  color: #4B5563;

  &:hover {
    background: #E5E7EB;
  }
`; 