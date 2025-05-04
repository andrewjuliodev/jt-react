// src/components/animations/IntroAnimation.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';

interface IntroAnimationProps {
  onComplete: () => void;
}

// Position correction constants
const VERTICAL_ADJUSTMENT_TITLE = "-30vh"; // For JulioTompsett and JT Studio
const VERTICAL_ADJUSTMENT_SUBTITLE = "-25vh"; // For Web Dev text

// Full strength glow burst (100%)
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

// 50% strength continuous glow burst (final state)
const continuousGlowBurst = keyframes`
  0% {
    text-shadow:
      0 0 5px rgb(132,227,215),
      0 0 7px rgb(132,227,215);
  }
  50% {
    text-shadow:
      0 0 10px rgb(132,227,215),
      0 0 20px rgb(132,227,215),
      0 0 30px rgb(132,227,215);
  }
  100% {
    text-shadow:
      0 0 5px rgb(132,227,215),
      0 0 7px rgb(132,227,215);
  }
`;

// Function to apply hover glow effect for JT Studio logo
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
  left: calc(50% + 5vw); /* Center the image on the x-axis + move 5vw right */
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
  z-index: 998;
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

// Custom hover styles for the JT Studio logo with direct CSS
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
  transition: font-size 0.8s ease-in-out, color 0.8s ease-in-out;
  
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

const NameWrapper = styled(motion.div)`
  display: flex;
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
  transition: color 0.4s ease-in-out; /* Make color transition faster and smoother */
  
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

// Updated to support simplified glow system with hover effect
const GlowingStudioText = styled(motion.span)<{ 
  glowLevel?: 'full' | 'continuous'; 
}>`
  letter-spacing: 0.03em;
  animation: ${props => {
    if (props.glowLevel === 'full') return css`${glowBurst} 2s ease-out forwards`;
    if (props.glowLevel === 'continuous') return css`${continuousGlowBurst} 3s ease-in-out infinite`;
    return 'none';
  }};
  ${logoHoverGlow}
`;

// Updated to support simplified glow system with hover effect
const GlowingLetter = styled(motion.span)<{ 
  glowLevel?: 'full' | 'continuous';
}>`
  animation: ${props => {
    if (props.glowLevel === 'full') return css`${glowBurst} 2s ease-out forwards`;
    if (props.glowLevel === 'continuous') return css`${continuousGlowBurst} 3s ease-in-out infinite`;
    return 'none';
  }};
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
`;

const NavList = styled.ul<{ mobileMenuOpen?: boolean; darkMode?: boolean }>`
  display: flex;
  gap: 3rem;
  list-style: none;
  margin: 0;
  padding: 0;
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
  const [showJulioTompsett, setShowJulioTompsett] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  
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
    left: "10%",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Simplified glow state management
  const [currentGlowLevel, setCurrentGlowLevel] = useState<'full' | 'continuous' | undefined>(undefined);
  const [subtleGlow, setSubtleGlow] = useState(false);
  const [themeToggled, setThemeToggled] = useState(false);
  
  // Track if continuous glowing is active
  const [continuousGlowingActive, setContinuousGlowingActive] = useState(false);

  const jRef = useRef<HTMLSpanElement>(null);
  const webDevRef = useRef<HTMLDivElement | null>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  
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

  // Compute left offset once
  const leftOffset = window.innerWidth * 0.1 + "px";

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

  // Toggle dark mode with simple direct implementation
  const toggleTheme = () => {
    console.log("Theme toggle clicked, current dark mode:", darkMode);
    
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
    
    // Reset glow effect then apply new one
    setCurrentGlowLevel(undefined);
    
    setTimeout(() => {
      setCurrentGlowLevel('full');
      
      setTimeout(() => {
        setCurrentGlowLevel('continuous');
        setContinuousGlowingActive(true);
      }, 2000);
    }, 500);
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
          left: "10%"
        });
      } else {
        // Default positioning for larger screens - lower position
        setTextPos({
          top: `calc(50% + ${VERTICAL_ADJUSTMENT_TITLE})`, // Adjusted for desktop
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

  // Add the image appearance to the animation sequence
  useEffect(() => {
    // Show the image at the same time as JulioTompsett text (synchronized)
    const imageTimer = setTimeout(() => {
      setImageVisible(true);
    }, 1000); // Changed to match the subtitle timing (was 2800)
    
    return () => clearTimeout(imageTimer);
  }, []);

  // Run the timing for intro animation with delayed JulioTompsett
  useEffect(() => {
    // Track initial animation bullet timer to avoid conflicts
    let initialBulletTimer: NodeJS.Timeout;
    
    // Track continuous glow cleanup
    let continuousGlowCleanup: (() => void) | undefined;
    
    const timers = [
      // First show the Web Dev subtitle AND JulioTompsett together
      setTimeout(() => {
        setShowSubtitle(true);
        setShowJulioTompsett(true); // Set this at the same time as subtitle
      }, 1000),
      
      // Retract after the name has fully appeared (keep the same timing)
      setTimeout(() => setRetract(true), 5000), 
      
      // Show JT Studio
      setTimeout(() => {
        setShowJT(true);
        setBlur("none");
        
        // Initial JT Studio glow burst right when it appears
        setCurrentGlowLevel('full');
        
        // After the glow burst, switch to continuous glow for JT
        setTimeout(() => {
          // After initial burst, use continuous glow until header phase
          if (!slideToHeader) {
            setCurrentGlowLevel('continuous');
            setContinuousGlowingActive(true);
          }
        }, 2000);
      }, 5500),
      
      setTimeout(() => setHideRetractedJT(true), 6000), // Hide the retracted JT
      
      // Start retreat of image when moving to header
      setTimeout(() => setSlideToHeader(true), 6500), // Moving to header
      
      // Apply glassmorphism as the header animation starts
      setTimeout(() => setGlassmorphism(true), 6800),
      
      // Set light theme background at the same time
      setTimeout(() => setLightTheme(true), 6800),
      
      // Show theme toggle immediately after glassomorphism
      // IMPORTANT: Make sure toggle is visible earlier in the sequence
      setTimeout(() => {
        setShowToggle(true);
        console.log("Toggle button should be visible now");
      }, 6900),
      
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
      }, 7200),
      
      // Apply the header glow effect - single glowburst first, then continuous
      setTimeout(() => {
        // Full strength burst
        setCurrentGlowLevel('full');
        
        // Switch to continuous glow after the burst
        setTimeout(() => {
          continuousGlowCleanup = startContinuousGlow();
        }, 2000);
      }, 8200),
      
      // Fade out the image and Web Dev text AFTER header animation is complete
      setTimeout(() => {
        setFadeOutSubtitle(true);
        setRetreatImage(true);
      }, 8500),
      
      setTimeout(onComplete, 9000),
    ];
    
    // Make sure to clean up all timers and interval
    return () => {
      timers.forEach(clearTimeout);
      if (initialBulletTimer) clearTimeout(initialBulletTimer);
      if (continuousGlowCleanup) continuousGlowCleanup();
    };
  }, [onComplete, bulletAnimationInProgress]);

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
      {!hideRetractedJT && (
        <LogoWrapper
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
        </LogoWrapper>
      )}

      {/* Web Development subtitle - no glow effect */}
      {showSubtitle && (
        <SubtitleText
          ref={(el) => { webDevRef.current = el; }}
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
            top: windowWidth <= 768 
              ? `calc(35% + ${VERTICAL_ADJUSTMENT_SUBTITLE})` 
              : `calc(50% + ${VERTICAL_ADJUSTMENT_SUBTITLE})`, // Using subtitle vertical adjustment
            transition: "color 0.4s ease-in-out"
          }}
        >
          Web Dev.
        </SubtitleText>
      )}

      {/* JT Studio - Logo with hover effect */}
      {showJT && (
        <LogoWrapper
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
          isInHeader={slideToHeader}
          style={{
            top: slideToHeader ? "30px" : textPos.top,
            left: leftOffset,
            transform: "translateY(-50%)",
            zIndex: 999, // Ensure logo is above all other elements
            transition: "top 0.8s ease-in-out, font-size 0.8s ease-in-out, color 0.8s ease-in-out",
            cursor: slideToHeader ? "pointer" : "default" // Add cursor pointer when in header
          }}
        >
          <GlowingLetter 
            initial={{opacity:0}} 
            animate={{opacity:1}} 
            transition={{duration:0.8}}
            glowLevel={currentGlowLevel}
          >J</GlowingLetter>
          <GlowingLetter 
            initial={{opacity:0}} 
            animate={{opacity:1}} 
            transition={{duration:0.8}}
            glowLevel={currentGlowLevel}
          >T</GlowingLetter>
          <Space/>
          <GlowingStudioText 
            initial={{opacity:0}} 
            animate={{opacity:1}} 
            transition={{duration:1.6}}
            glowLevel={currentGlowLevel}
          >
            Studio
          </GlowingStudioText>
        </LogoWrapper>
      )}

      {/* Navbar uses same top + translateY */}
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