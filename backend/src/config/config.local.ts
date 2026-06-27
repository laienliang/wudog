// ============================================================
// 本地开发配置
// 文件: C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\config\config.local.ts
// 端口强制3000，开启跨域，MySQL库名wudong_group3
// ============================================================
import { MidwayConfig } from '@midwayjs/core';

export default {
  // 使用默认的 Koa 框架
  koa: {
    port: 3000,
    host: '127.0.0.1',
    globalPrefix: '',
    keys: ['wudong-group3-koa-secret-key'],
  },

  // CORS 跨域配置
  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    allowHeaders: 'Content-Type,Authorization',
  },

  // TypeORM 数据库配置
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'wudong_group3',
        synchronize: false,           // 关闭自动迁移，手动管理表结构
        logging: true,
        entities: ['**/modules/lodging/entity/*.{ts,js}'],
        timezone: '+08:00',
        dateStrings: true,
        charset: 'utf8mb4',
        extra: {
          connectionLimit: 10,
        },
      },
    },
  },

  // JWT 配置
  jwt: {
    secret: 'wudong-group3-jwt-secret-2026',
    expiresIn: '7d',
  },

  // 业务配置
  lodging: {
    maxAdvanceDays: 90,             // 最多提前90天预订
    minStayNights: 1,               // 最少入住1晚
    checkInCodeLength: 6,           // 核销码长度
    cancellationRules: [            // 默认退改阶梯规则
      { daysBefore: 3, refundPercent: 100, description: '入住前3天以上取消，全额退款' },
      { daysBefore: 1, refundPercent: 50, description: '入住前1-3天取消，退款50%' },
      { daysBefore: 0, refundPercent: 0, description: '入住前24小时内取消，不可退款' },
    ],
  },
} as MidwayConfig;
