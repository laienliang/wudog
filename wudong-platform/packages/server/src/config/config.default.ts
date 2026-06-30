import { resolve } from 'path';

// ============================================================
// Midway.js 默认配置
// 各模块通过 src/config/config.{env}.ts 覆盖
// ============================================================

export default (appInfo: any) => {
  return {
    // ---- 应用配置 ----
    app: {
      appName: 'wudong-server',
      appDir: appInfo.appDir,
      baseDir: appInfo.baseDir,
    },

    // ---- Cookie 签名密钥（Midway v3 必需） ----
    keys: 'wudong-platform-dev-key-2026',

    // ---- 端口 ----
    midwayFeature: {
      koa: {
        port: 7001,
      },
    },

    // ---- 数据库 ----
    orm: {
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '050228hdl',
      database: process.env.DB_NAME || 'wudong_platform',
      charset: 'utf8mb4',
      synchronize: false,
      logging: false,
      dateStrings: true,
      entities: ['**/entity/*.entity.{ts,js}'],
    },

    // ---- JWT 认证 ----
    jwt: {
      secret: process.env.JWT_SECRET || 'wudong-dev-secret-key',
      accessTokenExpiresIn: '7d',
      refreshTokenExpiresIn: '30d',
      algorithm: 'HS256',
    },

    // ---- Redis ----
    redis: {
      client: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || '',
        db: 0,
      },
    },

    // ---- 文件上传（OSS） ----
    upload: {
      mode: 'oss',
      oss: {
        region: process.env.OSS_REGION || 'oss-cn-hangzhou',
        accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
        bucket: process.env.OSS_BUCKET || 'wudong-platform',
        endpoint: process.env.OSS_ENDPOINT || '',
      },
      presignedExpiresIn: 3600, // 预签名 URL 有效期（秒）
    },

    // ---- 微信支付 ----
    wechatPay: {
      appId: process.env.WECHAT_APP_ID || '',
      mchId: process.env.WECHAT_MCH_ID || '',
      apiKey: process.env.WECHAT_API_KEY || '',
      notifyUrl: process.env.WECHAT_NOTIFY_URL || '',
    },

    // ---- 日志 ----
    logger: {
      dir: resolve(appInfo.appDir, 'logs'),
      level: 'info',
      maxSize: '100m',
      maxFiles: '30d',
    },

    // ---- 跨域 ----
    cors: {
      origin: '*',
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
  };
};
