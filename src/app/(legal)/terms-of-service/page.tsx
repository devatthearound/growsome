'use client';

import React from 'react';
import styled from 'styled-components';

const TermsOfService = () => {
  return (
    <Container>
      <ContentWrapper>
        <Title>그로우썸 이용약관</Title>
        <SubTitle>GrowSome Terms of Use</SubTitle>
        <LastUpdated>최종 수정일: 2025년 4월 8일</LastUpdated>
        
        <Section>
          <SectionTitle>제1조 (목적)</SectionTitle>
          <SectionContent>
            <p>이 약관은 그로우썸(이하 "회사")이 제공하는 개방형 커뮤니티 기반의 오픈소스 및 유료 SaaS 서비스 이용과 관련하여, 회사와 회원 간 권리·의무 및 책임사항, 서비스 이용조건 등 기본적인 사항을 규정함을 목적으로 합니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제2조 (정의)</SectionTitle>
          <SectionContent>
            <p>"서비스"란 회사가 운영하는 웹사이트(GrowSome.kr)를 통해 제공되는 온라인 플랫폼, 디지털 콘텐츠, 유료 SaaS, 오픈소스 도구, 커뮤니티, 교육 등을 말합니다.</p>
            <p>"회원"은 회사에 개인정보를 제공하고 약관에 동의하여 회원가입을 완료한 자를 의미합니다.</p>
            <p>"비회원"은 회원가입 없이 일부 서비스만 이용하는 자를 말합니다.</p>
            <p>"콘텐츠"란 텍스트, 이미지, 영상, 코드, 문서 등 회사 또는 회원이 제공하는 자료를 의미합니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제3조 (약관의 게시 및 개정)</SectionTitle>
          <SectionContent>
            <p>본 약관은 서비스 초기 화면에 게시되며, 이용자는 언제든지 확인할 수 있습니다.</p>
            <p>회사는 필요시 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 사전 고지합니다.</p>
            <p>개정 약관에 이의가 있는 회원은 탈퇴할 수 있으며, 고지 후 7일 이내 이의 제기 없을 경우 동의한 것으로 간주합니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제4조 (서비스의 구성 및 특성)</SectionTitle>
          <SectionContent>
            <p>회사는 아래의 서비스를 제공합니다.</p>
            <ul>
              <li>온라인 커뮤니티 서비스</li>
              <li>오픈소스 기반 개발도구 또는 템플릿 배포</li>
              <li>SaaS형 유료 자동화 서비스</li>
              <li>온라인 강의 및 콘텐츠 제공</li>
              <li>기획·개발·컨설팅 서비스</li>
              <li>제휴 마케팅, 전자상거래 등</li>
            </ul>
            <p>일부 서비스는 회원가입 및 결제 후에만 제공됩니다.</p>
            <p>오픈소스 도구는 [해당 오픈소스 라이선스] 조건을 따르며, 상업적 활용 시 제한이 있을 수 있습니다. 각 도구별 라이선스는 별도로 고지합니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제5조 (회원가입)</SectionTitle>
          <SectionContent>
            <p>회원가입은 본 약관 및 개인정보처리방침 동의 후, 회사가 정한 절차에 따라 신청하면 회사의 승낙으로 성립됩니다.</p>
            <p>회원은 타인의 정보를 도용하거나 허위 정보를 입력해서는 안 됩니다.</p>
            <p>회사는 특정 사유(예: 명의도용, 서비스 부정 이용 등)에 해당할 경우 가입을 거부할 수 있습니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제6조 (회원의 의무)</SectionTitle>
          <SectionContent>
            <p>회원은 관련 법령, 약관, 이용안내 등을 준수해야 합니다.</p>
            <p>회원은 회사의 사전 승인 없이 서비스를 상업적 목적 또는 타인에게 유상 제공하는 용도로 이용할 수 없습니다.</p>
            <p>오픈소스 및 커뮤니티 콘텐츠 공유 시, 해당 라이선스 및 출처 표시를 명확히 해야 합니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제7조 (지식재산권)</SectionTitle>
          <SectionContent>
            <p>회사가 제작한 콘텐츠(텍스트, 이미지, 코드, 영상 등)에 대한 저작권은 회사에 있습니다.</p>
            <p>회원이 게시한 콘텐츠에 대한 권리는 회원 본인에게 있으나, 서비스 운영에 필요한 범위 내에서 회사에 사용을 허락합니다.</p>
            <p>회원은 타인의 저작권, 상표권 등 지식재산권을 침해하지 않아야 하며, 위반 시 민·형사상 책임을 집니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제8조 (서비스 이용 제한 및 탈퇴)</SectionTitle>
          <SectionContent>
            <p>회원은 언제든지 탈퇴 요청이 가능하며, 회사는 즉시 처리합니다.</p>
            <p>아래의 경우 회사는 사전 통보 없이 이용 제한 또는 회원 자격을 박탈할 수 있습니다.</p>
            <ul>
              <li>타인 명의 도용, 부정한 결제 시도</li>
              <li>오픈소스/콘텐츠 불법 복제 및 유포</li>
              <li>커뮤니티 내 욕설, 혐오, 광고 등 운영방해 행위</li>
              <li>자동화 툴의 악의적 사용 (서버 과부하 유발 등)</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제9조 (유료 서비스 및 환불 정책)</SectionTitle>
          <SectionContent>
            <p>유료 서비스 결제 및 환불 조건은 '환불 정책' 페이지에 따릅니다.</p>
            <p>회사는 서비스 제공 전 또는 계약서상 기재된 범위 내에서 환불이 가능하며, 일정 조건에서는 환불이 제한될 수 있습니다.</p>
            <p>반복적인 환불 요청, 악의적 사용 기록이 있는 경우 회사는 서비스 이용을 제한할 수 있습니다.</p>
            <p><strong>각 패키지(베이직/스탠다드/프리미엄)의 상세 가격 및 제공 내용은 <a href="https://growsome.kr/solutions" target="_blank" rel="noopener noreferrer">패키지 안내 페이지</a>를 참고하세요.</strong></p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제10조 (책임의 한계)</SectionTitle>
          <SectionContent>
            <p>회사는 회원이 서비스를 통해 기대하는 수준의 결과를 보장하지 않으며, 사용 결과에 따른 손해에 대해서는 책임을 지지 않습니다.</p>
            <p>천재지변, 시스템 오류, 제3자의 공격 등 불가항력적 사유로 인한 손해는 회사의 책임 범위에 포함되지 않습니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제11조 (준거법 및 분쟁 해결)</SectionTitle>
          <SectionContent>
            <p>본 약관은 대한민국 법률을 준거법으로 하며,</p>
            <p>회사와 회원 간 분쟁 발생 시, 서울중앙지방법원을 1심 관할 법원으로 합니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>📩 문의처</SectionTitle>
          <SectionContent>
            <p>이메일: master@growsome.kr</p>
            <p>공식 홈페이지: https://growsome.kr</p>
          </SectionContent>
        </Section>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
`;

const SubTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 10px;
  text-align: center;
`;

const LastUpdated = styled.p`
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 40px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const SectionContent = styled.div`
  color: #444;
  line-height: 1.6;
  
  p {
    margin-bottom: 15px;
  }
  
  ul {
    padding-left: 20px;
    margin-bottom: 15px;
  }
  
  li {
    margin-bottom: 8px;
  }
`;

export default TermsOfService; 