import { type ModuleConfig } from '/@/cool';
export default (): ModuleConfig => {
	return {
		label: '行模块',
		views: [
			{ path: '/travel/scenic', meta: { label: '景区管理' }, component: () => import('./views/crud/scenic/index.vue') },
			{ path: '/travel/ticketType', meta: { label: '票种管理' }, component: () => import('./views/crud/ticketType/index.vue') },
			{ path: '/travel/route', meta: { label: '路线管理' }, component: () => import('./views/crud/route/index.vue') },
			{ path: '/travel/routeDay', meta: { label: '路线日程' }, component: () => import('./views/crud/routeDay/index.vue') },
			{ path: '/travel/eTicket', meta: { label: '电子票管理' }, component: () => import('./views/crud/eTicket/index.vue') },
			{ path: '/travel/guide', meta: { label: '交通攻略' }, component: () => import('./views/crud/guide/index.vue') },
			{ path: '/travel/review', meta: { label: '评价管理' }, component: () => import('./views/crud/review/index.vue') },
			{ path: '/travel/collect', meta: { label: '收藏管理' }, component: () => import('./views/crud/collect/index.vue') },
		],
	};
};
