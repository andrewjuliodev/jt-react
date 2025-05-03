// src/App.tsx
import React, { useState } from 'react';
import IntroAnimation from './components/animations/IntroAnimation';
import GlobalStyle from './styles/GlobalStyle';

const App: React.FC = () => {
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <>
      <GlobalStyle />
      <div style={{ width: '100vw', height: '100vh' }}>
        <IntroAnimation onComplete={() => setAnimationComplete(true)} />
      </div>
    </>
  );
};

export default App;
