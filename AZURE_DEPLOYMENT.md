# Azure Static Web Apps Deployment Guide

## Connect 2.0 - Blueprint Development Platform

This guide will help you deploy the Connect 2.0 UI to Azure Static Web Apps for demo purposes.

---

## Prerequisites

1. **Azure Account** - Free tier available at https://azure.microsoft.com/free/
2. **GitHub Account** - Repository is already set up
3. **Azure CLI** (optional) - For command-line deployment

---

## Option 1: Deploy via Azure Portal (Recommended for Quick Setup)

### Step 1: Create Azure Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Static Web App"** and click **Create**

### Step 2: Configure Basic Settings

- **Subscription**: Select your Azure subscription
- **Resource Group**: Create new or use existing (e.g., `blueprint-connect-demo`)
- **Name**: `connect-2-0-demo` (or your preferred name)
- **Plan type**: **Free** (perfect for demos)
- **Region**: Choose closest to your location (e.g., `East US 2`, `West US 2`)
- **Deployment source**: **GitHub**

### Step 3: Connect GitHub Repository

1. Click **"Sign in with GitHub"**
2. Authorize Azure to access your repositories
3. Select:
   - **Organization**: `claycampbell` (your GitHub username/org)
   - **Repository**: `blueprint`
   - **Branch**: `main`

### Step 4: Build Configuration

Enter the following build details:

- **Build Presets**: `Next.js`
- **App location**: `/starter-kit`
- **Api location**: *(leave empty)*
- **Output location**: `.next`

### Step 5: Review and Create

1. Click **"Review + create"**
2. Review the configuration
3. Click **"Create"**

Azure will:
- Create the Static Web App resource
- Add a GitHub Action workflow to your repository
- Automatically trigger the first deployment

---

## Option 2: Deploy via Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name blueprint-connect-demo --location eastus2

# Create static web app
az staticwebapp create \
  --name connect-2-0-demo \
  --resource-group blueprint-connect-demo \
  --source https://github.com/claycampbell/blueprint \
  --location eastus2 \
  --branch main \
  --app-location "/starter-kit" \
  --output-location ".next" \
  --login-with-github
```

---

## Post-Deployment Steps

### 1. Verify Deployment

After creation (takes 2-5 minutes), you'll receive a URL like:
```
https://connect-2-0-demo-<unique-id>.azurestaticapps.net
```

### 2. Check GitHub Actions

1. Go to your GitHub repository: `https://github.com/claycampbell/blueprint`
2. Click on **"Actions"** tab
3. You should see a workflow running: **"Azure Static Web Apps CI/CD"**
4. Wait for it to complete (typically 2-3 minutes)

### 3. Access Your Deployment

Once the GitHub Action completes:
1. Go to your Azure Static Web App in the portal
2. Click on **"URL"** to open your deployed site
3. You should see the Connect 2.0 login page

---

## Managing the Deployment

### View Deployment URL

```bash
az staticwebapp show \
  --name connect-2-0-demo \
  --resource-group blueprint-connect-demo \
  --query "defaultHostname" -o tsv
```

### View Deployment Status

Check the **Deployments** section in Azure Portal or GitHub Actions.

### Redeploy

Any push to the `main` branch in the `/starter-kit` folder will trigger automatic redeployment.

To manually trigger:
1. Go to GitHub Actions
2. Select the workflow
3. Click **"Re-run all jobs"**

---

## Custom Domain (Optional)

### Add Custom Domain

1. In Azure Portal, go to your Static Web App
2. Click **"Custom domains"** in the left menu
3. Click **"Add"**
4. Enter your domain (e.g., `demo.blueprint.com`)
5. Follow DNS configuration instructions

### Configure DNS

Add the following DNS records:

**CNAME Record:**
```
Name: demo (or your subdomain)
Type: CNAME
Value: <your-static-web-app-url>.azurestaticapps.net
TTL: 3600
```

**TXT Record (for verification):**
```
Name: _dnsauth.demo
Type: TXT
Value: <verification-code-from-azure>
TTL: 3600
```

---

## Environment Configuration

### For Production Deployment

If you need to configure environment variables:

1. Go to your Static Web App in Azure Portal
2. Click **"Configuration"** in the left menu
3. Click **"Application settings"**
4. Add your variables:

Example:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.blueprint.com
```

---

## Monitoring & Logs

### View Application Insights

1. In Azure Portal, go to your Static Web App
2. Click **"Application Insights"** in the left menu
3. View performance metrics, requests, and errors

### View Build Logs

1. Go to GitHub Actions in your repository
2. Click on a workflow run
3. Expand the **"Build And Deploy"** step to see logs

---

## Cost Estimate

**Azure Static Web Apps Free Tier:**
- ✅ **100 GB bandwidth/month** - More than enough for demos
- ✅ **2 custom domains**
- ✅ **Unlimited SSL certificates**
- ✅ **Global CDN**
- ✅ **GitHub integration**
- 💰 **Cost: $0/month**

**If you need more:**
- Standard plan: ~$9/month (500 GB bandwidth, unlimited custom domains)

---

## Troubleshooting

### Build Fails

**Check package.json:**
- Ensure all dependencies are listed
- Check Node.js version compatibility

**Check build logs:**
1. Go to GitHub Actions
2. Check error messages in build step
3. Common fixes:
   - Update Node version in workflow
   - Check for missing environment variables
   - Verify build commands

### Site Not Loading

1. **Check deployment status** - Ensure GitHub Action completed successfully
2. **Check staticwebapp.config.json** - Verify routing configuration
3. **Clear browser cache** - Force refresh with Ctrl+Shift+R
4. **Check Azure Portal logs** - Look for errors in Application Insights

### 404 Errors on Routes

Add/verify `staticwebapp.config.json` in the `starter-kit` folder with proper routing configuration (already included).

---

## Sharing the Demo

### Share URL with Team

Your deployment URL format:
```
https://connect-2-0-demo-<unique-id>.azurestaticapps.net
```

Example pages to showcase:
- **Login**: `/login`
- **Home Dashboard**: `/home`
- **About**: `/about`
- **Component Docs**: `/docs`
- **Leads Management**: `/leads`
- **Analytics**: `/analytics`

### Create QR Code

Use a QR code generator with your deployment URL for easy mobile access:
- https://www.qr-code-generator.com/
- Print and share in presentations

---

## Cleanup (When Done)

### Delete Resources

```bash
# Delete the static web app
az staticwebapp delete \
  --name connect-2-0-demo \
  --resource-group blueprint-connect-demo

# Delete the resource group (removes all resources)
az group delete --name blueprint-connect-demo
```

Or via Azure Portal:
1. Go to Resource Groups
2. Select `blueprint-connect-demo`
3. Click **"Delete resource group"**
4. Type the resource group name to confirm
5. Click **"Delete"**

---

## Next Steps

Once deployed, you can:
1. ✅ Share the live demo URL with your team
2. ✅ Showcase all 17 pages of the platform
3. ✅ Demonstrate responsive design on mobile/tablet
4. ✅ Walk through the component documentation
5. ✅ Collect feedback for next iteration

---

## Support

- **Azure Static Web Apps Docs**: https://docs.microsoft.com/azure/static-web-apps/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **GitHub Actions**: https://docs.github.com/actions

---

**Deployment Ready!** 🚀

Follow the steps above to get Connect 2.0 live on Azure within 10 minutes.
