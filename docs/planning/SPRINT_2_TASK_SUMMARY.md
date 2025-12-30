# Sprint 2: Track 3 Task Breakdown - Summary

**Created:** December 30, 2024
**Sprint:** Sprint 2: VS2 Entitlement 2
**Dates:** Jan 12 - Jan 23, 2025
**Total Subtasks:** 18 across 4 stories

---

## ✅ Task Creation Complete

All Sprint 2 stories have been deeply tasked out following the Hephaestus model with:
- Verbose descriptions with technical details
- Data model definitions (tentative)
- Clear deliverables and acceptance criteria
- Interdependency identification and alignment
- Time estimates for planning

---

## Story Breakdown

### DP01-217: Design Customization Interface (5 subtasks)

| Subtask | Summary | Estimate | Dependencies |
|---------|---------|----------|--------------|
| [DP01-261](https://vividcg.atlassian.net/browse/DP01-261) | Architect Authentication & Portal Access | 2d | DP01-23 (Auth) |
| [DP01-262](https://vividcg.atlassian.net/browse/DP01-262) | Customization Request Dashboard | 3d | DP01-261, DP01-15 to DP01-20 |
| [DP01-263](https://vividcg.atlassian.net/browse/DP01-263) | Plan Upload & Document Management | 4d | DP01-262, DP01-21 (S3), DP01-244 |
| [DP01-264](https://vividcg.atlassian.net/browse/DP01-264) | Revision History & Version Tracking | 2d | DP01-263 |
| [DP01-265](https://vividcg.atlassian.net/browse/DP01-265) | CAD Integration Placeholder UI | 1d | DP01-263 |

**Total Estimate:** 12 days (can be parallelized with 2-3 developers)

**Critical Path:** DP01-261 → DP01-262 → DP01-263 → DP01-264

---

### DP01-221: Correction Cycle Management (4 subtasks)

| Subtask | Summary | Estimate | Dependencies |
|---------|---------|----------|--------------|
| [DP01-266](https://vividcg.atlassian.net/browse/DP01-266) | City Feedback Capture Form | 3d | DP01-220, DP01-216 |
| [DP01-267](https://vividcg.atlassian.net/browse/DP01-267) | Automatic Action Item Creation | 3d | DP01-266, DP01-244 |
| [DP01-268](https://vividcg.atlassian.net/browse/DP01-268) | Task Assignment & Tracking Dashboard | 4d | DP01-267, DP01-242 |
| [DP01-269](https://vividcg.atlassian.net/browse/DP01-269) | Resubmission Workflow & Completion Tracking | 3d | DP01-268, DP01-220, DP01-244 |

**Total Estimate:** 13 days (can be parallelized with 2-3 developers)

**Critical Path:** DP01-266 → DP01-267 → DP01-268 → DP01-269 (sequential workflow)

---

### DP01-223: Cross-Team Visibility (4 subtasks)

| Subtask | Summary | Estimate | Dependencies |
|---------|---------|----------|--------------|
| [DP01-270](https://vividcg.atlassian.net/browse/DP01-270) | Cross-Team Permission Model | 3d | DP01-23 (Auth) |
| [DP01-271](https://vividcg.atlassian.net/browse/DP01-271) | Entitlement Status Display for Servicing | 3d | DP01-270, DP01-220 |
| [DP01-272](https://vividcg.atlassian.net/browse/DP01-272) | Project Timeline Visibility | 4d | DP01-271, DP01-221 |
| [DP01-273](https://vividcg.atlassian.net/browse/DP01-273) | Permit Approval Notification | 2d | DP01-244, DP01-220 |

**Total Estimate:** 12 days (can be parallelized with 2 developers)

**Critical Path:** DP01-270 → DP01-271 → DP01-272

**Parallel:** DP01-273 can start after DP01-271

---

### DP01-244: Notification System (5 subtasks) ⭐ CRITICAL - Required by all other stories

| Subtask | Summary | Estimate | Dependencies |
|---------|---------|----------|--------------|
| [DP01-274](https://vividcg.atlassian.net/browse/DP01-274) | Email Service Integration (AWS SES) | 3d | DP01-21 (AWS) |
| [DP01-275](https://vividcg.atlassian.net/browse/DP01-275) | SMS Service Integration (Twilio) | 2d | Twilio account |
| [DP01-276](https://vividcg.atlassian.net/browse/DP01-276) | Notification Template Management | 3d | DP01-274, DP01-275 |
| [DP01-277](https://vividcg.atlassian.net/browse/DP01-277) | User Notification Preferences | 3d | DP01-276 |
| [DP01-278](https://vividcg.atlassian.net/browse/DP01-278) | Notification Queue & Delivery Service | 4d | DP01-274, DP01-275, DP01-276, DP01-277 |

**Total Estimate:** 15 days (can be parallelized with 2-3 developers)

**Critical Path:** DP01-274 → DP01-276 → DP01-277 → DP01-278

**Parallel:** DP01-275 (SMS) can run in parallel with DP01-274 (Email)

---

## Sprint Execution Recommendations

### Week 1 (Jan 12-16): Foundation - Notification System

**Priority 1: Complete DP01-244 (Notification System)**
- **Team A (2 devs):**
  - DP01-274 (Email/SES) + DP01-275 (SMS/Twilio) in parallel
  - Then DP01-276 (Templates)
- **Team B (2 devs):**
  - Start DP01-217 (Design Customization) - DP01-261, DP01-262
- **Team C (1 dev):**
  - Start DP01-223 (Cross-Team Visibility) - DP01-270

**Goal by end of Week 1:** Notification infrastructure (DP01-274, DP01-275, DP01-276) functional

---

### Week 2 (Jan 19-23): Business Workflows

**Priority 2: Complete all business workflows**
- **Team A (2 devs):**
  - DP01-277, DP01-278 (Complete notification system)
  - Then support other teams
- **Team B (2 devs):**
  - DP01-263, DP01-264 (Upload + Revision history)
  - DP01-266, DP01-267 (City feedback + Action items)
- **Team C (2 devs):**
  - DP01-271, DP01-272, DP01-273 (Servicing visibility + Timeline + Notifications)
  - DP01-268, DP01-269 (Task dashboard + Resubmission)

**Goal by end of Week 2:** All 4 stories complete and ready for sprint review

---

## Interdependency Map

```
DP01-244 (Notification System) ← CRITICAL FOUNDATION
├─→ DP01-217 (Design Customization) - needs notifications
├─→ DP01-221 (Correction Cycle) - needs notifications
└─→ DP01-223 (Cross-Team Visibility) - needs notifications

DP01-23 (Auth - from previous sprint)
├─→ DP01-217 (Architect auth)
└─→ DP01-223 (RBAC permissions)

DP01-220 (Permit Submission - Sprint 1)
├─→ DP01-221 (City feedback links to permits)
└─→ DP01-223 (Servicing views permit status)

DP01-216 (Plan Library - Sprint 1)
└─→ DP01-221 (Feedback references plan sheets)

DP01-242 (Workflow Engine - Sprint 3)
└─→ DP01-221 (Task status transitions)
```

---

## Key Risks & Mitigations

| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| AWS SES production access delay | High | Request access in Sprint 1 (before Jan 12) | DevOps |
| Workflow Engine (DP01-242) not ready | Medium | Implement basic state machine in DP01-221 | Backend Lead |
| S3 upload performance (50MB files) | Medium | Use presigned URLs, test early in sprint | Backend |
| Assignment rules complexity | Low | Start with simple category-based rules | Product |
| Twilio SMS cost | Low | Set strict rate limits (10 SMS/day/user) | Admin |

---

## Acceptance Criteria Summary

All subtasks must meet these criteria before story completion:

### DP01-217: Design Customization Interface
- ✅ Architects can log in and see assigned customization requests
- ✅ Upload revised plans (PDF, DWG, DXF) with drag-and-drop
- ✅ Revision history preserved and downloadable
- ✅ Notifications sent to design team on upload

### DP01-221: Correction Cycle Management
- ✅ City feedback captured with severity and affected sheets
- ✅ Action items auto-created and assigned by category rules
- ✅ Task dashboard shows all assigned corrections
- ✅ Resubmission blocked until all corrections resolved

### DP01-223: Cross-Team Visibility
- ✅ Servicing team can view entitlement projects (read-only)
- ✅ Status and timeline clearly visible
- ✅ Notification sent when permit approved

### DP01-244: Notification System
- ✅ Emails sent reliably via AWS SES (99%+ delivery)
- ✅ SMS sent via Twilio with rate limiting
- ✅ Templates support variable interpolation
- ✅ User preferences control channels and frequency
- ✅ Queue processes notifications with retry logic

---

## Documentation

**Detailed Task Breakdown:** [SPRINT_2_TASK_BREAKDOWN.md](SPRINT_2_TASK_BREAKDOWN.md) (18 pages, 52-69 days effort)

**Sprint Allocation Plan:** [SPRINT_ALLOCATION_PLAN.md](SPRINT_ALLOCATION_PLAN.md)

**Creation Scripts:**
- [scripts/create-sprint2-subtasks.py](../../scripts/create-sprint2-subtasks.py)
- [scripts/assign-stories-to-sprints.py](../../scripts/assign-stories-to-sprints.py)

---

## Next Steps

1. ✅ **Stories moved to Sprint 2** - DONE
2. ✅ **Subtasks created in Jira** - DONE (18 subtasks: DP01-261 to DP01-278)
3. **Sprint planning meeting** - Schedule for Jan 12 (Day 1)
4. **AWS SES setup** - Request production access NOW (do not wait until sprint starts)
5. **Assign owners** - Assign each subtask to specific developers
6. **Story point estimation** - Planning poker session for all 4 stories

---

## Sprint Metrics

- **Total Stories:** 4
- **Total Subtasks:** 18
- **Total Estimated Effort:** 52 days (raw effort)
- **With 4-5 developers:** ~13-15 days (calendar time with parallelization)
- **Sprint Duration:** 10 working days (Jan 12-23, 2025)
- **Buffer:** 2-3 days for QA, code review, documentation

**Velocity Target:** Complete all 4 stories by Jan 23, 2025 (end of Sprint 2)
