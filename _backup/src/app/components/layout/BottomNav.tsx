import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faGraduationCap, 
  faShoppingBag,
  faComments
} from '@fortawesome/free-solid-svg-icons';

interface NavItemProps {
  $active: boolean;
}

const BottomNav = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <NavWrapper>
      <NavItem href="/" $active={isActive('/')}>
        <FontAwesomeIcon icon={faHome} />
        <span>홈</span>
      </NavItem>
      <NavItem href="/class" $active={isActive('/class')}>
        <FontAwesomeIcon icon={faGraduationCap} />
        <span>강의</span>
      </NavItem>
      <NavItem href="/store" $active={isActive('/store')}>
        <FontAwesomeIcon icon={faShoppingBag} />
        <span>스토어</span>
      </NavItem>
      <NavItem href="/inquiry" $active={isActive('/inquiry')}>
        <FontAwesomeIcon icon={faComments} />
        <span>문의</span>
      </NavItem>
      <NavItem href="/mypage" $active={isActive('/mypage')}>
        <FontAwesomeIcon icon={faUser} />
        <span>MY</span>
      </NavItem>
    </NavWrapper>
  );
};

const NavWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 0.8rem 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const NavItem = styled(Link)<NavItemProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${props => props.$active ? '#514FE4' : '#666'};
  font-size: 0.8rem;
  gap: 0.3rem;

  svg {
    font-size: 1.3rem;
  }

  span {
    font-size: 0.7rem;
    font-weight: ${props => props.$active ? '600' : '400'};
  }
`;

export default BottomNav; 