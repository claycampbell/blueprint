# Epic E11: Contact Management - Detailed Backlog

**Epic Owner:** Backend + Frontend Team
**Target Phase:** Days 1-90 (Foundation)
**Created:** November 6, 2025
**Status:** Ready for Sprint Planning

---

## Epic Overview

**Full Scope:** 156 points
**MVP Core (P0/P1):** 140 points
**Recommended MVP:** ~67 points (see phasing below)
**Original Estimate:** ~40 points (significantly underestimated)

Contact Management provides the foundation for tracking all people and legal entities involved in Blueprint's operations.

**Business Value:**
- Single source of truth for all contacts
- Prevent duplicate contact entries
- Track complete relationship history
- Support legal entity structures for lending compliance

---

## Recommended MVP Phasing

### Phase 1: Core Contacts (Days 1-45) - 32 points
**Feature 1: Contact CRUD** (E11-T1 to E11-T12)

### Phase 1: Search & Browse (Days 30-60) - 16 points (partial Feature 2)
**Feature 2 (Core):** Contact List & Basic Search (E11-T13 to E11-T17)

### Phase 1: Entities (Days 45-75) - 19 points (partial Feature 4)
**Feature 4 (Core):** Basic Entity Management (E11-T32 to E11-T39)

**MVP Essentials Total:** ~67 points

**Deferred to Phase 2:**
- Feature 3: Contact Detail & History (26 points)
- Feature 5: Contact-Entity Relationships (29 points)
- Feature 6: Duplicate Prevention (16 points)

---

## Feature 1: Contact CRUD Operations (PRIORITY: P0)

### User Story E11-US1
**As an** internal user, **I need to** create, view, update, and delete contacts, **so that** I can maintain accurate contact information.

**Acceptance Criteria:**
- [ ] Create contact with type, name, company, email, phone, address
- [ ] Contact types: AGENT, BUILDER, CONSULTANT, BORROWER, GUARANTOR, SPONSOR
- [ ] Update contact information (all fields editable)
- [ ] Soft delete contacts (deleted_at timestamp)
- [ ] Validate email format and phone number
- [ ] Prevent duplicate email addresses
- [ ] Store address as JSONB

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E11-T1 | Create `contacts` database table | DATABASE_SCHEMA.md lines 481-522 | 3 | P0 | E2 |
| E11-T2 | Implement POST `/contacts` API | API lines 742-764 | 3 | P0 | E11-T1, E3 |
| E11-T3 | Implement GET `/contacts/{id}` API | API lines 767-776 | 2 | P0 | E11-T1 |
| E11-T4 | Implement PATCH `/contacts/{id}` API | RESTful pattern | 2 | P0 | E11-T1 |
| E11-T5 | Implement DELETE `/contacts/{id}` (soft delete) | RESTful pattern | 2 | P0 | E11-T1 |
| E11-T6 | Add validation middleware (email, phone) | API error handling | 2 | P0 | E11-T2 |
| E11-T7 | Prevent duplicate email addresses | DATABASE_SCHEMA.md | 2 | P1 | E11-T1 |
| E11-T8 | Build Contact Create Form UI | SYSTEM_ARCHITECTURE.md | 5 | P0 | E11-T2 |
| E11-T9 | Build Contact Edit Form UI | Frontend | 3 | P0 | E11-T3, E11-T4 |
| E11-T10 | Implement address input (JSONB) | Address component | 3 | P1 | E11-T8 |
| E11-T11 | Unit tests for Contact service (CRUD) | TESTING_STRATEGY.md | 2 | P0 | E11-T2 |
| E11-T12 | API integration tests | TESTING_STRATEGY.md | 3 | P1 | E11-T5 |

**Subtotal:** 32 points

---

## Feature 2: Contact List & Search (PRIORITY: P0 - Core Only)

### User Story E11-US2
**As an** internal user, **I need to** view and search contacts, **so I can** quickly find specific contacts.

**Acceptance Criteria:**
- [ ] Display paginated contact list (50 per page)
- [ ] Filter by contact type (AGENT, BUILDER, etc.)
- [ ] Search by name, company name, or email
- [ ] Full-text search capability
- [ ] Sort by name, created date
- [ ] Click contact to view detail

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E11-T13 | Implement GET `/contacts` with filters | API lines 715-740 | 3 | P0 | E11-T1 |
| E11-T14 | Add full-text search index on contacts | DATABASE_SCHEMA.md | 2 | P1 | E11-T1 |
| E11-T15 | Implement search query logic | Full-text search | 3 | P1 | E11-T14 |
| E11-T16 | Build Contact List UI (table/card view) | SYSTEM_ARCHITECTURE.md | 5 | P0 | E11-T13 |
| E11-T17 | Add filter controls (type, search input) | Frontend | 3 | P0 | E11-T16 |
| E11-T18 | Implement pagination controls | Frontend | 2 | P1 | E11-T16 |
| E11-T19 | Add sort controls (column headers) | Frontend | 2 | P2 | E11-T16 |
| E11-T20 | Empty state UI (no contacts found) | Frontend | 1 | P2 | E11-T16 |
| E11-T21 | Unit tests for contact search/filter | TESTING_STRATEGY.md | 2 | P1 | E11-T15 |
| E11-T22 | E2E test: Search → View results → Click | TESTING_STRATEGY.md | 3 | P1 | E11-T17 |

**Subtotal:** 26 points (16 P0 points for MVP)

---

## Feature 4: Entity Management (PRIORITY: P0 - Core Only)

### User Story E11-US4
**As a** servicing team member, **I need to** create and manage legal entities, **so that** I can track borrowing entities for lending compliance.

**Acceptance Criteria:**
- [ ] Create entity with name, type, tax ID, state, formation date
- [ ] Entity types: LLC, PARTNERSHIP, CORPORATION, TRUST
- [ ] Store entity address (JSONB)
- [ ] Validate tax ID format (EIN: XX-XXXXXXX)
- [ ] Update entity information
- [ ] Soft delete entities

### Tasks

| Task ID | Description | Technical Doc Reference | Story Points | Priority | Dependencies |
|---------|-------------|------------------------|--------------|----------|--------------|
| E11-T32 | Create `entities` database table | DATABASE_SCHEMA.md lines 529-548 | 2 | P0 | E2 |
| E11-T33 | Implement POST `/entities` API | Implied by schema | 3 | P0 | E11-T32, E3 |
| E11-T34 | Implement GET `/entities` API | RESTful pattern | 2 | P0 | E11-T32 |
| E11-T35 | Implement GET `/entities/{id}` API | RESTful pattern | 2 | P0 | E11-T32 |
| E11-T36 | Implement PATCH `/entities/{id}` API | RESTful pattern | 2 | P0 | E11-T32 |
| E11-T37 | Add tax ID validation (EIN format) | Business logic | 2 | P1 | E11-T33 |
| E11-T38 | Prevent duplicate tax IDs | DATABASE_SCHEMA.md | 2 | P1 | E11-T32 |
| E11-T39 | Build Entity Create Form UI | SYSTEM_ARCHITECTURE.md | 5 | P0 | E11-T33 |
| E11-T40 | Build Entity Detail View UI | Frontend | 3 | P1 | E11-T35 |
| E11-T41 | Unit tests for Entity service | TESTING_STRATEGY.md | 2 | P1 | E11-T33 |
| E11-T42 | API integration tests for entities | TESTING_STRATEGY.md | 2 | P1 | E11-T36 |

**Subtotal:** 27 points (19 P0 points for MVP)

---

## Deferred Features (Phase 2: Days 91-180)

### Feature 3: Contact Detail View & Activity History (26 points)
- E11-T23 to E11-T31
- Comprehensive contact profile
- Related projects, loans, tasks, entities

### Feature 5: Contact-Entity Relationships (29 points)
- E11-T43 to E11-T54
- Junction table for contact-entity links
- Role management (OWNER, MANAGER, MEMBER, GUARANTOR)

### Feature 6: Duplicate Prevention & Merge (16 points)
- E11-T55 to E11-T59
- Fuzzy name matching
- Duplicate warning modal
- Future: Merge functionality

---

## Epic Summary

| Feature | Full Points | MVP Points | Phase |
|---------|-------------|------------|-------|
| Contact CRUD | 32 | 32 | Phase 1 (Days 1-45) |
| Contact List & Search | 26 | 16 | Phase 1 (Days 30-60) |
| Contact Detail & History | 26 | — | Phase 2 |
| Entity Management | 27 | 19 | Phase 1 (Days 45-75) |
| Contact-Entity Relationships | 29 | — | Phase 2 |
| Duplicate Prevention | 16 | — | Phase 2/3 |
| **TOTAL** | **156** | **67** | — |

---

## Dependencies

**Blocks:**
- E9 (Lending) - Requires contacts and entities for borrower/guarantor
- E4 (Projects) - Requires contacts for agent/builder assignment
- E5 (Feasibility) - Requires contacts for consultant management

**Blocked By:**
- E2 (Core Data Model) - Database schema required
- E3 (Auth) - Authentication/authorization required

**Critical:** E11 must complete early (Days 1-45) to unblock E4, E5, E9.

---

## Security & Compliance

**Access Control:**
- Internal users: Full read/write
- External users (agents, builders): Read-only, own contacts
- Consultants: No contact access

**PII Protection:**
- Email, phone, address are PII → encrypt at rest
- Audit all contact view/edit operations
- GDPR compliance: Support data export, right to be forgotten

**Data Validation:**
- Email: RFC 5322 format
- Phone: E.164 format (international support)
- Tax ID: Validate EIN format (XX-XXXXXXX)

---

## Performance Considerations

**Database Indexing:**
- `idx_contacts_type`: Fast filtering by type
- `idx_contacts_email`: Fast lookups by email
- `idx_contacts_search`: Full-text search (GIN index)
- `idx_entities_tax_id`: Fast entity lookup by EIN

**Caching Strategy:**
- Cache frequently accessed contacts (agents, builders) in Redis (TTL: 15 min)
- Cache contact search results (TTL: 5 min)

**Query Optimization:**
- Eager loading for contact expansions (projects, loans, tasks)
- Paginate all contact lists (limit 50)
- Debounce search input (300ms)

---

## Rollout Plan

**Week 1-2 (Days 1-14):**
- Complete database schema
- Implement Contact CRUD APIs
- Build Contact Create/Edit forms

**Week 3-4 (Days 15-28):**
- Implement Contact List & Search
- Build Entity Management
- API integration tests

**Week 5-6 (Days 29-42):**
- Implement Contact Detail view (if not deferred)
- Contact-Entity relationships (if not deferred)
- E2E tests

**Week 7 (Days 43-49):**
- Performance testing & optimization
- UAT with acquisitions team
- Bug fixes

**Week 8 (Days 50-56):**
- Production deployment
- User training
- Monitor adoption

---

## Open Questions

1. **Address Standardization:** Need USPS API for address validation?
2. **International Contacts:** Support international phone/addresses?
3. **Contact Ownership:** Multiple owners or single owner?
4. **Bulk Import:** CSV import for migrating existing contacts?
5. **Contact Merge:** Priority for duplicate merge in MVP?

---

## Success Metrics (Day 90)

**Quantitative:**
- Contact creation time: < 2 minutes
- Search response time: < 200ms (p95)
- Zero duplicate contacts created
- User adoption: ≥85% by Week 4

**Qualitative:**
- Users report easier contact lookup vs. spreadsheets
- Servicing team confirms entity structures accurate
- No manual re-entry of contact data between systems

---

## File References

- [DATABASE_SCHEMA.md](../technical/DATABASE_SCHEMA.md) lines 480-568
- [API_SPECIFICATION.md](../technical/API_SPECIFICATION.md) lines 712-776
- [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md) Section 5.6
- [SYSTEM_ARCHITECTURE.md](../technical/SYSTEM_ARCHITECTURE.md) lines 175-220
- [TESTING_STRATEGY.md](../technical/TESTING_STRATEGY.md) sections 4-6
- [BACKLOG_CREATION_PLAN.md](BACKLOG_CREATION_PLAN.md) Epic E11 section

---

**Status:** Ready for Sprint Planning
**Priority:** HIGH - Must complete early to unblock E4, E5, E9
**Next Steps:** Create GitHub issues, assign to Sprint 1-2 (Days 1-30)
