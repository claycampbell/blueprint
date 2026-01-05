# Claude Code API Key Setup Instructions

**For Assessment Candidates**

---

## Your API Key

```
ANTHROPIC_API_KEY=sk-ant-api03-[YOUR_KEY_WILL_BE_HERE]
```

**Important:**
- This key is for assessment use only (1-2 hours)
- Budget limit: $20 (more than enough for the assessment)
- Key expires: 48 hours after your scheduled start time
- Do not share this key with anyone

---

## Setup Instructions

### Option 1: Environment Variable (Recommended)

**macOS/Linux:**
```bash
export ANTHROPIC_API_KEY="sk-ant-api03-[YOUR_KEY]"
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-api03-[YOUR_KEY]"
```

**Windows (Command Prompt):**
```cmd
set ANTHROPIC_API_KEY=sk-ant-api03-[YOUR_KEY]
```

Then start Claude Code:
```bash
claude-code
```

### Option 2: Claude Code Settings

1. Open Claude Code
2. Go to Settings (or press `Cmd/Ctrl + ,`)
3. Navigate to "API Keys"
4. Add your Anthropic API key
5. Save and restart Claude Code

### Option 3: VS Code Extension

If using the Claude Code VS Code extension:

1. Open VS Code Settings
2. Search for "Claude Code"
3. Find "Anthropic API Key"
4. Paste your key
5. Reload VS Code

---

## Verification

Test that the API key works:

1. Start Claude Code
2. Try a simple prompt: "Hello, can you help me with a coding task?"
3. If it responds, you're all set!

If you get an error like "Invalid API key" or "Authentication failed":
- Double-check you copied the entire key (starts with `sk-ant-api03-`)
- Make sure there are no extra spaces
- Email me immediately: clay@datapage.com

---

## During the Assessment

Keep the terminal/shell where you set the environment variable **open** throughout the assessment. If you close it, you'll need to set the variable again.

**Quick reference:**
```bash
# Check if key is set (macOS/Linux)
echo $ANTHROPIC_API_KEY

# Check if key is set (Windows PowerShell)
echo $env:ANTHROPIC_API_KEY
```

---

## After the Assessment

The API key will automatically expire 48 hours after your start time. No action needed on your part.

---

## Troubleshooting

### "API key not found" error
- Solution: Set the environment variable in your current terminal session

### "Rate limit exceeded" error
- Solution: Wait 60 seconds and try again (unlikely during assessment)

### "Invalid API key" error
- Solution: Email me immediately for a replacement key

### Claude Code won't start
- Solution: Try running `claude-code --version` to verify installation
- Email me if issues persist: clay@datapage.com

---

**Questions?** Email clay@datapage.com before starting the assessment.

**Ready to begin?** Follow the assessment instructions in the repository:
`docs/assessment/INSTRUCTIONS.md`

Good luck! 🚀
