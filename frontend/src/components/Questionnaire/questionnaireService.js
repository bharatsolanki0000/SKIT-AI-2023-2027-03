/**
 * Reusable Questionnaire & Learner Profile Service
 * Manages profile lifecycle, questionnaire submission, and updates.
 * Persists responses to localStorage and provides a clean REST interface
 * to the FastAPI backend (/api/profiles).
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

    // 2. Transmit to backend API if configured
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("camber_id_token");
      
      const response = await fetch(`${apiUrl}/api/profiles`, {
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
      console.info("Questionnaire saved locally (backend endpoint pending or offline).");
    }

    return {
      success: true,
      source: "local",
      payload,
    };
  },

  /**
   * Fetch current authenticated learner profile from backend
   */
  fetchProfile: async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("camber_id_token");
      if (!token) return null;

      const response = await fetch(`${apiUrl}/api/profiles/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (e) {
      console.warn("Could not fetch remote learner profile:", e);
      return null;
    }
  },

  /**
   * Update current authenticated learner profile preferences
   */
  updateProfile: async (updateData) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("camber_id_token");
      if (!token) throw new Error("Authentication required.");

      const response = await fetch(`${apiUrl}/api/profiles/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        return await response.json();
      }
      const err = await response.json();
      throw new Error(err.detail || "Profile update failed.");
    } catch (e) {
      console.warn("Error updating learner profile:", e);
      throw e;
    }
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
