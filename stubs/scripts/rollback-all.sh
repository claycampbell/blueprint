#!/bin/bash
# Full System Rollback Script
# Emergency rollback for both API and Web services
#
# Usage: ./rollback-all.sh [environment]
# Example: ./rollback-all.sh prod
#
# WARNING: This script rolls back BOTH services. Use individual rollback
# scripts (api/scripts/rollback.sh, web/scripts/rollback.sh) when only
# one service needs to be rolled back.

set -euo pipefail

# Configuration
ENV=${1:-prod}
PROJECT_NAME="connect2"
CLUSTER_NAME="${PROJECT_NAME}-cluster-${ENV}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_ROLLBACK="${SCRIPT_DIR}/../api/scripts/rollback.sh"
WEB_ROLLBACK="${SCRIPT_DIR}/../web/scripts/rollback.sh"

echo "============================================"
echo "FULL SYSTEM ROLLBACK - ${ENV} environment"
echo "============================================"
echo ""
echo "WARNING: This will rollback BOTH API and Web services!"
echo ""
echo "Services to rollback:"
echo "  - ${PROJECT_NAME}-api-service-${ENV}"
echo "  - ${PROJECT_NAME}-web-service-${ENV}"
echo ""
echo "If you only need to rollback ONE service, use:"
echo "  - API only:  ./api/scripts/rollback.sh ${ENV}"
echo "  - Web only:  ./web/scripts/rollback.sh ${ENV}"
echo ""

# Confirm full rollback
read -p "Are you sure you want to rollback BOTH services? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Full rollback cancelled."
  exit 0
fi

echo ""
echo "============================================"
echo "Step 1/2: Rolling back API service..."
echo "============================================"
echo ""

# Check API rollback script exists
if [ ! -f "$API_ROLLBACK" ]; then
  echo "ERROR: API rollback script not found at: $API_ROLLBACK"
  exit 1
fi

# Run API rollback (pass environment, auto-confirm with yes)
echo "y" | "$API_ROLLBACK" "$ENV"

API_EXIT_CODE=$?
if [ $API_EXIT_CODE -ne 0 ]; then
  echo ""
  echo "ERROR: API rollback failed with exit code $API_EXIT_CODE"
  echo "Web rollback NOT attempted."
  exit $API_EXIT_CODE
fi

echo ""
echo "============================================"
echo "Step 2/2: Rolling back Web service..."
echo "============================================"
echo ""

# Check Web rollback script exists
if [ ! -f "$WEB_ROLLBACK" ]; then
  echo "ERROR: Web rollback script not found at: $WEB_ROLLBACK"
  exit 1
fi

# Run Web rollback (pass environment, auto-confirm with yes)
echo "y" | "$WEB_ROLLBACK" "$ENV"

WEB_EXIT_CODE=$?
if [ $WEB_EXIT_CODE -ne 0 ]; then
  echo ""
  echo "ERROR: Web rollback failed with exit code $WEB_EXIT_CODE"
  echo "API rollback completed successfully, but Web rollback failed."
  exit $WEB_EXIT_CODE
fi

echo ""
echo "============================================"
echo "FULL SYSTEM ROLLBACK COMPLETE"
echo "============================================"
echo ""
echo "Both services have been rolled back to their previous versions."
echo ""
echo "IMPORTANT: Create a revert PR to keep Git history accurate:"
echo ""
echo "  git revert -m 1 <merge-commit-sha>"
echo "  git push origin main"
echo ""
echo "Verify the rollback by checking:"
echo "  - API health endpoint: https://api.connect2.com/health"
echo "  - Web app loads: https://app.connect2.com"
echo "  - CloudWatch logs for both services"
echo "  - End-to-end functionality"
echo ""
echo "If this was a shared infrastructure issue, coordinate with platform team"
echo "for infrastructure-level changes (handled via git revert, not scripts)."
