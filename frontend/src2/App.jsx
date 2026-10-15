
import { useState } from 'react'
import './App.css'

import welcomeImage from './assets/camber/camber-welcome.png'
import readingImage from './assets/camber/camber-reading.png'

const copy = {
  signIn: {
    greeting: 'Welcome back!',
    email: 'Take your time!',
    password: "I'll look away. Take your time!",
  },
  signUp: {
    heading: 'Your learning adventure starts here.',
    greeting: "Hey! I'm Camber. Glad you're here!",
    introduction: "Let's figure things out together, one study session at a time.",
    formHeading: "Let's become study buddies!",
    formIntroduction: 'Tell me a little about yourself so we can get started.',
    email: 'Looking good so far!',
    password: "I'll look away. Take your time!",
    confirmed: "Nice! You've got this.",
    mismatch: "Hmm, these two don't match just yet.",
  },
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  autoComplete,
}) {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className="password-input-wrap">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={autoComplete}
          required
        />
        <button
          className="password-toggle"
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </>
  )
}

function App() {
  const [page, setPage] = useState('signin')
  const [focusedField, setFocusedField] = useState('')
  const [message, setMessage] = useState(copy.signIn.greeting)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formMessage, setFormMessage] = useState('')

  const isReading = focusedField === 'password' ||
    focusedField === 'confirmPassword'

  function openPage(nextPage) {
    setPage(nextPage)
    setFocusedField('')
    setMessage(
      nextPage === 'signup'
        ? copy.signUp.greeting
        : copy.signIn.greeting
    )
    setFormMessage('')
  }

  function focusField(field) {
    setFocusedField(field)

    if (field === 'password' || field === 'confirmPassword') {
      setMessage(copy.signUp.password)
    } else if (field === 'email') {
      setMessage(
        page === 'signup' ? copy.signUp.email : copy.signIn.email
      )
    } else {
      setMessage(
        page === 'signup' ? copy.signUp.greeting : copy.signIn.greeting
      )
    }
  }

  function blurField() {
    setFocusedField('')
    setMessage(
      page === 'signup' ? copy.signUp.greeting : copy.signIn.greeting
    )
  }

  const passwordChecks = [
    { label: 'At least 12 characters', valid: password.length >= 12 },
    { label: 'An uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'A lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'A number', valid: /\d/.test(password) },
    { label: 'A symbol', valid: /[^A-Za-z0-9]/.test(password) },
  ]

  const strength = password
    ? passwordChecks.filter((check) => check.valid).length
    : 0

  function submitSignIn(event) {
    event.preventDefault()
    setFormMessage('Sign-in is a prototype. Authentication is not connected yet.')
  }

  function submitSignUp(event) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setMessage(copy.signUp.mismatch)
      setFormMessage(copy.signUp.mismatch)
      return
    }

    if (!passwordChecks.every((check) => check.valid)) {
      setFormMessage('Please meet all the password requirements first.')
      return
    }

    if (!termsAccepted) {
      setFormMessage('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    setMessage(copy.signUp.confirmed)
    setFormMessage(
      'Your form looks good! Real account creation is not connected yet.'
    )
  }

  return (
    <main className="signin-page">
      <section className="signin-scene">
        {page === 'signup' && (
          <header className="signup-heading">
            <p className="brand-name">CAMBER</p>
            <h1>{copy.signUp.heading}</h1>
          </header>
        )}

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

        <div className="speech-bubble" aria-live="polite">
          {page === 'signup' && !focusedField
            ? copy.signUp.greeting
            : message}
        </div>

        {page === 'signin' ? (
          <form className="signin-form" onSubmit={submitSignIn}>
            <h2>Sign In</h2>
            <p className="form-intro">
              Your cozy study corner is waiting for you.
            </p>

            <label htmlFor="signin-email">Username or Email</label>
            <input
              id="signin-email"
              type="text"
              autoComplete="username"
              placeholder="Enter your username or email"
              required
              onFocus={() => focusField('email')}
              onBlur={blurField}
            />

            <PasswordField
              id="signin-password"
              label="Password"
              autoComplete="current-password"
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
                onClick={() => openPage('signup')}
              >
                Sign Up
              </button>
            </p>
          </form>
        ) : (
          <form className="signin-form signup-form" onSubmit={submitSignUp}>
            <h2>{copy.signUp.formHeading}</h2>
            <p className="form-intro">{copy.signUp.formIntroduction}</p>

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
            />

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
            />

            {confirmPassword && (
              <p className="match-status">
                {password === confirmPassword
                  ? copy.signUp.confirmed
                  : copy.signUp.mismatch}
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
                <a
                  href="#privacy"
                  onClick={(event) => event.preventDefault()}
                >
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
                onClick={() => openPage('signin')}
              >
                Sign In
              </button>
            </p>
          </form>
        )}
      </section>
    </main>
  )
}

export default App
