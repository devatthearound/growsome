'use client'

import React from 'react';
import styled from 'styled-components';

const Introduce = () => {
  return (
    <IntroduceSection>
      <ProfileImage src="/images/letters/profile_growsome.png" alt="Growsome" />
      <IntroText>
      AI로 더 많은 사람이 <br /> 일과 삶을 주도할 수 있도록 돕습니다.
      </IntroText>
      <Letter>
        <LetterTitle>AI는 단순한 기술이 아닙니다.</LetterTitle>
        <LetterContent>
        <p>우리는 AI를 활용해 더 적게 일하고, 더 효율적으로 일하는 방법을 찾습니다.
        중요한 것은 속도가 아니라 방향입니다.</p>
        </LetterContent>

        <LetterTitle>돈을 버는 방식이 바뀌고 있습니다.</LetterTitle>
        
        <LetterContent><p>과거에는 열심히 일하는 것이 답이었지만,<br />
        이제는 데이터의 흐름이 트래픽이 되고, 트래픽이 수익이 됩니다.<br />
        "어떻게 하면 더 많이 벌 수 있을까?"보다,<br />
        "어떻게 하면 내 시간을 지키면서 수익을 만들 수 있을까?"<br />
        이 질문이 더 중요해졌습니다.<br />

        영어를 배우듯, 우리는 온라인의 언어를 배워야 합니다.<br />
        디지털 환경을 이해하고, <br />데이터를 다룰 줄 아는 것이 새로운 경쟁력입니다.</p>
        </LetterContent>

        <LetterTitle>우리가 추구하는 것,</LetterTitle>
        <LetterContent>
        <p>✔ AI로 더 똑똑하고 창의적으로 일하기<br />
        ✔ 운영을 단순하고 효율적으로 만들기<br />
        ✔ 나만의 시스템을 구축해 자유로운 삶을 살기</p>
        </LetterContent>

        <LetterTitle>우리는 혼자가 아닙니다.</LetterTitle>
        <LetterContent>
        <p>AI를 활용해 더 큰 가치를 만들고,<br />
        함께 성장해 나갑니다.<br />

        당신의 시간을 소중하게.<br />
        당신의 가능성을 확장하는 방법을 함께 찾겠습니다.</p>
        </LetterContent>
        {/*<MoreInfoButton>그로우썸에 대한 더 많은 정보 보기</MoreInfoButton>*/}
      </Letter>
    </IntroduceSection>
  );
};

const IntroduceSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #F2F5FA;
  color: #001C46;
  padding: 150px 50px;
  text-align: center;

  @media (max-width: 1024px) {
    padding: 100px 30px;
  }
`;

const ProfileImage = styled.img`
  width: 200px;
  height: auto;
  border-radius: 50%;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    width: 180px;
  }
`;

const IntroText = styled.p`
  font-size: 2.5rem;
  font-weight: 700;
  max-width: 600px;
  margin: 0 auto;
  letter-spacing: -1px;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
    max-width: 500px;
  }
`;

const Letter = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: left;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1024px) {
    max-width: 500px;
    margin-top: 80px;
  }
`;

const LetterTitle = styled.h3`
  font-size: 1.8rem;
  color: #5C59E7;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: -1px;

  @media (max-width: 1024px) {
    font-size: 1.6rem;
  }
`;

const LetterContent = styled.div`
  font-size: 1.5rem;
  line-height: 1.9;
  margin-bottom: 40px;
  letter-spacing: -1px;
  text-align: center;

  p {
    margin-bottom: 20px;
  }

  .highlight {
    background: linear-gradient(180deg, rgba(255,255,255,0) 50%, #FFE898 50%);
    padding: 0 4px;
    font-weight: 500;
  }

  .highlight-blue {
    background: linear-gradient(180deg, rgba(255,255,255,0) 50%, #C7E8FF 50%);
    padding: 0 4px;
    font-weight: 500;
  }

  .highlight-pink {
    background: linear-gradient(180deg, rgba(255,255,255,0) 50%, #FFD6EC 50%);
    padding: 0 4px;
    font-weight: 500;
  }

  @media (max-width: 1024px) {
    font-size: 1.3rem;
    line-height: 1.7;
  }
`;

const MoreInfoButton = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: #5C59E7;
  background-color: transparent;
  border: 2px solid #5C59E7;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  margin-top: 20px;

  &:hover {
    background-color: #5C59E7;
    color: white;
  }
`;

export default Introduce; 