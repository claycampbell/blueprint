# Pre-Commit Hooks Configuration

This document describes the automated pre-commit hooks configured for the Connect 2.0 project. These hooks automatically run linting, formatting, type checking, and tests before every commit to ensure code quality.

## Overview

The pre-commit hooks are **automatically triggered** by Claude Code when running `git commit`. No manual setup is required for Claude Code users.

## What Gets Checked

Every commit triggers the following checks (in order):

###1. **Ruff Linter** (Auto-fix enabled)
   - Checks Python code for style violations
   - Replaces: flake8, isort, pyupgrade, and 20+ other linters
   - Automatically fixes fixable issues
   - Configuration: `pyproject.toml` → `[tool.ruff.lint]`

### 2. **Ruff Formatter** (Auto-format)
   - Formats Python code consistently
   - Replaces: black
   - Line length: 100 characters
   - Configuration: `pyproject.toml` → `[tool.ruff.format]`

### 3. **MyPy Type Checker** (Warning only)
   - Static type checking for Python
   - Non-blocking (warnings only)
   - Configuration: `pyproject.toml` → `[tool.mypy]`

### 4. **Pytest Test Runner** (Blocking)
   - Runs all unit tests in `tests/` and `scripts/`
   - **Blocks commit if tests fail**
   - Stops after first failure (`--maxfail=1`)
   - Configuration: `pyproject.toml` → `[tool.pytest.ini_options]`

## How It Works

### For Claude Code Users (Automatic)

The pre-commit hook is **automatically configured** in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit*)",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/pre-commit.sh",
            "statusMessage": "Running pre-commit checks (Ruff, pytest)..."
          }
        ]
      }
    ]
  }
}
```

**What happens when you commit:**
1. Claude Code intercepts the `git commit` command
2. Runs `.claude/hooks/pre-commit.sh` automatically
3. Shows progress spinner: "Running pre-commit checks (Ruff, pytest)..."
4. If all checks pass → Commit proceeds
5. If checks fail → Commit is blocked with error details

### Manual Execution (Without Committing)

Test the pre-commit hooks without making a commit:

```bash
# Run all checks manually
.claude/hooks/pre-commit.sh

# Or run individual tools
ruff check . --fix           # Lint and auto-fix
ruff format .                # Format code
python -m mypy scripts/      # Type check
python -m pytest tests/      # Run tests
```

## Configuration Files

### `pyproject.toml`
Main configuration file for all Python tools:

```toml
[tool.ruff]
line-length = 100
target-version = "py39"

[tool.ruff.lint]
select = ["E", "W", "F", "I", "N", "UP", "B", "C4", ...]
ignore = ["E501", "TRY003", "PLR0913", ...]

[tool.pytest.ini_options]
testpaths = ["tests", "scripts"]
addopts = ["-v", "--tb=short", "--maxfail=3"]
```

### `.pre-commit-config.yaml`
Standard pre-commit framework configuration (for CI/CD):

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.9
    hooks:
      - id: ruff
      - id: ruff-format

  - repo: local
    hooks:
      - id: pytest-check
        name: Run pytest
        entry: pytest
        language: system
```

### `.claude/hooks/pre-commit.sh`
The actual hook script executed by Claude Code:
- Checks only Python files in commit (`*.py`)
- Runs Ruff linter + formatter
- Runs MyPy type checker (non-blocking)
- Runs pytest tests (blocking)
- Re-stages formatted files automatically

## What Gets Linted

### Enabled Rule Sets (Ruff)

| Code | Rules | Description |
|------|-------|-------------|
| E, W | pycodestyle | PEP 8 style errors and warnings |
| F | pyflakes | Logical errors (unused imports, undefined vars) |
| I | isort | Import sorting |
| N | pep8-naming | Naming conventions |
| UP | pyupgrade | Python version upgrade suggestions |
| B | bugbear | Common bugs and design problems |
| C4 | comprehensions | List/dict comprehension improvements |
| SIM | simplify | Code simplification suggestions |
| RUF | ruff | Ruff-specific rules |

Full list: See `pyproject.toml` → `[tool.ruff.lint.select]`

### Ignored Rules

```toml
ignore = [
    "E501",    # Line too long (handled by formatter)
    "TRY003",  # Avoid specifying long messages outside exception class
    "PLR0913", # Too many arguments to function call
]
```

## Test Configuration

### Test Discovery

pytest automatically finds and runs:
- Files: `test_*.py` or `*_test.py`
- Classes: `Test*`
- Functions: `test_*`
- Directories: `tests/`, `scripts/`

### Test Markers

Organize tests with markers:

```python
@pytest.mark.unit
def test_add():
    assert add(1, 2) == 3

@pytest.mark.integration
def test_database_connection():
    db = connect_to_postgres()
    assert db.is_connected()

@pytest.mark.slow
def test_full_workflow():
    # Long-running test
    pass
```

Run specific markers:
```bash
pytest -m unit              # Only unit tests
pytest -m "not slow"        # Skip slow tests
pytest -m "unit or integration"  # Multiple markers
```

## Bypassing Hooks (Not Recommended)

If you absolutely need to bypass pre-commit hooks:

```bash
# Bypass Claude Code hooks (NOT RECOMMENDED)
git commit --no-verify -m "Emergency fix"

# Or manually commit without Claude Code
git commit -m "..."
```

**Warning:** Bypassing hooks can introduce code quality issues and break CI/CD pipelines.

## Troubleshooting

### Hook Doesn't Run

**Problem:** Commit succeeds without running checks

**Solution:**
1. Verify `.claude/settings.json` has hooks configuration
2. Check `.claude/hooks/pre-commit.sh` exists and is executable
3. Reload Claude Code window

### Tests Fail on Commit

**Problem:** Commit blocked with test failures

**Solution:**
1. Read the test output to identify failing test
2. Fix the test or the code causing failure
3. Run `python -m pytest tests/` to verify fix
4. Retry commit

### Ruff Not Found

**Problem:** `ruff: command not found`

**Solution:**
```bash
pip install ruff pytest mypy
```

### Permission Denied on Windows

**Problem:** `.claude/hooks/pre-commit.sh: Permission denied`

**Solution:**
```bash
chmod +x .claude/hooks/pre-commit.sh
```

Or use Git Bash to run commands (not Command Prompt).

## CI/CD Integration

The same checks run in GitHub Actions CI pipeline:

**Workflow:** `.github/workflows/test.yml` (DP01-134)

```yaml
- name: Run Ruff linter
  run: ruff check .

- name: Run tests
  run: pytest tests/ --cov --cov-report=xml

- name: Check coverage
  run: |
    coverage report --fail-under=80
```

Pre-commit hooks ensure **local commits pass CI checks** before pushing to remote.

## Performance

### Hook Execution Time

Typical execution times (on small commits):
- Ruff linter: 0.1-0.5s
- Ruff formatter: 0.1-0.3s
- MyPy type check: 1-3s
- Pytest tests: 0.5-2s (depends on test count)

**Total:** ~2-6 seconds for most commits

### Optimization Tips

1. **Commit smaller changesets** - Fewer files to check
2. **Run tests manually first** - Use `pytest tests/` before committing
3. **Skip slow tests** - Mark with `@pytest.mark.slow` and exclude from commit hooks
4. **Cache dependencies** - MyPy and pytest cache results

## Related Tasks

- **DP01-11:** Configure linting and code formatting (COMPLETED)
- **DP01-134:** Test pipeline CI/CD setup
- **DP01-141:** Unit test coverage enforcement (80% minimum)
- **DP01-142:** E2E test suite with Playwright/Cypress

## Additional Resources

- **Ruff Documentation:** https://docs.astral.sh/ruff/
- **pytest Documentation:** https://docs.pytest.org/
- **MyPy Documentation:** https://mypy.readthedocs.io/
- **Pre-commit Framework:** https://pre-commit.com/

---

**Last Updated:** December 15, 2025
**Status:** Active - Enforced on all commits
