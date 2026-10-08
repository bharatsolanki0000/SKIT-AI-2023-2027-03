import React from 'react';
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
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
