import { ModuleConfig } from '@cool-midway/core';

/**
 * 乌东非遗商品模块
 */
export default () => {
  return {
    name: '乌东非遗商品',
    description: '课程第 1 组业务模块，负责商品、SKU、图片与收藏',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
