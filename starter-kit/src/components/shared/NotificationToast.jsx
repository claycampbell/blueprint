'use client'

// React Imports
import { createContext, useContext, useState, useCallback } from 'react'

// MUI Imports
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

/**
 * NotificationToast Component
 *
 * A toast notification system with success, error, warning, and info variants.
 * Provides a context provider and hook for managing notifications throughout the app.
 *
 * Usage:
 * 1. Wrap your app with NotificationProvider
 * 2. Use the useNotification hook to show notifications:
 *    const { showNotification } = useNotification()
 *    showNotification('Success!', 'success')
 */

// Create context
const NotificationContext = createContext(null)

// Hook to use notifications
export const useNotification = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }

  
return context
}

/**
 * NotificationProvider Component
 *
 * Wrap your app with this provider to enable notifications
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  // Show notification
  const showNotification = useCallback((message, severity = 'info', options = {}) => {
    const id = Date.now() + Math.random()

    const notification = {
      id,
      message,
      severity,
      title: options.title,
      autoHideDuration: options.autoHideDuration ?? 6000,
      anchorOrigin: options.anchorOrigin ?? { vertical: 'top', horizontal: 'right' },
      ...options
    }

    setNotifications(prev => [...prev, notification])

    // Auto-dismiss if autoHideDuration is set
    if (notification.autoHideDuration) {
      setTimeout(() => {
        hideNotification(id)
      }, notification.autoHideDuration)
    }

    return id
  }, [])

  // Hide notification
  const hideNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Convenience methods
  const success = useCallback((message, options) => {
    return showNotification(message, 'success', options)
  }, [showNotification])

  const error = useCallback((message, options) => {
    return showNotification(message, 'error', options)
  }, [showNotification])

  const warning = useCallback((message, options) => {
    return showNotification(message, 'warning', options)
  }, [showNotification])

  const info = useCallback((message, options) => {
    return showNotification(message, 'info', options)
  }, [showNotification])

  const value = {
    showNotification,
    hideNotification,
    success,
    error,
    warning,
    info
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onClose={hideNotification} />
    </NotificationContext.Provider>
  )
}

/**
 * NotificationContainer Component
 *
 * Renders all active notifications
 */
const NotificationContainer = ({ notifications, onClose }) => {
  // Group notifications by anchor position
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const key = `${notification.anchorOrigin.vertical}-${notification.anchorOrigin.horizontal}`

    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(notification)
    
return acc
  }, {})

  return (
    <>
      {Object.entries(groupedNotifications).map(([position, positionNotifications]) => {
        const anchorOrigin = positionNotifications[0].anchorOrigin

        return (
          <Box
            key={position}
            sx={{
              position: 'fixed',
              zIndex: 9999,
              ...(anchorOrigin.vertical === 'top' && { top: 24 }),
              ...(anchorOrigin.vertical === 'bottom' && { bottom: 24 }),
              ...(anchorOrigin.horizontal === 'left' && { left: 24 }),
              ...(anchorOrigin.horizontal === 'right' && { right: 24 }),
              ...(anchorOrigin.horizontal === 'center' && {
                left: '50%',
                transform: 'translateX(-50%)'
              }),
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxWidth: 400,
              width: '100%'
            }}
          >
            {positionNotifications.map((notification) => (
              <Snackbar
                key={notification.id}
                open={true}
                anchorOrigin={notification.anchorOrigin}
                sx={{ position: 'relative', left: 'auto', right: 'auto', top: 'auto', bottom: 'auto' }}
              >
                <Alert
                  severity={notification.severity}
                  variant="filled"
                  onClose={() => onClose(notification.id)}
                  action={
                    <IconButton
                      size="small"
                      aria-label="close"
                      color="inherit"
                      onClick={() => onClose(notification.id)}
                    >
                      <i className="ri-close-line" />
                    </IconButton>
                  }
                  sx={{ width: '100%' }}
                >
                  {notification.title && <AlertTitle>{notification.title}</AlertTitle>}
                  {notification.message}
                </Alert>
              </Snackbar>
            ))}
          </Box>
        )
      })}
    </>
  )
}

/**
 * Single NotificationToast Component (for standalone use)
 *
 * Use this if you want to manually control a single toast
 */
const NotificationToast = ({
  open,
  onClose,
  message,
  severity = 'info',
  title,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: 'top', horizontal: 'right' }
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={onClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <i className="ri-close-line" />
          </IconButton>
        }
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  )
}

export default NotificationToast
