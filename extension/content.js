/**
 * CAMBER In-Page Content Script
 * Displays the floating study tools widget upon text selection,
 * allowing instant access to Explain Simply, Generate Quiz, and Take a Break.
 */

(() => {
  let floatingTrigger = null;
  let floatingPanel = null;
  let currentSelectionText = '';

  const logoUrl = chrome.runtime.getURL('assets/camber-logo.png');

  // Listen for user text selection
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);

  function handleTextSelection(e) {
    // If clicking inside our own panel or trigger, don't clear it
    if (floatingPanel && floatingPanel.contains(e.target)) return;
    if (floatingTrigger && floatingTrigger.contains(e.target)) return;

    // Ignore text selection inside inputs or textareas to avoid obstructing editing
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
      cleanupWidgets();
      return;
    }

    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';

    if (text.length > 4) {
      currentSelectionText = text;
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Show trigger pill slightly above or below selection
      showFloatingTrigger(rect);
    } else {
      cleanupWidgets();
    }
  }

  function showFloatingTrigger(rect) {
    removeFloatingPanel();

    if (!floatingTrigger) {
      floatingTrigger = document.createElement('div');
      floatingTrigger.id = 'camber-floating-trigger';
      floatingTrigger.innerHTML = `
        <img src="${logoUrl}" alt="Camber Mascot" />
        <span>Ask CAMBER</span>
      `;
      document.body.appendChild(floatingTrigger);

      floatingTrigger.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        showFloatingPanel(rect);
      });
    }

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    const top = rect.bottom + scrollY + 6;
    const left = Math.min(window.innerWidth - 140, Math.max(10, rect.left + scrollX));

    floatingTrigger.style.top = `${top}px`;
    floatingTrigger.style.left = `${left}px`;
  }

  function showFloatingPanel(rect) {
    removeFloatingTrigger();

    if (floatingPanel) removeFloatingPanel();

    floatingPanel = document.createElement('div');
    floatingPanel.id = 'camber-floating-panel';
    floatingPanel.innerHTML = `
      <div class="camber-panel-header">
        <div class="camber-panel-brand">
          <img src="${logoUrl}" alt="CAMBER" class="camber-panel-logo" />
          <span class="camber-panel-title">CAMBER</span>
        </div>
        <button class="camber-panel-close" title="Close">×</button>
      </div>
      <div class="camber-panel-menu">
        <button class="camber-panel-item" data-action="explain">
          <span class="camber-item-icon">💡</span>
          <span>Explain Simply</span>
        </button>
        <button class="camber-panel-item" data-action="quiz">
          <span class="camber-item-icon">📄</span>
          <span>Generate Quiz</span>
        </button>
        <button class="camber-panel-item" data-action="break">
          <span class="camber-item-icon">☕</span>
          <span>Take a Break</span>
        </button>
        <button class="camber-panel-item" data-action="help">
          <span class="camber-item-icon">🌱</span>
          <span>Help with this topic</span>
        </button>
      </div>
    `;

    document.body.appendChild(floatingPanel);

    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let panelTop = rect.bottom + scrollY + 8;
    let panelLeft = Math.min(window.innerWidth - 270, Math.max(10, rect.left + scrollX));

    floatingPanel.style.top = `${panelTop}px`;
    floatingPanel.style.left = `${panelLeft}px`;

    // Panel event handlers
    floatingPanel.querySelector('.camber-panel-close').addEventListener('click', (e) => {
      e.stopPropagation();
      removeFloatingPanel();
    });

    floatingPanel.querySelectorAll('.camber-panel-item').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        await handleStudyAction(action, currentSelectionText);
      });
    });
  }

  async function handleStudyAction(actionType, text) {
    removeFloatingPanel();

    // Persist to extension storage
    await chrome.storage.local.set({
      pendingSelection: {
        text: text,
        action: actionType,
        sourceUrl: window.location.href,
        sourceTitle: document.title,
        timestamp: Date.now()
      }
    });

    let actionLabel = 'Explanation';
    if (actionType === 'quiz') actionLabel = 'Quiz';
    if (actionType === 'break') actionLabel = 'Break reminder';

    showFeedbackToast(`Saved to CAMBER! Open the extension popup in your toolbar to view your ${actionLabel}.`);
  }

  function showFeedbackToast(msg) {
    const existing = document.getElementById('camber-feedback-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'camber-feedback-toast';
    toast.innerHTML = `
      <img src="${logoUrl}" alt="CAMBER" />
      <span>${msg}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  }

  function removeFloatingTrigger() {
    if (floatingTrigger) {
      floatingTrigger.remove();
      floatingTrigger = null;
    }
  }

  function removeFloatingPanel() {
    if (floatingPanel) {
      floatingPanel.remove();
      floatingPanel = null;
    }
  }

  function cleanupWidgets() {
    removeFloatingTrigger();
    removeFloatingPanel();
  }

  // Handle messages from background or popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_PAGE_SELECTION') {
      const selected = window.getSelection() ? window.getSelection().toString().trim() : '';
      sendResponse({ selectedText: selected || currentSelectionText });
    } else if (request.action === 'SHOW_CAMBER_TOAST') {
      showFeedbackToast(request.message || 'Saved to CAMBER!');
      sendResponse({ success: true });
    }
    return true;
  });
})();
