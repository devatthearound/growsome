"use client"
import React from 'react';
import styled from 'styled-components';

const Impact = () => {
  return (
    <ImpactContainer>
      <Letter>
        <Greeting>Dear Future Innovator,</Greeting>
        
        <Body>
          <p>📌 AI는 단순한 도구가 아닙니다. 실행을 위한 엔진입니다.</p>
          <p>📌 Y Combinator, Antler와 같은 글로벌 VC도 AI 실행력을 강조합니다.</p>
          <p>📌 초기부터 수익 창출이 가능한 AI 기반 비즈니스 모델을 제공합니다.</p>
          <p>📌 기여하는 시스템을 통해 더 혁신적인 아이디어를 함께 실현할 수 있습니다.</p>
        </Body>

        <QuotesSection>
          <Quote>
            <QuoteText>"AI는 모든 산업을 변화시킬 것입니다. 하지만 이를 활용하는 사람만이 미래를 주도할 것입니다."</QuoteText>
            <QuoteAuthor>일론 머스크 (Elon Musk)</QuoteAuthor>
          </Quote>

          <Quote>
            <QuoteText>"AI를 활용하는 기업과 그렇지 않은 기업의 차이는 앞으로 점점 더 벌어질 것입니다."</QuoteText>
            <QuoteAuthor>사트야 나델라 (Satya Nadella), 마이크로소프트 CEO</QuoteAuthor>
          </Quote>

          <Quote>
            <QuoteText>"단순한 강의가 아닙니다. 실제 실행하고, 결과를 만드는 과정이었습니다."</QuoteText>
            <QuoteAuthor>김OO 님, 1기 수강생</QuoteAuthor>
          </Quote>
        </QuotesSection>

        <ConcernsSection>
          <p>📌 이런 고민을 하고 계신가요?</p>
          <p>✅ AI가 대체하는 시대, 내가 무엇을 해야 할지 막막한가요?</p>
          <p>✅ 사업계획서가 막막하고 어디서 시작할지 모르겠나요?</p>
          <p>✅ MVP나 제휴 마케팅을 하고 싶은데 방법을 모르시나요?</p>
        </ConcernsSection>

        <Solution>💡 그로우썸이 해결해드립니다.</Solution>

        <Closing>Sincerely,<br />The GrowSome Team</Closing>
      </Letter>
    </ImpactContainer>
  );
};

const ImpactContainer = styled.section`
  padding: 100px 20px;
  background-color: #F2F5FA;
  text-align: center;
`;

const Letter = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  color: #001C46;
`;

const Greeting = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #001C46;
`;

const Body = styled.div`
  font-size: 1.2rem;
  color: #001C46;
  margin-bottom: 40px;
`;

const QuotesSection = styled.div`
  max-width: 900px;
  margin: 0 auto 80px;
`;

const Quote = styled.blockquote`
  margin-bottom: 40px;
  padding: 30px;
  background: #fff;
  border-left: 5px solid #5C59E7;
  border-radius: 0 10px 10px 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const QuoteText = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  margin-bottom: 15px;
  color: #001C46;
`;

const QuoteAuthor = styled.footer`
  font-size: 1rem;
  color: #001C46;
`;

const ConcernsSection = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  color: #001C46;
`;

const Solution = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #5C59E7;
  padding: 25px;
  background: #e9ecef;
  border-radius: 10px;
`;

const Closing = styled.div`
  font-size: 1.2rem;
  color: #001C46;
  margin-top: 40px;
  text-align: right;
`;

export default Impact; 