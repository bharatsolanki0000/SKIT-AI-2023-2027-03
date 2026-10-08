import React, { useState } from 'react';
import camberLogo from '../assets/camber-logo.png';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#what-is-camber' },
    { id: 'features', label: 'Features', href: '#features' },
    { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
    { id: 'faq', label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (id, href) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="camber-navbar-header">
      <nav className="camber-navbar" aria-label="Main Navigation">
        {/* Brand Logo & Cloud Decoration */}
        <div className="navbar-brand">
          <a
            href="#home"
            className="brand-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home', '#home');
            }}
          >
            <img
              src={camberLogo}
              alt="Camber Mascot Logo"
              className="brand-logo-img"
            />
          </a>

          {/* Decorative fluffy watercolor cloud in the sky */}
          <div className="navbar-cloud-decor" aria-hidden="true">
            <svg width="48" height="26" viewBox="0 0 60 32" fill="none">
              <path
                d="M10 24 C5 24 2 20 5 15 C4 11 9 8 15 10 C18 4 28 3 33 8 C38 4 47 6 49 12 C54 12 58 16 56 21 C54 25 50 25 45 24 Z"
                fill="#FFFFFF"
                fillOpacity="0.75"
              />
            </svg>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links">
          {navLinks.map((item) => (
            <li key={item.id} className="nav-item">
              <a
                href={item.href}
                className={`nav-link ${activeNav === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id, item.href);
                }}
              >
                {item.label}
                {activeNav === item.id && <span className="nav-active-pill" />}
              </a>
            </li>
          ))}
        </ul>

        {/* Right CTA Button: Sign up / Sign in */}
        <div className="navbar-actions">
          <button
            type="button"
            className="btn-auth"
            onClick={() => {
              alert('Sign up / Sign in will be available soon!');
            }}
          >
            Sign up / Sign in
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={`navbar-hamburger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <ul className="mobile-links">
            {navLinks.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`mobile-link ${activeNav === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id, item.href);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="mobile-auth-item">
              <button
                type="button"
                className="btn-auth mobile-btn-auth"
                onClick={() => {
                  setMobileMenuOpen(false);
                  alert('Sign up / Sign in will be available soon!');
                }}
              >
                Sign up / Sign in
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

