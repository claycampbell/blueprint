# Demo Guide: Hybrid State Machine + Workflow Model

## Quick Start (For Stakeholders)

### Viewing the Demo

The demo is currently running at: **[http://localhost:3000](http://localhost:3000)**

If not running, start it:
```bash
cd demo-hybrid-state-workflow
npm run dev
```

---

## What You're Looking At

This demo shows how Connect 2.0 could model property lifecycle using a **hybrid state machine + workflow approach**.

### Key Concept: Property-Centric State Management

Instead of properties "moving through stages," they exist as stateful entities that undergo transformations via various processes.

---

## Demo Walkthrough

### Step 1: Select a Property

Use the dropdown at the top to switch between three sample properties:

**Property A: 123 Main Street**
- **Scenario:** Brand new property, just entered system
- **Lifecycle:** Intake
- **Active Processes:** None yet
- **Key Point:** Starting state, ready for intake qualification

**Property B: 456 Oak Avenue** ⭐ **RECOMMENDED START HERE**
- **Scenario:** Property undergoing feasibility
- **Lifecycle:** Feasibility
- **Active Processes:** Feasibility Analysis + Title Review (concurrent!)
- **Key Point:** Shows concurrent processes running simultaneously

**Property C: 789 Pine Road**
- **Scenario:** Feasibility complete, ready for decision
- **Lifecycle:** Feasibility
- **Approval:** Approved
- **Completed Processes:** Feasibility Analysis
- **Key Point:** Shows process history and state change audit trail

---

### Step 2: Examine Property State Dimensions

Look at the property header card (top section). Notice it shows **multiple independent state dimensions**:

| Dimension | Description | Example Value |
|-----------|-------------|---------------|
| **Lifecycle** | Where in the process | "Feasibility" |
| **Status** | Activity state | "Active" |
| **Approval** | Approval status | "Pending" |
| **Risk Level** | Risk score (0-10) | "6.5" |

**Key Insight:** These are INDEPENDENT dimensions, not a single "current stage."

---

### Step 3: View Active Processes

Scroll down to **"Active Processes"** section.

On Property B (456 Oak Avenue), you'll see two process cards:

**Process 1: Feasibility Analysis**
- Status: In Progress
- Due Date: Jan 30, 2025
- Assigned: design-lead-001

**Process 2: Title Review**
- Status: In Progress
- Due Date: Jan 24, 2025
- Assigned: title-consultant-001

**Key Insight:** Both processes run **concurrently** on the same property.

### Try This:
Click **"Mark as Complete"** on a process to see:
- Process status changes to "Completed"
- Process moves to "Completed Processes" section
- UI updates in real-time

---

### Step 4: Review State Change History

Scroll to **"State Change History"** section (bottom).

On Property C (789 Pine Road), you'll see:

```
• lifecycle: intake → feasibility
  Jan 10, 2025 8:00 AM • Changed by system

• approval: pending → approved
  Jan 15, 2025 5:00 PM • Changed by acq-specialist-001
  Reason: "Feasibility analysis complete, GO decision confirmed"
```

**Key Insight:** Every state change is logged with full audit trail.

---

## Questions to Consider While Using Demo

### 1. Mental Model Alignment

**Question:** "Does this match how you think about properties?"

- Do you think: "This property is in feasibility" (lifecycle state)?
- Or: "This property has feasibility work happening" (active processes)?
- Both?

### 2. Concurrent Work

**Question:** "When multiple things happen at once, which view makes sense?"

**Example:** Property in entitlement that needs:
- Environmental assessment
- Title update
- Community engagement

**Workflow Model:** Where does it "live" during this?

**State Machine Model:** Property is in `lifecycle: entitlement`, with 3 concurrent processes.

### 3. Exception Handling

**Question:** "What if a property needs to go back to feasibility?"

**Scenario:** Entitlement reveals zoning issue, requires re-analysis.

**Workflow Model:**
- ❌ Awkward: property goes "backwards"
- ❌ Or: create special "re-feasibility" stage

**State Machine Model:**
- ✅ Natural: `lifecycle: entitlement → feasibility`
- ✅ Start new feasibility process
- ✅ State history shows why

### 4. Different Property Types

**Question:** "How do different property types follow different paths?"

**Examples:**
- Subdivision: Intake → Feasibility → Entitlement → Construction
- Multi-family rehab: Intake → Feasibility → Construction (skip entitlement)
- Land banking: Intake → Feasibility → Hold (no construction)

**Workflow Model:**
- ❌ Need multiple workflow definitions
- ❌ Or complex branching logic

**State Machine Model:**
- ✅ Process availability based on property type
- ✅ New types = new process definitions (not new workflows)

---

## What This Demo Does NOT Show (Yet)

### Not Implemented:

1. **Workflow View Comparison** - Traditional stage-based UI side-by-side
2. **Interactive Scenarios** - Auto-play events to show model differences
3. **Process Starting** - "Start New Process" button
4. **Automatic Lifecycle Advancement** - State transitions based on rules
5. **Metrics Dashboard** - Properties by lifecycle, average durations

**These will be added in Phase 2 based on your feedback.**

---

## Feedback Questions

Please consider these questions as you explore:

### Usability
1. Is the property state information clear?
2. Are concurrent processes easy to understand?
3. Is the state change history useful?

### Mental Model
4. Does this match how you think about properties?
5. What feels natural vs forced?
6. What's missing or confusing?

### Scenarios
7. How would you handle a property returning to feasibility?
8. How would you track a property with 5 concurrent processes?
9. How would you report "properties in feasibility"?

### Decision
10. Prefer this model or traditional workflow stages?
11. What are your biggest concerns?
12. What would help you decide?

---

## Providing Feedback

**Option 1: In-Person Session**
- Schedule demo walkthrough with Clay
- Discuss questions above
- Capture feedback in FINDINGS.md

**Option 2: Written Feedback**
- Email feedback to clay@blueprint.com
- Use questions above as prompts
- Include screenshots if helpful

**Option 3: Async Video**
- Record screen while using demo
- Narrate thoughts out loud
- Share video with team

---

## Technical Support

**Demo Not Loading?**
```bash
cd demo-hybrid-state-workflow
npm install
npm run dev
# Open http://localhost:3000
```

**Need to Stop Server?**
- Press `Ctrl+C` in terminal

**Questions?**
- Reach out to Clay Campbell
- Check README.md for full documentation

---

## Next Steps After Demo

1. **Gather Feedback** - From all stakeholders
2. **Analyze Findings** - Identify patterns in feedback
3. **Make Decision** - State machine vs workflow vs hybrid
4. **Document ADR** - Architecture Decision Record
5. **Update PRD** - Section 3.2 (Architecture Principles)
6. **Revise Epics** - Align Jira structure with chosen model

---

**Demo Status:** Ready for stakeholder review ✅

**Time Commitment:** 15-20 minutes to explore
