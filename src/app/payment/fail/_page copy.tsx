'use client';

import { useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { Suspense } from 'react';

const FailContent = () => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <Container>
      <Title>결제에 실패했습니다</Title>
      <ErrorMessage>
        {errorCode && <ErrorCode>에러 코드: {errorCode}</ErrorCode>}
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </ErrorMessage>
      <Button onClick={() => window.location.href = '/'}>
        홈으로 돌아가기
      </Button>
    </Container>
  );
};

const FailPage = () => {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <FailContent />
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
  color: #dc3545;
`;

const ErrorMessage = styled.div`
  background: #fff5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const ErrorCode = styled.div`
  color: #dc3545;
  margin-bottom: 10px;
`;

const ErrorText = styled.div`
  color: #666;
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

export default FailPage;