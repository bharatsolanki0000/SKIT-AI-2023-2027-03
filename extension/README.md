# CAMBER Chrome Extension – Emotion-Aware AI Study Companion
**College Final-Year Project Capstone**

A warm, whimsical woodland Chrome extension (Manifest V3) that helps students understand complex learning materials, generate quizzes, take restorative breaks, and reflect on their emotional energy while browsing the web.

---

## 🌲 Design & Aesthetic

The extension faithfully implements the storybook-inspired visual identity established by CAMBER:
- **Palette**: Warm cream (`#FCFAF4`), woodland sage green (`#718F73`), deep forest green (`#244B43`), soft butter yellow, sky blue, and peach accents.
- **Mascots**: The reading squirrel, resting woodland squirrel, and peeking companion mascot.
- **Mood**: Calming, encouraging, and gentle—designed to reduce cognitive friction and study anxiety.

---

## 🚀 The 8 Deliverable Views & Features

The extension implements all 8 interfaces shown in the primary reference board:

1. **Extension Toolbar Icons**:
   - Custom-crafted icons in 16x16, 32x32, 48x48, and 128x128 px formats, perfectly displayed in the Chrome toolbar and extension manager.

2. **Extension Popup – Start Session (`view-start`)**:
   - Warm "Hi there!" greeting with botanical sprout accent.
   - Primary **Start Learning Session** button with play icon and soft hover lift.
   - Quick navigation menu rows: *Study Tools*, *My Progress*, and *Settings*.
   - Illustrated bottom woodland foliage with the peeking squirrel companion.

3. **Active Session – Assistance Options (`view-active`)**:
   - Live session status bar with animated pulsing green dot and live elapsed timer (`00:14:22`).
   - "End" session button that tallies total study time to local storage.
   - Four distinct assistance cards with color-coded circular icons:
     - 💡 **Explain Simply** (Yellow) — Get an easier explanation
     - 📄 **Generate Quiz** (Green) — Test your understanding
     - ☕ **Take a Break** (Blue) — Rest and recharge
     - 📷 **Emotion Check** (Peach) — How are you feeling?
   - Encouragement banner ("You're doing great! Small steps lead to big progress.") with peeking mascot.

4. **Explanation Result (`view-explain`)**:
   - "Explained Simply" header badge with topic pill.
   - Source text card with highlighted key terms (e.g. *Last In, First Out (LIFO)*).
   - Plain-English breakdown explaining the concept intuitively.
   - **Key Points** card featuring soft green circular checkmarks (`✓`).
   - Supportive reassurance card ("Take your time. You're learning, and that's what matters!").

5. **Quiz Interface (`view-quiz`)**:
   - Question counter badge (`1/3`, `2/3`, `3/3`) with sprout icon.
   - Clear question prompt with interactive options (A, B, C, D).
   - Real-time visual feedback:
     - Green border/badge for correct answers.
     - Rose border/badge for incorrect selections.
     - Contextual explanations explaining *why* the answer is correct.
   - Dynamic score calculation, accuracy percentage, and end-of-quiz completion screen with retry options.

6. **Break Suggestion (`view-break`)**:
   - Full woodland resting illustration featuring the CAMBER mascot napping peacefully under the trees.
   - Empathetic prompt: *"You seem a little tired. It's okay to take a break!"*
   - Interactive **5-Minute Countdown Timer** with real-time countdown, pause/resume capability, and calming breathing cues.
   - "Maybe later" secondary button returning seamlessly to study mode.

7. **Study Tools & In-Page Companion (`view-tools` & `content.js`)**:
   - **Popup Study Tools**: Captured webpage text area with instant **Fetch** button, plus one-click "Explain Simply" and "Generate Quiz" triggers.
   - **Interactive Browser Mockup**: Demonstrates how students can highlight text on lecture pages.
   - **In-Page Floating Companion**: On any website, selecting text reveals a floating "Ask CAMBER" badge. Clicking it opens a woodland action menu directly on the page!

8. **Extension Settings & Modals (`view-settings`)**:
   - Student Profile modal card.
   - Permissions & Privacy statement (local-only storage, zero external tracking).
   - Interactive **Notifications Toggle** switch.
   - "About CAMBER" story modal and version info (1.0.0).

---

## 🛠️ File Structure

```text
extension/
├── manifest.json              # Chrome Manifest V3 configuration
├── popup.html                 # Complete UI markup for all 8 views & dialogs
├── popup.css                  # Responsive styling & warm watercolor design system
├── popup.js                   # State controller, timers, quiz engine, & storage sync
├── background.js              # Service worker: context menus, break alarms, & state
├── content.js                 # In-page selection listener & floating study widget
├── content.css                # Floating widget & toast notification styling
├── README.md                  # Documentation and installation guide
└── assets/
    ├── camber-logo.png        # CAMBER mascot brand mark
    ├── squirrel-reading.png   # Mascot reading on stacked books
    ├── squirrel-resting.png   # Mascot resting peacefully in nature
    ├── squirrel-peeking.png   # Mascot peeking over cards and bottom foliage
    ├── icon16.png             # 16x16 toolbar icon
    ├── icon32.png             # 32x32 high-DPI toolbar icon
    ├── icon48.png             # 48x48 extension manager icon
    └── icon128.png            # 128x128 web store icon
```

---

## 📦 How to Install and Test in Chrome

1. Open Google Chrome.
2. In the URL bar, go to:
   ```text
   chrome://extensions/
   ```
3. In the top-right corner, switch **Developer mode** to **ON**.
4. In the top-left corner, click **Load unpacked**.
5. Browse to and select the `extension` folder located at:
   ```text
   c:\Users\ASUS\OneDrive\Desktop\camber\extension
   ```
6. Click **Select Folder**.
7. The **CAMBER – Emotion-Aware Study Companion** will appear in your extension list!
8. Click the puzzle icon in Chrome's top toolbar and pin **CAMBER** for easy access.

---

## 🧪 Testing the Extension Features

- **Test 1: Start a Learning Session**
  - Click the CAMBER icon in the toolbar.
  - Click **Start Learning Session**. Observe the live ticking timer (`00:00:01`, `00:00:02`...).
  - Close the popup and reopen it: note that the timer continues running seamlessly!
  - Click **End** to finish the session and log study minutes to your progress.

- **Test 2: Take a Quiz**
  - From the active session, click **Generate Quiz**.
  - Click an option (e.g. Option B: LIFO). Observe the instant green highlight and explanation.
  - Click **Next →** to proceed through all questions and view the final score card!

- **Test 3: Take a Restful Break**
  - Click **Take a Break**.
  - Click **Take a 5-minute Break**. Watch the 5:00 countdown begin. Click again to pause or resume.

- **Test 4: In-Page Text Selection & Study Tools**
  - Visit any web page (e.g., a Wikipedia article or documentation page).
  - Highlight 1–2 sentences with your mouse.
  - Notice the floating **"Ask CAMBER"** pill appearing right beside your text!
  - Click it to open the floating menu: choose **Explain Simply** or **Generate Quiz**.
  - A friendly notification toast will confirm the text is captured into your CAMBER study tools.
