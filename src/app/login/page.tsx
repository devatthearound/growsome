'use client'

import React, { useCallback, useState, useEffect, Suspense, useRef } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, isLoggedIn, isLoading } = useAuth();
  const isExtension = searchParams.get('isExtension') === 'true';
  const formRef = useRef<HTMLFormElement>(null);
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

  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setUser(null);
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

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoginLoading) {
      // Enter 키를 누르면 submit 버튼 클릭
      e.preventDefault();
      const submitButton = formRef.current?.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton && !submitButton.disabled) {
        submitButton.click();
      }
    }
  }, [isLoginLoading]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoginLoading(true);
    
    console.log('🚀 로그인 시도:', {
      email: formData.email,
      rememberMe: formData.rememberMe
    });
    
    try {
      const redirectTo = searchParams.get('redirect_to') || '';


      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isExtension,
          callbackUrl: redirectTo
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setMessages(prev => ({ ...prev, general: data.message || '로그인에 실패했습니다.' }));
        return;
      }
      
      setUser(data.user);

      // 리다이렉트 URL이 있는 경우 해당 URL로 이동
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setMessages(prev => ({ ...prev, general: '로그인 중 오류가 발생했습니다.' }));
    } finally {
      setIsLoginLoading(false);
    }
  }, [formData, isExtension, router, setUser, searchParams]);

  useEffect(() => {
    const handleRedirect = async () => {
      // 'redirect_url' 파라미터가 있는 경우 해당 URL로 이동
      const redirectUrl = searchParams.get('redirect_to');
      if (redirectUrl && isLoggedIn) {
        try {
          if(redirectUrl.startsWith('coupas-auth://')) {
            const res = await fetch('/api/auth/redirect', {
              method: 'GET',
              credentials: 'include'
            });
            
            if (!res.ok) {
              throw new Error('리다이렉트 요청 실패');
            }
            
            const data = await res.json();
            if (data.redirectUrl) {
              window.location.href = data.redirectUrl;
            } else {
              router.push('/');
            }
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('리다이렉트 처리 중 오류:', error);
          router.push('/');
        }
      }
    }
    handleRedirect();
  }, [isLoggedIn, router, searchParams]);

  // 로딩 중이거나 인증 체크 중일 때 표시할 내용
  if (isLoading) {
    return (
      <LoginContainer>
        <div className="flex items-center justify-center">
          <p>잠시만 기다려주세요...</p>
        </div>
      </LoginContainer>
    );
  }

  if (isLoggedIn) {
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
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Title>로그인</Title>
          <Input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          {messages.email && <Message>{messages.email}</Message>}
          <Input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          {messages.password && <Message>{messages.password}</Message>}
          
          <CheckboxLabel $checked={formData.rememberMe}>
            <Checkbox
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <CheckboxText>
              로그인 상태 유지 {formData.rememberMe && '(최대 30일)'}
            </CheckboxText>
          </CheckboxLabel>

          {messages.general && <Message>{messages.general}</Message>}
          
          <SolidButton type="submit" disabled={isLoginLoading}>
            {isLoginLoading ? '로그인 중...' : '로그인'}
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

// Input prop 인터페이스 등록
Input.defaultProps = {
  onKeyPress: () => {}
};

const Message = styled.p`
  font-size: 0.9rem;
  color: red;
  margin-top: -0.5rem;
`;

const CheckboxLabel = styled.label<{ $checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: ${props => props.$checked ? '#514FE4' : '#333'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const CheckboxText = styled.span`
  transition: color 0.2s ease;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #514FE4;
  cursor: pointer;
  
  &:checked {
    background-color: #514FE4;
  }
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