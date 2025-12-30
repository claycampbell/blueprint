# Sprint 2: VS2 Entitlement 2 - Detailed Task Breakdown

**Sprint**: Sprint 2: VS2 Entitlement 2
**Dates**: Jan 12 - Jan 23, 2025
**Stories**: 4 Track 3 platform stories
**Approach**: Hephaestus model with interdependency identification

---

## Story 1: DP01-217 - Design Customization Interface

**Epic**: DP01-199: Track 3: Entitlement & Permitting (VS2)
**Summary**: Architect portal with CAD integration placeholder
**Story Points**: TBD
**Priority**: High (enables architect collaboration)

### Context & Business Value

Architects need a dedicated portal to:
- Review customization requests from the design team
- Upload revised plans in response to client or regulatory feedback
- Track revision history across design iterations
- Prepare for future CAD integration (post-MVP placeholder)

**Dependencies**:
- **Requires**: DP01-244 (Notification System) for architect task alerts
- **Requires**: Authentication system (assume exists or part of DP01-23)
- **Enables**: DP01-216 (Plan Library Integration) - revised plans feed into library
- **Enables**: DP01-221 (Correction Cycle Management) - architect responds to city feedback

### Subtasks

#### Task 1: Architect Authentication & Portal Access
**Description**: Implement secure external authentication for architects with role-based access control.

**Technical Details**:
- Extend existing auth system (DP01-23) with "Architect" role
- Create architect user management (invite, activate, deactivate)
- External user access (separate from internal staff auth)
- Multi-tenant consideration: Architect may work on multiple projects

**Deliverables**:
- Architect registration/invitation flow
- Login page with email/password or SSO
- Role assignment: "Architect" with project-level permissions
- Session management and token refresh

**Acceptance Criteria**:
- ✅ Architects can register via invitation link
- ✅ Login authenticates against correct tenant
- ✅ Session persists for 7 days (configurable)
- ✅ Only assigned projects visible to architect
- ✅ Admin can deactivate architect access

**Interdependencies**:
- **Depends on**: DP01-23 (Auth system base implementation)
- **Provides to**: All architect portal features (Tasks 2-5)

**Estimated Effort**: 2-3 days

---

#### Task 2: Customization Request Dashboard
**Description**: Build dashboard displaying assigned customization requests with status, priority, and deadlines.

**Technical Details**:
- Query customization requests assigned to logged-in architect
- Display: Project name, request type, description, deadline, status
- Filtering: By status (New, In Progress, Submitted), project, date range
- Sorting: By deadline (urgent first), created date, project
- Real-time updates via WebSocket or polling (when new requests assigned)

**Data Model** (tentative):
```
CustomizationRequest {
  id: UUID
  project_id: FK → Project
  architect_id: FK → User (Architect)
  request_type: ENUM (Plan Revision, Regulatory Change, Client Preference)
  description: TEXT
  requested_by: FK → User (Design Team)
  deadline: DATE
  status: ENUM (New, In Progress, Submitted, Approved)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

**Deliverables**:
- React dashboard component
- API endpoint: `GET /api/customization-requests?architect_id={id}&status={status}`
- Filter/sort UI controls
- Mobile-responsive layout

**Acceptance Criteria**:
- ✅ Dashboard shows all assigned requests
- ✅ Status badges clearly visible (color-coded)
- ✅ Overdue requests highlighted in red
- ✅ Clicking request opens detail view
- ✅ Dashboard auto-refreshes every 60 seconds

**Interdependencies**:
- **Depends on**: Task 1 (Architect auth)
- **Depends on**: Project data model (assume exists from DP01-15 to DP01-20)
- **Provides to**: Task 3 (Upload interface uses same request context)

**Estimated Effort**: 3-4 days

---

#### Task 3: Plan Upload & Document Management
**Description**: File upload interface for architects to submit revised plans (PDFs, CAD files, images).

**Technical Details**:
- File upload to AWS S3 (use existing integration or create)
- Accepted formats: PDF, DWG, DXF, PNG, JPG (max 50MB per file)
- Multi-file upload (drag-and-drop + file picker)
- Upload progress indicator
- Virus scanning (AWS S3 + ClamAV or similar)
- Generate thumbnails for image files
- Link uploaded files to CustomizationRequest

**Data Model** (tentative):
```
UploadedPlan {
  id: UUID
  customization_request_id: FK → CustomizationRequest
  file_name: VARCHAR(255)
  file_type: VARCHAR(50)
  file_size: INT (bytes)
  s3_key: VARCHAR(512)
  s3_bucket: VARCHAR(255)
  uploaded_by: FK → User (Architect)
  uploaded_at: TIMESTAMP
  version: INT (auto-increment per request)
}
```

**Deliverables**:
- File upload React component (drag-and-drop)
- API endpoint: `POST /api/customization-requests/{id}/upload`
- S3 upload handler with presigned URLs
- File validation (type, size, virus scan)
- Upload confirmation UI

**Acceptance Criteria**:
- ✅ Architects can drag-drop files or use file picker
- ✅ Multiple files uploaded in single batch
- ✅ Upload progress shown (0-100%)
- ✅ Files stored in S3 with UUID-based keys
- ✅ Malicious files rejected with clear error message
- ✅ Upload triggers notification to design team (via DP01-244)

**Interdependencies**:
- **Depends on**: Task 2 (Dashboard provides request context)
- **Depends on**: AWS S3 setup (assume exists or part of DP01-21)
- **Depends on**: DP01-244 (Notification System) for upload alerts
- **Provides to**: Task 4 (Revision history displays uploaded files)

**Estimated Effort**: 4-5 days

---

#### Task 4: Revision History & Version Tracking
**Description**: Display chronological revision history for each customization request with version comparison.

**Technical Details**:
- Query all UploadedPlan records for a CustomizationRequest, ordered by version
- Display: Version number, file name, upload date, architect name
- Download link for each version
- Visual diff for images (side-by-side comparison)
- CAD diff placeholder (future: overlay DWG files)

**Deliverables**:
- Revision history React component
- API endpoint: `GET /api/customization-requests/{id}/revisions`
- File download endpoint: `GET /api/files/{file_id}/download` (presigned S3 URL)
- Image comparison UI (side-by-side viewer)

**Acceptance Criteria**:
- ✅ All versions listed in reverse chronological order
- ✅ Current version highlighted
- ✅ Each version downloadable via secure link
- ✅ Image versions show side-by-side comparison
- ✅ Version notes displayed (architect can add comments)

**Interdependencies**:
- **Depends on**: Task 3 (Upload creates versioned files)
- **Provides to**: Design team workflow (DP01-216 Plan Library Integration)

**Estimated Effort**: 2-3 days

---

#### Task 5: CAD Integration Placeholder UI
**Description**: Create UI placeholder for future CAD integration with clear messaging and roadmap visibility.

**Technical Details**:
- Display "Coming Soon: CAD Integration" banner on plan upload page
- Placeholder for CAD viewer (empty iframe or placeholder image)
- Tooltip explaining future functionality:
  - "Direct DWG file editing in browser"
  - "Layer-based markup and annotations"
  - "Real-time collaboration with design team"
- Link to roadmap or feature request form

**Deliverables**:
- CAD placeholder React component
- Informational modal explaining roadmap
- Analytics tracking (how many architects click "Learn More")

**Acceptance Criteria**:
- ✅ Placeholder visible on plan detail page
- ✅ Tooltip clearly explains future functionality
- ✅ Does not block current workflow (just informational)
- ✅ Analytics event fired when architects engage with placeholder

**Interdependencies**:
- **Depends on**: Task 3 (Displayed on plan upload page)
- **Future dependency**: Post-MVP CAD integration (Days 91-180)

**Estimated Effort**: 1 day

---

### Story 1 Summary

**Total Estimated Effort**: 12-16 days (can be parallelized with 2-3 developers)
**Critical Path**: Task 1 → Task 2 → Task 3 → Task 4
**Parallelizable**: Task 5 can be done anytime after Task 3

**Key Risks**:
- S3 upload performance with large CAD files (50MB+)
- Virus scanning delay impacting UX
- Architect authentication scope (SSO vs email/password)

---

## Story 2: DP01-221 - Correction Cycle Management

**Epic**: DP01-199: Track 3: Entitlement & Permitting (VS2)
**Summary**: Log city feedback, create action items, track resolution
**Story Points**: TBD
**Priority**: High (critical for permit approval workflow)

### Context & Business Value

City/municipality feedback during permit review requires:
- Structured capture of correction requests
- Automatic action item creation for responsible parties
- Task assignment and tracking
- Resubmission workflow when all corrections addressed

**Dependencies**:
- **Requires**: DP01-244 (Notification System) for correction alerts
- **Requires**: DP01-242 (Workflow Engine) for resubmission state transitions
- **Requires**: DP01-217 (Design Customization Interface) - architects respond to corrections
- **Enables**: DP01-220 (Permit Submission & Tracking) - resubmission workflow

### Subtasks

#### Task 1: City Feedback Capture Form
**Description**: Structured form for design team to log city/municipality feedback with categorization and severity.

**Technical Details**:
- Form fields:
  - Feedback source: City name, reviewer name, feedback date
  - Category: ENUM (Zoning, Setback, Fire Code, Accessibility, Other)
  - Severity: ENUM (Critical - blocks approval, Major - requires resubmit, Minor - optional)
  - Description: Rich text editor (support images, links)
  - Affected plan sheets: Multi-select (links to uploaded plans from DP01-216)
  - Deadline: Date picker (city-imposed deadline)
- Save as draft (auto-save every 30 seconds)
- Submit feedback (creates action items)

**Data Model** (tentative):
```
CityFeedback {
  id: UUID
  project_id: FK → Project
  permit_submission_id: FK → PermitSubmission (from DP01-220)
  city_name: VARCHAR(255)
  reviewer_name: VARCHAR(255)
  feedback_date: DATE
  category: ENUM
  severity: ENUM
  description: TEXT (rich text HTML)
  affected_sheets: JSON (array of plan sheet IDs)
  deadline: DATE
  status: ENUM (Open, In Progress, Resolved, Closed)
  created_by: FK → User (Design Team)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

**Deliverables**:
- City feedback form React component
- API endpoint: `POST /api/city-feedback`
- Rich text editor integration (Quill, TipTap, or similar)
- Auto-save functionality
- Form validation

**Acceptance Criteria**:
- ✅ All required fields validated before submit
- ✅ Draft saved automatically every 30 seconds
- ✅ Image upload within feedback description
- ✅ Affected plan sheets linked via multi-select
- ✅ Severity color-coded (Critical=red, Major=orange, Minor=yellow)

**Interdependencies**:
- **Depends on**: DP01-220 (Permit Submission model exists)
- **Depends on**: DP01-216 (Plan Library for affected sheet references)
- **Provides to**: Task 2 (Creates action items from feedback)

**Estimated Effort**: 3-4 days

---

#### Task 2: Automatic Action Item Creation
**Description**: Auto-generate action items from city feedback and assign to responsible parties based on category rules.

**Technical Details**:
- Action item creation triggered on CityFeedback submit
- Assignment rules engine:
  - Zoning → Acquisitions team lead
  - Setback → Architect (via DP01-217)
  - Fire Code → Design team + architect
  - Accessibility → Architect + city consultant
  - Other → Design team lead (manual re-assign)
- Action item inherits: Category, severity, deadline, description
- Link action item to parent CityFeedback

**Data Model** (tentative):
```
CorrectionActionItem {
  id: UUID
  city_feedback_id: FK → CityFeedback
  title: VARCHAR(255) (auto-generated: "Resolve {category} correction")
  description: TEXT (copied from CityFeedback.description)
  assigned_to: FK → User
  assigned_by: FK → User (system or design team)
  category: ENUM (inherited from CityFeedback)
  severity: ENUM (inherited from CityFeedback)
  deadline: DATE (inherited from CityFeedback)
  status: ENUM (Open, In Progress, Resolved, Verified)
  resolution_notes: TEXT
  resolved_at: TIMESTAMP
  created_at: TIMESTAMP
}
```

**Deliverables**:
- Action item creation service (backend)
- Assignment rules engine (configurable rules in DB or config file)
- API endpoint: `POST /api/city-feedback/{id}/create-action-items`
- Bulk action item creation (one feedback → multiple action items if needed)

**Acceptance Criteria**:
- ✅ Action items created automatically on feedback submit
- ✅ Assigned to correct party based on category rules
- ✅ Action item links back to parent feedback
- ✅ Notification sent to assignee (via DP01-244)
- ✅ Admin can override assignment rules

**Interdependencies**:
- **Depends on**: Task 1 (City feedback model)
- **Depends on**: DP01-244 (Notification System) for assignment alerts
- **Provides to**: Task 3 (Task assignment tracking)

**Estimated Effort**: 3-4 days

---

#### Task 3: Task Assignment & Tracking Dashboard
**Description**: Dashboard for design team and architects to view, filter, and manage correction action items.

**Technical Details**:
- Two views:
  1. **My Tasks**: Action items assigned to logged-in user
  2. **Team Tasks**: All action items for projects user has access to
- Filtering: By status, severity, category, deadline, project
- Sorting: By deadline (urgent first), severity, created date
- Kanban board view: Open | In Progress | Resolved | Verified
- Bulk actions: Reassign, change status, update deadline
- Task detail modal: Full description, comments, resolution notes

**Deliverables**:
- Task dashboard React component
- API endpoint: `GET /api/correction-action-items?assigned_to={id}&status={status}`
- Kanban board UI (drag-and-drop status transitions)
- Task detail modal with inline editing
- Comment thread component (team collaboration on task)

**Acceptance Criteria**:
- ✅ Dashboard shows all assigned tasks with filters
- ✅ Overdue tasks highlighted in red
- ✅ Drag-drop to change status (triggers state update)
- ✅ Task detail shows full context (linked feedback, plan sheets)
- ✅ Comments visible to all team members on project

**Interdependencies**:
- **Depends on**: Task 2 (Action items created)
- **Depends on**: DP01-242 (Workflow Engine) for status transitions
- **Provides to**: Task 4 (Resubmission workflow needs "all resolved" check)

**Estimated Effort**: 4-5 days

---

#### Task 4: Resubmission Workflow & Completion Tracking
**Description**: Track correction resolution and trigger resubmission workflow when all action items resolved.

**Technical Details**:
- Check all CorrectionActionItems for a CityFeedback:
  - If all status = "Resolved" → CityFeedback.status = "Ready for Resubmission"
  - If any status = "Open" or "In Progress" → CityFeedback.status = "In Progress"
- Resubmission checklist:
  - All action items resolved
  - Updated plans uploaded (link to DP01-217)
  - Design team verification complete
- Trigger PermitSubmission workflow (DP01-220) for resubmission
- Notification to city contact (external email via DP01-244)

**Data Model Update**:
```
PermitSubmission {
  ...existing fields...
  is_resubmission: BOOLEAN
  original_submission_id: FK → PermitSubmission (null if first submission)
  correction_feedback_ids: JSON (array of CityFeedback IDs)
}
```

**Deliverables**:
- Resubmission readiness check service
- API endpoint: `GET /api/city-feedback/{id}/resubmission-status`
- Resubmission checklist UI component
- Workflow trigger: `POST /api/permit-submissions/{id}/resubmit`

**Acceptance Criteria**:
- ✅ Resubmission blocked until all action items resolved
- ✅ Checklist shows progress (X/Y items resolved)
- ✅ Resubmission creates new PermitSubmission linked to original
- ✅ City contact notified of resubmission (external email)
- ✅ Correction cycle history preserved (audit trail)

**Interdependencies**:
- **Depends on**: Task 3 (Task tracking provides resolution status)
- **Depends on**: DP01-220 (Permit Submission workflow)
- **Depends on**: DP01-244 (Notification System) for city notification
- **Provides to**: DP01-220 (Resubmission workflow integration)

**Estimated Effort**: 3-4 days

---

### Story 2 Summary

**Total Estimated Effort**: 13-17 days (can be parallelized with 2-3 developers)
**Critical Path**: Task 1 → Task 2 → Task 3 → Task 4
**Parallelizable**: None (sequential workflow)

**Key Risks**:
- Assignment rules complexity (may need AI/ML for intelligent routing)
- City notification delivery (email deliverability, spam filters)
- Workflow engine integration scope (DP01-242 may not be complete)

---

## Story 3: DP01-223 - Cross-Team Visibility (Entitlement Status)

**Epic**: DP01-199: Track 3: Entitlement & Permitting (VS2)
**Summary**: Servicing team can view entitlement status for upcoming loans
**Story Points**: TBD
**Priority**: Medium (enables proactive loan prep)

### Context & Business Value

Servicing team needs early visibility into entitlement progress to:
- Prepare for upcoming loan originations
- Forecast loan pipeline and capacity
- Coordinate builder relationships
- Alert when permit approved (handoff to loan origination)

**Dependencies**:
- **Requires**: Role-based access control (RBAC) system
- **Requires**: DP01-244 (Notification System) for permit approval alerts
- **Enables**: Cross-functional collaboration (Design → Servicing handoff)

### Subtasks

#### Task 1: Cross-Team Permission Model
**Description**: Implement RBAC to grant servicing team read-only access to entitlement data.

**Technical Details**:
- Roles:
  - `Design Team`: Full CRUD on entitlement projects
  - `Servicing Team`: Read-only on entitlement projects
  - `Admin`: Full access to all data
- Permissions:
  - `entitlement.view`: Can view project details, status, timeline
  - `entitlement.edit`: Can update project data (Design Team only)
  - `entitlement.delete`: Can delete projects (Admin only)
- Middleware to enforce permissions on API endpoints
- UI components conditionally render edit/delete buttons based on role

**Data Model** (tentative):
```
UserRole {
  id: UUID
  user_id: FK → User
  role: ENUM (Design Team, Servicing Team, Acquisitions Team, Admin)
  scope: ENUM (Global, Project-specific)
  project_id: FK → Project (null if Global)
}

Permission {
  id: UUID
  role: ENUM (Design Team, Servicing Team, etc.)
  resource: VARCHAR(50) (e.g., "entitlement")
  action: ENUM (view, edit, delete)
}
```

**Deliverables**:
- RBAC middleware (Node.js/Express)
- API endpoint: `GET /api/permissions?user_id={id}`
- Role assignment UI (Admin only)
- Permission check helper functions (frontend and backend)

**Acceptance Criteria**:
- ✅ Servicing team users can view entitlement projects
- ✅ Servicing team cannot edit or delete entitlement data
- ✅ API returns 403 Forbidden if unauthorized action attempted
- ✅ UI hides edit/delete buttons for read-only users
- ✅ Admin can assign/revoke roles dynamically

**Interdependencies**:
- **Depends on**: User authentication system (DP01-23)
- **Provides to**: All cross-team visibility features (Tasks 2-4)

**Estimated Effort**: 3-4 days

---

#### Task 2: Entitlement Status Display for Servicing
**Description**: Create servicing-focused dashboard showing entitlement projects and their approval status.

**Technical Details**:
- Dashboard view for servicing team:
  - Project name, address, borrower name
  - Entitlement status: ENUM (Submitted, Under Review, Corrections Needed, Approved, Rejected)
  - Estimated permit approval date
  - Days in entitlement process (calculated field)
  - Loan readiness indicator (green if permit approved, yellow if close, red if delayed)
- Filtering: By status, estimated approval date, city/jurisdiction
- Sorting: By estimated approval date (soonest first)

**Deliverables**:
- Servicing dashboard React component
- API endpoint: `GET /api/entitlement-projects?view=servicing`
- Read-only project detail view (no edit capability)
- Status badge component (color-coded)

**Acceptance Criteria**:
- ✅ Servicing team sees all projects in entitlement phase
- ✅ Status clearly visible with color-coded badges
- ✅ Estimated approval date calculated from city timelines
- ✅ Projects nearing approval highlighted (within 30 days)
- ✅ Read-only mode enforced (no edit buttons visible)

**Interdependencies**:
- **Depends on**: Task 1 (Permission model enforces read-only)
- **Depends on**: DP01-220 (Permit Submission data provides status)
- **Provides to**: Task 3 (Timeline visualization)

**Estimated Effort**: 3-4 days

---

#### Task 3: Project Timeline Visibility
**Description**: Visual timeline showing entitlement milestones and projected loan origination date.

**Technical Details**:
- Gantt-style timeline:
  - Submission date (actual)
  - City review period (estimated, based on historical data)
  - Correction cycles (if any)
  - Estimated approval date
  - Projected loan origination date (+30 days after approval)
- Milestone markers: Initial submit, corrections requested, resubmit, approval
- Color coding: On-track (green), at-risk (yellow), delayed (red)

**Deliverables**:
- Timeline visualization React component (use library like `react-gantt-chart` or custom)
- API endpoint: `GET /api/entitlement-projects/{id}/timeline`
- Milestone data calculation service (backend)

**Acceptance Criteria**:
- ✅ Timeline shows all key milestones
- ✅ Projected dates calculated from city average turnaround times
- ✅ Visual indicator if project behind schedule
- ✅ Servicing team can see dependencies (e.g., waiting on architect)
- ✅ Timeline updates automatically as status changes

**Interdependencies**:
- **Depends on**: Task 2 (Status data feeds timeline)
- **Depends on**: DP01-221 (Correction cycle data impacts timeline)
- **Provides to**: Servicing team planning and forecasting

**Estimated Effort**: 4-5 days

---

#### Task 4: Permit Approval Notification
**Description**: Notify servicing team when permit approved and project ready for loan origination.

**Technical Details**:
- Trigger notification when PermitSubmission.status = "Approved"
- Notification recipients: Servicing team lead + assigned loan officer (if known)
- Notification content:
  - Project name, address, borrower
  - Permit approval date
  - Link to project detail page
  - Next steps: "Ready for loan origination"
- Notification channels: Email + in-app notification (toast message)
- Notification preferences: Users can opt-out of email, keep in-app only

**Deliverables**:
- Notification trigger service (backend event listener)
- API endpoint: `POST /api/notifications/permit-approved`
- Email template (HTML + plain text)
- In-app notification UI component (toast/banner)

**Acceptance Criteria**:
- ✅ Notification sent immediately when permit approved
- ✅ Email delivered to servicing team within 5 minutes
- ✅ In-app notification visible on next page load
- ✅ Notification includes project context and link
- ✅ Users can dismiss in-app notification

**Interdependencies**:
- **Depends on**: DP01-244 (Notification System infrastructure)
- **Depends on**: DP01-220 (Permit approval status event)
- **Provides to**: Servicing team handoff workflow

**Estimated Effort**: 2-3 days

---

### Story 3 Summary

**Total Estimated Effort**: 12-16 days (can be parallelized with 2 developers)
**Critical Path**: Task 1 → Task 2 → Task 3 → Task 4
**Parallelizable**: Task 3 and Task 4 can start after Task 2

**Key Risks**:
- RBAC scope creep (may need fine-grained permissions beyond read-only)
- Timeline estimation accuracy (depends on historical city data)
- Notification delivery (email deliverability)

---

## Story 4: DP01-244 - Notification System

**Epic**: DP01-203: Track 3: Platform Services
**Summary**: Email/SMS service integration with user preferences
**Story Points**: TBD
**Priority**: Critical (required by all other Sprint 2 stories)

### Context & Business Value

Centralized notification system provides:
- Reliable email delivery for task assignments, alerts, approvals
- SMS alerts for urgent/time-sensitive events
- User preference management (opt-in/opt-out, channel selection)
- Template management for consistent messaging
- Foundation for future push notifications, Slack integration

**Dependencies**:
- **Enables**: DP01-217 (Architect task alerts)
- **Enables**: DP01-221 (Correction action item notifications)
- **Enables**: DP01-223 (Permit approval notifications)
- **Required by**: All business workflows in Connect 2.0

### Subtasks

#### Task 1: Email Service Integration (AWS SES)
**Description**: Integrate AWS Simple Email Service (SES) for transactional email delivery.

**Technical Details**:
- AWS SES setup:
  - Verify domain (vividcg.com or datapage.io)
  - Configure DKIM, SPF, DMARC for deliverability
  - Request production access (move out of sandbox)
  - Set up bounce/complaint handling
- Node.js SES client (AWS SDK v3)
- Email sending service with retry logic (3 attempts, exponential backoff)
- Dead letter queue (DLQ) for failed emails (SQS)
- Email logging (sent, delivered, bounced, complained)

**Data Model** (tentative):
```
EmailLog {
  id: UUID
  recipient: VARCHAR(255) (email address)
  subject: VARCHAR(500)
  body_html: TEXT
  body_text: TEXT
  template_id: FK → EmailTemplate (null if ad-hoc)
  status: ENUM (Queued, Sent, Delivered, Bounced, Complained, Failed)
  ses_message_id: VARCHAR(255)
  error_message: TEXT (if failed)
  sent_at: TIMESTAMP
  delivered_at: TIMESTAMP
  created_at: TIMESTAMP
}
```

**Deliverables**:
- AWS SES configuration (Terraform or manual setup)
- Email sending service (Node.js module)
- API endpoint: `POST /api/notifications/email`
- Bounce/complaint webhook handler: `POST /api/webhooks/ses`
- Email logging dashboard (admin view)

**Acceptance Criteria**:
- ✅ Emails sent reliably (99%+ delivery rate)
- ✅ Bounces and complaints logged and handled
- ✅ Retry logic prevents transient failures
- ✅ Failed emails routed to DLQ for manual review
- ✅ DKIM signature passes (SPF, DMARC aligned)

**Interdependencies**:
- **Depends on**: AWS account setup (assume exists from DP01-21)
- **Provides to**: All notification features (Tasks 3-5)

**Estimated Effort**: 3-4 days

---

#### Task 2: SMS Service Integration (Twilio)
**Description**: Integrate Twilio for SMS delivery for urgent alerts.

**Technical Details**:
- Twilio account setup:
  - Purchase phone number (US/Canada)
  - Configure messaging service
  - Set up webhook for delivery receipts
- Node.js Twilio client
- SMS sending service with character limit validation (160 chars)
- SMS logging (sent, delivered, failed)
- Rate limiting (max 10 SMS per user per day to prevent spam)

**Data Model** (tentative):
```
SmsLog {
  id: UUID
  recipient: VARCHAR(20) (phone number, E.164 format)
  message: VARCHAR(160)
  template_id: FK → SmsTemplate (null if ad-hoc)
  status: ENUM (Queued, Sent, Delivered, Failed, Undelivered)
  twilio_sid: VARCHAR(255)
  error_message: TEXT (if failed)
  sent_at: TIMESTAMP
  delivered_at: TIMESTAMP
  created_at: TIMESTAMP
}
```

**Deliverables**:
- Twilio account setup and phone number purchase
- SMS sending service (Node.js module)
- API endpoint: `POST /api/notifications/sms`
- Delivery webhook handler: `POST /api/webhooks/twilio`
- SMS logging dashboard (admin view)

**Acceptance Criteria**:
- ✅ SMS sent reliably (95%+ delivery rate)
- ✅ Delivery receipts logged
- ✅ Failed SMS logged with error reason
- ✅ Rate limiting prevents spam (max 10/day per user)
- ✅ Phone number validation (E.164 format required)

**Interdependencies**:
- **Depends on**: Twilio account and budget approval
- **Provides to**: Task 3 (Notification templates use SMS channel)

**Estimated Effort**: 2-3 days

---

#### Task 3: Notification Template Management
**Description**: Create and manage reusable notification templates for email and SMS.

**Technical Details**:
- Template types:
  - Email: HTML + plain text versions
  - SMS: Plain text only (160 char limit)
- Variable interpolation: `{{variable_name}}` replaced at send time
- Template categories:
  - Task assignment
  - Status updates
  - Alerts (urgent)
  - Approvals/rejections
  - System notifications
- Admin UI for template CRUD (create, edit, preview, delete)
- Template versioning (track changes, rollback if needed)

**Data Model** (tentative):
```
NotificationTemplate {
  id: UUID
  name: VARCHAR(255) (e.g., "Task Assignment Email")
  category: ENUM (Task, Status, Alert, Approval, System)
  channel: ENUM (Email, SMS, Both)
  subject: VARCHAR(500) (email only)
  body_html: TEXT (email only)
  body_text: TEXT (email plain text + SMS)
  variables: JSON (array of variable names, e.g., ["task_name", "assignee_name"])
  is_active: BOOLEAN
  version: INT
  created_by: FK → User (Admin)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

**Deliverables**:
- Template management UI (React admin panel)
- API endpoints:
  - `GET /api/notification-templates`
  - `POST /api/notification-templates`
  - `PUT /api/notification-templates/{id}`
  - `DELETE /api/notification-templates/{id}`
- Template preview modal (render with sample variables)
- Variable interpolation service (backend)

**Acceptance Criteria**:
- ✅ Admin can create email and SMS templates
- ✅ Templates support variable interpolation (e.g., `{{task_name}}`)
- ✅ Preview shows rendered template with sample data
- ✅ Templates versioned (changes tracked)
- ✅ Inactive templates not used for new notifications

**Interdependencies**:
- **Depends on**: Task 1 (Email service) and Task 2 (SMS service)
- **Provides to**: Task 4 (User preferences reference templates)

**Estimated Effort**: 3-4 days

---

#### Task 4: User Notification Preferences
**Description**: Allow users to control notification channels and frequency per category.

**Technical Details**:
- Preferences per user:
  - Global: Enable/disable email, SMS, in-app notifications
  - Per category: Task assignments (Email + SMS), Status updates (Email only), Alerts (SMS only), etc.
  - Quiet hours: No SMS between 10pm-7am local time
  - Digest mode: Batch emails (daily summary instead of real-time)
- User preference UI (settings page)
- Default preferences for new users (all channels enabled)

**Data Model** (tentative):
```
UserNotificationPreference {
  id: UUID
  user_id: FK → User
  category: ENUM (Task, Status, Alert, Approval, System)
  email_enabled: BOOLEAN
  sms_enabled: BOOLEAN
  in_app_enabled: BOOLEAN
  quiet_hours_start: TIME (e.g., "22:00")
  quiet_hours_end: TIME (e.g., "07:00")
  digest_mode: BOOLEAN (batch emails daily)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

**Deliverables**:
- User preferences UI (React settings page)
- API endpoints:
  - `GET /api/users/{id}/notification-preferences`
  - `PUT /api/users/{id}/notification-preferences`
- Preference enforcement service (check before sending notification)
- Default preference seeding (on user creation)

**Acceptance Criteria**:
- ✅ Users can enable/disable channels per category
- ✅ Quiet hours respected (no SMS during sleep hours)
- ✅ Digest mode batches emails (sent once daily at 8am)
- ✅ Preferences saved immediately (no page refresh needed)
- ✅ Default preferences applied to new users

**Interdependencies**:
- **Depends on**: Task 3 (Templates provide category context)
- **Provides to**: All notification-sending features

**Estimated Effort**: 3-4 days

---

#### Task 5: Notification Queue & Delivery Service
**Description**: Implement notification queue with retry logic, rate limiting, and delivery tracking.

**Technical Details**:
- Notification queue (AWS SQS or in-memory queue like Bull)
- Queue processing:
  1. Check user preferences (channel, quiet hours, digest mode)
  2. Render template with variables
  3. Send via appropriate channel (SES, Twilio)
  4. Log delivery status
  5. Retry on transient failures (3 attempts, exponential backoff)
- Rate limiting:
  - Max 100 emails/hour per user (prevent spam)
  - Max 10 SMS/day per user
- Dead letter queue (DLQ) for failed notifications

**Data Model** (tentative):
```
NotificationQueue {
  id: UUID
  user_id: FK → User
  template_id: FK → NotificationTemplate
  channel: ENUM (Email, SMS, In-App)
  variables: JSON (template variable values)
  scheduled_at: TIMESTAMP (send immediately if null)
  status: ENUM (Queued, Sent, Delivered, Failed)
  retry_count: INT
  error_message: TEXT
  created_at: TIMESTAMP
  sent_at: TIMESTAMP
}
```

**Deliverables**:
- Notification queue service (SQS integration or Bull queue)
- Queue processor (background worker)
- API endpoint: `POST /api/notifications/send` (enqueue notification)
- Retry logic with exponential backoff
- DLQ monitoring dashboard

**Acceptance Criteria**:
- ✅ Notifications processed reliably (99%+ success rate)
- ✅ Retry logic handles transient failures
- ✅ Rate limiting prevents spam
- ✅ Failed notifications routed to DLQ
- ✅ Queue processing scalable (can add more workers)

**Interdependencies**:
- **Depends on**: Tasks 1-4 (All notification infrastructure)
- **Provides to**: All business workflows (DP01-217, DP01-221, DP01-223)

**Estimated Effort**: 4-5 days

---

### Story 4 Summary

**Total Estimated Effort**: 15-20 days (can be parallelized with 2-3 developers)
**Critical Path**: Task 1 → Task 3 → Task 4 → Task 5 (Task 2 can be parallel)
**Parallelizable**: Task 2 (SMS) can be done in parallel with Task 1 (Email)

**Key Risks**:
- AWS SES production access delay (can take 24-48 hours)
- Email deliverability issues (spam filters, DKIM config)
- Twilio rate limits and cost (SMS pricing)
- Queue processing performance under load

---

## Sprint 2 Overall Summary

### Total Effort Breakdown

| Story | Effort (days) | Parallelization Potential |
|-------|---------------|---------------------------|
| DP01-217: Design Customization Interface | 12-16 | 2-3 developers |
| DP01-221: Correction Cycle Management | 13-17 | 2-3 developers |
| DP01-223: Cross-Team Visibility | 12-16 | 2 developers |
| DP01-244: Notification System | 15-20 | 2-3 developers |
| **Total** | **52-69 days** | **With 4-5 developers: ~13-17 days** |

### Critical Dependencies

**Must complete first**:
1. DP01-244 (Notification System) - Required by all other stories

**Can start in parallel after DP01-244 Task 1-2 complete**:
- DP01-217 (Design Customization)
- DP01-221 (Correction Cycle)
- DP01-223 (Cross-Team Visibility)

### Recommended Sprint Execution Order

**Week 1 (Jan 12-16)**:
- **All devs**: DP01-244 Tasks 1-3 (Email, SMS, Templates)
- **Goal**: Notification infrastructure functional

**Week 2 (Jan 19-23)**:
- **Team A (2 devs)**: DP01-244 Tasks 4-5 (User prefs, Queue)
- **Team B (2 devs)**: DP01-217 Tasks 1-2 (Architect auth, Dashboard)
- **Team C (1 dev)**: DP01-221 Task 1 (City feedback form)

### Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AWS SES production access delay | High | Request access in Sprint 1 |
| Workflow Engine (DP01-242) not ready | Medium | Implement basic state machine in DP01-221 |
| S3 upload performance issues | Medium | Use presigned URLs, test with 50MB files early |
| Assignment rules complexity | Low | Start with simple category-based rules, enhance later |

---

## Next Steps

1. **Create subtasks in Jira** for all 4 stories (18 subtasks total)
2. **Assign story points** using team velocity (planning poker)
3. **Identify owners** for each subtask
4. **Schedule kick-off meeting** (Jan 12) to review interdependencies
5. **Setup AWS SES** in Sprint 1 to avoid delays
