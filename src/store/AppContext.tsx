import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  error: string | null;
  setError: (error: string | null) => void;
  success: string | null;
  setSuccess: (message: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{ error, setError, success, setSuccess }}>
      {children}
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
