'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faBars, faTimes, faSignOutAlt, faRocket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/contexts/AuthContext';
import dynamic from 'next/dynamic';

interface HeaderProps {
  theme?: 'light' | 'dark';
}

interface NavItem {
  path: string;
  label: string;
}

const FontAwesomeIcon = dynamic(
  () => import('@fortawesome/react-fontawesome').then(mod => mod.FontAwesomeIcon),
  { ssr: false }
);
const Header: React.FC<HeaderProps> = ({ theme = 'light' }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const { user, isLoading, isLoggedIn, logout } = useAuth();
  const currentPath = usePathname();


  // 중앙 집중식 네비게이션 링크 관리
  const navigationLinks: NavItem[] = [
    { path: '/product', label: '실전솔루션' },
    { path: '/portfolio', label: '포트폴리오' },
    { path: '/services', label: '개발 서비스' },
    { path: '/blog', label: '블로그' },
     ];

  const handleMenuClick = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };


  return (
    <HeaderWrapper $theme={theme}>
      <HeaderContainer>
        <NavSection>
          <LogoLink href="/">
            <LogoImage src="/logo_growsome.png" alt="Growsome" />
          </LogoLink>
          
          <MainNav>
            <NavList>
              {
                navigationLinks.map((link) => {
                  const isActive = link.path === '/blog' ? currentPath.startsWith('/blog') : currentPath === link.path;
                  return (
                    <NavItem key={link.path}>
                    <NavLink 
                      onClick={() => handleMenuClick(link.path)}
                      $isActive={isActive}
                    >
                      {link.label}
                      <NavLinkUnderline $isActive={isActive} />
                    </NavLink>
                  </NavItem>
                  ) 
                })
              }
            </NavList>
          </MainNav>
        </NavSection>

        <UserSection>
          {
          <>
          {
          !isLoading && (
            isLoggedIn ? (
            <>
              <UserProfileGroup onClick={() => handleMenuClick('/mypage')}>
                {/* {
                  isMounted && <FontAwesomeIcon icon={faUser} />
                } */}
                <UserName>{user?.username}</UserName>
              </UserProfileGroup>
              <LogoutButton 
                onClick={logout}
                $isMobile={false}
                $theme={theme}
              >
                로그아웃
              </LogoutButton>
            </>
          ) : (
            <LoginButton 
              onClick={() => router.push('/login')}
              $isMobile={false}
              $theme={theme}
            >
              로그인
            </LoginButton>
          )
        )}
          <a href="https://open.kakao.com/o/gqWxH1Zg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            
            <SecretLabButton>
              <span>비밀연구소 참여하기 🚀</span>
            </SecretLabButton>
            </a>
          </>
          }
        </UserSection>

        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {/* {
            isMounted && <FontAwesomeIcon icon={faTimes} />
          } */}
        </MobileMenuButton>
      </HeaderContainer>

      <MobileMenu $isOpen={isMenuOpen}>
        <MobileNavList>
        {
                navigationLinks.map((link) => {
                  const isActive = link.path === '/blog' ? currentPath.startsWith('/blog') : currentPath === link.path;
                  return (
                    <MobileNavItem 
                      key={link.path} 
                      onClick={() => handleMenuClick(link.path)}
                      $isActive={isActive}
                    >
                      {link.label}
                    </MobileNavItem>
                  )
                })
            }
          {
            <>
            {
              !isLoading && (
                isLoggedIn ? (
              <>
                <UserProfileGroup onClick={() => handleMenuClick('/mypage')}>
                  {/* {
                    isMounted && <FontAwesomeIcon icon={faUser} />
                  } */}
                  <UserName>{user?.username}</UserName>
                </UserProfileGroup>
                <LogoutButton 
                  onClick={logout}
                  $isMobile={true}
                  $theme={theme}
                >
                  로그아웃
                </LogoutButton>
              </>
            ) : (
              <LoginButton 
                onClick={() => router.push('/login')}
                $isMobile={true}
                $theme={theme}
              >
                로그인
              </LoginButton>
            )
          )}
            <a href="https://open.kakao.com/o/gqWxH1Zg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <MobileSecretLabButton>
                  비밀연구소 참여하기 🚀
                </MobileSecretLabButton>
              </a>
              
            </>
          }
        </MobileNavList>
      </MobileMenu>
    </HeaderWrapper>
  );
};

interface StyledProps {
  $isMobile?: boolean;
  $theme?: 'light' | 'dark';
}

const HeaderWrapper = styled.header<StyledProps>`
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  background: ${props => props.$theme === 'dark' 
    ? 'rgba(8, 13, 52, 0.98)' 
    : 'rgba(255, 255, 255, 0.98)'
  };
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.$theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'
  };
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const HeaderContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1280px) {
    padding: 0.8rem 1rem;
  }
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  flex-shrink: 0;
`;

const LogoImage = styled.img`
  width: 120px;
  height: auto;
`;

const MainNav = styled.nav`
  @media (max-width: 1280px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  position: relative;

`;

const NavLinkUnderline = styled.span<{ $isActive?: boolean }>`
  position: absolute;
  bottom: -2px;
  left: 0;
  width: ${props => props.$isActive ? '100%' : '0'};
  height: 2px;
  background-color: #514FE4;
  transition: width 0.3s ease;
`;

const NavLink = styled.button<{ $isActive?: boolean } & StyledProps>`
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: ${props => props.$isActive ? '800' : '600'};
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#080d34'};
  padding: 0.5rem 0;
  cursor: pointer;
  position: relative;
  letter-spacing: -0.02em;

  &:hover ${NavLinkUnderline} {
    width: 100%;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 1280px) {
    display: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
`;

const UserName = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: inherit;
`;

const UserProfileGroup = styled.button<StyledProps>`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#666'};
  transition: color 0.2s ease;

  &:hover {
    color: #514FE4;
  }
`;

const SecretLabButton = styled.button`
  background: #514FE4;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 0.6rem 1.2rem;
  font-size: 1.2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3D39A1;
    transform: translateY(-1px);
  }
`;

const LoginButton = styled.button<StyledProps>`
  background: transparent;
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#514FE4'};
  border: 2px solid #514FE4;
  border-radius: 24px;
  padding: 0.6rem 1.5rem;
  font-size: ${props => props.$isMobile ? '1.1rem' : '1.2rem'};
  font-weight: 500;
  cursor: pointer;
  width: ${props => props.$isMobile ? '100%' : 'auto'};
  transition: all 0.2s ease;

  &:hover {
    background: #514FE4;
    color: white;
    transform: translateY(-1px);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;

  @media (max-width: 1280px) {
    display: block;
  }
`;

interface MobileMenuProps {
  $isOpen: boolean;
}

const MobileMenu = styled.div<MobileMenuProps>`
  display: none;
  
  @media (max-width: 1280px) {
    display: block;
    position: fixed;
    top: 64px;
    left: 0;
    width: 100%;
    height: calc(100vh - 64px);
    background: white;
    transform: translateX(${props => props.$isOpen ? '0' : '100%'});
    transition: transform 0.3s ease;
    overflow-y: auto;
  }
`;

const MobileNavList = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MobileNavItem = styled.button<{ $isActive?: boolean }>`
  background: none;
  border: none;
  font-weight: ${props => props.$isActive ? '800' : '600'};
  font-size: 1.3rem;
  color: ${props => props.$isActive ? '#514FE4' : '#333'};
  text-align: left;
  padding: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;
  width: 100%;

  &:hover {
    color: #514FE4;
  }
`;

const MobileSecretLabButton = styled(SecretLabButton)`
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
`;

const LogoutButton = styled.button<StyledProps>`
  background: none;
  border: none;
  font-size: 1rem;
  color: ${props => props.$theme === 'dark' ? '#ffffff80' : '#666'};
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: #514FE4;
  }
`;

export default Header;