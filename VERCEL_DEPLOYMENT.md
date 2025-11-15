# Vercel Deployment Guide - Connect 2.0

## Why Vercel?

Vercel is the recommended platform for Next.js applications:
- **Built by Next.js creators** - Perfect compatibility
- **Free tier** - Generous limits for demos
- **Full Next.js support** - SSR, ISR, App Router, all features work
- **Automatic deployments** - Push to GitHub = instant deploy
- **Global CDN** - Fast worldwide performance

Azure Static Web Apps has limitations with Next.js App Router features.

---

## Quick Deploy (5 minutes)

### Step 1: Go to Vercel

Visit: **https://vercel.com/new**

### Step 2: Import Your Repository

1. Click **"Import Git Repository"**
2. Sign in with GitHub (if not already)
3. Select: **`claycampbell/blueprint`**
4. Click **"Import"**

### Step 3: Configure Project

**Project Settings:**
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `starter-kit` ⚠️ **IMPORTANT**
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**Environment Variables:**
- None needed for this demo

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Get your live URL: `https://connect-2-0-<random>.vercel.app`

---

## Alternative: Deploy via CLI

If you prefer command-line deployment:

### Install Vercel CLI

```bash
npm i -g vercel
```

### Login to Vercel

```bash
vercel login
```

Follow the email verification link.

### Deploy

```bash
cd starter-kit
vercel
```

Answer the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** connect-2-0-demo
- **Directory?** `./` (current directory)
- **Override settings?** No

### Production Deployment

```bash
vercel --prod
```

---

## What Gets Deployed

✅ **All 17 Pages**
- Home, Dashboard, Analytics
- Leads (list, detail, new form)
- Feasibility, Entitlement
- Loans, Servicing/Draws
- Contacts, Documentation, About
- Login page

✅ **All Features**
- Server-side rendering (SSR)
- Dynamic routes (`/leads/[id]`)
- Server components
- Client components with interactivity
- Dark/light mode
- Responsive design
- Full navigation

✅ **Automatic Features**
- HTTPS (free SSL)
- Global CDN
- Automatic builds on git push
- Preview deployments for PRs
- Performance analytics

---

## Post-Deployment

### Get Your URL

After deployment completes, Vercel provides:
```
https://connect-2-0-<unique-id>.vercel.app
```

### Test All Pages

Visit these routes to verify deployment:
- `/login` - Login page
- `/home` - Dashboard home
- `/dashboard` - Executive KPIs
- `/leads` - Lead management
- `/docs` - Component documentation
- `/about` - Product information

### Share with Team

Your demo URL is permanent and can be shared immediately!

---

## Continuous Deployment

### Automatic Deploys

Every push to `main` branch automatically:
1. Triggers new build on Vercel
2. Runs tests and linting
3. Deploys to production
4. Updates your live URL

### Preview Deployments

Every pull request gets:
- Unique preview URL
- Comment on PR with link
- Isolated environment for testing

---

## Custom Domain (Optional)

### Add Your Domain

1. Go to Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add domain: `demo.blueprint.com`
4. Follow DNS configuration instructions

### DNS Configuration

Add these records to your DNS provider:

**CNAME Record:**
```
Name: demo
Type: CNAME
Value: cname.vercel-dns.com
TTL: 3600
```

Vercel automatically provisions SSL certificates!

---

## Monitoring & Analytics

### View Deployment Status

Dashboard: `https://vercel.com/dashboard`

### Performance Analytics

Vercel provides:
- Real User Monitoring (RUM)
- Core Web Vitals
- Page load times
- Geographic distribution

### View Logs

1. Go to project dashboard
2. Click **"Deployments"**
3. Select deployment
4. View **"Build Logs"** or **"Function Logs"**

---

## Costs

**Free Tier Includes:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Analytics
- 💰 **Cost: $0/month**

**Pro Tier** ($20/month):
- 1 TB bandwidth
- Advanced analytics
- Team collaboration
- Password protection
- Prioritized builds

---

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to deployment in Vercel dashboard
2. Click failed deployment
3. View **"Build Logs"**
4. Look for error messages

**Common issues:**
- Missing dependencies in package.json
- ESLint errors
- Environment variables not set

### Routes Not Working

**Verify root directory:**
- Must be set to `starter-kit` in Vercel project settings
- Go to Settings → General → Root Directory

### Slow Performance

**Check region:**
- Vercel auto-deploys to optimal regions
- View deployment regions in dashboard
- Upgrade to Pro for edge functions

---

## Comparison: Azure Static Web Apps vs Vercel

| Feature | Azure SWA | Vercel |
|---------|-----------|--------|
| Next.js App Router | ⚠️ Limited | ✅ Full Support |
| Server Components | ❌ No | ✅ Yes |
| Dynamic Routes | ⚠️ Limited | ✅ Yes |
| SSR/ISR | ❌ No | ✅ Yes |
| Free Tier | ✅ Good | ✅ Excellent |
| Setup Time | ~10 min | ~2 min |
| Best For | Static sites | Next.js apps |

**Verdict:** Vercel is the better choice for this Next.js application.

---

## Next Steps

1. ✅ Deploy to Vercel (2 minutes)
2. ✅ Share URL with your team
3. ✅ Test all 17 pages
4. ✅ Show off the component library
5. ✅ Collect feedback for iteration

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Community**: https://github.com/vercel/vercel/discussions

---

**Ready to Deploy!** 🚀

Follow the steps above to get Connect 2.0 live on Vercel within minutes.
