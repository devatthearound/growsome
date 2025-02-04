'use client'

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

const Login = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [messages, setMessages] = useState({
    email: '',
    password: '',
    general: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setMessages({ ...messages, [name]: '', general: '' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessages({ ...messages, general: data.error || '로그인에 실패했습니다.' });
        return;
      }
      
      setUser(data.user);
      router.push('/');
    } catch (error) {
      console.error('로그인 에러:', error);
      setMessages({ ...messages, general: '로그인 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LeftPanel>
        <Logo>Growsome</Logo>
        <Tagline>당신도 AI직원을 통해 스마트해지세요.</Tagline>
      </LeftPanel>
      <RightPanel>
        <Form onSubmit={handleSubmit}>
          <Title>로그인</Title>
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
            <Checkbox
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            로그인 상태 유지
          </CheckboxLabel>

          {messages.general && <Message>{messages.general}</Message>}
          
          <SolidButton type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </SolidButton>
          
          <LinkGroup>
            <TextLink onClick={() => router.push('/forgot-password')}>
              비밀번호를 잊으셨나요?
            </TextLink>
            <TextLink onClick={() => router.push('/signup')}>
              아직 회원이 아니신가요? 회원가입 하러가기
            </TextLink>
          </LinkGroup>
        </Form>
      </RightPanel>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
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

  &:focus {
    outline: none;
    border-color: #514FE4;
  }
`;

const Message = styled.p`
  font-size: 0.9rem;
  color: red;
  margin-top: -0.5rem;
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

const SolidButton = styled.button`
  padding: 1rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #4340c0;
  }

  &:disabled {
    background: #a5a5a5;
    cursor: not-allowed;
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TextLink = styled.span`
  color: #514FE4;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;

  &:hover {
    color: #4340c0;
  }
`;

export default Login; 