import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #514FE4;
  color: white;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
`;

const Nav = styled.nav`
  a {
    color: white;
    margin: 0 1rem;
    text-decoration: none;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>AffiliSmart</Logo>
      <Nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;