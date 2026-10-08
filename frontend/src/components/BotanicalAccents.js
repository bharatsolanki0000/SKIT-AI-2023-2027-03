import React from 'react';

/**
 * Botanical sprigs, leaves, wildflowers, and butterfly accents matching the cozy,
 * hand-painted watercolor theme of Camber.
 */

export function BotanicalSprig({ className = '', style = {}, size = 32, color = '#687e50' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`botanical-accent ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      aria-hidden="true"
    >
      {/* Central curved stem */}
      <path
        d="M8 34 C12 26 18 18 28 8"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M14 26 C12 21 16 18 20 20 C18 24 15 26 14 26 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M20 18 C18 13 23 10 26 13 C24 17 21 18 20 18 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M23 23 C28 22 29 27 25 29 C23 27 23 24 23 23 Z"
        fill={color}
        opacity="0.75"
      />
      <path
        d="M17 31 C21 31 22 35 19 36 C17 35 16 33 17 31 Z"
        fill={color}
        opacity="0.75"
      />
      {/* Top bud */}
      <ellipse
        cx="29"
        cy="7"
        rx="3"
        ry="4"
        transform="rotate(35 29 7)"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

export function ButtercupFlower({ size = 26, style = {}, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`botanical-flower ${className}`}
      style={{ display: 'inline-block', ...style }}
      aria-hidden="true"
    >
      {/* 5 soft yellow petals */}
      <circle cx="16" cy="9" r="6" fill="#F8DE7E" opacity="0.9" />
      <circle cx="22.5" cy="14" r="6" fill="#F8DE7E" opacity="0.9" />
      <circle cx="20" cy="22" r="6" fill="#F8DE7E" opacity="0.9" />
      <circle cx="12" cy="22" r="6" fill="#F8DE7E" opacity="0.9" />
      <circle cx="9.5" cy="14" r="6" fill="#F8DE7E" opacity="0.9" />
      {/* Center pistil */}
      <circle cx="16" cy="16" r="4.5" fill="#E6A838" />
      <circle cx="15.5" cy="15.5" r="2" fill="#FCEAA7" opacity="0.7" />
    </svg>
  );
}

export function DaisyFlower({ size = 24, style = {}, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`botanical-daisy ${className}`}
      style={{ display: 'inline-block', ...style }}
      aria-hidden="true"
    >
      {/* White watercolor daisy petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx={16 + 7 * Math.cos((angle * Math.PI) / 180)}
          cy={16 + 7 * Math.sin((angle * Math.PI) / 180)}
          rx="3.5"
          ry="5.5"
          transform={`rotate(${angle} ${16 + 7 * Math.cos((angle * Math.PI) / 180)} ${16 + 7 * Math.sin((angle * Math.PI) / 180)})`}
          fill="#FFFDF7"
          stroke="#E6DFD1"
          strokeWidth="0.6"
          opacity="0.95"
        />
      ))}
      {/* Warm golden center */}
      <circle cx="16" cy="16" r="4.8" fill="#F4B841" />
      <circle cx="15.5" cy="15.5" r="2.2" fill="#FDE18A" opacity="0.8" />
    </svg>
  );
}

export function WildflowerStem({ size = 36, style = {}, className = '', color = '#6F8850' }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 32 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`botanical-stem ${className}`}
      style={{ display: 'inline-block', ...style }}
      aria-hidden="true"
    >
      {/* Slender curved stem */}
      <path
        d="M12 40 C14 30 18 20 22 6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Little green leaves */}
      <path d="M14 30 C10 28 8 32 10 34 C13 34 14 31 14 30 Z" fill={color} opacity="0.8" />
      <path d="M17 22 C22 20 23 25 20 26 C18 26 17 23 17 22 Z" fill={color} opacity="0.8" />
      <path d="M19 14 C16 11 13 14 15 16 C17 17 19 15 19 14 Z" fill={color} opacity="0.8" />
      {/* Blossom 1 (yellow) */}
      <circle cx="23" cy="5" r="3.2" fill="#F8DE7E" />
      <circle cx="23" cy="5" r="1.5" fill="#E6A838" />
      {/* Blossom 2 (white/cream) */}
      <circle cx="28" cy="12" r="2.5" fill="#FFFBF0" stroke="#E2D8C3" strokeWidth="0.5" />
      <circle cx="28" cy="12" r="1.1" fill="#F6C358" />
    </svg>
  );
}

export function ButterflyAccent({ size = 22, style = {}, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`botanical-butterfly ${className}`}
      style={{ display: 'inline-block', ...style }}
      aria-hidden="true"
    >
      {/* Left wings */}
      <path
        d="M12 12 C9 7 4 7 5 11 C6 14 10 13 12 12 Z"
        fill="#F5C754"
        opacity="0.9"
      />
      <path
        d="M12 12 C8 13 6 18 9 19 C11 19 12 15 12 12 Z"
        fill="#EAA832"
        opacity="0.85"
      />
      {/* Right wings */}
      <path
        d="M12 12 C15 7 20 7 19 11 C18 14 14 13 12 12 Z"
        fill="#F5C754"
        opacity="0.9"
      />
      <path
        d="M12 12 C16 13 18 18 15 19 C13 19 12 15 12 12 Z"
        fill="#EAA832"
        opacity="0.85"
      />
      {/* Tiny body */}
      <line x1="12" y1="9" x2="12" y2="17" stroke="#684E38" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function FloatingLeaf({ size = 22, style = {}, color = '#768d5a', rotate = 0 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `rotate(${rotate}deg)`,
        display: 'inline-block',
        ...style,
      }}
      aria-hidden="true"
    >
      <path
        d="M4 20 C6 11 14 4 20 4 C20 10 13 18 4 20 Z"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M7 17 C11 13 15 9 18 6"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
