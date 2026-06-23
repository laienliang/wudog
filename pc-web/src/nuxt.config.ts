export default defineNuxtConfig({
  srcDir: 'src/',
  css: ['element-plus/dist/index.css', '~/assets/css/main.scss'],
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8001/open/client',
    },
  },
  compatibilityDate: '2026-06-23',
});
