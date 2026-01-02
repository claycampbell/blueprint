## What

<!-- One-sentence summary of the change -->

## Why

<!-- Business context or problem being solved -->

## How

<!-- Brief technical approach—skip if obvious from diff -->

## Type of Change

- [ ] Feature (new functionality)
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] Refactor (code change that neither fixes a bug nor adds a feature)
- [ ] Documentation (updates to docs only)
- [ ] Infrastructure (Terraform, Docker, CI/CD changes)
- [ ] Tests (adding or updating tests)

## Related Issues

<!-- Link to Jira tickets -->
Closes: DP01-XXX
Related: DP01-YYY

---

## Testing

<!-- How you verified this works -->

- [ ] Tests pass locally (`npm run test -- --run`)
- [ ] New code has test coverage
- [ ] Unit tests added/updated for new functionality
- [ ] Integration tests added/updated if significant feature
- [ ] Tested manually in local environment

---

## Rollback

<!-- How to disable/revert if needed—feature flag, config, etc. -->

- [ ] Standard rollback (revert commit, redeploy previous version)
- [ ] Feature flag to disable: `___`
- [ ] Other: ___

---

## Checklist

### Code Quality

- [ ] Pre-commit hooks pass (`npm run lint && npx tsc --noEmit`)
- [ ] No hardcoded secrets, URLs, or environment-specific values
- [ ] Error handling is appropriate

### Documentation

- [ ] Documentation updated (if applicable)
- [ ] Component props documented with TypeScript

### Observability

- [ ] Logs added for key operations (error boundaries, API errors)
- [ ] Analytics events added (if applicable)

### Feature Flags

- [ ] Feature flag in place (if incomplete/risky)
- [ ] N/A - complete feature shipping to all users

---

## Domain-Specific Sections

### State Management (if applicable)

- [ ] Server state uses TanStack Query in `api/`
- [ ] Shared client state uses Zustand in `stores/`
- [ ] Feature-private state stays in `features/*/store.ts`
- [ ] No cross-feature imports (features share data through `api/` or `stores/`)

### Infrastructure Changes (if applicable)

- [ ] Terraform `plan` output reviewed
- [ ] **This is a separate PR from code changes**
- [ ] Cost impact considered
- [ ] Security implications reviewed

---

## Deployment Notes

<!-- Any special deployment steps, environment variables, or configuration needed -->

**Requires:**
- [ ] No special deployment steps
- [ ] New environment variables: `___`
- [ ] Infrastructure changes deployed first
- [ ] Other: ___

---

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

---

## Reviewer Notes

<!-- Anything specific reviewers should look at or test -->
