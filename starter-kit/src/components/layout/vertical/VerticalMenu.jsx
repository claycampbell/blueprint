// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
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
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href='/home' icon={<i className='ri-home-smile-line' />}>
          Home
        </MenuItem>
        <MenuItem href='/dashboard' icon={<i className='ri-dashboard-line' />}>
          Dashboard
        </MenuItem>
        <MenuItem href='/analytics' icon={<i className='ri-line-chart-line' />}>
          Analytics
        </MenuItem>
        <MenuItem href='/leads' icon={<i className='ri-user-search-line' />}>
          Leads
        </MenuItem>
        <MenuItem href='/leads/new' icon={<i className='ri-user-add-line' />}>
          New Lead
        </MenuItem>
        <MenuItem href='/feasibility' icon={<i className='ri-file-list-3-line' />}>
          Feasibility
        </MenuItem>
        <MenuItem href='/entitlement' icon={<i className='ri-government-line' />}>
          Entitlement
        </MenuItem>
        <MenuItem href='/loans' icon={<i className='ri-money-dollar-circle-line' />}>
          Loans
        </MenuItem>
        <MenuItem href='/servicing/draws' icon={<i className='ri-money-dollar-box-line' />}>
          Servicing - Draws
        </MenuItem>
        <MenuItem href='/contacts' icon={<i className='ri-contacts-line' />}>
          Contacts
        </MenuItem>
        <MenuItem href='/docs' icon={<i className='ri-book-2-line' />}>
          Documentation
        </MenuItem>
        <MenuItem href='/about' icon={<i className='ri-information-line' />}>
          About
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
