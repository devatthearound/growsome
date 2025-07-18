import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Navigation = ({ onSubscribeClick }: { onSubscribeClick: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  const menuItems = [
    { path: '/about', name: 'About' },
    { path: '/services', name: 'AI비즈니스솔루션' },
    { path: '/subscription', name: '가격' },
    { path: '/works', name: 'Works' },
    { path: '/youtube', name: 'YouTube' },
    { path: '/store', name: 'Store' },
    { path: '/blog', name: 'Blog' },
    { path: '/contact', name: 'Contact' }
  ];

  return (
    <Nav scrolled={scrolled}>
      <NavContainer className={isMenuOpen ? 'active' : ''}>
        <Logo href="/">
          <span className="accent">AI</span> Growsome
        </Logo>
        <MenuButton onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>
        <NavMenu isOpen={isMenuOpen}>
          {menuItems.map(item => (
            <NavItem key={item.path}>
              <Link href={item.path} onClick={toggleMenu}>
                {item.name}
              </Link>
            </NavItem>
          ))}
        </NavMenu>
        <SubscribeButton onClick={onSubscribeClick}>
          <FontAwesomeIcon icon={faEnvelope} />
          구독하기
        </SubscribeButton>
      </NavContainer>
    </Nav>
  );
};

const Nav = styled.nav<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
  padding: ${props => props.scrolled ? '1rem 0' : '1.5rem 0'};
  box-shadow: ${props => props.scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'};
`;

const NavContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.active {
    padding: 0 2rem;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavMenu = styled.ul<{ isOpen: boolean }>`
  display: flex;
  gap: 2rem;
  list-style: none;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-100%'};
    width: 70%;
    height: 100vh;
    background: white;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: right 0.3s ease;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  }
`;

const NavItem = styled.li`
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  text-decoration: none;

  .accent {
    color: ${props => props.theme.colors.primary};
  }
`;

// const StyledLink = styled(Link)`
//   text-decoration: none;
//   color: inherit;
//   &:hover {
//     color: #514FE4;
//   }
// `;

const SubscribeButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

export default Navigation;