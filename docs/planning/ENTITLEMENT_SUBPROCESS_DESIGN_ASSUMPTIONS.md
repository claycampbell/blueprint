# Entitlement Subprocess Design - Assumptions for Business Review

**Date:** January 2, 2026
**Status:** Draft for Review with Dave/Brittani
**Purpose:** Document assumed workflows and data models for entitlement correction management
**Next Step:** Whiteboard session to validate/refine these assumptions

---

## Executive Summary

This document presents a **detailed entitlement subprocess model** with 12 granular states and a structured correction workflow. These assumptions are based on construction industry best practices but **need validation** against Blueprint's actual SharePoint workflows.

### What We Need from Dave/Brittani

1. **Confirm the state flow** - Does this match how permits actually move through your system?
2. **Validate correction breakdown** - Is this how you handle correction letters today?
3. **Identify gaps** - What states or steps are we missing?
4. **Prioritize for MVP** - Which parts are Day 1-90 vs nice-to-have?

---

## 1. Entitlement State Machine (12 States)

Properties in `lifecycle: 'entitlement'` have a nested `entitlement_status` dimension tracking permit progress.

### State Definitions

| State | Description | Who Controls | Exit Conditions |
|-------|-------------|--------------|-----------------|
| **PLANNING** | Assembling permit package, coordinating consultants | Blueprint team | Package ready for internal QA |
| **PRE_SUBMITTAL_QA** | Internal quality check before submission | Dave/Brittani | QA passed → submit, or fail → back to PLANNING |
| **SUBMITTED** | Application submitted to jurisdiction, awaiting review start | Jurisdiction | Review begins OR rejected (incomplete) |
| **UNDER_REVIEW** | Jurisdiction actively reviewing plans | Jurisdiction | Corrections issued OR Approved OR Rejected |
| **CORRECTIONS_RECEIVED** | Correction letter received, being triaged | Blueprint team | All items triaged and categorized |
| **CORRECTIONS_ASSIGNED** | Items assigned to consultants, notifications sent | Blueprint team | All consultants confirmed receipt |
| **ADDRESSING_CORRECTIONS** | Consultants actively working on fixes | Consultants | All corrections resolved |
| **CORRECTIONS_QA** | Internal review of consultant responses | Dave/Brittani | QA passed → resubmit, or fail → back to consultants |
| **RESUBMITTED** | Revised package submitted back to jurisdiction | Blueprint team | Jurisdiction starts next review round |
| **APPROVED** | Permit approved, ready for construction | Jurisdiction | Property advances to `lifecycle: 'construction'` |
| **REJECTED** | Application rejected, major redesign needed | Jurisdiction | Property returns to `lifecycle: 'feasibility'` or cancelled |
| **ON_HOLD** | Application paused (jurisdiction moratorium, financing delay, etc.) | Varies | Resume conditions met |

### State Transition Rules

```
PLANNING → PRE_SUBMITTAL_QA → SUBMITTED → UNDER_REVIEW
                                              ↓
                                          CORRECTIONS_RECEIVED
                                              ↓
                                          CORRECTIONS_ASSIGNED
                                              ↓
                                          ADDRESSING_CORRECTIONS
                                              ↓
                                          CORRECTIONS_QA
                                              ↓
                                          RESUBMITTED → UNDER_REVIEW (next round)
                                                            ↓
                                                        APPROVED → Construction
                                                            ↓
                                                        REJECTED → Feasibility/Cancel

Special: Any state → ON_HOLD → Resume from previous state
```

### Key Assumptions to Validate

1. **Do you track PRE_SUBMITTAL_QA as a formal state, or is it informal?**
2. **How many correction rounds are typical? (2-3 rounds assumed)**
3. **Is CORRECTIONS_ASSIGNED a distinct phase, or do you assign while triaging?**
4. **Do corrections ever get rejected entirely (REJECTED state), or always fixable?**
5. **What triggers ON_HOLD? Who can pause an application?**

---

## 2. Correction Item Data Model

### Entity Relationship

```
CorrectionLetter (parent)
    ├── metadata (letter date, round number, due date)
    ├── document (PDF in cloud storage)
    └── CorrectionItem[] (children)
            ├── item_number (e.g., "Civil-3.a")
            ├── discipline (civil, structural, architectural, etc.)
            ├── description (original text from letter)
            ├── sheet_references (where the issue is)
            ├── severity (critical, major, minor)
            ├── assigned_to (consultant)
            ├── status (not_started, in_progress, completed, etc.)
            └── response (how we addressed it)
```

### CorrectionLetter (Parent Entity)

**Purpose:** Represents the official document from the jurisdiction.

**Key Fields:**
- `id` - Unique identifier
- `property_id` - Which property this applies to
- `permit_application_id` - Specific permit application
- `jurisdiction_document_id` - Their reference number (e.g., "Plan Check #3")
- `letter_date` - Date on the letter
- `received_date` - When we received it
- `round_number` - 1st corrections, 2nd corrections, 3rd, etc.
- `document_url` - PDF stored in S3/Azure Blob
- `response_due_date` - Jurisdiction deadline
- `internal_target_date` - Our internal deadline (earlier)
- `total_items` - Count of correction items (calculated)
- `items_completed` - How many are done (calculated)
- `status` - Letter-level status (received, triaging, assigned, in_progress, in_qa, ready_to_submit, submitted)

### CorrectionItem (Child Entity)

**Purpose:** Single actionable correction that can be assigned and tracked.

**Key Fields:**
- `id` - Unique identifier
- `correction_letter_id` - Parent letter
- `property_id` - Denormalized for queries
- `item_number` - From letter (e.g., "3.a", "Civil-12")
- `discipline` - civil | structural | architectural | landscape | mechanical | electrical | plumbing | fire | zoning | other
- `description` - Original correction text
- `notes` - Internal clarifications
- `sheet_numbers` - Array of sheets (e.g., ["A-101", "A-102"])
- `detail_references` - Specific details (e.g., ["Detail 3/A-101"])
- `severity` - critical | major | minor
- `category` - Custom tags (setback, parking, accessibility, etc.)
- `estimated_effort_hours` - Consultant estimate
- `assigned_to_consultant_id` - Which firm
- `assigned_to_person` - Specific person
- `assigned_date` - When assigned
- `due_date` - Individual item deadline
- `status` - not_started | in_progress | consultant_submitted | internal_review | approved | needs_revision | completed
- `response_description` - How we addressed it
- `response_document_urls` - Links to revised drawings
- `revised_sheet_numbers` - Which sheets were updated
- `reviewed_by` - Who approved the response
- `reviewed_date` - When approved
- `extraction_method` - manual | ai_assisted | ai_auto

### Key Assumptions to Validate

1. **Is a correction letter one document or multiple? (Assuming one PDF)**
2. **Do you track individual items, or just the overall letter? (Assuming items)**
3. **What disciplines do you use? (Assuming standard AEC disciplines)**
4. **How do you categorize severity? (Assuming critical/major/minor)**
5. **Do consultants update status themselves, or does Brittani? (Assuming Brittani)**
6. **How many correction rounds are typical? (Assuming 2-3 rounds)**
7. **Do you track which specific sheets changed? (Assuming yes for audit trail)**

---

## 3. User Workflows (UX Flows)

### Flow 1: Correction Letter Triage (Hybrid Approach)

**User:** Brittani (Design & Entitlement Manager)

**Screen Layout:**
```
┌───────────────┬─────────────────────┐
│   PDF Viewer  │  Correction Items   │
│   (Original   │  (AI Extracted)     │
│    Letter)    │                     │
│               │  ✓ 12 items found   │
│               │  Filter by:         │
│   [Zoom]      │  □ Civil (4)        │
│   [Highlight] │  □ Structural (3)   │
│               │  □ Architectural(5) │
│               │                     │
│               │  [+ Add Item]       │
│               │  [Confirm & Assign] │
└───────────────┴─────────────────────┘
```

**Key Features:**
- **Side-by-side layout** - PDF on left, extracted items on right
- **Click item → highlights in PDF** - visual confirmation
- **Click PDF → creates item** - catch what AI missed
- **Edit any extracted item** - fix discipline, add sheets, clarify description
- **Delete false positives** - AI isn't perfect
- **Confirm & Assign** - moves to assignment flow

**Assumptions to Validate:**
1. **Does AI extraction make sense, or do you prefer manual entry?**
2. **Do you want to triage first, then assign? Or assign during triage?**
3. **Who does triage - Brittani only, or shared responsibility?**

---

### Flow 2: Bulk Assignment to Consultants

**User:** Brittani (Design & Entitlement Manager)

**Screen Layout:**
```
┌────────────────────────────────────────┐
│ Assign Corrections (12 items)         │
│ Due: Feb 15 | Internal Target: Feb 12 │
├────────────────────────────────────────┤
│ Quick Actions:                         │
│ [Auto-Assign by Discipline]            │
│ [Set All Deadlines: Feb 12]            │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ CIVIL (4 items)          Expanded│  │
│ │ Assign to: [Wilson & Assoc ▼]   │  │
│ │ Due: [Feb 10 ▼]                  │  │
│ │                                   │  │
│ │ ☐ 1. Civil-3.a - Setback issue   │  │
│ │    Priority: Major | Est: 4 hrs  │  │
│ │ ☐ 2. Civil-5.b - Drainage calcs  │  │
│ │    Priority: Critical | Est: 8hrs│  │
│ │ ...                               │  │
│ └──────────────────────────────────┘  │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ STRUCTURAL (3 items)     Expanded│  │
│ │ Assign to: [Martin Struct ▼]    │  │
│ │ ...                               │  │
│ └──────────────────────────────────┘  │
│                                        │
│ [Assign & Notify →]                    │
└────────────────────────────────────────┘
```

**Key Features:**
- **Bulk assign by discipline** - all civil to one consultant
- **Auto-assign option** - reuse previous consultant assignments
- **Priority & effort visible** - set realistic deadlines
- **Collapsed/expanded sections** - focus on one discipline
- **Draft saving** - don't finish all at once
- **Notification preview** - see what consultants receive

**Assumptions to Validate:**
1. **Do you assign all items at once, or in batches?**
2. **Do consultants self-assign, or does Brittani assign?**
3. **Do you track estimated effort hours?**
4. **How do you set deadlines - same for all, or per item?**
5. **What notification method - email, portal, both?**

---

### Flow 3: Progress Tracking Dashboard

**User:** Brittani (Design & Entitlement Manager)

**Screen Layout:**
```
┌────────────────────────────────────────┐
│ Corrections Progress                   │
│ Status: ADDRESSING_CORRECTIONS         │
│ Round 2 | Due: Feb 15 (6 days)        │
├────────────────────────────────────────┤
│ Progress: ████████░░░░  8/12 (67%)   │
│                                        │
│ ✅ Completed: 8 | 🔄 In Progress: 3  │
│ ⏸️ Not Started: 1 | 🔴 At Risk: 2    │
│                                        │
│ View: [By Status ▼]                    │
│                                        │
│ ┌──────────────────────────────────┐  │
│ │ 🔴 AT RISK (2 items)             │  │
│ │                                   │  │
│ │ Civil-5.b - Drainage calcs        │  │
│ │ Wilson & Assoc | Due: Feb 10 (4d)│  │
│ │ Status: 50% | Updated: 2 days ago│  │
│ │ [Send Reminder] [Extend Deadline]│  │
│ │ ...                               │  │
│ └──────────────────────────────────┘  │
│                                        │
│ [Email Team Summary]                   │
│ [Move to QA Review →]                  │
└────────────────────────────────────────┘
```

**Key Features:**
- **Visual progress bar** - at-a-glance status
- **Risk indicators** - surfaces items needing attention
- **Multiple views** - by status, consultant, discipline, priority
- **Last update timestamp** - spot stale items
- **Inline actions** - reminders, deadline extensions
- **Batch actions** - move all to QA when ready

**Assumptions to Validate:**
1. **How often do you check progress - daily, weekly?**
2. **Do consultants update their own status, or do you?**
3. **What "at risk" means - overdue, no recent updates, both?**
4. **Do you track % complete per item, or just binary (done/not done)?**
5. **What actions do you typically take on at-risk items?**

---

### Flow 4: QA Review (Quality Gate)

**User:** Brittani or Dave (Principal sign-off)

**Screen Layout:**
```
┌────────────────────────────────────────┐
│ QA Review: Correction Round 2         │
│ All 12 items submitted                 │
├────────────────────────────────────────┤
│ QA Checklist:                          │
│ ☐ All corrections addressed            │
│ ☐ Response descriptions complete       │
│ ☐ Revised sheets uploaded              │
│ ☐ Cross-discipline conflicts resolved  │
│                                        │
│ ┌─────┬─────────┬────────────┐        │
│ │CORR.│RESPONSE │REVISED SHT │        │
│ │     │         │            │        │
│ │Civil│"Updated │[C-101]     │        │
│ │-3.a │site plan│[Compare]   │        │
│ │     │to show  │            │        │
│ │     │5' setbk"│            │        │
│ └─────┴─────────┴────────────┘        │
│                                        │
│ Decision:                              │
│ ⚪ ✅ Approve                          │
│ ⚪ ⚠️  Needs Revision                  │
│ ⚪ ❌ Reject                           │
│                                        │
│ [Next Item ►] [Approve & Continue]     │
└────────────────────────────────────────┘
```

**Key Features:**
- **Three-panel comparison** - correction, response, revised sheet
- **Item-by-item review** - systematic check
- **Decision per item** - approve, revise, or reject
- **Visual sheet comparison** - verify changes
- **QA checklist** - don't miss critical steps
- **Batch send-back** - return items needing revision

**Assumptions to Validate:**
1. **Who does QA - Brittani, Dave, or both?**
2. **Do you review every item, or just spot-check?**
3. **How often do items fail QA and go back to consultants?**
4. **Do you compare sheets visually, or just trust consultant responses?**
5. **What's the approval threshold - all items perfect, or good enough?**

---

### Flow 5: Resubmittal Package Preparation

**User:** Brittani (with Dave sign-off)

**Screen Layout:**
```
┌────────────────────────────────────────┐
│ Prepare Resubmittal (Round 2)         │
│ Due: Feb 15 (2 days)                   │
├────────────────────────────────────────┤
│ 📋 Checklist:                          │
│ ✅ All corrections addressed           │
│ ✅ Revised sheets collected            │
│ ✅ Response letter generated           │
│ ☐ Fees calculated                      │
│ ☐ Principal sign-off                   │
│                                        │
│ 📄 Response Letter (Auto-Generated)    │
│ [Preview] [Edit] [Download PDF]        │
│                                        │
│ 📦 Revised Sheets (8 sheets)           │
│ ✅ C-101 (Site Plan) - Rev. B          │
│ ✅ C-102 (Grading) - Rev. B            │
│ ...                                    │
│ [Preview Package] [Download ZIP]       │
│                                        │
│ 💰 Fees: $1,700.00                     │
│ [Process Payment]                      │
│                                        │
│ ✍️ Dave Sign-Off Required              │
│ [Request Sign-Off]                     │
│                                        │
│ [Submit to Jurisdiction Now →]         │
└────────────────────────────────────────┘
```

**Key Features:**
- **Auto-generated response letter** - maps corrections to responses
- **Checklist validation** - can't submit until complete
- **Package preview** - see what's being sent
- **Fee calculation** - automatic based on jurisdiction
- **Approval workflow** - requires principal sign-off
- **Direct portal integration** - upload or download

**Assumptions to Validate:**
1. **Do you auto-generate response letters, or write manually?**
2. **Who assembles the package - Brittani, admin, consultants?**
3. **How do you submit - portal upload, email, physical delivery?**
4. **Do you need Dave's explicit sign-off, or just informal review?**
5. **How are fees calculated - per round, flat rate, varies by jurisdiction?**
6. **Do you track resubmittal confirmation from jurisdiction?**

---

## 4. Key Technical Questions for Implementation

### Database Schema

1. **Do we need separate tables for `CorrectionLetter` and `CorrectionItem`, or just `CorrectionItem` with a `letter_id` reference?**
2. **What enum values for `discipline`?** (Assuming: civil, structural, architectural, landscape, mechanical, electrical, plumbing, fire, zoning, other)
3. **What enum values for `severity`?** (Assuming: critical, major, minor)
4. **What enum values for `status`?** (See CorrectionItem.status above)
5. **Do we track consultant firm separately from individual person?**

### Workflow Engine

1. **What triggers state transitions?** (User action, time-based, external event?)
2. **Are transitions reversible?** (e.g., can you go from CORRECTIONS_QA back to ADDRESSING_CORRECTIONS?)
3. **Who has permission to transition states?** (Role-based: Brittani only, or team?)
4. **Do you need approval gates?** (Dave must approve before RESUBMITTED?)
5. **How do you handle concurrent corrections?** (Multiple letters active at once?)

### Integration Points

1. **Do jurisdictions have API portals, or just web upload?**
2. **How do consultants receive notifications?** (Email, portal login, both?)
3. **Do consultants update status themselves, or does Brittani?**
4. **Where are revised sheets stored?** (Consultant Dropbox, your system, both?)
5. **How do you track document versions?** (Sheet rev letters, timestamps, both?)

### AI Extraction

1. **What accuracy threshold is acceptable for AI extraction?** (90%? 95%?)
2. **Should AI auto-create items, or just suggest them for review?**
3. **What OCR service would you use?** (Azure Document Intelligence, AWS Textract, Google Vision?)
4. **How do you handle hand-marked redlines?** (Common in some jurisdictions)
5. **Should AI categorize severity, or leave that to Brittani?**

---

## 5. MVP Phasing Recommendation

### Phase 1 (Days 1-90): Manual Workflow with State Tracking

**Include:**
- ✅ 12-state entitlement status tracking
- ✅ Manual correction item entry (no AI)
- ✅ Simple assignment workflow (assign to consultant, set deadline)
- ✅ Progress dashboard (at-risk items, overdue items)
- ✅ Basic resubmittal checklist

**Exclude:**
- ❌ AI extraction (manual entry only)
- ❌ Auto-generated response letters (manual Word doc)
- ❌ Jurisdiction portal integration (manual upload)
- ❌ Consultant self-service portal (Brittani updates status)

**Why:** Validates the state machine and workflow without risky AI dependencies.

### Phase 2 (Days 91-180): AI-Assisted Extraction

**Add:**
- ✅ AI extraction of correction items from PDF
- ✅ Auto-categorization by discipline
- ✅ Suggested sheet references
- ✅ Human review/approval of AI suggestions

**Still Manual:**
- ❌ Auto-generated response letters (Phase 3)
- ❌ Jurisdiction portal integration (Phase 3)
- ❌ Consultant self-service (Phase 3)

**Why:** AI extraction provides immediate ROI (save 1-2 hours per letter), proven with Azure Document Intelligence.

### Phase 3 (Days 180+): Full Automation

**Add:**
- ✅ Auto-generated response letters
- ✅ Direct jurisdiction portal integration (where available)
- ✅ Consultant self-service portal (status updates, file uploads)
- ✅ Automated notifications and reminders
- ✅ Advanced analytics (cycle time by discipline, consultant performance)

**Why:** Full automation after proving core workflow in production.

---

## 6. Open Questions for Dave/Brittani Whiteboard Session

### State Flow Questions

1. **Draw your current SharePoint workflow on a whiteboard** - what are ALL the statuses you track today (even informal ones)?
2. **How do you handle multiple correction rounds?** Do statuses cycle, or do you track "Round 1", "Round 2", etc.?
3. **When do you consider a permit "in corrections" vs "under review"?** Is there a gray area?
4. **Can you pause an application mid-process?** What triggers ON_HOLD status?
5. **Who can change the status?** Just Brittani, or can team members update?

### Correction Management Questions

1. **Show me an actual correction letter** - walk through how you'd break it down today
2. **How do you track consultant assignments?** Spreadsheet, email, SharePoint, calendar?
3. **Do consultants ever push back on deadlines?** How do you handle that?
4. **How often do corrections fail QA and go back to consultants?** (Never, sometimes, frequently?)
5. **Who does final QA - Brittani or Dave?** Or both?

### Tool & Process Questions

1. **What's the biggest pain point in corrections today?** (Tracking status, consultant delays, assembling packages, other?)
2. **How much time does triage take?** (Minutes, hours, depends on letter size?)
3. **Do you use any software for this today?** (SharePoint workflows, custom tools, just email/spreadsheet?)
4. **What would save you the most time?** (AI extraction, auto-reminders, status dashboard, response letter generation?)
5. **What's your relationship with consultants like?** (Do they log in to your system, or just email back?)

### Integration Questions

1. **How many different jurisdictions do you work with?** (Seattle only, King County, others?)
2. **Do any have online portals?** Which ones?
3. **How do you currently submit resubmittals?** (Email, portal upload, physical delivery?)
4. **Do jurisdictions send corrections via email PDF, postal mail, or portal notification?**
5. **Do you track jurisdiction response times?** Would that be useful?

---

## 7. Success Metrics (If This Works)

### Time Savings (Target)

| Task | Current Time | Target Time | Savings |
|------|--------------|-------------|---------|
| Triage correction letter | 30-60 min | 5-10 min (AI-assisted) | 80% reduction |
| Track consultant progress | 20 min/day | 2 min/day (dashboard) | 90% reduction |
| Assemble resubmittal package | 2-3 hours | 15-30 min (auto-generated) | 85% reduction |
| Find status of correction | 5 min (search email/SharePoint) | 10 sec (search bar) | 95% reduction |

### Quality Improvements (Target)

- **Zero missed corrections** - AI extraction + human review catches all items
- **Faster consultant turnaround** - automated reminders, clear deadlines
- **Fewer resubmittal rounds** - QA review catches issues before sending back
- **Better audit trail** - full history of who changed what and when

### User Satisfaction (Target)

- Brittani: "I can see status of all corrections at a glance, not hunting through emails"
- Dave: "I can approve packages digitally, not printing and signing PDFs"
- Consultants: "I know exactly what's due when, not guessing from email threads"

---

## 8. Next Steps

1. **Schedule whiteboard session with Dave/Brittani** (90 minutes)
   - Bring printed copy of this doc
   - Draw actual SharePoint workflow on whiteboard
   - Walk through real correction letter example

2. **Record session notes** and update this document with validated assumptions

3. **Prioritize for MVP** - decide what's Day 1-90 vs Phase 2

4. **Update PRD** with validated state machine and correction data model

5. **Create Jira epics** for entitlement module implementation
   - Epic: Entitlement State Machine
   - Epic: Correction Management
   - Epic: QA Review Workflow
   - Epic: Resubmittal Package Generation

6. **Build demo prototype** - add entitlement subprocess to hybrid state demo

---

## Document History

- **2026-01-02** - Initial draft based on industry best practices (Clay Campbell)
- **[TBD]** - Validated with Dave/Brittani whiteboard session
- **[TBD]** - Updated with actual Blueprint workflows
- **[TBD]** - Incorporated into PRD and implementation plan
