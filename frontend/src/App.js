import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WhatIsCamber from './components/WhatIsCamber';
import WhyCamber from './components/WhyCamber';
import FeaturesSection from './components/FeaturesSection';
import HowCamberWorks from './components/HowCamberWorks';
import LearningJourney from './components/LearningJourney';
import OurValues from './components/OurValues';
import WhoIsCamberFor from './components/WhoIsCamberFor';
import FAQSection from './components/FAQSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import './App.css';

function normalizeRoute(pathname) {
  const clean = (pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/login' || clean === '/signin') return '/login';
  if (clean === '/signup' || clean === '/register') return '/signup';
  return '/';
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(() =>
    normalizeRoute(window.location.pathname)
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(normalizeRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    const normalized = normalizeRoute(path);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentRoute(normalized);
    if (typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        // Fallback for environments lacking smooth scrollTo support
      }
    }
  };

  // Route 2: /login — Integrated Sign In Page
  if (currentRoute === '/login') {
    return <Login onNavigate={navigate} />;
  }

  // Route 3: /signup — Integrated Sign Up Page
  if (currentRoute === '/signup') {
    return <Signup onNavigate={navigate} />;
  }

  // Route 1: / — Original CAMBER Landing Page
  return (
    <div className="camber-app">
      {/* Top pastel blue navigation bar */}
      <Navbar onNavigate={navigate} />

      {/* Main landing content */}
      <main>
        {/* Section 1: Hero / Home */}
        <HeroSection onNavigate={navigate} />

        {/* Section 2: What is Camber? */}
        <WhatIsCamber />

        {/* Section 3: Why Camber? */}
        <WhyCamber />

        {/* Section 4: Features */}
        <FeaturesSection />

        {/* Section 5: How Camber Works */}
        <HowCamberWorks />

        {/* Section 6: Learning can be a journey */}
        <LearningJourney />

        {/* Section 7: Our Values */}
        <OurValues />

        {/* Section 8: Who is Camber for? */}
        <WhoIsCamberFor />

        {/* Section 9: Frequently Asked Questions */}
        <FAQSection />

        {/* Section 10: Final Call to Action */}
        <FinalCTA onNavigate={navigate} />
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
