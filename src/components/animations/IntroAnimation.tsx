// src/components/animations/IntroAnimation.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const Text = styled.div`
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

const Space = styled.span`
  display: inline-block;
  width: 0.3em;
`;

const StudioLetter = styled(motion.span)`
  display: inline-block;
`;

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [retract, setRetract] = useState(false);
  const [showJT, setShowJT] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  const [isFading, setIsFading] = useState(false);
  
  const name = 'JulioTompsett';
  const studioWord = 'Studio';
  
  useEffect(() => {
    // Initial visibility
    const timer1 = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Start retraction after 2 seconds of display
    const timer2 = setTimeout(() => {
      setRetract(true);
    }, 500 + 2000);
    
    // Show JT when retraction is complete
    const timer3 = setTimeout(() => {
      setShowJT(true);
    }, 500 + 2000 + 1500);
    
    // Show Studio after JT is formed
    const timer4 = setTimeout(() => {
      setShowStudio(true);
    }, 500 + 2000 + 1500 + 300);
    
    // Fade everything out
    const timer5 = setTimeout(() => {
      setIsFading(true);
    }, 500 + 2000 + 1500 + 300 + 1500);
    
    // Complete animation
    const timer6 = setTimeout(() => {
      onComplete();
    }, 500 + 2000 + 1500 + 300 + 1500 + 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [onComplete]);
  
  // Find the index of 'T' in the name
  const tIndex = name.indexOf('T');
  
  // Calculate the exact position T should move to - right next to J
  const calculateTPosition = () => {
    // We want T to be positioned right after J, not overlapping
    return -(tIndex - 1) * 20; // This puts T right after J
  };
  
  const renderInitialName = () => {
    return name.split('').map((char, index) => {
      // The letter J always stays in place
      if (index === 0) {
        return (
          <Letter 
            key={`char-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {char}
          </Letter>
        );
      }
      
      // The letter T moves to join J
      if (char === 'T') {
        return (
          <Letter
            key={`char-${index}`}
            initial={{ opacity: 0, x: 0 }}
            animate={{ 
              opacity: 1,
              x: retract ? calculateTPosition() : 0 
            }}
            transition={{ 
              opacity: { duration: 0.5 },
              x: { duration: 1.2, delay: 0.1 } 
            }}
          >
            {char}
          </Letter>
        );
      }
      
      // All other letters fade in and then retract/disappear
      return (
        <Letter
          key={`char-${index}`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: retract ? 0 : 1,
            x: retract ? -index * 20 : 0 
          }}
          transition={{ 
            opacity: { duration: 0.5, delay: retract ? index * 0.05 : 0 },
            x: { duration: 0.8, delay: index * 0.05 } 
          }}
        >
          {char}
        </Letter>
      );
    });
  };
  
  const renderJTStudio = () => {
    return (
      <>
        {/* J */}
        <Letter
          initial={{ opacity: 1 }}
          animate={{ opacity: isFading ? 0 : 1 }}
          transition={{ duration: 0.8 }}
        >
          J
        </Letter>
        
        {/* T */}
        <Letter
          initial={{ opacity: 1 }}
          animate={{ opacity: isFading ? 0 : 1 }}
          transition={{ duration: 0.8 }}
        >
          T
        </Letter>
        
        {/* Space */}
        <Space />
        
        {/* Studio */}
        {studioWord.split('').map((char, index) => (
          <StudioLetter
            key={`studio-${index}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: showStudio ? (isFading ? 0 : 1) : 0,
              x: showStudio ? 0 : 20 
            }}
            transition={{ 
              opacity: { duration: 0.5, delay: index * 0.1 },
              x: { duration: 0.5, delay: index * 0.1 } 
            }}
          >
            {char}
          </StudioLetter>
        ))}
      </>
    );
  };
  
  return (
    <Container>
      <Text>
        {!showJT ? renderInitialName() : renderJTStudio()}
      </Text>
    </Container>
  );
};

export default IntroAnimation;