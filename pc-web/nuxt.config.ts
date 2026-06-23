import { defineNuxtConfig } from 'nuxt/config';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineNuxtConfig({
  css: ['element-plus/dist/index.css', '~/assets/css/main.scss'],
  devServer: { port: 3000 },
  srcDir: 'src/',
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8001/open/client',
    },
  },
  vite: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver({ importStyle: false })],
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: false })],
      }),
    ],
  },
  modules: ['@pinia/nuxt'],
  compatibilityDate: '2026-06-23',
});
