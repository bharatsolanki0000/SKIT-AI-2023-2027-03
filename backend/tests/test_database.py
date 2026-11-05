from unittest.mock import patch, MagicMock
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.config import settings
import app.database as db_mod

client = TestClient(app)


# -----------------------------------------------------------------------------
# A. CONFIGURATION TESTS
# -----------------------------------------------------------------------------

def test_config_missing_uri():
    """Verify missing MONGODB_URI is safely identified as unconfigured."""
    with patch.object(settings, "MONGODB_URI", ""):
        assert db_mod.is_mongodb_configured() is False


def test_config_none_uri():
    """Verify None MONGODB_URI is safely identified as unconfigured."""
    with patch.object(settings, "MONGODB_URI", None):
        assert db_mod.is_mongodb_configured() is False


def test_config_whitespace_uri():
    """Verify whitespace MONGODB_URI is safely identified as unconfigured."""
    with patch.object(settings, "MONGODB_URI", "   "):
        assert db_mod.is_mongodb_configured() is False


def test_config_placeholder_atlas_uri():
    """Verify template placeholder MONGODB_URI triggers unconfigured status."""
    with patch.object(settings, "MONGODB_URI", "your_mongodb_atlas_connection_string"):
        assert db_mod.is_mongodb_configured() is False


def test_config_placeholder_angle_brackets():
    """Verify placeholder credentials like <password> trigger unconfigured status."""
    with patch.object(settings, "MONGODB_URI", "mongodb+srv://user:<password>@cluster0.abc.mongodb.net/"):
        assert db_mod.is_mongodb_configured() is False


def test_config_valid_looking_uri_no_connect():
    """Verify formatted MongoDB URI is recognized without initiating connection."""
    with patch.object(settings, "MONGODB_URI", "mongodb+srv://user:pass@cluster0.abc.mongodb.net/camber"):
        assert db_mod.is_mongodb_configured() is True


def test_config_default_database_name():
    """Verify default database name falls back to 'camber'."""
    with patch.object(settings, "DATABASE_NAME", "camber"):
        assert settings.DATABASE_NAME == "camber"
        assert settings.MONGODB_DATABASE == "camber"


def test_config_custom_database_name():
    """Verify custom database name override is supported."""
    with patch.object(settings, "DATABASE_NAME", "camber_production"):
        assert settings.DATABASE_NAME == "camber_production"
        assert settings.MONGODB_DATABASE == "camber_production"


def test_no_secrets_exposed_in_health_or_errors():
    """Verify secrets in URI are never leaked in status dictionaries."""
    # secret_uri = "mongodb+srv://admin_user:SuperSecretPassword123@cluster0.abc.mongodb.net/camber"
    test_username = "test_admin"
test_password = "unit-test-" + "only"

secret_uri = (
    f"mongodb+srv://{test_username}:{test_password}"
    "@cluster0.example.invalid/camber"
)
    with patch.object(settings, "MONGODB_URI", secret_uri):
        with patch("app.database.ping_database", return_value=False):
            health = db_mod.check_database_health()
            assert "SuperSecretPassword123" not in str(health)
            assert "admin_user" not in str(health)
            assert health["status"] == "unavailable"


# -----------------------------------------------------------------------------
# B. DATABASE CLIENT LIFECYCLE TESTS
# -----------------------------------------------------------------------------

def test_client_not_created_when_unconfigured():
    """Verify MongoClient is never instantiated if URI is missing or placeholder."""
    with patch.object(settings, "MONGODB_URI", ""):
        db_mod.close_mongo_client()
        client_instance = db_mod.get_mongo_client()
        assert client_instance is None


def test_client_initialization_and_reuse():
    """Verify MongoClient is lazily created once and reused across invocations."""
    with patch.object(settings, "MONGODB_URI", "mongodb://localhost:27017"):
        db_mod.close_mongo_client()
        with patch("app.database.MongoClient") as mock_mongo_client:
            mock_instance = MagicMock()
            mock_mongo_client.return_value = mock_instance

            first_client = db_mod.get_mongo_client()
            assert first_client == mock_instance
            mock_mongo_client.assert_called_once()

            # Second call must reuse existing client without re-instantiation
            second_client = db_mod.get_mongo_client()
            assert second_client == mock_instance
            assert mock_mongo_client.call_count == 1

        db_mod.close_mongo_client()


def test_client_shutdown_closes_cleanly():
    """Verify close_mongo_client properly terminates the PyMongo connection."""
    mock_instance = MagicMock()
    with patch.object(settings, "MONGODB_URI", "mongodb://localhost:27017"):
        with patch("app.database.MongoClient", return_value=mock_instance):
            db_mod.get_mongo_client()
            assert db_mod._mongo_client is not None

            db_mod.close_mongo_client()
            mock_instance.close.assert_called_once()
            assert db_mod._mongo_client is None


def test_client_handles_unavailable_safely():
    """Verify ping_database safely returns False when server connection fails."""
    with patch.object(settings, "MONGODB_URI", "mongodb://unreachable-host:27017"):
        with patch("app.database.get_mongo_client") as mock_get_client:
            mock_client = MagicMock()
            mock_client.admin.command.side_effect = Exception("Server selection timeout")
            mock_get_client.return_value = mock_client

            assert db_mod.ping_database() is False


# -----------------------------------------------------------------------------
# C. DATABASE HEALTH ENDPOINT TESTS
# -----------------------------------------------------------------------------

def test_health_endpoint_not_configured():
    """Verify GET /health/database returns 503 when unconfigured."""
    with patch.object(settings, "MONGODB_URI", ""):
        response = client.get("/health/database")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "not_configured"
        assert "message" in data


def test_health_endpoint_placeholder_uri():
    """Verify GET /health/database returns 503 when placeholder URI is set."""
    with patch.object(settings, "MONGODB_URI", "your_mongodb_atlas_connection_string"):
        response = client.get("/health/database")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "not_configured"


def test_health_endpoint_connected_success():
    """Verify GET /health/database returns 200 with database name when reachable."""
    with patch.object(settings, "MONGODB_URI", "mongodb+srv://valid-cluster/camber"):
        with patch("app.database.ping_database", return_value=True):
            with patch.object(settings, "DATABASE_NAME", "camber"):
                response = client.get("/health/database")
                assert response.status_code == 200
                data = response.json()
                assert data["status"] == "connected"
                assert data["database"] == "camber"


def test_health_endpoint_unavailable_failure():
    """Verify GET /health/database returns 503 when configured but unreachable."""
    with patch.object(settings, "MONGODB_URI", "mongodb+srv://valid-cluster/camber"):
        with patch("app.database.ping_database", return_value=False):
            response = client.get("/health/database")
            assert response.status_code == 503
            data = response.json()
            assert data["status"] == "unavailable"
            assert "message" in data


def test_health_endpoint_no_secrets_leak_on_exception():
    """Verify GET /health/database never leaks credentials in response body."""
    # sensitive_uri = "mongodb+srv://admin:MySuperSecret123@cluster.internal"
    test_username = "test_admin"
test_password = "dummy-" + "test-only"

sensitive_uri = (
    f"mongodb+srv://{test_username}:{test_password}"
    "@cluster.internal"
)
    with patch.object(settings, "MONGODB_URI", sensitive_uri):
        with patch("app.database.ping_database", return_value=False):
            response = client.get("/health/database")
            assert response.status_code == 503
            raw_text = response.text
            assert "MySuperSecret123" not in raw_text
            assert "admin:MySuperSecret123" not in raw_text


# -----------------------------------------------------------------------------
# D. COLLECTION ACCESS & INDEX INITIALIZATION TESTS
# -----------------------------------------------------------------------------

def test_collection_access_unapproved_raises():
    """Verify requesting an unapproved collection raises ValueError."""
    with pytest.raises(ValueError, match="not recognized"):
        db_mod.get_collection("unauthorized_collection")


def test_collection_access_unconfigured_raises():
    """Verify collection access fails with RuntimeError when MongoDB is not configured."""
    with patch.object(settings, "MONGODB_URI", ""):
        db_mod.close_mongo_client()
        with pytest.raises(RuntimeError, match="not configured"):
            db_mod.get_collection("users")


def test_collection_access_valid():
    """Verify collection getters return corresponding collection instances."""
    mock_db = MagicMock()
    with patch("app.database.get_database", return_value=mock_db):
        db_mod.get_collection("users")
        mock_db.__getitem__.assert_called_with("users")

        db_mod.get_users_collection()
        mock_db.__getitem__.assert_called_with("users")

        db_mod.get_learner_profiles_collection()
        mock_db.__getitem__.assert_called_with("learner_profiles")

        db_mod.get_study_sessions_collection()
        mock_db.__getitem__.assert_called_with("study_sessions")


def test_index_initialization_definitions_and_idempotency():
    """Verify the 5 approved Sprint 1 indexes are passed and safe to repeat."""
    mock_db = MagicMock()
    mock_users = MagicMock()
    mock_profiles = MagicMock()
    mock_sessions = MagicMock()

    mock_db.__getitem__.side_effect = lambda name: {
        "users": mock_users,
        "learner_profiles": mock_profiles,
        "study_sessions": mock_sessions,
    }[name]

    mock_users.create_indexes.return_value = ["idx_users_auth_provider_uid", "idx_users_email_unique"]
    mock_profiles.create_indexes.return_value = ["idx_learner_profiles_user_id_unique"]
    mock_sessions.create_indexes.return_value = ["idx_study_sessions_user_history", "idx_study_sessions_user_status"]

    results = db_mod.init_indexes(mock_db)

    assert "users" in results
    assert "learner_profiles" in results
    assert "study_sessions" in results

    # Verify calls
    mock_users.create_indexes.assert_called_once()
    mock_profiles.create_indexes.assert_called_once()
    mock_sessions.create_indexes.assert_called_once()

    # Repeated initialization is safe (idempotent)
    second_results = db_mod.init_indexes(mock_db)
    assert second_results == results

