# CAMBER Backend - Authentication Module

Cognitive Assistance and Mood-Based Educational Responder (CAMBER) API Backend.

This module provides backend authentication services built using **FastAPI**, **Firebase Authentication**, and **Firebase Firestore**.

---

## 🏗️ Architecture & Project Structure

```text
backend/
├── app/
│   ├── __init__.py          # Application package declaration
│   ├── main.py              # FastAPI entry point, CORS, and router registration
│   ├── config.py            # Environment configuration loader
│   ├── firebase.py          # Firebase Admin SDK & Auth REST API integration
│   ├── schemas.py           # Pydantic data schemas for requests and responses
│   ├── dependencies.py      # Reusable authentication dependency (get_current_user)
│   └── routes/
│       ├── __init__.py      # Routes package declaration
│       └── auth.py          # /auth/signup, /auth/login, /auth/me endpoints
├── tests/
│   ├── __init__.py      # Test package declaration
│   └── test_auth.py     # Unit and integration test suite
├── .env.example             # Environment variable template
├── .gitignore               # Secrets and build artifact ignore rules
├── requirements.txt         # Backend Python dependencies
└── README.md                # Comprehensive documentation
```

---

## ⚙️ Prerequisites & Installation

### 1. Requirements
- Python 3.9+
- Firebase project with **Authentication** (Email/Password method enabled) and **Firestore Database**.

### 2. Environment Setup
Create a Python virtual environment and install dependencies:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## 🔑 Firebase & Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Retrieve Firebase Credentials:
   - Go to [Firebase Console](https://console.firebase.google.com/).
   - **Service Account Credentials** (Admin SDK):
     - Go to **Project Settings** -> **Service accounts**.
     - Click **Generate new private key** to download a JSON service account file.
     - Extract `project_id`, `client_email`, `private_key` into `.env`, OR set `FIREBASE_CREDENTIALS_PATH=./firebase-service-account.json`.
   - **Web API Key** (for `/auth/login` email/password authentication):
     - Go to **Project Settings** -> **General** tab -> **Web API Key**.
     - Copy the key into `FIREBASE_WEB_API_KEY` in `.env`.

3. Sample `.env` file:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   FIREBASE_WEB_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   HOST=0.0.0.0
   PORT=8000
   ```

---

## 🚀 Running the Server

Start the Uvicorn development server:

```bash
uvicorn app.main:app --reload --port 8000
```

The API server will run at: `http://127.0.0.1:8000`

### Interactive API Documentation (Swagger / OpenAPI)
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 📡 API Reference & Endpoints Contract

### 1. Register New User
- **Endpoint**: `POST /auth/signup`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Chahat",
    "email": "chahat@gmail.com",
    "password": "password123"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "uid": "aB3xYz9872...",
      "name": "Chahat",
      "email": "chahat@gmail.com"
    }
  }
  ```

### 2. Login User
- **Endpoint**: `POST /auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "chahat@gmail.com",
    "password": "password123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "message": "Login successful",
    "idToken": "eyJhbGciOiJSUzI1NiIs...",
    "refreshToken": "AMf-vBy...",
    "expiresIn": "3600",
    "user": {
      "uid": "aB3xYz9872...",
      "name": "Chahat",
      "email": "chahat@gmail.com"
    }
  }
  ```

### 3. Get Current User Profile (Protected)
- **Endpoint**: `GET /auth/me`
- **Headers**:
  ```text
  Authorization: Bearer <Firebase_ID_TOKEN>
  ```
- **Response** (`200 OK`):
  ```json
  {
    "uid": "aB3xYz9872...",
    "name": "Chahat",
    "email": "chahat@gmail.com"
  }
  ```
- **Error Response** (`401 Unauthorized`):
  ```json
  {
    "detail": "Invalid authentication token."
  }
  ```

---

## 🔌 Reusable Auth Dependency for Future Modules

Future CAMBER endpoints (such as learner profile, sessions, quizzes, emotion recognition) can require authentication by adding the `get_current_user` dependency:

```python
from fastapi import APIRouter, Depends
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    user_uid = current_user["uid"]
    return {"status": "success", "uid": user_uid}
```

---

## 🧪 Testing

Run pytest suite:

```bash
pytest
```
