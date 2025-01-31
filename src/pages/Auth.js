import React, { useState } from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

const Auth = ({ isPopup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [messages, setMessages] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Example validation logic
    if (name === 'email' && !value.includes('@')) {
      setMessages({ ...messages, email: '유효한 이메일을 입력하세요.' });
    } else {
      setMessages({ ...messages, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 로그인 처리 로직
    console.log('Login Data:', formData);
  };

  return (
    <AuthContainer>
      {!isPopup && (
        <LeftPanel>
          <Logo>Growsome</Logo>
          <Tagline>당신도 AI직원을 통해 스마트해지세요.</Tagline>
        </LeftPanel>
      )}
      <RightPanel>
        <Form onSubmit={handleSubmit}>
          <Title>개발팀 구독은 그릿지 먼저 로그인을 해주세요</Title>
          <Input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
          />
          {messages.email && <Message>{messages.email}</Message>}
          <Input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
          {messages.password && <Message>{messages.password}</Message>}
          <CheckboxLabel>
            <Checkbox type="checkbox" />
            자동 로그인
          </CheckboxLabel>
          <Button type="submit">로그인</Button>
          <Options>
            <StyledLink>이메일 찾기</StyledLink> | <StyledLink>비밀번호 찾기</StyledLink>
          </Options>
          <SignUpPrompt>
            아직 그로우썸 회원이 아니신가요? <RouterLink to="/signup">회원가입하기</RouterLink>
          </SignUpPrompt>
        </Form>
      </RightPanel>
    </AuthContainer>
  );
};

const AuthContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const LeftPanel = styled.div`
  flex: 1;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  color: #514FE4;
  margin-bottom: 1rem;
`;

const Tagline = styled.p`
  font-size: 1.2rem;
  color: #333;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Form = styled.form`
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #514FE4;
  }
`;

const Message = styled.p`
  font-size: 0.9rem;
  color: red;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #333;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
`;

const Button = styled.button`
  padding: 1rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;

  &:hover {
    background: #4340c0;
  }
`;

const Options = styled.div`
  text-align: center;
  color: #514FE4;
  margin-top: 1rem;
`;

const SignUpPrompt = styled.div`
  text-align: center;
  color: #333;
  margin-top: 1rem;
`;

const StyledLink = styled.span`
  color: #514FE4;
  cursor: pointer;
  text-decoration: underline;
`;

export default Auth; 