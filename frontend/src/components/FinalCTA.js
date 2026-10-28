import React from 'react';
import ctaSquirrelImg from '../assets/cta-squirrel.png';
import { DaisyFlower, ButtercupFlower } from './BotanicalAccents';

export default function FinalCTA({ onNavigate }) {
  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate('/signup');
    } else {
      const heroEl = document.querySelector('#home');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.history.pushState({}, '', '/signup');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  return (
    <section className="final-cta-section" aria-label="Call to Action">
      <div className="final-cta-container">
        {/* Left: Cute Mascot holding flower in the meadow */}
        <div className="cta-mascot-wrapper">
          <img
            src={ctaSquirrelImg}
            alt="Camber squirrel mascot holding a blooming flower in a grassy field"
            className="cta-mascot-img"
          />
        </div>

        {/* Center: Headings & Call to Action Button */}
        <div className="cta-content-wrapper">
          <h2 className="cta-heading">Ready to grow your ideas?</h2>
          <p className="cta-subtext">Start your journey with Camber.</p>
          <button
            type="button"
            className="btn-cta-start"
            onClick={handleGetStarted}
          >
            Get Started <span className="cta-arrow" aria-hidden="true">&rarr;</span>
          </button>
        </div>

        {/* Right: Meadow Wildflowers & Floral Accents */}
        <div className="cta-flowers-right" aria-hidden="true">
          <DaisyFlower size={26} />
          <ButtercupFlower size={24} style={{ marginLeft: 8 }} />
        </div>
      </div>
    </section>
  );
}
