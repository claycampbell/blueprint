# Workshop Preparation Guide
## Reimagining Workflows for Connect 2.0

**Purpose**: Guide stakeholders to help us capture requirements that enable transformation, not just replication
**Audience**: Workshop participants (team leads, power users, operations staff)
**Created**: December 23, 2025

---

## Why We're Doing This

**We're not just rebuilding what exists.** We're using this opportunity to:

✅ **Eliminate manual work** that technology can handle
✅ **Remove bottlenecks** that slow down your team
✅ **Surface insights** that are currently buried in spreadsheets and emails
✅ **Connect systems** so data flows automatically
✅ **Reduce errors** from manual re-entry and copy/paste
✅ **Free up your time** for high-value work that requires judgment

**Your role in workshops**: Help us understand the *intent* of each workflow, not just the *mechanics*. We'll ask questions like:

- "What are you *really* trying to achieve here?"
- "If you could wave a magic wand, how would this work?"
- "What drives you crazy about the current process?"
- "What data do you *wish* you had to make this decision?"

---

## What We Need From You

### 🎯 Before the Workshop (30-60 minutes of prep)

**1. Identify Your Most Painful Process**

Think about the workflow we're going to discuss. Ask yourself:

- What takes the longest?
- What causes the most errors?
- What requires the most back-and-forth communication?
- What keeps you up at night?
- What would make your job 10x easier?

**Example** (Design Team):
> "The permit corrections loop is brutal. We get a PDF from the city with 15 vague corrections like 'Clarify detail on Sheet A-3.' We have to manually read each one, figure out if it's architectural or structural, email the structural engineer if needed, wait for them to send back drawings, then compile everything and resubmit. It takes 2 weeks and we have no visibility into what's blocking the resubmission."

**2. Bring a Real Example**

Come to the workshop with a recent real-world example:
- A project name
- Specific dates (when started, when completed)
- Artifacts (emails, spreadsheets, documents)
- Pain points you encountered

**Why?** We'll walk through your real example to uncover details that generic descriptions miss.

**3. Think About Your Ideal Future State**

If we could rebuild this workflow from scratch with modern technology:
- What would be automated?
- What would you be notified about proactively?
- What data would you want at your fingertips?
- What decisions would the system make for you?
- What would you never have to do manually again?

**Example** (Design Team):
> "In my ideal world, when the city sends a correction letter, the system would automatically extract each correction, categorize it by discipline, assign it to the right person, set a deadline, and notify me when everything's ready to resubmit. I'd just review and click 'Submit' instead of spending 2 days compiling PDFs."

---

### 📋 During the Workshop (What We'll Capture)

We'll use a structured framework to document your workflow. Here's what we'll be capturing and why it matters:

#### 1️⃣ **The Core "Thing" Your Workflow Tracks**

**What we'll ask:**
- "What object is this workflow operating on?" (Project, Loan, Deal, Application, etc.)
- "What are all the statuses this thing can be in?"
- "What makes it move from one status to another?"

**Why it matters:**
- This becomes the primary data model in Connect 2.0
- Status transitions trigger automations (e.g., "When status = Permit Approved, create Construction Admin tasks")

**How we'll capture it:**
```yaml
entity: Project
states:
  - Feasibility (1-2 weeks avg)
  - Schematic Design (2-3 weeks avg)
  - Design Development (6-8 weeks avg)
  - Permit Submitted (60-90 days avg)
  - Permit Approved (terminal state)
```

**🔮 Transformation Opportunity:**
- **Current**: Status updated manually, no visibility into where things are stuck
- **Future**: Real-time status dashboard, automated status transitions, alerts when SLA at risk

---

#### 2️⃣ **Who Does What (People & Systems)**

**What we'll ask:**
- "Who are all the people involved in this workflow?"
- "What does each person actually do?"
- "What decisions do they make?"
- "What systems do they use?"

**Why it matters:**
- Determines permissions and access control
- Identifies automation opportunities (what humans do that systems could do)
- Maps out notification and collaboration needs

**How we'll capture it:**
```yaml
actors:
  - name: Designer
    current_responsibilities:
      - Manually read correction letter PDF
      - Copy corrections into Excel tracker
      - Email consultants with correction assignments
    future_automation_opportunities:
      - System auto-extracts corrections from PDF
      - System auto-assigns based on discipline
      - System auto-emails consultants with task link
```

**🔮 Transformation Opportunity:**
- **Current**: Designer spends 4 hours on administrative coordination
- **Future**: Designer reviews AI-categorized corrections, approves assignments in 30 minutes

---

#### 3️⃣ **What Triggers Actions (Events)**

**What we'll ask:**
- "What starts this workflow?"
- "What external events interrupt or advance the workflow?"
- "What happens on a schedule (daily, weekly, monthly)?"

**Why it matters:**
- Events trigger automations and workflows
- Determines what integrations we need (email, webhooks, scheduled jobs)

**How we'll capture it:**
```yaml
events:
  - name: Correction Letter Received
    current_trigger: Designer manually checks email daily
    future_trigger: Email webhook auto-detects PDF attachment, starts workflow
    frequency: 1-2 per project (60-80% of permits)
```

**🔮 Transformation Opportunity:**
- **Current**: Designer might miss email, causing delays
- **Future**: System detects correction letter immediately, alerts team, starts extraction

---

#### 4️⃣ **What Gets Done (Actions)**

**What we'll ask:**
- "Walk me through each step of this process"
- "What are you creating or changing at each step?"
- "How long does each step take?"
- "What data do you need to complete this step?"

**Why it matters:**
- Identifies which actions can be automated vs require human judgment
- Determines what data needs to flow between steps
- Highlights time-consuming manual work

**How we'll capture it:**
```yaml
actions:
  - name: Categorize Corrections by Discipline
    current_process:
      - Designer reads PDF line by line
      - Manually categorizes as architectural, structural, civil, etc.
      - Copies into Excel tracker
      - Duration: 1-2 hours
    future_automation:
      - Azure Document Intelligence extracts text
      - ML model categorizes corrections (90% accuracy)
      - Designer reviews and adjusts (15 minutes)
      - Duration: 15 minutes
    time_saved: 1-1.75 hours per project
```

**🔮 Transformation Opportunity:**
- **Current**: 1-2 hours of manual copy/paste work
- **Future**: 15 minutes of review, 87.5% time savings

---

#### 5️⃣ **Where Decisions Happen (Decision Points)**

**What we'll ask:**
- "Where in this workflow do you have to make a decision?"
- "What information do you use to make that decision?"
- "Could a system make this decision with a set of rules?"
- "What happens for each possible outcome?"

**Why it matters:**
- Separates rules-based decisions (automate) from judgment calls (human)
- Determines what data/context users need to make decisions
- Identifies workflow branching logic

**How we'll capture it:**
```yaml
decision_points:
  - name: Assign Correction to Designer or Consultant
    current_process:
      - Designer reads correction
      - Uses experience to decide if architectural or engineering
      - Manually assigns via email
    decision_criteria:
      - IF correction mentions "structural", "foundation", "framing" → Consultant
      - IF correction mentions "dimension", "door/window", "finish" → Designer
      - ELSE → Designer reviews and escalates if unsure
    automation_opportunity: HIGH
      - System can categorize 80-90% automatically
      - Designer reviews and adjusts edge cases
```

**🔮 Transformation Opportunity:**
- **Current**: Designer makes 15-20 assignment decisions per correction letter (30-45 min)
- **Future**: System auto-assigns 90%, designer reviews flagged items (5-10 min)

---

#### 6️⃣ **What Data Flows In and Out (Inputs/Outputs)**

**What we'll ask:**
- "What information do you need to complete this step?"
- "Where does that information come from?"
- "What do you create or update?"
- "Where does that information go?"

**Why it matters:**
- Determines API integrations needed
- Identifies manual data re-entry (automation opportunity)
- Defines data model attributes

**How we'll capture it:**
```yaml
step: Address Permit Corrections
inputs:
  - correction_letter.pdf (from jurisdiction email)
  - project_drawings (from S3 storage)
  - consultant_contact_info (from Connect 2.0 DB)
  current_source: Designer manually downloads from email, finds drawings in folders
  future_source: System auto-extracts from email, links to project record
outputs:
  - revised_drawings (PDF)
  - response_letter (PDF)
  current_destination: Designer manually uploads to jurisdiction portal
  future_destination: System auto-submits via API (if available) or assists with upload
```

**🔮 Transformation Opportunity:**
- **Current**: 20-30 minutes finding files, downloading, uploading
- **Future**: 2 minutes reviewing auto-generated submission package, click "Submit"

---

#### 7️⃣ **What Rules Govern the Process (Business Logic)**

**What we'll ask:**
- "What are the rules or policies that govern this workflow?"
- "What validations need to happen?"
- "What constraints limit what you can do?"
- "Are there industry regulations or company policies to follow?"

**Why it matters:**
- Rules can be enforced automatically by the system
- Prevents errors and ensures compliance
- Reduces "checking work" overhead

**How we'll capture it:**
```yaml
business_rules:
  - name: Correction Turnaround SLA
    current_enforcement: Manual (Design Team Lead tracks in Excel)
    rule: "All corrections must be addressed within 10 business days"
    future_enforcement: System tracks deadline, sends alerts at 7 days, escalates at 10 days

  - name: Cannot Resubmit with Incomplete Corrections
    current_enforcement: Designer manually checks Excel tracker
    rule: "Cannot resubmit permit until all correction items marked 'Complete'"
    future_enforcement: System blocks resubmission button until all items complete
```

**🔮 Transformation Opportunity:**
- **Current**: Designer manually tracks, sometimes misses deadline
- **Future**: System prevents submission errors, ensures 100% SLA compliance

---

#### 8️⃣ **What External Systems Are Involved (Integrations)**

**What we'll ask:**
- "What other systems or tools do you use in this workflow?"
- "What data comes from those systems?"
- "What data goes to those systems?"
- "How do you currently exchange data (email, manual copy/paste, API, etc.)?"

**Why it matters:**
- Identifies integration points for automation
- Eliminates manual data re-entry
- Enables real-time data flow

**How we'll capture it:**
```yaml
integrations:
  - system: Jurisdiction Email
    current_integration: Designer manually checks inbox daily
    data_exchanged: Correction letter PDF (inbound)
    future_integration: Email webhook auto-detects PDF, triggers workflow
    time_saved: 10 min/day checking email

  - system: Engineering Consultant
    current_integration: Email back-and-forth, PDF attachments
    data_exchanged: Correction assignments (out), revised drawings (in)
    future_integration: Consultant portal with task list, upload capability
    time_saved: 30 min/project on email coordination
```

**🔮 Transformation Opportunity:**
- **Current**: 10+ emails per correction round, 2-3 days turnaround
- **Future**: Consultant gets task notification, uploads directly to portal, 1 day turnaround

---

#### 9️⃣ **How We Measure Success (Metrics)**

**What we'll ask:**
- "How do you know if this workflow is working well?"
- "What do you wish you could measure but can't today?"
- "What would your ideal dashboard show?"
- "What early warning signals would help you prevent problems?"

**Why it matters:**
- Metrics drive continuous improvement
- Automated metric collection replaces manual reporting
- Real-time dashboards replace end-of-month spreadsheets

**How we'll capture it:**
```yaml
kpis:
  - name: Average Correction Turnaround Time
    current_measurement: Manually calculated in Excel once per quarter
    target: < 10 business days
    future_measurement: Auto-calculated daily, real-time dashboard
    early_warning: Alert if any project at 7 days without all corrections complete

  - name: % Permits Approved First Submission
    current_measurement: Not tracked (no data)
    target: > 40% (industry benchmark)
    future_measurement: Auto-tracked per project, trended monthly
    insight_opportunity: Identify which designers have higher first-pass rates, share best practices
```

**🔮 Transformation Opportunity:**
- **Current**: No visibility into performance, rely on gut feel
- **Future**: Real-time dashboards, predictive alerts, data-driven improvement

---

#### 🔟 **What Goes Wrong (Edge Cases)**

**What we'll ask:**
- "What's the worst thing that can happen in this workflow?"
- "Tell me about a time when something went wrong"
- "What happens if a deadline is missed?"
- "What if the data is wrong or missing?"
- "What if an external system is down?"

**Why it matters:**
- Edge cases often reveal the most important automations
- Proper error handling prevents catastrophic failures
- Alternate paths need to be designed, not discovered in production

**How we'll capture it:**
```yaml
edge_cases:
  - name: Consultant Doesn't Respond to Correction Assignment
    frequency: 10-15% of projects
    current_handling:
      - Designer follows up via phone after 7 days
      - If still no response, escalate to Design Team Lead
      - Lead contacts backup consultant
      - 2-3 weeks additional delay
    future_handling:
      - System sends auto-reminder at day 3
      - System escalates to Lead at day 7
      - Lead engages backup consultant via portal
      - 1 week delay (50% improvement)
```

**🔮 Transformation Opportunity:**
- **Current**: Consultant delays caught late, significant project impact
- **Future**: Proactive reminders, early escalation, faster recovery

---

## What We're Looking For (The Good Stuff)

### 🚀 Automation Gold Mines

**High-value automation opportunities** we're actively looking for:

1. **Manual data entry** (copying from one system to another)
   - Example: "I copy project details from BPO into Connect, takes 15 minutes per loan"
   - **Opportunity**: Auto-populate form from BPO API

2. **Repetitive document assembly** (combining PDFs, filling templates)
   - Example: "I manually compile 10 PDFs into permit submission package, takes 30 minutes"
   - **Opportunity**: One-click PDF assembly from S3 storage

3. **Email coordination** (sending status updates, reminders, assignments)
   - Example: "I email 5 consultants with project details, then chase them down for deliverables"
   - **Opportunity**: Automated task assignments via portal, SLA tracking

4. **Data extraction from documents** (reading PDFs/emails to extract info)
   - Example: "I read 20-page title report to find property legal description and easements"
   - **Opportunity**: Azure Document Intelligence auto-extraction

5. **Status checking** (logging into multiple systems to see progress)
   - Example: "I check jurisdiction portal daily to see if permit has been reviewed"
   - **Opportunity**: Web scraping + automated status updates

6. **Manual calculations** (spreadsheet formulas, copy/paste into forms)
   - Example: "I calculate loan-to-value ratio manually for every draw approval"
   - **Opportunity**: Auto-calculate from loan data, flag if LTV exceeds threshold

7. **"Swivel chair" workflows** (same task in multiple systems)
   - Example: "I update project status in BPO, then update it again in SharePoint, then again in Connect"
   - **Opportunity**: Single source of truth, status syncs automatically

8. **Manual quality checks** (reviewing work for common mistakes)
   - Example: "I manually check that all required documents are uploaded before funding loan"
   - **Opportunity**: System validation blocks funding until checklist complete

### 🎯 Integration Opportunities

**External systems we want to connect**:

1. **Same data in multiple places** → Opportunity for integration
   - Example: "Project address is in BPO, SharePoint, and Connect"
   - **Solution**: BPO is source of truth, syncs to other systems

2. **Manual file transfers** → Opportunity for automated sync
   - Example: "Consultants email me drawings, I download and upload to SharePoint"
   - **Solution**: Consultant portal uploads directly to S3, auto-links to project

3. **Waiting for external confirmations** → Opportunity for webhooks
   - Example: "I check DocuSign daily to see if client signed schematic approval"
   - **Solution**: DocuSign webhook notifies system immediately, auto-advances workflow

### 📊 Insight Opportunities

**Data that's currently invisible but would be valuable**:

1. **Where time is actually spent**
   - Example: "I have no idea how long schematic design actually takes across all projects"
   - **Solution**: Time tracking integration, automatic phase duration calculation

2. **Bottleneck identification**
   - Example: "I know projects are delayed, but I can't pinpoint if it's our team or the city"
   - **Solution**: Track time in each state, identify outliers, flag delays early

3. **Performance comparisons**
   - Example: "I wonder if Junior Designer A is faster than Junior Designer B"
   - **Solution**: Productivity dashboard, hours per project by designer

4. **Predictive insights**
   - Example: "I wish I knew which projects are likely to have 3+ correction rounds"
   - **Solution**: ML model based on jurisdiction, project complexity, designer experience

### ⚡ "Magic Wand" Moments

**When we ask "If you could wave a magic wand...", we're listening for:**

- "I wish I never had to manually..."
- "It would be amazing if the system could automatically..."
- "My dream is to have a dashboard that shows..."
- "I spend so much time on X when I should be doing Y..."
- "If I could just click one button and have it..."

**These are the transformation opportunities that make Connect 2.0 10x better than the current system.**

---

## How to Think About This (Mindset)

### ✅ DO: Think Big

- **Challenge the status quo**: "Why do we do it this way?" might reveal outdated assumptions
- **Imagine the ideal**: What would this workflow look like if designed from scratch today?
- **Focus on outcomes**: What are you *really* trying to achieve? (not just "complete this step")
- **Identify waste**: What do you do that adds no value? (waiting, checking, copying, searching)

### ❌ DON'T: Assume Constraints

- **Don't assume manual is necessary**: "We have to manually check..." → Maybe we don't!
- **Don't assume current tools are final**: "SharePoint can't do that..." → Connect 2.0 might!
- **Don't assume current process is optimal**: "We've always done it this way..." → Let's reimagine!
- **Don't assume technology limits**: "That's impossible..." → AI and automation have come a long way!

### 🎯 The Goal: 10x Improvement, Not 10% Improvement

We're not trying to make the current process 10% faster.
We're trying to **eliminate entire categories of work** and **enable entirely new capabilities**.

**Examples:**

**10% improvement:**
- Make the form submission button bigger so it's easier to click
- Add a "recently viewed" list to find projects faster

**10x improvement:**
- Eliminate the form entirely—data flows automatically from intake system
- Voice-activated project search: "Show me all Seattle permits awaiting corrections"
- AI chatbot that answers "What's the status of Greenwood Townhomes?" instantly

**We're aiming for 10x.**

---

## Sample Workshop Questions (What to Expect)

We'll ask a mix of **current state** and **future state** questions:

### Current State (Understanding Pain)

1. "Walk me through how you do [workflow] today, step by step"
2. "What tools or systems do you use for this?"
3. "How long does each step take?"
4. "Where do you spend the most time?"
5. "What's the most frustrating part of this process?"
6. "What causes this workflow to get stuck or delayed?"
7. "How do you know when this step is complete?"
8. "What data do you need to complete this step, and where do you get it?"

### Future State (Imagining Transformation)

1. "If you could automate one thing in this workflow, what would it be?"
2. "What decision could the system make for you if it had the right data?"
3. "What would you want to be notified about proactively?"
4. "If we could eliminate this step entirely, what would need to happen upstream?"
5. "What data do you *wish* you had to make better decisions?"
6. "How would you measure success for this workflow if you had perfect data?"
7. "What early warning signals would help you prevent problems?"
8. "What would a dashboard for this workflow show you in real-time?"

### Edge Cases & Exceptions

1. "Tell me about a time when this workflow went wrong"
2. "What's the worst-case scenario you've encountered?"
3. "What happens if [system] is down or [person] is unavailable?"
4. "How do you handle rush jobs or expedited requests?"
5. "What do you do when data is missing or incorrect?"

---

## After the Workshop (What Happens Next)

### Immediate (Within 48 hours)

1. **We'll send you photos/screenshots** of the whiteboard and diagrams
2. **Quick validation email**: "Did we capture this correctly?"
3. **You review and provide feedback**: Corrections, additions, missed details

### Short-Term (Within 1 week)

1. **We'll create a draft workflow document** using the framework
2. **You'll review the automation opportunities** we identified
3. **We'll prioritize together**: Quick wins vs long-term transformations

### Medium-Term (Within 2 weeks)

1. **We'll design the UI mockups** showing the reimagined workflow
2. **You'll give feedback**: "That's perfect!" or "I'd change X to Y"
3. **We'll finalize requirements** and add to the product backlog

### Long-Term (Implementation)

1. **We build in phases**: Quick wins first (automation low-hanging fruit)
2. **You test and provide feedback**: Real data, real workflows
3. **We iterate**: Refine based on your usage and feedback
4. **You see results**: Time saved, errors eliminated, insights surfaced

---

## Workshop Prep Checklist

**Print this and bring it to the workshop:**

### Before the Workshop

- [ ] Identified my most painful workflow step
- [ ] Brought a real example (project name, dates, artifacts)
- [ ] Thought about what I wish could be automated
- [ ] Listed 2-3 "magic wand" improvements I'd love to see
- [ ] Reviewed the 10 components we'll capture (entities, actors, events, actions, decisions, inputs/outputs, rules, integrations, metrics, edge cases)

### During the Workshop

- [ ] Shared real examples and pain points openly
- [ ] Challenged assumptions ("Why do we do it this way?")
- [ ] Focused on outcomes, not just mechanics
- [ ] Identified automation opportunities
- [ ] Described ideal future state
- [ ] Captured edge cases and what-if scenarios

### After the Workshop

- [ ] Reviewed whiteboard photos/diagrams within 48 hours
- [ ] Provided feedback and corrections
- [ ] Prioritized automation opportunities with the team
- [ ] Reviewed UI mockups when ready
- [ ] Scheduled follow-up session if needed

---

## Key Takeaways

### Remember: We're Partners in This

- **You're the expert** in your workflow and domain
- **We're the experts** in technology and automation
- **Together** we'll design something 10x better than what exists today

### Be Honest About Pain Points

- The worse the current process, the bigger the opportunity for improvement
- Don't sugarcoat it—tell us what drives you crazy
- "This takes me 4 hours every Friday and I hate it" → Great! Let's automate it.

### Think Beyond "Lift and Shift"

- We're not just moving your current process to a new system
- We're reimagining how work gets done with modern tools
- Your input helps us identify transformation opportunities

### Ask Questions

- "Can the system do X?" → Maybe! Let's explore.
- "Why do we need to track Y?" → Good question! Let's validate.
- "What if we just eliminated Z entirely?" → Love it! Let's consider it.

---

## Questions Before the Workshop?

**Contact:**
- Clay Campbell (Solutions Architect): clay@example.com
- [Your Project Manager]: pm@example.com

**Additional Resources:**
- [Workflow Analysis Framework](WORKFLOW_ANALYSIS_FRAMEWORK.md) - Detailed technical reference
- [Product Requirements Document](../../PRODUCT_REQUIREMENTS_DOCUMENT.md) - Overall Connect 2.0 vision
- [Design Team Integration Architecture](../../starter-kit/windmill-tests/DESIGN_TEAM_INTEGRATION_ARCHITECTURE.md) - Example of completed analysis

---

**Document Version**: 1.0
**Last Updated**: December 23, 2025
**Status**: Ready for Distribution
**Next Review**: After first workshop pilot
