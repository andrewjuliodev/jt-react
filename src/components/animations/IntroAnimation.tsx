// src/components/animations/IntroAnimation.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';

interface IntroAnimationProps {
  onComplete: () => void;
}

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #fff;
  overflow: hidden;
`;

const ProfileImage = styled(motion.img)`
  position: absolute;
  bottom: 0;
  right: 0;
  width: auto;
  height: 90vh;
  z-index: 1;
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

const TextWrapper = styled(motion.div)<{ blur?: string; fontSize?: string }>`
  position: absolute;
  display: inline-flex;
  font-family: "Cal Sans", sans-serif;
  font-size: ${props => props.fontSize || "4.5rem"};
  font-weight: bold;
  color: #000;
  filter: ${({ blur }) => blur || "none"};
  z-index: 1;
  white-space: nowrap;
  transition: font-size 0.8s ease-in-out;
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
  transition: top 0.8s ease-in-out;
`;

const NavList = styled.ul`
  display: flex;
  gap: 3rem;
  list-style: none;
  margin: 0;
  padding: 0;
  font-family: "Montserrat", sans-serif;
  font-weight: 200;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.25rem;
  transition: text-shadow 0.3s ease;
  
  &:hover {
    animation: ${css`${glowBurst} 1s ease-out infinite`};
  }
`;

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const name = "JulioTompsett's";
  const [retract, setRetract] = useState(false);
  const [showJT, setShowJT] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [fadeOutSubtitle, setFadeOutSubtitle] = useState(false);
  const [retreatImage, setRetreatImage] = useState(false);
  const [slideToHeader, setSlideToHeader] = useState(false);
  const [hideRetractedJT, setHideRetractedJT] = useState(false);
  const [tOffset, setTOffset] = useState(0);
  const [blur, setBlur] = useState<"none"|"blur(5px)">("none");
  const [textPos, setTextPos] = useState<{ top: string; left: string }>({
    top: "50%",
    left: "10%",
  });

  const jRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  // 1) Compute left offset once
  const leftOffset = window.innerWidth * 0.1 + "px";

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
      setTimeout(onComplete, 7000),
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
  }, [retract]);

  // render initial letters
  const renderInitial = () =>
    name.split("").map((c,i) => (
      <Letter key={i}
        ref={el => {
          if (i===0) jRef.current = el!;
          lettersRef.current[i] = el!;
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
    <Container>
      {/* Profile image in bottom right - slides in immediately, retreats to right when triggered */}
      <ProfileImage 
        src="/ja_left.png" 
        alt="Profile" 
        initial={{ y: "100%" }}
        animate={{ 
          y: 0,
          x: retreatImage ? "100vw" : 0,
          opacity: retreatImage ? 0 : 1
        }}
        transition={{ 
          y: { duration: 2, ease: "easeOut", delay: 0.2 },
          x: { duration: 1.2, ease: "easeIn" },
          opacity: { duration: 1, ease: "easeIn" }
        }}
      />
      
      {/* JulioTompsett or retract */}
      {!hideRetractedJT && (
        <TextWrapper
          blur={blur}
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ duration:0.6 }}
          style={{
            top: textPos.top,
            left: leftOffset,
            transform: "translateY(-50%)"
          }}
        >
          {!retract && !showJT ? renderInitial() : renderRetract()}
        </TextWrapper>
      )}

      {/* Web Development subtitle */}
      {showSubtitle && (
        <SubtitleText
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeOutSubtitle ? 0 : 1 }}
          transition={{ 
            opacity: { duration: 1.5, ease: "easeInOut" }
          }}
          style={{
            top: "calc(50% + 120px)", // Added vertical gap
          }}
        >
          Web Dev.
        </SubtitleText>
      )}

      {/* JT Studio */}
      {showJT && (
        <TextWrapper
          blur="none"
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ opacity: { duration: 1 } }}
          fontSize={slideToHeader ? "2.2rem" : "4.5rem"}
          style={{
            top: slideToHeader ? "60px" : textPos.top,
            left: leftOffset,
            transform: "translateY(-50%)",
            zIndex: 2,
            transition: "top 0.8s ease-in-out, font-size 0.8s ease-in-out"
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
        <Header style={{ top: slideToHeader ? "60px" : textPos.top }}>
          <NavList>
            <NavItem><NavLink href="#services">Services</NavLink></NavItem>
            <NavItem><NavLink href="#portfolio">Portfolio</NavLink></NavItem>
            <NavItem><NavLink href="#contact">Contact</NavLink></NavItem>
            <NavItem><NavLink href="#about">About</NavLink></NavItem>
          </NavList>
        </Header>
      )}
    </Container>
  );
};

export default IntroAnimation;