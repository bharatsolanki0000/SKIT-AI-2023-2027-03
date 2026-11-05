import React from 'react';

/**
 * AnswerOptions Component
 * Renders the Right Page of the open journal:
 * - Alternating pastel selection cards (pale blue and butter yellow)
 * - Custom circular radio buttons for single-choice questions
 * - Custom rounded checkboxes for multiple-choice questions
 * - Dynamic "None of these" mutual exclusivity handling
 * - Optional free-text field when "Other" / "Something else" is checked
 * - Bottom navigation buttons (Back and Next/Submit)
 * - Friendly validation error toast
 */
export default function AnswerOptions({
  question,
  currentAnswer,
  otherText,
  onAnswerChange,
  onOtherTextChange,
  onBack,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  validationError,
}) {
  const isMultiple = question.type === 'multiple';

  // Handle single choice selection
  const handleSingleSelect = (option) => {
    onAnswerChange(option);
  };

  // Handle multiple choice selection
  const handleMultipleToggle = (option) => {
    let current = Array.isArray(currentAnswer) ? [...currentAnswer] : [];

    // Question 8 Special Rule: "None of these" is mutually exclusive
    if (question.noneOption) {
      if (option === question.noneOption) {
        // Selecting "None of these" clears all other options
        current = current.includes(question.noneOption) ? [] : [question.noneOption];
        onAnswerChange(current);
        return;
      } else {
        // Selecting any other option clears "None of these"
        current = current.filter((item) => item !== question.noneOption);
      }
    }

    if (current.includes(option)) {
      current = current.filter((item) => item !== option);
    } else {
      current.push(option);
    }

    onAnswerChange(current);
  };

  const isOptionSelected = (option) => {
    if (isMultiple) {
      return Array.isArray(currentAnswer) && currentAnswer.includes(option);
    }
    return currentAnswer === option;
  };

  const showOtherInput =
    question.hasOther &&
    question.otherOption &&
    isOptionSelected(question.otherOption);

  return (
    <div className="right-page-content">
      {/* Options Stack */}
      <div
        className="options-stack"
        role={isMultiple ? 'group' : 'radiogroup'}
        aria-label={question.question}
      >
        {question.options.map((option, idx) => {
          const selected = isOptionSelected(option);
          // Alternating pastel color: even index = soft blue, odd index = soft yellow
          const colorVariant = idx % 2 === 0 ? 'opt-blue' : 'opt-yellow';

          return (
            <div
              key={option}
              className={`answer-option-card ${colorVariant} ${
                selected ? 'opt-selected' : ''
              }`}
              onClick={() => {
                if (isMultiple) {
                  handleMultipleToggle(option);
                } else {
                  handleSingleSelect(option);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  if (isMultiple) {
                    handleMultipleToggle(option);
                  } else {
                    handleSingleSelect(option);
                  }
                }
              }}
              tabIndex={0}
              role={isMultiple ? 'checkbox' : 'radio'}
              aria-checked={selected}
            >
              {/* Radio or Checkbox Indicator */}
              <div className="option-indicator" aria-hidden="true">
                {isMultiple ? (
                  <div className={`checkbox-box ${selected ? 'checked' : ''}`}>
                    {selected && (
                      <svg
                        width="14"
                        height="12"
                        viewBox="0 0 14 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 6L5 9.5L12.5 1.5"
                          stroke="#75452F"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                ) : (
                  <div className={`radio-circle ${selected ? 'checked' : ''}`}>
                    {selected && <div className="radio-inner-dot"></div>}
                  </div>
                )}
              </div>

              {/* Option Text Label */}
              <span className="option-label">{option}</span>
            </div>
          );
        })}

        {/* Optional Other / Something Else Text Field */}
        {showOtherInput && (
          <div className="other-input-container">
            <input
              type="text"
              className="other-text-input"
              value={otherText || ''}
              onChange={(e) => onOtherTextChange(e.target.value)}
              placeholder="Tell Camber a bit more... (optional)"
              aria-label="Additional details for selected option"
              maxLength={120}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Gentle Validation Message Toast */}
      {validationError && (
        <div className="validation-error-toast" role="alert" aria-live="assertive">
          <span className="validation-paw" aria-hidden="true">🐾</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="journal-navigation-row">
        <button
          type="button"
          className="journal-nav-button btn-back"
          onClick={onBack}
          aria-label="Go to previous question or journal cover"
        >
          &larr; Back
        </button>

        <button
          type="button"
          className={`journal-nav-button btn-next ${
            isLastQuestion ? 'btn-submit' : ''
          }`}
          onClick={onNext}
          aria-label={isLastQuestion ? 'Submit questionnaire' : 'Go to next question'}
        >
          {isLastQuestion ? 'Submit \u2192' : 'Next \u2192'}
        </button>
      </div>
    </div>
  );
}

