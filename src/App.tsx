import WebAssistant from './apps'
import { AppProvider } from './context/AppProvider'

export default function App() {
  return (
    <AppProvider>
      <WebAssistant />
    </AppProvider>
  )
}
