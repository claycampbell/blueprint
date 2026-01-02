#!/bin/bash
# Web Frontend Rollback Script
# One-command rollback to the previous ECS task definition
#
# Usage: ./rollback.sh [environment]
# Example: ./rollback.sh prod

set -euo pipefail

# Configuration
ENV=${1:-prod}
PROJECT_NAME="connect2"
SERVICE_NAME="${PROJECT_NAME}-web-service-${ENV}"
CLUSTER_NAME="${PROJECT_NAME}-cluster-${ENV}"

echo "============================================"
echo "Web Rollback - ${ENV} environment"
echo "============================================"
echo ""
echo "Service: ${SERVICE_NAME}"
echo "Cluster: ${CLUSTER_NAME}"
echo ""

# Get current task definition
CURRENT_TASK_DEF=$(aws ecs describe-services \
  --cluster "${CLUSTER_NAME}" \
  --services "${SERVICE_NAME}" \
  --query 'services[0].taskDefinition' \
  --output text)

echo "Current task definition: ${CURRENT_TASK_DEF}"

# Get the task definition family (without revision number)
TASK_FAMILY=$(echo "${CURRENT_TASK_DEF}" | sed 's/:.*$//' | sed 's/.*\///')

echo "Task family: ${TASK_FAMILY}"

# List recent task definitions and get the second most recent (previous version)
echo ""
echo "Finding previous task definition..."

PREV_TASK_DEF=$(aws ecs list-task-definitions \
  --family-prefix "${TASK_FAMILY}" \
  --sort DESC \
  --max-items 2 \
  --query 'taskDefinitionArns[1]' \
  --output text)

if [ "$PREV_TASK_DEF" == "None" ] || [ -z "$PREV_TASK_DEF" ]; then
  echo "ERROR: No previous task definition found to rollback to."
  echo "This may be the first deployment."
  exit 1
fi

echo "Previous task definition: ${PREV_TASK_DEF}"
echo ""

# Confirm rollback
read -p "Do you want to rollback to this version? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Rollback cancelled."
  exit 0
fi

echo ""
echo "Rolling back to: ${PREV_TASK_DEF}"
echo ""

# Update service to use previous task definition
aws ecs update-service \
  --cluster "${CLUSTER_NAME}" \
  --service "${SERVICE_NAME}" \
  --task-definition "${PREV_TASK_DEF}" \
  --force-new-deployment \
  --output text > /dev/null

echo "Deployment initiated. Waiting for service to stabilize..."
echo "(This may take 2-5 minutes)"
echo ""

# Wait for service to stabilize
aws ecs wait services-stable \
  --cluster "${CLUSTER_NAME}" \
  --services "${SERVICE_NAME}"

echo ""
echo "============================================"
echo "Rollback complete!"
echo "============================================"
echo ""
echo "Service ${SERVICE_NAME} is now running: ${PREV_TASK_DEF}"
echo ""
echo "IMPORTANT: Create a revert PR to keep Git history accurate:"
echo ""
echo "  git revert -m 1 <merge-commit-sha>"
echo "  git push origin main"
echo ""
echo "Verify the rollback by checking:"
echo "  - Web app loads correctly"
echo "  - CloudWatch logs for errors"
echo "  - Browser console for JavaScript errors"
