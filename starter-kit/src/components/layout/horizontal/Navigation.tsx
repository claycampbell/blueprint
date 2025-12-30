'use client'

// Third-party Imports
import styled from '@emotion/styled'
import classnames from 'classnames'

// Component Imports
import HorizontalMenu from './HorizontalMenu'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

// Styled component for navigation wrapper with responsive padding and width constraints
const StyledDiv = styled.div<{ isContentCompact: boolean; isBreakpointReached: boolean }>`
  ${({ isContentCompact, isBreakpointReached }) =>
    !isBreakpointReached &&
    `
    padding: ${themeConfig.layoutPadding}px;

    ${
      isContentCompact &&
      `
      margin-inline: auto;
      max-inline-size: ${themeConfig.compactContentWidth}px;
    `
    }
  `}
`

/**
 * Horizontal Navigation Component
 *
 * Renders the horizontal navigation menu with responsive behavior:
 * - On larger screens: Fixed horizontal menu bar with optional compact width
 * - On smaller screens: Mobile-friendly navigation (managed by HorizontalMenu)
 *
 * Layout behavior:
 * - Respects navbarContentWidth setting (compact vs full-width)
 * - Applies consistent padding from theme config
 * - Renders below the navbar in horizontal layout
 */
const Navigation = () => {
  // Hooks
  const { settings } = useSettings()
  const { isBreakpointReached } = useHorizontalNav()

  // Vars
  const headerContentCompact = settings.navbarContentWidth === 'compact'

  return (
    <div
      {...(!isBreakpointReached && {
        className: classnames(horizontalLayoutClasses.navigation, 'relative flex border-bs')
      })}
    >
      <StyledDiv
        isContentCompact={headerContentCompact}
        isBreakpointReached={isBreakpointReached}
        {...(!isBreakpointReached && {
          className: classnames(horizontalLayoutClasses.navigationContentWrapper, 'flex items-center is-full plb-2')
        })}
      >
        <HorizontalMenu />
      </StyledDiv>
    </div>
  )
}

export default Navigation
