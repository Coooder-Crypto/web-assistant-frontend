import type { AlertColor } from '@mui/material'
import type { AppState } from '@src/types/app'
import type { ReactNode } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import AppContext from './AppContext'

interface Notification {
  message: string
  type: AlertColor
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null)

  const handleError = (error: any): string => {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    return 'An unexpected error occurred'
  }

  const setError = useCallback((error: any) => {
    if (error) {
      setNotification({ message: handleError(error), type: 'error' })
    }
    else {
      setNotification(null)
    }
  }, [])

  const setSuccess = useCallback((success: string | null) => {
    if (success) {
      setNotification({ message: success, type: 'success' })
    }
    else {
      setNotification(null)
    }
  }, [])

  const handleClose = useCallback(() => {
    setNotification(null)
  }, [])

  const value = useMemo<AppState>(() => ({
    setError,
    setSuccess,
  }), [setError, setSuccess])

  return (
    <AppContext.Provider value={value}>
      {children}
      <Snackbar
        open={!!notification}
        autoHideDuration={notification?.type === 'error' ? 6000 : 3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {notification
          ? (
              <Alert
                onClose={handleClose}
                severity={notification?.type || 'info'}
                sx={{ width: '100%' }}
              >
                {notification?.message}
              </Alert>
            )
          : undefined}
      </Snackbar>
    </AppContext.Provider>
  )
}
