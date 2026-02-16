import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,onnx}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'gemini-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /^https:\/\/huggingface\.co\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ai-models-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: "Idara - AI Lecture Companion",
        short_name: "Idara",
        description: "Your smart lecture recording and study assistant",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#3b82f6",
        orientation: "portrait",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        share_target: {
          action: "/share",
          method: "POST",
          enctype: "multipart/form-data",
          params: {
            files: [
              {
                "name": "audio",
                "accept": ["audio/*"]
              }
            ]
          }
        },
        shortcuts: [
          {
            name: "New Recording",
            short_name: "Record",
            description: "Start a new lecture recording",
            url: "/record",
            icons: [{ "src": "/icons/record.png", "sizes": "96x96" }]
          }
        ]
      }
    })
  ],
  worker: {
    format: 'es',
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ai': ['@huggingface/transformers'],
          'db': ['dexie'],
          'ui': ['framer-motion', 'lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['@huggingface/transformers'],
  },
  server: {
    proxy: {
      '/api/google': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google/, ''),
      },
    },
  },
})
