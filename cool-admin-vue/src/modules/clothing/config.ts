import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
  return {
    label: '衣模块',
    views: [
      { path: '/clothing/goods', meta: { label: '商品管理' }, component: () => import('./views/crud/goods/index.vue') },
      { path: '/clothing/category', meta: { label: '分类管理' }, component: () => import('./views/crud/category/index.vue') },
      { path: '/clothing/sku', meta: { label: 'SKU管理' }, component: () => import('./views/crud/sku/index.vue') },
      { path: '/clothing/review', meta: { label: '评价管理' }, component: () => import('./views/crud/review/index.vue') },
      { path: '/clothing/collect', meta: { label: '收藏管理' }, component: () => import('./views/crud/collect/index.vue') },
    ],
  };
};
