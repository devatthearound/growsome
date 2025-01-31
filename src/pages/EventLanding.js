import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

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

const AuthorRole = styled.div`
  font-size: 0.9rem;
  color: #666;
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

const EventLanding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // 로컬 스토리지에 저장
      localStorage.setItem('registration', JSON.stringify({
        ...formData,
        registeredAt: new Date()
      }));

      // special-gift 페이지로 이동
      navigate('/special-gift');
    } catch (error) {
      console.error('Error:', error);
      alert('등록 중 문제가 발생했습니다. 다시 시도해 주세요.');
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
              <HeroButton type="submit">
                특강 비밀 링크 전송
              </HeroButton>
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
                <TestimonialCard>
                  <TestimonialText>
                    "팔로워 없이도 매출이 가능하다는 사실을 확인했어요. AI 툴을 활용해 수익을 극대화할 방법을 배웠습니다."
                  </TestimonialText>
                  <TestimonialAuthor>
                    <AuthorImage>
                      <img src="/images/testimonials/user1.jpg" alt="수강생 1" />
                    </AuthorImage>
                    <AuthorInfo>
                      <AuthorName>김성장</AuthorName>
                      <AuthorRole>스타트업 대표</AuthorRole>
                    </AuthorInfo>
                  </TestimonialAuthor>
                </TestimonialCard>

                <TestimonialCard>
                  <TestimonialText>
                    "정부 지원금 활용법이 정말 실용적이었어요. 자금 부담 없이 안정적인 시작을 할 수 있었습니다."
                  </TestimonialText>
                  <TestimonialAuthor>
                    <AuthorImage>
                      <img src="/images/testimonials/user2.jpg" alt="수강생 2" />
                    </AuthorImage>
                    <AuthorInfo>
                      <AuthorName>이혁신</AuthorName>
                      <AuthorRole>예비창업자</AuthorRole>
                    </AuthorInfo>
                  </TestimonialAuthor>
                </TestimonialCard>

                <TestimonialCard>
                  <TestimonialText>
                    "사업 초보자인 저에게도 매우 유용한 강의였습니다. 이제는 저만의 고객층을 구축해가는 중입니다."
                  </TestimonialText>
                  <TestimonialAuthor>
                    <AuthorImage>
                      <img src="/images/testimonials/user3.jpg" alt="수강생 3" />
                    </AuthorImage>
                    <AuthorInfo>
                      <AuthorName>박창업</AuthorName>
                      <AuthorRole>1인 사업가</AuthorRole>
                    </AuthorInfo>
                  </TestimonialAuthor>
                </TestimonialCard>

                <TestimonialCard>
                  <TestimonialText>
                    "실전에서 바로 써먹을 수 있는 팁을 많이 얻었어요. 강의 내용이 실제 상황에 도움이 되었습니다."
                  </TestimonialText>
                  <TestimonialAuthor>
                    <AuthorImage>
                      <img src="/images/testimonials/user4.jpg" alt="수강생 4" />
                    </AuthorImage>
                    <AuthorInfo>
                      <AuthorName>최실전</AuthorName>
                      <AuthorRole>프리랜서</AuthorRole>
                    </AuthorInfo>
                  </TestimonialAuthor>
                </TestimonialCard>
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
              <SubmitButton type="submit">
                특강 비밀 링크 전송
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