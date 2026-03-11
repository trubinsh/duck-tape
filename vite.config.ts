/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'

import { cloudflare } from "@cloudflare/vite-plugin";
import pkg from './package.json';

function adsensePlugin(clientId?: string) {
  if (!clientId) {
    return {
      name: 'adsense-plugin',
    }
  }

  return {
    name: 'adsense-plugin',
    transformIndexHtml(html: string) {
      return html.replace(
        '</head>',
        `    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}" crossorigin="anonymous"></script>
  </head>`
      )
    },
  }
}

// https://vite.dev/config/
// eslint-disable-next-line no-empty-pattern
export default defineConfig(({ }) => {
  const env = { ...process.env };
  const adsenseId = env.VITE_GOOGLE_ADSENSE_CLIENT_ID;

  return {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
    },
    plugins: [
      react(),
      basicSsl(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'DuckTape - Developer Tools',
          short_name: 'DuckTape',
          description: 'All-in-one application for developers for data transformation, generation, and validation.',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      }),
      cloudflare(),
      adsensePlugin(adsenseId)
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  }
})