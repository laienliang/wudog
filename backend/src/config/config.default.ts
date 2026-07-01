import { MidwayConfig } from '@midwayjs/core';
import { join } from 'path';
import { AdminUser } from '../entity/AdminUser';
import { User } from '../entity/User';
import { Product } from '../entity/Product';
import { ProductCategory } from '../entity/ProductCategory';
import { ProductSku } from '../entity/ProductSku';
import { ProductImage } from '../entity/ProductImage';
import { ProductFavorite } from '../entity/ProductFavorite';
import { Order } from '../entity/Order';
import { Cart } from '../entity/Cart';
import { ChatMessage } from '../entity/ChatMessage';
import { Review } from '../entity/Review';
import { Address } from '../entity/Address';

export default {
  keys: 'wudong-secret-key-2026',
  koa: {
    port: Number(process.env.PORT) || 3000,
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.MYSQL_HOST || 'localhost',
        port: Number(process.env.MYSQL_PORT) || 3306,
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '123456',
        database: process.env.MYSQL_DATABASE || 'wudong',
        driverOptions: {
          connection: {
            charset: 'utf8mb4',
          },
        },
        synchronize: true,
        logging: false,
        entities: [AdminUser, User, Product, ProductCategory, ProductSku, ProductImage, ProductFavorite, Order, Cart, ChatMessage, Review, Address],
      },
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'wudong-jwt-secret',
    expiresIn: '24h',
  },
  redis: {
    clients: {
      default: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6380,
      },
    },
  },
} as MidwayConfig;
