# 5. Git Standards

> **Principle reminder:** Trunk-Based, Always Shippable. Main is always deployable. Small PRs, frequent merges, feature flags for incomplete work.

---

## 5.1 Branching Model: Trunk-Based Development

We use trunk-based development. All work flows through `main`.

**The Rules:**
- `main` is always deployable. No exceptions.
- Feature branches live **< 24 hours** whenever possible, never more than 2-3 days.
- Long-lived branches are bugs. If you need one, you're missing a feature flag.
- Delete branches immediately after merge.

**Branch Naming:**
```
<type>/<ticket>-<short-description>
```

| Type | Use Case |
|------|----------|
| `feat/` | New functionality |
| `fix/` | Bug fixes |
| `hotfix/` | Production-critical fixes (bypasses normal flow) |
| `refactor/` | Code improvement without behavior change |
| `docs/` | Documentation only |
| `chore/` | Tooling, dependencies, config |

Examples:
- `feat/PROJ-123-user-auth`
- `fix/PROJ-456-null-check`
- `hotfix/PROJ-789-security-patch`

---

## 5.2 Commit Standards

We use **Conventional Commits**. This enables automated changelogs, semantic versioning, and AI-assisted tooling.

**Format:**
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
| Type | When to Use |
|------|-------------|
| `feat` | New feature for users |
| `fix` | Bug fix for users |
| `docs` | Documentation changes |
| `refactor` | Code change that neither fixes nor adds |
| `test` | Adding or fixing tests |
| `chore` | Build, CI, dependencies, tooling |
| `perf` | Performance improvement |
| `revert` | Reverting a previous commit |

**Scope:** Optional but encouraged. Use the module, service, or component name.

**Examples:**
```
feat(auth): add OAuth2 PKCE flow
fix(api): handle null response from payment provider
docs(readme): add local development setup
chore(deps): bump axios to 1.6.0
refactor(checkout): extract validation logic
```

**Breaking Changes:**
```
feat(api)!: change response format for /users endpoint

BREAKING CHANGE: Response now returns `data` wrapper object.
Migration: Access users via response.data.users instead of response.users.
```

**Commit Message Quality:**
- Subject line ≤ 72 characters
- Use imperative mood ("add" not "added" or "adds")
- No period at end of subject
- Body explains *why*, not *what* (the diff shows *what*)
- Reference tickets: `Closes PROJ-123` or `Refs PROJ-456`

**AI-Assisted Commits:** Use AI tools to generate commit messages from diffs, but always review. The commit message is documentation—own it.

---

## 5.3 Pull Request Standards

PRs are the unit of shipping. They should be small, focused, and easy to review.

**Size Guidelines:**
| Lines Changed | Rating | Action |
|---------------|--------|--------|
| < 200 | ✅ Ideal | Ship it |
| 200-400 | ⚠️ Acceptable | Consider splitting |
| 400+ | ❌ Too large | Must split |

**PR Title:** Follow commit convention format. The squashed commit will use this.
```
feat(checkout): add Apple Pay support
```

**PR Description Template:**
```markdown
## What
[One-sentence summary of the change]

## Why
[Business context or problem being solved]

## How
[Brief technical approach—skip if obvious from diff]

## Testing
[How you verified this works]

## Rollback
[How to disable/revert if needed—feature flag, config, etc.]

## Checklist
- [ ] Tests pass locally
- [ ] New code has test coverage
- [ ] Documentation updated (if applicable)
- [ ] Feature flag in place (if incomplete/risky)
- [ ] Observability: logs/metrics/traces added
```

**Review Requirements:**
- 1 approval minimum for standard changes
- 2 approvals for: security-sensitive, infrastructure, or breaking changes
- Author cannot self-approve
- Stale approvals invalidated on new commits

**Review SLA:**
- First review within 4 business hours
- Don't let PRs age. If it's been 24 hours, ping. If it's been 48 hours, escalate.

---

## 5.4 Merge Strategy

**Default: Squash and Merge**

All feature branches squash into a single commit on `main`. This keeps history clean and bisectable.

- PR title becomes commit message
- PR description becomes commit body
- Individual commits in the branch are preserved in PR history

**Exceptions:**
- **Merge commits** for release branches merging back to main (preserves release history)
- **Rebase** only for local cleanup before pushing—never rebase shared branches

**Post-Merge:**
- Branch auto-deletes (enforce via repo settings)
- CI triggers deploy to staging automatically
- Monitor observability dashboards for anomalies

---

## 5.5 Feature Flags

Incomplete work ships behind flags. This is how we stay trunk-based while building large features.

**When to Use:**
- Feature takes > 1 day to complete
- Feature needs gradual rollout
- Feature has risk that may require quick disable
- A/B testing or experimentation

**Naming Convention:**
```
ff_<team>_<feature>_<ticket>
```
Example: `ff_payments_apple_pay_PROJ_123`

**Flag Lifecycle:**
1. Create flag (default: off)
2. Merge code behind flag
3. Enable in staging → production (% rollout)
4. Monitor for 1-2 weeks
5. Remove flag and dead code paths

**Technical Debt:** Flags older than 30 days without activity get flagged (pun intended) for cleanup.

---

## 5.6 Protected Branch Rules

**`main` branch protections (non-negotiable):**
- ✅ Require PR before merging
- ✅ Require 1+ approvals
- ✅ Dismiss stale approvals on new commits
- ✅ Require status checks to pass (CI, tests, lint)
- ✅ Require branches to be up to date
- ✅ Require signed commits (if org policy)
- ❌ No direct pushes (not even admins, except break-glass)
- ❌ No force pushes

---

## 5.7 CI/CD Integration

Every push triggers CI. Every merge to `main` triggers deploy.

**Required Checks (must pass before merge):**
- Unit tests
- Integration tests
- Linting / formatting
- Type checking
- Security scanning (SAST)
- Dependency vulnerability scan

**Automated on Merge to Main:**
- Build artifacts
- Deploy to staging
- Run smoke tests
- (Optional) Auto-promote to production if smoke passes

**Deployment Observability:**
- Every deploy tagged with git SHA
- Deployment events sent to observability platform
- Automatic rollback if error rate spikes post-deploy

---

## 5.8 Git Hygiene

**Do:**
- Pull/rebase before starting new work
- Commit early, commit often (locally)
- Write meaningful commit messages
- Keep `.gitignore` current
- Use `git stash` for WIP, not WIP commits

**Don't:**
- Commit secrets, credentials, or keys (ever)
- Commit large binaries (use LFS or external storage)
- Commit generated files (build outputs, node_modules)
- Force push to shared branches
- Rewrite history on `main`

**Secret Prevention:**
- Pre-commit hooks with `git-secrets` or `gitleaks`
- CI scanning for exposed credentials
- Rotate immediately if secrets are committed (even if removed)

---

## 5.9 AI-Assisted Git Workflows

AI is infrastructure. Use it for Git operations.

**Recommended AI-Assisted Tasks:**
| Task | Tool/Approach |
|------|---------------|
| Commit messages | Generate from diff, review before committing |
| PR descriptions | Generate from commit history, add context |
| Code review | AI first-pass, human final review |
| Conflict resolution | AI-assisted merge conflict resolution |
| Release notes | Auto-generate from conventional commits |

**Guardrails:**
- AI generates, human approves
- Don't blindly accept AI commit messages—they're a starting point
- Review AI-generated PR descriptions for accuracy
- AI code review supplements, never replaces, human review

---

## 5.10 Incident Response (Hotfix Flow)

When production is on fire, speed matters. Here's the hotfix flow:

1. **Branch** directly from `main`: `hotfix/PROJ-XXX-description`
2. **Fix** with minimal change (fix the issue, nothing else)
3. **Test** locally and in staging (abbreviated but not skipped)
4. **PR** with expedited review (1 approval, senior engineer)
5. **Merge** and deploy immediately
6. **Follow up** with proper fix if hotfix was a band-aid

**Hotfix PRs are labeled `hotfix` and skip non-critical CI checks if needed.**

---

## 5.11 Metrics We Track

You can't improve what you don't measure.

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| PR size (lines) | < 200 | Smaller = faster review, fewer bugs |
| PR cycle time | < 24 hours | Measures flow efficiency |
| Time to first review | < 4 hours | Review bottleneck indicator |
| Merge frequency | Daily | Trunk-based health check |
| Deployment frequency | Daily+ | Shipping heartbeat |
| Change fail rate | < 5% | Quality of changes |
| MTTR | < 1 hour | Recovery capability |

---

## 5.12 Quick Reference

```bash
# Start new feature
git checkout main && git pull
git checkout -b feat/PROJ-123-description

# Commit with conventional format
git commit -m "feat(scope): add feature description"

# Keep branch updated
git fetch origin && git rebase origin/main

# Push and create PR
git push -u origin HEAD

# After merge (if not auto-deleted)
git checkout main && git pull
git branch -d feat/PROJ-123-description
```

---

## 5.13 Exceptions and Escalation

These standards apply to all repos. Exceptions require:
- Written justification
- Tech lead approval
- Time-boxed duration
- Documented in repo README

No permanent exceptions. If something doesn't work, we change the standard, not ignore it.