import AppContext from '@src/context/AppContext'
import { useContext } from 'react'

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
