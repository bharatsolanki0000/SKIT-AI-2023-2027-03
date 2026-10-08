import React from 'react';
import { FloatingLeaf, BotanicalSprig } from './BotanicalAccents';

export default function HowCamberWorks() {
  const steps = [
    {
      id: 'step-1',
      title: 'Create your space',
      description: 'Sign up and tell Camber a little about yourself.',
      icon: (
        <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
          {/* Cute study desk card with squirrel note & pencil */}
          <rect x="6" y="8" width="28" height="24" rx="4" fill="#FDF7EA" stroke="#DFCFB2" strokeWidth="1.2" />
          {/* Little mascot avatar drawing on paper */}
          <circle cx="16" cy="18" r="5" fill="#E8B07A" />
          <circle cx="14" cy="17" r="1" fill="#4B2C1A" />
          <circle cx="18" cy="17" r="1" fill="#4B2C1A" />
          <ellipse cx="16" cy="19.5" rx="1.5" ry="1" fill="#FFFFFF" />
          {/* Yellow pencil leaning */}
          <path d="M28 28 L38 12 L35 10 L25 26 Z" fill="#F4CA57" stroke="#D1A438" strokeWidth="0.8" />
          <polygon points="25,26 24,30 28,28" fill="#E88C78" />
          <circle cx="24" cy="30" r="0.8" fill="#442E20" />
        </svg>
      ),
    },
    {
      id: 'step-2',
      title: 'Discover your learning style',
      description: 'Camber learns about your preferences and goals.',
      icon: (
        <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
          {/* Study clipboard / checklist journal */}
          <rect x="10" y="6" width="24" height="28" rx="3.5" fill="#FAF6E8" stroke="#D5C5A5" strokeWidth="1.2" />
          {/* Top brass clip */}
          <rect x="17" y="3" width="10" height="5" rx="1.5" fill="#D6A752" />
          {/* Checkboxes with green checks */}
          <rect x="14" y="12" width="4" height="4" rx="1" fill="#E3EED8" stroke="#7BA058" strokeWidth="0.8" />
          <path d="M15 14 L16 15 L17.5 13" stroke="#5B8238" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="20" y1="14" x2="29" y2="14" stroke="#B09F8C" strokeWidth="1.2" strokeLinecap="round" />

          <rect x="14" y="19" width="4" height="4" rx="1" fill="#E3EED8" stroke="#7BA058" strokeWidth="0.8" />
          <path d="M15 21 L16 22 L17.5 20" stroke="#5B8238" strokeWidth="0.9" strokeLinecap="round" />
          <line x1="20" y1="21" x2="29" y2="21" stroke="#B09F8C" strokeWidth="1.2" strokeLinecap="round" />

          <rect x="14" y="26" width="4" height="4" rx="1" fill="#FAF3DD" stroke="#D8C39E" strokeWidth="0.8" />
          <line x1="20" y1="28" x2="27" y2="28" stroke="#B09F8C" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'step-3',
      title: 'Start learning',
      description: 'Choose what you want to explore.',
      icon: (
        <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
          {/* Cute laptop on books */}
          {/* Books base */}
          <rect x="16" y="27" width="22" height="5" rx="1.5" fill="#D4685A" opacity="0.85" />
          <rect x="14" y="31" width="26" height="5" rx="1.5" fill="#5A8BA8" opacity="0.85" />
          {/* Laptop */}
          <rect x="6" y="10" width="22" height="15" rx="2" fill="#8CAFC8" stroke="#638AA7" strokeWidth="1" />
          <rect x="8" y="12" width="18" height="11" rx="1" fill="#FFFFFF" />
          <circle cx="17" cy="17.5" r="3" fill="#F4CA57" opacity="0.75" />
          <path d="M4 25 H30 L29 27 H5 Z" fill="#6B8EA8" />
        </svg>
      ),
    },
    {
      id: 'step-4',
      title: 'Camber adapts',
      description: 'Your learning experience changes with you.',
      icon: (
        <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
          {/* Growing potted seedling in terracotta pot */}
          <polygon points="17,24 27,24 25.5,33 18.5,33" fill="#D67D59" />
          <rect x="16" y="22" width="12" height="3" rx="1" fill="#C26A47" />
          {/* Stem & Leaves */}
          <path d="M22 22 V14" stroke="#5D7C3F" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 17 C17 16 16 12 18 10 C21 11 22 14 22 17 Z" fill="#759E4E" />
          <path d="M22 15 C27 14 28 10 26 8 C23 9 22 12 22 15 Z" fill="#8BB560" />
        </svg>
      ),
    },
    {
      id: 'step-5',
      title: 'Grow & reflect',
      description: 'See your progress and discover what works best for you.',
      icon: (
        <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
          {/* Cute green-brass watering can sprinkling droplets */}
          <path
            d="M12 20 C12 17 14 16 18 16 H24 C28 16 30 18 29 22 L27.5 29 C27 31 25.5 32 23 32 H17 C14.5 32 13 31 12.5 29 Z"
            fill="#B8C88A"
            stroke="#8E9F62"
            strokeWidth="1.2"
          />
          {/* Handle */}
          <path
            d="M12 18 C8 18 7 28 13 30"
            stroke="#8E9F62"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Spout */}
          <path
            d="M28 22 L36 15"
            stroke="#8E9F62"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Rose head */}
          <ellipse cx="37" cy="14" rx="2.5" ry="4" transform="rotate(-30 37 14)" fill="#D6A752" />
          {/* Droplets */}
          <circle cx="39" cy="20" r="1.2" fill="#77AFD6" />
          <circle cx="41" cy="23" r="1" fill="#77AFD6" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="how-container">
        {/* Header */}
        <div className="how-header-wrapper">
          <div className="how-decor-left" aria-hidden="true">
            <FloatingLeaf size={24} rotate={-35} color="#65834f" />
          </div>

          <div className="how-header-text">
            <h2 className="section-heading how-title">How Camber Works</h2>
            <p className="section-subline how-subtitle">Your journey starts here.</p>
          </div>

          <div className="how-decor-right" aria-hidden="true">
            <BotanicalSprig size={30} color="#62804c" />
          </div>
        </div>

        {/* 5 Horizontal Progression Steps */}
        <div className="steps-flow-container">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="step-journal-card">
                <div className="step-icon-wrapper">
                  {step.icon}
                </div>
                <h3 className="step-card-title">{step.title}</h3>
                <p className="step-card-desc">{step.description}</p>
              </div>

              {/* Progress Arrow between cards (hidden after the last card) */}
              {index < steps.length - 1 && (
                <div className="step-arrow-divider" aria-hidden="true">
                  <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
                    <path
                      d="M2 7 H20 M14 2 L20 7 L14 12"
                      stroke="#8BA7BF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="2 3"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

