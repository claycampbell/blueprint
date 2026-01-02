/**
 * Design system constants and theme configuration
 * Inspired by Linear, Notion, and Vercel design patterns
 */

export interface PhaseColorScheme {
  background: string;
  border: string;
  text: string;
  dot: string;
  label: string;
  icon: string;
}

/**
 * Lifecycle phase color schemes - Professional Construction Management Aesthetic
 * Clean, minimal design with status dots instead of emoji
 */
export const PHASE_COLORS: Record<string, PhaseColorScheme> = {
  intake: {
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#6b7280',
    dot: '#3b82f6',
    label: 'INTAKE',
    icon: '📥'
  },
  feasibility: {
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#6b7280',
    dot: '#f59e0b',
    label: 'FEASIBILITY',
    icon: '🔍'
  },
  entitlement: {
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#6b7280',
    dot: '#8b5cf6',
    label: 'ENTITLEMENT',
    icon: '📋'
  },
  construction: {
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#6b7280',
    dot: '#f97316',
    label: 'CONSTRUCTION',
    icon: '🏗️'
  },
  servicing: {
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#6b7280',
    dot: '#10b981',
    label: 'SERVICING',
    icon: '💰'
  },
  closed: {
    background: '#ffffff',
    border: '#e5e7eb',
    text: '#6b7280',
    dot: '#6b7280',
    label: 'CLOSED',
    icon: '✅'
  }
};

/**
 * Status indicator colors - Professional status dots
 */
export const STATUS_COLORS = {
  needsAttention: '#dc2626',  // Red
  atRisk: '#f59e0b',          // Amber
  onTrack: '#10b981',         // Green
  neutral: '#6b7280',         // Gray
  blocked: '#dc2626',         // Red
  active: '#3b82f6',          // Blue
  pending: '#f59e0b'          // Amber
};

/**
 * Spacing scale (in rem)
 */
export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  '4xl': '3rem'
};

/**
 * Border radius scale
 */
export const RADIUS = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
};

/**
 * Typography scale
 */
export const TYPOGRAPHY = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em'
  }
};

/**
 * Shadow scale for elevation
 */
export const SHADOWS = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 12px 24px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
};

/**
 * Transition settings for smooth animations
 */
export const TRANSITIONS = {
  fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  base: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
};

/**
 * Neutral color palette
 */
export const COLORS = {
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  primary: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    solid: '#667eea'
  }
};
