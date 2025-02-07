'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes, faSignOutAlt, faRocket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/contexts/AuthContext';
import { checkMenuAuth } from '@/utils/menuAuth';

interface HeaderProps {
  onSubscribeClick: () => void;
  onInquiryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSubscribeClick, onInquiryClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const currentPath = usePathname();

  const handleMenuClick = (path: string) => {
    if (!checkMenuAuth(path)) {
      return;
    }
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <LogoLink href="/">
            <LogoImage src="/logo_growsome.png" alt="Growsome" />
          </LogoLink>

          <BasicNav>
            <NavButton onClick={() => handleMenuClick('/home')}>그로우썸 소개</NavButton>
            <NavButton onClick={() => handleMenuClick('/toyprojects')}>토이 프로젝트</NavButton>
            <NavButton onClick={() => handleMenuClick('/portfolio')}>포트폴리오</NavButton>
            <NavButton onClick={() => handleMenuClick('/store')}>스토어</NavButton>
            <NavButton onClick={() => handleMenuClick('/blog')}>블로그</NavButton>
          </BasicNav>

          <UserNav>
            {isLoggedIn ? (
              <>
                <NavButton onClick={() => handleMenuClick('/mypage')}>
                  <FontAwesomeIcon icon={faUser} /> 마이페이지
                </NavButton>
                <NavButton onClick={logout}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> 로그아웃
                </NavButton>
                <InquiryButton onClick={() => window.open('https://discord.gg/W8dZjdEa3w', '_blank')}>
                  <FontAwesomeIcon icon={faRocket} /> 비밀연구소 입장
                </InquiryButton>
              </>
            ) : (
              <NavButton onClick={() => router.push('/login')}>로그인</NavButton>
            )}
          </UserNav>

          <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </MenuButton>
        </HeaderContainer>

        <MobileNavMenu $isOpen={isMenuOpen}>
          <NavButton onClick={() => handleMenuClick('/home')}>그로우썸 소개</NavButton>
          <NavButton onClick={() => handleMenuClick('/toyprojects')}>토이 프로젝트</NavButton>
          <NavButton onClick={() => handleMenuClick('/portfolio')}>포트폴리오</NavButton>
          <NavButton onClick={() => handleMenuClick('/store')}>스토어</NavButton>
          <NavButton onClick={() => handleMenuClick('/blog')}>블로그</NavButton>
          {isLoggedIn ? (
            <>
              <NavButton onClick={() => handleMenuClick('/mypage')}>
                <FontAwesomeIcon icon={faUser} /> 마이페이지
              </NavButton>
              <NavButton onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> 로그아웃
              </NavButton>
              <InquiryButton onClick={() => window.open('https://discord.gg/W8dZjdEa3w', '_blank')}>
                <FontAwesomeIcon icon={faRocket} /> 비밀연구소 입장
              </InquiryButton>
            </>
          ) : (
            <NavButton onClick={() => router.push('/login')}>로그인</NavButton>
          )}
        </MobileNavMenu>
      </HeaderWrapper>
    </>
  );
};

interface StyledNavMenuProps {
  $isOpen: boolean;
}

const HeaderWrapper = styled.header`
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const HeaderContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LogoLink = styled(Link)`
  text-decoration: none;
`;

const LogoImage = styled.img`
  width: 100px;
  height: auto;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  margin-right: 20px;
  margin-left: 20px;
  margin-top: 20px;
  cursor: pointer;
  @media (min-width: 1280px) {
    display: none;
  }
`;

const BasicNav = styled.div`
  display: none;

  @media (min-width: 1280px) {
    display: flex;
    gap: 20px;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const UserNav = styled.div`
  display: none;

  @media (min-width: 1280px) {
    display: flex;
    gap: 20px;
    align-items: center;
  }
`;

const MobileNavMenu = styled.div<StyledNavMenuProps>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);

  @media (min-width: 1280px) {
    display: none;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    color: #514FE4;
  }
`;

const InquiryButton = styled.button`
  padding: 10px 20px;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &:hover {
    background: #3D39A1;
  }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoWrapper = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4F46E5;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const MenuItems = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const MenuItem = styled.a`
  font-size: 0.95rem;
  color: #4B5563;
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.2s ease;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #4F46E5;
    transition: width 0.2s ease;
  }

  &:hover {
    color: #4F46E5;
    
    &:after {
      width: 100%;
    }
  }
`;

const ActionButton = styled.button`
  background: #4F46E5;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4338CA;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #E5E7EB;
  }
`;

export default Header;