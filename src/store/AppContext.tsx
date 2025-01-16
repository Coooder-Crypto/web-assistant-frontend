import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Alert, Snackbar, AlertColor } from '@mui/material';

interface Notification {
  message: string;
  type: AlertColor;
}

interface AppState {
  setError: (error: any) => void;
  setSuccess: (message: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const handleError = (error: any): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "An unexpected error occurred";
  };

  const setError = useCallback((error: any) => {
    if (error) {
      setNotification({ message: handleError(error), type: 'error' });
    } else {
      setNotification(null);
    }
  }, []);

  const setSuccess = useCallback((success: string | null ) => {
    if (success) {
      setNotification({ message: success, type: 'success' });
    } else {
      setNotification(null);
    }
  }, []);

  const handleClose = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <AppContext.Provider value={{ setError, setSuccess }}>
      {children}
      <Snackbar
        open={!!notification}
        autoHideDuration={notification?.type === 'error' ? 6000 : 3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {notification ? (
          <Alert 
            onClose={handleClose} 
            severity={notification?.type || 'info'}
            sx={{ width: '100%' }}
          >
            {notification?.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function handleError(error: any): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) return error.message;
  return 'An unexpected error occurred';
}
