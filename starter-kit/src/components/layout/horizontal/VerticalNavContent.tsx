'use client'

// React Imports
import { useRef, type ReactNode } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { styled } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import NavHeader from '@menu/components/vertical-menu/NavHeader'
import Logo from '@components/layout/shared/Logo'
import NavCollapseIcons from '@menu/components/vertical-menu/NavCollapseIcons'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { mapHorizontalToVerticalMenu } from '@menu/utils/menuUtils'

// Styled component for shadow overlay at top of scrollable area
const StyledBoxForShadow = styled('div')(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(var(--mui-palette-background-default) ${theme.direction === 'rtl' ? '95%' : '5%'}, rgb(var(--mui-palette-background-defaultChannel) / 0.85) 30%, rgb(var(--mui-palette-background-defaultChannel) / 0.5) 65%, rgb(var(--mui-palette-background-defaultChannel) / 0.3) 75%, transparent)`,
  '&.scrolled': {
    opacity: 1
  }
}))

interface VerticalNavContentProps {
  children: ReactNode
}

/**
 * Vertical Navigation Content Component (for Horizontal Layout Mobile View)
 *
 * When the horizontal layout reaches the mobile breakpoint, the navigation
 * switches to a vertical drawer. This component provides the content for
 * that vertical drawer.
 *
 * Features:
 * - Logo and nav header
 * - Scroll shadow indicator
 * - Perfect scrollbar on desktop, native scroll on mobile
 * - Automatically converts horizontal menu items to vertical format
 *
 * Props:
 * - children: Horizontal menu items to be converted to vertical format
 */
const VerticalNavContent = ({ children }: VerticalNavContentProps) => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  // Refs
  const shadowRef = useRef<HTMLDivElement>(null)

  // Vars
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Handle scroll event to show/hide shadow
  const scrollMenu = (container: any, isPerfectScrollbar: boolean) => {
    container = isBreakpointReached || !isPerfectScrollbar ? container.target : container

    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current?.classList.contains('scrolled')) {
        shadowRef.current?.classList.add('scrolled')
      }
    } else {
      shadowRef.current?.classList.remove('scrolled')
    }
  }

  return (
    <>
      <NavHeader>
        <Link href='/'>
          <Logo />
        </Link>
        <NavCollapseIcons />
      </NavHeader>
      <StyledBoxForShadow ref={shadowRef} />
      <ScrollWrapper
        {...(isBreakpointReached
          ? {
              className: 'bs-full overflow-y-auto overflow-x-hidden',
              onScroll: (container: any) => scrollMenu(container, false)
            }
          : {
              options: { wheelPropagation: false, suppressScrollX: true },
              onScrollY: (container: any) => scrollMenu(container, true)
            })}
      >
        {mapHorizontalToVerticalMenu(children)}
      </ScrollWrapper>
    </>
  )
}

export default VerticalNavContent
