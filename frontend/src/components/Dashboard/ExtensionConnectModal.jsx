import React, { useState, useEffect } from 'react';

export default function ExtensionConnectModal({ isOpen, onClose, studyParams }) {
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'checking' | 'not_detected' | 'connected'
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setConnectionStatus('checking');

    const timer = setTimeout(() => {
      if (!isMounted) return;

      // Realistic check: check if extension injected window indicator
      const hasExtension = Boolean(
        typeof window !== 'undefined' &&
        (window.camberExtension || window.__CAMBER_EXTENSION_INSTALLED__)
      );

      if (hasExtension) {
        setConnectionStatus('connected');
      } else {
        // Honest, truthful status as mandated by project safety rules
        setConnectionStatus('not_detected');
      }
    }, 700);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, checkCount]);

  if (!isOpen) return null;

  return (
    <div className="dashboard-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-ext-title">
      <div className="dashboard-modal-window">
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          &times;
        </button>

        {/* Modal Header */}
        <div className="modal-header-section">
          <div className="modal-badge-icon" aria-hidden="true">
            🧩
          </div>
          <div className="modal-title-group">
            <h3 id="modal-ext-title">Connect with CAMBER Extension</h3>
            <p>Pair your browser companion to begin your emotion-aware study session.</p>
          </div>
        </div>

        {/* Selected Study Target Summary if specified */}
        {studyParams?.topic && (
          <div style={{ backgroundColor: '#EBF4FA', padding: '10px 14px', borderRadius: 12, fontSize: 13, border: '1px solid #D2E4F2', color: '#3A607D' }}>
            <strong>Target Topic:</strong> {studyParams.topic} {studyParams.subject ? `• ${studyParams.subject}` : ''} ({studyParams.duration || 25} mins)
          </div>
        )}

        {/* 3 Step Instruction Guide */}
        <div className="extension-step-box">
          <div className="step-row-item">
            <div className="step-number-bubble">1</div>
            <div className="step-instruction-text">
              <strong>Install Extension:</strong> Open <code>chrome://extensions</code> in Chrome, enable <em>Developer mode</em>, and click <em>Load unpacked</em> pointing to the <code>extension/</code> folder.
            </div>
          </div>

          <div className="step-row-item">
            <div className="step-number-bubble">2</div>
            <div className="step-instruction-text">
              <strong>Pin CAMBER:</strong> Click the puzzle icon in Chrome's toolbar and pin CAMBER for 1-click access.
            </div>
          </div>

          <div className="step-row-item">
            <div className="step-number-bubble">3</div>
            <div className="step-instruction-text">
              <strong>Launch Session:</strong> Open any learning article, click the Camber icon, and tap <em>Start Learning Session</em>.
            </div>
          </div>
        </div>

        {/* Connection Status Box */}
        {connectionStatus === 'checking' && (
          <div className="extension-status-callout status-callout-pending">
            <span aria-hidden="true">⏳</span>
            <span>Checking browser for active CAMBER Chrome Extension...</span>
          </div>
        )}

        {connectionStatus === 'not_detected' && (
          <div className="extension-status-callout status-callout-pending">
            <span aria-hidden="true">⚠️</span>
            <span>
              <strong>Extension Not Detected Yet:</strong> The extension is not running in this tab. Load the extension in Chrome to enable live emotional assistance.
            </span>
          </div>
        )}

        {connectionStatus === 'connected' && (
          <div className="extension-status-callout status-callout-connected">
            <span aria-hidden="true">✓</span>
            <span><strong>Extension Connected:</strong> Ready to begin your emotion-aware study session!</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="modal-actions-row">
          <button
            type="button"
            className="btn-modal-secondary"
            onClick={() => setCheckCount((c) => c + 1)}
          >
            Check Again 🔄
          </button>
          <button
            type="button"
            className="btn-modal-primary"
            onClick={onClose}
          >
            Got it, Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
