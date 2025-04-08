'use client';

import React from 'react';
import styled from 'styled-components';

const RefundPolicy = () => {
  return (
    <Container>
      <ContentWrapper>
        <Title>환불정책</Title>
        <LastUpdated>최종 수정일: 2025년 4월 8일</LastUpdated>
        
        <Section>
          <SectionTitle>1. 총칙</SectionTitle>
          <SectionContent>
            <p>그로우썸(이하 '회사')은 고객의 권익 보호와 투명한 거래를 위하여 아래와 같은 환불 정책을 운영합니다. 본 환불 정책은 회사의 유료 서비스 및 상품에 적용됩니다.</p>
            <p className="legal-note">(전자상거래법 제17조 및 동 시행령 제21조, 콘텐츠산업진흥법 제27조 준수)</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>2. 환불이 가능한 경우</SectionTitle>
          
          <SubSection>
            <SubSectionTitle>① 강의/구독형 서비스</SubSectionTitle>
            <Table>
              <thead>
                <tr>
                  <th>상황</th>
                  <th>환불 기준</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>결제 후 7일 이내, 수강 전</td>
                  <td>전액 환불</td>
                  <td>디지털 콘텐츠 미접속 조건</td>
                </tr>
                <tr>
                  <td>수강 시작 후, 강의 1/3 이하 수강</td>
                  <td>50% 환불</td>
                  <td>다운로드/스트리밍 기록 기준</td>
                </tr>
                <tr>
                  <td>강의 1/3 초과 수강</td>
                  <td>환불 불가</td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
            <Note>※ 구독 상품은 '다음 결제일 3일 전까지' 해지 요청 시, 차기 결제 중단 가능</Note>
          </SubSection>
          
          <SubSection>
            <SubSectionTitle>② 디지털 콘텐츠(파일 제공형 콘텐츠 포함)</SubSectionTitle>
            <SectionContent>
              <p>콘텐츠 다운로드 또는 스트리밍 시작 시점 이후 환불 불가</p>
              <p>단, 콘텐츠 오류·누락 등 회사 귀책 시 전액 환불</p>
            </SectionContent>
          </SubSection>
          
          <SubSection>
            <SubSectionTitle>③ 기획·개발·컨설팅 용역</SubSectionTitle>
            <Table>
              <thead>
                <tr>
                  <th>진행 단계</th>
                  <th>환불 가능 여부</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>계약 후 착수 전</td>
                  <td>전액 환불 (단, 결제 수수료 제외)</td>
                </tr>
                <tr>
                  <td>기획/디자인/초기작업 착수 후</td>
                  <td>투입된 시간·비용을 공제 후 부분 환불</td>
                </tr>
                <tr>
                  <td>최종 납품 또는 개발 50% 이상 진행</td>
                  <td>환불 불가</td>
                </tr>
              </tbody>
            </Table>
            <Note>※ 견적서/계약서/기획안으로 단계 기준 명시 가능</Note>
          </SubSection>
          
          <SubSection>
            <SubSectionTitle>④ 스터디 프로그램</SubSectionTitle>
            <Table>
              <thead>
                <tr>
                  <th>상황</th>
                  <th>환불 기준</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>스터디 시작 전</td>
                  <td>전액 환불</td>
                </tr>
                <tr>
                  <td>1회 참여 후</td>
                  <td>수강료의 70% 환불</td>
                </tr>
                <tr>
                  <td>2회 이상 참여 시</td>
                  <td>환불 불가</td>
                </tr>
              </tbody>
            </Table>
          </SubSection>
          
          <SubSection>
            <SubSectionTitle>⑤ 실물 상품 판매 (배송형 상품)</SubSectionTitle>
            <SectionContent>
              <p>단순 변심에 의한 환불 요청: 수령 후 7일 이내 가능, 왕복 배송비 고객 부담</p>
              <p>상품 불량·오배송 등 회사 귀책 시: 전액 환불 또는 교환 처리</p>
            </SectionContent>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>3. 환불 요청 방법</SectionTitle>
          <SectionContent>
            <p>요청 채널: 고객센터 이메일(master@growsome.kr) 또는 마이페이지의 결제 내역</p>
            <p>처리 기한: 요청일로부터 영업일 기준 3일 이내 환불 가능 여부 회신, 7일 이내 환불 처리</p>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>4. 환불 불가 사유</SectionTitle>
          <SectionContent>
            <ul>
              <li>고객 귀책으로 인한 콘텐츠 손상 또는 이용 불가</li>
              <li>사전 공지된 환불 불가 항목 및 조건 위반</li>
              <li>부정 결제, 계정 도용 등 위법·위반 행위 적발 시</li>
            </ul>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>5. 기타 안내</SectionTitle>
          <SectionContent>
            <ul>
              <li>환불 시 PG사(토스페이먼츠 등) 수수료 및 결제 수수료가 차감될 수 있습니다.</li>
              <li>환불 금액은 최초 결제 수단 기준으로 환급됩니다.</li>
              <li>본 정책은 관련 법령 개정 시 변경될 수 있으며, 변경 시 홈페이지를 통해 고지합니다.</li>
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
  margin-bottom: 25px;
`;

const SubSectionTitle = styled.h3`
  font-size: 1.2rem;
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
  
  ul, ol {
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

const Note = styled.p`
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin-top: 5px;
  margin-bottom: 15px;
`;

const LegalNote = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
  margin-bottom: 15px;
`;

export default RefundPolicy; 