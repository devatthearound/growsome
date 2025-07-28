'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavLinkProps {
  $active?: boolean;  // $ prefix를 추가하여 DOM에 전달되지 않도록 함
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const isActive = (path: string) => pathname === path;

  // 인증 체크
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Admin 인증 체크 시작...', pathname);
      
      // 1. 기본 인증 체크
      console.log('📡 기본 인증 API 호출...');
      const authResponse = await fetch('/api/auth/check');
      console.log('📡 Auth response status:', authResponse.status);
      
      if (!authResponse.ok) {
        console.log('❌ 기본 인증 실패, 로그인 페이지로 이동');
        router.push('/login?redirect_to=' + encodeURIComponent(pathname));
        return;
      }

      const authData = await authResponse.json();
      console.log('📊 Auth 데이터:', authData);
      
      if (!authData.isLoggedIn) {
        console.log('❌ 로그인되지 않음, 로그인 페이지로 이동');
        router.push('/login?redirect_to=' + encodeURIComponent(pathname));
        return;
      }

      // 2. Admin 권한 체크
      console.log('🛡️ Admin 권한 체크 시작...');
      const adminResponse = await fetch('/api/auth/admin-check');
      console.log('🛡️ Admin response status:', adminResponse.status);
      
      if (!adminResponse.ok) {
        const adminData = await adminResponse.json();
        console.log('❌ Admin 권한 체크 실패:', adminData.message);
        alert('관리자만 접근 가능합니다.');
        router.push('/');
        return;
      }

      const adminData = await adminResponse.json();
      console.log('📊 Admin 데이터:', adminData);
      
      if (!adminData.isAdmin) {
        console.log('❌ Admin 권한 없음:', adminData.user);
        alert('관리자만 접근 가능합니다.');
        router.push('/');
        return;
      }

      // 3. 모든 검증 통과
      setUser(adminData.user);
      console.log('✅ Admin 접근 승인:', adminData.user.email);

    } catch (error) {
      console.error('❌ 인증 체크 오류:', error);
      router.push('/login?redirect_to=' + encodeURIComponent(pathname));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner>
          <div>🚀</div>
          <p>로딩 중...</p>
        </LoadingSpinner>
      </LoadingContainer>
    );
  }

  if (!user) {
    return null; // 리다이렉트 중
  }

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <Link href="/admin">
            <Logo>🚀 Admin</Logo>
          </Link>
        </SidebarHeader>
        <NavMenu>
          <NavItem>
            <NavLink href="/admin" $active={isActive('/admin')}>
              <NavIcon>📊</NavIcon>
              대시보드
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/admin/analytics" $active={isActive('/admin/analytics')}>
              <NavIcon>📊</NavIcon>
              자동화 분석
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/admin/blog" $active={isActive('/admin/blog')}>
              <NavIcon>📝</NavIcon>
              블로그 관리
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/admin/qa" $active={isActive('/admin/qa')}>
              <NavIcon>📋</NavIcon>
              QA 관리
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/admin/products" $active={isActive('/admin/#')}>
              <NavIcon>🛍️</NavIcon>
              상품 관리
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/admin/users" $active={isActive('/admin/#')}>
              <NavIcon>👥</NavIcon>
              사용자 관리
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/admin/orders" $active={isActive('/admin/#')}>
              <NavIcon>📦</NavIcon>
              주문 관리
            </NavLink>
          </NavItem>
        </NavMenu>
        <SidebarFooter>
          <NavItem>
            <NavLink href="/" target="_blank">
              <NavIcon>🏠</NavIcon>
              메인 사이트
            </NavLink>
          </NavItem>
        </SidebarFooter>
      </Sidebar>
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  padding-top: 80px;
`;

const Sidebar = styled.aside`
  position: fixed;
  top: 80px;
  left: 0;
  width: 250px;
  height: calc(100vh - 80px);
  background: #1a1a1a;
  color: white;
  padding: 1rem;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  cursor: pointer;
`;

const NavMenu = styled.nav`
  flex: 1;
`;

const NavItem = styled.div`
  margin-bottom: 0.5rem;
`;

const NavLink = styled(Link)<NavLinkProps>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${props => props.$active ? 'white' : '#a0a0a0'};
  text-decoration: none;
  border-radius: 8px;
  background: ${props => props.$active ? '#333' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background: #333;
    color: white;
  }
`;

const NavIcon = styled.span`
  margin-right: 0.75rem;
  font-size: 1.2rem;
`;

const SidebarFooter = styled.div`
  border-top: 1px solid #333;
  padding-top: 1rem;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  background: #f5f5f5;
  min-height: calc(100vh - 80px);
  padding: 2rem;
`;

// Loading Components
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  div {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: spin 2s linear infinite;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default AdminLayout; 