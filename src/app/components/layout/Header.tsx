'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRocket, faSignOutAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/contexts/AuthContext';
import { checkMenuAuth } from '@/app/utils/menuAuth';

interface HeaderProps {
  onSubscribeClick: () => void;
  onInquiryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSubscribeClick, onInquiryClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  const handleMenuClick = (path: string) => {
    if (!checkMenuAuth(path)) {
      setShowPopup(true);
      return;
    }
    router.push(path);
    setIsMenuOpen(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const currentPath = usePathname();

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <Logo href="/">
            <LogoImage src="/logo_growsome.png" alt="Growsome" />
          </Logo>

          <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FontAwesomeIcon icon={isMenuOpen ? faSignOutAlt : faUser} />
          </MenuButton>

          <NavMenu $isOpen={isMenuOpen}>
            <NavItem>
              <NavLink
                onClick={() => handleMenuClick('/home')}
                $active={currentPath === '/home'}
              >
                그로우썸 소개
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={() => handleMenuClick('/toyprojects')}
                $active={currentPath === '/toyprojects'}
              >
                토이 프로젝트
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={() => handleMenuClick('/portfolio')}
                $active={currentPath === '/portfolio'}
              >
                포트폴리오
              </NavLink>
            </NavItem>
            {/*<NavItem>
              <NavLink onClick={() => handleMenuClick('/class')}>
                강의
              </NavLink>
            </NavItem>*/}
            <NavItem>
              <NavLink
                onClick={() => handleMenuClick('/store')}
                $active={currentPath === '/store'}
              >
                스토어
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                onClick={() => handleMenuClick('/blog')}
                $active={currentPath === '/blog'}
              >
                블로그
              </NavLink>
            </NavItem>
          </NavMenu>

          <AuthSection>
            {isLoggedIn ? (
              <UserSection>
                <UserInfo>
                  <UserName>{user?.username}</UserName>
                  <CompanyInfo>{user?.company_name} | {user?.position}</CompanyInfo>
                </UserInfo>
                <IconButton 
                  onClick={() => router.push('/mypage')}
                  title="마이페이지"
                >
                  <FontAwesomeIcon icon={faUser} />
                </IconButton>
                <IconButton 
                  onClick={logout}
                  title="로그아웃"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </IconButton>
              </UserSection>
            ) : (
              <AuthButtons>
                <TextLink onClick={() => router.push('/login')}>로그인</TextLink>
                {/* 회원가입 버튼을 숨깁니다 */}
                {/* <NavButton onClick={() => router.push('/signup')}>회원가입</NavButton> */}
              </AuthButtons>
            )}
            <ButtonGroup>
              <InquiryButton onClick={() => window.open('https://discord.gg/W8dZjdEa3w', '_blank')}>
                비밀연구소 입장 🚀
              </InquiryButton>
              {/*<SubscribeButton onClick={onSubscribeClick}>
                <FontAwesomeIcon icon={faRocket} />
                구독하기
              </SubscribeButton>*/}
            </ButtonGroup>
          </AuthSection>
        </HeaderContainer>
      </HeaderWrapper>

    </>
  );
};

interface StyledNavMenuProps {
  $isOpen: boolean;
}

interface StyledNavLinkProps {
  $active?: boolean;
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
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #514FE4;
  text-decoration: none;
  margin-right: 1rem;
`;

const LogoImage = styled.img`
  width: 100px;
  height: auto;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 1280px) {
    display: block;
  }
`;

const NavMenu = styled.ul<StyledNavMenuProps>`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  list-style: none;
  justify-content: flex-start;

  @media (max-width: 1280px) {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    background: white;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    transform: translateX(${props => props.$isOpen ? '0' : '100%'});
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  }
`;

const NavItem = styled.li``;

const NavLink = styled.span<StyledNavLinkProps>`
  position: relative;
  color: ${props => props.$active ? '#514FE4' : '#999'};
  font-size: 1rem;
  font-weight: 400;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #514FE4;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 1280px) {
    flex-direction: column;
    width: 100%;
  }
`;

const InquiryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4340c0;
    transform: translateY(-2px);
  }

  @media (max-width: 1280px) {
    width: 100%;
  }
`;

const SubscribeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #514FE4;
  border: 2px solid #514FE4;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f4ff;
    transform: translateY(-2px);
  }

  @media (max-width: 1280px) {
    width: 100%;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const PopupEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const PopupTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.4;
`;

const PopupText = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const PopupHighlight = styled.span`
  color: #514FE4;
  font-weight: 600;
  display: block;
  margin-top: 0.5rem;
`;

const CloseButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4340c0;
    transform: translateY(-2px);
  }

  @media (max-width: 1280px) {
    width: 100%;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  text-align: right;
`;

const UserName = styled.div`
  font-weight: bold;
`;

const CompanyInfo = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 1280px) {
    flex-direction: column;
    width: 100%;
  }
`;

const NavButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4340c0;
    transform: translateY(-2px);
  }

  @media (max-width: 1280px) {
    width: 100%;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #514FE4;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.1rem;
  transition: color 0.2s;

  &:hover {
    color: #3D39A1;
  }
`;

const LoadingSpinner = styled.div`
  color: #514FE4;
  font-size: 1.2rem;
`;

const TextLink = styled.span`
  color: #514FE4;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #4340c0;
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export default Header;