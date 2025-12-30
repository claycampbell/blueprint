# Claude Code Assessment - Project Search Component

**Candidate:** Raúl Díaz
**Time Limit:** 1-2 hours maximum
**Date:** [To be scheduled]

## Overview

Welcome! This assessment evaluates how you collaborate with **Claude Code**, an AI pair programming tool we use extensively at Blueprint/Datapage. Since this may be your first time using Claude Code, we're evaluating:

- **Learning agility** - How quickly you adapt to new tools
- **AI collaboration** - How you communicate with and guide Claude Code
- **Problem-solving** - How you break down and implement features
- **Code quality** - TypeScript, React, and testing fundamentals

We care more about **your process and thinking** than perfect execution.

---

## Prerequisites

Before starting, ensure you have:

- ✅ Cloned this repository
- ✅ Installed [Claude Code](https://claude.ai/download)
- ✅ Node.js 18+ installed
- ✅ Docker Desktop running
- ✅ Read [README.md](../../README.md) and [CLAUDE.md](../../CLAUDE.md)

---

## Part 1: Setup & Familiarization (15 minutes)

### Task 1.1: Understand the Project

1. Open this repository in VS Code
2. Start Claude Code (Command Palette → "Claude Code: Start")
3. **Ask Claude Code to help you:**
   - Explain the Blueprint/Connect 2.0 project purpose
   - Walk through the project structure
   - Review the technology stack in [TECHNOLOGY_STACK_DECISION.md](../TECHNOLOGY_STACK_DECISION.md)

**Tip:** The more specific your questions to Claude Code, the better the responses.

### Task 1.2: Set Up Development Environment

Ask Claude Code to help you:
```bash
cd starter-kit
npm install
npm run dev
```

Verify the app runs at http://localhost:3000

**What we're observing:**
- Do you read documentation first or jump straight to coding?
- Quality of questions you ask Claude Code
- Ability to troubleshoot setup issues with AI assistance

---

## Part 2: Feature Implementation (45-60 minutes)

### Your Mission: Build a Project Search Component

Using **Claude Code as your primary pair programming partner**, build a React component that allows users to search for construction projects in the Connect 2.0 platform.

### Requirements

#### 2.1 Create TypeScript Types

**File:** `starter-kit/src/types/project.ts` (starter provided)

Add any additional types needed for your implementation.

#### 2.2 Build Mock API Service

**File:** `starter-kit/src/services/projectApi.ts`

Create a service that:
- Simulates async data fetching (500ms delay)
- Returns 10-20 mock projects
- Filters projects by search query (case-insensitive, matches name or address)
- Handles errors gracefully
- **Fully typed with TypeScript**

**Mock data should include:**
- Project name (e.g., "Maple Ridge Townhomes")
- Status (Active, Feasibility, Entitlement, Complete)
- Address (street address)
- Created date
- Project ID (unique)

#### 2.3 Implement ProjectSearch Component

**File:** `starter-kit/src/components/connect/ProjectSearch.tsx`

Build a component with:

**UI Elements:**
- Search input field with placeholder text
- Debounced search (300ms delay after user stops typing)
- Results displayed in a table with columns:
  - Project Name
  - Status (with color coding or badges)
  - Address
  - Created Date (formatted: MM/DD/YYYY)
- Loading spinner while fetching
- Error message display if API fails
- "No results found" state
- Responsive design (mobile-friendly table)

**State Management:**
- Use **Zustand** (preferred) or React hooks
- Store: search query, results, loading state, error state

**TypeScript:**
- Strict typing throughout
- No `any` types
- Proper interface definitions

#### 2.4 Write Tests

**File:** `starter-kit/src/components/connect/ProjectSearch.test.tsx`

Using Jest + React Testing Library, write tests for:

1. **Renders correctly** - Component mounts without errors
2. **Handles search input** - Typing in search box triggers search
3. **Displays results** - Mock data appears in table
4. **Shows loading state** - Loading spinner appears during fetch
5. **(Bonus) Error handling** - Error message displays on API failure

**Minimum:** 2-3 meaningful tests that pass

#### 2.5 Add Component to Demo Page

**File:** `starter-kit/src/app/(dashboard)/demo/page.tsx` (create if needed)

Add your `ProjectSearch` component to a demo page so we can see it in action.

---

## Collaboration Guidelines

### ✅ DO:
- Ask Claude Code to generate code, explain concepts, and debug
- Iterate on Claude's suggestions ("make this more type-safe", "add error handling")
- Request code reviews from Claude Code
- Use Claude Code to write tests
- Reference project documentation in your prompts (e.g., "According to CLAUDE.md...")
- Break the problem into smaller pieces and tackle incrementally

### ❌ DON'T:
- Copy code from Stack Overflow, ChatGPT, or other external sources
- Ask humans for help (this is a solo assessment)
- Spend more than 2 hours total (submit what you have)

---

## Part 3: Documentation & Reflection (15 minutes)

### Task 3.1: Create Your Assessment Summary

**File:** `docs/assessment/RAUL_SUMMARY.md`

Include the following sections:

#### 1. Approach Summary (3-4 sentences)
- How did you break down the problem?
- What was your first prompt to Claude Code?
- What was your implementation strategy?

#### 2. Claude Code Interaction Log
List 5-7 key prompts you gave Claude Code:

**Example:**
```
1. "Explain how to set up a Zustand store for search state management"
2. "Generate a mock API service that returns project data with TypeScript types"
3. "Review my ProjectSearch component for potential bugs or improvements"
...
```

#### 3. Challenges & Solutions
- What was the hardest part of this assessment?
- How did Claude Code help (or not help)?
- What would you do differently if you started over?
- Did you get stuck anywhere? How did you get unstuck?

#### 4. Code Quality Self-Assessment
Rate your solution (1-5 stars) on:
- **TypeScript usage:** [rating] - Why?
- **Component design:** [rating] - Why?
- **Testing coverage:** [rating] - Why?
- **What would you improve with more time?**

#### 5. Claude Code Experience
- What surprised you most about working with Claude Code?
- How does it compare to other AI coding tools you've used (Copilot, etc.)?
- How would you use Claude Code on the real Connect 2.0 project?

---

## Submission Instructions

### Git Workflow

**Commit frequently** as you make progress:

```bash
git add <files>
git commit -m "feat: add Project type definitions"
git commit -m "feat: implement mock project API service"
git commit -m "feat: create ProjectSearch component with search input"
git commit -m "test: add unit tests for ProjectSearch"
# etc.
```

Use [conventional commit format](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Adding tests
- `docs:` - Documentation
- `refactor:` - Code refactoring

### Final Submission

When complete (or at 2-hour mark):

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "docs: add assessment summary"
   ```

2. **Push your branch:**
   ```bash
   git push origin raul/assessment-project-search
   ```

3. **Create a draft PR:**
   ```bash
   gh pr create --draft --title "Assessment: Raúl Díaz - Project Search Component" --body "Assessment completion. See docs/assessment/RAUL_SUMMARY.md for details."
   ```

   Or use GitHub web UI: https://github.com/claycampbell/blueprint/compare

4. **Email Clay Campbell:**
   - Subject: "Claude Code Assessment Complete"
   - Include: PR link, actual time spent, any blockers encountered

---

## Time Tracking

**Honor system:** Note your actual time spent

- If you hit **2 hours**, stop and submit what you have
- It's okay if it's incomplete—we want to see your process
- Document any blockers in your summary

**Time breakdown suggestion:**
- Setup & familiarization: 15 mins
- Types & API service: 20 mins
- React component: 30 mins
- Tests: 15 mins
- Documentation: 15 mins
- Buffer: 5 mins

---

## What We're Evaluating

### Primary Focus (70%)
1. **Claude Code collaboration** - Prompt quality, iteration, problem decomposition
2. **Code quality** - TypeScript usage, component design, error handling
3. **Communication** - Summary document, commit messages, self-awareness

### Secondary Focus (30%)
4. **Testing** - Meaningful tests that actually validate behavior
5. **Problem-solving** - Scope management, adaptability, pragmatism

**We expect:**
- ✅ Working component (even if not perfect)
- ✅ Tests that pass
- ✅ TypeScript compiles without errors
- ✅ Git history showing incremental progress
- ✅ Thoughtful reflection document

**We DON'T expect:**
- ❌ Production-ready, pixel-perfect UI
- ❌ Comprehensive test coverage (80%+)
- ❌ Advanced optimizations (virtualization, etc.)

---

## Helpful Resources

- **Claude Code Docs:** https://code.claude.com/docs/
- **Project Overview:** [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md)
- **Tech Stack:** [TECHNOLOGY_STACK_DECISION.md](../TECHNOLOGY_STACK_DECISION.md)
- **Project Guidelines:** [CLAUDE.md](../../CLAUDE.md)

---

## Questions?

If you encounter **blocking technical issues** (e.g., npm install fails, Claude Code won't start):
- Email Clay immediately—don't waste time debugging environment issues
- Document the issue in your summary

For **feature clarifications**, use your best judgment and document assumptions in your summary.

---

## Ready to Begin?

1. ✅ Read these instructions thoroughly
2. ✅ Reviewed CLAUDE.md and tech stack docs
3. ✅ Environment set up and working
4. ✅ Claude Code installed and running
5. ✅ Timer started (2 hour max)

**Create your branch and start coding:**
```bash
git checkout -b raul/assessment-project-search
```

Good luck! We're excited to see how you work with Claude Code. 🚀
