// ============================================================
// 默认配置
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\config\config.default.ts
// ============================================================
import { MidwayConfig } from '@midwayjs/core';

export default {
  koa: {
    port: 3000,
    host: '127.0.0.1',
    globalPrefix: '',
    keys: ['wudong-group3-koa-secret-key'],
  },

  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    allowHeaders: 'Content-Type,Authorization',
  },

  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'wudong_group3',
        synchronize: false,
        logging: false,
        entities: ['**/modules/lodging/entity/*.{ts,js}'],
        timezone: '+08:00',
        dateStrings: true,
        charset: 'utf8mb4',
      },
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'wudong-group3-jwt-secret-2026',
    expiresIn: '7d',
  },

  lodging: {
    maxAdvanceDays: 90,
    minStayNights: 1,
    checkInCodeLength: 6,
    cancellationRules: [
      { daysBefore: 3, refundPercent: 100, description: '入住前3天以上取消，全额退款' },
      { daysBefore: 1, refundPercent: 50, description: '入住前1-3天取消，退款50%' },
      { daysBefore: 0, refundPercent: 0, description: '入住前24小时内取消，不可退款' },
    ],
  },
} as MidwayConfig;
