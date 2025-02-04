'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
              <NavLink onClick={() => handleMenuClick('/portfolio')}>
                포트폴리오
                {!checkMenuAuth('/portfolio') && (
                  <>
                    <ComingSoonChip>OPEN SOON</ComingSoonChip>
                    <ComingSoonTooltip>서비스 준비중</ComingSoonTooltip>
                  </>
                )}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => handleMenuClick('/services')}>
                개발구독
                {!checkMenuAuth('/services') && (
                  <>
                    <ComingSoonChip>OPEN SOON</ComingSoonChip>
                    <ComingSoonTooltip>서비스 준비중</ComingSoonTooltip>
                  </>
                )}
              </NavLink>
            </NavItem>
            <NavItem>
              {/* <NavLink onClick={() => handleMenuClick('/store')}> */}
                스토어
                {!checkMenuAuth('/store') && (
                  <>
                    <ComingSoonChip>OPEN SOON</ComingSoonChip>
                    <ComingSoonTooltip>서비스 준비중</ComingSoonTooltip>
                  </>
                )}
              {/* </NavLink> */}
            </NavItem>
            <NavItem>
              <NavLink onClick={() => handleMenuClick('/toyprojects')}>
                토이 프로젝트
                {!checkMenuAuth('/toyprojects') && (
                  <>
                    <ComingSoonChip>OPEN SOON</ComingSoonChip>
                    <ComingSoonTooltip>서비스 준비중</ComingSoonTooltip>
                  </>
                )}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => handleMenuClick('/blog')}>
                블로그
                {!checkMenuAuth('/blog') && (
                  <>
                    <ComingSoonChip>OPEN SOON</ComingSoonChip>
                    <ComingSoonTooltip>서비스 준비중</ComingSoonTooltip>
                  </>
                )}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={() => handleMenuClick('/class')}>
                강의
                {!checkMenuAuth('/class') && (
                  <>
                    <ComingSoonChip>OPEN SOON</ComingSoonChip>
                    <ComingSoonTooltip>서비스 준비중</ComingSoonTooltip>
                  </>
                )}
              </NavLink>
            </NavItem>

            <ButtonGroup>
              <InquiryButton onClick={onInquiryClick}>
                문의하기
              </InquiryButton>
              <SubscribeButton onClick={onSubscribeClick}>
                <FontAwesomeIcon icon={faRocket} />
                구독하기
              </SubscribeButton>
            </ButtonGroup>

            {isLoading ? (
              <LoadingSpinner>
                <FontAwesomeIcon icon={faSpinner} spin />
              </LoadingSpinner>
            ) : isLoggedIn ? (
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
                <NavButton onClick={() => router.push('/login')}>로그인</NavButton>
                <NavButton 
                  onClick={() => router.push('/signup')}
                  
                >
                  회원가입
                </NavButton>
              </AuthButtons>
            )}
          </NavMenu>
        </HeaderContainer>
      </HeaderWrapper>

      {showPopup && (
        <PopupOverlay onClick={handleClosePopup}>
          <PopupContent onClick={(e) => e.stopPropagation()}>
            <PopupEmoji>🚀</PopupEmoji>
            <PopupTitle>20년차 고인물 디자이너의<br />AI 프로젝트</PopupTitle>
            <PopupText>
              &quot;누구나 쉽게 만들 수 있다고?&quot;<br />
              20년 경력의 디자이너가 만드는<br />
              진짜 프리미엄 AI 서비스를 기대해주세요.<br /><br />
              <PopupHighlight>곧 여러분의 실력을 넘어서는 경험을 선사합니다.</PopupHighlight>
            </PopupText>
            <CloseButton onClick={handleClosePopup}>
              기대되네요!
            </CloseButton>
          </PopupContent>
        </PopupOverlay>
      )}
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
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #514FE4;
  text-decoration: none;
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

const ComingSoonTooltip = styled.span`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #514FE4;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;

  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px 4px 0 4px;
    border-style: solid;
    border-color: #514FE4 transparent transparent transparent;
  }

  @media (max-width: 1280px) {
    display: none;
  }
`;

const ComingSoonChip = styled.span`
  font-size: 0.6rem;
  background: #514FE4;
  color: white;
  padding: 2px 6px;
  border-radius: 20px;
  margin-left: 8px;
  vertical-align: middle;
  
  @media (min-width: 1281px) {
    display: none;
  }
`;

const NavLink = styled.span<StyledNavLinkProps>`
  position: relative;
  color: ${props => props.$active ? '#514FE4' : '#999'};
  font-size: 1rem;
  font-weight: 400;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover ${ComingSoonTooltip} {
    opacity: 1;
    visibility: visible;
    top: -35px;
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

export default Header;