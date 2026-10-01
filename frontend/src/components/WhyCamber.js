import React from 'react';
import { BotanicalSprig, ButtercupFlower, FloatingLeaf } from './BotanicalAccents';

export default function WhyCamber() {
  const traditionalPoints = [
    'One-size-fits-all',
    'Same pace',
    'Passive learning',
    'Limited interaction',
  ];

  const camberPoints = [
    'Personalized',
    'Adaptive',
    'Interactive',
    'Learner-focused',
  ];

  return (
    <section id="why-camber" className="why-section">
      <div className="why-container">
        {/* Left Column: Heading, Subheading, and Explanation */}
        <div className="why-content">
          <h2 className="why-heading">Why Camber?</h2>
          
          <h3 className="why-subheading">
            Learning shouldn't feel like a chore.
          </h3>

          <p className="why-paragraph">
            Everyone learns differently. Camber creates a more thoughtful learning
            experience by adapting to the way you learn, helping you stay engaged
            and making space for curiosity.
          </p>

          {/* Botanical Accents on Left */}
          <div className="why-botanicals-left" aria-hidden="true">
            <ButtercupFlower size={24} />
            <FloatingLeaf size={20} rotate={15} color="#5e7446" style={{ marginLeft: 8 }} />
          </div>
        </div>

        {/* Right Column: Two Comparison Cards with Connector Arrow */}
        <div className="why-comparison-wrapper">
          {/* Card 1: Traditional Learning */}
          <div className="comparison-card traditional-card">
            <h4 className="card-header traditional-header">
              Traditional Learning
            </h4>
            <ul className="comparison-list">
              {traditionalPoints.map((point, index) => (
                <li key={index} className="comparison-item traditional-item">
                  <span className="icon-cross" aria-hidden="true">✕</span>
                  <span className="item-text">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Connector Arrow */}
          <div className="comparison-arrow-container" aria-hidden="true">
            <svg
              className="arrow-desktop"
              width="36"
              height="24"
              viewBox="0 0 36 24"
              fill="none"
            >
              <path
                d="M4 12 H30 M22 5 L30 12 L22 19"
                stroke="#546B3E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              className="arrow-mobile"
              width="24"
              height="32"
              viewBox="0 0 24 32"
              fill="none"
            >
              <path
                d="M12 4 V26 M5 19 L12 26 L19 19"
                stroke="#546B3E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Card 2: Camber */}
          <div className="comparison-card camber-card">
            <div className="card-header-badge">
              <span className="sprout-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 20 V10"
                    stroke="#507338"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 13 C8 13 6 9 6 6 C9 6 12 8 12 13 Z"
                    fill="#6A934E"
                  />
                  <path
                    d="M12 11 C15 11 18 8 17 5 C14 5 12 7 12 11 Z"
                    fill="#7FA95D"
                  />
                </svg>
              </span>
              <h4 className="card-header camber-header">Camber</h4>
            </div>

            <ul className="comparison-list">
              {camberPoints.map((point, index) => (
                <li key={index} className="comparison-item camber-item">
                  <span className="icon-check" aria-hidden="true">✓</span>
                  <span className="item-text">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botanical sprig decor near bottom right of cards */}
          <div className="why-sprig-right" aria-hidden="true">
            <BotanicalSprig size={30} color="#556c3d" />
          </div>
        </div>
      </div>
    </section>
  );
}

