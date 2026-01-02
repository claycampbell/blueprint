# Demo Enhancement Task Breakdown

## Goal
Transform the current basic demo into a compelling, interactive comparison that clearly demonstrates the differences between workflow-centric and state-machine approaches.

## Critical Path Components

### 🎯 Priority 1: Core Comparison (Must Have)

**Component 1: Workflow UI** (Agent: UI Builder)
- Traditional stage-based interface
- Current stage display with checklist
- "Advance to Next Stage" / "Go Back" buttons
- Stage validation (can't advance until complete)
- Visual limitations when exceptions occur

**Component 2: Side-by-Side Comparison** (Agent: Layout Specialist)
- 50/50 split layout
- Synchronized property data
- View toggle (workflow-only, state-machine-only, both)
- Visual divider with model labels
- Responsive design

**Component 3: Scenario Player** (Agent: Interaction Designer)
- Play/pause/reset controls
- Event timeline visualization
- Auto-play with configurable speed
- Step-by-step manual mode
- Event handlers updating both models

### 🎯 Priority 2: Scenario Demonstrations (Must Have)

**Scenario A: Happy Path** (Agent: Scenario Developer)
- Standard subdivision progression
- Both models work identically
- Narration: "Both models handle this well"

**Scenario B: Exception Handling** ⭐ CRITICAL (Agent: Scenario Developer)
- Property returns to feasibility from entitlement
- Workflow: ❌ Error messages, workarounds, confusion
- State Machine: ✅ Natural transition
- Visual annotations highlighting differences

**Scenario C: Concurrent Processes** (Agent: Scenario Developer)
- 3+ processes running simultaneously
- Workflow: ❌ "Where does property live?"
- State Machine: ✅ All processes visible as cards

**Scenario D: Property Type Variations** (Agent: Scenario Developer)
- Multi-family rehab skips entitlement
- Workflow: ❌ Need different workflow definition
- State Machine: ✅ Process availability adapts

### 🎯 Priority 3: Storytelling & Guidance (Should Have)

**Component 4: Visual Annotations** (Agent: UX Enhancer)
- Callout components (info boxes, tooltips)
- Problem indicators (red borders, warnings) in workflow view
- Success indicators (green checkmarks) in state machine view
- "Watch what happens..." prompts

**Component 5: Guided Tour** (Agent: Tutorial Builder)
- Tour overlay with step-by-step instructions
- Highlight UI elements as tour progresses
- Intro screen explaining demo purpose
- Skip/Restart options

**Component 6: Metrics Dashboard** (Agent: Analytics Developer)
- Steps required comparison
- Complexity score (workarounds needed)
- Comparative charts (cycle time, ease)
- Mental model alignment rating

### 🎯 Priority 4: Interactivity (Nice to Have)

**Component 7: Interactive Controls** (Agent: Interaction Designer)
- "Trigger Event" buttons
- Process start/stop actions
- Real-time state sync between views
- Undo/redo functionality

**Component 8: Polish** (Agent: UX Enhancer)
- Loading states and transitions
- Mobile responsiveness
- Keyboard shortcuts
- Print-friendly summary

## Agent Assignments

### Agent 1: Workflow UI Builder
**Focus:** Build traditional workflow-centric interface
**Deliverables:**
- WorkflowView component
- Stage display with progress bar
- Checklist component
- Navigation buttons with validation
- Exception handling (show limitations)

**Files to Create:**
- `src/components/workflow/WorkflowView.tsx`
- `src/components/workflow/StageDisplay.tsx`
- `src/components/workflow/Checklist.tsx`
- `src/components/workflow/StageNavigation.tsx`

### Agent 2: Comparison Layout Specialist
**Focus:** Create side-by-side comparison infrastructure
**Deliverables:**
- ComparisonView layout component
- View toggle controls
- Synchronized state management
- Visual dividers and labels

**Files to Create:**
- `src/components/ComparisonView.tsx`
- `src/components/ViewToggle.tsx`
- `src/hooks/useSyncedProperty.ts`

### Agent 3: Scenario Player Developer
**Focus:** Build interactive scenario playback system
**Deliverables:**
- ScenarioPlayer component
- Event timeline visualization
- Auto-play and manual controls
- Event dispatching to both models

**Files to Create:**
- `src/components/ScenarioPlayer.tsx`
- `src/components/EventTimeline.tsx`
- `src/hooks/useScenarioPlayback.ts`
- `src/utils/scenarioEngine.ts`

### Agent 4: Scenario Content Developer
**Focus:** Implement all 4 scenario demonstrations
**Deliverables:**
- Scenario A, B, C, D event definitions
- Model-specific responses to events
- Visual annotations for each scenario
- Narration text

**Files to Create:**
- `src/data/scenarios/scenarioA.ts`
- `src/data/scenarios/scenarioB.ts`
- `src/data/scenarios/scenarioC.ts`
- `src/data/scenarios/scenarioD.ts`
- `src/components/scenarios/ScenarioAnnotations.tsx`

### Agent 5: Visual Storytelling Specialist
**Focus:** Add callouts, annotations, visual indicators
**Deliverables:**
- Annotation components
- Problem/success indicators
- Tooltip system
- Prompt overlays

**Files to Create:**
- `src/components/annotations/Callout.tsx`
- `src/components/annotations/ProblemIndicator.tsx`
- `src/components/annotations/SuccessIndicator.tsx`
- `src/components/annotations/Prompt.tsx`

### Agent 6: Tutorial Builder
**Focus:** Create guided tour experience
**Deliverables:**
- Tour overlay component
- Step-by-step instructions
- Intro screen
- Tour controls

**Files to Create:**
- `src/components/tour/GuidedTour.tsx`
- `src/components/tour/TourStep.tsx`
- `src/components/tour/IntroScreen.tsx`
- `src/data/tourSteps.ts`

## Execution Plan

### Phase 1: Foundation (Agents 1, 2)
Run in parallel:
- Agent 1: Build Workflow UI
- Agent 2: Build Comparison Layout

**Output:** Side-by-side view with workflow UI + existing state machine UI

### Phase 2: Interactivity (Agent 3, 4)
Run in parallel:
- Agent 3: Build Scenario Player
- Agent 4: Implement Scenario B (exception handling) - CRITICAL

**Output:** Working demo of exception scenario showing model differences

### Phase 3: Storytelling (Agent 5, 6)
Run in parallel:
- Agent 5: Add visual annotations
- Agent 6: Build guided tour

**Output:** Polished, guided experience

### Phase 4: Remaining Scenarios (Agent 4)
Sequential:
- Implement Scenario A (happy path)
- Implement Scenario C (concurrent)
- Implement Scenario D (property types)

**Output:** Full scenario suite

## Success Criteria

### Minimum Viable Demo (Phase 1 + 2)
✅ Side-by-side workflow vs state machine UI
✅ Scenario B (exception) demonstrates clear difference
✅ Interactive playback controls

### Complete Demo (All Phases)
✅ All 4 scenarios implemented
✅ Guided tour for first-time users
✅ Visual annotations highlighting differences
✅ Metrics showing model comparison

## Technical Requirements

**Shared State Management:**
- Single source of truth for property state
- Both UIs read from same state
- Events update both views simultaneously

**Component Structure:**
```
src/
├── components/
│   ├── workflow/           # Agent 1
│   ├── stateMachine/       # Existing + enhancements
│   ├── ComparisonView.tsx  # Agent 2
│   ├── ScenarioPlayer.tsx  # Agent 3
│   ├── scenarios/          # Agent 4
│   ├── annotations/        # Agent 5
│   └── tour/               # Agent 6
├── data/
│   └── scenarios/          # Agent 4
├── hooks/
│   ├── useSyncedProperty.ts    # Agent 2
│   └── useScenarioPlayback.ts  # Agent 3
└── utils/
    └── scenarioEngine.ts   # Agent 3
```

## Next Steps

1. **Review and approve task breakdown**
2. **Launch agents in parallel for Phase 1**
3. **Review Phase 1 output**
4. **Launch agents for Phase 2**
5. **Iterate based on findings**

---

**Document Status:** Ready for agent deployment
**Estimated Total Effort:** 6-8 agents working in parallel across 4 phases
**Timeline:** Phases 1-2 complete = viable demo for stakeholder review
