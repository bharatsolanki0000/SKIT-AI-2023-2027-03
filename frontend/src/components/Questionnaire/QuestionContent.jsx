import React from 'react';
import { TopProgressHeader } from './QuestionnaireProgress';

/**
 * QuestionContent Component
 * Displays the Left Page of the open journal:
 * - Progress indicators and section badges
 * - Question heading in warm storybook typography
 * - Helper instruction with yellow watercolor brush underline
 * - Subtle notebook paper ruling lines
 */
export default function QuestionContent({
  question,
  currentSection,
  currentQuestionNumber,
  totalQuestions,
}) {
  return (
    <div className="left-page-content">
      {/* Top Progress and Section Status */}
      <TopProgressHeader
        currentSection={currentSection}
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={totalQuestions}
      />

      {/* Main Question Text Container */}
      <div className="question-text-area">
        <h2 className="question-heading">{question.question}</h2>

        {/* Instruction with Yellow Brushstroke Underline */}
        {question.instruction && (
          <div className="question-instruction-wrapper">
            <p className="question-instruction">{question.instruction}</p>
            <div className="yellow-brushstroke-underline" aria-hidden="true"></div>
          </div>
        )}
      </div>

      {/* Soft Notebook Paper Ruling Lines Decorating the Lower Page */}
      <div className="notebook-ruled-lines" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Subtle Corner Paw Print Watermark */}
      <div className="page-watermark-paw" aria-hidden="true">
        <svg
          width="28"
          height="28"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 36C17.5 36 14.5 32 15 28C15.5 24 19 23 22 23C25 23 28.5 24 29 28C29.5 32 26.5 36 22 36Z"
            fill="#75452F"
            fillOpacity="0.12"
          />
          <ellipse
            cx="12"
            cy="20"
            rx="3.5"
            ry="5"
            transform="rotate(-20 12 20)"
            fill="#75452F"
            fillOpacity="0.10"
          />
          <ellipse
            cx="18.5"
            cy="14"
            rx="3.5"
            ry="5.5"
            transform="rotate(-8 18.5 14)"
            fill="#75452F"
            fillOpacity="0.12"
          />
          <ellipse
            cx="25.5"
            cy="14"
            rx="3.5"
            ry="5.5"
            transform="rotate(8 25.5 14)"
            fill="#75452F"
            fillOpacity="0.12"
          />
          <ellipse
            cx="32"
            cy="20"
            rx="3.5"
            ry="5"
            transform="rotate(20 32 20)"
            fill="#75452F"
            fillOpacity="0.10"
          />
        </svg>
      </div>
    </div>
  );
}

