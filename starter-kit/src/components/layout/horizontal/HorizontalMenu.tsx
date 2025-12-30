'use client'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Component Imports
import HorizontalNav, { Menu, MenuItem } from '@menu/horizontal-menu'
import VerticalNavContent from './VerticalNavContent'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledHorizontalNavExpandIcon from '@menu/styles/horizontal/StyledHorizontalNavExpandIcon'
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/horizontal/menuItemStyles'
import menuRootStyles from '@core/styles/horizontal/menuRootStyles'
import verticalMenuItemStyles from '@core/styles/vertical/menuItemStyles'
import verticalNavigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'

// Type definition for expand icon props
interface RenderExpandIconProps {
  level?: number
}

interface RenderVerticalExpandIconProps {
  open?: boolean
  transitionDuration?: number
}

/**
 * Horizontal expand icon for nested menu items
 */
const RenderExpandIcon = ({ level }: RenderExpandIconProps) => (
  <StyledHorizontalNavExpandIcon level={level}>
    <i className='ri-arrow-right-s-line' />
  </StyledHorizontalNavExpandIcon>
)

/**
 * Vertical expand icon for nested menu items (used in mobile drawer)
 */
const RenderVerticalExpandIcon = ({ open, transitionDuration }: RenderVerticalExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

/**
 * Horizontal Menu Component
 *
 * Renders the main navigation menu for horizontal layout:
 * - Desktop: Horizontal menu bar with dropdowns
 * - Mobile: Switches to vertical navigation drawer
 *
 * Menu Features:
 * - Multi-level nested menus
 * - Responsive breakpoint switching
 * - Custom styling per theme
 * - Icon support with remix icons
 *
 * Current Menu Items:
 * - Home (/)
 * - About (/about)
 *
 * Note: Additional menu items can be generated from menuData using GenerateHorizontalMenu
 */
const HorizontalMenu = () => {
  // Hooks
  const verticalNavOptions = useVerticalNav()
  const theme = useTheme()

  // Vars
  const { transitionDuration } = verticalNavOptions

  return (
    <HorizontalNav
      switchToVertical
      verticalNavContent={VerticalNavContent}
      verticalNavProps={{
        customStyles: verticalNavigationCustomStyles(verticalNavOptions, theme),
        backgroundColor: 'var(--mui-palette-background-default)'
      }}
    >
      <Menu
        rootStyles={menuRootStyles(theme)}
        renderExpandIcon={({ level }: RenderExpandIconProps) => <RenderExpandIcon level={level} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuItemStyles={menuItemStyles(theme, 'ri-circle-fill')}
        popoutMenuOffset={{
          mainAxis: ({ level }: { level?: number }) => (level && level > 0 ? 4 : 14),
          alignmentAxis: 0
        }}
        verticalMenuProps={{
          menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
          renderExpandIcon: ({ open }: { open?: boolean }) => (
            <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
          ),
          renderExpandedMenuItemIcon: { icon: <i className='ri-circle-fill' /> }
        }}
      >
        <MenuItem href='/' icon={<i className='ri-home-smile-line' />}>
          Home
        </MenuItem>
        <MenuItem href='/about' icon={<i className='ri-information-line' />}>
          About
        </MenuItem>
      </Menu>
      {/*
        Example: Dynamic menu generation from menuData
        <Menu
          rootStyles={menuRootStyles(theme)}
          renderExpandIcon={({ level }) => <RenderExpandIcon level={level} />}
          renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
          menuItemStyles={menuItemStyles(theme, 'ri-circle-fill')}
          popoutMenuOffset={{
            mainAxis: ({ level }) => (level && level > 0 ? 4 : 14),
            alignmentAxis: 0
          }}
          verticalMenuProps={{
            menuItemStyles: verticalMenuItemStyles(verticalNavOptions, theme),
            renderExpandIcon: ({ open }) => (
              <RenderVerticalExpandIcon open={open} transitionDuration={transitionDuration} />
            ),
            renderExpandedMenuItemIcon: { icon: <i className='ri-circle-fill' /> }
          }}
        >
          <GenerateHorizontalMenu menuData={menuData(dictionary)} />
        </Menu>
      */}
    </HorizontalNav>
  )
}

export default HorizontalMenu
