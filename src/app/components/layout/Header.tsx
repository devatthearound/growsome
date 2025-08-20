'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { Menu, X, User, LogOut, Pencil } from 'lucide-react';
import { GreenButton } from '@/components/design-system/Button';

interface HeaderProps {
  theme?: 'light' | 'dark';
}

interface NavItem {
  path: string;
  label: string;
}

// 스타일 컴포넌트들
interface StyledProps {
  $isMobile?: boolean;
  $theme?: 'light' | 'dark';
}

interface HeaderWrapperProps {
  $theme?: 'light' | 'dark';
}

interface NavLinkProps {
  $isActive?: boolean;
  $theme?: 'light' | 'dark';
}

interface NavLinkUnderlineProps {
  $isActive?: boolean;
}

interface MobileMenuProps {
  $isOpen: boolean;
}

interface MobileNavItemProps {
  $isActive?: boolean;
}

const Header: React.FC<HeaderProps> = ({ theme = 'light' }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const { user, isLoading, isLoggedIn, logout } = useAuth();
  const currentPath = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // courses 페이지에서는 헤더를 숨김
  if (currentPath === '/courses') {
    return null;
  }

  // 중앙 집중식 네비게이션 링크 관리
  const navigationLinks: NavItem[] = [
    { path: '/product', label: 'AI 커리큘럼' },
    { path: '/store', label: 'AI 도구' },
    { path: '/portfolio', label: '포트폴리오' },
    { path: '/diagnosis', label: '프로젝트 의뢰하기' }
  ];

  const isDev = process.env.NODE_ENV === 'development';
  const filteredLinks = navigationLinks.filter(link => link.path !== '/blog');
  const devLinks = isDev ? navigationLinks : filteredLinks;

  const handleMenuClick = (path: string) => {
    if (isMounted && router) {
      try {
        router.push(path);
        setIsMenuOpen(false);
      } catch (error) {
        console.error('Navigation error:', error);
        // 폴백: window.location 사용
        if (typeof window !== 'undefined') {
          window.location.href = path;
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
              {devLinks.map((link) => {
                const isActive = link.path === '/blog' ? currentPath.startsWith('/blog') : currentPath === link.path;
                return (
                  <NavItem key={link.path}>
                    <NavLink 
                      onClick={() => handleMenuClick(link.path)}
                      $isActive={isActive}
                      $theme={theme}
                    >
                      {link.label}
                      <NavLinkUnderline $isActive={isActive} />
                    </NavLink>
                  </NavItem>
                ) 
              })}
            </NavList>
          </MainNav>
        </NavSection>

        <UserSection>
          {!isLoading && (
            isLoggedIn ? (
              <>
                <UserProfileGroup onClick={() => handleMenuClick('/mypage')}>
                  <User size={16} />
                  <UserName>{user?.username}</UserName>
                </UserProfileGroup>
                <LogoutButton 
                  onClick={handleLogout}
                  $isMobile={false}
                  $theme={theme}
                >
                  <LogOut size={16} />
                  로그아웃
                </LogoutButton>
                {user?.email === 'master@growsome.kr' && (
                  <Link href="/blog/write" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }} title="새 글 작성">
                    <GreenButton $size="medium" style={{ borderRadius: '50%', padding: '0.5rem', minWidth: 0, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pencil size={22} />
                    </GreenButton>
                  </Link>
                )}
              </>
            ) : (
              <LoginButton 
                onClick={() => handleMenuClick('/login')}
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
        </UserSection>

        <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </HeaderContainer>

      {/* 모바일 메뉴 오버레이 */}
      {isMenuOpen && <MobileOverlay onClick={() => setIsMenuOpen(false)} />}

      <MobileMenu $isOpen={isMenuOpen}>
        <MobileNavList>
          {devLinks.map((link) => {
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
          })}
          
          <MobileDivider />
          
          {!isLoading && (
            isLoggedIn ? (
              <>
                <MobileUserSection>
                  <UserProfileGroup onClick={() => handleMenuClick('/mypage')}>
                    <User size={20} />
                    <UserName>{user?.username}</UserName>
                  </UserProfileGroup>
                </MobileUserSection>
                <LogoutButton 
                  onClick={handleLogout}
                  $isMobile={true}
                  $theme={theme}
                >
                  <LogOut size={16} />
                  로그아웃
                </LogoutButton>
                {isLoggedIn && user?.email === 'master@growsome.kr' && (
                  <Link href="/blog/write" style={{ margin: '1.2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="새 글 작성">
                    <GreenButton $size="medium" style={{ borderRadius: '50%', padding: '0.5rem', minWidth: 0, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pencil size={22} />
                    </GreenButton>
                  </Link>
                )}
              </>
            ) : (
              <LoginButton 
                onClick={() => handleMenuClick('/login')}
                $isMobile={true}
                $theme={theme}
              >
                로그인
              </LoginButton>
            )
          )}
          
          <a href="https://open.kakao.com/o/gqWxH1Zg" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <MobileSecretLabButton onClick={() => setIsMenuOpen(false)}>
              비밀연구소 참여하기 🚀
            </MobileSecretLabButton>
          </a>
        </MobileNavList>
      </MobileMenu>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header<HeaderWrapperProps>`
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  background: ${(props: HeaderWrapperProps) => props.$theme === 'dark' 
    ? 'rgba(8, 13, 52, 0.98)' 
    : 'rgba(255, 255, 255, 0.98)'
  };
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${(props: HeaderWrapperProps) => props.$theme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'
  };
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  height: 70px;
`;

const HeaderContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;

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
  display: none;
  @media (min-width: 1281px) {
    display: flex;
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

const NavLinkUnderline = styled.span<NavLinkUnderlineProps>`
  position: absolute;
  bottom: -2px;
  left: 0;
  width: ${(props: NavLinkUnderlineProps) => props.$isActive ? '100%' : '0'};
  height: 2px;
  background-color: #514FE4;
  transition: width 0.3s ease;
`;

const NavLink = styled.button<NavLinkProps>`
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: ${(props: NavLinkProps) => props.$isActive ? '800' : '600'};
  color: ${(props: NavLinkProps) => props.$theme === 'dark' ? '#ffffff' : '#080d34'};
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

const UserName = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: inherit;
`;

const UserProfileGroup = styled.button<StyledProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${(props: StyledProps) => props.$theme === 'dark' ? '#ffffff' : '#666'};
  transition: color 0.2s ease;
  border-radius: 8px;

  &:hover {
    color: #514FE4;
    background: ${(props: StyledProps) => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(81, 79, 228, 0.1)'};
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
  color: ${(props: StyledProps) => props.$theme === 'dark' ? '#ffffff' : '#514FE4'};
  border: 2px solid #514FE4;
  border-radius: 24px;
  padding: 0.6rem 1.5rem;
  font-size: ${(props: StyledProps) => props.$isMobile ? '1.1rem' : '1.2rem'};
  font-weight: 500;
  cursor: pointer;
  width: ${(props: StyledProps) => props.$isMobile ? '100%' : 'auto'};
  transition: all 0.2s ease;

  &:hover {
    background: #514FE4;
    color: white;
    transform: translateY(-1px);
  }
`;

const LogoutButton = styled.button<StyledProps>`
  background: none;
  border: none;
  font-size: 1rem;
  color: ${(props: StyledProps) => props.$theme === 'dark' ? '#ffffff80' : '#666'};
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  width: ${(props: StyledProps) => props.$isMobile ? '100%' : 'auto'};
  justify-content: ${(props: StyledProps) => props.$isMobile ? 'center' : 'flex-start'};

  &:hover {
    color: #514FE4;
    background: ${(props: StyledProps) => props.$theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(81, 79, 228, 0.1)'};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 1280px) {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 1rem;
    padding: 0.5rem;
  }
`;

const MobileOverlay = styled.div`
  display: none;
  
  @media (max-width: 1280px) {
    display: block;
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    height: calc(100vh - 70px);
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const MobileMenu = styled.div<MobileMenuProps>`
  display: none;
  @media (max-width: 1280px) {
    display: ${({ $isOpen }: MobileMenuProps) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    right: 0;
    width: 80vw;
    max-width: 340px;
    height: 100vh;
    background: #fff;
    box-shadow: -2px 0 24px rgba(81,79,228,0.08);
    z-index: 2001;
    padding: 2.5rem 1.5rem 1.5rem 1.5rem;
    overflow-y: auto;
    transition: transform 0.2s;
  }
`;

const MobileNavList = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileNavItem = styled.button<MobileNavItemProps>`
  background: none;
  border: none;
  font-weight: ${(props: MobileNavItemProps) => props.$isActive ? '800' : '600'};
  font-size: 1.3rem;
  color: ${(props: MobileNavItemProps) => props.$isActive ? '#514FE4' : '#333'};
  text-align: left;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  border-radius: 12px;

  &:hover {
    color: #514FE4;
    background: rgba(81, 79, 228, 0.1);
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: #e5e5e5;
  margin: 1rem 0;
`;

const MobileUserSection = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const MobileSecretLabButton = styled(SecretLabButton)`
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
`;

export default Header;