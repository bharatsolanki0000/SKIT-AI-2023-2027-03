import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('CAMBER Unified Application Tests', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  test('renders Camber landing page sections including lower sections', () => {
    render(<App />);
    
    // Upper sections
    expect(screen.getByRole('heading', { level: 1, name: /Good Ideas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /What is Camber\?/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Why Camber\?/i })).toBeInTheDocument();

    // Navigation
    expect(screen.getAllByText(/Sign up \/ Sign in/i)[0]).toBeInTheDocument();

    // Lower sections
    expect(screen.getByRole('heading', { level: 2, name: /Features/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /How Camber Works/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Our Values/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Who is Camber for\?/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Frequently Asked Questions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Ready to grow your ideas\?/i })).toBeInTheDocument();
    expect(screen.getByText(/Good ideas grow here\./i)).toBeInTheDocument();
  });

  test('navigates to Login page when clicking Sign up / Sign in', () => {
    render(<App />);

    const authBtn = screen.getAllByText(/Sign up \/ Sign in/i)[0];
    fireEvent.click(authBtn);

    // Verify Login page renders
    expect(screen.getByRole('heading', { level: 2, name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Your cozy study corner is waiting for you/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username or Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();
  });

  test('Login page features: pose switching, password toggle, prototype submission', () => {
    window.history.pushState({}, '', '/login');
    render(<App />);

    const mascotImg = screen.getByAltText(/Camber welcoming the student/i);
    expect(mascotImg).toBeInTheDocument();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    const toggleBtn = screen.getByRole('button', { name: /Show password/i });

    // Password visibility toggle
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Pose switching on focus
    fireEvent.focus(passwordInput);
    expect(screen.getByAltText(/Camber reading a book in her treehouse/i)).toBeInTheDocument();
    expect(screen.getByText(/I'll look away\. Take your time!/i)).toBeInTheDocument();

    fireEvent.blur(passwordInput);
    expect(screen.getByAltText(/Camber welcoming the student/i)).toBeInTheDocument();

    // Prototype form submission
    fireEvent.submit(screen.getByRole('button', { name: /^Sign In$/i }));
    expect(screen.getByText(/Sign-in is a prototype\. Authentication is not connected yet\./i)).toBeInTheDocument();
  });

  test('navigates from Login to Signup and verifies registration fields, checklist & validation', () => {
    window.history.pushState({}, '', '/login');
    render(<App />);

    const signUpLink = screen.getByRole('button', { name: /^Sign Up$/i });
    fireEvent.click(signUpLink);

    // Verify Signup view
    expect(screen.getByText(/Your learning adventure starts here\./i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Let's become study buddies!/i })).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Your name/i);
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/^Create a password$/i);
    const confirmInput = screen.getByLabelText(/^Confirm password$/i);
    const termsCheckbox = screen.getByRole('checkbox');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmInput).toBeInTheDocument();

    // Password strength checklist exists
    expect(screen.getByText(/At least 12 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/An uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/A lowercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/A number/i)).toBeInTheDocument();
    expect(screen.getByText(/A symbol/i)).toBeInTheDocument();

    // Test password matching
    fireEvent.change(passwordInput, { target: { value: 'Secret123456!' } });
    fireEvent.change(confirmInput, { target: { value: 'MismatchVal!' } });
    expect(screen.getByText(/Hmm, these two don't match just yet\./i)).toBeInTheDocument();

    fireEvent.change(confirmInput, { target: { value: 'Secret123456!' } });
    expect(screen.getByText(/Nice! You've got this\./i)).toBeInTheDocument();

    // Terms validation
    fireEvent.click(termsCheckbox);
    expect(termsCheckbox).toBeChecked();

    // Form submission confirmation
    fireEvent.submit(screen.getByRole('button', { name: /Create your account/i }));
    expect(screen.getByText(/Your form looks good! Real account creation is not connected yet\./i)).toBeInTheDocument();

    // Navigation back to Login
    const signInBtn = screen.getByRole('button', { name: /^Sign In$/i });
    fireEvent.click(signInBtn);
    expect(screen.getByRole('heading', { level: 2, name: /Sign In/i })).toBeInTheDocument();

    // Navigation back to Home
    const backHomeBtn = screen.getByRole('button', { name: /← Back to home/i });
    fireEvent.click(backHomeBtn);
    expect(screen.getByRole('heading', { level: 1, name: /Good Ideas/i })).toBeInTheDocument();
  });
});
