import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { NavigationProvider } from './context/Navigation'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NavigationProvider>
      <App />
    </NavigationProvider>
  </React.StrictMode>,
)
