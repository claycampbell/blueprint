# Assessment Materials

This directory contains assessment materials for evaluating candidates for the Blueprint/Datapage Connect 2.0 development team.

## Current Assessment: Raúl Díaz - Claude Code Evaluation

**Assessment Type:** Hands-on coding exercise with Claude Code pair programming
**Duration:** 1-2 hours
**Date:** [To be scheduled]

### Files in This Directory

- **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** - Complete candidate instructions for the assessment
- **[EVALUATION_RUBRIC.md](./EVALUATION_RUBRIC.md)** - Internal scoring rubric for reviewers
- **RAUL_SUMMARY.md** - Candidate's reflection document (created during assessment)

### Assessment Overview

**Objective:** Evaluate how Raúl Díaz collaborates with Claude Code, an AI pair programming tool central to our development workflow.

**Task:** Build a "Project Search" React component with TypeScript, using Claude Code as the primary development partner.

**Deliverables:**
1. TypeScript type definitions ([starter-kit/src/types/project.ts](../../starter-kit/src/types/project.ts))
2. Mock API service (`starter-kit/src/services/projectApi.ts`)
3. React component (`starter-kit/src/components/connect/ProjectSearch.tsx`)
4. Unit tests (`starter-kit/src/components/connect/ProjectSearch.test.tsx`)
5. Reflection document (`docs/assessment/RAUL_SUMMARY.md`)

### Evaluation Criteria (Weighted)

| Category | Weight | Focus Areas |
|----------|--------|-------------|
| **Claude Code Collaboration** | 40% | Prompt quality, iteration, problem decomposition |
| **Code Quality** | 30% | TypeScript, component design, testing |
| **Communication** | 20% | Documentation, commits, self-awareness |
| **Problem-Solving** | 10% | Adaptability, scope management, pragmatism |

### Scoring Guide

| Score Range | Decision |
|-------------|----------|
| **43-50** | Strong Hire - Excellent AI collaboration, clean code, fast learner |
| **35-42** | Hire - Solid fundamentals, good Claude Code adoption |
| **28-34** | Maybe - Some concerns, needs discussion |
| **<28** | No Hire - Fundamental gaps or poor AI tool usage |

### Assessment Workflow

**Phase 1: Preparation (24 hours before)**
1. Send [INSTRUCTIONS.md](./INSTRUCTIONS.md) to candidate
2. Ensure candidate has:
   - Repository access
   - Claude Code installed
   - Development environment set up

**Phase 2: Assessment (1-2 hours)**
1. Candidate creates branch: `raul/assessment-project-search`
2. Completes coding exercise with Claude Code
3. Documents experience in `RAUL_SUMMARY.md`
4. Submits via pull request

**Phase 3: Evaluation (1 hour)**
1. Reviewer uses [EVALUATION_RUBRIC.md](./EVALUATION_RUBRIC.md)
2. Test code functionality:
   ```bash
   cd starter-kit
   npm install
   npm run dev
   npm test
   npx tsc --noEmit
   ```
3. Review git history and PR
4. Score assessment and make hiring recommendation

**Phase 4: Review Call (30 minutes)**
1. Screen share candidate's code
2. Discuss approach and decisions
3. Deep dive on Claude Code experience
4. Answer candidate questions
5. Determine next steps

### Key Success Indicators

**We're looking for:**
- ✅ **Effective AI collaboration** - Iterative prompts, refines suggestions, asks "why"
- ✅ **Clean TypeScript** - Strict typing, no `any`, proper interfaces
- ✅ **Incremental commits** - Shows thought process and progression
- ✅ **Self-awareness** - Honest reflection, identifies areas for improvement
- ✅ **Pragmatic approach** - MVP mindset, balances quality with delivery

**Red flags:**
- ❌ Copy-paste from external sources (not Claude Code)
- ❌ One giant commit or chaotic git history
- ❌ Code doesn't compile or run
- ❌ No evidence of Claude Code interaction
- ❌ Poor communication or unprofessional conduct

### Reference Materials

**For Candidates:**
- [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md) - Connect 2.0 overview
- [TECHNOLOGY_STACK_DECISION.md](../TECHNOLOGY_STACK_DECISION.md) - Tech stack details
- [CLAUDE.md](../../CLAUDE.md) - Project guidelines and AI assistant instructions

**For Reviewers:**
- [SPRINT_ALLOCATION_PLAN.md](../planning/SPRINT_ALLOCATION_PLAN.md) - Team structure context
- [WORKFLOW_BASED_EPIC_STRUCTURE.md](../planning/WORKFLOW_BASED_EPIC_STRUCTURE.md) - Epic organization

### Post-Assessment Actions

**If Strong Hire / Hire:**
- [ ] Schedule final interview round
- [ ] Discuss compensation and start date
- [ ] Send offer letter
- [ ] Assign onboarding Epic (DP01-65 LocalStack exercise)

**If Maybe:**
- [ ] Schedule additional technical discussion
- [ ] Request follow-up exercise (different scope)
- [ ] Discuss concerns with hiring team

**If No Hire:**
- [ ] Provide constructive feedback to candidate
- [ ] Document lessons learned for future assessments
- [ ] Archive assessment branch

---

**Assessment Created:** December 30, 2025
**Assessment Owner:** Clay Campbell
**Project:** DP01 - Datapage Phase 1
**Position:** Frontend Developer (React/TypeScript)
