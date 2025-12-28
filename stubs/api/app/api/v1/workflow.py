"""API endpoints for workflow POC."""

import logging
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.database import get_db
from app.models.workflow import Project, StepComment, WorkflowHistory, WorkflowInstance
from app.schemas.workflow import (
    CommentCreate,
    CommentResponse,
    DecisionAction,
    DecisionRequest,
    DecisionResponse,
    ProjectCreate,
    ProjectListResponse,
    ProjectResponse,
    WorkflowHistoryEntry,
    get_available_transitions,
    get_step_info,
    get_wfi_info,
)
from app.services.workflow_service import workflow_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/workflow", tags=["workflow"])


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================


async def get_project_by_id(
    project_id: UUID, db: AsyncSession, include_relations: bool = True
) -> Project:
    """Get a project by ID or raise 404."""
    if include_relations:
        query = (
            select(Project)
            .where(Project.id == project_id)
            .options(
                selectinload(Project.comments),
                selectinload(Project.history),
            )
        )
    else:
        query = select(Project).where(Project.id == project_id)

    result = await db.execute(query)
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    return project


def build_project_response(project: Project) -> ProjectResponse:
    """Build a full project response with workflow info."""
    # Sort comments by created_at descending (handle None and timezone-naive datetimes)
    def safe_datetime(dt):
        if dt is None:
            return datetime.min
        # Make timezone-naive for comparison if needed
        if dt.tzinfo is not None:
            return dt.replace(tzinfo=None)
        return dt

    comments = sorted(project.comments, key=lambda c: safe_datetime(c.created_at), reverse=True)
    # Sort history by created_at descending
    history = sorted(project.history, key=lambda h: safe_datetime(h.created_at), reverse=True)

    return ProjectResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        current_value_stream=project.current_value_stream,
        current_workflow_group=project.current_workflow_group,
        current_workflow_item=project.current_workflow_item,
        status=project.status,
        created_at=project.created_at,
        updated_at=project.updated_at,
        current_step=get_step_info(project.current_workflow_group),
        current_wfi=get_wfi_info(project.current_workflow_group, project.current_workflow_item),
        available_transitions=get_available_transitions(project.current_workflow_group),
        comments=[CommentResponse.model_validate(c) for c in comments],
        history=[WorkflowHistoryEntry.model_validate(h) for h in history],
    )


# =============================================================================
# PROJECT ENDPOINTS
# =============================================================================


@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    """
    Create a new project and start its workflow.

    This creates a new project, initializes a SpiffWorkflow instance,
    and sets the project to the first workflow step (WFG1: Project Kickoff).
    """
    # Create workflow instance
    instance_id, workflow, current_wfg, current_wfi = workflow_service.create_workflow_instance()

    # Create project
    project = Project(
        name=project_data.name,
        description=project_data.description,
        current_value_stream="VS4",
        current_workflow_group=current_wfg,
        current_workflow_item=current_wfi,
        workflow_instance_id=instance_id,
        status="active",
    )
    db.add(project)
    await db.flush()

    # Serialize and store workflow state
    serialized_state = workflow_service.serialize_workflow(workflow)
    workflow_instance = WorkflowInstance(
        id=instance_id,
        project_id=project.id,
        serialized_state=serialized_state,
        current_task_name=f"{current_wfg}/{current_wfi}" if current_wfi else current_wfg,
        status="running",
    )
    db.add(workflow_instance)

    # Add initial history entry
    history = WorkflowHistory(
        project_id=project.id,
        from_workflow_group=None,
        to_workflow_group=current_wfg,
        action="start",
        reason="Project created",
    )
    db.add(history)

    await db.commit()
    await db.refresh(project)

    # Reload with relations
    project = await get_project_by_id(project.id, db)

    logger.info(f"Created project {project.id} at step {current_wfg}/{current_wfi}")

    return build_project_response(project)


@router.get("/projects", response_model=list[ProjectListResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db),
) -> list[ProjectListResponse]:
    """List all projects with summary info."""
    query = select(Project).options(selectinload(Project.comments)).order_by(Project.created_at.desc())
    result = await db.execute(query)
    projects = result.scalars().all()

    return [
        ProjectListResponse(
            id=p.id,
            name=p.name,
            current_workflow_group=p.current_workflow_group,
            status=p.status,
            created_at=p.created_at,
            comment_count=len(p.comments),
        )
        for p in projects
    ]


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    """Get a project with full workflow info."""
    project = await get_project_by_id(project_id, db)
    return build_project_response(project)


# =============================================================================
# COMMENT ENDPOINTS
# =============================================================================


@router.post("/projects/{project_id}/comments", response_model=CommentResponse)
async def add_comment(
    project_id: UUID,
    comment_data: CommentCreate,
    db: AsyncSession = Depends(get_db),
) -> CommentResponse:
    """Add a comment to the project at the current step."""
    project = await get_project_by_id(project_id, db, include_relations=False)

    comment = StepComment(
        project_id=project.id,
        workflow_group=project.current_workflow_group or "unknown",
        user_name=comment_data.user_name,
        content=comment_data.content,
    )
    db.add(comment)
    await db.commit()
    await db.refresh(comment)

    logger.info(
        f"Added comment to project {project_id} at step {project.current_workflow_group}"
    )

    return CommentResponse.model_validate(comment)


@router.get("/projects/{project_id}/comments", response_model=list[CommentResponse])
async def get_comments(
    project_id: UUID,
    workflow_group: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[CommentResponse]:
    """Get comments for a project, optionally filtered by workflow group."""
    # Verify project exists
    await get_project_by_id(project_id, db, include_relations=False)

    query = (
        select(StepComment)
        .where(StepComment.project_id == project_id)
        .order_by(StepComment.created_at.desc())
    )

    if workflow_group:
        query = query.where(StepComment.workflow_group == workflow_group)

    result = await db.execute(query)
    comments = result.scalars().all()

    return [CommentResponse.model_validate(c) for c in comments]


# =============================================================================
# DECISION ENDPOINTS
# =============================================================================


@router.post("/projects/{project_id}/decision", response_model=DecisionResponse)
async def make_decision(
    project_id: UUID,
    decision: DecisionRequest,
    db: AsyncSession = Depends(get_db),
) -> DecisionResponse:
    """
    Make a workflow decision (approve, send_back, or skip_to).

    This advances the workflow based on the decision:
    - approve: Move to the next step in the normal flow
    - send_back: Return to a previous step (requires target_step and reason)
    - skip_to: Jump to a future step (requires target_step)
    """
    project = await get_project_by_id(project_id, db, include_relations=False)
    previous_wfg = project.current_workflow_group
    previous_wfi = project.current_workflow_item

    # Check if project is already completed
    if project.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project workflow is already completed",
        )

    # Load workflow instance
    wf_query = select(WorkflowInstance).where(
        WorkflowInstance.id == project.workflow_instance_id
    )
    wf_result = await db.execute(wf_query)
    wf_instance = wf_result.scalar_one_or_none()

    if wf_instance is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Workflow instance not found",
        )

    # Deserialize workflow
    workflow = workflow_service.deserialize_workflow(wf_instance.serialized_state)

    # Execute decision
    target_step = decision.target_step.value if decision.target_step else None
    target_wfi = decision.target_wfi.value if decision.target_wfi else None

    if decision.action == DecisionAction.APPROVE:
        workflow, new_wfg, new_wfi = workflow_service.approve(workflow)
        message = f"Approved: moved from {previous_wfg}/{previous_wfi} to {new_wfg}/{new_wfi}"
    elif decision.action == DecisionAction.SEND_BACK:
        workflow, new_wfg, new_wfi = workflow_service.send_back(
            workflow, target_step=target_step, target_wfi=target_wfi
        )
        if target_wfi:
            message = f"Sent back from {previous_wfg}/{previous_wfi} to {new_wfg}/{new_wfi}"
        else:
            message = f"Sent back from {previous_wfg} to {new_wfg}/{new_wfi}"
    elif decision.action == DecisionAction.SKIP_TO:
        workflow, new_wfg, new_wfi = workflow_service.skip_to(workflow, target_step)
        message = f"Skipped from {previous_wfg}/{previous_wfi} to {new_wfg}/{new_wfi}"
    elif decision.action == DecisionAction.COMPLETE_WFG:
        workflow, new_wfg, new_wfi = workflow_service.complete_wfg(workflow)
        message = f"Completed {previous_wfg}: moved to {new_wfg}/{new_wfi}"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid action: {decision.action}",
        )

    # Update project
    project.current_workflow_group = new_wfg
    project.current_workflow_item = new_wfi

    # Check if workflow is completed
    if workflow_service.is_completed(workflow):
        project.status = "completed"
        new_wfg = "End"
        new_wfi = None
        project.current_workflow_group = "End"
        project.current_workflow_item = None

    # Update workflow instance
    wf_instance.serialized_state = workflow_service.serialize_workflow(workflow)
    wf_instance.current_task_name = f"{new_wfg}/{new_wfi}" if new_wfi else new_wfg
    if workflow_service.is_completed(workflow):
        wf_instance.status = "completed"

    # Add history entry
    history = WorkflowHistory(
        project_id=project.id,
        from_workflow_group=previous_wfg,
        to_workflow_group=new_wfg,
        action=decision.action.value,
        reason=decision.reason,
    )
    db.add(history)

    await db.commit()

    # Reload project with relations
    project = await get_project_by_id(project_id, db)

    logger.info(f"Decision made: {message}")

    return DecisionResponse(
        success=True,
        message=message,
        previous_step=previous_wfg,
        current_step=new_wfg,
        project=build_project_response(project),
    )


# =============================================================================
# UTILITY ENDPOINTS
# =============================================================================


@router.get("/steps")
async def get_workflow_steps() -> dict:
    """Get all workflow step definitions."""
    from app.schemas.workflow import WORKFLOW_STEPS

    return {
        "steps": [
            {
                "id": step.id,
                "name": step.name,
                "description": step.description,
            }
            for step in WORKFLOW_STEPS.values()
        ]
    }
