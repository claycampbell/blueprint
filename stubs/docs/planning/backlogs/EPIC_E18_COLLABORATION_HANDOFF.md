# Epic E18: Collaboration & Handoff Engine - Detailed Backlog

**Epic Owner:** Full-Stack Team
**Target Phase:** Days 15-75 (Foundation + Feature Integration)
**Created:** December 1, 2025
**Status:** Ready for Sprint Planning

---

## Epic Overview

**Full Scope:** 78 points
**MVP Core (P0/P1):** 52 points
**Original Gap:** E8 (Tasks) handles assignment, but lacks formal handoff tracking

The Collaboration & Handoff Engine provides the infrastructure for tracking work transitions between teams and individuals, managing SLAs, enabling in-context communication, and ensuring visibility across the deal lifecycle.

**Business Value:**
- Reduce cross-team friction by 80% (PRD KPI target)
- Enable SLA tracking for consultant deliverables
- Provide visibility into where deals are stalled
- Support real-time collaboration without email overhead

**Why This Epic is Critical:**
- Blueprint's biggest pain point is consultant coordination
- Deals stall at handoff points between Acquisitions → Feasibility → Entitlement → Lending
- No current system tracks "who's waiting on whom"
- Without this, the "friction reduction" KPIs cannot be measured

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FEATURE LAYERS                                │
│  E4 (Projects)  E5 (Feasibility)  E6 (Entitlement)  E9 (Loans) │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│             COLLABORATION & HANDOFF ENGINE (E18)                 │
│                                                                  │
│  ┌─────────────────────┐      ┌─────────────────────┐          │
│  │   HANDOFF SYSTEM    │      │  COLLABORATION      │          │
│  │                     │      │                     │          │
│  │  • Handoff Objects  │      │  • @Mentions        │          │
│  │  • SLA Definitions  │      │  • Comment Threads  │          │
│  │  • Escalation Rules │      │  • Activity Feed    │          │
│  │  • Status Tracking  │      │  • Presence (P2)    │          │
│  └─────────────────────┘      └─────────────────────┘          │
│              │                          │                       │
│              └────────────┬─────────────┘                       │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              NOTIFICATION ENGINE                          │   │
│  │  • Email (SendGrid)  • In-App  • SMS (Twilio)  • Slack   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    E8 (Task Management)                          │
│                    E13 (Notifications)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature 1: Handoff Objects & Tracking (PRIORITY: P0)

### User Story E18-US1
**As a** team lead, **I need to** formally hand off work from one team/person to another, **so that** there's a clear record of responsibility transfer.

**Acceptance Criteria:**
- [ ] Create handoff with from_role, to_role, workflow_step, due_date
- [ ] Link handoff to entity (project, loan, task)
- [ ] Track handoff status: PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, ESCALATED
- [ ] Automatic notification to recipient on handoff creation
- [ ] Handoff appears in recipient's work queue
- [ ] Dashboard shows all pending handoffs

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E18-T1 | Design handoffs table schema | 2 | P0 | E2 |
| E18-T2 | Create handoffs database table | 2 | P0 | E18-T1 |
| E18-T3 | Implement POST `/handoffs` API | 3 | P0 | E18-T2, E3 |
| E18-T4 | Implement GET `/handoffs` with filters | 2 | P0 | E18-T2 |
| E18-T5 | Implement handoff status updates | 2 | P0 | E18-T3 |
| E18-T6 | Build Handoff Creation modal UI | 3 | P0 | E18-T3 |
| E18-T7 | Build Handoff Queue view | 5 | P0 | E18-T4 |
| E18-T8 | Trigger notification on handoff creation | 2 | P0 | E18-T3, E13 |
| E18-T9 | Unit tests for handoff service | 2 | P0 | E18-T3 |

**Subtotal:** 23 points

---

## Feature 2: SLA Definitions & Tracking (PRIORITY: P0)

### User Story E18-US2
**As a** manager, **I need to** define SLAs for different handoff types, **so that** I can track performance and identify delays.

**Acceptance Criteria:**
- [ ] Define SLA templates (e.g., "Survey delivery: 5 business days")
- [ ] Auto-assign SLA to handoffs based on type
- [ ] Track time-to-completion for each handoff
- [ ] Visual indicators: On Track (green), At Risk (yellow), Overdue (red)
- [ ] Dashboard showing SLA compliance metrics

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E18-T10 | Design sla_definitions table | 2 | P0 | E2 |
| E18-T11 | Create SLA definitions table | 2 | P0 | E18-T10 |
| E18-T12 | Implement SLA assignment logic | 2 | P0 | E18-T11, E18-T3 |
| E18-T13 | Calculate SLA status (on-track, at-risk, overdue) | 2 | P0 | E18-T12 |
| E18-T14 | Add SLA status to handoff API responses | 1 | P0 | E18-T13 |
| E18-T15 | Build SLA admin UI (define SLAs) | 3 | P1 | E18-T11 |
| E18-T16 | Display SLA status badges in handoff queue | 2 | P0 | E18-T14, E18-T7 |
| E18-T17 | SLA compliance dashboard widget | 3 | P1 | E18-T13 |

**Subtotal:** 17 points

---

## Feature 3: Escalation Engine (PRIORITY: P1)

### User Story E18-US3
**As a** manager, **I need** overdue handoffs to automatically escalate, **so that** I'm alerted to bottlenecks without manual monitoring.

**Acceptance Criteria:**
- [ ] Define escalation rules (e.g., "After 24 hours overdue, notify manager")
- [ ] Multi-tier escalation (e.g., Day 1: assignee, Day 2: manager, Day 3: director)
- [ ] Escalation notifications via email and in-app
- [ ] Track escalation history on handoff
- [ ] Manual escalation option

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E18-T18 | Design escalation_rules table | 2 | P1 | E2 |
| E18-T19 | Create escalation rules table | 2 | P1 | E18-T18 |
| E18-T20 | Implement escalation engine (cron job) | 3 | P1 | E18-T19, E18-T13 |
| E18-T21 | Send escalation notifications | 2 | P1 | E18-T20, E13 |
| E18-T22 | Track escalation history on handoff | 2 | P1 | E18-T20 |
| E18-T23 | Build escalation rules admin UI | 3 | P2 | E18-T19 |
| E18-T24 | Manual escalation button in UI | 2 | P1 | E18-T20 |

**Subtotal:** 16 points

---

## Feature 4: @Mentions & Comment Threads (PRIORITY: P1)

### User Story E18-US4
**As a** team member, **I need to** @mention colleagues in comments, **so that** they're notified and can respond in context.

**Acceptance Criteria:**
- [ ] @mention users by typing @name in comments
- [ ] Autocomplete user picker
- [ ] Mentioned users receive notification with link to context
- [ ] Comments threaded under entities (projects, tasks, handoffs)
- [ ] Edit and delete own comments

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E18-T25 | Design comments table with mention support | 2 | P1 | E2 |
| E18-T26 | Create comments table | 2 | P1 | E18-T25 |
| E18-T27 | Implement POST `/comments` with mention parsing | 3 | P1 | E18-T26, E3 |
| E18-T28 | Implement GET `/comments` for entity | 2 | P1 | E18-T26 |
| E18-T29 | Build @mention autocomplete component | 3 | P1 | E11 (contacts) |
| E18-T30 | Build Comment Thread UI component | 5 | P1 | E18-T28 |
| E18-T31 | Notify mentioned users | 2 | P1 | E18-T27, E13 |
| E18-T32 | Implement comment edit/delete | 2 | P2 | E18-T27 |

**Subtotal:** 21 points

---

## Feature 5: Activity Feed (PRIORITY: P2)

### User Story E18-US5
**As a** user, **I need to** see a feed of recent activity on entities I care about, **so that** I stay informed without checking multiple places.

**Acceptance Criteria:**
- [ ] Feed shows: handoffs, comments, status changes, document uploads
- [ ] Filter by entity type, time range
- [ ] "Following" system to subscribe to specific entities
- [ ] Unread indicator for new activity

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E18-T33 | Design activity_feed table | 2 | P2 | E2 |
| E18-T34 | Create activity feed generation triggers | 3 | P2 | E18-T33 |
| E18-T35 | Implement GET `/activity-feed` API | 2 | P2 | E18-T33 |
| E18-T36 | Build Activity Feed UI component | 5 | P2 | E18-T35 |
| E18-T37 | Implement entity "following" system | 3 | P2 | E18-T35 |
| E18-T38 | Unread tracking and indicators | 2 | P2 | E18-T35 |

**Subtotal:** 17 points

---

## Deferred Features (Phase 2)

### Feature 6: Real-time Presence (14 points)
- E18-T39 to E18-T44
- Show who's viewing/editing same entity
- WebSocket-based presence
- "Currently viewing" indicators

### Feature 7: Slack Integration (8 points)
- E18-T45 to E18-T48
- Post handoff notifications to Slack channels
- Create handoffs from Slack
- Slack bot commands

---

## Epic Summary

| Feature | Full Points | MVP Points | Phase |
|---------|-------------|------------|-------|
| Handoff Objects & Tracking | 23 | 23 | Phase 1 (Days 15-45) |
| SLA Definitions & Tracking | 17 | 14 | Phase 1 (Days 30-60) |
| Escalation Engine | 16 | 11 | Phase 1 (Days 45-75) |
| @Mentions & Comments | 21 | 17 | Phase 1 (Days 45-75) |
| Activity Feed | 17 | — | Phase 2 |
| Real-time Presence | 14 | — | Phase 2 |
| Slack Integration | 8 | — | Phase 2 |
| **TOTAL** | **116** | **65** | — |

---

## Dependencies

**Blocks:**
- E5 (Feasibility) - Consultant handoff tracking
- E6 (Entitlement) - Cross-team handoffs
- E9 (Lending) - Loan processing handoffs
- E14 (Analytics) - SLA compliance metrics

**Blocked By:**
- E2 (Core Data Model) - Database schema
- E3 (Auth) - User identification for handoffs
- E8 (Task Management) - Task-handoff integration
- E11 (Contacts) - Contact picker for mentions
- E13 (Notifications) - Email/SMS delivery

**Integration Points:**
- **E8 (Tasks):** Handoffs can create tasks automatically
- **E16 (Audit):** All handoffs logged in audit trail
- **E13 (Notifications):** All handoff events trigger notifications

---

## Database Schema

### handoffs

```sql
CREATE TABLE handoffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Handoff identification
    title VARCHAR(200) NOT NULL,
    description TEXT,

    -- What's being handed off
    entity_type VARCHAR(50) NOT NULL,  -- project, loan, task
    entity_id UUID NOT NULL,
    workflow_step VARCHAR(100),  -- e.g., "feasibility_to_entitlement"

    -- From/To
    from_user_id UUID REFERENCES users(id),
    from_role VARCHAR(50),
    to_user_id UUID REFERENCES users(id),
    to_role VARCHAR(50) NOT NULL,
    to_team VARCHAR(50),  -- Optional team assignment

    -- SLA
    sla_definition_id UUID REFERENCES sla_definitions(id),
    due_date TIMESTAMPTZ,
    sla_status VARCHAR(20) DEFAULT 'ON_TRACK',  -- ON_TRACK, AT_RISK, OVERDUE

    -- Status tracking
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    -- PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, ESCALATED, CANCELLED
    accepted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    -- Escalation
    escalation_level INT DEFAULT 0,
    last_escalated_at TIMESTAMPTZ,

    -- Metadata
    priority VARCHAR(10) DEFAULT 'MEDIUM',  -- LOW, MEDIUM, HIGH, URGENT
    tags TEXT[],

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_handoffs_to_user ON handoffs (to_user_id, status);
CREATE INDEX idx_handoffs_entity ON handoffs (entity_type, entity_id);
CREATE INDEX idx_handoffs_status ON handoffs (status, due_date);
CREATE INDEX idx_handoffs_sla_status ON handoffs (sla_status) WHERE status NOT IN ('COMPLETED', 'CANCELLED');
```

### sla_definitions

```sql
CREATE TABLE sla_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- SLA identification
    name VARCHAR(100) NOT NULL,
    description TEXT,
    workflow_step VARCHAR(100),  -- Links to specific handoff types

    -- Time limits
    warning_hours INT NOT NULL,  -- Hours before due to show "at risk"
    target_hours INT NOT NULL,   -- Target completion time
    max_hours INT NOT NULL,      -- Overdue threshold

    -- Business hours
    use_business_hours BOOLEAN DEFAULT true,
    timezone VARCHAR(50) DEFAULT 'America/Los_Angeles',

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default SLAs
INSERT INTO sla_definitions (name, workflow_step, warning_hours, target_hours, max_hours) VALUES
('Survey Delivery', 'survey_order', 96, 120, 168),  -- 4 days warning, 5 days target, 7 days max
('Title Report Delivery', 'title_order', 48, 72, 120),
('Feasibility to Entitlement', 'feasibility_to_entitlement', 8, 24, 48),
('Loan Document Review', 'loan_document_review', 4, 8, 24);
```

### escalation_rules

```sql
CREATE TABLE escalation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Rule identification
    name VARCHAR(100) NOT NULL,
    sla_definition_id UUID REFERENCES sla_definitions(id),

    -- Escalation tiers
    escalation_tier INT NOT NULL,  -- 1, 2, 3...
    hours_after_due INT NOT NULL,  -- Hours after SLA breach to escalate

    -- Who to notify
    notify_roles TEXT[],  -- ['MANAGER', 'DIRECTOR']
    notify_user_ids UUID[],

    -- Actions
    notification_template VARCHAR(100),
    create_task BOOLEAN DEFAULT false,

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### comments

```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Entity being commented on
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,

    -- Comment content
    content TEXT NOT NULL,
    mentions UUID[],  -- Array of mentioned user IDs

    -- Threading
    parent_comment_id UUID REFERENCES comments(id),

    -- Author
    author_id UUID NOT NULL REFERENCES users(id),

    -- Edit tracking
    edited_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_entity ON comments (entity_type, entity_id, created_at DESC);
CREATE INDEX idx_comments_author ON comments (author_id);
CREATE INDEX idx_comments_mentions ON comments USING GIN (mentions);
```

---

## API Endpoints

### POST /api/v1/handoffs

Create a new handoff.

**Request:**
```json
{
  "title": "Survey report ready for review",
  "entity_type": "project",
  "entity_id": "uuid-project-123",
  "workflow_step": "survey_delivery",
  "to_user_id": "uuid-user-456",
  "to_role": "ACQUISITIONS",
  "priority": "HIGH",
  "description": "Survey completed by ABC Surveyors. Please review for easements."
}
```

**Response:**
```json
{
  "id": "uuid-handoff-789",
  "title": "Survey report ready for review",
  "status": "PENDING",
  "due_date": "2025-12-06T17:00:00Z",
  "sla_status": "ON_TRACK",
  "created_at": "2025-12-01T10:30:00Z"
}
```

### GET /api/v1/handoffs

List handoffs with filters.

**Query Parameters:**
- `status` - Filter by status
- `to_user_id` - Filter by recipient
- `entity_type` - Filter by entity type
- `entity_id` - Filter by specific entity
- `sla_status` - Filter by SLA status (ON_TRACK, AT_RISK, OVERDUE)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Survey report ready for review",
      "status": "PENDING",
      "from_user": { "id": "uuid", "name": "John Smith", "role": "CONSULTANT" },
      "to_user": { "id": "uuid", "name": "Jane Doe", "role": "ACQUISITIONS" },
      "entity": { "type": "project", "id": "uuid", "name": "123 Main St" },
      "due_date": "2025-12-06T17:00:00Z",
      "sla_status": "AT_RISK",
      "created_at": "2025-12-01T10:30:00Z"
    }
  ],
  "pagination": { "total": 45, "limit": 50, "offset": 0 }
}
```

### PATCH /api/v1/handoffs/{id}

Update handoff status.

**Request:**
```json
{
  "status": "ACCEPTED"
}
```

### POST /api/v1/comments

Create a comment with @mentions.

**Request:**
```json
{
  "entity_type": "handoff",
  "entity_id": "uuid-handoff-789",
  "content": "Reviewed the survey. @john.smith can you clarify the easement on the north side?",
  "parent_comment_id": null
}
```

**Response:**
```json
{
  "id": "uuid-comment-123",
  "content": "Reviewed the survey. @john.smith can you clarify the easement on the north side?",
  "mentions": ["uuid-john-smith"],
  "author": { "id": "uuid", "name": "Jane Doe" },
  "created_at": "2025-12-01T11:00:00Z"
}
```

### GET /api/v1/sla-definitions

List SLA definitions.

---

## Notification Templates

### Handoff Created
```
Subject: [Action Required] New handoff: {handoff.title}

Hi {to_user.first_name},

{from_user.full_name} has assigned you a handoff:

**{handoff.title}**
{handoff.description}

Project: {entity.name}
Due: {handoff.due_date}
Priority: {handoff.priority}

[View Handoff]({handoff_url})
```

### Handoff Escalated
```
Subject: [ESCALATED] Overdue handoff: {handoff.title}

Hi {manager.first_name},

A handoff has been escalated due to SLA breach:

**{handoff.title}**
Assigned to: {to_user.full_name}
Due: {handoff.due_date}
Overdue by: {overdue_hours} hours

[View Handoff]({handoff_url})
```

### Mention Notification
```
Subject: {author.full_name} mentioned you in a comment

{author.full_name} mentioned you:

"{comment.content}"

On: {entity.type} - {entity.name}

[View Comment]({comment_url})
```

---

## Workflow Integration Examples

### Feasibility → Entitlement Handoff

```
1. Acquisitions marks project as GO
2. System auto-creates handoff:
   - from_role: ACQUISITIONS
   - to_role: ENTITLEMENT
   - workflow_step: "feasibility_to_entitlement"
   - SLA: 24 hours
3. Entitlement coordinator receives notification
4. Coordinator accepts handoff (status: ACCEPTED)
5. Coordinator reviews project, creates entitlement record
6. Coordinator completes handoff (status: COMPLETED)
7. System logs handoff completion time for SLA metrics
```

### Consultant Task Delivery

```
1. Entitlement creates task for surveyor
2. Surveyor uploads survey document
3. System auto-creates handoff:
   - from_role: CONSULTANT
   - to_role: ENTITLEMENT
   - entity: task (survey task)
   - SLA: per sla_definitions for "survey_delivery"
4. Entitlement reviews, approves
5. Handoff completed
```

---

## Rollout Plan

**Sprint 2 (Days 15-28):**
- E18-T1 to E18-T5: Handoff table and basic API
- E18-T10, E18-T11: SLA definitions table

**Sprint 3 (Days 29-42):**
- E18-T6 to E18-T9: Handoff UI and notifications
- E18-T12 to E18-T16: SLA tracking and display

**Sprint 4 (Days 43-56):**
- E18-T17: SLA dashboard widget
- E18-T18 to E18-T22: Escalation engine
- E18-T25 to E18-T28: Comments table and API

**Sprint 5 (Days 57-70):**
- E18-T29 to E18-T31: @Mentions UI and notifications
- Integration with E5 (Feasibility)
- Integration with E6 (Entitlement)

---

## Success Metrics (Day 90)

| Metric | Target |
|--------|--------|
| Handoffs with SLA tracking | ≥90% |
| SLA compliance rate | ≥80% |
| Average handoff completion time | Measure baseline |
| Escalations per week | Track (goal: decreasing) |
| Comments with @mentions | Track usage |
| User engagement (handoffs accepted within 4 hours) | ≥70% |

---

## File References

- [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md) - Section 2.4 Bottlenecks
- [EPIC_E8_TASK_MANAGEMENT.md](EPIC_E8_TASK_MANAGEMENT.md) - Task integration
- [EPIC_E5_FEASIBILITY_MODULE.md](EPIC_E5_FEASIBILITY_MODULE.md) - Consultant handoffs
- [INTEGRATION_SPECIFICATIONS.md](../technical/INTEGRATION_SPECIFICATIONS.md) - Notification integrations
- [DATABASE_SCHEMA.md](../technical/DATABASE_SCHEMA.md) - Add handoff tables

---

**Status:** Ready for Sprint Planning
**Priority:** HIGH - Addresses #1 pain point (cross-team friction)
**Next Steps:** Create GitHub issues, integrate with E8 planning, assign to Sprint 2-5
