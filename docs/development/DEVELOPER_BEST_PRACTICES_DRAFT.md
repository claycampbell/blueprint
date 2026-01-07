# Developer Best Practices - DRAFT FOR REVIEW

**Status**: Draft for review - to be integrated into CLAUDE.md after approval
**Created**: December 17, 2025
**Purpose**: Comprehensive best practices for Blueprint/Connect 2.0 development team

---

## 1. Code Review Standards

### What Makes a Good Code Review Comment?

**Do:**
- **Be specific**: "This function could cause a race condition if two users update simultaneously" vs. "This looks wrong"
- **Explain why**: "We should validate email format here to prevent invalid data in the database"
- **Suggest solutions**: "Consider using a Map here instead of an array for O(1) lookups"
- **Ask questions**: "Could we simplify this by using the existing `formatDate()` utility?"
- **Praise good work**: "Nice error handling here - this will make debugging much easier"
- **Link to standards**: "Per TECHNOLOGY_STACK_DECISION.md, we're using async/await instead of .then()"

**Don't:**
- ❌ Be vague: "This doesn't look right"
- ❌ Make it personal: "You always forget to add tests"
- ❌ Nitpick style: "I prefer 4 spaces" (use linters/formatters for this)
- ❌ Approve without reading: "LGTM" when you haven't actually reviewed
- ❌ Argue in comments: Take heated discussions to Slack/video call

### Response Time Expectations

**For Reviewers (co-pilot):**
- **Critical/Hotfix PRs**: Within 2 hours during business hours
- **Standard PRs**: Within 1 business day
- **Large PRs (>400 lines)**: Within 2 business days
- **Documentation-only PRs**: Within 1 business day

**For PR Authors:**
- **Respond to comments**: Within 1 business day
- **Address requested changes**: Within 2 business days
- **Re-request review**: After addressing all comments

### When to Use Each Review Action

**Approve:**
- Code meets all standards
- Tests pass and coverage is adequate
- No significant concerns
- Minor suggestions are optional (use "Comment" for these)

**Request Changes:**
- Security vulnerabilities found
- Tests are missing or inadequate
- Breaking changes without migration plan
- Code doesn't follow project standards
- Significant logic errors or bugs

**Comment Only:**
- Asking clarifying questions
- Suggesting optional improvements
- Pointing out minor issues that don't block merge
- Sharing knowledge ("FYI, there's also a utility for this...")

### Handling Disagreements

1. **Author's first response**: Explain your reasoning with specifics
2. **Reviewer's follow-up**: If still concerned, escalate to team discussion
3. **Team discussion**: Async in Slack or sync call if complex
4. **Document decision**: If it's architectural, create an ADR (Architecture Decision Record)
5. **Move forward**: Once decided, update code and move on (no grudges)

---

## 2. Testing Requirements

### Minimum Test Coverage Expectations

**By Code Type:**
- **Business logic**: 90%+ coverage required
- **API endpoints**: 80%+ coverage required (all happy paths + error cases)
- **Utilities/helpers**: 95%+ coverage required
- **UI components**: 70%+ coverage required (critical interactions)
- **Integration tests**: All critical user flows

**Coverage is NOT enough - tests must be meaningful:**
- Test behavior, not implementation
- Test edge cases and error conditions
- Test integration points between modules

### When to Use Each Test Type

**Unit Tests (majority of tests):**
- Business logic functions
- Utility functions
- Service classes
- Data transformations
- Validation logic
- **Example**: Testing `calculateLoanInterest()` function

**Integration Tests:**
- API endpoint behavior (request → response)
- Database operations (CRUD)
- External service interactions (mocked)
- Authentication/authorization flows
- **Example**: Testing `POST /api/projects` creates database record

**E2E Tests (selective, high-value flows):**
- Critical user journeys
- Multi-step workflows
- **Example**: Lead intake → feasibility → approval flow
- **Note**: Expensive to maintain, keep minimal

**Contract Tests:**
- API contracts between services
- Integration points with external systems (BPO, iPad app)
- **Example**: Ensuring BPO API response matches expected schema

### Testing Requirements by Change Type

**New Features:**
- ✅ Unit tests for all business logic
- ✅ Integration tests for API endpoints
- ✅ E2E test for primary user flow (if critical feature)
- ✅ Tests must pass before PR

**Bug Fixes:**
- ✅ Add regression test that reproduces the bug
- ✅ Verify test fails before fix
- ✅ Verify test passes after fix
- ✅ Document the bug scenario in test name

**Refactoring:**
- ✅ All existing tests must still pass
- ✅ Add tests if coverage gaps discovered
- ✅ Update tests if behavior intentionally changes
- ❌ Don't reduce test coverage during refactoring

**Documentation/Config Changes:**
- Tests not required for markdown-only changes
- Tests required if config affects runtime behavior

### Testing in LocalStack Environment

**Local Development:**
- Run tests against LocalStack for AWS service mocking
- Use `docker-compose up localstack` before running tests
- Configure tests to use LocalStack endpoints (see `.env.test`)

**Pre-Commit:**
- All tests run automatically via `.claude/hooks/pre-commit.sh`
- **Commits blocked if tests fail** - fix tests before committing

**CI/CD:**
- GitHub Actions runs full test suite on every PR
- Must pass before merge allowed

---

## 3. Documentation Requirements

### When to Update the PRD

**Update [PRODUCT_REQUIREMENTS_DOCUMENT.md](../../PRODUCT_REQUIREMENTS_DOCUMENT.md) when:**
- ✅ Architecture decisions change (e.g., switching databases)
- ✅ Data model changes (adding/removing entities or fields)
- ✅ API contracts change (new endpoints, changed responses)
- ✅ Business requirements change (new features, modified workflows)
- ✅ MVP phasing changes (shifting features between phases)
- ✅ Integration approach changes (e.g., BPO API vs. export-based)

**Don't update PRD for:**
- ❌ Implementation details (which npm package to use)
- ❌ Code refactoring (internal improvements)
- ❌ Bug fixes (unless they reveal requirement gaps)
- ❌ Developer tooling changes (linters, formatters)

**PRD Update Process:**
1. Update relevant sections
2. Update version number and date
3. Add changelog entry at top
4. Create separate PR for PRD changes (branch: `docs/update-prd-<topic>`)

### API Documentation Standards

**Inline Code Comments:**
- Use JSDoc for TypeScript/JavaScript
- Document all public functions, classes, and interfaces
- Include `@param`, `@returns`, `@throws` annotations
- **Example**:
  ```typescript
  /**
   * Creates a new project with initial feasibility data
   * @param data - Project creation payload
   * @returns Created project with generated ID
   * @throws {ValidationError} If required fields are missing
   * @throws {ConflictError} If project with same address exists
   */
  async createProject(data: CreateProjectDto): Promise<Project>
  ```

**OpenAPI/Swagger Specs:**
- Generate from code annotations (use decorators/plugins)
- Keep in sync with actual API implementation
- Include request/response examples
- Document all error codes
- **Location**: `docs/api/openapi.yaml` (auto-generated)

**API Endpoint Documentation:**
- Each endpoint documented with:
  - Purpose and use case
  - Authentication requirements
  - Rate limiting (if applicable)
  - Request body schema
  - Response schema (success and errors)
  - Example requests/responses

### When README Files Are Needed

**Create README.md for:**
- ✅ Each microservice/module (e.g., `services/feasibility/README.md`)
- ✅ Each examples directory (e.g., `examples/nodejs-api/README.md`)
- ✅ Each script directory (e.g., `scripts/README.md`)
- ✅ Root of major feature areas

**README Should Include:**
- Purpose of the module/service
- How to run/use it
- Key dependencies
- Configuration requirements
- Links to detailed docs
- Common troubleshooting

**Don't Create README for:**
- ❌ Single-file utilities
- ❌ Trivial directories
- ❌ Temporary/experimental code

### Architecture Decision Records (ADRs)

**When to Create an ADR:**
- Major technology choices (database, framework, hosting)
- Significant architectural patterns (event-driven, microservices)
- Security approach (authentication method, encryption strategy)
- Integration approach (API vs. batch, sync vs. async)
- Data modeling decisions (multi-tenancy approach)

**ADR Format** (store in `docs/architecture/decisions/`):
```markdown
# ADR-XXX: [Title]

**Status**: Accepted | Proposed | Deprecated | Superseded
**Date**: YYYY-MM-DD
**Decision Makers**: [Names]
**Jira**: [Related tickets]

## Context
[What is the issue we're facing?]

## Decision
[What did we decide?]

## Consequences
[What are the positive and negative consequences?]

## Alternatives Considered
[What other options did we evaluate and why were they rejected?]
```

**Examples of ADRs We Should Create:**
- ADR-001: AWS as Cloud Provider (already decided - should document)
- ADR-002: Node.js + TypeScript for Backend (already decided)
- ADR-003: LocalStack for Local Development (already decided)
- ADR-004: Multi-tenancy Architecture (future)

---

## 4. Emergency Hotfix Process

### What Qualifies as an Emergency?

**Production-Down Emergencies (P0):**
- System completely unavailable
- Data loss or corruption occurring
- Security breach or active vulnerability being exploited
- Critical business process blocked (e.g., can't process loan draws)

**Urgent Issues (P1 - Fast-Track, Not Emergency):**
- Significant feature broken but workarounds exist
- Performance degradation affecting users
- Non-critical security vulnerability
- Data integrity issue (not actively losing data)

**Normal Issues (P2/P3 - Standard Process):**
- Minor bugs with workarounds
- Feature enhancements
- Technical debt
- Performance optimizations

### Who Has Authority to Approve Hotfixes?

**Emergency Hotfix Authority:**
1. **Primary**: co-pilot (technical lead)
2. **Backup**: Clay Campbell (project owner)
3. **After hours**: Any senior developer can approve and must notify co-pilot within 2 hours

**Approval Process:**
- Hotfix can be merged within 1 hour of PR creation
- Single approval required (vs. normal PR review time)
- All other standards still apply (tests must pass, code review still happens)

### Hotfix Branch Process

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue-description

# 2. Implement fix with test
# - Add regression test
# - Implement fix
# - Verify test passes

# 3. Commit and push
git add .
git commit -m "hotfix: Critical issue description (DP01-XXX)

[Detailed description of issue and fix]

🚨 EMERGENCY HOTFIX

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push -u origin hotfix/critical-issue-description

# 4. Create PR with [HOTFIX] prefix
gh pr create --title "[HOTFIX] Critical issue description" \
  --body "## Emergency Hotfix\n\n**Issue**: [description]\n**Impact**: [who/what affected]\n**Fix**: [what was done]\n**Testing**: [how verified]\n\nCloses: DP01-XXX" \
  --reviewer co-pilot

# 5. After approval, merge immediately
gh pr merge --squash --delete-branch

# 6. Verify fix in production
# 7. Notify team in Slack
```

### Post-Hotfix Procedures

**Within 24 Hours:**
1. ✅ Create Jira ticket for root cause analysis (if not already created)
2. ✅ Document incident timeline in Jira
3. ✅ Log time in Everhour
4. ✅ Notify all developers via Slack

**Within 1 Week:**
1. ✅ Conduct blameless post-mortem
2. ✅ Identify preventive measures
3. ✅ Create tasks for preventive work
4. ✅ Update monitoring/alerts if needed

---

## 5. Deployment and Release Process

### How Code Gets from `main` to Production

**Phase 1 (Current - Pre-Production):**
- `main` branch = development environment
- Automatic deploy to LocalStack/dev environment on merge
- Manual deploy to staging environment for testing
- **No production environment yet** (pre-MVP)

**Phase 2 (Post-MVP Launch - Days 90+):**
- `main` branch = staging environment
- `production` branch = production environment
- Release cadence: Weekly releases (every Friday)
- Emergency hotfixes: As needed

**CI/CD Pipeline** (GitHub Actions):
```
PR → Tests → Lint → Build → Merge to main →
  → Deploy to dev → Integration tests →
  → (Manual gate) → Deploy to staging →
  → (Manual gate) → Deploy to production
```

### Versioning Strategy

**Semantic Versioning (semver):**
- Format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
- **MAJOR**: Breaking changes (e.g., API contract changes)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

**Pre-1.0 (MVP Phase - Days 1-180):**
- Use `0.MINOR.PATCH` format
- `0.1.0` = Day 1 MVP launch
- `0.2.0` = Day 90 checkpoint
- `1.0.0` = Day 180 full launch

**Version Tags:**
```bash
git tag -a v0.1.0 -m "Day 1 MVP Launch - Design & Entitlement Module"
git push origin v0.1.0
```

### Rollback Procedures

**If Issues Detected Post-Deploy:**

1. **Immediate**: Revert to previous version
   ```bash
   # Roll back to previous release
   git revert <commit-hash>
   git push origin main
   # Trigger redeploy
   ```

2. **Investigate**: Determine root cause
3. **Fix Forward**: Create hotfix PR with proper fix
4. **Document**: Post-mortem and preventive measures

**Rollback Authority:**
- Any senior developer can initiate rollback
- Must notify co-pilot immediately
- Create incident ticket in Jira

### Who Has Deploy Permissions?

**Development Environment:**
- ✅ All developers (automatic on merge to `main`)

**Staging Environment:**
- ✅ co-pilot
- ✅ Clay Campbell
- ✅ Senior developers (manually triggered)

**Production Environment (Post-MVP):**
- ✅ co-pilot (primary)
- ✅ Clay Campbell (backup)
- ⚠️ Emergency hotfixes: Any senior developer with notification

---

## 6. Communication Protocols

### Where to Ask Questions

**Technical Questions:**
- **Quick questions** (<5 min answers): Slack `#blueprint-dev` channel
- **Architecture/design questions**: Tag @co-pilot in Slack or schedule discussion
- **Code-specific questions**: Comment on PR or Jira ticket
- **Claude Code questions**: Ask Claude directly, escalate if needed

**Project/Requirements Questions:**
- **Requirements clarification**: Add comment to Jira ticket
- **Priority questions**: Slack `#blueprint-planning` or tag Clay Campbell
- **PRD questions**: Add comment to Jira ticket or create docs PR

**Urgent/Blocking Questions:**
- Tag @co-pilot in Slack with "[BLOCKED]" prefix
- If no response in 2 hours, escalate to Clay Campbell

### How to Escalate Blockers

**Blocker Escalation Path:**
1. **First 2 hours**: Try to find workaround or alternative approach
2. **After 2 hours**: Post in Slack `#blueprint-dev` with "[BLOCKED]" prefix
3. **After 4 hours**: Tag @co-pilot directly
4. **After 8 hours (same day)**: Tag Clay Campbell
5. **Update Jira**: Change ticket status to "Blocked" with reason

**Blocker Post Format:**
```
🚨 [BLOCKED] DP01-XXX: [Task name]

**Issue**: [What's blocking you]
**Impact**: [What can't be completed]
**Tried**: [What you've attempted]
**Need**: [What you need to unblock]
**ETA**: [When you need resolution by]
```

### Daily Standup/Async Updates

**Async Standup Format** (Slack `#blueprint-dev`, daily by 10am):
```
📅 Daily Update - [Your Name]

✅ Yesterday:
- Completed DP01-XXX: [Task name]
- Made progress on DP01-YYY: [Current status]

🎯 Today:
- Will complete DP01-YYY: [Expected outcome]
- Starting DP01-ZZZ: [Task name]

🚧 Blockers:
- None / [Brief description + link to blocker post]
```

**When Standups Are Required:**
- Every working day by 10am Pacific
- If you're taking PTO, post the day before
- If you're running late, post by noon with explanation

### When to Tag @co-pilot vs. Others

**Tag @co-pilot when:**
- Architecture decisions needed
- Blocked on technical decisions
- PR needs urgent review (emergency)
- Security concerns discovered
- Significant deviation from plan needed

**Tag @clay (Clay Campbell) when:**
- Requirements need clarification
- Priority conflicts arise
- Business logic questions
- Budget/timeline concerns
- Access/permissions needed

**Tag @channel when:**
- Production incidents
- Breaking changes to shared services
- Important announcements (new processes, tools)

**Don't Tag Anyone When:**
- Asking general questions (post without tags, people will respond)
- Sharing progress updates (use daily standup format)
- Documenting decisions (just post FYI)

---

## 7. Environment and Secrets Management

### How to Handle API Keys and Secrets Locally

**Never Commit Secrets:**
- ❌ No API keys in code
- ❌ No passwords in config files
- ❌ No tokens in environment files committed to Git
- ✅ Use `.env.example` with placeholder values
- ✅ Use `.env` for local secrets (git-ignored)

**Local Development Secrets:**
```bash
# 1. Copy example file
cp .env.example .env

# 2. Add your secrets to .env (never commit this)
EVERHOUR_API_TOKEN=your_token_here
AWS_ACCESS_KEY_ID=your_localstack_key
DATABASE_PASSWORD=your_local_password

# 3. Load in your application
# Node.js: use dotenv package
# Python: use python-dotenv
```

**Secret Detection:**
- Pre-commit hook scans for common secret patterns
- GitHub secret scanning enabled
- If secrets are committed: Rotate immediately, force-push to remove

### AWS Credentials Setup for Developers

**LocalStack (Local Development):**
```bash
# .env file (git-ignored)
AWS_ENDPOINT=http://localhost:4566
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# LocalStack accepts any credentials for local testing
```

**AWS Development Account (Shared Dev Environment):**
- Use IAM roles (not permanent credentials)
- Request access from co-pilot or Clay
- Configure AWS CLI with named profiles:
  ```bash
  aws configure --profile blueprint-dev
  # Enter credentials provided by co-pilot
  ```

**AWS Production Account (Post-MVP):**
- Production credentials only for co-pilot and Clay
- Deployments via CI/CD using IAM roles
- Developers never need production credentials

### Environment Variable Naming Conventions

**Format**: `{SERVICE}_{RESOURCE}_{ATTRIBUTE}`

**Examples:**
- `DATABASE_HOST=localhost`
- `DATABASE_PORT=5432`
- `DATABASE_NAME=connect2`
- `REDIS_URL=redis://localhost:6379`
- `S3_BUCKET_NAME=blueprint-documents-dev`
- `EVERHOUR_API_TOKEN=abc123`
- `AUTH_JWT_SECRET=random_secret_string`
- `NODE_ENV=development` (development | staging | production)

**Use Consistent Naming:**
- `*_URL` for full URLs (including protocol)
- `*_HOST` for hostnames only
- `*_PORT` for port numbers
- `*_TOKEN` or `*_KEY` for credentials
- `*_SECRET` for encryption keys

### Secret Management in Production (Post-MVP)

**AWS Systems Manager Parameter Store:**
- Store all production secrets
- Access via IAM roles (no credentials in code)
- Automatic rotation for sensitive secrets
- **Example**:
  ```typescript
  // Fetch secret at runtime
  const secret = await ssm.getParameter({
    Name: '/connect2/production/database/password',
    WithDecryption: true
  });
  ```

---

## 8. Definition of Done

### Task Checklist: When is Work "Done"?

A task is **complete** only when ALL of the following are true:

**Code Complete:**
- [ ] Feature implemented per acceptance criteria
- [ ] Code follows project conventions (TypeScript, Node.js standards)
- [ ] No linter errors or warnings
- [ ] No console.log() or debug code left in
- [ ] Error handling implemented
- [ ] Edge cases handled

**Tests:**
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (if applicable)
- [ ] Test coverage meets minimums (see Testing Requirements)
- [ ] Manual testing completed
- [ ] No tests skipped or commented out

**Documentation:**
- [ ] Inline code comments for complex logic
- [ ] JSDoc comments for public APIs
- [ ] README updated (if new module/service)
- [ ] PRD updated (if requirements changed)
- [ ] API documentation updated (if endpoints changed)

**Code Review:**
- [ ] PR created with descriptive title and body
- [ ] @co-pilot tagged as reviewer
- [ ] All review comments addressed
- [ ] PR approved
- [ ] CI/CD checks passing (tests, lint, build)

**Jira:**
- [ ] Jira ticket status updated to "Done"
- [ ] Completion comment added with summary
- [ ] Time logged in Everhour
- [ ] Related tickets linked (if applicable)

**Git:**
- [ ] Commits follow format: `type: description (DP01-XXX)`
- [ ] Branch rebased on latest main
- [ ] PR merged via "Squash and merge"
- [ ] Feature branch deleted

**Deployment:**
- [ ] Code deployed to dev environment
- [ ] Smoke test passed in dev
- [ ] Ready for staging deployment (if applicable)

### Code Complete vs. Done

**Code Complete** = Code written and locally tested
**Done** = Everything above ✅

**Why the distinction matters:**
- Moving a ticket to "Done" signals to team it's truly finished
- Incomplete tasks block dependent work
- Impacts sprint velocity calculations
- Creates false sense of progress

**Anti-Pattern to Avoid:**
```
❌ Dev: "I'm done with the code, just need to write tests"
   → Task is NOT done. Status should be "In Progress"

❌ Dev: "PR is up, marking ticket as Done"
   → Task is NOT done until PR is merged

❌ Dev: "It works on my machine, pushing to main"
   → Tests must pass, PR must be reviewed
```

### When to Mark a Task as Done

**Mark as Done when:**
- ✅ All checklist items above are complete
- ✅ PR is merged to main
- ✅ Code is deployed to dev environment
- ✅ You would be comfortable with another developer taking over

**Don't mark as Done if:**
- ❌ "Just needs code review" → Status: "In Review"
- ❌ "Waiting for deployment" → Status: "Ready for Deploy"
- ❌ "Need to write tests" → Status: "In Progress"
- ❌ "Works but needs cleanup" → Status: "In Progress"

---

## 9. Pair Programming with Claude Code

### Best Practices for AI-Assisted Development

**Start Every Task with Planning:**
- Use `/superpowers:brainstorm` before writing code
- Let Claude help you think through edge cases
- Ask "What could go wrong?" before implementing

**Use Claude for Exploration:**
- "Find all places where we handle user authentication"
- "Show me how error handling works in the existing API"
- "What's the pattern for database migrations in this project?"

**Use Claude for Implementation:**
- "Implement this function with full error handling and tests"
- "Refactor this to use async/await"
- "Add TypeScript types to this JavaScript code"

**Use Claude for Review:**
- "Review this code for security issues"
- "Check if this follows the project conventions in CLAUDE.md"
- "Are there any edge cases I'm missing?"

### When to Use Different Claude Code Skills/Agents

**Exploration Tasks:**
- Use `Explore` agent for understanding codebase
- "How does authentication work in this project?"
- "Where is the database schema defined?"

**Feature Development:**
- Use `/feature-dev:feature-dev` for guided implementation
- Follows structured approach: understand → plan → implement

**Code Review:**
- Use `/pr-review-toolkit:review-pr` before creating PR
- Catches issues early, improves code quality

**Debugging:**
- Use direct Claude conversation with error logs
- Share error messages, stack traces, logs
- Claude can search codebase for root causes

### How to Review AI-Generated Code

**Don't Blindly Trust:**
- ⚠️ Read every line Claude writes
- ⚠️ Understand the logic before accepting
- ⚠️ Test thoroughly (AI can make subtle mistakes)
- ⚠️ Verify security implications

**Review Checklist:**
- [ ] Does this actually solve the problem?
- [ ] Are there edge cases not handled?
- [ ] Is error handling appropriate?
- [ ] Are there security concerns (injection, XSS, etc.)?
- [ ] Does it follow project conventions?
- [ ] Are the tests meaningful (not just for coverage)?
- [ ] Is it maintainable (will future devs understand it)?

**Common AI Pitfalls:**
- **Hallucination**: Claude may reference APIs/libraries that don't exist
- **Over-engineering**: Claude may add unnecessary complexity
- **Missing context**: Claude may not know about project-specific constraints
- **Test quality**: AI-generated tests may be superficial

### Common Pitfalls to Avoid

**Pitfall 1: Over-Reliance**
- ❌ Don't let Claude make architectural decisions alone
- ✅ Use Claude to explore options, but YOU decide

**Pitfall 2: Accepting Without Understanding**
- ❌ Don't merge code you don't fully understand
- ✅ Ask Claude to explain complex sections

**Pitfall 3: Skipping Manual Testing**
- ❌ Don't assume AI-written code works perfectly
- ✅ Always manually test before committing

**Pitfall 4: Not Leveraging Claude's Strengths**
- ❌ Don't use Claude just as a code generator
- ✅ Use Claude for:
  - Exploring unfamiliar codebases
  - Generating boilerplate/tests
  - Catching bugs and security issues
  - Suggesting better approaches
  - Documentation

---

## 10. Breaking Changes

### How to Handle API Contract Changes

**What is a Breaking Change?**
- Removing an endpoint
- Changing request/response structure
- Renaming fields
- Changing field types
- Changing authentication requirements
- Removing support for a query parameter

**Process for Breaking Changes:**

1. **Avoid if Possible:**
   - Add new endpoints instead of changing existing
   - Make fields optional instead of removing
   - Add new fields instead of renaming
   - Deprecate old approach before removing

2. **If Unavoidable:**
   - Document the change in ADR
   - Create migration guide
   - Update all consumers (frontend, integrations)
   - Version the API (e.g., `/api/v2/projects`)

3. **Communication:**
   - Tag @channel in Slack with "[BREAKING CHANGE]" prefix
   - Update PRD with new contract
   - Create Jira tickets for all affected consumers

**Example Breaking Change Process:**
```markdown
## Breaking Change: Project API Response Structure

**Change**: `GET /api/projects/:id` response structure modified
**Reason**: Adding support for multi-tenancy
**Impact**: Frontend and BPO integration affected

**Old Response:**
```json
{
  "id": "123",
  "name": "Project Name",
  "address": "123 Main St"
}
```

**New Response:**
```json
{
  "id": "123",
  "tenantId": "tenant-1",
  "data": {
    "name": "Project Name",
    "address": "123 Main St"
  }
}
```

**Migration:**
- Frontend: Update all API calls by [Date]
- BPO Integration: Deploy new version by [Date]
- Old endpoint deprecated: [Date]
- Old endpoint removed: [Date + 30 days]

**Related Tickets:**
- DP01-XXX: Update frontend API calls
- DP01-YYY: Update BPO integration
```

### Database Migration Strategy

**Every Schema Change Requires a Migration:**
- Use versioned migration files
- Never modify existing migrations (create new ones)
- Include both `up` and `down` migrations
- Test migrations on copy of production data

**Migration File Naming:**
```
migrations/
  ├── 001_initial_schema.sql
  ├── 002_add_tenant_id.sql
  ├── 003_add_user_roles.sql
  └── 004_create_audit_log_table.sql
```

**Safe Migration Patterns:**

**Adding a Column:**
```sql
-- Safe: Add nullable column or column with default
ALTER TABLE projects ADD COLUMN tenant_id VARCHAR(50) DEFAULT 'default-tenant';
```

**Removing a Column (Two-Step):**
```sql
-- Step 1: Deploy code that doesn't use the column
-- Step 2 (separate deployment): Remove column
ALTER TABLE projects DROP COLUMN old_field;
```

**Renaming a Column (Three-Step):**
```sql
-- Step 1: Add new column
ALTER TABLE projects ADD COLUMN new_name VARCHAR(100);

-- Step 2: Backfill data + deploy code using new column
UPDATE projects SET new_name = old_name WHERE new_name IS NULL;

-- Step 3 (separate deployment): Remove old column
ALTER TABLE projects DROP COLUMN old_name;
```

### Backward Compatibility Requirements

**During MVP Phase (Days 1-180):**
- Backward compatibility **not required** (rapid iteration)
- Breaking changes allowed with team notification
- Coordinate breaking changes with frontend team

**Post-MVP (Days 180+):**
- API backward compatibility **required** for 30 days
- Use API versioning for breaking changes
- Deprecation warnings before removal
- Support both old and new formats during transition

**Multi-Tenancy Consideration:**
- Once multiple tenants exist, breaking changes become expensive
- Plan migrations carefully with rollback procedures
- Test with representative data from all tenants

### Communication Requirements for Breaking Changes

**Before Implementing:**
1. Post in Slack `#blueprint-dev` with `[BREAKING CHANGE PROPOSAL]`
2. Get approval from @co-pilot
3. Create Jira tickets for all affected components
4. Schedule implementation to minimize disruption

**During Implementation:**
1. Create feature branch with "breaking-change" prefix
2. Update all affected code in same PR (keep atomic)
3. PR title must include "[BREAKING CHANGE]"
4. PR description must include migration guide

**After Deployment:**
1. Post in Slack with `[BREAKING CHANGE DEPLOYED]`
2. Monitor for issues in next 24 hours
3. Be ready to rollback if needed
4. Update documentation immediately

---

## Implementation Plan

**Recommendation**: Integrate these sections into CLAUDE.md in priority order:

1. **High Priority** (add now):
   - Definition of Done
   - Testing Requirements
   - Code Review Standards

2. **Medium Priority** (add within 1 week):
   - Emergency Hotfix Process
   - Communication Protocols
   - Pair Programming with Claude Code

3. **Lower Priority** (add within 2 weeks):
   - Deployment and Release Process
   - Breaking Changes
   - Documentation Requirements
   - Environment and Secrets Management

**Question for Clay**: Which sections do you want to integrate into CLAUDE.md first? Any sections need modification before inclusion?
