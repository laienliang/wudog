import { type ModuleConfig } from '/@/cool';
export default (): ModuleConfig => {
	return {
		label: '社区模块',
		views: [
			{ path: '/community/article', meta: { label: '游记管理' }, component: () => import('./views/crud/article/index.vue') },
			{ path: '/community/comment', meta: { label: '评论管理' }, component: () => import('./views/crud/comment/index.vue') },
			{ path: '/community/topic', meta: { label: '话题管理' }, component: () => import('./views/crud/topic/index.vue') },
			{ path: '/community/report', meta: { label: '举报管理' }, component: () => import('./views/crud/report/index.vue') },
			{ path: '/community/follow', meta: { label: '关注管理' }, component: () => import('./views/crud/follow/index.vue') },
			{ path: '/community/like', meta: { label: '点赞管理' }, component: () => import('./views/crud/like/index.vue') },
			{ path: '/community/collect', meta: { label: '收藏管理' }, component: () => import('./views/crud/collect/index.vue') },
			{ path: '/community/image', meta: { label: '图片管理' }, component: () => import('./views/crud/image/index.vue') },
			{ path: '/community/video', meta: { label: '视频管理' }, component: () => import('./views/crud/video/index.vue') },
			{ path: '/community/tag', meta: { label: '标签管理' }, component: () => import('./views/crud/tag/index.vue') },
		],
	};
};
