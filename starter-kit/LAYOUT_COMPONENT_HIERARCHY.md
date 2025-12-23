# Layout Component Hierarchy

## Visual Component Tree

### Complete Application Structure

```
app/(dashboard)/layout.jsx (async server component)
│
├─ Providers (client wrapper)
│   │
│   └─ SettingsProvider (provides settings context)
│       │
│       └─ LayoutWrapper (client component - layout switcher)
│           │
│           ├─ [IF settings.layout === 'vertical' or 'collapsed']
│           │   │
│           │   └─ VerticalLayout (server component)
│           │       │
│           │       ├─ Navigation (client component)
│           │       │   │
│           │       │   └─ VerticalNav (from @menu)
│           │       │       │
│           │       │       ├─ NavHeader
│           │       │       │   ├─ Logo
│           │       │       │   └─ NavCollapseIcons (toggle)
│           │       │       │
│           │       │       └─ VerticalMenu
│           │       │           └─ Menu items (generated from navigation data)
│           │       │
│           │       ├─ StyledContentWrapper
│           │       │   │
│           │       │   ├─ Navbar (client component)
│           │       │   │   │
│           │       │   │   └─ LayoutNavbar (styled wrapper)
│           │       │   │       │
│           │       │   │       └─ NavbarContent
│           │       │   │           ├─ NavToggle (mobile menu)
│           │       │   │           ├─ Search
│           │       │   │           ├─ ModeDropdown (light/dark)
│           │       │   │           └─ UserDropdown
│           │       │   │
│           │       │   ├─ LayoutContent (client component)
│           │       │   │   │
│           │       │   │   └─ StyledMain
│           │       │   │       │
│           │       │   │       └─ {children} (page content)
│           │       │   │
│           │       │   └─ Footer (client component)
│           │       │       │
│           │       │       └─ LayoutFooter (styled wrapper)
│           │       │           │
│           │       │           └─ FooterContent
│           │       │               ├─ Copyright
│           │       │               └─ Links
│           │       │
│           │       └─ ScrollToTop (floating button)
│           │
│           └─ [IF settings.layout === 'horizontal']
│               │
│               └─ HorizontalLayout (server component)
│                   │
│                   └─ HorizontalNavProvider (client context)
│                       │
│                       └─ StyledContentWrapper
│                           │
│                           ├─ Header (client component)
│                           │   │
│                           │   ├─ LayoutHeader (styled wrapper)
│                           │   │   │
│                           │   │   └─ Navbar (simple wrapper)
│                           │   │       │
│                           │   │       └─ NavbarContent
│                           │   │           ├─ Logo
│                           │   │           ├─ Search
│                           │   │           ├─ ModeDropdown
│                           │   │           └─ UserDropdown
│                           │   │
│                           │   └─ Navigation (if desktop)
│                           │       │
│                           │       └─ HorizontalNav
│                           │           │
│                           │           └─ HorizontalMenu
│                           │               └─ Menu items (horizontal)
│                           │
│                           ├─ Navigation (if mobile - below header)
│                           │
│                           ├─ LayoutContent (client component)
│                           │   │
│                           │   └─ StyledMain
│                           │       │
│                           │       └─ {children} (page content)
│                           │
│                           └─ Footer (client component)
│                               │
│                               └─ LayoutFooter (styled wrapper)
│                                   │
│                                   └─ FooterContent
│
└─ ScrollToTop (floating button)
```

---

## Component Type Legend

- **Server Component (default):** No `'use client'` directive - rendered on server
- **Client Component:** Has `'use client'` directive - interactive, uses hooks/context
- **Async Component:** Server component that can use `await` for data fetching

---

## Vertical Layout Structure (Detailed)

```
┌──────────────────────────────────────────────────────────────┐
│  VerticalLayout (server)                                     │
│  ┌────────────┬────────────────────────────────────────────┐ │
│  │            │  StyledContentWrapper                      │ │
│  │ Navigation │  ┌──────────────────────────────────────┐ │ │
│  │ (client)   │  │  Navbar (client)                     │ │ │
│  │            │  │  ┌────────────────────────────────┐  │ │ │
│  │ ┌────────┐ │  │  │  NavbarContent                │  │ │ │
│  │ │  Logo  │ │  │  │  • NavToggle (mobile)         │  │ │ │
│  │ └────────┘ │  │  │  • Search                     │  │ │ │
│  │            │  │  │  • ModeDropdown               │  │ │ │
│  │ ┌────────┐ │  │  │  • UserDropdown               │  │ │ │
│  │ │ Menu   │ │  │  └────────────────────────────────┘  │ │ │
│  │ │ Items  │ │  └──────────────────────────────────────┘ │ │
│  │ │        │ │  ┌──────────────────────────────────────┐ │ │
│  │ │ • Home │ │  │  LayoutContent (client)              │ │ │
│  │ │ • Dash │ │  │  ┌────────────────────────────────┐  │ │ │
│  │ │ • Apps │ │  │  │  StyledMain                    │  │ │ │
│  │ │ • Pages│ │  │  │  ┌──────────────────────────┐  │  │ │ │
│  │ └────────┘ │  │  │  │  {children}              │  │  │ │ │
│  │            │  │  │  │  (page content)          │  │  │ │ │
│  │ ┌────────┐ │  │  │  │                          │  │  │ │ │
│  │ │Collapse│ │  │  │  └──────────────────────────┘  │  │ │ │
│  │ │ Toggle │ │  │  └────────────────────────────────┘  │ │ │
│  │ └────────┘ │  └──────────────────────────────────────┘ │ │
│  │            │  ┌──────────────────────────────────────┐ │ │
│  │            │  │  Footer (client)                     │ │ │
│  │            │  │  ┌────────────────────────────────┐  │ │ │
│  │            │  │  │  FooterContent                │  │ │ │
│  │            │  │  │  • Copyright © 2025           │  │ │ │
│  │            │  │  │  • Privacy • Terms            │  │ │ │
│  │            │  │  └────────────────────────────────┘  │ │ │
│  │            │  └──────────────────────────────────────┘ │ │
│  └────────────┴────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## Horizontal Layout Structure (Detailed)

```
┌──────────────────────────────────────────────────────────────┐
│  HorizontalLayout (server)                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  HorizontalNavProvider (client context)                │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  StyledContentWrapper                            │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │  Header (client)                           │  │  │  │
│  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  LayoutHeader                        │  │  │  │  │
│  │  │  │  │  ┌────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Navbar                        │  │  │  │  │  │
│  │  │  │  │  │  ┌──────────────────────────┐  │  │  │  │  │  │
│  │  │  │  │  │  │  NavbarContent           │  │  │  │  │  │  │
│  │  │  │  │  │  │  • Logo                  │  │  │  │  │  │  │
│  │  │  │  │  │  │  • Search                │  │  │  │  │  │  │
│  │  │  │  │  │  │  • ModeDropdown          │  │  │  │  │  │  │
│  │  │  │  │  │  │  • UserDropdown          │  │  │  │  │  │  │
│  │  │  │  │  │  └──────────────────────────┘  │  │  │  │  │  │
│  │  │  │  │  └────────────────────────────────┘  │  │  │  │  │
│  │  │  │  │  ┌────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Navigation (horizontal)       │  │  │  │  │  │
│  │  │  │  │  │  • Home • Dashboard • Apps     │  │  │  │  │  │
│  │  │  │  │  └────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └──────────────────────────────────────┘  │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │  LayoutContent (client)                     │  │  │  │
│  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  StyledMain                          │  │  │  │  │
│  │  │  │  │  ┌────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  {children}                    │  │  │  │  │  │
│  │  │  │  │  │  (page content)                │  │  │  │  │  │
│  │  │  │  │  │                                │  │  │  │  │  │
│  │  │  │  │  │                                │  │  │  │  │  │
│  │  │  │  │  └────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └──────────────────────────────────────┘  │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │  Footer (client)                           │  │  │  │
│  │  │  │  ┌──────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  FooterContent                       │  │  │  │  │
│  │  │  │  │  • Copyright © 2025                  │  │  │  │  │
│  │  │  │  │  • Privacy • Terms                   │  │  │  │  │
│  │  │  │  └──────────────────────────────────────┘  │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Responsibilities

### Layout Wrappers

| Component | Type | Purpose | Key Props |
|-----------|------|---------|-----------|
| `LayoutWrapper` | Client | Layout orchestrator | `systemMode`, `verticalLayout`, `horizontalLayout` |
| `VerticalLayout` | Server | Vertical layout assembly | `navigation`, `navbar`, `footer`, `children` |
| `HorizontalLayout` | Server | Horizontal layout assembly | `header`, `footer`, `children` |

### Vertical Layout Components

| Component | Type | Purpose | Key Features |
|-----------|------|---------|--------------|
| `Navigation` | Client | Sidebar with menu | Logo, menu items, collapse toggle, semi-dark mode |
| `Navbar` | Client | Top navbar | Scroll trigger, blur effect, floating/detached modes |
| `NavbarContent` | Client | Navbar contents | Search, mode switcher, user dropdown, notifications |
| `Footer` | Client | Bottom footer | Copyright, links, detached/attached modes |
| `LayoutContent` | Client | Content wrapper | Compact/wide modes, padding management |

### Horizontal Layout Components

| Component | Type | Purpose | Key Features |
|-----------|------|---------|--------------|
| `Header` | Client | Full-width header | Navbar + navigation, responsive behavior |
| `Navbar` | Server | Simple navbar wrapper | Flex container for navbar content |
| `NavbarContent` | Client | Navbar contents | Logo, search, mode switcher, user dropdown |
| `Navigation` | Client | Horizontal menu | Top-level navigation, mobile drawer |
| `Footer` | Client | Bottom footer | Copyright, links |
| `LayoutContent` | Client | Content wrapper | Compact/wide modes, padding management |

### Styled Components

| Component | Purpose | Key Styling |
|-----------|---------|-------------|
| `StyledMain` | Main content area | Padding, compact max-width, fixed height support |
| `StyledContentWrapper` | Layout content container | Flex layout, min-width handling |
| `StyledHeader` | Header/navbar styling | Fixed/static/floating, blur, detached modes |
| `StyledFooter` | Footer styling | Fixed/static, detached modes, content width |

---

## Data Flow

### Settings Flow

```
User Action (click layout switcher)
    ↓
updateSettings({ layout: 'horizontal' })
    ↓
SettingsContext updates state
    ↓
Cookie 'connect-2-blueprint' updated
    ↓
LayoutWrapper re-renders
    ↓
Conditional renders new layout
    ↓
All child components receive new settings via useSettings()
```

### Layout Initialization Flow

```
App starts
    ↓
getMode() / getSystemMode() (server-side)
    ↓
Providers wraps app with SettingsProvider
    ↓
LayoutWrapper receives systemMode prop
    ↓
useLayoutInit(systemMode) detects user preference
    ↓
Updates cookie with initial mode
    ↓
Syncs MUI color scheme
    ↓
Layout renders with correct theme
```

### Navigation State Flow (Vertical)

```
User clicks collapse toggle
    ↓
updateSettings({ layout: 'collapsed' })
    ↓
Settings context updates
    ↓
Navigation component receives new settings
    ↓
useVerticalNav() returns new isCollapsed state
    ↓
Sidebar animates to collapsed state
    ↓
Content area expands to fill space
```

---

## Responsive Breakpoints

### Vertical Layout

| Breakpoint | Sidebar | Navbar | Content |
|------------|---------|--------|---------|
| Desktop (> 1200px) | Full width (260px) | Spans remaining | Compact/Wide based on settings |
| Tablet (768-1200px) | Collapsed (71px) | Expands on hover | Full width |
| Mobile (< 768px) | Hidden (overlay) | Full width | Full width |

### Horizontal Layout

| Breakpoint | Header | Navigation | Content |
|------------|--------|------------|---------|
| Desktop (> 1200px) | Full width | Inline in header | Compact/Wide based on settings |
| Tablet (768-1200px) | Full width | Below header | Full width |
| Mobile (< 768px) | Full width | Drawer menu | Full width |

---

## Context Usage

### SettingsContext

**Provided by:** `SettingsProvider` in `src/components/Providers.jsx`

**Consumed by:**
- `LayoutWrapper` - Reads `settings.layout` for layout switching
- `LayoutContent` - Reads `settings.contentWidth` for compact/wide mode
- `Navigation` - Reads `settings.semiDark`, `settings.layout` for sidebar state
- `Navbar` - Reads `settings.navbarContentWidth`
- `Footer` - Reads `settings.footerContentWidth`
- All customizer components

**API:**
```jsx
const {
  settings,           // Current settings object
  updateSettings,     // Update and persist settings
  resetSettings,      // Reset to defaults
  isSettingsChanged,  // Boolean - are settings modified?
  updatePageSettings  // Update for current page only (not persisted)
} = useSettings()
```

### HorizontalNavProvider

**Provided by:** `HorizontalLayout` component

**Consumed by:**
- Horizontal navigation components
- Responsive menu toggle

**Purpose:** Manages horizontal navigation state (open/closed, breakpoint detection)

---

## CSS Class Naming Convention

All layout classes follow the pattern: `ts-{layout}-{element}-{variant}`

**Examples:**
- `ts-vertical-layout` - Vertical layout root
- `ts-vertical-layout-header-fixed` - Fixed header in vertical layout
- `ts-horizontal-layout-navbar` - Navbar in horizontal layout
- `ts-layout-content-height-fixed` - Common class for fixed height content

**Usage:**
```jsx
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

<div className={classnames(
  verticalLayoutClasses.header,
  verticalLayoutClasses.headerFixed,
  verticalLayoutClasses.headerBlur
)}>
```

---

## Key Files Reference

| File | Purpose | Type |
|------|---------|------|
| `src/@layouts/LayoutWrapper.jsx` | Main layout switcher | Client |
| `src/@layouts/VerticalLayout.jsx` | Vertical layout assembly | Server |
| `src/@layouts/HorizontalLayout.jsx` | Horizontal layout assembly | Server |
| `src/@core/contexts/settingsContext.jsx` | Settings state management | Client |
| `src/@core/hooks/useSettings.jsx` | Settings hook | Client |
| `src/@core/hooks/useLayoutInit.js` | Layout initialization | Client |
| `src/@layouts/utils/layoutClasses.js` | CSS class constants | Shared |
| `src/configs/themeConfig.js` | Theme configuration | Shared |
| `src/app/(dashboard)/layout.jsx` | Dashboard layout implementation | Server (async) |

---

## Integration Points

### Adding a New Layout Variant

1. Create new layout component in `src/@layouts/`
2. Add CSS classes to `src/@layouts/utils/layoutClasses.js`
3. Create styled components in `src/@layouts/styles/`
4. Update `LayoutWrapper` with new conditional
5. Add layout option to settings context
6. Update theme config with new layout name

### Customizing Existing Layout

1. Locate component in hierarchy above
2. Check if it's server or client component
3. Modify component or create wrapper
4. Update styled components if needed
5. Test responsive behavior
6. Verify settings integration

### Adding New Navigation Items

1. Update navigation data in `src/data/navigation/`
2. Navigation automatically renders from data
3. Icons use Remix Icons (`ri-*` classes)
4. Supports nested menus and sections
5. Works in both vertical and horizontal layouts

---

## Best Practices

1. **Server Components by Default:** Only use `'use client'` when necessary (hooks, interactivity)
2. **Consistent CSS Classes:** Always use `layoutClasses` constants
3. **Settings-Aware:** Read from `useSettings()` for dynamic behavior
4. **Responsive Design:** Test all breakpoints
5. **Accessibility:** Use semantic HTML and ARIA attributes
6. **Performance:** Minimize client components, use server components when possible
7. **Type Safety:** Use TypeScript for new components (currently JSX for backwards compatibility)

---

This hierarchy demonstrates the clean separation of concerns and composability of the layout system, making it easy to customize, extend, and maintain.
