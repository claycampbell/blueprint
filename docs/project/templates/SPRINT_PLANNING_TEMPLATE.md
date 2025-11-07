# Sprint [NUMBER] Planning

**Sprint Duration:** 2 weeks (10 working days)
**Start Date:** [YYYY-MM-DD]
**End Date:** [YYYY-MM-DD]
**Sprint Goal:** [One sentence describing the sprint's main objective and value delivery]

---

## 1. Sprint Information

### 1.1 Key Dates

| Milestone | Date | Time |
|-----------|------|------|
| Sprint Planning | [YYYY-MM-DD] | [HH:MM] |
| Daily Standups | [Days of week] | [HH:MM] |
| Sprint Review | [YYYY-MM-DD] | [HH:MM] |
| Sprint Retrospective | [YYYY-MM-DD] | [HH:MM] |

### 1.2 Sprint Objectives

**Primary Goal:** [Main objective - what must be achieved]

**Secondary Goals:**
- [Optional objective 1]
- [Optional objective 2]

**Success Criteria:**
- [ ] All P0 tasks completed and merged to main
- [ ] All tests passing (≥80% coverage for new code)
- [ ] No critical bugs in staging environment
- [ ] Demo-able feature ready for sprint review
- [ ] Documentation updated (README, API docs)

---

## 2. Team Capacity Calculation

### 2.1 Team Composition

| Role | Team Members | Velocity per Person | Total Points |
|------|--------------|---------------------|--------------|
| Backend Developer | [#] | 10 points/sprint | [#] points |
| Frontend Developer | [#] | 10 points/sprint | [#] points |
| Full-Stack Developer | [#] | 10 points/sprint | [#] points |
| **Total Base Capacity** | **[#]** | | **[#] points** |

### 2.2 Capacity Adjustments

| Adjustment Type | Impact | Points Deducted |
|----------------|--------|-----------------|
| PTO / Holidays | [Description] | -[#] points |
| Meetings / Ceremonies | 15-20% overhead | -[#] points |
| Tech Debt / Bug Fixes | 10% buffer | -[#] points |
| Onboarding / Training | [If applicable] | -[#] points |
| **Total Adjustments** | | **-[#] points** |

### 2.3 Available Sprint Capacity

```
Total Base Capacity:        [#] points
Total Adjustments:         -[#] points
─────────────────────────────────────
Available Sprint Capacity:  [#] points
```

### 2.4 Historical Velocity

| Sprint | Planned | Completed | Velocity % |
|--------|---------|-----------|------------|
| Sprint [N-2] | [#] pts | [#] pts | [%] |
| Sprint [N-1] | [#] pts | [#] pts | [%] |
| **Average** | **[#] pts** | **[#] pts** | **[%]** |

---

## 3. Sprint Backlog Selection

### 3.1 Selection Criteria

**Priority Order:**
1. **P0 (Blocker)** - Must complete for project to proceed
2. **P1 (Critical)** - Required for MVP, unblocks future work
3. **P2 (Important)** - Nice to have if capacity allows
4. **P3 (Low)** - Defer to future sprints

**Selection Rules:**
- All dependencies must be resolved or scheduled in this sprint
- Total committed points ≤ Available capacity
- Leave 10% buffer for unknowns
- Include at least 1 stretch goal (P2/P3)

### 3.2 Sprint Backlog

| Task ID | Description | Priority | Story Points | Assignee | Dependencies | Epic |
|---------|-------------|----------|--------------|----------|--------------|------|
| [E#-T#] | [Task name] | [P0-P3] | [#] | [Name] | [Task IDs] | [Epic Name] |
| [E#-T#] | [Task name] | [P0-P3] | [#] | [Name] | [Task IDs] | [Epic Name] |
| [E#-T#] | [Task name] | [P0-P3] | [#] | [Name] | [Task IDs] | [Epic Name] |
| ... | ... | ... | ... | ... | ... | ... |

**Committed Points:** [#] / [Capacity] ([%] of capacity)

**Stretch Goals** (if ahead of schedule):
- [ ] [Task ID]: [Description] ([#] points)
- [ ] [Task ID]: [Description] ([#] points)

---

## 4. Epic Breakdown

### Epic [E#]: [Epic Name]

**Goal:** [What this epic achieves]
**Total Points:** [#] (Sprint allocation: [#])

**Tasks in This Sprint:**
- [ ] **[E#-T#]**: [Task name] ([#] pts) - [Assignee]
  - Acceptance Criteria: [Summary]
  - Dependencies: [List]

- [ ] **[E#-T#]**: [Task name] ([#] pts) - [Assignee]
  - Acceptance Criteria: [Summary]
  - Dependencies: [List]

### Epic [E#]: [Epic Name]

**Goal:** [What this epic achieves]
**Total Points:** [#] (Sprint allocation: [#])

**Tasks in This Sprint:**
- [ ] **[E#-T#]**: [Task name] ([#] pts) - [Assignee]
  - Acceptance Criteria: [Summary]
  - Dependencies: [List]

---

## 5. Definition of Done

For each task to be considered **"Done"** and counted toward sprint completion:

### 5.1 Code Quality
- [ ] Code complete and functional
- [ ] Code follows project style guide / linting rules
- [ ] No compiler warnings or errors
- [ ] No console errors or warnings (frontend)

### 5.2 Testing
- [ ] Unit tests written and passing (≥80% coverage for new code)
- [ ] Integration tests written (if API endpoint)
- [ ] E2E tests written (if user-facing feature)
- [ ] All existing tests still passing
- [ ] Manual testing completed

### 5.3 Code Review
- [ ] Pull request created with clear description
- [ ] Code reviewed by 2 team members
- [ ] All review comments addressed
- [ ] PR approved by reviewers

### 5.4 Documentation
- [ ] README updated (if architecture changed)
- [ ] API documentation updated (if endpoints added/changed)
- [ ] Inline code comments for complex logic
- [ ] Database schema documentation updated (if migrations)

### 5.5 Deployment
- [ ] Merged to `main` branch
- [ ] Deployed to staging environment
- [ ] Smoke tests passed in staging
- [ ] No breaking changes (or migration plan documented)

### 5.6 Acceptance
- [ ] Acceptance criteria met (from user story)
- [ ] Product Owner reviewed (if UI feature)
- [ ] Demo-able (if user-facing)

---

## 6. Dependencies & Blockers

### 6.1 External Dependencies

| Dependency | Owner | Status | Due Date | Risk | Mitigation |
|------------|-------|--------|----------|------|------------|
| [Item] | [Team/Person] | [Green/Yellow/Red] | [Date] | [High/Med/Low] | [Plan] |

**Example:**
| AWS account provisioned | DevOps team | Yellow | Sprint Day 2 | High | Use local Docker if delayed |

### 6.2 Internal Blockers

| Blocker | Impact | Owner | Resolution Plan | Target Date |
|---------|--------|-------|-----------------|-------------|
| [Issue] | [Which tasks blocked] | [Name] | [How to resolve] | [Date] |

**Example:**
| Tech stack decision pending | Blocks E1-T1, E1-T2 | Tech Lead | Force decision by Day 1 | Sprint Day 1 |

### 6.3 Cross-Team Coordination

| Team | What We Need | Contact | Status |
|------|--------------|---------|--------|
| [Team name] | [Dependency description] | [Name] | [Status] |

---

## 7. Risk Assessment

### 7.1 Sprint Risks

| Risk | Likelihood | Impact | Severity | Mitigation Strategy | Owner |
|------|------------|--------|----------|---------------------|-------|
| [Risk description] | High/Med/Low | High/Med/Low | [H/M/L] | [How to mitigate] | [Name] |

**Example:**
| Tech stack decision delayed | Medium | High | **HIGH** | Force decision by Day 3; use sensible defaults | Tech Lead |
| Team member PTO overlap | Low | Medium | **LOW** | Front-load critical tasks; document handoffs | Scrum Master |

### 7.2 Technical Debt

**Debt Incurred This Sprint:**
- [Item]: [Justification] - Scheduled for: [Future sprint]

**Debt Paid Down This Sprint:**
- [Item]: [#] points allocated

---

## 8. Sprint Planning Meeting Agenda

**Duration:** 4 hours (2-week sprint) or 2 hours (1-week sprint)

### 8.1 Agenda

| Time | Activity | Duration | Facilitator |
|------|----------|----------|-------------|
| 00:00 | Welcome & Sprint Goal Review | 10 min | Scrum Master |
| 00:10 | Review Previous Sprint | 30 min | Team |
| 00:40 | Review Product Backlog | 30 min | Product Owner |
| 01:10 | Define Sprint Goal | 15 min | Product Owner |
| 01:25 | Break | 15 min | - |
| 01:40 | Capacity Planning | 15 min | Scrum Master |
| 01:55 | Task Breakdown & Estimation | 90 min | Team |
| 03:25 | Sprint Commitment | 15 min | Team |
| 03:40 | Risk & Dependency Review | 15 min | Team |
| 03:55 | Wrap-up & Action Items | 5 min | Scrum Master |

### 8.2 Previous Sprint Review

**What Went Well:**
- [Item]
- [Item]

**What Didn't Go Well:**
- [Item]
- [Item]

**Action Items from Retro:**
- [ ] [Action item from previous retrospective]
- [ ] [Action item from previous retrospective]

**Velocity Achieved:**
- Planned: [#] points
- Completed: [#] points
- Velocity: [%]

---

## 9. Daily Standup Format

**Duration:** 15 minutes max
**Time:** [HH:MM] daily
**Format:** Synchronous (in-person or video call)

**Each team member answers:**
1. **Yesterday:** What did I complete?
2. **Today:** What will I work on?
3. **Blockers:** What's preventing progress?

**Parking Lot:**
- Topics that need longer discussion (schedule separate meeting)

---

## 10. Sprint Review Preparation

**Date:** [YYYY-MM-DD]
**Duration:** 1 hour
**Attendees:** Team, Product Owner, Stakeholders

**Demo Checklist:**
- [ ] Staging environment updated with all completed features
- [ ] Demo script prepared (5-10 min per feature)
- [ ] Test data seeded in staging
- [ ] Screen recording backup (if live demo fails)
- [ ] Feedback form ready for stakeholders

**Features to Demo:**
1. [Feature name] - [Presenter]
2. [Feature name] - [Presenter]

---

## 11. Sprint Retrospective Format

**Date:** [YYYY-MM-DD]
**Duration:** 1 hour
**Format:** [Start/Stop/Continue, 4Ls, Mad/Sad/Glad, etc.]

**Retrospective Questions:**
1. What went well this sprint?
2. What didn't go well?
3. What should we start doing?
4. What should we stop doing?
5. What should we continue doing?

**Action Items** (from previous retro):
- [ ] [Action item]
- [ ] [Action item]

---

## 12. Success Metrics

### 12.1 Sprint Completion Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Committed Points | [#] | [#] | [Fill at sprint end] |
| Completed Points | [#] | [#] | [Fill at sprint end] |
| Velocity % | ≥ 90% | [%] | [Fill at sprint end] |
| Carryover Points | 0 | [#] | [Fill at sprint end] |

### 12.2 Quality Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Test Coverage | ≥ 80% | [%] | [Fill at sprint end] |
| Bugs Introduced | ≤ 5 | [#] | [Fill at sprint end] |
| Critical Bugs | 0 | [#] | [Fill at sprint end] |
| Code Review Time | < 4 hours | [hours] | [Fill at sprint end] |
| PR Merge Time | < 24 hours | [hours] | [Fill at sprint end] |

### 12.3 Project Health Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Sprint Goal Achieved | Yes | [Yes/No] | [Fill at sprint end] |
| Team Morale | ≥ 4/5 | [#/5] | [Fill at sprint end] |
| Blockers Resolved | 100% | [%] | [Fill at sprint end] |
| Stakeholder Satisfaction | ≥ 4/5 | [#/5] | [Fill at sprint end] |

---

## 13. Notes & Action Items

### 13.1 Planning Session Notes

**Decisions Made:**
- [Decision]: [Rationale]
- [Decision]: [Rationale]

**Open Questions:**
- [ ] [Question]: [Who will answer] by [Date]
- [ ] [Question]: [Who will answer] by [Date]

### 13.2 Action Items

| Action Item | Owner | Due Date | Status |
|-------------|-------|----------|--------|
| [Item] | [Name] | [Date] | [ ] |
| [Item] | [Name] | [Date] | [ ] |

---

## 14. Sprint Burndown Chart

**Track daily progress** (update at end of each day):

| Day | Date | Remaining Points | Ideal Burndown | Notes |
|-----|------|------------------|----------------|-------|
| 1 | [YYYY-MM-DD] | [#] | [#] | Sprint start |
| 2 | [YYYY-MM-DD] | [#] | [#] | |
| 3 | [YYYY-MM-DD] | [#] | [#] | |
| 4 | [YYYY-MM-DD] | [#] | [#] | |
| 5 | [YYYY-MM-DD] | [#] | [#] | Mid-sprint checkpoint |
| 6 | [YYYY-MM-DD] | [#] | [#] | |
| 7 | [YYYY-MM-DD] | [#] | [#] | |
| 8 | [YYYY-MM-DD] | [#] | [#] | |
| 9 | [YYYY-MM-DD] | [#] | [#] | |
| 10 | [YYYY-MM-DD] | 0 | 0 | Sprint end |

**Ideal Burndown Formula:**
```
Ideal Remaining (Day N) = Total Points × (10 - N) / 10
```

---

## 15. Lessons Learned (Fill at Sprint End)

### 15.1 What Worked Well
- [Item]
- [Item]

### 15.2 What Needs Improvement
- [Item]
- [Item]

### 15.3 Adjustments for Next Sprint
- [ ] [Adjustment]
- [ ] [Adjustment]

---

## Appendix A: Estimation Reference

### Story Point Scale (Fibonacci)

| Points | Complexity | Estimated Hours | Example |
|--------|------------|-----------------|---------|
| 1 | Trivial | 1-2 hours | Update text label, fix typo |
| 2 | Simple | 2-4 hours | Add validation rule, simple API endpoint |
| 3 | Moderate | 4-6 hours | CRUD API endpoint, simple UI form |
| 5 | Complex | 1-2 days | Complex form with validation, database migration |
| 8 | Very Complex | 2-3 days | Feature with multiple components, integration work |
| 13 | Epic | 3-5 days | Full workflow implementation, complex business logic |
| 21+ | Too Large | > 1 week | **BREAK DOWN INTO SMALLER TASKS** |

### Planning Poker

**Process:**
1. Product Owner reads user story
2. Team asks clarifying questions
3. Each member privately selects estimate
4. All reveal simultaneously
5. Discuss highest and lowest estimates
6. Re-vote until consensus

---

## Appendix B: Task Template

**Use this template when creating GitHub issues:**

```markdown
## Task: [Task Name]

**Epic:** [Epic Name]
**Priority:** [P0/P1/P2/P3]
**Story Points:** [#]
**Assignee:** [Name]
**Sprint:** Sprint [#]

### Description
[Clear description of what needs to be built]

### Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### Technical Notes
- [Any technical considerations]
- [Architecture decisions]
- [API endpoints involved]

### Dependencies
- [ ] [Task ID]: [Task name]
- [ ] [External dependency]

### Testing Requirements
- [ ] Unit tests (≥80% coverage)
- [ ] Integration tests (if API)
- [ ] E2E tests (if UI)

### Documentation Requirements
- [ ] API docs updated
- [ ] README updated
- [ ] Inline comments for complex logic

### Definition of Done
- [ ] Code complete and reviewed
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Merged to main
- [ ] Deployed to staging
- [ ] Acceptance criteria met
```

---

**Document Version:** 1.0
**Last Updated:** [YYYY-MM-DD]
**Template Maintained By:** [Scrum Master / Project Manager]
