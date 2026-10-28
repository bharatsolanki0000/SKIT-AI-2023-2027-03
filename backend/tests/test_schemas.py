import pytest
from datetime import datetime, timezone, timedelta
from pydantic import ValidationError

from app.schemas import (
    UserDocument,
    LearnerProfileDocument,
    StudySessionDocument,
    StudyPreferences,
    AttentionPreferences,
    AccessibilitySettings,
    EmotionEvent,
    AssistanceEvent,
    SessionSummary,
    ExplanationStyle,
    LearningPace,
    SessionStatus,
    SupportedEmotion,
    AssistanceType,
    validate_object_id_str
)

# -----------------------------------------------------------------------------
# 1. OBJECT ID VALIDATION TESTS
# -----------------------------------------------------------------------------

def test_object_id_validation_valid():
    valid_id = "507f1f77bcf86cd799439011"
    assert validate_object_id_str(valid_id) == valid_id

def test_object_id_validation_invalid():
    with pytest.raises(ValueError, match="Invalid ObjectId format"):
        validate_object_id_str("not-a-valid-objectid")

def test_object_id_validation_none():
    assert validate_object_id_str(None) is None


# -----------------------------------------------------------------------------
# 2. USER DOCUMENT TESTS
# -----------------------------------------------------------------------------

def test_user_document_creation_valid():
    user = UserDocument(
        _id="507f1f77bcf86cd799439011",
        email="student@camber.edu",
        display_name="Alex Rivera",
        auth_provider="firebase",
        auth_provider_uid="firebase_uid_987654",
        is_active=True
    )
    assert user.id == "507f1f77bcf86cd799439011"
    assert user.email == "student@camber.edu"
    assert user.display_name == "Alex Rivera"
    assert user.auth_provider == "firebase"
    assert user.auth_provider_uid == "firebase_uid_987654"
    assert user.is_active is True
    assert isinstance(user.created_at, datetime)
    assert isinstance(user.updated_at, datetime)

def test_user_document_email_normalization():
    user = UserDocument(
        email="   STUDENT.ALEX@Camber.EDU   ",
        auth_provider_uid="uid_12345"
    )
    assert user.email == "student.alex@camber.edu"

def test_user_document_invalid_email():
    with pytest.raises(ValidationError):
        UserDocument(
            email="invalid-email-string",
            auth_provider_uid="uid_12345"
        )


# -----------------------------------------------------------------------------
# 3. LEARNER PROFILE TESTS
# -----------------------------------------------------------------------------

def test_learner_profile_defaults():
    profile = LearnerProfileDocument(
        user_id="firebase_uid_987654",
        learning_goals=["Master Data Structures", "Understand Recursion"]
    )
    assert profile.user_id == "firebase_uid_987654"
    assert len(profile.learning_goals) == 2
    assert profile.preferred_explanation_style == ExplanationStyle.SIMPLE
    
    # Check default study preferences
    assert profile.study_preferences.session_duration_minutes == 25
    assert profile.study_preferences.break_duration_minutes == 5
    assert profile.study_preferences.learning_pace == LearningPace.MODERATE
    
    # Check default accessibility settings
    assert profile.accessibility_settings.reading_assistance is False
    assert profile.accessibility_settings.text_to_speech is False
    assert profile.accessibility_settings.adaptive_pacing is True

def test_learner_profile_custom_preferences():
    profile = LearnerProfileDocument(
        user_id="507f1f77bcf86cd799439011",
        preferred_explanation_style=ExplanationStyle.ANALOGY,
        study_preferences=StudyPreferences(
            session_duration_minutes=45,
            break_duration_minutes=10,
            learning_pace=LearningPace.GENTLE
        ),
        accessibility_settings=AccessibilitySettings(
            reading_assistance=True,
            high_contrast_mode=True,
            reduced_motion=True
        )
    )
    assert profile.preferred_explanation_style == ExplanationStyle.ANALOGY
    assert profile.study_preferences.session_duration_minutes == 45
    assert profile.accessibility_settings.reading_assistance is True
    assert profile.accessibility_settings.reduced_motion is True


# -----------------------------------------------------------------------------
# 4. EMOTION EVENT VALIDATION TESTS
# -----------------------------------------------------------------------------

def test_emotion_event_valid_daisee_classes():
    # Test DAISEE model classes
    labels = ["confused", "focused", "frustrated", "bored", "drowsy", "looking_away"]
    for label in labels:
        evt = EmotionEvent(
            predicted_label=label,
            confidence=0.88,
            model_version="MobileNetV2_Transfer_v1"
        )
        assert evt.predicted_label == label
        assert evt.confidence == 0.88

def test_emotion_event_case_and_synonym_normalization():
    evt_focused = EmotionEvent(predicted_label="Focused", confidence=0.92)
    assert evt_focused.predicted_label == SupportedEmotion.FOCUSED

    evt_away = EmotionEvent(predicted_label="Looking Away", confidence=0.85)
    assert evt_away.predicted_label == SupportedEmotion.LOOKING_AWAY

    evt_engaged = EmotionEvent(predicted_label="engaged", confidence=0.95)
    assert evt_engaged.predicted_label == SupportedEmotion.ENGAGED

def test_emotion_event_invalid_confidence():
    # Confidence must be between 0.0 and 1.0
    with pytest.raises(ValidationError):
        EmotionEvent(predicted_label="focused", confidence=1.45)

    with pytest.raises(ValidationError):
        EmotionEvent(predicted_label="focused", confidence=-0.1)

def test_emotion_event_invalid_label():
    with pytest.raises(ValidationError):
        EmotionEvent(predicted_label="completely_unsupported_emotion", confidence=0.75)


# -----------------------------------------------------------------------------
# 5. ASSISTANCE EVENT VALIDATION TESTS
# -----------------------------------------------------------------------------

def test_assistance_event_valid():
    evt = AssistanceEvent(
        assistance_type=AssistanceType.EXPLAIN_SIMPLY,
        reason="Repeated confusion detected during binary search lecture",
        action_details={"topic": "binary_search", "simplified_level": 1}
    )
    assert evt.assistance_type == AssistanceType.EXPLAIN_SIMPLY
    assert "Repeated confusion" in evt.reason
    assert evt.action_details["topic"] == "binary_search"


# -----------------------------------------------------------------------------
# 6. STUDY SESSION VALIDATION TESTS
# -----------------------------------------------------------------------------

def test_study_session_active_lifecycle():
    now = datetime.now(timezone.utc)
    session = StudySessionDocument(
        user_id="firebase_uid_987654",
        learner_profile_id="507f1f77bcf86cd799439011",
        started_at=now,
        status=SessionStatus.ACTIVE
    )
    assert session.status == SessionStatus.ACTIVE
    assert session.ended_at is None
    assert len(session.emotion_events) == 0
    assert len(session.assistance_events) == 0

def test_study_session_completed_with_events():
    start = datetime.now(timezone.utc) - timedelta(minutes=30)
    end = datetime.now(timezone.utc)
    
    session = StudySessionDocument(
        user_id="firebase_uid_987654",
        started_at=start,
        ended_at=end,
        status=SessionStatus.COMPLETED,
        emotion_events=[
            EmotionEvent(predicted_label="focused", confidence=0.95),
            EmotionEvent(predicted_label="confused", confidence=0.78),
            EmotionEvent(predicted_label="focused", confidence=0.89)
        ],
        assistance_events=[
            AssistanceEvent(
                assistance_type=AssistanceType.EXPLAIN_SIMPLY,
                reason="User requested simplified breakdown",
                action_details={"concept": "Stack LIFO"}
            )
        ],
        session_summary=SessionSummary(
            total_duration_minutes=30,
            predominant_emotion=SupportedEmotion.FOCUSED,
            total_assistance_provided=1,
            notes="Productive stack & queue review session."
        )
    )
    assert session.status == SessionStatus.COMPLETED
    assert len(session.emotion_events) == 3
    assert len(session.assistance_events) == 1
    assert session.session_summary.total_duration_minutes == 30

def test_study_session_invalid_date_ordering():
    start = datetime.now(timezone.utc)
    invalid_end = start - timedelta(minutes=10) # Ends before it begins!
    
    with pytest.raises(ValueError, match="Session 'ended_at' timestamp cannot precede 'started_at'"):
        StudySessionDocument(
            user_id="user_123",
            started_at=start,
            ended_at=invalid_end
        )


# -----------------------------------------------------------------------------
# 7. BOUNDED ARRAYS INTEGRITY TEST
# -----------------------------------------------------------------------------

def test_study_session_bounded_events_limit():
    # Ensure unbounded arrays are rejected
    too_many_events = [
        EmotionEvent(predicted_label="focused", confidence=0.9)
        for _ in range(501) # Exceeds max_length=500
    ]
    with pytest.raises(ValidationError):
        StudySessionDocument(
            user_id="user_123",
            emotion_events=too_many_events
        )

