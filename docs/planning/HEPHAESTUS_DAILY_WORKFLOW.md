# Hephaestus Daily Development Workflow - Phase 1 (2-Person Pilot Team)

**Created:** December 15, 2025
**Team:** Clay Campbell + Senior Developer
**Duration:** Days 1-14 (Phase 1 Foundation)
**Status:** Active - Ready to Execute

---

## Overview

This document defines the daily development workflow for executing Phase 1 of the Hephaestus framework with a 2-person pilot team. You'll work in parallel on independent workstreams, syncing at key checkpoints.

**Key Principles:**
- **Divide and Conquer** - Maximize velocity through parallel execution
- **Daily Sync** - 15-minute standup + async updates
- **Claude Code Integration** - Both developers use AI-assisted development
- **Jira-Driven** - All work tracked through Hephaestus ticket workflow
- **Dependency Awareness** - Clear handoff points when workstreams intersect

---

## Workstream Division

### Workstream A: Local Development & Database (You - Clay)

**Epic DP01-65:** LocalStack Development Environment
**Tasks:** DP01-148 through DP01-155 (8 tasks)
**Focus:** Build local development environment that saves $95K/year

**Your Responsibilities:**
1. Docker Compose configuration
2. LocalStack AWS resource initialization
3. PostgreSQL database schema (13 tables)
4. Node.js API examples
5. Developer onboarding documentation

**Why This Workstream:**
- Hands-on learning with full stack (Docker, AWS SDK, database, API)
- Self-contained - minimal dependencies on senior dev
- Creates foundation for team onboarding
- Repeatable exercise for future developers

### Workstream B: Production Infrastructure & CI/CD (Senior Dev)

**Epic DP01-21:** Technical Foundation
**Epic DP01-40:** DevOps & Infrastructure
**Tasks:** DP01-6 through DP01-13, DP01-74 through DP01-147
**Focus:** Production AWS accounts, CI/CD pipelines, infrastructure as code

**Senior Dev Responsibilities:**
1. AWS account structure (dev/staging/prod)
2. VPC, RDS, S3 production setup
3. GitHub Actions CI/CD pipelines
4. Terraform infrastructure as code
5. Monitoring, logging, secrets management

**Why This Workstream:**
- Leverages senior dev's infrastructure experience
- Security-critical decisions (IAM, networking)
- Parallel execution with minimal overlap
- Establishes production deployment patterns

---

## Dependency Map

### Sequential Dependencies (Must Complete in Order)

**Workstream A (LocalStack):**
```
DP01-148 (Docker Compose)
  └─> DP01-149 (LocalStack Init)
        └─> DP01-150 (Database Schema)
              └─> DP01-151 (Node.js API)
                    └─> DP01-152 (Quickstart Guide)
                          └─> DP01-153 (Comprehensive Plan)
                                └─> DP01-154 (README Update)
                                      └─> DP01-155 (E2E Testing)
```

**Workstream B (Infrastructure):**
```
Branch 1 (AWS):
  DP01-74 (AWS Organizations)
    └─> DP01-80 (VPC)
          └─> DP01-78 (RDS)

Branch 2 (CI/CD):
  DP01-9 (Git Repo) + DP01-75 (IAM Roles)
    └─> DP01-12 (CI/CD Setup)
          ├─> DP01-134 (Test Pipeline)
          └─> DP01-135 (Build Pipeline)
                └─> DP01-136 (Deploy to Dev)
```

### Integration Points (Week 2)

- **DP01-150 ↔ DP01-78:** Database schema must match (LocalStack ↔ RDS)
- **DP01-151 ↔ DP01-134:** API tests run in CI pipeline
- **DP01-9 ↔ DP01-148:** Repository structure needed for Docker Compose

---

## Daily Workflow Pattern

### Morning Routine (9:00 AM - 15 min)

**Async Standup in Slack #connect-standup**

Each person posts:

```
**Yesterday:**
- Completed: [Ticket key + title]
- Moved to VALIDATION/DONE: [List]

**Today:**
- Working on: [Ticket key + title moving to IN PROGRESS]
- Expected completion: [EOD or specific time]

**Blockers:**
- Waiting on: [None or specific ticket/person]

**Sync Needs:**
- Need review/discussion: [Yes/No - what topic]
```

**Example:**
```
**Yesterday:**
- Completed: DP01-148 (Docker Compose Configuration)
- Moved to VALIDATION: DP01-148

**Today:**
- Working on: DP01-149 (LocalStack AWS Resource Initialization)
- Expected completion: EOD

**Blockers:**
- None

**Sync Needs:**
- No sync needed today
```

### During the Day (Async Work)

#### Step 1: Pull Next Task from Jira

**Query Jira for ready tasks:**

Use JQL filter:
```
project = DP01 AND assignee = currentUser() AND status = "Ready for Development" ORDER BY priority DESC
```

Or with Claude Code:
```
"Use jira-automation to show me my tasks that are ready to start, sorted by priority"
```

**Check dependencies:**
- Are all blocking tickets DONE?
- If blocked, work on different ticket or sync with other dev

#### Step 2: Move to IN PROGRESS

**Update Jira status:**

With Claude Code:
```
"Move DP01-148 to 'In Progress' status and add comment:
'Starting implementation. Will have Docker Compose config ready by EOD.'"
```

Or manually in Jira UI.

#### Step 3: Work with Claude Code

**Prompt Pattern:**

```
I'm working on Jira ticket [TICKET-KEY]: [TITLE].

[Paste ticket description from Jira]

Requirements:
- [List key requirements]

Autonomy Level: [HIGH/MEDIUM/LOW]

Context files to read:
- [List relevant docs]

Please [specific request - create, implement, review, etc.]
```

**Example:**
```
I'm working on Jira ticket DP01-148: Docker Compose Configuration.

Requirements:
- LocalStack container (port 4566) with S3, SQS, SNS, Secrets Manager, CloudWatch
- PostgreSQL 15 container (port 5432)
- Redis 7 container (port 6379)
- pgAdmin container (port 5050)

Autonomy Level: HIGH

Context files to read:
- docs/planning/LOCAL_DEVELOPMENT_PLAN.md (sections 5-6)

Please create docker-compose.yml at the repository root with all required services.
```

#### Step 4: Validate Implementation

**Run validation gates from ticket:**

Each ticket has validation criteria. Example for DP01-148:

```bash
# Automated validation
docker-compose config  # Should parse without errors
docker-compose up -d   # Should start all 4 services
docker-compose ps      # All services "Up"

# Manual validation
curl http://localhost:4566/_localstack/health  # Should return health status
redis-cli -h localhost ping  # Should return PONG
```

**Self-validation checklist:**
- [ ] All automated checks pass
- [ ] Manual validation complete
- [ ] Code reviewed (yourself - look for security, errors)
- [ ] Documentation updated if needed
- [ ] No hardcoded credentials or secrets

#### Step 5: Move to VALIDATION

**Update Jira:**

```
"Move DP01-148 to 'Validation' status and add comment with validation results:

Validation Complete:
✓ docker-compose config - no errors
✓ All 4 services started successfully
✓ LocalStack health check passed
✓ Redis ping successful
✓ pgAdmin UI accessible at localhost:5050

Ready for review. Branch: clay/localstack-docker-compose
Commit: [commit hash]"
```

#### Step 6: Code Review (If Needed)

**When to request review:**
- Security-sensitive code (auth, secrets, permissions)
- Architectural decisions
- Integration points with other workstream
- When ticket autonomy level is LOW

**How to request:**
- Tag senior dev in Jira comment
- Or ping in Slack with ticket link
- Include specific questions

**For most HIGH autonomy tasks:** Self-review sufficient, move directly to DONE.

#### Step 7: Move to DONE

**After validation passes:**

```
"Move DP01-148 to 'Done' status and add comment:

Implementation complete. All validation gates passed.

Deliverables:
- docker-compose.yml created at repository root
- All 4 services running (LocalStack, PostgreSQL, Redis, pgAdmin)
- Documentation updated in LOCAL_DEVELOPMENT_PLAN.md

Next task: DP01-149 (LocalStack Init) is now unblocked."
```

#### Step 8: Log Time in Everhour

**Track time spent:**

```
Use everhour-integration skill to log time:

"Log 3.5 hours on DP01-148 with comment:
'Docker Compose configuration complete. Set up LocalStack, PostgreSQL, Redis, pgAdmin containers with proper networking and volumes.'"
```

Or use Everhour browser extension/web UI.

### End of Day (5:00 PM - 5 min)

**Post async update in Slack:**

```
**EOD Update:**
- Completed today: [Tickets moved to DONE]
- In validation: [Tickets waiting on checks]
- Tomorrow: [Next ticket to start]
- Blockers for tomorrow: [Any dependencies]
```

---

## Weekly Sync Checkpoints

### Monday (Week Start - 30 min)

**Review:**
- Last week's accomplishments
- This week's goals (which tickets to complete)
- Any blockers or dependencies

**Plan:**
- Assign tickets if not already assigned
- Identify integration points for the week
- Schedule any pair programming sessions

### Wednesday (Mid-Week - 15 min)

**Check-in:**
- Progress toward weekly goals
- Any emerging blockers
- Integration point readiness

**Adjust:**
- Re-prioritize if needed
- Swap tickets if dependencies shift
- Schedule pair session for integration

### Friday (Week End - 30 min)

**Review:**
- Tickets completed this week
- Validation gate status
- Integration points tested

**Plan:**
- Next week's priorities
- Any rollover tickets
- Weekend work (if needed)

---

## Integration Workflows

### When Your Work Blocks the Other Developer

**Scenario:** You complete DP01-150 (Database Schema), which senior dev needs for DP01-78 (RDS setup).

**Workflow:**
1. Move your ticket to DONE
2. Add comment tagging senior dev: "@Senior Dev - Database schema is complete and validated. All 13 tables match PRD Section 7. You can now configure RDS with the same schema."
3. Post in Slack: "DP01-150 done - RDS can now be configured"
4. Senior dev pulls your schema and applies to RDS

### When You Need Something from the Other Developer

**Scenario:** You reach DP01-151 (Node.js API) and need DP01-134 (Test Pipeline) for integration testing.

**Workflow:**
1. Check DP01-134 status in Jira
2. If not done, post in Slack: "Heads up - I'll need DP01-134 (Test Pipeline) by [day] to integrate API tests"
3. Senior dev prioritizes accordingly
4. When ready, senior dev notifies you
5. You proceed with integration

### Pair Programming Sessions

**When to pair:**
- Integration points (database schema ↔ RDS)
- Architectural decisions affecting both workstreams
- Troubleshooting complex issues
- Knowledge transfer

**How to pair:**
1. Schedule 30-60 min block
2. Use screen share + voice
3. One person drives (keyboard), other navigates
4. Both use Claude Code for assistance
5. Document decisions in both tickets

---

## Hephaestus Workflow States

### BACKLOG
**Definition:** Task created, dependencies not met
**Who Can See:** Both devs (for planning)
**Action:** Wait for dependencies

### READY FOR DEVELOPMENT
**Definition:** All dependencies met, ready to start
**Who Pulls:** Developer assigned (or self-assign)
**Action:** Move to IN PROGRESS when starting

### IN PROGRESS
**Definition:** Developer actively working
**Expected Duration:** 2-4 hours (half-day) to 1-2 days max
**Action:** Implement, validate, move to VALIDATION

**⚠️ Red Flag:** If IN PROGRESS > 3 days, break into smaller tasks

### VALIDATION
**Definition:** Implementation complete, running checks
**Checks:**
- Automated tests/scripts pass
- Manual validation complete
- Code self-reviewed
- Documentation updated

**Action:** If all pass → DONE. If fail → back to IN PROGRESS

### DONE
**Definition:** All validation gates passed, deliverables complete
**Criteria:**
- Automated validation ✓
- Manual validation ✓
- Code reviewed (self or peer) ✓
- Time logged in Everhour ✓
- Dependent tickets notified ✓

**Action:** Pull next READY ticket

---

## Using Claude Code Effectively

### Pattern 1: Starting a Ticket

```
"I'm starting work on Jira ticket [KEY]. Help me:

1. Get full ticket details from Jira (description, acceptance criteria, comments)
2. Check dependencies - are all blockers DONE?
3. Identify context files I should read first
4. Create a work plan with validation checkpoints
5. Move ticket to 'In Progress' in Jira with comment"
```

### Pattern 2: During Implementation

```
"I'm implementing [specific feature] for DP01-[X].

[Describe what you're trying to accomplish]

Requirements:
- [List from ticket]

Autonomy Level: HIGH

Please [create/implement/review/debug] and explain your approach."
```

### Pattern 3: Validation

```
"I've completed DP01-[X]. Help me validate:

1. Run automated validation from ticket:
   [Paste validation commands]

2. If validation passes:
   - Move to VALIDATION in Jira
   - Add comment with results
   - Tag [person] if review needed

3. If validation fails:
   - Debug the issue
   - Fix and re-validate"
```

### Pattern 4: Completion

```
"DP01-[X] validation complete. Help me:

1. Move to DONE in Jira
2. Add completion comment with deliverables list
3. Notify [person] if this unblocks their work
4. Log [X] hours in Everhour with comment: '[work summary]'
5. Identify my next READY task"
```

---

## Troubleshooting Common Issues

### Issue: Ticket Blocked Longer Than Expected

**Symptoms:** You're waiting on other dev's ticket for >1 day
**Solution:**
1. Check if blocker is truly in DONE status (not just IN PROGRESS)
2. Ask in Slack for ETA
3. If urgent, offer to pair program to unblock faster
4. Meanwhile, work on different READY ticket from backlog

### Issue: Validation Keeps Failing

**Symptoms:** Can't get past VALIDATION state
**Solution:**
1. Review validation criteria - are you testing the right thing?
2. Ask Claude Code to debug: "Validation failing with error: [paste error]. How do I fix?"
3. If stuck > 2 hours, post in Slack with error details
4. Pair with senior dev if security/infrastructure issue

### Issue: No READY Tasks Available

**Symptoms:** All your tickets blocked, nothing to work on
**Solution:**
1. Check Jira for tickets in other epics (might be mislabeled)
2. Help unblock other dev's work (pair programming)
3. Write documentation or improve existing guides
4. Explore codebase and create improvement tickets

### Issue: Task Taking Way Longer Than Estimated

**Symptoms:** Simple task becomes multi-day effort
**Solution:**
1. Re-assess scope - is this really one task or multiple?
2. Create sub-tasks in Jira for remaining work
3. Move what's complete to DONE
4. Update estimates for remaining work
5. Sync with other dev to adjust schedule

---

## Success Metrics (Phase 1 - Days 1-14)

### Individual Developer Metrics

**Velocity:**
- Target: 3-5 tasks/week (depends on complexity)
- Track: Tickets moved to DONE per week

**Quality:**
- Target: >90% validation pass rate (first try)
- Track: Tickets that pass validation without rework

**Autonomy:**
- Target: 80% of tickets completed without help
- Track: Tickets completed independently vs. with assistance

**Time Accuracy:**
- Target: Actual time within 50% of estimate
- Track: Estimated vs. actual hours logged

### Team Metrics

**Phase 1 Completion:**
- Target: 100% of Phase 1 validation gates passed by Day 14
- Track: Gate-by-gate progress (4 gates total)

**Integration Success:**
- Target: Zero integration failures at checkpoints
- Track: Number of integration issues discovered

**Knowledge Transfer:**
- Target: Both devs understand both workstreams at high level
- Track: Can explain other's work in weekly review

---

## Phase 1 Validation Gates

### Gate 1: Infrastructure Ready (Day 7)

**Criteria:**
- [ ] GitHub repo accessible to all team members
- [ ] AWS dev environment provisioned
- [ ] CI/CD pipeline green on main branch
- [ ] LocalStack environment working locally
- [ ] Database schema validated

**Decision:** Proceed to Week 2 or extend Phase 1?

### Gate 2: Development Environment Working (Day 10)

**Criteria:**
- [ ] Backend runs on http://localhost:3000
- [ ] Frontend scaffold exists (if started)
- [ ] Database migrations execute successfully
- [ ] LocalStack integrates with CI pipeline

**Decision:** Integration checkpoints on track?

### Gate 3: Standards Established (Day 12)

**Criteria:**
- [ ] CODE_REVIEW_GUIDELINES.md approved by team
- [ ] First PR merged following all conventions
- [ ] Linting passes on all code
- [ ] Test coverage framework in place

**Decision:** Ready for team onboarding prep?

### Gate 4: Team Onboarded (Day 14)

**Criteria:**
- [ ] 100% of pilot team completed QUICK_START.md
- [ ] Both developers made ≥5 commits to main
- [ ] Slack channels active with daily standups
- [ ] Phase 1 retrospective completed

**Decision:** Proceed to Phase 2 (Core Data Model & Auth)?

---

## Transition to Phase 2 (Days 15-30)

### Preparing for Phase 2

**Week 2 Day 13-14:**
1. Review Phase 2 epics (DP01-22, DP01-23)
2. Break down epics into tasks (if not done)
3. Assign workstreams for Phase 2
4. Set up new team members (if joining)
5. Run Phase 1 retrospective

**Phase 2 Workstreams (Preliminary):**
- **Workstream A:** Database migrations + Prisma setup
- **Workstream B:** Authentication & JWT implementation
- **Integration:** RBAC middleware (both devs pair)

---

## Tools Quick Reference

### Jira Filters

**My Ready Tasks:**
```
project = DP01 AND assignee = currentUser() AND status = "Ready for Development"
```

**My In Progress:**
```
project = DP01 AND assignee = currentUser() AND status = "In Progress"
```

**Blocked Tasks:**
```
project = DP01 AND status != Done AND issueFunction in linkedIssuesOf('status != Done', 'is blocked by')
```

**Workstream A (LocalStack):**
```
project = DP01 AND (epic = DP01-65 OR labels = 'Workstream-A')
```

**Workstream B (Infrastructure):**
```
project = DP01 AND (epic IN (DP01-21, DP01-40) OR labels = 'Workstream-B')
```

### Claude Code Skills

**@jira-automation** - Full Jira automation toolkit
**@everhour-integration** - Time tracking
**@superpowers:brainstorming** - Design refinement

### Slack Channels

**#connect-standup** - Daily async updates
**#connect-dev** - Development discussions
**#connect-blockers** - Escalate blocking issues

---

## Next Steps

**Immediate (Today):**
1. ✅ Review this workflow document
2. ✅ Confirm Jira access and see your assigned tickets
3. ✅ Test Claude Code integration
4. ✅ Schedule Week 1 kickoff (30 min)

**Tomorrow (Day 1):**
1. Pull first READY ticket (DP01-148 for Clay, DP01-74 for Senior Dev)
2. Move to IN PROGRESS
3. Complete first implementation
4. Move to VALIDATION
5. Post EOD update in Slack

**This Week:**
1. Establish daily rhythm (morning standup, EOD update)
2. Complete 3-5 tickets each
3. Hit Week 1 sync checkpoint (Day 7)
4. Validate Gate 1: Infrastructure Ready

---

## Document Status

**Version:** 1.0
**Last Updated:** December 15, 2025
**Status:** Active - Ready to Execute
**Maintained By:** Clay Campbell + Senior Developer
**Review Schedule:** Weekly during Phase 1 retrospectives

**Feedback:** Submit improvements via PR to this document or discuss in #connect-dev

---

**Ready to start?** Pull your first ticket and let's build! 🚀
