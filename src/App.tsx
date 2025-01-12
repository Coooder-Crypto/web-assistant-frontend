import { AppProvider } from './store/AppContext';
import WebAssistant from './apps';

export default function App() {
  return (
    <AppProvider>
      <WebAssistant />
    </AppProvider>
  );
}
