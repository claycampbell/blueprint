# Email Template - Assessment Setup

**To:** Raúl Díaz
**From:** Clay Campbell
**Subject:** Technical Assessment - Claude Code Pair Programming Exercise
**CC:** [Hiring team members]

---

Hi Raúl,

Thanks for your interest in the Frontend Developer position at Blueprint/Datapage! For the next step in our interview process, you'll complete a hands-on coding exercise that demonstrates how we work day-to-day on the Connect 2.0 platform.

## What You'll Be Doing

You'll build a small React component using **Claude Code**, an AI pair programming tool that's central to our development workflow. This assessment evaluates:

- **Learning agility** - How you adapt to new tools
- **AI collaboration** - How you communicate with and guide Claude Code
- **Code quality** - TypeScript, React, and testing fundamentals
- **Problem-solving** - How you break down and implement features

**Important:** We care more about your **process and thinking** than perfect execution. This is a learning experience, not a gotcha.

## Time Commitment

**1-2 hours maximum** - If you hit the 2-hour mark, submit whatever you have completed.

## What You'll Need

Before starting the assessment, please ensure you have:

1. **GitHub Access**
   - Repository: https://github.com/claycampbell/blueprint
   - Clone the repo: `git clone https://github.com/claycampbell/blueprint.git`

2. **Claude Code Installed**
   - Download from: https://claude.ai/download
   - Free to use for this assessment
   - No prior experience required!

3. **Development Environment**
   - Node.js 18 or higher ([download](https://nodejs.org/))
   - Docker Desktop ([download](https://www.docker.com/products/docker-desktop/))
   - VS Code or your preferred editor

## Pre-Assessment Preparation (30 minutes)

Please complete these steps **before your scheduled assessment time**:

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/claycampbell/blueprint.git
cd blueprint

# Read the project overview
cat README.md
cat CLAUDE.md
```

### 2. Install Dependencies

```bash
cd starter-kit
npm install
```

### 3. Verify Environment

```bash
# Check Node version (should be 18+)
node --version

# Check Docker is running
docker ps

# Start the development server (optional test)
npm run dev
# Should open http://localhost:3000
```

### 4. Review Documentation

Please read these files in the repository:
- `docs/assessment/INSTRUCTIONS.md` - **Complete assessment instructions** (read thoroughly!)
- `TECHNOLOGY_STACK_DECISION.md` - Tech stack overview
- `CLAUDE.md` - Project guidelines

### 5. Get Familiar with Claude Code

- Install Claude Code from https://claude.ai/download
- Open the `blueprint` repository in VS Code
- Start Claude Code (Command Palette → "Claude Code: Start")
- Ask it a simple question like "What is this project about?"

## Assessment Scheduling

**Proposed Date/Time:** [INSERT SPECIFIC DATE/TIME]

**Duration:** 1-2 hours (you choose when to start within the scheduled window)

Please confirm by replying to this email with:
- ✅ Confirmation you can complete the assessment at the proposed time
- ✅ Confirmation your environment is set up and working
- ❌ Any setup issues you encountered

## What Happens During the Assessment

1. **You start when ready** (within the scheduled window)
2. **Create your feature branch**: `git checkout -b raul/assessment-project-search`
3. **Build the component** using Claude Code as your pair programming partner
4. **Document your experience** in a reflection document
5. **Submit via pull request** when complete (or at 2-hour mark)

**Full instructions are in:** `docs/assessment/INSTRUCTIONS.md`

## What We're Building

You'll create a "Project Search" component for Connect 2.0 that includes:
- React component with TypeScript
- Mock API service
- Search functionality with debouncing
- Loading and error states
- Unit tests using Jest

**Starter files are already provided** to help you get going quickly.

## Questions?

If you encounter any **blocking technical issues** during setup:
- Email me immediately: [your-email@blueprint.com]
- We'll schedule a quick call to troubleshoot

For **assessment questions or clarifications**, reference the detailed instructions in the repository.

## What Happens Next

After you submit:
1. We'll review your code and documentation (1-2 business days)
2. Schedule a 30-minute live code review call
3. You'll walk us through your approach and discuss your experience
4. We'll make a hiring decision within 1 week

## Why Claude Code?

We use Claude Code extensively at Blueprint to:
- Accelerate development on greenfield projects
- Maintain consistent code quality across the team
- Onboard new developers faster
- Collaborate with AI as a thought partner

This assessment mirrors how you'd actually work on the Connect 2.0 platform.

---

**Please confirm your participation by [DATE - 2 days before assessment].**

If you have any questions or concerns, don't hesitate to reach out. We're excited to see how you work!

Best regards,

**Clay Campbell**
Technical Lead, Connect 2.0 Platform
Blueprint / Datapage
[email@blueprint.com]
[phone number]

---

## Attachment Checklist

Before sending this email:
- [ ] Repository access granted (add Raúl as collaborator)
- [ ] Claude Code download link verified
- [ ] Specific assessment date/time inserted
- [ ] Your contact information added
- [ ] Assessment branch `assessment/raul-diaz-starter` exists and is up-to-date
- [ ] All assessment files committed and pushed to the branch
