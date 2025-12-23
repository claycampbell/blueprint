'use client'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

/**
 * Horizontal Footer Content Component
 *
 * Renders the content of the horizontal footer:
 * - Copyright notice with current year and Blueprint branding
 * - Platform name (hidden on smaller screens)
 *
 * Responsive behavior:
 * - Full content displayed on desktop
 * - Platform branding hidden on mobile (isBreakpointReached)
 */
const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div
      className={classnames(horizontalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()} Blueprint`}</span>
      </p>
      {!isBreakpointReached && (
        <div className='flex items-center gap-4'>
          <span className='text-textSecondary'>Connect 2.0 Platform</span>
        </div>
      )}
    </div>
  )
}

export default FooterContent
