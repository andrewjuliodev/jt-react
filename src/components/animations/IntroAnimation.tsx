// src/components/animations/IntroAnimation.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';
import ScrambleText from './ScrambleText';

interface IntroAnimationProps {
  onComplete: () => void;
}

// Position correction constants
const VERTICAL_ADJUSTMENT_TITLE = "-22vh"; // For JulioTompsett and JT Lab (updated)
const VERTICAL_ADJUSTMENT_SUBTITLE = "-25vh"; // For Web Dev text (updated)
// Adjust horizontal position to 12.5% (halfway between 10% and 15%)
const HORIZONTAL_ADJUSTMENT = "12.5%"; // Changed to 12.5% (2.5vw shift to the right from original)

// Full strength glow burst with smoother transitions
const glowBurst = keyframes`
  0% {
    text-shadow:
      0 0 2px rgba(132,227,215, 0.3),
      0 0 5px rgba(132,227,215, 0.2);
  }
  50% {
    text-shadow:
      0 0 10px rgba(132,227,215, 0.8),
      0 0 20px rgba(132,227,215, 0.6),
      0 0 30px rgba(132,227,215, 0.4);
  }
  100% {
    text-shadow:
      0 0 5px rgba(132,227,215, 0.4),
      0 0 8px rgba(132,227,215, 0.3);
  }
`;

// Enhanced powerful glow burst for transition moment - shorter duration for immediate impact
const powerGlowBurst = keyframes`
  0% {
    text-shadow:
      0 0 5px rgba(132,227,215, 0.4),
      0 0 10px rgba(132,227,215, 0.3);
  }
  30% {
    text-shadow:
      0 0 30px rgba(132,227,215, 1.0),
      0 0 60px rgba(132,227,215, 1.0),
      0 0 90px rgba(132,227,215, 0.9),
      0 0 120px rgba(132,227,215, 0.8);
  }
  100% {
    text-shadow:
      0 0 15px rgba(132,227,215, 0.8),
      0 0 30px rgba(132,227,215, 0.6);
  }
`;

// Continuous glow with smoother transitions
const continuousGlowBurst = keyframes`
  0% {
    text-shadow:
      0 0 3px rgba(132,227,215, 0.3),
      0 0 5px rgba(132,227,215, 0.2);
  }
  50% {
    text-shadow:
      0 0 8px rgba(132,227,215, 0.5),
      0 0 12px rgba(132,227,215, 0.4),
      0 0 16px rgba(132,227,215, 0.3);
  }
  100% {
    text-shadow:
      0 0 3px rgba(132,227,215, 0.3),
      0 0 5px rgba(132,227,215, 0.2);
  }
`;

// Function to apply hover glow effect for JT Lab logo
const logoHoverGlow = css`
  &:hover {
    text-shadow:
      0 0 5px rgb(58, 186, 170),
      0 0 10px rgb(58, 186, 170),
      0 0 15px rgb(58, 186, 170) !important;
    animation: none !important;
  }
`;

// Modified the bullet animation to move at constant speed
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

const Container = styled.div<{ darkMode?: boolean; lightTheme?: boolean }>`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: ${props => {
    if (props.darkMode) return 'rgb(30, 31, 31)';
    if (props.lightTheme) return '#fff'; // Changed to white
    return '#fff';
  }};
  color: ${props => props.darkMode ? '#fff' : '#000'};
  overflow: hidden;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
`;

const ProfileImage = styled(motion.img)`
  position: absolute;
  bottom: 0;
  left: calc(50% + 12vw); /* Increased from 8vw to 12vw to move image more to the right */
  transform: translateX(-50%); /* Ensure proper centering */
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
  z-index: 998; // Lower than JTLabLogo's z-index of 1001
  background: ${props => {
    if (props.glassmorphism && props.darkMode) return 'rgba(0, 0, 0, 0.5)'; // Changed for dark mode
    if (props.glassmorphism) return 'rgba(0, 0, 0, 0.5)'; // Changed to requested value
    return 'transparent';
  }};
  backdrop-filter: ${props => props.glassmorphism ? 'blur(10px)' : 'none'};
  -webkit-backdrop-filter: ${props => props.glassmorphism ? 'blur(10px)' : 'none'};
  transition: all 0.8s ease-in-out; // Faster transition for smoother theme toggle
  box-shadow: ${props => props.glassmorphism ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'};
`;

// Modified border to always maintain visibility after initial animation
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
  transition: width 0.2s ease-out; /* Added transition for smoother reveal */
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

// Custom hover styles for the JT Lab logo with direct CSS
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
  z-index: 3; /* Increased z-index to bring logo to front */
  white-space: nowrap;
  transition: font-size 0.8s ease-in-out, color 0.5s ease-in-out; /* Improved color transition */
  
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

// NEW: Create a consistent text container for all subtitle text
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

// Add wind sweep animation for the subtitle text
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

// Add a container for the subtitle text
const SubtitleTextContainer = styled.div`
  position: fixed;
  top: calc(40% + 9vh); // Position below the main subtitle - increased by 1vh
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  max-width: 90%;
  text-align: center;
  z-index: 5;
  font-family: "Montserrat", sans-serif;
  font-size: 1.3rem; // Changed from 1.5rem to 1.3rem
  font-weight: 400; // Changed from default to 400
  color: rgba(0, 0, 0, 0.7);
  transition: color 0.4s ease-in-out;
  
  @media (max-width: 768px) {
    top: calc(35% + 9vh); // Increased by 1vh
    font-size: 1.1rem; // Proportionally adjusted for mobile
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

// Updated to support improved glow system with transitioning state
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

// Updated to support improved glow system with transitioning state
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
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(0, 0, 0, 0.3)" />
  </svg>
);

// Theme toggle button with improved visibility and styling
const ThemeToggle = styled.button<{ darkMode?: boolean; show?: boolean }>`
  position: fixed; /* Fixed position ensures it's always accessible */
  top: 30px;
  right: 10%;
  transform: translateY(-50%);
  width: 42px; /* Slightly larger */
  height: 42px; /* Slightly larger */
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
  z-index: 9999; /* Maximum z-index to ensure visibility */
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
    right: 25%; /* Adjust for mobile to avoid overlap with burger menu */
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
  margin-left: -40px; /* Add negative margin to offset the JT Lab logo position */
`;

const NavList = styled.ul<{ mobileMenuOpen?: boolean; darkMode?: boolean }>`
  display: flex;
  gap: 3rem;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-left: 40px; /* Adjusted from 80px to 40px to center the navbar better */
  font-family: "Montserrat", sans-serif;
  font-weight: 200;
  transition: color 0.8s ease-in-out;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    right: ${props => props.mobileMenuOpen ? '0' : '-100%'};
    flex-direction: column;
    gap: 1.5rem; /* Fixed typo: removed the 'a' before 1.5rem */
    background: ${props => props.darkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)'};
    width: 70%;
    max-width: 300px;
    height: calc(100vh - 60px);
    padding: 2rem;
    margin-left: 0; /* Reset margin for mobile view */
    transition: right 0.3s ease-in-out, background-color 0.8s ease-in-out;
    align-items: center; /* Center items horizontally in the mobile menu */
    justify-content: flex-start;
  }
`;

const NavItem = styled.li`
  position: relative;
  margin: 0 5px;
  
  @media (max-width: 768px) {
    margin: 10px 0;
    width: 100%; /* Full width in mobile view */
    text-align: center; /* Center text in mobile view */
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
    display: inline-block; /* Better for centering */
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
  const [showJulioTompsett, setShowJulioTompsett] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  
  // State for text scrambling
  const [startScramble, setStartScramble] = useState(false);
  const [scrambleComplete, setScrambleComplete] = useState(false);
  
  // Modified state variables for border and bullets
  const [headerBorderVisible, setHeaderBorderVisible] = useState(false);
  const [animateLightBullet, setAnimateLightBullet] = useState(false);
  const [animateDarkBullet, setAnimateDarkBullet] = useState(false);
  const [bulletAnimationInProgress, setBulletAnimationInProgress] = useState(false);
  
  const [glassmorphism, setGlassmorphism] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [hideRetractedJT, setHideRetractedJT] = useState(false);
  const [tOffset, setTOffset] = useState(0);
  const [blur, setBlur] = useState<"none"|"blur(5px)">("none");
  const [textPos, setTextPos] = useState<{ top: string; left: string }>({
    top: `calc(50% + ${VERTICAL_ADJUSTMENT_TITLE})`, // Adjusted position for title
    left: HORIZONTAL_ADJUSTMENT, // Updated to use the HORIZONTAL_ADJUSTMENT constant (15%)
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Simplified glow state management
  const [currentGlowLevel, setCurrentGlowLevel] = useState<'full' | 'continuous' | 'transitioning' | 'power' | undefined>(undefined);
  const [subtleGlow, setSubtleGlow] = useState(false);
  const [themeToggled, setThemeToggled] = useState(false);
  
  // Track if continuous glowing is active
  const [continuousGlowingActive, setContinuousGlowingActive] = useState(false);
  
  // New state for JT Lab text after scrambling
  const [mainJTLabText, setMainJTLabText] = useState(false);
  
  // Add state for the subtitle text
  const [showSubtitleText, setShowSubtitleText] = useState(false);
  const [scrambleSubtitleText, setScrambleSubtitleText] = useState(false);

  const jRef = useRef<HTMLSpanElement>(null);
  const webDevRef = useRef<HTMLDivElement | null>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  
  // Add event handler to debug power glow rendering
  useEffect(() => {
    console.log("currentGlowLevel state changed:", currentGlowLevel);
  }, [currentGlowLevel]);
  
  // Add event handler to debug mainJTLabText state
  useEffect(() => {
    console.log("mainJTLabText state changed:", mainJTLabText);
    
    // We're removing the immediate power glow trigger from here to allow
    // our delayed glow in handleScrambleComplete to work properly
    // The glow will now be controlled exclusively by the handleScrambleComplete function
  }, [mainJTLabText]);
  
  // Direct keyboard shortcut for theme toggle (debugging)
  useEffect(() => {
    // Add a keyboard shortcut for toggling dark mode (for emergency use)
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

  // Compute left offset once for the initial JulioTompsett text
  const leftOffset = HORIZONTAL_ADJUSTMENT; // Updated to use the constant directly

  // Simplified function to set continuous glow
  const startContinuousGlow = () => {
    // Set continuous glow
    setCurrentGlowLevel('continuous');
    setContinuousGlowingActive(true);
    
    // Set up a permanent continuous glow effect that never stops
    // This is a safety measure to ensure the glow never turns off
    const continuousGlowTimer = setInterval(() => {
      if (!continuousGlowingActive) {
        setCurrentGlowLevel('continuous');
        setContinuousGlowingActive(true);
      }
    }, 5000); // Check every 5 seconds to keep continuous glow active
    
    // Return cleanup function
    return () => {
      clearInterval(continuousGlowTimer);
    };
  };

  // Toggle dark mode with smooth transition implementation
  const toggleTheme = () => {
    console.log("Theme toggle clicked, current dark mode:", darkMode);
    
    // Always ensure continuous glow is active first
    // This ensures we never lose the glow during transitions
    setCurrentGlowLevel('continuous');
    setContinuousGlowingActive(true);
    
    // Toggle theme states
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setLightTheme(!newDarkMode);
    setThemeToggled(true);
    
    // Save to localStorage
    localStorage.setItem('darkMode', newDarkMode ? 'true' : 'false');
    
    // Make border visible
    setHeaderBorderVisible(true);
    
    // Start appropriate bullet animation
    setBulletAnimationInProgress(true);
    
    if (newDarkMode) {
      // Switching TO dark mode - use dark bullet
      setAnimateDarkBullet(true);
      setTimeout(() => {
        setAnimateDarkBullet(false);
        setBulletAnimationInProgress(false);
      }, 1200);
    } else {
      // Switching TO light mode - use light bullet
      setAnimateLightBullet(true);
      setTimeout(() => {
        setAnimateLightBullet(false);
        setBulletAnimationInProgress(false);
      }, 1200);
    }
    
    // Apply enhanced glow during the transition (occurs during color change)
    // Apply enhanced glow AFTER ensuring continuous glow is active
    setTimeout(() => {
      setCurrentGlowLevel('full'); // Enhanced glow for transition effect
      
      // Return to continuous glow after the transition effect
      setTimeout(() => {
        setCurrentGlowLevel('continuous');
        setContinuousGlowingActive(true);
      }, 2000);
    }, 100); // Shorter delay for smoother transition
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
        // Mobile adjustments - lower position
        setTextPos({
          top: `calc(35% + ${VERTICAL_ADJUSTMENT_TITLE})`, // Adjusted for mobile
          left: HORIZONTAL_ADJUSTMENT // Updated to use the constant directly
        });
      } else {
        // Default positioning for larger screens - lower position
        setTextPos({
          top: `calc(50% + ${VERTICAL_ADJUSTMENT_TITLE})`, // Adjusted for desktop
          left: HORIZONTAL_ADJUSTMENT // Updated to use the constant directly
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

  // Load theme preference from localStorage on initial load
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    console.log("Loading theme preference from localStorage:", savedDarkMode);
    
    if (savedDarkMode === 'true') {
      console.log("Setting dark mode based on localStorage");
      setDarkMode(true);
      setLightTheme(false);
    }
  }, []);

  // Separate effect for handling dark mode changes
  useEffect(() => {
    console.log("Dark mode state changed:", darkMode);
    
    // Make sure text colors update appropriately
    if (darkMode) {
      // Dark mode active - ensure appropriate glow effects
      if (slideToHeader && !bulletAnimationInProgress) {
        console.log("Applying continuous glow for dark mode");
        // Set continuous glow for the header logo
        setCurrentGlowLevel('continuous');
        setContinuousGlowingActive(true);
      }
    }
    
    // Save to localStorage whenever darkMode changes
    if (themeToggled) {
      localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    }
  }, [darkMode, slideToHeader, themeToggled, bulletAnimationInProgress]);

  // Image appearance is now handled directly in the main animation sequence
  // This separate useEffect is no longer needed as we'll synchronize all animations

  // Run the timing for intro animation with synchronized elements
  useEffect(() => {
    // Track initial animation bullet timer to avoid conflicts
    let initialBulletTimer: NodeJS.Timeout;
    
    // Track continuous glow cleanup
    let continuousGlowCleanup: (() => void) | undefined;
    
    const timers = [
      // Show all elements at the same time: WebDev, JulioTompsett, and image
      setTimeout(() => {
        console.log("[Animation] Starting initial elements appearance at:", Date.now());
        setShowSubtitle(true);
        setShowJulioTompsett(true);
        setImageVisible(true); // Now synchronized with the text elements
      }, 1000), // Reduced from 1700 to 1000 for faster entrance
      
      // Show the subtitle text right after the main elements appear
      setTimeout(() => {
        console.log("[Animation] Showing subtitle text at:", Date.now());
        setShowSubtitleText(true);
      }, 1100), // Reduced from 1800 to 1100 to match new timing
      
      // Start retraction as soon as the image settled down +250ms
      // (Image animation takes about 1.5s, so 1000ms + 1500ms + 250ms = 2750ms)
      setTimeout(() => {
        console.log("[Animation] Starting retraction at:", Date.now());
        setRetract(true);
      }, 2750), // Added extra 100ms delay (was 2650ms)
      
      // Start text scrambling simultaneous with retraction
      setTimeout(() => {
        console.log("[Animation] Starting scrambling at:", Date.now());
        setStartScramble(true);
      }, 2750), // Added extra 100ms delay (was 2650ms)
      
      // Hide all letters (including J) right after retraction is complete
      setTimeout(() => {
        console.log("[Animation] Hiding retracted JT at:", Date.now());
        setHideRetractedJT(true);
      }, 3900), // Adjusted from 5600ms
      
      // Add powerful glow burst just 100ms before transition to header
      setTimeout(() => {
        console.log("[Animation] Initiating power glow burst at:", Date.now());
        setCurrentGlowLevel('power');
        
        // Let's add an intense rapid-fire sequence of setting the glow level to 'power' 
        // multiple times to ensure the animation plays fully and is very noticeable
        const powerGlowSequence = [
          setTimeout(() => setCurrentGlowLevel('power'), 20),
          setTimeout(() => setCurrentGlowLevel('power'), 40),
          setTimeout(() => setCurrentGlowLevel('power'), 60)
        ];
      }, 5250), // Adjusted from 7000ms
      
      // Start animating JT Lab to header position
      setTimeout(() => {
        // Set this first to ensure slide animation works
        setSlideToHeader(true);
        
        // Now we can hide the scrambled text since we're moving to header
        setShowSubtitle(false);
        
        // Retreat the image at the same time as JT Lab makes the transition to header
        setRetreatImage(true);
        
        // We no longer need to set position explicitly here as it's handled by inline styles
      }, 5350), // Adjusted from 7100ms
      
      // Apply glassmorphism as the header animation starts
      setTimeout(() => setGlassmorphism(true), 5150), // Adjusted from 6900ms
      
      // Set light theme background at the same time
      setTimeout(() => setLightTheme(true), 5150), // Adjusted from 6900ms
      
      // Show theme toggle immediately after glassmorphism
      setTimeout(() => {
        setShowToggle(true);
        console.log("Toggle button should be visible now");
      }, 5250), // Adjusted from 7000ms
      
      // Show the navigation items AFTER JT Lab has moved to header position
      setTimeout(() => {
        setShowJT(true); // Show nav items
      }, 5450), // Adjusted from 7200ms
      
      // SINGLE INITIAL BULLET ANIMATION - only run once
      setTimeout(() => {
        // Make sure to set the border visible first
        setHeaderBorderVisible(true);
        
        // Only trigger the bullet animation if it's not already in progress
        if (!bulletAnimationInProgress) {
          setBulletAnimationInProgress(true);
          
          // Reset state for both bullets to ensure clean state
          setAnimateLightBullet(false);
          setAnimateDarkBullet(false);
          
          // Trigger only the light bullet for initial animation
          initialBulletTimer = setTimeout(() => {
            setAnimateLightBullet(true);
            
            // Reset light bullet after animation completes
            setTimeout(() => {
              setAnimateLightBullet(false);
              setBulletAnimationInProgress(false);
            }, 1200);
          }, 50);
        }
      }, 5550), // Adjusted from 7300ms
      
      // Apply the header glow effect - single glowburst first, then continuous
      setTimeout(() => {
        // Full strength burst
        setCurrentGlowLevel('full');
        
        // Switch to continuous glow after the burst
        setTimeout(() => {
          continuousGlowCleanup = startContinuousGlow();
        }, 2000);
      }, 6550), // Adjusted from 8300ms
      
      // No need for a separate retreat image event since we're doing it with the header transition
      // The code for this is moved up to the slideToHeader event
      
      setTimeout(onComplete, 7350), // Adjusted from 9100ms - total animation is now faster
    ];
    
    // Make sure to clean up all timers and interval
    return () => {
      timers.forEach(clearTimeout);
      if (initialBulletTimer) clearTimeout(initialBulletTimer);
      if (continuousGlowCleanup) continuousGlowCleanup();
    };
  }, [onComplete, bulletAnimationInProgress, windowWidth]);

  // On retract, blur & calc T offset
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
  
  // Log animation events for debugging
  useEffect(() => {
    console.log("Animation state changed - JulioTompsett:", showJulioTompsett, "Image:", imageVisible, "Subtitle:", showSubtitle);
  }, [showJulioTompsett, imageVisible, showSubtitle]);

  // No longer using the individual letter animation - to match Web Dev fade style
  const renderInitial = () => (
    <NameWrapper
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: showJulioTompsett ? 1 : 0,
        color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
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

  // Modified retraction animation to include the J
  const renderRetract = () => (
    <NameWrapper
      animate={{ opacity: hideRetractedJT ? 0 : 1 }}
      transition={{ opacity: { duration: 0.8, ease: "easeOut" } }}
    >
      {/* All letters fade out with staggered animation, including J */}
      {name.split("").map((c, i) => {
        return (
          <Letter 
            key={`letter-${i}`}
            initial={{ x: 0, opacity: 1 }}
            animate={{ 
              // All characters including J will now retract
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
        );
      })}
    </NameWrapper>
  );

  // Simplified handleScrambleComplete function
  const handleScrambleComplete = () => {
    console.log("[Animation] Scramble complete at:", Date.now());
    setScrambleComplete(true);
    
    // Start scrambling the subtitle text at the same time
    setScrambleSubtitleText(true);
    
    // Immediately show the JT Lab text after scrambling completes
    setShowSubtitle(false); // Hide the original subtitle
    setMainJTLabText(true); // Show our persistent JT Lab text
    setBlur("none");
    
    // Add a 200ms delay before applying the power glow burst (increased from 100ms)
    setTimeout(() => {
      // Apply power glow burst after a slight delay when JT Lab appears
      console.log("[Animation] Applying power glow after delay at:", Date.now());
      setCurrentGlowLevel('power');
      
      // Force a reapplication of the power glow to ensure it's noticed
      setTimeout(() => {
        setCurrentGlowLevel('power');
      }, 20);
      
      // After the power glow burst, switch to continuous glow for JT Lab
      setTimeout(() => {
        console.log("[Animation] Switching to continuous glow at:", Date.now());
        setCurrentGlowLevel('continuous');
        setContinuousGlowingActive(true);
      }, 2000);
    }, 200); // Increased to 200ms delay before applying the glow
  };

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
        {/* Modified border to use headerBorderVisible state */}
        <HeaderBorder show={headerBorderVisible} darkMode={darkMode} />
        {/* Modified bullets to use animation states */}
        <HeaderBullet animate={animateLightBullet} />
        <DarkModeBullet animate={animateDarkBullet} />
      </HeaderContainer>
      
      {/* Profile image with slide-in from bottom effect and bounce */}
      <ProfileImage 
        src="/ja_left.png" 
        alt="Profile" 
        initial={{ 
          opacity: 0,
          y: "100vh" // Start from below the viewport
        }}
        animate={{ 
          opacity: retreatImage ? 0 : (imageVisible ? 1 : 0),
          y: retreatImage ? 0 : (imageVisible ? 0 : "100vh") // Controlled by imageVisible state
        }}
        transition={{ 
          opacity: retreatImage 
            ? { duration: 1.2, ease: "easeIn" } 
            : { duration: 1, ease: "easeOut" },
          y: { 
            duration: 1.5, // Faster slide-in (was 2.5)
            ease: imageVisible ? [0.215, 0.61, 0.355, 1.2] : "easeOut" // Bounce effect with custom cubic bezier
          }
        }}
      />
      
      {/* JulioTompsett or retract */}
      <LogoWrapper
        blur={blur}
        initial={{ opacity:0 }}
        animate={{ 
          opacity: hideRetractedJT ? 0 : 1,
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
      </LogoWrapper>

      {/* Web Development subtitle - use CenteredTextContainer for consistent positioning */}
      {showSubtitle && !startScramble && (
        <>
          <CenteredTextContainer>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: fadeOutSubtitle ? 0 : 1,
                color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
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
          
          {/* Subtitle text below Web Dev with wind sweep effect */}
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
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                }}
                transition={{ 
                  opacity: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] },
                  x: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }, // Custom ease for wind effect
                  skewX: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                  letterSpacing: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
                  color: { duration: 0.4 }
                }}
                style={{
                  fontWeight: 400, // Set to 400
                  fontSize: windowWidth <= 768 ? "1.1rem" : "1.2rem", // Updated to 1.3rem
                  display: "inline-block" // Important for letter-spacing animation
                }}
              >
                Crafting Custom Websites: Business, E-commerce, Portfolios & More
              </motion.div>
            </SubtitleTextContainer>
          )}
        </>
      )}

      {/* Text morphing - use CenteredTextContainer for consistent positioning */}
      {startScramble && !scrambleComplete && (
        <>
          <CenteredTextContainer>
            {/* Fixed - Use the correct ScrambleText properties matching the interface */}
            <ScrambleText 
              startText="Web Dev."
              endText="JT Lab"
              duration={1000} // Reduced from 1500ms to 1000ms
              color={darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}
              fontSize={windowWidth <= 768 ? "8rem" : "12rem"}
              onComplete={handleScrambleComplete}
            />
          </CenteredTextContainer>
          
          {/* Subtitle text that will also scramble */}
          <SubtitleTextContainer>
            <ScrambleText 
              startText="Crafting Custom Websites: Business, E-commerce, Portfolios & More"
              endText="Landing Sites | SPA | PWA | Web | Mobile Optimized"
              duration={1000} // Reduced from 1500ms to 1000ms
              color={darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'}
              fontSize={windowWidth <= 768 ? "1.1rem" : "1.2rem"} // Updated to 1.3rem
              style={{ fontWeight: 400 }} // Set to 400
              // No onComplete needed for this one
            />
          </SubtitleTextContainer>
        </>
      )}

      {/* JT Lab in center position - use CenteredTextContainer for consistent positioning */}
      {mainJTLabText && !slideToHeader && (
        <>
          <CenteredTextContainer>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                color: darkMode ? '#fff' : '#000'  // Changed from rgba to solid color
              }}
              transition={{ opacity: { duration: 0.2 } }}
              style={{
                fontFamily: "Cal Sans, sans-serif",
                fontSize: windowWidth <= 768 ? "8rem" : "12rem",
                fontWeight: "bold",
                textShadow: currentGlowLevel === 'power' 
                  ? "0 0 30px rgba(132,227,215, 1.0), 0 0 60px rgba(132,227,215, 1.0), 0 0 90px rgba(132,227,215, 0.9), 0 0 120px rgba(132,227,215, 0.8)"
                  : "0 0 10px rgba(132,227,215, 0.8), 0 0 20px rgba(132,227,215, 0.6), 0 0 30px rgba(132,227,215, 0.4)",  // Enhanced glow
                WebkitTextFillColor: darkMode ? 'white' : 'black',  // Added for crisp text
                WebkitTextStroke: '0.5px ' + (darkMode ? 'white' : 'black'),  // Added for crisp outline
                transition: "color 0.3s ease-in-out, text-shadow 0.3s ease-in-out"
              }}
            >
              JT Lab
            </motion.div>
          </CenteredTextContainer>
          
          {/* Subtitle text for JT Lab */}
          <SubtitleTextContainer>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
              }}
              transition={{ opacity: { duration: 0.2 } }}
              style={{
                fontWeight: 400, // Set to 400
                fontSize: windowWidth <= 768 ? "1.1rem" : "1.3rem" // Updated to 1.3rem
              }}
            >
              Landing Sites | SPA | PWA | Web | Mobile Optimized
            </motion.div>
          </SubtitleTextContainer>
        </>
      )}

      {/* JT Lab in header position - animate from center position */}
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
              // Always apply at least a minimal glow, with enhanced versions based on state
              textShadow: currentGlowLevel === 'power'
                ? "0 0 30px rgba(132,227,215, 1.0), 0 0 60px rgba(132,227,215, 1.0), 0 0 90px rgba(132,227,215, 0.9), 0 0 120px rgba(132,227,215, 0.8)"
                : (currentGlowLevel === 'full'
                  ? "0 0 10px rgba(132,227,215, 0.8), 0 0 20px rgba(132,227,215, 0.6), 0 0 30px rgba(132,227,215, 0.4)"
                  : (currentGlowLevel === 'continuous' 
                    ? "0 0 8px rgba(132,227,215, 0.5), 0 0 12px rgba(132,227,215, 0.4), 0 0 16px rgba(132,227,215, 0.3)"
                    : "0 0 5px rgba(132,227,215, 0.3), 0 0 10px rgba(132,227,215, 0.2)")), // Minimal fallback glow
              transition: "color 0.3s ease-in-out, text-shadow 0.3s ease-in-out",
              WebkitTextFillColor: darkMode ? 'white' : 'black', // Ensure solid fill color
              WebkitTextStroke: '0.5px ' + (darkMode ? 'white' : 'black'), // Thinner stroke for header size
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            JT Lab
          </motion.div>
          
          {/* The subtitle text fades out when moving to header */}
          <motion.div
            initial={{ 
              position: "fixed",
              top: "calc(40% + 9vh)", // Increased by 1vh to match the new spacing
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
              fontSize: windowWidth <= 768 ? "1.1rem" : "1.3rem", // Updated to 1.3rem
              fontWeight: 400, // Set to 400
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
              textAlign: "center",
              maxWidth: "90%"
            }}
          >
            Landing Sites | SPA | PWA | Web | Mobile Optimized
          </motion.div>
        </>
      )}

      {/* Modified Header - does NOT include JT Lab text since it's handled separately */}
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