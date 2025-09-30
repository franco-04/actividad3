import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'icons/icon-128.png',
        'icons/icon-192.png'
      ],
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/offline.html',
      },
      manifest: {
        name: 'App Shell Demo',
        short_name: 'AppShell',
        description: 'PWA con App Shell en React',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0ea5e9',
        lang: 'es-MX',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-128.png', sizes: '128x128', type: 'image/png' },
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }
        ]
      }
    })
  ]
})
