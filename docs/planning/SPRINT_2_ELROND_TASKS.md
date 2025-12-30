# Sprint 2: Elrond's Task Assignment

**Developer:** Elrond Sheppard
**Sprint:** Sprint 2 (Jan 12-23, 2025)
**Focus:** Notification System Infrastructure (DP01-244)
**Total Effort:** 23 hours (5 tasks)

---

## Overview

You're building the **notification infrastructure** that enables all business workflows in Sprint 2. This is a **CRITICAL** foundation - Clay's 13 tasks depend on your notification system being complete.

**Strategy:** Complete all 5 tasks in Week 1 so Clay can integrate notifications in Week 2.

---

## Your Tasks (in dependency order)

### Week 1: Foundation Tasks (Run in Parallel)

#### 1. [DP01-274](https://vividcg.atlassian.net/browse/DP01-274) - Email Service Integration (5h 30m) - LOW autonomy
**What:** Mock email service using LocalStack SES (NOT real AWS SES)
**Why:** AWS SES production access won't be available in Sprint 2

**Key Points:**
- Use LocalStack SES emulator (docker-compose already configured)
- Log all emails to database (EmailLog table)
- Build admin UI to view sent emails (like MailCatcher)
- Flag-based switching: `USE_MOCK_SES=true` in .env
- Code must be production-ready (real SES = config change only)

**See:** [MOCK_NOTIFICATION_SERVICES.md](../development/MOCK_NOTIFICATION_SERVICES.md) Section 1

**Pair Programming:** Recommended (LOW autonomy) - Schedule with Clay or senior dev

---

#### 2. [DP01-275](https://vividcg.atlassian.net/browse/DP01-275) - SMS Service Integration (3h) - MEDIUM autonomy
**What:** Mock SMS service (NO real Twilio)
**Why:** Twilio account won't be available in Sprint 2

**Key Points:**
- Console logging + database storage (SmsLog table)
- 160 character limit validation
- Rate limiting: 10 SMS/day/user
- Flag-based switching: `USE_MOCK_TWILIO=true` in .env
- Simulate 1s delivery delay

**See:** [MOCK_NOTIFICATION_SERVICES.md](../development/MOCK_NOTIFICATION_SERVICES.md) Section 2

**Can run in parallel with DP01-274** - No dependencies between them

---

### Week 1: Integration Tasks (After DP01-274 & DP01-275)

#### 3. [DP01-276](https://vividcg.atlassian.net/browse/DP01-276) - Notification Template Management (4h) - MEDIUM autonomy
**What:** Template system for emails/SMS with variable interpolation
**Depends on:** DP01-274 (email), DP01-275 (SMS)

**Key Deliverables:**
- EmailTemplate CRUD API
- Variable interpolation (e.g., `{{user.name}}`, `{{project.address}}`)
- Template categories (task_assigned, permit_approved, correction_received)
- Preview endpoint (render template with sample data)

**Template Examples:**
```
Subject: Task Assigned - {{project.address}}
Body: Hi {{user.name}}, you've been assigned: {{task.description}}
```

---

#### 4. [DP01-277](https://vividcg.atlassian.net/browse/DP01-277) - User Notification Preferences (3h 30m) - MEDIUM autonomy
**What:** User preferences for notification delivery
**Depends on:** DP01-276 (references template categories)

**Key Features:**
- Per-category preferences (email/SMS/in-app)
- Quiet hours (e.g., no SMS 10pm-8am)
- Digest mode (daily summary vs real-time)
- Notification frequency limits

**UI:** Simple settings page with checkboxes per category

---

### Week 1: Queue & Delivery (CRITICAL - Ties Everything Together)

#### 5. [DP01-278](https://vividcg.atlassian.net/browse/DP01-278) - Notification Queue & Delivery Service (7h) - LOW autonomy
**What:** Queue processor that ties all notification services together
**Depends on:** DP01-274, DP01-275, DP01-276, DP01-277 (needs everything)

**Architecture:**
```
Application → NotificationQueue (SQS) → Processor → Email/SMS Services
```

**Key Components:**
- SQS queue for notifications (LocalStack SQS)
- Background worker (processes queue)
- Retry logic (3 attempts, exponential backoff)
- Dead letter queue (DLQ) for failed notifications
- Respects user preferences (DP01-277)
- Uses templates (DP01-276)

**This is the "glue" that makes everything work together**

**Pair Programming:** Strongly recommended (LOW autonomy, complex integration)

---

## Task Dependencies (Visual)

```
DP01-274 (Email)  ────┐
                      ├──> DP01-276 (Templates) ──┐
DP01-275 (SMS)    ────┘                           ├──> DP01-277 (Preferences) ──> DP01-278 (Queue)
                                                  │
                                                  └──────────────────────────────> DP01-278 (Queue)
```

**Critical Path:** DP01-278 depends on ALL other tasks being complete

---

## Sprint Strategy

### Week 1 (Jan 12-16) - YOUR SPRINT

**Monday-Tuesday:**
- Complete DP01-274 (Email) and DP01-275 (SMS) in parallel
- Pair programming session for DP01-274 (LOW autonomy)

**Wednesday:**
- Complete DP01-276 (Templates)

**Thursday:**
- Complete DP01-277 (Preferences)

**Friday:**
- Start DP01-278 (Queue)
- Pair programming session for DP01-278 (LOW autonomy)

### Week 2 (Jan 19-23) - SUPPORT CLAY

**Monday:**
- Finish DP01-278 (Queue)
- Integration testing with all components

**Tuesday-Friday:**
- Help Clay integrate notifications into business workflows:
  - DP01-263 → Email notifications for plan uploads
  - DP01-267 → SMS alerts for action item assignments
  - DP01-273 → Email alerts for permit approvals
- Bug fixes and refinements
- Admin UI polish

---

## Technical Stack

**Language:** Node.js + TypeScript
**Database:** PostgreSQL
**Queue:** LocalStack SQS (mock for AWS SQS)
**Email:** LocalStack SES (mock for AWS SES)
**SMS:** Console + Database (mock for Twilio)
**Testing:** Jest unit tests
**Docker:** All services run in docker-compose

---

## Key Documentation

1. **[MOCK_NOTIFICATION_SERVICES.md](../development/MOCK_NOTIFICATION_SERVICES.md)** - Complete implementation guide
2. **[SPRINT_2_TASK_BREAKDOWN.md](SPRINT_2_TASK_BREAKDOWN.md)** - Full technical specs (pages 16-21)
3. **[TIME_ESTIMATION_METHODOLOGY.md](TIME_ESTIMATION_METHODOLOGY.md)** - Autonomy level definitions

---

## Autonomy Levels Explained

### HIGH Autonomy (0 tasks)
- Claude can complete 80-100% independently
- Minimal human guidance needed

### MEDIUM Autonomy (3 tasks: DP01-275, DP01-276, DP01-277)
- Claude can complete 50-80% independently
- 2-3 checkpoints with human developer
- Collaborative approach

### LOW Autonomy (2 tasks: DP01-274, DP01-278)
- Claude can complete 30-50% independently
- Pair programming recommended
- Significant human guidance
- **These are the critical, high-risk tasks**

---

## Acceptance Criteria (All 5 Tasks)

By end of Sprint 2, you should be able to:

### Functional
- ✅ Send email notification → Logged in database, visible in admin UI
- ✅ Send SMS notification → Logged in database, visible in admin UI
- ✅ Create email template → Render with variables, preview works
- ✅ Set user preferences → Notifications respect preferences (email vs SMS)
- ✅ Queue notification → Processed within 5 seconds, retries on failure

### Technical
- ✅ All emails use LocalStack SES endpoint (not real AWS)
- ✅ All SMS are mocked (console + database, not real Twilio)
- ✅ Flag-based switching works (`USE_MOCK_SES=true/false`)
- ✅ Database migrations create all required tables
- ✅ Admin UI accessible at `/admin/notifications`
- ✅ Unit tests pass (80%+ coverage)

### Production Readiness
- ✅ Code can switch to real SES/Twilio by changing .env flags
- ✅ No hardcoded mock logic (all behind feature flags)
- ✅ Error handling and logging in place
- ✅ Dead letter queue handles failed notifications

---

## Database Tables You'll Create

1. **email_log** - Logs all sent emails (real or mock)
2. **sms_log** - Logs all sent SMS (real or mock)
3. **email_template** - Template definitions with variables
4. **user_notification_preferences** - User settings per category
5. **notification_queue** - Queue entries (if using database-backed queue)

**See migrations:** [MOCK_NOTIFICATION_SERVICES.md](../development/MOCK_NOTIFICATION_SERVICES.md) Section 3

---

## Testing Strategy

### Unit Tests (Required)
```javascript
// tests/services/email.service.test.js
- Email sends and logs to database
- Mock delivery simulation works
- Error handling logs failures

// tests/services/sms.service.test.js
- SMS sends and logs to database
- Rate limiting enforced (10/day)
- 160 character limit validation

// tests/services/notification-queue.test.js
- Queue processes notifications
- Retry logic works (3 attempts)
- User preferences respected
```

### Integration Tests
```javascript
// tests/integration/notification.test.js
- End-to-end: Queue → Process → Email sent
- Template rendering with variables
- Preferences override delivery method
```

### Manual Testing
- View emails in admin UI (`/admin/emails`)
- View SMS in admin UI (`/admin/sms`)
- Check console logs for debugging
- Verify database entries

---

## Common Issues & Solutions

### "LocalStack SES not responding"
```bash
# Check LocalStack is running
docker-compose ps localstack

# Check SES is enabled
docker-compose logs localstack | grep SES

# Restart if needed
docker-compose restart localstack
```

### "Emails not appearing in admin UI"
- Check database: `SELECT * FROM email_log ORDER BY created_at DESC;`
- Verify service is using correct database connection
- Check console logs for errors

### "How do I know if production migration will work?"
- Code should have ZERO `if (mock)` conditionals in business logic
- All mock logic should be in service initialization only
- Test by toggling `USE_MOCK_SES=false` (will fail without real AWS, but shouldn't crash)

---

## Success Metrics

**Your goal:** Enable Clay to integrate 3 notification touchpoints by end of Week 2

1. **DP01-263** (Plan Upload) → Email notification to architect
2. **DP01-267** (Action Item) → SMS alert to assigned user
3. **DP01-273** (Permit Approved) → Email notification to servicing team

**If these 3 work end-to-end, Sprint 2 is a success.**

---

## Questions? Blockers?

**Slack:** #sprint-2-dev
**Pair Programming:** Schedule with Clay or senior dev for LOW autonomy tasks
**Office Hours:** Daily standup at 9am

---

## Final Checklist (Before Starting)

- [ ] Read [MOCK_NOTIFICATION_SERVICES.md](../development/MOCK_NOTIFICATION_SERVICES.md) fully
- [ ] Understand why we're using mocks (no AWS/Twilio access)
- [ ] Review all 5 tasks in Jira (DP01-274 to DP01-278)
- [ ] Understand dependency chain (can't do DP01-278 until others complete)
- [ ] Schedule pair programming for DP01-274 and DP01-278
- [ ] Setup local environment (docker-compose up)
- [ ] Verify LocalStack is running (`docker-compose ps`)

---

**You've got this! This is foundational work that enables the entire Sprint 2 delivery. Take your time on the LOW autonomy tasks - they're the most critical.**

---

**Document Version:** 1.0
**Last Updated:** December 30, 2024
**Prepared by:** Clay Campbell
**Sprint:** Sprint 2 (Jan 12-23, 2025)
