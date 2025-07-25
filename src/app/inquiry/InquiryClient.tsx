"use client";
import React, { useState, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import AuthPopup from '../components/common/AuthPopup';
import InquiryStep1 from './InquiryStep1';
import InquiryStep2 from './InquiryStep2';
import InquiryStep3 from './InquiryStep3';
import InquiryFinal from './InquiryFinal';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

const SearchParamsComponent = () => {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const type = searchParams.get('type');
  const productInfo = searchParams.get('productInfo') ? JSON.parse(searchParams.get('productInfo') || '{}') : undefined;

  const { isLoggedIn } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [projectDescription, setProjectDescription] = useState('');
  const [isDescriptionComplete, setIsDescriptionComplete] = useState(false);
  const [selectedPreparation, setSelectedPreparation] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [references, setReferences] = useState(['']);
  const [selectedBusinessModel, setSelectedBusinessModel] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsPopupOpen(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (productInfo) {
      console.log('Page View:', { 
        page: 'inquiry', 
        source, 
        type,
        productInfo 
      });
    }
  }, [productInfo, source, type]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectDescription(e.target.value);
    if (e.target.value.trim() !== '') {
      setIsDescriptionComplete(true);
    } else {
      setIsDescriptionComplete(false);
    }
  };

  const handleReferenceChange = (index: number, value: string) => {
    const newReferences = [...references];
    newReferences[index] = value;
    setReferences(newReferences);
  };

  const handleAddReference = () => {
    setReferences([...references, '']);
  };

  const handleBusinessModelSelect = (model: string) => {
    setSelectedBusinessModel(model);
    const required = getRequiredFeatures(model);
    setSelectedFeatures(required);
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prevFeatures) =>
      prevFeatures.includes(feature)
        ? prevFeatures.filter((f) => f !== feature)
        : [...prevFeatures, feature]
    );
  };
  
  const getRequiredFeatures = (model: string) => {
    switch (model) {
      case '소셜 네트워크(SNS)':
        return ['소셜', '게시물', '기본 회원'];
      case '커뮤니티 플랫폼':
        return ['게시물', '기본 회원'];
      case '중개/매칭':
        return ['소셜', '기본 회원'];
      case '구독 모델 플랫폼':
        return ['콘텐츠', '회원가입 & 로그인'];
      case '마켓 플레이스':
        return ['거래', '지도', '상품'];
      case '이커머스':
        return ['상품', '거래', '배송'];
      case '예약/신청':
        return ['상품', '거래', '배송'];
      case 'IOT 플랫폼':
        return ['콘텐츠', '기기 네이티브'];
      default:
        return [];
    }
  };

  const allFeatures = [
    '소셜', '게시물', '기본 회원', '콘텐츠', '회원가입 & 로그인',
    '거래', '지도', '상품', '배송', '기기 네이티브', '마이페이지',
    '고객센터', '알림', '광고', '결제', '온보딩', '캘린더', '파일, 데이터'
  ];

  const requiredFeatures = getRequiredFeatures(selectedBusinessModel);

  const stepTitles = [
    "STEP 1 개발팀 유형 선택",
    "STEP 2 프로젝트 정보 입력",
    "STEP 3 비즈니스 모델/기능선택",
    "1차 런칭 준비"
  ];

  const PageContainer = styled.div`
    min-height: 100vh;
    background: #F8F9FA;
    padding-top: 80px;
  `;

  const ContentWrapper = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;

    @media (max-width: 768px) {
      padding: 1rem;
    }
  `;

  const Content = styled.div`
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

  const StepTitle = styled.h6`
    font-size: 1rem;
    text-align: center;
    margin-bottom: 1rem;
  `;

  const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  `;

  const OutlineButton = styled.button`
    background-color: transparent;
    color: #514FE4;
    padding: 0.75rem 1rem;
    border: 1px solid #514FE4;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
    width: 49%;
    margin-right: 1%;
    &:hover {
      background-color: #EEEFFE;
    }
  `;

  const SolidButton = styled.button`
    background-color: #514FE4;
    color: white;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
    width: 49%;
    margin-left: 1%;
    &:hover {
      background-color: #3D39A1;
    }
  `;

  const ConsultButton = styled.button`
    background-color: #514FE4;
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 8px;
    width: 100%;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background 0.3s ease;

    &:hover {
      background-color: #3D39A1;
    }
  `;

  return (
    <PageContainer>
      <AuthPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      <ContentWrapper>
        <Content>
          <StepTitle>{stepTitles[step - 1]}</StepTitle>
          <ProgressBar>
            <Progress width={(step / 4) * 100 + '%'} />
          </ProgressBar>
          {step === 1 && (
            <InquiryStep1
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
          )}
          {step === 2 && (
            <InquiryStep2
              projectDescription={projectDescription}
              handleDescriptionChange={handleDescriptionChange}
              isDescriptionComplete={isDescriptionComplete}
              selectedPreparation={selectedPreparation}
              setSelectedPreparation={setSelectedPreparation}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              selectedBudget={selectedBudget}
              setSelectedBudget={setSelectedBudget}
              references={references}
              handleReferenceChange={handleReferenceChange}
              handleAddReference={handleAddReference}
            />
          )}
          {step === 3 && (
            <InquiryStep3
              selectedBusinessModel={selectedBusinessModel}
              handleBusinessModelSelect={handleBusinessModelSelect}
              selectedFeatures={selectedFeatures}
              handleFeatureToggle={handleFeatureToggle}
              allFeatures={allFeatures}
              requiredFeatures={requiredFeatures}
            />
          )}
          {step === 4 && (
            <InquiryFinal
              projectDescription={projectDescription}
              selectedPreparation={selectedPreparation}
              selectedMethod={selectedMethod}
              selectedBudget={selectedBudget}
              selectedBusinessModel={selectedBusinessModel}
              selectedFeatures={selectedFeatures}
            />
          )}
          <ButtonGroup>
            {step < 4 ? (
              <>
                <OutlineButton onClick={handlePrev}>이전</OutlineButton>
                <SolidButton onClick={handleNext}>다음</SolidButton>
              </>
            ) : (
              <ConsultButton onClick={() => alert('상담이 요청되었습니다!')}>개발팀 상담받기</ConsultButton>
            )}
          </ButtonGroup>
        </Content>
      </ContentWrapper>
    </PageContainer>
  );
};

const ProgressBar = styled.div`
  width: 100%;
  background-color: #ddd;
  height: 10px;
  border-radius: 5px;
  margin-bottom: 2rem;
`;

const Progress = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  background-color: #514FE4;
  height: 100%;
  border-radius: 5px;
`;

export default function InquiryClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsComponent />
    </Suspense>
  );
} 