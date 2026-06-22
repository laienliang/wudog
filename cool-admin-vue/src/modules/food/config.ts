import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
  return {
    label: '食模块',
    views: [
      { path: '/food/restaurant', meta: { label: '餐厅管理' }, component: () => import('./views/crud/restaurant/index.vue') },
      { path: '/food/dish', meta: { label: '菜品管理' }, component: () => import('./views/crud/dish/index.vue') },
      { path: '/food/timeSlot', meta: { label: '时段管理' }, component: () => import('./views/crud/timeSlot/index.vue') },
      { path: '/food/agricultureCategory', meta: { label: '农产品分类' }, component: () => import('./views/crud/agricultureCategory/index.vue') },
      { path: '/food/agricultureGoods', meta: { label: '农产品管理' }, component: () => import('./views/crud/agricultureGoods/index.vue') },
      { path: '/food/review', meta: { label: '评价管理' }, component: () => import('./views/crud/review/index.vue') },
      { path: '/food/collect', meta: { label: '收藏管理' }, component: () => import('./views/crud/collect/index.vue') },
    ],
  };
};
