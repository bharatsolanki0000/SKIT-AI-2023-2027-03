import React from 'react';
import { SECTIONS } from './questionnaireData';

/**
 * QuestionnaireProgress Component
 * Renders the top badges, question counter, and dynamic progress bar.
 */
export function TopProgressHeader({ currentSection, currentQuestionNumber, totalQuestions }) {
  const percentage = Math.round((currentQuestionNumber / totalQuestions) * 100);

  return (
    <div className="journal-progress-header">
      {/* Badges Row */}
      <div className="progress-badges-row">
        <span className="part-badge">
          Part {currentSection.partNumber} of {SECTIONS.length}
        </span>
        <span
          className="section-name-badge"
          style={{ backgroundColor: currentSection.badgeBg }}
        >
          {currentSection.shortName}
        </span>
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="progress-bar-row">
        <div
          className="progress-bar-track"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={`Questionnaire progress: ${percentage}%`}
        >
          <div
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <span className="question-counter-label">
          Question {currentQuestionNumber} of {totalQuestions}
        </span>
      </div>
    </div>
  );
}

/**
 * SectionTabs Component
 * Renders the 4 vertical bookmark tabs protruding from the right edge of the journal.
 */
export function SectionTabs({ currentSectionId, completedSectionIds, onSelectSection }) {
  return (
    <div className="journal-tabs-column" aria-label="Questionnaire Sections">
      {SECTIONS.map((section) => {
        const isActive = section.id === currentSectionId;
        const isCompleted = completedSectionIds.includes(section.id);
        const isAccessible = isCompleted || isActive;

        return (
          <button
            key={section.id}
            type="button"
            className={`journal-tab ${isActive ? 'tab-active' : ''} ${
              isCompleted ? 'tab-completed' : ''
            }`}
            style={{
              backgroundColor: isActive ? section.activeColor : section.color,
            }}
            onClick={() => {
              if (isAccessible && onSelectSection) {
                onSelectSection(section.id);
              }
            }}
            disabled={!isAccessible}
            title={
              isActive
                ? `Current: Part ${section.partNumber} - ${section.title}`
                : isCompleted
                ? `Completed: Part ${section.partNumber} - ${section.title}`
                : `Part ${section.partNumber} - Answer earlier questions first`
            }
          >
            <span className="tab-number">{section.tabNumber}</span>
            <span className="tab-label">{section.tabLabel}</span>
            {isCompleted && !isActive && (
              <span className="tab-checkmark" aria-hidden="true">✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

