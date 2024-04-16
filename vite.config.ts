import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{css,js,svg,ico,html}'],
        swDest: 'dist/sw.js'
      },
      manifest: {
        name: 'AP History Review Tree',
        short_name: 'AP Review Tree',
        theme_color: '#001529',
        background_color: '#ccc',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
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
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        })
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'data-apwh': ['@/assets/apwh.json'],
          'data-apeh': ['@/assets/apeh.json'],
          'antd-tree': ['ant-design-vue/es/tree'],
          antd: ['ant-design-vue']
        }
      }
    }
  }
})
