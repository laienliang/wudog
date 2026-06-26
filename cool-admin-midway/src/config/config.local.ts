import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import { TenantSubscriber } from '../modules/base/db/tenant';

const envNumber = (key: string, defaultValue: number) => {
  const value = Number(process.env[key]);
  return Number.isFinite(value) ? value : defaultValue;
};

/**
 * 本地开发 npm run dev 读取的配置文件
 */
export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.DB_HOST || '127.0.0.1',
        port: envNumber('DB_PORT', 13306),
        username: process.env.DB_USER || 'cool',
        password: process.env.DB_PASSWORD || '123456',
        database: process.env.DB_NAME || 'cool',
        // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
        synchronize: true,
        // 打印日志
        logging: false,
        // 字符集
        charset: 'utf8mb4',
        // 是否开启缓存
        cache: true,
        // 实体路径
        entities: ['**/modules/*/entity'],
        // 订阅者
        subscribers: [TenantSubscriber],
      },
    },
  },
  cool: {
    // 实体与路径，跟生成代码、前端请求、swagger文档相关 注意：线上不建议开启，以免暴露敏感信息
    eps: true,
    // 是否自动导入模块数据库
    initDB: true,
    // 判断是否初始化的方式
    initJudge: 'db',
    // 是否自动导入模块菜单
    initMenu: true,
  } as CoolConfig,
} as MidwayConfig;
