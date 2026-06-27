// ============================================================
// 生产环境配置 — NODE_ENV=production 时自动加载，覆盖 config.default
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\config\config.prod.ts
// 端口可通过环境变量 PORT / HOST 覆盖，兜底 0.0.0.0:3000
// ============================================================
export default {
  koa: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '127.0.0.1',
    globalPrefix: '',
    keys: ['wudong-group3-koa-secret-key'],
  },
};
