'use client'

// React Imports
import { ReactNode } from 'react'

// MUI Imports
import Zoom from '@mui/material/Zoom'
import { styled } from '@mui/material/styles'
import useScrollTrigger from '@mui/material/useScrollTrigger'

// Styled Component
const ScrollToTopStyled = styled('div')(({ theme }) => ({
  zIndex: 'var(--mui-zIndex-fab)',
  position: 'fixed',
  insetInlineEnd: theme.spacing(10),
  insetBlockEnd: theme.spacing(14)
}))

// Type Definitions
interface ScrollToTopProps {
  children: ReactNode
  className?: string
}

/**
 * ScrollToTop Component
 *
 * A scroll-to-top button that appears when the user scrolls down the page.
 * Features:
 * - Shows after scrolling 400px down
 * - Smooth scroll animation to top
 * - Fixed position bottom-right
 * - Zoom transition animation
 * - Accessible with proper ARIA role
 *
 * @param props - Component props
 * @returns Scroll to top button component
 */
const ScrollToTop = ({ children, className }: ScrollToTopProps) => {
  // Hooks
  // Initialize scroll trigger - shows button after scrolling 400px
  const trigger = useScrollTrigger({
    threshold: 400,
    disableHysteresis: true
  })

  /**
   * Handles click event to scroll to top
   * Uses smooth scrolling behavior for better UX
   */
  const handleClick = (): void => {
    const anchor = document.querySelector('body')

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Zoom in={trigger}>
      <ScrollToTopStyled className={className} onClick={handleClick} role='presentation'>
        {children}
      </ScrollToTopStyled>
    </Zoom>
  )
}

export default ScrollToTop
