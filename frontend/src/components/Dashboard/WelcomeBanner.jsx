import React from 'react';
import camberPeekingImg from '../../assets/camber-peeking.png';

export default function WelcomeBanner({ studentName = 'Alex' }) {
  // Determine time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Format current date matching reference style "Fri, 25 Apr 2025"
  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const displayName = studentName || 'Alex';

  return (
    <section className="welcome-banner-card" aria-label="Welcome Banner">
      <div className="welcome-banner-left">
        {/* Whimsical smiling sun icon */}
        <div className="welcome-sun-icon" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" fill="#FDE68A" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </div>

        <div className="welcome-headings">
          <h1>{getGreeting()}, {displayName}!</h1>
          <p>Hey, welcome back! Ready to learn something new today?</p>
        </div>
      </div>

      <div className="welcome-banner-right">
        {/* Current Date Badge */}
        <div className="banner-date-badge">
          {getFormattedDate()}
        </div>

        {/* Camber Peeking Mascot */}
        <div className="peeking-squirrel-container" aria-hidden="true">
          <img
            src={camberPeekingImg}
            alt="Camber squirrel mascot peeking with paws resting on the banner"
            className="peeking-squirrel-img"
          />
        </div>
      </div>
    </section>
  );
}
