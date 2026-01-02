# Code Review Guidelines

**Version:** 1.0
**Last Updated:** November 6, 2025
**Status:** Draft - Ready for Technical Review
**Related Documents:** [TESTING_STRATEGY.md](TESTING_STRATEGY.md), [SECURITY_COMPLIANCE.md](SECURITY_COMPLIANCE.md), [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Code Review Philosophy](#2-code-review-philosophy)
3. [Review Process](#3-review-process)
4. [Review SLA](#4-review-sla)
5. [Approval Requirements](#5-approval-requirements)
6. [What to Look For](#6-what-to-look-for)
7. [How to Give Feedback](#7-how-to-give-feedback)
8. [How to Receive Feedback](#8-how-to-receive-feedback)
9. [Special Review Scenarios](#9-special-review-scenarios)
10. [PR Size Guidelines](#10-pr-size-guidelines)
11. [Merge Strategies](#11-merge-strategies)
12. [Review Checklist](#12-review-checklist)
13. [Conflict Resolution](#13-conflict-resolution)
14. [Emergency Hotfix Process](#14-emergency-hotfix-process)

---

## 1. Overview

### 1.1 Purpose

Code review is a critical quality gate in the Connect 2.0 development process. These guidelines ensure:

- **Consistent Quality**: Maintain high code quality across the entire platform
- **Knowledge Sharing**: Spread domain expertise and technical skills across the team
- **Bug Prevention**: Catch issues before they reach production
- **Security**: Ensure security best practices are followed
- **Maintainability**: Keep the codebase readable and sustainable for future developers

### 1.2 Review Goals

Every code review should achieve these objectives:

1. **Correctness**: Code does what it's supposed to do
2. **Quality**: Code is readable, maintainable, and follows standards
3. **Security**: No vulnerabilities introduced
4. **Performance**: No obvious performance issues
5. **Testing**: Adequate test coverage with meaningful tests
6. **Documentation**: Changes are properly documented

---

## 2. Code Review Philosophy

### 2.1 Our Code Review Goals

Code review **IS** about:

- **Catching bugs before production**: Identify logic errors, edge cases, and potential failures
- **Sharing knowledge across the team**: Learn from each other's approaches and solutions
- **Maintaining consistent code quality**: Ensure all code meets our standards
- **Ensuring security best practices**: Protect sensitive financial data and user information
- **Documenting decisions**: Create context for future developers who maintain the code
- **Building team cohesion**: Collaborative improvement through constructive feedback

Code review is **NOT** about:

- **Being a gatekeeper**: Don't block progress unnecessarily
- **Nitpicking personal style preferences**: Focus on substance over style (let automated tools handle formatting)
- **Showing superiority**: Everyone has something to learn and teach
- **Perfectionism**: Good enough is better than perfect but late
- **Micromanagement**: Trust your teammates' judgment on implementation details

### 2.2 Core Principles

1. **Assume Good Intent**: Authors want to write good code; reviewers want to help
2. **Be Kind and Respectful**: Critique code, not people
3. **Ask Questions**: "Why did you choose this approach?" is better than "This is wrong"
4. **Provide Context**: Explain the reasoning behind feedback
5. **Balance Speed and Quality**: Review thoroughly but don't let PRs stagnate
6. **Learn Together**: Code review is a two-way teaching opportunity

### 2.3 Reviewer Mindset

As a reviewer, ask yourself:

- Is this code **correct** and does it solve the problem?
- Can I **understand** what this code does without the author explaining it?
- Are there **obvious bugs or edge cases** not handled?
- Does this follow our **security and quality standards**?
- Will future developers be able to **maintain** this code?
- Is the approach **reasonable** given the constraints and requirements?

---

## 3. Review Process

### 3.1 Author Checklist (Before Requesting Review)

Before clicking "Request Review," complete this checklist:

- [ ] **Self-review completed**: Read your own diff line-by-line as if you were reviewing someone else's code
- [ ] **Tests added/updated and passing locally**: Run `npm test` in both frontend and backend
- [ ] **Linting passes**: Run `npm run lint` with no errors
- [ ] **Documentation updated**: Update API docs, README, or inline comments if public interface changed
- [ ] **PR description filled out**: Use the PR template, explain what and why
- [ ] **Linked to GitHub issue**: Reference the task/issue number (e.g., "Closes #123")
- [ ] **Screenshots included**: If UI changes, add before/after screenshots
- [ ] **No merge conflicts with main**: Rebase or merge main into your branch
- [ ] **No sensitive data committed**: Check for API keys, passwords, or PII in code or logs
- [ ] **Database migrations tested**: If adding migrations, verify up/down both work

### 3.2 Reviewer Checklist

As a reviewer, evaluate these aspects:

#### Functional Requirements
- [ ] **Acceptance criteria met**: Code solves the problem described in the linked issue
- [ ] **Edge cases handled**: Null values, empty arrays, error conditions
- [ ] **User experience considered**: For UI changes, is the UX intuitive?

#### Code Quality
- [ ] **Code is readable**: Clear variable names, logical structure, appropriate comments
- [ ] **No duplication**: Similar code should be abstracted into reusable functions
- [ ] **Functions are focused**: Each function has a single, clear purpose
- [ ] **Error handling is appropriate**: Errors are caught, logged, and handled gracefully

#### Testing
- [ ] **Unit tests added/updated**: Business logic has unit test coverage
- [ ] **Tests are meaningful**: Tests actually validate functionality, not just mock everything
- [ ] **Coverage is adequate**: New code has ≥80% coverage
- [ ] **Tests pass in CI**: Green checkmark on GitHub Actions

#### Security
- [ ] **No SQL injection**: Parameterized queries used (see SECURITY_COMPLIANCE.md §5.3)
- [ ] **No XSS vulnerabilities**: User input is sanitized, output is encoded
- [ ] **Authentication checks**: Protected routes require authentication
- [ ] **Authorization checks**: Users can only access data they're permitted to see (RBAC enforced)
- [ ] **No secrets committed**: API keys, passwords in environment variables, not code
- [ ] **Sensitive data not logged**: PII (SSN, bank accounts) redacted from logs

#### Performance
- [ ] **No N+1 query problems**: Check for loops making database queries
- [ ] **Database indexes appropriate**: Foreign keys have indexes
- [ ] **No unnecessary computations**: Avoid recalculating values in loops
- [ ] **Large payloads paginated**: API responses with many records use pagination

#### Standards
- [ ] **Follows TypeScript style guide**: See DEVELOPMENT_GUIDE.md §11.1
- [ ] **Follows React patterns**: For frontend components
- [ ] **Follows API naming conventions**: See API_SPECIFICATION.md
- [ ] **Follows database naming conventions**: See DATABASE_SCHEMA.md

### 3.3 Review Workflow

```
┌──────────────────────────────────────────────────────┐
│ 1. Author creates PR                                 │
│    - Completes author checklist                      │
│    - Fills out PR template                           │
│    - Requests reviewers (1-2 people)                 │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 2. CI/CD runs automated checks                       │
│    - Linting                                         │
│    - Unit tests                                      │
│    - Integration tests                               │
│    - Security scanning                               │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 3. Reviewers provide feedback                        │
│    - Use comment prefixes ([BLOCKING], [SUGGESTION]) │
│    - Request changes or approve                      │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 4. Author addresses feedback                         │
│    - Make requested changes                          │
│    - Reply to comments explaining decisions          │
│    - Mark conversations as resolved                  │
│    - Re-request review                               │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 5. Reviewers re-review                               │
│    - Verify changes address feedback                 │
│    - Approve when satisfied                          │
└──────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────┐
│ 6. Author merges PR                                  │
│    - Use "Squash and Merge" (default)                │
│    - Ensure commit message follows convention        │
│    - Delete feature branch after merge               │
└──────────────────────────────────────────────────────┘
```

---

## 4. Review SLA

### 4.1 Response Time Commitments

| Review Type | Initial Review | Re-Review | Notes |
|-------------|----------------|-----------|-------|
| **Standard PR** | Within 24 hours (next business day) | Within 4 hours | Most PRs fall here |
| **Small PR (<100 lines)** | Within 4 hours | Within 2 hours | Quick fixes, docs |
| **Hotfix** | Within 1 hour | Within 30 minutes | Production issues |
| **Large PR (500+ lines)** | Within 48 hours | Within 8 hours | Requires tech lead review |

### 4.2 If You Can't Meet SLA

If you're unable to review within the SLA:

1. **Add a comment**: "I'm currently at capacity. Will review by [specific time]."
2. **Tag someone else**: "@teammate can you take a look at this? I'm swamped."
3. **Notify author directly**: Slack them if urgent

### 4.3 Reviewer Assignment

- **Small PRs**: 1 approval required (any team member)
- **Medium PRs**: 2 approvals required (peers)
- **Large PRs**: 2 approvals + tech lead review
- **Special cases** (see §5.2 below)

---

## 5. Approval Requirements

### 5.1 PR Size-Based Requirements

| PR Size | Lines Changed | Approvals Required | Review Depth |
|---------|---------------|--------------------|--------------|
| **Small** | < 100 lines | 1 approval | Quick review |
| **Medium** | 100-500 lines | 2 approvals | Standard review |
| **Large** | 500+ lines | 2 approvals + tech lead | Deep review |
| **Extra Large** | 1000+ lines | Break into smaller PRs | Avoid if possible |

**How to check PR size:**
```bash
# View stats for your branch
git diff --stat main...HEAD
```

### 5.2 Special Case Requirements

Certain changes require additional review regardless of size:

| Change Type | Required Reviewers | Rationale |
|-------------|-------------------|-----------|
| **Database migrations** | Backend lead | Schema changes affect entire system |
| **Security changes** | Security champion | Critical for data protection |
| **Infrastructure (Docker, CI/CD)** | DevOps lead | Affects deployment pipeline |
| **Breaking API changes** | Tech lead + product manager | Impacts frontend/integrations |
| **Authentication/Authorization** | Backend lead + security champion | Core security functionality |
| **Financial calculations** | Backend lead | Must maintain zero-default record |
| **Compliance-related** | Legal + tech lead | Regulatory requirements (GLBA, ECOA) |

### 5.3 Approval States

| State | Meaning | Next Steps |
|-------|---------|------------|
| **Approved** | Reviewer is satisfied | Can merge once required approvals met |
| **Request Changes** | Must address issues before merge | Author makes changes, re-requests review |
| **Comment** | Feedback provided, no explicit approval/rejection | Author decides how to proceed |

---

## 6. What to Look For

### 6.1 Correctness

**Does the code do what it's supposed to do?**

- [ ] Logic is correct and handles all specified cases
- [ ] Edge cases are handled (null, undefined, empty arrays, zero, negative numbers)
- [ ] Off-by-one errors checked (array indexing, loop bounds)
- [ ] Error conditions handled appropriately
- [ ] State transitions are valid (e.g., project status changes follow allowed paths)

**Examples of issues to catch:**

```typescript
// ❌ BAD: Off-by-one error
for (let i = 0; i <= arr.length; i++) {  // Should be i < arr.length
  console.log(arr[i]);
}

// ❌ BAD: Null not handled
function formatAddress(project: Project) {
  return `${project.address}, ${project.city}`; // What if project is null?
}

// ✅ GOOD: Null handled
function formatAddress(project: Project | null) {
  if (!project) return 'No address';
  return `${project.address}, ${project.city}`;
}
```

### 6.2 Testing

**Are there adequate, meaningful tests?**

- [ ] Unit tests for business logic (e.g., loan calculations, status transitions)
- [ ] Integration tests for API endpoints
- [ ] Tests actually test functionality (not just mock everything)
- [ ] Test coverage ≥80% for new code
- [ ] Tests have clear names describing what they test
- [ ] Tests are independent (don't rely on execution order)

**Examples of good vs. bad tests:**

```typescript
// ❌ BAD: Test doesn't actually test anything
it('should calculate monthly payment', () => {
  const calculator = new PaymentCalculator();
  const result = calculator.calculateMonthlyPayment(1000000, 0.08, 24);
  expect(result).toBeDefined(); // Too vague!
});

// ✅ GOOD: Test verifies specific behavior
it('should calculate monthly payment for $1M loan at 8% over 24 months', () => {
  const calculator = new PaymentCalculator();
  const result = calculator.calculateMonthlyPayment({
    principal: 1000000,
    annualRate: 0.08,
    termMonths: 24
  });

  expect(result.monthlyPayment).toBeCloseTo(45207.57, 2);
  expect(result.totalInterest).toBeCloseTo(84981.68, 2);
});

// ✅ GOOD: Test verifies edge case
it('should throw error for negative principal', () => {
  const calculator = new PaymentCalculator();

  expect(() => {
    calculator.calculateMonthlyPayment({
      principal: -1000,
      annualRate: 0.08,
      termMonths: 24
    });
  }).toThrow('Principal must be positive');
});
```

### 6.3 Security

**Are security best practices followed?**

For detailed security requirements, see [SECURITY_COMPLIANCE.md](SECURITY_COMPLIANCE.md).

#### SQL Injection Prevention
```typescript
// ❌ BAD: Vulnerable to SQL injection
const query = `SELECT * FROM users WHERE email = '${email}'`;
await db.raw(query);

// ✅ GOOD: Parameterized query
const user = await db('users').where({ email }).first();

// ✅ GOOD: Placeholders for raw queries
const user = await db.raw('SELECT * FROM users WHERE email = ?', [email]);
```

#### XSS Prevention
```typescript
// ❌ BAD: Unescaped user input
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// ✅ GOOD: Sanitized HTML
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userComment) }} />

// ✅ BETTER: Avoid HTML entirely
<div>{userComment}</div>
```

#### Authentication & Authorization
```typescript
// ❌ BAD: No authentication check
router.get('/api/v1/loans/:id', async (req, res) => {
  const loan = await db.loans.findById(req.params.id);
  return res.json(loan);
});

// ✅ GOOD: Authentication + authorization
router.get('/api/v1/loans/:id',
  authenticate,  // Middleware ensures user is logged in
  authorize(['ADMIN', 'LOAN_OFFICER', 'SERVICING']),  // Role check
  async (req, res) => {
    const loan = await db.loans.findById(req.params.id);

    // Row-level security: ensure user can access this loan
    if (!canAccessLoan(req.user, loan)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.json(loan);
  }
);
```

#### Secrets and Credentials
```typescript
// ❌ BAD: Hardcoded secret
const apiKey = 'sk_live_1234567890abcdef';

// ❌ BAD: Secret in environment variable (committed to repo)
// .env (committed to git)
SENDGRID_API_KEY=SG.abc123def456

// ✅ GOOD: Secret from secure vault
const apiKey = await getSecret('sendgrid-api-key');

// ✅ GOOD: Environment variable (not committed)
// .env.example (committed - template only)
SENDGRID_API_KEY=your_sendgrid_key_here

// .env (in .gitignore - actual secret)
SENDGRID_API_KEY=SG.abc123def456
```

#### Sensitive Data in Logs
```typescript
// ❌ BAD: Logging sensitive data
logger.info('User logged in', {
  user_id: user.id,
  email: user.email,
  ssn: user.ssn,  // PII!
  password: password  // Never log passwords!
});

// ✅ GOOD: Redact sensitive fields
logger.info('User logged in', {
  user_id: user.id,
  email: user.email,
  // ssn and password omitted
});
```

### 6.4 Performance

**Are there obvious performance issues?**

#### N+1 Query Problem
```typescript
// ❌ BAD: N+1 query (1 query for projects, then N queries for loans)
const projects = await db('projects').select('*');
for (const project of projects) {
  project.loans = await db('loans').where({ project_id: project.id });
}

// ✅ GOOD: Single query with join
const projects = await db('projects')
  .select('projects.*', db.raw('json_agg(loans.*) as loans'))
  .leftJoin('loans', 'projects.id', 'loans.project_id')
  .groupBy('projects.id');

// ✅ GOOD: Eager loading with ORM
const projects = await Project.query().withGraphFetched('loans');
```

#### Unnecessary Computations
```typescript
// ❌ BAD: Recalculating in loop
for (const item of items) {
  const tax = item.price * TAX_RATE;  // Recalculating TAX_RATE reference every iteration
  const total = calculateTotal(items);  // Recalculating total N times!
}

// ✅ GOOD: Calculate once
const taxRate = TAX_RATE;
const total = calculateTotal(items);
for (const item of items) {
  const tax = item.price * taxRate;
  // Use total
}
```

#### Missing Database Indexes
```sql
-- ❌ BAD: Foreign key without index
CREATE TABLE loans (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id)  -- Should have index!
);

-- ✅ GOOD: Foreign key with index
CREATE TABLE loans (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id)
);
CREATE INDEX idx_loans_project_id ON loans(project_id);
```

#### Large Payloads
```typescript
// ❌ BAD: Returning all records
router.get('/api/v1/projects', async (req, res) => {
  const projects = await db('projects').select('*');  // Could be thousands!
  return res.json({ data: projects });
});

// ✅ GOOD: Pagination
router.get('/api/v1/projects', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  const projects = await db('projects')
    .select('*')
    .limit(limit)
    .offset(offset);

  const total = await db('projects').count('* as count').first();

  return res.json({
    data: projects,
    pagination: {
      page,
      limit,
      total: total.count,
      pages: Math.ceil(total.count / limit)
    }
  });
});
```

### 6.5 Maintainability

**Will future developers understand this code?**

#### Code Readability
```typescript
// ❌ BAD: Cryptic variable names
const d = new Date();
const x = d.getTime();
const y = x + 86400000;

// ✅ GOOD: Descriptive names
const today = new Date();
const todayTimestamp = today.getTime();
const millisecondsInDay = 86400000;
const tomorrowTimestamp = todayTimestamp + millisecondsInDay;

// ✅ BETTER: Use date library
import { addDays } from 'date-fns';
const tomorrow = addDays(new Date(), 1);
```

#### Function Size and Focus
```typescript
// ❌ BAD: Function does too much
async function processLoan(loanId: string) {
  const loan = await db.loans.findById(loanId);

  // Validate
  if (!loan) throw new Error('Loan not found');
  if (loan.status !== 'PENDING') throw new Error('Invalid status');

  // Calculate
  const monthlyPayment = loan.amount * (loan.rate / 12) / (1 - Math.pow(1 + loan.rate / 12, -loan.term));

  // Send email
  await sendEmail(loan.borrower_email, 'Loan Approved', `Your payment is $${monthlyPayment}`);

  // Update status
  await db.loans.update(loanId, { status: 'APPROVED', monthly_payment: monthlyPayment });

  // Log
  logger.info('Loan processed', { loan_id: loanId });
}

// ✅ GOOD: Separate concerns
async function approveLoan(loanId: string) {
  const loan = await getLoanById(loanId);
  validateLoanForApproval(loan);

  const monthlyPayment = calculateMonthlyPayment(loan);

  await updateLoanStatus(loanId, 'APPROVED', monthlyPayment);
  await sendLoanApprovalEmail(loan, monthlyPayment);

  logger.info('Loan approved', { loan_id: loanId, monthly_payment: monthlyPayment });
}
```

#### Comments Explaining "Why"
```typescript
// ❌ BAD: Comment explains "what" (code is self-explanatory)
// Multiply by 12 to get annual rate
const annualRate = monthlyRate * 12;

// ✅ GOOD: No comment needed (code is clear)
const annualRate = monthlyRate * 12;

// ✅ GOOD: Comment explains "why" (not obvious from code)
// Blueprint's accounting system requires dates in Pacific Time
// even though the database stores UTC. This conversion prevents
// off-by-one date errors in reports.
const pacificDate = convertToPacificTime(utcDate);
```

#### Avoiding Duplication
```typescript
// ❌ BAD: Duplicated code
async function createProject(data) {
  const project = await db.projects.insert(data);
  await auditLog.create({ action: 'PROJECT_CREATED', entity_id: project.id });
  await eventBus.publish('project.created', project);
  return project;
}

async function updateProject(id, data) {
  const project = await db.projects.update(id, data);
  await auditLog.create({ action: 'PROJECT_UPDATED', entity_id: project.id });
  await eventBus.publish('project.updated', project);
  return project;
}

// ✅ GOOD: Extract common logic
async function createProject(data) {
  const project = await db.projects.insert(data);
  await recordProjectEvent('PROJECT_CREATED', project);
  return project;
}

async function updateProject(id, data) {
  const project = await db.projects.update(id, data);
  await recordProjectEvent('PROJECT_UPDATED', project);
  return project;
}

async function recordProjectEvent(action: string, project: Project) {
  await auditLog.create({ action, entity_id: project.id });
  await eventBus.publish(`project.${action.toLowerCase()}`, project);
}
```

---

## 7. How to Give Feedback

### 7.1 Comment Prefixes

Use prefixes to indicate severity and intent:

| Prefix | Meaning | Must Address? |
|--------|---------|---------------|
| **[BLOCKING]** | Must be fixed before merge | Yes - request changes |
| **[SUGGESTION]** | Consider this, but not required | No - author decides |
| **[QUESTION]** | Help me understand this | No - seeking clarification |
| **[NIT]** | Minor style preference (not blocking) | No - up to author |
| **[PRAISE]** | Call out good work! | N/A - positive feedback |

### 7.2 Good Feedback Examples

#### Example 1: Security Issue (Blocking)

```markdown
[BLOCKING] This SQL query is vulnerable to injection attacks.

Current code:
​```typescript
const query = `SELECT * FROM users WHERE email = '${email}'`;
await db.raw(query);
​```

Use parameterized queries instead:
​```typescript
const user = await db('users').where({ email }).first();
​```

Reference: SECURITY_COMPLIANCE.md §5.3
```

#### Example 2: Architecture Question

```markdown
[QUESTION] I see you chose to use a for loop here instead of the `.map()` method.

Was this a performance consideration, or would `.map()` work equally well?
I'm curious about the trade-offs you considered.

​```typescript
// Current approach
for (const item of items) {
  results.push(transform(item));
}

// Alternative with .map()
const results = items.map(item => transform(item));
​```

Happy to discuss synchronously if helpful!
```

#### Example 3: Code Quality Suggestion

```markdown
[SUGGESTION] Consider extracting this validation logic into a separate function for reusability.

This validation block appears in 3 places. Extracting it would:
- Make future updates easier (single source of truth)
- Make the code more testable
- Improve readability

​```typescript
function validateLoanAmount(amount: number) {
  if (amount <= 0) throw new ValidationError('Amount must be positive');
  if (amount > 10000000) throw new ValidationError('Amount exceeds max loan size');
  return true;
}
​```

Not blocking - up to you!
```

#### Example 4: Nitpick (Non-Blocking)

```markdown
[NIT] Consider using `const` instead of `let` for variables that aren't reassigned.

Using `const` helps prevent accidental reassignment bugs and signals intent to other developers.

​```typescript
// Current
let taxRate = 0.08;

// Suggestion
const taxRate = 0.08;
​```

Not a blocker - just a minor suggestion for consistency with our style guide.
```

#### Example 5: Praise

```markdown
[PRAISE] Nice use of `async/await` here!

This is much more readable than the promise chaining approach we had before.
Great improvement to code clarity.
```

### 7.3 Bad Feedback Examples (Avoid These)

```markdown
❌ BAD: "This is wrong"
Why it's bad: Doesn't explain what's wrong or how to fix it

✅ GOOD: "[BLOCKING] This will throw an error if project is null.
Add a null check: if (!project) throw new Error('Project not found');"

---

❌ BAD: "Why did you do it this way?"
Why it's bad: Sounds accusatory, doesn't provide guidance

✅ GOOD: "[QUESTION] I see you chose approach X. Did you consider approach Y?
I'm curious about the trade-offs."

---

❌ BAD: "Use const instead of let"
Why it's bad: Sounds like an order, doesn't explain why

✅ GOOD: "[NIT] Prefer const over let when the variable isn't reassigned.
This helps prevent bugs and signals intent."

---

❌ BAD: (no feedback, just clicking "Request Changes")
Why it's bad: Author doesn't know what to fix

✅ GOOD: Provide specific, actionable feedback with every "Request Changes"
```

### 7.4 Feedback Best Practices

**DO:**
- Be specific and actionable
- Provide examples of better alternatives
- Explain the reasoning behind suggestions
- Link to relevant documentation (style guide, security docs)
- Ask questions to understand the author's reasoning
- Praise good work when you see it

**DON'T:**
- Make personal comments ("You always do this...")
- Rewrite entire functions in comments (suggest approach instead)
- Nitpick formatting (let automated tools handle this)
- Block PRs for personal style preferences
- Assume malice or incompetence

---

## 8. How to Receive Feedback

### 8.1 As PR Author

**Remember:**
- Reviewers want to help you succeed
- Feedback is about the code, not about you
- Questions and suggestions are opportunities to learn
- You have the context; explain your reasoning

**When receiving feedback:**

1. **Assume good intent**: Reviewers are trying to help improve the code
2. **Ask clarifying questions**: If feedback is unclear, ask for examples
3. **Explain your reasoning**: If you disagree, explain your thought process
4. **Don't take it personally**: It's about code quality, not personal ability
5. **Consider the feedback seriously**: If multiple reviewers suggest the same thing, there's likely merit
6. **Mark resolved**: After addressing feedback, mark the conversation as resolved

### 8.2 Responding to Feedback

#### Example 1: Agreeing with Feedback
```markdown
**Reviewer:** [BLOCKING] This query has an N+1 problem. Consider using eager loading.

**Author:** Good catch! I didn't realize this would cause N+1 queries.
I've updated to use `.withGraphFetched('loans')` as you suggested.
Thanks for pointing this out!

✅ Resolved
```

#### Example 2: Disagreeing with Context
```markdown
**Reviewer:** [SUGGESTION] Consider using a switch statement instead of if/else chain.

**Author:** I considered this, but decided against it because:
1. We only have 3 cases today (and no plans for more)
2. The if/else makes the early returns more explicit
3. Our style guide suggests switch only for 5+ cases

Happy to discuss if you feel strongly, but I'd prefer to keep the current approach.
```

#### Example 3: Asking for Clarification
```markdown
**Reviewer:** [QUESTION] Why did you choose this approach?

**Author:** Great question! I chose this approach because:
- The alternative approach (using recursion) would hit stack limits for large datasets
- This iterative approach is more memory efficient
- Benchmark tests showed 3x performance improvement

Does that make sense, or would you like me to add a comment explaining this in the code?
```

---

## 9. Special Review Scenarios

### 9.1 Database Migrations

Migrations require extra scrutiny because errors affect the entire system.

**Extra Checks:**
- [ ] Migration is reversible (DOWN script exists and works)
- [ ] Migration tested on copy of production data (if available)
- [ ] No data loss from destructive changes (e.g., DROP COLUMN without backup)
- [ ] Indexes added for all foreign keys
- [ ] Migration is idempotent (can run multiple times safely)
- [ ] Large migrations (>1M rows) consider data size and runtime
- [ ] Reviewed by backend lead

**Example Review Comment:**
```markdown
[BLOCKING] This migration drops the `old_status` column,
but we still have references to it in v1.2 of the API.

Before merging:
1. Deploy API changes that remove `old_status` references
2. Wait 24 hours to ensure no v1.2 clients remain
3. Then run this migration

Let's coordinate the rollout plan.
```

### 9.2 API Changes

API changes affect frontend and external integrations.

**Extra Checks:**
- [ ] Backward compatible (or properly versioned)
- [ ] API documentation updated (OpenAPI/Swagger spec)
- [ ] Frontend team notified if breaking change
- [ ] Contract tests updated (if applicable)
- [ ] Migration guide provided for breaking changes
- [ ] Reviewed by tech lead if breaking change

**Example Review Comment:**
```markdown
[BLOCKING] This is a breaking change to the loans API.

Current endpoint:
GET /api/v1/loans/:id
Returns: { id, amount, status }

New endpoint:
GET /api/v1/loans/:id
Returns: { id, loan_amount, loan_status }

This will break the frontend and any external integrations.

Options:
1. Keep both field names during transition period (recommend)
   { id, amount, status, loan_amount, loan_status }
2. Create new endpoint v2 (/api/v2/loans/:id)
3. Coordinate simultaneous frontend + backend deployment

Which approach do you prefer?
```

### 9.3 Security Changes

Security changes require domain expertise review.

**Extra Checks:**
- [ ] Threat model considered (what attacks does this prevent?)
- [ ] OWASP Top 10 reviewed for relevant vulnerabilities
- [ ] Security champion consulted
- [ ] Penetration testing performed (for significant changes)
- [ ] Compliance implications considered (GLBA, SOX, etc.)
- [ ] Reviewed by security champion

**Example Review Comment:**
```markdown
[BLOCKING] This authentication change needs security champion review.

You're introducing JWT refresh tokens, which is great, but I want to ensure:
1. Refresh tokens are properly invalidated on logout
2. Refresh tokens have appropriate expiration (7 days is reasonable)
3. Refresh tokens are revoked when password changes
4. We're storing token hashes, not plaintext tokens

@security-champion can you review this?

Also, let's add this to the security section of our docs.
```

### 9.4 Performance-Critical Changes

Changes affecting performance require benchmark testing.

**Extra Checks:**
- [ ] Benchmarks run comparing before/after
- [ ] Load testing performed (if applicable)
- [ ] Database query plans reviewed (EXPLAIN ANALYZE)
- [ ] Caching strategy considered
- [ ] Monitoring/alerting updated for new performance metrics

**Example Review Comment:**
```markdown
[QUESTION] Have you run benchmarks for this optimization?

I'd like to see:
1. Before/after response times for typical payloads
2. Memory usage comparison
3. Database query plans (EXPLAIN ANALYZE)

If this saves significant time, let's add it to the release notes!
```

---

## 10. PR Size Guidelines

### 10.1 Recommended PR Sizes

| Size | Lines Changed | Review Time | Recommendation |
|------|---------------|-------------|----------------|
| **Extra Small** | < 50 lines | < 15 minutes | Ideal size |
| **Small** | 50-100 lines | 15-30 minutes | Good size |
| **Medium** | 100-500 lines | 30-60 minutes | Acceptable |
| **Large** | 500-1000 lines | 1-2 hours | Should be split |
| **Extra Large** | 1000+ lines | 2+ hours | Must be split |

**Target**: Keep PRs between 100-400 lines for optimal review quality.

### 10.2 If Your PR is Too Large

**Option 1: Break into Smaller PRs (Preferred)**
```
Large Feature: "Loan Origination Module"
  ├── PR 1: Database schema for loans table
  ├── PR 2: Loan repository and service layer
  ├── PR 3: Loan API endpoints
  ├── PR 4: Loan validation logic
  └── PR 5: Frontend loan form component
```

**Option 2: Provide Detailed Description**
If breaking up isn't feasible:
- Write comprehensive PR description explaining each section
- Add inline comments in the diff explaining key sections
- Offer to schedule synchronous review session

**Option 3: Schedule Synchronous Review**
- Video call walk-through for complex changes
- Author explains approach and reasoning
- Reviewer asks questions in real-time
- Follow-up with async review for details

### 10.3 Exceptions to Size Guidelines

These changes are often large but can't easily be broken up:

- **Generated Code**: API clients, database migrations, type definitions
- **File Moves/Renames**: Minimal logic change, mostly boilerplate
- **Initial Setup**: Project scaffolding, configuration
- **Data Migrations**: One-time scripts to transform production data
- **Dependency Updates**: Bulk updates from Dependabot

**For these exceptions:**
- Note in PR description that it's mostly generated/mechanical
- Highlight the few lines of actual logic to review
- Provide before/after summary of meaningful changes

---

## 11. Merge Strategies

### 11.1 Default Strategy: Squash and Merge

**Use "Squash and Merge" for 99% of PRs:**

**Benefits:**
- Clean, linear history on main branch
- Single commit per feature/fix
- Easier to revert if needed
- Commit message describes full change

**Commit Message Format:**
```
[TYPE](<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(loans): add payment calculator endpoint

Implemented monthly payment calculation based on principal, rate, and term.
Includes input validation, error handling, and unit tests.

- POST /api/v1/loans/:id/calculate-payment
- Validates principal > 0, rate >= 0, term > 0
- Returns monthly payment and total interest

Closes #E4-T15
```

### 11.2 When to Use Merge Commit

**Use "Create a Merge Commit" for:**
- Large feature branches with meaningful commit history you want to preserve
- Multiple developers worked on branch and commits have value
- Release branches merging to main

### 11.3 Never Use Rebase and Merge

**Don't use "Rebase and Merge":**
- Changes commit hashes, breaking references
- Loses author information in GitHub UI
- Confuses git history

### 11.4 Before Merging

**Author's pre-merge checklist:**
- [ ] All CI checks passing (green checkmarks)
- [ ] Required approvals received
- [ ] All review comments addressed and resolved
- [ ] No merge conflicts with target branch
- [ ] Final self-review of diff

**After Merging:**
- [ ] Delete feature branch (GitHub offers this automatically)
- [ ] Move linked task to "Done" in project board
- [ ] Notify team in Slack if deployment is needed

---

## 12. Review Checklist

### 12.1 Quick Review Checklist

Copy this into a comment for quick review:

```markdown
## Code Review Checklist

### Functional
- [ ] Code solves the problem described in the task
- [ ] Acceptance criteria from linked issue are met
- [ ] Edge cases handled (null, empty, error conditions)

### Quality
- [ ] Code is readable and maintainable
- [ ] No code duplication
- [ ] Functions are small and focused
- [ ] Error handling is appropriate
- [ ] Comments explain "why" not "what"

### Testing
- [ ] Unit tests added/updated
- [ ] Tests are meaningful (not just mocking everything)
- [ ] Test coverage ≥80% for new code
- [ ] Tests pass locally and in CI

### Security
- [ ] No SQL injection vulnerabilities (parameterized queries used)
- [ ] No XSS vulnerabilities (input sanitized, output encoded)
- [ ] Auth/authz checks in place for protected routes
- [ ] No secrets committed (API keys, passwords)
- [ ] Sensitive data not logged (PII redacted)

### Performance
- [ ] No N+1 query problems
- [ ] Database indexes appropriate for foreign keys
- [ ] No unnecessary computations in loops
- [ ] Large payloads paginated

### Standards
- [ ] Follows TypeScript/JavaScript style guide
- [ ] Follows React component patterns (if frontend)
- [ ] Follows API naming conventions (if backend)
- [ ] Linting passes (npm run lint)
- [ ] Documentation updated (if public API changed)

### Special Cases (if applicable)
- [ ] Database migration is reversible (up/down both work)
- [ ] Breaking API changes are versioned or backward compatible
- [ ] Security changes reviewed by security champion
- [ ] Infrastructure changes reviewed by DevOps lead
```

### 12.2 Comprehensive Review Checklist

For large or critical PRs, use this expanded checklist:

```markdown
## Comprehensive Code Review Checklist

### 1. Requirements and Design
- [ ] Linked to GitHub issue/task
- [ ] Requirements clearly stated in PR description
- [ ] Approach is reasonable and matches team conventions
- [ ] Alternative approaches considered and documented

### 2. Code Correctness
- [ ] Logic is correct
- [ ] Edge cases handled (null, undefined, empty arrays, zero, negative)
- [ ] Off-by-one errors checked (loops, array indexing)
- [ ] State transitions are valid (status changes follow rules)
- [ ] Error conditions handled gracefully

### 3. Code Quality
- [ ] Code is readable (clear variable names, logical structure)
- [ ] Functions have single, clear purpose
- [ ] No unnecessary complexity
- [ ] No code duplication
- [ ] Appropriate abstraction level
- [ ] Magic numbers replaced with named constants

### 4. Testing
- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] Tests are independent (no shared state)
- [ ] Tests are deterministic (same result every time)
- [ ] Test names clearly describe what they test
- [ ] Coverage ≥80% for new code
- [ ] Edge cases have tests
- [ ] Tests actually test functionality (not over-mocked)

### 5. Security
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (sanitize input, escape output)
- [ ] CSRF protection in place
- [ ] Authentication required for protected routes
- [ ] Authorization enforced (RBAC checks)
- [ ] Row-level security (users only see their data)
- [ ] No secrets in code or committed .env files
- [ ] Sensitive data encrypted at rest (if applicable)
- [ ] HTTPS enforced
- [ ] PII not logged or redacted

### 6. Performance
- [ ] No N+1 query problems
- [ ] Appropriate database indexes
- [ ] No unnecessary loops or computations
- [ ] Efficient algorithms used (O(n) vs O(n²))
- [ ] Large datasets paginated
- [ ] Caching used appropriately
- [ ] Database queries optimized (EXPLAIN ANALYZE if needed)

### 7. API Design (if applicable)
- [ ] RESTful conventions followed
- [ ] Consistent naming (kebab-case URLs)
- [ ] Proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- [ ] Proper status codes (200, 201, 400, 401, 403, 404, 500)
- [ ] Request validation
- [ ] Meaningful error messages
- [ ] API versioned (/api/v1/)
- [ ] Pagination for list endpoints
- [ ] OpenAPI/Swagger docs updated

### 8. Database (if applicable)
- [ ] Schema changes have migrations
- [ ] Migration has down() rollback
- [ ] Foreign keys have indexes
- [ ] Appropriate data types
- [ ] Constraints enforced (NOT NULL, UNIQUE, CHECK)
- [ ] No destructive changes without backup plan

### 9. Frontend (if applicable)
- [ ] Component structure follows conventions
- [ ] Props properly typed
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states handled
- [ ] Error states handled
- [ ] No console.log() left in code

### 10. Documentation
- [ ] PR description explains what and why
- [ ] Code comments explain complex logic
- [ ] API documentation updated
- [ ] README updated (if setup changed)
- [ ] CHANGELOG updated (if versioned)

### 11. DevOps/Infrastructure
- [ ] Environment variables documented in .env.example
- [ ] Docker configuration updated (if needed)
- [ ] CI/CD pipeline passes
- [ ] No hardcoded environment-specific values

### 12. Compliance (if applicable)
- [ ] GLBA requirements met (financial privacy)
- [ ] ECOA requirements met (fair lending)
- [ ] Audit logging for sensitive operations
- [ ] Data retention policies followed
```

---

## 13. Conflict Resolution

### 13.1 When Reviewers Disagree with Author

If a reviewer and author can't reach agreement:

**Level 1: Discussion in PR Comments** (Try this first)
- Author explains reasoning with more context
- Reviewer provides additional examples or references
- Both parties seek to understand each other's perspective

**Level 2: Synchronous Discussion** (If async stalls)
- Video call or in-person discussion
- Walk through the code together
- Discuss trade-offs of different approaches

**Level 3: Escalate to Tech Lead** (If no agreement)
- Tag tech lead in PR comments
- Both sides present their case
- Tech lead makes final decision
- **Tech lead's decision is final**

### 13.2 When Reviewers Disagree with Each Other

If two reviewers give conflicting feedback:

**Author's Action:**
- Tag both reviewers: "I'm getting conflicting feedback on this. Can you two align?"
- Don't make changes until reviewers resolve their disagreement

**Reviewers' Action:**
- Discuss in PR comments or synchronously
- Reach consensus if possible
- If can't agree, escalate to tech lead

**Tech Lead's Action:**
- Review the different perspectives
- Make final call on approach
- Document decision rationale

### 13.3 Example Escalation

```markdown
**Reviewer A:** [BLOCKING] Use approach X (switch statement)
**Reviewer B:** [BLOCKING] Use approach Y (if/else chain)

**Author:** @reviewer-a @reviewer-b I'm getting conflicting guidance here.
Can you two discuss and align on the preferred approach?

**Reviewer A:** @reviewer-b I prefer switch because it's more concise for 5+ cases.
**Reviewer B:** @reviewer-a I prefer if/else because early returns are clearer for this case.

**Tech Lead:** Thanks for the discussion. For this specific case, let's use if/else
with early returns because:
1. Only 3 cases (not 5+)
2. Early returns make control flow clearer
3. Consistent with similar code in projects module

@author please use if/else approach. @reviewer-a let's update style guide to
clarify when to use switch vs if/else.
```

---

## 14. Emergency Hotfix Process

### 14.1 When to Use Hotfix Process

Use the hotfix process for:
- **Production incidents**: Critical bugs affecting users
- **Security vulnerabilities**: Immediate threat to data or system
- **Data integrity issues**: Risk of data loss or corruption

**Do NOT use hotfix process for:**
- Non-critical bugs (use normal PR process)
- Feature requests (always use normal process)
- Improvements or optimizations (use normal process)

### 14.2 Hotfix Workflow

```
1. Create hotfix branch from main
   git checkout main
   git pull origin main
   git checkout -b hotfix/fix-authentication-bug

2. Make minimal change to fix the issue
   - Fix ONLY the immediate problem
   - Don't refactor or add features
   - Add test to prevent regression

3. Create PR with [HOTFIX] tag
   Title: [HOTFIX] Fix authentication token expiration bug

4. Request review (1 approval sufficient)
   - Tag available reviewer
   - Note: SLA is 1 hour for hotfixes

5. Deploy immediately after approval
   - Merge to main
   - Deploy to production
   - Monitor for issues

6. Follow up with full review
   - Schedule team review post-incident
   - Identify root cause
   - Plan preventive measures
```

### 14.3 Hotfix Review Checklist

Reduced checklist for speed (full review happens post-incident):

```markdown
## Hotfix Review Checklist

- [ ] Fix addresses the immediate problem
- [ ] No unrelated changes included
- [ ] Basic testing performed
- [ ] Rollback plan identified (if fix fails)
- [ ] Monitoring plan for post-deployment

Approve if above criteria met. Full review will happen post-incident.
```

### 14.4 Example Hotfix PR

```markdown
# [HOTFIX] Fix JWT token expiration causing user logouts

## Problem
Users are being logged out unexpectedly after 1 day instead of 7 days.

## Root Cause
JWT expiration was set to 1d instead of 7d due to typo in environment variable.

## Fix
Changed JWT_EXPIRATION from '1d' to '7d' in backend/.env

## Testing
- Verified tokens now expire after 7 days
- Tested login/logout flow
- Checked existing sessions remain valid

## Rollback Plan
If this causes issues:
1. Revert commit abc123
2. Redeploy previous version
3. Investigate further

## Post-Incident Actions
- [ ] Team retrospective scheduled
- [ ] Add env var validation on startup
- [ ] Add monitoring alert for unusual logout rates
```

---

## Appendix A: Quick Reference

### Comment Prefix Quick Reference

```
[BLOCKING]    - Must fix before merge
[SUGGESTION]  - Consider this (not required)
[QUESTION]    - Help me understand
[NIT]         - Minor style preference
[PRAISE]      - Good work!
```

### Review SLA Quick Reference

```
Standard PR:    Within 24 hours (next business day)
Small PR:       Within 4 hours
Hotfix:         Within 1 hour
Large PR:       Within 48 hours
```

### PR Size Quick Reference

```
< 100 lines:    1 approval
100-500 lines:  2 approvals
500+ lines:     2 approvals + tech lead
1000+ lines:    Break into smaller PRs
```

### Special Review Requirements

```
Database migrations:     Backend lead
Security changes:        Security champion
Infrastructure:          DevOps lead
Breaking API changes:    Tech lead + product
Financial calculations:  Backend lead
Compliance-related:      Legal + tech lead
```

---

## Appendix B: Further Reading

### Internal Documentation
- [TESTING_STRATEGY.md](TESTING_STRATEGY.md) - Testing requirements and standards
- [SECURITY_COMPLIANCE.md](SECURITY_COMPLIANCE.md) - Security guidelines and requirements
- [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Development setup and coding standards
- [API_SPECIFICATION.md](API_SPECIFICATION.md) - API design conventions

### External Resources
- [Google Engineering Practices: Code Review](https://google.github.io/eng-practices/review/)
- [Microsoft Code Review Guide](https://docs.microsoft.com/en-us/azure/devops/repos/git/code-reviews)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**End of Code Review Guidelines**
