#!/bin/bash

# Deploy Connect 2.0 to Azure Static Web Apps
# Quick deployment script for the Blueprint team

echo "🚀 Connect 2.0 - Azure Deployment Script"
echo "========================================="
echo ""

# Configuration
RESOURCE_GROUP="blueprint-connect-demo"
APP_NAME="connect-2-0-demo"
LOCATION="eastus2"
REPO_URL="https://github.com/claycampbell/blueprint"
BRANCH="main"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI not found${NC}"
    echo ""
    echo "Please install Azure CLI first:"
    echo "https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  App Name: $APP_NAME"
echo "  Location: $LOCATION"
echo "  Repository: $REPO_URL"
echo "  Branch: $BRANCH"
echo ""

# Login check
echo -e "${BLUE}🔐 Checking Azure login status...${NC}"
az account show &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Not logged in. Opening browser for login...${NC}"
    az login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Login failed${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Logged in${NC}"
echo ""

# Create resource group
echo -e "${BLUE}📦 Creating resource group...${NC}"
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --output table

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Resource group might already exist${NC}"
fi
echo ""

# Create static web app
echo -e "${BLUE}🌐 Creating Azure Static Web App...${NC}"
echo -e "${YELLOW}This will open a browser for GitHub authorization...${NC}"
echo ""

az staticwebapp create \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --source $REPO_URL \
  --location $LOCATION \
  --branch $BRANCH \
  --app-location "/starter-kit" \
  --output-location ".next" \
  --login-with-github

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    echo ""
    echo "Troubleshooting tips:"
    echo "1. Make sure you have GitHub permissions"
    echo "2. Check if the app name is already taken"
    echo "3. Verify your Azure subscription is active"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Static Web App created successfully!${NC}"
echo ""

# Get the URL
echo -e "${BLUE}🔍 Getting deployment URL...${NC}"
DEPLOYMENT_URL=$(az staticwebapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "defaultHostname" -o tsv)

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}📍 Your Connect 2.0 demo is available at:${NC}"
echo -e "${GREEN}   https://$DEPLOYMENT_URL${NC}"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "   1. Wait 2-3 minutes for the first build to complete"
echo "   2. Check GitHub Actions for build status:"
echo "      https://github.com/claycampbell/blueprint/actions"
echo "   3. Share the URL with your team!"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo "   View status: az staticwebapp show -n $APP_NAME -g $RESOURCE_GROUP"
echo "   View logs:   Check GitHub Actions tab"
echo "   Delete app:  az staticwebapp delete -n $APP_NAME -g $RESOURCE_GROUP"
echo ""
echo -e "${YELLOW}💡 Pro Tip:${NC} Bookmark this URL for easy access!"
echo ""
