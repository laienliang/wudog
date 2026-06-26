import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import { redisStore } from 'cache-manager-ioredis-yet';
import * as path from 'path';
import { pUploadPath } from '../comm/path';
import { availablePort } from '../comm/port';

const uploadMaxSize = process.env.UPLOAD_MAX_SIZE || '200mb';

export default {
  // 确保每个项目唯一，项目首次启动会自动生成
  keys: '0467d287-1462-4a94-a3d4-19eff8b92a23',
  koa: {
    port: availablePort(8001),
  },
  // 开启异步上下文管理
  asyncContextManager: {
    enable: true,
  },
  // 请求体大小限制，避免大文件上传时在进入上传组件前被拦截
  bodyParser: {
    formLimit: uploadMaxSize,
    jsonLimit: uploadMaxSize,
    textLimit: uploadMaxSize,
    xmlLimit: uploadMaxSize,
  },
  // 静态文件配置
  staticFile: {
    dynamic: true,
    preload: false,
    buffer: false,
    dirs: {
      default: {
        prefix: '/',
        dir: path.join(__dirname, '..', '..', 'public'),
      },
      static: {
        prefix: '/upload',
        dir: pUploadPath(),
      },
    },
  },
  // 文件上传
  upload: {
    fileSize: uploadMaxSize,
    whitelist: null,
  },
  // 缓存 可切换成其他缓存如：redis http://www.midwayjs.org/docs/extensions/caching
  cacheManager: {
    clients: {
      default: {
        store: redisStore,
        options: {
          port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
          host: process.env.REDIS_HOST || '127.0.0.1',
          password: process.env.REDIS_PASSWORD || '',
          ttl: 0,
          db: 0,
        },
      },
    },
  },
  cool: {
    // 已经插件化，本地文件上传查看 plugin/config.ts，其他云存储查看对应插件的使用
    file: {},
    // 是否开启多租户
    tenant: {
      // 是否开启多租户
      enable: true,
      // 需要过滤多租户的url, 支持通配符， 如/admin/**/* 表示admin模块下的所有接口都进行多租户过滤
      urls: [],
    },
    // 国际化配置
    i18n: {
      // 是否开启
      enable: false,
      // 语言
      languages: ['zh-cn', 'zh-tw', 'en'],
    },
    // crud配置
    crud: {
      // 插入模式，save不会校验字段(允许传入不存在的字段)，insert会校验字段
      upsert: 'save',
      // 软删除
      softDelete: true,
    },
  } as CoolConfig,
} as MidwayConfig;
