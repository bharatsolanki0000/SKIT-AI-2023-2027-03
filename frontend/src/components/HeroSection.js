import React from 'react';
import heroWindowImg from '../assets/hero-window.png';
import { BotanicalSprig, FloatingLeaf } from './BotanicalAccents';
import TornDivider from './TornDivider';

export default function HeroSection() {
  const scrollToSection = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        {/* Left Column: Typography and Call to Actions */}
        <div className="hero-content">
          {/* Top subtle botanical sprig */}
          <div className="hero-sprig-top" aria-hidden="true">
            <BotanicalSprig size={34} color="#687e50" />
          </div>

          <h1 className="hero-heading">
            Good Ideas<br />
            Grow Here
          </h1>

          <p className="hero-subtext">
            A cozy space to learn, explore,<br className="break-desktop" />
            create and grow — at your own pace.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => scrollToSection('#what-is-camber')}
            >
              Get Started <span className="btn-dot" aria-hidden="true">•</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => scrollToSection('#why-camber')}
            >
              Explore Camber
            </button>
          </div>

          {/* Decorative floating leaf near bottom-left of hero */}
          <div className="hero-leaf-bottom" aria-hidden="true">
            <FloatingLeaf size={28} rotate={-18} color="#7b9360" />
          </div>
        </div>

        {/* Right Column: Cozy Study Window Composition */}
        <div className="hero-visual">
          <div className="hero-artwork-wrapper">
            <img
              src={heroWindowImg}
              alt="A cozy study room with a blue window looking out to a sunlit garden, study desk with potted plant, mug, open book, colored pencils, and pinned wall note 'Good Ideas Grow Here'"
              className="hero-artwork-img"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Handcrafted torn paper edge transition to Section 2 */}
      <TornDivider fill="#FCFAF4" height={38} />
    </section>
  );
}

