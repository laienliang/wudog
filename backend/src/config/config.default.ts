import { MidwayConfig } from '@midwayjs/core';

export default {
  keys: 'wudong-admin-session-key',

  koa: {
    port: parseInt(process.env.PORT || '3000', 10),
  },

  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        database: process.env.DB_DATABASE || 'wudong_admin',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '123456',
        synchronize: false,
        logging: process.env.NODE_ENV !== 'production',
        entities: ['**/*.entity.ts', '**/*.entity.js'],
      },
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'wudong-admin-jwt-secret-2026',
    expiresIn: '7d',
  },
} as MidwayConfig;
