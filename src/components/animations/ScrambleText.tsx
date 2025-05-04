// ScrambleText.tsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ScrambleTextProps {
  startText: string;
  endText: string;
  duration: number; // Duration of scramble effect in ms
  className?: string;
  fontSize?: string;
  color?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

const TextContainer = styled(motion.div)`
  display: inline-block;
  white-space: nowrap;
  font-weight: bold;
`;

const ScrambleText: React.FC<ScrambleTextProps> = ({
  startText,
  endText,
  duration,
  className,
  fontSize,
  color,
  style,
  onComplete
}) => {
  const [text, setText] = useState(startText);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);
  
  // Characters to use for scrambling
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?';
  
  useEffect(() => {
    // Get the longer text to ensure all positions are filled
    const maxLength = Math.max(startText.length, endText.length);
    
    // Pad the texts to equal length
    const paddedStart = startText.padEnd(maxLength, ' ');
    const paddedEnd = endText.padEnd(maxLength, ' ');
    
    // Animation function
    const animate = (timestamp: number) => {
      // Initialize start time on first frame
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      
      // Calculate elapsed time
      const elapsed = timestamp - startTimeRef.current;
      
      // Calculate progress from 0 to 1
      const progress = Math.min(elapsed / duration, 1);
      
      // Different update rates based on progress
      // Update more frequently at the beginning and end, less in the middle
      const shouldUpdate = 
        frameCountRef.current % 2 === 0 || // Update every 2 frames
        progress < 0.2 || // Update more at the beginning
        progress > 0.8;   // Update more at the end
      
      if (shouldUpdate) {
        // Generate new text based on progress
        let newText = '';
        
        for (let i = 0; i < maxLength; i++) {
          // If the character is already at its final position, keep it
          if (paddedStart[i] === paddedEnd[i]) {
            newText += paddedEnd[i];
            continue;
          }
          
          // Beginning phase: keep more of the original text
          if (progress < 0.2) {
            newText += Math.random() < 1 - progress * 5 
              ? paddedStart[i] 
              : chars[Math.floor(Math.random() * chars.length)];
          }
          // Middle phase: max randomness
          else if (progress < 0.8) {
            // Start revealing final characters one by one
            if (i < (progress - 0.2) * maxLength / 0.6) {
              newText += paddedEnd[i];
            } else {
              newText += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          // End phase: reveal more of the final text
          else {
            newText += Math.random() < (progress - 0.8) * 5
              ? paddedEnd[i]
              : chars[Math.floor(Math.random() * chars.length)];
          }
        }
        
        setText(newText);
      }
      
      frameCountRef.current++;
      
      // Continue animation if not complete
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Make sure the final text is correct
        setText(endText);
        // Call the completion callback
        if (onComplete) onComplete();
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startText, endText, duration, chars, onComplete]);
  
  return (
    <TextContainer 
      className={className}
      style={{
        fontSize,
        color,
        ...style
      }}
    >
      {text}
    </TextContainer>
  );
};

export default ScrambleText;