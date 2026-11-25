/**
 * CAMBER Extension Launch Service
 * Manages Chrome Extension connection checks, installation URLs, and study launch events.
 * Adheres strictly to CAMBER integrity guidelines:
 * - Honest default status of 'not_connected'.
 * - Real runtime detection without simulated false positives.
 * - Friendly, encouraging messages.
 */

// Configurable Chrome Web Store / Extension installation URL
// Leave empty by default until real Web Store entry is published, or populate via env
export const CHROME_EXTENSION_URL =
  process.env.REACT_APP_CHROME_EXTENSION_URL || '';

export const EXTENSION_STATUS = {
  NOT_CONNECTED: 'not_connected',
  CHECKING: 'checking',
  CONNECTED: 'connected',
};

export const extensionLaunchService = {
  /**
   * Check if the CAMBER Chrome Extension is installed and communicating with the page.
   * Checks multiple standard integration vectors:
   * 1. Window global flags set by content script
   * 2. HTML data attribute injected by extension
   * 3. Custom event / postMessage handshake
   */
  checkConnection: async () => {
    if (typeof window === 'undefined') {
      return EXTENSION_STATUS.NOT_CONNECTED;
    }

    // 1. Immediate DOM & global checks
    const hasGlobalFlag = Boolean(
      window.camberExtension ||
      window.__CAMBER_EXTENSION_INSTALLED__ ||
      window.__CAMBER_ACTIVE_SESSION__
    );

    const hasDomDataset = Boolean(
      document.documentElement &&
      (document.documentElement.dataset.camberExtension === 'true' ||
       document.documentElement.dataset.camberInstalled === 'true')
    );

    if (hasGlobalFlag || hasDomDataset) {
      return EXTENSION_STATUS.CONNECTED;
    }

    // 2. Handshake ping via window.postMessage with short timeout
    return new Promise((resolve) => {
      let resolved = false;

      const handleMessage = (event) => {
        if (
          event.data &&
          event.data.type === 'CAMBER_EXTENSION_PONG' &&
          event.data.status === 'ready'
        ) {
          resolved = true;
          window.removeEventListener('message', handleMessage);
          resolve(EXTENSION_STATUS.CONNECTED);
        }
      };

      window.addEventListener('message', handleMessage);

      // Post ping request
      try {
        window.postMessage({ type: 'CAMBER_EXTENSION_PING', source: 'camber-web-app' }, '*');
      } catch (e) {
        // Fallback
      }

      // 750ms grace period to hear back
      setTimeout(() => {
        if (!resolved) {
          window.removeEventListener('message', handleMessage);
          // Honest default status as required by project rules
          resolve(EXTENSION_STATUS.NOT_CONNECTED);
        }
      }, 750);
    });
  },

  /**
   * Safe extension installation handler
   */
  openInstallUrl: () => {
    if (CHROME_EXTENSION_URL && CHROME_EXTENSION_URL.trim() !== '') {
      if (typeof window !== 'undefined') {
        window.open(CHROME_EXTENSION_URL, '_blank', 'noopener,noreferrer');
      }
      return {
        success: true,
        message: 'Opening Chrome Web Store installation page...',
      };
    }
    return {
      success: false,
      message: "The extension installation link hasn't been configured yet.",
    };
  },
};
