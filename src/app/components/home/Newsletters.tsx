import React from 'react';
import styled from 'styled-components';

const Newsletters = () => {
    return (
      <NewslettersContainer>
        <ContentWrapper>
          <Header>
            <SubTitle>RECENT ISSUES OF</SubTitle>
            <Title>
              <TitleHighlight>그로우썸</TitleHighlight> 비밀연구소
            </Title>
          </Header>
  
          <NewsletterGrid>
            <NewsletterCard>
              <CardHeader>
                <ProfileImage src="/images/letters/growsome.png" alt="profile" />
                <BrandInfo>
                  <BrandLogo>그로우썸 비밀연구소</BrandLogo>
                </BrandInfo>
              </CardHeader>
              <IssueNumber>#3</IssueNumber>
              <CardTitle>Next.js와 TypeScript로 블로그 만들기</CardTitle>
              <ReadTime>2025.03.01 - 3분 읽기</ReadTime>
            </NewsletterCard>
  
            <NewsletterCard white>
              <CardHeader>
                <ProfileImage src="/images/letters/growsome.png" alt="profile" />
                <BrandInfo>
                  <BrandLogo>그로우썸 비밀연구소</BrandLogo>
                </BrandInfo>
              </CardHeader>
              <IssueNumber>#2</IssueNumber>
              <CardTitle>AI 프롬프트 엔지니어링 기초</CardTitle>
              <ReadTime>2025.02.24 - 7분 읽기</ReadTime>
            </NewsletterCard>
  
            <NewsletterCard dark>
              <CardHeader>
                <ProfileImage src="/images/letters/growsome.png" alt="profile" />
                <BrandInfo>
                  <BrandLogo>그로우썸 비밀연구소</BrandLogo>
                </BrandInfo>
              </CardHeader>
              <IssueNumber>#1</IssueNumber>
              <CardTitle>프리랜서 개발자 생존기</CardTitle>
              <ReadTime>2025.02.17 - 10분 읽기</ReadTime>
            </NewsletterCard>
          </NewsletterGrid>
  
          <ReadMoreButton>더보기</ReadMoreButton>
        </ContentWrapper>
      </NewslettersContainer>
    );
  };
  
  const NewslettersContainer = styled.section`
    background-color: #f8f9fa;
    padding: 80px 0;
  `;
  
  const ContentWrapper = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  `;
  
  const Header = styled.div`
    text-align: center;
    margin-bottom: 60px;
  `;
  
  const SubTitle = styled.h3`
    color: #8890a0;
    font-size: 1rem;
    margin-bottom: 16px;
  `;
  
  const Title = styled.h2`
    font-size: 2.5rem;
    color: #1a1a1a;
    font-weight: 800;
  `;
  
  const TitleHighlight = styled.span`
    color: #514fe4;
  `;
  
  const NewsletterGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 40px;
  
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  `;
  
  const NewsletterCard = styled.div<{ white?: boolean; dark?: boolean }>`
    background-color: ${props => props.white ? '#ffffff' : props.dark ? '#060D34' : '#514fe4'};
    color: ${props => props.white ? '#1a1a1a' : '#ffffff'};
    padding: 24px;
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.2s;
    border: ${props => props.white ? '1px solid #d3d3d3' : 'none'};
  
    &:hover {
      transform: translateY(-4px);
    }
  `;
  
  const CardHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  `;
  
  const ProfileImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
  `;
  
  const BrandInfo = styled.div`
    display: flex;
    flex-direction: column;
  `;
  
  const BrandLogo = styled.span`
    font-size: 0.9rem;
    opacity: 0.8;
  `;
  
  const IssueNumber = styled.span`
    font-size: 1.1rem;
    opacity: 0.7;
    margin-bottom: 12px;
    display: block;
  `;
  
  const CardTitle = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 16px;
    line-height: 1.3;
  `;
  
  const ReadTime = styled.span`
    font-size: 0.9rem;
    opacity: 0.6;
  `;
  
  const ReadMoreButton = styled.button`
    display: block;
    margin: 40px auto 0;
    padding: 12px 32px;
    border: 1px solid #ddd;
    border-radius: 24px;
    background: transparent;
    color: #1a1a1a;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  
    &:hover {
      background: #f0f0f0;
    }
  `;
  
  export default Newsletters;