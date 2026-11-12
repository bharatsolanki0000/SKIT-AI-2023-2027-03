import React from 'react';
import squirrelReadingImg from '../../assets/squirrel-reading.png';

export default function DashboardSidebar({ activeTab = 'dashboard', onSelectTab, onNavigate }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V20a1 1 0 001 1h12a1 1 0 001-1V9.5" />
          <path d="M9 21V12h6v9" />
        </svg>
      )
    },
    {
      id: 'study-space',
      label: 'Study Space',
      subtitle: 'Start or resume learning',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      )
    },
    {
      id: 'my-progress',
      label: 'My Progress',
      subtitle: 'Study history and insights',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
      )
    },
    {
      id: 'learning-profile',
      label: 'My Learning Profile',
      subtitle: 'Questionnaire and preferences',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      subtitle: 'Account and accessibility',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      )
    }
  ];

  const handleNavClick = (item) => {
    if (item.id === 'learning-profile') {
      if (onNavigate) {
        onNavigate('/questionnaire');
        return;
      }
    }
    if (onSelectTab) {
      onSelectTab(item.id);
    }
  };

  const handleBrandClick = () => {
    if (onNavigate) {
      onNavigate('/');
    }
  };

  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard Sidebar">
      <div className="sidebar-top">
        {/* Brand Wordmark with Paw Prints */}
        <button
          type="button"
          className="sidebar-brand"
          onClick={handleBrandClick}
          title="Return to CAMBER Home"
        >
          <div className="brand-text-container">
            <span className="sidebar-brand-title">CAMBER.</span>
            <span className="brand-paws-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <ellipse cx="7.5" cy="7" rx="2" ry="2.6" />
                <ellipse cx="12" cy="5.5" rx="2" ry="2.6" />
                <ellipse cx="16.5" cy="7" rx="2" ry="2.6" />
                <path d="M12 9.5c-3.2 0-5.5 2.2-5.5 5.5 0 2.4 1.8 4 5.5 4s5.5-1.6 5.5-4c0-3.3-2.3-5.5-5.5-5.5z" />
              </svg>
            </span>
          </div>
        </button>

        {/* Navigation Items */}
        <nav aria-label="Sidebar Menu">
          <ul className="sidebar-nav-list">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <li key={item.id} className="sidebar-nav-item">
                  <button
                    type="button"
                    className={`sidebar-nav-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleNavClick(item)}
                    aria-current={isSelected ? 'page' : undefined}
                  >
                    <span className="nav-icon-wrapper" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="nav-label-group">
                      <span className="nav-main-label">{item.label}</span>
                      {item.subtitle && (
                        <span className="nav-sub-label">{item.subtitle}</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Mascot reading book */}
      <div className="sidebar-bottom-mascot" aria-hidden="true">
        <div className="mascot-speech-bubble">
          Small steps make big progress!
          <span className="heart-icon">♥</span>
          <span className="speech-bubble-tail" />
        </div>
        <img
          src={squirrelReadingImg}
          alt="Camber squirrel mascot reading a book"
          className="sidebar-reading-squirrel-img"
        />
      </div>
    </aside>
  );
}
