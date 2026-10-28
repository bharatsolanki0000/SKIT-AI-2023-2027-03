import re
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List, Dict, Any, Union, Literal
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator, ConfigDict

# =============================================================================
# EXISTING AUTHENTICATION REQUEST / RESPONSE SCHEMAS (PRESERVED UNCHANGED)
# =============================================================================

class SignupRequest(BaseModel):
    name: str = Field(..., min_length=1, description="Full name of the user", json_schema_extra={"example": "Chahat"})
    email: EmailStr = Field(..., description="Valid email address", json_schema_extra={"example": "chahat@gmail.com"})
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long", json_schema_extra={"example": "password123"})

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered email address", json_schema_extra={"example": "chahat@gmail.com"})
    password: str = Field(..., min_length=1, description="Account password", json_schema_extra={"example": "password123"})

class UserResponse(BaseModel):
    uid: str = Field(..., json_schema_extra={"example": "abc123xyz456"})
    name: str = Field(..., json_schema_extra={"example": "Chahat"})
    email: EmailStr = Field(..., json_schema_extra={"example": "chahat@gmail.com"})

class SignupResponse(BaseModel):
    message: str = Field(default="User registered successfully", json_schema_extra={"example": "User registered successfully"})
    user: UserResponse

class LoginResponse(BaseModel):
    message: str = Field(default="Login successful", json_schema_extra={"example": "Login successful"})
    idToken: str = Field(..., json_schema_extra={"example": "eyJhbGciOiJSUzI1NiIs..."})
    refreshToken: str = Field(..., json_schema_extra={"example": "AMf-vBy..."})
    expiresIn: str = Field(..., json_schema_extra={"example": "3600"})
    user: UserResponse

class ErrorResponse(BaseModel):
    detail: str = Field(..., json_schema_extra={"example": "Invalid credentials"})


# =============================================================================
# SPRINT 1: MONGODB SCHEMA DEFINITIONS & PYDANTIC VALIDATION MODELS
# =============================================================================

OBJECT_ID_REGEX = re.compile(r"^[0-9a-fA-F]{24}$")

def validate_object_id_str(val: Optional[str]) -> Optional[str]:
    """Validate 24-character hexadecimal ObjectId representation."""
    if val is None:
        return None
    val_str = str(val).strip()
    if not OBJECT_ID_REGEX.match(val_str):
        raise ValueError("Invalid ObjectId format. Must be a 24-character hexadecimal string.")
    return val_str

def utc_now() -> datetime:
    """Return a timezone-aware UTC datetime."""
    return datetime.now(timezone.utc)


# -----------------------------------------------------------------------------
# ENUMERATIONS & ALLOWED VALUES
# -----------------------------------------------------------------------------

class ExplanationStyle(str, Enum):
    SIMPLE = "simple"
    DETAILED = "detailed"
    VISUAL = "visual"
    ANALOGY = "analogy"
    STEP_BY_STEP = "step_by_step"

class LearningPace(str, Enum):
    GENTLE = "gentle"
    MODERATE = "moderate"
    INTENSIVE = "intensive"

class ReminderFrequency(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"

class BackgroundSound(str, Enum):
    NONE = "none"
    WHITE_NOISE = "white_noise"
    NATURE = "nature"
    SOFT_AMBIENT = "soft_ambient"

class FontSizePreference(str, Enum):
    STANDARD = "standard"
    LARGE = "large"
    EXTRA_LARGE = "extra_large"

class SessionStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    ABANDONED = "abandoned"

class SupportedEmotion(str, Enum):
    # Core DAISEE Model Classes
    CONFUSED = "confused"
    FOCUSED = "focused"
    FRUSTRATED = "frustrated"
    BORED = "bored"
    DROWSY = "drowsy"
    LOOKING_AWAY = "looking_away"
    # Supported Educational Companion Synonyms
    ENGAGED = "engaged"      # synonym of focused
    STRESSED = "stressed"    # synonym of frustrated
    FATIGUED = "fatigued"    # synonym of drowsy
    CALM = "calm"
    CURIOUS = "curious"
    OVERWHELMED = "overwhelmed"

class AssistanceType(str, Enum):
    EXPLAIN_SIMPLY = "explain_simply"
    GENERATE_QUIZ = "generate_quiz"
    SUGGEST_BREAK = "suggest_break"
    EMOTION_CHECK = "emotion_check"
    PACING_ADJUSTMENT = "pacing_adjustment"


# -----------------------------------------------------------------------------
# EMBEDDED SUB-DOCUMENTS: LEARNER PREFERENCES & ACCESSIBILITY
# -----------------------------------------------------------------------------

class StudyPreferences(BaseModel):
    model_config = ConfigDict(extra="ignore")

    session_duration_minutes: int = Field(
        default=25,
        ge=5,
        le=240,
        description="Target focus duration in minutes (standard Pomodoro default: 25)"
    )
    break_duration_minutes: int = Field(
        default=5,
        ge=1,
        le=60,
        description="Rest interval duration in minutes (default: 5)"
    )
    learning_pace: LearningPace = Field(
        default=LearningPace.MODERATE,
        description="Pacing preference for progression and explanations"
    )
    reminder_frequency: ReminderFrequency = Field(
        default=ReminderFrequency.NORMAL,
        description="Frequency of proactive notifications and check-ins"
    )

class AttentionPreferences(BaseModel):
    model_config = ConfigDict(extra="ignore")

    prefer_break_reminders: bool = Field(
        default=True,
        description="Whether Camber proactively suggests restorative breaks"
    )
    break_reminder_interval_minutes: int = Field(
        default=25,
        ge=5,
        le=120,
        description="Study interval before a rest prompt is suggested"
    )
    background_sounds: BackgroundSound = Field(
        default=BackgroundSound.NONE,
        description="Gentle audio environment preference during focus sessions"
    )

class AccessibilitySettings(BaseModel):
    model_config = ConfigDict(extra="ignore")

    reading_assistance: bool = Field(
        default=False,
        description="Enhanced line spacing, simplified vocabulary, and dyslexic-friendly cues"
    )
    text_to_speech: bool = Field(
        default=False,
        description="Option to listen to explanations read aloud"
    )
    font_size_preference: FontSizePreference = Field(
        default=FontSizePreference.STANDARD,
        description="Visual text display scaling preference"
    )
    high_contrast_mode: bool = Field(
        default=False,
        description="High-contrast color styling for readability"
    )
    reduced_motion: bool = Field(
        default=False,
        description="Disables non-essential UI animations for cognitive comfort"
    )
    adaptive_pacing: bool = Field(
        default=True,
        description="Automatically adjust study rhythm based on detected fatigue"
    )


# -----------------------------------------------------------------------------
# EMBEDDED SUB-DOCUMENTS: STUDY SESSIONS (BOUNDED EVENTS & SUMMARY)
# -----------------------------------------------------------------------------

class EmotionEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")

    timestamp: datetime = Field(
        default_factory=utc_now,
        description="UTC timestamp of the model prediction"
    )
    predicted_label: SupportedEmotion = Field(
        ...,
        description="Predicted emotion / engagement state from the verified AI model"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score output from the classifier (bounded between 0.0 and 1.0)"
    )
    model_version: Optional[str] = Field(
        default="MobileNetV2_Transfer_v1",
        description="Model architecture and version metadata"
    )

    @field_validator("predicted_label", mode="before")
    @classmethod
    def normalize_label(cls, v: Any) -> Any:
        if isinstance(v, str):
            clean = v.strip().lower().replace(" ", "_")
            # Map common synonyms
            if clean == "looking_away":
                return SupportedEmotion.LOOKING_AWAY
            return clean
        return v

class AssistanceEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")

    timestamp: datetime = Field(
        default_factory=utc_now,
        description="UTC timestamp when assistance was offered or triggered"
    )
    assistance_type: AssistanceType = Field(
        ...,
        description="Type of cognitive support provided (e.g. explain_simply, suggest_break)"
    )
    reason: Optional[str] = Field(
        default=None,
        max_length=250,
        description="Contextual trigger reason (e.g. 'Detected consecutive confused predictions')"
    )
    action_details: Dict[str, Any] = Field(
        default_factory=dict,
        description="Minimal structured metadata about the assistance outcome (no raw biometric data)"
    )

class SessionSummary(BaseModel):
    model_config = ConfigDict(extra="ignore")

    total_duration_minutes: Optional[int] = Field(
        default=None,
        ge=0,
        description="Total elapsed session time in minutes"
    )
    predominant_emotion: Optional[SupportedEmotion] = Field(
        default=None,
        description="Most frequent engagement or emotion state recorded during the session"
    )
    total_assistance_provided: int = Field(
        default=0,
        ge=0,
        description="Count of proactive interventions delivered during this session"
    )
    notes: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="High-level session reflection notes or summary text"
    )


# -----------------------------------------------------------------------------
# COLLECTION 1: USERS (Account & External Identity Link)
# -----------------------------------------------------------------------------

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="Normalized user email address")
    display_name: Optional[str] = Field(default=None, max_length=100, description="User's display or chosen name")
    auth_provider: str = Field(default="firebase", description="Authentication provider identifier (e.g. firebase)")
    auth_provider_uid: str = Field(..., min_length=1, description="External authentication identifier (e.g. Firebase UID)")
    is_active: bool = Field(default=True, description="Account active status")

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: Any) -> Any:
        if isinstance(v, str):
            return v.strip().lower()
        return v

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=100)
    is_active: Optional[bool] = None

class UserDocument(UserBase):
    id: Optional[str] = Field(default=None, alias="_id", description="MongoDB Document Identifier")
    created_at: datetime = Field(default_factory=utc_now, description="UTC account creation timestamp")
    updated_at: datetime = Field(default_factory=utc_now, description="UTC last modification timestamp")

    model_config = ConfigDict(
        populate_by_name=True,
        extra="ignore"
    )

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v: Any) -> Optional[str]:
        return validate_object_id_str(v)


# -----------------------------------------------------------------------------
# COLLECTION 2: LEARNER_PROFILES (User Preferences & Accessibility)
# -----------------------------------------------------------------------------

class LearnerProfileBase(BaseModel):
    user_id: str = Field(..., description="Reference to the verified user identity (MongoDB ObjectId or Firebase UID)")
    learning_goals: List[str] = Field(
        default_factory=list,
        max_length=20,
        description="User-defined learning objectives"
    )
    preferred_explanation_style: ExplanationStyle = Field(
        default=ExplanationStyle.SIMPLE,
        description="Format and tone for AI-driven explanations"
    )
    study_preferences: StudyPreferences = Field(
        default_factory=StudyPreferences,
        description="Rhythm, session durations, and pace settings"
    )
    strengths: List[str] = Field(
        default_factory=list,
        max_length=20,
        description="Self-identified academic or cognitive strengths"
    )
    areas_for_improvement: List[str] = Field(
        default_factory=list,
        max_length=20,
        description="Topics or skills targeted for growth"
    )
    attention_preferences: AttentionPreferences = Field(
        default_factory=AttentionPreferences,
        description="Break reminders and focus environment cues"
    )
    accessibility_settings: AccessibilitySettings = Field(
        default_factory=AccessibilitySettings,
        description="Sensory and cognitive accommodation preferences (non-medical)"
    )

class LearnerProfileCreate(LearnerProfileBase):
    pass

class LearnerProfileUpdate(BaseModel):
    learning_goals: Optional[List[str]] = None
    preferred_explanation_style: Optional[ExplanationStyle] = None
    study_preferences: Optional[StudyPreferences] = None
    strengths: Optional[List[str]] = None
    areas_for_improvement: Optional[List[str]] = None
    attention_preferences: Optional[AttentionPreferences] = None
    accessibility_settings: Optional[AccessibilitySettings] = None

class LearnerProfileDocument(LearnerProfileBase):
    id: Optional[str] = Field(default=None, alias="_id", description="MongoDB Profile Identifier")
    created_at: datetime = Field(default_factory=utc_now, description="UTC profile creation timestamp")
    updated_at: datetime = Field(default_factory=utc_now, description="UTC last profile update timestamp")

    model_config = ConfigDict(
        populate_by_name=True,
        extra="ignore"
    )

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v: Any) -> Optional[str]:
        return validate_object_id_str(v)


# -----------------------------------------------------------------------------
# COLLECTION 3: STUDY_SESSIONS (Session Lifecycle, Events & Summaries)
# -----------------------------------------------------------------------------

class StudySessionBase(BaseModel):
    user_id: str = Field(..., description="Reference to the session owner (user identity)")
    learner_profile_id: Optional[str] = Field(
        default=None,
        description="Optional reference to the learner profile used during this study session"
    )
    started_at: datetime = Field(
        default_factory=utc_now,
        description="Required session start timestamp in UTC"
    )
    ended_at: Optional[datetime] = Field(
        default=None,
        description="Session conclusion timestamp in UTC (nullable while session is active)"
    )
    status: SessionStatus = Field(
        default=SessionStatus.ACTIVE,
        description="Current operational lifecycle status of the session"
    )
    emotion_events: List[EmotionEvent] = Field(
        default_factory=list,
        max_length=500,
        description="Bounded array of emotion/engagement model predictions (max 500 events per session)"
    )
    assistance_events: List[AssistanceEvent] = Field(
        default_factory=list,
        max_length=200,
        description="Bounded array of support interventions offered (max 200 events per session)"
    )
    session_summary: Optional[Union[SessionSummary, str]] = Field(
        default=None,
        description="Optional session summary metadata or review notes"
    )

    @field_validator("learner_profile_id", mode="before")
    @classmethod
    def validate_profile_id(cls, v: Any) -> Optional[str]:
        if v is None or v == "":
            return None
        return validate_object_id_str(v)

    @model_validator(mode="after")
    def validate_session_dates(self) -> "StudySessionBase":
        if self.ended_at is not None and self.ended_at < self.started_at:
            raise ValueError("Session 'ended_at' timestamp cannot precede 'started_at'.")
        return self

class StudySessionCreate(BaseModel):
    user_id: str
    learner_profile_id: Optional[str] = None
    started_at: datetime = Field(default_factory=utc_now)
    status: SessionStatus = SessionStatus.ACTIVE

class StudySessionUpdate(BaseModel):
    ended_at: Optional[datetime] = None
    status: Optional[SessionStatus] = None
    session_summary: Optional[Union[SessionSummary, str]] = None

class StudySessionDocument(StudySessionBase):
    id: Optional[str] = Field(default=None, alias="_id", description="MongoDB Session Identifier")
    created_at: datetime = Field(default_factory=utc_now, description="UTC document creation timestamp")
    updated_at: datetime = Field(default_factory=utc_now, description="UTC document modification timestamp")

    model_config = ConfigDict(
        populate_by_name=True,
        extra="ignore"
    )

    @field_validator("id", mode="before")
    @classmethod
    def validate_id(cls, v: Any) -> Optional[str]:
        return validate_object_id_str(v)
