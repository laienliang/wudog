export default defineNuxtRouteMiddleware(() => {
  // 预留全局鉴权入口，避免空中间件文件导致 Nuxt 运行时加载失败
});
