import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { registerSW } from 'virtual:pwa-register'


registerSW({
  onNeedRefresh() {
    if (confirm('Hay una actualización disponible. ¿Actualizar ahora?')) {
      location.reload()
    }
  },
  onOfflineReady() {
    console.log('La app está lista para usarse sin conexión.')
  }
})

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
