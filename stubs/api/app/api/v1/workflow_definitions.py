"""API endpoints for workflow definition management."""

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.database import get_db
from app.models.workflow import WorkflowDefinition, WorkflowDefinitionVersion
from app.schemas.workflow import (
    DefinitionStatus,
    WorkflowDefinitionCreate,
    WorkflowDefinitionDetailResponse,
    WorkflowDefinitionListResponse,
    WorkflowDefinitionResponse,
    WorkflowDefinitionUpdate,
    WorkflowVersionCreate,
    WorkflowVersionResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/workflow-definitions", tags=["workflow-definitions"])


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================


async def get_definition_by_id(
    definition_id: UUID, db: AsyncSession, include_versions: bool = False
) -> WorkflowDefinition:
    """Get a workflow definition by ID or raise 404."""
    if include_versions:
        query = (
            select(WorkflowDefinition)
            .where(WorkflowDefinition.id == definition_id)
            .options(selectinload(WorkflowDefinition.versions))
        )
    else:
        query = select(WorkflowDefinition).where(WorkflowDefinition.id == definition_id)

    result = await db.execute(query)
    definition = result.scalar_one_or_none()

    if definition is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workflow definition {definition_id} not found",
        )

    return definition


async def get_active_version(
    definition_id: UUID, db: AsyncSession
) -> WorkflowDefinitionVersion | None:
    """Get the active version for a definition."""
    query = (
        select(WorkflowDefinitionVersion)
        .where(WorkflowDefinitionVersion.definition_id == definition_id)
        .where(WorkflowDefinitionVersion.is_active == True)  # noqa: E712
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_version_count(definition_id: UUID, db: AsyncSession) -> int:
    """Get the count of versions for a definition."""
    query = (
        select(func.count())
        .select_from(WorkflowDefinitionVersion)
        .where(WorkflowDefinitionVersion.definition_id == definition_id)
    )
    result = await db.execute(query)
    return result.scalar() or 0


async def get_next_version_number(definition_id: UUID, db: AsyncSession) -> int:
    """Get the next version number for a definition."""
    query = (
        select(func.max(WorkflowDefinitionVersion.version))
        .where(WorkflowDefinitionVersion.definition_id == definition_id)
    )
    result = await db.execute(query)
    max_version = result.scalar()
    return (max_version or 0) + 1


def build_definition_response(
    definition: WorkflowDefinition,
    active_version: WorkflowDefinitionVersion | None,
    version_count: int,
) -> WorkflowDefinitionResponse:
    """Build a workflow definition response."""
    return WorkflowDefinitionResponse(
        id=definition.id,
        name=definition.name,
        description=definition.description,
        process_id=definition.process_id,
        status=definition.status,
        created_by=definition.created_by,
        created_at=definition.created_at,
        updated_at=definition.updated_at,
        active_version=WorkflowVersionResponse.model_validate(active_version) if active_version else None,
        version_count=version_count,
    )


# =============================================================================
# DEFINITION ENDPOINTS
# =============================================================================


@router.post("", response_model=WorkflowDefinitionResponse, status_code=status.HTTP_201_CREATED)
async def create_definition(
    data: WorkflowDefinitionCreate,
    db: AsyncSession = Depends(get_db),
) -> WorkflowDefinitionResponse:
    """
    Create a new workflow definition with initial version.

    This creates a new workflow definition and its first version (v1).
    The initial version is created as a draft (not active).
    """
    # Check for duplicate name
    existing = await db.execute(
        select(WorkflowDefinition).where(WorkflowDefinition.name == data.name)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Workflow definition with name '{data.name}' already exists",
        )

    # Create definition
    definition = WorkflowDefinition(
        name=data.name,
        description=data.description,
        process_id=data.process_id,
        status="draft",
    )
    db.add(definition)
    await db.flush()

    # Create initial version
    version = WorkflowDefinitionVersion(
        definition_id=definition.id,
        version=1,
        bpmn_xml=data.bpmn_xml,
        change_notes=data.change_notes or "Initial version",
        is_active=False,
    )
    db.add(version)

    await db.commit()
    await db.refresh(definition)

    logger.info(f"Created workflow definition {definition.id}: {definition.name}")

    return build_definition_response(definition, None, 1)


@router.get("", response_model=list[WorkflowDefinitionListResponse])
async def list_definitions(
    status_filter: DefinitionStatus | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[WorkflowDefinitionListResponse]:
    """List all workflow definitions with summary info."""
    query = select(WorkflowDefinition).order_by(WorkflowDefinition.name)

    if status_filter:
        query = query.where(WorkflowDefinition.status == status_filter.value)

    result = await db.execute(query)
    definitions = result.scalars().all()

    responses = []
    for definition in definitions:
        # Get version info
        active_version = await get_active_version(definition.id, db)
        version_count = await get_version_count(definition.id, db)

        responses.append(
            WorkflowDefinitionListResponse(
                id=definition.id,
                name=definition.name,
                description=definition.description,
                process_id=definition.process_id,
                status=definition.status,
                created_by=definition.created_by,
                created_at=definition.created_at,
                active_version_number=active_version.version if active_version else None,
                version_count=version_count,
            )
        )

    return responses


@router.get("/{definition_id}", response_model=WorkflowDefinitionDetailResponse)
async def get_definition(
    definition_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> WorkflowDefinitionDetailResponse:
    """Get a workflow definition with all its versions."""
    definition = await get_definition_by_id(definition_id, db, include_versions=True)

    return WorkflowDefinitionDetailResponse(
        id=definition.id,
        name=definition.name,
        description=definition.description,
        process_id=definition.process_id,
        status=definition.status,
        created_by=definition.created_by,
        created_at=definition.created_at,
        updated_at=definition.updated_at,
        versions=[WorkflowVersionResponse.model_validate(v) for v in definition.versions],
    )


@router.patch("/{definition_id}", response_model=WorkflowDefinitionResponse)
async def update_definition(
    definition_id: UUID,
    data: WorkflowDefinitionUpdate,
    db: AsyncSession = Depends(get_db),
) -> WorkflowDefinitionResponse:
    """Update workflow definition metadata (not BPMN content)."""
    definition = await get_definition_by_id(definition_id, db)

    if data.name is not None:
        # Check for duplicate name
        existing = await db.execute(
            select(WorkflowDefinition)
            .where(WorkflowDefinition.name == data.name)
            .where(WorkflowDefinition.id != definition_id)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Workflow definition with name '{data.name}' already exists",
            )
        definition.name = data.name

    if data.description is not None:
        definition.description = data.description

    if data.status is not None:
        definition.status = data.status.value

    await db.commit()
    await db.refresh(definition)

    active_version = await get_active_version(definition_id, db)
    version_count = await get_version_count(definition_id, db)

    logger.info(f"Updated workflow definition {definition_id}")

    return build_definition_response(definition, active_version, version_count)


@router.delete("/{definition_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_definition(
    definition_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a workflow definition and all its versions."""
    definition = await get_definition_by_id(definition_id, db)

    # Check if any projects are using this definition
    if definition.projects:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot delete: {len(definition.projects)} project(s) are using this definition",
        )

    await db.delete(definition)
    await db.commit()

    logger.info(f"Deleted workflow definition {definition_id}")


# =============================================================================
# VERSION ENDPOINTS
# =============================================================================


@router.post("/{definition_id}/versions", response_model=WorkflowVersionResponse, status_code=status.HTTP_201_CREATED)
async def create_version(
    definition_id: UUID,
    data: WorkflowVersionCreate,
    db: AsyncSession = Depends(get_db),
) -> WorkflowVersionResponse:
    """
    Create a new version of a workflow definition.

    This saves the BPMN XML as a new version. If publish=true, this version
    becomes the active version immediately.
    """
    definition = await get_definition_by_id(definition_id, db)

    # Get next version number
    next_version = await get_next_version_number(definition_id, db)

    # Create new version
    version = WorkflowDefinitionVersion(
        definition_id=definition_id,
        version=next_version,
        bpmn_xml=data.bpmn_xml,
        change_notes=data.change_notes,
        is_active=False,
    )
    db.add(version)

    # If publishing, deactivate other versions and activate this one
    if data.publish:
        # Deactivate all other versions
        await db.execute(
            WorkflowDefinitionVersion.__table__.update()
            .where(WorkflowDefinitionVersion.definition_id == definition_id)
            .values(is_active=False)
        )
        version.is_active = True
        definition.status = "published"

    await db.commit()
    await db.refresh(version)

    logger.info(f"Created version {next_version} for definition {definition_id} (published={data.publish})")

    return WorkflowVersionResponse.model_validate(version)


@router.get("/{definition_id}/versions", response_model=list[WorkflowVersionResponse])
async def list_versions(
    definition_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> list[WorkflowVersionResponse]:
    """List all versions of a workflow definition."""
    await get_definition_by_id(definition_id, db)  # Verify exists

    query = (
        select(WorkflowDefinitionVersion)
        .where(WorkflowDefinitionVersion.definition_id == definition_id)
        .order_by(WorkflowDefinitionVersion.version.desc())
    )
    result = await db.execute(query)
    versions = result.scalars().all()

    return [WorkflowVersionResponse.model_validate(v) for v in versions]


@router.get("/{definition_id}/versions/{version_number}", response_model=WorkflowVersionResponse)
async def get_version(
    definition_id: UUID,
    version_number: int,
    db: AsyncSession = Depends(get_db),
) -> WorkflowVersionResponse:
    """Get a specific version of a workflow definition."""
    await get_definition_by_id(definition_id, db)  # Verify exists

    query = (
        select(WorkflowDefinitionVersion)
        .where(WorkflowDefinitionVersion.definition_id == definition_id)
        .where(WorkflowDefinitionVersion.version == version_number)
    )
    result = await db.execute(query)
    version = result.scalar_one_or_none()

    if version is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version {version_number} not found for definition {definition_id}",
        )

    return WorkflowVersionResponse.model_validate(version)


@router.post("/{definition_id}/versions/{version_number}/publish", response_model=WorkflowVersionResponse)
async def publish_version(
    definition_id: UUID,
    version_number: int,
    db: AsyncSession = Depends(get_db),
) -> WorkflowVersionResponse:
    """Publish a specific version, making it the active version."""
    definition = await get_definition_by_id(definition_id, db)

    query = (
        select(WorkflowDefinitionVersion)
        .where(WorkflowDefinitionVersion.definition_id == definition_id)
        .where(WorkflowDefinitionVersion.version == version_number)
    )
    result = await db.execute(query)
    version = result.scalar_one_or_none()

    if version is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version {version_number} not found for definition {definition_id}",
        )

    # Deactivate all versions
    await db.execute(
        WorkflowDefinitionVersion.__table__.update()
        .where(WorkflowDefinitionVersion.definition_id == definition_id)
        .values(is_active=False)
    )

    # Activate this version
    version.is_active = True
    definition.status = "published"

    await db.commit()
    await db.refresh(version)

    logger.info(f"Published version {version_number} for definition {definition_id}")

    return WorkflowVersionResponse.model_validate(version)


@router.post("/{definition_id}/versions/{version_number}/rollback", response_model=WorkflowVersionResponse)
async def rollback_to_version(
    definition_id: UUID,
    version_number: int,
    db: AsyncSession = Depends(get_db),
) -> WorkflowVersionResponse:
    """
    Rollback to a previous version.

    This creates a new version with the same BPMN XML as the target version
    and publishes it. The original version history is preserved.
    """
    definition = await get_definition_by_id(definition_id, db)

    # Get target version
    query = (
        select(WorkflowDefinitionVersion)
        .where(WorkflowDefinitionVersion.definition_id == definition_id)
        .where(WorkflowDefinitionVersion.version == version_number)
    )
    result = await db.execute(query)
    target_version = result.scalar_one_or_none()

    if target_version is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version {version_number} not found for definition {definition_id}",
        )

    # Create new version with same BPMN
    next_version = await get_next_version_number(definition_id, db)

    new_version = WorkflowDefinitionVersion(
        definition_id=definition_id,
        version=next_version,
        bpmn_xml=target_version.bpmn_xml,
        change_notes=f"Rollback to version {version_number}",
        is_active=False,
    )
    db.add(new_version)

    # Deactivate all versions and activate new one
    await db.execute(
        WorkflowDefinitionVersion.__table__.update()
        .where(WorkflowDefinitionVersion.definition_id == definition_id)
        .values(is_active=False)
    )
    new_version.is_active = True
    definition.status = "published"

    await db.commit()
    await db.refresh(new_version)

    logger.info(f"Rolled back definition {definition_id} to version {version_number} (new version {next_version})")

    return WorkflowVersionResponse.model_validate(new_version)


# =============================================================================
# ACTIVE VERSION ENDPOINT
# =============================================================================


@router.get("/{definition_id}/active", response_model=WorkflowVersionResponse)
async def get_active_version_endpoint(
    definition_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> WorkflowVersionResponse:
    """Get the currently active (published) version for a definition."""
    await get_definition_by_id(definition_id, db)  # Verify exists

    active = await get_active_version(definition_id, db)

    if active is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No active version found for definition {definition_id}",
        )

    return WorkflowVersionResponse.model_validate(active)


# =============================================================================
# VALIDATION ENDPOINT
# =============================================================================


class BpmnValidationRequest(BaseModel):
    """Request schema for BPMN validation."""

    bpmn_xml: str = Field(..., description="BPMN XML content to validate")
    process_id: str | None = Field(None, description="Optional process ID to verify exists")


class BpmnValidationResponse(BaseModel):
    """Response schema for BPMN validation."""

    valid: bool
    errors: list[str] = Field(default_factory=list)
    process_ids: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


@router.post("/validate", response_model=BpmnValidationResponse)
async def validate_bpmn(
    data: BpmnValidationRequest,
) -> BpmnValidationResponse:
    """
    Validate BPMN XML content without saving.

    This endpoint validates that the BPMN XML is well-formed and can be
    parsed by SpiffWorkflow. Optionally checks that a specific process ID exists.
    """
    from app.services.workflow_service import workflow_service

    result = workflow_service.validate_bpmn_xml(data.bpmn_xml, data.process_id)

    return BpmnValidationResponse(
        valid=result["valid"],
        errors=result["errors"],
        process_ids=result["process_ids"],
        warnings=result["warnings"],
    )
