import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg'],
    manifest: {
      name: 'TNTNote', short_name: 'TNTNote', description: '本地优先、离线可用的私人 Markdown 便签',
      theme_color: '#242521', background_color: '#ecebe7', display: 'standalone', start_url: '/', scope: '/', lang: 'zh-CN',
      icons: [{ src: '/pwa-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' }, { src: '/pwa-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }],
    },
    workbox: { navigateFallback: '/index.html', globPatterns: ['**/*.{js,css,html,svg,woff2}'] },
  })],
})
