'use client'

// React Imports
import { ReactNode } from 'react'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Data Imports
import verticalMenuData from '@/data/navigation/verticalMenuData'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

interface MenuItem {
  label: string
  href?: string
  icon?: string
  children?: MenuItem[]
}

interface RenderExpandIconProps {
  open?: boolean
  transitionDuration?: number
}

interface VerticalMenuProps {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const renderMenuItems = (menuData: MenuItem[]): ReactNode[] => {
  return menuData.map((item, index) => {
    // If item has children, render as SubMenu
    if (item.children && item.children.length > 0) {
      return (
        <SubMenu key={index} label={item.label} icon={item.icon ? <i className={item.icon} /> : undefined}>
          {renderMenuItems(item.children)}
        </SubMenu>
      )
    }

    // Otherwise, render as MenuItem
    return (
      <MenuItem key={index} href={item.href} icon={item.icon ? <i className={item.icon} /> : undefined}>
        {item.label}
      </MenuItem>
    )
  })
}

const VerticalMenu = ({ scrollMenu }: VerticalMenuProps) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar
  const menuData = verticalMenuData()

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {renderMenuItems(menuData)}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
