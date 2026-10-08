import logging
import os
import requests
from typing import Dict, Any, Optional
from datetime import datetime, timezone

import firebase_admin
from firebase_admin import credentials, auth, firestore
from fastapi import HTTPException, status

from app.config import settings

logger = logging.getLogger("camber.firebase")

FIREBASE_INITIALIZED = False
_db_client = None

def initialize_firebase():
    global FIREBASE_INITIALIZED, _db_client
    if firebase_admin._apps:
        FIREBASE_INITIALIZED = True
        try:
            _db_client = firestore.client()
        except Exception as e:
            logger.warning(f"Could not initialize Firestore client: {e}")
        return

    try:
        if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            FIREBASE_INITIALIZED = True
            logger.info("Firebase Admin SDK initialized using credentials file.")
        elif (settings.FIREBASE_PROJECT_ID and 
              settings.FIREBASE_CLIENT_EMAIL and 
              settings.FIREBASE_PRIVATE_KEY and
              "YOUR_PRIVATE_KEY_HERE" not in settings.FIREBASE_PRIVATE_KEY):
            cred_dict = {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key": settings.FIREBASE_PRIVATE_KEY,
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
            }
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            FIREBASE_INITIALIZED = True
            logger.info("Firebase Admin SDK initialized using environment variables.")
        else:
            logger.warning("Firebase credentials not set or contain placeholders. Firebase Admin SDK will not be active until configured.")
            FIREBASE_INITIALIZED = False
            return
            
        try:
            _db_client = firestore.client()
        except Exception as e:
            logger.warning(f"Firestore initialization warning: {e}")

    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin SDK: {e}")
        FIREBASE_INITIALIZED = False

# Run initialization at module load
initialize_firebase()


def get_db():
    if not FIREBASE_INITIALIZED:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Firebase is not configured on the server. Please supply valid Firebase credentials in .env"
        )
    return _db_client


def create_firebase_user(email: str, password: str, name: str) -> auth.UserRecord:
    if not FIREBASE_INITIALIZED:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Firebase Auth is not configured on the server. Please supply valid Firebase credentials in .env"
        )
    try:
        user_record = auth.create_user(
            email=email,
            password=password,
            display_name=name
        )
        return user_record
    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    except Exception as e:
        logger.error(f"Error creating Firebase user: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create user account: {str(e)}"
        )


def save_user_profile(uid: str, name: str, email: str) -> Dict[str, Any]:
    created_at = datetime.now(timezone.utc).isoformat()
    profile_data = {
        "uid": uid,
        "name": name,
        "email": email,
        "createdAt": created_at
    }
    
    if FIREBASE_INITIALIZED:
        try:
            db = get_db()
            if db:
                db.collection("users").document(uid).set(profile_data)
        except Exception as e:
            logger.error(f"Failed to save user profile to Firestore: {e}")
            # Continue without crashing if Firestore fails (profile is still returned)
    
    return profile_data


def get_user_profile(uid: str) -> Optional[Dict[str, Any]]:
    if FIREBASE_INITIALIZED:
        try:
            db = get_db()
            if db:
                doc = db.collection("users").document(uid).get()
                if doc.exists:
                    return doc.to_dict()
        except Exception as e:
            logger.warning(f"Could not fetch profile from Firestore for uid {uid}: {e}")
    return None


def authenticate_with_password(email: str, password: str) -> Dict[str, Any]:
    if not settings.FIREBASE_WEB_API_KEY or "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" in settings.FIREBASE_WEB_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="FIREBASE_WEB_API_KEY is not configured in environment variables."
        )
    
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={settings.FIREBASE_WEB_API_KEY}"
    payload = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        res_data = response.json()
        
        if response.status_code != 200:
            error_msg = res_data.get("error", {}).get("message", "")
            if error_msg in ["INVALID_PASSWORD", "EMAIL_NOT_FOUND", "INVALID_LOGIN_CREDENTIALS"]:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password."
                )
            elif error_msg == "USER_DISABLED":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="This user account has been disabled."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Authentication failed. Please check your credentials."
                )
                
        return res_data
    except requests.RequestException as e:
        logger.error(f"HTTP request error during Firebase login: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to reach Firebase authentication service."
        )


def verify_firebase_id_token(id_token: str) -> Dict[str, Any]:
    if not FIREBASE_INITIALIZED:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Firebase Auth is not configured on the server."
        )
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        logger.error(f"Error verifying Firebase ID token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate authentication credentials.",
            headers={"WWW-Authenticate": "Bearer"}
        )
