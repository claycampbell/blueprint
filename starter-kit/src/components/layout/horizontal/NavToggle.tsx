'use client'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

/**
 * Navigation Toggle Component
 *
 * Renders a hamburger menu icon that toggles the vertical navigation panel.
 * Only visible on mobile/smaller screens (isBreakpointReached).
 *
 * Behavior:
 * - Hidden on desktop (horizontal layout)
 * - Visible on mobile (triggers vertical navigation drawer)
 * - Uses remix icon font for menu icon
 *
 * Note: Uncomment the alternative code to show toggle on desktop as well.
 */
const NavToggle = () => {
  // Hooks
  const { toggleVerticalNav } = useVerticalNav()
  const { isBreakpointReached } = useHorizontalNav()

  // Toggle Vertical Nav
  const handleClick = () => {
    toggleVerticalNav()
  }

  return (
    <>
      {/* <i className='ri-menu-line text-xl' onClick={handleClick} /> */}
      {/* Comment following code and uncomment this code in order to toggle menu on desktop screens as well */}
      {isBreakpointReached && <i className='ri-menu-line text-xl cursor-pointer' onClick={handleClick} />}
    </>
  )
}

export default NavToggle
