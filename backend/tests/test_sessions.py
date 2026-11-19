from unittest.mock import patch, MagicMock
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import pytest
from fastapi.testclient import TestClient
from pymongo.errors import PyMongoError

from app.main import app
from app.schemas import SessionStatus, SupportedEmotion, AssistanceType

client = TestClient(app)

MOCK_USER_A = {
    "uid": "learner_uid_12345",
    "name": "Aditi",
    "email": "aditi@camber.edu"
}

MOCK_USER_B = {
    "uid": "learner_uid_99999",
    "name": "Bob",
    "email": "bob@camber.edu"
}

AUTH_HEADERS_USER_A = {"Authorization": "Bearer mock_valid_token_a"}
AUTH_HEADERS_USER_B = {"Authorization": "Bearer mock_valid_token_b"}


def create_mock_db(session_doc=None, history_docs=None):
    """Generates a mocked MongoDB database instance for study sessions testing."""
    mock_db = MagicMock()
    mock_collection = MagicMock()
    mock_db.__getitem__.return_value = mock_collection

    if session_doc is not None:
        mock_collection.find_one.return_value = dict(session_doc)
    else:
        mock_collection.find_one.return_value = None

    if history_docs is not None:
        mock_cursor = MagicMock()
        mock_cursor.sort.return_value = mock_cursor
        mock_cursor.skip.return_value = mock_cursor
        mock_cursor.limit.return_value = [dict(d) for d in history_docs]
        mock_cursor.__iter__.return_value = iter([dict(d) for d in history_docs])
        mock_collection.find.return_value = mock_cursor
        mock_collection.count_documents.return_value = len(history_docs)
    else:
        mock_cursor = MagicMock()
        mock_cursor.sort.return_value = mock_cursor
        mock_cursor.skip.return_value = mock_cursor
        mock_cursor.limit.return_value = []
        mock_cursor.__iter__.return_value = iter([])
        mock_collection.find.return_value = mock_cursor
        mock_collection.count_documents.return_value = 0

    mock_insert_result = MagicMock()
    mock_insert_result.inserted_id = ObjectId("507f1f77bcf86cd799439011")
    mock_collection.insert_one.return_value = mock_insert_result

    mock_update_result = MagicMock()
    mock_update_result.matched_count = 1
    mock_update_result.modified_count = 1
    mock_collection.update_one.return_value = mock_update_result

    return mock_db, mock_collection


# =============================================================================
# 1. AUTHENTICATION & ACCESS CONTROL TESTS
# =============================================================================

def test_unauthenticated_access_all_endpoints():
    """All session endpoints reject requests without a valid Authorization header with 401."""
    # 1. Start
    res1 = client.post("/api/sessions/start", json={})
    assert res1.status_code == 401
    assert "Authorization token is missing" in res1.json()["detail"]

    # 2. Emotion
    res2 = client.post("/api/sessions/507f1f77bcf86cd799439011/emotion", json={"predicted_label": "focused"})
    assert res2.status_code == 401

    # 3. Assistance
    res3 = client.post("/api/sessions/507f1f77bcf86cd799439011/assistance", json={"assistance_type": "explain_simply"})
    assert res3.status_code == 401

    # 4. End
    res4 = client.post("/api/sessions/507f1f77bcf86cd799439011/end", json={})
    assert res4.status_code == 401

    # 5. History
    res5 = client.get("/api/sessions/history")
    assert res5.status_code == 401

    # 6. Get single
    res6 = client.get("/api/sessions/507f1f77bcf86cd799439011")
    assert res6.status_code == 401


# =============================================================================
# 2. START A STUDY SESSION
# =============================================================================

def test_start_study_session_success():
    """POST /api/sessions/start creates an active study session associated with the authenticated user."""
    mock_db, mock_collection = create_mock_db()

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        payload = {
            "study_material_context": {"topic": "Data Structures - Stack", "subject": "Computer Science"}
        }
        response = client.post("/api/sessions/start", json=payload, headers=AUTH_HEADERS_USER_A)
        assert response.status_code == 201

        data = response.json()
        assert data["session_id"] == "507f1f77bcf86cd799439011"
        assert data["user_id"] == MOCK_USER_A["uid"]
        assert data["status"] == "active"
        assert data["study_material_context"]["topic"] == "Data Structures - Stack"

        # Verify MongoDB insertion
        mock_collection.insert_one.assert_called_once()
        inserted_doc = mock_collection.insert_one.call_args[0][0]
        assert inserted_doc["user_id"] == MOCK_USER_A["uid"]
        assert inserted_doc["status"] == "active"
        assert inserted_doc["emotion_events"] == []
        assert inserted_doc["assistance_events"] == []


# =============================================================================
# 3. RECORD EMOTION PREDICTION
# =============================================================================

def test_record_emotion_prediction_success():
    """POST /api/sessions/{session_id}/emotion records a model prediction event."""
    active_session = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER_A["uid"],
        "status": "active",
        "started_at": datetime.now(timezone.utc),
        "ended_at": None,
        "emotion_events": [],
        "assistance_events": []
    }
    mock_db, mock_collection = create_mock_db(session_doc=active_session)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        payload = {
            "predicted_label": "confused",
            "confidence": 0.88,
            "model_version": "MobileNetV2_Transfer_v1"
        }
        response = client.post(
            "/api/sessions/507f1f77bcf86cd799439011/emotion",
            json=payload,
            headers=AUTH_HEADERS_USER_A
        )
        assert response.status_code == 200
        assert response.json()["status"] == "recorded"
        assert response.json()["event"]["predicted_label"] == "confused"
        assert response.json()["event"]["confidence"] == 0.88

        # Verify atomic update
        mock_collection.update_one.assert_called_once()
        filter_query = mock_collection.update_one.call_args[0][0]
        update_op = mock_collection.update_one.call_args[0][1]
        assert filter_query == {"_id": ObjectId("507f1f77bcf86cd799439011"), "status": "active"}
        assert "$push" in update_op
        assert "emotion_events" in update_op["$push"]


def test_record_emotion_prediction_unsupported_label():
    """POST /api/sessions/{session_id}/emotion rejects invalid emotion labels with 422."""
    active_session = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER_A["uid"],
        "status": "active",
        "started_at": datetime.now(timezone.utc),
        "ended_at": None,
        "emotion_events": []
    }
    mock_db, _ = create_mock_db(session_doc=active_session)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        payload = {
            "predicted_label": "completely_unsupported_emotion",
            "confidence": 0.75
        }
        response = client.post(
            "/api/sessions/507f1f77bcf86cd799439011/emotion",
            json=payload,
            headers=AUTH_HEADERS_USER_A
        )
        assert response.status_code == 422


# =============================================================================
# 4. RECORD ASSISTANCE PROVIDED
# =============================================================================

def test_record_assistance_event_success():
    """POST /api/sessions/{session_id}/assistance appends an assistance record."""
    active_session = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER_A["uid"],
        "status": "active",
        "started_at": datetime.now(timezone.utc),
        "ended_at": None,
        "emotion_events": [],
        "assistance_events": []
    }
    mock_db, mock_collection = create_mock_db(session_doc=active_session)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        payload = {
            "assistance_type": "explain_simply",
            "reason": "Repeated confusion detected on topic",
            "action_details": {"concept": "Recursion base case"}
        }
        response = client.post(
            "/api/sessions/507f1f77bcf86cd799439011/assistance",
            json=payload,
            headers=AUTH_HEADERS_USER_A
        )
        assert response.status_code == 200
        assert response.json()["status"] == "recorded"
        assert response.json()["assistance"]["assistance_type"] == "explain_simply"

        # Verify atomic update
        mock_collection.update_one.assert_called_once()
        update_op = mock_collection.update_one.call_args[0][1]
        assert "$push" in update_op
        assert "assistance_events" in update_op["$push"]


# =============================================================================
# 5. END A STUDY SESSION & DURATION CALCULATION
# =============================================================================

def test_end_study_session_success_and_duration():
    """POST /api/sessions/{session_id}/end calculates server-side duration and sets summary."""
    started_time = datetime(2026, 11, 19, 10, 0, 0, tzinfo=timezone.utc)
    active_session = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER_A["uid"],
        "status": "active",
        "started_at": started_time,
        "ended_at": None,
        "emotion_events": [
            {"predicted_label": "focused", "confidence": 0.9, "timestamp": started_time},
            {"predicted_label": "focused", "confidence": 0.85, "timestamp": started_time},
            {"predicted_label": "confused", "confidence": 0.8, "timestamp": started_time}
        ],
        "assistance_events": [
            {"assistance_type": "explain_simply", "timestamp": started_time}
        ]
    }

    mock_db, mock_collection = create_mock_db(session_doc=active_session)

    # When find_one is queried after update, return completed document
    completed_doc = dict(active_session)
    completed_doc["status"] = "completed"
    completed_doc["ended_at"] = started_time + timedelta(minutes=25)
    mock_collection.find_one.side_effect = [active_session, completed_doc]

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        payload = {"notes": "Understood recursion base cases well!"}
        response = client.post(
            "/api/sessions/507f1f77bcf86cd799439011/end",
            json=payload,
            headers=AUTH_HEADERS_USER_A
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["ended_at"] is not None
        assert data["duration_seconds"] == 1500  # 25 minutes = 1500s
        assert data["total_duration_minutes"] == 25


def test_end_study_session_prevents_duplicate_ending():
    """POST /api/sessions/{session_id}/end rejects requests on already ended sessions with 400."""
    completed_session = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER_A["uid"],
        "status": "completed",
        "started_at": datetime.now(timezone.utc) - timedelta(minutes=30),
        "ended_at": datetime.now(timezone.utc)
    }
    mock_db, _ = create_mock_db(session_doc=completed_session)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        response = client.post(
            "/api/sessions/507f1f77bcf86cd799439011/end",
            json={},
            headers=AUTH_HEADERS_USER_A
        )
        assert response.status_code == 400
        assert "already been ended" in response.json()["detail"].lower()


def test_reject_emotion_on_ended_session():
    """POST /api/sessions/{session_id}/emotion rejects updates on ended sessions with 400."""
    completed_session = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER_A["uid"],
        "status": "completed",
        "started_at": datetime.now(timezone.utc) - timedelta(minutes=30),
        "ended_at": datetime.now(timezone.utc)
    }
    mock_db, _ = create_mock_db(session_doc=completed_session)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        response = client.post(
            "/api/sessions/507f1f77bcf86cd799439011/emotion",
            json={"predicted_label": "focused"},
            headers=AUTH_HEADERS_USER_A
        )
        assert response.status_code == 400
        assert "inactive or has already ended" in response.json()["detail"]


# =============================================================================
# 6. RETRIEVAL, HISTORY & CROSS-USER ISOLATION
# =============================================================================

def test_retrieve_session_history_authenticated():
    """GET /api/sessions/history returns sessions belonging strictly to authenticated user."""
    hist_docs = [
        {
            "_id": ObjectId("507f1f77bcf86cd799439011"),
            "user_id": MOCK_USER_A["uid"],
            "status": "completed",
            "started_at": datetime(2026, 11, 19, 10, 0, 0, tzinfo=timezone.utc),
            "ended_at": datetime(2026, 11, 19, 10, 30, 0, tzinfo=timezone.utc),
            "emotion_events": [],
            "assistance_events": []
        },
        {
            "_id": ObjectId("507f1f77bcf86cd799439022"),
            "user_id": MOCK_USER_A["uid"],
            "status": "completed",
            "started_at": datetime(2026, 11, 18, 14, 0, 0, tzinfo=timezone.utc),
            "ended_at": datetime(2026, 11, 18, 14, 45, 0, tzinfo=timezone.utc),
            "emotion_events": [],
            "assistance_events": []
        }
    ]
    mock_db, mock_collection = create_mock_db(history_docs=hist_docs)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        response = client.get("/api/sessions/history?limit=10&skip=0", headers=AUTH_HEADERS_USER_A)
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 2
        assert len(data["sessions"]) == 2
        assert data["sessions"][0]["user_id"] == MOCK_USER_A["uid"]

        # Verify query was scoped to user_id
        find_query = mock_collection.find.call_args[0][0]
        assert find_query == {"user_id": MOCK_USER_A["uid"]}


def test_cross_user_session_access_blocked():
    """User B cannot access or view User A's session document (returns 404)."""
    user_a_session = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": MOCK_USER_A["uid"],
        "status": "active",
        "started_at": datetime.now(timezone.utc),
        "ended_at": None
    }
    mock_db, _ = create_mock_db(session_doc=None)

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_B), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_B), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        # User B attempts to access User A's session
        response = client.get("/api/sessions/507f1f77bcf86cd799439011", headers=AUTH_HEADERS_USER_B)
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


def test_invalid_session_id_format():
    """Requests with non-hexadecimal session IDs receive 400 Bad Request."""
    mock_db, _ = create_mock_db()

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        response = client.get("/api/sessions/not-a-valid-hex-id", headers=AUTH_HEADERS_USER_A)
        assert response.status_code == 400
        assert "Invalid session ID format" in response.json()["detail"]


# =============================================================================
# 7. DATABASE UNAVAILABILITY & SENSITIVE CONFIGURATION PROTECTION
# =============================================================================

def test_database_unavailability_handling():
    """Database failures return clean 503 without crashing or leaking details."""
    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.dependencies.is_mongodb_configured", return_value=False):

        response = client.get("/api/sessions/history", headers=AUTH_HEADERS_USER_A)
        assert response.status_code == 503
        assert "MongoDB is not configured" in response.json()["detail"]


def test_no_sensitive_secrets_leaked_in_errors():
    """Verify secrets or URIs are never exposed in error responses."""
    mock_db, mock_collection = create_mock_db()
    mock_collection.insert_one.side_effect = PyMongoError("Secret-Password-In-Driver-Exception")

    with patch("app.dependencies.verify_firebase_id_token", return_value=MOCK_USER_A), \
         patch("app.dependencies.get_user_profile", return_value=MOCK_USER_A), \
         patch("app.routes.sessions.get_mongodb_db", return_value=mock_db):

        response = client.post("/api/sessions/start", json={}, headers=AUTH_HEADERS_USER_A)
        assert response.status_code == 503
        assert "Secret-Password" not in response.text
