"""Health check endpoints for liveness and readiness probes."""

from datetime import UTC, datetime
from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response schema."""

    status: Literal["healthy", "unhealthy"]
    database: Literal["connected", "disconnected"]
    redis: Literal["connected", "disconnected"]
    timestamp: datetime
    version: str


class LivenessResponse(BaseModel):
    """Simple liveness probe response."""

    status: Literal["ok"]


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Readiness probe - checks all dependencies.

    Returns health status including database and cache connectivity.
    Used by load balancers and orchestrators to determine if the
    service is ready to receive traffic.
    """
    # TODO: Implement actual database connectivity check
    database_status: Literal["connected", "disconnected"] = "disconnected"

    # TODO: Implement actual Redis connectivity check
    redis_status: Literal["connected", "disconnected"] = "disconnected"

    overall_status: Literal["healthy", "unhealthy"] = (
        "healthy" if database_status == "connected" and redis_status == "connected" else "unhealthy"
    )

    return HealthResponse(
        status=overall_status,
        database=database_status,
        redis=redis_status,
        timestamp=datetime.now(UTC),
        version="0.1.0",
    )


@router.get("/health/live", response_model=LivenessResponse)
async def liveness_probe() -> LivenessResponse:
    """
    Liveness probe - checks if the service is running.

    Simple endpoint that returns 200 OK if the service process is alive.
    Does not check dependencies. Used by orchestrators to restart
    unresponsive containers.
    """
    return LivenessResponse(status="ok")
