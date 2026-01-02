# Connect 2.0 Database Schema

**Version:** 2.0
**Last Updated:** January 2026
**Status:** Active
**Database:** PostgreSQL 16+
**Authoritative Design Reference:** [DB_SCHEMA_EXPLORATION.md](../../docs/architecture/DB_SCHEMA_EXPLORATION.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Schema Diagram](#schema-diagram)
3. [Core Tables](#core-tables)
4. [Document Management](#document-management)
5. [Access Control](#access-control)
6. [Checklist & Progress](#checklist--progress)
7. [Audit Trail](#audit-trail)
8. [Enumerated Types](#enumerated-types)
9. [Indexes](#indexes)
10. [Migration Strategy](#migration-strategy)

---

## Overview

### Design Principles

This schema implements the **Property-Centric Value Stream** model where:

1. **Property is central** - exists across the entire lifecycle (all value streams)
2. **Value Streams are lenses** - property has a STATUS for each (locked/active/complete)
3. **Documents belong to property** - tagged with VS for filtering
4. **Access is role-based** - which VS can you see, which doc categories can you manage
5. **Checklist tracks progress** - but doesn't block managers from working
6. **Gates exist between value streams** - prerequisites model workflow dependencies

### Technical Conventions

- **Tables**: Plural, snake_case (e.g., `properties`, `loan_draws`)
- **Columns**: snake_case (e.g., `created_at`, `loan_amount`)
- **Primary Keys**: `id` (UUID v7 for time-ordering)
- **Foreign Keys**: `{table_singular}_id` (e.g., `property_id`, `user_id`)
- **Timestamps**: `created_at`, `updated_at`, `deleted_at`
- **Soft Deletes**: `deleted_at` timestamp pattern
- **Audit Trail**: All tables have `created_at`, `updated_at`

### SQLAlchemy 2.0 Async Pattern

All models use SQLAlchemy 2.0 with asyncpg for async database operations:

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import UUID, String, DateTime
from datetime import datetime
import uuid

class Base(DeclarativeBase):
    pass

class Property(Base):
    __tablename__ = "properties"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=datetime.utcnow)
```

---

## Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                               PROPERTY-CENTRIC MODEL                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌─────────────────┐                                                                   │
│   │   properties    │ ◄─────── THE CENTER OF EVERYTHING                                 │
│   │   (central)     │                                                                   │
│   └────────┬────────┘                                                                   │
│            │                                                                            │
│   ┌────────┴────────┬────────────────┬─────────────────┬──────────────────┐            │
│   │                 │                │                 │                  │            │
│   ▼                 ▼                ▼                 ▼                  ▼            │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐   │
│ │property_vs_  │ │  documents   │ │property_notes│ │property_     │ │property_    │   │
│ │status        │ │              │ │              │ │assignments   │ │checklist_   │   │
│ │              │ │              │ │              │ │              │ │status       │   │
│ │(per VS)      │ │(VS tagged)   │ │(VS context)  │ │(user→prop)   │ │(per item)   │   │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └─────────────┘   │
│        │                │                                                  │           │
│        │                │                                                  │           │
│        ▼                ▼                                                  ▼           │
│ ┌──────────────┐ ┌──────────────┐                               ┌─────────────────┐   │
│ │value_streams │ │document_     │                               │checklist_items  │   │
│ │              │ │reviews       │                               │                 │   │
│ │(definitions) │ │              │                               │(per VS)         │   │
│ └──────────────┘ └──────────────┘                               └─────────────────┘   │
│        │                │                                                             │
│        │                │                                                             │
│        ▼                ▼                                                             │
│ ┌──────────────┐ ┌──────────────┐                                                     │
│ │vs_gates      │ │document_     │                                                     │
│ │(prereqs)     │ │categories    │                                                     │
│ └──────────────┘ └──────────────┘                                                     │
│                                                                                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                  ACCESS CONTROL                                         │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────────────────┐            │
│   │   users      │──────│  user_roles  │──────│        roles             │            │
│   └──────────────┘      └──────────────┘      └──────────────────────────┘            │
│                                                       │                                │
│                              ┌────────────────────────┴────────────────────┐           │
│                              │                                             │           │
│                              ▼                                             ▼           │
│                    ┌──────────────────────┐               ┌──────────────────────┐    │
│                    │role_vs_access        │               │role_doc_category_    │    │
│                    │(which VS can see)    │               │access                │    │
│                    └──────────────────────┘               │(upload/review/approve)│   │
│                                                           └──────────────────────┘    │
│                                                                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Tables

### properties

The central entity - everything else relates to it. Exists across entire lifecycle.

```sql
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- External Reference
    external_id VARCHAR(50),  -- Legacy system ID (BPO, Connect 1.0)

    -- Address & Location
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    parcel_number VARCHAR(50),
    jurisdiction VARCHAR(100),  -- City/County for permitting

    -- Metadata (flexible JSONB for property-specific data)
    metadata JSONB DEFAULT '{}',

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_properties_address ON properties USING gin(to_tsvector('english', address || ' ' || city));
CREATE INDEX idx_properties_jurisdiction ON properties(jurisdiction) WHERE deleted_at IS NULL;
CREATE INDEX idx_properties_parcel ON properties(parcel_number) WHERE parcel_number IS NOT NULL;
CREATE INDEX idx_properties_external ON properties(external_id) WHERE external_id IS NOT NULL;
```

### value_streams

Defines the workflow stages (lenses) through which properties are viewed.

```sql
CREATE TABLE value_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    key VARCHAR(20) NOT NULL UNIQUE,  -- VS1, VS2, etc.
    name VARCHAR(100) NOT NULL,        -- "Lead Intake", "Feasibility", etc.
    description TEXT,
    position INT NOT NULL,             -- Display order

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed data
INSERT INTO value_streams (key, name, position) VALUES
    ('VS1', 'Lead Intake', 1),
    ('VS2', 'Feasibility', 2),
    ('VS3', 'Acquisition', 3),
    ('VS4', 'Design', 4),
    ('VS5', 'Underwriting', 5),
    ('VS6', 'Construction', 6),
    ('VS7', 'Closeout', 7);
```

### property_value_stream_status

Tracks each property's status within each value stream. Key table for the property-centric model.

```sql
CREATE TABLE property_value_stream_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    value_stream_id UUID NOT NULL REFERENCES value_streams(id),

    status VARCHAR(20) NOT NULL DEFAULT 'locked',  -- locked, active, complete
    progress_pct INT DEFAULT 0,                    -- 0-100, derived from checklist

    started_at TIMESTAMP WITH TIME ZONE,           -- When became active
    completed_at TIMESTAMP WITH TIME ZONE,         -- When marked complete
    completed_by_id UUID REFERENCES users(id),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (property_id, value_stream_id),
    CONSTRAINT valid_status CHECK (status IN ('locked', 'active', 'complete')),
    CONSTRAINT valid_progress CHECK (progress_pct >= 0 AND progress_pct <= 100)
);

CREATE INDEX idx_pvss_property ON property_value_stream_status(property_id);
CREATE INDEX idx_pvss_status ON property_value_stream_status(status);
```

### value_stream_gates

Defines prerequisites between value streams (when VS4 can unlock based on VS3 completion).

```sql
CREATE TABLE value_stream_gates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    value_stream_id UUID NOT NULL REFERENCES value_streams(id),
    prerequisite_vs_id UUID NOT NULL REFERENCES value_streams(id),

    gate_type VARCHAR(20) DEFAULT 'complete',  -- complete, manual_override

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (value_stream_id, prerequisite_vs_id)
);

-- Example: VS4 (Design) requires VS3 (Acquisition) to be complete
-- VS5 (Underwriting) can run parallel with VS4
-- VS6 (Construction) requires both VS4 and VS5
```

---

## Document Management

### documents

Documents belong to property, tagged with value stream for filtering.

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Parent relationships
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    value_stream_id UUID NOT NULL REFERENCES value_streams(id),
    category_id UUID NOT NULL REFERENCES document_categories(id),

    -- File info
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,  -- S3 key
    mime_type VARCHAR(100),
    size_bytes BIGINT,

    -- Version control
    version INT NOT NULL DEFAULT 1,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,

    -- Status workflow
    status VARCHAR(30) NOT NULL DEFAULT 'uploaded',

    -- AI processing results
    extracted_data JSONB,
    summary TEXT,

    -- Audit
    uploaded_by_id UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT valid_status CHECK (status IN (
        'uploaded', 'pending_review', 'approved', 'needs_revision', 'rejected'
    ))
);

CREATE INDEX idx_docs_property ON documents(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_docs_vs ON documents(value_stream_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_docs_category ON documents(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_docs_status ON documents(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_docs_current ON documents(property_id, is_current) WHERE is_current = TRUE;
```

### document_categories

Categories for organizing documents (floor plan, civil, rendering, etc.).

```sql
CREATE TABLE document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    key VARCHAR(50) NOT NULL UNIQUE,   -- FLOOR_PLAN, CIVIL, SURVEY, etc.
    name VARCHAR(100) NOT NULL,
    description TEXT,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed categories
INSERT INTO document_categories (key, name) VALUES
    ('SURVEY', 'Survey'),
    ('TITLE', 'Title Report'),
    ('ARBORIST', 'Arborist Report'),
    ('CIVIL', 'Civil Engineering'),
    ('FLOOR_PLAN', 'Floor Plan'),
    ('SITE_PLAN', 'Site Plan'),
    ('RENDERING', '3D Rendering'),
    ('STRUCTURAL', 'Structural Calculations'),
    ('PERMIT', 'Permit Documents'),
    ('INSPECTION', 'Inspection Reports'),
    ('LOAN_DOC', 'Loan Documents'),
    ('PROFORMA', 'Proforma/Financials'),
    ('OTHER', 'Other');
```

### document_reviews

Track reviews/approvals on documents.

```sql
CREATE TABLE document_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id),

    decision VARCHAR(20) NOT NULL,  -- approved, needs_revision, rejected
    comments TEXT,

    reviewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_decision CHECK (decision IN ('approved', 'needs_revision', 'rejected'))
);

CREATE INDEX idx_reviews_document ON document_reviews(document_id);
CREATE INDEX idx_reviews_reviewer ON document_reviews(reviewer_id);
```

---

## Access Control

### users

Internal Blueprint/Datapage users.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    phone VARCHAR(20),

    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timestamps
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX idx_users_email ON users(LOWER(email)) WHERE deleted_at IS NULL;
```

### roles

Role definitions with department and level.

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    key VARCHAR(50) NOT NULL UNIQUE,      -- ADMIN, DESIGN_MANAGER, etc.
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50),               -- ACQUISITIONS, DESIGN, SERVICING
    level INT NOT NULL DEFAULT 1,         -- 1=worker, 2=manager, 3=admin

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed roles
INSERT INTO roles (key, name, department, level) VALUES
    ('ADMIN', 'Administrator', NULL, 3),
    ('ACQ_MANAGER', 'Acquisitions Manager', 'ACQUISITIONS', 2),
    ('ACQ_ANALYST', 'Acquisitions Analyst', 'ACQUISITIONS', 1),
    ('DESIGN_MANAGER', 'Design Manager', 'DESIGN', 2),
    ('DESIGN_COORD', 'Design Coordinator', 'DESIGN', 1),
    ('ENTITLE_MANAGER', 'Entitlement Manager', 'ENTITLEMENT', 2),
    ('ENTITLE_COORD', 'Entitlement Coordinator', 'ENTITLEMENT', 1),
    ('SERVICING_MANAGER', 'Servicing Manager', 'SERVICING', 2),
    ('LOAN_OFFICER', 'Loan Officer', 'SERVICING', 1);
```

### user_roles

Many-to-many between users and roles.

```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id),

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
```

### role_value_stream_access

Defines which value streams each role can access.

```sql
CREATE TABLE role_value_stream_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    value_stream_id UUID NOT NULL REFERENCES value_streams(id),

    access_level VARCHAR(20) NOT NULL,  -- read, write, manage

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (role_id, value_stream_id),
    CONSTRAINT valid_access CHECK (access_level IN ('read', 'write', 'manage'))
);
```

### role_document_category_access

Defines document category permissions per role.

```sql
CREATE TABLE role_document_category_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES document_categories(id),

    can_upload BOOLEAN NOT NULL DEFAULT FALSE,
    can_review BOOLEAN NOT NULL DEFAULT FALSE,
    can_approve BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (role_id, category_id)
);
```

### property_assignments

Assigns users to properties (optionally scoped to value stream).

```sql
CREATE TABLE property_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    value_stream_id UUID REFERENCES value_streams(id),  -- NULL = all VS

    assigned_by_id UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assignments_property ON property_assignments(property_id) WHERE is_active = TRUE;
CREATE INDEX idx_assignments_user ON property_assignments(user_id) WHERE is_active = TRUE;
```

---

## Checklist & Progress

### checklist_items

Template items per value stream (what needs to be done).

```sql
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    value_stream_id UUID NOT NULL REFERENCES value_streams(id),

    key VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    position INT NOT NULL,

    -- How is completion determined?
    completion_type VARCHAR(20) NOT NULL,  -- manual, document_approved, auto
    completion_config JSONB DEFAULT '{}',  -- Category required, etc.

    is_required BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (value_stream_id, key)
);

CREATE INDEX idx_checklist_vs ON checklist_items(value_stream_id);
```

### property_checklist_status

Tracks completion of checklist items per property.

```sql
CREATE TABLE property_checklist_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    checklist_item_id UUID NOT NULL REFERENCES checklist_items(id),

    is_complete BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by_id UUID REFERENCES users(id),

    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (property_id, checklist_item_id)
);

CREATE INDEX idx_pcs_property ON property_checklist_status(property_id);
CREATE INDEX idx_pcs_complete ON property_checklist_status(is_complete);
```

---

## Audit Trail

### property_notes

Notes attached to properties with VS context.

```sql
CREATE TABLE property_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    value_stream_id UUID REFERENCES value_streams(id),  -- NULL = general

    author_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,

    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notes_property ON property_notes(property_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notes_pinned ON property_notes(property_id, is_pinned) WHERE is_pinned = TRUE;
```

### audit_log

Comprehensive audit trail for compliance.

```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- What was affected
    property_id UUID REFERENCES properties(id),
    value_stream_id UUID REFERENCES value_streams(id),
    entity_type VARCHAR(50) NOT NULL,   -- property, document, checklist, etc.
    entity_id UUID NOT NULL,

    -- Who did it
    actor_id UUID REFERENCES users(id),

    -- What happened
    action VARCHAR(50) NOT NULL,        -- created, updated, deleted, approved, etc.
    changes JSONB,                      -- Old/new values

    -- Metadata
    ip_address INET,
    user_agent TEXT,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_property ON audit_log(property_id);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);
```

---

## Enumerated Types

```sql
-- For cleaner constraints (optional, can use CHECK constraints instead)
CREATE TYPE property_vs_status AS ENUM ('locked', 'active', 'complete');
CREATE TYPE document_status AS ENUM ('uploaded', 'pending_review', 'approved', 'needs_revision', 'rejected');
CREATE TYPE review_decision AS ENUM ('approved', 'needs_revision', 'rejected');
CREATE TYPE access_level AS ENUM ('read', 'write', 'manage');
CREATE TYPE completion_type AS ENUM ('manual', 'document_approved', 'auto');
```

---

## Indexes

### Performance Indexes

```sql
-- Property searches
CREATE INDEX idx_properties_search ON properties
    USING gin(to_tsvector('english', address || ' ' || city || ' ' || COALESCE(jurisdiction, '')));

-- Active properties per value stream
CREATE INDEX idx_pvss_active ON property_value_stream_status(value_stream_id, status)
    WHERE status = 'active';

-- Documents pending review
CREATE INDEX idx_docs_pending ON documents(status, created_at DESC)
    WHERE status = 'pending_review' AND deleted_at IS NULL;

-- User's assigned properties
CREATE INDEX idx_assignments_user_active ON property_assignments(user_id, property_id)
    WHERE is_active = TRUE;
```

---

## Migration Strategy

### Phase 1: Foundation (Days 1-30)

1. `users`, `roles`, `user_roles`
2. `properties`
3. `value_streams`, `value_stream_gates`
4. `property_value_stream_status`
5. `document_categories`, `documents`
6. `property_notes`, `audit_log`

### Phase 2: Access Control (Days 31-60)

1. `role_value_stream_access`
2. `role_document_category_access`
3. `property_assignments`
4. `document_reviews`

### Phase 3: Progress Tracking (Days 61-90)

1. `checklist_items`
2. `property_checklist_status`

### Alembic Migration Example

```python
# alembic/versions/001_initial_schema.py
"""Initial schema with property-centric model."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    # Create properties table
    op.create_table(
        'properties',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('address', sa.String(255), nullable=False),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('state', sa.String(2), nullable=False),
        sa.Column('zip', sa.String(10), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # ... continue with other tables

def downgrade():
    op.drop_table('properties')
```

---

## Related Documents

- [DB_SCHEMA_EXPLORATION.md](../../docs/architecture/DB_SCHEMA_EXPLORATION.md) - Property-centric design exploration
- [TECH_STACK_DECISIONS.md](../../docs/architecture/TECH_STACK_DECISIONS.md) - Technology choices
- [SYSTEM_ARCHITECTURE.md](../../docs/architecture/SYSTEM_ARCHITECTURE.md) - Overall architecture

---

## Change Log

| Date | Version | Change |
|------|---------|--------|
| January 2026 | 2.0 | Property-centric value stream model, SQLAlchemy 2.0 async |
| November 2025 | 1.0 | Initial schema based on PRD requirements |
