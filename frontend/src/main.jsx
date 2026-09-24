import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './api.js'
import App from './App.jsx'
import ShopContextProvider from './context/ShopContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </StrictMode>,
)
