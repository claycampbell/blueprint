import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './auth.store'

// Mock user for testing
const mockUser = {
  id: 'user-123',
  email: 'jane@blueprint.com',
  name: 'Jane Doe',
  role: 'acquisitions',
  permissions: ['read:projects', 'write:projects', 'read:loans'],
}

describe('useAuthStore', () => {
  // Reset store state before each test
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  })

  describe('initial state', () => {
    it('starts with null user', () => {
      const { user } = useAuthStore.getState()
      expect(user).toBeNull()
    })

    it('starts with null token', () => {
      const { token } = useAuthStore.getState()
      expect(token).toBeNull()
    })

    it('starts as not authenticated', () => {
      const { isAuthenticated } = useAuthStore.getState()
      expect(isAuthenticated).toBe(false)
    })
  })

  describe('setUser', () => {
    it('sets user and token', () => {
      const { setUser } = useAuthStore.getState()

      setUser(mockUser, 'jwt-token-123')

      const { user, token } = useAuthStore.getState()
      expect(user).toEqual(mockUser)
      expect(token).toBe('jwt-token-123')
    })

    it('sets isAuthenticated to true', () => {
      const { setUser } = useAuthStore.getState()

      setUser(mockUser, 'jwt-token-123')

      const { isAuthenticated } = useAuthStore.getState()
      expect(isAuthenticated).toBe(true)
    })
  })

  describe('logout', () => {
    it('clears user and token', () => {
      const { setUser, logout } = useAuthStore.getState()

      // First login
      setUser(mockUser, 'jwt-token-123')

      // Then logout
      logout()

      const { user, token } = useAuthStore.getState()
      expect(user).toBeNull()
      expect(token).toBeNull()
    })

    it('sets isAuthenticated to false', () => {
      const { setUser, logout } = useAuthStore.getState()

      setUser(mockUser, 'jwt-token-123')
      logout()

      const { isAuthenticated } = useAuthStore.getState()
      expect(isAuthenticated).toBe(false)
    })
  })

  describe('hasPermission', () => {
    it('returns false when user is not logged in', () => {
      const { hasPermission } = useAuthStore.getState()

      expect(hasPermission('read:projects')).toBe(false)
    })

    it('returns true when user has the permission', () => {
      const { setUser, hasPermission } = useAuthStore.getState()

      setUser(mockUser, 'jwt-token-123')

      expect(hasPermission('read:projects')).toBe(true)
      expect(hasPermission('write:projects')).toBe(true)
      expect(hasPermission('read:loans')).toBe(true)
    })

    it('returns false when user does not have the permission', () => {
      const { setUser, hasPermission } = useAuthStore.getState()

      setUser(mockUser, 'jwt-token-123')

      expect(hasPermission('write:loans')).toBe(false)
      expect(hasPermission('delete:projects')).toBe(false)
      expect(hasPermission('admin:all')).toBe(false)
    })
  })
})
