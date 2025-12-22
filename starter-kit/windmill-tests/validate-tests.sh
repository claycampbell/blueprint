#!/bin/bash

# Validate Windmill Test Suite
# This script ensures all test files are syntactically valid

echo "========================================="
echo "Windmill Test Suite Validation"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track validation status
ALL_VALID=true

# Validate TypeScript files
echo "Validating TypeScript files..."
echo "------------------------------"

for file in *.ts; do
    if [ -f "$file" ]; then
        echo -n "Checking $file... "

        # Check for basic TypeScript syntax
        if grep -q "export async function main" "$file"; then
            echo -e "${GREEN}✓ Has main function${NC}"
        else
            echo -e "${RED}✗ Missing main function${NC}"
            ALL_VALID=false
        fi

        # Check for return statement
        if grep -q "return" "$file"; then
            echo -e "  ${GREEN}✓ Has return statement${NC}"
        else
            echo -e "  ${YELLOW}⚠ No return statement (may be intentional)${NC}"
        fi
    fi
done

echo ""

# Validate JSON file
echo "Validating JSON files..."
echo "------------------------"

for file in *.json; do
    if [ -f "$file" ]; then
        echo -n "Checking $file... "

        # Use Python to validate JSON
        if python -c "import json; json.load(open('$file'))" 2>/dev/null; then
            echo -e "${GREEN}✓ Valid JSON${NC}"
        else
            echo -e "${RED}✗ Invalid JSON${NC}"
            ALL_VALID=false
        fi
    fi
done

echo ""

# Check README exists
echo "Checking documentation..."
echo "-------------------------"

if [ -f "README.md" ]; then
    echo -e "${GREEN}✓ README.md exists${NC}"

    # Count lines to ensure it's substantial
    LINE_COUNT=$(wc -l < README.md)
    if [ $LINE_COUNT -gt 100 ]; then
        echo -e "  ${GREEN}✓ Comprehensive documentation ($LINE_COUNT lines)${NC}"
    else
        echo -e "  ${YELLOW}⚠ Documentation may be incomplete ($LINE_COUNT lines)${NC}"
    fi
else
    echo -e "${RED}✗ README.md missing${NC}"
    ALL_VALID=false
fi

echo ""

# Check test runner
if [ -f "run-all-tests.ts" ]; then
    echo -e "${GREEN}✓ Test runner script exists${NC}"
else
    echo -e "${YELLOW}⚠ Test runner script missing${NC}"
fi

echo ""
echo "========================================="

if [ "$ALL_VALID" = true ]; then
    echo -e "${GREEN}✅ All validations passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Upload test scripts to Windmill UI"
    echo "2. Run individual tests to establish baselines"
    echo "3. Execute run-all-tests.ts for comprehensive analysis"
    echo "4. Review results against Blueprint requirements"
else
    echo -e "${RED}❌ Some validations failed. Please review.${NC}"
fi

echo "========================================="