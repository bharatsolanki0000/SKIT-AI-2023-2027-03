import React, { useEffect } from 'react';
import WelcomeCard from './WelcomeCard';
import WhyExtensionCard from './WhyExtensionCard';
import SetupConnectCard from './SetupConnectCard';
import './ExtensionLaunch.css';

/**
 * ExtensionLaunchPage Component
 * Study Launch & Chrome Extension Setup Page for CAMBER.
 * Presents the 3-panel illustrated storybook instruction booklet layout.
 */
export default function ExtensionLaunchPage({ onNavigate }) {
  // Ensure window scrolls smoothly to top on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleBrandClick = () => {
    if (onNavigate) {
      onNavigate('/dashboard');
    } else {
      window.history.pushState({}, '', '/dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="camber-extension-launch-page">
      {/* Top Page Header */}
      <header className="launch-page-header">
        {/* Top-Left: CAMBER Wordmark with Paw Symbol */}
        <div className="header-brand-wrap">
          <button
            type="button"
            className="header-brand-btn"
            onClick={handleBrandClick}
            title="Return to CAMBER Dashboard"
            aria-label="CAMBER Dashboard Home"
          >
            <span className="brand-wordmark">CAMBER</span>
            <span className="brand-paw-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <ellipse cx="7.5" cy="7" rx="2" ry="2.6" />
                <ellipse cx="12" cy="5.5" rx="2" ry="2.6" />
                <ellipse cx="16.5" cy="7" rx="2" ry="2.6" />
                <path d="M12 9.5c-3.2 0-5.5 2.2-5.5 5.5 0 2.4 1.8 4 5.5 4s5.5-1.6 5.5-4c0-3.3-2.3-5.5-5.5-5.5z" />
              </svg>
            </span>
          </button>
        </div>

        {/* Top-Right: Handwritten Motivational Message */}
        <div className="header-handwritten-note" aria-hidden="true">
          <div className="handwritten-lines">
            <span className="hw-line">Small steps</span>
            <span className="hw-line">Big progress</span>
          </div>
          <div className="handwritten-icons">
            <span className="hw-heart">💛</span>
            <span className="hw-leaf">🍃</span>
          </div>
        </div>
      </header>

      {/* Main Three-Panel Instruction Booklet Cards Stage */}
      <main className="launch-cards-container" aria-label="CAMBER Extension Setup Guide">
        {/* Card 1: Welcome to CAMBER */}
        <WelcomeCard />

        {/* Card 2: Why do I need the extension? */}
        <WhyExtensionCard />

        {/* Card 3: Install & Connect your Extension */}
        <SetupConnectCard
          onNavigate={onNavigate}
          onStartStudySession={() => {
            if (onNavigate) {
              onNavigate('/dashboard');
            }
          }}
        />
      </main>
    </div>
  );
}
