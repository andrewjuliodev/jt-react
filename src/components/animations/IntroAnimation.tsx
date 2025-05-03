// src/components/animations/IntroAnimation.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';

interface IntroAnimationProps {
  onComplete: () => void;
}

const Container = styled.div<{ darkMode?: boolean; lightTheme?: boolean }>`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: ${props => {
    if (props.darkMode) return 'rgb(30, 31, 31)';
    if (props.lightTheme) return '#fff'; // Changed to white
    return '#fff';
  }};
  overflow: hidden;
  transition: background 1.2s ease-in-out;
`;

const ProfileImage = styled(motion.img)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: auto;
  height: 90vh;
  z-index: 1;
  
  @media (max-width: 768px) {
    height: 70vh;
  }
  
  @media (max-width: 480px) {
    height: 50vh;
  }
`;

const glowBurst = keyframes`
  0% {
    text-shadow:
      0 0 5px rgb(132,227,215),
      0 0 10px rgb(132,227,215),
      0 0 15px rgb(132,227,215);
  }
  50% {
    text-shadow:
      0 0 20px rgb(132,227,215),
      0 0 40px rgb(132,227,215),
      0 0 60px rgb(132,227,215);
  }
  100% {
    text-shadow:
      0 0 5px rgb(132,227,215),
      0 0 10px rgb(132,227,215),
      0 0 15px rgb(132,227,215);
  }
`;

const moveBullet = keyframes`
  from {
    left: -20px;
    width: 20px;
  }
  to {
    left: 100%;
    width: 20px;
  }
`;

const drawBorder = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const HeaderContainer = styled.div<{ glassmorphism?: boolean; darkMode?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 998;
  background: ${props => {
    if (props.glassmorphism && props.darkMode) return 'rgba(0, 0, 0, 0.5)'; // Changed for dark mode
    if (props.glassmorphism) return 'rgba(0, 0, 0, 0.5)'; // Changed to requested value
    return 'transparent';
  }};
  backdrop-filter: ${props => props.glassmorphism ? 'blur(10px)' : 'none'};
  -webkit-backdrop-filter: ${props => props.glassmorphism ? 'blur(10px)' : 'none'};
  transition: all 1.2s ease-in-out;
  box-shadow: ${props => props.glassmorphism ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const HeaderBorder = styled.div<{ show: boolean; darkMode?: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: rgb(132,227,200);
  width: ${props => props.show ? '100%' : '0'};
  animation: ${props => props.show ? css`${drawBorder} 1.2s ease-out forwards` : 'none'};
  z-index: 2;
  backdrop-filter: blur(10px); /* Added glassmorphism to the border */
  -webkit-backdrop-filter: blur(10px);
`;

const HeaderBullet = styled.div<{ show: boolean }>`
  position: absolute;
  bottom: -4px;
  width: 20px;
  height: 10px;
  background-color: rgb(132,227,215);
  border-radius: 5px;
  opacity: ${props => props.show ? 1 : 0};
  animation: ${props => props.show ? css`${moveBullet} 1.2s ease-out forwards` : 'none'};
  box-shadow: 0 0 10px rgb(132,227,215);
  z-index: 2;
`;

const DarkModeBullet = styled.div<{ show: boolean }>`
  position: absolute;
  bottom: -4px;
  width: 20px;
  height: 10px;
  background-color: rgb(132,227,215);
  border-radius: 5px;
  opacity: ${props => props.show ? 1 : 0};
  animation: ${props => props.show ? css`${moveBullet} 1.2s ease-out forwards` : 'none'};
  box-shadow: 0 0 15px rgb(132,227,215), 0 0 30px rgb(132,227,215);
  z-index: 2;
`;

const TextWrapper = styled(motion.div)<{ blur?: string; fontSize?: string }>`
  position: absolute;
  display: inline-flex;
  font-family: "Cal Sans", sans-serif;
  font-size: ${props => props.fontSize || "4.5rem"};
  font-weight: bold;
  color: #000;
  filter: ${({ blur }) => blur || "none"};
  z-index: 3; /* Increased z-index to bring logo to front */
  white-space: nowrap;
  transition: font-size 0.8s ease-in-out;
  
  @media (max-width: 768px) {
    font-size: ${props => props.fontSize === "2.2rem" ? "1.8rem" : "3.5rem"};
  }
  
  @media (max-width: 480px) {
    font-size: ${props => props.fontSize === "2.2rem" ? "1.5rem" : "2.5rem"};
  }
`;

const SubtitleText = styled(motion.div)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Cal Sans", sans-serif;
  font-size: 12rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 5rem;
  }
`;

const Letter = styled(motion.span)`
  display: inline-block;
`;

const Space = styled.span`
  display: inline-block;
  width: 0.3em;
`;

const GlowingStudioText = styled(motion.span)`
  letter-spacing: 0.03em;
  animation: ${css`${glowBurst} 1s ease-out infinite`};
`;

const GlowingLetter = styled(motion.span)`
  animation: ${css`${glowBurst} 1s ease-out infinite`};
`;

// Theme toggle button
const ThemeToggle = styled.button<{ darkMode?: boolean; show?: boolean }>`
  position: absolute;
  top: 30px;
  right: 10%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  border: 2px solid ${props => props.darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  outline: none;
  opacity: ${props => props.show ? 1 : 0};
  z-index: 1005; /* Increased z-index to bring it to the foreground */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.15)'};
    box-shadow: ${props => props.darkMode 
      ? '0 0 10px rgba(132, 227, 215, 0.5), 0 0 20px rgba(132, 227, 215, 0.3)' 
      : '0 4px 15px rgba(0, 0, 0, 0.15)'};
  }
  
  @media (max-width: 768px) {
    right: 25%; /* Adjust for mobile to avoid overlap with burger menu */
  }
`;

// SVG icons for theme toggle
const SunIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2"/>
    <path d="M12 4V2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 22V20" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 12H22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 12H4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19.1421 5.44446L20.5563 4.03024" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3.94366 20.5563L5.35788 19.1421" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19.1421 19.1421L20.5563 20.5563" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3.94366 4.03024L5.35788 5.44446" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0, 0, 0, 0.3)" />
  </svg>
);

// Navbar styles
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Header = styled.header`
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 1s ease forwards;
  z-index: 1000;
  transition: top 0.8s ease-in-out, color 0.8s ease-in-out;
`;

const NavList = styled.ul<{ mobileMenuOpen?: boolean }>`
  display: flex;
  gap: 3rem;
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: "Montserrat", sans-serif;
  font-weight: 200;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    right: ${props => props.mobileMenuOpen ? '0' : '-100%'};
    flex-direction: column;
    gap: 1.5rem;
    background: rgba(0, 0, 0, 0.9);
    width: 70%;
    max-width: 300px;
    height: calc(100vh - 60px);
    padding: 2rem;
    transition: right 0.3s ease-in-out;
    align-items: center;
    justify-content: flex-start;
  }
`;

const NavItem = styled.li`
  position: relative;
  margin: 0 5px;
  
  @media (max-width: 768px) {
    margin: 10px 0;
  }
`;

const NavLink = styled.a<{ darkMode?: boolean }>`
  color: ${props => props.darkMode ? '#fff' : '#fff'}; /* Always white to match header */
  text-decoration: none;
  font-weight: 500;
  font-size: 1.25rem;
  transition: text-shadow 0.3s ease, color 0.8s ease-in-out;
  padding: 8px 16px;
  
  &:hover {
    animation: ${css`${glowBurst} 1s ease-out infinite`};
  }
  
  @media (max-width: 768px) {
    color: #fff;
    font-size: 1.5rem;
    padding: 12px 20px;
  }
`;

// Burger Menu
const BurgerMenu = styled.button<{ darkMode?: boolean; open?: boolean }>`
  display: none;
  position: fixed;
  top: 30px;
  right: 10%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1002;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
`;

const BurgerLine = styled.span<{ darkMode?: boolean; open?: boolean; lineIndex?: number }>`
  width: 30px;
  height: 3px;
  background-color: ${props => props.darkMode ? '#fff' : '#333'};
  transition: all 0.3s ease-in-out;
  position: relative;
  
  transform: ${props => {
    if (props.open && props.lineIndex === 1) return 'rotate(45deg) translate(5px, 5px)';
    if (props.open && props.lineIndex === 3) return 'rotate(-45deg) translate(5px, -5px)';
    if (props.open && props.lineIndex === 2) return 'opacity: 0';
    return 'none';
  }};
  
  opacity: ${props => props.open && props.lineIndex === 2 ? 0 : 1};
`;

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const name = "JulioTompsett's";
  const [retract, setRetract] = useState(false);
  const [showJT, setShowJT] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [fadeOutSubtitle, setFadeOutSubtitle] = useState(false);
  const [retreatImage, setRetreatImage] = useState(false);
  const [slideToHeader, setSlideToHeader] = useState(false);
  const [showBullet, setShowBullet] = useState(false);
  const [showDarkModeBullet, setShowDarkModeBullet] = useState(false);
  const [glassmorphism, setGlassmorphism] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [hideRetractedJT, setHideRetractedJT] = useState(false);
  const [tOffset, setTOffset] = useState(0);
  const [blur, setBlur] = useState<"none"|"blur(5px)">("none");
  const [textPos, setTextPos] = useState<{ top: string; left: string }>({
    top: "50%",
    left: "10%",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const jRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  // 1) Compute left offset once
  const leftOffset = window.innerWidth * 0.1 + "px";

  // Handle theme toggle
  const toggleTheme = () => {
    if (!darkMode) {
      // First trigger the dark mode bullet animation
      setShowDarkModeBullet(true);
      
      // Set dark mode after a short delay to allow the bullet to start moving
      setTimeout(() => setDarkMode(true), 100);
      
      // Turn off light theme
      setLightTheme(false);
      
      // Reset bullet after animation completes
      setTimeout(() => setShowDarkModeBullet(false), 1200);
    } else {
      // Switch back to light theme
      setDarkMode(false);
      setLightTheme(true);
      
      // Animate the bullet for transition back to light mode
      setShowBullet(true);
      setTimeout(() => setShowBullet(false), 1200);
    }
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Add event listeners for screen resize
  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu on large screens
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      
      // Adjust positions for mobile
      if (window.innerWidth <= 768) {
        // Mobile adjustments - higher up the y axis
        setTextPos({
          top: "35%", // Move higher on mobile
          left: "10%"
        });
      } else {
        // Default positioning for larger screens
        setTextPos({
          top: "50%",
          left: "10%"
        });
      }
      
      // Update window width state
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial positions
    handleResize();
    
    // Update on resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // 2) Run the timing
  useEffect(() => {
    const timers = [
      // Show subtitle after name appears
      setTimeout(() => setShowSubtitle(true), 1000),
      // Start fading out subtitle
      setTimeout(() => setFadeOutSubtitle(true), 3500),
      // Retract after 4.5s (2s longer than before)
      setTimeout(() => setRetract(true), 4500),
      setTimeout(() => {
        setShowJT(true);
        setBlur("none");
      }, 5000),
      setTimeout(() => setHideRetractedJT(true), 5500), // Hide the retracted JT
      // Start retreat of image when moving to header
      setTimeout(() => {
        setRetreatImage(true);
      }, 6000),
      setTimeout(() => setSlideToHeader(true), 6000),   // Moving to header at the same time
      // Animate the bullet - this will reveal the glassmorphic header
      setTimeout(() => setShowBullet(true), 6800),
      // Apply glassmorphism as the bullet starts moving - the bullet reveals it
      setTimeout(() => setGlassmorphism(true), 6800),
      // Set light theme background as the bullet passes
      setTimeout(() => setLightTheme(true), 6800),
      // Show theme toggle after bullet animation completes
      setTimeout(() => setShowToggle(true), 8000),
      setTimeout(onComplete, 8500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // 3) On retract, blur & calc T offset
  useEffect(() => {
    if (retract) {
      setBlur("blur(5px)");
      const tIdx = name.indexOf("T");
      const jEl = jRef.current, tEl = lettersRef.current[tIdx];
      if (jEl && tEl) {
        const jr = jEl.getBoundingClientRect(),
          tr = tEl.getBoundingClientRect();
        setTOffset(jr.right - tr.left);
      }
    }
  }, [retract, name]);

  // render initial letters
  const renderInitial = () =>
    name.split("").map((c,i) => (
      <Letter key={i}
        ref={el => {
          if (el) {
            if (i===0) jRef.current = el;
            lettersRef.current[i] = el;
          }
        }}
        initial={{ opacity:0, y:10 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.8, delay:i*0.1 }}
      >{c}</Letter>
    ));

  const renderRetract = () =>
    name.split("").map((c,i) => {
      if (i===0) return <Letter key={i}>J</Letter>;
      if (c==="T") {
        return <Letter key={i}
          initial={{ x:0 }}
          animate={{ x:tOffset }}
          transition={{ type:'tween', ease:'linear', duration:0.5 }}
        >T</Letter>;
      }
      return <Letter key={i}
        initial={{ x:0, opacity:1 }}
        animate={{ x:`-${i}em`, opacity:0 }}
        transition={{
          x:{ duration:0.6, delay:i*0.04 },
          opacity:{ duration:0.4, delay:i*0.04 }
        }}
      >{c}</Letter>;
    });

  return (
    <Container darkMode={darkMode} lightTheme={lightTheme && !darkMode}>
      {/* Theme toggle button */}
      <ThemeToggle
        darkMode={darkMode}
        show={showToggle}
        onClick={toggleTheme}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <SunIcon /> : <MoonIcon />}
      </ThemeToggle>
      
      {/* Burger Menu - only visible on mobile */}
      <BurgerMenu 
        darkMode={darkMode}
        open={mobileMenuOpen}
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        <BurgerLine darkMode={darkMode} open={mobileMenuOpen} lineIndex={1} />
        <BurgerLine darkMode={darkMode} open={mobileMenuOpen} lineIndex={2} />
        <BurgerLine darkMode={darkMode} open={mobileMenuOpen} lineIndex={3} />
      </BurgerMenu>
      
      {/* Header container with bullet and border */}
      <HeaderContainer glassmorphism={glassmorphism} darkMode={darkMode}>
        <HeaderBorder show={showBullet} darkMode={darkMode} />
        <HeaderBullet show={showBullet} />
        {/* Second bullet for dark mode transition */}
        <DarkModeBullet show={showDarkModeBullet} />
      </HeaderContainer>
      
      {/* Profile image with diagonal movement */}
      <ProfileImage 
        src="/ja_left.png" 
        alt="Profile" 
        initial={{ 
          x: "100vw", 
          y: "100vh" 
        }}
        animate={{ 
          x: retreatImage ? "100vw" : 0,
          y: retreatImage ? "100vh" : 0,
          opacity: retreatImage ? 0 : 1
        }}
        transition={{ 
          x: retreatImage 
            ? { duration: 1.2, ease: "easeIn" } 
            : { duration: 2, ease: "easeOut", delay: 0.2 },
          y: retreatImage 
            ? { duration: 1.2, ease: "easeIn" } 
            : { duration: 2, ease: "easeOut", delay: 0.2 },
          opacity: { duration: 1, ease: "easeIn" }
        }}
      />
      
      {/* JulioTompsett or retract */}
      {!hideRetractedJT && (
        <TextWrapper
          blur={blur}
          initial={{ opacity:0 }}
          animate={{ 
            opacity:1, 
            color: darkMode ? '#fff' : '#000'
          }}
          transition={{ 
            duration:0.6, 
            color: { duration: 0.8 }
          }}
          style={{
            top: textPos.top,
            left: leftOffset,
            transform: "translateY(-50%)",
            transition: "color 0.8s ease-in-out"
          }}
        >
          {!retract && !showJT ? renderInitial() : renderRetract()}
        </TextWrapper>
      )}

      {/* Web Development subtitle */}
      {showSubtitle && (
        <SubtitleText
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: fadeOutSubtitle ? 0 : 1,
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
          }}
          transition={{ 
            opacity: { duration: 1.5, ease: "easeInOut" },
            color: { duration: 0.8 }
          }}
          style={{
            top: windowWidth <= 768 ? "calc(35% + 100px)" : "calc(50% + 120px)", // Using state variable
            transition: "color 0.8s ease-in-out"
          }}
        >
          Web Dev.
        </SubtitleText>
      )}

      {/* JT Studio - Logo with increased z-index */}
      {showJT && (
        <TextWrapper
          blur="none"
          initial={{ opacity:0 }}
          animate={{ 
            opacity: 1,
            color: darkMode ? "#fff" : "#000"
          }}
          transition={{ 
            opacity: { duration: 1 },
            color: { duration: 0.8 }
          }}
          fontSize={slideToHeader ? "2.2rem" : "4.5rem"}
          style={{
            top: slideToHeader ? "30px" : textPos.top,
            left: leftOffset,
            transform: "translateY(-50%)",
            zIndex: 999, // Ensure logo is above all other elements
            transition: "top 0.8s ease-in-out, font-size 0.8s ease-in-out, color 0.8s ease-in-out"
          }}
        >
          <GlowingLetter initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}}>J</GlowingLetter>
          <GlowingLetter initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}}>T</GlowingLetter>
          <Space/>
          <GlowingStudioText initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.6}}>
            Studio
          </GlowingStudioText>
        </TextWrapper>
      )}

      {/* Navbar uses same top + translateY */}
      {showJT && (
        <Header style={{ 
          top: slideToHeader ? "30px" : textPos.top
        }}>
          <NavList mobileMenuOpen={mobileMenuOpen}>
            <NavItem><NavLink darkMode={darkMode} href="#services">Services</NavLink></NavItem>
            <NavItem><NavLink darkMode={darkMode} href="#portfolio">Portfolio</NavLink></NavItem>
            <NavItem><NavLink darkMode={darkMode} href="#contact">Contact</NavLink></NavItem>
            <NavItem><NavLink darkMode={darkMode} href="#about">About</NavLink></NavItem>
          </NavList>
        </Header>
      )}
    </Container>
  );
};

export default IntroAnimation;