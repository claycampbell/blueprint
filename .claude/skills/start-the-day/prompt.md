# Start the Day - Developer Morning Routine

You are helping a developer start their work day efficiently. Follow this systematic approach to review yesterday's progress, check for unfinished work, analyze Jira tasks, assess team collaboration needs, understand sprint context, and create a prioritized daily plan with standup notes.

## Step 0: Yesterday's Recap & Continuity

Start by understanding what happened yesterday and overnight:

1. **Yesterday's Git Activity**:
   ```bash
   git log --author="$(git config user.email)" --since="yesterday.midnight" --until="today.midnight" --oneline
   ```
   - Count commits made yesterday
   - Identify completed features/fixes

2. **Yesterday's Jira Activity**:
   ```
   Use mcp__mcp-atlassian__jira_search with:
   - JQL: "assignee = currentUser() AND updated >= -1d AND updated < startOfDay()"
   ```
   - Track which tasks were moved to Done
   - Check tasks that were started but not completed

3. **Overnight Updates**:
   ```bash
   gh pr list --author @me --state all --limit 10
   ```
   - Check if any PRs were merged overnight
   - Look for new review comments
   - Check CI/CD status on open PRs

4. **Memory Recall**:
   If Memory Service is available:
   ```
   Use mcp__memory__recall_memory with query: "yesterday's work plan and progress"
   ```
   - Retrieve yesterday's plan to check completion
   - Note any carried-over items

## Step 1: Check Local Repository Status

First, examine the current state of the local repository for any unfinished work:

1. **Git Status Check**:
   ```bash
   git status
   git diff --stat
   git branch -vv
   ```
   - Identify uncommitted changes
   - Check current branch and its remote tracking
   - List modified files

2. **Check for Open Pull Requests**:
   ```bash
   gh pr list --author @me --state open
   ```
   - Find PRs awaiting review or needing updates
   - Check for review comments or CI failures

3. **Search for TODO Comments**:
   Use Grep to find TODO/FIXME/HACK comments in recently modified files:
   ```
   grep -n "TODO\|FIXME\|HACK" in recently modified files
   ```

4. **Check Previous Session's Todo List**:
   - Review any incomplete todos from the previous session
   - Identify work that was started but not finished

## Step 2: Analyze Jira Tasks

Connect to Jira and gather comprehensive task information:

1. **Fetch Assigned Tasks**:
   ```
   Use mcp__mcp-atlassian__jira_search with:
   - JQL: "assignee = currentUser() AND status != Done"
   - Include fields: priority, status, sprint, labels, duedate
   ```

2. **Check Current Sprint**:
   ```
   Use mcp__mcp-atlassian__jira_search with:
   - JQL: "assignee = currentUser() AND sprint in openSprints()"
   ```

3. **Identify Blockers**:
   ```
   Use mcp__mcp-atlassian__jira_search with:
   - JQL: "assignee = currentUser() AND status = Blocked"
   ```

4. **Check for Updates**:
   - Look for recently commented issues
   - Check for status changes on dependent tasks
   - Review any mentioned issues

## Step 2.5: Team Collaboration Intelligence

Analyze team collaboration needs and opportunities:

1. **PRs Needing Your Review**:
   ```bash
   gh pr list --state open --reviewer @me
   ```
   - Identify PRs waiting for your review
   - Check how long they've been waiting
   - Prioritize based on team member's blockers

2. **Team Dependencies Check**:
   ```
   Use mcp__mcp-atlassian__jira_search with:
   - JQL: "project = DP01 AND (linkedIssue in (assignee = currentUser()) OR 'blocked by' in (assignee = currentUser()))"
   ```
   - Find who is blocked by your work
   - Identify tasks you're blocked by

3. **Mentions and Comments**:
   ```
   Use mcp__mcp-atlassian__jira_search with:
   - JQL: "comment ~ currentUser() AND updated >= -2d ORDER BY updated DESC"
   ```
   - Check where you've been mentioned
   - Review questions needing your response

4. **Team Member Availability** (if possible):
   - Note any team members on PTO
   - Check for pairing opportunities
   - Identify best times for collaboration

## Step 2.6: Sprint Awareness & Context

Understand the current sprint status and your contribution:

1. **Sprint Status**:
   ```
   Use mcp__mcp-atlassian__jira_get_sprints_from_board with state: "active"
   Then use mcp__mcp-atlassian__jira_get_sprint_issues with the active sprint ID
   ```
   - Days remaining in sprint
   - Total story points completed vs remaining
   - Sprint goal and progress

2. **Sprint Burndown Analysis**:
   - Calculate your personal burndown
   - Identify if sprint is at risk
   - Check critical path items

3. **Upcoming Deadlines**:
   ```
   Use mcp__mcp-atlassian__jira_search with:
   - JQL: "assignee = currentUser() AND duedate <= 7d ORDER BY duedate ASC"
   ```
   - Tasks due this week
   - Release/feature freeze dates
   - Customer commitment dates

## Step 3: Create Prioritized Plan

Analyze all gathered information and create a structured daily plan:

### Priority Scoring Algorithm

Calculate priority score for each task based on:

1. **Jira Priority** (40% weight):
   - Highest/Blocker: 10 points
   - High/Critical: 8 points
   - Medium/Major: 5 points
   - Low/Minor: 2 points
   - Lowest/Trivial: 1 point

2. **Sprint Timing** (30% weight):
   - Due today: 10 points
   - Due this week: 7 points
   - In current sprint: 5 points
   - Backlog: 2 points

3. **Dependencies** (20% weight):
   - Blocks other tasks: 10 points
   - No dependencies: 5 points
   - Blocked by others: 0 points

4. **Work State** (10% weight):
   - In Progress: 10 points (continue started work)
   - Code Review: 8 points (quick wins)
   - Ready for Dev: 5 points
   - Backlog: 2 points

### Daily Plan Structure

Present the plan in this format:

```markdown
📊 Morning Status Report - [Current Date]
==========================================

📈 Yesterday's Progress:
------------------------
✓ Commits: [X] commits made
✓ Completed: [List of completed Jira tasks]
✓ Time Logged: [X hours in Everhour/Jira]
✓ PRs Merged: [List any merged PRs]

🔧 Unfinished Work from Previous Session:
------------------------------------------
✓ [List uncommitted changes with file counts]
✓ [Open PRs with their status]
✓ [TODO comments found in code]
✓ [Incomplete todos from yesterday]

🏃 Sprint Status:
-----------------
Sprint: [Sprint Name]
Days Remaining: [X] days
Sprint Progress: [X]% complete
Your Contribution: [X] points completed / [Y] points remaining
⚠️ Sprint Health: [On Track/At Risk/Behind]

👥 Team Collaboration Needs:
-----------------------------
🔍 PRs Awaiting Your Review: [X]
  - [PR #XXX]: [Title] (waiting [X] days)
⚖️ You're Blocking: [List tasks/people]
🚧 You're Blocked By: [List tasks/people]
💬 Mentions Requiring Response: [X]

📋 Jira Task Analysis:
----------------------
Total Assigned: [X] tasks
- In Progress: [X]
- Ready for Dev: [X]
- Code Review: [X]
- Blocked: [X]

Priority Tasks (Top 5):
1. [[PRIORITY]] [ISSUE-KEY]: [Summary] ([Status])
   - Due: [Date or "No deadline"]
   - Estimated: [Hours]
   - Notes: [Any blockers or dependencies]

2. [Continue for top 5 tasks...]

📅 Today's Recommended Work Plan:
----------------------------------
[Time] - [Time]: [Task description with issue key]
   - Specific goals: [What to accomplish]
   - Success criteria: [How to know it's done]

[Continue for 3-5 main work blocks]

⚠️ Blockers & Dependencies:
----------------------------
[List any blockers needing attention]
[Dependencies to coordinate with team]

💡 Quick Wins Available:
------------------------
[Small tasks that can be completed quickly]
[Code reviews that are waiting]

📝 Standup Notes:
-----------------
**Yesterday:**
- [Completed items from yesterday]

**Today:**
- [Top 3-5 planned items for today]

**Blockers:**
- [Any blockers or needs from team]

📋 Notes:
---------
[Any important context or reminders]
[Meeting conflicts to be aware of]
[Upcoming deadlines or milestones]
```

## Step 4: Set Up Todo Tracking

Use the TodoWrite tool to create a trackable todo list:

1. Add unfinished work items first (if any)
2. Add today's planned tasks in priority order
3. Set the first task to "in_progress"
4. Include both content and activeForm for each todo

Example:
```json
[
  {
    "content": "Complete and commit changes in clay/dp01-22-core-api branch",
    "status": "in_progress",
    "activeForm": "Completing and committing changes in clay/dp01-22-core-api branch"
  },
  {
    "content": "Finish DP01-148: LocalStack environment setup",
    "status": "pending",
    "activeForm": "Finishing DP01-148: LocalStack environment setup"
  }
]
```

## Step 5: Generate Standup Report

Create a formatted standup report for easy sharing:

### Standup Report Format

Generate both a detailed and concise version:

**Detailed Version (for written standups):**
```markdown
📊 Daily Standup - [Name] - [Date]

Yesterday:
✅ Completed DP01-148: LocalStack environment setup
✅ Merged PR #123: Docker configuration improvements
✅ Reviewed 2 PRs from team members
⏱️ Logged: 6.5 hours

Today:
🎯 DP01-149: Docker configuration (3 hrs) - Continue implementation
🎯 DP01-150: API documentation (2 hrs) - Start if DP01-149 complete
👀 Review PR #125 from teammate (30 min)
📝 Update sprint board with progress

Blockers:
🚧 Waiting on AWS credentials for S3 testing
❓ Need clarification on API rate limiting requirements

Notes:
- Sprint on track, 3 days remaining
- Will pair with [teammate] on authentication at 2pm
```

**Concise Version (for verbal standups):**
```
Yesterday: Finished LocalStack setup, merged Docker PR
Today: Continue Docker config, start API docs, review PR #125
Blockers: Need AWS credentials for S3 testing
```

### Auto-Copy Feature

Offer to copy the standup report to clipboard for easy pasting into Slack/Teams/Jira.

## Step 6: Offer to Begin Work

After presenting the plan and standup notes:

1. Ask if the developer wants to:
   - Copy standup notes to clipboard
   - Start with the recommended first task
   - Adjust the priorities
   - Add any additional context
   - Handle blockers first

2. If approved, immediately:
   - Mark the first todo as "in_progress"
   - Switch to the appropriate git branch if needed
   - Open relevant files or documentation
   - Provide next concrete steps

## Important Considerations

### Time Awareness
- Account for scheduled meetings (if mentioned by user)
- Leave buffer time for unexpected issues
- Consider review and testing time
- Factor in context switching overhead

### Team Collaboration
- Highlight tasks that need coordination
- Identify PRs from teammates needing review
- Note any blocking dependencies on others

### Technical Debt
- Include refactoring needs if time permits
- Address TODO comments when relevant
- Consider test coverage improvements

### Communication
- Be concise but comprehensive
- Use visual organization (emojis, sections)
- Highlight critical items clearly
- Provide actionable next steps

## Error Handling

If any step fails:

1. **No Jira Access**:
   - Focus on local repository work
   - Use cached/remembered task information
   - Suggest checking Jira credentials

2. **No Git Repository**:
   - Skip repository checks
   - Focus entirely on Jira planning
   - Note that git status couldn't be checked

3. **No Tasks Found**:
   - Suggest checking with team lead
   - Offer to help with technical debt
   - Propose documentation updates

## Follow-Up Actions

Throughout the day:
- Update todos as tasks complete
- Log time to Everhour when tasks finish
- Transition Jira issues appropriately
- Commit code regularly

## End-of-Day Companion

When the developer says "end the day", "wrap up", or "done for today", activate the end-of-day routine:

### Step 1: Work Status Check

1. **Check for Uncommitted Changes**:
   ```bash
   git status
   git diff --stat
   ```
   - Prompt to commit or stash changes
   - Create WIP commits if needed

2. **Review Today's Todos**:
   - Check which todos were completed
   - Note any incomplete items for tomorrow

### Step 2: Time Logging

1. **Calculate Time Worked**:
   - Sum up time on each task
   - Check if time needs logging

2. **Log to Everhour/Jira**:
   ```
   Use everhour-integration skill or Jira worklog API
   ```
   - Log time with descriptions
   - Associate with correct tasks

### Step 3: Generate End-of-Day Summary

Create a summary report:

```markdown
🌙 End of Day Summary - [Date]
================================

✅ Completed Today:
-------------------
- [ISSUE-KEY]: [Description] ([X] hours)
- [List all completed items]

📊 Progress Metrics:
--------------------
- Tasks Completed: [X]
- Story Points: [X]
- PRs Merged: [X]
- Code Reviews: [X]
- Time Logged: [X] hours

🔄 In Progress (carry over):
-----------------------------
- [ISSUE-KEY]: [Description] - [% complete]
  Next: [What needs to be done tomorrow]

🚧 Blockers Encountered:
-------------------------
- [List any blockers that came up]

📝 Handoff Notes (if applicable):
----------------------------------
- [Any important context for team/tomorrow]
- [Links to relevant PRs or documents]

💡 Tomorrow's Priority:
-----------------------
1. [Top priority for tomorrow morning]
2. [Second priority]
3. [Third priority]
```

### Step 4: Update Jira & Clean Up

1. **Update Jira Statuses**:
   - Move completed tasks to Done
   - Update progress on in-progress items
   - Add end-of-day comments where needed

2. **Clean Up Local Environment**:
   ```bash
   git stash save "EOD: Work in progress - $(date)"
   ```
   - Stash uncommitted work
   - Note branch status

### Step 5: Memory Service Update

Store today's context:
```
Use mcp__memory__store_memory to save:
- Today's completed work
- Tomorrow's priorities
- Recurring blockers
- Team dependencies
```

### Step 6: Prepare Tomorrow

1. **Set Tomorrow's Context**:
   - Note which branch to start on
   - List first task to tackle
   - Any early meetings to prepare for

2. **Create Tomorrow's Reminder**:
   ```markdown
   🌅 Tomorrow's Quick Start:
   - Branch: [branch-name]
   - First Task: [ISSUE-KEY]
   - Blockers to Check: [List]
   - Meetings: [Any early meetings]
   ```

## Memory Service Integration

If Memory Service is available:
- Store today's plan for future reference
- Save end-of-day summary for continuity
- Recall previous day's uncompleted items
- Remember recurring blockers or patterns
- Track velocity over time
- Store standup notes for future reference

## Continuous Improvement

The skill tracks patterns over time:
- Which types of tasks take longer than estimated
- Common blockers that recur
- Best times for focused work
- Team collaboration patterns
- Sprint velocity trends

This data helps improve future planning accuracy and identify process improvements.