# CAMBER Backend - Core Services & Data Models

Cognitive Assistance and Mood-Based Educational Responder (CAMBER) API Backend.

This module provides backend authentication services built using **FastAPI** and **Firebase Authentication**, alongside validated **MongoDB** domain models and schemas for Sprint 1.

---

## 🏗️ Architecture & Project Structure

```text
backend/
├── app/
│   ├── __init__.py          # Application package declaration
│   ├── main.py              # FastAPI entry point, CORS, and router registration
│   ├── config.py            # Environment configuration loader (Firebase & MongoDB)
│   ├── firebase.py          # Firebase Admin SDK & Auth REST API integration
│   ├── schemas.py           # Pydantic v2 schemas: Auth & MongoDB Collections
│   ├── dependencies.py      # Reusable authentication dependency (get_current_user)
│   └── routes/
│       ├── __init__.py      # Routes package declaration
│       └── auth.py          # /auth/signup, /auth/login, /auth/me endpoints
├── tests/
│   ├── __init__.py          # Test package declaration
│   ├── test_auth.py         # Authentication endpoint unit and integration tests
│   └── test_schemas.py      # Sprint 1 MongoDB schema validation test suite
├── .env.example             # Environment variable template
├── .gitignore               # Secrets and build artifact ignore rules
├── requirements.txt         # Backend Python dependencies
└── README.md                # Comprehensive documentation
```

---

## 🍃 MongoDB Schema Design (Sprint 1)

Detailed collection specifications, entity relationships, BSON data types, index definitions, and privacy rules are documented in:
👉 [`docs/database-schema.md`](../docs/database-schema.md)

### Collections Summary:
1. **`users`**:
   - Primary key: `_id` (`ObjectId`)
   - Identity: `email` (unique index), `auth_provider_uid` (Firebase UID, unique index)
   - Metadata: `display_name`, `auth_provider` (`"firebase"`), `is_active`, `created_at`, `updated_at`
2. **`learner_profiles`**:
   - Primary key: `_id` (`ObjectId`)
   - Ownership: `user_id` (unique index enforcing 1:1 relationship)
   - Pedagogical preferences: `learning_goals`, `preferred_explanation_style` (`"simple"`, `"detailed"`, `"visual"`, `"analogy"`, `"step_by_step"`)
   - Embedded preferences: `study_preferences`, `attention_preferences`, `accessibility_settings`
3. **`study_sessions`**:
   - Primary key: `_id` (`ObjectId`)
   - Session lifecycle: `user_id`, `started_at`, `ended_at`, `status` (`"active"`, `"completed"`, `"paused"`, `"abandoned"`)
   - Bounded emotion inference events: `emotion_events` (max 500 items, validated DAISEE classes: `confused`, `focused`, `frustrated`, `bored`, `drowsy`, `looking_away`, confidence `0.0` - `1.0`)
   - Assistance interventions: `assistance_events` (max 200 items, types: `explain_simply`, `generate_quiz`, `suggest_break`, `emotion_check`, `pacing_adjustment`)
   - Summary: `session_summary` (`total_duration_minutes`, `predominant_emotion`, `notes`)

---

## ⚙️ Prerequisites & Installation

### 1. Requirements
- Python 3.9+
- Firebase project with **Authentication** (Email/Password method enabled) and **Firestore Database**.
- MongoDB 6.0+ (Local or MongoDB Atlas cluster).

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

## 🔑 Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Sample `.env` file:
   ```env
   # Firebase Configuration
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   FIREBASE_WEB_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

   # MongoDB Configuration (Sprint 1)
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DATABASE=camber_db

   # Server & CORS
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

---

## 🧪 Testing

Run pytest suite across authentication routes and Sprint 1 schema validation:

```bash
# Run all tests
pytest

# Run focused schema validation tests
pytest tests/test_schemas.py -v

# Run authentication endpoint tests
pytest tests/test_auth.py -v
```
