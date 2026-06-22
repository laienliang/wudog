import { ModuleConfig } from '@cool-midway/core';

/**
 * 通用模块配置
 */
export default () => {
  return {
    name: 'common模块',
    description: '通用功能模块',
    order: 0,
  } as ModuleConfig;
};
