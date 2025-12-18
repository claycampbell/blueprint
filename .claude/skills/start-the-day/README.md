# Start the Day Skill

A comprehensive morning routine skill that helps developers begin their work day efficiently by checking for unfinished work, analyzing Jira tasks, and creating a prioritized daily plan.

## Quick Start

Simply say one of these phrases to invoke the skill:
- "Let's start the day"
- "Let's start"
- "Start the day"
- "Morning routine"
- "Begin work"

Or invoke directly:
```
@start-the-day
```

## What It Does

1. **Reviews yesterday's progress** - Shows commits, completed tasks, and time logged
2. **Checks your local repository** - Finds uncommitted changes and unfinished work
3. **Analyzes team collaboration needs** - Shows PRs to review and blocking dependencies
4. **Provides sprint awareness** - Displays sprint health, remaining days, and your contribution
5. **Analyzes your Jira tasks** - Full context with priorities, deadlines, and dependencies
6. **Creates a prioritized daily plan** - Time-blocked schedule with specific goals
7. **Generates standup reports** - Ready-to-share formatted notes for daily meetings
8. **Sets up todo tracking** - Automated progress monitoring throughout the day
9. **Includes end-of-day companion** - Wrap up work, log time, and prepare for tomorrow

## Prerequisites

### Required Environment Variables

Add these to your `.env` file:

```bash
# Jira Configuration (Required)
JIRA_CLOUD_ID=your-cloud-id
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your-api-token

# Everhour Configuration (Optional - for time tracking)
EVERHOUR_API_TOKEN=your-everhour-token
```

### Required Tools

- Git (for repository status)
- GitHub CLI (`gh`) for PR checks
- Jira MCP server configured
- Claude Code with appropriate permissions

## Features

### Comprehensive Morning Status Report

The enhanced skill now provides:

- **📈 Yesterday's Progress**: Commits made, tasks completed, time logged, PRs merged
- **🔧 Unfinished Work**: Uncommitted changes, open PRs, TODO comments, incomplete todos
- **🏃 Sprint Status**: Days remaining, progress percentage, your contribution, sprint health
- **👥 Team Collaboration**: PRs to review, who you're blocking/blocked by, mentions
- **📋 Jira Task Analysis**: All assigned tasks with full context and smart prioritization
- **📅 Daily Plan**: Time-blocked schedule with specific goals and success criteria
- **⚠️ Blockers**: Items needing immediate attention or team coordination
- **💡 Quick Wins**: Small tasks for building momentum
- **📝 Standup Notes**: Pre-formatted for easy sharing in meetings

### Smart Prioritization

Tasks are prioritized using a weighted scoring system:

- **40%** - Jira priority (Blocker/Critical/Major/Minor)
- **30%** - Sprint timing (due dates and sprint deadlines)
- **20%** - Dependencies (blocks other work vs blocked)
- **10%** - Current state (in-progress work prioritized)

### Automatic Todo Creation

The skill automatically:
- Creates a todo list from your daily plan
- Marks the first task as "in_progress"
- Tracks your progress throughout the day
- Updates as you complete tasks

## Usage Example

```
User: "Let's start the day"

Claude:
📊 Morning Status Report - December 18, 2025
==========================================

🔧 Unfinished Work from Previous Session:
------------------------------------------
✓ 3 uncommitted files in branch 'clay/dp01-22-core-api'
✓ PR #123 open and awaiting review
✓ 2 TODO comments in src/api/services/

📋 Jira Task Analysis:
----------------------
Total Assigned: 5 tasks
- In Progress: 1
- Ready for Dev: 2
- Code Review: 1
- Blocked: 1

Priority Tasks (Top 5):
1. [HIGH] DP01-148: LocalStack environment setup (In Progress)
   - Due: End of sprint (2 days)
   - Estimated: 3 hours
   - Notes: Continue from Docker config

2. [HIGH] DP01-149: Docker configuration (Ready for Dev)
   - Due: End of sprint
   - Estimated: 2 hours
   - Notes: Dependency for DP01-150

[... continues with full plan ...]

✅ Todo list created with 5 tasks
Ready to start with the first task?
```

## Customization

### Modify Priority Weights

Edit the priority calculation in `prompt.md` to adjust the scoring weights:

```markdown
1. **Jira Priority** (40% weight)  # Adjust these percentages
2. **Sprint Timing** (30% weight)
3. **Dependencies** (20% weight)
4. **Work State** (10% weight)
```

### Add Custom Checks

Extend the skill by adding checks for:
- Slack messages or notifications
- Calendar meetings
- CI/CD pipeline status
- Team standup notes

### Time Tracking Integration

If Everhour is configured, the skill can:
- Show yesterday's logged time
- Estimate today's capacity
- Track actual vs estimated time
- Auto-log time as tasks complete

## End-of-Day Companion

The skill includes a complete end-of-day workflow. Simply say:
- "End the day"
- "Wrap up"
- "Done for today"

### End-of-Day Features:

1. **Work Status Check**: Prompts to commit or stash uncommitted changes
2. **Time Logging**: Automatically logs time to Everhour/Jira
3. **Summary Generation**: Creates comprehensive end-of-day report
4. **Jira Updates**: Moves completed tasks to Done, updates progress
5. **Handoff Notes**: Creates context for global teams
6. **Tomorrow's Prep**: Sets up branch, first task, and reminders

### End-of-Day Summary Format:

```
🌙 End of Day Summary
✅ Completed Today: List of finished tasks with hours
📊 Progress Metrics: Tasks, story points, PRs, reviews
🔄 In Progress: Carry-over items with next steps
🚧 Blockers: Issues encountered
📝 Handoff Notes: Context for team
💡 Tomorrow's Priority: Top 3 items
```

### Continuous Updates

The skill can be re-invoked during the day to:
- Refresh Jira status
- Update priorities based on new information
- Adjust plan based on progress
- Handle unexpected urgent tasks

## Troubleshooting

### "Cannot connect to Jira"

Check that your environment variables are set:
```bash
echo $JIRA_EMAIL
echo $JIRA_API_TOKEN
```

### "No tasks found"

Verify you're assigned tasks in Jira:
```
project = DP01 AND assignee = currentUser()
```

### "Git repository not found"

Ensure you're in a git repository:
```bash
git status
```

## Best Practices

1. **Run First Thing**: Use before starting any coding
2. **Update Regularly**: Mark todos complete as you work
3. **Commit Often**: Don't let uncommitted changes pile up
4. **Review at Lunch**: Re-run to adjust afternoon priorities
5. **End of Day**: Commit all changes and update Jira

## Contributing

To improve this skill:

1. Edit files in `.claude/skills/start-the-day/`
2. Test locally with your workflow
3. Create a PR with your improvements
4. Share with team after merge

## Version History

- **v1.0.0** (Dec 2025): Initial implementation with core features
- **v2.0.0** (Dec 2025): Major upgrade with 5 powerful enhancements:
  - ✨ Yesterday's Recap & Continuity tracking
  - ✨ Team Collaboration Intelligence
  - ✨ Sprint Awareness & Context
  - ✨ Standup Report Generation
  - ✨ End-of-Day Companion workflow
- **v2.1.0** (Planned): Add calendar integration
- **v2.2.0** (Planned): Add AI-powered insights and predictions

## Support

For issues or suggestions:
- Create an issue in the repository
- Update SKILL.md documentation
- Test changes locally first
- Share improvements via PR