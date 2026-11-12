import React, { useState } from 'react';

export default function StudySpaceCard({ onConnectExtension }) {
  const [topic, setTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [studyDuration, setStudyDuration] = useState('25');

  const subjects = [
    'Mathematics & Calculus',
    'Computer Science & Programming',
    'Physics & Chemistry',
    'Biology & Life Sciences',
    'History & Social Studies',
    'Literature & Languages',
    'Psychology & Philosophy'
  ];

  const durations = [
    { value: '15', label: 'Suggested time: 15 mins' },
    { value: '25', label: 'Suggested time: 25 mins (Default)' },
    { value: '35', label: 'Suggested time: 35 mins' },
    { value: '45', label: 'Suggested time: 45 mins' },
    { value: '60', label: 'Suggested time: 60 mins' }
  ];

  return (
    <section className="study-space-card" aria-label="Study Space Setup">
      {/* Left Column: Cozy Study Desk Watercolor SVG */}
      <div className="study-space-art-wrapper" aria-hidden="true">
        <svg
          viewBox="0 0 200 180"
          className="study-space-illustration-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft background glow */}
          <ellipse cx="100" cy="140" rx="85" ry="24" fill="#D3E7F7" fillOpacity="0.5" />
          <ellipse cx="100" cy="140" rx="65" ry="16" fill="#C1DEF4" fillOpacity="0.6" />

          {/* Stack of books on the left */}
          {/* Bottom Book (Warm Orange-Red) */}
          <path d="M22 136 C22 133 30 131 46 131 L82 131 C94 131 98 133 98 136 L98 144 C98 147 92 149 82 149 L46 149 C30 149 22 147 22 144 Z" fill="#D8785E" />
          <path d="M26 134 L82 134 C88 134 94 135 94 138 L94 142 L26 142 Z" fill="#FFF8EE" fillOpacity="0.9" />

          {/* Middle Book (Sage Green) */}
          <path d="M24 122 C24 120 32 118 48 118 L78 118 C88 118 94 120 94 122 L94 131 C94 133 88 135 78 135 L48 135 C32 135 24 133 24 131 Z" fill="#719463" />
          <path d="M28 121 L78 121 C84 121 90 122 90 125 L90 128 L28 128 Z" fill="#FFF8EE" fillOpacity="0.9" />

          {/* Top Book (Butter Yellow) */}
          <path d="M28 110 C28 108 34 106 50 106 L74 106 C84 106 90 108 90 110 L90 118 C90 120 84 122 74 122 L50 122 C34 122 28 120 28 118 Z" fill="#E6AE42" />
          <path d="M32 109 L74 109 C80 109 86 110 86 113 L86 116 L32 116 Z" fill="#FFF8EE" fillOpacity="0.9" />

          {/* Laptop in the center */}
          {/* Laptop Base */}
          <path d="M78 134 L138 134 C144 134 148 137 146 139 L142 141 L74 141 L70 139 C68 137 72 134 78 134 Z" fill="#A8C7DE" />
          {/* Laptop Screen Lid */}
          <path d="M76 96 L134 96 C137 96 139 98 138 102 L134 134 L76 134 L72 102 C71 98 73 96 76 96 Z" fill="#6791AF" />
          {/* Laptop Screen Display Area */}
          <path d="M80 100 L130 100 L127 130 L77 130 Z" fill="#4B7797" />
          {/* Screen Content lines */}
          <line x1="86" y1="108" x2="114" y2="108" stroke="#D3E8F6" strokeWidth="2" strokeLinecap="round" />
          <line x1="86" y1="114" x2="122" y2="114" stroke="#D3E8F6" strokeWidth="2" strokeLinecap="round" />
          <line x1="86" y1="120" x2="108" y2="120" stroke="#D3E8F6" strokeWidth="2" strokeLinecap="round" />
          {/* Little Paw on laptop back */}
          <circle cx="105" cy="118" r="3" fill="#F4D35E" />
          <circle cx="102" cy="113" r="1.3" fill="#F4D35E" />
          <circle cx="105" cy="111.5" r="1.3" fill="#F4D35E" />
          <circle cx="108" cy="113" r="1.3" fill="#F4D35E" />

          {/* Warm Coffee Mug with steam */}
          <rect x="146" y="120" width="16" height="20" rx="4" fill="#FAF1DF" stroke="#D3A56D" strokeWidth="1.5" />
          <path d="M162 124 C166 124 167 127 167 130 C167 133 164 135 162 135" fill="none" stroke="#D3A56D" strokeWidth="1.5" />
          {/* Small paw print on mug */}
          <circle cx="154" cy="130" r="2.2" fill="#D3A56D" />
          <circle cx="151.8" cy="126.8" r="0.9" fill="#D3A56D" />
          <circle cx="154" cy="125.5" r="0.9" fill="#D3A56D" />
          <circle cx="156.2" cy="126.8" r="0.9" fill="#D3A56D" />
          {/* Steam curls */}
          <path d="M151 114 C150 110 153 108 152 104" stroke="#B8A796" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M156 116 C155 112 158 110 157 106" stroke="#B8A796" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Potted Leafy Botanical Plant */}
          <path d="M106 82 C103 68 112 56 116 52 C116 60 114 74 106 82 Z" fill="#698D54" />
          <path d="M110 84 C116 70 128 62 134 58 C130 68 122 80 110 84 Z" fill="#7EAA66" />
          <path d="M105 84 C95 72 90 62 86 58 C92 68 98 78 105 84 Z" fill="#587A46" />
          <path d="M107 88 C106 78 102 70 96 66 C102 74 105 82 107 88 Z" fill="#719A5B" />
          {/* Plant Stems */}
          <path d="M108 96 Q108 86 109 80" stroke="#4C6E3B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Right Column: Interactive Study Options & Action Button */}
      <div className="study-space-content">
        {/* Category Pill */}
        <div className="study-space-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
          <span>Study Space</span>
        </div>

        <h2 className="study-space-heading">Ready to learn something new?</h2>
        <p className="study-space-subtext">Choose a topic and let's get started.</p>

        {/* Input & Selector Controls */}
        <div className="study-space-controls-group">
          {/* Topic search / text input */}
          <div className="input-with-icon-wrapper">
            <span className="input-icon-left" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="study-topic-input"
              placeholder="What would you like to study?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              aria-label="What would you like to study?"
            />
            <span className="input-chevron-right" aria-hidden="true">▼</span>
          </div>

          {/* Subject and Time Selector Row */}
          <div className="study-space-row-selectors">
            {/* Subject Selector */}
            <div className="input-with-icon-wrapper">
              <span className="input-icon-left" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </span>
              <select
                className="study-select-field"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                aria-label="Select Subject"
              >
                <option value="">Select Subject</option>
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
              <span className="input-chevron-right" aria-hidden="true">▼</span>
            </div>

            {/* Time Selector */}
            <div className="input-with-icon-wrapper">
              <span className="input-icon-left" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <select
                className="study-select-field"
                value={studyDuration}
                onChange={(e) => setStudyDuration(e.target.value)}
                aria-label="Suggested study duration"
              >
                {durations.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <span className="input-chevron-right" aria-hidden="true">▼</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            className="btn-connect-extension-cta"
            onClick={() => onConnectExtension && onConnectExtension({ topic, subject: selectedSubject, duration: studyDuration })}
          >
            <span>Connect with CAMBER Extension</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
