import React, { useState } from 'react';
import PasswordField from '../Auth/PasswordField';
import welcomeImage from '../../assets/camber/camber-welcome.png';
import readingImage from '../../assets/camber/camber-reading.png';
import './Signup.css';

const copy = {
  heading: 'Your learning adventure starts here.',
  greeting: "Hey! I'm Camber. Glad you're here!",
  formHeading: "Let's become study buddies!",
  formIntroduction: 'Tell me a little about yourself so we can get started.',
  email: 'Looking good so far!',
  password: "I'll look away. Take your time!",
  confirmed: "Nice! You've got this.",
  mismatch: "Hmm, these two don't match just yet.",
};

export default function Signup({ onNavigate }) {
  const [focusedField, setFocusedField] = useState('');
  const [message, setMessage] = useState(copy.greeting);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const isReading = focusedField === 'password' || focusedField === 'confirmPassword';

  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const focusField = (field) => {
    setFocusedField(field);
    if (field === 'password' || field === 'confirmPassword') {
      setMessage(copy.password);
    } else if (field === 'email') {
      setMessage(copy.email);
    } else {
      setMessage(copy.greeting);
    }
  };

  const blurField = () => {
    setFocusedField('');
    setMessage(copy.greeting);
  };

  const passwordChecks = [
    { label: 'At least 12 characters', valid: password.length >= 12 },
    { label: 'An uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'A lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'A number', valid: /\d/.test(password) },
    { label: 'A symbol', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const strength = password
    ? passwordChecks.filter((check) => check.valid).length
    : 0;

  const submitSignUp = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage(copy.mismatch);
      setFormMessage(copy.mismatch);
      return;
    }

    if (!passwordChecks.every((check) => check.valid)) {
      setFormMessage('Please meet all the password requirements first.');
      return;
    }

    if (!termsAccepted) {
      setFormMessage('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setMessage(copy.confirmed);
    setFormMessage(
      'Your form looks good! Real account creation is not connected yet.'
    );
  };

  return (
    <main className="signin-page">
      <section className="signin-scene">
        {/* Sign-up Heading with CAMBER Brand */}
        <header className="signup-heading">
          <button
            type="button"
            className="brand-name"
            onClick={() => handleNavigate('/')}
            title="Return to CAMBER Home"
          >
            CAMBER
          </button>
          <h1>{copy.heading}</h1>
        </header>

        {/* Mascot Artwork with Dynamic Pose Switching */}
        <div className="scene-artwork">
          <img
            src={isReading ? readingImage : welcomeImage}
            alt={
              isReading
                ? 'Camber reading a book in her treehouse'
                : 'Camber welcoming the student'
            }
            className="treehouse-image"
          />
        </div>

        {/* Speech Bubble */}
        <div className="speech-bubble" aria-live="polite">
          {!focusedField ? copy.greeting : message}
        </div>

        {/* Sign Up Form */}
        <form className="signin-form signup-form" onSubmit={submitSignUp}>
          <h2>{copy.formHeading}</h2>
          <p className="form-intro">{copy.formIntroduction}</p>

          <label htmlFor="signup-name">Your name</label>
          <input
            id="signup-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onFocus={() => focusField('name')}
            onBlur={blurField}
            autoComplete="name"
            placeholder="What should I call you?"
            required
          />

          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onFocus={() => focusField('email')}
            onBlur={blurField}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />

          <PasswordField
            id="signup-password"
            label="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onFocus={() => focusField('password')}
            onBlur={blurField}
            autoComplete="new-password"
            placeholder="At least 12 characters"
          />

          {/* Password Strength Feedback */}
          <div className="password-strength" aria-live="polite">
            <div className="strength-bars">
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={level <= strength ? `strength-${strength}` : ''}
                />
              ))}
            </div>
            <p>
              Password strength:{' '}
              {password
                ? strength <= 2
                  ? 'Needs work'
                  : strength <= 4
                    ? 'Getting stronger'
                    : 'All listed checks passed'
                : 'Not entered yet'}
            </p>
            <ul className="password-checklist">
              {passwordChecks.map((check) => (
                <li key={check.label} className={check.valid ? 'valid' : ''}>
                  <span aria-hidden="true">{check.valid ? '✓' : '○'}</span>
                  {check.label}
                </li>
              ))}
            </ul>
            <p className="password-hint">
              This is a basic checklist, not a security audit.
            </p>
          </div>

          <PasswordField
            id="signup-confirm-password"
            label="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            onFocus={() => focusField('confirmPassword')}
            onBlur={blurField}
            autoComplete="new-password"
            placeholder="Re-enter your password"
          />

          {confirmPassword && (
            <p className={`match-status ${password === confirmPassword ? '' : 'mismatch'}`}>
              {password === confirmPassword
                ? copy.confirmed
                : copy.mismatch}
            </p>
          )}

          <label className="terms-label">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              required
            />
            <span>
              I agree to the{' '}
              <a href="#terms" onClick={(event) => event.preventDefault()}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" onClick={(event) => event.preventDefault()}>
                Privacy Policy
              </a>.
            </span>
          </label>

          <button type="submit" className="signin-button">
            Create your account
          </button>

          {formMessage && (
            <p className="form-status" role="status">{formMessage}</p>
          )}

          <p className="signup-note">
            Already have an account?{' '}
            <button
              type="button"
              className="text-link"
              onClick={() => handleNavigate('/login')}
            >
              Sign In
            </button>
          </p>

          <div className="back-home-row">
            <button
              type="button"
              className="back-home-link"
              onClick={() => handleNavigate('/')}
            >
              &larr; Back to home
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

