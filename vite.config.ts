import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({

  build: {
    // TODO: temporary fix for "chunk size too large" error
    chunkSizeWarningLimit: 2000,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js'
          }
          return 'assets/[name].[hash].js'
        },
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },

  plugins: [
    react(),
    crx({
      manifest: {
        manifest_version: 3,
        name: 'Web Assistant',
        version: '1.0.0',
        description: 'Chat with your current Web, Ask anything about the current page',

        icons: {
          34: 'public/icon-34.png',
          128: 'public/icon-128.png',
        },

        action: {
          default_icon: {
            34: 'public/icon-34.png',
            128: 'public/icon-128.png',
          },
          default_title: 'Web Assistant',
        },

        background: {
          service_worker: 'src/background/index.ts',
          type: 'module',
        },

        side_panel: {
          default_path: 'index.html',
        },

        permissions: [
          'tabs',
          'activeTab',
          'scripting',
          'notifications',
          'sidePanel',
          'commands',
          'storage',
        ],

        host_permissions: ['<all_urls>'],

        content_security_policy: {
          extension_pages: 'script-src \'self\' \'wasm-unsafe-eval\'; object-src \'self\';',
        },

        web_accessible_resources: [
          {
            matches: ['<all_urls>'],
            resources: ['index.html'],
          },
        ],

        minimum_chrome_version: '102',
      },
    }),
  ],

  css: {
    postcss: './postcss.config.cjs',
  },

  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
})
