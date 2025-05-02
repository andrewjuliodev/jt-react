import React, { useState, useEffect } from 'react';
import IntroAnimation from './components/animations/IntroAnimation';
import Navbar from './components/layout/Navbar';
import GlobalStyle from './styles/GlobalStyle';

const App: React.FC = () => {
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);

  useEffect(() => {
    // For development purposes, you can set this to true to skip the animation
    // setAnimationComplete(true);
  }, []);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <>
      <GlobalStyle />
      {!animationComplete ? (
        <IntroAnimation onComplete={handleAnimationComplete} />
      ) : (
        <Navbar />
      )}
    </>
  );
};

export default App;
