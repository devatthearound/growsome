import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Header = ({ onSubscribeClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  const handleInquiryClick = () => {
    navigate('/inquiry');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Logo to="/">
          <LogoImage src="/logo_growsome.png" alt="Growsome Logo" />
        </Logo>
        <MenuButton onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </MenuButton>
        <NavMenu isOpen={isMenuOpen}>
          <NavItem>
            <NavLink 
              to="/services" 
              onClick={() => setIsMenuOpen(false)}
              active={isActive('/services')}
            >
              개발구독
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              to="/portfolio" 
              onClick={() => setIsMenuOpen(false)}
              active={isActive('/portfolio')}
            >
              포트폴리오
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              to="/store" 
              onClick={() => setIsMenuOpen(false)}
              active={isActive('/store')}
            >
              스토어
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              to="/toy-projects" 
              onClick={() => setIsMenuOpen(false)}
              active={isActive('/toy-projects')}
            >
              토이 프로젝트
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              to="/blog" 
              onClick={() => setIsMenuOpen(false)}
              active={isActive('/blog')}
            >
              블로그
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              to="/class" 
              onClick={() => setIsMenuOpen(false)}
              active={isActive('/class')}
            >
              강의
            </NavLink>
          </NavItem>
          <ButtonGroup>
            <InquiryButton onClick={handleInquiryClick}>
              개발문의하기
            </InquiryButton>
            <SubscribeButton onClick={onSubscribeClick}>
              <FontAwesomeIcon icon={faEnvelope} />
              구독하기
            </SubscribeButton>
          </ButtonGroup>
        </NavMenu>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

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

const NavMenu = styled.ul`
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
    transform: translateX(${props => props.isOpen ? '0' : '100%'});
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  }
`;

const NavItem = styled.li``;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#222' : '#999'};
  text-decoration: none;
  font-size: 1rem;
  font-weight: ${props => props.active ? '700' : '400'};
  transition: all 0.3s ease;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 2px;
    background-color: ${props => props.active ? '#222' : '#514FE4'};
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #222;
    
    &:after {
      transform: scaleX(1);
    }
  }

  @media (max-width: 1280px) {
    font-size: 1.2rem;
    padding: 1rem 0;
    display: block;
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

export default Header;