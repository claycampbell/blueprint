#!/bin/bash
# Reset LocalStack onboarding exercise for next developer
#
# This script removes all generated files from the LocalStack onboarding exercise,
# allowing subsequent developers to complete the exercise from scratch.
#
# Usage: bash scripts/reset-onboarding.sh

set -e  # Exit on error

echo "🧹 Resetting LocalStack onboarding environment..."
echo ""

# Confirmation check
read -p "⚠️  This will delete docker-compose.yml, scripts, and examples. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Aborted."
    exit 1
fi

# Step 1: Stop and remove all containers
echo "📦 Step 1: Stopping Docker containers..."
if [ -f "docker-compose.yml" ]; then
    docker-compose down -v 2>/dev/null || true
    echo "✅ Containers stopped and volumes removed"
else
    echo "ℹ️  No docker-compose.yml found, skipping container cleanup"
fi
echo ""

# Step 2: Remove generated files from onboarding exercise
echo "🗑️  Step 2: Removing generated files..."

FILES_TO_REMOVE=(
    "docker-compose.yml"
    "scripts/localstack-init.sh"
    "scripts/init-db.sql"
    "DEVELOPER_QUICKSTART.md"
    "examples/nodejs-api"
)

for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -e "$file" ]; then
        rm -rf "$file"
        echo "  ✅ Removed: $file"
    else
        echo "  ⏭️  Skipped (not found): $file"
    fi
done
echo ""

# Step 3: Check for uncommitted changes
echo "🔍 Step 3: Checking git status..."
if ! git diff --quiet; then
    echo "⚠️  WARNING: You have uncommitted changes in your working directory."
    echo "   This is expected if you completed the onboarding exercise."
    echo ""
    git status --short
    echo ""
fi

# Step 4: Optional Docker cleanup
echo "🐳 Step 4: Docker cleanup (optional)..."
read -p "Remove LocalStack/PostgreSQL Docker images to free disk space? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "  Removing Docker images..."
    docker rmi localstack/localstack:latest 2>/dev/null || echo "  ⏭️  localstack/localstack:latest not found"
    docker rmi postgres:15-alpine 2>/dev/null || echo "  ⏭️  postgres:15-alpine not found"
    docker rmi redis:7-alpine 2>/dev/null || echo "  ⏭️  redis:7-alpine not found"
    docker rmi dpage/pgadmin4 2>/dev/null || echo "  ⏭️  dpage/pgadmin4 not found"
    echo "  ✅ Docker images removed"
else
    echo "  ⏭️  Skipped Docker image cleanup"
fi
echo ""

read -p "Run docker system prune to reclaim space? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    docker system prune -f
    echo "  ✅ Docker system pruned"
else
    echo "  ⏭️  Skipped docker system prune"
fi
echo ""

# Step 5: Verification
echo "✅ Reset complete!"
echo ""
echo "📋 Verification checklist:"
echo "  - No containers running: $(docker ps -q | wc -l) (should be 0)"
echo "  - docker-compose.yml exists: $([ -f docker-compose.yml ] && echo 'YES ❌' || echo 'NO ✅')"
echo "  - scripts/localstack-init.sh exists: $([ -f scripts/localstack-init.sh ] && echo 'YES ❌' || echo 'NO ✅')"
echo "  - examples/nodejs-api exists: $([ -d examples/nodejs-api ] && echo 'YES ❌' || echo 'NO ✅')"
echo ""
echo "📖 Next steps for new developer:"
echo "  1. Create feature branch: git checkout -b <your-name>/localstack-setup"
echo "  2. Start onboarding: See docs/planning/LOCALSTACK_HEPHAESTUS_ONBOARDING.md"
echo "  3. Update Jira: Move DP01-66 to IN_PROGRESS"
echo ""
echo "Happy coding! 🚀"
