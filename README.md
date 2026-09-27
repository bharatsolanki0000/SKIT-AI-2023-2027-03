# CAMBER
### Cognitive Assistance and Mood-Based Educational Responder

CAMBER is an AI-based educational assistance system designed to provide personalized and adaptive learning support by considering the learner's emotional state.

The system uses facial emotion recognition to identify the learner's current emotional state and adapts the learning experience accordingly. Based on the detected emotion, CAMBER can modify the way educational content is presented, such as simplifying explanations, providing examples, introducing interactive activities, or suggesting short breaks.

---

## 📌 Problem Statement

Traditional e-learning platforms mainly focus on delivering educational content without considering the learner's emotional and cognitive state.

Learners may experience emotions such as confusion, boredom, stress, or lack of engagement during a learning session. If these states are not considered, the learning experience may become less effective.

CAMBER aims to address this problem by integrating facial emotion recognition with an adaptive educational system to provide a more personalized and learner-centered experience.

---

## 🎯 Objectives

- Detect the learner's facial emotional state using an AI-based emotion recognition model.
- Provide personalized educational responses based on the detected emotional state.
- Adapt explanations and learning activities according to the learner's current state.
- Improve learner engagement and understanding.
- Provide a more inclusive and learner-centered educational environment.
- Explore the use of AI for emotion-aware adaptive learning.

---

## ✨ Key Features

### 1. Facial Emotion Recognition
CAMBER uses a CNN-based facial emotion recognition approach with OpenCV to analyze facial expressions and identify the learner's emotional state.

### 2. Emotion-Aware Learning
The system uses the detected emotional state as an input for adapting the learning experience.

### 3. Adaptive Educational Responses
Depending on the learner's state, the system can provide different types of support, such as:

- Simplified explanations
- Additional examples
- Visual learning assistance
- Interactive questions or quizzes
- Encouragement and engagement activities
- Short break or relaxation suggestions

### 4. Personalized Learning
CAMBER aims to provide different learning experiences for different learners based on their learning preferences and current state.

### 5. Accessibility-Oriented Learning
The system can be extended to support learners with different learning needs through features such as:

- Adjustable learning pace
- Simplified content
- Reading assistance
- Text-to-speech support
- Customizable interface

---

## 🧠 System Workflow

```text
                ┌──────────────────────┐
                │       Learner        │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  Camera Input        │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Face Detection       │
                │     (OpenCV)         │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Facial Emotion       │
                │ Recognition (CNN)    │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Detected Emotional   │
                │       State          │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Adaptive Response    │
                │      Engine          │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Personalized        │
                │ Learning Support     │
                └──────────────────────┘