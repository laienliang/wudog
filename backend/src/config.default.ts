import { MidwayConfig } from '@midwayjs/core';
import { UserEntity } from './entity/user.entity';
import { MiaoVillageEntity } from './entity/miao-village.entity';
import { AccommodationEntity } from './entity/accommodation.entity';
import { RoomEntity } from './entity/room.entity';
import { RoomCalendarEntity } from './entity/room-calendar.entity';
import { OrderEntity } from './entity/order.entity';
import { ReviewEntity } from './entity/review.entity';

export default {
  keys: 'wudong-tourism-secret-keys-2026',
  koa: {
    port: 3000,
    globalPrefix: '/api',
  },
  // CORS 跨域配置（前端联调用）
  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  },
  // TypeORM 数据源配置 —— 请按本地 MySQL 实际情况修改
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'wudong_tourism',
        synchronize: false, // 生产环境请关闭，使用 init.sql 建表
        logging: false,
        entities: [
          UserEntity,
          MiaoVillageEntity,
          AccommodationEntity,
          RoomEntity,
          RoomCalendarEntity,
          OrderEntity,
          ReviewEntity,
        ],
        timezone: '+08:00',
        charset: 'utf8mb4',
      },
    },
  },
  // 日志
  midwayLogger: {
    default: {
      level: 'info',
      transports: {
        console: {},
      },
    },
  },
} as MidwayConfig;
