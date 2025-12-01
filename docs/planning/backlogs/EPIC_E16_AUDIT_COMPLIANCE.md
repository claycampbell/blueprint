# Epic E16: Audit, Compliance & Governance Layer - Detailed Backlog

**Epic Owner:** Platform / Infrastructure Team
**Target Phase:** Days 1-45 (Foundation Layer)
**Created:** December 1, 2025
**Status:** Ready for Sprint Planning

---

## Epic Overview

**Full Scope:** 58 points
**MVP Core (P0/P1):** 42 points
**Original Gap:** Not in initial roadmap - identified as architectural gap

The Audit, Compliance & Governance Layer provides the foundational infrastructure for tracking all system changes, maintaining regulatory compliance, and enabling accountability across Connect 2.0.

**Business Value:**
- Maintain Blueprint's zero-default track record with auditable decision history
- Meet 7-year data retention requirements for construction lending
- Enable compliance exports for regulatory audits
- Support future SOC 2 / ISO 27001 certification

**Why This Epic is Critical:**
- Construction lending is regulated - every loan decision needs audit trail
- Blueprint's competitive advantage is risk management - needs provable history
- Without this foundation, compliance becomes emergency engineering later
- PII handling rules required for GDPR/CCPA compliance

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  (E4, E5, E6, E8, E9, E10, E11 - All Feature Epics)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 AUDIT MIDDLEWARE LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Change      │  │ Access      │  │ Event       │             │
│  │ Interceptor │  │ Logger      │  │ Dispatcher  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 AUDIT STORAGE LAYER                              │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │  audit_events           │  │  compliance_exports     │      │
│  │  (Append-only table)    │  │  (Generated reports)    │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature 1: Audit Event Infrastructure (PRIORITY: P0)

### User Story E16-US1
**As a** compliance officer, **I need** every data change to be logged immutably, **so that** I can trace any decision back to who made it and when.

**Acceptance Criteria:**
- [ ] All CRUD operations on core entities generate audit events
- [ ] Audit events are immutable (append-only, no UPDATE/DELETE)
- [ ] Events include: entity_type, entity_id, action, actor, timestamp, before/after state
- [ ] Events stored with microsecond precision timestamps
- [ ] Audit log queryable by entity, actor, time range

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E16-T1 | Design audit_events table schema (append-only) | 2 | P0 | E2 |
| E16-T2 | Create audit_events table with partitioning | 3 | P0 | E16-T1 |
| E16-T3 | Implement AuditService class | 3 | P0 | E16-T2 |
| E16-T4 | Create audit middleware for Express/API routes | 3 | P0 | E16-T3, E3 |
| E16-T5 | Implement before/after state capture | 3 | P0 | E16-T4 |
| E16-T6 | Add audit hooks to ORM (Knex/Prisma) | 3 | P0 | E16-T4 |
| E16-T7 | Unit tests for AuditService | 2 | P0 | E16-T3 |
| E16-T8 | Integration tests for audit middleware | 2 | P1 | E16-T6 |

**Subtotal:** 21 points

---

## Feature 2: Audit Query & Retrieval (PRIORITY: P0)

### User Story E16-US2
**As an** admin user, **I need to** query the audit log to see what changes were made to any record, **so that** I can investigate issues and verify compliance.

**Acceptance Criteria:**
- [ ] GET `/audit/events` endpoint with filters (entity, actor, date range)
- [ ] Pagination support for large result sets
- [ ] Include human-readable action descriptions
- [ ] Response time < 500ms for queries within 90-day window
- [ ] Support for entity-specific audit history (e.g., `/projects/{id}/audit`)

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E16-T9 | Implement GET `/audit/events` API endpoint | 3 | P0 | E16-T2 |
| E16-T10 | Add query filters (entity_type, entity_id, actor_id, date range) | 2 | P0 | E16-T9 |
| E16-T11 | Implement pagination for audit queries | 2 | P0 | E16-T9 |
| E16-T12 | Add entity-specific audit endpoint (`/{entity}/{id}/audit`) | 2 | P1 | E16-T9 |
| E16-T13 | Create audit event type enum and descriptions | 1 | P1 | E16-T9 |
| E16-T14 | Build Audit Log UI component | 5 | P1 | E16-T9 |
| E16-T15 | Add audit history tab to entity detail views | 3 | P2 | E16-T14 |

**Subtotal:** 18 points

---

## Feature 3: Compliance Export (PRIORITY: P1)

### User Story E16-US3
**As a** compliance officer, **I need to** export audit logs for regulatory review, **so that** I can provide evidence during audits.

**Acceptance Criteria:**
- [ ] Export audit events to CSV/JSON format
- [ ] Filter exports by date range, entity type, actor
- [ ] Include all relevant metadata (timestamps, IPs, user agents)
- [ ] Generate export asynchronously for large datasets
- [ ] Track export history (who exported what, when)

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E16-T16 | Implement audit export service | 3 | P1 | E16-T9 |
| E16-T17 | Add CSV export format | 2 | P1 | E16-T16 |
| E16-T18 | Add JSON export format | 1 | P1 | E16-T16 |
| E16-T19 | Implement async export for large datasets | 3 | P1 | E16-T16 |
| E16-T20 | Track export history (compliance_exports table) | 2 | P1 | E16-T16 |
| E16-T21 | Build Export UI in Admin Console | 3 | P2 | E16-T16 |

**Subtotal:** 14 points

---

## Feature 4: PII Handling & Data Governance (PRIORITY: P1)

### User Story E16-US4
**As a** platform, **I need to** handle PII according to regulations, **so that** we comply with GDPR/CCPA and protect user privacy.

**Acceptance Criteria:**
- [ ] PII fields identified and tagged in schema
- [ ] PII masked in audit logs (show last 4 digits of SSN, masked email)
- [ ] PII encryption at rest
- [ ] Data retention policies enforceable
- [ ] Right-to-deletion support (soft delete with audit trail)

### Tasks

| Task ID | Description | Story Points | Priority | Dependencies |
|---------|-------------|--------------|----------|--------------|
| E16-T22 | Define PII field registry | 2 | P1 | E2 |
| E16-T23 | Implement PII masking utility | 2 | P1 | E16-T22 |
| E16-T24 | Apply PII masking in audit event capture | 2 | P1 | E16-T5, E16-T23 |
| E16-T25 | Document data retention policies | 1 | P1 | — |
| E16-T26 | Implement right-to-deletion workflow | 3 | P2 | E16-T22 |
| E16-T27 | Unit tests for PII masking | 2 | P1 | E16-T23 |

**Subtotal:** 12 points

---

## Deferred Features (Phase 2: Days 91-180)

### Feature 5: Advanced Compliance (16 points)
- E16-T28 to E16-T33
- Automated compliance reports
- Regulatory template exports (SOC 2, ISO 27001)
- Scheduled compliance checks

### Feature 6: Real-time Audit Streaming (12 points)
- E16-T34 to E16-T38
- WebSocket audit feed for dashboards
- Anomaly detection alerts
- Integration with SIEM tools

---

## Epic Summary

| Feature | Full Points | MVP Points | Phase |
|---------|-------------|------------|-------|
| Audit Event Infrastructure | 21 | 21 | Phase 1 (Days 1-30) |
| Audit Query & Retrieval | 18 | 13 | Phase 1 (Days 15-45) |
| Compliance Export | 14 | 11 | Phase 1 (Days 30-60) |
| PII Handling | 12 | 9 | Phase 1 (Days 15-45) |
| Advanced Compliance | 16 | — | Phase 2 |
| Real-time Streaming | 12 | — | Phase 2 |
| **TOTAL** | **93** | **54** | — |

---

## Dependencies

**Blocks:**
- All feature epics (E4-E14) - They need audit hooks
- E14 (Analytics) - Audit data feeds compliance dashboards
- E17 (Document Intelligence) - Document access logging

**Blocked By:**
- E2 (Core Data Model) - Database schema required
- E3 (Auth) - Actor identification for audit events

**Critical Path:**
- E16-T1 through E16-T6 must complete by Day 30
- Audit middleware must be available before feature development begins
- All APIs from Sprint 3+ should use audit middleware

---

## Database Schema

### audit_events (Append-Only)

```sql
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Event identification
    event_type VARCHAR(50) NOT NULL,  -- CREATE, UPDATE, DELETE, READ, LOGIN, LOGOUT
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Entity being audited
    entity_type VARCHAR(50) NOT NULL,  -- project, loan, contact, task, etc.
    entity_id UUID NOT NULL,

    -- Actor (who performed the action)
    actor_type VARCHAR(20) NOT NULL,  -- USER, SYSTEM, API_KEY
    actor_id UUID,
    actor_email VARCHAR(255),
    actor_role VARCHAR(50),

    -- Change details
    action VARCHAR(100) NOT NULL,  -- Human-readable: "Updated project status"
    changes JSONB,  -- { field: { old: value, new: value } }

    -- Request context
    ip_address INET,
    user_agent TEXT,
    request_id UUID,  -- Correlation ID

    -- Metadata
    metadata JSONB,  -- Additional context

    -- Partitioning key
    created_month DATE NOT NULL DEFAULT DATE_TRUNC('month', NOW())
) PARTITION BY RANGE (created_month);

-- Create partitions for each month
CREATE TABLE audit_events_2025_12 PARTITION OF audit_events
    FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- Indexes for common queries
CREATE INDEX idx_audit_entity ON audit_events (entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_events (actor_id);
CREATE INDEX idx_audit_timestamp ON audit_events (event_timestamp DESC);
CREATE INDEX idx_audit_type ON audit_events (event_type);

-- Prevent modifications (immutable)
CREATE RULE audit_no_update AS ON UPDATE TO audit_events DO INSTEAD NOTHING;
CREATE RULE audit_no_delete AS ON DELETE TO audit_events DO INSTEAD NOTHING;
```

### compliance_exports

```sql
CREATE TABLE compliance_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Export details
    export_type VARCHAR(50) NOT NULL,  -- AUDIT_LOG, LOAN_HISTORY, USER_ACTIVITY
    format VARCHAR(10) NOT NULL,  -- CSV, JSON

    -- Filters used
    date_range_start TIMESTAMPTZ,
    date_range_end TIMESTAMPTZ,
    entity_types TEXT[],
    filters JSONB,

    -- Export file
    file_path VARCHAR(500),
    file_size_bytes BIGINT,
    record_count INT,

    -- Requestor
    requested_by UUID NOT NULL REFERENCES users(id),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING, PROCESSING, COMPLETED, FAILED
    error_message TEXT
);
```

---

## API Endpoints

### GET /api/v1/audit/events

**Query Parameters:**
- `entity_type` (string) - Filter by entity type
- `entity_id` (UUID) - Filter by specific entity
- `actor_id` (UUID) - Filter by who made changes
- `event_type` (string) - CREATE, UPDATE, DELETE, etc.
- `start_date` (ISO 8601) - Start of date range
- `end_date` (ISO 8601) - End of date range
- `limit` (int, default 50, max 500)
- `offset` (int, default 0)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "event_type": "UPDATE",
      "event_timestamp": "2025-12-01T10:30:00Z",
      "entity_type": "project",
      "entity_id": "uuid",
      "actor": {
        "id": "uuid",
        "email": "john@blueprint.io",
        "role": "ACQUISITIONS"
      },
      "action": "Updated project status from FEASIBILITY to GO",
      "changes": {
        "status": { "old": "FEASIBILITY", "new": "GO" },
        "go_decision_date": { "old": null, "new": "2025-12-01" }
      }
    }
  ],
  "pagination": {
    "total": 1234,
    "limit": 50,
    "offset": 0
  }
}
```

### POST /api/v1/audit/exports

**Request:**
```json
{
  "export_type": "AUDIT_LOG",
  "format": "CSV",
  "filters": {
    "entity_types": ["project", "loan"],
    "start_date": "2025-01-01",
    "end_date": "2025-12-01"
  }
}
```

**Response:**
```json
{
  "export_id": "uuid",
  "status": "PROCESSING",
  "estimated_completion": "2025-12-01T10:35:00Z"
}
```

---

## Security & Access Control

**Audit Log Access:**
- ADMIN: Full access to all audit logs
- MANAGER: Access to team's audit logs
- Other roles: Access to own audit history only

**Export Permissions:**
- Only ADMIN can export full audit logs
- MANAGER can export team-specific logs
- All exports are logged in compliance_exports

**Immutability Enforcement:**
- Database rules prevent UPDATE/DELETE on audit_events
- Application layer has no update/delete methods
- Backup verification includes audit log integrity check

---

## Performance Considerations

**Partitioning Strategy:**
- Monthly partitions for audit_events
- Automatic partition creation via cron job
- Old partitions (>7 years) archived to cold storage

**Query Optimization:**
- Index on (entity_type, entity_id) for entity history
- Index on (actor_id) for user activity queries
- Index on (event_timestamp DESC) for recent events
- Limit queries to 90-day window for real-time, async for historical

**Storage Estimates:**
- ~500 bytes per audit event (average)
- ~10,000 events/day at MVP scale
- ~5 MB/day, ~150 MB/month, ~1.8 GB/year
- 7-year retention: ~13 GB (manageable)

---

## Rollout Plan

**Sprint 2 (Days 15-28):**
- E16-T1, E16-T2: Audit table schema
- E16-T3, E16-T4: AuditService and middleware

**Sprint 3 (Days 29-42):**
- E16-T5, E16-T6: Before/after capture, ORM hooks
- E16-T7, E16-T8: Unit and integration tests
- E16-T9, E16-T10: Query API

**Sprint 4 (Days 43-56):**
- E16-T11, E16-T12: Pagination and entity endpoints
- E16-T16 to E16-T20: Compliance export
- E16-T22 to E16-T24: PII handling

**Sprint 5 (Days 57-70):**
- E16-T14, E16-T15: Audit Log UI
- E16-T21: Export UI

---

## Success Metrics (Day 90)

| Metric | Target |
|--------|--------|
| Audit coverage | 100% of CRUD operations |
| Query performance (90-day) | < 500ms p95 |
| Export generation time | < 5 min for 100K records |
| Zero audit gaps | No missing events for any entity |
| Compliance readiness | Pass internal audit review |

---

## File References

- [DATABASE_SCHEMA.md](../technical/DATABASE_SCHEMA.md) - Add audit tables
- [API_SPECIFICATION.md](../technical/API_SPECIFICATION.md) - Add audit endpoints
- [SECURITY_COMPLIANCE.md](../technical/SECURITY_COMPLIANCE.md) - Compliance requirements
- [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md) - Section 3.4 Security

---

**Status:** Ready for Sprint Planning
**Priority:** HIGH - Foundation layer, must start early
**Next Steps:** Add to Sprint 2-3, create GitHub issues
