# CLAUDE.md Synchronization Flow

This diagram explains how CLAUDE.md stays in sync across multiple developers working on different branches.

## The Sync Model

```
┌─────────────────────────────────────────────────────────────────┐
│                         main branch                              │
│                     (Source of Truth)                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  CLAUDE.md (version N)                                    │  │
│  │  - Project-wide AI instructions                          │  │
│  │  - Jira integration docs                                 │  │
│  │  - Development practices                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬─────────────────────────────────┬─────────────────┘
             │                                 │
             │ git pull                        │ git pull
             │                                 │
             ▼                                 ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│  Developer A Branch     │      │  Developer B Branch     │
│  alice/localstack-setup │      │  bob/auth-module        │
│                         │      │                         │
│  CLAUDE.md (version N)  │      │  CLAUDE.md (version N)  │
│  ✅ In Sync             │      │  ✅ In Sync             │
│                         │      │                         │
│  [Onboarding files]     │      │  [Feature files]        │
│  - docker-compose.yml   │      │  - auth.ts              │
│  - init scripts         │      │  - tests/               │
└─────────────────────────┘      └─────────────────────────┘
```

## Scenario 1: Developer Discovers Improvement to CLAUDE.md

```
Developer B working on auth-module discovers a helpful tip for CLAUDE.md...

┌─────────────────────────────────────────────────────────────────┐
│                    Developer B Workflow                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: Create separate docs branch
  git checkout main
  git pull
  git checkout -b docs/add-auth-troubleshooting

Step 2: Update CLAUDE.md
  # Add troubleshooting section for authentication
  git add CLAUDE.md
  git commit -m "docs: Add auth troubleshooting to CLAUDE.md"

Step 3: Create PR immediately
  gh pr create --title "docs: Add auth troubleshooting to CLAUDE.md"
  # PR reviewed and merged quickly (no waiting for feature completion)

Step 4: Get back to feature work
  git checkout bob/auth-module
  git merge main  # Pull in updated CLAUDE.md

Result: CLAUDE.md improved, all developers benefit immediately
```

## Scenario 2: CLAUDE.md Updated While Developer Is Working

```
Developer A is working on onboarding...
Meanwhile, Developer B's CLAUDE.md improvement gets merged...

┌─────────────────────────────────────────────────────────────────┐
│                         main branch                              │
│                                                                  │
│  CLAUDE.md (version N+1)  ← Updated by Developer B              │
└─────────────────────────────────────────────────────────────────┘
             │
             │ Developer A syncs periodically
             │
             ▼
┌─────────────────────────┐
│  Developer A Branch     │
│  alice/localstack-setup │
│                         │
│  Before sync:           │
│  CLAUDE.md (version N)  │
│  ⚠️  Out of sync        │
└─────────────────────────┘

Developer A syncs:
  git fetch origin main
  git merge origin/main

┌─────────────────────────┐
│  Developer A Branch     │
│  alice/localstack-setup │
│                         │
│  After sync:            │
│  CLAUDE.md (version N+1)│
│  ✅ In Sync             │
└─────────────────────────┘

Result: Developer A has latest CLAUDE.md, no conflicts
```

## Scenario 3: GitHub Action Catches Out-of-Sync CLAUDE.md

```
Developer accidentally modifies CLAUDE.md in their feature branch...
Creates PR to merge to main...

┌─────────────────────────────────────────────────────────────────┐
│              GitHub Pull Request Created                         │
│                                                                  │
│  alice/localstack-setup → main                                  │
└─────────────────────────────────────────────────────────────────┘
             │
             │ Triggers GitHub Action
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│         .github/workflows/claude-md-sync-check.yml              │
│                                                                  │
│  1. Compare CLAUDE.md in PR vs main                             │
│  2. Detect differences                                          │
│  3. Post comment on PR                                          │
└─────────────────────────────────────────────────────────────────┘
             │
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PR Comment Posted                            │
│                                                                  │
│  ⚠️ CLAUDE.md Sync Warning                                      │
│                                                                  │
│  Your branch has modifications to CLAUDE.md that differ from    │
│  main.                                                           │
│                                                                  │
│  If intentional: Create separate PR for CLAUDE.md changes       │
│  If accidental: Run:                                             │
│    git checkout origin/main -- CLAUDE.md                        │
└─────────────────────────────────────────────────────────────────┘

Developer fixes:
  git checkout origin/main -- CLAUDE.md
  git commit -m "sync: Restore CLAUDE.md from main"
  git push

Result: PR now has correct CLAUDE.md version, Action passes ✅
```

## Why This Matters

### Without Sync:
```
Developer A's CLAUDE.md ≠ Developer B's CLAUDE.md ≠ main
  ↓
Different AI assistant behaviors
  ↓
Inconsistent development practices
  ↓
Confusion and merge conflicts
```

### With Sync:
```
All developers have same CLAUDE.md from main
  ↓
Consistent AI assistant behavior
  ↓
Same best practices across team
  ↓
Zero merge conflicts on CLAUDE.md
```

## Quick Reference

| Situation | Action |
|-----------|--------|
| **Starting new feature** | `git checkout main && git pull` (gets latest CLAUDE.md) |
| **CLAUDE.md updated on main** | `git merge origin/main` (pull into your branch) |
| **Found improvement for CLAUDE.md** | Create separate `docs/*` branch and PR immediately |
| **Accidentally modified CLAUDE.md** | `git checkout origin/main -- CLAUDE.md` (restore from main) |
| **PR fails CLAUDE.md sync check** | See GitHub Action comment for fix instructions |

## Files That Work Like CLAUDE.md (Never Reset)

- ✅ CLAUDE.md
- ✅ PRODUCT_REQUIREMENTS_DOCUMENT.md
- ✅ All files in `docs/planning/`
- ✅ README.md
- ✅ .github/workflows/*

## Files That Get Reset Between Developers

- 🔄 docker-compose.yml (created in onboarding)
- 🔄 scripts/localstack-init.sh (created in onboarding)
- 🔄 scripts/init-db.sql (created in onboarding)
- 🔄 examples/* (created in onboarding)

---

**Key Principle:** CLAUDE.md is a **shared project resource**, not a developer-specific file. It evolves through collaborative improvements, stays in sync via Git, and is protected by automation.
