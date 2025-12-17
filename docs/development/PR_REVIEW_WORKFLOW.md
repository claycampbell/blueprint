# Pull Request Review Workflow

This document describes the complete workflow for handing off work between engineers during the PR review process.

## ⚠️ CRITICAL RULE: When to Mark Tasks "Done"

**Never mark a Jira task as "Done" until:**
1. ✅ Code is committed and pushed
2. ✅ PR is created and linked
3. ✅ PR has been reviewed by another engineer
4. ✅ PR has been approved
5. ✅ PR has been merged to main branch

**Work is not complete until it's merged to main and reviewed.**

## Overview

The DP01 project uses a standard Jira workflow with these key states:
- **In Progress** - Developer actively coding
- **Code Review** - PR created, awaiting review (assigned to reviewer)
- **Done** - PR approved, reviewed, and merged to main
- **Reopened** - Changes requested, returned to author

## Workflow Diagram

```
┌─────────────────┐
│  In Progress    │  Developer completes feature
│  (Clay)         │  Creates PR
└────────┬────────┘
         │
         │ scripts/handoff-for-review.py
         ├─ Transition to "Code Review"
         ├─ Assign to reviewer
         └─ Link PR URL
         │
         ▼
┌─────────────────┐
│  Code Review    │  Reviewer examines code
│  (Elrond)       │
└────────┬────────┘
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
         │ APPROVE         │ REQUEST CHANGES  │
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│      Done       │  │  In Progress    │  │   Reopened      │
│  (Merged)       │  │  (Clay)         │  │   (Clay)        │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Step-by-Step Processes

### 1. Developer Completes Work and Creates PR

**When you finish coding and are ready for review:**

1. **Commit all changes** to your feature branch
2. **Push branch to remote:**
   ```bash
   git push -u origin <branch-name>
   ```
3. **Create pull request:**
   ```bash
   gh pr create --title "..." --body "..."
   ```
4. **Hand off to reviewer:**
   ```bash
   python scripts/handoff-for-review.py DP01-157 \
     --reviewer "Elrond Sheppard" \
     --pr-url "https://github.com/org/repo/pull/123" \
     --comment "Ready for review. This implements the entity models for Phase A."
   ```

**What the script does:**
- ✅ Transitions issue to "Code Review" status
- ✅ Assigns issue to Elrond Sheppard
- ✅ Adds comment tagging reviewer with PR details
- ✅ Links PR URL to Jira issue

### 2. Reviewer Reviews the PR

**When you (Elrond) are assigned a review:**

1. **View the Jira issue** to understand context
2. **Click the linked PR** from the Jira issue
3. **Review code changes** in GitHub
4. **Run tests locally** (if needed):
   ```bash
   git fetch origin
   git checkout <branch-name>
   npm install  # or yarn install
   npm test
   ```
5. **Decide: Approve or Request Changes**

### 3a. Reviewer Approves and Merges

**If the code looks good:**

1. **Approve PR in GitHub:**
   ```bash
   gh pr review <PR-number> --approve --body "LGTM! Great work on the entity models."
   ```
2. **Merge PR:**
   ```bash
   gh pr merge <PR-number> --squash --delete-branch
   ```
3. **Complete review in Jira:**
   ```bash
   python scripts/complete-review.py DP01-157 \
     --approve \
     --merge-comment "✅ Code review complete - LGTM! Entity models are well-structured and properly typed. Merged to main."
   ```

**What the script does:**
- ✅ Adds approval comment to Jira issue
- ✅ Transitions issue to "Done" status
- ✅ Records completion in Jira history

### 3b. Reviewer Requests Changes

**If changes are needed:**

1. **Request changes in GitHub:**
   ```bash
   gh pr review <PR-number> --request-changes --body "Please address these items: ..."
   ```
2. **Return to author in Jira:**
   ```bash
   python scripts/complete-review.py DP01-157 \
     --request-changes \
     --assignee "Clay Campbell" \
     --comment "Please make these changes:\n\n1. Add validation for email format\n2. Fix typo in LoanStatus enum\n3. Add JSDoc comments to public methods"
   ```

**What the script does:**
- ✅ Adds formatted change request comment
- ✅ Transitions issue back to "In Progress"
- ✅ Reassigns issue to original author (Clay)

### 4. Developer Addresses Change Requests

**When you receive change requests:**

1. **Review the Jira comment** and GitHub review
2. **Make requested changes:**
   ```bash
   git checkout <branch-name>
   # Make changes...
   git add .
   git commit -m "fix: Address review comments"
   git push
   ```
3. **Respond to review comments** in GitHub
4. **Re-request review:**
   ```bash
   gh pr review <PR-number> --request
   ```
5. **Update Jira** (return to reviewer):
   ```bash
   python scripts/handoff-for-review.py DP01-157 \
     --reviewer "Elrond Sheppard" \
     --comment "All review comments addressed. Ready for re-review."
   ```

**Then loop back to Step 2** (Reviewer reviews again)

## Script Reference

### handoff-for-review.py

**Purpose:** Hand off completed work to another engineer for PR review

**Usage:**
```bash
python scripts/handoff-for-review.py <issue-key> \
  --reviewer <name> \
  [--pr-url <url>] \
  [--comment <text>]
```

**Arguments:**
- `issue-key` - Jira issue key (e.g., "DP01-157")
- `--reviewer, -r` - Reviewer name or email (required)
- `--pr-url, -p` - URL to the pull request (optional)
- `--comment, -c` - Custom comment text (optional)

**Example:**
```bash
python scripts/handoff-for-review.py DP01-157 \
  --reviewer "Elrond Sheppard" \
  --pr-url "https://github.com/org/repo/pull/123" \
  --comment "Phase A entity models complete. Please review when you can!"
```

### complete-review.py

**Purpose:** Complete a code review (approve or request changes)

**Usage (Approve):**
```bash
python scripts/complete-review.py <issue-key> \
  --approve \
  [--merge-comment <text>]
```

**Usage (Request Changes):**
```bash
python scripts/complete-review.py <issue-key> \
  --request-changes \
  --assignee <name> \
  --comment <text>
```

**Arguments:**
- `issue-key` - Jira issue key (e.g., "DP01-157")
- `--approve` - Approve and mark as Done
- `--merge-comment` - Optional approval comment
- `--request-changes` - Request changes and return to author
- `--assignee, -a` - Person to reassign to (required with --request-changes)
- `--comment, -c` - Change request details (required with --request-changes)

**Example (Approve):**
```bash
python scripts/complete-review.py DP01-157 \
  --approve \
  --merge-comment "LGTM! Entity models are well-designed. Merging now."
```

**Example (Request Changes):**
```bash
python scripts/complete-review.py DP01-157 \
  --request-changes \
  --assignee "Clay Campbell" \
  --comment "Please add validation for Project.startDate and update the Contact.email regex pattern."
```

## Jira Status Transitions

### Available Statuses

| Status | Purpose | Typical Assignee |
|--------|---------|------------------|
| **Backlog** | Not yet started | Unassigned |
| **In Progress** | Active development | Developer (Clay) |
| **Code Review** | PR awaiting review | Reviewer (Elrond) |
| **In Verification** | Testing phase | QA/Tester |
| **Done** | Completed and merged | Original Developer |
| **Reopened** | Changes requested | Original Developer |
| **Won't Fix** | Abandoned | N/A |

### Transition IDs

These IDs are used by the automation scripts:

- **101** - Move to Backlog
- **181** - Won't Fix
- **301** - In Progress
- **311** - Code Review ⭐
- **321** - In Verification
- **331** - Reopened
- **341** - Done ⭐

## Best Practices

### For Developers (Creating PRs)

✅ **DO:**
- Create descriptive PR titles matching the Jira issue
- Include Jira issue key in PR description
- Run tests locally before requesting review
- Keep PRs focused on a single feature/fix
- Update documentation if needed
- Use `handoff-for-review.py` to automate Jira updates

❌ **DON'T:**
- Request review before code is complete
- Mix multiple unrelated changes in one PR
- Skip running tests locally
- Forget to link the PR URL in Jira

### For Reviewers (Reviewing PRs)

✅ **DO:**
- Review within 24-48 hours when possible
- Test locally if changes are complex
- Provide specific, actionable feedback
- Approve if code meets standards (even with minor suggestions)
- Use `complete-review.py` to automate Jira updates

❌ **DON'T:**
- Request changes for trivial style preferences
- Hold up PRs for perfectionism
- Approve without actually reviewing
- Forget to update Jira status

### For Both

✅ **DO:**
- Communicate in both GitHub (code-level) and Jira (issue-level)
- Keep Jira assignee matching who currently owns the work
- Use the automation scripts to maintain consistency
- Link related issues and PRs
- Track time spent on reviews in Everhour

❌ **DON'T:**
- Leave issues assigned to yourself when blocked
- Create PRs without linking to Jira issues
- Manually update Jira when scripts are available
- Skip the workflow steps

## Common Scenarios

### Scenario 1: Simple PR - Immediate Approval

```bash
# Clay completes work
git push -u origin clay/feature
gh pr create --title "feat: Add entity models"
python scripts/handoff-for-review.py DP01-157 --reviewer "Elrond Sheppard" --pr-url "..."

# Elrond reviews (30 minutes later)
gh pr review 123 --approve --body "LGTM!"
gh pr merge 123 --squash --delete-branch
python scripts/complete-review.py DP01-157 --approve
```

**Total turnaround: ~30 minutes**

### Scenario 2: PR with Change Requests

```bash
# Clay completes work
git push -u origin clay/feature
gh pr create --title "feat: Add entity models"
python scripts/handoff-for-review.py DP01-157 --reviewer "Elrond Sheppard" --pr-url "..."

# Elrond requests changes
gh pr review 123 --request-changes --body "Please add validation..."
python scripts/complete-review.py DP01-157 --request-changes \
  --assignee "Clay Campbell" \
  --comment "Please add validation for email addresses"

# Clay addresses feedback (next day)
git checkout clay/feature
# Make changes...
git commit -m "fix: Add email validation"
git push
gh pr review 123 --request
python scripts/handoff-for-review.py DP01-157 --reviewer "Elrond Sheppard"

# Elrond approves
gh pr review 123 --approve
gh pr merge 123 --squash --delete-branch
python scripts/complete-review.py DP01-157 --approve
```

**Total turnaround: 1-2 days with changes**

### Scenario 3: Multiple Reviewers (Future)

For complex PRs requiring multiple approvals:

```bash
# Clay completes work
python scripts/handoff-for-review.py DP01-157 --reviewer "Elrond Sheppard" --pr-url "..."

# Request additional review in GitHub
gh pr review 123 --request-reviewer @senior-architect

# After all approvals, final reviewer merges
python scripts/complete-review.py DP01-157 --approve
```

## Integration with GitHub CLI

All scripts work seamlessly with the GitHub CLI (`gh`):

```bash
# View PR status
gh pr view <PR-number>

# View PR checks
gh pr checks <PR-number>

# List your PRs
gh pr list --author @me

# List PRs you're reviewing
gh pr list --search "review-requested:@me"
```

## Troubleshooting

### Issue: Script fails with "JIRA_API_TOKEN not found"

**Solution:** Set your Jira API token in `.env`:
```bash
JIRA_API_TOKEN=your_token_here
```

### Issue: Can't find reviewer by name

**Solution:** Check exact display name in Jira:
```python
from jira_automation import search_users
users = search_users("Elrond")
```

### Issue: Transition not available

**Solution:** Check available transitions for the current status:
```python
from jira_automation import get_transitions
transitions = get_transitions("DP01-157")
```

### Issue: PR link not showing in Jira

**Solution:** Manually add remote link:
```python
from jira_automation import create_remote_issue_link
create_remote_issue_link(
    issue_key="DP01-157",
    url="https://github.com/org/repo/pull/123",
    title="PR: Feature name"
)
```

## Related Documentation

- [Git Workflow and Pull Requests](../../CLAUDE.md#git-workflow-and-pull-requests)
- [Jira Integration](../../CLAUDE.md#jira-integration--project-tracking)
- [Jira Automation Skill](.claude/skills/jira-automation/SKILL.md)
- [Time Tracking](../../CLAUDE.md#time-tracking-while-working)

## Changelog

| Date | Change |
|------|--------|
| 2025-12-17 | Initial workflow documentation and automation scripts created |
