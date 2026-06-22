import { type ModuleConfig } from '/@/cool';
export default (): ModuleConfig => {
	return {
		label: '平台管理',
		views: [
			{ path: '/platform/merchantApply', meta: { label: '商家入驻审核' }, component: () => import('./views/crud/merchantApply/index.vue') },
			{ path: '/platform/banner', meta: { label: '轮播图管理' }, component: () => import('./views/crud/banner/index.vue') },
			{ path: '/platform/notice', meta: { label: '公告管理' }, component: () => import('./views/crud/notice/index.vue') },
			{ path: '/platform/recommend', meta: { label: '推荐位管理' }, component: () => import('./views/crud/recommend/index.vue') },
			{ path: '/platform/sensitiveWord', meta: { label: '敏感词管理' }, component: () => import('./views/crud/sensitiveWord/index.vue') },
			{ path: '/platform/stat', meta: { label: '数据统计' }, component: () => import('./views/crud/stat/index.vue') },
		],
	};
};
