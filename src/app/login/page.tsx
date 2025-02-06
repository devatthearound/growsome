'use client'

import React, { useCallback, useState, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { getCookie } from '@/app/utils/cookie';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser } = useAuth();
  const isExtension = searchParams.get('isExtension') === 'true';
  const [isChecking, setIsChecking] = useState(true);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
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

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
        setIsAlreadyLoggedIn(false);
        // 로그아웃 후 페이지 새로고침
        window.location.reload();
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  }, [setUser]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setMessages(prev => ({ ...prev, [name]: '', general: '' }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isExtension
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessages(prev => ({ ...prev, general: data.error || '로그인에 실패했습니다.' }));
        return;
      }
      setUser(data.user);
      
      if (!isExtension) {
        const redirectTo = searchParams.get('redirect_to') || '/';
        router.push(redirectTo);
      } else {
        window.location.href = `/auth/extension-callback?token=${data.token}`;
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setMessages(prev => ({ ...prev, general: '로그인 중 오류가 발생했습니다.' }));
    } finally {
      setIsLoading(false);
    }
  }, [formData, isExtension, router, setUser, searchParams]);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        const data = await response.json();

        if (response.ok && data.isLoggedIn) {
          setUser(data.user);
          
          if (isExtension) {
            // 토큰을 별도로 가져오기
            const tokenResponse = await fetch('/api/auth/token', {
              credentials: 'include'
            });
            const tokenData = await tokenResponse.json();

            if (tokenResponse.ok && tokenData.token) {
              console.log('Token retrieved successfully');
              window.location.href = `/auth/extension-callback?token=${tokenData.token}`;
              return;
            }
          } else {
            // 이미 로그인된 경우 원래 가려던 페이지로 리다이렉트
            const redirectTo = searchParams.get('redirect_to');
            if (redirectTo) {
              console.log('Redirecting to:', redirectTo);
              router.push(redirectTo);
              return;
            }
            // redirect_to가 없는 경우에만 isAlreadyLoggedIn 설정
            setIsAlreadyLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('인증 확인 오류:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [isExtension, setUser, router, searchParams]);

  // 로딩 중이거나 인증 체크 중일 때 표시할 내용
  if (isChecking) {
    return (
      <LoginContainer>
        <div className="flex items-center justify-center">
          <p>잠시만 기다려주세요...</p>
        </div>
      </LoginContainer>
    );
  }

  if (isAlreadyLoggedIn) {
    return (
      <LoginContainer>
        <AlreadyLoggedInPanel>
          <LoggedInMessage>
            <Title>이미 로그인되어 있습니다</Title>
            <UserInfo>
              <p><strong>이메일:</strong> {user?.email}</p>
              <p><strong>이름:</strong> {user?.username}</p>
            </UserInfo>
            <ButtonGroup>
              <SolidButton onClick={() => router.push('/')}>
                홈으로 가기
              </SolidButton>
              <OutlineButton onClick={handleLogout}>
                로그아웃
              </OutlineButton>
            </ButtonGroup>
          </LoggedInMessage>
        </AlreadyLoggedInPanel>
      </LoginContainer>
    );
  }

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
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p>로딩중...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

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

const AlreadyLoggedInPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoggedInMessage = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const UserInfo = styled.div`
  margin: 1.5rem 0;
  text-align: left;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;

  p {
    margin: 0.5rem 0;
    color: #333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const OutlineButton = styled(SolidButton)`
  background: transparent;
  border: 2px solid #514FE4;
  color: #514FE4;

  &:hover {
    background: #f0f0ff;
  }
`; 