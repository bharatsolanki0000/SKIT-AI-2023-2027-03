import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import WelcomeBanner from './WelcomeBanner';
import StudySpaceCard from './StudySpaceCard';
import LearningSnapshot from './LearningSnapshot';
import QuickAccessSection from './QuickAccessSection';
import LearningPreferencesCard from './LearningPreferencesCard';
import CamberCorner from './CamberCorner';
import RecentActivityCard from './RecentActivityCard';
import ExtensionConnectModal from './ExtensionConnectModal';
import { questionnaireService } from '../Questionnaire/questionnaireService';
import './Dashboard.css';

export default function StudentDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isExtModalOpen, setIsExtModalOpen] = useState(false);
  const [selectedStudyParams, setSelectedStudyParams] = useState(null);
  const [activeFeatureModal, setActiveFeatureModal] = useState(null); // 'simpler' | 'quiz' | 'motivation' | 'break' | 'progress'

  // Student name: retrieve from storage or default to reference Alex
  const [studentName] = useState(() => {
    try {
      return (
        localStorage.getItem('camber_user_name') ||
        localStorage.getItem('camber_student_name') ||
        'Alex'
      );
    } catch {
      return 'Alex';
    }
  });

  // Learner profile state
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Check local questionnaire answers first for immediate render
    const localAnswers = questionnaireService.getSavedAnswers();
    if (localAnswers?.answers) {
      // Synthesize initial profile display values from local answers
      const q = localAnswers.answers;
      setProfile({
        preferred_explanation_style: q.Q14 || q.Q12 || 'Visual explanations',
        study_preferences: {
          session_duration_minutes: q.Q9 ? parseInt(q.Q9, 10) || 25 : 25
        }
      });
    }

    // 2. Fetch authenticated profile from backend if available
    questionnaireService.fetchProfile().then((remote) => {
      if (isMounted && remote) {
        setProfile(remote);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConnectExtension = (params) => {
    setSelectedStudyParams(params);
    setIsExtModalOpen(true);
  };

  const handleEditPreferences = () => {
    if (onNavigate) {
      onNavigate('/questionnaire');
    }
  };

  const handleViewProgress = () => {
    setActiveFeatureModal('progress');
  };

  const handleQuickAction = (cardId) => {
    setActiveFeatureModal(cardId);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('camber_id_token');
    } catch (e) {
      // ignore
    }
    if (onNavigate) {
      onNavigate('/');
    }
  };

  return (
    <div className="camber-dashboard-root">
      {/* 1. Left Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          if (tabId === 'study-space') {
            setIsExtModalOpen(true);
          } else if (tabId === 'my-progress') {
            setActiveFeatureModal('progress');
          } else if (tabId === 'settings') {
            setActiveFeatureModal('settings');
          }
        }}
        onNavigate={onNavigate}
      />

      {/* 2. Main Dashboard Wrapper */}
      <div className="dashboard-main-wrapper">
        {/* Top Header Bar */}
        <header className="dashboard-top-header" aria-label="Dashboard Top Bar">
          {/* Notification Bell */}
          <button
            type="button"
            className="header-action-btn"
            aria-label="View notifications"
            onClick={() => setActiveFeatureModal('notifications')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-badge-dot" aria-hidden="true" />
          </button>

          {/* User Profile Pill Menu */}
          <div className="user-profile-menu-container">
            <button
              type="button"
              className="user-profile-pill-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <div className="user-avatar-circle" aria-hidden="true">
                {studentName ? studentName.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="user-name-label">{studentName} Carter</span>
              <span style={{ fontSize: 11, color: '#70452F' }} aria-hidden="true">▼</span>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="user-menu-dropdown" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onNavigate) onNavigate('/questionnaire');
                  }}
                >
                  📝 Retake Questionnaire
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onNavigate) onNavigate('/');
                  }}
                >
                  🏡 Return to Home
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleLogout();
                  }}
                  style={{ color: '#D9534F' }}
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* 3. Central & Right Columns Layout */}
        <main className="dashboard-content-grid">
          {/* Main Content Column (Left/Center) */}
          <div className="center-column">
            {/* A. Welcome Banner */}
            <WelcomeBanner studentName={studentName} />

            {/* B. Study Space Card */}
            <StudySpaceCard onConnectExtension={handleConnectExtension} />

            {/* C. Your Learning Snapshot */}
            <LearningSnapshot onViewDetails={handleViewProgress} />

            {/* D. A Little Something for You */}
            <QuickAccessSection onActionClick={handleQuickAction} />
          </div>

          {/* Right Information Column */}
          <aside className="right-column" aria-label="Learning Preferences and Recent Activity">
            {/* A. Learning Preferences Card */}
            <LearningPreferencesCard
              profile={profile}
              onEdit={handleEditPreferences}
            />

            {/* B. Camber's Corner */}
            <CamberCorner />

            {/* C. Recent Activity */}
            <RecentActivityCard
              onViewAll={handleViewProgress}
            />
          </aside>
        </main>
      </div>

      {/* Extension Connection Modal */}
      <ExtensionConnectModal
        isOpen={isExtModalOpen}
        onClose={() => setIsExtModalOpen(false)}
        studyParams={selectedStudyParams}
      />

      {/* Feature Interaction Modals (Polished, Restrained Popups for Unbuilt Destinations) */}
      {activeFeatureModal && (
        <div className="dashboard-modal-backdrop" role="dialog" aria-modal="true">
          <div className="dashboard-modal-window">
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setActiveFeatureModal(null)}
              aria-label="Close dialog"
            >
              &times;
            </button>

            {/* Simpler Modal */}
            {activeFeatureModal === 'simpler' && (
              <>
                <div className="modal-header-section">
                  <div className="modal-badge-icon">📖</div>
                  <div className="modal-title-group">
                    <h3>Make it simpler</h3>
                    <p>AI-Powered Concept Clarifier</p>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, color: '#573522', lineHeight: 1.5 }}>
                  When you highlight confusing text on any web page with the <strong>CAMBER Chrome Extension</strong>, Camber breaks it down into intuitive analogies and step-by-step points tailored to your learning style!
                </p>
                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-modal-primary"
                    onClick={() => {
                      setActiveFeatureModal(null);
                      setIsExtModalOpen(true);
                    }}
                  >
                    Open Extension Setup &rarr;
                  </button>
                </div>
              </>
            )}

            {/* Quiz Modal */}
            {activeFeatureModal === 'quiz' && (
              <>
                <div className="modal-header-section">
                  <div className="modal-badge-icon">📝</div>
                  <div className="modal-title-group">
                    <h3>Quick quiz</h3>
                    <p>Interactive Knowledge Checks</p>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, color: '#573522', lineHeight: 1.5 }}>
                  Active quizzes are generated in real-time during your study sessions based on the articles you read. Launch the <strong>CAMBER Extension</strong> while studying to test your knowledge!
                </p>
                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-modal-primary"
                    onClick={() => {
                      setActiveFeatureModal(null);
                      setIsExtModalOpen(true);
                    }}
                  >
                    Connect Extension &rarr;
                  </button>
                </div>
              </>
            )}

            {/* Motivation Modal */}
            {activeFeatureModal === 'motivation' && (
              <>
                <div className="modal-header-section">
                  <div className="modal-badge-icon">🏆</div>
                  <div className="modal-title-group">
                    <h3>A little motivation</h3>
                    <p>Camber's Thought of the Day</p>
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFF5DC', border: '1.5px solid #F6DF9C', borderRadius: 14, padding: '16px', textAlign: 'center', fontStyle: 'italic', fontFamily: 'Patrick Hand, cursive', fontSize: 18, color: '#573522' }}>
                  "Like Camber gathering acorns for winter, every little fact you learn today grows into tomorrow's wisdom! Be gentle with yourself—you are making wonderful progress! 🌰✨"
                </div>
                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-modal-primary"
                    onClick={() => setActiveFeatureModal(null)}
                  >
                    Thank you, Camber! 🐾
                  </button>
                </div>
              </>
            )}

            {/* Break Time Modal */}
            {activeFeatureModal === 'break' && (
              <>
                <div className="modal-header-section">
                  <div className="modal-badge-icon">🌿</div>
                  <div className="modal-title-group">
                    <h3>Take a little break</h3>
                    <p>Restorative Mini-Pause</p>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, color: '#573522', lineHeight: 1.5 }}>
                  Resting your eyes and taking deep breaths enhances memory retention:
                </p>
                <ul style={{ fontSize: 13, color: '#573522', paddingLeft: 20, lineHeight: 1.6, margin: 0 }}>
                  <li>Look 20 feet away into the distance for 20 seconds.</li>
                  <li>Drink a warm cup of water or tea.</li>
                  <li>Do 3 gentle neck stretches.</li>
                </ul>
                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-modal-primary"
                    onClick={() => setActiveFeatureModal(null)}
                  >
                    I Feel Refreshed &rarr;
                  </button>
                </div>
              </>
            )}

            {/* Progress Details Modal */}
            {activeFeatureModal === 'progress' && (
              <>
                <div className="modal-header-section">
                  <div className="modal-badge-icon">📊</div>
                  <div className="modal-title-group">
                    <h3>My Progress</h3>
                    <p>Study History & Emotion Insights</p>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, color: '#573522', lineHeight: 1.5 }}>
                  Detailed longitudinal emotion charts and session analytics will appear here as you log study sessions with the Camber Extension.
                </p>
                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-modal-primary"
                    onClick={() => setActiveFeatureModal(null)}
                  >
                    Back to Dashboard
                  </button>
                </div>
              </>
            )}

            {/* Notifications / Settings */}
            {(activeFeatureModal === 'notifications' || activeFeatureModal === 'settings') && (
              <>
                <div className="modal-header-section">
                  <div className="modal-badge-icon">🔔</div>
                  <div className="modal-title-group">
                    <h3>{activeFeatureModal === 'settings' ? 'Settings' : 'Notifications'}</h3>
                    <p>Preferences & Updates</p>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, color: '#573522', lineHeight: 1.5 }}>
                  All systems are running smoothly! Your study companion is ready whenever you are.
                </p>
                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-modal-primary"
                    onClick={() => setActiveFeatureModal(null)}
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
