# Creating Assessment-Only Repository

## Purpose
Create a minimal repository for candidate assessments that contains only what's needed for the coding exercise, without exposing proprietary Blueprint/Datapage business logic or strategic documents.

## Repository Name
**Suggested:** `blueprint-assessment-starter`

**Description:** "Hands-on coding assessment for Connect 2.0 platform candidates using Claude Code"

## Files to Copy from `assessment/raul-diaz-clean` Branch

### 1. Assessment Documentation
```
docs/
  assessment/
    README.md
    INSTRUCTIONS.md
    EVALUATION_RUBRIC.md
    INTERVIEWER_QUICK_START.md
    ASSESSMENT_SETUP_EMAIL.md
    ASSESSMENT_COMPLETE.md
```

### 2. Starter Kit (Minimal Next.js App)
```
starter-kit/
  .eslintrc.js
  .gitignore
  .npmrc
  .prettierrc.json
  jsconfig.json
  next.config.mjs
  package.json
  package-lock.json
  postcss.config.mjs
  tailwind.config.js
  tsconfig.json

  src/
    types/
      project.ts              # Starter file with basic types
    components/
      connect/
        .gitkeep              # Placeholder for their component
    services/
      .gitkeep                # Placeholder for their API service
    app/
      layout.tsx              # Minimal layout
      page.tsx                # Simple landing page
      globals.css             # Basic styles

  public/
    favicon.ico
    # (any other static assets)
```

### 3. Root Documentation (Simplified Versions)
```
README.md                           # Assessment-focused README
CLAUDE.md                           # Stripped down to assessment guidelines only
TECHNOLOGY_STACK_DECISION.md        # Reference (no business logic)
.gitignore
LICENSE                             # Consider MIT or similar
```

## Files to CREATE for New Repo

### Root README.md
Create a new simplified README that:
- Explains this is an assessment repository
- Links to INSTRUCTIONS.md for candidates
- Provides quick setup guide
- Does NOT mention Blueprint business specifics

### Simplified CLAUDE.md
Create a stripped-down version that:
- Explains project context (generic construction management platform)
- Git workflow guidelines
- Code quality standards
- NO proprietary information about Blueprint operations
- NO Jira/Everhour integration details
- NO AWS/deployment information

### .gitignore
A comprehensive `.gitignore` template is provided at [.gitignore-template](./.gitignore-template).

Copy it to the root of the new repository:
```bash
cp docs/assessment/.gitignore-template /path/to/blueprint-assessment-starter/.gitignore
```

**Key sections:**
- Node.js/NPM files (`node_modules/`, logs)
- Next.js build artifacts (`.next/`, `out/`, `build/`)
- Environment variables (`.env*` - CRITICAL for security)
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- **Assessment-specific:** Candidate summary files except templates
- **Security:** Credentials, API keys, certificates

## Repository Setup Steps

### Step 1: Create New Repository
```bash
# On GitHub: Create new repository "blueprint-assessment-starter"
# Make it PRIVATE initially
# Do NOT initialize with README (we'll add our own)

# Clone the new empty repo
git clone git@github.com:YOUR_ORG/blueprint-assessment-starter.git
cd blueprint-assessment-starter
```

### Step 2: Copy Files from Blueprint Repo
```bash
# In your blueprint repo, checkout the assessment branch
cd /path/to/blueprint
git checkout assessment/raul-diaz-clean

# Copy assessment documentation
cp -r docs/assessment /path/to/blueprint-assessment-starter/docs/

# Copy starter-kit (selective files)
mkdir -p /path/to/blueprint-assessment-starter/starter-kit
cp starter-kit/package.json /path/to/blueprint-assessment-starter/starter-kit/
cp starter-kit/package-lock.json /path/to/blueprint-assessment-starter/starter-kit/
cp starter-kit/tsconfig.json /path/to/blueprint-assessment-starter/starter-kit/
cp starter-kit/next.config.mjs /path/to/blueprint-assessment-starter/starter-kit/
# ... (continue for each config file)

# Copy src structure
cp -r starter-kit/src/types /path/to/blueprint-assessment-starter/starter-kit/src/
mkdir -p /path/to/blueprint-assessment-starter/starter-kit/src/components/connect
touch /path/to/blueprint-assessment-starter/starter-kit/src/components/connect/.gitkeep
mkdir -p /path/to/blueprint-assessment-starter/starter-kit/src/services
touch /path/to/blueprint-assessment-starter/starter-kit/src/services/.gitkeep
```

### Step 3: Create New Documentation Files
```bash
cd /path/to/blueprint-assessment-starter

# Create simplified README.md
cat > README.md << 'EOF'
# Blueprint Assessment Starter

Hands-on coding assessment for Connect 2.0 platform developer candidates.

## For Candidates

👉 **Start here:** [docs/assessment/INSTRUCTIONS.md](docs/assessment/INSTRUCTIONS.md)

## Quick Setup

```bash
# Install dependencies
cd starter-kit
npm install

# Start development server
npm run dev
```

Open http://localhost:3000

## For Interviewers

See [docs/assessment/INTERVIEWER_QUICK_START.md](docs/assessment/INTERVIEWER_QUICK_START.md)

## Repository Purpose

This is an isolated assessment environment for evaluating how candidates collaborate with Claude Code (AI pair programming tool). It contains:

- Minimal Next.js + React + TypeScript starter kit
- Assessment instructions and evaluation rubrics
- Reference documentation
- NO proprietary business logic

## Technology Stack

- **Frontend:** React 18 + TypeScript
- **Framework:** Next.js 15
- **UI:** Material-UI v6 + Tailwind CSS
- **State Management:** Zustand (recommended)
- **Testing:** Jest + React Testing Library

## License

Proprietary - Assessment use only
EOF

# Create simplified CLAUDE.md (see next section)
```

### Step 4: Create Simplified CLAUDE.md
Create a new CLAUDE.md with ONLY:
- Repository purpose (assessment for construction management platform)
- Git workflow (branch naming, commit format)
- Code quality guidelines (TypeScript, testing, formatting)
- Assessment-specific rules (no external copying, use Claude Code)
- NO Jira integration
- NO AWS deployment
- NO business-specific terminology
- NO proprietary information

**Example structure:**
```markdown
# CLAUDE.md

Assessment repository for Connect 2.0 platform candidates.

## Repository Purpose
This is an assessment environment for evaluating developer candidates building a construction management platform...

## Git Workflow
[Standard branch naming and commit conventions]

## Code Quality Standards
[TypeScript, testing, formatting rules]

## Assessment Guidelines
- Use Claude Code as your primary development tool
- No external code copying
- Commit frequently with descriptive messages
- Focus on clean TypeScript and component design
```

### Step 5: Initialize Repository
```bash
cd /path/to/blueprint-assessment-starter

# Initialize git
git init
git add .
git commit -m "Initial commit: Assessment starter kit"

# Push to GitHub
git remote add origin git@github.com:YOUR_ORG/blueprint-assessment-starter.git
git branch -M main
git push -u origin main
```

### Step 6: Configure Repository Settings

**On GitHub:**
1. **Settings → General:**
   - Make repository **PRIVATE**
   - Disable: Wikis, Issues, Projects, Discussions
   - Enable: Pull requests (for candidate submissions)

2. **Settings → Branches:**
   - Protect `main` branch
   - Require pull request reviews
   - Require status checks (if you add CI)

3. **Settings → Collaborators:**
   - Do NOT add candidates as collaborators yet
   - Add interviewers/reviewers only

## For Each Candidate Assessment

### Before Assessment (24 hours prior)
1. **Invite candidate as collaborator** (Repository → Settings → Collaborators)
2. Send assessment setup email using template: `docs/assessment/ASSESSMENT_SETUP_EMAIL.md`
3. Ensure candidate can clone and set up the repo

### During Assessment
1. Candidate creates branch: `<firstname>/assessment-project-search`
2. Candidate works independently for 1-2 hours
3. Candidate submits PR when complete

### After Assessment
1. Review using `docs/assessment/EVALUATION_RUBRIC.md`
2. Remove candidate as collaborator (if not hired)
3. Archive or delete their branch

## Security Considerations

✅ **Safe to Share:**
- Next.js configuration
- TypeScript setup
- Generic project structure
- Assessment instructions
- Technology stack decisions

❌ **Never Include:**
- `.env` files with real credentials
- Proprietary business logic
- Database schemas
- API integration code
- Cost/budget documents
- Strategic planning documents
- Client data or examples
- AWS/deployment configurations
- Jira/Everhour integration

## Maintenance

**When updating assessments:**
1. Make changes in `assessment/raul-diaz-clean` branch first
2. Test with internal developer
3. Copy approved changes to assessment repo
4. Update version in docs/assessment/README.md

**Periodic reviews:**
- Every 3-6 months: Review assessment difficulty
- After each candidate: Collect feedback from interviewers
- Update rubric based on hiring outcomes

## Questions?

Contact: Clay Campbell (clay@blueprint.com)
