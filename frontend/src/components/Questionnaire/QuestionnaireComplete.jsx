import React from 'react';
import welcomeImage from '../../assets/camber/camber-welcome.png';

/**
 * QuestionnaireComplete Component
 * Celebratory screen displayed upon successfully answering all 15 questions.
 * Connects the learner into their learning journey with Camber.
 */
export default function QuestionnaireComplete({ onFinish }) {
  return (
    <div className="questionnaire-complete-stage" role="region" aria-label="Questionnaire Complete">
      <div className="complete-card">
        {/* Confetti / Sparkle Decor */}
        <div className="celebration-sparkles" aria-hidden="true">
          <span className="sparkle s1">✨</span>
          <span className="sparkle s2">🌟</span>
          <span className="sparkle s3">⭐</span>
          <span className="sparkle s4">✨</span>
        </div>

        {/* Camber Cheerful Mascot Artwork */}
        <div className="complete-mascot-wrapper">
          <img
            src={welcomeImage}
            alt="Camber celebrating the completed journal"
            className="complete-mascot-img"
          />
        </div>

        {/* Celebratory Headings */}
        <h1 className="complete-title">Your journal is complete!</h1>
        <p className="complete-subtitle">
          Thank you for sharing a little about yourself. Now Camber can make
          your learning journey feel more like <em>YOU!</em>
        </p>

        {/* Pedagogical Profile Summary Pill Row */}
        <div className="completion-milestones-row">
          <div className="milestone-badge m-habits">
            <span className="m-icon">🌱</span>
            <span className="m-text">Habits Profiled</span>
          </div>
          <div className="milestone-badge m-focus">
            <span className="m-icon">🎯</span>
            <span className="m-text">Focus Calibrated</span>
          </div>
          <div className="milestone-badge m-challenges">
            <span className="m-icon">🧭</span>
            <span className="m-text">Challenges Mapped</span>
          </div>
          <div className="milestone-badge m-bloom">
            <span className="m-icon">🌸</span>
            <span className="m-text">Learning Style Set</span>
          </div>
        </div>

        {/* Primary Finish Button */}
        <div className="complete-cta-row">
          <button
            type="button"
            className="complete-finish-button"
            onClick={onFinish}
            aria-label="Let's Start Learning - Return to Camber"
          >
            Let's Start Learning &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

