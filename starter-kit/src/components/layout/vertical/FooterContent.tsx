'use client'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
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
