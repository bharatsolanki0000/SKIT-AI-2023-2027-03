from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify health check root route works."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["system"] == "CAMBER API"
    assert data["status"] == "online"


def test_signup_validation_invalid_email():
    """Verify signup rejects invalid email address."""
    payload = {
        "name": "Chahat",
        "email": "not-an-email",
        "password": "password123"
    }
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == 422  # Pydantic validation error


def test_signup_validation_short_password():
    """Verify signup rejects passwords under 6 characters."""
    payload = {
        "name": "Chahat",
        "email": "chahat@gmail.com",
        "password": "123"
    }
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == 422


def test_login_validation_missing_fields():
    """Verify login rejects missing email or password."""
    payload = {
        "email": "chahat@gmail.com"
    }
    response = client.post("/auth/login", json=payload)
    assert response.status_code == 422


def test_get_me_unauthenticated():
    """Verify /auth/me returns 401 when Authorization header is missing."""
    response = client.get("/auth/me")
    assert response.status_code == 401
    assert "Authorization token is missing" in response.json()["detail"]


def test_get_me_invalid_token():
    """Verify /auth/me returns 401 when token verification fails."""
    with patch("app.dependencies.verify_firebase_id_token") as mock_verify:
        from fastapi import HTTPException, status
        mock_verify.side_effect = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token."
        )
        headers = {"Authorization": "Bearer invalid_token_123"}
        response = client.get("/auth/me", headers=headers)
        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid authentication token."


def test_get_me_successful_mock():
    """Verify /auth/me succeeds with valid token (mocked)."""
    mock_token = {
        "uid": "test_uid_123",
        "email": "chahat@gmail.com",
        "name": "Chahat"
    }
    with patch("app.dependencies.verify_firebase_id_token", return_value=mock_token), \
         patch("app.dependencies.get_user_profile", return_value={"name": "Chahat", "email": "chahat@gmail.com"}):
        headers = {"Authorization": "Bearer mock_valid_token"}
        response = client.get("/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["uid"] == "test_uid_123"
        assert data["name"] == "Chahat"
        assert data["email"] == "chahat@gmail.com"
