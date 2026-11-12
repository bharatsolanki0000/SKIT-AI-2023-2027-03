import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Body
from pydantic import ValidationError
from pymongo.errors import DuplicateKeyError

from app.schemas import (
    LearnerProfileCreate,
    LearnerProfileUpdate,
    LearnerProfileResponse,
    QuestionnaireSubmission,
    derive_learner_profile_from_questionnaire,
    ALL_QUESTION_IDS,
    ErrorResponse,
    utc_now
)
from app.dependencies import get_current_user, get_mongodb_db

logger = logging.getLogger("camber.routes.profiles")

router = APIRouter(tags=["Learner Profiles"])


@router.post(
    "/api/profiles",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create learner profile from questionnaire or direct preferences",
    description="Validates questionnaire responses or direct preferences, associates them with the authenticated user, and saves the profile to MongoDB.",
    responses={
        201: {"model": LearnerProfileResponse, "description": "Learner profile created successfully"},
        400: {"model": ErrorResponse, "description": "Invalid questionnaire answers or payload"},
        401: {"model": ErrorResponse, "description": "Missing or invalid authorization token"},
        409: {"model": ErrorResponse, "description": "Learner profile already exists for this user"},
        422: {"model": ErrorResponse, "description": "Validation error in questionnaire responses"},
        503: {"model": ErrorResponse, "description": "Database unavailable"}
    }
)
@router.post(
    "/profiles",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False
)
@router.post(
    "/api/learner-profile/questionnaire",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False
)
async def create_profile(
    payload: Dict[str, Any] = Body(...),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_mongodb_db)
):
    """
    Creates a learner profile for the authenticated user.
    Enforces user isolation, token-derived identity, and prevents duplicates.
    """
    user_id = current_user["uid"]

    # 1. Enforce single profile per user (prevent duplicates)
    existing = db["learner_profiles"].find_one({"user_id": user_id})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Learner profile already exists for this user."
        )

    # 2. Determine if payload is questionnaire or direct preferences
    is_questionnaire = "answers" in payload or any(qid in payload for qid in ALL_QUESTION_IDS)

    if is_questionnaire:
        try:
            submission = QuestionnaireSubmission(**payload)
            clean_answers = submission.get_normalized_answers()
            doc_dict = derive_learner_profile_from_questionnaire(user_id=user_id, answers=clean_answers)
        except (ValidationError, ValueError) as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(e)
            )
    else:
        try:
            payload_copy = dict(payload)
            # Never trust frontend-supplied user_id
            payload_copy["user_id"] = user_id
            profile_model = LearnerProfileCreate(**payload_copy)
            now = utc_now()
            doc_dict = profile_model.model_dump()
            doc_dict["created_at"] = now
            doc_dict["updated_at"] = now
        except (ValidationError, ValueError) as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(e)
            )

    # 3. Insert into MongoDB
    try:
        result = db["learner_profiles"].insert_one(doc_dict)
        doc_dict["_id"] = str(result.inserted_id)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Learner profile already exists for this user."
        )

    return LearnerProfileResponse(**doc_dict)


@router.get(
    "/api/profiles/me",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current learner's profile",
    description="Retrieves the learner profile for the authenticated user, enforcing user isolation.",
    responses={
        200: {"model": LearnerProfileResponse, "description": "Learner profile retrieved successfully"},
        401: {"model": ErrorResponse, "description": "Missing or invalid authorization token"},
        404: {"model": ErrorResponse, "description": "Learner profile not found"},
        503: {"model": ErrorResponse, "description": "Database unavailable"}
    }
)
@router.get(
    "/profiles/me",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def get_my_profile(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_mongodb_db)
):
    """
    Retrieves the learner profile for the authenticated user.
    """
    user_id = current_user["uid"]
    doc = db["learner_profiles"].find_one({"user_id": user_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learner profile not found."
        )
    doc["_id"] = str(doc["_id"])
    return LearnerProfileResponse(**doc)


@router.put(
    "/api/profiles/me",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Update current learner's profile preferences",
    description="Updates learning goals, preferences, or settings. Disallows modifying user_id, _id, or created_at.",
    responses={
        200: {"model": LearnerProfileResponse, "description": "Learner profile updated successfully"},
        400: {"model": ErrorResponse, "description": "Invalid update data"},
        401: {"model": ErrorResponse, "description": "Missing or invalid authorization token"},
        404: {"model": ErrorResponse, "description": "Learner profile not found"},
        503: {"model": ErrorResponse, "description": "Database unavailable"}
    }
)
@router.put(
    "/profiles/me",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
@router.patch(
    "/api/profiles/me",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
@router.patch(
    "/profiles/me",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def update_my_profile(
    updates: LearnerProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_mongodb_db)
):
    """
    Updates the authenticated user's learner profile preferences and settings.
    Disallows changing user_id, _id, or created_at. Automatically updates updated_at.
    """
    user_id = current_user["uid"]
    existing = db["learner_profiles"].find_one({"user_id": user_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learner profile not found."
        )

    update_data = updates.model_dump(exclude_unset=True)
    # Strictly strip any immutable / protected identifiers
    for protected_field in ("_id", "id", "user_id", "created_at"):
        update_data.pop(protected_field, None)

    if update_data:
        # Merge sub-documents where appropriate
        for subdoc_key in ("study_preferences", "attention_preferences", "accessibility_settings"):
            if subdoc_key in update_data and isinstance(update_data[subdoc_key], dict) and isinstance(existing.get(subdoc_key), dict):
                update_data[subdoc_key] = {**existing[subdoc_key], **update_data[subdoc_key]}

        update_data["updated_at"] = utc_now()
        db["learner_profiles"].update_one(
            {"user_id": user_id},
            {"$set": update_data}
        )

    updated_doc = db["learner_profiles"].find_one({"user_id": user_id})
    updated_doc["_id"] = str(updated_doc["_id"])
    return LearnerProfileResponse(**updated_doc)


@router.get(
    "/api/profiles/{target_user_id}",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get learner profile by user ID (User isolated)",
    description="Enforces strict isolation: users can only access their own profile.",
    responses={
        200: {"model": LearnerProfileResponse, "description": "Learner profile retrieved successfully"},
        403: {"model": ErrorResponse, "description": "Forbidden: access to another user's profile is blocked"},
        404: {"model": ErrorResponse, "description": "Learner profile not found"},
        503: {"model": ErrorResponse, "description": "Database unavailable"}
    }
)
@router.get(
    "/profiles/{target_user_id}",
    response_model=LearnerProfileResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def get_profile_by_user_id(
    target_user_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_mongodb_db)
):
    """
    Enforces user isolation when accessing a profile by user ID.
    Rejects requests attempting to access other users' data with 403 Forbidden.
    """
    if target_user_id != current_user["uid"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: cannot view another user's profile."
        )
    return await get_my_profile(current_user=current_user, db=db)

