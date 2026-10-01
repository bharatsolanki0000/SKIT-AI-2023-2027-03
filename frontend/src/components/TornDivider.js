import React from 'react';

/**
 * Torn paper / deckled watercolor transition divider between sections.
 * Matches the handcrafted paper aesthetic from the reference image.
 */
export default function TornDivider({
  fill = '#FCFAF4',
  style = {},
  className = '',
  flip = false,
  height = 36,
}) {
  return (
    <div
      className={`torn-divider-wrapper ${className}`}
      style={{
        overflow: 'hidden',
        lineHeight: 0,
        width: '100%',
        marginTop: '-1px',
        marginBottom: '-1px',
        position: 'relative',
        zIndex: 2,
        ...style,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: `${height}px`,
          display: 'block',
          transform: flip ? 'scaleX(-1)' : 'none',
        }}
      >
        {/* Subtle shadow layer for paper depth */}
        <path
          d="M0,28 Q120,44 240,25 T480,32 T720,22 T960,35 T1200,26 T1440,30 L1440,60 L0,60 Z"
          fill="rgba(68, 46, 32, 0.04)"
        />
        {/* Main organic deckle wave */}
        <path
          d="M0,32 C65,22 135,42 210,30 C290,16 360,40 440,28 C530,14 610,38 700,25 C790,10 870,36 960,24 C1045,12 1130,35 1215,22 C1300,10 1375,32 1440,26 L1440,60 L0,60 Z"
          fill={fill}
        />
        {/* Faint torn paper fibers / edge micro-wiggles */}
        <path
          d="M0,32 Q70,25 140,35 T280,24 T420,34 T560,20 T700,31 T840,18 T980,29 T1120,18 T1260,28 T1400,22 L1440,26"
          stroke={fill}
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

