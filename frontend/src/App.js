import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhatIsCamber from './components/WhatIsCamber';
import WhyCamber from './components/WhyCamber';
import './App.css';

function App() {
  return (
    <div className="camber-app">
      {/* Top pastel blue navigation bar */}
      <Navbar />

      {/* Main landing content */}
      <main>
        {/* Section 1: Hero / Home */}
        <HeroSection />

        {/* Section 2: What is Camber? */}
        <WhatIsCamber />

        {/* Section 3: Why Camber? */}
        <WhyCamber />
      </main>
    </div>
  );
}

export default App;

