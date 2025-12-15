#!/bin/bash
# Claude Code Pre-Commit Hook
# Automatically runs linting, formatting, and tests before every commit
# This hook is executed by Claude Code when calling git commit

set -e  # Exit on any error

echo "============================================"
echo "Running Pre-Commit Checks..."
echo "============================================"
echo ""

# Get list of Python files to be committed
PYTHON_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.py$' || true)

if [ -z "$PYTHON_FILES" ]; then
    echo "No Python files to check"
    exit 0
fi

echo "Python files to check:"
echo "$PYTHON_FILES"
echo ""

# ============================================
# 1. Ruff Linter
# ============================================
echo "Step 1/4: Running Ruff linter..."
if command -v ruff &> /dev/null; then
    ruff check $PYTHON_FILES --fix
    echo "✓ Ruff linting passed"
else
    echo "⚠️  Ruff not installed. Installing..."
    pip install ruff
    ruff check $PYTHON_FILES --fix
fi
echo ""

# ============================================
# 2. Ruff Formatter
# ============================================
echo "Step 2/4: Running Ruff formatter..."
ruff format $PYTHON_FILES
echo "✓ Code formatting complete"
echo ""

# ============================================
# 3. Type Checking (mypy) - Warning only
# ============================================
echo "Step 3/4: Running type checker (mypy)..."
if command -v mypy &> /dev/null; then
    mypy $PYTHON_FILES --ignore-missing-imports || echo "⚠️  Type check warnings (non-blocking)"
else
    echo "⚠️  Mypy not installed. Skipping type check."
fi
echo ""

# ============================================
# 4. Pytest - Run relevant tests
# ============================================
echo "Step 4/4: Running tests..."
if command -v python &> /dev/null; then
    # Only run tests if test files exist
    if [ -d "tests" ] || ls scripts/test_*.py 2>/dev/null; then
        python -m pytest tests/ scripts/ -v --tb=short --maxfail=1 || {
            echo ""
            echo "❌ Tests failed! Fix failing tests before committing."
            exit 1
        }
        echo "✓ All tests passed"
    else
        echo "ℹ️  No tests found yet"
    fi
else
    echo "⚠️  Python not found. Skipping tests."
fi
echo ""

# ============================================
# Re-add formatted files to staging
# ============================================
echo "Re-staging formatted files..."
for file in $PYTHON_FILES; do
    git add "$file"
done

echo ""
echo "============================================"
echo "✓ Pre-commit checks passed!"
echo "============================================"
echo ""

exit 0
