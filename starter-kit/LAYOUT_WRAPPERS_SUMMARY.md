# Layout Wrappers Summary

## Executive Summary

The Next.js starter-kit already contains **fully implemented** layout wrapper components. These components provide a complete multi-layout system supporting both vertical (sidebar) and horizontal (top navigation) layouts with dynamic switching capabilities.

## Status: COMPLETE

All three primary layout wrapper components exist and are fully functional:

1. **LayoutWrapper.jsx** - Main layout orchestrator
2. **VerticalLayout.jsx** - Vertical layout assembly
3. **HorizontalLayout.jsx** - Horizontal layout assembly

## Layout Wrapper Components

### 1. LayoutWrapper (`src/@layouts/LayoutWrapper.jsx`)

**Status:** Implemented and working

**Type:** Client Component (`'use client'`)

**Functionality:**
- Determines which layout to render based on user settings
- Reads layout preference from settings context (persisted in cookies)
- Initializes layout system on mount
- Applies skin attribute for theming

**Key Features:**
- Dynamic layout switching without page reload
- Settings-driven architecture
- Cookie persistence for user preferences
- Supports system color mode detection

**Code Structure:**
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

**Integration Point:**
Used in `src/app/(dashboard)/layout.jsx` to wrap the entire dashboard application.

---

### 2. VerticalLayout (`src/@layouts/VerticalLayout.jsx`)

**Status:** Implemented and working

**Type:** Server Component (default)

**Functionality:**
- Assembles vertical layout structure
- Combines Navigation (sidebar) + Navbar (top bar) + Content + Footer
- Provides responsive sidebar with collapse/expand states
- Uses styled wrappers for proper spacing

**Key Features:**
- Left sidebar navigation
- Top navbar above content
- Content area with compact/wide modes
- Bottom footer
- Responsive design (desktop/tablet/mobile)
- Semantic CSS classes

**Layout Structure:**
```
┌─────────────────────────────────────┐
│  Navigation  │  Navbar              │
│  (Sidebar)   ├──────────────────────┤
│              │  Content (children)  │
│              ├──────────────────────┤
│              │  Footer              │
└─────────────────────────────────────┘
```

**Code Structure:**
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

**Integration Point:**
Receives Navigation, Navbar, and Footer components as props from dashboard layout.

---

### 3. HorizontalLayout (`src/@layouts/HorizontalLayout.jsx`)

**Status:** Implemented and working

**Type:** Server Component (default)

**Functionality:**
- Assembles horizontal layout structure
- Full-width header with integrated navigation
- Content area with responsive width settings
- Wraps in HorizontalNavProvider for state management

**Key Features:**
- Full-width header
- Horizontal navigation menu
- Content area with compact/wide modes
- Bottom footer
- Responsive design (navigation moves below header on mobile)
- Navigation state context

**Layout Structure:**
```
┌─────────────────────────────────────┐
│  Header (Navbar + Navigation)       │
├─────────────────────────────────────┤
│  Content (children)                 │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

**Code Structure:**
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

**Integration Point:**
Receives Header and Footer components as props from dashboard layout.

---

## Component Integration

### How Layout Wrappers Compose Layout Pieces

The layout wrappers act as assembly components that compose individual layout pieces:

#### Vertical Layout Composition

```jsx
<VerticalLayout
  navigation={<Navigation mode={mode} />}  // Sidebar component
  navbar={<Navbar />}                      // Top navbar component
  footer={<VerticalFooter />}              // Footer component
>
  {children}                                // Page content
</VerticalLayout>
```

**Individual Pieces:**
- **Navigation** (`src/components/layout/vertical/Navigation.jsx`) - Sidebar with logo, menu items, collapse toggle
- **Navbar** (`src/components/layout/vertical/Navbar.jsx`) - Top bar with search, user menu, notifications
- **Footer** (`src/components/layout/vertical/Footer.jsx`) - Bottom footer with copyright and links
- **LayoutContent** (internal) - Wraps children with proper styling

#### Horizontal Layout Composition

```jsx
<HorizontalLayout
  header={<Header />}              // Full-width header component
  footer={<HorizontalFooter />}    // Footer component
>
  {children}                        // Page content
</HorizontalLayout>
```

**Individual Pieces:**
- **Header** (`src/components/layout/horizontal/Header.jsx`) - Contains navbar + horizontal navigation
- **Footer** (`src/components/layout/horizontal/Footer.jsx`) - Bottom footer with copyright and links
- **LayoutContent** (internal) - Wraps children with proper styling

---

## Supporting Components

### Layout Content Wrappers

Both layouts include specialized content wrappers:

**Vertical LayoutContent** (`src/@layouts/components/vertical/LayoutContent.jsx`):
- Client component
- Reads content width settings (compact/wide)
- Wraps children in StyledMain
- Applies semantic CSS classes

**Horizontal LayoutContent** (`src/@layouts/components/horizontal/LayoutContent.jsx`):
- Client component
- Similar to vertical but includes layout padding
- Same compact/wide mode support

### Styled Components

**StyledMain** (`src/@layouts/styles/shared/StyledMain.jsx`):
- Shared styled component for main content area
- Handles padding, compact max-width, fixed height content
- Used by both vertical and horizontal layouts

**StyledContentWrapper**:
- Vertical version: `src/@layouts/styles/vertical/StyledContentWrapper.jsx`
- Horizontal version: `src/@layouts/styles/horizontal/StyledContentWrapper.jsx`
- Provides flex layout and responsive behavior

**StyledHeader** (Navbar wrapper):
- Vertical version: `src/@layouts/styles/vertical/StyledHeader.jsx`
- Horizontal version: `src/@layouts/styles/horizontal/StyledHeader.jsx`
- Handles fixed/static/floating modes, blur effects, positioning

**StyledFooter**:
- Vertical version: `src/@layouts/styles/vertical/StyledFooter.jsx`
- Horizontal version: `src/@layouts/styles/horizontal/StyledFooter.jsx`
- Handles fixed/static modes, content width

---

## Settings System

### Settings Context

**Provider:** `SettingsProvider` in `src/components/Providers.jsx`

**Hook:** `useSettings()` from `src/@core/hooks/useSettings.jsx`

**Settings Object:**
```javascript
{
  mode: 'system',              // 'system', 'light', 'dark'
  skin: 'default',             // 'default', 'bordered'
  semiDark: false,             // true, false
  layout: 'vertical',          // 'vertical', 'collapsed', 'horizontal'
  navbarContentWidth: 'compact', // 'compact', 'wide'
  contentWidth: 'compact',     // 'compact', 'wide'
  footerContentWidth: 'compact', // 'compact', 'wide'
  primaryColor: '#9155FD'      // Theme color
}
```

**Persistence:** Settings stored in `connect-2-blueprint` cookie

### Layout Switching

**Change Layout:**
```jsx
const { updateSettings } = useSettings()
updateSettings({ layout: 'horizontal' })
```

**Available Layouts:**
- `vertical` - Standard vertical with full sidebar
- `collapsed` - Collapsed sidebar (icons only)
- `horizontal` - Full-width header layout

---

## Configuration

### Theme Config (`src/configs/themeConfig.js`)

```javascript
const themeConfig = {
  templateName: 'Connect 2.0',
  homePageUrl: '/dashboard',
  settingsCookieName: 'connect-2-blueprint',
  mode: 'system',
  skin: 'default',
  semiDark: false,
  layout: 'vertical',
  layoutPadding: 24,
  compactContentWidth: 1440,
  navbar: {
    type: 'fixed',           // 'fixed', 'static'
    contentWidth: 'compact', // 'compact', 'wide'
    floating: false,         // Vertical layout only
    detached: true,          // Vertical layout only
    blur: true
  },
  contentWidth: 'compact',
  footer: {
    type: 'static',          // 'fixed', 'static'
    contentWidth: 'compact',
    detached: true           // Vertical layout only
  },
  disableRipple: false
}
```

---

## Next.js 15 Compatibility

### Server vs Client Components

**Server Components (No `'use client'`):**
- `VerticalLayout`
- `HorizontalLayout`
- Layout wrappers in `@layouts/components/` (navbar, footer bases)

**Client Components (`'use client'`):**
- `LayoutWrapper` - Uses settings context and hooks
- `LayoutContent` - Reads settings for content width
- `Navigation`, `Navbar`, `Footer` - Interactive, use hooks/context

### Async Layout Support

The dashboard layout is async to fetch server-side data:

```jsx
const Layout = async props => {
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return (
    <Providers>
      <LayoutWrapper systemMode={systemMode} ... />
    </Providers>
  )
}
```

---

## Responsive Behavior

### Vertical Layout Breakpoints

| Breakpoint | Sidebar | Navbar | Content |
|------------|---------|--------|---------|
| Desktop (>1200px) | Full (260px) | Spans remaining | Compact/Wide |
| Tablet (768-1200px) | Collapsed (71px) | Expands on hover | Full width |
| Mobile (<768px) | Hidden (overlay) | Full width | Full width |

### Horizontal Layout Breakpoints

| Breakpoint | Header | Navigation | Content |
|------------|--------|------------|---------|
| Desktop (>1200px) | Full width | Inline | Compact/Wide |
| Tablet (768-1200px) | Full width | Below header | Full width |
| Mobile (<768px) | Full width | Drawer menu | Full width |

---

## File Structure

```
src/@layouts/
├── LayoutWrapper.jsx              # Main layout orchestrator
├── VerticalLayout.jsx             # Vertical layout assembly
├── HorizontalLayout.jsx           # Horizontal layout assembly
├── BlankLayout.jsx                # Blank layout (login pages)
├── components/
│   ├── vertical/
│   │   ├── Navbar.jsx            # Vertical navbar wrapper
│   │   ├── Footer.jsx            # Vertical footer wrapper
│   │   └── LayoutContent.jsx     # Vertical content wrapper
│   └── horizontal/
│       ├── Header.jsx            # Horizontal header wrapper
│       ├── Navbar.jsx            # Horizontal navbar wrapper
│       ├── Footer.jsx            # Horizontal footer wrapper
│       └── LayoutContent.jsx     # Horizontal content wrapper
├── styles/
│   ├── shared/
│   │   └── StyledMain.jsx        # Shared main content styles
│   ├── vertical/
│   │   ├── StyledContentWrapper.jsx
│   │   ├── StyledHeader.jsx
│   │   └── StyledFooter.jsx
│   └── horizontal/
│       ├── StyledContentWrapper.jsx
│       ├── StyledHeader.jsx
│       └── StyledFooter.jsx
└── utils/
    └── layoutClasses.js          # CSS class constants
```

---

## Usage Example

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
    <Providers direction='ltr'>
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
      <ScrollToTop>
        <Button variant='contained'>
          <i className='ri-arrow-up-line' />
        </Button>
      </ScrollToTop>
    </Providers>
  )
}

export default Layout
```

---

## Key Features

1. **Dynamic Layout Switching:** Users can switch between vertical and horizontal layouts without page reload

2. **Settings Persistence:** Layout preferences stored in cookies and survive page refreshes

3. **Responsive Design:** Layouts adapt to different screen sizes with appropriate breakpoints

4. **Composable Architecture:** Layout wrappers compose individual pieces (navigation, navbar, footer)

5. **Server + Client Components:** Optimized rendering with server components where possible

6. **Styled Components:** Emotion-based styled components for dynamic theming

7. **Semantic CSS Classes:** Consistent class naming for styling hooks

8. **Theme Integration:** Full Material-UI theme integration with custom color schemes

9. **Accessibility:** Semantic HTML and proper ARIA attributes

10. **Next.js 15 Compatible:** Works seamlessly with App Router and async layouts

---

## Documentation

For more detailed information, see:

- **[LAYOUT_ARCHITECTURE.md](LAYOUT_ARCHITECTURE.md)** - Complete architecture documentation
- **[LAYOUT_COMPONENT_HIERARCHY.md](LAYOUT_COMPONENT_HIERARCHY.md)** - Visual component tree and hierarchy

---

## Conclusion

The Next.js starter-kit contains a **complete and fully functional** layout wrapper system. All three primary layout wrapper components are implemented:

1. **LayoutWrapper** - Orchestrates layout selection based on user settings
2. **VerticalLayout** - Assembles sidebar + navbar + content + footer
3. **HorizontalLayout** - Assembles full-width header + content + footer

These components successfully compose individual layout pieces (Navigation, Navbar, Footer) and support:
- Dynamic layout switching
- Responsive design
- Settings persistence
- Server and client rendering
- Next.js 15 App Router compatibility

No additional layout wrapper components need to be created. The system is production-ready and fully integrated with the Next.js application.
