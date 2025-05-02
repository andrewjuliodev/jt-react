// src/components/animations/IntroAnimation.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface IntroAnimationProps {
  onComplete: () => void;
}

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  background: #fff;
  padding-left: 20%;
  overflow: hidden;

  @media (max-width: 768px) {
    padding-left: 10%;
  }

  @media (max-width: 480px) {
    padding-left: 5%;
  }
`;

const TextWrapper = styled(motion.div)`
  display: inline-flex;
  font-family: "Cal Sans", sans-serif;
  font-size: 3.5rem;
  font-weight: bold;
  color: #000;

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const Letter = styled(motion.span)`
  display: inline-block;
`;

const StudioLetter = styled(motion.span)`
  display: inline-block;
`;

const Space = styled.span`
  display: inline-block;
  width: 0.3em;
`;

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const name = 'JulioTompsett';
  const studioWord = 'Studio';

  const [retract, setRetract] = useState(false);
  const [showJT, setShowJT] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [tOffset, setTOffset] = useState(0);

  const jRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setRetract(true), 2500),        // start retract
      setTimeout(() => setShowJT(true), 4000),        // show JT
      setTimeout(() => setShowStudio(true), 4300),    // show Studio
      setTimeout(() => setIsFading(true), 5800),      // fade out
      setTimeout(onComplete, 6800),                   // complete
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // measure T offset when it's time to retract
  useEffect(() => {
    if (retract) {
      const tIdx = name.indexOf('T');
      const jEl = jRef.current;
      const tEl = lettersRef.current[tIdx];
      if (jEl && tEl) {
        const jRect = jEl.getBoundingClientRect();
        const tRect = tEl.getBoundingClientRect();
        setTOffset(jRect.right - tRect.left);
      }
    }
  }, [retract, name]);

  // Initial render: static letters
  const renderInitial = () => (
    <>
      {name.split('').map((char, i) => (
        <Letter
          key={i}
          ref={el => {
            if (i === 0) {
              jRef.current = el;
            }
            lettersRef.current[i] = el!;
          }}
          style={{ opacity: 1, x: 0 }}
        >
          {char}
        </Letter>
      ))}
    </>
  );

  // During retract: animate letters
  const renderRetract = () => (
    <>
      {name.split('').map((char, i) => {
        if (i === 0) {
          return (
            <Letter
              key={i}
              ref={el => {
                jRef.current = el;
                lettersRef.current[i] = el!;
              }}
              style={{ opacity: 1 }}
            >
              J
            </Letter>
          );
        }
        if (char === 'T') {
          return (
            <Letter
              key={i}
              ref={el => {
                lettersRef.current[i] = el!;
              }}
              initial={{ x: 0 }}
              animate={{ x: tOffset }}
              transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}
            >
              T
            </Letter>
          );
        }
        return (
          <Letter
            key={i}
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: `-${i}em`, opacity: 0 }}
            transition={{ x: { duration: 0.8, delay: i * 0.05 }, opacity: { duration: 0.5, delay: i * 0.05 } }}
          >
            {char}
          </Letter>
        );
      })}
    </>
  );

  const renderJTStudio = () => (
    <>
      <Letter initial={{ opacity: 1 }} animate={{ opacity: isFading ? 0 : 1 }} transition={{ duration: 0.8 }}>
        J
      </Letter>
      <Letter initial={{ opacity: 1 }} animate={{ opacity: isFading ? 0 : 1 }} transition={{ duration: 0.8 }}>
        T
      </Letter>
      <Space />
      {studioWord.split('').map((c, idx) => (
        <StudioLetter
          key={idx}
          initial={{ opacity: 0, x: '0.5em' }}
          animate={{ opacity: showStudio ? (isFading ? 0 : 1) : 0, x: showStudio ? 0 : '0.5em' }}
          transition={{ opacity: { duration: 0.5, delay: idx * 0.1 }, x: { duration: 0.5, delay: idx * 0.1 } }}
        >
          {c}
        </StudioLetter>
      ))}
    </>
  );

  return (
    <Container>
      <TextWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!retract && !showJT && renderInitial()}
        {retract && !showJT && renderRetract()}
        {showJT && renderJTStudio()}
      </TextWrapper>
    </Container>
  );
};

export default IntroAnimation;
