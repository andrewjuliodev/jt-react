// src/components/animations/IntroAnimation.tsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface IntroAnimationProps {
  onComplete: () => void;
}

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  padding-left: 10vw;
  display: flex;
  align-items: center;      // vertical centering
  justify-content: flex-start; // left alignment
  background: #fff;
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
  font-size: 4.5rem;
  font-weight: bold;
  color: #000;
  position: relative;
  z-index: 1; // Allow layering

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

const Space = styled.span`
  display: inline-block;
  width: 0.3em;
`;

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const name = 'JulioTompsett';
  const [retract, setRetract] = useState(false);
  const [showJT, setShowJT] = useState(false);
  const [tOffset, setTOffset] = useState(0);
  const [textPosition, setTextPosition] = useState<{ top: string, left: string }>({ top: '50%', left: '10vw' });

  const jRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setRetract(true), 2500),
      setTimeout(() => setShowJT(true), 3000),
      setTimeout(onComplete, 6200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    if (retract) {
      const tIdx = name.indexOf('T');
      const jEl = jRef.current;
      const tEl = lettersRef.current[tIdx];
      if (jEl && tEl) {
        const jRect = jEl.getBoundingClientRect();
        const tRect = tEl.getBoundingClientRect();
        setTOffset(jRect.right - tRect.left);
        setTextPosition({
          top: `${jRect.top + window.scrollY}px`,
          left: `${jRect.left + window.scrollX}px`,
        });
      }
    }
  }, [retract, name]);

  const renderInitial = () => (
    <>
      {name.split('').map((char, i) => (
        <Letter
          key={i}
          ref={el => {
            if (i === 0) jRef.current = el;
            lettersRef.current[i] = el!;
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: i * 0.08
          }}
        >
          {char}
        </Letter>
      ))}
    </>
  );

  const renderRetract = () => (
    <>
      {name.split('').map((char, i) => {
        if (i === 0) {
          return (
            <Letter
              key={i}
              ref={el => { jRef.current = el; lettersRef.current[i] = el!; }}
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
              ref={el => { lettersRef.current[i] = el!; }}
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
            transition={{ x: { duration: 0.6, delay: i * 0.04 }, opacity: { duration: 0.4, delay: i * 0.04 } }}
          >
            {char}
          </Letter>
        );
      })}
    </>
  );

  const renderJTStudio = () => (
    <TextWrapper
      style={{
        position: 'absolute',
        top: textPosition.top, // Keep "JT Studio" aligned at the position of the original text
        left: textPosition.left, // Match the left offset of "Julio Tompsett"
        zIndex: 2, // Keep it on top of the retracted JT
      }}
    >
      <Letter
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} // JT fades in
        transition={{ duration: 0.8 }}
      >
        J
      </Letter>
      <Letter
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} // T fades in
        transition={{ duration: 0.8 }}
      >
        T
      </Letter>
      <Space />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} // Studio fades in smoothly
        transition={{ duration: 1.6 }}
        style={{ letterSpacing: '0.03em' }} // Slight gap between letters
      >
        Studio
      </motion.span>
    </TextWrapper>
  );

  return (
    <Container>
      <TextWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {!retract && !showJT && renderInitial()}
        {retract && !showJT && renderRetract()}
      </TextWrapper>

      {showJT && renderJTStudio()}
    </Container>
  );
};

export default IntroAnimation;
