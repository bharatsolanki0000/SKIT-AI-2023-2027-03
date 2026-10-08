import logging
from typing import Dict, Any, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth

from app.firebase import verify_firebase_id_token, get_user_profile, FIREBASE_INITIALIZED

logger = logging.getLogger("camber.dependencies")

security = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Dict[str, Any]:
    """
    FastAPI dependency that extracts and verifies the Firebase ID token from the
    Authorization: Bearer <id_token> header.
    
    Returns the authenticated user dict: {"uid": "...", "name": "...", "email": "..."}
    Raises 401 Unauthorized if missing or invalid.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization token is missing or malformed.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    id_token = credentials.credentials
    decoded_token = verify_firebase_id_token(id_token)
    
    uid = decoded_token.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token content: missing UID.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Try fetching profile from Firestore
    profile = get_user_profile(uid)
    if profile:
        return {
            "uid": uid,
            "name": profile.get("name", decoded_token.get("name", "")),
            "email": profile.get("email", decoded_token.get("email", ""))
        }
    
    # Fallback to Firebase Auth user record or token claims
    name = decoded_token.get("name", "")
    email = decoded_token.get("email", "")
    
    if FIREBASE_INITIALIZED and (not name or not email):
        try:
            user_record = auth.get_user(uid)
            name = name or user_record.display_name or ""
            email = email or user_record.email or ""
        except Exception as e:
            logger.warning(f"Could not fetch UserRecord for {uid}: {e}")
            
    return {
        "uid": uid,
        "name": name,
        "email": email
    }
