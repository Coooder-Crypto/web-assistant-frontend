import { createContext } from 'react'

interface AppState {
  setError: (error: any) => void
  setSuccess: (message: string | null) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export default AppContext
