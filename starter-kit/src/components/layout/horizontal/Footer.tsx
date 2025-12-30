// Component Imports
import LayoutFooter from '@layouts/components/horizontal/Footer'
import FooterContent from './FooterContent'

/**
 * Horizontal Footer Component
 *
 * Renders the horizontal layout footer with copyright information
 * and platform branding. Wraps the FooterContent component in the
 * layout-specific Footer wrapper.
 */
const Footer = () => {
  return (
    <LayoutFooter>
      <FooterContent />
    </LayoutFooter>
  )
}

export default Footer
