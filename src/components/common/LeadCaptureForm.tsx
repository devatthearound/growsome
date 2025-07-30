'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  width: 100%;
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
  text-align: center;
`;

const FormSubtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &.error {
    border-color: #ef4444;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #bd6bed, #5cd0ec);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(189, 107, 237, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(189, 107, 237, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PrevButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: #e5e7eb;
  color: #6b7280;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #d1d5db;
    transform: translateY(-1px);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #065f46;
  font-size: 1rem;
  text-align: center;
  margin-top: 1rem;
  padding: 2rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 12px;
  border: 2px solid #10b981;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.1);
`;

const SuccessTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const SuccessSubtitle = styled.div`
  font-size: 1rem;
  color: #047857;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const BenefitBox = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
`;

const BenefitTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const BenefitDescription = styled.div`
  font-size: 0.95rem;
  line-height: 1.4;
  opacity: 0.95;
`;

const ProgressIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 1rem;
`;

const ProgressStep = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 12px;
    left: 50%;
    width: 100%;
    height: 2px;
    background: ${props => props.isCompleted ? '#bd6bed' : '#e5e7eb'};
    z-index: 1;
  }
  
  &:last-child::after {
    display: none;
  }
`;

const ProgressCircle = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => 
    props.isCompleted ? 'linear-gradient(45deg, #bd6bed, #5cd0ec)' : 
    props.isActive ? '#bd6bed' : '#e5e7eb'
  };
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  position: relative;
  z-index: 2;
  margin-bottom: 0.5rem;
`;

const ProgressLabel = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  font-size: 0.7rem;
  color: ${props => 
    props.isCompleted ? '#bd6bed' : 
    props.isActive ? '#bd6bed' : '#9ca3af'
  };
  font-weight: ${props => props.isActive || props.isCompleted ? '600' : '400'};
  text-align: center;
`;

const PreviousDataDisplay = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const DataItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DataLabel = styled.span`
  color: #6b7280;
  font-weight: 500;
`;

const DataValue = styled.span`
  color: #1f2937;
  font-weight: 600;
`;

interface LeadCaptureFormProps {
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  title = "무료 상담 신청",
  subtitle = "전환 퍼널에 대해 궁금한 점이 있으시면 언제든 연락주세요.",
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    product: ''
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = '이름을 입력해주세요.';
      }
    } else if (currentStep === 2) {
      if (!formData.phone.trim()) {
        newErrors.phone = '전화번호를 입력해주세요.';
      } else {
        const numbersOnly = formData.phone.replace(/[^0-9]/g, '');
        if (numbersOnly.length < 10 || numbersOnly.length > 11) {
          newErrors.phone = '올바른 전화번호를 입력해주세요.';
        } else if (!numbersOnly.startsWith('01')) {
          newErrors.phone = '올바른 휴대폰 번호를 입력해주세요.';
        }
      }
    } else if (currentStep === 3) {
      if (!formData.email.trim()) {
        newErrors.email = '이메일을 입력해주세요.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '올바른 이메일 형식이 아닙니다.';
      }
    } else if (currentStep === 5) {
      if (!formData.product.trim()) {
        newErrors.product = '제품/서비스를 입력해주세요.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^01[0-9]-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
      setErrors({});
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'funnel'
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', phone: '', email: '', company: '', product: '' });
        onSuccess?.();
      } else {
        setErrors({ submit: result.error || '제출 중 오류가 발생했습니다.' });
      }
    } catch (error) {
      setErrors({ submit: '네트워크 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // 전화번호 자동 포맷팅
    if (name === 'phone') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      let formatted = '';
      
      if (numbersOnly.length <= 3) {
        formatted = numbersOnly;
      } else if (numbersOnly.length <= 7) {
        formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      } else {
        formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
      }
      
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentStep < 5) {
        handleNextStep();
      } else {
        // 마지막 단계에서는 폼 제출
        const form = e.currentTarget.form;
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  if (isSuccess) {
    return (
      <FormContainer>
        <SuccessMessage>
          <SuccessTitle>
            상담 신청이 완료되었습니다!
          </SuccessTitle>
          <SuccessSubtitle>
            1일 이내 확인 후 연락드리겠습니다.
          </SuccessSubtitle>
          <BenefitBox>
            <BenefitTitle>
              🎁 특별 혜택
            </BenefitTitle>
            <BenefitDescription>
              이번 신청으로 퍼널 제작 시<br />
              80만원짜리 AI도구 3개월 이용권을 드립니다!
            </BenefitDescription>
          </BenefitBox>
        </SuccessMessage>
      </FormContainer>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormGroup>
            <Label htmlFor="name">이름 *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={errors.name ? 'error' : ''}
              placeholder="홍길동"
              autoFocus
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>
        );
      
      case 2:
        return (
          <FormGroup>
            <Label htmlFor="phone">전화번호 *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={errors.phone ? 'error' : ''}
              placeholder="010-1234-5678"
              autoFocus
            />
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          </FormGroup>
        );
      
      case 3:
        return (
          <FormGroup>
            <Label htmlFor="email">이메일 *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={errors.email ? 'error' : ''}
              placeholder="example@email.com"
              autoFocus
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
        );
      
      case 4:
        return (
          <FormGroup>
            <Label htmlFor="company">회사명 (선택)</Label>
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="회사명"
              autoFocus
            />
          </FormGroup>
        );
      
      case 5:
        return (
          <FormGroup>
            <Label htmlFor="product">제품/서비스 *</Label>
            <Input
              id="product"
              name="product"
              type="text"
              value={formData.product}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={errors.product ? 'error' : ''}
              placeholder="제품명 또는 서비스명을 입력해주세요"
              autoFocus
            />
            {errors.product && <ErrorMessage>{errors.product}</ErrorMessage>}
          </FormGroup>
        );
      
      default:
        return null;
    }
  };

  const renderButtons = () => {
    if (currentStep < 5) {
      return (
        <SubmitButton type="button" onClick={handleNextStep}>
          다음
        </SubmitButton>
      );
    } else {
      return (
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '제출 중...' : '상담 신청하기'}
        </SubmitButton>
      );
    }
  };

  const renderProgressIndicator = () => {
    const steps = [
      { label: '이름', key: 'name' },
      { label: '전화번호', key: 'phone' },
      { label: '이메일', key: 'email' },
      { label: '회사명', key: 'company' },
      { label: '제품/서비스', key: 'product' }
    ];

    return (
      <ProgressIndicator>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          
          return (
            <ProgressStep key={step.key} isActive={isActive} isCompleted={isCompleted}>
              <ProgressCircle isActive={isActive} isCompleted={isCompleted}>
                {isCompleted ? '✓' : stepNumber}
              </ProgressCircle>
              <ProgressLabel isActive={isActive} isCompleted={isCompleted}>
                {step.label}
              </ProgressLabel>
            </ProgressStep>
          );
        })}
      </ProgressIndicator>
    );
  };

  const renderPreviousData = () => {
    if (currentStep <= 1) return null;

    const completedData = [];
    
    if (formData.name) {
      completedData.push({ label: '이름', value: formData.name });
    }
    if (formData.phone) {
      completedData.push({ label: '전화번호', value: formData.phone });
    }
    if (formData.email) {
      completedData.push({ label: '이메일', value: formData.email });
    }
    if (formData.company) {
      completedData.push({ label: '회사명', value: formData.company });
    }
    if (formData.product) {
      completedData.push({ label: '제품/서비스', value: formData.product });
    }

    if (completedData.length === 0) return null;

    return (
      <PreviousDataDisplay>
        <div style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
          입력 완료된 정보
        </div>
        {completedData.map((item, index) => (
          <DataItem key={index}>
            <DataLabel>{item.label}:</DataLabel>
            <DataValue>{item.value}</DataValue>
          </DataItem>
        ))}
      </PreviousDataDisplay>
    );
  };

  return (
    <FormContainer>
      <FormTitle>{title}</FormTitle>
      <FormSubtitle>{subtitle}</FormSubtitle>
      
      {renderProgressIndicator()}
      {renderPreviousData()}
      
      <form onSubmit={handleSubmit}>
        {renderStep()}
        
        {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
          {currentStep > 1 && (
            <PrevButton 
              type="button" 
              onClick={handlePrevStep}
            >
              이전
            </PrevButton>
          )}
          <div style={{ flex: 1 }}>
            {renderButtons()}
          </div>
        </div>
      </form>
    </FormContainer>
  );
};

export default LeadCaptureForm; 