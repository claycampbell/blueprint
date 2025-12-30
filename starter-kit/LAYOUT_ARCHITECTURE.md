# Next.js Starter-Kit Layout Architecture

## Overview

The Next.js starter-kit implements a sophisticated multi-layout system with three primary layout wrapper components that compose individual layout pieces. The architecture supports both **Vertical Layout** (sidebar navigation) and **Horizontal Layout** (top navigation) with dynamic switching based on user settings.

## Layout Wrapper Components

### 1. LayoutWrapper (`src/@layouts/LayoutWrapper.jsx`)

**Purpose:** Main layout orchestrator that determines which layout to render based on user settings.

**Type:** Client Component (`'use client'`)

**Key Features:**
- Reads layout preference from `useSettings()` hook (stored in cookie)
- Switches between vertical and horizontal layouts dynamically
- Initializes layout system with `useLayoutInit()` hook
- Applies skin attribute (`data-skin`) for theming

**Props:**
- `systemMode`: System color mode (light/dark)
- `verticalLayout`: Rendered vertical layout component
- `horizontalLayout`: Rendered horizontal layout component

**Usage Example (from `src/app/(dashboard)/layout.jsx`):**
```jsx
<LayoutWrapper
  systemMode={systemMode}
  verticalLayout={
    <VerticalLayout
      navigation={<Navigation mode={mode} />}
      navbar={<Navbar />}
      footer={<VerticalFooter />}
    >
      {children}
    </VerticalLayout>
  }
  horizontalLayout={
    <HorizontalLayout
      header={<Header />}
      footer={<HorizontalFooter />}
    >
      {children}
    </HorizontalLayout>
  }
/>
```

**Implementation:**
```jsx
const LayoutWrapper = props => {
  const { systemMode, verticalLayout, horizontalLayout } = props
  const { settings } = useSettings()

  useLayoutInit(systemMode)

  return (
    <div className='flex flex-col flex-auto' data-skin={settings.skin}>
      {settings.layout === 'horizontal' ? horizontalLayout : verticalLayout}
    </div>
  )
}
```

---

### 2. VerticalLayout (`src/@layouts/VerticalLayout.jsx`)

**Purpose:** Assembles the vertical layout structure (sidebar + navbar + content + footer).

**Type:** Server Component (default)

**Key Features:**
- Combines Navigation (sidebar) + Navbar (top bar) + Content + Footer
- Responsive sidebar with collapse/expand states
- Uses styled wrapper for proper spacing and alignment
- Applies semantic CSS classes for styling hooks

**Props:**
- `navbar`: Top navbar component (rendered above content)
- `footer`: Footer component (rendered below content)
- `navigation`: Left sidebar navigation component
- `children`: Main content area (pages)

**Structure:**
```
┌─────────────────────────────────────┐
│  Navigation (Sidebar)  │            │
│  - Logo                │  Navbar    │
│  - Menu items          │            │
│  - Collapse toggle     ├────────────┤
│                        │            │
│                        │  Content   │
│                        │  (children)│
│                        │            │
│                        ├────────────┤
│                        │  Footer    │
└─────────────────────────────────────┘
```

**Implementation:**
```jsx
const VerticalLayout = props => {
  const { navbar, footer, navigation, children } = props

  return (
    <div className={classnames(verticalLayoutClasses.root, 'flex flex-auto')}>
      {navigation || null}
      <StyledContentWrapper className={classnames(
        verticalLayoutClasses.contentWrapper,
        'flex flex-col min-is-0 is-full'
      )}>
        {navbar || null}
        <LayoutContent>{children}</LayoutContent>
        {footer || null}
      </StyledContentWrapper>
    </div>
  )
}
```

**CSS Classes Applied:**
- `ts-vertical-layout` (root)
- `ts-vertical-layout-content-wrapper`
- Additional classes for navbar, content, footer states (fixed, floating, detached, etc.)

---

### 3. HorizontalLayout (`src/@layouts/HorizontalLayout.jsx`)

**Purpose:** Assembles the horizontal layout structure (header + content + footer).

**Type:** Server Component (default)

**Key Features:**
- Full-width header with integrated navigation
- Content area with responsive width settings
- Wraps in `HorizontalNavProvider` for navigation state management
- Cleaner structure without sidebar

**Props:**
- `header`: Full-width header component (contains navbar + navigation)
- `footer`: Footer component
- `children`: Main content area (pages)

**Structure:**
```
┌─────────────────────────────────────┐
│  Header (Full Width)                │
│  - Logo + Navbar + Navigation       │
├─────────────────────────────────────┤
│                                     │
│  Content (children)                 │
│                                     │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

**Implementation:**
```jsx
const HorizontalLayout = props => {
  const { header, footer, children } = props

  return (
    <div className={classnames(horizontalLayoutClasses.root, 'flex flex-auto')}>
      <HorizontalNavProvider>
        <StyledContentWrapper className={classnames(
          horizontalLayoutClasses.contentWrapper,
          'flex flex-col is-full'
        )}>
          {header || null}
          <LayoutContent>{children}</LayoutContent>
          {footer || null}
        </StyledContentWrapper>
      </HorizontalNavProvider>
    </div>
  )
}
```

**CSS Classes Applied:**
- `ts-horizontal-layout` (root)
- `ts-horizontal-layout-content-wrapper`
- Additional classes for header, navbar, content, footer states

---

## Component Integration

### Layout Content Components

Both layouts use specialized `LayoutContent` components that wrap the main page content:

**VerticalLayout Content** (`src/@layouts/components/vertical/LayoutContent.jsx`):
- Client component that reads content width settings
- Supports `compact` (1440px max-width) and `wide` modes
- Applies `StyledMain` with semantic classes

**HorizontalLayout Content** (`src/@layouts/components/horizontal/LayoutContent.jsx`):
- Similar to vertical but includes padding from `themeConfig.layoutPadding`
- Same compact/wide mode support

### Individual Layout Pieces

#### Vertical Layout Components

**Navigation** (`src/components/layout/vertical/Navigation.jsx`):
- Sidebar with logo, menu, and collapse toggle
- Uses `VerticalNav` from `@menu/vertical-menu`
- Supports semi-dark mode for light themes
- Scroll shadow effect on menu scroll
- Responsive collapse behavior

**Navbar** (`src/components/layout/vertical/Navbar.jsx`):
- Top bar above content area
- Wraps `NavbarContent` (user menu, notifications, search, etc.)
- Uses `@layouts/components/vertical/Navbar` wrapper with styles

**Footer** (`src/components/layout/vertical/Footer.jsx`):
- Bottom footer below content
- Wraps `FooterContent` (copyright, links)
- Uses `@layouts/components/vertical/Footer` wrapper

#### Horizontal Layout Components

**Header** (`src/components/layout/horizontal/Header.jsx`):
- Full-width header containing navbar + navigation
- Responsive: Moves navigation below header on mobile
- Uses `@layouts/components/horizontal/Header` wrapper

**Navbar** (`src/@layouts/components/horizontal/Navbar.jsx`):
- Simpler than vertical (no scroll triggers)
- Just a flex container for navbar content

**Footer** (`src/components/layout/horizontal/Footer.jsx`):
- Similar to vertical footer
- Uses horizontal-specific styled wrapper

---

## Settings and Configuration

### Theme Configuration (`src/configs/themeConfig.js`)

```javascript
const themeConfig = {
  templateName: 'Connect 2.0',
  homePageUrl: '/dashboard',
  settingsCookieName: 'connect-2-blueprint',
  mode: 'system', // 'system', 'light', 'dark'
  skin: 'default', // 'default', 'bordered'
  semiDark: false,
  layout: 'vertical', // 'vertical', 'collapsed', 'horizontal'
  layoutPadding: 24,
  compactContentWidth: 1440,
  navbar: {
    type: 'fixed', // 'fixed', 'static'
    contentWidth: 'compact',
    floating: false,
    detached: true,
    blur: true
  },
  contentWidth: 'compact', // 'compact', 'wide'
  footer: {
    type: 'static',
    contentWidth: 'compact',
    detached: true
  },
  disableRipple: false
}
```

### Settings Context (`src/@core/contexts/settingsContext.jsx`)

**Purpose:** Global state management for layout and theme settings.

**Features:**
- Persists settings to cookie (`connect-2-blueprint`)
- Provides `useSettings()` hook for components
- Supports page-level settings (not persisted)
- Includes settings reset functionality

**Available Settings:**
- `mode`: Color mode (system/light/dark)
- `skin`: UI skin (default/bordered)
- `semiDark`: Semi-dark sidebar in light mode
- `layout`: Layout type (vertical/collapsed/horizontal)
- `navbarContentWidth`: Navbar width (compact/wide)
- `contentWidth`: Content area width (compact/wide)
- `footerContentWidth`: Footer width (compact/wide)
- `primaryColor`: Primary theme color

**API:**
```jsx
const { settings, updateSettings, resetSettings, isSettingsChanged } = useSettings()

// Update layout
updateSettings({ layout: 'horizontal' })

// Update multiple settings
updateSettings({
  layout: 'vertical',
  contentWidth: 'wide',
  mode: 'dark'
})
```

---

## Layout Switching Flow

### User Changes Layout Setting

1. **User Action:** Clicks layout switcher in customizer
2. **Settings Update:** `updateSettings({ layout: 'horizontal' })` called
3. **Cookie Update:** Settings saved to `connect-2-blueprint` cookie
4. **State Update:** `SettingsContext` updates state
5. **Re-render:** `LayoutWrapper` re-renders with new layout
6. **Layout Swap:** Conditional renders new layout component

### Layout Selection Logic

```jsx
// In LayoutWrapper
{settings.layout === 'horizontal' ? horizontalLayout : verticalLayout}
```

**Vertical Layouts:**
- `settings.layout === 'vertical'` → Standard vertical with sidebar
- `settings.layout === 'collapsed'` → Collapsed sidebar (icons only)

**Horizontal Layout:**
- `settings.layout === 'horizontal'` → Full-width header layout

---

## Styled Components

### Shared Styled Components

**StyledMain** (`src/@layouts/styles/shared/StyledMain.jsx`):
- Main content area wrapper (both layouts)
- Handles content padding from `themeConfig.layoutPadding`
- Applies compact mode max-width constraint
- Manages fixed height content mode

```jsx
const StyledMain = styled.main`
  padding: ${themeConfig.layoutPadding}px;
  ${({ isContentCompact }) =>
    isContentCompact &&
    `
    margin-inline: auto;
    max-inline-size: ${themeConfig.compactContentWidth}px;
  `}
`
```

### Vertical Layout Styled Components

**StyledContentWrapper** (`src/@layouts/styles/vertical/StyledContentWrapper.jsx`):
- Wraps navbar + content + footer
- Handles sidebar offset and spacing

**StyledHeader** (`src/@layouts/styles/vertical/StyledHeader.jsx`):
- Navbar styling with fixed/static/floating variants
- Blur effect support
- Detached/attached positioning

**StyledFooter** (`src/@layouts/styles/vertical/StyledFooter.jsx`):
- Footer styling with fixed/static variants
- Detached/attached modes

### Horizontal Layout Styled Components

**StyledContentWrapper** (`src/@layouts/styles/horizontal/StyledContentWrapper.jsx`):
- Full-width container for header + content + footer

**StyledHeader** (`src/@layouts/styles/horizontal/StyledHeader.jsx`):
- Full-width header with fixed/static variants
- Blur effect support

**StyledFooter** (`src/@layouts/styles/horizontal/StyledFooter.jsx`):
- Footer styling (similar to vertical but no detached mode)

---

## CSS Class System

### Layout Classes (`src/@layouts/utils/layoutClasses.js`)

Provides semantic CSS class names for styling hooks:

**Vertical Layout Classes:**
```javascript
export const verticalLayoutClasses = {
  root: 'ts-vertical-layout',
  contentWrapper: 'ts-vertical-layout-content-wrapper',
  header: 'ts-vertical-layout-header',
  headerFixed: 'ts-vertical-layout-header-fixed',
  headerStatic: 'ts-vertical-layout-header-static',
  headerFloating: 'ts-vertical-layout-header-floating',
  headerDetached: 'ts-vertical-layout-header-detached',
  headerAttached: 'ts-vertical-layout-header-attached',
  navbar: 'ts-vertical-layout-navbar',
  content: 'ts-vertical-layout-content',
  contentCompact: 'ts-vertical-layout-content-compact',
  contentWide: 'ts-vertical-layout-content-wide',
  footer: 'ts-vertical-layout-footer',
  // ... additional footer classes
}
```

**Horizontal Layout Classes:**
```javascript
export const horizontalLayoutClasses = {
  root: 'ts-horizontal-layout',
  contentWrapper: 'ts-horizontal-layout-content-wrapper',
  header: 'ts-horizontal-layout-header',
  navbar: 'ts-horizontal-layout-navbar',
  navigation: 'ts-horizontal-layout-navigation',
  content: 'ts-horizontal-layout-content',
  footer: 'ts-horizontal-layout-footer',
  // ... additional classes
}
```

**Common Classes:**
```javascript
export const commonLayoutClasses = {
  contentHeightFixed: 'ts-layout-content-height-fixed'
}
```

---

## Hooks

### useSettings Hook (`src/@core/hooks/useSettings.jsx`)

Provides access to settings context:

```jsx
import { useSettings } from '@core/hooks/useSettings'

const { settings, updateSettings, resetSettings } = useSettings()
```

### useLayoutInit Hook (`src/@core/hooks/useLayoutInit.js`)

Initializes layout system on first load:

**Responsibilities:**
- Detects system color preference
- Updates cookie with initial color mode
- Syncs MUI color scheme with settings
- Runs only on client-side

**Usage:**
```jsx
useLayoutInit(systemMode) // Called in LayoutWrapper
```

### Menu Hooks

**useVerticalNav** (`src/@menu/hooks/useVerticalNav.jsx`):
- Manages vertical sidebar state (collapsed, hovered, breakpoint)
- Provides collapse/expand functions

**useHorizontalNav** (`src/@menu/hooks/useHorizontalNav.jsx`):
- Manages horizontal navigation state
- Detects responsive breakpoints

---

## Responsive Behavior

### Vertical Layout

**Desktop (> 1200px):**
- Full sidebar visible
- Navbar spans remaining width
- Content area respects width settings (compact/wide)

**Tablet (768px - 1200px):**
- Sidebar collapses to icons
- Expands on hover
- Navbar adjusts accordingly

**Mobile (< 768px):**
- Sidebar hidden by default
- Toggle button shows overlay sidebar
- Navbar full-width

### Horizontal Layout

**Desktop (> 1200px):**
- Header with inline navigation menu
- Full navigation visible in header

**Tablet/Mobile (< 1200px):**
- Navigation moves below header
- Hamburger menu for navigation
- Uses vertical nav component in drawer

---

## Next.js 15 App Router Compatibility

### Server vs Client Components

**Server Components (default):**
- `VerticalLayout` - Static structure, no interactivity
- `HorizontalLayout` - Static structure (but wraps children in client provider)
- Layout components in `src/@layouts/components/` (navbar, footer wrappers)

**Client Components (`'use client'`):**
- `LayoutWrapper` - Uses hooks, needs client rendering
- `LayoutContent` - Reads settings context
- `Navigation` - Interactive sidebar
- `Navbar` components - Use scroll triggers, settings
- `Footer` components - Access settings context

### Async Layout Pattern

The dashboard layout is async to fetch server-side data:

```jsx
const Layout = async props => {
  const { children } = props

  const mode = await getMode()
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <LayoutWrapper systemMode={systemMode} ... />
    </Providers>
  )
}
```

### Context Providers

**SettingsProvider** (`src/components/Providers.jsx`):
- Wraps entire app
- Provides settings context to all components
- Uses cookies for SSR compatibility

**HorizontalNavProvider** (`@menu/contexts/horizontalNavContext.jsx`):
- Only wraps horizontal layout
- Manages horizontal navigation state
- Client-side only

---

## File Structure

```
starter-kit/src/
├── @layouts/                          # Layout system
│   ├── LayoutWrapper.jsx             # Main layout switcher
│   ├── VerticalLayout.jsx            # Vertical layout assembly
│   ├── HorizontalLayout.jsx          # Horizontal layout assembly
│   ├── BlankLayout.jsx               # Blank layout (login, etc.)
│   ├── components/
│   │   ├── vertical/
│   │   │   ├── Navbar.jsx            # Vertical navbar wrapper
│   │   │   ├── Footer.jsx            # Vertical footer wrapper
│   │   │   └── LayoutContent.jsx     # Vertical content wrapper
│   │   └── horizontal/
│   │       ├── Header.jsx            # Horizontal header wrapper
│   │       ├── Navbar.jsx            # Horizontal navbar wrapper
│   │       ├── Footer.jsx            # Horizontal footer wrapper
│   │       └── LayoutContent.jsx     # Horizontal content wrapper
│   ├── styles/
│   │   ├── shared/
│   │   │   └── StyledMain.jsx        # Main content styled component
│   │   ├── vertical/
│   │   │   ├── StyledContentWrapper.jsx
│   │   │   ├── StyledHeader.jsx
│   │   │   └── StyledFooter.jsx
│   │   └── horizontal/
│   │       ├── StyledContentWrapper.jsx
│   │       ├── StyledHeader.jsx
│   │       └── StyledFooter.jsx
│   └── utils/
│       └── layoutClasses.js          # CSS class constants
│
├── components/layout/                 # Layout content components
│   ├── vertical/
│   │   ├── Navigation.jsx            # Sidebar navigation
│   │   ├── Navbar.jsx                # Top navbar
│   │   ├── NavbarContent.jsx         # Navbar content (user menu, etc.)
│   │   ├── Footer.jsx                # Footer
│   │   └── FooterContent.jsx         # Footer content
│   ├── horizontal/
│   │   ├── Header.jsx                # Full header
│   │   ├── Navigation.jsx            # Horizontal navigation
│   │   ├── NavbarContent.jsx         # Navbar content
│   │   ├── Footer.jsx                # Footer
│   │   └── FooterContent.jsx         # Footer content
│   └── shared/
│       ├── Logo.jsx                  # Logo component
│       └── ModeDropdown.jsx          # Color mode switcher
│
├── @core/
│   ├── contexts/
│   │   └── settingsContext.jsx       # Settings context provider
│   ├── hooks/
│   │   ├── useSettings.jsx           # Settings hook
│   │   ├── useLayoutInit.js          # Layout initialization
│   │   └── useObjectCookie.js        # Cookie management
│   └── utils/
│       └── serverHelpers.js          # Server-side utilities
│
├── configs/
│   ├── themeConfig.js                # Theme configuration
│   └── primaryColorConfig.js         # Color schemes
│
└── app/
    └── (dashboard)/
        └── layout.jsx                # Dashboard layout (uses wrappers)
```

---

## Usage Examples

### Basic Layout Implementation

```jsx
// app/(dashboard)/layout.jsx
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'

const Layout = async ({ children }) => {
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return (
    <Providers>
      <LayoutWrapper
        systemMode={systemMode}
        verticalLayout={
          <VerticalLayout
            navigation={<Navigation mode={mode} />}
            navbar={<Navbar />}
            footer={<VerticalFooter />}
          >
            {children}
          </VerticalLayout>
        }
        horizontalLayout={
          <HorizontalLayout
            header={<Header />}
            footer={<HorizontalFooter />}
          >
            {children}
          </HorizontalLayout>
        }
      />
    </Providers>
  )
}
```

### Custom Layout Settings

```jsx
// In a page component
'use client'
import { useEffect } from 'react'
import { useSettings } from '@core/hooks/useSettings'

export default function CustomPage() {
  const { updatePageSettings } = useSettings()

  // Override settings for this page only (not persisted)
  useEffect(() => {
    return updatePageSettings({
      contentWidth: 'wide',
      navbarContentWidth: 'wide'
    })
  }, [])

  return <div>Page content</div>
}
```

### Programmatic Layout Switch

```jsx
'use client'
import { useSettings } from '@core/hooks/useSettings'

export default function LayoutSwitcher() {
  const { settings, updateSettings } = useSettings()

  return (
    <div>
      <button onClick={() => updateSettings({ layout: 'vertical' })}>
        Vertical Layout
      </button>
      <button onClick={() => updateSettings({ layout: 'horizontal' })}>
        Horizontal Layout
      </button>
      <button onClick={() => updateSettings({ layout: 'collapsed' })}>
        Collapsed Sidebar
      </button>
    </div>
  )
}
```

---

## Key Takeaways

1. **Three-Layer Architecture:**
   - `LayoutWrapper`: Orchestrates layout selection
   - `VerticalLayout`/`HorizontalLayout`: Assemble layout structure
   - Individual components: Navigation, Navbar, Footer, etc.

2. **Settings-Driven:**
   - User preferences stored in cookies
   - Settings context provides global state
   - Dynamic layout switching without page reload

3. **Highly Composable:**
   - Layout wrappers accept components as props
   - Easy to swap implementations
   - Clean separation of concerns

4. **Next.js 15 Compatible:**
   - Server components by default
   - Client components only where needed
   - Async layout support for server data fetching

5. **Responsive & Accessible:**
   - Mobile-first design
   - Breakpoint-aware navigation
   - Semantic CSS classes for styling

6. **Fully Styled:**
   - Emotion-based styled components
   - Tailwind CSS utilities
   - Theme-aware with MUI integration

This layout system provides a robust foundation for building enterprise applications with flexible layout options and user-customizable interfaces.
