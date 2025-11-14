# Materialize Next.js Admin Template - Development Guide for Claude

This guide provides comprehensive instructions for working with the Materialize Next.js Admin Template used in this repository.

## Repository Structure

The repository contains **two versions** of the template:

### 1. **full-version/** - Complete Admin Template
- Contains all pre-built pages, components, and features
- Includes authentication (NextAuth.js with Prisma)
- Pre-configured Redux store
- Full suite of UI components and examples
- Multiple dashboard variants (CRM, Analytics, eCommerce, etc.)
- Best for: Starting with reference implementations

### 2. **starter-kit/** - Minimal Starter
- Stripped-down version with core structure only
- No pre-built pages or authentication
- Minimal dependencies
- Clean slate for custom development
- Best for: Building from scratch with template styling

## Tech Stack

### Core Technologies
- **Framework**: Next.js 15.1.2 (App Router with Turbopack)
- **React**: 18.3.1
- **UI Library**: Material-UI (MUI) 6.2.1
- **Styling**:
  - Tailwind CSS 3.4.17
  - Emotion (CSS-in-JS)
  - MUI's sx prop and styled components
- **Language**: JavaScript (JSX) with JSConfig
- **Icons**: Iconify (dynamic icon loading)

### Full Version Additional Stack
- **Authentication**: NextAuth.js 4.24.11
- **Database ORM**: Prisma 5.22.0
- **State Management**: Redux Toolkit 2.5.0
- **Forms**: React Hook Form 7.54.1 + Valibot 0.42.1
- **Data Tables**: TanStack Table 8.20.6
- **Rich Text**: Tiptap 2.10.4
- **Charts**: ApexCharts 3.49.0 + Recharts 2.15.0
- **Calendars**: FullCalendar 6.1.15
- **Maps**: Mapbox GL 3.9.0

## Getting Started

### Initial Setup

```bash
# Navigate to the version you want to work with
cd full-version/   # OR cd starter-kit/

# Install dependencies (uses pnpm but npm/yarn work too)
npm install

# Copy environment variables
cp .env.example .env

# For full-version: Run database migrations
npm run migrate

# Start development server
npm run dev
```

The application will be available at **http://localhost:3000**

### Environment Variables

Key variables to configure in `.env`:

```bash
# Base path for deployment (leave empty for root)
BASEPATH=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth (full-version only)
NEXTAUTH_SECRET=<generate-secret>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-secret>

# Database (full-version only - Prisma)
DATABASE_URL=<your-database-connection-string>

# Mapbox (if using maps)
MAPBOX_ACCESS_TOKEN=<your-mapbox-token>
```

## Project Architecture

### Directory Structure Overview

```
src/
├── @core/              # Core template functionality (DO NOT MODIFY)
│   ├── components/     # Reusable core components
│   ├── contexts/       # React contexts (Settings, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # Core styling utilities
│   ├── theme/          # MUI theme configuration
│   └── utils/          # Helper functions
│
├── @layouts/           # Layout system (DO NOT MODIFY unless necessary)
│   ├── components/     # Layout-specific components
│   ├── styles/         # Layout styling
│   └── utils/          # Layout utilities
│
├── @menu/              # Navigation menu system (DO NOT MODIFY unless necessary)
│   ├── components/     # Menu components
│   ├── contexts/       # Menu state management
│   ├── vertical-menu/  # Vertical layout menu
│   └── horizontal-menu/# Horizontal layout menu
│
├── app/                # Next.js App Router (YOUR PRIMARY WORK AREA)
│   ├── [lang]/         # Internationalized routes (full-version)
│   │   ├── (dashboard)/        # Dashboard layout routes
│   │   ├── (blank-layout-pages)/ # Auth pages, errors, etc.
│   │   └── [...not-found]/     # 404 handling
│   ├── api/            # API routes (full-version)
│   ├── front-pages/    # Marketing/landing pages (full-version)
│   └── server/         # Server-side utilities (full-version)
│
├── components/         # Application-specific components (YOUR WORK AREA)
│   ├── layout/         # App-specific layout components
│   └── ...             # Custom components
│
├── views/              # Page view components (full-version)
│   ├── dashboards/     # Dashboard implementations
│   ├── apps/           # App pages (Email, Chat, Calendar, etc.)
│   ├── pages/          # Other pages
│   └── forms/          # Form examples
│
├── configs/            # Configuration files
│   ├── themeConfig.js  # Template settings
│   ├── i18n.js         # Internationalization config
│   └── primaryColorConfig.js # Theme colors
│
├── data/               # Static data and navigation
│   ├── navigation/     # Menu structure definitions
│   └── dictionaries/   # i18n translations (full-version)
│
├── contexts/           # App-specific React contexts
├── hooks/              # App-specific custom hooks
├── libs/               # Third-party library configurations
├── utils/              # Application utility functions
├── assets/             # Static assets (icons, images)
├── fake-db/            # Mock data (full-version)
├── prisma/             # Database schema (full-version)
└── redux-store/        # Redux store setup (full-version)
```

### Key Concepts

#### 1. **App Router Structure (Next.js 15)**

The template uses Next.js App Router with:
- **Route Groups**: `(dashboard)` and `(blank-layout-pages)` for different layouts
- **Dynamic Routes**: `[lang]` for internationalization
- **Server Components**: Default for all components
- **Client Components**: Marked with `'use client'` directive

#### 2. **Layout System**

Three main layout types controlled via `themeConfig.js`:
- **Vertical Layout** (default): Sidebar navigation
- **Horizontal Layout**: Top navigation bar
- **Collapsed Layout**: Minimized sidebar

Layouts are applied automatically based on route groups.

#### 3. **Theming System**

Multi-layered theming approach:
1. **MUI Theme**: Defined in `src/@core/theme/`
2. **Tailwind CSS**: Utility classes
3. **Theme Config**: `src/configs/themeConfig.js`
4. **Primary Colors**: `src/configs/primaryColorConfig.js`

Users can customize themes via:
- Cookie-based settings
- Customizer panel (top-right corner in full-version)
- System preference detection (light/dark mode)

#### 4. **Navigation System**

Navigation is data-driven via `src/data/navigation/`:
- `vertical.js` - Vertical menu structure
- `horizontal.js` - Horizontal menu structure

Menu items support:
- Icons (Iconify)
- Badges
- Nested submenus
- Access control
- External links

## Development Workflows

### Creating a New Page

#### Option 1: In Dashboard Layout (with sidebar/navbar)

```javascript
// Create: src/app/[lang]/(dashboard)/my-new-page/page.jsx

// Server Component (default)
import MyPageView from '@/views/my-new-page'

export const metadata = {
  title: 'My New Page',
  description: 'Page description'
}

export default function MyNewPage() {
  return <MyPageView />
}
```

```javascript
// Create: src/views/my-new-page/index.jsx

export default function MyPageView() {
  return (
    <div className="flex flex-col gap-4">
      <h1>My New Page</h1>
      {/* Your content */}
    </div>
  )
}
```

#### Option 2: In Blank Layout (auth pages, errors)

```javascript
// Create: src/app/[lang]/(blank-layout-pages)/my-auth-page/page.jsx

'use client' // If using client-side features

export default function MyAuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Auth form */}
    </div>
  )
}
```

### Adding Navigation Menu Items

Edit `src/data/navigation/vertical.js` or `horizontal.js`:

```javascript
{
  label: 'My New Page',
  href: '/my-new-page',
  icon: 'ri-file-text-line', // Iconify icon
  // Optional:
  badge: 'New',
  badgeColor: 'primary',
  children: [/* nested items */]
}
```

### Creating Components

#### MUI Component with Tailwind

```javascript
// src/components/MyComponent.jsx
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function MyComponent({ title }) {
  return (
    <Card className="shadow-lg">
      <CardContent className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {/* Content */}
      </CardContent>
    </Card>
  )
}
```

#### Using MUI's sx Prop

```javascript
<Card
  sx={{
    boxShadow: 3,
    '&:hover': {
      boxShadow: 6
    }
  }}
>
  {/* Content */}
</Card>
```

### Working with Forms (full-version)

```javascript
'use client'

import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const schema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8))
})

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema)
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextField
        {...register('email')}
        label="Email"
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        {...register('password')}
        type="password"
        label="Password"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </form>
  )
}
```

### Using Icons (Iconify)

The template uses dynamic icon loading via Iconify:

```javascript
import Icon from '@/components/Icon' // or from @core/components/Icon

// In your component:
<Icon icon="ri-home-line" fontSize={24} />
<Icon icon="mdi-account" color="primary" />
<Icon icon="tabler-bell" className="text-red-500" />
```

Find icons at: https://icon-sets.iconify.design/

### API Routes (full-version)

```javascript
// src/app/api/my-endpoint/route.js

import { NextResponse } from 'next/server'

export async function GET(request) {
  const data = { message: 'Hello' }
  return NextResponse.json(data)
}

export async function POST(request) {
  const body = await request.json()
  // Process body
  return NextResponse.json({ success: true })
}
```

### Database Operations (full-version with Prisma)

```javascript
// src/app/api/users/route.js

import { prisma } from '@/libs/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}

export async function POST(request) {
  const body = await request.json()
  const user = await prisma.user.create({
    data: body
  })
  return NextResponse.json(user)
}
```

### State Management (full-version with Redux)

```javascript
// src/redux-store/slices/mySlice.js

import { createSlice } from '@reduxjs/toolkit'

const mySlice = createSlice({
  name: 'myFeature',
  initialState: { items: [] },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload)
    }
  }
})

export const { addItem } = mySlice.actions
export default mySlice.reducer
```

```javascript
// In a component:
'use client'

import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '@/redux-store/slices/mySlice'

export default function MyComponent() {
  const dispatch = useDispatch()
  const items = useSelector(state => state.myFeature.items)

  const handleAdd = () => {
    dispatch(addItem({ id: 1, name: 'Item' }))
  }

  return <button onClick={handleAdd}>Add Item</button>
}
```

## Configuration Reference

### Theme Configuration (`src/configs/themeConfig.js`)

```javascript
{
  templateName: 'Materialize',
  homePageUrl: '/dashboards/crm',  // Default redirect
  settingsCookieName: 'materialize-mui-next-demo-1',
  mode: 'system',  // 'system' | 'light' | 'dark'
  skin: 'default', // 'default' | 'bordered'
  layout: 'vertical', // 'vertical' | 'collapsed' | 'horizontal'
  navbar: {
    type: 'fixed',        // 'fixed' | 'static'
    contentWidth: 'compact', // 'compact' | 'wide'
    floating: false,      // Visual floating effect
    detached: true,       // Detach from edges
    blur: true           // Backdrop blur effect
  },
  contentWidth: 'compact', // 'compact' (1440px max) | 'wide' (full width)
  footer: {
    type: 'static',       // 'fixed' | 'static'
    contentWidth: 'compact',
    detached: true
  }
}
```

### Internationalization (full-version)

Languages configured in `src/configs/i18n.js`:
- `en` - English (default)
- `fr` - French
- `ar` - Arabic (RTL support)

Translations stored in `src/data/dictionaries/[lang].json`

Access current language:
```javascript
import { useParams } from 'next/navigation'

export default function MyComponent() {
  const { lang } = useParams()
  // Use lang for translations
}
```

## NPM Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack

# Production
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier

# Icons
npm run build:icons     # Build Iconify icon bundle

# Database (full-version)
npm run migrate         # Run Prisma migrations

# Utilities
npm run removeI18n      # Remove i18n from project
```

## Best Practices for Development

### 1. **Don't Modify Core Files**
- Avoid editing files in `@core/`, `@layouts/`, and `@menu/` unless absolutely necessary
- These are template infrastructure and updates may overwrite changes
- Instead, extend or wrap core components

### 2. **Use the Proper Component Location**
- **Page logic**: `src/app/[lang]/(dashboard)/[page]/page.jsx`
- **Page view/UI**: `src/views/[page]/index.jsx`
- **Reusable components**: `src/components/[component]/`
- **App-specific utilities**: `src/utils/`

### 3. **Styling Approach**
- **Prefer Tailwind** for spacing, sizing, and basic styling
- **Use MUI's sx** for component-specific MUI theme integration
- **Use Emotion/styled** for complex component styling
- **Be consistent** within each component

### 4. **Server vs Client Components**
- **Default to Server Components** (no 'use client')
- **Add 'use client'** only when needed for:
  - React hooks (useState, useEffect, etc.)
  - Event handlers
  - Browser-only APIs
  - Third-party libraries requiring client-side

### 5. **Performance Considerations**
- Use dynamic imports for heavy components
- Optimize images with next/image
- Leverage React Server Components
- Minimize client-side JavaScript

### 6. **TypeScript Migration (Optional)**
Currently JavaScript, but can migrate:
- Rename `.jsx` → `.tsx` and `.js` → `.ts`
- Add TypeScript types incrementally
- Update `jsconfig.json` → `tsconfig.json`

## Common Patterns

### Protected Routes (full-version)

```javascript
// src/app/[lang]/(dashboard)/protected-page/page.jsx

import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <div>Protected Content</div>
}
```

### Data Fetching (Server Component)

```javascript
// src/app/[lang]/(dashboard)/users/page.jsx

async function getUsers() {
  const res = await fetch('https://api.example.com/users', {
    cache: 'no-store' // or 'force-cache' for static
  })
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

### Modal/Dialog Pattern

```javascript
'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'

export default function MyModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Modal Title</DialogTitle>
        <DialogContent>
          {/* Content */}
        </DialogContent>
      </Dialog>
    </>
  )
}
```

### Custom Hook Pattern

```javascript
// src/hooks/useMyData.js

'use client'

import { useState, useEffect } from 'react'

export function useMyData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/my-data')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
```

## Troubleshooting

### Common Issues

**1. Icons not displaying**
```bash
npm run build:icons
```

**2. Prisma client out of sync (full-version)**
```bash
npx prisma generate
```

**3. Module not found errors**
- Check path aliases in `jsconfig.json`
- Ensure imports use `@/` prefix for src files

**4. Hydration errors**
- Verify server/client component boundaries
- Check for browser-only code in server components

**5. Theme not updating**
- Clear browser cookies (Application → Cookies)
- Check `themeConfig.js` settings
- Use Customizer reset button

### Performance Tips

- Enable `turbopack` (already in dev script)
- Use static generation where possible
- Implement proper caching strategies
- Optimize bundle size with dynamic imports

## Integration with Blueprint/Connect 2.0

When adapting this template for the Connect 2.0 platform:

### 1. **Choose the Right Version**
- **Starter Kit**: Recommended for clean implementation
- **Full Version**: Use as reference for patterns

### 2. **Custom Navigation for Blueprint**
Update `src/data/navigation/vertical.js`:
```javascript
export default [
  {
    title: 'Lead Intake',
    icon: 'ri-file-add-line',
    href: '/lead-intake'
  },
  {
    title: 'Feasibility',
    icon: 'ri-search-line',
    children: [
      { title: 'Active Projects', href: '/feasibility/active' },
      { title: 'Due Diligence', href: '/feasibility/due-diligence' }
    ]
  },
  {
    title: 'Entitlement',
    icon: 'ri-government-line',
    href: '/entitlement'
  },
  // ... more Blueprint modules
]
```

### 3. **Theme Customization for Blueprint Brand**
Update `src/configs/primaryColorConfig.js`:
```javascript
const primaryColorConfig = {
  name: 'primary-1',
  light: '#YOUR_BRAND_COLOR',
  main: '#YOUR_BRAND_COLOR',
  dark: '#YOUR_BRAND_COLOR'
}
```

### 4. **API Integration Approach**
```javascript
// src/libs/api.js - Centralized API client

const API_BASE = process.env.NEXT_PUBLIC_API_URL

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`)
  return res.json()
}

export async function createLead(data) {
  const res = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}
```

### 5. **Authentication Setup (if using NextAuth)**
Configure for Azure AD or your chosen provider in:
```javascript
// src/app/api/auth/[...nextauth]/route.js
```

## Quick Reference

### File Structure Cheat Sheet
```
Need to...                          → Edit this file:
───────────────────────────────────────────────────────────────
Add a new page                      → src/app/[lang]/(dashboard)/[page]/page.jsx
Create page UI                      → src/views/[page]/index.jsx
Add menu item                       → src/data/navigation/vertical.js
Create API endpoint                 → src/app/api/[endpoint]/route.js
Change theme settings               → src/configs/themeConfig.js
Add custom component                → src/components/[component]/
Create custom hook                  → src/hooks/use[Hook].js
Update database schema (full)       → src/prisma/schema.prisma
Add Redux slice (full)              → src/redux-store/slices/[slice].js
Configure environment               → .env
```

### Import Aliases
```javascript
@/              → src/
@core/          → src/@core/
@layouts/       → src/@layouts/
@menu/          → src/@menu/
@assets/        → src/assets/
```

### Useful Resources
- **MUI Documentation**: https://mui.com/material-ui/
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Iconify Icons**: https://icon-sets.iconify.design/
- **Prisma Docs** (full-version): https://www.prisma.io/docs
- **NextAuth.js** (full-version): https://next-auth.js.org/

---

## Summary

This Materialize template provides a production-ready foundation with:
- ✅ Modern Next.js 15 App Router architecture
- ✅ Material-UI component library
- ✅ Tailwind CSS utility-first styling
- ✅ Flexible layout system (vertical/horizontal)
- ✅ Full authentication & database setup (full-version)
- ✅ Form handling, tables, charts, and more (full-version)
- ✅ Internationalization support
- ✅ Dark mode & theme customization

**Development Principle**: Build in `src/app/`, `src/views/`, and `src/components/`. Avoid modifying `@core/`, `@layouts/`, and `@menu/` directories.

For Blueprint/Connect 2.0 integration, focus on creating custom pages and components that leverage the template's layout and theming system while implementing your domain-specific business logic.
