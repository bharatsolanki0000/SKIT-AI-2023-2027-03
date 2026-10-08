import React, { useState } from 'react';
import { ButterflyAccent, BotanicalSprig } from './BotanicalAccents';

export default function FAQSection() {
  // Allow multiple or single open items
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const leftColumnFAQs = [
    {
      id: 'faq-1',
      question: 'What is Camber?',
      answer:
        'Camber is an emotion-aware study companion designed to make learning feel more personal, engaging, and enjoyable. It adapts gently to your progress and helps you stay curious.',
    },
    {
      id: 'faq-2',
      question: 'Who is Camber for?',
      answer:
        'Camber is made for students, independent self-learners, and anyone who wants a supportive, low-stress space to learn and explore ideas at their own pace.',
    },
    {
      id: 'faq-3',
      question: 'How does Camber personalize my experience?',
      answer:
        'Camber observes your learning patterns, pace, and energy levels to adjust explanations, recommendations, and study prompts to what works best for you.',
    },
    {
      id: 'faq-4',
      question: 'Do I need an account to explore Camber?',
      answer:
        'You can freely explore lessons, exercises, and companion features without an account. Creating a free account lets Camber remember your preferences and progress.',
    },
  ];

  const rightColumnFAQs = [
    {
      id: 'faq-5',
      question: 'Is Camber free?',
      answer:
        'Yes! The core Camber companion and essential learning tools are completely free for students and lifelong learners.',
    },
    {
      id: 'faq-6',
      question: 'What devices can I use Camber on?',
      answer:
        'Camber is accessible in any modern web browser across desktop computers, laptops, tablets, and mobile devices.',
    },
    {
      id: 'faq-7',
      question: 'How does Camber handle my data?',
      answer:
        'Your privacy and trust are our top priorities. Your study habits and data remain completely confidential, secured, and are never sold to third parties.',
    },
    {
      id: 'faq-8',
      question: 'Is Camber accessible for different learning needs?',
      answer:
        'Yes. Camber is intentionally designed with adjustable pacing, calm color palettes, high contrast support, and screen-reader friendliness for neurodivergent and diverse learners.',
    },
  ];

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        {/* Header */}
        <div className="faq-header">
          <h2 className="section-heading faq-title">Frequently Asked Questions</h2>
          <p className="section-subline faq-subtitle">Questions? We've got you.</p>

          <div className="faq-butterfly-decor" aria-hidden="true">
            <ButterflyAccent size={24} />
          </div>
        </div>

        {/* 2 Columns on Desktop */}
        <div className="faq-columns-grid">
          {/* Left Column */}
          <div className="faq-column">
            {leftColumnFAQs.map((item) => {
              const isOpen = !!openItems[item.id];
              return (
                <div
                  key={item.id}
                  className={`faq-card ${isOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <span className="faq-toggle-icon" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p className="faq-answer-text">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="faq-column">
            {rightColumnFAQs.map((item) => {
              const isOpen = !!openItems[item.id];
              return (
                <div
                  key={item.id}
                  className={`faq-card ${isOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <span className="faq-toggle-icon" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p className="faq-answer-text">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="faq-botanical-bottom" aria-hidden="true">
          <BotanicalSprig size={30} color="#698150" />
        </div>
      </div>
    </section>
  );
}

