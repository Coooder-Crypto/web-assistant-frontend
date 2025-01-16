import WebAssistant from './apps'
import { AppProvider } from './store/AppContext'

export default function App() {
  return (
    <AppProvider>
      <WebAssistant />
    </AppProvider>
  )
}
