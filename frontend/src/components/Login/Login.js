import React, { useState } from 'react';
import PasswordField from '../Auth/PasswordField';
import welcomeImage from '../../assets/camber/camber-welcome.png';
import readingImage from '../../assets/camber/camber-reading.png';
import './Login.css';

const copy = {
  greeting: 'Welcome back!',
  email: 'Take your time!',
  password: "I'll look away. Take your time!",
};

export default function Login({ onNavigate }) {
  const [focusedField, setFocusedField] = useState('');
  const [message, setMessage] = useState(copy.greeting);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const isReading = focusedField === 'password';

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
    if (field === 'password') {
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

  const submitSignIn = (event) => {
    event.preventDefault();
    setFormMessage('Sign-in is a prototype. Authentication is not connected yet.');
  };

  return (
    <main className="signin-page">
      <section className="signin-scene">
        {/* Top Brand Link to Home */}
        <header className="signup-heading">
          <button
            type="button"
            className="brand-name"
            onClick={() => handleNavigate('/')}
            title="Return to CAMBER Home"
          >
            CAMBER
          </button>
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

        {/* Dynamic Speech Bubble */}
        <div className="speech-bubble" aria-live="polite">
          {message}
        </div>

        {/* Sign In Form */}
        <form className="signin-form" onSubmit={submitSignIn}>
          <h2>Sign In</h2>
          <p className="form-intro">
            Your cozy study corner is waiting for you.
          </p>

          <label htmlFor="signin-email">Username or Email</label>
          <input
            id="signin-email"
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="Enter your username or email"
            required
            onFocus={() => focusField('email')}
            onBlur={blurField}
          />

          <PasswordField
            id="signin-password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            onFocus={() => focusField('password')}
            onBlur={blurField}
          />

          <button type="submit" className="signin-button">
            Sign In
          </button>

          {formMessage && (
            <p className="form-status" role="status">{formMessage}</p>
          )}

          <p className="signup-note">
            New here?{' '}
            <button
              type="button"
              className="text-link"
              onClick={() => handleNavigate('/signup')}
            >
              Sign Up
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

