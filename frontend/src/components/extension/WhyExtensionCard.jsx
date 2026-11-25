import React from 'react';
import camberLogo from '../../assets/camber-logo.png';
import camberPeekingImg from '../../assets/camber-peeking.png';

/**
 * Card Two: Why do I need the extension?
 * Center card explaining the 3 core benefits with illustrated step boxes.
 */
export default function WhyExtensionCard() {
  return (
    <article className="launch-card card-why-extension" aria-labelledby="why-card-heading">
      {/* Outer Card Top Header */}
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
          <h2 id="why-card-heading" className="card-title">
            Why do I need<br />the extension?
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

        {/* Supporting Intro */}
        <p className="card-subtext card-subtext-intro">
          The CAMBER Chrome Extension helps us:
        </p>

        {/* 3 Vertically Stacked Informational Boxes */}
        <div className="benefits-stack">
          {/* Box 1: Identify study material */}
          <div className="benefit-box">
            <div className="benefit-badge-num" aria-hidden="true">1</div>
            <div className="benefit-artwork" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 54 54" fill="none">
                {/* White Document */}
                <rect x="8" y="6" width="28" height="36" rx="4" fill="#FFFFFF" stroke="#CADDEE" strokeWidth="1.5" />
                <path d="M26 6 L36 16 L26 16 Z" fill="#EBF4FB" stroke="#CADDEE" strokeWidth="1" />
                {/* Red PDF Label */}
                <rect x="11" y="24" width="22" height="10" rx="2.5" fill="#E76F51" />
                <text x="22" y="31.5" fill="#FFFFFF" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">PDF</text>
                {/* Content lines */}
                <line x1="12" y1="14" x2="22" y2="14" stroke="#D3E4F2" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="12" y1="19" x2="20" y2="19" stroke="#D3E4F2" strokeWidth="1.5" strokeLinecap="round" />
                {/* Magnifying Glass */}
                <circle cx="34" cy="34" r="8" fill="#FFF8EE" stroke="#E5B842" strokeWidth="2.5" />
                <circle cx="34" cy="34" r="5" fill="#FFEAA7" opacity="0.3" />
                <line x1="40" y1="40" x2="48" y2="48" stroke="#68412E" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="benefit-content">
              <h3 className="benefit-heading">
                Identify your study<br />material
              </h3>
              <p className="benefit-desc">
                Detects whether you're reading a PDF in Chrome.
              </p>
            </div>
          </div>

          {/* Box 2: Support study session */}
          <div className="benefit-box">
            <div className="benefit-badge-num" aria-hidden="true">2</div>
            <div className="benefit-artwork" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 54 54" fill="none">
                {/* Laptop Base */}
                <path d="M6 37 L44 37 C47 37 49 39 48 41 L46 42 L4 42 L2 41 C1 39 3 37 6 37 Z" fill="#A8C7DE" />
                {/* Laptop Screen */}
                <rect x="8" y="14" width="34" height="23" rx="2.5" fill="#4B7797" stroke="#3A607D" strokeWidth="1" />
                <rect x="11" y="17" width="28" height="17" rx="1.5" fill="#F4F9FD" />
                {/* Screen Content lines */}
                <line x1="14" y1="21" x2="28" y2="21" stroke="#A9CBEA" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="14" y1="25" x2="34" y2="25" stroke="#A9CBEA" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="14" y1="29" x2="24" y2="29" stroke="#A9CBEA" strokeWidth="1.5" strokeLinecap="round" />
                {/* Camber Green Leaf on Screen */}
                <path d="M30 19 C28 17 26 21 28 23 C30 25 33 21 30 19 Z" fill="#7E9C79" />
                <path d="M29 23 L28 25" stroke="#587A46" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <div className="benefit-content">
              <h3 className="benefit-heading">
                Support your<br />study session
              </h3>
              <p className="benefit-desc">
                Reads the content (like text, captions or key points) to understand what you're learning.
              </p>
            </div>
          </div>

          {/* Box 3: Personalized learning assistance */}
          <div className="benefit-box">
            <div className="benefit-badge-num" aria-hidden="true">3</div>
            <div className="benefit-artwork mascot-bulb-artwork" aria-hidden="true">
              {/* Cheerful Camber with glowing lightbulb */}
              <div className="mini-bulb-container">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="glowing-bulb-icon">
                  <path
                    d="M9 18h6m-4 3h2m-5-8.5C7.2 11.2 6.5 9.7 6.5 8a5.5 5.5 0 1111 0c0 1.7-.7 3.2-1.5 4.5-.7 1.1-1 1.7-1 2.5H9c0-.8-.3-1.4-1-2.5z"
                    stroke="#E5B842"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#FFEAA7"
                  />
                  {/* Rays */}
                  <line x1="12" y1="1" x2="12" y2="2.5" stroke="#E5B842" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="4.5" y1="4.5" x2="5.5" y2="5.5" stroke="#E5B842" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="19.5" y1="4.5" x2="18.5" y2="5.5" stroke="#E5B842" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <img
                  src={camberPeekingImg}
                  alt="Camber mascot"
                  className="benefit-mascot-img"
                />
              </div>
            </div>
            <div className="benefit-content">
              <h3 className="benefit-heading">
                Provide personalized<br />learning assistance
              </h3>
              <p className="benefit-desc">
                Offers explanations, quizzes, breaks and motivation based on your learning state.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative corner sprout */}
        <div className="benefit-corner-plant" aria-hidden="true">
          <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
            <path d="M22 28 Q24 16 32 10 C32 18 28 24 22 28 Z" fill="#7E9C79" />
            <path d="M22 28 Q18 18 10 16 C12 24 18 26 22 28 Z" fill="#A9BC91" />
            <path d="M22 30 L22 24" stroke="#587A46" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </article>
  );
}
