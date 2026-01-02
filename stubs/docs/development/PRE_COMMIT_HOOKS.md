# Pre-Commit Hooks Guide

This document explains the pre-commit hook configuration for the Connect 2.0 platform's three projects:

- **`api`** - Python/FastAPI backend (shared by both frontends)
- **`connect`** - TypeScript/React internal application
- **`bpo`** - TypeScript/React public-facing website

## What Are Pre-Commit Hooks?

Pre-commit hooks are **automated checks that run on your local machine before a commit is accepted**. They act as a quality gate to catch issues before code enters version control.

```
Developer writes code
        ↓
Developer runs: git commit
        ↓
Pre-commit hooks run automatically
        ↓
   ┌────┴────┐
   │ PASS    │ FAIL
   ↓         ↓
Commit      Commit blocked
succeeds    (must fix issues)
```

### Why Use Pre-Commit Hooks?

| Benefit | Description |
|---------|-------------|
| **Catch issues early** | Find problems before they reach GitHub |
| **Consistent code style** | Automatic formatting ensures everyone's code looks the same |
| **Prevent broken builds** | Tests run before code is committed |
| **Security** | Detect secrets/private keys before they're committed |
| **Reduce CI costs** | Catch failures locally instead of wasting GitHub Actions minutes |

---

## Quick Start

### Installation (One-Time Setup)

Both projects require the `pre-commit` framework:

```bash
# Install pre-commit (Python package, works for both projects)
pip install pre-commit

# Navigate to each project and install hooks
cd stubs/api
pre-commit install

cd ../connect
pre-commit install

cd ../bpo
pre-commit install
```

After installation, hooks run automatically on every `git commit`.

### Manual Execution

Run hooks manually without committing:

```bash
# Run all hooks on staged files
pre-commit run

# Run all hooks on all files
pre-commit run --all-files

# Run a specific hook
pre-commit run ruff        # API only
pre-commit run eslint      # App only
```

---

## API Pre-Commit Hooks (Python)

**Location:** `stubs/api/.pre-commit-config.yaml`

### Hooks Configured

| Hook | Purpose | Blocking? |
|------|---------|-----------|
| **trailing-whitespace** | Remove trailing whitespace | Yes |
| **end-of-file-fixer** | Ensure files end with newline | Yes |
| **check-yaml** | Validate YAML syntax | Yes |
| **check-json** | Validate JSON syntax | Yes |
| **check-toml** | Validate TOML syntax | Yes |
| **check-added-large-files** | Prevent files > 1MB | Yes |
| **check-merge-conflict** | Detect merge conflict markers | Yes |
| **detect-private-key** | Prevent committing secrets | Yes |
| **Ruff linter** | Python linting (auto-fix) | Yes |
| **Ruff formatter** | Python formatting | Yes |
| **MyPy** | Type checking | Yes |
| **Bandit** | Security vulnerability scan | Yes |
| **Pytest** | Run unit tests | Yes |

### What Gets Checked

**Ruff Linter** (replaces flake8, isort, pyupgrade, etc.):
- PEP 8 style violations
- Unused imports and variables
- Import sorting
- Common bugs and anti-patterns
- Python version upgrade suggestions

**Ruff Formatter** (replaces black):
- Consistent code formatting
- 100 character line length

**MyPy**:
- Static type checking
- Type annotation validation

**Bandit**:
- SQL injection vulnerabilities
- Hardcoded passwords
- Insecure function usage

**Pytest**:
- All tests in `tests/` directory
- Stops after 3 failures

### Running API Hooks Manually

```bash
cd stubs/api

# Run all hooks
pre-commit run --all-files

# Run individual tools
uv run ruff check . --fix    # Lint and auto-fix
uv run ruff format .         # Format code
uv run mypy app              # Type check
uv run pytest tests/         # Run tests
```

---

## Connect & BPO Pre-Commit Hooks (TypeScript/React)

Both frontend applications (`connect` and `bpo`) use identical pre-commit configurations.

**Locations:**
- `stubs/connect/.pre-commit-config.yaml`
- `stubs/bpo/.pre-commit-config.yaml`

### Hooks Configured

| Hook | Purpose | Blocking? |
|------|---------|-----------|
| **trailing-whitespace** | Remove trailing whitespace | Yes |
| **end-of-file-fixer** | Ensure files end with newline | Yes |
| **check-yaml** | Validate YAML syntax | Yes |
| **check-json** | Validate JSON syntax | Yes |
| **check-added-large-files** | Prevent files > 1MB | Yes |
| **check-merge-conflict** | Detect merge conflict markers | Yes |
| **detect-private-key** | Prevent committing secrets | Yes |
| **ESLint** | TypeScript/React linting | Yes |
| **TypeScript** | Type checking (`tsc --noEmit`) | Yes |
| **Vitest** | Run unit tests | Yes |

### What Gets Checked

**ESLint**:
- TypeScript best practices
- React hooks rules
- React refresh compatibility
- Import/export validation

**TypeScript Compiler**:
- Type errors
- Missing type definitions
- Strict null checks

**Vitest**:
- All tests in `src/**/*.test.{ts,tsx}`
- Passes with no tests (for new projects)

### Running Frontend Hooks Manually

```bash
# For Connect
cd stubs/connect

# For BPO
cd stubs/bpo

# Run all hooks (same commands for both)
pre-commit run --all-files

# Run individual tools
npm run lint                 # ESLint
npx tsc --noEmit            # Type check
npm run test -- --run       # Run tests once
```

---

## Relationship to CI/CD

Pre-commit hooks and GitHub Actions CI run the **same checks** in different environments:

```
LOCAL (Your Machine)              REMOTE (GitHub)
────────────────────────────────────────────────────────
Pre-commit hooks     ──push──>    GitHub Actions CI
(fast feedback)                   (final validation)
```

### Why Both?

| Pre-Commit (Local) | GitHub Actions (Remote) |
|--------------------|-------------------------|
| Fast feedback (seconds) | Authoritative (can't be skipped) |
| Catches issues before push | Runs on all PRs |
| Saves CI minutes | Runs in clean environment |
| Can be bypassed (emergencies) | Always enforced |

### CI Workflows

**API CI:** `stubs/api/.github/workflows/ci.yml`
- Lint → Type Check → Test → Build Docker

**Connect CI:** `stubs/connect/.github/workflows/ci.yml`
- Lint → Type Check → Test → Build

**BPO CI:** `stubs/bpo/.github/workflows/ci.yml`
- Lint → Type Check → Test → Build

---

## Bypassing Hooks (Emergency Only)

If you absolutely must skip hooks (hotfix, emergency):

```bash
# Skip all pre-commit hooks
git commit --no-verify -m "Emergency fix"

# Or skip for this repo temporarily
pre-commit uninstall
git commit -m "Fix"
pre-commit install
```

**Warning:** Bypassing hooks may cause CI failures. Use sparingly.

---

## Troubleshooting

### "pre-commit: command not found"

```bash
pip install pre-commit
```

### "Hooks not running on commit"

```bash
cd stubs/api  # or stubs/connect or stubs/bpo
pre-commit install
```

### "uv: command not found" (API)

```bash
pip install uv
```

### "npm: command not found" (Connect/BPO)

Ensure Node.js is installed and `npm` is in your PATH.

### "Tests failing on commit"

1. Read the test output to identify the failing test
2. Fix the code or test
3. Run tests manually to verify: `uv run pytest` or `npm test -- --run`
4. Retry commit

### "MyPy errors but code works"

MyPy is strict. Options:
1. Fix the type annotation
2. Add `# type: ignore` comment (use sparingly)
3. Adjust `pyproject.toml` MyPy settings

### "ESLint errors"

Most ESLint errors have auto-fix:
```bash
npm run lint -- --fix
```

### Hook Execution Time

Typical times (small commits):

| Hook | API | Connect/BPO |
|------|-----|-------------|
| Ruff/ESLint | 0.2s | 1-2s |
| Formatter | 0.1s | - |
| Type check | 1-3s | 2-5s |
| Tests | 1-5s | 1-5s |
| **Total** | **3-10s** | **4-12s** |

---

## Configuration Files

### API Configuration

| File | Purpose |
|------|---------|
| `stubs/api/.pre-commit-config.yaml` | Pre-commit hook definitions |
| `stubs/api/pyproject.toml` | Ruff, MyPy, Pytest settings |

### Connect Configuration

| File | Purpose |
|------|---------|
| `stubs/connect/.pre-commit-config.yaml` | Pre-commit hook definitions |
| `stubs/connect/eslint.config.js` | ESLint rules |
| `stubs/connect/tsconfig.json` | TypeScript settings |
| `stubs/connect/vitest.config.ts` | Vitest settings |

### BPO Configuration

| File | Purpose |
|------|---------|
| `stubs/bpo/.pre-commit-config.yaml` | Pre-commit hook definitions |
| `stubs/bpo/eslint.config.js` | ESLint rules |
| `stubs/bpo/tsconfig.json` | TypeScript settings |
| `stubs/bpo/vite.config.ts` | Vite/Vitest settings |

---

## Best Practices

1. **Run hooks before pushing** - Don't rely on CI to catch issues
2. **Fix errors immediately** - Don't bypass hooks unless absolutely necessary
3. **Keep dependencies updated** - Run `pre-commit autoupdate` periodically
4. **Commit frequently** - Smaller commits = faster hook execution
5. **Run tests manually first** - For large changes, run `pytest`/`npm test` before committing

---

## Adding New Hooks

### API (Python)

Edit `stubs/api/.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/some/hook
    rev: v1.0.0
    hooks:
      - id: hook-name
        name: Hook description
```

### Connect/BPO (TypeScript)

Edit `stubs/connect/.pre-commit-config.yaml` or `stubs/bpo/.pre-commit-config.yaml`:

```yaml
repos:
  - repo: local
    hooks:
      - id: my-hook
        name: My custom hook
        entry: npm run my-script
        language: system
        types: [typescript]
```

---

## Related Documentation

- [TECH_STACK_DECISIONS.md](../TECH_STACK_DECISIONS.md) - Testing framework details
- [BPO_CONNECT_ARCHITECTURE_DECISION.md](../BPO_CONNECT_ARCHITECTURE_DECISION.md) - Architecture decision
- [API CI Workflow](../../api/.github/workflows/ci.yml) - GitHub Actions for API
- [Connect CI Workflow](../../connect/.github/workflows/ci.yml) - GitHub Actions for Connect
- [BPO CI Workflow](../../bpo/.github/workflows/ci.yml) - GitHub Actions for BPO
- [Pre-commit Framework](https://pre-commit.com/) - Official documentation
- [Ruff Documentation](https://docs.astral.sh/ruff/) - Python linter/formatter
- [ESLint Documentation](https://eslint.org/) - TypeScript/JavaScript linter

---

**Last Updated:** January 2026
**Status:** Active
