// Next Imports
import { cookies } from 'next/headers'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

// Third-party Imports
import 'server-only'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Type Definitions
export interface SettingsCookie {
  mode?: 'light' | 'dark' | 'system'
  skin?: 'default' | 'bordered'
  semiDark?: boolean
  layout?: 'vertical' | 'collapsed' | 'horizontal'
  navbar?: {
    type?: 'fixed' | 'static'
    contentWidth?: 'compact' | 'wide'
    floating?: boolean
    detached?: boolean
    blur?: boolean
  }
  contentWidth?: 'compact' | 'wide'
  footer?: {
    type?: 'fixed' | 'static'
    contentWidth?: 'compact' | 'wide'
    detached?: boolean
  }
}

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeSkin = 'default' | 'bordered'

/**
 * Server Helpers for Next.js 15
 *
 * This module provides server-side utility functions for handling theme settings,
 * cookies, and server-side rendering configurations in Next.js 15.
 *
 * All functions are async and designed to work with Next.js Server Components.
 */

/**
 * Gets theme settings from the cookie
 *
 * @returns {Promise<SettingsCookie>} Parsed settings object from cookie
 */
export const getSettingsFromCookie = async (): Promise<SettingsCookie> => {
  const cookieStore = await cookies()
  const cookieName = themeConfig.settingsCookieName

  const cookieValue = cookieStore.get(cookieName)?.value

  try {
    return cookieValue ? JSON.parse(cookieValue) : {}
  } catch (error) {
    console.error('Error parsing settings cookie:', error)
    return {}
  }
}

/**
 * Gets the theme mode from cookie or falls back to theme config
 *
 * @returns {Promise<ThemeMode>} The current theme mode
 */
export const getMode = async (): Promise<ThemeMode> => {
  const settingsCookie = await getSettingsFromCookie()

  // Get mode from cookie or fallback to theme config
  const mode = settingsCookie.mode || themeConfig.mode

  return mode as ThemeMode
}

/**
 * Gets the system mode based on user's color preference
 * If mode is 'system', returns the actual color preference (light/dark)
 *
 * @returns {Promise<'light' | 'dark'>} The resolved system mode
 */
export const getSystemMode = async (): Promise<'light' | 'dark'> => {
  const cookieStore = await cookies()
  const mode = await getMode()
  const colorPrefCookie = cookieStore.get('colorPref')?.value as 'light' | 'dark' | undefined

  const resolvedMode = mode === 'system' ? colorPrefCookie || 'light' : mode

  return resolvedMode === 'dark' ? 'dark' : 'light'
}

/**
 * Gets the server-side resolved mode
 * Returns the actual mode (light/dark) even if system mode is selected
 *
 * @returns {Promise<'light' | 'dark' | 'system'>} The server mode
 */
export const getServerMode = async (): Promise<ThemeMode> => {
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return mode === 'system' ? systemMode : mode
}

/**
 * Gets the theme skin from cookie or falls back to theme config
 *
 * @returns {Promise<ThemeSkin>} The current theme skin
 */
export const getSkin = async (): Promise<ThemeSkin> => {
  const settingsCookie = await getSettingsFromCookie()

  return (settingsCookie.skin || 'default') as ThemeSkin
}

/**
 * Gets a specific cookie value by name
 *
 * @param {string} name - Cookie name
 * @returns {Promise<string | undefined>} Cookie value or undefined if not found
 */
export const getCookie = async (name: string): Promise<string | undefined> => {
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value
}

/**
 * Checks if a cookie exists
 *
 * @param {string} name - Cookie name
 * @returns {Promise<boolean>} True if cookie exists
 */
export const hasCookie = async (name: string): Promise<boolean> => {
  const cookieStore = await cookies()
  return cookieStore.has(name)
}

/**
 * Gets all cookies
 *
 * @returns {Promise<ReadonlyRequestCookies>} All cookies
 */
export const getAllCookies = async (): Promise<ReadonlyRequestCookies> => {
  return await cookies()
}

/**
 * Safely parses a JSON cookie value
 *
 * @template T
 * @param {string} name - Cookie name
 * @param {T} defaultValue - Default value if cookie doesn't exist or parsing fails
 * @returns {Promise<T>} Parsed cookie value or default
 */
export const getJsonCookie = async <T,>(name: string, defaultValue: T): Promise<T> => {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(name)?.value

  if (!cookieValue) {
    return defaultValue
  }

  try {
    return JSON.parse(cookieValue) as T
  } catch (error) {
    console.error(`Error parsing JSON cookie '${name}':`, error)
    return defaultValue
  }
}

/**
 * Gets the current layout from settings
 *
 * @returns {Promise<'vertical' | 'collapsed' | 'horizontal'>} The current layout
 */
export const getLayout = async (): Promise<'vertical' | 'collapsed' | 'horizontal'> => {
  const settingsCookie = await getSettingsFromCookie()
  return (settingsCookie.layout || themeConfig.layout) as 'vertical' | 'collapsed' | 'horizontal'
}

/**
 * Gets the content width setting
 *
 * @returns {Promise<'compact' | 'wide'>} The content width setting
 */
export const getContentWidth = async (): Promise<'compact' | 'wide'> => {
  const settingsCookie = await getSettingsFromCookie()
  return (settingsCookie.contentWidth || themeConfig.contentWidth) as 'compact' | 'wide'
}
