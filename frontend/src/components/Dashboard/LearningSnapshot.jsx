import React from 'react';

export default function LearningSnapshot({ metrics, onViewDetails }) {
  // Use provided metrics or baseline figures matching the approved visual reference
  const stats = metrics || {
    studyTime: '2.5 hrs',
    studyTimeDelta: '↑ 15%',
    sessionsCompleted: '6',
    sessionsDelta: '↑ 25%',
    goalsWorkedOn: '4',
    goalsDelta: '↑ 20%',
    dayStreak: '8',
    streakDelta: '↑ 33%'
  };

  return (
    <section className="learning-snapshot-section" aria-label="Learning Snapshot">
      {/* Section Header */}
      <div className="section-header-row">
        <div className="section-title-with-icon">
          <span style={{ color: '#A0522D', fontSize: 18 }} aria-hidden="true">🌱</span>
          <h2>Your Learning Snapshot</h2>
        </div>
        <button
          type="button"
          className="section-view-link"
          onClick={() => onViewDetails && onViewDetails()}
        >
          View details &rarr;
        </button>
      </div>

      {/* 4 Pastel Metric Cards */}
      <div className="snapshot-cards-grid">
        {/* Card 1: Study time this week (Pastel Blue) */}
        <div className="snapshot-metric-card snapshot-card-blue">
          <div className="metric-circle-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="metric-number-value">{stats.studyTime}</div>
          <div className="metric-label-text">Study time this week</div>
          <div className="metric-delta-tag">{stats.studyTimeDelta}</div>
        </div>

        {/* Card 2: Sessions completed (Butter Yellow) */}
        <div className="snapshot-metric-card snapshot-card-yellow">
          <div className="metric-circle-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <div className="metric-number-value">{stats.sessionsCompleted}</div>
          <div className="metric-label-text">Sessions completed</div>
          <div className="metric-delta-tag">{stats.sessionsDelta}</div>
        </div>

        {/* Card 3: Goals worked on (Soft Sage Green) */}
        <div className="snapshot-metric-card snapshot-card-green">
          <div className="metric-circle-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="metric-number-value">{stats.goalsWorkedOn}</div>
          <div className="metric-label-text">Goals worked on</div>
          <div className="metric-delta-tag">{stats.goalsDelta}</div>
        </div>

        {/* Card 4: Day streak (Pastel Blush Pink) */}
        <div className="snapshot-metric-card snapshot-card-pink">
          <div className="metric-circle-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="metric-number-value">{stats.dayStreak}</div>
          <div className="metric-label-text">Day streak</div>
          <div className="metric-delta-tag">{stats.streakDelta}</div>
        </div>
      </div>
    </section>
  );
}
