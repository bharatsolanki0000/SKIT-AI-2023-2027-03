import React from 'react';
import QuestionContent from './QuestionContent';
import AnswerOptions from './AnswerOptions';
import { SectionTabs } from './QuestionnaireProgress';
import { SECTIONS } from './questionnaireData';

/**
 * OpenJournal Component
 * Recreates the two-page open journal spread matching Reference Image 2:
 * - Pastel blue hardcover backing
 * - Cream-coloured left and right pages with fine brown outlines
 * - Central vertical spiral binding rings down the spine
 * - Right-hand bookmark tabs (Habits, Focus, Challenges, Bloom)
 * - Page turn transition animations
 */
export default function OpenJournal({
  question,
  currentQuestionIndex,
  totalQuestions,
  currentAnswer,
  otherText,
  onAnswerChange,
  onOtherTextChange,
  onBack,
  onNext,
  validationError,
  completedSectionIds,
  onSelectSection,
  isTransitioning,
}) {
  const currentSection =
    SECTIONS.find((s) => s.id === question.sectionId) || SECTIONS[0];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div
      className={`open-journal-stage ${isTransitioning ? 'page-turning' : ''}`}
      aria-label={`Camber's Journal - Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
    >
      {/* Outer Hardcover Blue Trim */}
      <div className="open-journal-hardcover">
        {/* Left Page (Question & Progress) */}
        <div className="journal-page page-left">
          <QuestionContent
            question={question}
            currentSection={currentSection}
            currentQuestionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
          />
        </div>

        {/* Central Vertical Spiral Binding Spine */}
        <div className="center-spiral-spine" aria-hidden="true">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="center-spiral-ring">
              <span className="spine-hole hole-left"></span>
              <span className="spine-wire-loop"></span>
              <span className="spine-hole hole-right"></span>
            </div>
          ))}
        </div>

        {/* Right Page (Answers & Navigation) */}
        <div className="journal-page page-right">
          <AnswerOptions
            question={question}
            currentAnswer={currentAnswer}
            otherText={otherText}
            onAnswerChange={onAnswerChange}
            onOtherTextChange={onOtherTextChange}
            onBack={onBack}
            onNext={onNext}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            validationError={validationError}
          />
        </div>

        {/* Section Tabs Protruding Along the Right Edge */}
        <SectionTabs
          currentSectionId={currentSection.id}
          completedSectionIds={completedSectionIds}
          onSelectSection={onSelectSection}
        />
      </div>
    </div>
  );
}

