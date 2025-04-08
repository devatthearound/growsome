'use client';

import React from 'react';
import styled from 'styled-components';

const PrivacyPolicy = () => {
  return (
    <Container>
      <ContentWrapper>
        <Title>GrowSome 개인정보처리방침</Title>
        <LastUpdated>최종 개정일: 2025년 4월 8일</LastUpdated>
        
        <Section>
          <SectionContent>
            <p>그로우썸(이하 '회사')은 「개인정보 보호법」 등 관련 법령을 준수하며, 고객의 개인정보를 안전하게 보호하기 위해 다음과 같은 개인정보처리방침을 수립·공개합니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제1조. 수집하는 개인정보 항목 및 수집 방법</SectionTitle>
          <SubSection>
            <SubSectionTitle>1. 수집 항목</SubSectionTitle>
            <SectionContent>
              <p>회사는 서비스 제공 및 운영을 위해 아래와 같은 개인정보를 수집합니다.</p>
              <Table>
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>수집 항목</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>필수 정보</td>
                    <td>이름, 이메일 주소, 비밀번호, 휴대폰 번호</td>
                  </tr>
                  <tr>
                    <td>선택 정보</td>
                    <td>직무/직군, 회사명, SNS 계정(커뮤니티 연동 시)</td>
                  </tr>
                  <tr>
                    <td>결제 시</td>
                    <td>카드사명, 결제 승인정보(토스페이먼츠 제공), 청구지 주소(실물 상품 배송 시)</td>
                  </tr>
                  <tr>
                    <td>자동 수집</td>
                    <td>IP 주소, 쿠키, 브라우저 정보, 접속 일시, 기기정보, 이용기록</td>
                  </tr>
                </tbody>
              </Table>
            </SectionContent>
          </SubSection>
          
          <SubSection>
            <SubSectionTitle>2. 수집 방법</SubSectionTitle>
            <SectionContent>
              <p>회원가입, 서비스 이용 신청, 이벤트 응모, 고객센터 문의, 자동 생성 정보(로그 기록 등)</p>
            </SectionContent>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>제2조. 개인정보의 수집 및 이용 목적</SectionTitle>
          <SectionContent>
            <p>회사는 수집한 개인정보를 다음의 목적을 위해 사용합니다.</p>
            <Table>
              <thead>
                <tr>
                  <th>목적</th>
                  <th>상세 내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>회원관리</td>
                  <td>가입, 본인확인, 서비스 이용 이력 관리</td>
                </tr>
                <tr>
                  <td>서비스 제공</td>
                  <td>강의, SaaS, 컨설팅, 콘텐츠 구매 이력 확인 및 제공</td>
                </tr>
                <tr>
                  <td>결제 및 정산</td>
                  <td>유료 서비스 결제, 환불, 세금계산서 발행 등</td>
                </tr>
                <tr>
                  <td>마케팅 및 홍보</td>
                  <td>뉴스레터, 서비스 안내, 이벤트/기획전 알림 (동의자 한정)</td>
                </tr>
                <tr>
                  <td>서비스 개선</td>
                  <td>이용 패턴 분석 및 품질 향상, 고객 피드백 반영</td>
                </tr>
              </tbody>
            </Table>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제3조. 개인정보의 보유 및 이용기간</SectionTitle>
          <SectionContent>
            <p>회원 탈퇴 시 즉시 파기되며, 관련 법령에 따라 보존이 필요한 경우 일정 기간 보관 후 파기합니다.</p>
            <Table>
              <thead>
                <tr>
                  <th>항목</th>
                  <th>보유기간</th>
                  <th>근거 법령</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>계약/결제 기록</td>
                  <td>5년</td>
                  <td>전자상거래법</td>
                </tr>
                <tr>
                  <td>소비자 불만/분쟁 처리 기록</td>
                  <td>3년</td>
                  <td>전자상거래법</td>
                </tr>
                <tr>
                  <td>웹사이트 접속 기록</td>
                  <td>3개월</td>
                  <td>통신비밀보호법</td>
                </tr>
              </tbody>
            </Table>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제4조. 개인정보의 제3자 제공</SectionTitle>
          <SectionContent>
            <p>회사는 원칙적으로 고객의 개인정보를 외부에 제공하지 않습니다.</p>
            <p>단, 아래의 경우 예외로 제공될 수 있습니다:</p>
            <ul>
              <li>이용자의 사전 동의가 있는 경우</li>
              <li>관계 법령에 따라 법적 의무를 이행하기 위한 경우</li>
              <li>결제 처리 시 PG사(토스페이먼츠 등)에 필요한 정보 제공</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제5조. 개인정보 처리 위탁</SectionTitle>
          <SectionContent>
            <p>회사는 서비스 운영을 위해 다음과 같이 개인정보 처리 업무를 외부 업체에 위탁하고 있습니다.</p>
            <Table>
              <thead>
                <tr>
                  <th>수탁업체</th>
                  <th>위탁 업무 내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>토스페이먼츠</td>
                  <td>결제 및 정산 대행</td>
                </tr>
                <tr>
                  <td>아임웹/가비아 등</td>
                  <td>웹사이트 호스팅 및 데이터 백업</td>
                </tr>
                <tr>
                  <td>Google, Meta 등</td>
                  <td>광고 및 서비스 분석 (익명화된 데이터 기준)</td>
                </tr>
              </tbody>
            </Table>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제6조. 이용자의 권리와 행사 방법</SectionTitle>
          <SectionContent>
            <p>이용자는 언제든지 본인의 개인정보를 열람, 수정, 삭제, 처리정지를 요청할 수 있습니다.</p>
            <p>회원탈퇴는 마이페이지에서 직접 가능하며, 탈퇴 즉시 개인정보는 파기됩니다.</p>
            <p>법정대리인의 동의가 필요한 만 14세 미만 아동의 정보는 수집하지 않습니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제7조. 개인정보의 파기 절차 및 방법</SectionTitle>
          <SectionContent>
            <p>수집 목적 달성 시 또는 보유기간 종료 시 지체 없이 파기합니다.</p>
            <p>전자적 파일은 복구 불가능한 방법으로 삭제하며, 출력물은 분쇄 또는 소각하여 파기합니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제8조. 쿠키(Cookie)의 설치·운영 및 거부</SectionTitle>
          <SectionContent>
            <p>회사는 맞춤형 서비스 제공 및 분석을 위해 쿠키를 사용합니다.</p>
            <p>이용자는 웹 브라우저의 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제9조. 개인정보 보호를 위한 기술적/관리적 대책</SectionTitle>
          <SectionContent>
            <ul>
              <li>SSL 기반 암호화 통신 적용</li>
              <li>중요 정보 암호화 저장 (비밀번호 등)</li>
              <li>접근통제 및 서버 접근로그 기록</li>
              <li>최소 인원 접근 원칙, 정기 보안 교육 실시</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제10조. 개인정보 보호책임자</SectionTitle>
          <SectionContent>
            <p>회사는 개인정보 보호 관련 문의를 처리하기 위해 아래와 같이 책임자를 지정하고 있습니다.</p>
            <Table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>성명</th>
                  <th>연락처</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>개인정보 보호책임자</td>
                  <td>조현주</td>
                  <td>master@growsome.kr</td>
                </tr>
                <tr>
                  <td>개인정보 민원처리 담당</td>
                  <td>안효경</td>
                  <td>master@growsome.kr</td>
                </tr>
              </tbody>
            </Table>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>제11조. 고지 의무</SectionTitle>
          <SectionContent>
            <p>본 개인정보처리방침은 관련 법령 및 서비스 변경에 따라 사전 고지 후 변경될 수 있습니다.</p>
            <p>개정 시 홈페이지 공지사항 및 이메일을 통해 고지합니다.</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>📌 관련 법령 기준</SectionTitle>
          <SectionContent>
            <ul>
              <li>「개인정보 보호법」</li>
              <li>「정보통신망 이용촉진 및 정보보호 등에 관한 법률」</li>
              <li>「전자상거래 등에서의 소비자보호에 관한 법률」</li>
            </ul>
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

const SubSection = styled.div`
  margin-bottom: 20px;
`;

const SubSectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
  
  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  
  th {
    background-color: #f5f5f5;
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

export default PrivacyPolicy; 