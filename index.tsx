import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@src/App'
import { AppProvider } from '@src/store/AppContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
