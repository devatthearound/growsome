import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Consulting = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    phone: '',
    email: '',
    description: '',
    agreement: false
  });

  const [errors, setErrors] = useState({});

  const positions = [
    { value: 'ceo', label: '대표' },
    { value: 'executive', label: '임원 / C레벨' },
    { value: 'manager', label: '팀장 / 리드' },
    { value: 'employee', label: '실무자' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = '성함을 입력해주세요';
    if (!formData.company) newErrors.company = '기업명 또는 프로젝트명을 입력해주세요';
    if (!formData.position) newErrors.position = '직책을 선택해주세요';
    if (!formData.phone) newErrors.phone = '연락처를 입력해주세요';
    if (!formData.email) newErrors.email = '이메일을 입력해주세요';
    if (!formData.description) newErrors.description = '프로젝트 진행 상황을 입력해주세요';
    if (!formData.agreement) newErrors.agreement = '안내사항 확인에 동의해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // API 호출 로직
      console.log('Form submitted:', formData);
      // 성공 페이지로 이동
      // navigate('/consulting/success');
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title>그릿지 비즈니스 컨설팅 📌</Title>
          <Description>
            안녕하세요! 그릿지 홈페이지를 방문해주셔서 감사합니다 :)
            <br /><br />
            개발할 프로젝트가 분명히 있고, 한정된 예산을 효율적으로 사용하기 위해서
            <br /><br />
            ❓그릿지 에이전시 상품으로 개발해야할까<br />
            ❓개발팀 구독 서비스를 이용해야 할까
            <br /><br />
            판단이 어려운 분들을 위한 비즈니스 컨설팅입니다.
            <br /><br />
            본 컨설팅은 300개 이상의 프로젝트 진행 경험이 있는 그릿지 이사진들과 1시간 가량 진행됩니다.
          </Description>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormField>
            <Label>성함 *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormField>

          <FormField>
            <Label>기업명 or 프로젝트명 *</Label>
            <Input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
            />
            {errors.company && <ErrorMessage>{errors.company}</ErrorMessage>}
          </FormField>

          <FormField>
            <Label>직책 *</Label>
            <Select
              name="position"
              value={formData.position}
              onChange={handleChange}
              error={errors.position}
            >
              <option value="">직책을 선택해주세요</option>
              {positions.map(pos => (
                <option key={pos.value} value={pos.value}>{pos.label}</option>
              ))}
            </Select>
            {errors.position && <ErrorMessage>{errors.position}</ErrorMessage>}
          </FormField>

          <FormField>
            <Label>연락처 *</Label>
            <Input
              type="tel"
              name="phone"
              placeholder="ex. 01011112222"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          </FormField>

          <FormField>
            <Label>이메일 *</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormField>

          <FormField>
            <Label>현재 프로젝트 진행 상황 *</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              placeholder="ex) 기획 디자인은 되어 있고 내부 개발팀은 있으나 내부 개발팀으로 진행하기엔 리소스가 부족합니다. / 대기업 신사업팀입니다. IT 지식을 가지고 있는 팀원들이 있는 상태고 개발팀만 필요합니다."
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormField>

          <AgreementField>
            <Checkbox
              type="checkbox"
              name="agreement"
              checked={formData.agreement}
              onChange={handleChange}
            />
            <AgreementText>
              설문지 제출 24시간 내 담당자가 확인하여 입력해주신 전화번호로 담당자가 연락 할 예정입니다. 
              전화 및 메일함을 꼭 확인해주세요! *
            </AgreementText>
          </AgreementField>
          {errors.agreement && <ErrorMessage>{errors.agreement}</ErrorMessage>}

          <SubmitButton type="submit">
            컨설팅 신청하기
          </SubmitButton>
        </Form>
      </ContentWrapper>
    </Container>
  );
};

// 스타일 컴포넌트 정의
const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.error ? '#ff6b6b' : '#ddd'};
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #514FE4;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.error ? '#ff6b6b' : '#ddd'};
  border-radius: 8px;
  font-size: 1rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #514FE4;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.error ? '#ff6b6b' : '#ddd'};
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #514FE4;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const AgreementField = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Checkbox = styled.input`
  margin-top: 0.25rem;
`;

const AgreementText = styled.label`
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #4340c0;
  }
`;

export default Consulting; 