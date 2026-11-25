import React from 'react';
import camberLogo from '../../assets/camber-logo.png';
import camberReadingImg from '../../assets/camber/camber-reading.png';

/**
 * Card One: Welcome to CAMBER
 * Leftmost card welcoming the student into their study space.
 */
export default function WelcomeCard() {
  return (
    <article className="launch-card card-welcome" aria-labelledby="welcome-card-heading">
      {/* Outer Card Top Header with CAMBER Leaf Logo */}
      <div className="card-top-bar">
        <div className="card-brand-badge">
          <img src={camberLogo} alt="CAMBER" className="card-brand-icon" />
          <span className="card-brand-text">CAMBER</span>
        </div>
      </div>

      {/* Warm Cream Inner Card Container */}
      <div className="card-inner-surface">
        {/* Main Heading with Hand-drawn Underline */}
        <div className="card-heading-group">
          <h2 id="welcome-card-heading" className="card-title">
            Let's get your<br />study space ready!
          </h2>
          <div className="handdrawn-underline" aria-hidden="true">
            <svg width="120" height="8" viewBox="0 0 120 8" fill="none">
              <path
                d="M3 5 C30 2, 70 6, 117 3.5"
                stroke="#E5B842"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Supporting Explanation */}
        <p className="card-subtext">
          CAMBER works alongside your study material to understand your
          learning experience and offer support when you need it.
        </p>

        {/* Lower Visual Area: Mascot + Handwritten Note + Woodland Accents */}
        <div className="welcome-mascot-stage">
          {/* Handwritten Buddy Note with Heart */}
          <div className="buddy-handwritten-note" aria-hidden="true">
            <span className="note-text">
              Your learning buddy<br />always!
            </span>
            <span className="note-heart">♥</span>
          </div>

          {/* Camber Mascot Illustration */}
          <div className="mascot-figure-wrapper">
            <img
              src={camberReadingImg}
              alt="Camber squirrel mascot holding a green study book happily"
              className="camber-reading-figure"
            />
          </div>

          {/* Bottom Woodland Botanical Flourishes */}
          <div className="card-botanical-decor" aria-hidden="true">
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="decor-flower-left">
              <circle cx="20" cy="24" r="5" fill="#F4A261" opacity="0.8" />
              <circle cx="20" cy="24" r="2" fill="#FFE3A8" />
              <path d="M12 36 Q18 28 20 24" stroke="#7E9C79" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 32 C12 28 16 32 14 36 Z" fill="#A9BC91" />
            </svg>
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="decor-flower-right">
              <circle cx="40" cy="22" r="6" fill="#F5C5B5" opacity="0.85" />
              <circle cx="40" cy="22" r="2.5" fill="#FFE3A8" />
              <path d="M48 36 Q42 26 40 22" stroke="#7E9C79" strokeWidth="2" strokeLinecap="round" />
              <path d="M46 30 C50 26 52 32 48 34 Z" fill="#7E9C79" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}
