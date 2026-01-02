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

- [ ] Tests pass locally (`uv run pytest`)
- [ ] New code has test coverage
- [ ] Unit tests added/updated for new functionality
- [ ] Integration tests added/updated if API endpoints changed
- [ ] Tested manually in local environment

---

## Rollback

<!-- How to disable/revert if needed—feature flag, config, etc. -->

- [ ] Standard rollback (revert commit, redeploy previous version)
- [ ] Database rollback needed: `alembic downgrade -1`
- [ ] Feature flag to disable: `___`
- [ ] Other: ___

---

## Checklist

### Code Quality

- [ ] Pre-commit hooks pass (`uv run ruff check . && uv run ruff format --check . && uv run mypy app`)
- [ ] No hardcoded secrets, URLs, or environment-specific values
- [ ] Error handling is appropriate

### Documentation

- [ ] Documentation updated (if applicable)
- [ ] API documentation verified in `/docs` (Swagger)

### Observability

- [ ] Logs added for key operations
- [ ] Metrics/traces added (if applicable)

### Feature Flags

- [ ] Feature flag in place (if incomplete/risky)
- [ ] N/A - complete feature shipping to all users

---

## Domain-Specific Sections

### Database Changes (if applicable)

- [ ] Migration file created
- [ ] Migration is reversible (has `downgrade()`)
- [ ] Migration tested locally (upgrade and downgrade)
- [ ] No data loss risk
- [ ] Backward-compatible with previous code version

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
- [ ] Database migration
- [ ] New environment variables: `___`
- [ ] Infrastructure changes deployed first
- [ ] Other: ___

---

## Screenshots (if applicable)

<!-- Add screenshots for UI changes or API response examples -->

---

## Reviewer Notes

<!-- Anything specific reviewers should look at or test -->
