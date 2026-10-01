import React from 'react';

/**
 * Botanical sprigs, leaves, and wildflower accents matching the cozy,
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

