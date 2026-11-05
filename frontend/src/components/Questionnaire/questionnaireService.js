/**
 * Reusable Questionnaire Submission Service
 * Persists responses to localStorage and provides a clean API interface
 * ready for the backend personalization module.
 */

const STORAGE_KEY_ANSWERS = "camber_questionnaire_answers";
const STORAGE_KEY_COMPLETED = "camber_learner_profile_completed";

export const questionnaireService = {
  /**
   * Check if user has already completed their onboarding questionnaire
   */
  hasCompletedProfile: () => {
    try {
      return localStorage.getItem(STORAGE_KEY_COMPLETED) === "true";
    } catch {
      return false;
    }
  },

  /**
   * Retrieve cached questionnaire answers
   */
  getSavedAnswers: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ANSWERS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Submit questionnaire responses
   * @param {Object} answers - Map of Question IDs to answers (single string or string array)
   * @param {Object} metadata - Optional metadata (user ID, completion timestamp, etc.)
   */
  submitAnswers: async (answers, metadata = {}) => {
    const payload = {
      submittedAt: new Date().toISOString(),
      answers,
      metadata: {
        totalQuestions: 15,
        version: "1.0.0",
        ...metadata,
      },
    };

    // 1. Always persist safely to localStorage
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(payload));
      localStorage.setItem(STORAGE_KEY_COMPLETED, "true");
    } catch (e) {
      console.warn("Could not save questionnaire to localStorage:", e);
    }

    // 2. Ready for backend API if present
    try {
      // Graceful fetch to backend if configured
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("camber_id_token");
      
      const response = await fetch(`${apiUrl}/api/learner-profile/questionnaire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, source: "backend", data: result };
      }
    } catch (apiError) {
      // Backend not yet running or endpoint is future sprint - local persistence succeeds
      console.info("Questionnaire saved locally (backend endpoint pending integration).");
    }

    return {
      success: true,
      source: "local",
      payload,
    };
  },

  /**
   * Reset completion status (for testing or profile updates)
   */
  resetProfile: () => {
    try {
      localStorage.removeItem(STORAGE_KEY_ANSWERS);
      localStorage.removeItem(STORAGE_KEY_COMPLETED);
    } catch (e) {
      console.warn("Error resetting profile:", e);
    }
  },
};

