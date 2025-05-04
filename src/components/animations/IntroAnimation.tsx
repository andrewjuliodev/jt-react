// src/components/animations/IntroAnimation.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ScrambleText from './ScrambleText';

interface IntroAnimationProps {
  onComplete: () => void;
}

// Constants
const POSITION = {
  VERTICAL_ADJUSTMENT_TITLE: "-22vh",
  VERTICAL_ADJUSTMENT_SUBTITLE: "-25vh",
  HORIZONTAL_ADJUSTMENT: "12.5%"
};

const COLORS = {
  GLOW: 'rgba(132,227,215, 1.0)',
  GLOW_MEDIUM: 'rgba(132,227,215, 0.8)',
  GLOW_LIGHT: 'rgba(132,227,215, 0.6)',
  GLOW_LIGHTER: 'rgba(132,227,215, 0.4)',
  GLOW_LIGHTEST: 'rgba(132,227,215, 0.3)',
  GLOW_FAINT: 'rgba(132,227,215, 0.2)',
  TEXT_DARK: 'rgba(0, 0, 0, 0.7)',
  TEXT_LIGHT: 'rgba(255, 255, 255, 0.7)'
};

// Animation keyframes
const glowBurst = keyframes`
  0% {
    text-shadow:
      0 0 2px ${COLORS.GLOW_LIGHTEST},
      0 0 5px ${COLORS.GLOW_FAINT};
  }
  50% {
    text-shadow:
      0 0 10px ${COLORS.GLOW_MEDIUM},
      0 0 20px ${COLORS.GLOW_LIGHT},
      0 0 30px ${COLORS.GLOW_LIGHTER};
  }
  100% {
    text-shadow:
      0 0 5px ${COLORS.GLOW_LIGHTER},
      0 0 8px ${COLORS.GLOW_LIGHTEST};
  }
`;

const powerGlowBurst = keyframes`
  0% {
    text-shadow:
      0 0 5px ${COLORS.GLOW_LIGHTER},
      0 0 10px ${COLORS.GLOW_LIGHTEST};
  }
  30% {
    text-shadow:
      0 0 30px ${COLORS.GLOW},
      0 0 60px ${COLORS.GLOW},
      0 0 90px ${COLORS.GLOW_MEDIUM},
      0 0 120px ${COLORS.GLOW_MEDIUM};
  }
  100% {
    text-shadow:
      0 0 15px ${COLORS.GLOW_MEDIUM},
      0 0 30px ${COLORS.GLOW_LIGHT};
  }
`;

const continuousGlowBurst = keyframes`
  0% {
    text-shadow:
      0 0 3px ${COLORS.GLOW_LIGHTEST},
      0 0 5px ${COLORS.GLOW_FAINT};
  }
  50% {
    text-shadow:
      0 0 8px ${COLORS.GLOW_MEDIUM},
      0 0 12px ${COLORS.GLOW_LIGHTER},
      0 0 16px ${COLORS.GLOW_LIGHTEST};
  }
  100% {
    text-shadow:
      0 0 3px ${COLORS.GLOW_LIGHTEST},
      0 0 5px ${COLORS.GLOW_FAINT};
  }
`;

const logoHoverGlow = css`
  &:hover {
    text-shadow:
      0 0 5px rgb(58, 186, 170),
      0 0 10px rgb(58, 186, 170),
      0 0 15px rgb(58, 186, 170) !important;
    animation: none !important;
  }
`;

const moveBullet = keyframes`
  0% {
    left: -20px;
    width: 20px;
  }
  100% {
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

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const windSweepIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100px) skewX(10deg);
    letter-spacing: -5px;
  }
  30% {
    opacity: 0.5;
  }
  60% {
    letter-spacing: 0;
  }
  100% {
    opacity: 1;
    transform: translateX(0) skewX(0);
  }
`;

// Styled components
const Container = styled.div<{ darkMode?: boolean; lightTheme?: boolean }>`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: ${props => {
    if (props.darkMode) return 'rgb(30, 31, 31)';
    if (props.lightTheme) return '#fff';
    return '#fff';
  }};
  color: ${props => props.darkMode ? '#fff' : '#000'};
  overflow: hidden;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
`;

const ProfileImage = styled(motion.img)`
  position: absolute;
  bottom: 0;
  left: calc(50% + 12vw);
  transform: translateX(-50%);
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

const HeaderContainer = styled.div<{ glassmorphism?: boolean; darkMode?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 998;
  background: ${props => {
    if (props.glassmorphism && props.darkMode) return 'rgba(0, 0, 0, 0.5)';
    if (props.glassmorphism) return 'rgba(0, 0, 0, 0.5)';
    return 'transparent';
  }};
  backdrop-filter: ${props => props.glassmorphism ? 'blur(10px)' : 'none'};
  -webkit-backdrop-filter: ${props => props.glassmorphism ? 'blur(10px)' : 'none'};
  transition: all 0.8s ease-in-out;
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
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: width 0.2s ease-out;
`;

const HeaderBullet = styled.div<{ animate: boolean }>`
  position: absolute;
  bottom: -4px;
  width: 20px;
  height: 10px;
  background-color: rgb(132,227,215);
  border-radius: 5px;
  opacity: ${props => props.animate ? 1 : 0};
  animation: ${props => props.animate ? css`${moveBullet} 1.2s ease-out forwards` : 'none'};
  box-shadow: 0 0 10px rgb(132,227,215);
  z-index: 2;
`;

const DarkModeBullet = styled.div<{ animate: boolean }>`
  position: absolute;
  bottom: -4px;
  width: 20px;
  height: 10px;
  background-color: rgb(132,227,215);
  border-radius: 5px;
  opacity: ${props => props.animate ? 1 : 0};
  animation: ${props => props.animate ? css`${moveBullet} 1.2s ease-out forwards` : 'none'};
  box-shadow: 0 0 15px rgb(132,227,215), 0 0 30px rgb(132,227,215);
  z-index: 2;
`;

const LogoWrapper = styled(motion.div)<{
  blur?: string;
  fontSize?: string;
  isInHeader?: boolean;
}>`
  position: absolute;
  display: inline-flex;
  font-family: "Cal Sans", sans-serif;
  font-size: ${props => props.fontSize || "4.5rem"};
  font-weight: bold;
  color: #000;
  filter: ${({ blur }) => blur || "none"};
  z-index: 3;
  white-space: nowrap;
  transition: font-size 0.8s ease-in-out, color 0.5s ease-in-out;
  
  ${props => props.isInHeader && `
    &:hover {
      span {
        text-shadow: 
          0 0 5px rgb(58, 186, 170),
          0 0 10px rgb(58, 186, 170),
          0 0 15px rgb(58, 186, 170) !important;
      }
    }
  `}
  
  @media (max-width: 768px) {
    font-size: ${props => props.fontSize === "2.2rem" ? "1.8rem" : "3.5rem"};
  }
  
  @media (max-width: 480px) {
    font-size: ${props => props.fontSize === "2.2rem" ? "1.5rem" : "2.5rem"};
  }
`;

const CenteredTextContainer = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  text-align: center;
  z-index: 5;
  
  @media (max-width: 768px) {
    top: 35%;
  }
`;

const SubtitleTextContainer = styled.div`
  position: fixed;
  top: calc(40% + 9vh);
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  max-width: 90%;
  text-align: center;
  z-index: 5;
  font-family: "Montserrat", sans-serif;
  font-size: 1.3rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  transition: color 0.4s ease-in-out;
  
  @media (max-width: 768px) {
    top: calc(35% + 9vh);
    font-size: 1.1rem;
    max-width: 95%;
  }
`;

const NameWrapper = styled(motion.div)`
  display: flex;
`;

const Letter = styled(motion.span)`
  display: inline-block;
`;

const Space = styled.span`
  display: inline-block;
  width: 0.3em;
`;

const GlowingLabText = styled(motion.span)<{ 
  glowLevel?: 'full' | 'continuous' | 'transitioning' | 'power';
}>`
  letter-spacing: 0.03em;
  animation: ${props => {
    switch(props.glowLevel) {
      case 'full':
        return css`${glowBurst} 2s ease-in-out forwards`;
      case 'continuous':
        return css`${continuousGlowBurst} 3s ease-in-out infinite`;
      case 'transitioning':
        return css`${glowBurst} 1.5s ease-in-out`;
      case 'power':
        return css`${powerGlowBurst} 2.5s ease-in-out forwards`;
      default:
        return 'none';
    }
  }};
  transition: color 0.5s ease-in-out, text-shadow 0.5s ease-in-out;
  ${logoHoverGlow}
`;

const GlowingLetter = styled(motion.span)<{ 
  glowLevel?: 'full' | 'continuous' | 'transitioning' | 'power';
}>`
  animation: ${props => {
    switch(props.glowLevel) {
      case 'full':
        return css`${glowBurst} 2s ease-in-out forwards`;
      case 'continuous':
        return css`${continuousGlowBurst} 3s ease-in-out infinite`;
      case 'transitioning':
        return css`${glowBurst} 1.5s ease-in-out`;
      case 'power':
        return css`${powerGlowBurst} 2.5s ease-in-out forwards`;
      default:
        return 'none';
    }
  }};
  transition: color 0.5s ease-in-out, text-shadow 0.5s ease-in-out;
  ${logoHoverGlow}
`;

const ThemeToggle = styled.button<{ darkMode?: boolean; show?: boolean }>`
  position: fixed;
  top: 30px;
  right: 10%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
  border: 2px solid ${props => props.darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  outline: none;
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  opacity: ${props => props.show ? 1 : 0};
  z-index: 9999;
  box-shadow: ${props => props.darkMode 
    ? '0 0 15px rgba(255, 255, 255, 0.3), 0 0 5px rgba(132, 227, 215, 0.4)' 
    : '0 4px 15px rgba(0, 0, 0, 0.3), 0 0 5px rgba(132, 227, 215, 0.3)'};
  
  &:hover {
    background: ${props => props.darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'};
    box-shadow: 0 0 15px rgba(132, 227, 215, 0.6), 0 0 30px rgba(132, 227, 215, 0.4);
    transform: translateY(-50%) scale(1.08);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.95);
  }
  
  @media (max-width: 768px) {
    right: 25%;
  }
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
  margin-left: -40px;
`;

const NavList = styled.ul<{ mobileMenuOpen?: boolean; darkMode?: boolean }>`
  display: flex;
  gap: 3rem;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-left: 40px;
  font-family: "Montserrat", sans-serif;
  font-weight: 200;
  transition: color 0.8s ease-in-out;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    right: ${props => props.mobileMenuOpen ? '0' : '-100%'};
    flex-direction: column;
    gap: 1.5rem;
    background: ${props => props.darkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)'};
    width: 70%;
    max-width: 300px;
    height: calc(100vh - 60px);
    padding: 2rem;
    margin-left: 0;
    transition: right 0.3s ease-in-out, background-color 0.8s ease-in-out;
    align-items: center;
    justify-content: flex-start;
  }
`;

const NavItem = styled.li`
  position: relative;
  margin: 0 5px;
  
  @media (max-width: 768px) {
    margin: 10px 0;
    width: 100%;
    text-align: center;
  }
`;

const NavLink = styled.a<{ darkMode?: boolean }>`
  color: ${props => props.darkMode ? '#fff' : '#fff'};
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
    display: inline-block;
  }
`;

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

// SVG Icons
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
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0, 0, 0, 0.3)" />
  </svg>
);

// Main component
const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  // Constants
  const name = "JulioTompsett's";
  const ANIMATION_TIMINGS = {
    INITIAL_ELEMENTS: 1000,
    SUBTITLE_TEXT: 1100,
    START_RETRACTION: 2750,
    HIDE_RETRACTED_JT: 3900,
    POWER_GLOW_BURST: 5250,
    SLIDE_TO_HEADER: 5350,
    GLASSMORPHISM: 5150,
    SHOW_TOGGLE: 5250,
    SHOW_NAV: 5450,
    HEADER_BORDER: 5550,
    HEADER_GLOW: 6550,
    ANIMATION_COMPLETE: 7350
  };

  // State management - organized by functionality
  // Animation sequence states
  const [retract, setRetract] = useState(false);
  const [showJT, setShowJT] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [fadeOutSubtitle, setFadeOutSubtitle] = useState(false);
  const [retreatImage, setRetreatImage] = useState(false);
  const [slideToHeader, setSlideToHeader] = useState(false);
  const [showJulioTompsett, setShowJulioTompsett] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [startScramble, setStartScramble] = useState(false);
  const [scrambleComplete, setScrambleComplete] = useState(false);
  const [hideRetractedJT, setHideRetractedJT] = useState(false);
  const [mainJTLabText, setMainJTLabText] = useState(false);
  const [showSubtitleText, setShowSubtitleText] = useState(false);
  const [scrambleSubtitleText, setScrambleSubtitleText] = useState(false);

  // Header and border states
  const [headerBorderVisible, setHeaderBorderVisible] = useState(false);
  const [animateLightBullet, setAnimateLightBullet] = useState(false);
  const [animateDarkBullet, setAnimateDarkBullet] = useState(false);
  const [bulletAnimationInProgress, setBulletAnimationInProgress] = useState(false);
  const [glassmorphism, setGlassmorphism] = useState(false);

  // Theme and appearance states
  const [darkMode, setDarkMode] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [tOffset, setTOffset] = useState(0);
  const [blur, setBlur] = useState<"none"|"blur(5px)">("none");
  const [textPos, setTextPos] = useState<{ top: string; left: string }>({
    top: `calc(50% + ${POSITION.VERTICAL_ADJUSTMENT_TITLE})`,
    left: POSITION.HORIZONTAL_ADJUSTMENT,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentGlowLevel, setCurrentGlowLevel] = useState<'full' | 'continuous' | 'transitioning' | 'power' | undefined>(undefined);
  const [subtleGlow, setSubtleGlow] = useState(false);
  const [themeToggled, setThemeToggled] = useState(false);
  const [continuousGlowingActive, setContinuousGlowingActive] = useState(false);

  // Refs
  const jRef = useRef<HTMLSpanElement>(null);
  const webDevRef = useRef<HTMLDivElement | null>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  // Direct keyboard shortcut for theme toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'D' && e.ctrlKey) {
        console.log("Direct theme toggle triggered");
        setDarkMode(prevMode => !prevMode);
        setLightTheme(prevMode => !prevMode);
        setThemeToggled(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper functions
  const leftOffset = POSITION.HORIZONTAL_ADJUSTMENT;

  const startContinuousGlow = () => {
    setCurrentGlowLevel('continuous');
    setContinuousGlowingActive(true);
    
    const continuousGlowTimer = setInterval(() => {
      if (!continuousGlowingActive) {
        setCurrentGlowLevel('continuous');
        setContinuousGlowingActive(true);
      }
    }, 5000);
    
    return () => {
      clearInterval(continuousGlowTimer);
    };
  };

  const toggleTheme = () => {
    console.log("Theme toggle clicked, current dark mode:", darkMode);
    
    setCurrentGlowLevel('continuous');
    setContinuousGlowingActive(true);
    
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setLightTheme(!newDarkMode);
    setThemeToggled(true);
    
    localStorage.setItem('darkMode', newDarkMode ? 'true' : 'false');
    
    setHeaderBorderVisible(true);
    setBulletAnimationInProgress(true);
    
    if (newDarkMode) {
      setAnimateDarkBullet(true);
      setTimeout(() => {
        setAnimateDarkBullet(false);
        setBulletAnimationInProgress(false);
      }, 1200);
    } else {
      setAnimateLightBullet(true);
      setTimeout(() => {
        setAnimateLightBullet(false);
        setBulletAnimationInProgress(false);
      }, 1200);
    }
    
    setTimeout(() => {
      setCurrentGlowLevel('full');
      
      setTimeout(() => {
        setCurrentGlowLevel('continuous');
        setContinuousGlowingActive(true);
      }, 2000);
    }, 100);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleScrambleComplete = () => {
    console.log("[Animation] Scramble complete at:", Date.now());
    setScrambleComplete(true);
    setScrambleSubtitleText(true);
    setShowSubtitle(false);
    setMainJTLabText(true);
    setBlur("none");
    
    setTimeout(() => {
      console.log("[Animation] Applying power glow after delay at:", Date.now());
      setCurrentGlowLevel('power');
      
      setTimeout(() => {
        setCurrentGlowLevel('power');
      }, 20);
      
      setTimeout(() => {
        console.log("[Animation] Switching to continuous glow at:", Date.now());
        setCurrentGlowLevel('continuous');
        setContinuousGlowingActive(true);
      }, 2000);
    }, 200);
  };

  // Effect for screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      
      if (window.innerWidth <= 768) {
        setTextPos({
          top: `calc(35% + ${POSITION.VERTICAL_ADJUSTMENT_TITLE})`,
          left: POSITION.HORIZONTAL_ADJUSTMENT
        });
      } else {
        setTextPos({
          top: `calc(50% + ${POSITION.VERTICAL_ADJUSTMENT_TITLE})`,
          left: POSITION.HORIZONTAL_ADJUSTMENT
        });
      }
      
      setWindowWidth(window.innerWidth);
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Effect for localStorage theme preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    console.log("Loading theme preference from localStorage:", savedDarkMode);
    
    if (savedDarkMode === 'true') {
      console.log("Setting dark mode based on localStorage");
      setDarkMode(true);
      setLightTheme(false);
    }
  }, []);

  // Effect for dark mode changes
  useEffect(() => {
    console.log("Dark mode state changed:", darkMode);
    
    if (darkMode) {
      if (slideToHeader && !bulletAnimationInProgress) {
        console.log("Applying continuous glow for dark mode");
        setCurrentGlowLevel('continuous');
        setContinuousGlowingActive(true);
      }
    }
    
    if (themeToggled) {
      localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    }
  }, [darkMode, slideToHeader, themeToggled, bulletAnimationInProgress]);

  // Effect for calculating text offsets during retraction
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

  // Main animation sequence effect
  useEffect(() => {
    let initialBulletTimer: NodeJS.Timeout;
    let continuousGlowCleanup: (() => void) | undefined;
    
    const timers = [
      setTimeout(() => {
        console.log("[Animation] Starting initial elements appearance at:", Date.now());
        setShowSubtitle(true);
        setShowJulioTompsett(true);
        setImageVisible(true);
      }, ANIMATION_TIMINGS.INITIAL_ELEMENTS),
      
      setTimeout(() => {
        console.log("[Animation] Showing subtitle text at:", Date.now());
        setShowSubtitleText(true);
      }, ANIMATION_TIMINGS.SUBTITLE_TEXT),
      
      setTimeout(() => {
        console.log("[Animation] Starting retraction at:", Date.now());
        setRetract(true);
      }, ANIMATION_TIMINGS.START_RETRACTION),
      
      setTimeout(() => {
        console.log("[Animation] Starting scrambling at:", Date.now());
        setStartScramble(true);
      }, ANIMATION_TIMINGS.START_RETRACTION),
      
      setTimeout(() => {
        console.log("[Animation] Hiding retracted JT at:", Date.now());
        setHideRetractedJT(true);
      }, ANIMATION_TIMINGS.HIDE_RETRACTED_JT),
      
      setTimeout(() => {
        console.log("[Animation] Initiating power glow burst at:", Date.now());
        setCurrentGlowLevel('power');
        
        const powerGlowSequence = [
          setTimeout(() => setCurrentGlowLevel('power'), 20),
          setTimeout(() => setCurrentGlowLevel('power'), 40),
          setTimeout(() => setCurrentGlowLevel('power'), 60)
        ];
      }, ANIMATION_TIMINGS.POWER_GLOW_BURST),
      
      setTimeout(() => {
        setSlideToHeader(true);
        setShowSubtitle(false);
        setRetreatImage(true);
      }, ANIMATION_TIMINGS.SLIDE_TO_HEADER),
      
      setTimeout(() => setGlassmorphism(true), ANIMATION_TIMINGS.GLASSMORPHISM),
      
      setTimeout(() => setLightTheme(true), ANIMATION_TIMINGS.GLASSMORPHISM),
      
      setTimeout(() => {
        setShowToggle(true);
        console.log("Toggle button should be visible now");
      }, ANIMATION_TIMINGS.SHOW_TOGGLE),
      
      setTimeout(() => {
        setShowJT(true);
      }, ANIMATION_TIMINGS.SHOW_NAV),
      
      setTimeout(() => {
        setHeaderBorderVisible(true);
        
        if (!bulletAnimationInProgress) {
          setBulletAnimationInProgress(true);
          
          setAnimateLightBullet(false);
          setAnimateDarkBullet(false);
          
          initialBulletTimer = setTimeout(() => {
            setAnimateLightBullet(true);
            
            setTimeout(() => {
              setAnimateLightBullet(false);
              setBulletAnimationInProgress(false);
            }, 1200);
          }, 50);
        }
      }, ANIMATION_TIMINGS.HEADER_BORDER),
      
      setTimeout(() => {
        setCurrentGlowLevel('full');
        
        setTimeout(() => {
          continuousGlowCleanup = startContinuousGlow();
        }, 2000);
      }, ANIMATION_TIMINGS.HEADER_GLOW),
      
      setTimeout(onComplete, ANIMATION_TIMINGS.ANIMATION_COMPLETE),
    ];
    
    return () => {
      timers.forEach(clearTimeout);
      if (initialBulletTimer) clearTimeout(initialBulletTimer);
      if (continuousGlowCleanup) continuousGlowCleanup();
    };
  }, [onComplete, bulletAnimationInProgress, windowWidth]);

  // Render functions
  const renderInitial = () => (
    <NameWrapper
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: showJulioTompsett ? 1 : 0,
        color: darkMode ? COLORS.TEXT_LIGHT : COLORS.TEXT_DARK
      }}
      transition={{ 
        opacity: { duration: 1.5, ease: "easeInOut" },
        color: { duration: 0.4 }
      }}
    >
      {name.split("").map((c, i) => (
        <Letter 
          key={i}
          ref={el => {
            if (el) {
              if (i===0) jRef.current = el;
              lettersRef.current[i] = el;
            }
          }}
        >{c}</Letter>
      ))}
    </NameWrapper>
  );

  const renderRetract = () => (
    <NameWrapper
      animate={{ opacity: hideRetractedJT ? 0 : 1 }}
      transition={{ opacity: { duration: 0.8, ease: "easeOut" } }}
    >
      {name.split("").map((c, i) => (
        <Letter 
          key={`letter-${i}`}
          initial={{ x: 0, opacity: 1 }}
          animate={{ 
            x: `-${i * 0.5}em`, 
            opacity: 0 
          }}
          transition={{
            x: { duration: 0.6, delay: i * 0.04 },
            opacity: { duration: 0.4, delay: i * 0.04 }
          }}
          ref={el => {
            if (el && i === 0) jRef.current = el;
            if (el) lettersRef.current[i] = el;
          }}
        >
          {c}
        </Letter>
      ))}
    </NameWrapper>
  );

  // Render component
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
        <HeaderBorder show={headerBorderVisible} darkMode={darkMode} />
        <HeaderBullet animate={animateLightBullet} />
        <DarkModeBullet animate={animateDarkBullet} />
      </HeaderContainer>
      
      {/* Profile image */}
      <ProfileImage 
        src="/ja_left.png" 
        alt="Profile" 
        initial={{ 
          opacity: 0,
          y: "100vh"
        }}
        animate={{ 
          opacity: retreatImage ? 0 : (imageVisible ? 1 : 0),
          y: retreatImage ? 0 : (imageVisible ? 0 : "100vh")
        }}
        transition={{ 
          opacity: retreatImage 
            ? { duration: 1.2, ease: "easeIn" } 
            : { duration: 1, ease: "easeOut" },
          y: { 
            duration: 1.5,
            ease: imageVisible ? [0.215, 0.61, 0.355, 1.2] : "easeOut"
          }
        }}
      />
      
      {/* JulioTompsett or retract */}
      <LogoWrapper
        blur={blur}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: hideRetractedJT ? 0 : 1,
          color: darkMode ? '#fff' : '#000'
        }}
        transition={{ 
          duration: 0.6, 
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
      </LogoWrapper>

      {/* Web Development subtitle */}
      {showSubtitle && !startScramble && (
        <>
          <CenteredTextContainer>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: fadeOutSubtitle ? 0 : 1,
                color: darkMode ? COLORS.TEXT_LIGHT : COLORS.TEXT_DARK
              }}
              transition={{ 
                opacity: { duration: 1.5, ease: "easeInOut" },
                color: { duration: 0.4 }
              }}
              style={{
                fontFamily: "Cal Sans, sans-serif",
                fontSize: windowWidth <= 768 ? "8rem" : "12rem",
                fontWeight: "bold"
              }}
            >
              Web Dev.
            </motion.div>
          </CenteredTextContainer>
          
          {/* Subtitle text below Web Dev */}
          {showSubtitleText && (
            <SubtitleTextContainer>
              <motion.div
                initial={{ 
                  opacity: 0,
                  x: -100,
                  skewX: 10,
                  letterSpacing: "-5px"
                }}
                animate={{ 
                  opacity: fadeOutSubtitle ? 0 : 1,
                  x: 0,
                  skewX: 0,
                  letterSpacing: "0px",
                  color: darkMode ? COLORS.TEXT_LIGHT : COLORS.TEXT_DARK
                }}
                transition={{ 
                  opacity: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] },
                  x: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                  skewX: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                  letterSpacing: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
                  color: { duration: 0.4 }
                }}
                style={{
                  fontWeight: 400,
                  fontSize: windowWidth <= 768 ? "1.1rem" : "1.2rem",
                  display: "inline-block"
                }}
              >
                Crafting Custom Websites: Business, E-commerce, Portfolios & More
              </motion.div>
            </SubtitleTextContainer>
          )}
        </>
      )}

      {/* Text scrambling animation */}
      {startScramble && !scrambleComplete && (
        <>
          <CenteredTextContainer>
            <ScrambleText 
              startText="Web Dev."
              endText="JT Lab"
              duration={1000}
              color={darkMode ? COLORS.TEXT_LIGHT : COLORS.TEXT_DARK}
              fontSize={windowWidth <= 768 ? "8rem" : "12rem"}
              onComplete={handleScrambleComplete}
            />
          </CenteredTextContainer>
          
          <SubtitleTextContainer>
            <ScrambleText 
              startText="Crafting Custom Websites: Business, E-commerce, Portfolios & More"
              endText="Landing Sites | SPA | PWA | Web | Mobile Optimized"
              duration={1000}
              color={darkMode ? COLORS.TEXT_LIGHT : COLORS.TEXT_DARK}
              fontSize={windowWidth <= 768 ? "1.1rem" : "1.2rem"}
              style={{ fontWeight: 400 }}
            />
          </SubtitleTextContainer>
        </>
      )}

      {/* JT Lab in center position */}
      {mainJTLabText && !slideToHeader && (
        <>
          <CenteredTextContainer>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                color: darkMode ? '#fff' : '#000'
              }}
              transition={{ opacity: { duration: 0.2 } }}
              style={{
                fontFamily: "Cal Sans, sans-serif",
                fontSize: windowWidth <= 768 ? "8rem" : "12rem",
                fontWeight: "bold",
                textShadow: currentGlowLevel === 'power' 
                  ? `0 0 30px ${COLORS.GLOW}, 0 0 60px ${COLORS.GLOW}, 0 0 90px ${COLORS.GLOW_MEDIUM}, 0 0 120px ${COLORS.GLOW_MEDIUM}`
                  : `0 0 10px ${COLORS.GLOW_MEDIUM}, 0 0 20px ${COLORS.GLOW_LIGHT}, 0 0 30px ${COLORS.GLOW_LIGHTER}`,
                WebkitTextFillColor: darkMode ? 'white' : 'black',
                WebkitTextStroke: '0.5px ' + (darkMode ? 'white' : 'black'),
                transition: "color 0.3s ease-in-out, text-shadow 0.3s ease-in-out"
              }}
            >
              JT Lab
            </motion.div>
          </CenteredTextContainer>
          
          <SubtitleTextContainer>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                color: darkMode ? COLORS.TEXT_LIGHT : COLORS.TEXT_DARK
              }}
              transition={{ opacity: { duration: 0.2 } }}
              style={{
                fontWeight: 400,
                fontSize: windowWidth <= 768 ? "1.1rem" : "1.3rem"
              }}
            >
              Landing Sites | SPA | PWA | Web | Mobile Optimized
            </motion.div>
          </SubtitleTextContainer>
        </>
      )}

      {/* JT Lab in header position */}
      {mainJTLabText && slideToHeader && (
        <>
          <motion.div
            initial={{ 
              position: "fixed",
              top: "40%",
              left: "50%", 
              transform: "translate(-50%, -50%)",
              fontSize: windowWidth <= 768 ? "8rem" : "12rem"
            }}
            animate={{ 
              position: "fixed",
              top: "30px",
              left: "10%", 
              transform: "translateY(-50%)",
              fontSize: windowWidth <= 768 ? "1.8rem" : "2.2rem"
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeInOut" 
            }}
            style={{
              fontFamily: "Cal Sans, sans-serif",
              fontWeight: "bold",
              color: darkMode ? '#fff' : '#000',
              zIndex: 1001,
              cursor: "pointer",
              textShadow: currentGlowLevel === 'power'
                ? `0 0 30px ${COLORS.GLOW}, 0 0 60px ${COLORS.GLOW}, 0 0 90px ${COLORS.GLOW_MEDIUM}, 0 0 120px ${COLORS.GLOW_MEDIUM}`
                : (currentGlowLevel === 'full'
                  ? `0 0 10px ${COLORS.GLOW_MEDIUM}, 0 0 20px ${COLORS.GLOW_LIGHT}, 0 0 30px ${COLORS.GLOW_LIGHTER}`
                  : (currentGlowLevel === 'continuous' 
                    ? `0 0 8px ${COLORS.GLOW_MEDIUM}, 0 0 12px ${COLORS.GLOW_LIGHTER}, 0 0 16px ${COLORS.GLOW_LIGHTEST}`
                    : `0 0 5px ${COLORS.GLOW_LIGHTEST}, 0 0 10px ${COLORS.GLOW_FAINT}`)),
              transition: "color 0.3s ease-in-out, text-shadow 0.3s ease-in-out",
              WebkitTextFillColor: darkMode ? 'white' : 'black',
              WebkitTextStroke: '0.5px ' + (darkMode ? 'white' : 'black'),
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            JT Lab
          </motion.div>
          
          <motion.div
            initial={{ 
              position: "fixed",
              top: "calc(40% + 9vh)",
              left: "50%", 
              transform: "translateX(-50%)",
              opacity: 1
            }}
            animate={{ 
              opacity: 0
            }}
            transition={{ 
              opacity: { duration: 0.4, ease: "easeOut" }
            }}
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: windowWidth <= 768 ? "1.1rem" : "1.3rem",
              fontWeight: 400,
              color: darkMode ? COLORS.TEXT_LIGHT : COLORS.TEXT_DARK,
              textAlign: "center",
              maxWidth: "90%"
            }}
          >
            Landing Sites | SPA | PWA | Web | Mobile Optimized
          </motion.div>
        </>
      )}

      {/* Header with navigation */}
      {showJT && (
        <Header style={{ 
          top: slideToHeader ? "30px" : textPos.top
        }}>
          <NavList mobileMenuOpen={mobileMenuOpen} darkMode={darkMode}>
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