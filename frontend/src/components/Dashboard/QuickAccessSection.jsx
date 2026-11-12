import React from 'react';

export default function QuickAccessSection({ onActionClick }) {
  const cards = [
    {
      id: 'simpler',
      variant: 'quick-card-blue',
      title: 'Make it simpler',
      description: 'Break down tough topics',
      buttonText: 'Learn →',
      illustration: (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          {/* Open Storybook SVG */}
          <path d="M8 44 C18 42 28 44 32 48 C36 44 46 42 56 44 L56 20 C46 18 36 20 32 24 C28 20 18 18 8 20 Z" fill="#D2E6F5" stroke="#48789C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 42 C20 40 28 42 32 46 C36 42 44 40 52 42 L52 22 C44 20 36 22 32 26 C28 22 20 20 12 22 Z" fill="#FFFFFF" />
          <line x1="32" y1="26" x2="32" y2="46" stroke="#48789C" strokeWidth="2" strokeLinecap="round" />
          {/* Subtle text lines on pages */}
          <line x1="16" y1="28" x2="26" y2="27" stroke="#A8C8E2" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="33" x2="28" y2="32" stroke="#A8C8E2" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="36" y1="27" x2="48" y2="28" stroke="#A8C8E2" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="36" y1="32" x2="46" y2="33" stroke="#A8C8E2" strokeWidth="1.5" strokeLinecap="round" />
          {/* Red bookmark ribbon */}
          <path d="M32 26 L32 36 L29 33 L26 36 L26 26" fill="#E26D5C" />
        </svg>
      )
    },
    {
      id: 'quiz',
      variant: 'quick-card-yellow',
      title: 'Quick quiz',
      description: 'Test your knowledge',
      buttonText: 'Try now →',
      illustration: (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          {/* Back Quiz Card */}
          <rect x="22" y="10" width="28" height="38" rx="4" fill="#FCE5A4" stroke="#DCA038" strokeWidth="1.8" transform="rotate(8 36 29)" />
          {/* Front Quiz Card */}
          <rect x="14" y="14" width="28" height="38" rx="4" fill="#FFFFFF" stroke="#DCA038" strokeWidth="1.8" />
          {/* Question lines and checkbox marks */}
          <circle cx="21" cy="24" r="2.5" fill="#4B9058" />
          <line x1="26" y1="24" x2="36" y2="24" stroke="#70452F" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="21" cy="32" r="2.5" fill="#DCA038" />
          <line x1="26" y1="32" x2="34" y2="32" stroke="#B89379" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="21" cy="40" r="2.5" fill="#E26D5C" />
          <line x1="26" y1="40" x2="38" y2="40" stroke="#B89379" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'motivation',
      variant: 'quick-card-pink',
      title: 'A little motivation',
      description: 'Get inspired!',
      buttonText: 'Be inspired →',
      illustration: (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          {/* Golden Trophy Cup */}
          <path d="M22 18 C22 18 16 18 16 26 C16 32 22 34 24 34" stroke="#D99B26" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M42 18 C42 18 48 18 48 26 C48 32 42 34 40 34" stroke="#D99B26" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M22 16 L42 16 C42 16 42 34 32 36 C22 34 22 16 22 16 Z" fill="#FDD853" stroke="#D99B26" strokeWidth="2" />
          <path d="M29 36 L35 36 L34 44 L30 44 Z" fill="#E5AA28" stroke="#D99B26" strokeWidth="1.8" />
          <rect x="25" y="44" width="14" height="6" rx="2" fill="#8C5835" stroke="#683F23" strokeWidth="1.5" />
          {/* Star sparkle */}
          <polygon points="32,21 33.5,25 38,25 34.5,27.5 36,32 32,29.5 28,32 29.5,27.5 26,25 30.5,25" fill="#FFFFFF" />
          {/* Little sparkles around */}
          <circle cx="16" cy="14" r="1.5" fill="#F4978E" />
          <circle cx="48" cy="14" r="1.5" fill="#F4978E" />
        </svg>
      )
    },
    {
      id: 'break',
      variant: 'quick-card-green',
      title: 'Take a little break',
      description: 'Explore fun websites',
      buttonText: 'Relax →',
      illustration: (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          {/* Whimsical Tree */}
          <rect x="30" y="32" width="6" height="18" rx="2" fill="#936B46" />
          <circle cx="33" cy="26" r="14" fill="#78A663" stroke="#567D44" strokeWidth="1.8" />
          <circle cx="26" cy="22" r="8" fill="#8CB878" />
          <circle cx="39" cy="20" r="9" fill="#699754" />
          {/* Cute Little Mushroom */}
          <path d="M20 48 Q20 42 25 42 Q30 42 30 48 Z" fill="#E05A47" stroke="#BA3E2C" strokeWidth="1.5" />
          <rect x="23.5" y="48" width="3" height="4" fill="#FFF9ED" />
          <circle cx="23" cy="45" r="1" fill="#FFFFFF" />
          <circle cx="27" cy="45" r="1.2" fill="#FFFFFF" />
          {/* Soft grass tufts */}
          <path d="M14 52 L17 46 L20 52 L23 48 L26 52" stroke="#6F995A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  return (
    <section className="quick-access-section" aria-label="A Little Something for You">
      {/* Header */}
      <div className="quick-access-header-group">
        <div className="section-title-with-icon">
          <span style={{ fontSize: 17 }} aria-hidden="true">📝</span>
          <h2>A Little Something for You</h2>
        </div>
        <p className="quick-access-subtext">Pick what you need today:</p>
      </div>

      {/* 4 Cards Grid */}
      <div className="quick-access-grid">
        {cards.map((card) => (
          <div key={card.id} className={`quick-access-card ${card.variant}`}>
            <div className="quick-card-illustration" aria-hidden="true">
              {card.illustration}
            </div>
            <h3 className="quick-card-title">{card.title}</h3>
            <p className="quick-card-description">{card.description}</p>
            <button
              type="button"
              className="quick-card-action-btn"
              onClick={() => onActionClick && onActionClick(card.id)}
            >
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
