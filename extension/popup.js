/**
 * CAMBER Chrome Extension — Popup Controller
 * Emotion-Aware AI Study Companion
 * Fully responsive, state-persistent Manifest V3 controller
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // State & Data
  // -------------------------------------------------------------------------
  let activeSessionTimer = null;
  let breakTimerInterval = null;
  let breakSecondsRemaining = 300; // 5 minutes
  let isBreakRunning = false;
  let previousView = 'view-start';

  // Sample Quiz Question Bank
  const quizBank = [
    {
      id: 1,
      question: 'What is the main characteristic of a stack?',
      options: [
        { label: 'A', text: 'FIFO (First In, First Out)' },
        { label: 'B', text: 'LIFO (Last In, First Out)' },
        { label: 'C', text: 'Random Access of elements' },
        { label: 'D', text: 'Sorted by key priority' }
      ],
      correctIndex: 1,
      explanation: 'A stack follows Last In, First Out (LIFO). The last element pushed is the first one popped!'
    },
    {
      id: 2,
      question: 'Which operation removes an element from a stack?',
      options: [
        { label: 'A', text: 'Push' },
        { label: 'B', text: 'Enqueue' },
        { label: 'C', text: 'Pop' },
        { label: 'D', text: 'Peek' }
      ],
      correctIndex: 2,
      explanation: 'The Pop operation removes and returns the top element of the stack.'
    },
    {
      id: 3,
      question: 'Where is a stack data structure commonly used?',
      options: [
        { label: 'A', text: 'Function call management & recursion' },
        { label: 'B', text: 'Print spooling queues' },
        { label: 'C', text: 'Relational database indexing' },
        { label: 'D', text: 'Disk scheduling algorithms' }
      ],
      correctIndex: 0,
      explanation: 'Call stacks manage function execution contexts, return addresses, and recursive functions!'
    }
  ];

  let currentQuizIndex = 0;
  let currentQuizScore = 0;
  let questionAnswered = false;

  // -------------------------------------------------------------------------
  // DOM Elements
  // -------------------------------------------------------------------------
  const views = {
    start: document.getElementById('view-start'),
    active: document.getElementById('view-active'),
    explain: document.getElementById('view-explain'),
    quiz: document.getElementById('view-quiz'),
    break: document.getElementById('view-break'),
    tools: document.getElementById('view-tools'),
    progress: document.getElementById('view-progress'),
    emotion: document.getElementById('view-emotion'),
    settings: document.getElementById('view-settings')
  };

  // Header
  const btnHeaderHome = document.getElementById('btn-header-home');
  const btnNavSettings = document.getElementById('btn-nav-settings');
  const btnPopupClose = document.getElementById('btn-popup-close');

  // Start View
  const btnStartSession = document.getElementById('btn-start-session');
  const btnGotoTools = document.getElementById('btn-goto-tools');
  const btnGotoProgress = document.getElementById('btn-goto-progress');
  const btnGotoSettingsRow = document.getElementById('btn-goto-settings-row');

  // Active Session View
  const sessionTimerDisplay = document.getElementById('session-timer');
  const btnEndSession = document.getElementById('btn-end-session');
  const btnOptExplain = document.getElementById('btn-opt-explain');
  const btnOptQuiz = document.getElementById('btn-opt-quiz');
  const btnOptBreak = document.getElementById('btn-opt-break');
  const btnOptEmotion = document.getElementById('btn-opt-emotion');

  // Explain View
  const btnBackFromExplain = document.getElementById('btn-back-from-explain');
  const explainSourceText = document.getElementById('explain-source-text');
  const explainSimplifiedText = document.getElementById('explain-simplified-text');
  const explainKeyPoints = document.getElementById('explain-key-points');
  const explainContextPill = document.getElementById('explain-context-pill');

  // Quiz View
  const btnBackFromQuiz = document.getElementById('btn-back-from-quiz');
  const quizProgressText = document.getElementById('quiz-progress-text');
  const quizQuestionTitle = document.getElementById('quiz-question-title');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizFeedback = document.getElementById('quiz-feedback');
  const btnQuizNext = document.getElementById('btn-quiz-next');

  // Break View
  const btnBackFromBreak = document.getElementById('btn-back-from-break');
  const btnStartBreak = document.getElementById('btn-start-break');
  const btnBreakLater = document.getElementById('btn-break-later');
  const breakTimerDisplay = document.getElementById('break-timer-display');
  const breakCountdown = document.getElementById('break-countdown');
  const breakBtnLabel = document.getElementById('break-btn-label');

  // Study Tools View
  const btnBackFromTools = document.getElementById('btn-back-from-tools');
  const btnRefreshSelection = document.getElementById('btn-refresh-selection');
  const toolsInputText = document.getElementById('tools-input-text');
  const btnToolExplain = document.getElementById('btn-tool-explain');
  const btnToolQuiz = document.getElementById('btn-tool-quiz');

  // Progress View
  const btnBackFromProgress = document.getElementById('btn-back-from-progress');
  const statStudyTime = document.getElementById('stat-study-time');
  const statQuizzesTaken = document.getElementById('stat-quizzes-taken');
  const statAccuracy = document.getElementById('stat-accuracy');
  const statBreaksTaken = document.getElementById('stat-breaks-taken');

  // Emotion View
  const btnBackFromEmotion = document.getElementById('btn-back-from-emotion');
  const moodButtons = document.querySelectorAll('.mood-btn');
  const moodFeedbackBox = document.getElementById('mood-feedback-box');
  const moodFeedbackTitle = document.getElementById('mood-feedback-title');
  const moodFeedbackDesc = document.getElementById('mood-feedback-desc');

  // Settings View
  const btnBackFromSettings = document.getElementById('btn-back-from-settings');
  const btnSettingAccount = document.getElementById('btn-setting-account');
  const btnSettingPermissions = document.getElementById('btn-setting-permissions');
  const toggleNotifications = document.getElementById('toggle-notifications');
  const btnSettingAbout = document.getElementById('btn-setting-about');
  const settingsModal = document.getElementById('settings-detail-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const btnCloseModal = document.getElementById('btn-close-modal');

  // -------------------------------------------------------------------------
  // View Routing Helpers
  // -------------------------------------------------------------------------
  function showView(viewName) {
    const currentActive = document.querySelector('.view-panel.active');
    if (currentActive && currentActive.id !== `view-${viewName}`) {
      previousView = currentActive.id.replace('view-', '');
    }

    Object.keys(views).forEach((key) => {
      if (views[key]) {
        views[key].classList.remove('active');
      }
    });

    if (views[viewName]) {
      views[viewName].classList.add('active');
      window.scrollTo(0, 0);
    }
  }

  function getActiveViewName() {
    const currentActive = document.querySelector('.view-panel.active');
    return currentActive ? currentActive.id.replace('view-', '') : 'start';
  }

  // -------------------------------------------------------------------------
  // Session Timer
  // -------------------------------------------------------------------------
  function formatSeconds(totalSec) {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  function startSessionTimer(startTime) {
    if (activeSessionTimer) {
      clearInterval(activeSessionTimer);
    }

    function update() {
      const now = Date.now();
      const elapsedSec = Math.max(0, Math.floor((now - startTime) / 1000));
      if (sessionTimerDisplay) {
        sessionTimerDisplay.textContent = formatSeconds(elapsedSec);
      }
    }

    update();
    activeSessionTimer = setInterval(update, 1000);
  }

  function stopSessionTimer() {
    if (activeSessionTimer) {
      clearInterval(activeSessionTimer);
      activeSessionTimer = null;
    }
  }

  // -------------------------------------------------------------------------
  // Helper to extract plain text from pendingSelection (string or object)
  // -------------------------------------------------------------------------
  function extractSelectionText(data) {
    if (!data) return '';
    if (typeof data === 'string') return data.trim();
    if (typeof data === 'object' && data.text) return String(data.text).trim();
    return '';
  }

  // -------------------------------------------------------------------------
  // Initialize State & Storage Sync
  // -------------------------------------------------------------------------
  function initApp() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(
        [
          'sessionActive',
          'sessionStartTime',
          'pendingSelection',
          'pendingAction',
          'totalStudyMinutes',
          'totalStudySeconds',
          'quizzesCompleted',
          'quizzesCorrect',
          'quizAccuracy',
          'breaksTaken',
          'breakCount',
          'notificationsEnabled'
        ],
        (result) => {
          // Sync notification toggle
          if (toggleNotifications) {
            toggleNotifications.checked = result.notificationsEnabled !== false;
          }

          // Check if session is already active
          if (result.sessionActive && result.sessionStartTime) {
            startSessionTimer(result.sessionStartTime);
            showView('active');
          } else {
            showView('start');
          }

          // Extract text and target action from pendingSelection or pendingAction
          const rawSelection = result.pendingSelection;
          const text = extractSelectionText(rawSelection);
          const action = result.pendingAction || (typeof rawSelection === 'object' ? rawSelection.action : null);

          if (toolsInputText && text) {
            toolsInputText.value = text;
          }

          if (action === 'explain' && text) {
            loadExplanation(text);
            showView('explain');
            chrome.storage.local.remove(['pendingAction', 'pendingSelection']);
          } else if (action === 'quiz') {
            loadQuizForText(text);
            showView('quiz');
            chrome.storage.local.remove(['pendingAction', 'pendingSelection']);
          } else if (action === 'break') {
            showView('break');
            chrome.storage.local.remove(['pendingAction']);
          }
        }
      );
    } else {
      showView('start');
    }
  }

  // -------------------------------------------------------------------------
  // Event Listeners: Navigation
  // -------------------------------------------------------------------------
  if (btnHeaderHome) {
    btnHeaderHome.addEventListener('click', () => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['sessionActive'], (res) => {
          if (res.sessionActive) {
            showView('active');
          } else {
            showView('start');
          }
        });
      } else {
        showView('start');
      }
    });
  }

  if (btnNavSettings) {
    btnNavSettings.addEventListener('click', () => showView('settings'));
  }

  if (btnPopupClose) {
    btnPopupClose.addEventListener('click', () => window.close());
  }

  if (btnGotoTools) {
    btnGotoTools.addEventListener('click', () => {
      fetchSelectionFromTab();
      showView('tools');
    });
  }

  if (btnGotoProgress) {
    btnGotoProgress.addEventListener('click', () => {
      updateProgressStats();
      showView('progress');
    });
  }

  if (btnGotoSettingsRow) {
    btnGotoSettingsRow.addEventListener('click', () => showView('settings'));
  }

  // Back Buttons
  if (btnBackFromExplain) {
    btnBackFromExplain.addEventListener('click', () => showView(previousView || 'active'));
  }
  if (btnBackFromQuiz) {
    btnBackFromQuiz.addEventListener('click', () => showView(previousView || 'active'));
  }
  if (btnBackFromBreak) {
    btnBackFromBreak.addEventListener('click', () => showView(previousView || 'active'));
  }
  if (btnBackFromTools) {
    btnBackFromTools.addEventListener('click', () => showView(previousView || 'start'));
  }
  if (btnBackFromProgress) {
    btnBackFromProgress.addEventListener('click', () => showView(previousView || 'start'));
  }
  if (btnBackFromEmotion) {
    btnBackFromEmotion.addEventListener('click', () => showView(previousView || 'active'));
  }
  if (btnBackFromSettings) {
    btnBackFromSettings.addEventListener('click', () => showView(previousView || 'start'));
  }

  // -------------------------------------------------------------------------
  // Session Actions (Start / End)
  // -------------------------------------------------------------------------
  if (btnStartSession) {
    btnStartSession.addEventListener('click', () => {
      const startTime = Date.now();
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          sessionActive: true,
          sessionStartTime: startTime
        });
      }
      startSessionTimer(startTime);
      showView('active');
    });
  }

  if (btnEndSession) {
    btnEndSession.addEventListener('click', () => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['sessionStartTime', 'totalStudySeconds'], (res) => {
          const startTime = res.sessionStartTime || Date.now();
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const total = (res.totalStudySeconds || 2520) + Math.max(0, elapsed);

          chrome.storage.local.set({
            sessionActive: false,
            sessionStartTime: null,
            totalStudySeconds: total
          });
        });
      }
      stopSessionTimer();
      if (sessionTimerDisplay) {
        sessionTimerDisplay.textContent = '00:00:00';
      }
      showView('start');
    });
  }

  // -------------------------------------------------------------------------
  // Active Session Assistance Buttons
  // -------------------------------------------------------------------------
  if (btnOptExplain) {
    btnOptExplain.addEventListener('click', () => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['pendingSelection'], (res) => {
          const text = extractSelectionText(res.pendingSelection);
          loadExplanation(text || null);
          showView('explain');
        });
      } else {
        loadExplanation(null);
        showView('explain');
      }
    });
  }

  if (btnOptQuiz) {
    btnOptQuiz.addEventListener('click', () => {
      startQuiz();
      showView('quiz');
    });
  }

  if (btnOptBreak) {
    btnOptBreak.addEventListener('click', () => showView('break'));
  }

  if (btnOptEmotion) {
    btnOptEmotion.addEventListener('click', () => showView('emotion'));
  }

  // -------------------------------------------------------------------------
  // Explanation Logic
  // -------------------------------------------------------------------------
  function loadExplanation(text) {
    if (text && text.trim().length > 0) {
      if (explainContextPill) explainContextPill.textContent = 'From webpage selection';
      if (explainSourceText) explainSourceText.innerHTML = `&ldquo;${escapeHtml(text.trim())}&rdquo;`;
      if (explainSimplifiedText) {
        explainSimplifiedText.textContent = `In simple terms: this concept focuses on breaking complex ideas into clear, digestible steps so that you can understand the core principles without cognitive overload.`;
      }
      if (explainKeyPoints) {
        explainKeyPoints.innerHTML = `
          <li><span class="check-icon">&#10003;</span><span>Core concept captured directly from your active webpage.</span></li>
          <li><span class="check-icon">&#10003;</span><span>Simplified for intuitive retention and rapid review.</span></li>
          <li><span class="check-icon">&#10003;</span><span>Ready for instant quiz practice whenever you feel prepared.</span></li>
        `;
      }
    } else {
      // Default Stack Data Structure matching reference screen
      if (explainContextPill) explainContextPill.textContent = 'From your selected text';
      if (explainSourceText) {
        explainSourceText.innerHTML = 'A stack is a data structure that follows the <u>Last In, First Out (LIFO)</u> principle.';
      }
      if (explainSimplifiedText) {
        explainSimplifiedText.textContent = 'This means the last item added is the first one removed.';
      }
      if (explainKeyPoints) {
        explainKeyPoints.innerHTML = `
          <li><span class="check-icon">&#10003;</span><span>Only the top element can be accessed.</span></li>
          <li><span class="check-icon">&#10003;</span><span>You can only add or remove from the top.</span></li>
          <li><span class="check-icon">&#10003;</span><span>Used in functions, undo operations, and recursion.</span></li>
        `;
      }
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // -------------------------------------------------------------------------
  // Quiz Logic
  // -------------------------------------------------------------------------
  function startQuiz() {
    currentQuizIndex = 0;
    currentQuizScore = 0;
    renderQuizQuestion();
  }

  function loadQuizForText(text) {
    if (text && text.trim().length > 0) {
      // Create a contextual quiz question from selected text
      quizBank[0] = {
        id: 1,
        question: `Based on your selection: "${text.slice(0, 60)}...", what is the key takeaway?`,
        options: [
          { label: 'A', text: 'It defines a foundational principle or rule.' },
          { label: 'B', text: 'It represents an outdated legacy practice.' },
          { label: 'C', text: 'It only applies in isolated, theoretical scenarios.' },
          { label: 'D', text: 'None of the above.' }
        ],
        correctIndex: 0,
        explanation: 'The excerpt highlights the fundamental definition and operational rule of the concept!'
      };
    }
    startQuiz();
  }

  function renderQuizQuestion() {
    questionAnswered = false;
    const item = quizBank[currentQuizIndex];
    if (!item) {
      renderQuizFinished();
      return;
    }

    if (quizProgressText) {
      quizProgressText.textContent = `${currentQuizIndex + 1}/${quizBank.length}`;
    }
    if (quizQuestionTitle) {
      quizQuestionTitle.textContent = item.question;
    }
    if (quizFeedback) {
      quizFeedback.style.display = 'none';
      quizFeedback.className = 'quiz-feedback-box';
      quizFeedback.textContent = '';
    }

    if (btnQuizNext) {
      btnQuizNext.textContent = currentQuizIndex === quizBank.length - 1 ? 'Finish Quiz ✓' : 'Next →';
    }

    if (quizOptionsContainer) {
      quizOptionsContainer.innerHTML = '';
      item.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `
          <span class="quiz-option-letter">${opt.label}</span>
          <span class="quiz-option-text">${escapeHtml(opt.text)}</span>
        `;
        btn.addEventListener('click', () => handleOptionSelect(idx));
        quizOptionsContainer.appendChild(btn);
      });
    }
  }

  function handleOptionSelect(selectedIndex) {
    if (questionAnswered) return;
    questionAnswered = true;

    const item = quizBank[currentQuizIndex];
    const optionButtons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');

    optionButtons.forEach((btn, idx) => {
      btn.classList.add('disabled');
      if (idx === item.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('incorrect');
      }
    });

    const isCorrect = selectedIndex === item.correctIndex;
    if (isCorrect) {
      currentQuizScore += 1;
      quizFeedback.className = 'quiz-feedback-box';
      quizFeedback.innerHTML = `<strong>Spot on! 🌿</strong> ${item.explanation}`;
    } else {
      quizFeedback.className = 'quiz-feedback-box feedback-incorrect';
      quizFeedback.innerHTML = `<strong>Good attempt!</strong> ${item.explanation}`;
    }
    quizFeedback.style.display = 'block';
  }

  if (btnQuizNext) {
    btnQuizNext.addEventListener('click', () => {
      if (!questionAnswered) {
        // If not answered yet, highlight first as hint
        handleOptionSelect(0);
        return;
      }

      currentQuizIndex += 1;
      if (currentQuizIndex < quizBank.length) {
        renderQuizQuestion();
      } else {
        renderQuizFinished();
      }
    });
  }

  function renderQuizFinished() {
    if (quizProgressText) quizProgressText.textContent = `${quizBank.length}/${quizBank.length}`;
    if (quizQuestionTitle) {
      quizQuestionTitle.textContent = `Quiz Completed! 🎉`;
    }
    if (quizFeedback) {
      quizFeedback.style.display = 'none';
    }

    const accuracyPct = Math.round((currentQuizScore / quizBank.length) * 100);

    // Save quiz score in storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['quizzesCompleted', 'quizAccuracy'], (res) => {
        const completed = (res.quizzesCompleted || 3) + 1;
        chrome.storage.local.set({
          quizzesCompleted: completed,
          quizAccuracy: accuracyPct
        });
      });
    }

    if (quizOptionsContainer) {
      quizOptionsContainer.innerHTML = `
        <div style="background: #F2F7F0; border: 1.5px solid #C8DEC3; border-radius: 14px; padding: 18px 14px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 6px;">🐿️</div>
          <div style="font-size: 17px; font-weight: 800; color: #244B43; margin-bottom: 4px;">
            You scored ${currentQuizScore} out of ${quizBank.length}! (${accuracyPct}%)
          </div>
          <div style="font-size: 12.5px; color: #5C7066; margin-bottom: 14px;">
            ${accuracyPct >= 70 ? 'Wonderful work! Your understanding is taking root and growing strong.' : 'Good practice! Every session strengthens your learning tree.'}
          </div>
          <button type="button" id="btn-quiz-retry" style="background: #718F73; color: white; font-weight: 700; font-size: 13px; border-radius: 9999px; padding: 9px 18px; margin-right: 8px;">
            Review Again
          </button>
          <button type="button" id="btn-quiz-done" style="background: #E8F0E4; color: #244B43; font-weight: 700; font-size: 13px; border-radius: 9999px; padding: 9px 18px;">
            Return to Session
          </button>
        </div>
      `;

      const btnRetry = document.getElementById('btn-quiz-retry');
      const btnDone = document.getElementById('btn-quiz-done');

      if (btnRetry) btnRetry.addEventListener('click', startQuiz);
      if (btnDone) btnDone.addEventListener('click', () => showView('active'));
    }

    if (btnQuizNext) {
      btnQuizNext.style.display = 'none';
    }
  }

  // -------------------------------------------------------------------------
  // Break Timer Logic
  // -------------------------------------------------------------------------
  function formatBreakCountdown(totalSec) {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  }

  function startBreakCountdown() {
    isBreakRunning = true;
    if (breakTimerDisplay) breakTimerDisplay.style.display = 'block';
    if (breakBtnLabel) breakBtnLabel.textContent = 'Pause Break';

    if (breakTimerInterval) clearInterval(breakTimerInterval);

    breakTimerInterval = setInterval(() => {
      breakSecondsRemaining -= 1;
      if (breakCountdown) {
        breakCountdown.textContent = formatBreakCountdown(breakSecondsRemaining);
      }

      if (breakSecondsRemaining <= 0) {
        clearInterval(breakTimerInterval);
        breakTimerInterval = null;
        isBreakRunning = false;
        if (breakBtnLabel) breakBtnLabel.textContent = 'Break Finished!';

        // Record break count
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get(['breaksTaken'], (res) => {
            chrome.storage.local.set({ breaksTaken: (res.breaksTaken || 1) + 1 });
          });
        }
      }
    }, 1000);
  }

  function pauseBreakCountdown() {
    isBreakRunning = false;
    if (breakTimerInterval) {
      clearInterval(breakTimerInterval);
      breakTimerInterval = null;
    }
    if (breakBtnLabel) breakBtnLabel.textContent = 'Resume Break';
  }

  if (btnStartBreak) {
    btnStartBreak.addEventListener('click', () => {
      if (!isBreakRunning) {
        startBreakCountdown();
      } else {
        pauseBreakCountdown();
      }
    });
  }

  if (btnBreakLater) {
    btnBreakLater.addEventListener('click', () => showView('active'));
  }

  // -------------------------------------------------------------------------
  // Study Tools & Webpage Selection Interaction
  // -------------------------------------------------------------------------
  function fetchSelectionFromTab() {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) return;
        const activeTab = tabs[0];
        if (!activeTab.id) return;

        chrome.tabs.sendMessage(activeTab.id, { action: 'GET_PAGE_SELECTION' }, (response) => {
          if (chrome.runtime.lastError) {
            // Content script might not be injected on restricted pages (e.g. chrome://)
            return;
          }
          const text = response ? (response.selectedText || response.selection) : '';
          if (text && text.trim().length > 0) {
            if (toolsInputText) {
              toolsInputText.value = text.trim();
            }
          }
        });
      });
    }
  }

  if (btnRefreshSelection) {
    btnRefreshSelection.addEventListener('click', fetchSelectionFromTab);
  }

  if (btnToolExplain) {
    btnToolExplain.addEventListener('click', () => {
      const text = toolsInputText ? toolsInputText.value.trim() : '';
      loadExplanation(text || null);
      showView('explain');
    });
  }

  if (btnToolQuiz) {
    btnToolQuiz.addEventListener('click', () => {
      const text = toolsInputText ? toolsInputText.value.trim() : '';
      loadQuizForText(text);
      showView('quiz');
    });
  }

  // -------------------------------------------------------------------------
  // My Progress Statistics
  // -------------------------------------------------------------------------
  function updateProgressStats() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(
        ['totalStudyMinutes', 'totalStudySeconds', 'quizzesCompleted', 'quizzesCorrect', 'quizAccuracy', 'breaksTaken', 'breakCount'],
        (res) => {
          let mins = 42;
          if (res.totalStudyMinutes !== undefined) {
            mins = res.totalStudyMinutes;
          } else if (res.totalStudySeconds !== undefined) {
            mins = Math.floor(res.totalStudySeconds / 60);
          }
          if (statStudyTime) statStudyTime.textContent = `${mins}m`;

          if (statQuizzesTaken) {
            statQuizzesTaken.textContent = String(res.quizzesCompleted !== undefined ? res.quizzesCompleted : 3);
          }

          if (statAccuracy) {
            let acc = 100;
            if (res.quizAccuracy !== undefined) {
              acc = res.quizAccuracy;
            } else if (res.quizzesCompleted && res.quizzesCorrect !== undefined) {
              acc = Math.round((res.quizzesCorrect / res.quizzesCompleted) * 100);
            }
            statAccuracy.textContent = `${acc}%`;
          }

          if (statBreaksTaken) {
            const breaks = res.breaksTaken !== undefined ? res.breaksTaken : (res.breakCount !== undefined ? res.breakCount : 1);
            statBreaksTaken.textContent = String(breaks);
          }
        }
      );
    }
  }

  // -------------------------------------------------------------------------
  // Emotion Check Interaction
  // -------------------------------------------------------------------------
  const moodResponses = {
    focused: {
      title: 'Wonderful momentum! 🌿',
      desc: 'You are in a deep learning flow. Keep taking comfortable breaths, drink water, and let yourself enjoy the progress.'
    },
    calm: {
      title: 'Peaceful and steady ☕',
      desc: 'Calm is the best state for retaining concepts. Your mind is open and ready to connect new ideas.'
    },
    curious: {
      title: 'Curiosity ignited! ☀️',
      desc: 'Exploration makes knowledge stick effortlessly. Keep asking "why" and "how" as you read through your materials.'
    },
    tired: {
      title: 'Rest is part of learning 🌙',
      desc: 'Memory consolidation happens when the brain rests. Take a 5-minute break or stretch to give your eyes a pause.'
    },
    overwhelmed: {
      title: 'Let\'s take it one acorn at a time 🌧️',
      desc: 'Big topics feel lighter when broken into bite-sized pieces. Use "Explain Simply" to demystify complex terms first.'
    }
  };

  moodButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      moodButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const mood = btn.getAttribute('data-mood');
      const response = moodResponses[mood] || moodResponses.focused;

      if (moodFeedbackBox && moodFeedbackTitle && moodFeedbackDesc) {
        moodFeedbackTitle.textContent = response.title;
        moodFeedbackDesc.textContent = response.desc;
        moodFeedbackBox.style.display = 'block';
      }
    });
  });

  // -------------------------------------------------------------------------
  // Settings & Modals
  // -------------------------------------------------------------------------
  function openSettingsModal(title, htmlContent) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalContent) modalContent.innerHTML = htmlContent;
    if (settingsModal) settingsModal.style.display = 'flex';
  }

  function closeSettingsModal() {
    if (settingsModal) settingsModal.style.display = 'none';
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeSettingsModal);
  }

  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        closeSettingsModal();
      }
    });
  }

  if (btnSettingAccount) {
    btnSettingAccount.addEventListener('click', () => {
      openSettingsModal(
        'Student Profile',
        `
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
          <img src="assets/camber-logo.png" style="width:40px;height:40px;border-radius:50%;" />
          <div>
            <div style="font-weight:700; color:#244B43;">Final Year Scholar</div>
            <div style="font-size:11.5px; color:#5C7066;">Camber Learning Companion v1.0</div>
          </div>
        </div>
        <p style="margin-bottom:8px;"><strong>Study Habit:</strong> Morning & Evening deep work</p>
        <p style="margin-bottom:8px;"><strong>Companion Mode:</strong> Gentle Encouragement</p>
        <p style="color:#718F73; font-weight:600;">🌿 All study data is safely kept in your local browser storage.</p>
        `
      );
    });
  }

  if (btnSettingPermissions) {
    btnSettingPermissions.addEventListener('click', () => {
      openSettingsModal(
        'Permissions & Privacy',
        `
        <p style="margin-bottom:8px;"><strong>Active Tab:</strong> Used exclusively to detect highlighted study text when you request an explanation or quiz.</p>
        <p style="margin-bottom:8px;"><strong>Storage:</strong> Saves your study session duration and quiz progress locally on your computer.</p>
        <p style="margin-bottom:8px;"><strong>Context Menus:</strong> Adds a quick right-click "Ask CAMBER about..." shortcut for study text.</p>
        <p style="color:#718F73; font-weight:600;">🔒 CAMBER never transmits your personal data or browsing activity.</p>
        `
      );
    });
  }

  if (toggleNotifications) {
    toggleNotifications.addEventListener('change', (e) => {
      const enabled = e.target.checked;
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ notificationsEnabled: enabled });
      }
    });
  }

  if (btnSettingAbout) {
    btnSettingAbout.addEventListener('click', () => {
      openSettingsModal(
        'About CAMBER',
        `
        <div style="text-align:center; margin-bottom:10px;">
          <img src="assets/camber-logo.png" style="width:48px;height:48px;border-radius:50%;margin-bottom:4px;" />
          <div style="font-weight:800; font-size:16px; color:#244B43;">CAMBER</div>
          <div style="font-size:11px; color:#5C7066;">Emotion-Aware AI Study Companion</div>
        </div>
        <p style="margin-bottom:8px;">CAMBER helps learners turn overwhelming study sessions into calm, curious, and effective learning journeys.</p>
        <p style="font-size:11px; color:#82948A;">College Final-Year Capstone Project &bull; Manifest V3 &bull; Version 1.0.0</p>
        `
      );
    });
  }

  // -------------------------------------------------------------------------
  // Start on Load
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', initApp);
})();
