import React from 'react';
import camberLogo from '../assets/camber-logo.png';
import { WildflowerStem, ButtercupFlower } from './BotanicalAccents';

export default function Footer() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="camber-footer">
      <div className="footer-container">
        {/* Left Column: Mascot Logo & Tagline */}
        <div className="footer-brand-col">
          <a
            href="#home"
            className="footer-logo-link"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#home');
            }}
          >
            <img
              src={camberLogo}
              alt="Camber Mascot Logo"
              className="footer-logo-img"
            />
          </a>
          <p className="footer-tagline">Good ideas grow here.</p>
        </div>

        {/* Link Groups */}
        <div className="footer-links-grid">
          {/* Group 1: Explore */}
          <div className="footer-link-group">
            <h4 className="footer-group-title">Explore</h4>
            <ul className="footer-links-list">
              <li>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#home');
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#what-is-camber"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#what-is-camber');
                  }}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#features');
                  }}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#how-it-works');
                  }}
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#faq');
                  }}
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Group 2: Connect */}
          <div className="footer-link-group">
            <h4 className="footer-group-title">Connect</h4>
            <ul className="footer-links-list">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Group 3: Legal */}
          <div className="footer-link-group">
            <h4 className="footer-group-title">Legal</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy policy placeholder'); }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of use placeholder'); }}>
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Corner Botanical Floral Accents */}
        <div className="footer-decor-top" aria-hidden="true">
          <WildflowerStem size={30} />
        </div>
      </div>

      {/* Copyright row */}
      <div className="footer-bottom-bar">
        <p className="footer-copyright">
          © 2026 Camber. All rights reserved.
        </p>
        <div className="footer-bottom-decor" aria-hidden="true">
          <ButtercupFlower size={18} />
        </div>
      </div>
    </footer>
  );
}

