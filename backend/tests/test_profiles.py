from unittest.mock import patch, MagicMock
from datetime import datetime, timezone
import pytest
from fastapi.testclient import TestClient
from pymongo.errors import DuplicateKeyError
from bson import ObjectId

from app.main import app

client = TestClient(app)

# Helper fixtures and constants
VALID_QUESTIONNAIRE_ANSWERS = {
    "Q4": "Often",
    "Q6": "25-30 minutes",
    "Q7": "I can focus for a bit, then I drift",
    "Q8": "Morning",
    "Q9": "15-30 minutes",
    "Q10": "Take a quick break",
    "Q18": ["Math", "Physics"],
    "Q21": ["Staying focused", "Getting started"],
    "Q11": ["Phone", "Noise"],
    "Q12": "Diagrams, pictures and visual explanations",
    "Q13": "Videos",
    "Q14": "Seeing an example",
    "Q19": "Good grades",
    "Q20": ["Taking a short break", "Seeing my progress"],
    "Q23": "Small sections one at a time"
}

MOCK_USER = {
    "uid": "learner_uid_12345",
    "name": "Alex Rivera",
    "email": "alex.rivera@camber.edu"
}

AUTH_HEADERS = {"Authorization": "Bearer mock_valid_token"}


def create_mock_db(profile_doc=None):
    """Generates a mocked MongoDB database instance."""
    mock_db = MagicMock()
    mock_collection = MagicMock()
    mock_db.__getitem__.return_value = mock_collection
    
    if profile_doc is not None:
        mock_collection.find_one.return_value = dict(profile_doc)
    else:
        mock_collection.find_one.return_value = None

    mock_insert_result = MagicMock()
    mock_insert_result.inserted_id = ObjectId("507f1f77bcf86cd799439011")
    mock_collection.insert_one.return_value = mock_insert_result

    return mock_db, mock_collection


# =============================================================================
# 1. AUTHENTICATION & ACCESS CONTROL TESTS
# =============================================================================

def test_create_profile_unauthenticated():
    """POST /api/profiles returns 401 Unauthorized when Bearer token is missing."""
    response = client.post("/api/profiles", json={"answers": VALID_QUESTIONNAIRE_ANSWERS})
    assert response.status_code == 401
    assert "Authorization token is missing" in response.json()["detail"]


def test_get_my_profile_unauthenticated():
    """GET /api/profiles/me returns 401 Unauthorized when Bearer token is missing."""
    response = client.get("/api/profiles/me")
    assert response.status_code == 401


def test_update_my_profile_unauthenticated():
    """PUT /api/profiles/me returns 401 Unauthorized when Bearer token is missing."""
    response = client.put("/api/profiles/me", json={"learning_goals": ["Pass Exams"]})
    assert response.status_code == 401


# =============================================================================
# 2. QUESTIONNAIRE SUBMISSION & PROFILE CREATION TESTS
# =============================================================================

def test_create_profile_questionnaire_success():
    """
    Submitting valid 15-question responses creates a learner profile
    associated with the authenticated user's verified UID.
    """
    mock_db, mock_collection = create_mock_db(profile_doc=None)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        payload = {
            "submittedAt": "2026-11-12T10:00:00Z",
            "answers": VALID_QUESTIONNAIRE_ANSWERS
        }
        response = client.post("/api/profiles", json=payload, headers=AUTH_HEADERS)
        assert response.status_code == 201

        data = response.json()
        assert data["user_id"] == MOCK_USER["uid"]
        assert data["preferred_explanation_style"] == "visual"
        assert data["study_preferences"]["session_duration_minutes"] == 25
        assert data["study_preferences"]["learning_pace"] == "gentle"
        assert "Math" in data["areas_for_improvement"]
        assert data["questionnaire_responses"]["Q4"] == "Often"

        # Verify MongoDB was called with single-user isolation
        mock_collection.insert_one.assert_called_once()
        inserted_doc = mock_collection.insert_one.call_args[0][0]
        assert inserted_doc["user_id"] == MOCK_USER["uid"]


def test_create_profile_questionnaire_alias_endpoint():
    """
    POST /api/learner-profile/questionnaire functions as an alias to /api/profiles
    for seamless integration with the existing React frontend.
    """
    mock_db, mock_collection = create_mock_db(profile_doc=None)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        payload = {"answers": VALID_QUESTIONNAIRE_ANSWERS}
        response = client.post("/api/learner-profile/questionnaire", json=payload, headers=AUTH_HEADERS)
        assert response.status_code == 201
        assert response.json()["user_id"] == MOCK_USER["uid"]


# =============================================================================
# 3. QUESTIONNAIRE VALIDATION & EDGE CASES
# =============================================================================

def test_create_profile_missing_required_questions():
    """Questionnaire missing required questions fails with 422 Unprocessable Entity."""
    mock_db, _ = create_mock_db(profile_doc=None)

    incomplete_answers = {
        "Q4": "Often",
        "Q6": "25-30 minutes"
        # Missing remaining 13 questions
    }

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        response = client.post("/api/profiles", json={"answers": incomplete_answers}, headers=AUTH_HEADERS)
        assert response.status_code == 422
        assert "Missing required questionnaire responses" in response.json()["detail"]


def test_create_profile_invalid_single_choice_option():
    """Questionnaire with an unpermitted single-choice option fails validation."""
    mock_db, _ = create_mock_db(profile_doc=None)

    invalid_answers = dict(VALID_QUESTIONNAIRE_ANSWERS)
    invalid_answers["Q4"] = "NonExistentOption"

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        response = client.post("/api/profiles", json={"answers": invalid_answers}, headers=AUTH_HEADERS)
        assert response.status_code == 422
        assert "Invalid option" in response.json()["detail"]


def test_create_profile_invalid_multiple_choice_option():
    """Questionnaire with an unpermitted option in multiple-choice list fails validation."""
    mock_db, _ = create_mock_db(profile_doc=None)

    invalid_answers = dict(VALID_QUESTIONNAIRE_ANSWERS)
    invalid_answers["Q18"] = ["Math", "RocketScience101"]

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        response = client.post("/api/profiles", json={"answers": invalid_answers}, headers=AUTH_HEADERS)
        assert response.status_code == 422
        assert "Invalid option" in response.json()["detail"]


def test_create_profile_q21_mutual_exclusivity():
    """
    Question 8 / Q21 'None of these' cannot be combined with other obstacle options.
    Must fail validation if selected alongside other choices.
    """
    mock_db, _ = create_mock_db(profile_doc=None)

    invalid_answers = dict(VALID_QUESTIONNAIRE_ANSWERS)
    invalid_answers["Q21"] = ["None of these", "Staying focused"]

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        response = client.post("/api/profiles", json={"answers": invalid_answers}, headers=AUTH_HEADERS)
        assert response.status_code == 422
        assert "cannot be selected alongside other options" in response.json()["detail"]


# =============================================================================
# 4. DUPLICATE PROFILE PREVENTION & CONFLICTS
# =============================================================================

def test_create_profile_duplicate_conflict():
    """POST /api/profiles returns 409 Conflict if user already has an active profile."""
    existing_doc = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER["uid"],
        "learning_goals": [],
        "preferred_explanation_style": "simple",
        "study_preferences": {"session_duration_minutes": 25, "break_duration_minutes": 5, "learning_pace": "moderate", "reminder_frequency": "normal"},
        "strengths": [],
        "areas_for_improvement": [],
        "attention_preferences": {"prefer_break_reminders": True, "break_reminder_interval_minutes": 25, "background_sounds": "none"},
        "accessibility_settings": {"reading_assistance": False, "text_to_speech": False, "display_preferences": "standard", "adaptive_pacing": True},
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    mock_db, _ = create_mock_db(profile_doc=existing_doc)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        response = client.post("/api/profiles", json={"answers": VALID_QUESTIONNAIRE_ANSWERS}, headers=AUTH_HEADERS)
        assert response.status_code == 409
        assert "already exists" in response.json()["detail"]


def test_create_profile_duplicate_key_error():
    """POST /api/profiles returns 409 Conflict when PyMongo raises DuplicateKeyError."""
    mock_db, mock_collection = create_mock_db(profile_doc=None)
    mock_collection.insert_one.side_effect = DuplicateKeyError("E11000 duplicate key error")

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        response = client.post("/api/profiles", json={"answers": VALID_QUESTIONNAIRE_ANSWERS}, headers=AUTH_HEADERS)
        assert response.status_code == 409
        assert "already exists" in response.json()["detail"]


# =============================================================================
# 5. RETRIEVAL & USER ISOLATION TESTS
# =============================================================================

def test_get_my_profile_success():
    """GET /api/profiles/me returns profile document for authenticated user."""
    profile_doc = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER["uid"],
        "learning_goals": ["Calculus", "Algorithms"],
        "preferred_explanation_style": "visual",
        "study_preferences": {"session_duration_minutes": 35, "break_duration_minutes": 5, "learning_pace": "moderate", "reminder_frequency": "normal"},
        "strengths": ["Logic"],
        "areas_for_improvement": ["Patience"],
        "attention_preferences": {"prefer_break_reminders": True, "break_reminder_interval_minutes": 35, "background_sounds": "none"},
        "accessibility_settings": {"reading_assistance": False, "text_to_speech": False, "display_preferences": "standard", "adaptive_pacing": True},
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    mock_db, _ = create_mock_db(profile_doc=profile_doc)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        response = client.get("/api/profiles/me", headers=AUTH_HEADERS)
        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == MOCK_USER["uid"]
        assert data["learning_goals"] == ["Calculus", "Algorithms"]
        assert data["preferred_explanation_style"] == "visual"


def test_get_my_profile_not_found():
    """GET /api/profiles/me returns 404 Not Found when profile does not exist."""
    mock_db, _ = create_mock_db(profile_doc=None)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        response = client.get("/api/profiles/me", headers=AUTH_HEADERS)
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


def test_get_profile_by_user_id_user_isolation():
    """
    Enforces user isolation: an authenticated user cannot view another user's profile.
    Requesting someone else's UID returns 403 Forbidden.
    """
    mock_db, _ = create_mock_db(profile_doc=None)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        # Attempt to access another user's profile
        response = client.get("/api/profiles/victim_user_999", headers=AUTH_HEADERS)
        assert response.status_code == 403
        assert "Access forbidden" in response.json()["detail"]


# =============================================================================
# 6. PROFILE UPDATE & IMMUTABILITY TESTS
# =============================================================================

def test_update_my_profile_success():
    """PUT /api/profiles/me updates learner preferences and sets new updated_at."""
    initial_time = datetime(2026, 11, 10, 12, 0, 0, tzinfo=timezone.utc)
    existing_doc = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER["uid"],
        "learning_goals": ["Goal 1"],
        "preferred_explanation_style": "simple",
        "study_preferences": {"session_duration_minutes": 25, "break_duration_minutes": 5, "learning_pace": "moderate", "reminder_frequency": "normal"},
        "strengths": [],
        "areas_for_improvement": [],
        "attention_preferences": {"prefer_break_reminders": True, "break_reminder_interval_minutes": 25, "background_sounds": "none"},
        "accessibility_settings": {"reading_assistance": False, "text_to_speech": False, "display_preferences": "standard", "adaptive_pacing": True},
        "created_at": initial_time,
        "updated_at": initial_time
    }
    mock_db, mock_collection = create_mock_db(profile_doc=existing_doc)

    # When find_one is called a second time after update, return modified document
    updated_doc = dict(existing_doc)
    updated_doc["learning_goals"] = ["Master Machine Learning", "Ace Linear Algebra"]
    updated_doc["preferred_explanation_style"] = "analogy"
    mock_collection.find_one.side_effect = [existing_doc, updated_doc]

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        payload = {
            "learning_goals": ["Master Machine Learning", "Ace Linear Algebra"],
            "preferred_explanation_style": "analogy"
        }
        response = client.put("/api/profiles/me", json=payload, headers=AUTH_HEADERS)
        assert response.status_code == 200

        data = response.json()
        assert data["learning_goals"] == ["Master Machine Learning", "Ace Linear Algebra"]
        assert data["preferred_explanation_style"] == "analogy"

        # Verify update_one was dispatched to MongoDB
        mock_collection.update_one.assert_called_once()
        query_filter = mock_collection.update_one.call_args[0][0]
        update_op = mock_collection.update_one.call_args[0][1]
        assert query_filter == {"user_id": MOCK_USER["uid"]}
        assert update_op["$set"]["preferred_explanation_style"] == "analogy"
        assert "updated_at" in update_op["$set"]


def test_update_my_profile_prevents_changing_user_id_or_created_at():
    """
    Attempting to overwrite user_id or created_at in PUT /api/profiles/me
    strictly strips those keys, protecting document integrity.
    """
    existing_doc = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER["uid"],
        "learning_goals": ["Goal 1"],
        "preferred_explanation_style": "simple",
        "study_preferences": {"session_duration_minutes": 25, "break_duration_minutes": 5, "learning_pace": "moderate", "reminder_frequency": "normal"},
        "strengths": [],
        "areas_for_improvement": [],
        "attention_preferences": {"prefer_break_reminders": True, "break_reminder_interval_minutes": 25, "background_sounds": "none"},
        "accessibility_settings": {"reading_assistance": False, "text_to_speech": False, "display_preferences": "standard", "adaptive_pacing": True},
        "created_at": datetime(2026, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2026, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
    }
    mock_db, mock_collection = create_mock_db(profile_doc=existing_doc)
    mock_collection.find_one.side_effect = [existing_doc, existing_doc]

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER), \
         patch("app.routes.profiles.get_mongodb_db", return_value=mock_db):

        payload = {
            "user_id": "malicious_hacker_uid",
            "created_at": "1990-01-01T00:00:00Z",
            "learning_goals": ["Goal 2"]
        }
        response = client.put("/api/profiles/me", json=payload, headers=AUTH_HEADERS)
        assert response.status_code == 200

        # Verify update_one did NOT contain user_id or created_at in $set
        mock_collection.update_one.assert_called_once()
        update_op = mock_collection.update_one.call_args[0][1]
        assert "user_id" not in update_op["$set"]
        assert "created_at" not in update_op["$set"]
        assert "id" not in update_op["$set"]
        assert "_id" not in update_op["$set"]

