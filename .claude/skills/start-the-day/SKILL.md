# Start the Day Skill

A comprehensive morning routine skill for developers that checks for unfinished work, analyzes Jira tasks, and creates a prioritized daily plan.

## Description

This skill automates the developer's morning routine by:
1. Checking for uncommitted changes and unfinished code in the local repository
2. Identifying any incomplete tasks or TODO items from the previous session
3. Connecting to Jira to fetch assigned tasks and stories
4. Analyzing task priorities, dependencies, and deadlines
5. Creating a prioritized work plan for the day
6. Setting up the todo list for tracking progress

## Usage

Invoke this skill by saying:
- "Let's start the day"
- "Let's start"
- "Start the day"
- "Morning routine"
- "Begin work"

Or use the skill directly:
```
@start-the-day
```

## Features

### 1. Yesterday's Recap & Continuity
- Reviews yesterday's git commits and completed tasks
- Checks overnight PR merges and review comments
- Tracks yesterday's time logged in Everhour/Jira
- Identifies carried-over work from previous session
- Retrieves yesterday's plan from Memory Service

### 2. Local Repository Check
- Detects uncommitted changes
- Identifies work-in-progress branches
- Finds unmerged pull requests
- Locates TODO comments in code
- Checks CI/CD status on open PRs

### 3. Team Collaboration Intelligence
- Identifies PRs awaiting your review
- Shows who's blocked by your work
- Finds mentions and comments needing response
- Checks team member availability
- Highlights pairing opportunities

### 4. Sprint Awareness & Context
- Shows days remaining in current sprint
- Calculates sprint progress and health
- Tracks your personal sprint contribution
- Identifies upcoming deadlines and releases
- Monitors sprint burndown and velocity

### 5. Advanced Jira Integration
- Fetches all assigned tasks with full context
- Analyzes task priorities, dependencies, and due dates
- Checks for blockers and impediments
- Reviews recently commented issues
- Tracks sprint-specific items

### 6. Smart Daily Planning
- Creates prioritized task list using weighted scoring
- Considers Jira priority, sprint timing, dependencies, and state
- Generates time-blocked schedule with specific goals
- Identifies quick wins and blockers
- Sets up automated todo tracking

### 7. Standup Report Generation
- Creates formatted standup notes (detailed and concise versions)
- Includes yesterday's accomplishments and today's plan
- Highlights blockers and dependencies
- Ready to copy/paste to Slack, Teams, or Jira
- Tracks sprint context and team needs

### 8. End-of-Day Companion
- Checks for uncommitted work and prompts for commits
- Generates comprehensive end-of-day summary
- Logs time to Everhour/Jira automatically
- Updates Jira statuses and adds comments
- Creates handoff notes for global teams
- Prepares context for tomorrow's start
- Stores today's progress in Memory Service

### 9. Context Awareness & Memory
- Stores and retrieves daily plans via Memory Service
- Tracks patterns and recurring blockers
- Monitors velocity and estimation accuracy
- Remembers team collaboration patterns
- Provides continuous improvement insights

## Configuration

The skill uses the following environment variables:
- `JIRA_CLOUD_ID`: Your Atlassian cloud instance ID
- `JIRA_EMAIL`: Your Jira email address
- `JIRA_API_TOKEN`: Your Jira API token
- `EVERHOUR_API_TOKEN`: For time tracking integration (optional)

## Output

The skill provides a comprehensive morning report with:
1. **Yesterday's Progress**: Commits, completed tasks, time logged, merged PRs
2. **Unfinished Work Summary**: Uncommitted changes, open PRs, TODO items
3. **Sprint Status**: Days remaining, progress percentage, sprint health
4. **Team Collaboration Needs**: PRs to review, blocking/blocked tasks, mentions
5. **Jira Task Analysis**: Prioritized list with full context
6. **Daily Plan**: Time-blocked schedule with specific goals
7. **Standup Report**: Ready-to-share formatted notes
8. **Todo List**: Automatically populated and tracked
9. **Blockers/Dependencies**: Items needing immediate attention

## Integration Points

- **Git**: Repository status and branch information
- **Jira**: Task management and sprint tracking
- **Everhour**: Time tracking (optional)
- **Memory Service**: Context persistence
- **Todo System**: Progress tracking

## Example Workflow

```
User: "Let's start the day"

Skill Response:
📊 Morning Status Report - December 18, 2025
==========================================

📈 Yesterday's Progress:
------------------------
✓ Commits: 5 commits made
✓ Completed: DP01-147 (Database migrations), DP01-146 (API endpoints)
✓ Time Logged: 7.5 hours in Everhour
✓ PRs Merged: PR #122 (Authentication flow)

🔧 Unfinished Work from Previous Session:
------------------------------------------
✓ 3 uncommitted files in branch 'clay/dp01-22-core-api'
✓ PR #123 open - awaiting review (2 days old)
✓ 2 TODO comments in src/api/services/
✓ 1 incomplete todo from yesterday: "Add error handling"

🏃 Sprint Status:
-----------------
Sprint: Sprint 15 - Core Platform
Days Remaining: 3 days
Sprint Progress: 68% complete
Your Contribution: 8 points completed / 5 points remaining
⚠️ Sprint Health: On Track

👥 Team Collaboration Needs:
-----------------------------
🔍 PRs Awaiting Your Review: 2
  - PR #125: "Fix authentication bug" (waiting 1 day)
  - PR #126: "Update documentation" (waiting 3 hours)
⚖️ You're Blocking: Sarah on DP01-155 (API specs needed)
🚧 You're Blocked By: DevOps team on AWS credentials
💬 Mentions Requiring Response: 2 comments in DP01-150

📋 Jira Task Analysis:
----------------------
Total Assigned: 5 tasks
- In Progress: 1
- Ready for Dev: 2
- Code Review: 1
- Blocked: 1

Priority Tasks (Top 5):
1. [HIGH] DP01-148: LocalStack environment setup (In Progress)
   - Due: End of sprint (3 days)
   - Estimated: 3 hours remaining
   - Notes: Continue from Docker config

2. [HIGH] DP01-149: Docker configuration (Ready for Dev)
   - Due: End of sprint
   - Estimated: 4 hours
   - Notes: Unblocks DP01-150

3. [MED] PR #125: Review authentication bug fix (Code Review)
   - Due: ASAP (blocking teammate)
   - Estimated: 30 minutes
   - Notes: Sarah is blocked

📅 Today's Recommended Work Plan:
----------------------------------
9:00 - 9:30: Review PR #125 (unblock Sarah)
   - Specific goals: Test auth flow, verify fix
   - Success criteria: PR approved or feedback provided

9:30 - 12:00: Complete DP01-148 LocalStack setup
   - Specific goals: Finish Docker config, test S3 integration
   - Success criteria: All services running locally

1:00 - 5:00: Start DP01-149 Docker configuration
   - Specific goals: Set up compose file, configure networks
   - Success criteria: Basic services configured

⚠️ Blockers & Dependencies:
----------------------------
- Need AWS credentials for S3 testing
- Sarah blocked on API specs (provide by noon)

💡 Quick Wins Available:
------------------------
- PR #126 review (15 min)
- Fix TODO comments (20 min)

📝 Standup Notes:
-----------------
Yesterday:
- Completed database migrations (DP01-147)
- Finished API endpoints (DP01-146)
- Merged authentication flow PR

Today:
- Review PR #125 to unblock Sarah
- Complete LocalStack setup (DP01-148)
- Start Docker configuration (DP01-149)

Blockers:
- Need AWS credentials from DevOps

✅ Todo list created with 6 tasks
Ready to begin? Would you like me to copy the standup notes?
```

## Advanced Features

### Smart Prioritization
- Considers sprint deadlines
- Weighs technical dependencies
- Accounts for review cycles
- Factors in team availability

### Continuous Updates
- Refreshes Jira status periodically
- Updates todo list in real-time
- Tracks actual vs estimated time
- Adjusts plan based on progress

### End-of-Day Summary
Companion feature that:
- Summarizes completed work
- Logs time to Everhour/Jira
- Creates handoff notes
- Prepares next day's context

## Error Handling

The skill gracefully handles:
- Missing Jira credentials
- Offline repository state
- Empty task lists
- Network connectivity issues

Falls back to local-only planning when external services are unavailable.

## Best Practices

1. **Run at session start**: Use before beginning any new work
2. **Update throughout day**: Mark todos complete as you work
3. **End-of-day wrap**: Commit changes before ending session
4. **Weekly review**: Check for stale tasks or tech debt
5. **Team sync**: Share blockers identified during planning

## Related Skills

- `@jira-automation`: Direct Jira manipulation
- `@everhour-integration`: Time tracking
- `/commit`: Streamlined git commits
- `/pr`: Pull request creation

## Version History

- v1.0.0: Initial implementation with core features
- v1.1.0: Added Memory Service integration
- v1.2.0: Enhanced prioritization algorithm
- v2.0.0: Major upgrade with 5 new features:
  - Yesterday's Recap & Continuity tracking
  - Team Collaboration Intelligence
  - Sprint Awareness & Context
  - Standup Report Generation
  - End-of-Day Companion workflow

## Support

For issues or improvements:
- Create issue in `.claude/skills/start-the-day/`
- Update via PR to share with team
- Test locally before committing