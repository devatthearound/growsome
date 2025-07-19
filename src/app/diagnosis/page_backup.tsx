'use client';

import React, { useState } from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { useRouter } from 'next/navigation';
import { growsomeTheme } from '@/components/design-system/theme';
import { Typography } from '@/components/design-system/Typography';
import { ColumnBox, RowBox, Container } from '@/components/design-system/Layout';
import { GreenButton, SecondaryButton, PrimaryButton } from '@/components/design-system/Button';

interface SurveyData {
  // 1단계: 비즈니스 현황
  businessStage: string;
  mainConcern: string;
  
  // 2단계: AI 개발 니즈
  currentWebsite: string;
  desiredTimeline: string;
  budgetRange: string;
  
  // 3단계: 데이터 운영 니즈
  dataCollection: string;
  desiredData: string;
  
  // 4단계: 브랜드 구축 니즈
  brandingSituation: string;
  brandDirection: string;
  
  // 연락처 정보
  name: string;
  phone: string;
  email: string;
  company: string;
}

const DiagnosisSurvey = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    businessStage: '',
    mainConcern: '',
    currentWebsite: '',
    desiredTimeline: '',
    budgetRange: '',
    dataCollection: '',
    desiredData: '',
    brandingSituation: '',
    brandDirection: '',
    name: '',
    phone: '',
    email: '',
    company: ''
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '서버 오류가 발생했습니다.');
      }
      
      console.log('설문 제출 성공:', result);
      
      // 추천 결과를 쿼리 파라미터로 전달하며 결과 페이지로 이동
      const queryParams = new URLSearchParams({
        surveyId: result.surveyId.toString(),
        recommendation: JSON.stringify(result.recommendations)
      });
      
      router.push(`/diagnosis/result?${queryParams.toString()}`);
      
    } catch (error) {
      console.error('설문 제출 오류:', error);
      alert('설문 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const updateSurveyData = (field: keyof SurveyData, value: string) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return surveyData.businessStage && surveyData.mainConcern;
      case 2:
        return surveyData.currentWebsite && surveyData.desiredTimeline && surveyData.budgetRange;
      case 3:
        return surveyData.dataCollection && surveyData.desiredData;
      case 4:
        return surveyData.brandingSituation && surveyData.brandDirection;
      case 5:
        return surveyData.name && surveyData.phone && surveyData.email;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContent>
            <StepHeader>
              <StepIcon>🎯</StepIcon>
              <ColumnBox $gap={1} $ai="center">
                <Typography.TextL600 color={growsomeTheme.color.Black800}>
                  비즈니스 현황 파악
                </Typography.TextL600>
                <Typography.TextS400 color={growsomeTheme.color.Black600}>
                  현재 상황을 정확히 파악해보겠습니다
                </Typography.TextS400>
              </ColumnBox>
            </StepHeader>

            <QuestionGroup>
              <QuestionTitle>Q1. 현재 비즈니스 단계는?</QuestionTitle>
              <OptionsGrid>
                {[
                  { value: 'idea', label: '아이디어만 있음 (예비창업)' },
                  { value: 'preparing', label: '서비스 런칭 준비중' },
                  { value: 'operating_small', label: '서비스 운영중 (월매출 1억 미만)' },
                  { value: 'operating_large', label: '성장 단계 (월매출 1억 이상)' }
                ].map(option => (
                  <OptionCard 
                    key={option.value}
                    $selected={surveyData.businessStage === option.value}
                    onClick={() => updateSurveyData('businessStage', option.value)}
                  >
                    <Typography.TextM500 color={growsomeTheme.color.Black700}>
                      {option.label}
                    </Typography.TextM500>
                  </OptionCard>
                ))}
              </OptionsGrid>
            </QuestionGroup>

            <QuestionGroup>
              <QuestionTitle>Q2. 현재 가장 큰 고민은?</QuestionTitle>
              <OptionsGrid>
                {[
                  { value: 'idea_to_service', label: '아이디어를 실제 서비스로 만들고 싶다' },
                  { value: 'outdated_service', label: '있는 서비스가 너무 구식이다' },
                  { value: 'data_utilization', label: '고객은 있는데 데이터 활용을 못하겠다' },
                  { value: 'brand_differentiation', label: '브랜드 차별화가 안 된다' }
                ].map(option => (
                  <OptionCard 
                    key={option.value}
                    $selected={surveyData.mainConcern === option.value}
                    onClick={() => updateSurveyData('mainConcern', option.value)}
                  >
                    <Typography.TextM500 color={growsomeTheme.color.Black700}>
                      {option.label}
                    </Typography.TextM500>
                  </OptionCard>
                ))}
              </OptionsGrid>
            </QuestionGroup>
          </StepContent>
        );

      case 2:
        return (
          <StepContent>
            <StepHeader>
              <StepIcon>🤖</StepIcon>
              <ColumnBox $gap={1} $ai="center">
                <Typography.TextL600 color={growsomeTheme.color.Black800}>
                  AI 개발 니즈 진단
                </Typography.TextL600>
                <Typography.TextS400 color={growsomeTheme.color.Black600}>
                  AI 개발 관련 요구사항을 확인해보겠습니다
                </Typography.TextS400>
              </ColumnBox>
            </StepHeader>

            <QuestionGroup>
              <QuestionTitle>Q3. 현재 웹사이트/앱 상황은?</QuestionTitle>
              <OptionsGrid>
                {[
                  { value: 'none', label: '없음 (처음 만들 예정)' },
                  { value: 'old_tech', label: '있지만 2020년 이전 기술' },
                  { value: 'no_ai', label: '있지만 AI 기능 없음' },
                  { value: 'partial_ai', label: 'AI 일부 적용됨' }
                ].map(option => (
                  <OptionCard 
                    key={option.value}
                    $selected={surveyData.currentWebsite === option.value}
                    onClick={() => updateSurveyData('currentWebsite', option.value)}
                  >
                    <Typography.TextM500 color={growsomeTheme.color.Black700}>
                      {option.label}
                    </Typography.TextM500>
                  </OptionCard>
                ))}
              </OptionsGrid>
            </QuestionGroup>

            <QuestionGroup>
              <QuestionTitle>Q4. 원하는 완성 시기는?</QuestionTitle>
              <OptionsGrid>
                {[
                  { value: '2weeks', label: '2주 내 (초급속)' },
                  { value: '1month', label: '1개월 내 (급속)' },
                  { value: '2-3months', label: '2-3개월 (일반)' },
                  { value: '6months', label: '6개월 이상 (여유)' }
                ].map(option => (
                  <OptionCard 
                    key={option.value}
                    $selected={surveyData.desiredTimeline === option.value}
                    onClick={() => updateSurveyData('desiredTimeline', option.value)}
                  >
                    <Typography.TextM500 color={growsomeTheme.color.Black700}>
                      {option.label}
                    </Typography.TextM500>
                  </OptionCard>
                ))}
              </OptionsGrid>
            </QuestionGroup>

            <QuestionGroup>
              <QuestionTitle>Q5. 예상 투자 규모는?</QuestionTitle>
              <OptionsGrid>
                {[
                  { value: 'under_1000', label: '1,000만원 미만' },
                  { value: '1000-2000', label: '1,000-2,000만원' },
                  { value: '2000-3500', label: '2,000-3,500만원' },
                  { value: 'over_3500', label: '3,500만원 이상' }
                ].map(option => (
                  <OptionCard 
                    key={option.value}
                    $selected={surveyData.budgetRange === option.value}
                    onClick={() => updateSurveyData('budgetRange', option.value)}
                  >
                    <Typography.TextM500 color={growsomeTheme.color.Black700}>
                      {option.label}
                    </Typography.TextM500>
                  </OptionCard>
                ))}
              </OptionsGrid>
            </QuestionGroup>
          </StepContent>
        );

      case 3:
        return (
          <StepContent>
            <StepHeader>
              <StepIcon>📊</StepIcon>
              <ColumnBox $gap={1} $ai="center">
                <Typography.TextL600 color={growsomeTheme.color.Black800}>
                  데이터 운영 니즈 진단
                </Typography.TextL600>
                <Typography.TextS400 color={growsomeTheme.color.Black600}>
                  데이터 수집 및 분석 요구사항을 파악해보겠습니다
                </Typography.TextS400>
              </ColumnBox>
            </StepHeader>

            <QuestionGroup>
              <QuestionTitle>Q6. 현재 데이터 수집 현황은?</QuestionTitle>
              <OptionsGrid>
                {[
                  { value: 'none', label: '전혀 안함' },
                  { value: 'basic_ga', label: 'GA 정도만 설치' },
                  { value: 'basic_tools', label: '기본적인 분석 도구 사용' },
                  { value: 'advanced', label: '고도화된 분석 시스템 운영' }
                ].map(option => (
                  <OptionCard 
                    key={option.value}
                    $selected={surveyData.dataCollection === option.value}
                    onClick={() => updateSurveyData('dataCollection', option.value)}
                  >
                    <Typography.TextM500 color={growsomeTheme.color.Black700}>
                      {option.label}
                    </Typography.TextM500>
                  </OptionCard>
                ))}
              </OptionsGrid>
            </QuestionGroup>

            <QuestionGroup>
              <QuestionTitle>Q7. 가장 알고 싶은 데이터는?</QuestionTitle>
              <OptionsGrid>
                {[
                  { value: 'traffic_source', label: '고객이 어디서 오는지' },
                  { value: 'content_preference', label: '어떤 콘텐츠를 좋아하는지' },
                  { value: 'purchase_timing', label: '언제 구매 결정하는지' },
                  { value: 'competitive_position', label: '경쟁사 대비 우리 위치' }
                ].map(option => (
                  <OptionCard 
                    key={option.value}
                    $selected={surveyData.desiredData === option.value}
                    onClick={() => updateSurveyData('desiredData', option.value)}
                  >
                    <Typography.TextM500 color={growsomeTheme.color.Black700}>
                      {option.label}
                    </Typography.TextM500>
                  </OptionCard>
                ))}
              </OptionsGrid>
            </QuestionGroup>
          </StepContent>
        );

      case 4:
        return (
          <StepContent>
            <StepHeader>
              <StepIcon>🎨</StepIcon>
              <ColumnBox $gap={1} $ai="center">
                <Typography.TextL600 color={growsomeTheme.color.Black800}>
                  브랜드 구축 니즈 진단
                </Typography.TextL600>
                <Typography.TextS400 color={growsomeTheme.color.Black600}>
                  브랜딩 관련 요구사항을 확인해보겠습니다
                </Typography.TextS400>
              </ColumnBox>
            </StepHeader>

            <QuestionGroup>
              <QuestionTitle>Q8. 현재 브랜딩 상황은?</QuestionTitle>
              <OptionsGrid>
                {[
                  { value: 'no_logo', label: '로고도 없음' },
                  { value: 'inconsistent', label: '로고는 있지만 일관성 없음' },
                  { value: 'no_differentiation', label: '브랜드는 있지만 차별화 안됨' },
                  { value: 'digital_expansion', label: '브랜딩은 괜찮지만 디지털 확장 필요' }
                ].map(option => (
                  <OptionCard 
                    key={option.value}
                    $selected={surveyData.brandingSituation === option.value}
                    onClick={() => updateSurveyData('brandingSituation', option.value)}
                  >
                    <Typography.TextM500 color={growsomeTheme.color.Black700}>
                      {option.label}
                    </Typography.TextM500>
                  </OptionCard>
                ))}
              </OptionsGrid>
            </QuestionGroup>

            <QuestionGroup>
              <QuestionTitle>Q9. 가장 원하는 브랜드 방향은?</QuestionTitle>
              <OptionsGrid>
                {[
                  { value: 'professional', label: '신뢰감 있는 전문 브랜드' },
                  { value: 'friendly', label: '친근하고 접근하기 쉬운 브랜드' },
                  { value: 'innovative', label: '혁신적이고 트렌디한 브랜드' },
                  { value: 'premium', label: '프리미엄 럭셔리 브랜드' }
                ].map(option => (
                  <OptionCard 
                    key={option.value}
                    $selected={surveyData.brandDirection === option.value}
                    onClick={() => updateSurveyData('brandDirection', option.value)}
                  >
                    <Typography.TextM500 color={growsomeTheme.color.Black700}>
                      {option.label}
                    </Typography.TextM500>
                  </OptionCard>
                ))}
              </OptionsGrid>
            </QuestionGroup>
          </StepContent>
        );

      case 5:
        return (
          <StepContent>
            <StepHeader>
              <StepIcon>📝</StepIcon>
              <ColumnBox $gap={1} $ai="center">
                <Typography.TextL600 color={growsomeTheme.color.Black800}>
                  연락처 정보
                </Typography.TextL600>
                <Typography.TextS400 color={growsomeTheme.color.Black600}>
                  진단 결과를 전달받을 정보를 입력해주세요
                </Typography.TextS400>
              </ColumnBox>
            </StepHeader>

            <ContactForm>
              <FormGroup>
                <FormLabel>이름 *</FormLabel>
                <FormInput
                  type="text"
                  placeholder="성함을 입력해주세요"
                  value={surveyData.name}
                  onChange={(e) => updateSurveyData('name', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>연락처 *</FormLabel>
                <FormInput
                  type="tel"
                  placeholder="010-0000-0000"
                  value={surveyData.phone}
                  onChange={(e) => updateSurveyData('phone', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>이메일 *</FormLabel>
                <FormInput
                  type="email"
                  placeholder="example@email.com"
                  value={surveyData.email}
                  onChange={(e) => updateSurveyData('email', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>회사명 (선택)</FormLabel>
                <FormInput
                  type="text"
                  placeholder="회사명을 입력해주세요"
                  value={surveyData.company}
                  onChange={(e) => updateSurveyData('company', e.target.value)}
                />
              </FormGroup>

              <ConsentBox>
                <Typography.TextS400 color={growsomeTheme.color.Black600}>
                  * 진단 결과는 24시간 내 개별 연락드립니다<br/>
                  * 개인정보는 진단 목적으로만 사용되며, 별도 동의 없이 마케팅에 활용되지 않습니다
                </Typography.TextS400>
              </ConsentBox>
            </ContactForm>
          </StepContent>
        );

      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={growsomeTheme}>
      <SurveyContainer>
        <Container>
          <SurveyWrapper>
            {/* Progress Bar */}
            <ProgressSection>
              <ProgressBar>
                <ProgressFill $progress={(currentStep / totalSteps) * 100} />
              </ProgressBar>
              <ProgressText>
                <Typography.TextM500 color={growsomeTheme.color.Primary600}>
                  {currentStep} / {totalSteps} 단계
                </Typography.TextM500>
                <Typography.TextS400 color={growsomeTheme.color.Black600}>
                  예상 소요시간: {Math.max(6 - currentStep, 1)}분
                </Typography.TextS400>
              </ProgressText>
            </ProgressSection>

            {/* Survey Header */}
            <SurveyHeader>
              <Typography.DisplayS600 color={growsomeTheme.color.Black800} style={{textAlign: 'center'}}>
                💡 무료 10배 성장 진단
              </Typography.DisplayS600>
              <Typography.TextM400 color={growsomeTheme.color.Black600} style={{textAlign: 'center'}}>
                간단한 질문으로 맞춤형 성장 전략을 제안해드립니다
              </Typography.TextM400>
            </SurveyHeader>

            {/* Survey Content */}
            {renderStep()}

            {/* Navigation Buttons */}
            <NavigationButtons>
              {currentStep > 1 && (
                <SecondaryButton $size="large" onClick={handlePrevious}>
                  이전 단계
                </SecondaryButton>
              )}
              
              <div style={{flex: 1}} />
              
              {currentStep < totalSteps ? (
                <GreenButton 
                  $size="large" 
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  다음 단계
                </GreenButton>
              ) : (
                <GreenButton 
                  $size="large" 
                  onClick={handleSubmit}
                  disabled={!canProceed() || loading}
                >
                  {loading ? '제출 중...' : '진단 결과 받기'}
                </GreenButton>
              )}
            </NavigationButtons>
          </SurveyWrapper>
        </Container>
      </SurveyContainer>
    </ThemeProvider>
  );
};

// Styled Components
const SurveyContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${growsomeTheme.color.Primary50} 0%, ${growsomeTheme.color.Gray50} 100%);
  padding: ${growsomeTheme.spacing.lg} 0;
`;

const SurveyWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  background: ${growsomeTheme.color.White};
  border-radius: ${growsomeTheme.radius.radius3};
  box-shadow: ${growsomeTheme.shadow.Elevation2};
  overflow: hidden;
`;

const ProgressSection = styled.div`
  padding: ${growsomeTheme.spacing.lg};
  border-bottom: 1px solid ${growsomeTheme.color.Gray200};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${growsomeTheme.color.Gray200};
  border-radius: ${growsomeTheme.radius.radius5};
  overflow: hidden;
  margin-bottom: ${growsomeTheme.spacing.md};
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: linear-gradient(90deg, ${growsomeTheme.color.Primary500}, ${growsomeTheme.color.Green500});
  transition: width 0.3s ease;
  border-radius: ${growsomeTheme.radius.radius5};
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SurveyHeader = styled.div`
  padding: ${growsomeTheme.spacing.lg};
  text-align: center;
`;

const StepContent = styled.div`
  padding: ${growsomeTheme.spacing.lg};
`;

const StepHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${growsomeTheme.spacing.md};
  margin-bottom: ${growsomeTheme.spacing.xl};
  text-align: center;
`;

const StepIcon = styled.div`
  font-size: 2rem;
  background: ${growsomeTheme.color.Primary50};
  padding: ${growsomeTheme.spacing.md};
  border-radius: ${growsomeTheme.radius.radius2};
`;

const QuestionGroup = styled.div`
  margin-bottom: ${growsomeTheme.spacing.xl};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const QuestionTitle = styled.h3`
  font-size: ${growsomeTheme.fontSize.TextM};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  color: ${growsomeTheme.color.Black800};
  margin-bottom: ${growsomeTheme.spacing.lg};
  text-align: left;
  line-height: 1.4;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: ${growsomeTheme.spacing.sm};
`;

const OptionCard = styled.div<{ $selected: boolean }>`
  padding: ${growsomeTheme.spacing.md};
  border: 2px solid ${props => props.$selected ? growsomeTheme.color.Primary500 : growsomeTheme.color.Gray200};
  border-radius: ${growsomeTheme.radius.radius2};
  background: ${props => props.$selected ? growsomeTheme.color.Primary50 : growsomeTheme.color.White};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${growsomeTheme.color.Primary400};
    background: ${growsomeTheme.color.Primary25};
  }
`;

const ContactForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.lg};
  max-width: 500px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.sm};
`;

const FormLabel = styled.label`
  font-size: ${growsomeTheme.fontSize.TextS};
  font-weight: ${growsomeTheme.fontWeight.Medium};
  color: ${growsomeTheme.color.Black700};
`;

const FormInput = styled.input`
  padding: ${growsomeTheme.spacing.md};
  border: 1px solid ${growsomeTheme.color.Gray300};
  border-radius: ${growsomeTheme.radius.radius1};
  font-size: ${growsomeTheme.fontSize.TextM};
  
  &:focus {
    outline: none;
    border-color: ${growsomeTheme.color.Primary500};
    box-shadow: 0 0 0 3px ${growsomeTheme.color.Primary100};
  }
`;

const ConsentBox = styled.div`
  background: ${growsomeTheme.color.Gray50};
  padding: ${growsomeTheme.spacing.md};
  border-radius: ${growsomeTheme.radius.radius1};
  margin-top: ${growsomeTheme.spacing.md};
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${growsomeTheme.spacing.md};
  padding: ${growsomeTheme.spacing.lg};
  border-top: 1px solid ${growsomeTheme.color.Gray200};
`;

export default DiagnosisSurvey;