import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import { entities } from '../entities';
import { TenantSubscriber } from '../modules/base/db/tenant';

const envBoolean = (key: string, defaultValue: boolean) => {
  const value = process.env[key];

  if (value === undefined) {
    return defaultValue;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

/**
 * 本地开发 npm run prod 读取的配置文件
 */
export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || 3306),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '123456',
        database: process.env.DB_NAME || 'cool',
        // 自动建表 注意：线上部署的时候不要使用，有可能导致数据丢失
        synchronize: envBoolean('DB_SYNCHRONIZE', false),
        // 打印日志
        logging: false,
        // 字符集
        charset: 'utf8mb4',
        // 是否开启缓存
        cache: true,
        // 实体路径
        entities,
        // 订阅者
        subscribers: [TenantSubscriber],
      },
    },
  },
  cool: {
    // 实体与路径，跟生成代码、前端请求、swagger文档相关 注意：线上不建议开启，以免暴露敏感信息
    eps: envBoolean('COOL_EPS', false),
    // 是否自动导入模块数据库
    initDB: envBoolean('COOL_INIT_DB', false),
    // 判断是否初始化的方式
    initJudge: 'db',
    // 是否自动导入模块菜单
    initMenu: envBoolean('COOL_INIT_MENU', false),
  } as CoolConfig,
} as MidwayConfig;
