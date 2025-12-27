"""FastAPI application factory and lifespan management."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.router import api_router
from app.config import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager for startup/shutdown events."""
    # Startup
    settings = get_settings()
    app.state.settings = settings
    # TODO: Initialize database connection pool
    # TODO: Initialize Redis connection
    # TODO: Initialize AWS clients
    yield
    # Shutdown
    # TODO: Close database connections
    # TODO: Close Redis connections


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Connect 2.0 Platform API - Real estate development lifecycle management",
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
        lifespan=lifespan,
    )

    # Include API router
    app.include_router(api_router)

    return app


# Application instance
app = create_app()
