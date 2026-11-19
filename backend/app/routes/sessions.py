import logging
from collections import Counter
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pymongo.errors import PyMongoError

from app.schemas import (
    StartSessionRequest,
    StartSessionResponse,
    RecordEmotionRequest,
    RecordAssistanceRequest,
    EndSessionRequest,
    StudySessionResponse,
    SessionHistoryResponse,
    SessionStatus,
    ErrorResponse,
    validate_object_id_str,
    utc_now
)
from app.dependencies import get_current_user, get_mongodb_db

logger = logging.getLogger("camber.routes.sessions")

router = APIRouter(tags=["Study Sessions"])


def _format_session_doc(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Prepares raw MongoDB document for JSON serialization and Pydantic validation."""
    formatted = dict(doc)
    doc_id = str(formatted.get("_id", ""))
    formatted["_id"] = doc_id
    formatted["id"] = doc_id
    formatted["session_id"] = doc_id

    # Compute duration if started_at and ended_at are present
    started_at = formatted.get("started_at")
    ended_at = formatted.get("ended_at")
    if started_at and ended_at and isinstance(started_at, datetime) and isinstance(ended_at, datetime):
        duration_sec = max(0, int((ended_at - started_at).total_seconds()))
        formatted["duration_seconds"] = duration_sec
        formatted["total_duration_minutes"] = round(duration_sec / 60)

    # Ensure emotion and assistance events are lists
    if "emotion_events" not in formatted or not isinstance(formatted["emotion_events"], list):
        formatted["emotion_events"] = []
    if "assistance_events" not in formatted or not isinstance(formatted["assistance_events"], list):
        formatted["assistance_events"] = []

    return formatted


# =============================================================================
# 1. START A STUDY SESSION
# =============================================================================

@router.post(
    "/api/sessions/start",
    response_model=StartSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Start a new study session",
    description="Authenticates the learner, records session start timestamp on backend, initializes event buffers, and creates the session document in MongoDB.",
    responses={
        201: {"model": StartSessionResponse, "description": "Session successfully started"},
        401: {"model": ErrorResponse, "description": "Authentication token missing or invalid"},
        503: {"model": ErrorResponse, "description": "Database unavailable"}
    }
)
@router.post(
    "/sessions/start",
    response_model=StartSessionResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False
)
async def start_study_session(
    payload: Optional[StartSessionRequest] = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_mongodb_db)
):
    user_id = current_user["uid"]
    now = utc_now()

    profile_id = payload.learner_profile_id if payload else None
    study_context = payload.study_material_context if payload else None

    session_doc = {
        "user_id": user_id,
        "learner_profile_id": profile_id,
        "study_material_context": study_context,
        "started_at": now,
        "ended_at": None,
        "status": SessionStatus.ACTIVE.value,
        "emotion_events": [],
        "assistance_events": [],
        "session_summary": None,
        "created_at": now,
        "updated_at": now
    }

    try:
        result = db["study_sessions"].insert_one(session_doc)
        session_id = str(result.inserted_id)
    except PyMongoError as e:
        logger.error(f"Failed to create study session in database: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service unavailable. Failed to start session."
        )

    return StartSessionResponse(
        session_id=session_id,
        user_id=user_id,
        started_at=now,
        status=SessionStatus.ACTIVE,
        learner_profile_id=profile_id,
        study_material_context=study_context
    )


# =============================================================================
# 2. RECORD AN EMOTION PREDICTION
# =============================================================================

@router.post(
    "/api/sessions/{session_id}/emotion",
    status_code=status.HTTP_200_OK,
    summary="Record a facial emotion prediction event",
    description="Validates emotion label, verifies session ownership and active status, and appends the model prediction event.",
    responses={
        200: {"description": "Emotion prediction event successfully recorded"},
        400: {"model": ErrorResponse, "description": "Session inactive, maximum events exceeded, or invalid ID"},
        401: {"model": ErrorResponse, "description": "Authentication token missing or invalid"},
        404: {"model": ErrorResponse, "description": "Session not found or belongs to another user"},
        422: {"model": ErrorResponse, "description": "Unsupported emotion label or invalid confidence score"}
    }
)
@router.post(
    "/sessions/{session_id}/emotion",
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def record_emotion_prediction(
    session_id: str,
    payload: RecordEmotionRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_mongodb_db)
):
    try:
        validate_object_id_str(session_id)
        oid = ObjectId(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format. Must be a 24-character hexadecimal string."
        )

    session = db["study_sessions"].find_one({"_id": oid})
    if not session or session.get("user_id") != current_user["uid"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study session not found."
        )

    if session.get("status") != SessionStatus.ACTIVE.value or session.get("ended_at") is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot record emotion prediction: session is inactive or has already ended."
        )

    if len(session.get("emotion_events", [])) >= 500:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum emotion prediction events (500) reached for this session."
        )

    event_dict = {
        "timestamp": payload.timestamp or utc_now(),
        "predicted_label": payload.predicted_label.value if hasattr(payload.predicted_label, "value") else str(payload.predicted_label),
        "confidence": payload.confidence,
        "model_version": payload.model_version or "MobileNetV2_Transfer_v1"
    }
    if payload.context:
        event_dict["context"] = payload.context

    update_res = db["study_sessions"].update_one(
        {"_id": oid, "status": SessionStatus.ACTIVE.value},
        {
            "$push": {"emotion_events": event_dict},
            "$set": {"updated_at": utc_now()}
        }
    )

    if update_res.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to append emotion event: session state changed."
        )

    return {
        "status": "recorded",
        "session_id": session_id,
        "event": event_dict
    }


# =============================================================================
# 3. RECORD ASSISTANCE PROVIDED
# =============================================================================

@router.post(
    "/api/sessions/{session_id}/assistance",
    status_code=status.HTTP_200_OK,
    summary="Record an assistance intervention provided",
    description="Validates assistance type, verifies session ownership and active status, and appends the assistance record.",
    responses={
        200: {"description": "Assistance event successfully recorded"},
        400: {"model": ErrorResponse, "description": "Session inactive, maximum events exceeded, or invalid ID"},
        401: {"model": ErrorResponse, "description": "Authentication token missing or invalid"},
        404: {"model": ErrorResponse, "description": "Session not found or belongs to another user"},
        422: {"model": ErrorResponse, "description": "Unsupported assistance type"}
    }
)
@router.post(
    "/sessions/{session_id}/assistance",
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def record_assistance_event(
    session_id: str,
    payload: RecordAssistanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_mongodb_db)
):
    try:
        validate_object_id_str(session_id)
        oid = ObjectId(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format. Must be a 24-character hexadecimal string."
        )

    session = db["study_sessions"].find_one({"_id": oid})
    if not session or session.get("user_id") != current_user["uid"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study session not found."
        )

    if session.get("status") != SessionStatus.ACTIVE.value or session.get("ended_at") is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot record assistance: session is inactive or has already ended."
        )

    if len(session.get("assistance_events", [])) >= 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum assistance events (200) reached for this session."
        )

    assist_dict = {
        "timestamp": payload.timestamp or utc_now(),
        "assistance_type": payload.assistance_type.value if hasattr(payload.assistance_type, "value") else str(payload.assistance_type),
        "reason": payload.reason,
        "action_details": payload.action_details or {}
    }

    update_res = db["study_sessions"].update_one(
        {"_id": oid, "status": SessionStatus.ACTIVE.value},
        {
            "$push": {"assistance_events": assist_dict},
            "$set": {"updated_at": utc_now()}
        }
    )

    if update_res.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to append assistance event: session state changed."
        )

    return {
        "status": "recorded",
        "session_id": session_id,
        "assistance": assist_dict
    }


# =============================================================================
# 4. END A STUDY SESSION
# =============================================================================

@router.post(
    "/api/sessions/{session_id}/end",
    response_model=StudySessionResponse,
    status_code=status.HTTP_200_OK,
    summary="End an active study session",
    description="Records end timestamp, computes duration on the backend, summarizes emotion and assistance metrics, and marks the session completed. Rejects duplicate end calls.",
    responses={
        200: {"model": StudySessionResponse, "description": "Session ended successfully with calculated summary"},
        400: {"model": ErrorResponse, "description": "Session already ended, inactive, or invalid ID"},
        401: {"model": ErrorResponse, "description": "Authentication token missing or invalid"},
        404: {"model": ErrorResponse, "description": "Session not found or belongs to another user"}
    }
)
@router.post(
    "/sessions/{session_id}/end",
    response_model=StudySessionResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def end_study_session(
    session_id: str,
    payload: Optional[EndSessionRequest] = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_mongodb_db)
):
    try:
        validate_object_id_str(session_id)
        oid = ObjectId(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format. Must be a 24-character hexadecimal string."
        )

    session = db["study_sessions"].find_one({"_id": oid})
    if not session or session.get("user_id") != current_user["uid"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study session not found."
        )

    # Prevent ending twice
    if session.get("status") in (SessionStatus.COMPLETED.value, SessionStatus.ABANDONED.value) or session.get("ended_at") is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session has already been ended."
        )

    ended_at = utc_now()
    started_at = session.get("started_at", ended_at)

    # Server-side duration calculation
    duration_sec = max(0, int((ended_at - started_at).total_seconds()))
    duration_min = round(duration_sec / 60)

    # Synthesize session summary from genuine recorded events
    emotion_events = session.get("emotion_events", [])
    emotions = [e.get("predicted_label") for e in emotion_events if isinstance(e, dict) and e.get("predicted_label")]
    predominant_emotion = Counter(emotions).most_common(1)[0][0] if emotions else None

    summary_dict = {
        "total_duration_minutes": duration_min,
        "predominant_emotion": predominant_emotion,
        "total_assistance_provided": len(session.get("assistance_events", [])),
        "notes": payload.notes if payload and payload.notes else None
    }

    update_res = db["study_sessions"].update_one(
        {"_id": oid, "status": SessionStatus.ACTIVE.value},
        {
            "$set": {
                "status": SessionStatus.COMPLETED.value,
                "ended_at": ended_at,
                "session_summary": summary_dict,
                "updated_at": ended_at
            }
        }
    )

    if update_res.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session has already been ended."
        )

    updated_doc = db["study_sessions"].find_one({"_id": oid})
    return StudySessionResponse(**_format_session_doc(updated_doc))


# =============================================================================
# 5. RETRIEVE STUDY HISTORY
# =============================================================================

@router.get(
    "/api/sessions/history",
    response_model=SessionHistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve study session history for current learner",
    description="Returns sessions belonging strictly to the authenticated learner, ordered by start time descending, supporting pagination.",
    responses={
        200: {"model": SessionHistoryResponse, "description": "Session history retrieved successfully"},
        401: {"model": ErrorResponse, "description": "Authentication token missing or invalid"},
        503: {"model": ErrorResponse, "description": "Database unavailable"}
    }
)
@router.get(
    "/sessions/history",
    response_model=SessionHistoryResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def get_study_session_history(
    limit: int = Query(default=20, ge=1, le=100, description="Maximum sessions to return"),
    skip: int = Query(default=0, ge=0, description="Number of sessions to skip for pagination"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_mongodb_db)
):
    user_id = current_user["uid"]

    query = {"user_id": user_id}
    total = db["study_sessions"].count_documents(query)
    cursor = db["study_sessions"].find(query).sort("started_at", -1).skip(skip).limit(limit)

    formatted_sessions = [_format_session_doc(doc) for doc in cursor]

    return SessionHistoryResponse(
        sessions=[StudySessionResponse(**s) for s in formatted_sessions],
        total=total,
        limit=limit,
        skip=skip
    )


# =============================================================================
# 6. RETRIEVE AN INDIVIDUAL STUDY SESSION
# =============================================================================

@router.get(
    "/api/sessions/{session_id}",
    response_model=StudySessionResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve details of an individual study session",
    description="Retrieves session document, verifying authenticated ownership and enforcing cross-user isolation.",
    responses={
        200: {"model": StudySessionResponse, "description": "Session retrieved successfully"},
        400: {"model": ErrorResponse, "description": "Invalid session ID format"},
        401: {"model": ErrorResponse, "description": "Authentication token missing or invalid"},
        404: {"model": ErrorResponse, "description": "Session not found or belongs to another user"}
    }
)
@router.get(
    "/sessions/{session_id}",
    response_model=StudySessionResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def get_study_session(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_mongodb_db)
):
    try:
        validate_object_id_str(session_id)
        oid = ObjectId(session_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format. Must be a 24-character hexadecimal string."
        )

    # Enforce user isolation: query must match user_id
    session = db["study_sessions"].find_one({"_id": oid, "user_id": current_user["uid"]})
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study session not found."
        )

    return StudySessionResponse(**_format_session_doc(session))
