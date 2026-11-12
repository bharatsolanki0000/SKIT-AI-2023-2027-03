import React from 'react';

export default function LearningPreferencesCard({ profile, onEdit }) {
  // Derive display values from real profile or questionnaire answers if available
  const getStyleDisplay = () => {
    if (!profile) return { title: 'Visual explanations', desc: 'A preferred way to explore new topics' };
    const style = profile.preferred_explanation_style || '';
    if (style.toLowerCase().includes('visual')) {
      return { title: 'Visual explanations', desc: 'A preferred way to explore new topics' };
    }
    if (style.toLowerCase().includes('step')) {
      return { title: 'Step-by-step breakdowns', desc: 'Systematic structured learning' };
    }
    if (style.toLowerCase().includes('analogy')) {
      return { title: 'Analogies & stories', desc: 'Connecting ideas to familiar concepts' };
    }
    if (style.toLowerCase().includes('detailed')) {
      return { title: 'Detailed explanations', desc: 'Thorough, in-depth material' };
    }
    return { title: 'Simple explanations', desc: 'Clear, gentle, concise concepts' };
  };

  const getDurationDisplay = () => {
    if (!profile?.study_preferences?.session_duration_minutes) {
      return { title: '30–45 minutes', desc: 'Usual focus duration' };
    }
    const mins = profile.study_preferences.session_duration_minutes;
    return { title: `${mins} minutes`, desc: 'Usual focus duration' };
  };

  const styleInfo = getStyleDisplay();
  const durationInfo = getDurationDisplay();

  const preferencesList = [
    {
      id: 'style',
      iconClass: 'badge-purple',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      headline: styleInfo.title,
      subdescription: styleInfo.desc
    },
    {
      id: 'duration',
      iconClass: 'badge-yellow',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      headline: durationInfo.title,
      subdescription: durationInfo.desc
    },
    {
      id: 'approach',
      iconClass: 'badge-green',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19.5 13.5a2.5 2.5 0 0 0-2.5-2.5h-1V9a2.5 2.5 0 0 0-5 0v2h-1a2.5 2.5 0 0 0 0 5h1v2a2.5 2.5 0 0 0 5 0v-2h1a2.5 2.5 0 0 0 2.5-2.5z" />
        </svg>
      ),
      headline: 'Step-by-step examples',
      subdescription: 'Helpful when topics get difficult'
    },
    {
      id: 'environment',
      iconClass: 'badge-blue',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      ),
      headline: 'Minimal distractions',
      subdescription: 'Works best in a quiet environment'
    },
    {
      id: 'motivation',
      iconClass: 'badge-gold',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      headline: 'Motivated by progress',
      subdescription: 'Likes seeing steady improvement'
    }
  ];

  return (
    <div className="preferences-info-card" aria-label="Your Learning Preferences">
      {/* Top Action Header */}
      <div className="card-top-action-header">
        <div className="preferences-title-group">
          <span style={{ fontSize: 16 }} aria-hidden="true">🍃</span>
          <h3>Your Learning Preferences</h3>
        </div>
        <button
          type="button"
          className="card-pill-action-btn"
          onClick={() => onEdit && onEdit()}
        >
          Edit
        </button>
      </div>

      {/* 5 Preferences Rows */}
      <div className="preferences-items-list">
        {preferencesList.map((item) => (
          <div key={item.id} className="preference-item-row">
            <div className={`pref-round-icon-badge ${item.iconClass}`} aria-hidden="true">
              {item.icon}
            </div>
            <div className="pref-texts-group">
              <span className="pref-headline">{item.headline}</span>
              <span className="pref-subdescription">{item.subdescription}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <p className="preferences-footer-note">
        These preferences come from your initial questionnaire and can be updated anytime.
      </p>
    </div>
  );
}
