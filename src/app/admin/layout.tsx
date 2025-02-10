'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  $active?: boolean;  // $ prefix를 추가하여 DOM에 전달되지 않도록 함
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

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
            <NavLink href="/admin/blog" $active={isActive('/admin/blog')}>
              <NavIcon>📝</NavIcon>
              블로그 관리
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

export default AdminLayout; 