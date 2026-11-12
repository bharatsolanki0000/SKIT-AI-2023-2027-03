import React from 'react';

export default function RecentActivityCard({ activities, onViewAll }) {
  const defaultActivities = [
    {
      id: 1,
      topic: 'Introduction to Neural Networks',
      date: 'Apr 23, 2025',
      duration: '32 mins',
      iconBg: '#E1EDF7',
      iconColor: '#3B7DA5',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      )
    },
    {
      id: 2,
      topic: 'Photosynthesis Basics',
      date: 'Apr 21, 2025',
      duration: '28 mins',
      iconBg: '#E2EED7',
      iconColor: '#538837',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    },
    {
      id: 3,
      topic: 'World War II Overview',
      date: 'Apr 19, 2025',
      duration: '45 mins',
      iconBg: '#FCE7DF',
      iconColor: '#C46B46',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    }
  ];

  const list = activities && activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="recent-activity-card" aria-label="Your Recent Activity">
      {/* Header */}
      <div className="card-top-action-header">
        <div className="recent-activity-title-group">
          <span style={{ fontSize: 16 }} aria-hidden="true">🌱</span>
          <h3>Your Recent Activity</h3>
        </div>
        <button
          type="button"
          className="section-view-link"
          onClick={() => onViewAll && onViewAll()}
        >
          View all &rarr;
        </button>
      </div>

      {/* Activity List */}
      <div className="activity-items-list">
        {list.map((item) => (
          <div key={item.id} className="activity-item-row">
            <div
              className="activity-icon-badge"
              style={{ backgroundColor: item.iconBg, color: item.iconColor }}
              aria-hidden="true"
            >
              {item.icon}
            </div>
            <div className="activity-texts-group">
              <span className="activity-topic-title">{item.topic}</span>
              <span className="activity-meta-details">{item.date} • {item.duration}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Botanical Sprig Decor */}
      <div className="activity-corner-decor" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
          <path d="M36 36 C24 34 16 26 12 12" stroke="#6C8C56" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 12 C14 8 20 6 22 10 C24 14 18 16 12 12 Z" fill="#88A872" />
          <path d="M22 24 C26 21 31 22 30 27 C29 32 23 29 22 24 Z" fill="#A2C08C" />
          <path d="M16 20 C14 16 18 13 22 15 C26 17 20 23 16 20 Z" fill="#7A9A64" />
        </svg>
      </div>
    </div>
  );
}
