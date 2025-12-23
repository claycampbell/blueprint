'use client'

// Component Imports
import Navigation from './Navigation'
import NavbarContent from './NavbarContent'
import Navbar from '@layouts/components/horizontal/Navbar'
import LayoutHeader from '@layouts/components/horizontal/Header'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

/**
 * Horizontal Header Component
 *
 * Renders the horizontal layout header containing:
 * - Navbar with logo, nav toggle, and user controls
 * - Navigation menu (positioned differently based on breakpoint)
 *
 * On larger screens: Navigation appears below the navbar
 * On smaller screens: Navigation appears as a separate row below header
 */
const Header = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <>
      <LayoutHeader>
        <Navbar>
          <NavbarContent />
        </Navbar>
        {!isBreakpointReached && <Navigation />}
      </LayoutHeader>
      {isBreakpointReached && <Navigation />}
    </>
  )
}

export default Header
