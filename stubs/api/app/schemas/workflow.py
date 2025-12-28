"""Pydantic schemas for workflow API."""

from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field


# =============================================================================
# ENUMS
# =============================================================================


class DecisionAction(str, Enum):
    """Valid decision actions for workflow transitions."""

    APPROVE = "approve"
    SEND_BACK = "send_back"
    SKIP_TO = "skip_to"
    COMPLETE_WFG = "complete_wfg"  # Skip remaining WFIs and complete current WFG


class WorkflowGroupId(str, Enum):
    """Valid workflow group identifiers for VS4 POC."""

    WFG1 = "WFG1"  # Project Kickoff
    WFG2 = "WFG2"  # Schematic Design
    WFG3 = "WFG3"  # Construction Docs


class WorkflowItemId(str, Enum):
    """Valid workflow item identifiers."""

    WFI1 = "WFI1"
    WFI2 = "WFI2"


class ProjectStatus(str, Enum):
    """Project status values."""

    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# =============================================================================
# REQUEST SCHEMAS
# =============================================================================


class ProjectCreate(BaseModel):
    """Request schema for creating a new project."""

    name: str = Field(..., min_length=1, max_length=255, description="Project name")
    description: str | None = Field(None, description="Project description")


class CommentCreate(BaseModel):
    """Request schema for adding a comment."""

    content: str = Field(..., min_length=1, description="Comment content")
    user_name: str = Field(default="POC User", description="User name")


class DecisionRequest(BaseModel):
    """Request schema for making a workflow decision."""

    action: DecisionAction = Field(
        ..., description="Decision action (approve, send_back, skip_to, complete_wfg)"
    )
    target_step: WorkflowGroupId | None = Field(
        None, description="Target WFG for send_back/skip_to at WFG level"
    )
    target_wfi: WorkflowItemId | None = Field(
        None, description="Target WFI for send_back within current WFG"
    )
    reason: str | None = Field(None, description="Reason for the decision (required for send_back)")

    def model_post_init(self, __context: object) -> None:
        """Validate that targets are provided when needed."""
        # skip_to requires target_step (WFG level)
        if self.action == DecisionAction.SKIP_TO and self.target_step is None:
            msg = "target_step is required for skip_to action"
            raise ValueError(msg)

        # send_back requires either target_step (to different WFG) or target_wfi (within same WFG)
        if self.action == DecisionAction.SEND_BACK:
            if self.target_step is None and self.target_wfi is None:
                msg = "Either target_step or target_wfi is required for send_back action"
                raise ValueError(msg)


# =============================================================================
# RESPONSE SCHEMAS
# =============================================================================


class WorkflowItemInfo(BaseModel):
    """Information about a workflow item within a workflow group."""

    id: str = Field(..., description="WFI ID (e.g., WFI1)")
    name: str = Field(..., description="WFI name (e.g., Initial Project Review)")


class WorkflowStepInfo(BaseModel):
    """Information about a workflow step (WFG)."""

    id: str = Field(..., description="Step ID (e.g., WFG1)")
    name: str = Field(..., description="Step name (e.g., Project Kickoff)")
    description: str | None = Field(None, description="Step description")
    workflow_items: list[WorkflowItemInfo] = Field(
        default_factory=list, description="WFIs within this WFG"
    )


class AvailableTransitions(BaseModel):
    """Available transitions from current step."""

    can_approve: bool = Field(True, description="Can approve to move forward")
    approve_target: WorkflowStepInfo | None = Field(
        None, description="Target step when approving"
    )
    can_send_back: bool = Field(False, description="Can send back to previous step")
    send_back_targets: list[WorkflowStepInfo] = Field(
        default_factory=list, description="Valid send back targets"
    )
    can_skip_to: bool = Field(False, description="Can skip to a future step")
    skip_to_targets: list[WorkflowStepInfo] = Field(
        default_factory=list, description="Valid skip targets"
    )


class CommentResponse(BaseModel):
    """Response schema for a comment."""

    id: UUID
    workflow_group: str
    user_name: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class WorkflowHistoryEntry(BaseModel):
    """Response schema for a workflow history entry."""

    id: UUID
    from_workflow_group: str | None
    to_workflow_group: str | None
    action: str
    reason: str | None
    decision_maker_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectResponse(BaseModel):
    """Response schema for a project."""

    id: UUID
    name: str
    description: str | None
    current_value_stream: str
    current_workflow_group: str | None
    current_workflow_item: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    # Current step details
    current_step: WorkflowStepInfo | None = None
    current_wfi: WorkflowItemInfo | None = None
    available_transitions: AvailableTransitions | None = None

    # Related data
    comments: list[CommentResponse] = Field(default_factory=list)
    history: list[WorkflowHistoryEntry] = Field(default_factory=list)

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    """Response schema for project list."""

    id: UUID
    name: str
    current_workflow_group: str | None
    status: str
    created_at: datetime
    comment_count: int = 0

    class Config:
        from_attributes = True


class DecisionResponse(BaseModel):
    """Response schema for a decision action."""

    success: bool
    message: str
    previous_step: str | None
    current_step: str | None
    project: ProjectResponse


# =============================================================================
# WORKFLOW STEP DEFINITIONS (Static data for POC)
# =============================================================================

WORKFLOW_STEPS: dict[str, WorkflowStepInfo] = {
    "WFG1": WorkflowStepInfo(
        id="WFG1",
        name="Project Kickoff",
        description="Initial project setup and planning. Review project requirements and establish baseline.",
        workflow_items=[
            WorkflowItemInfo(id="WFI1", name="Initial Project Review"),
            WorkflowItemInfo(id="WFI2", name="Kickoff Meeting"),
        ],
    ),
    "WFG2": WorkflowStepInfo(
        id="WFG2",
        name="Schematic Design",
        description="Create initial design concepts. Develop architectural plans and 3D visualizations.",
        workflow_items=[
            WorkflowItemInfo(id="WFI1", name="Design Development"),
            WorkflowItemInfo(id="WFI2", name="Design Review"),
        ],
    ),
    "WFG3": WorkflowStepInfo(
        id="WFG3",
        name="Construction Docs",
        description="Finalize construction documentation. Complete blueprints and engineering specs.",
        workflow_items=[
            WorkflowItemInfo(id="WFI1", name="Final Documentation"),
        ],
    ),
    "End": WorkflowStepInfo(
        id="End",
        name="Complete",
        description="VS4 Design & Entitlement complete. Ready for VS5 Underwriting.",
        workflow_items=[],
    ),
}


def get_step_info(step_id: str | None) -> WorkflowStepInfo | None:
    """Get step info by ID."""
    if step_id is None:
        return None
    return WORKFLOW_STEPS.get(step_id)


def get_wfi_info(wfg_id: str | None, wfi_id: str | None) -> WorkflowItemInfo | None:
    """Get WFI info by WFG and WFI IDs."""
    if wfg_id is None or wfi_id is None:
        return None
    step = WORKFLOW_STEPS.get(wfg_id)
    if step is None:
        return None
    for wfi in step.workflow_items:
        if wfi.id == wfi_id:
            return wfi
    return None


def get_available_transitions(current_step: str | None) -> AvailableTransitions:
    """Get available transitions from current step."""
    if current_step is None:
        return AvailableTransitions()

    if current_step == "WFG1":
        return AvailableTransitions(
            can_approve=True,
            approve_target=WORKFLOW_STEPS["WFG2"],
            can_send_back=False,
            send_back_targets=[],
            can_skip_to=True,
            skip_to_targets=[WORKFLOW_STEPS["WFG3"]],
        )
    elif current_step == "WFG2":
        return AvailableTransitions(
            can_approve=True,
            approve_target=WORKFLOW_STEPS["WFG3"],
            can_send_back=True,
            send_back_targets=[WORKFLOW_STEPS["WFG1"]],
            can_skip_to=False,
            skip_to_targets=[],
        )
    elif current_step == "WFG3":
        return AvailableTransitions(
            can_approve=True,
            approve_target=WORKFLOW_STEPS["End"],
            can_send_back=True,
            send_back_targets=[WORKFLOW_STEPS["WFG2"]],
            can_skip_to=False,
            skip_to_targets=[],
        )

    return AvailableTransitions()


# =============================================================================
# WORKFLOW DEFINITION SCHEMAS
# =============================================================================


class DefinitionStatus(str, Enum):
    """Workflow definition status values."""

    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class WorkflowDefinitionCreate(BaseModel):
    """Request schema for creating a workflow definition."""

    name: str = Field(..., min_length=1, max_length=255, description="Definition name")
    description: str | None = Field(None, description="Definition description")
    process_id: str = Field(
        ..., min_length=1, max_length=255, description="BPMN process ID"
    )
    bpmn_xml: str = Field(..., min_length=1, description="Initial BPMN XML content")
    change_notes: str | None = Field(None, description="Notes for initial version")


class WorkflowDefinitionUpdate(BaseModel):
    """Request schema for updating a workflow definition metadata."""

    name: str | None = Field(None, min_length=1, max_length=255, description="Definition name")
    description: str | None = Field(None, description="Definition description")
    status: DefinitionStatus | None = Field(None, description="Definition status")


class WorkflowVersionCreate(BaseModel):
    """Request schema for creating a new version of a workflow definition."""

    bpmn_xml: str = Field(..., min_length=1, description="BPMN XML content")
    change_notes: str | None = Field(None, description="Notes describing the changes")
    publish: bool = Field(False, description="Set to true to publish this version immediately")


class WorkflowVersionResponse(BaseModel):
    """Response schema for a workflow definition version."""

    id: UUID
    definition_id: UUID
    version: int
    bpmn_xml: str
    change_notes: str | None
    is_active: bool
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class WorkflowDefinitionResponse(BaseModel):
    """Response schema for a workflow definition."""

    id: UUID
    name: str
    description: str | None
    process_id: str
    status: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    active_version: WorkflowVersionResponse | None = None
    version_count: int = 0

    class Config:
        from_attributes = True


class WorkflowDefinitionListResponse(BaseModel):
    """Response schema for workflow definition list item."""

    id: UUID
    name: str
    description: str | None
    process_id: str
    status: str
    created_by: str
    created_at: datetime
    active_version_number: int | None = None
    version_count: int = 0

    class Config:
        from_attributes = True


class WorkflowDefinitionDetailResponse(BaseModel):
    """Response schema for workflow definition with all versions."""

    id: UUID
    name: str
    description: str | None
    process_id: str
    status: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    versions: list[WorkflowVersionResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True
