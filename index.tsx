import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@src/App'
import './index.css'

const root = document.getElementById('root');
console.log(root)

if (root) {
  console.log(root)
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <React.Suspense fallback={<div>Loading...</div>}>
        <App />
      </React.Suspense>
    </React.StrictMode>
  );
}
