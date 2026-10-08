import logging
from typing import Dict, Any

from fastapi import APIRouter, Depends, status

from app.schemas import (
    SignupRequest, SignupResponse,
    LoginRequest, LoginResponse,
    UserResponse, ErrorResponse
)
from app.firebase import (
    create_firebase_user,
    save_user_profile,
    authenticate_with_password,
    get_user_profile
)
from app.dependencies import get_current_user

logger = logging.getLogger("camber.routes.auth")

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Validates user input, creates a Firebase Auth user, and initializes user profile in Firestore.",
    responses={
        201: {"model": SignupResponse, "description": "User created successfully"},
        400: {"model": ErrorResponse, "description": "Invalid input or email already registered"},
        500: {"model": ErrorResponse, "description": "Firebase backend configuration error"}
    }
)
async def signup(payload: SignupRequest):
    # 1. Create Firebase Auth user
    user_record = create_firebase_user(
        email=payload.email,
        password=payload.password,
        name=payload.name
    )
    
    # 2. Store profile metadata in Firestore
    profile = save_user_profile(
        uid=user_record.uid,
        name=payload.name,
        email=payload.email
    )
    
    # 3. Formulate clean response
    user_response = UserResponse(
        uid=profile["uid"],
        name=profile["name"],
        email=profile["email"]
    )
    
    return SignupResponse(
        message="User registered successfully",
        user=user_response
    )


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and return Firebase tokens",
    description="Authenticates user email and password with Firebase Authentication and returns ID token, refresh token, and user details.",
    responses={
        200: {"model": LoginResponse, "description": "Authentication successful"},
        401: {"model": ErrorResponse, "description": "Invalid email or password"},
        500: {"model": ErrorResponse, "description": "Firebase backend configuration error"}
    }
)
async def login(payload: LoginRequest):
    # 1. Authenticate with Firebase REST API
    auth_data = authenticate_with_password(
        email=payload.email,
        password=payload.password
    )
    
    uid = auth_data.get("localId", "")
    id_token = auth_data.get("idToken", "")
    refresh_token = auth_data.get("refreshToken", "")
    expires_in = auth_data.get("expiresIn", "3600")
    
    # 2. Fetch user profile name (from Firestore or default to display name / email prefix)
    profile = get_user_profile(uid)
    display_name = payload.email.split("@")[0]
    if profile:
        display_name = profile.get("name", display_name)
    elif auth_data.get("displayName"):
        display_name = auth_data.get("displayName")
        
    user_response = UserResponse(
        uid=uid,
        name=display_name,
        email=payload.email
    )
    
    return LoginResponse(
        message="Login successful",
        idToken=id_token,
        refreshToken=refresh_token,
        expiresIn=expires_in,
        user=user_response
    )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user profile",
    description="Requires Authorization: Bearer <Firebase_ID_TOKEN> header. Returns authenticated user information.",
    responses={
        200: {"model": UserResponse, "description": "Authenticated user details"},
        401: {"model": ErrorResponse, "description": "Missing, invalid, or expired authorization token"}
    }
)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    return UserResponse(
        uid=current_user["uid"],
        name=current_user.get("name", ""),
        email=current_user.get("email", "")
    )
