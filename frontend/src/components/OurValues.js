import React from 'react';
import valuesNoteImg from '../assets/values-note.png';
import { BotanicalSprig } from './BotanicalAccents';

export default function OurValues() {
  const values = [
    {
      id: 'curiosity',
      title: 'Curiosity',
      description: 'Stay curious. Ask questions. Explore.',
      bgColor: '#E3EED8',
      icon: (
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
          {/* Sprouting leaves */}
          <path d="M16 25 V14" stroke="#5D7C3F" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 18 C11 17 9 12 10 9 C13 9 16 12 16 18 Z" fill="#6E8E4F" />
          <path d="M16 16 C20 15 23 11 22 8 C18 8 16 11 16 16 Z" fill="#81A360" />
        </svg>
      ),
    },
    {
      id: 'personalization',
      title: 'Personalization',
      description: 'Because no two learners are exactly alike.',
      bgColor: '#F8D8DC',
      icon: (
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
          {/* Watercolor heart */}
          <path
            d="M16 24 C16 24 8 19 8 13.5 C8 10.5 10.5 8.5 13.5 8.5 C14.8 8.5 15.6 9 16 9.8 C16.4 9 17.2 8.5 18.5 8.5 C21.5 8.5 24 10.5 24 13.5 C24 19 16 24 16 24 Z"
            fill="#D66B78"
            opacity="0.88"
          />
        </svg>
      ),
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      description: 'Learning should be welcoming to everyone.',
      bgColor: '#D6EBF4',
      icon: (
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
          {/* Three welcoming figures */}
          <circle cx="16" cy="11" r="3.2" fill="#4B7C9D" />
          <path d="M11 22 C11 17.5 21 17.5 21 22" stroke="#4B7C9D" strokeWidth="2" strokeLinecap="round" />
          <circle cx="9" cy="13.5" r="2.4" fill="#6997B5" opacity="0.8" />
          <path d="M5.5 22 C5.5 18.5 12.5 18.5 12.5 22" stroke="#6997B5" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
          <circle cx="23" cy="13.5" r="2.4" fill="#6997B5" opacity="0.8" />
          <path d="M19.5 22 C19.5 18.5 26.5 18.5 26.5 22" stroke="#6997B5" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        </svg>
      ),
    },
    {
      id: 'growth',
      title: 'Growth',
      description: "Progress isn't always about getting everything right.",
      bgColor: '#FDF1D2',
      icon: (
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
          {/* Radiant blooming sun */}
          <circle cx="16" cy="16" r="5.5" fill="#E8A939" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <circle
              key={i}
              cx={16 + 9 * Math.cos((angle * Math.PI) / 180)}
              cy={16 + 9 * Math.sin((angle * Math.PI) / 180)}
              r="2"
              fill="#F5C453"
            />
          ))}
          <circle cx="16" cy="16" r="3" fill="#FCE9AA" opacity="0.7" />
        </svg>
      ),
    },
  ];

  return (
    <section id="values" className="values-section">
      <div className="values-container">
        {/* Header */}
        <div className="values-header">
          <h2 className="section-heading values-title">Our Values</h2>
          <p className="section-subline values-subtitle">Built around the learner.</p>
        </div>

        {/* Content Wrapper: 4 Values Grid + Pinned Paper Note */}
        <div className="values-content-layout">
          <div className="values-grid">
            {values.map((v) => (
              <div key={v.id} className="value-card">
                <div
                  className="value-icon-bubble"
                  style={{ backgroundColor: v.bgColor }}
                >
                  {v.icon}
                </div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.description}</p>
              </div>
            ))}
          </div>

          {/* Motivational Note on the far right */}
          <div className="values-note-container">
            <div className="values-note-card">
              <img
                src={valuesNoteImg}
                alt="Illustrated note: It's okay to grow at your own pace ♥"
                className="values-note-img"
              />
            </div>
            <div className="values-sprig-bottom" aria-hidden="true">
              <BotanicalSprig size={26} color="#687e50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

