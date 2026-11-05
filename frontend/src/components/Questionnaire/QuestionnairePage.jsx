import React, { useState, useEffect } from 'react';
import JournalCover from './JournalCover';
import OpenJournal from './OpenJournal';
import QuestionnaireComplete from './QuestionnaireComplete';
import { QUESTIONS, SECTIONS } from './questionnaireData';
import { questionnaireService } from './questionnaireService';
import './Questionnaire.css';

/**
 * QuestionnairePage Controller Component
 * Manages the entire onboarding journal lifecycle:
 * 1. Closed Journal Cover screen
 * 2. Interactive 3D unfolding animation
 * 3. 15 Sequential questions across 4 sections in the two-page notebook
 * 4. Section tabs, validation, answer persistence, and final submission
 * 5. Celebratory completion screen
 */
export default function QuestionnairePage({ onNavigate }) {
  // Navigation / stage state: 'closed' | 'opening' | 'open' | 'completed'
  const [journalState, setJournalState] = useState('closed');

  // Active question index (0 to 14)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answers map: { [questionId]: string | string[] }
  const [answers, setAnswers] = useState(() => {
    const saved = questionnaireService.getSavedAnswers();
    return saved?.answers || {};
  });

  // Free text responses for "Other" / "Something else"
  const [otherTexts, setOtherTexts] = useState({});

  // Validation feedback message
  const [validationError, setValidationError] = useState('');

  // Page turn micro-animation state
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex] || QUESTIONS[0];
  const totalQuestions = QUESTIONS.length;

  // Determine completed section IDs based on answered questions
  const completedSectionIds = SECTIONS.filter((section) =>
    section.questionIndices.every((idx) => {
      const q = QUESTIONS[idx];
      const ans = answers[q.id];
      if (Array.isArray(ans)) return ans.length > 0;
      return Boolean(ans);
    })
  ).map((s) => s.id);

  // Scroll to top on question transition
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestionIndex, journalState]);

  // Transition from closed cover to open journal
  const handleBegin = () => {
    setJournalState('opening');
    setTimeout(() => {
      setJournalState('open');
    }, 600);
  };

  // Update answer for the current question
  const handleAnswerChange = (val) => {
    setValidationError('');
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  // Update free-text input for "Other" options
  const handleOtherTextChange = (val) => {
    setOtherTexts((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  };

  // Validate current question before proceeding
  const validateCurrentQuestion = () => {
    const currentVal = answers[currentQuestion.id];
    if (currentQuestion.type === 'multiple') {
      if (!Array.isArray(currentVal) || currentVal.length === 0) {
        setValidationError('Pick at least one option so Camber can write it down! 🐾');
        return false;
      }
    } else {
      if (!currentVal) {
        setValidationError('Pick an answer first so Camber can write it down! 🐾');
        return false;
      }
    }
    setValidationError('');
    return true;
  };

  // Navigate to next question or submit on final question
  const handleNext = async () => {
    if (!validateCurrentQuestion()) return;

    if (currentQuestionIndex < totalQuestions - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 250);
    } else {
      // Final submission of all 15 answers
      const submissionPayload = { ...answers };
      // Merge in any other free-text descriptions
      Object.keys(otherTexts).forEach((qId) => {
        if (otherTexts[qId] && otherTexts[qId].trim()) {
          submissionPayload[`${qId}_other_details`] = otherTexts[qId].trim();
        }
      });

      await questionnaireService.submitAnswers(submissionPayload);
      setJournalState('completed');
    }
  };

  // Navigate back to previous question or closed cover
  const handleBack = () => {
    setValidationError('');
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 200);
    } else {
      // Return to cover
      setJournalState('closed');
    }
  };

  // Jump to start of an already accessible section via tabs
  const handleSelectSection = (sectionId) => {
    const section = SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;
    const targetIndex = section.questionIndices[0];
    if (targetIndex !== currentQuestionIndex) {
      setValidationError('');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(targetIndex);
        setIsTransitioning(false);
      }, 200);
    }
  };

  // Final completion CTA navigation
  const handleFinish = () => {
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Quick return to home navigation
  const handleHomeClick = () => {
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="camber-questionnaire-app">
      {/* Top Brand Bar */}
      <header className="questionnaire-top-navbar">
        <button
          type="button"
          className="brand-pill-btn"
          onClick={handleHomeClick}
          title="Return to CAMBER Home"
        >
          <span className="brand-dot"></span>
          CAMBER
        </button>

        <div className="top-title-hint">
          {journalState === 'open' && (
            <span>
              Part {QUESTIONS[currentQuestionIndex]?.sectionId} of {SECTIONS.length} &bull;{' '}
              {SECTIONS[QUESTIONS[currentQuestionIndex]?.sectionId - 1]?.title}
            </span>
          )}
        </div>

        <button
          type="button"
          className="exit-to-home-link"
          onClick={handleHomeClick}
        >
          Exit to Home
        </button>
      </header>

      {/* Main Journal Display Stage */}
      <main className="questionnaire-main-viewport">
        {journalState === 'closed' || journalState === 'opening' ? (
          <div
            className={`cover-transition-shell ${
              journalState === 'opening' ? 'cover-is-opening' : ''
            }`}
          >
            <JournalCover onBegin={handleBegin} />
          </div>
        ) : journalState === 'open' ? (
          <OpenJournal
            question={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            currentAnswer={answers[currentQuestion.id]}
            otherText={otherTexts[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
            onOtherTextChange={handleOtherTextChange}
            onBack={handleBack}
            onNext={handleNext}
            validationError={validationError}
            completedSectionIds={completedSectionIds}
            onSelectSection={handleSelectSection}
            isTransitioning={isTransitioning}
          />
        ) : (
          <QuestionnaireComplete onFinish={handleFinish} />
        )}
      </main>
    </div>
  );
}

