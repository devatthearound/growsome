'use client';

import React, { useState, useEffect, Suspense } from 'react';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { useRouter } from 'next/navigation';
import { growsomeTheme } from '@/components/design-system/theme';
import { Typography } from '@/components/design-system/Typography';
import { ColumnBox, RowBox, Container } from '@/components/design-system/Layout';
import { GreenButton, SecondaryButton } from '@/components/design-system/Button';

interface SurveyData {
  businessStage: string;
  mainConcern: string;
  currentWebsite: string;
  desiredTimeline: string;
  budgetRange: string;
  dataCollection: string;
  desiredData: string;
  brandingSituation: string;
  brandDirection: string;
  name: string;
  phone: string;
  email: string;
  company: string;
}

const TypeformSurvey = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<SurveyData>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);

  const questions = [
    {
      id: 'businessStage' as keyof SurveyData,
      type: 'choice',
      question: '현재 비즈니스 단계는?',
      description: '현재 상황을 정확히 파악해보겠습니다',
      options: [
        { value: 'idea', label: '아이디어만 있음 (예비창업)' },
        { value: 'preparing', label: '서비스 런칭 준비중' },
        { value: 'operating_small', label: '서비스 운영중 (월매출 1억 미만)' },
        { value: 'operating_large', label: '성장 단계 (월매출 1억 이상)' }
      ]
    },
    {
      id: 'mainConcern' as keyof SurveyData,
      type: 'choice',
      question: '현재 가장 큰 고민은?',
      description: '핵심 문제점을 파악해보겠습니다',
      options: [
        { value: 'idea_to_service', label: '아이디어를 실제 서비스로 만들고 싶다' },
        { value: 'outdated_service', label: '있는 서비스가 너무 구식이다' },
        { value: 'data_utilization', label: '고객은 있는데 데이터 활용을 못하겠다' },
        { value: 'brand_differentiation', label: '브랜드 차별화가 안 된다' }
      ]
    },
    {
      id: 'currentWebsite' as keyof SurveyData,
      type: 'choice',
      question: '현재 웹사이트/앱 상황은?',
      description: 'AI 개발 관련 요구사항을 확인해보겠습니다',
      options: [
        { value: 'none', label: '없음 (처음 만들 예정)' },
        { value: 'old_tech', label: '있지만 2020년 이전 기술' },
        { value: 'no_ai', label: '있지만 AI 기능 없음' },
        { value: 'partial_ai', label: 'AI 일부 적용됨' }
      ]
    },
    {
      id: 'desiredTimeline' as keyof SurveyData,
      type: 'choice',
      question: '원하는 완성 시기는?',
      description: '프로젝트 일정을 계획해보겠습니다',
      options: [
        { value: '2weeks', label: '2주 내 (초급속)' },
        { value: '1month', label: '1개월 내 (급속)' },
        { value: '2-3months', label: '2-3개월 (일반)' },
        { value: '6months', label: '6개월 이상 (여유)' }
      ]
    },
    {
      id: 'budgetRange' as keyof SurveyData,
      type: 'choice',
      question: '예상 투자 규모는?',
      description: '적정 예산 범위를 확인해보겠습니다',
      options: [
        { value: 'under_1000', label: '1,000만원 미만' },
        { value: '1000-2000', label: '1,000-2,000만원' },
        { value: '2000-3500', label: '2,000-3,500만원' },
        { value: 'over_3500', label: '3,500만원 이상' }
      ]
    },
    {
      id: 'dataCollection' as keyof SurveyData,
      type: 'choice',
      question: '현재 데이터 수집 현황은?',
      description: '데이터 분석 요구사항을 파악해보겠습니다',
      options: [
        { value: 'none', label: '전혀 안함' },
        { value: 'basic_ga', label: 'GA 정도만 설치' },
        { value: 'basic_tools', label: '기본적인 분석 도구 사용' },
        { value: 'advanced', label: '고도화된 분석 시스템 운영' }
      ]
    },
    {
      id: 'desiredData' as keyof SurveyData,
      type: 'choice',
      question: '가장 알고 싶은 데이터는?',
      description: '데이터 활용 방향을 파악해보겠습니다',
      options: [
        { value: 'traffic_source', label: '고객이 어디서 오는지' },
        { value: 'content_preference', label: '어떤 콘텐츠를 좋아하는지' },
        { value: 'purchase_timing', label: '언제 구매 결정하는지' },
        { value: 'competitive_position', label: '경쟁사 대비 우리 위치' }
      ]
    },
    {
      id: 'brandingSituation' as keyof SurveyData,
      type: 'choice',
      question: '현재 브랜딩 상황은?',
      description: '브랜딩 관련 요구사항을 확인해보겠습니다',
      options: [
        { value: 'no_logo', label: '로고도 없음' },
        { value: 'inconsistent', label: '로고는 있지만 일관성 없음' },
        { value: 'no_differentiation', label: '브랜드는 있지만 차별화 안됨' },
        { value: 'digital_expansion', label: '브랜딩은 괜찮지만 디지털 확장 필요' }
      ]
    },
    {
      id: 'brandDirection' as keyof SurveyData,
      type: 'choice',
      question: '가장 원하는 브랜드 방향은?',
      description: '브랜드 아이덴티티 방향성을 설정해보겠습니다',
      options: [
        { value: 'professional', label: '신뢰감 있는 전문 브랜드' },
        { value: 'friendly', label: '친근하고 접근하기 쉬운 브랜드' },
        { value: 'innovative', label: '혁신적이고 트렌디한 브랜드' },
        { value: 'premium', label: '프리미엄 럭셔리 브랜드' }
      ]
    },
    {
      id: 'name' as keyof SurveyData,
      type: 'text',
      question: '성함을 알려주세요',
      description: '진단 결과를 전달받을 정보를 입력해주세요',
      placeholder: '홍길동'
    },
    {
      id: 'email' as keyof SurveyData,
      type: 'email',
      question: '이메일 주소를 입력해주세요',
      description: '진단 결과 전송을 위해 필요합니다',
      placeholder: 'example@email.com'
    },
    {
      id: 'phone' as keyof SurveyData,
      type: 'tel',
      question: '연락처를 입력해주세요',
      description: '24시간 내 개별 연락드립니다',
      placeholder: '010-0000-0000'
    },
    {
      id: 'company' as keyof SurveyData,
      type: 'text',
      question: '회사명을 입력해주세요 (선택)',
      description: '더 정확한 진단을 위해 도움이 됩니다',
      placeholder: '회사명 (선택사항)'
    }
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: value }));
    
    // 자동으로 다음 질문으로 이동 (선택형 질문의 경우)
    if (questions[currentQuestion].type === 'choice') {
      setTimeout(() => {
        nextQuestion();
      }, 600);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setIsAnimating(false);
      }, 150);
    } else {
      // 설문 완료
      handleSubmit();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // 제출 전 모든 필수 필드 검증
      const requiredFields = [
        'businessStage', 'mainConcern', 'currentWebsite', 'desiredTimeline',
        'budgetRange', 'dataCollection', 'desiredData', 'brandingSituation',
        'brandDirection', 'name', 'phone', 'email'
      ];
      
      const missingFields = requiredFields.filter(field => 
        !answers[field as keyof SurveyData] || 
        answers[field as keyof SurveyData]?.toString().trim() === ''
      );
      
      if (missingFields.length > 0) {
        alert(`다음 필드를 입력해주세요: ${missingFields.join(', ')}`);
        return;
      }
      
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(answers.email || '')) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }
      
      console.log('제출할 데이터:', answers);
      
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('API 오류 응답:', result);
        throw new Error(result.error || '서버 오류가 발생했습니다.');
      }
      
      console.log('설문 제출 성공:', result);
      
      // 추천 결과를 쿼리 파라미터로 전달하며 결과 페이지로 이동
      const queryParams = new URLSearchParams({
        surveyId: result.surveyId?.toString() || 'temp',
        recommendation: JSON.stringify(result.recommendations || {})
      });
      
      router.push(`/diagnosis/result?${queryParams.toString()}`);
      
    } catch (error) {
      console.error('설문 제출 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '설문 제출 중 오류가 발생했습니다.';
      alert(errorMessage + ' 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (canProceed()) {
        nextQuestion();
      } else if (questions[currentQuestion].type !== 'choice') {
        // 입력형 질문에서만 입력창 강조
        setInputError(true);
        setTimeout(() => setInputError(false), 2000);
      }
    }
  };

  // 이메일 유효성 검사 함수
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const canProceed = () => {
    const currentAnswer = answers[questions[currentQuestion].id];
    // company는 선택사항이므로 검증에서 제외
    if (questions[currentQuestion].id === 'company') {
      return true;
    }
    // 이메일 단계에서는 형식까지 검증
    if (questions[currentQuestion].id === 'email') {
      return currentAnswer && emailRegex.test(currentAnswer.toString().trim());
    }
    return currentAnswer && currentAnswer.toString().trim() !== '';
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, answers]);

  const currentQ = questions[currentQuestion];

  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">진단 페이지 로딩중...</div>}>
      <ThemeProvider theme={growsomeTheme}>
        <SurveyContainer>
          {/* Progress Bar */}
          <ProgressBarContainer>
            <ProgressBar>
              <ProgressFill $progress={progress} />
            </ProgressBar>
          </ProgressBarContainer>

          {/* Main Content */}
          <ContentContainer>
            <Container>
              <QuestionContainer 
                $isAnimating={isAnimating}
              >
                {/* Question Number */}
                <QuestionMeta>
                  <Typography.TextM500 color={growsomeTheme.color.Primary600}>
                    {currentQuestion + 1} → {questions.length}
                  </Typography.TextM500>
                </QuestionMeta>

                {/* Question Header */}
                <QuestionHeader>
                  <ColumnBox $gap={1} $ai="center">
                    <Typography.DisplayS600 color={growsomeTheme.color.Black800} style={{textAlign: 'center', lineHeight: '1.2'}}>
                      {currentQ.question}
                    </Typography.DisplayS600>
                    {currentQ.description && (
                      <Typography.TextM400 color={growsomeTheme.color.Black600} style={{textAlign: 'center'}}>
                        {currentQ.description}
                      </Typography.TextM400>
                    )}
                  </ColumnBox>
                </QuestionHeader>

                {/* Answer Options */}
                <AnswerContainer>
                  {currentQ.type === 'choice' ? (
                    // 선택형 질문
                    <OptionsContainer>
                      {currentQ.options?.map((option, index) => (
                        <OptionCard
                          key={option.value}
                          $selected={answers[currentQ.id] === option.value}
                          onClick={() => handleAnswer(option.value)}
                          $delay={index * 100}
                        >
                          <OptionLabel>
                            {String.fromCharCode(65 + index)}
                          </OptionLabel>
                          <OptionText>
                            <Typography.TextM500 color={growsomeTheme.color.Black800}>
                              {option.label}
                            </Typography.TextM500>
                          </OptionText>
                          <OptionArrow $selected={answers[currentQ.id] === option.value}>
                            →
                          </OptionArrow>
                        </OptionCard>
                      ))}
                    </OptionsContainer>
                                  ) : (
                    // 입력형 질문
                    <InputContainer>
                      <InputField
                        type={currentQ.type}
                        placeholder={currentQ.placeholder}
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => {
                          handleAnswer(e.target.value);
                          if (inputError) setInputError(false); // 입력 시 에러 상태 해제
                        }}
                        autoFocus
                        $hasError={!!(inputError || (currentQ.id === 'email' && answers.email && !emailRegex.test(answers.email)))}
                      />
                      {(inputError || (currentQ.id === 'email' && answers.email && !emailRegex.test(answers.email))) && (
                        <ErrorMessage>
                          <Typography.TextS400 color={growsomeTheme.color.Red500}>
                            {currentQ.id === 'email' && answers.email && !emailRegex.test(answers.email)
                              ? '올바른 이메일 형식을 입력해주세요.'
                              : '답변을 입력해주세요.'}
                          </Typography.TextS400>
                        </ErrorMessage>
                      )}
                      <InputHint>
                        <Typography.TextS400 color={growsomeTheme.color.Black600}>
                          Press <KeyboardKey>Enter</KeyboardKey> to continue
                        </Typography.TextS400>
                      </InputHint>
                    </InputContainer>
                  )}
                </AnswerContainer>

                {/* Next Button for text inputs */}
                {currentQ.type !== 'choice' && (
                  <ButtonContainer>
                    <GreenButton
                      $size="large"
                      onClick={() => {
                        if (canProceed()) {
                          nextQuestion();
                        } else {
                          setInputError(true);
                          setTimeout(() => setInputError(false), 2000);
                        }
                      }}
                      disabled={!canProceed()}
                    >
                      {loading ? '제출 중...' : 
                       currentQuestion === questions.length - 1 ? '진단 완료하기 🎉' : '다음 질문'}
                    </GreenButton>
                  </ButtonContainer>
                )}
              </QuestionContainer>
            </Container>
          </ContentContainer>

          {/* Navigation */}
          <NavigationContainer>
            {currentQuestion > 0 && (
              <BackButton onClick={prevQuestion}>
                <BackIcon>←</BackIcon>
                <Typography.TextM500 color={growsomeTheme.color.Black600}>
                  이전
                </Typography.TextM500>
              </BackButton>
            )}
            
            <div style={{flex: 1}} />
            
            <ProgressText>
              <Typography.TextS400 color={growsomeTheme.color.Black600}>
                {currentQuestion + 1} of {questions.length}
              </Typography.TextS400>
            </ProgressText>
          </NavigationContainer>

          {/* Loading overlay */}
          {loading && (
            <LoadingOverlay>
              <LoadingSpinner />
              <Typography.TextL500 color={growsomeTheme.color.White} style={{marginTop: '1rem'}}>
                진단 결과를 생성하고 있습니다...
              </Typography.TextL500>
            </LoadingOverlay>
          )}
        </SurveyContainer>
      </ThemeProvider>
    </Suspense>
  );
};

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const progressAnimation = keyframes`
  from {
    width: 0%;
  }
`;

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const SurveyContainer = styled.div`
  min-height: 100vh;
  background: ${growsomeTheme.color.White};
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: ${growsomeTheme.color.White};
  border-bottom: 1px solid ${growsomeTheme.color.Gray200};
`;

const ProgressBar = styled.div`
  height: 4px;
  background: ${growsomeTheme.color.Gray200};
  position: relative;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(90deg, ${growsomeTheme.color.Primary500}, ${growsomeTheme.color.Green500});
  transition: width 0.5s ease-out;
  animation: ${progressAnimation} 0.5s ease-out;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${growsomeTheme.spacing.xl} ${growsomeTheme.spacing.lg};
  margin-top: 4px;
  width: 100%;
  
  @media ${growsomeTheme.device.mobile} {
    padding: ${growsomeTheme.spacing.lg} ${growsomeTheme.spacing.md};
  }
`;

const QuestionContainer = styled.div<{ $isAnimating: boolean }>`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  animation: ${props => props.$isAnimating ? slideOut : slideIn} 0.3s ease-out;
`;

const QuestionMeta = styled.div`
  margin-bottom: ${growsomeTheme.spacing.lg};
`;

const QuestionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${growsomeTheme.spacing.lg};
  margin-bottom: ${growsomeTheme.spacing.xl};
  text-align: center;
`;

const AnswerContainer = styled.div`
  margin-bottom: ${growsomeTheme.spacing.xl};
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.md};
`;

const OptionCard = styled.button<{ $selected: boolean; $delay: number }>`
  display: flex;
  align-items: center;
  gap: ${growsomeTheme.spacing.md};
  padding: ${growsomeTheme.spacing.lg};
  background: ${props => props.$selected ? growsomeTheme.color.Primary50 : growsomeTheme.color.White};
  border: 2px solid ${props => props.$selected ? growsomeTheme.color.Primary500 : growsomeTheme.color.Gray200};
  border-radius: ${growsomeTheme.radius.radius2};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: ${slideIn} 0.5s ease-out;
  animation-delay: ${props => props.$delay}ms;
  animation-fill-mode: both;
  
  &:hover {
    border-color: ${growsomeTheme.color.Primary400};
    background: ${growsomeTheme.color.Primary25};
    transform: translateY(-2px);
    box-shadow: ${growsomeTheme.shadow.Elevation1};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const OptionLabel = styled.div`
  width: 32px;
  height: 32px;
  background: ${growsomeTheme.color.Primary100};
  color: ${growsomeTheme.color.Primary600};
  border-radius: ${growsomeTheme.radius.radius1};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${growsomeTheme.fontSize.TextM};
  font-weight: ${growsomeTheme.fontWeight.SemiBold};
  flex-shrink: 0;
`;

const OptionText = styled.div`
  flex: 1;
`;

const OptionArrow = styled.div<{ $selected: boolean }>`
  color: ${props => props.$selected ? growsomeTheme.color.Primary500 : growsomeTheme.color.Gray400};
  font-size: 1.2rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${growsomeTheme.spacing.xl};
  align-items: center;
`;

const InputField = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  max-width: 500px;
  font-size: ${growsomeTheme.fontSize.TextXL};
  padding: ${growsomeTheme.spacing.xl};
  border: none;
  border-bottom: 3px solid ${props => props.$hasError ? growsomeTheme.color.Red400 : growsomeTheme.color.Gray300};
  background: transparent;
  outline: none;
  transition: all 0.2s ease;
  text-align: center;
  
  &:focus {
    border-bottom-color: ${props => props.$hasError ? growsomeTheme.color.Red500 : growsomeTheme.color.Primary500};
  }
  
  &::placeholder {
    color: ${growsomeTheme.color.Gray400};
  }
  
  ${props => props.$hasError && `
    animation: shake 0.3s ease-in-out;
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `}
`;

const ErrorMessage = styled.div`
  text-align: center;
  margin-top: ${growsomeTheme.spacing.sm};
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const InputHint = styled.div`
  text-align: center;
`;

const KeyboardKey = styled.kbd`
  background: ${growsomeTheme.color.Gray100};
  padding: ${growsomeTheme.spacing.xs} ${growsomeTheme.spacing.sm};
  border-radius: ${growsomeTheme.radius.radius1};
  border: 1px solid ${growsomeTheme.color.Gray300};
  font-size: ${growsomeTheme.fontSize.TextXS};
  font-family: monospace;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const NavigationContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: ${growsomeTheme.spacing.xl};
  background: ${growsomeTheme.color.White};
  border-top: 1px solid ${growsomeTheme.color.Gray200};
  z-index: 40;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${growsomeTheme.spacing.sm};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${growsomeTheme.spacing.sm};
  border-radius: ${growsomeTheme.radius.radius1};
  transition: background 0.2s ease;
  
  &:hover {
    background: ${growsomeTheme.color.Gray100};
  }
`;

const BackIcon = styled.div`
  font-size: 1.2rem;
  color: ${growsomeTheme.color.Black600};
`;

const ProgressText = styled.div`
  text-align: right;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${growsomeTheme.color.Gray300};
  border-top: 4px solid ${growsomeTheme.color.Primary500};
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

export default TypeformSurvey;