import React from 'react';
import squirrelReadingImg from '../assets/squirrel-reading.png';
import { BotanicalSprig } from './BotanicalAccents';
import TornDivider from './TornDivider';

export default function WhatIsCamber() {
  const concepts = [
    {
      id: 'discover',
      title: 'Discover',
      description: 'Explore ideas at your own pace.',
      bgColor: '#E4EED7',
      icon: (
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
          {/* Seedling sprout */}
          <path
            d="M16 26 V14"
            stroke="#5D7A42"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M16 18 C11 18 8 13 8 9 C12 9 16 12 16 18 Z"
            fill="#6E8E4F"
          />
          <path
            d="M16 15 C20 15 24 11 23 7 C19 7 16 10 16 15 Z"
            fill="#81A360"
          />
        </svg>
      ),
    },
    {
      id: 'learn',
      title: 'Learn',
      description: 'Understand concepts through interactive experiences.',
      bgColor: '#DCEBF5',
      icon: (
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
          {/* Open watercolor book */}
          <path
            d="M16 24 C13 21 8 20 4 21 V9 C9 8 13 9 16 12 C19 9 23 8 28 9 V21 C24 20 19 21 16 24 Z"
            fill="#7CA3C2"
            opacity="0.85"
          />
          <path
            d="M16 12 V24"
            stroke="#537C9E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M7 13 C10 12.5 13 13.5 14 15 M7 16.5 C10 16 13 17 14 18.5"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M25 13 C22 12.5 19 13.5 18 15 M25 16.5 C22 16 19 17 18 18.5"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      ),
    },
    {
      id: 'grow',
      title: 'Grow',
      description: 'Build knowledge, confidence and curiosity.',
      bgColor: '#FDF1D2',
      icon: (
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
          {/* Warm radiant sun & blossoming flower */}
          <circle cx="16" cy="16" r="6" fill="#E8A939" />
          {/* Rays / petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <circle
              key={idx}
              cx={16 + 9.5 * Math.cos((angle * Math.PI) / 180)}
              cy={16 + 9.5 * Math.sin((angle * Math.PI) / 180)}
              r="2.2"
              fill="#F5C453"
            />
          ))}
          <circle cx="16" cy="16" r="3.5" fill="#FCE9AA" opacity="0.65" />
        </svg>
      ),
    },
  ];

  return (
    <section id="what-is-camber" className="what-section">
      <div className="what-container">
        {/* Left Column: Heading, Paragraph, and 3 Concepts */}
        <div className="what-content">
          <div className="what-header-wrap">
            <h2 className="section-heading">What is Camber?</h2>
          </div>

          <p className="what-description">
            Camber is a space designed to make learning feel more personal,
            engaging and enjoyable. It adapts to your needs, helps you stay
            curious and turns your ideas into something meaningful.
          </p>

          {/* Three Learning Concepts */}
          <div className="concepts-grid">
            {concepts.map((concept) => (
              <div key={concept.id} className="concept-card">
                <div
                  className="concept-icon-bubble"
                  style={{ backgroundColor: concept.bgColor }}
                >
                  {concept.icon}
                </div>
                <h3 className="concept-title">{concept.title}</h3>
                <p className="concept-desc">{concept.description}</p>
              </div>
            ))}
          </div>

          {/* Small decorative leaf sprig */}
          <div className="what-sprig-left" aria-hidden="true">
            <BotanicalSprig size={28} color="#7c9263" />
          </div>
        </div>

        {/* Right Column: Squirrel Reading on Stacked Books Scene */}
        <div className="what-visual">
          <div className="what-artwork-wrapper">
            <img
              src={squirrelReadingImg}
              alt="Camber squirrel sitting on a stack of hardcover books reading a book in a wildflower meadow with a butterfly"
              className="what-artwork-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Handcrafted torn paper edge transition to Section 3 (Sage Green) */}
      <TornDivider fill="#CAD6BE" height={40} flip={true} />
    </section>
  );
}
