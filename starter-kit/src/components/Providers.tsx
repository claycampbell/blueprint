// React Imports
import type { ReactNode } from 'react'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

// Types
type Direction = 'ltr' | 'rtl'

type SystemMode = 'light' | 'dark'

interface SettingsCookie {
  mode?: 'light' | 'dark' | 'system'
  skin?: string
  semiDark?: boolean
  layout?: string
  navbarContentWidth?: string
  contentWidth?: string
  footerContentWidth?: string
  primaryColor?: string
}

interface ProvidersProps {
  children: ReactNode
  direction: Direction
}

/**
 * Providers Component
 *
 * Wraps the application with necessary context providers for Next.js 15 App Router.
 * This is a server component that fetches initial settings and mode from cookies.
 *
 * Providers included:
 * - VerticalNavProvider: Manages vertical navigation state (collapse, hover, toggle)
 * - SettingsProvider: Manages theme settings (mode, skin, colors, layout)
 * - ThemeProvider: MUI theme configuration with dark/light mode support
 *
 * @param props - Component props
 * @param props.children - Child components to wrap with providers
 * @param props.direction - Text direction ('ltr' or 'rtl')
 */
const Providers = async (props: ProvidersProps) => {
  // Props
  const { children, direction } = props

  // Fetch server-side settings
  const mode = await getMode()
  const settingsCookie: SettingsCookie = await getSettingsFromCookie()
  const systemMode: SystemMode = await getSystemMode()

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ThemeProvider direction={direction} systemMode={systemMode}>
          {children}
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default Providers
