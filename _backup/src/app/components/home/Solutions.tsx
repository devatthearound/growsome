import { useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Define global styles
const GlobalStyle = createGlobalStyle`
  a {
    text-decoration: none;
  }
`;

const Solutions = () => {
  const numberRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = numberRefs.current.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && index !== -1) {
            setVisibleItems((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          } else if (index !== -1) {
            setVisibleItems((prev) => {
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-10% 0px'
      }
    );

    numberRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <GlobalStyle />
      <SolutionsContainer>
        <ContentWrapper>
          <HeadingSection>
            <MainHeading>
            그로우썸,  <br />
              <HighlightText>AI 활용 3가지 방법</HighlightText>
            </MainHeading>
          </HeadingSection>

          <SolutionsList>
            <SolutionItem
              ref={(el) => {
                if (el) numberRefs.current[0] = el;
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: visibleItems[0] ? 1 : 0, y: visibleItems[0] ? 0 : 50 }}
              transition={{ duration: 0.8 }}
            >
              <SolutionNumber>01</SolutionNumber>
              <SolutionTitle>그로우썸 비밀연구소</SolutionTitle>
              <SolutionDescription>
                매주 토요일 아침, 저는 여러분이 1인 온라인 사업을 시작하고 확장하는 데 도움이 되는 실질적인 자료를 공유합니다.
              </SolutionDescription>
              <InputWrapper>
                <SubscribeButton as="a" href="https://open.kakao.com/o/gqWxH1Zg" target="_blank" rel="noopener noreferrer">
                  비밀연구소 참여하기
                </SubscribeButton>
              </InputWrapper>
            </SolutionItem>

            <SolutionItem
              ref={(el) => {
                if (el) numberRefs.current[1] = el;
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: visibleItems[1] ? 1 : 0, y: visibleItems[1] ? 0 : 50 }}
              transition={{ duration: 0.8 }}
            >
              <SolutionNumber>02</SolutionNumber>
              <SolutionTitle>AI 자동화를 위한 실전 솔루션</SolutionTitle>
              <SolutionDescription>
                성공을 확인하고, 수익성 있는 아이디어를 찾고, 사업을 구축하고, 지식을 실현하는 방법을 가르쳐 주는 자기 주도형 학습으로 실전에 바로 적용할 수 있습니다.
              </SolutionDescription>
              <ViewButton as={Link} href="/product">
                실전 솔루션 보기
              </ViewButton>
            </SolutionItem>

            <SolutionItem
              ref={(el) => {
                if (el) numberRefs.current[2] = el;
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: visibleItems[2] ? 1 : 0, y: visibleItems[2] ? 0 : 50 }}
              transition={{ duration: 0.8 }}
            >
              <SolutionNumber>03</SolutionNumber>
              <SolutionTitle>함께 만드는 AI 토이 프로젝트(준비중)</SolutionTitle>
              <SolutionDescription>
                그로우썸은 AI 기반 비즈니스를 운영하는 사람들과 함께 성장할 수 있는 네트워크입니다. 함께 기여하고 협업하면서 가치를 나누는 구조를 만들어갑니다. 자신의 브랜드를 알리고, 실제 고객과 연결될 수 있는 기회를 찾고 있다면 함께하세요.
              </SolutionDescription>
              {/*<LearnMoreButton as={Link} href="/toyprojects">
                AI 협업 기회 살펴보기
              </LearnMoreButton>*/}
            </SolutionItem>
          </SolutionsList>
        </ContentWrapper>
      </SolutionsContainer>
    </>
  );
};

const SolutionsContainer = styled.section`
  background-color: rgb(6, 13, 52);
  color: white;
  padding: 80px 0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const HeadingSection = styled.div`
  grid-column: 1;
  position: sticky;
  top: 80px;
  
  @media (max-width: 1024px) {
    position: static;
    grid-row: 1;
    margin-bottom: 20px;
  }
`;

const MainHeading = styled.h2`
  font-size: 3.5rem;
  line-height: 1.3;
  font-weight: 600;
  margin-top: 0;
  padding-top: 0;
  letter-spacing: -3px;

  @media (max-width: 1024px) {
    font-size: 2.8rem;
    text-align: left;
  }
`;

const HighlightText = styled.span`
  color: #03FF00;
`;

const SolutionsList = styled.div`
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 60px;
  margin-top: 0;
  padding-top: 0;

  @media (max-width: 1024px) {
    grid-column: 1;
    grid-row: 2;
    gap: 40px;
  }
`;

const SolutionItem = styled(motion.div)`
  max-width: 600px;
`;

const SolutionNumber = styled.span`
  font-size: 2rem;
  color: #514FE4;
  margin-bottom: 20px;
  display: block;
  opacity: 0.3;
  transition: all 0.4s ease-out;

  &.active {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SolutionTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const SolutionDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  opacity: 0.9;
  font-weight: 400;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  max-width: 500px;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const SubscribeButton = styled(Button)`
  background-color: #03FF00;
  color: rgb(6, 13, 52);
  font-weight: 800;
  text-decoration: none;

  &:hover {
    background: #02cc00;
  }
`;

const ViewButton = styled(Button)`
  background-color: #03FF00;
  color: rgb(6, 13, 52);
  font-weight: 800;

  &:hover {
    background: #02cc00;
  }
`;

const LearnMoreButton = styled(ViewButton)``;

export default Solutions;
