import React from 'react';
import styled from 'styled-components';

const ApiSettings = () => {
  return (
    <Container>
      <Title>API 설정</Title>
      <Section>
        <h2>쿠팡 파트너스 API 설정</h2>
        <ApiForm>
          <InputGroup>
            <label>Access Key</label>
            <input type="text" placeholder="Access Key를 입력하세요" />
          </InputGroup>
          <InputGroup>
            <label>Secret Key</label>
            <input type="password" placeholder="Secret Key를 입력하세요" />
          </InputGroup>
          <SaveButton>저장하기</SaveButton>
        </ApiForm>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  color: #333;
`;

const Section = styled.section`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  h2 {
    margin-bottom: 24px;
    color: #333;
  }
`;

const ApiForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: bold;
    color: #495057;
  }

  input {
    padding: 12px;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #514FE4;
    }
  }
`;

const SaveButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background: #4340c0;
  }
`;

export default ApiSettings; 