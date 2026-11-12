import React from 'react';
import squirrelRestingImg from '../../assets/squirrel-resting.png';

export default function CamberCorner() {
  return (
    <div className="cambers-corner-card" aria-label="Camber's Corner">
      <div className="corner-header-group">
        <span className="corner-heart-icon" aria-hidden="true">♥</span>
        <h3>Camber's Corner</h3>
      </div>

      <div className="corner-content-body">
        {/* Speech Bubble */}
        <div className="corner-speech-bubble">
          You're doing great!
          <br />
          Every little step counts.
          <span className="corner-speech-bubble-tail" aria-hidden="true" />
        </div>

        {/* Camber Mascot Resting */}
        <div className="corner-mascot-wrapper" aria-hidden="true">
          <img
            src={squirrelRestingImg}
            alt="Camber squirrel mascot smiling encouragingly"
            className="corner-mascot-img"
          />
        </div>
      </div>
    </div>
  );
}
