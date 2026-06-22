import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
  return {
    label: '住模块',
    views: [
      { path: '/lodging/hostel', meta: { label: '民宿管理' }, component: () => import('./views/crud/hostel/index.vue') },
      { path: '/lodging/roomType', meta: { label: '房型管理' }, component: () => import('./views/crud/roomType/index.vue') },
      { path: '/lodging/calendar', meta: { label: '房态日历' }, component: () => import('./views/crud/calendar/index.vue') },
      { path: '/lodging/hostelPolicy', meta: { label: '入住须知' }, component: () => import('./views/crud/hostelPolicy/index.vue') },
      { path: '/lodging/review', meta: { label: '评价管理' }, component: () => import('./views/crud/review/index.vue') },
      { path: '/lodging/collect', meta: { label: '收藏管理' }, component: () => import('./views/crud/collect/index.vue') },
    ],
  };
};
