import logging
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError, PyMongoError

from app.config import settings
from app.database import COLLECTION_USERS
from app.dependencies import get_current_user, get_mongodb_db
from app.schemas import (
    SignupRequest,
    SignupResponse,
    LoginRequest,
    LoginResponse,
    UserResponse,
    ErrorResponse,
    utc_now,
)
from app.security import hash_password, verify_password, create_access_token

logger = logging.getLogger("camber.routes.auth")

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Validates user input, hashes the password with bcrypt, and stores the user in MongoDB.",
    responses={
        201: {"model": SignupResponse, "description": "User created successfully"},
        409: {"model": ErrorResponse, "description": "Email already registered"},
        503: {"model": ErrorResponse, "description": "Database unavailable"},
    },
)
async def signup(payload: SignupRequest, db=Depends(get_mongodb_db)):
    normalized_email = payload.email.strip().lower()
    display_name = payload.name.strip()

    users_col = db[COLLECTION_USERS]
    existing = users_col.find_one({"email": normalized_email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists.",
        )

    now = utc_now()
    user_doc = {
        "email": normalized_email,
        "name": display_name,
        "display_name": display_name,
        "password_hash": hash_password(payload.password),
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }

    try:
        result = users_col.insert_one(user_doc)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists.",
        )
    except PyMongoError:
        logger.error("Database error during user signup.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database operation failed.",
        )

    user_response = UserResponse(
        uid=str(result.inserted_id),
        name=display_name,
        email=normalized_email,
    )

    return SignupResponse(
        message="User registered successfully",
        user=user_response,
    )


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and return JWT access token",
    description="Verifies email and password against MongoDB using bcrypt and returns a signed JWT access token.",
    responses={
        200: {"model": LoginResponse, "description": "Authentication successful"},
        401: {"model": ErrorResponse, "description": "Invalid email or password"},
        503: {"model": ErrorResponse, "description": "Database unavailable"},
    },
)
async def login(payload: LoginRequest, db=Depends(get_mongodb_db)):
    normalized_email = payload.email.strip().lower()
    users_col = db[COLLECTION_USERS]

    try:
        user_doc = users_col.find_one({"email": normalized_email})
    except PyMongoError:
        logger.error("Database error during user login.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database operation failed.",
        )

    if not user_doc or not verify_password(payload.password, user_doc.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if user_doc.get("is_active") is False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This user account has been disabled.",
        )

    uid = str(user_doc["_id"])
    display_name = (
        user_doc.get("name")
        or user_doc.get("display_name")
        or normalized_email.split("@")[0]
    )

    access_token = create_access_token(
        data={
            "sub": uid,
            "email": normalized_email,
            "name": display_name,
        }
    )
    expires_in = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60

    user_response = UserResponse(
        uid=uid,
        name=display_name,
        email=normalized_email,
    )

    return LoginResponse(
        message="Login successful",
        access_token=access_token,
        token_type="bearer",
        expires_in=expires_in,
        user=user_response,
    )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user profile",
    description="Requires Authorization: Bearer <access_token> header. Returns authenticated user information.",
    responses={
        200: {"model": UserResponse, "description": "Authenticated user details"},
        401: {"model": ErrorResponse, "description": "Missing, invalid, or expired authorization token"},
    },
)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    return UserResponse(
        uid=current_user["uid"],
        name=current_user.get("name", ""),
        email=current_user.get("email", ""),
    )
