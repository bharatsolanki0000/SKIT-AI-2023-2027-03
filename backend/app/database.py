import logging
import os
from typing import Optional, Dict, Any, List
from pymongo import MongoClient, ASCENDING, DESCENDING, IndexModel
from pymongo.database import Database
from pymongo.collection import Collection
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError, ConnectionFailure

from app.config import settings

logger = logging.getLogger("camber.database")

# Approved collection names from Sprint 1
COLLECTION_USERS = "users"
COLLECTION_LEARNER_PROFILES = "learner_profiles"
COLLECTION_STUDY_SESSIONS = "study_sessions"
APPROVED_COLLECTIONS = {
    COLLECTION_USERS,
    COLLECTION_LEARNER_PROFILES,
    COLLECTION_STUDY_SESSIONS,
}

# Known placeholder substrings in connection string
KNOWN_PLACEHOLDERS = [
    "your_mongodb_atlas_connection_string",
    "<password>",
    "<username>",
    "placeholder",
]

# Module-level singleton client (lazy, never connected at import time)
_mongo_client: Optional[MongoClient] = None


def is_mongodb_configured() -> bool:
    """
    Determines whether a non-empty, non-placeholder MongoDB URI is configured.
    Does not initiate network connections.
    """
    uri = settings.MONGODB_URI
    if not uri or not isinstance(uri, str):
        return False
    
    clean_uri = uri.strip()
    if not clean_uri:
        return False
        
    lower_uri = clean_uri.lower()
    for placeholder in KNOWN_PLACEHOLDERS:
        if placeholder in lower_uri:
            return False
            
    # Must at least start with a valid MongoDB protocol
    if not (lower_uri.startswith("mongodb://") or lower_uri.startswith("mongodb+srv://")):
        return False
        
    return True


def get_mongo_client() -> Optional[MongoClient]:
    """
    Returns the reusable MongoClient instance.
    Initializes lazily if configured. Does NOT perform network I/O upon instantiation.
    Returns None if MongoDB is unconfigured or has placeholder credentials.
    """
    global _mongo_client
    if not is_mongodb_configured():
        return None

    if _mongo_client is None:
        try:
            # Lazy client instantiation with connect=False to avoid import-time or init-time network calls
            _mongo_client = MongoClient(
                settings.MONGODB_URI,
                connect=False,
                serverSelectionTimeoutMS=2000,
                connectTimeoutMS=2000,
                socketTimeoutMS=5000,
                maxPoolSize=50,
                minPoolSize=1,
                retryWrites=True,
            )
            logger.info("Initialized reusable PyMongo client instance.")
        except Exception:
            # Strictly avoid printing or logging the connection string / credentials
            logger.error("Failed to initialize PyMongo client instance.")
            _mongo_client = None
            return None

    return _mongo_client


def close_mongo_client() -> None:
    """
    Safely closes the reusable MongoClient during application shutdown.
    """
    global _mongo_client
    if _mongo_client is not None:
        try:
            _mongo_client.close()
            logger.info("PyMongo client closed cleanly.")
        except Exception:
            logger.warning("Error encountered while closing PyMongo client.")
        finally:
            _mongo_client = None


def get_database(db_name: Optional[str] = None) -> Database:
    """
    Returns the active MongoDB Database instance.
    Raises RuntimeError if MongoDB is not configured or client is unavailable.
    """
    client = get_mongo_client()
    if client is None:
        raise RuntimeError("MongoDB is not configured or connection string is invalid.")
    
    target_db_name = db_name or settings.DATABASE_NAME or "camber"
    return client[target_db_name]


def ping_database() -> bool:
    """
    Executes a genuine ping command against the server.
    Returns True if ping succeeds, False otherwise.
    Never exposes raw exceptions or connection credentials.
    """
    if not is_mongodb_configured():
        return False

    client = get_mongo_client()
    if client is None:
        return False

    try:
        # Run a quick ping command
        client.admin.command("ping")
        return True
    except (PyMongoError, ServerSelectionTimeoutError, ConnectionFailure, Exception):
        logger.warning("MongoDB ping failed: Database server is unreachable or credentials rejected.")
        return False


def check_database_health() -> Dict[str, Any]:
    """
    Performs database health inspection and returns a sanitized health status dictionary:
    - 'connected': Successfully reached MongoDB Atlas / server
    - 'not_configured': Missing or placeholder MONGODB_URI
    - 'unavailable': Configured but failed network or authentication check
    """
    if not is_mongodb_configured():
        return {
            "status": "not_configured",
            "message": "MongoDB is not configured."
        }

    is_healthy = ping_database()
    if is_healthy:
        db_name = settings.DATABASE_NAME or "camber"
        return {
            "status": "connected",
            "database": db_name
        }
    else:
        return {
            "status": "unavailable",
            "message": "Database connection is unavailable."
        }


def get_collection(name: str, db_name: Optional[str] = None) -> Collection:
    """
    Exposes reusable collection reference for an approved Sprint 1 collection.
    Fails safely with a clear RuntimeError if MongoDB is unavailable or unconfigured,
    or ValueError if an unapproved collection is requested.
    """
    if name not in APPROVED_COLLECTIONS:
        raise ValueError(f"Collection '{name}' is not recognized. Approved collections: {sorted(APPROVED_COLLECTIONS)}")

    db = get_database(db_name)
    return db[name]


def get_users_collection(db_name: Optional[str] = None) -> Collection:
    """Returns the 'users' collection."""
    return get_collection(COLLECTION_USERS, db_name)


def get_learner_profiles_collection(db_name: Optional[str] = None) -> Collection:
    """Returns the 'learner_profiles' collection."""
    return get_collection(COLLECTION_LEARNER_PROFILES, db_name)


def get_study_sessions_collection(db_name: Optional[str] = None) -> Collection:
    """Returns the 'study_sessions' collection."""
    return get_collection(COLLECTION_STUDY_SESSIONS, db_name)


def init_indexes(db: Optional[Database] = None) -> Dict[str, List[str]]:
    """
    Safely and idempotently creates the 5 approved Sprint 1 indexes:
    1. users:
       - idx_users_auth_provider_uid (auth_provider_uid ASC, unique=True)
       - idx_users_email_unique (email ASC, unique=True)
    2. learner_profiles:
       - idx_learner_profiles_user_id_unique (user_id ASC, unique=True)
    3. study_sessions:
       - idx_study_sessions_user_history (user_id ASC, started_at DESC)
       - idx_study_sessions_user_status (user_id ASC, status ASC)
    
    Returns a dict mapping collection names to created index names.
    Raises RuntimeError if database is unavailable.
    """
    if db is None:
        db = get_database()

    results: Dict[str, List[str]] = {}

    try:
        # 1. USERS COLLECTION INDEXES
        users_col = db[COLLECTION_USERS]
        users_indexes = [
            IndexModel(
                [("auth_provider_uid", ASCENDING)],
                unique=True,
                name="idx_users_auth_provider_uid"
            ),
            IndexModel(
                [("email", ASCENDING)],
                unique=True,
                name="idx_users_email_unique"
            ),
        ]
        created_users = users_col.create_indexes(users_indexes)
        results[COLLECTION_USERS] = created_users
        logger.info(f"Initialized indexes on '{COLLECTION_USERS}': {created_users}")

        # 2. LEARNER_PROFILES COLLECTION INDEXES
        profiles_col = db[COLLECTION_LEARNER_PROFILES]
        profiles_indexes = [
            IndexModel(
                [("user_id", ASCENDING)],
                unique=True,
                name="idx_learner_profiles_user_id_unique"
            ),
        ]
        created_profiles = profiles_col.create_indexes(profiles_indexes)
        results[COLLECTION_LEARNER_PROFILES] = created_profiles
        logger.info(f"Initialized indexes on '{COLLECTION_LEARNER_PROFILES}': {created_profiles}")

        # 3. STUDY_SESSIONS COLLECTION INDEXES
        sessions_col = db[COLLECTION_STUDY_SESSIONS]
        sessions_indexes = [
            IndexModel(
                [("user_id", ASCENDING), ("started_at", DESCENDING)],
                name="idx_study_sessions_user_history"
            ),
            IndexModel(
                [("user_id", ASCENDING), ("status", ASCENDING)],
                name="idx_study_sessions_user_status"
            ),
        ]
        created_sessions = sessions_col.create_indexes(sessions_indexes)
        results[COLLECTION_STUDY_SESSIONS] = created_sessions
        logger.info(f"Initialized indexes on '{COLLECTION_STUDY_SESSIONS}': {created_sessions}")

        return results

    except PyMongoError:
        logger.error("Failed to initialize database indexes due to a PyMongo error.")
        raise
    except Exception:
        logger.error("Unexpected error during index initialization.")
        raise

