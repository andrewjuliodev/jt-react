import React, { useEffect, useState } from 'react';
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

// Glassmorphic Header
const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 1s ease forwards;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Logo styling
const Logo = styled.div`
  font-family: "Cal Sans", sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #000; /* Changed to black as requested */
  display: flex;
  align-items: center;
  font-style: normal;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

// Navigation menu
const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Mobile menu button
const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #000;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// Mobile menu
const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  z-index: 999;
`;

// Navigation list
const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    gap: 1.5rem;
  }
`;

// Mobile navigation list
const MobileNavList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 1.5rem;
`;

// Navigation item
const NavItem = styled.li`
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
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

// Mobile navigation item
const MobileNavItem = styled.li`
  position: relative;
  padding: 0.5rem 0;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
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

// Navigation link
const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #39e6d0;
  }
`;

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Header>
        <Logo>JT Studio</Logo>
        <Nav>
          <NavList>
            <NavItem>
              <NavLink href="#services">Services</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#pricing">Pricing</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#portfolio">Concept Portfolio</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#about">About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#contact">Contact</NavLink>
            </NavItem>
          </NavList>
        </Nav>
        <MenuButton onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </MenuButton>
      </Header>
      
      <MobileMenu isOpen={mobileMenuOpen}>
        <MobileNavList>
          <MobileNavItem>
            <NavLink href="#services">Services</NavLink>
          </MobileNavItem>
          <MobileNavItem>
            <NavLink href="#pricing">Pricing</NavLink>
          </MobileNavItem>
          <MobileNavItem>
            <NavLink href="#portfolio">Concept Portfolio</NavLink>
          </MobileNavItem>
          <MobileNavItem>
            <NavLink href="#about">About</NavLink>
          </MobileNavItem>
          <MobileNavItem>
            <NavLink href="#contact">Contact</NavLink>
          </MobileNavItem>
        </MobileNavList>
      </MobileMenu>
    </>
  );
};

export default Navbar;
