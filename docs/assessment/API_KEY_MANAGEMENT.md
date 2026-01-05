# API Key Management for Assessments

**Internal Guide for Assessment Coordinators**

---

## Overview

We provide temporary Anthropic API keys to assessment candidates to use Claude Code without requiring them to have a paid subscription.

**Cost per assessment:** $2-8 (typical usage for 1-2 hours)
**Setup time:** 5 minutes per candidate
**Security:** Keys expire automatically, budget-limited

---

## Setting Up a New API Key

### Step 1: Create Key in Anthropic Console

1. Log in to https://console.anthropic.com
2. Navigate to "API Keys"
3. Click "Create Key"
4. Name it: `Assessment - [Candidate Name] - [Date]`
   - Example: `Assessment - Raul Diaz - Jan 9 2026`

### Step 2: Set Budget Limit

1. Click on the newly created key
2. Set "Monthly Spend Limit": **$20**
3. Enable "Require approval for overages": **Yes**
4. Save settings

### Step 3: Set Expiration

1. In key settings, set "Expires": **48 hours from scheduled start time**
   - Example: If assessment starts Jan 9 at 2pm, set expiration to Jan 11 at 2pm
2. Save settings

### Step 4: Copy Key

Copy the full API key (starts with `sk-ant-api03-...`)

**⚠️ Security:** The key is only shown once. If you lose it, create a new one.

---

## Sending Key to Candidate

### Timing
Send **24 hours before** scheduled assessment start time

### Email Template

```
Subject: Claude Code API Key - Assessment Access

Hi [Candidate Name],

You're all set for your assessment tomorrow at [TIME]!

Here's your Claude Code API key for the assessment:

ANTHROPIC_API_KEY=sk-ant-api03-[ACTUAL_KEY_HERE]

Setup instructions are attached. The key:
- Is for assessment use only (1-2 hours)
- Has a $20 budget limit (plenty for the assessment)
- Expires in 48 hours
- Should not be shared

Setup takes 2 minutes - just set an environment variable before starting Claude Code.

GitHub Repository Access:
- You should have received an invitation to: https://github.com/claycampbell/blueprint-assessment-starter
- Accept the invitation and you're ready to go!

If you have any issues with the API key or repository access, email me immediately.

See you tomorrow!

Best,
Clay Campbell
clay@datapage.com

---
Attachment: API_KEY_SETUP_INSTRUCTIONS.md
```

---

## Tracking Active Keys

### Spreadsheet Template

| Candidate Name | Assessment Date | Key Name | Budget Limit | Expires | Actual Cost | Status |
|----------------|-----------------|----------|--------------|---------|-------------|--------|
| Raul Diaz | Jan 9, 2026 2pm | Assessment - Raul Diaz - Jan 9 2026 | $20 | Jan 11, 2pm | $4.32 | Completed |
| Jane Smith | Jan 15, 2026 10am | Assessment - Jane Smith - Jan 15 2026 | $20 | Jan 17, 10am | - | Active |

### Status Definitions
- **Pending**: Key created, not yet sent to candidate
- **Active**: Key sent, assessment in progress or upcoming
- **Completed**: Assessment finished, key expired or deleted
- **Cancelled**: Assessment cancelled, key deleted early

---

## After the Assessment

### Immediate (within 24 hours)
1. Check actual usage in Anthropic Console
2. Record cost in tracking spreadsheet
3. Key will auto-expire (no action needed)

### Optional: Early Deletion
If assessment is cancelled or completed early:
1. Go to Anthropic Console → API Keys
2. Find the key
3. Click "Delete"
4. Confirm deletion

---

## Cost Monitoring

### Expected Usage Patterns

**Typical Assessment (1-2 hours):**
- 50-150 AI requests
- Total tokens: 100K-300K
- **Cost: $2-8**

**Heavy Usage (worst case):**
- 200+ AI requests
- Total tokens: 500K+
- **Cost: $10-15**

**If cost exceeds $20:** Budget limit prevents further usage, candidate will get an error. Rare but possible if they:
- Run very long sessions (3+ hours)
- Generate massive amounts of code
- Use extended context windows repeatedly

### Monthly Budget Planning

**10 assessments/month:**
- Average cost: $5/assessment
- Total: **$50/month**

**25 assessments/month:**
- Average cost: $5/assessment
- Total: **$125/month**

Compare to Pro subscription alternative:
- $20/month per candidate = $500/month for 25 candidates
- **API keys save ~$375/month** at 25 assessments

---

## Security Best Practices

### ✅ DO:
- Create new key for each candidate
- Set budget limits ($20 max)
- Set expiration (48 hours)
- Send via email (reasonably secure for temporary keys)
- Track all active keys
- Delete keys after assessment if desired

### ❌ DON'T:
- Reuse keys across candidates
- Create keys without budget limits
- Create keys without expiration
- Share keys in public channels (Slack, etc.)
- Leave expired keys active indefinitely

---

## Troubleshooting

### Candidate Reports "Invalid API key"
**Possible causes:**
1. Key was copied incorrectly (missing characters)
2. Key expired early (check expiration date)
3. Key was deleted accidentally

**Solution:**
1. Verify key exists in Anthropic Console
2. Check expiration date
3. If needed, create new key and resend

### Candidate Reports "Rate limit exceeded"
**Cause:** Making too many requests too quickly (rare)

**Solution:**
1. Wait 60 seconds and retry
2. If persistent, increase rate limits in console (unlikely needed)

### Candidate Reports "Budget exceeded"
**Cause:** Unusual heavy usage hit $20 limit

**Solution:**
1. Check actual usage in console
2. If legitimate (not abuse), increase budget to $30
3. Investigate if usage seems excessive

### Key Compromised or Shared
**Action:**
1. Delete key immediately in Anthropic Console
2. Create new key
3. Resend to candidate
4. Document incident

---

## Audit Trail

Keep records of:
- All keys created (name, date, candidate)
- Actual usage costs per assessment
- Any security incidents
- Budget adjustments made

**Recommended:** Monthly review of all API keys to ensure no orphaned keys remain active.

---

## Alternative: Shared Assessment Account

If managing individual keys becomes burdensome:

**Option:** Single Claude Pro account ($20/month)
- Username: assessment@datapage.com
- Share credentials with candidates during assessment window
- Change password after each assessment
- **Pros:** Simpler management, fixed cost
- **Cons:** Less secure, candidates share account, no cost tracking per candidate

Currently, API keys are recommended for better security and cost transparency.

---

**Document Owner:** Clay Campbell
**Last Updated:** January 4, 2026
**Next Review:** After 10 assessments completed
