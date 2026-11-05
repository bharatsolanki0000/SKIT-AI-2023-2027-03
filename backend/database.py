"""
CAMBER Database Module Root Re-export
Provides backward-compatible root access to app.database utilities.
"""
from app.database import (
    is_mongodb_configured,
    get_mongo_client,
    close_mongo_client,
    get_database,
    ping_database,
    check_database_health,
    get_collection,
    get_users_collection,
    get_learner_profiles_collection,
    get_study_sessions_collection,
    init_indexes,
    COLLECTION_USERS,
    COLLECTION_LEARNER_PROFILES,
    COLLECTION_STUDY_SESSIONS,
    APPROVED_COLLECTIONS,
)

__all__ = [
    "is_mongodb_configured",
    "get_mongo_client",
    "close_mongo_client",
    "get_database",
    "ping_database",
    "check_database_health",
    "get_collection",
    "get_users_collection",
    "get_learner_profiles_collection",
    "get_study_sessions_collection",
    "init_indexes",
    "COLLECTION_USERS",
    "COLLECTION_LEARNER_PROFILES",
    "COLLECTION_STUDY_SESSIONS",
    "APPROVED_COLLECTIONS",
]

