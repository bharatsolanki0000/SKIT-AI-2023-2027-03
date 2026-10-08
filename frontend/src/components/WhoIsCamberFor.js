import React from 'react';
import { FloatingLeaf, BotanicalSprig } from './BotanicalAccents';

export default function WhoIsCamberFor() {
  const audiences = [
    {
      id: 'students',
      title: 'Students',
      icon: (
        <svg width="42" height="40" viewBox="0 0 42 40" fill="none">
          {/* Graduation mortarboard cap */}
          <polygon points="21,12 36,18 21,24 6,18" fill="#4B7799" />
          <polygon points="21,13.5 33,18 21,22.5 9,18" fill="#6590B0" />
          <path d="M12 21 V27 C12 29 16 31 21 31 C26 31 30 29 30 27 V21" fill="#4B7799" opacity="0.9" />
          {/* Tassel */}
          <path d="M32 19.5 C34 21 34 25 33 27" stroke="#E5B242" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="33" cy="27" r="1.5" fill="#E5B242" />
        </svg>
      ),
    },
    {
      id: 'self-learners',
      title: 'Self-learners',
      icon: (
        <svg width="42" height="40" viewBox="0 0 42 40" fill="none">
          {/* Stack of colorful study books */}
          <rect x="9" y="27" width="24" height="6" rx="1.5" fill="#5283A4" />
          <rect x="7" y="20" width="28" height="6" rx="1.5" fill="#D6705D" />
          <rect x="11" y="13" width="20" height="6" rx="1.5" fill="#E2AC44" />
          {/* Pages edges */}
          <rect x="11" y="28.5" width="20" height="3" fill="#FCFAF2" />
          <rect x="9" y="21.5" width="24" height="3" fill="#FCFAF2" />
          <rect x="13" y="14.5" width="16" height="3" fill="#FCFAF2" />
        </svg>
      ),
    },
    {
      id: 'curious-minds',
      title: 'Curious minds',
      icon: (
        <svg width="42" height="40" viewBox="0 0 42 40" fill="none">
          {/* Glowing warm lightbulb with spark */}
          <path
            d="M21 9 C15.5 9 13 13.5 13 17 C13 19.5 14.5 22 17 24 V27 H25 V24 C27.5 22 29 19.5 29 17 C29 13.5 26.5 9 21 9 Z"
            fill="#FBE7A8"
            stroke="#E0B647"
            strokeWidth="1.2"
          />
          {/* Base */}
          <rect x="18" y="27" width="6" height="2" fill="#BAA48A" />
          <rect x="19" y="29" width="4" height="2" rx="1" fill="#99836E" />
          {/* Filament glow */}
          <path d="M19 16 C19 14.5 23 14.5 23 16" stroke="#D19828" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'online-learners',
      title: 'Online learners',
      icon: (
        <svg width="42" height="40" viewBox="0 0 42 40" fill="none">
          {/* Cozy laptop with friendly learning display */}
          <rect x="10" y="11" width="22" height="15" rx="2" fill="#78A2C2" stroke="#5B87AB" strokeWidth="1" />
          <rect x="12" y="13" width="18" height="11" rx="1" fill="#FFFFFF" />
          <circle cx="21" cy="18.5" r="3" fill="#6F8850" opacity="0.8" />
          <path d="M7 26 H35 L33 28 H9 Z" fill="#5B87AB" />
        </svg>
      ),
    },
  ];

  return (
    <section className="audience-section">
      <div className="audience-container">
        {/* Header */}
        <div className="audience-header">
          <h2 className="section-heading audience-title">Who is Camber for?</h2>
          <p className="section-subline audience-subtitle">Made for curious minds.</p>
          <p className="audience-paragraph">
            Whether you're a student, a self-learner,<br />
            or just someone who loves to explore —<br />
            Camber is for you.
          </p>
        </div>

        {/* 4 Cards Row */}
        <div className="audience-cards-grid">
          <div className="audience-decor-left" aria-hidden="true">
            <FloatingLeaf size={22} rotate={20} color="#708754" />
          </div>

          {audiences.map((aud) => (
            <div key={aud.id} className="audience-card">
              <div className="audience-icon-wrapper">
                {aud.icon}
              </div>
              <h3 className="audience-card-title">{aud.title}</h3>
            </div>
          ))}

          <div className="audience-decor-right" aria-hidden="true">
            <BotanicalSprig size={28} color="#687e50" />
          </div>
        </div>
      </div>
    </section>
  );
}

