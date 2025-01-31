import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const SpecialGift = () => {
  const handleTypeformClick = () => {
    window.open('https://eh229nbfh7d.typeform.com/to/snuSnumO', '_blank');
  };

  return (
    <GiftPage>
      <HeroSection>
        <Container>
          <HeroContent>
           <MainTitle><GiftEmoji>🎁</GiftEmoji> 그로우썸의 특별한 선물 <GiftEmoji>🎁</GiftEmoji>
            </MainTitle>
            <SubTitle>
              매출 성장과 업무 효율화를 위한<br />
              실전 마케팅 전략!
            </SubTitle>
          </HeroContent>
        </Container>
      </HeroSection>

      <ContentSection>
        <Container>
          <BookSection>
            <BookInfo>
              <SectionTitle>AI 부스터 빌드업 마케팅</SectionTitle>
              <Description>
                팔로워가 많다고<br/>
                매출이 잘 나오는 것이 아닙니다!<br/>
                팔로워 수와 상관없이<br/>
                폭발적으로 고객을 만들어내는 비밀을 담은<br/>
                "AI 부스터 빌드업 마케팅" 책을<br/>
                선물로 드립니다.
              </Description>
              <AdditionalInfo>
                이 선물은 매출 성장과 업무 효율화를 만들어가며<br/>
                실제로 사용했던 전략을 바탕으로 작성되었습니다.<br/>
                그로우썸 클래스를 신청하는 분들에게 특별한 혜택으로 제공되며,<br/>
                여러분의 상품 마케팅에 그대로 적용해 볼 수 있는 노하우를 전해드립니다.
              </AdditionalInfo>
            </BookInfo>
            <BookImage>
              <img src="/images/book-cover.png" alt="AI 부스터 빌드업 마케팅 책" />
            </BookImage>
          </BookSection>

          <EmailGuideSection>
            <GuideTitle>
              <FontAwesomeIcon icon={faEnvelope} /> 메일 놓치지 않는 방법
            </GuideTitle>
            <GuideText>
              강의 링크는 신청하신 이메일로 전송되지만,<br/>
              종종 [스팸함] 또는 [프로모션함]에 빠져<br/>
              놓치는 경우가 많습니다.<br/>
              확실하게 받기 위해, 아래 방법으로 메일함을 설정해 주세요:
            </GuideText>
            <GuideList>
              <GuideItem>
                <GuideLabel>네이버 메일:</GuideLabel>
                받은 메일함에서 메일을 오른쪽 클릭 → "내 메일함으로 자동분류하기" 선택
              </GuideItem>
              <GuideItem>
                <GuideLabel>Gmail:</GuideLabel>
                필터 설정을 통해 수신함으로 분류
              </GuideItem>
            </GuideList>
          </EmailGuideSection>

          <CTAButton onClick={handleTypeformClick}>
            특별 선물 받기 (AI 부스터 빌드업 마케팅)
          </CTAButton>
          <Disclaimer>
            * 이메일은 선물 및 강의 안내, 뉴스레터 구독을 위해서 활용되며, 언제든지 구독 해제가 가능합니다.
          </Disclaimer>
        </Container>
      </ContentSection>
    </GiftPage>
  );
};

const GiftPage = styled.div`
  padding-top: 80px;
`;

const HeroSection = styled.section`
  background: #514FE4;
  padding: 80px 0;
  color: white;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const GiftEmoji = styled.span`
  font-size: 2.5rem;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 1rem 0;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.5;
`;

const ContentSection = styled.section`
  padding: 80px 0;
  background: white;
`;

const BookSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 4rem;
  text-align: center;
`;

const BookInfo = styled.div``;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #514FE4;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const AdditionalInfo = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const BookImage = styled.div`
  text-align: center;
  
  img {
    width: 100%;
    max-width: 300px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }
`;

const EmailGuideSection = styled.div`
  background: #f8f9fa;
  padding: 3rem;
  border-radius: 20px;
  margin-bottom: 3rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const GuideTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #514FE4;

  svg {
    margin-right: 0.5rem;
  }
`;

const GuideText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const GuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GuideItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const GuideLabel = styled.span`
  font-weight: 600;
  color: #333;
`;

const CTAButton = styled.button`
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1.5rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4340c0;
    transform: translateY(-2px);
  }
`;

const Disclaimer = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

export default SpecialGift; 