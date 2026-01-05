# Interviewer Quick Start Guide

**Assessment:** Claude Code Frontend Developer Evaluation
**Candidate:** Raúl Díaz
**Created:** December 30, 2025

---

## Pre-Assessment Checklist (Do This First)

### 1. Send Setup Email (2-3 days before assessment)

**Template:** [ASSESSMENT_SETUP_EMAIL.md](./ASSESSMENT_SETUP_EMAIL.md)

**Customize:**
- [ ] Insert specific assessment date/time
- [ ] Add your contact information
- [ ] Verify repository access for candidate
- [ ] Confirm all links work

**Send to:** [Raúl's email]

### 2. Grant Repository Access

```bash
# Add Raúl as a collaborator on GitHub
# Settings → Collaborators → Add people
# Username: [Raúl's GitHub username]
# Permission: Write (so he can push his branch)
```

### 3. Verify Assessment Branch

```bash
git checkout assessment/raul-diaz-starter
git pull origin assessment/raul-diaz-starter

# Verify files exist:
ls docs/assessment/INSTRUCTIONS.md
ls docs/assessment/EVALUATION_RUBRIC.md
ls starter-kit/src/types/project.ts
```

### 4. Test the Environment Yourself (Optional)

```bash
cd starter-kit
npm install
npm run dev  # Should work at http://localhost:3000
```

---

## During Assessment (Hands-Off)

**Your Role:** Observer only - do NOT help the candidate during the exercise.

**Candidate's Timeline:**
- ⏱️ Starts when ready (within scheduled window)
- ⏱️ Maximum 2 hours
- ⏱️ Submits via pull request

**What They're Building:**
- React `ProjectSearch` component (TypeScript)
- Mock API service (`projectApi.ts`)
- Unit tests (Jest + React Testing Library)
- Reflection document (`RAUL_SUMMARY.md`)

**Communication During Assessment:**
- ✅ **RESPOND:** If candidate emails about blocking environment issues (npm install fails, Docker won't start)
- ❌ **DON'T RESPOND:** Feature clarifications, "how do I..." questions, debugging help
- 📝 **NOTE:** If candidate emails during assessment, note this in evaluation (self-direction)

---

## Post-Submission Evaluation (1 hour)

### Step 1: Clone Candidate's Branch

```bash
git fetch origin
git checkout raul/assessment-project-search
```

### Step 2: Test the Code

**Check 1: Does it compile?**
```bash
cd starter-kit
npm install
npx tsc --noEmit
```

**Expected:** No TypeScript errors (or note errors in rubric)

**Check 2: Do tests pass?**
```bash
npm test -- ProjectSearch
```

**Expected:** Tests run and pass (note failures in rubric)

**Check 3: Does it run?**
```bash
npm run dev
# Navigate to http://localhost:3000
# Find the demo page or component
```

**Expected:** Component renders, search works, no crashes

### Step 3: Review Git History

```bash
git log --oneline --graph
```

**Look for:**
- ✅ 5-10 incremental commits showing progression
- ✅ Conventional commit messages (feat:, test:, docs:)
- ❌ One giant commit (red flag)
- ❌ Vague messages like "WIP" or "changes"

### Step 4: Code Review

**Open these files:**
1. `starter-kit/src/services/projectApi.ts` - Mock API implementation
2. `starter-kit/src/components/connect/ProjectSearch.tsx` - React component
3. `starter-kit/src/components/connect/ProjectSearch.test.tsx` - Unit tests
4. `docs/assessment/RAUL_SUMMARY.md` - Reflection document

**Check against:** [EVALUATION_RUBRIC.md](./EVALUATION_RUBRIC.md)

### Step 5: Score the Assessment

**Use:** [EVALUATION_RUBRIC.md](./EVALUATION_RUBRIC.md)

**Scoring breakdown:**
- **Claude Code Collaboration** (40%) - Review RAUL_SUMMARY.md for prompt examples
- **Code Quality** (30%) - TypeScript usage, component design, tests
- **Communication** (20%) - Summary doc, commit messages
- **Problem-Solving** (10%) - Scope management, adaptability

**Total Score:** __/50 points

**Decision Thresholds:**
- **43-50:** Strong Hire
- **35-42:** Hire
- **28-34:** Maybe
- **<28:** No Hire

---

## Live Code Review Call (30 minutes)

**Schedule within 2-3 days of submission**

### Agenda

**1. Candidate Walkthrough (5 mins)**
- "Walk me through your approach - where did you start?"
- "Show me your git history and explain the progression"

**2. Deep Dive on Implementation (10 mins)**

Pick ONE area to explore deeply:

**Option A: TypeScript Types**
```
Q: "Why did you structure the Project interface this way?"
Q: "Walk me through the type safety in your API service"
Q: "What did Claude Code suggest vs. what you changed?"
```

**Option B: State Management**
```
Q: "Explain your Zustand store setup (or hooks approach)"
Q: "How are you handling search debouncing?"
Q: "What would you refactor if you had more time?"
```

**Option C: Testing Strategy**
```
Q: "Walk me through your test cases - what are you validating?"
Q: "What edge cases did you consider?"
Q: "How did Claude Code help with testing?"
```

**3. Claude Code Experience (10 mins)**

Key questions:
- "What surprised you most about working with Claude Code?"
- "Show me an example of a good interaction vs. a frustrating one"
- "How does this compare to GitHub Copilot or other AI tools?"
- "How would you use Claude Code on the real Connect 2.0 project?"
- "What would you do differently next time?"

**4. Q&A and Next Steps (5 mins)**

- "What questions do you have about the role, project, or team?"
- Discuss next steps based on your evaluation

### Post-Call Actions

**If Strong Hire / Hire:**
- [ ] Schedule final interview round (if needed)
- [ ] Discuss compensation and start date
- [ ] Prepare offer letter
- [ ] Plan onboarding (Epic DP01-65 LocalStack exercise)

**If Maybe:**
- [ ] Schedule additional technical discussion
- [ ] Request follow-up exercise (different scope)
- [ ] Consult with hiring team

**If No Hire:**
- [ ] Send professional rejection email
- [ ] Offer constructive feedback (optional)
- [ ] Document lessons learned for future assessments

---

## Common Issues & Solutions

### Issue: Candidate's environment setup fails

**Solution:**
- Schedule quick troubleshooting call (15 mins)
- Don't count against assessment time
- Document the issue (Node version? Docker? M1 Mac?)

### Issue: Candidate goes way over time (3+ hours)

**Solution:**
- Note in evaluation (time management concern)
- Review what they accomplished in first 2 hours
- Discuss in live call: "What slowed you down?"

### Issue: Code doesn't run or has critical errors

**Solution:**
- Still conduct code review call
- Focus on approach and thinking, not just output
- Ask: "What would you debug first if you had more time?"

### Issue: Candidate's PR has no summary doc

**Solution:**
- Mark down significantly in Communication score
- Ask in call: "Can you walk me through your experience verbally?"

### Issue: Evidence of plagiarism (code copied from external sources)

**Red flags:**
- Git timestamps don't match (huge blocks added instantly)
- Code style drastically different across files
- Libraries or patterns not discussed in summary

**Action:**
- Immediate rejection
- Provide evidence to hiring team
- Don't proceed with review call

---

## Files Reference

| File | Purpose | When to Use |
|------|---------|-------------|
| [INSTRUCTIONS.md](./INSTRUCTIONS.md) | Candidate instructions | Send before assessment |
| [EVALUATION_RUBRIC.md](./EVALUATION_RUBRIC.md) | Scoring guide | During evaluation |
| [ASSESSMENT_SETUP_EMAIL.md](./ASSESSMENT_SETUP_EMAIL.md) | Email template | 2-3 days before |
| [README.md](./README.md) | Assessment overview | Reference anytime |
| This file | Quick start for interviewer | You're reading it! |

---

## Assessment Timeline Summary

| When | Action | Duration |
|------|--------|----------|
| **T-3 days** | Send setup email to candidate | 5 mins |
| **T-1 day** | Verify candidate confirmed & ready | 2 mins |
| **T-0** | Candidate completes assessment | 1-2 hours |
| **T+0** | Candidate submits PR | Immediate |
| **T+1 to T+2 days** | You evaluate submission | 1 hour |
| **T+2 to T+3 days** | Schedule code review call | 30 mins |
| **T+3 to T+5 days** | Make hiring decision | - |

---

## Questions or Issues?

**Assessment Design:**
- Reference: [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md)
- Tech Stack: [TECHNOLOGY_STACK_DECISION.md](../../TECHNOLOGY_STACK_DECISION.md)

**Hiring Process:**
- Consult with hiring team
- Review [SPRINT_ALLOCATION_PLAN.md](../planning/SPRINT_ALLOCATION_PLAN.md) for role context

**Technical Issues:**
- Test on your machine first
- Check #dev-connect-2.0 Slack channel (if applicable)

---

**Ready to start?** Send the setup email and you're good to go!

🎯 Goal: Find a developer who can leverage Claude Code to accelerate Connect 2.0 development while maintaining code quality.
