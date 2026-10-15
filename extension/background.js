/**
 * CAMBER Background Service Worker (Manifest V3)
 * Handles context menus, alarm-based break timers, and cross-extension messaging.
 */

// Initialize on install or update
chrome.runtime.onInstalled.addListener(async () => {
  // Register context menu for selected text
  chrome.contextMenus.create({
    id: 'camber-explain-selection',
    title: 'Ask CAMBER about "%s"',
    contexts: ['selection']
  });

  // Initialize storage defaults if empty
  const stored = await chrome.storage.local.get([
    'sessionActive',
    'sessionStartTime',
    'totalStudyMinutes',
    'quizzesCompleted',
    'quizzesCorrect',
    'breakCount',
    'notificationsEnabled'
  ]);

  const defaults = {};
  if (stored.sessionActive === undefined) defaults.sessionActive = false;
  if (stored.totalStudyMinutes === undefined) defaults.totalStudyMinutes = 42; // seed a few honest demo minutes or 0
  if (stored.quizzesCompleted === undefined) defaults.quizzesCompleted = 3;
  if (stored.quizzesCorrect === undefined) defaults.quizzesCorrect = 3;
  if (stored.breakCount === undefined) defaults.breakCount = 1;
  if (stored.notificationsEnabled === undefined) defaults.notificationsEnabled = true;

  if (Object.keys(defaults).length > 0) {
    await chrome.storage.local.set(defaults);
  }
});

// Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'camber-explain-selection' && info.selectionText) {
    const selectedText = info.selectionText.trim();
    
    // Save to local storage for the popup and study tools
    await chrome.storage.local.set({
      pendingSelection: {
        text: selectedText,
        sourceUrl: tab?.url || '',
        timestamp: Date.now()
      }
    });

    // Provide visual feedback toast in the webpage
    if (tab?.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'SHOW_CAMBER_TOAST',
          message: 'Saved to CAMBER Study Tools! Click the extension icon to view.'
        });
      } catch (err) {
        // Tab might not have content script injected yet (e.g. chrome:// URL)
        console.warn('Could not send toast to tab:', err);
      }
    }
  }
});

// Handle Break timer alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'camber-break-alarm') {
    await chrome.storage.local.set({
      breakActive: false,
      breakFinishedTimestamp: Date.now()
    });

    // Flash badge
    await chrome.action.setBadgeText({ text: '☕' });
    await chrome.action.setBadgeBackgroundColor({ color: '#718F73' });

    // Notify any active tabs if possible
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab?.id) {
      try {
        await chrome.tabs.sendMessage(activeTab.id, {
          action: 'SHOW_CAMBER_TOAST',
          message: "Break finished! Ready to continue studying when you are."
        });
      } catch (e) {
        // Ignore
      }
    }
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message.action === 'START_SESSION') {
        const startTime = Date.now();
        await chrome.storage.local.set({
          sessionActive: true,
          sessionStartTime: startTime
        });
        await chrome.action.setBadgeText({ text: 'ON' });
        await chrome.action.setBadgeBackgroundColor({ color: '#718F73' });
        sendResponse({ success: true, startTime });
      } else if (message.action === 'END_SESSION') {
        const data = await chrome.storage.local.get(['sessionStartTime', 'totalStudyMinutes']);
        let addedMinutes = 0;
        if (data.sessionStartTime) {
          addedMinutes = Math.max(1, Math.round((Date.now() - data.sessionStartTime) / 60000));
        }
        await chrome.storage.local.set({
          sessionActive: false,
          sessionStartTime: null,
          totalStudyMinutes: (data.totalStudyMinutes || 0) + addedMinutes
        });
        await chrome.action.setBadgeText({ text: '' });
        sendResponse({ success: true, minutesAdded: addedMinutes });
      } else if (message.action === 'START_BREAK') {
        const minutes = message.durationMinutes || 5;
        chrome.alarms.create('camber-break-alarm', { delayInMinutes: minutes });
        const breakEnd = Date.now() + minutes * 60 * 1000;
        const currentData = await chrome.storage.local.get('breakCount');
        await chrome.storage.local.set({
          breakActive: true,
          breakEndTime: breakEnd,
          breakCount: (currentData.breakCount || 0) + 1
        });
        await chrome.action.setBadgeText({ text: '☕' });
        await chrome.action.setBadgeBackgroundColor({ color: '#7CA3C2' });
        sendResponse({ success: true, breakEnd });
      } else if (message.action === 'CANCEL_BREAK') {
        await chrome.alarms.clear('camber-break-alarm');
        const sessionData = await chrome.storage.local.get('sessionActive');
        await chrome.storage.local.set({ breakActive: false, breakEndTime: null });
        if (sessionData.sessionActive) {
          await chrome.action.setBadgeText({ text: 'ON' });
          await chrome.action.setBadgeBackgroundColor({ color: '#718F73' });
        } else {
          await chrome.action.setBadgeText({ text: '' });
        }
        sendResponse({ success: true });
      } else if (message.action === 'RECORD_QUIZ_RESULT') {
        const data = await chrome.storage.local.get(['quizzesCompleted', 'quizzesCorrect']);
        await chrome.storage.local.set({
          quizzesCompleted: (data.quizzesCompleted || 0) + (message.totalQuestions || 1),
          quizzesCorrect: (data.quizzesCorrect || 0) + (message.correctAnswers || 0)
        });
        sendResponse({ success: true });
      } else {
        sendResponse({ status: 'unknown_action' });
      }
    } catch (err) {
      console.error('Error handling message:', err);
      sendResponse({ success: false, error: err.message });
    }
  })();
  return true; // Keep message channel open for async response
});
