# Sprint 2: Autonomy Level Analysis & Time Estimates

**Created:** December 30, 2024
**Methodology:** TIME_ESTIMATION_METHODOLOGY.md
**Sprint:** Sprint 2: VS2 Entitlement 2 (Jan 12-23, 2025)

---

## Executive Summary

All 18 Sprint 2 subtasks have been analyzed and assigned autonomy levels using the standardized methodology. Time estimates calculated using the formula:

```
Total Time = Base Implementation Time × Autonomy Multiplier + Human Overhead Time

HIGH:   Base × 1.0 + 15 min
MEDIUM: Base × 1.3 + 55 min
LOW:    Base × 1.7 + 120 min
```

### Sprint Totals

| Autonomy Level | Tasks | Total Hours | % of Sprint |
|----------------|-------|-------------|-------------|
| **HIGH**       | 3     | 3.8 hours   | 5%          |
| **MEDIUM**     | 10    | 39.7 hours  | 53%         |
| **LOW**        | 5     | 30.8 hours  | 42%         |
| **TOTAL**      | **18**| **74.3 hours** | **100%**  |

### Resource Allocation

**With 4-5 developers:**
- Per developer: ~18.6 hours (2.3 days of raw effort)
- Sprint duration: 10 working days (Jan 12-23)
- **Utilization:** 23% (comfortable capacity for QA, code review, unknowns)

**Autonomy Mix:**
- HIGH: 5% (autonomous work, minimal oversight)
- MEDIUM: 53% (collaborative approach, periodic checkpoints)
- LOW: 42% (close collaboration, pair programming)

---

## Story 1: DP01-217 - Design Customization Interface

**Total:** 5 subtasks, 17.75 hours (HIGH: 2, MEDIUM: 2, LOW: 1)

| Subtask | Summary | Autonomy | Base | Total | Estimate | Reasoning |
|---------|---------|----------|------|-------|----------|-----------|
| [DP01-261](https://vividcg.atlassian.net/browse/DP01-261) | Architect Authentication & Portal Access | **MEDIUM** | 120 min | 211 min | 3h 30m | Auth extension requires integration with existing DP01-23, some design decisions on multi-tenancy |
| [DP01-262](https://vividcg.atlassian.net/browse/DP01-262) | Customization Request Dashboard | **MEDIUM** | 150 min | 250 min | 4h | Dashboard requires data model alignment, real-time updates add complexity |
| [DP01-263](https://vividcg.atlassian.net/browse/DP01-263) | Plan Upload & Document Management | **LOW** | 180 min | 426 min | 7h | S3 upload, virus scanning, multi-file handling - critical functionality requiring validation |
| [DP01-264](https://vividcg.atlassian.net/browse/DP01-264) | Revision History & Version Tracking | **HIGH** | 90 min | 105 min | 2h | Standard CRUD pattern, well-defined file download flow |
| [DP01-265](https://vividcg.atlassian.net/browse/DP01-265) | CAD Integration Placeholder UI | **HIGH** | 30 min | 45 min | 45m | Simple placeholder component, minimal risk |

**Critical Path:** DP01-261 → DP01-262 → DP01-263 → DP01-264 (DP01-265 can be anytime after DP01-263)

**Key Risk:** DP01-263 (LOW autonomy, 7 hours) - S3 upload performance with 50MB files

---

## Story 2: DP01-221 - Correction Cycle Management

**Total:** 4 subtasks, 20.5 hours (MEDIUM: 2, LOW: 2)

| Subtask | Summary | Autonomy | Base | Total | Estimate | Reasoning |
|---------|---------|----------|------|-------|----------|-----------|
| [DP01-266](https://vividcg.atlassian.net/browse/DP01-266) | City Feedback Capture Form | **MEDIUM** | 135 min | 231 min | 4h | Form with rich text editor, auto-save, multiple field types - some design decisions |
| [DP01-267](https://vividcg.atlassian.net/browse/DP01-267) | Automatic Action Item Creation | **LOW** | 120 min | 324 min | 5h 30m | Assignment rules engine is business logic critical, requires validation |
| [DP01-268](https://vividcg.atlassian.net/browse/DP01-268) | Task Assignment & Tracking Dashboard | **MEDIUM** | 180 min | 289 min | 5h | Kanban board with drag-drop, filters, comments - moderate complexity |
| [DP01-269](https://vividcg.atlassian.net/browse/DP01-269) | Resubmission Workflow & Completion Tracking | **LOW** | 135 min | 350 min | 6h | Critical business process, must align with DP01-220 workflow |

**Critical Path:** DP01-266 → DP01-267 → DP01-268 → DP01-269 (sequential workflow, no parallelization)

**Key Risks:**
- DP01-267 (LOW autonomy, 5.5 hours) - Assignment rules complexity
- DP01-269 (LOW autonomy, 6 hours) - Workflow integration with DP01-220 (not yet built)

---

## Story 3: DP01-223 - Cross-Team Visibility

**Total:** 4 subtasks, 17.5 hours (HIGH: 1, MEDIUM: 3)

| Subtask | Summary | Autonomy | Base | Total | Estimate | Reasoning |
|---------|---------|----------|------|-------|----------|-----------|
| [DP01-270](https://vividcg.atlassian.net/browse/DP01-270) | Cross-Team Permission Model | **MEDIUM** | 150 min | 250 min | 4h | RBAC requires integration with DP01-23 auth, middleware setup, some design decisions |
| [DP01-271](https://vividcg.atlassian.net/browse/DP01-271) | Entitlement Status Display for Servicing | **MEDIUM** | 135 min | 231 min | 4h | Dashboard with calculated fields, status badges - moderate complexity |
| [DP01-272](https://vividcg.atlassian.net/browse/DP01-272) | Project Timeline Visibility | **MEDIUM** | 180 min | 289 min | 5h | Gantt timeline, milestone calculation, color coding - moderate complexity |
| [DP01-273](https://vividcg.atlassian.net/browse/DP01-273) | Permit Approval Notification | **HIGH** | 60 min | 75 min | 1h 30m | Standard notification pattern, well-defined with DP01-244 infrastructure |

**Critical Path:** DP01-270 → DP01-271 → DP01-272

**Parallelizable:** DP01-273 can start after DP01-271 complete

---

## Story 4: DP01-244 - Notification System ⭐ CRITICAL

**Total:** 5 subtasks, 23 hours (MEDIUM: 3, LOW: 2)

| Subtask | Summary | Autonomy | Base | Total | Estimate | Reasoning |
|---------|---------|----------|------|-------|----------|-----------|
| [DP01-274](https://vividcg.atlassian.net/browse/DP01-274) | Email Service Integration (AWS SES) | **LOW** | 120 min | 324 min | 5h 30m | Production AWS SES setup is critical infrastructure, DKIM/SPF config, bounce handling |
| [DP01-275](https://vividcg.atlassian.net/browse/DP01-275) | SMS Service Integration (Twilio) | **MEDIUM** | 90 min | 172 min | 3h | Twilio setup is straightforward but requires rate limiting and E.164 validation |
| [DP01-276](https://vividcg.atlassian.net/browse/DP01-276) | Notification Template Management | **MEDIUM** | 150 min | 250 min | 4h | Template CRUD + variable interpolation, some design decisions on versioning |
| [DP01-277](https://vividcg.atlassian.net/browse/DP01-277) | User Notification Preferences | **MEDIUM** | 120 min | 211 min | 3h 30m | Preferences UI + enforcement logic, moderate complexity |
| [DP01-278](https://vividcg.atlassian.net/browse/DP01-278) | Notification Queue & Delivery Service | **LOW** | 180 min | 426 min | 7h | Queue processing, retry logic, rate limiting - critical infrastructure |

**Critical Path:** DP01-274 (Email) → DP01-276 (Templates) → DP01-277 (Preferences) → DP01-278 (Queue)

**Parallelizable:** DP01-275 (SMS) can run in parallel with DP01-274 (Email)

**Key Risks:**
- DP01-274 (LOW autonomy, 5.5 hours) - AWS SES production access delay (can take 24-48 hours)
- DP01-278 (LOW autonomy, 7 hours) - Queue processing performance under load

**CRITICAL:** This story must be completed first as all other stories depend on it.

---

## Sprint Execution Plan

### Week 1 (Jan 12-16): Foundation

**Priority 1: Complete DP01-244 (Notification System)** - 23 hours total

**Team A (2 devs):**
- Day 1-2: DP01-274 (Email/SES) + DP01-275 (SMS/Twilio) **in parallel**
- Day 3: DP01-276 (Templates)
- Day 4-5: Buffer for AWS SES production access delays

**Team B (2 devs):**
- Day 1-2: DP01-217 (Design Customization) - DP01-261 (MEDIUM, 3.5h), DP01-262 (MEDIUM, 4h)
- Day 3-4: DP01-270 (RBAC, MEDIUM, 4h)
- Day 5: DP01-271 (Servicing Dashboard, MEDIUM, 4h)

**Goal by end of Week 1:**
- ✅ Email and SMS infrastructure operational (DP01-274, DP01-275, DP01-276)
- ✅ Architect portal auth and dashboard functional (DP01-261, DP01-262)
- ✅ Cross-team permissions implemented (DP01-270, DP01-271)

---

### Week 2 (Jan 19-23): Business Workflows

**Team A (2 devs):**
- Day 1-2: DP01-277 (Preferences, MEDIUM, 3.5h) + DP01-278 (Queue, LOW, 7h) **pair programming**
- Day 3: DP01-267 (Action Items, LOW, 5.5h) **pair programming**
- Day 4-5: DP01-269 (Resubmission, LOW, 6h) **pair programming**

**Team B (2 devs):**
- Day 1-2: DP01-263 (Upload, LOW, 7h) **pair programming**
- Day 2: DP01-264 (Revision History, HIGH, 2h) + DP01-265 (Placeholder, HIGH, 45m)
- Day 3: DP01-266 (City Feedback, MEDIUM, 4h)
- Day 4: DP01-268 (Task Dashboard, MEDIUM, 5h)

**Team C (1 dev):**
- Day 1: DP01-272 (Timeline, MEDIUM, 5h)
- Day 2: DP01-273 (Notification, HIGH, 1.5h)
- Day 3-5: Code review, QA support, documentation

**Goal by end of Week 2:**
- ✅ All 4 stories complete and tested
- ✅ Sprint demo prepared
- ✅ All acceptance criteria met

---

## Autonomy Level Breakdown

### HIGH Autonomy Tasks (3 tasks, 3.8 hours)

**Characteristics:**
- Well-defined requirements
- Standard patterns apply
- Low business risk
- Clear validation criteria

**Tasks:**
1. DP01-264: Revision History & Version Tracking (2h)
2. DP01-265: CAD Integration Placeholder UI (45m)
3. DP01-273: Permit Approval Notification (1.5h)

**Developer Approach:**
- Can work autonomously with minimal oversight
- Periodic check-ins at end of each task
- Total human time: ~1 hour across all 3 tasks

---

### MEDIUM Autonomy Tasks (10 tasks, 39.7 hours)

**Characteristics:**
- Some ambiguity in requirements
- Multiple valid approaches
- Moderate business impact
- Requires periodic checkpoints

**Tasks:**
1. DP01-261: Architect Authentication (3.5h)
2. DP01-262: Customization Request Dashboard (4h)
3. DP01-266: City Feedback Form (4h)
4. DP01-268: Task Tracking Dashboard (5h)
5. DP01-270: Cross-Team Permissions (4h)
6. DP01-271: Servicing Dashboard (4h)
7. DP01-272: Timeline Visualization (5h)
8. DP01-275: SMS Integration (3h)
9. DP01-276: Template Management (4h)
10. DP01-277: User Preferences (3.5h)

**Developer Approach:**
- Collaborative approach with 2-3 checkpoints per task
- Initial planning discussion (10-15 min)
- Mid-implementation validation (15-20 min)
- Review and refinement (20-30 min)
- Total human time: ~45-65 min per task

---

### LOW Autonomy Tasks (5 tasks, 30.8 hours)

**Characteristics:**
- Critical business logic
- High-risk architectural choices
- Must align with product requirements
- Multiple stakeholder validation needed

**Tasks:**
1. DP01-263: Plan Upload & Document Management (7h)
2. DP01-267: Automatic Action Item Creation (5.5h)
3. DP01-269: Resubmission Workflow (6h)
4. DP01-274: Email Service Integration (5.5h)
5. DP01-278: Notification Queue & Delivery (7h)

**Developer Approach:**
- Pair programming recommended
- Detailed upfront design session (30-45 min)
- Continuous oversight during implementation
- Multiple validation cycles (45-60 min)
- Comprehensive review (30-45 min)
- Total human time: ~105-150 min per task

**Why LOW:**
- **DP01-263:** S3 upload with virus scanning is security-critical, 50MB file handling requires performance validation
- **DP01-267:** Assignment rules engine contains business logic that must be validated by product team
- **DP01-269:** Resubmission workflow must integrate precisely with DP01-220 (Permit Submission)
- **DP01-274:** AWS SES production setup is critical infrastructure, DKIM/SPF misconfiguration causes email deliverability failures
- **DP01-278:** Queue processing with retry logic and rate limiting is critical infrastructure

---

## Capacity Planning

### Sprint Capacity (10 working days)

**Available Resources:**
- Developer A (Clay): 30 hours/week × 2 weeks = 60 hours
- Developer B: 30 hours/week × 2 weeks = 60 hours
- Developer C: 30 hours/week × 2 weeks = 60 hours
- Developer D: 30 hours/week × 2 weeks = 60 hours
- **Total Capacity:** 240 hours

**Sprint Commitment:**
- Raw effort: 74.3 hours
- Utilization: 31% (69 hours buffer for QA, code review, meetings, unknowns)
- **Status:** ✅ Comfortable capacity

### Time Allocation by Autonomy

| Autonomy | Hours | % of Sprint | Developer Strategy |
|----------|-------|-------------|--------------------|
| **HIGH** | 3.8   | 5%          | Assign to developers for autonomous work blocks |
| **MEDIUM** | 39.7  | 53%         | Schedule with collaboration slots (2-3 checkpoints) |
| **LOW** | 30.8  | 42%         | Block calendar for pair programming sessions |

### Risk Mitigation

**HIGH-risk tasks (require early attention):**
1. DP01-274 (Email/SES) - Request AWS production access **NOW** (before Jan 12)
2. DP01-263 (S3 Upload) - Test with 50MB files in Sprint 1 if possible
3. DP01-269 (Resubmission) - Coordinate with DP01-220 team (Sprint 1)

**Contingency Plans:**
- If AWS SES delayed: Use SendGrid as temporary fallback
- If S3 upload slow: Implement chunk upload with progress tracking
- If DP01-220 not ready: Mock permit submission workflow for testing

---

## Sprint Success Criteria

### Story Completion

- ✅ **DP01-217:** Architects can log in, see requests, upload plans, view revisions
- ✅ **DP01-221:** City feedback captured, action items created, task dashboard functional, resubmission workflow complete
- ✅ **DP01-223:** Servicing team has read-only access, timeline visible, permit approval notifications working
- ✅ **DP01-244:** Email + SMS sent reliably, templates configurable, user preferences enforced, queue processing with retry

### Technical Validation

- ✅ All 18 subtasks marked "Done" in Jira
- ✅ Code review completed for all subtasks
- ✅ Unit tests passing (80%+ coverage)
- ✅ Integration tests passing
- ✅ No critical bugs in QA

### Sprint Demo (Jan 23)

**Demo Flow:**
1. Show architect logging in and uploading a plan (DP01-217)
2. Design team logs city feedback, action items auto-created (DP01-221)
3. Servicing team views entitlement timeline and status (DP01-223)
4. Admin configures notification template, user sets preferences (DP01-244)
5. Show email and SMS being sent when permit approved

---

## Next Steps

1. ✅ **Autonomy levels assigned** - DONE (18 subtasks updated)
2. ✅ **Time estimates updated** - DONE (using TIME_ESTIMATION_METHODOLOGY.md)
3. ✅ **Labels applied in Jira** - DONE (autonomy-high, autonomy-medium, autonomy-low)
4. **Request AWS SES production access** - URGENT (do before Jan 12)
5. **Sprint planning meeting** - Schedule for Jan 12 (Day 1)
6. **Assign owners** - Assign each subtask to specific developers
7. **Setup pair programming slots** - Block calendar for LOW autonomy tasks

---

## Lessons Learned (to track in Sprint Retrospective)

**Questions to answer:**
1. Were autonomy levels accurately assigned? (compare estimated vs actual)
2. Did MEDIUM tasks require more/less collaboration than expected?
3. Did LOW tasks benefit from pair programming?
4. Were time estimates within ±20% of actuals?
5. What adjustments needed for future sprints?

**Calibration:**
- If estimates consistently off, adjust multipliers:
  - MEDIUM: 1.3x → 1.4x or 1.2x
  - LOW: 1.7x → 1.8x or 1.6x
- If human overhead incorrect, adjust base values:
  - MEDIUM: 55 min → 65 min or 45 min
  - LOW: 120 min → 135 min or 105 min

---

**End of Document**
