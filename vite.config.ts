import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        dimensions: false,
        icon: true,
        ref: true
      },
      include: '**/*.svg?react'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: (() => {
    const certDir = path.resolve(__dirname, 'certs')
    const keyPath = path.join(certDir, 'dev.key')
    const certPath = path.join(certDir, 'dev.crt')

    const hasCerts = fs.existsSync(keyPath) && fs.existsSync(certPath)

    return {
      host: true,
      ...(hasCerts && {
        https: {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath)
        }
      }),
      proxy: {
        '/dev/api': {
          target: 'https://tpu.community.design',
          changeOrigin: true,
          secure: false
        }
      }
    }
  })()
})
