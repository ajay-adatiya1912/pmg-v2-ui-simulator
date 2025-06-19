import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PmgPowerValuesContextProvider from './context/PmgAlgoContext'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <PmgPowerValuesContextProvider>
    <App />
  </PmgPowerValuesContextProvider>
  // </StrictMode>,
)
