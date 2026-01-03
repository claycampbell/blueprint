# Assessment Enhancements - Bugs & Time Tracking

**Date Added:** January 2, 2026
**Status:** ✅ Live in https://github.com/claycampbell/blueprint-assessment-starter

---

## Overview

Enhanced the assessment with two key features to better evaluate candidates:

1. **Controlled Bug Injection** - Realistic debugging scenarios
2. **Time Tracking Tool** - Objective progress measurement

---

## Feature 1: Assessment Mode (Hidden Bug Injection)

### Purpose
Test how candidates:
- Debug issues collaboratively with AI
- Handle realistic development problems
- Iterate on solutions
- Stay resilient under pressure

### Implementation

**File:** `.claude/ASSESSMENT_MODE.md` (in assessment repo)

**How it works:**
1. Claude Code reads CLAUDE.md on startup
2. CLAUDE.md references hidden ASSESSMENT_MODE.md instructions
3. Claude follows bug injection protocol automatically
4. Candidate experiences realistic debugging scenarios
5. Bugs feel natural, not artificial

### Bug Types (2-3 injected per assessment)

| Bug Type | Difficulty | Time to Fix | Example |
|----------|-----------|-------------|---------|
| Type Error | Easy | 5-10 min | `createdDate: Date` returned instead of `string` |
| Async Issue | Medium | 10-15 min | Missing `await` on async function |
| State Problem | Medium | 15-20 min | Infinite render loop (missing deps) |
| Filter Logic | Easy-Medium | 10-15 min | Case-sensitive search (should be insensitive) |
| Error Handling | Easy | 5-10 min | No try/catch, app crashes |

### Injection Strategy

**First iteration:** Clean, working code ✅
**Second/third iteration:** Introduce 1-2 bugs 🐛
**After bug fixed:** Clean code again ✅

**Why:** Build trust first, then introduce realistic challenge

### Difficulty Calibration

**If candidate struggling (>30 min on one bug):**
- Reduce to easy bugs only
- Provide hints
- Focus on learning

**If candidate excelling:**
- Add more complex bugs
- Combine multiple bugs
- Test edge cases

### Evaluation Focus

**What we measure:**
- ✅ Debugging skills (error messages, console, TypeScript)
- ✅ AI collaboration (iteration, questions, verification)
- ✅ Problem-solving (approaches, adaptability)
- ✅ Resilience (staying focused vs. frustration)

**What we DON'T measure:**
- ❌ Perfect code first try
- ❌ Speed over quality
- ❌ Memorized patterns

### Red Flags 🚩
- Gives up quickly
- Blames the AI
- No testing/debugging
- External code copying (Stack Overflow patterns)

### Green Flags ✅
- Systematic debugging
- Good questions
- Tests iteratively
- Learns from mistakes
- Self-aware about gaps

---

## Feature 2: Time Tracking Script

### Purpose
- Objective measurement of assessment duration
- Insight into candidate's workflow
- Data for reflection document
- Verify 1-2 hour time limit

### Implementation

**File:** `starter-kit/track-time.js`

**Usage:**
```bash
node track-time.js start      # Start timer
node track-time.js milestone  # Mark checkpoint
node track-time.js status     # Check progress
node track-time.js stop       # Generate summary
```

### Features

**Milestones:**
- Setup complete
- Types defined
- API service implemented
- Component created
- Search working
- Debounce added
- Tests written
- All tests passing
- Documentation complete

**Output Format:**
```
Total Time: ~90 minutes

Breakdown:
- Setup → Types defined: 15m 0s
- Types defined → API service implemented: 20m 0s
- API service → Component created: 18m 30s
- Component → Search working: 12m 15s
- Search working → Tests written: 15m 45s
- Tests written → Documentation complete: 9m 0s
```

### Integration with Claude Code

Claude Code also tracks time internally and provides summary at the end:

```
"Based on our interaction, here's the time breakdown:
- Setup & types: 15 min
- API service: 20 min (including debugging type error)
- Component: 25 min
- Tests: 18 min
- Documentation: 12 min
Total: ~90 minutes"
```

### Time Tracking Data

**Stored in:** `starter-kit/.assessment-time.json` (git-ignored)

**Format:**
```json
{
  "startTime": 1704225600000,
  "milestones": [
    {
      "name": "Types defined",
      "timestamp": 1704226500000,
      "elapsed": 900000
    }
  ],
  "endTime": 1704231000000
}
```

---

## How Interviewer Uses This

### Before Assessment
1. Verify `.claude/ASSESSMENT_MODE.md` exists in repo
2. Confirm time tracker works: `node starter-kit/track-time.js start`
3. Remind candidate to use tracker (optional)

### During Assessment
- Monitor for technical issues only
- Let Claude Code handle bug injection
- Don't intervene in debugging

### After Assessment

**Review:**
1. **Time data** - How long did it actually take?
2. **Git history** - How many debugging commits?
3. **Claude logs** - What bugs were encountered?
4. **Reflection doc** - Did they mention bugs/debugging?

**Look for alignment:**
- Did they track time accurately?
- Did they document debugging challenges?
- Were they aware of their struggles?
- Did they learn from mistakes?

---

## Example Assessment Flow

**0:00** - Candidate starts, runs `node track-time.js start`

**0:15** - Types defined, marks milestone ✅

**0:30** - API service created with **Bug #1** (type error) 🐛

**0:40** - Candidate notices TypeScript error, asks Claude

**0:45** - Bug fixed, marks milestone ✅

**1:00** - Component created, search working ✅

**1:15** - Adds debounce with **Bug #2** (missing await) 🐛

**1:25** - Notices results not showing, checks console

**1:30** - Bug fixed, marks milestone ✅

**1:45** - Tests written and passing ✅

**1:55** - Documentation complete, runs `node track-time.js stop`

**Total:** 115 minutes with 2 bugs encountered

---

## Security & Confidentiality

**Files NOT visible to candidates:**
- `.claude/ASSESSMENT_MODE.md` - Hidden instructions
- `.assessment-time.json` - In `.gitignore`

**Files visible to candidates:**
- `.claude/README.md` - Generic "Claude Code configuration"
- `track-time.js` - Optional tool they can use
- Updated `INSTRUCTIONS.md` - Mentions time tracker

**Candidates see:**
- Normal AI pair programming experience
- Realistic bugs (not obviously planted)
- Optional time tracking tool
- Standard assessment instructions

**Candidates don't see:**
- Bug injection protocol
- Evaluation criteria
- Red/green flags
- Hidden observables

---

## Benefits

### For Evaluation
- **Objective data** on problem-solving process
- **Realistic scenarios** vs. perfect code generation
- **Insight into collaboration** style with AI
- **Time accuracy** removes estimation bias

### For Candidates
- **Fair assessment** of real-world skills
- **Authentic experience** of AI pair programming
- **Time awareness** to stay within 2-hour limit
- **Learning experience** even if they don't pass

### For Interviewers
- **Data-driven decisions** vs. subjective impressions
- **Comparable metrics** across candidates
- **Concrete examples** for feedback
- **Efficient reviews** with time breakdowns

---

## Maintenance

### Updating Bug Types

Edit `.claude/ASSESSMENT_MODE.md` in assessment repo:
```bash
cd blueprint-assessment-starter
# Edit .claude/ASSESSMENT_MODE.md
git add .claude/ASSESSMENT_MODE.md
git commit -m "Update bug injection strategy"
git push origin main
```

### Adjusting Difficulty

Calibrate based on candidate outcomes:
- **Too easy** → Add more complex bugs
- **Too hard** → Reduce to type errors only
- **Too long** → Decrease bug count to 1-2

### Time Tracking Improvements

Current limitations:
- Relies on candidate using the script
- Can forget to mark milestones
- Manual input required

**Future enhancements:**
- Git commit timestamp analysis
- Automated milestone detection
- Integration with Claude Code logs

---

## Success Metrics

**Track over time:**
- Average assessment duration
- Bug resolution times
- Percentage using time tracker
- Correlation: time tracking usage → hire rate
- Most common bugs encountered

**Target metrics:**
- 80%+ candidates complete in 90-150 minutes
- 90%+ identify and fix bugs
- 70%+ use time tracker
- Bug resolution < 20 minutes each

---

## Files Created

**In assessment repo:**
```
.claude/
├── ASSESSMENT_MODE.md          # Hidden bug injection instructions
└── README.md                   # Public explanation

starter-kit/
└── track-time.js               # Time tracking CLI tool

CLAUDE.md                       # Updated with assessment mode ref
.gitignore                      # Excludes .assessment-time.json
docs/assessment/INSTRUCTIONS.md # Updated with time tracker usage
```

**In main blueprint repo:**
```
docs/assessment/
└── ASSESSMENT_ENHANCEMENTS.md  # This document
```

---

## Related Documents

- [ASSESSMENT_MODE.md](.claude/ASSESSMENT_MODE.md) - Full bug injection protocol (in assessment repo)
- [INSTRUCTIONS.md](INSTRUCTIONS.md) - Candidate-facing instructions
- [EVALUATION_RUBRIC.md](EVALUATION_RUBRIC.md) - Scoring criteria
- [REPOSITORY_CREATED.md](REPOSITORY_CREATED.md) - Initial setup docs

---

**Created:** January 2, 2026
**Repository:** https://github.com/claycampbell/blueprint-assessment-starter
**Status:** ✅ Live and Ready
