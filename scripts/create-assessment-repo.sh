#!/bin/bash
# Script to create a clean assessment repository with only minimal files
# Run this from the blueprint repo root on the assessment/raul-diaz-clean branch

set -e

ASSESSMENT_REPO_PATH="${1:-../blueprint-assessment-starter}"

echo "Creating clean assessment repository at: $ASSESSMENT_REPO_PATH"
echo ""

# Ensure we're on the assessment branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "assessment/raul-diaz-clean" ]; then
    echo "ERROR: Must be on assessment/raul-diaz-clean branch"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Create new directory
mkdir -p "$ASSESSMENT_REPO_PATH"
cd "$ASSESSMENT_REPO_PATH"

# Initialize new git repo (orphan - no history)
git init
echo "Initialized empty git repository"

# Create directory structure
mkdir -p docs/assessment
mkdir -p starter-kit/src/{types,components/connect,services,app}
mkdir -p starter-kit/public

echo "Created directory structure"

# Copy assessment documentation
echo "Copying assessment documentation..."
cp "$OLDPWD/docs/assessment/README.md" docs/assessment/
cp "$OLDPWD/docs/assessment/INSTRUCTIONS.md" docs/assessment/
cp "$OLDPWD/docs/assessment/EVALUATION_RUBRIC.md" docs/assessment/
cp "$OLDPWD/docs/assessment/INTERVIEWER_QUICK_START.md" docs/assessment/
cp "$OLDPWD/docs/assessment/ASSESSMENT_SETUP_EMAIL.md" docs/assessment/
cp "$OLDPWD/docs/assessment/ASSESSMENT_COMPLETE.md" docs/assessment/
cp "$OLDPWD/docs/assessment/.gitignore-template" docs/assessment/
cp "$OLDPWD/docs/assessment/NEW_REPO_SETUP.md" docs/assessment/

# Create simplified package.json (without postinstall script and icon dependencies)
echo "Creating simplified package.json..."
cat > starter-kit/package.json << 'PKGJSON'
{
  "name": "blueprint-assessment-starter",
  "version": "1.0.0",
  "license": "Proprietary",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx}\"",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "@emotion/cache": "11.14.0",
    "@emotion/react": "11.14.0",
    "@emotion/styled": "11.14.0",
    "@mui/material": "6.2.1",
    "@mui/material-nextjs": "6.2.1",
    "next": "^15.5.6",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.10.5",
    "@types/react": "^19.0.6",
    "@types/react-dom": "^19.0.3",
    "autoprefixer": "10.4.20",
    "eslint": "8.57.1",
    "eslint-config-next": "15.1.2",
    "eslint-config-prettier": "9.1.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "postcss": "8.4.49",
    "prettier": "3.4.2",
    "tailwindcss": "3.4.17",
    "typescript": "^5.7.3"
  },
  "description": "Assessment starter kit for Connect 2.0 platform candidates",
  "keywords": ["assessment", "react", "typescript", "nextjs"]
}
PKGJSON

# Copy TECHNOLOGY_STACK_DECISION.md (referenced in instructions)
echo "Copying technology stack documentation..."
cp "$OLDPWD/TECHNOLOGY_STACK_DECISION.md" docs/

# Create simplified Next.js config (no redirects to non-existent routes)
echo "Creating simplified next.config.mjs..."
cat > starter-kit/next.config.mjs << 'NEXTCONFIG'
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Clean configuration for assessment starter
  reactStrictMode: true,
}

export default nextConfig
NEXTCONFIG

# Create simplified Tailwind config (no missing dependencies)
echo "Creating simplified tailwind.config.js..."
cat > starter-kit/tailwind.config.js << 'TAILWINDCONFIG'
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
TAILWINDCONFIG

cp "$OLDPWD/starter-kit/tsconfig.json" starter-kit/
cp "$OLDPWD/starter-kit/postcss.config.mjs" starter-kit/
cp "$OLDPWD/starter-kit/.eslintrc.js" starter-kit/
cp "$OLDPWD/starter-kit/.prettierrc.json" starter-kit/
cp "$OLDPWD/starter-kit/jsconfig.json" starter-kit/
cp "$OLDPWD/starter-kit/.npmrc" starter-kit/ 2>/dev/null || true
cp "$OLDPWD/starter-kit/.editorconfig" starter-kit/ 2>/dev/null || true
cp "$OLDPWD/starter-kit/.env.example" starter-kit/

# Copy starter-kit source files
echo "Copying starter-kit source files..."
cp "$OLDPWD/starter-kit/src/types/project.ts" starter-kit/src/types/

# Create placeholder files
touch starter-kit/src/components/connect/.gitkeep
touch starter-kit/src/services/.gitkeep

# Copy minimal app files (we'll need to create these)
echo "Creating minimal Next.js app files..."

# Create app/layout.tsx
cat > starter-kit/src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Connect 2.0 Assessment',
  description: 'Coding assessment for Connect 2.0 platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
EOF

# Create app/page.tsx
cat > starter-kit/src/app/page.tsx << 'EOF'
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Connect 2.0 Assessment</h1>
        <p className="text-gray-600 mb-4">
          Welcome to the Connect 2.0 platform assessment starter kit.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="font-semibold mb-2">Getting Started:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Read the instructions in <code>docs/assessment/INSTRUCTIONS.md</code></li>
            <li>Create your assessment branch</li>
            <li>Build the ProjectSearch component</li>
            <li>Submit a pull request when complete</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
EOF

# Create app/globals.css
cat > starter-kit/src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
}
EOF

# Copy public files (favicon, etc.)
if [ -f "$OLDPWD/starter-kit/public/favicon.ico" ]; then
    cp "$OLDPWD/starter-kit/public/favicon.ico" starter-kit/public/
fi

# Copy root .gitignore
echo "Copying .gitignore..."
cp docs/assessment/.gitignore-template .gitignore

# Create simplified README.md
echo "Creating simplified README.md..."
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

## Assessment Time Limit

1-2 hours maximum

## Repository Structure

```
blueprint-assessment-starter/
├── docs/
│   └── assessment/          # Assessment instructions and rubrics
├── starter-kit/             # Next.js application
│   ├── src/
│   │   ├── types/          # TypeScript type definitions (starter provided)
│   │   ├── components/     # React components (candidate creates)
│   │   ├── services/       # API services (candidate creates)
│   │   └── app/            # Next.js app directory
│   └── package.json
└── README.md               # This file
```

## Support

For technical issues during assessment, contact the interviewer immediately.

## License

Proprietary - Assessment use only
EOF

# Create simplified CLAUDE.md
echo "Creating simplified CLAUDE.md..."
cat > CLAUDE.md << 'EOF'
# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Repository Purpose

This is an **assessment repository** for evaluating developer candidates for the Connect 2.0 platform. It contains:
- Assessment instructions and evaluation criteria
- Minimal Next.js starter kit
- TypeScript type definitions
- NO proprietary business logic

**Context:** Connect 2.0 is a construction management platform for residential development projects, handling lead intake, feasibility analysis, entitlement tracking, and loan servicing.

## Assessment Guidelines

### For Candidates Using Claude Code

**DO:**
- Use Claude Code as your primary development partner
- Ask Claude Code to generate code, explain concepts, and debug
- Iterate on Claude's suggestions ("make this more type-safe", "add error handling")
- Reference project files in your prompts
- Break problems into smaller pieces
- Request code reviews from Claude Code

**DON'T:**
- Copy code from external sources (Stack Overflow, ChatGPT, etc.)
- Ask other humans for help during assessment
- Spend more than 2 hours total

## Git Workflow

**Branch naming:** `<firstname>/assessment-project-search`

**Commit format:**
```
<type>: <subject>

<body>

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:** feat, fix, docs, test, refactor, chore

**Commit frequently** - Show your thought process through git history

## Code Quality Standards

### TypeScript
- Use strict typing (no `any`)
- Define proper interfaces for all data structures
- Type all function parameters and return values

### React Components
- Functional components with hooks
- Proper prop typing with TypeScript interfaces
- Clean separation of concerns (UI vs. logic)

### Testing
- Jest + React Testing Library
- Test meaningful behavior, not implementation details
- Minimum 2-3 tests that validate core functionality

### Code Style
- ESLint and Prettier configured (auto-format on save)
- Consistent naming conventions (camelCase for functions/variables)
- Clear, descriptive variable names

## Technology Stack

**Frontend:**
- React 18 (functional components + hooks)
- TypeScript (strict mode)
- Next.js 15 (App Router)

**UI:**
- Tailwind CSS (utility-first styling)
- Material-UI v6 (component library)

**State Management:**
- Zustand (recommended) or React hooks

**Testing:**
- Jest
- React Testing Library

## Assessment Scope

**Time limit:** 1-2 hours maximum

**Deliverables:**
1. TypeScript types (`src/types/project.ts`)
2. Mock API service (`src/services/projectApi.ts`)
3. ProjectSearch component (`src/components/connect/ProjectSearch.tsx`)
4. Unit tests (`src/components/connect/ProjectSearch.test.tsx`)
5. Reflection document (`docs/assessment/<NAME>_SUMMARY.md`)

## Working with Claude Code

### Example Prompts

**Good prompts:**
- "Create a TypeScript interface for a construction project with fields: name, status, address, createdDate"
- "Build a React component with a search input that debounces by 300ms using TypeScript"
- "Review my ProjectSearch component for type safety issues and potential bugs"
- "Generate Jest tests for a component that fetches and displays project data"

**Less effective prompts:**
- "Build the whole thing" (too broad)
- "Fix this" (not specific enough)
- Copying error messages without context

### Iterating with Claude

1. Start with core functionality (types, basic component)
2. Ask Claude to review and improve
3. Add features incrementally (debouncing, loading states, errors)
4. Request test generation
5. Final review pass

## File Organization

```
starter-kit/
├── src/
│   ├── types/
│   │   └── project.ts              # Data type definitions
│   ├── services/
│   │   └── projectApi.ts           # API/data fetching
│   ├── components/
│   │   └── connect/
│   │       ├── ProjectSearch.tsx       # Main component
│   │       └── ProjectSearch.test.tsx  # Tests
│   └── app/
│       ├── layout.tsx              # Root layout
│       └── page.tsx                # Home page
```

## Success Criteria

**We're evaluating:**
1. **Claude Code collaboration** (40%) - Prompt quality, iteration, learning
2. **Code quality** (30%) - TypeScript, React patterns, testing
3. **Communication** (20%) - Documentation, commits, self-awareness
4. **Problem-solving** (10%) - Pragmatism, scope management

**We expect:**
- ✅ Working component that compiles and runs
- ✅ Tests that pass
- ✅ Clean TypeScript (no `any` types)
- ✅ Thoughtful reflection document

**We DON'T expect:**
- ❌ Production-ready, pixel-perfect UI
- ❌ Comprehensive test coverage (80%+)
- ❌ Advanced optimizations

## Resources

- **Assessment Instructions:** [docs/assessment/INSTRUCTIONS.md](docs/assessment/INSTRUCTIONS.md)
- **Claude Code Docs:** https://code.claude.com/docs/
- **React Docs:** https://react.dev/
- **TypeScript Docs:** https://www.typescriptlang.org/docs/

## Questions?

For technical blockers (npm install fails, etc.), contact the interviewer immediately.

For feature clarifications, use your best judgment and document assumptions.

---

**Last Updated:** January 2, 2026
**Assessment Version:** 1.0
EOF

# Create LICENSE file
cat > LICENSE << 'EOF'
PROPRIETARY LICENSE

Copyright (c) 2026 Blueprint/Datapage

This software and associated documentation files (the "Software") are proprietary
and confidential. The Software is provided solely for candidate assessment purposes.

Restrictions:
- No redistribution
- No commercial use
- No modification for purposes other than completing the assessment
- Assessment submissions become property of Blueprint/Datapage

For questions, contact: jobs@blueprint.com
EOF

# Initial commit
git add .
git commit -m "Initial commit: Assessment starter kit

- Assessment documentation and instructions
- Minimal Next.js + React + TypeScript starter
- Type definitions for construction projects
- Evaluation rubric and interviewer guide
- Simplified CLAUDE.md for candidate guidance

This is a clean repository with NO proprietary business logic.
For assessment use only."

echo ""
echo "✅ Assessment repository created successfully!"
echo ""
echo "Repository location: $ASSESSMENT_REPO_PATH"
echo ""
echo "Next steps:"
echo "1. Review the created files"
echo "2. Test the setup: cd $ASSESSMENT_REPO_PATH/starter-kit && npm install && npm run dev"
echo "3. Push to GitHub:"
echo "   cd $ASSESSMENT_REPO_PATH"
echo "   git remote add origin git@github.com:YOUR_ORG/blueprint-assessment-starter.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "File count: $(git ls-files | wc -l)"
