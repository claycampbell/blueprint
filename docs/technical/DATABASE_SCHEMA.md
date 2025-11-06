# Connect 2.0 Database Schema

**Version:** 1.0.0
**Last Updated:** November 5, 2025
**Database:** PostgreSQL 15+

## Table of Contents

1. [Overview](#overview)
2. [Schema Diagram](#schema-diagram)
3. [Core Tables](#core-tables)
4. [Enumerated Types](#enumerated-types)
5. [Indexes](#indexes)
6. [Constraints](#constraints)
7. [Migration Strategy](#migration-strategy)

---

## Overview

### Design Principles

- **Normalized**: Third normal form (3NF) to reduce redundancy
- **JSONB for flexibility**: Use JSONB for metadata and semi-structured data
- **Soft deletes**: Preserve data history with `deleted_at` timestamp
- **Audit trail**: Track who created/updated records and when
- **Foreign keys**: Enforce referential integrity
- **Indexes**: Optimize for common query patterns

### Naming Conventions

- **Tables**: Plural, snake_case (e.g., `projects`, `loan_draws`)
- **Columns**: snake_case (e.g., `created_at`, `loan_amount`)
- **Primary Keys**: `id` (UUID)
- **Foreign Keys**: `{table_singular}_id` (e.g., `project_id`, `user_id`)
- **Timestamps**: `created_at`, `updated_at`, `deleted_at`
- **Enums**: UPPERCASE (e.g., `LEAD`, `FEASIBILITY`, `GO`)

---

## Schema Diagram

```
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│   projects  │──────→│ feasibility │       │  entitlement │
│             │       │             │       │              │
│ - id        │       │ - id        │       │ - id         │
│ - address   │       │ - project_id│       │ - project_id │
│ - status    │       │ - proforma  │       │ - status     │
│ - submitted │       │ - viability │       │ - permit_no  │
│  _by        │       └─────────────┘       └──────────────┘
│ - assigned  │              │                      │
│  _to        │              │                      │
└─────────────┘              ▼                      ▼
      │              ┌─────────────┐       ┌──────────────┐
      │              │    tasks    │       │permit_correct│
      │              │             │       │             │
      │              │ - id        │       │ - id         │
      │              │ - project_id│       │ - entitle... │
      │              │ - assigned  │       │ - feedback   │
      │              │  _to        │       └──────────────┘
      │              │ - type      │
      │              │ - status    │
      │              └─────────────┘
      │
      ▼
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│    loans    │──────→│ loan_draws  │       │loan_statements│
│             │       │             │       │              │
│ - id        │       │ - id        │       │ - id         │
│ - project_id│       │ - loan_id   │       │ - loan_id    │
│ - borrower  │       │ - draw_num  │       │ - period     │
│  _id        │       │ - requested │       │ - balance    │
│ - loan_amt  │       │ - approved  │       └──────────────┘
│ - status    │       │ - status    │
└─────────────┘       └─────────────┘
      │
      ▼
┌─────────────┐       ┌─────────────┐
│loan_guarant │       │loan_budget  │
│             │       │             │
│ - loan_id   │       │ - loan_id   │
│ - contact_id│       │ - category  │
└─────────────┘       │ - amount    │
                      └─────────────┘

┌─────────────┐       ┌─────────────┐
│  contacts   │       │  entities   │
│             │       │             │
│ - id        │       │ - id        │
│ - type      │       │ - name      │
│ - first_name│       │ - tax_id    │
│ - last_name │       └─────────────┘
│ - email     │              │
└─────────────┘              │
      │                      │
      └──────────────────────┘
              │
              ▼
      ┌─────────────┐
      │contact_ent  │
      │             │
      │ - contact_id│
      │ - entity_id │
      └─────────────┘

┌─────────────┐       ┌─────────────┐
│ documents   │       │   users     │
│             │       │             │
│ - id        │       │ - id        │
│ - project_id│       │ - email     │
│ - loan_id   │       │ - role      │
│ - type      │       │ - name      │
│ - storage   │       └─────────────┘
│  _url       │
│ - extracted │
│  _data      │
└─────────────┘
```

---

## Core Tables

### projects

Represents a potential development project from lead through closing.

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Address & Property Info
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    parcel_number VARCHAR(50),

    -- Status & Assignment
    status VARCHAR(20) NOT NULL DEFAULT 'LEAD',
    submitted_by UUID NOT NULL REFERENCES contacts(id),
    assigned_to UUID REFERENCES users(id),
    assigned_builder UUID REFERENCES contacts(id),

    -- Pricing
    purchase_price DECIMAL(12, 2),
    list_price DECIMAL(12, 2),

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT valid_status CHECK (status IN (
        'LEAD', 'FEASIBILITY', 'GO', 'PASS', 'CLOSED'
    ))
);

-- Indexes
CREATE INDEX idx_projects_status ON projects(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_city ON projects(city) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_assigned_to ON projects(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_parcel ON projects(parcel_number) WHERE parcel_number IS NOT NULL;

-- Full-text search on address
CREATE INDEX idx_projects_address_search ON projects USING gin(to_tsvector('english', address));
```

### feasibility

Feasibility analysis and due diligence for a project.

```sql
CREATE TABLE feasibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,

    -- Financial Analysis
    proforma JSONB NOT NULL DEFAULT '{}',
    viability_score DECIMAL(5, 2), -- 0-100

    -- Decision
    go_decision_date DATE,
    decision_notes TEXT,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feasibility_project ON feasibility(project_id);
CREATE INDEX idx_feasibility_score ON feasibility(viability_score DESC);
```

**Proforma JSONB Structure:**
```json
{
  "land_cost": 850000,
  "construction_cost": 450000,
  "soft_costs": 75000,
  "contingency": 50000,
  "total_cost": 1425000,
  "arv": 1650000,
  "profit": 225000,
  "roi": 0.158
}
```

### tasks

Work items assigned to users or consultants.

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Assignment
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL, -- Can be user_id or contact_id
    assigned_to_type VARCHAR(20) NOT NULL, -- 'USER' or 'CONTACT'

    -- Task Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50), -- 'SURVEY', 'TITLE', 'ARBORIST', etc.
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM',

    -- Dates
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Document Association
    document_id UUID REFERENCES documents(id),

    -- Audit
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_status CHECK (status IN (
        'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    )),
    CONSTRAINT valid_priority CHECK (priority IN (
        'LOW', 'MEDIUM', 'HIGH', 'URGENT'
    ))
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to, status);
CREATE INDEX idx_tasks_project ON tasks(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX idx_tasks_loan ON tasks(loan_id) WHERE loan_id IS NOT NULL;
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE status != 'COMPLETED';
CREATE INDEX idx_tasks_status ON tasks(status);
```

### entitlement

Entitlement and permitting tracking.

```sql
CREATE TABLE entitlement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,

    -- Plan Selection
    selected_plan_id UUID REFERENCES plan_library(id),

    -- Permit Info
    permit_number VARCHAR(50),
    submitted_date DATE,
    approved_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'PLANNING',

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_status CHECK (status IN (
        'PLANNING', 'SUBMITTED', 'UNDER_REVIEW',
        'CORRECTIONS', 'APPROVED', 'DENIED'
    ))
);

CREATE INDEX idx_entitlement_project ON entitlement(project_id);
CREATE INDEX idx_entitlement_status ON entitlement(status);
```

### permit_corrections

City correction cycles for permits.

```sql
CREATE TABLE permit_corrections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entitlement_id UUID NOT NULL REFERENCES entitlement(id) ON DELETE CASCADE,

    correction_number INT NOT NULL,
    city_feedback TEXT NOT NULL,
    action_items JSONB DEFAULT '[]',

    submitted_date DATE,
    resolved_date DATE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (entitlement_id, correction_number)
);

CREATE INDEX idx_corrections_entitlement ON permit_corrections(entitlement_id);
```

### loans

Loan origination and servicing.

```sql
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_number VARCHAR(50) NOT NULL UNIQUE,

    -- Project Association
    project_id UUID NOT NULL REFERENCES projects(id),

    -- Parties
    borrower_id UUID NOT NULL REFERENCES contacts(id),

    -- Loan Terms
    loan_amount DECIMAL(12, 2) NOT NULL,
    interest_rate DECIMAL(5, 4) NOT NULL, -- 0.0850 = 8.5%
    term_months INT NOT NULL,

    -- Dates
    closing_date DATE,
    maturity_date DATE,

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    -- Bank Assignment
    assigned_to_bank UUID REFERENCES entities(id),

    -- Budget
    budget JSONB DEFAULT '{}',

    -- Denormalized for performance
    property_address VARCHAR(500),
    current_balance DECIMAL(12, 2) DEFAULT 0,

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT valid_status CHECK (status IN (
        'PENDING', 'APPROVED', 'FUNDED', 'SERVICING',
        'PAID_OFF', 'DEFAULT', 'CANCELLED'
    )),
    CONSTRAINT positive_amount CHECK (loan_amount > 0),
    CONSTRAINT valid_rate CHECK (interest_rate >= 0 AND interest_rate <= 1)
);

CREATE INDEX idx_loans_project ON loans(project_id);
CREATE INDEX idx_loans_borrower ON loans(borrower_id);
CREATE INDEX idx_loans_status ON loans(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_loans_closing_date ON loans(closing_date DESC);
CREATE INDEX idx_loans_number ON loans(loan_number);
```

### loan_guarantors

Many-to-many relationship between loans and guarantors.

```sql
CREATE TABLE loan_guarantors (
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (loan_id, contact_id)
);

CREATE INDEX idx_guarantors_loan ON loan_guarantors(loan_id);
CREATE INDEX idx_guarantors_contact ON loan_guarantors(contact_id);
```

### loan_draws

Construction draw requests and approvals.

```sql
CREATE TABLE loan_draws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,

    draw_number INT NOT NULL,

    -- Amounts
    requested_amount DECIMAL(12, 2) NOT NULL,
    approved_amount DECIMAL(12, 2),

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    -- Inspection
    inspection_id UUID REFERENCES inspections(id),

    -- Conditions
    conditions_met BOOLEAN DEFAULT FALSE,
    conditions JSONB DEFAULT '[]',

    -- Notes
    notes TEXT,

    -- Dates
    requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_status CHECK (status IN (
        'PENDING', 'APPROVED', 'PAID', 'HELD'
    )),
    CONSTRAINT positive_amounts CHECK (
        requested_amount > 0 AND
        (approved_amount IS NULL OR approved_amount >= 0)
    ),
    UNIQUE (loan_id, draw_number)
);

CREATE INDEX idx_draws_loan ON loan_draws(loan_id, draw_number);
CREATE INDEX idx_draws_status ON loan_draws(status);
```

### inspections

Field inspections for draw approvals.

```sql
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID NOT NULL REFERENCES loans(id),
    draw_id UUID REFERENCES loan_draws(id),

    inspector_id UUID NOT NULL REFERENCES users(id),

    percent_complete DECIMAL(5, 2), -- 0.00 to 100.00
    photo_count INT DEFAULT 0,

    notes TEXT,

    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inspections_loan ON inspections(loan_id);
CREATE INDEX idx_inspections_draw ON inspections(draw_id);
CREATE INDEX idx_inspections_completed ON inspections(completed_at DESC);
```

### contacts

All external parties (agents, builders, consultants, borrowers).

```sql
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    type VARCHAR(20) NOT NULL,

    -- Personal Info
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),

    -- Contact Info
    email VARCHAR(255),
    phone VARCHAR(20),

    -- Address
    address JSONB,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT valid_type CHECK (type IN (
        'AGENT', 'BUILDER', 'CONSULTANT', 'BORROWER',
        'GUARANTOR', 'SPONSOR'
    ))
);

CREATE INDEX idx_contacts_type ON contacts(type) WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_email ON contacts(email) WHERE email IS NOT NULL;
CREATE INDEX idx_contacts_name ON contacts(last_name, first_name);
CREATE INDEX idx_contacts_search ON contacts USING gin(
    to_tsvector('english',
        COALESCE(first_name, '') || ' ' ||
        COALESCE(last_name, '') || ' ' ||
        COALESCE(company_name, '')
    )
);
```

### entities

Legal entities (LLCs, partnerships, etc.).

```sql
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50), -- 'LLC', 'PARTNERSHIP', 'CORPORATION'
    tax_id VARCHAR(20),

    state_of_formation VARCHAR(2),
    formation_date DATE,

    address JSONB,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_entities_name ON entities(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_entities_tax_id ON entities(tax_id) WHERE tax_id IS NOT NULL;
```

### contact_entities

Many-to-many relationship between contacts and entities.

```sql
CREATE TABLE contact_entities (
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,

    role VARCHAR(50), -- 'OWNER', 'MANAGER', 'MEMBER'

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (contact_id, entity_id)
);

CREATE INDEX idx_contact_entities_contact ON contact_entities(contact_id);
CREATE INDEX idx_contact_entities_entity ON contact_entities(entity_id);
```

### documents

Document storage and metadata.

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Associations
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,

    -- File Info
    filename VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100),

    storage_url TEXT NOT NULL,

    -- AI Processing
    extracted_data JSONB,
    summary TEXT,

    -- Upload Info
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Audit
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT valid_type CHECK (type IN (
        'SURVEY', 'TITLE', 'ARBORIST', 'CIVIL',
        'PROFORMA', 'PLAN', 'PERMIT', 'INSPECTION',
        'LOAN_DOC', 'STATEMENT', 'OTHER'
    ))
);

CREATE INDEX idx_documents_project ON documents(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX idx_documents_loan ON documents(loan_id) WHERE loan_id IS NOT NULL;
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_uploaded ON documents(uploaded_at DESC);
```

### users

Internal Blueprint/Datapage users.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    role VARCHAR(20) NOT NULL,

    phone VARCHAR(20),

    -- Status
    active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timestamps
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT valid_role CHECK (role IN (
        'ADMIN', 'ACQUISITIONS', 'DESIGN', 'ENTITLEMENT',
        'SERVICING', 'MANAGER'
    ))
);

CREATE UNIQUE INDEX idx_users_email ON users(LOWER(email)) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL AND active = TRUE;
```

### plan_library

Architectural plan library (~1,500 plan sets).

```sql
CREATE TABLE plan_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    plan_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,

    -- Plan Details
    bedrooms INT,
    bathrooms DECIMAL(3, 1),
    square_feet INT,
    stories INT,

    -- Requirements
    min_lot_size_sqft INT,
    required_setbacks JSONB,

    -- Files
    thumbnail_url TEXT,
    plan_files JSONB, -- Array of document IDs

    -- Metadata
    tags TEXT[], -- e.g., ['modern', 'single-family', 'narrow-lot']
    metadata JSONB DEFAULT '{}',

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plans_active ON plan_library(active);
CREATE INDEX idx_plans_bedrooms ON plan_library(bedrooms);
CREATE INDEX idx_plans_sqft ON plan_library(square_feet);
CREATE INDEX idx_plans_tags ON plan_library USING gin(tags);
```

---

## Enumerated Types

For better type safety and constraint checking:

```sql
CREATE TYPE project_status AS ENUM (
    'LEAD', 'FEASIBILITY', 'GO', 'PASS', 'CLOSED'
);

CREATE TYPE loan_status AS ENUM (
    'PENDING', 'APPROVED', 'FUNDED', 'SERVICING',
    'PAID_OFF', 'DEFAULT', 'CANCELLED'
);

CREATE TYPE task_status AS ENUM (
    'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
);

CREATE TYPE contact_type AS ENUM (
    'AGENT', 'BUILDER', 'CONSULTANT', 'BORROWER',
    'GUARANTOR', 'SPONSOR'
);

CREATE TYPE user_role AS ENUM (
    'ADMIN', 'ACQUISITIONS', 'DESIGN', 'ENTITLEMENT',
    'SERVICING', 'MANAGER'
);
```

---

## Indexes

### Performance Indexes

```sql
-- Composite indexes for common queries
CREATE INDEX idx_projects_status_city ON projects(status, city)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_loans_status_closing ON loans(status, closing_date DESC)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_tasks_assigned_status_due ON tasks(assigned_to, status, due_date)
    WHERE status != 'COMPLETED';

-- Covering index for loan list queries
CREATE INDEX idx_loans_list ON loans(status, created_at DESC)
    INCLUDE (loan_number, property_address, loan_amount, borrower_id)
    WHERE deleted_at IS NULL;
```

### Full-Text Search Indexes

```sql
-- Project address search
CREATE INDEX idx_projects_fts ON projects
    USING gin(to_tsvector('english', address || ' ' || city));

-- Contact search
CREATE INDEX idx_contacts_fts ON contacts
    USING gin(to_tsvector('english',
        COALESCE(first_name, '') || ' ' ||
        COALESCE(last_name, '') || ' ' ||
        COALESCE(company_name, '') || ' ' ||
        COALESCE(email, '')
    ));
```

---

## Constraints

### Referential Integrity

All foreign keys enforce `ON DELETE CASCADE` or `ON DELETE SET NULL` appropriately.

### Check Constraints

```sql
-- Ensure loan amounts are positive
ALTER TABLE loans ADD CONSTRAINT positive_loan_amount
    CHECK (loan_amount > 0);

-- Ensure interest rate is between 0 and 100%
ALTER TABLE loans ADD CONSTRAINT valid_interest_rate
    CHECK (interest_rate >= 0 AND interest_rate <= 1);

-- Ensure maturity date is after closing date
ALTER TABLE loans ADD CONSTRAINT valid_maturity_date
    CHECK (maturity_date > closing_date);

-- Ensure approved amount doesn't exceed requested
ALTER TABLE loan_draws ADD CONSTRAINT valid_approved_amount
    CHECK (approved_amount IS NULL OR approved_amount <= requested_amount);
```

### Unique Constraints

```sql
-- One feasibility record per project
ALTER TABLE feasibility ADD CONSTRAINT unique_project
    UNIQUE (project_id);

-- One entitlement record per project
ALTER TABLE entitlement ADD CONSTRAINT unique_project
    UNIQUE (project_id);

-- Unique loan numbers
ALTER TABLE loans ADD CONSTRAINT unique_loan_number
    UNIQUE (loan_number);

-- Unique draw numbers per loan
ALTER TABLE loan_draws ADD CONSTRAINT unique_draw_number
    UNIQUE (loan_id, draw_number);
```

---

## Migration Strategy

### Phase 1: Foundation (Days 1-30)

Create core tables:
1. `users`
2. `contacts`
3. `entities`
4. `projects`
5. `documents`
6. `tasks`

### Phase 2: Entitlement & Design (Days 31-90)

Add entitlement tables:
1. `feasibility`
2. `entitlement`
3. `permit_corrections`
4. `plan_library`

### Phase 3: Lending & Servicing (Days 91-180)

Add loan tables:
1. `loans`
2. `loan_guarantors`
3. `loan_draws`
4. `inspections`

### Migration from Legacy Systems

**From BPO (Firebase):**
```sql
-- Example migration script
INSERT INTO projects (id, address, city, state, zip, status, created_at)
SELECT
    gen_random_uuid(),
    data->>'address',
    data->>'city',
    data->>'state',
    data->>'zip',
    UPPER(data->>'status'),
    (data->>'createdAt')::timestamp
FROM bpo_export;
```

**From Connect 1.0 (Filemaker):**
```sql
-- Example loan migration
INSERT INTO loans (id, loan_number, project_id, borrower_id, ...)
SELECT ...
FROM connect_export;
```

### Data Quality Checks

```sql
-- Check for orphaned records
SELECT * FROM feasibility f
LEFT JOIN projects p ON f.project_id = p.id
WHERE p.id IS NULL;

-- Check for duplicate contacts
SELECT email, COUNT(*)
FROM contacts
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;

-- Validate referential integrity
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema = 'public';
```

---

## Appendix

### Useful Queries

**Active projects by status:**
```sql
SELECT status, COUNT(*) as count
FROM projects
WHERE deleted_at IS NULL
GROUP BY status
ORDER BY
    CASE status
        WHEN 'LEAD' THEN 1
        WHEN 'FEASIBILITY' THEN 2
        WHEN 'GO' THEN 3
        WHEN 'PASS' THEN 4
        WHEN 'CLOSED' THEN 5
    END;
```

**Loans by builder with totals:**
```sql
SELECT
    c.company_name as builder,
    COUNT(*) as loan_count,
    SUM(l.loan_amount) as total_amount
FROM loans l
JOIN projects p ON l.project_id = p.id
JOIN contacts c ON p.assigned_builder = c.id
WHERE l.status = 'SERVICING'
GROUP BY c.company_name
ORDER BY total_amount DESC;
```

**Average cycle times:**
```sql
WITH status_changes AS (
    SELECT
        project_id,
        to_status,
        changed_at,
        LAG(changed_at) OVER (PARTITION BY project_id ORDER BY changed_at) as prev_changed_at
    FROM project_status_history
)
SELECT
    to_status,
    AVG(EXTRACT(EPOCH FROM (changed_at - prev_changed_at))/86400) as avg_days
FROM status_changes
WHERE prev_changed_at IS NOT NULL
GROUP BY to_status;
```
