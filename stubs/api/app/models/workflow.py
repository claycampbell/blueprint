"""SQLAlchemy models for workflow POC."""

import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class WorkflowDefinition(Base):
    """BPMN workflow definition template (parent container for versions)."""

    __tablename__ = "workflow_definitions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    process_id: Mapped[str] = mapped_column(
        String(255), nullable=False
    )  # BPMN process ID like "VS4_DesignEntitlement_POC"
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="draft"
    )  # draft, published, archived
    created_by: Mapped[str] = mapped_column(String(255), nullable=False, default="system")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    versions: Mapped[list["WorkflowDefinitionVersion"]] = relationship(
        back_populates="definition", cascade="all, delete-orphan", order_by="desc(WorkflowDefinitionVersion.version)"
    )
    projects: Mapped[list["Project"]] = relationship(back_populates="workflow_definition")
    workflow_instances: Mapped[list["WorkflowInstance"]] = relationship(
        back_populates="workflow_definition"
    )

    __table_args__ = (
        Index("idx_workflow_def_status", "status"),
        Index("idx_workflow_def_process_id", "process_id"),
    )


class WorkflowDefinitionVersion(Base):
    """Version history for workflow definitions with full BPMN XML."""

    __tablename__ = "workflow_definition_versions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    definition_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("workflow_definitions.id", ondelete="CASCADE")
    )
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    bpmn_xml: Mapped[str] = mapped_column(Text, nullable=False)
    change_notes: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_by: Mapped[str] = mapped_column(String(255), nullable=False, default="system")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    definition: Mapped[WorkflowDefinition] = relationship(back_populates="versions")

    __table_args__ = (
        Index("idx_wf_version_definition", "definition_id"),
        Index("idx_wf_version_active", "definition_id", "is_active"),
        Index("idx_wf_version_unique", "definition_id", "version", unique=True),
    )


class Project(Base):
    """Main entity being worked on (a property in the real system)."""

    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    # Current workflow position (denormalized for quick queries)
    current_value_stream: Mapped[str] = mapped_column(String(50), default="VS4")
    current_workflow_group: Mapped[str | None] = mapped_column(String(50))
    current_workflow_item: Mapped[str | None] = mapped_column(String(50))

    # Link to workflow engine
    workflow_instance_id: Mapped[str | None] = mapped_column(String(255))
    workflow_definition_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("workflow_definitions.id")
    )

    # Status
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="active")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    workflow_definition: Mapped[WorkflowDefinition | None] = relationship(
        back_populates="projects"
    )
    comments: Mapped[list["StepComment"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    history: Mapped[list["WorkflowHistory"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("idx_projects_status", "status"),
        Index("idx_projects_current_wfg", "current_workflow_group"),
    )


class WorkflowInstance(Base):
    """Stores SpiffWorkflow serialized state."""

    __tablename__ = "workflow_instances"

    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE")
    )
    workflow_definition_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("workflow_definitions.id")
    )

    # SpiffWorkflow serialized state (JSON)
    serialized_state: Mapped[dict] = mapped_column(JSON, nullable=False)

    # Quick lookup fields
    current_task_id: Mapped[str | None] = mapped_column(String(255))
    current_task_name: Mapped[str | None] = mapped_column(String(255))

    # Status
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="running")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    workflow_definition: Mapped[WorkflowDefinition | None] = relationship(
        back_populates="workflow_instances"
    )

    __table_args__ = (
        Index("idx_workflow_instances_project", "project_id"),
        Index("idx_workflow_instances_status", "status"),
    )


class StepComment(Base):
    """Comments added at each workflow step."""

    __tablename__ = "step_comments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE")
    )
    workflow_group: Mapped[str] = mapped_column(String(50), nullable=False)
    workflow_item: Mapped[str | None] = mapped_column(String(50))

    # Comment data
    user_id: Mapped[str] = mapped_column(String(255), nullable=False, default="poc_user")
    user_name: Mapped[str] = mapped_column(String(255), nullable=False, default="POC User")
    content: Mapped[str] = mapped_column(Text, nullable=False)

    # Metadata
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    project: Mapped[Project] = relationship(back_populates="comments")

    __table_args__ = (
        Index("idx_step_comments_project", "project_id"),
        Index("idx_step_comments_wfg", "workflow_group"),
    )


class WorkflowHistory(Base):
    """Audit trail of workflow transitions."""

    __tablename__ = "workflow_history"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE")
    )

    # Transition details
    from_workflow_group: Mapped[str | None] = mapped_column(String(50))
    to_workflow_group: Mapped[str | None] = mapped_column(String(50))
    action: Mapped[str] = mapped_column(String(50), nullable=False)  # approve, send_back, skip_to
    reason: Mapped[str | None] = mapped_column(Text)

    # Who made the decision
    decision_maker_id: Mapped[str] = mapped_column(
        String(255), nullable=False, default="poc_user"
    )
    decision_maker_name: Mapped[str] = mapped_column(
        String(255), nullable=False, default="POC User"
    )

    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    # Relationships
    project: Mapped[Project] = relationship(back_populates="history")

    __table_args__ = (Index("idx_workflow_history_project", "project_id"),)
