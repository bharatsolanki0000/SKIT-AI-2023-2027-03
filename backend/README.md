# CAMBER Backend - Core Services & Data Models

Cognitive Assistance and Mood-Based Educational Responder (CAMBER) API Backend.

This module provides backend authentication services built using **FastAPI** and **Firebase Authentication**, alongside validated **MongoDB** domain models and schemas for Sprint 1.

---

## 🏗️ Architecture & Project Structure

```text
backend/
├── app/
│   ├── __init__.py          # Application package declaration
│   ├── main.py              # FastAPI entry point, lifespan management & CORS
│   ├── config.py            # Environment configuration loader (Firebase & MongoDB)
│   ├── database.py          # MongoDB client lifecycle, indexes & collection access
│   ├── firebase.py          # Firebase Admin SDK & Auth REST API integration
│   ├── schemas.py           # Pydantic v2 schemas: Auth & MongoDB Collections
│   ├── dependencies.py      # Dependencies: auth (get_current_user) & DB (get_mongodb_db)
│   └── routes/
│       ├── __init__.py      # Routes package declaration
│       ├── auth.py          # /auth/signup, /auth/login, /auth/me endpoints
│       └── health.py        # /health/database health check endpoint
├── tests/
│   ├── __init__.py          # Test package declaration
│   ├── test_auth.py         # Authentication endpoint unit and integration tests
│   ├── test_database.py     # Sprint 2 database config, client & health check tests
│   └── test_schemas.py      # Sprint 1 MongoDB schema validation test suite
├── database.py              # Backward-compatible root re-export of app.database
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

   # MongoDB Database Configuration (Sprint 2)
   MONGODB_URI=your_mongodb_atlas_connection_string
   DATABASE_NAME=camber
   MONGODB_DATABASE=camber

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

### 4. MongoDB Database Health Check
- **Endpoint**: `GET /health/database`
- **Description**: Verifies MongoDB connectivity and performs an actual database ping when configured.
- **Response — Configured & Connected** (`200 OK`):
  ```json
  {
    "status": "connected",
    "database": "camber"
  }
  ```
- **Response — Unconfigured** (`503 Service Unavailable`):
  ```json
  {
    "status": "not_configured",
    "message": "MongoDB is not configured."
  }
  ```
- **Response — Configured but Unreachable** (`503 Service Unavailable`):
  ```json
  {
    "status": "unavailable",
    "message": "Database connection is unavailable."
  }
  ```

---

## 🧪 Testing

Run pytest suite across authentication routes, database configuration, and Sprint 1 schema validation:

```bash
# Run all tests
pytest

# Run Sprint 2 database connection, client lifecycle & health tests
pytest tests/test_database.py -v

# Run focused schema validation tests
pytest tests/test_schemas.py -v

# Run authentication endpoint tests
pytest tests/test_auth.py -v
```
