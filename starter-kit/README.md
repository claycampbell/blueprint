# Connect 2.0 - Blueprint Development Platform

Next-generation platform for residential construction lending and development management.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📦 What's Built

### Pages (17 total)
- **Home** - Personalized dashboard for Sarah Johnson
- **Dashboard** - Executive KPIs and analytics
- **Analytics** - Module-specific charts and metrics
- **Leads** - Lead management (list, detail, new form)
- **Feasibility** - Project analysis workflow
- **Entitlement** - Kanban board for permitting
- **Loans** - Loan management interface
- **Servicing/Draws** - Draw review workflow
- **Contacts** - CRM functionality
- **Documentation** - Component library reference
- **About** - Product vision and details
- **Login** - Authentication page

### Shared Components (6)
- DataTable
- StatusBadge
- DocumentUpload
- TimelineActivity
- NotificationToast

### Tech Stack
- **Framework**: Next.js 15.5.6
- **UI Library**: Material-UI v6.2.1
- **Styling**: Tailwind CSS 3.4.17
- **Charts**: Recharts 3.4.1
- **Icons**: Remix Icon

## 🌐 Deploy to Azure

See [AZURE_DEPLOYMENT.md](../AZURE_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

```bash
# Run the deployment script
chmod +x ../deploy-to-azure.sh
../deploy-to-azure.sh
```

Or use Azure Portal (recommended):
1. Go to [Azure Portal](https://portal.azure.com)
2. Create new **Static Web App**
3. Connect GitHub repository
4. Set build config:
   - App location: `/starter-kit`
   - Output location: `.next`
5. Deploy!

## 📊 Project Structure

```
starter-kit/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Main app pages
│   │   │   ├── home/
│   │   │   ├── dashboard/
│   │   │   ├── analytics/
│   │   │   ├── leads/
│   │   │   ├── feasibility/
│   │   │   ├── entitlement/
│   │   │   ├── loans/
│   │   │   ├── servicing/
│   │   │   ├── contacts/
│   │   │   ├── docs/             # Component documentation
│   │   │   └── about/
│   │   └── (blank-layout-pages)/ # Login, etc.
│   ├── components/
│   │   ├── layout/               # Header, Footer, Navigation
│   │   └── shared/               # Reusable components
│   ├── @core/                    # Core utilities
│   └── assets/                   # Images, icons, styles
├── public/                       # Static assets
└── package.json
```

## 🎨 Features

### UI Components
- 📝 Forms with validation
- 📊 Interactive charts and graphs
- 📋 Data tables with sorting/filtering
- 🎯 Kanban boards for workflows
- 📱 Fully responsive design
- 🌓 Dark/light mode support
- 🔔 Notifications and alerts
- 📄 Document upload with drag-and-drop

### Data Features
- 160+ mock data records
- Realistic Seattle/Phoenix property data
- Complete workflow examples
- Status tracking across all modules

## 🔧 Development

### Scripts

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
```

### Environment

- Node.js 18+ recommended
- npm 9+ or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

## 📚 Documentation

- **Component Docs**: Visit `/docs` page in the app
- **PRD**: See `../PRODUCT_REQUIREMENTS_DOCUMENT.md`
- **Deployment**: See `../AZURE_DEPLOYMENT.md`

## 🏗️ Architecture

### Next.js App Router
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- File-based routing

### Component Pattern
- Client components for interactivity (`'use client'`)
- Server components for data fetching
- Shared components for reusability

### State Management
- React hooks (useState, useEffect)
- Context API for global state
- Local state for UI interactions

## 🎯 Current Status

✅ **Complete**
- All 17 pages built and functional
- Navigation fully wired
- Blueprint branding applied
- Custom logo created
- ESLint errors fixed
- Production build passing
- Console errors resolved

📋 **Next Steps**
- Backend API integration
- Authentication implementation
- Real-time data connections
- Advanced form validation
- Testing suite

## 📞 Support

For questions or issues:
1. Check the `/docs` page in the app
2. Review `AZURE_DEPLOYMENT.md`
3. Contact the development team

## 📄 License

Commercial - Blueprint/Datapage © 2024

---

**Built with ❤️ for Blueprint by the Connect 2.0 Team**
