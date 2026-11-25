import React, { useState } from 'react';
import camberLogo from '../../assets/camber-logo.png';
import camberWelcomeImg from '../../assets/camber/camber-welcome.png';
import {
  extensionLaunchService,
  EXTENSION_STATUS,
} from './extensionLaunchService';

/**
 * Card Three: Install & Connect your Extension
 * Rightmost card with interactive extension setup, status checking, and Start Studying banner.
 */
export default function SetupConnectCard({ onNavigate, onStartStudySession }) {
  const [connectionStatus, setConnectionStatus] = useState(
    EXTENSION_STATUS.NOT_CONNECTED
  );
  const [statusFeedbackMessage, setStatusFeedbackMessage] = useState('');
  const [bannerFeedbackMessage, setBannerFeedbackMessage] = useState('');

  // 1. Add to Chrome Button Action
  const handleAddToChrome = () => {
    setStatusFeedbackMessage('');
    setBannerFeedbackMessage('');
    const result = extensionLaunchService.openInstallUrl();
    if (!result.success) {
      setStatusFeedbackMessage(result.message);
    }
  };

  // 2. Check Connection Action (Truthful check)
  const handleCheckConnection = async () => {
    setStatusFeedbackMessage('');
    setBannerFeedbackMessage('');
    setConnectionStatus(EXTENSION_STATUS.CHECKING);

    const status = await extensionLaunchService.checkConnection();
    setConnectionStatus(status);

    if (status === EXTENSION_STATUS.CONNECTED) {
      setStatusFeedbackMessage("You're all set! Let's get studying! ♡");
    } else {
      setStatusFeedbackMessage(
        "Extension not detected yet. Open the extension in Chrome and try checking again. 🐾"
      );
    }
  };

  // 3. Start Studying Banner Action
  const handleStartStudying = () => {
    if (connectionStatus === EXTENSION_STATUS.CONNECTED) {
      setBannerFeedbackMessage("You're all set! Starting your study session... ♡");
      if (onStartStudySession) {
        onStartStudySession();
      } else if (onNavigate) {
        // Return to dashboard or active session view
        setTimeout(() => {
          onNavigate('/dashboard');
        }, 600);
      }
    } else {
      // Friendly, encouraging message as requested in prompt Section 11
      setBannerFeedbackMessage(
        "Almost there! Let's connect your CAMBER extension first. ♡"
      );
    }
  };

  return (
    <article className="launch-card card-setup-connect" aria-labelledby="setup-card-heading">
      {/* Outer Card Top Header with Brand and Handwritten Note */}
      <div className="card-top-bar card-top-bar-split">
        <div className="card-brand-badge">
          <img src={camberLogo} alt="CAMBER" className="card-brand-icon" />
          <span className="card-brand-text">CAMBER</span>
        </div>

        {/* Upper-Right Handwritten Encouragement */}
        <div className="steps-away-handwritten" aria-hidden="true">
          <span className="steps-away-text">
            You're just<br />a few steps away!
          </span>
          <span className="steps-away-decor">💛🍃</span>
        </div>
      </div>

      {/* Warm Cream Inner Card Container */}
      <div className="card-inner-surface">
        {/* Main Heading with Hand-drawn Underline */}
        <div className="card-heading-group">
          <h2 id="setup-card-heading" className="card-title">
            Install & Connect<br />your Extension
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

        {/* Global Feedback Banner if present */}
        {statusFeedbackMessage && (
          <div className="extension-friendly-alert" role="status" aria-live="polite">
            <span className="alert-paw" aria-hidden="true">🐾</span>
            <span>{statusFeedbackMessage}</span>
          </div>
        )}

        {/* Three Distinct Setup Areas */}
        <div className="setup-areas-stack">
          {/* AREA 1: Install the Chrome Extension */}
          <section className="setup-area-box area-install" aria-label="Step 1: Install Chrome Extension">
            <div className="setup-box-left">
              <div className="step-circle-badge badge-blue" aria-hidden="true">1</div>
              <div className="step-text-wrap">
                <h3 className="setup-step-heading">Install the Chrome Extension</h3>
                <p className="setup-step-desc">
                  Click on the button below to add CAMBER to your Chrome browser.
                </p>
              </div>
            </div>

            <div className="setup-box-right">
              {/* Google Chrome Logo */}
              <div className="chrome-logo-wrapper" title="Google Chrome" aria-hidden="true">
                <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="11" fill="#FFFFFF" />
                  <circle cx="24" cy="24" r="8" fill="#4285F4" />
                  {/* Top Red */}
                  <path d="M24 4 C31.5 4 38 8 41.5 14 L24 24 L24 4 Z" fill="#EA4335" />
                  <path d="M24 4 L41.5 14 C37.8 8.1 31.4 4 24 4 Z" fill="#EA4335" />
                  <path d="M10 24 C10 16.3 16.2 10 24 10 L37.8 10 C34 4 24 4 24 4 C13 4 4 13 4 24 Z" fill="#EA4335" opacity="0.9" />
                  {/* Yellow Right-Bottom */}
                  <path d="M44 24 C44 35 35 44 24 44 L31 32 L41.5 14 C43.1 17 44 20.4 44 24 Z" fill="#FBBC05" />
                  {/* Green Bottom-Left */}
                  <path d="M24 44 C13 44 4 35 4 24 L17.5 24 L24 35.2 C19.5 35.2 16 31.7 16 27.2 L7.8 13 C5.4 16.2 4 20 4 24 C4 35 13 44 24 44 Z" fill="#34A853" />
                  <circle cx="24" cy="24" r="9" fill="#FFFFFF" />
                  <circle cx="24" cy="24" r="7.5" fill="#1A73E8" />
                </svg>
              </div>

              {/* Add to Chrome Button */}
              <button
                type="button"
                className="btn-add-to-chrome"
                onClick={handleAddToChrome}
                aria-label="Add CAMBER Extension to Google Chrome"
              >
                <span className="puzzle-icon" aria-hidden="true">🧩</span>
                <span className="btn-label">Add to Chrome</span>
              </button>
            </div>
          </section>

          {/* AREA 2: Connect with CAMBER */}
          <section className="setup-area-box area-connect" aria-label="Step 2: Connect with CAMBER">
            <div className="setup-box-left">
              <div className="step-circle-badge badge-blue" aria-hidden="true">2</div>
              <div className="step-text-wrap">
                <h3 className="setup-step-heading">Connect with CAMBER</h3>
                <p className="setup-step-desc">
                  Once installed, click on the extension icon and sign in with your CAMBER account.
                </p>
              </div>
            </div>

            <div className="setup-box-right">
              {/* Mini Browser Extension Popup Replica */}
              <div className="mini-extension-popup-replica" role="region" aria-label="Extension Popup Status">
                <div className="replica-top">
                  <span className="replica-puzzle">🧩</span>
                  <div className="replica-brand">
                    <img src={camberLogo} alt="" className="replica-logo" />
                    <span className="replica-name">CAMBER</span>
                  </div>
                </div>

                <div className="replica-status-row">
                  {connectionStatus === EXTENSION_STATUS.NOT_CONNECTED && (
                    <div className="replica-pill status-disconnected">
                      <span className="status-indicator-dot dot-gray" aria-hidden="true" />
                      <span>Not connected</span>
                    </div>
                  )}

                  {connectionStatus === EXTENSION_STATUS.CHECKING && (
                    <div className="replica-pill status-checking">
                      <span className="status-indicator-dot dot-amber" aria-hidden="true" />
                      <span>Connecting...</span>
                    </div>
                  )}

                  {connectionStatus === EXTENSION_STATUS.CONNECTED && (
                    <div className="replica-pill status-connected">
                      <span className="status-indicator-dot dot-green" aria-hidden="true" />
                      <span>Connected</span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn-check-connection"
                    onClick={handleCheckConnection}
                    title="Check connection with installed extension"
                    disabled={connectionStatus === EXTENSION_STATUS.CHECKING}
                  >
                    Check
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* AREA 3: Now, Open Your Study Material */}
          <section className="setup-area-box area-study-material" aria-label="Study Material Requirement">
            <h3 className="study-material-title">Now, open your study material</h3>

            <div className="study-material-three-cols">
              {/* Left: PDF Document with "PDF only" label */}
              <div className="material-col-left" aria-hidden="true">
                <div className="material-pdf-graphic">
                  <div className="pdf-doc-sheet">
                    <span className="pdf-red-tag">PDF</span>
                    <div className="pdf-sheet-lines">
                      <span className="ps-line" />
                      <span className="ps-line" />
                      <span className="ps-line short" />
                    </div>
                  </div>
                  <span className="pdf-only-badge">PDF only</span>
                </div>
              </div>

              {/* Centre: Instructions */}
              <div className="material-col-centre">
                <p className="material-instruction-text">
                  For now, you can use a PDF. Open it in Google Chrome, keep it
                  in your browser and hit Start Studying.
                </p>
              </div>

              {/* Right: Browser Window Illustration showing PDF in Chrome */}
              <div className="material-col-right" aria-hidden="true">
                <div className="browser-window-mini">
                  <div className="browser-title-bar">
                    <span className="browser-dot dot-red" />
                    <span className="browser-dot dot-yellow" />
                    <span className="browser-dot dot-green" />
                    <span className="browser-tab-chip">notes.pdf</span>
                  </div>
                  <div className="browser-viewport-inner">
                    <div className="browser-pdf-preview">
                      <span className="bp-header" />
                      <span className="bp-row" />
                      <span className="bp-row" />
                      <span className="bp-row half" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Banner Feedback if present */}
        {bannerFeedbackMessage && (
          <div className="banner-feedback-alert" role="status" aria-live="polite">
            {bannerFeedbackMessage}
          </div>
        )}

        {/* BOTTOM: Prominent Warm Butter-Yellow "Start Studying..." Banner */}
        <div
          className="start-studying-banner"
          onClick={handleStartStudying}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleStartStudying();
            }
          }}
          aria-label="Start studying with CAMBER"
        >
          {/* Left: Cheerful Camber mascot waving */}
          <div className="banner-mascot-left">
            <img
              src={camberWelcomeImg}
              alt="Camber squirrel smiling and waving cheerily"
              className="banner-mascot-img"
            />
          </div>

          {/* Right: Heading and Invitation */}
          <div className="banner-text-right">
            <h3 className="banner-heading">Start studying...</h3>
            <p className="banner-subtext">CAMBER has got your back! ♥</p>
          </div>

          {/* Decorative Corner Foliage */}
          <div className="banner-decor-plants" aria-hidden="true">
            <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
              <path d="M10 26 Q18 16 26 12 C24 20 18 24 10 26 Z" fill="#7E9C79" opacity="0.8" />
              <path d="M12 26 Q8 18 2 16 C6 22 10 24 12 26 Z" fill="#A9BC91" opacity="0.9" />
              <circle cx="30" cy="18" r="3" fill="#E5B842" opacity="0.8" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}
