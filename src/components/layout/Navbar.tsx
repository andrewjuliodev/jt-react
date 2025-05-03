import React from 'react';
import styled, { keyframes } from 'styled-components';

// Fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Main full screen container
const Header = styled.header`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 1s ease forwards;
  z-index: 1000;
`;

// Nav list in a row
const NavList = styled.ul`
  display: flex;
  gap: 3rem;
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: 200;
  font-style: normal;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
`;

// Nav item with hover effect
const NavItem = styled.li`
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #39e6d0;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

// Nav link styling
const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  font-weight: 400;
  font-size: 1.25rem;
  transition: color 0.3s ease;

  &:hover {
    color: #39e6d0;
  }
`;

const Navbar: React.FC = () => {
  return (
    <Header>
      <NavList>
        <NavItem><NavLink href="#services">Services</NavLink></NavItem>
        <NavItem><NavLink href="#portfolio">Pricing</NavLink></NavItem>
        <NavItem><NavLink href="#contact">Contact</NavLink></NavItem>
        <NavItem><NavLink href="#about">About</NavLink></NavItem>
      </NavList>
    </Header>
  );
};

export default Navbar;
