import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import SpecialGift from './SpecialGift';

const WhiteBox = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
`;

const RegistrationBox = styled(WhiteBox)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  max-width: 500px;
  margin: 0 auto;
`;

const LandingPage = styled.div`
  padding-top: 80px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.section`
  background: #514FE4;
  padding: 120px 0 80px;
  color: white;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%);
    background-size: 3px 3px;
  }
`;

const HeroContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const MainTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  line-height: 1.3;

  strong {
    display: block;
    color: #03FF01;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
`;

const Description = styled.p`
  font-size: 1.3rem;
  line-height: 2;
  opacity: 0.9;
  margin: 0 auto;
  max-width: 600px;
  word-break: keep-all;
`;

const ContentSection = styled.section`
  padding: 100px 0;
  background: white;
  border-radius: 30px 30px 0 0;
  margin-top: -30px;
`;

const ContentTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
`;

const ContentText = styled.p`
  font-size: 1.3rem;
  line-height: 2;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  word-break: keep-all;
`;

const StatsSection = styled.section`
  padding: 100px 0;
  background: white;
  border-radius: 30px 30px 0 0;
  margin-top: -30px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
`;

const StatsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
`;

const StatItem = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  text-align: left;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #514FE4;
  margin-bottom: 1rem;
`;

const StatDesc = styled.div`
  font-size: 1.1rem;
  color: #333;
  line-height: 1.8;
  word-break: keep-all;
`;

const QuestionSection = styled.section`
  padding: 100px 0;
  background: white;
  text-align: center;
`;

const QuestionText = styled.p`
  font-size: 1.3rem;
  line-height: 2;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  word-break: keep-all;
`;

const SolutionSection = styled.section`
  padding: 100px 0;
  background: white;
  
  ${Container} {
    max-width: 600px;
  }
`;

const SolutionWrapper = styled.div`
  background: #1A1A1A;
  border-radius: 30px;
  padding: 60px 30px;
  color: white;
  margin: 0 auto;
`;

const SolutionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  
  span {
    background: rgba(81, 79, 228, 0.2);
    padding: 0.2em 0.5em;
    border-radius: 8px;
  }

  svg {
    margin-left: 0.5rem;
    color: #03FF01;
  }
`;

const SolutionSubtitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 4rem;
`;

const SolutionList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 600px;
  margin: 3rem auto 0;
`;

const SolutionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;

  svg {
    color: #03FF01;
    font-size: 1.2rem;
    margin-top: 0.3rem;
  }
`;

const ItemContent = styled.div`
  text-align: left;
`;

const ItemTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #03FF01;
`;

const ItemDesc = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const TestimonialSection = styled.section`
  padding: 100px 0;
  background: white;
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled.div`
  background: #f8f9fa;
  padding: 32px;
  border-radius: 16px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 24px;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AuthorImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ddd;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div`
  text-align: left;
`;

const AuthorName = styled.div`
  font-weight: 600;
  color: #333;
`;


const RegistrationSection = styled.section`
  padding: 100px 0;
  background: #514FE4;
  color: white;
  text-align: center;

  ${Container} {
    max-width: 600px;
  }
`;

const RegistrationTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  word-break: keep-all;
  line-height: 1.3;
`;

const Input = styled.input`
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);

  &::placeholder {
    color: #666;
  }

  &:focus {
    outline: none;
    background: white;
  }
`;

const SubmitButton = styled.button`
  background: #03FF01;
  color: #000;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  opacity: ${props => props.disabled ? 0.7 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(3, 255, 1, 0.3);
  }
`;

const FormDisclaimer = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
  text-align: center;
`;

const Emoji = styled.span`
  font-size: 1.4em;
  vertical-align: middle;
`;

const AlertText = styled.div`
  color: #03FF01;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const HighlightSpan = styled.span`
  background: linear-gradient(transparent 50%, #03FF01 50%);
  padding: 0 4px;
  font-weight: 700;
`;

const HeroForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 2rem auto 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeroButton = styled(SubmitButton)`
  background: #03FF01;
  color: #000;
  font-size: 1.1rem;
  padding: 1rem;
  
  &:hover {
    background: #02e601;
  }
`;

const RegistrationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
`;

const StudentReviews = [
  {
    id: 1,
    emoji: '👨‍🍳',
    name: '김OO님',
    role: '식당 운영 / 예비창업가',
    review: '20년간 식당만 운영했는데, AI로 새로운 비즈니스 모델을 발견했어요. 배달 앱에 의존하지 않고도 단골 고객을 확보하는 방법을 찾았습니다.'
  },
  {
    id: 2,
    emoji: '👩‍💼',
    name: '이OO님',
    role: '스타트업 대표',
    review: 'MVP를 3개월 만에 출시했고, 초기 유저 1000명을 유치했어요. AI가 시장 분석부터 고객 피드백 분석까지 해주니 의사결정이 정말 빨라졌습니다.'
  },
  {
    id: 3,
    emoji: '👨‍💼',
    name: '박OO님',
    role: '중소기업 대표',
    review: '사업계획서 작성부터 정부지원사업 선정까지 AI의 도움으로 한 번에 성공했어요. 20년 동안 못 받았던 지원사업, 드디어 선정되었습니다.'
  },
  {
    id: 4,
    emoji: '🧑‍💻',
    name: '최OO님',
    role: 'N잡러 / 콘텐츠 크리에이터',
    review: '틈새시장을 정확히 파악하고 차별화된 콘텐츠를 만들 수 있게 되었어요. 수익이 3배 늘었고, 작업 시간은 절반으로 줄었습니다.'
  },
  {
    id: 5,
    emoji: '👨‍🎨',
    name: '정OO님',
    role: 'IT기업 마케터',
    review: '돈 들이지 않고도 브랜드 스토리를 효과적으로 전달할 수 있게 되었어요. 서사적 마케팅으로 경쟁사 대비 CAC가 1/3 수준입니다.'
  },
  {
    id: 6,
    emoji: '👩‍🚀',
    name: '강OO님',
    role: '1인 사업가',
    review: 'AI가 제안하는 방향이 신선해요. 예전에는 생각지도 못한 사업 아이디어를 발견했고, 진짜 내가 좋아하는 일을 찾았습니다.'
  }
];

const StudentResults = [
  {
    id: 1,
    emoji: '🚀',
    name: '김OO님',
    achievement: '월 매출 2배 달성',
    description: '자체 앱 출시 및 충성 고객 확보'
  },
  {
    id: 2,
    emoji: '💫',
    name: '이OO님',
    achievement: '시드 투자 유치 성공',
    description: '3개월 만에 PMF 달성'
  },
  {
    id: 3,
    emoji: '🎯',
    name: '박OO님',
    achievement: '정부지원금 2억 확보',
    description: '사업계획 완성도 최상위 평가'
  },
  {
    id: 4,
    emoji: '⚡',
    name: '최OO님',
    achievement: '월 수익 300% 증가',
    description: '작업시간 50% 단축'
  },
  {
    id: 5,
    emoji: '🎨',
    name: '정OO님',
    achievement: '마케팅 비용 70% 절감',
    description: '오가닉 팔로워 1만명 확보'
  },
  {
    id: 6,
    emoji: '💡',
    name: '강OO님',
    achievement: '신규 사업 분야 개척',
    description: '부가 수익원 3개 창출'
  }
];

const ReviewCard = styled.div`
  background: #f8f9fa;
  padding: 32px;
  border-radius: 16px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StudentEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #333;
`;

const StudentRole = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ReviewText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 24px;
`;

const ResultCard = styled.div`
  background: #f8f9fa;
  padding: 32px;
  border-radius: 16px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Achievement = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #514FE4;
  margin-bottom: 1rem;
`;

const EventLanding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycby2xTtw45V-50rbq0taqmvHLZujyTkZ7oncOtMsbcRdSkdHDVyNrDnkgE_HgjNN03_H/exec';
      
      // 데이터를 URL 파라미터로 변환
      const params = new URLSearchParams({
        timestamp: new Date().toLocaleString('ko-KR'),
        name: formData.name,
        email: formData.email
      });

      // GET 요청으로 변경하고 no-cors 모드 추가
      const response = await fetch(`${scriptURL}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
      });

      console.log('Submitting form data:', formData);
      
      // 폼 초기화
      setFormData({ 
        name: '', 
        email: '' 
      });
      
      // 성공 메시지
      alert('등록이 완료되었습니다!');
      
      // special-gift 페이지로 이동
      navigate('/special-gift');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('등록 중 문제가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LandingPage>
      <HeroSection>
        <Container>
          <HeroContent>
            <MainTitle>
              무료라니... <HighlightSpan>진짜로?</HighlightSpan> <Emoji>🤯</Emoji>
            </MainTitle>
            <SubTitle>
              6년 치 노하우를 단 1시간 만에!<br />
              지금 아니면 늦습니다!<br />
              남들은 이미 AI로 성과를 내고 있어요! <Emoji>🚀</Emoji>
            </SubTitle>
            <Description>
              "혼자라면 힘들었겠죠? 저희도 맨땅에 헤딩했지만, 이제는 AI와 함께합니다." <Emoji>✨</Emoji><br />
              기술력도 자본도 없이 시작했던 저희는 수많은 시행착오를 통해 성장의 핵심을 발견했습니다.<br />
              이 강의에서는 그간의 실전 경험으로 쌓은 노하우를 딱 1시간에 압축해,<br />
              성공적인 AI 비즈니스 활용법을 제공합니다.
            </Description>
            <HeroForm onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="이름"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? '처리중...' : '특강 비밀 링크 전송'}
              </SubmitButton>
              <FormDisclaimer>
                이메일은 특강 안내와 뉴스레터 발송을 위해서 활용되며,<br />
                언제든 수신거부가 가능합니다.
              </FormDisclaimer>
            </HeroForm>
          </HeroContent>
        </Container>
      </HeroSection>

      <ContentSection>
        <Container>
          <WhiteBox>
            <ContentTitle>
              수천 번의 시행착오,<br />
              끝내 찾아낸 <HighlightSpan>실전 개꿀팁</HighlightSpan>
            </ContentTitle>
            <ContentText>
              저는 시작부터 쉽지 않았습니다.<br />
              기술력도 자본도 없이 맨땅에 헤딩하듯 시작했죠. <Emoji>💪</Emoji>
            </ContentText>
          </WhiteBox>

          <StatsSection>
            <Container>
              <SectionTitle>수치로 증명되는 진짜 성과</SectionTitle>
              <StatsList>
                <StatItem>
                  <StatValue>총 10억 원의</StatValue>
                  <StatDesc>정부 지원금을 유치하며 현실적인 자금 확보와 비즈니스 운영 경험을 쌓았습니다.</StatDesc>
                </StatItem>
                <StatItem>
                  <StatValue>5,000명의</StatValue>
                  <StatDesc>현재 총 5,000명의 활성화 유저를 가진 서비스를 운영 중이며, 10만 가입자 카페와 여러 기업과 컨소시엄을 통한 사업으로 진행하고 있습니다.</StatDesc>
                </StatItem>
                <StatItem>
                  <StatValue>10만원/일</StatValue>
                  <StatDesc>유튜브 팔로워 없이도 하루 약 10만원의 실질적인 수익을 창출하며 트래픽을 얻고 고객을 확보하는 방법을 터득했습니다.</StatDesc>
                </StatItem>
              </StatsList>
            </Container>
          </StatsSection>

          <QuestionSection>
            <Container>
              <SectionTitle>오늘은 무엇을 도전할까?</SectionTitle>
              <QuestionText>
                저는 매일 스스로에게 묻습니다.<br />
                "오늘은 무엇을 도전해볼까? 무엇을 이뤄볼까?"<br />
                좋은 일만 한다고 돈이 따르는 것도 아니고,<br />
                가치 있는 상품을 만든다고 고객이 알아봐 주는 것도 아님을 깨달았습니다.<br />
                진짜 결과를 내기 위해서는 먼저 고객을 발견하고,<br />
                트래픽을 만드는 것이 가장 중요하다는 사실을 직접 체험했습니다.
              </QuestionText>
            </Container>
          </QuestionSection>

          <SolutionSection>
            <Container>
              <SolutionWrapper>
                <SolutionTitle>
                  AI 부스터로 스피드업!<FontAwesomeIcon icon={faRocket} />
                </SolutionTitle>
                <SolutionSubtitle>그로우썸의 성장 솔루션</SolutionSubtitle>
                <SolutionList>
                  <SolutionItem>
                    <FontAwesomeIcon icon={faCheck} />
                    <ItemContent>
                      <ItemTitle>1억마련 전자책:</ItemTitle>
                      <ItemDesc>사업계획서 작성의 첫걸음을 쉽게 시작할 수 있는 가이드를 제공합니다.</ItemDesc>
                    </ItemContent>
                  </SolutionItem>
                  <SolutionItem>
                    <FontAwesomeIcon icon={faCheck} />
                    <ItemContent>
                      <ItemTitle>강의:</ItemTitle>
                      <ItemDesc>실전에서 바로 적용할 수 있는 AI 방법론을 통해 현실적인 성과 창출을 지원합니다.</ItemDesc>
                    </ItemContent>
                  </SolutionItem>
                  <SolutionItem>
                    <FontAwesomeIcon icon={faCheck} />
                    <ItemContent>
                      <ItemTitle>1:1 코칭:</ItemTitle>
                      <ItemDesc>맞춤형 코칭으로 사업 방향성과 세부 전략을 구체화합니다.</ItemDesc>
                    </ItemContent>
                  </SolutionItem>
                  <SolutionItem>
                    <FontAwesomeIcon icon={faCheck} />
                    <ItemContent>
                      <ItemTitle>최대 5천만원 바우처 지원:</ItemTitle>
                      <ItemDesc>초기 사업자들이 필요한 지원을 최소 자본으로 받을 수 있도록 돕습니다.</ItemDesc>
                    </ItemContent>
                  </SolutionItem>
                </SolutionList>
              </SolutionWrapper>
            </Container>
          </SolutionSection>

          <TestimonialSection>
            <Container>
              <SectionTitle>
                수강생들의 후기와 <HighlightSpan>실질적 성과</HighlightSpan>
              </SectionTitle>
              <TestimonialGrid>
                {StudentReviews.map(review => (
                  <ReviewCard key={review.id}>
                    <StudentEmoji>{review.emoji}</StudentEmoji>
                    <StudentName>{review.name}</StudentName>
                    <StudentRole>{review.role}</StudentRole>
                    <ReviewText>"{review.review}"</ReviewText>
                  </ReviewCard>
                ))}
              </TestimonialGrid>
            </Container>
          </TestimonialSection>
        </Container>
      </ContentSection>

      <RegistrationSection>
        <Container>
          <RegistrationBox>
            <AlertText>
              <Emoji>⚡️</Emoji> 지금 아니면 놓칩니다!
            </AlertText>
            <RegistrationTitle>
              단 하루, AI 부스터로 성장의 첫걸음을 시작하세요!
            </RegistrationTitle>
            <RegistrationForm onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="이름"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? '처리중...' : '특강 비밀 링크 전송'}
              </SubmitButton>
              <FormDisclaimer>
                이메일은 특강 안내와 뉴스레터 발송을 위해서 활용되며,<br />
                언제든 수신거부가 가능합니다.
              </FormDisclaimer>
            </RegistrationForm>
          </RegistrationBox>
        </Container>
      </RegistrationSection>
    </LandingPage>
  );
};

export default EventLanding; 