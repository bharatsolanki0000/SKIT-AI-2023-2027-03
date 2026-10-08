import React from 'react';
import { ButtercupFlower, WildflowerStem } from './BotanicalAccents';

export default function FeaturesSection() {
  const featuresList = [
    {
      id: 'personalized',
      title: 'Personalized Learning',
      description: 'Learning experiences shaped around your needs and preferences.',
      circleBg: '#E4EED7',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          {/* Leaf sprig icon */}
          <path
            d="M8 24 C10 16 16 10 24 8 C23 16 17 22 8 24 Z"
            fill="#6B8A4E"
            opacity="0.9"
          />
          <path
            d="M10 22 C14 17 18 13 22 10"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M12 18 C15 15 16 16 17 14"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      ),
    },
    {
      id: 'smart-assist',
      title: 'Smart Assistance',
      description: 'Get guidance when you feel stuck or need another explanation.',
      circleBg: '#F9DCD5',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          {/* Soft stylized brain / thoughtful mind */}
          <path
            d="M11 12 C9 12 7.5 13.5 7.5 15.5 C7.5 16.5 8 17.5 9 18 C8.5 19 9 20.5 10 21 C10 22 11 23 12.5 23 C14 23 15 22 15 21 V11 C13.5 11 12 11.5 11 12 Z"
            fill="#D97A6B"
            opacity="0.85"
          />
          <path
            d="M21 12 C23 12 24.5 13.5 24.5 15.5 C24.5 16.5 24 17.5 23 18 C23.5 19 23 20.5 22 21 C22 22 21 23 19.5 23 C18 23 17 22 17 21 V11 C18.5 11 20 11.5 21 12 Z"
            fill="#C96859"
            opacity="0.85"
          />
          <path
            d="M12 15 C13.5 15.5 14 17 13 18.5"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M20 15 C18.5 15.5 18 17 19 18.5"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      ),
    },
    {
      id: 'adaptive',
      title: 'Adaptive Experience',
      description: 'Content and activities that adapt to your progress.',
      circleBg: '#FAE2CE',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          {/* Archery target / focal circle */}
          <circle cx="16" cy="16" r="11" stroke="#D47C56" strokeWidth="2.2" opacity="0.8" />
          <circle cx="16" cy="16" r="6.5" stroke="#E69875" strokeWidth="2" opacity="0.85" />
          <circle cx="16" cy="16" r="2.8" fill="#B85D38" />
        </svg>
      ),
    },
    {
      id: 'insights',
      title: 'Learning Insights',
      description: 'Track your progress and discover your learning patterns.',
      circleBg: '#FCEFCB',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          {/* Ascending steps / bar chart */}
          <rect x="7" y="19" width="4.5" height="7" rx="1.5" fill="#E5AC42" opacity="0.8" />
          <rect x="13.5" y="14" width="4.5" height="12" rx="1.5" fill="#5892B3" opacity="0.85" />
          <rect x="20" y="8" width="4.5" height="18" rx="1.5" fill="#6E8E4F" opacity="0.9" />
        </svg>
      ),
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      description: 'Flexible experiences designed for different learning needs.',
      circleBg: '#D6EAF3',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          {/* Welcoming figure with open arms */}
          <circle cx="16" cy="9.5" r="3.2" fill="#4B7B9A" />
          <path
            d="M8.5 15.5 C12 14 20 14 23.5 15.5"
            stroke="#4B7B9A"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M16 14.5 V21 M13 25 L16 21 L19 25"
            stroke="#4B7B9A"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'interactive',
      title: 'Interactive Learning',
      description: 'Learn through quizzes, activities and engaging content.',
      circleBg: '#F8D8DC',
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          {/* Friendly heart icon */}
          <path
            d="M16 24 C16 24 8 19 8 13.5 C8 10.5 10.5 8.5 13.5 8.5 C14.8 8.5 15.6 9 16 9.8 C16.4 9 17.2 8.5 18.5 8.5 C21.5 8.5 24 10.5 24 13.5 C24 19 16 24 16 24 Z"
            fill="#D46875"
            opacity="0.85"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        {/* Header with botanical decorations */}
        <div className="features-header-wrapper">
          <div className="features-botanical-left" aria-hidden="true">
            <ButtercupFlower size={26} />
          </div>

          <div className="features-header-text">
            <h2 className="section-heading features-title">Features</h2>
            <p className="section-subline features-subline">
              Everything you need to grow<br className="break-mobile" /> your learning journey.
            </p>
          </div>

          <div className="features-botanical-right" aria-hidden="true">
            <WildflowerStem size={32} />
          </div>
        </div>

        {/* Six Features Horizontal Cards Grid */}
        <div className="features-grid">
          {featuresList.map((feature) => (
            <div key={feature.id} className="feature-item-card">
              <div
                className="feature-icon-circle"
                style={{ backgroundColor: feature.circleBg }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-item-title">{feature.title}</h3>
              <p className="feature-item-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

