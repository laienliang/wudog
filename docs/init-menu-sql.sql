-- 乌东文旅平台 - 新模块菜单初始化 SQL
-- 执行方式: mysql -u cool -p123456 cool < init-menu-sql.sql
-- viewPath 需要指向前端模块路径，格式: modules/{模块名}/views/crud/{页面名}
-- 不要使用路由路径 /clothing/goods 作为 viewPath

INSERT INTO base_sys_menu (id, createTime, updateTime, tenantId, name, router, `type`, parentId, icon, orderNum, viewPath, keepAlive, isShow) VALUES
-- 衣模块
(77, NOW(), NOW(), NULL, '衣模块', NULL, 0, 41, 'shopping', 1, NULL, 1, 1),
(78, NOW(), NOW(), NULL, '商品管理', '/clothing/goods', 1, 77, '', 1, 'modules/clothing/views/crud/goods', 1, 1),
(79, NOW(), NOW(), NULL, '分类管理', '/clothing/category', 1, 77, '', 2, 'modules/clothing/views/crud/category', 1, 1),
(80, NOW(), NOW(), NULL, 'SKU管理', '/clothing/sku', 1, 77, '', 3, 'modules/clothing/views/crud/sku', 1, 1),
(81, NOW(), NOW(), NULL, '评价管理', '/clothing/review', 1, 77, '', 4, 'modules/clothing/views/crud/review', 1, 1),
(82, NOW(), NOW(), NULL, '收藏管理', '/clothing/collect', 1, 77, '', 5, 'modules/clothing/views/crud/collect', 1, 1),
-- 食模块
(83, NOW(), NOW(), NULL, '食模块', NULL, 0, 41, 'food', 2, NULL, 1, 1),
(84, NOW(), NOW(), NULL, '餐厅管理', '/food/restaurant', 1, 83, '', 1, 'modules/food/views/crud/restaurant', 1, 1),
(85, NOW(), NOW(), NULL, '菜品管理', '/food/dish', 1, 83, '', 2, 'modules/food/views/crud/dish', 1, 1),
(86, NOW(), NOW(), NULL, '时段管理', '/food/timeSlot', 1, 83, '', 3, 'modules/food/views/crud/timeSlot', 1, 1),
(87, NOW(), NOW(), NULL, '农产品分类', '/food/agricultureCategory', 1, 83, '', 4, 'modules/food/views/crud/agricultureCategory', 1, 1),
(88, NOW(), NOW(), NULL, '农产品管理', '/food/agricultureGoods', 1, 83, '', 5, 'modules/food/views/crud/agricultureGoods', 1, 1),
(89, NOW(), NOW(), NULL, '评价管理', '/food/review', 1, 83, '', 6, 'modules/food/views/crud/review', 1, 1),
(90, NOW(), NOW(), NULL, '收藏管理', '/food/collect', 1, 83, '', 7, 'modules/food/views/crud/collect', 1, 1),
-- 住模块
(91, NOW(), NOW(), NULL, '住模块', NULL, 0, 41, 'home', 3, NULL, 1, 1),
(92, NOW(), NOW(), NULL, '民宿管理', '/lodging/hostel', 1, 91, '', 1, 'modules/lodging/views/crud/hostel', 1, 1),
(93, NOW(), NOW(), NULL, '房型管理', '/lodging/roomType', 1, 91, '', 2, 'modules/lodging/views/crud/roomType', 1, 1),
(94, NOW(), NOW(), NULL, '房态日历', '/lodging/calendar', 1, 91, '', 3, 'modules/lodging/views/crud/calendar', 1, 1),
(95, NOW(), NOW(), NULL, '入住须知', '/lodging/hostelPolicy', 1, 91, '', 4, 'modules/lodging/views/crud/hostelPolicy', 1, 1),
(96, NOW(), NOW(), NULL, '评价管理', '/lodging/review', 1, 91, '', 5, 'modules/lodging/views/crud/review', 1, 1),
(97, NOW(), NOW(), NULL, '收藏管理', '/lodging/collect', 1, 91, '', 6, 'modules/lodging/views/crud/collect', 1, 1),
-- 行模块
(98, NOW(), NOW(), NULL, '行模块', NULL, 0, 41, 'guide', 4, NULL, 1, 1),
(99, NOW(), NOW(), NULL, '景区管理', '/travel/scenic', 1, 98, '', 1, 'modules/travel/views/crud/scenic', 1, 1),
(100, NOW(), NOW(), NULL, '票种管理', '/travel/ticketType', 1, 98, '', 2, 'modules/travel/views/crud/ticketType', 1, 1),
(101, NOW(), NOW(), NULL, '路线管理', '/travel/route', 1, 98, '', 3, 'modules/travel/views/crud/route', 1, 1),
(102, NOW(), NOW(), NULL, '路线日程', '/travel/routeDay', 1, 98, '', 4, 'modules/travel/views/crud/routeDay', 1, 1),
(103, NOW(), NOW(), NULL, '电子票管理', '/travel/eTicket', 1, 98, '', 5, 'modules/travel/views/crud/eTicket', 1, 1),
(104, NOW(), NOW(), NULL, '交通攻略', '/travel/guide', 1, 98, '', 6, 'modules/travel/views/crud/guide', 1, 1),
(105, NOW(), NOW(), NULL, '评价管理', '/travel/review', 1, 98, '', 7, 'modules/travel/views/crud/review', 1, 1),
(106, NOW(), NOW(), NULL, '收藏管理', '/travel/collect', 1, 98, '', 8, 'modules/travel/views/crud/collect', 1, 1),
-- 社区模块
(107, NOW(), NOW(), NULL, '社区模块', NULL, 0, 41, 'chat-dot-round', 5, NULL, 1, 1),
(108, NOW(), NOW(), NULL, '游记管理', '/community/article', 1, 107, '', 1, 'modules/community/views/crud/article', 1, 1),
(109, NOW(), NOW(), NULL, '评论管理', '/community/comment', 1, 107, '', 2, 'modules/community/views/crud/comment', 1, 1),
(110, NOW(), NOW(), NULL, '话题管理', '/community/topic', 1, 107, '', 3, 'modules/community/views/crud/topic', 1, 1),
(111, NOW(), NOW(), NULL, '举报管理', '/community/report', 1, 107, '', 4, 'modules/community/views/crud/report', 1, 1),
(112, NOW(), NOW(), NULL, '关注管理', '/community/follow', 1, 107, '', 5, 'modules/community/views/crud/follow', 1, 1),
(113, NOW(), NOW(), NULL, '点赞管理', '/community/like', 1, 107, '', 6, 'modules/community/views/crud/like', 1, 1),
(114, NOW(), NOW(), NULL, '收藏管理', '/community/collect', 1, 107, '', 7, 'modules/community/views/crud/collect', 1, 1),
(115, NOW(), NOW(), NULL, '图片管理', '/community/image', 1, 107, '', 8, 'modules/community/views/crud/image', 1, 1),
(116, NOW(), NOW(), NULL, '视频管理', '/community/video', 1, 107, '', 9, 'modules/community/views/crud/video', 1, 1),
(117, NOW(), NOW(), NULL, '标签管理', '/community/tag', 1, 107, '', 10, 'modules/community/views/crud/tag', 1, 1),
-- 平台管理
(118, NOW(), NOW(), NULL, '平台管理', NULL, 0, 41, 'setting', 6, NULL, 1, 1),
(119, NOW(), NOW(), NULL, '商家入驻审核', '/platform/merchantApply', 1, 118, '', 1, 'modules/platform/views/crud/merchantApply', 1, 1),
(120, NOW(), NOW(), NULL, '轮播图管理', '/platform/banner', 1, 118, '', 2, 'modules/platform/views/crud/banner', 1, 1),
(121, NOW(), NOW(), NULL, '公告管理', '/platform/notice', 1, 118, '', 3, 'modules/platform/views/crud/notice', 1, 1),
(122, NOW(), NOW(), NULL, '推荐位管理', '/platform/recommend', 1, 118, '', 4, 'modules/platform/views/crud/recommend', 1, 1),
(123, NOW(), NOW(), NULL, '敏感词管理', '/platform/sensitiveWord', 1, 118, '', 5, 'modules/platform/views/crud/sensitiveWord', 1, 1),
(124, NOW(), NOW(), NULL, '数据统计', '/platform/stat', 1, 118, '', 6, 'modules/platform/views/crud/stat', 1, 1);
