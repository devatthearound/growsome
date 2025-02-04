'use client'

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ValidationError } from '@/app/utils/validators';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const isPopup = false;
  const searchParams = useSearchParams();
  const { user, setUser } = useAuth();
  const isExtension = searchParams.get('isExtension') === 'true';
  const [isChecking, setIsChecking] = useState(true);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);

  // const [isPopup, _setIsPopup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    verificationCode: '',
    company: '',
    level: '대표',
    visitPath: '',
    termsAccepted: false,
    privacyPolicyAccepted: false,
    marketingAccepted: false
  });

  const [messages, setMessages] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    verificationCode: ''
  });

  const [verificationSent, setVerificationSent] = useState(false);

  const router = useRouter();


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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });

    // Example validation logic
    if (name === 'email' && !value.includes('@')) {
      setMessages({ ...messages, email: '유효한 이메일을 입력하세요.' });
    } else {
      setMessages({ ...messages, [name]: '' });
    }
  };

  const handleOptionClick = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
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
        if (data.validationErrors) {
          // 각 필드별 에러 메시지 설정
          const newMessages = { ...messages };
          data.validationErrors.forEach((error: ValidationError) => {
            newMessages[error.field as keyof typeof messages] = error.message;
          });
          setMessages(newMessages);
          return;
        }
        throw new Error(data.error || '회원가입 실패');
      }
      
      setUser(data.user);

      if (!data.user.isExtension) {
        router.push('/');
      } else {
        window.location.href = `/auth/extension-callback?token=${data.token}`;
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      // 에러 처리
    }
  }, [formData, isExtension, router, setUser]);

  const handleVerification = () => {
    // TODO: 전화번호 인증 로직
    console.log('Verification code sent to:', formData.phone);
    setVerificationSent(true);
  };

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        const data = await response.json();

        if (response.ok && data.isLoggedIn) {
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
            } else {
              console.error('Failed to retrieve token:', tokenData.error);
            }
          } else {
            setUser(data.user);
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
  }, [isExtension, setUser]);


  // 로딩 중이거나 인증 체크 중일 때 표시할 내용
  if (isChecking) {
    return (
      <SignUpContainer>
        <div className="flex items-center justify-center">
          <p>잠시만 기다려주세요...</p>
        </div>
      </SignUpContainer>
    );
  }

  if (isAlreadyLoggedIn) {
    return (
      <SignUpContainer>
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
      </SignUpContainer>
    );
  }

  return (
    <SignUpContainer>
      {!isPopup && (
        <LeftPanel>
          <Logo>Growsome</Logo>
          <Tagline>당신도 AI직원을 통해 스마트해지세요.</Tagline>
        </LeftPanel>
      )}
      <RightPanel>
        <Form onSubmit={handleSubmit}>
          <StepIndicator>
            {Array.from({ length: 4 }, (_, i) => (
              <StepDot key={i} $isActive={i + 1 === step} />
            ))}
          </StepIndicator>
          {step === 1 && (
            <>
              <Title>이메일과 비밀번호를 입력해주세요</Title>
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
              <Input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {messages.confirmPassword && <Message>{messages.confirmPassword}</Message>}
            </>
          )}
          {step === 2 && (
            <>
              <Title>이름과 전화번호를 입력해주세요</Title>
              <InputGroup>
                <Input
                  type="text"
                  name="name"
                  placeholder="이름"
                  value={formData.name}
                  onChange={handleChange}
                />
              </InputGroup>
              {messages.name && <Message>{messages.name}</Message>}
              <InputGroup>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="전화번호"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <VerificationButton
                  type="button"
                  onClick={handleVerification}
                  disabled={!formData.phone}
                >
                  {verificationSent ? '재요청' : '인증요청'}
                </VerificationButton>
              </InputGroup>
              {messages.phone && <Message>{messages.phone}</Message>}
              {verificationSent && (
                <InputGroup>
                  <Input
                    type="text"
                    name="verificationCode"
                    placeholder="인증번호 입력"
                    value={formData.verificationCode}
                    onChange={handleChange}
                  />
                  <VerificationButton type="button" onClick={handleVerification}>
                    인증확인
                  </VerificationButton>
                </InputGroup>
              )}
              {messages.verificationCode && <Message>{messages.verificationCode}</Message>}
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                />
                모두 동의
              </CheckboxLabel>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  name="privacyPolicyAccepted"
                  checked={formData.privacyPolicyAccepted}
                  onChange={handleChange}
                />
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  개인정보보호정책과 이용약관에 동의합니다.
                </a>
              </CheckboxLabel>
              <CheckboxLabel>
                <Checkbox
                  type="checkbox"
                  name="marketingAccepted"
                  checked={formData.marketingAccepted}
                  onChange={handleChange}
                />
                마케팅 정보 수신에 동의합니다.
              </CheckboxLabel>
            </>
          )}
          {step === 3 && (
            <>
              <Title>회사 정보와 레벨을 입력해주세요</Title>
              <Input
                type="text"
                name="company"
                placeholder="회사명"
                value={formData.company}
                onChange={handleChange}
              />
              <CustomSelect
                name="level"
                value={formData.level}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e)}
              >
                <option value="대표">대표</option>
                <option value="임원/C레벨">임원/C레벨</option>
                <option value="팀장/리드">팀장/리드</option>
                <option value="실무자">실무자</option>
              </CustomSelect>
            </>
          )}
          {step === 4 && (
            <>
              <Title>그로우썸에 방문하게 된 경로를 선택해주세요</Title>
              <ChipGroup>
                {['포털사이트 검색', 'SNS 광고', '그로우썸 디스코드', '그로우썸 유튜브', '제휴사', '지인 소개', '온/오프라인 행사', '오픈채팅방', '기타'].map((path) => (
                  <Chip
                    key={path}
                    selected={formData.visitPath === path}
                    onClick={() => handleOptionClick('visitPath', path)}
                  >
                    {path}
                  </Chip>
                ))}
              </ChipGroup>
            </>
          )}
          <ButtonGroup>
            {step > 1 && <OutlineButton type="button" onClick={handlePrev}>이전</OutlineButton>}
            {step < 4 && <SolidButton type="button" onClick={handleNext}>다음</SolidButton>}
            {step === 4 && <SolidButton type="submit">제출</SolidButton>}
          </ButtonGroup>
          {(step === 1 || step === 2) && (
            <LoginLink onClick={() => router.push('/login')}>
              이미 그로우썸 회원이신가요? 로그인 하러가기
            </LoginLink>
          )}
        </Form>
      </RightPanel>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
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

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StepDot = styled.div<{ $isActive: boolean }>`
  width: 10px;
  height: 10px;
  background: ${({ $isActive }) => ($isActive ? '#514FE4' : '#ddd')};
  border-radius: 50%;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
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
  margin-bottom: 0.5rem;
`;

const CustomSelect = styled.select`
  padding: 1rem;
  border: 1px solid #514FE4;
  border-radius: 16px;
  font-size: 1rem;
  appearance: none;
  background-color: white;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23514FE4" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 1rem top 50%;
  background-size: 1rem;

  &:focus {
    outline: none;
    border-color: #514FE4;
  }
`;

const ChipGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Chip = styled.div<{ selected: boolean }>`
  padding: 0.5rem 1rem;
  background: ${props => (props.selected ? '#e6e0ff' : 'white')};
  color: ${props => (props.selected ? '#514FE4' : '#333')};
  border: 1px solid ${props => (props.selected ? '#b3a6ff' : '#ddd')};
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;

  &:hover {
    background: #f0f4ff;
  }
`;

const VerificationButton = styled.button`
  padding: 0.5rem 1rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
  min-width: 135px;

  &:hover {
    background: #4340c0;
  }

  &:disabled {
    background: #ddd;
    cursor: not-allowed;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #333;

  a {
    color: #514FE4;
    text-decoration: underline;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const OutlineButton = styled.button`
  padding: 1rem;
  background: white;
  color: #514FE4;
  border: 2px solid #514FE4;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  flex: 1;

  &:hover {
    background: #f0f4ff;
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
  flex: 1;

  &:hover {
    background: #4340c0;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  color: #514FE4;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1rem;
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


export default SignUp; 
