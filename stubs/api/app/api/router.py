"""Aggregates all API route modules."""

from fastapi import APIRouter

from app.api.health import router as health_router
from app.api.v1.workflow import router as workflow_router
from app.api.v1.workflow_definitions import router as workflow_definitions_router

api_router = APIRouter()

# Health check routes (no prefix, no auth)
api_router.include_router(health_router, tags=["health"])

# Workflow POC routes
api_router.include_router(workflow_router, prefix="/api/v1")

# Workflow definition management routes
api_router.include_router(workflow_definitions_router, prefix="/api/v1")

# TODO: Add v1 routes
# from app.api.v1 import projects, loans, contacts, documents, tasks
# api_router.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
# api_router.include_router(loans.router, prefix="/api/v1/loans", tags=["loans"])
# api_router.include_router(contacts.router, prefix="/api/v1/contacts", tags=["contacts"])
# api_router.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
# api_router.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])
