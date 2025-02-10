'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const AdminDashboard = () => {
  return (
    <DashboardContainer>
      <Header>
        <h1>관리자 대시보드</h1>
      </Header>

      <GridContainer>
        {/* 퀵 메뉴 섹션 */}
        <QuickMenuSection>
          <SectionTitle>바로가기 메뉴</SectionTitle>
          <MenuGrid>
            <MenuItem href="/admin/blog">
              <MenuIcon>📝</MenuIcon>
              <MenuText>블로그 관리</MenuText>
            </MenuItem>
            {/* <MenuItem href="/admin/#">
              <MenuIcon>🛍️</MenuIcon>
              <MenuText>상품 관리</MenuText>
            </MenuItem>
            <MenuItem href="/admin/users">
              <MenuIcon>👥</MenuIcon>
              <MenuText>사용자 관리</MenuText>
            </MenuItem>
            <MenuItem href="/admin/orders">
              <MenuIcon>📦</MenuIcon>
              <MenuText>주문 관리</MenuText>
            </MenuItem> */}
            <MenuItem href="/admin/docs/post-service">
              <MenuIcon>📚</MenuIcon>
              <MenuText>개발 문서</MenuText>
            </MenuItem>
          </MenuGrid>
        </QuickMenuSection>

        {/* 통계 섹션 */}
        {/* <StatsSection>
          <SectionTitle>사이트 통계</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatTitle>총 회원수</StatTitle>
              <StatValue>123명</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>총 주문수</StatTitle>
              <StatValue>456건</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>총 게시글</StatTitle>
              <StatValue>789개</StatValue>
            </StatCard>
            <StatCard>
              <StatTitle>오늘의 방문자</StatTitle>
              <StatValue>234명</StatValue>
            </StatCard>
          </StatsGrid>
        </StatsSection> */}

        {/* 최근 활동 섹션 */}
        {/* <RecentActivitySection>
          <SectionTitle>최근 활동</SectionTitle>
          <ActivityList>
            <ActivityItem>
              <ActivityTime>10분 전</ActivityTime>
              <ActivityText>새로운 회원가입: 홍길동</ActivityText>
            </ActivityItem>
            <ActivityItem>
              <ActivityTime>30분 전</ActivityTime>
              <ActivityText>새로운 주문: #12345</ActivityText>
            </ActivityItem>
            <ActivityItem>
              <ActivityTime>1시간 전</ActivityTime>
              <ActivityText>새로운 블로그 포스트: "Next.js 시작하기"</ActivityText>
            </ActivityItem>
          </ActivityList>
        </RecentActivitySection> */}
      </GridContainer>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;

const GridContainer = styled.div`
  display: grid;
  gap: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const QuickMenuSection = styled.section`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MenuItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
  }
`;

const MenuIcon = styled.span`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const MenuText = styled.span`
  font-weight: 500;
`;

const StatsSection = styled.section`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const RecentActivitySection = styled.section`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ActivityTime = styled.span`
  font-size: 0.875rem;
  color: #666;
  margin-right: 1rem;
  white-space: nowrap;
`;

const ActivityText = styled.span`
  color: #333;
`;

export default AdminDashboard; 