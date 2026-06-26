import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  server: {
    proxy: {
      '/open': {
        target: 'http://36.137.196.248:8001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/open/, '/open'),
      },
    },
  },
})
