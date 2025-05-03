// src/App.tsx
import React, { useState, useEffect } from 'react';
import IntroAnimation from './components/animations/IntroAnimation';
import Navbar from './components/layout/Navbar';
import GlobalStyle from './styles/GlobalStyle';

const App: React.FC = () => {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <>
      <GlobalStyle />
      <div style={{ width: '100vw', height: '100vh' }}>
        <IntroAnimation onComplete={() => setAnimationComplete(true)} />
        {animationComplete && <Navbar />}
      </div>
    </>
  );
};

export default App;
