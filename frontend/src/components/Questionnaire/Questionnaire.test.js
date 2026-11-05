import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuestionnairePage from './QuestionnairePage';
import { QUESTIONS } from './questionnaireData';
import { questionnaireService } from './questionnaireService';

// Allow sufficient timeout for animated question transitions in Jest
jest.setTimeout(25000);

describe('CAMBER Onboarding Questionnaire Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('SCREEN 1: renders the closed journal welcome screen with Camber mascot, title, and begin button', () => {
    render(<QuestionnairePage onNavigate={jest.fn()} />);

    // Verify mascot speech bubble
    expect(
      screen.getByText(/I've got a little journal for us to fill!/i)
    ).toBeInTheDocument();

    // Verify journal cover title
    expect(screen.getByText(/Camber's Journal/i)).toBeInTheDocument();

    // Verify primary begin button
    const beginBtn = screen.getByRole('button', { name: /Let's begin/i });
    expect(beginBtn).toBeInTheDocument();
  });

  test('SCREEN 2: clicking "Let\'s begin" opens the two-page journal and presents Question 1', async () => {
    const { container } = render(<QuestionnairePage onNavigate={jest.fn()} />);

    const beginBtn = screen.getByRole('button', { name: /Let's begin/i });
    fireEvent.click(beginBtn);

    // Wait for the opening animation transition
    await waitFor(
      () => {
        expect(
          screen.getByText(QUESTIONS[0].question)
        ).toBeInTheDocument();
      },
      { timeout: 1500 }
    );

    // Verify section badges and question progress
    const partBadge = container.querySelector('.part-badge');
    expect(partBadge).toHaveTextContent(/Part 1 of 4/i);
    const sectionBadge = container.querySelector('.section-name-badge');
    expect(sectionBadge).toHaveTextContent(/Habits/i);
    expect(screen.getByText(/Question 1 of 15/i)).toBeInTheDocument();

    // Verify Back and Next buttons
    expect(container.querySelector('.btn-back')).toBeInTheDocument();
    expect(container.querySelector('.btn-next')).toBeInTheDocument();
  });

  test('validates that an answer must be selected before proceeding', async () => {
    const { container } = render(<QuestionnairePage onNavigate={jest.fn()} />);

    // Open journal
    fireEvent.click(screen.getByRole('button', { name: /Let's begin/i }));
    await waitFor(() => {
      expect(screen.getByText(QUESTIONS[0].question)).toBeInTheDocument();
    });

    // Attempt to click Next without selecting an answer
    fireEvent.click(container.querySelector('.btn-next'));

    // Expect gentle validation message
    expect(
      screen.getByText(/Pick an answer first so Camber can write it down!/i)
    ).toBeInTheDocument();

    // Verify still on Question 1
    expect(screen.getByText(/Question 1 of 15/i)).toBeInTheDocument();
  });

  test('single-choice radio selection, Next navigation, and Back navigation with answer persistence', async () => {
    const { container } = render(<QuestionnairePage onNavigate={jest.fn()} />);

    // Open journal
    fireEvent.click(screen.getByRole('button', { name: /Let's begin/i }));
    await waitFor(() => {
      expect(screen.getByText(QUESTIONS[0].question)).toBeInTheDocument();
    });

    // Select "Often" on Question 1
    const optionOften = screen.getByText('Often');
    fireEvent.click(optionOften);

    // Advance to Question 2
    fireEvent.click(container.querySelector('.btn-next'));
    await waitFor(() => {
      expect(screen.getByText(QUESTIONS[1].question)).toBeInTheDocument();
    });
    expect(screen.getByText(/Question 2 of 15/i)).toBeInTheDocument();

    // Navigate back to Question 1
    fireEvent.click(container.querySelector('.btn-back'));
    await waitFor(() => {
      expect(screen.getByText(QUESTIONS[0].question)).toBeInTheDocument();
    });

    // Verify "Often" option remains selected (card has opt-selected class)
    const card = screen.getByText('Often').closest('.answer-option-card');
    expect(card).toHaveClass('opt-selected');
  });

  test('Question 8: verifies "None of these" mutual exclusivity rule', async () => {
    const { container } = render(<QuestionnairePage onNavigate={jest.fn()} />);

    // Open journal
    fireEvent.click(screen.getByRole('button', { name: /Let's begin/i }));
    await waitFor(() => {
      expect(screen.getByText(QUESTIONS[0].question)).toBeInTheDocument();
    });

    // Navigate to Question 8 (index 7)
    for (let i = 0; i < 7; i++) {
      const q = QUESTIONS[i];
      const opt = screen.getByText(q.options[0]);
      fireEvent.click(opt);
      fireEvent.click(container.querySelector('.btn-next'));
      await waitFor(() => {
        expect(screen.getByText(QUESTIONS[i + 1].question)).toBeInTheDocument();
      });
    }

    // Now on Question 8: "Which situations make studying difficult for you?"
    expect(screen.getByText(QUESTIONS[7].question)).toBeInTheDocument();

    // Select multiple regular options
    const optFocused = screen.getByText('Staying focused');
    const optStarted = screen.getByText('Getting started');
    const optNone = screen.getByText('None of these');

    fireEvent.click(optFocused);
    fireEvent.click(optStarted);

    expect(optFocused.closest('.answer-option-card')).toHaveClass('opt-selected');
    expect(optStarted.closest('.answer-option-card')).toHaveClass('opt-selected');
    expect(optNone.closest('.answer-option-card')).not.toHaveClass('opt-selected');

    // Clicking "None of these" must clear other options
    fireEvent.click(optNone);
    expect(optNone.closest('.answer-option-card')).toHaveClass('opt-selected');
    expect(optFocused.closest('.answer-option-card')).not.toHaveClass('opt-selected');
    expect(optStarted.closest('.answer-option-card')).not.toHaveClass('opt-selected');

    // Clicking a regular option must clear "None of these"
    fireEvent.click(optStarted);
    expect(optStarted.closest('.answer-option-card')).toHaveClass('opt-selected');
    expect(optNone.closest('.answer-option-card')).not.toHaveClass('opt-selected');
  });

  test('Question 9: selecting "Something else" displays the optional text input', async () => {
    const { container } = render(<QuestionnairePage onNavigate={jest.fn()} />);

    // Open journal
    fireEvent.click(screen.getByRole('button', { name: /Let's begin/i }));
    await waitFor(() => {
      expect(screen.getByText(QUESTIONS[0].question)).toBeInTheDocument();
    });

    // Advance to Question 9 (index 8)
    for (let i = 0; i < 8; i++) {
      const q = QUESTIONS[i];
      const opt = screen.getByText(q.options[0]);
      fireEvent.click(opt);
      fireEvent.click(container.querySelector('.btn-next'));
      await waitFor(() => {
        expect(screen.getByText(QUESTIONS[i + 1].question)).toBeInTheDocument();
      });
    }

    // Verify Question 9 is displayed
    expect(screen.getByText(QUESTIONS[8].question)).toBeInTheDocument();

    // Select "Something else"
    const optSomethingElse = screen.getByText('Something else');
    fireEvent.click(optSomethingElse);

    // Optional text input should appear
    const otherInput = screen.getByPlaceholderText(/Tell Camber a bit more\.\.\./i);
    expect(otherInput).toBeInTheDocument();

    // Type in custom reason
    fireEvent.change(otherInput, { target: { value: 'Daydreaming about adventures' } });
    expect(otherInput.value).toBe('Daydreaming about adventures');
  });

  test('SCREEN 3: completes all 15 questions and verifies submission and completion screen', async () => {
    const mockNavigate = jest.fn();
    const { container } = render(<QuestionnairePage onNavigate={mockNavigate} />);

    // Open journal
    fireEvent.click(screen.getByRole('button', { name: /Let's begin/i }));
    await waitFor(() => {
      expect(screen.getByText(QUESTIONS[0].question)).toBeInTheDocument();
    });

    // Answer all 15 questions sequentially
    for (let i = 0; i < 15; i++) {
      const q = QUESTIONS[i];
      const opt = screen.getByText(q.options[0]);
      fireEvent.click(opt);

      if (i < 14) {
        fireEvent.click(container.querySelector('.btn-next'));
        await waitFor(() => {
          expect(screen.getByText(QUESTIONS[i + 1].question)).toBeInTheDocument();
        });
      }
    }

    // On Question 15, verify Submit button is present
    const submitBtn = container.querySelector('.btn-submit');
    expect(submitBtn).toBeInTheDocument();

    // Submit the questionnaire
    fireEvent.click(submitBtn);

    // Completion screen should appear
    await waitFor(() => {
      expect(screen.getByText(/Your journal is complete!/i)).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Thank you for sharing a little about yourself\./i)
    ).toBeInTheDocument();

    // Verify persistence in localStorage
    expect(questionnaireService.hasCompletedProfile()).toBe(true);

    // Click "Let's Start Learning" CTA
    const startLearningBtn = screen.getByRole('button', {
      name: /Let's Start Learning/i,
    });
    fireEvent.click(startLearningBtn);

    // Expect navigation back to home
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
