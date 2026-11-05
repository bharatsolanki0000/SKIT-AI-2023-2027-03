import React from 'react';
import camberPeeking from '../../assets/camber-peeking.png';

/**
 * JournalCover Component
 * Recreates the closed journal welcome screen matching Reference Image 1.
 * Features Camber peeking over the top edge, speech bubble, spiral binding,
 * dashed stitched border, and the primary "Let's begin →" action.
 */
export default function JournalCover({ onBegin }) {
  return (
    <div className="journal-cover-stage" aria-label="Camber's Journal Cover">
      {/* Camber Mascot Peeking & Speech Bubble */}
      <div className="cover-mascot-wrapper">
        {/* Playful Yellow Sparkles Left */}
        <div className="cover-sparkle sparkle-left" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Speech Bubble */}
        <div className="cover-speech-bubble" role="note">
          <p>I've got a little journal for us to fill!</p>
          <div className="bubble-tail" aria-hidden="true"></div>
        </div>

        {/* Camber Squirrel Illustration */}
        <div className="cover-squirrel-figure">
          <img
            src={camberPeeking}
            alt="Camber the squirrel peeking curiously over the journal cover"
            className="cover-squirrel-img"
          />
        </div>

        {/* Playful Yellow Sparkles Right */}
        <div className="cover-sparkle sparkle-right" aria-hidden="true">
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Main Closed Journal Book */}
      <div className="journal-cover-book">
        {/* Left Spiral Wire Binding */}
        <div className="cover-spiral-spine" aria-hidden="true">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="cover-spiral-loop">
              <span className="cover-spiral-hole"></span>
              <span className="cover-spiral-wire"></span>
            </div>
          ))}
        </div>

        {/* Journal Cover Face with Stitched Inner Border */}
        <div className="journal-cover-face">
          <div className="cover-stitched-border">
            {/* Journal Title with Yellow Radiance Rays */}
            <div className="cover-title-group">
              <span className="title-ray title-ray-left" aria-hidden="true">
                <span className="ray ray-top"></span>
                <span className="ray ray-bottom"></span>
              </span>

              <h1 className="cover-journal-title">Camber's Journal</h1>

              <span className="title-ray title-ray-right" aria-hidden="true">
                <span className="ray ray-top"></span>
                <span className="ray ray-bottom"></span>
              </span>
            </div>

            {/* "Let's begin →" Primary CTA Button */}
            <div className="cover-cta-row">
              <button
                type="button"
                className="cover-begin-button"
                onClick={onBegin}
                aria-label="Let's begin - Open journal"
              >
                Let's begin &rarr;
              </button>
            </div>

            {/* Watercolor Paw Print Stamp Bottom Right */}
            <div className="cover-paw-stamp" aria-hidden="true">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Main Pad */}
                <path
                  d="M22 36C17.5 36 14.5 32 15 28C15.5 24 19 23 22 23C25 23 28.5 24 29 28C29.5 32 26.5 36 22 36Z"
                  fill="#75452F"
                  fillOpacity="0.75"
                />
                {/* Toe 1 (Far Left) */}
                <ellipse
                  cx="12"
                  cy="20"
                  rx="3.5"
                  ry="5"
                  transform="rotate(-20 12 20)"
                  fill="#75452F"
                  fillOpacity="0.72"
                />
                {/* Toe 2 (Center Left) */}
                <ellipse
                  cx="18.5"
                  cy="14"
                  rx="3.5"
                  ry="5.5"
                  transform="rotate(-8 18.5 14)"
                  fill="#75452F"
                  fillOpacity="0.78"
                />
                {/* Toe 3 (Center Right) */}
                <ellipse
                  cx="25.5"
                  cy="14"
                  rx="3.5"
                  ry="5.5"
                  transform="rotate(8 25.5 14)"
                  fill="#75452F"
                  fillOpacity="0.78"
                />
                {/* Toe 4 (Far Right) */}
                <ellipse
                  cx="32"
                  cy="20"
                  rx="3.5"
                  ry="5"
                  transform="rotate(20 32 20)"
                  fill="#75452F"
                  fillOpacity="0.72"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

