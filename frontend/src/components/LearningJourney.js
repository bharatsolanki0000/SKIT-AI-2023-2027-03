import React from 'react';
import journeySceneImg from '../assets/journey-scene.png';
import TornDivider from './TornDivider';

export default function LearningJourney() {
  return (
    <section className="journey-panorama-section" aria-label="Learning can be a journey">
      <div className="journey-panorama-container">
        {/* Scenic Panoramic Storybook Artwork */}
        <div className="journey-artwork-frame">
          <img
            src={journeySceneImg}
            alt="Camber squirrel mascot carrying a backpack with yellow flowers walking along a wildflower trail past an open book on the grass with rolling green hills and mountains under a pastel sky. Heading reads: Learning can be a journey. And every journey looks a little different."
            className="journey-artwork-img"
            loading="lazy"
          />
        </div>
      </div>

      {/* Handcrafted torn paper edge transition to Our Values */}
      <TornDivider fill="#FAF4E8" height={36} />
    </section>
  );
}

