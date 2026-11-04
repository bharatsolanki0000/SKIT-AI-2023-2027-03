import logging
from typing import Optional
from fastapi import APIRouter, Response, status
from pydantic import BaseModel

from app.database import check_database_health

logger = logging.getLogger("camber.routes.health")

router = APIRouter(tags=["Health"])


class DatabaseHealthResponse(BaseModel):
    status: str
    database: Optional[str] = None
    message: Optional[str] = None


@router.get(
    "/health/database",
    response_model=DatabaseHealthResponse,
    summary="MongoDB Database Health Check",
    description="Inspects MongoDB configuration and performs a live ping when configured.",
    responses={
        200: {
            "model": DatabaseHealthResponse,
            "description": "MongoDB is configured and reachable",
        },
        503: {
            "model": DatabaseHealthResponse,
            "description": "MongoDB is unconfigured or unreachable",
        },
    },
)
async def health_database(response: Response):
    """
    Evaluates MongoDB connectivity:
    - 200 OK with {"status": "connected", "database": "<name>"} if reachable.
    - 503 Service Unavailable with {"status": "not_configured", "message": ...} if unconfigured.
    - 503 Service Unavailable with {"status": "unavailable", "message": ...} if unreachable.
    Zero sensitive credentials or raw exceptions are exposed.
    """
    health = check_database_health()
    if health.get("status") != "connected":
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return health

