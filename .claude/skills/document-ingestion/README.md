# Document Ingestion Skill

Quick reference guide for the document-ingestion skill.

## Quick Start

```bash
# Analyze a new document (safe mode - no changes)
@document-ingestion "path/to/document.pdf"

# Update documentation after reviewing analysis
@document-ingestion "path/to/document.pdf" --scope documentation

# Full ingestion with Jira task creation
@document-ingestion "path/to/document.pdf" --scope full --auto-jira
```

## What It Does

1. **Analyzes** new business documents (PDFs, DOCX, TXT, MD)
2. **Updates** project documentation (CLAUDE.md, PRD, VALUE_STREAMS.md)
3. **Flags** code areas needing implementation
4. **Creates** Jira tasks for development work (optional)
5. **Reports** comprehensive change summary

## Common Use Cases

### New Business Process Document

```bash
@document-ingestion "Updated_Value_Streams_v3_5.pdf" --type process --scope full
```

**Result:**
- VALUE_STREAMS.md updated with new processes
- PRD updated with new requirements
- Jira epic created for implementation
- Code changes flagged

### Workshop Summary

```bash
@document-ingestion "Workshop_Q1_2026.txt" --type workshop --scope documentation
```

**Result:**
- Key decisions extracted
- CLAUDE.md updated with new terminology
- PRD updated with changed priorities
- Report generated showing impacts

### Strategic Direction Update

```bash
@document-ingestion "Strategy_Update.pdf" --type strategic --scope analysis
```

**Result:**
- Analysis report showing potential impacts
- No changes made (safe mode)
- Recommendations for next steps

## File Structure

```
.claude/skills/document-ingestion/
├── SKILL.md              # Complete skill documentation
├── IMPACT_ANALYSIS.md    # Map of all project areas affected
├── README.md             # This file
├── config.yml            # Configuration (optional)
└── prompts/              # Skill prompts (if using agent architecture)
```

## Options

| Flag | Values | Description |
|------|--------|-------------|
| `--scope` | `analysis`, `documentation`, `full` | How much to do |
| `--type` | `strategic`, `process`, `technical`, `financial`, `workshop` | Document type hint |
| `--auto-jira` | (boolean) | Create Jira tasks automatically |
| `--auto-commit` | (boolean) | Commit doc changes to git |

## Safety Features

- **Analysis mode by default** - No changes without confirmation
- **Conflict detection** - Flags contradictions with existing docs
- **Human review checkpoints** - Ambiguities flagged for clarification
- **Validation** - Cross-references checked automatically

## Example Output

After running `@document-ingestion "New_Document.pdf" --scope full`:

```
✅ Document analyzed successfully
📄 3 documentation files updated
🏗️  12 code areas flagged for implementation
📋 1 Jira epic created (DP01-XXX)
📋 8 Jira stories created
⚠️  2 items flagged for human review

📊 Report saved to: docs/ingestion-reports/2026-01-05_new-document.md
```

## Documentation

- **Full Documentation:** [SKILL.md](SKILL.md)
- **Impact Analysis:** [IMPACT_ANALYSIS.md](IMPACT_ANALYSIS.md)
- **Jira Integration:** [../jira-automation/SKILL.md](../jira-automation/SKILL.md)

## Tips

1. **Always start with analysis mode** - Review before making changes
2. **Use type hints** - Helps skill understand document better
3. **Review conflicts** - Manually resolve before proceeding
4. **Check cross-references** - Skill validates but human review recommended

## Version

**Current:** v1.0
**Created:** January 5, 2026
**Status:** Active
