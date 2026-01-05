# Assessment Invitation Email - Raúl Díaz

---

**Subject:** Blueprint/Datapage Assessment - Project Search Component (1-2 hours)

---

Hi Raúl,

Thanks for your interest in joining the Blueprint/Datapage team! We're excited to see how you collaborate with AI tooling, which is central to our development workflow.

## Assessment Overview

**What:** Build a React component using Claude Code as your pair programming partner
**Time:** 1-2 hours maximum (honor system - stop at 2 hours regardless of completion)
**When:** Schedule at your convenience in the next 3 days
**Format:** Solo assessment (no human assistance)

## What You'll Build

A **Project Search Component** for our Connect 2.0 construction management platform:
- TypeScript types for construction projects
- Mock API service with async data fetching
- React component with debounced search
- Unit tests (Jest + React Testing Library)
- Reflection document summarizing your experience

## What We're Evaluating

**Primary focus (70%):**
- How you collaborate with Claude Code (prompt quality, iteration)
- Code quality (TypeScript usage, component design)
- Communication (documentation, self-awareness)

**Secondary focus (30%):**
- Testing approach
- Problem-solving and pragmatism

**We expect:** Working code with tests, even if not perfect
**We DON'T expect:** Production-ready, pixel-perfect UI

## Before You Start

### 1. Install Claude Code (5 minutes)
Download from: https://claude.ai/download

This is Anthropic's official CLI tool - similar to GitHub Copilot but with full codebase awareness. **You'll use this as your primary development partner throughout the assessment.**

**API Access:** Claude Code requires API access. I'll provide you with an Anthropic API key for the assessment (no cost to you). You'll receive the key 24 hours before your scheduled start time along with setup instructions.

### 2. Accept GitHub Invitation
I'll send you a repository invitation 24 hours before you plan to start. The repo is private and contains:
- Assessment instructions (detailed requirements)
- Next.js 15 + TypeScript starter kit
- Material-UI v6 components
- Testing framework (Jest + RTL)

### 3. System Requirements
- Node.js 18+ installed
- Git configured
- VS Code (recommended)
- GitHub account with access to the private repo

## Starting the Assessment

### Step 1: Clone the Repository
```bash
git clone https://github.com/claycampbell/blueprint-assessment-starter.git
cd blueprint-assessment-starter
```

### Step 2: Read the Instructions
Open `docs/assessment/INSTRUCTIONS.md` - this is your complete guide.

### Step 3: Set Up Your Environment
```bash
cd starter-kit
npm install
npm run dev
```

Verify the app runs at `http://localhost:3000`

### Step 4: Create Your Branch
```bash
git checkout -b raul/assessment-project-search
```

### Step 5: Start Building!
Use Claude Code to help you implement the requirements. The more you collaborate with it, the better we can evaluate your AI partnership skills.

**Optional:** Use the time tracker to measure your progress:
```bash
node track-time.js start
```

## Collaboration Guidelines

### ✅ DO:
- Use Claude Code to generate, explain, debug, and review code
- Ask Claude Code specific questions about the tech stack
- Iterate on Claude's suggestions ("make this more type-safe")
- Reference project files in your prompts
- Commit frequently with descriptive messages

### ❌ DON'T:
- Copy code from Stack Overflow, ChatGPT, or other external sources
- Ask friends, colleagues, or online communities for help
- Spend more than 2 hours total (submit what you have)

## Submitting Your Work

When complete (or at the 2-hour mark):

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

4. **Email me back with:**
   - PR link
   - Actual time spent
   - Any blockers you encountered

## Important Notes

### Time Limit
**Stop at 2 hours** even if you're not done. We want to see your process, not perfect results. Document any incomplete work in your summary.

### Technical Issues
If you hit **blocking setup issues** (npm install fails, Claude Code won't start):
- Email me immediately: clay@datapage.com
- Don't waste time debugging environment problems
- We'll help or reschedule if needed

### Feature Questions
For **feature clarifications**, use your best judgment and document your assumptions in the reflection document.

### What Success Looks Like
- ✅ Component runs without errors
- ✅ Tests pass
- ✅ TypeScript compiles cleanly
- ✅ Git history shows your thought process
- ✅ Thoughtful reflection document

It's **perfectly fine** if:
- UI isn't polished or pixel-perfect
- Test coverage isn't comprehensive
- Some features are simplified
- You ran out of time

## Scheduling

**Reply to this email with your preferred start time** in the next 3 days. I'll send the GitHub invitation 24 hours before.

Example: "I'll start on Thursday, January 9th at 2:00 PM PST"

## Questions?

Feel free to ask about:
- Claude Code installation
- System requirements
- Assessment format or timeline

**After you start the assessment, please don't ask technical questions** - that's part of what we're evaluating (problem-solving with AI assistance).

## Why This Assessment?

At Blueprint/Datapage, we use Claude Code extensively for:
- Rapid prototyping and feature development
- Code review and quality improvements
- Documentation and testing
- Debugging and refactoring

This assessment mirrors how we actually work. Your ability to effectively collaborate with AI is just as important as your raw coding skills.

---

Looking forward to seeing your work!

Best,
Clay Campbell
VP of Technology
Blueprint Development / Datapage
clay@datapage.com
(206) 555-0123 *(example - use your real number)*

---

**P.S.** The assessment uses realistic development scenarios. If you encounter bugs or unexpected behavior while working with Claude Code, that's part of the learning experience - we want to see how you debug and iterate to solutions. Stay focused, trust your instincts, and don't hesitate to ask Claude Code for help when you're stuck!
