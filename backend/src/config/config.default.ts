import { CoolCacheStore, CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import * as path from 'path';
import { pCachePath, pUploadPath } from '../comm/path';

// import { redisStore } from 'cache-manager-ioredis-yet';

export default {
  keys: 'a172e873-699f-491a-b820-0a0e8aed1574',
  koa: {
    port: 3000,
    globalPrefix: '/api',
  },
  asyncContextManager: {
    enable: true,
  },
  staticFile: {
    buffer: true,
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
  upload: {
    fileSize: '200mb',
    whitelist: null,
  },
  cacheManager: {
    clients: {
      default: {
        store: CoolCacheStore,
        options: {
          path: pCachePath(),
          ttl: 0,
        },
      },
    },
  },
  // cacheManager: {
  //   clients: {
  //     default: {
  //       store: redisStore,
  //       options: {
  //         port: 6379,
  //         host: '127.0.0.1',
  //         password: '',
  //         ttl: 0,
  //         db: 0,
  //       },
  //     },
  //   },
  // },
  cool: {
    file: {},
    tenant: {
      enable: false,
      urls: [],
    },
    i18n: {
      enable: false,
      languages: ['zh-cn', 'zh-tw', 'en'],
    },
    crud: {
      upsert: 'save',
      softDelete: true,
    },
  } as CoolConfig,
} as MidwayConfig;
