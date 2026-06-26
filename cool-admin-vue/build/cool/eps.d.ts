declare namespace Eps {
	interface BaseSysDepartmentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 部门名称
		 */
		name?: string;

		/**
		 * 创建者ID
		 */
		userId?: number;

		/**
		 * 上级部门ID
		 */
		parentId?: number;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysLogEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 行为
		 */
		action?: string;

		/**
		 * ip
		 */
		ip?: string;

		/**
		 * 参数
		 */
		params?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysMenuEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 父菜单ID
		 */
		parentId?: number;

		/**
		 * 菜单名称
		 */
		name?: string;

		/**
		 * 菜单地址
		 */
		router?: string;

		/**
		 * 权限标识
		 */
		perms?: string;

		/**
		 * 类型 0-目录 1-菜单 2-按钮
		 */
		type?: number;

		/**
		 * 图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 视图地址
		 */
		viewPath?: string;

		/**
		 * 路由缓存
		 */
		keepAlive?: boolean;

		/**
		 * 是否显示
		 */
		isShow?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysParamEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 键
		 */
		keyName?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 数据类型 0-字符串 1-富文本 2-文件
		 */
		dataType?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysRoleEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 角色标签
		 */
		label?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 数据权限是否关联上下级
		 */
		relevance?: boolean;

		/**
		 * 菜单权限
		 */
		menuIdList?: any;

		/**
		 * 部门权限
		 */
		departmentIdList?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface BaseSysUserEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 部门ID
		 */
		departmentId?: number;

		/**
		 * 创建者ID
		 */
		userId?: number;

		/**
		 * 姓名
		 */
		name?: string;

		/**
		 * 用户名
		 */
		username?: string;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 密码版本, 作用是改完密码，让原来的token失效
		 */
		passwordV?: number;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 头像
		 */
		headImg?: string;

		/**
		 * 手机
		 */
		phone?: string;

		/**
		 * 邮箱
		 */
		email?: string;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * socketId
		 */
		socketId?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CartItemEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 商品ID
		 */
		goodsId?: number;

		/**
		 * 商品标题
		 */
		goodsTitle?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * SKU ID
		 */
		skuId?: number;

		/**
		 * SKU名称
		 */
		skuName?: string;

		/**
		 * 单价
		 */
		price?: number;

		/**
		 * 数量
		 */
		quantity?: number;

		/**
		 * 是否选中 0=否 1=是
		 */
		checked?: number;

		/**
		 * 来源模块 1=衣 2=食-农产品
		 */
		moduleType?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ClothingCategoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 父分类ID，0=顶级
		 */
		parentId?: number;

		/**
		 * 分类名称
		 */
		name?: string;

		/**
		 * 图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 状态 0=停用 1=启用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ClothingCollectEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 商品ID
		 */
		goodsId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ClothingGoodsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 分类ID
		 */
		categoryId?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 商品标题
		 */
		title?: string;

		/**
		 * 副标题
		 */
		subtitle?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 图片列表
		 */
		images?: any;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 市场价
		 */
		marketPrice?: number;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 销量
		 */
		sales?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 工艺介绍
		 */
		craftIntro?: string;

		/**
		 * 传承人
		 */
		inheritorName?: string;

		/**
		 * 详情
		 */
		detailContent?: string;

		/**
		 * 状态 0=下架 1=上架
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ClothingGoodsSkuEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商品ID
		 */
		goodsId?: number;

		/**
		 * 规格名称
		 */
		specName?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 图片
		 */
		image?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface ClothingReviewEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单ID
		 */
		orderId?: number;

		/**
		 * 商品ID
		 */
		goodsId?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 评价内容
		 */
		content?: string;

		/**
		 * 图片列表
		 */
		images?: any;

		/**
		 * 商家回复
		 */
		reply?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityArticleEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 文字内容
		 */
		content?: string;

		/**
		 * 图片列表
		 */
		images?: any;

		/**
		 * 视频URL
		 */
		videoUrl?: string;

		/**
		 * 话题ID列表
		 */
		topicIds?: any;

		/**
		 * 关联地点类型 1=餐厅 2=民宿 3=景区
		 */
		relatedPlaceType?: number;

		/**
		 * 关联地点ID
		 */
		relatedPlaceId?: number;

		/**
		 * 点赞数
		 */
		likes?: number;

		/**
		 * 评论数
		 */
		comments?: number;

		/**
		 * 收藏数
		 */
		collects?: number;

		/**
		 * 浏览数
		 */
		views?: number;

		/**
		 * 状态 0=待审核 1=正常 2=已下架
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityCollectEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 游记ID
		 */
		articleId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityCommentEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 游记ID
		 */
		articleId?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 父评论ID，0=一级评论
		 */
		parentId?: number;

		/**
		 * 回复的用户ID
		 */
		replyUserId?: number;

		/**
		 * 评论内容
		 */
		content?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityFollowEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 关注者ID
		 */
		followerId?: number;

		/**
		 * 被关注者ID
		 */
		followeeId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityImageEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 游记ID
		 */
		articleId?: number;

		/**
		 * 图片URL
		 */
		imageUrl?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityLikeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 目标类型 1=游记 2=评论
		 */
		targetType?: number;

		/**
		 * 目标ID
		 */
		targetId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityReportEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 举报用户ID
		 */
		userId?: number;

		/**
		 * 目标类型 1=游记 2=评论
		 */
		targetType?: number;

		/**
		 * 目标ID
		 */
		targetId?: number;

		/**
		 * 举报原因
		 */
		reason?: string;

		/**
		 * 处理状态 0=待处理 1=已处理 2=驳回
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityTagEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标签名
		 */
		name?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityTopicEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 话题名
		 */
		name?: string;

		/**
		 * 简介
		 */
		description?: string;

		/**
		 * 图标
		 */
		icon?: string;

		/**
		 * 关注数
		 */
		followers?: number;

		/**
		 * 游记数
		 */
		articles?: number;

		/**
		 * 是否推荐 0=否 1=是
		 */
		isRecommended?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface CommunityVideoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 游记ID
		 */
		articleId?: number;

		/**
		 * 视频URL
		 */
		videoUrl?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DemoGoodsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 描述
		 */
		description?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 分类
		 */
		type?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 示例图
		 */
		exampleImages?: any;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 昵称
		 */
		userName?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类型ID
		 */
		typeId?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 值
		 */
		value?: string;

		/**
		 * 排序
		 */
		orderNum?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 父ID
		 */
		parentId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface DictTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 标识
		 */
		key?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FoodAgricultureCategoryEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 父分类ID，0=顶级
		 */
		parentId?: number;

		/**
		 * 分类名称
		 */
		name?: string;

		/**
		 * 图标
		 */
		icon?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FoodAgricultureGoodsEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 分类ID
		 */
		categoryId?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 商品名称
		 */
		name?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 规格
		 */
		specification?: string;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 产地
		 */
		origin?: string;

		/**
		 * 保质期
		 */
		shelfLife?: string;

		/**
		 * 详情
		 */
		detailContent?: string;

		/**
		 * 状态 0=下架 1=上架
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FoodCollectEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 类型 1=餐厅 2=农产品
		 */
		targetType?: number;

		/**
		 * 目标ID(餐厅ID或商品ID)
		 */
		targetId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FoodDishEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 餐厅ID
		 */
		restaurantId?: number;

		/**
		 * 菜品名称
		 */
		name?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 介绍
		 */
		description?: string;

		/**
		 * 是否招牌 0=否 1=是
		 */
		isSignature?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FoodRestaurantEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 餐厅名称
		 */
		name?: string;

		/**
		 * 简介
		 */
		description?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 营业时间
		 */
		businessHours?: string;

		/**
		 * 容纳人数
		 */
		capacity?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 状态 0=停业 1=营业
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FoodReviewEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 餐厅ID
		 */
		restaurantId?: number;

		/**
		 * 商品ID
		 */
		goodsId?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 评价内容
		 */
		content?: string;

		/**
		 * 图片列表
		 */
		images?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface FoodTimeSlotEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 餐厅ID
		 */
		restaurantId?: number;

		/**
		 * 时段名称
		 */
		name?: string;

		/**
		 * 最大预订数
		 */
		maxBookings?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LodgingCalendarEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 房型ID
		 */
		roomTypeId?: number;

		/**
		 * 日期
		 */
		date?: Date;

		/**
		 * 可用库存
		 */
		availableStock?: number;

		/**
		 * 当日价格
		 */
		price?: number;

		/**
		 * 是否可订 0=不可订 1=可订
		 */
		isAvailable?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LodgingCollectEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 民宿ID
		 */
		hostelId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LodgingHostelEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 民宿名称
		 */
		name?: string;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 图片列表
		 */
		images?: any;

		/**
		 * 介绍
		 */
		description?: string;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 风格标签
		 */
		styleTags?: string;

		/**
		 * 设施标签
		 */
		facilityTags?: string;

		/**
		 * 状态 0=停业 1=营业
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LodgingHostelPolicyEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 民宿ID
		 */
		hostelId?: number;

		/**
		 * 入住时间
		 */
		checkInTime?: string;

		/**
		 * 离店时间
		 */
		checkOutTime?: string;

		/**
		 * 宠物政策
		 */
		petPolicy?: string;

		/**
		 * 是否含早 0=否 1=是
		 */
		includeBreakfast?: number;

		/**
		 * 押金金额
		 */
		deposit?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LodgingReviewEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单ID
		 */
		orderId?: number;

		/**
		 * 民宿ID
		 */
		hostelId?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 评价内容
		 */
		content?: string;

		/**
		 * 图片列表
		 */
		images?: any;

		/**
		 * 商家回复
		 */
		reply?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface LodgingRoomTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 民宿ID
		 */
		hostelId?: number;

		/**
		 * 房型名
		 */
		name?: string;

		/**
		 * 床型
		 */
		bedType?: string;

		/**
		 * 面积(平方米)
		 */
		area?: number;

		/**
		 * 容纳人数
		 */
		capacity?: number;

		/**
		 * 设施
		 */
		facilities?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 库存(房间数)
		 */
		stock?: number;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface MerchantEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 关联用户ID
		 */
		userId?: number;

		/**
		 * 所属模块 1=衣 2=食 3=住 4=行
		 */
		moduleType?: number;

		/**
		 * 店铺名称
		 */
		shopName?: string;

		/**
		 * 联系人
		 */
		contactName?: string;

		/**
		 * 联系电话
		 */
		contactPhone?: string;

		/**
		 * 状态 0=禁用 1=正常
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface OrderBaseEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单编号
		 */
		orderNo?: string;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 模块类型 1=衣 2=食 3=住 4=行
		 */
		moduleType?: number;

		/**
		 * 订单总金额
		 */
		totalAmount?: number;

		/**
		 * 实付金额
		 */
		payAmount?: number;

		/**
		 * 优惠金额
		 */
		discountAmount?: number;

		/**
		 * 订单状态 0=待支付 1=已支付 2=已确认 3=进行中 4=已完成 5=已取消 6=已退款
		 */
		status?: number;

		/**
		 * 支付时间
		 */
		payTime?: Date;

		/**
		 * 完成时间
		 */
		finishTime?: Date;

		/**
		 * 取消时间
		 */
		cancelTime?: Date;

		/**
		 * 用户备注
		 */
		remark?: string;

		/**
		 * 订单明细(JSON)
		 */
		items?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PaymentRecordEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单编号
		 */
		orderNo?: string;

		/**
		 * 支付流水号
		 */
		transactionId?: string;

		/**
		 * 支付金额
		 */
		amount?: number;

		/**
		 * 支付方式 1=微信支付
		 */
		payType?: number;

		/**
		 * 状态 0=待支付 1=已支付 2=支付失败
		 */
		status?: number;

		/**
		 * 支付时间
		 */
		payTime?: Date;

		/**
		 * 回调数据
		 */
		callbackData?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RefundRecordEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单编号
		 */
		orderNo?: string;

		/**
		 * 支付流水号
		 */
		transactionId?: string;

		/**
		 * 退款金额
		 */
		amount?: number;

		/**
		 * 退款原因
		 */
		reason?: string;

		/**
		 * 状态 0=申请中 1=已退款 2=拒绝退款
		 */
		status?: number;

		/**
		 * 退款时间
		 */
		refundTime?: Date;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PlatformBannerEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 图片URL
		 */
		imageUrl?: string;

		/**
		 * 跳转链接
		 */
		linkUrl?: string;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 状态 0=停用 1=启用
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PlatformMerchantApplyEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 申请人用户ID
		 */
		userId?: number;

		/**
		 * 店铺名称
		 */
		shopName?: string;

		/**
		 * 所属模块 1=衣 2=食 3=住 4=行
		 */
		moduleType?: number;

		/**
		 * 联系人
		 */
		contactName?: string;

		/**
		 * 联系电话
		 */
		contactPhone?: string;

		/**
		 * 资质材料(JSON)
		 */
		materials?: string;

		/**
		 * 审核状态 0=待审核 1=通过 2=驳回
		 */
		status?: number;

		/**
		 * 审核人
		 */
		reviewer?: string;

		/**
		 * 审核时间
		 */
		reviewTime?: Date;

		/**
		 * 驳回原因
		 */
		rejectReason?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PlatformNoticeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 内容
		 */
		content?: string;

		/**
		 * 状态 0=隐藏 1=显示
		 */
		status?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PlatformRecommendEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 推荐位名称
		 */
		name?: string;

		/**
		 * 内容类型 1=商品 2=餐厅 3=民宿 4=景区 5=路线 6=游记
		 */
		contentType?: number;

		/**
		 * 关联内容ID
		 */
		contentId?: number;

		/**
		 * 排序
		 */
		sort?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PlatformSensitiveWordEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 敏感词
		 */
		word?: string;

		/**
		 * 类型 1=违禁词 2=广告词 3=辱骂词
		 */
		type?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PlatformStatEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 统计日期
		 */
		statDate?: Date;

		/**
		 * 新增用户数
		 */
		newUserCount?: number;

		/**
		 * 订单数
		 */
		orderCount?: number;

		/**
		 * GMV
		 */
		gmv?: number;

		/**
		 * 游记发布数
		 */
		articleCount?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface PluginInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * 简介
		 */
		description?: string;

		/**
		 * Key名
		 */
		keyName?: string;

		/**
		 * Hook
		 */
		hook?: string;

		/**
		 * 描述
		 */
		readme?: string;

		/**
		 * 版本
		 */
		version?: string;

		/**
		 * Logo(base64)
		 */
		logo?: string;

		/**
		 * 作者
		 */
		author?: string;

		/**
		 * 状态 0-禁用 1-启用
		 */
		status?: number;

		/**
		 * 内容
		 */
		content?: any;

		/**
		 * ts内容
		 */
		tsContent?: any;

		/**
		 * 插件的plugin.json
		 */
		pluginJson?: any;

		/**
		 * 配置
		 */
		config?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface RecycleDataEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 表
		 */
		entityInfo?: any;

		/**
		 * 操作人
		 */
		userId?: number;

		/**
		 * 被删除的数据
		 */
		data?: any;

		/**
		 * 请求的接口
		 */
		url?: string;

		/**
		 * 请求参数
		 */
		params?: any;

		/**
		 * 删除数据条数
		 */
		count?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 姓名
		 */
		userName?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 地址
		 */
		url?: string;

		/**
		 * 类型
		 */
		type?: string;

		/**
		 * 分类ID
		 */
		classifyId?: number;

		/**
		 * 文件id
		 */
		fileId?: string;

		/**
		 * 文件名
		 */
		name?: string;

		/**
		 * 文件大小
		 */
		size?: number;

		/**
		 * 文档版本
		 */
		version?: number;

		/**
		 * 文件位置
		 */
		key?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface SpaceTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 类别名称
		 */
		name?: string;

		/**
		 * 父分类ID
		 */
		parentId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TaskInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 任务ID
		 */
		jobId?: string;

		/**
		 * 任务配置
		 */
		repeatConf?: string;

		/**
		 * 名称
		 */
		name?: string;

		/**
		 * cron
		 */
		cron?: string;

		/**
		 * 最大执行次数 不传为无限次
		 */
		limit?: number;

		/**
		 * 每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效
		 */
		every?: number;

		/**
		 * 备注
		 */
		remark?: string;

		/**
		 * 状态 0-停止 1-运行
		 */
		status?: number;

		/**
		 * 开始时间
		 */
		startDate?: Date;

		/**
		 * 结束时间
		 */
		endDate?: Date;

		/**
		 * 数据
		 */
		data?: string;

		/**
		 * 执行的service实例ID
		 */
		service?: string;

		/**
		 * 状态 0-系统 1-用户
		 */
		type?: number;

		/**
		 * 下一次执行时间
		 */
		nextRunTime?: Date;

		/**
		 * 状态 0-cron 1-时间间隔
		 */
		taskType?: number;

		/**
		 * undefined
		 */
		lastExecuteTime?: Date;

		/**
		 * undefined
		 */
		lockExpireTime?: Date;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelCollectEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 类型 1=景区 2=路线
		 */
		targetType?: number;

		/**
		 * 目标ID
		 */
		targetId?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelETicketEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单编号
		 */
		orderNo?: string;

		/**
		 * 票种/路线ID
		 */
		targetId?: number;

		/**
		 * 二维码
		 */
		qrCode?: string;

		/**
		 * 状态 0=未使用 1=已使用 2=已退款
		 */
		status?: number;

		/**
		 * 使用日期
		 */
		useDate?: Date;

		/**
		 * 核销时间
		 */
		verifyTime?: Date;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelGuideEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 标题
		 */
		title?: string;

		/**
		 * 出发地
		 */
		departure?: string;

		/**
		 * 交通方式
		 */
		transport?: string;

		/**
		 * 时长
		 */
		duration?: string;

		/**
		 * 费用
		 */
		cost?: string;

		/**
		 * 详细说明
		 */
		content?: string;

		/**
		 * 攻略图
		 */
		images?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelReviewEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 订单ID
		 */
		orderId?: number;

		/**
		 * 景区/路线ID
		 */
		targetId?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 评价内容
		 */
		content?: string;

		/**
		 * 图片列表
		 */
		images?: any;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelRouteEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 路线标题
		 */
		title?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 行程天数
		 */
		days?: number;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 包含项目
		 */
		includes?: string;

		/**
		 * 注意事项
		 */
		notes?: string;

		/**
		 * 详情
		 */
		detailContent?: string;

		/**
		 * 状态 0=下架 1=上架
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelRouteDayEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 路线ID
		 */
		routeId?: number;

		/**
		 * 天数
		 */
		day?: number;

		/**
		 * 行程描述
		 */
		description?: string;

		/**
		 * 景点
		 */
		spots?: string;

		/**
		 * 用餐
		 */
		meals?: string;

		/**
		 * 住宿
		 */
		accommodation?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelScenicEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 商家ID
		 */
		merchantId?: number;

		/**
		 * 景区名称
		 */
		name?: string;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 主图
		 */
		mainImage?: string;

		/**
		 * 介绍
		 */
		description?: string;

		/**
		 * 开放时间
		 */
		openHours?: string;

		/**
		 * 评分
		 */
		rating?: number;

		/**
		 * 状态 0=关闭 1=开放
		 */
		status?: number;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface TravelTicketTypeEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 景区ID
		 */
		scenicId?: number;

		/**
		 * 票种名称
		 */
		name?: string;

		/**
		 * 价格
		 */
		price?: number;

		/**
		 * 库存
		 */
		stock?: number;

		/**
		 * 有效期规则
		 */
		validityRule?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserAddressEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 用户ID
		 */
		userId?: number;

		/**
		 * 联系人
		 */
		contact?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 省
		 */
		province?: string;

		/**
		 * 市
		 */
		city?: string;

		/**
		 * 区
		 */
		district?: string;

		/**
		 * 地址
		 */
		address?: string;

		/**
		 * 是否默认
		 */
		isDefault?: boolean;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	interface UserInfoEntity {
		/**
		 * ID
		 */
		id?: number;

		/**
		 * 登录唯一ID
		 */
		unionid?: string;

		/**
		 * 头像
		 */
		avatarUrl?: string;

		/**
		 * 昵称
		 */
		nickName?: string;

		/**
		 * 手机号
		 */
		phone?: string;

		/**
		 * 性别
		 */
		gender?: number;

		/**
		 * 状态
		 */
		status?: number;

		/**
		 * 登录方式
		 */
		loginType?: number;

		/**
		 * 密码
		 */
		password?: string;

		/**
		 * 介绍
		 */
		description?: string;

		/**
		 * 创建时间
		 */
		createTime?: string;

		/**
		 * 更新时间
		 */
		updateTime?: string;

		/**
		 * 任意键值
		 */
		[key: string]: any;
	}

	type json = any;

	interface PagePagination {
		size: number;
		page: number;
		total: number;
		[key: string]: any;
	}

	interface PageResponse<T> {
		pagination: PagePagination;
		list: T[];
		[key: string]: any;
	}

	interface BaseSysLogPageResponse {
		pagination: PagePagination;
		list: BaseSysLogEntity[];
	}

	interface BaseSysMenuPageResponse {
		pagination: PagePagination;
		list: BaseSysMenuEntity[];
	}

	interface BaseSysParamPageResponse {
		pagination: PagePagination;
		list: BaseSysParamEntity[];
	}

	interface BaseSysRolePageResponse {
		pagination: PagePagination;
		list: BaseSysRoleEntity[];
	}

	interface BaseSysUserPageResponse {
		pagination: PagePagination;
		list: BaseSysUserEntity[];
	}

	interface CartItemPageResponse {
		pagination: PagePagination;
		list: CartItemEntity[];
	}

	interface ClothingCategoryPageResponse {
		pagination: PagePagination;
		list: ClothingCategoryEntity[];
	}

	interface ClothingCollectPageResponse {
		pagination: PagePagination;
		list: ClothingCollectEntity[];
	}

	interface ClothingGoodsPageResponse {
		pagination: PagePagination;
		list: ClothingGoodsEntity[];
	}

	interface ClothingGoodsSkuPageResponse {
		pagination: PagePagination;
		list: ClothingGoodsSkuEntity[];
	}

	interface ClothingReviewPageResponse {
		pagination: PagePagination;
		list: ClothingReviewEntity[];
	}

	interface CommunityArticlePageResponse {
		pagination: PagePagination;
		list: CommunityArticleEntity[];
	}

	interface CommunityCollectPageResponse {
		pagination: PagePagination;
		list: CommunityCollectEntity[];
	}

	interface CommunityCommentPageResponse {
		pagination: PagePagination;
		list: CommunityCommentEntity[];
	}

	interface CommunityFollowPageResponse {
		pagination: PagePagination;
		list: CommunityFollowEntity[];
	}

	interface CommunityImagePageResponse {
		pagination: PagePagination;
		list: CommunityImageEntity[];
	}

	interface CommunityLikePageResponse {
		pagination: PagePagination;
		list: CommunityLikeEntity[];
	}

	interface CommunityReportPageResponse {
		pagination: PagePagination;
		list: CommunityReportEntity[];
	}

	interface CommunityTagPageResponse {
		pagination: PagePagination;
		list: CommunityTagEntity[];
	}

	interface CommunityTopicPageResponse {
		pagination: PagePagination;
		list: CommunityTopicEntity[];
	}

	interface CommunityVideoPageResponse {
		pagination: PagePagination;
		list: CommunityVideoEntity[];
	}

	interface DemoGoodsPageResponse {
		pagination: PagePagination;
		list: DemoGoodsEntity[];
	}

	interface DictInfoPageResponse {
		pagination: PagePagination;
		list: DictInfoEntity[];
	}

	interface DictTypePageResponse {
		pagination: PagePagination;
		list: DictTypeEntity[];
	}

	interface FoodAgricultureCategoryPageResponse {
		pagination: PagePagination;
		list: FoodAgricultureCategoryEntity[];
	}

	interface FoodAgricultureGoodsPageResponse {
		pagination: PagePagination;
		list: FoodAgricultureGoodsEntity[];
	}

	interface FoodCollectPageResponse {
		pagination: PagePagination;
		list: FoodCollectEntity[];
	}

	interface FoodDishPageResponse {
		pagination: PagePagination;
		list: FoodDishEntity[];
	}

	interface FoodRestaurantPageResponse {
		pagination: PagePagination;
		list: FoodRestaurantEntity[];
	}

	interface FoodReviewPageResponse {
		pagination: PagePagination;
		list: FoodReviewEntity[];
	}

	interface FoodTimeSlotPageResponse {
		pagination: PagePagination;
		list: FoodTimeSlotEntity[];
	}

	interface LodgingCalendarPageResponse {
		pagination: PagePagination;
		list: LodgingCalendarEntity[];
	}

	interface LodgingCollectPageResponse {
		pagination: PagePagination;
		list: LodgingCollectEntity[];
	}

	interface LodgingHostelPageResponse {
		pagination: PagePagination;
		list: LodgingHostelEntity[];
	}

	interface LodgingHostelPolicyPageResponse {
		pagination: PagePagination;
		list: LodgingHostelPolicyEntity[];
	}

	interface LodgingReviewPageResponse {
		pagination: PagePagination;
		list: LodgingReviewEntity[];
	}

	interface LodgingRoomTypePageResponse {
		pagination: PagePagination;
		list: LodgingRoomTypeEntity[];
	}

	interface MerchantPageResponse {
		pagination: PagePagination;
		list: MerchantEntity[];
	}

	interface OrderBasePageResponse {
		pagination: PagePagination;
		list: OrderBaseEntity[];
	}

	interface PaymentRecordPageResponse {
		pagination: PagePagination;
		list: PaymentRecordEntity[];
	}

	interface PaymentRefundPageResponse {
		pagination: PagePagination;
		list: RefundRecordEntity[];
	}

	interface PlatformBannerPageResponse {
		pagination: PagePagination;
		list: PlatformBannerEntity[];
	}

	interface PlatformMerchantApplyPageResponse {
		pagination: PagePagination;
		list: PlatformMerchantApplyEntity[];
	}

	interface PlatformNoticePageResponse {
		pagination: PagePagination;
		list: PlatformNoticeEntity[];
	}

	interface PlatformRecommendPageResponse {
		pagination: PagePagination;
		list: PlatformRecommendEntity[];
	}

	interface PlatformSensitiveWordPageResponse {
		pagination: PagePagination;
		list: PlatformSensitiveWordEntity[];
	}

	interface PlatformStatPageResponse {
		pagination: PagePagination;
		list: PlatformStatEntity[];
	}

	interface PluginInfoPageResponse {
		pagination: PagePagination;
		list: PluginInfoEntity[];
	}

	interface RecycleDataPageResponse {
		pagination: PagePagination;
		list: RecycleDataEntity[];
	}

	interface SpaceInfoPageResponse {
		pagination: PagePagination;
		list: SpaceInfoEntity[];
	}

	interface SpaceTypePageResponse {
		pagination: PagePagination;
		list: SpaceTypeEntity[];
	}

	interface TaskInfoPageResponse {
		pagination: PagePagination;
		list: TaskInfoEntity[];
	}

	interface TravelCollectPageResponse {
		pagination: PagePagination;
		list: TravelCollectEntity[];
	}

	interface TravelETicketPageResponse {
		pagination: PagePagination;
		list: TravelETicketEntity[];
	}

	interface TravelGuidePageResponse {
		pagination: PagePagination;
		list: TravelGuideEntity[];
	}

	interface TravelReviewPageResponse {
		pagination: PagePagination;
		list: TravelReviewEntity[];
	}

	interface TravelRoutePageResponse {
		pagination: PagePagination;
		list: TravelRouteEntity[];
	}

	interface TravelRouteDayPageResponse {
		pagination: PagePagination;
		list: TravelRouteDayEntity[];
	}

	interface TravelScenicPageResponse {
		pagination: PagePagination;
		list: TravelScenicEntity[];
	}

	interface TravelTicketTypePageResponse {
		pagination: PagePagination;
		list: TravelTicketTypeEntity[];
	}

	interface UserAddressPageResponse {
		pagination: PagePagination;
		list: UserAddressEntity[];
	}

	interface UserInfoPageResponse {
		pagination: PagePagination;
		list: UserInfoEntity[];
	}

	interface BaseCoding {
		/**
		 * 获取模块目录结构
		 */
		getModuleTree(data?: any): Promise<any>;

		/**
		 * 创建代码
		 */
		createCode(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { getModuleTree: string; createCode: string };

		/**
		 * 权限状态
		 */
		_permission: { getModuleTree: boolean; createCode: boolean };

		request: Request;
	}

	interface BaseComm {
		/**
		 * 修改个人信息
		 */
		personUpdate(data?: any): Promise<any>;

		/**
		 * 文件上传模式
		 */
		uploadMode(data?: any): Promise<any>;

		/**
		 * 权限与菜单
		 */
		permmenu(data?: any): Promise<any>;

		/**
		 * 编程
		 */
		program(data?: any): Promise<any>;

		/**
		 * 个人信息
		 */
		person(data?: any): Promise<any>;

		/**
		 * 文件上传
		 */
		upload(data?: any): Promise<any>;

		/**
		 * 退出
		 */
		logout(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			personUpdate: string;
			uploadMode: string;
			permmenu: string;
			program: string;
			person: string;
			upload: string;
			logout: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			personUpdate: boolean;
			uploadMode: boolean;
			permmenu: boolean;
			program: boolean;
			person: boolean;
			upload: boolean;
			logout: boolean;
		};

		request: Request;
	}

	interface BaseOpen {
		/**
		 * 刷新token
		 */
		refreshToken(data?: any): Promise<any>;

		/**
		 * 验证码
		 */
		captcha(data?: any): Promise<any>;

		/**
		 * 登录
		 */
		login(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 实体信息与路径
		 */
		eps(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			refreshToken: string;
			captcha: string;
			login: string;
			html: string;
			eps: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			refreshToken: boolean;
			captcha: boolean;
			login: boolean;
			html: boolean;
			eps: boolean;
		};

		request: Request;
	}

	interface BaseSysDepartment {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 排序
		 */
		order(data?: any): Promise<any>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysDepartmentEntity[]>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { delete: string; update: string; order: string; list: string; add: string };

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			order: boolean;
			list: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysLog {
		/**
		 * 日志保存时间
		 */
		setKeep(data?: any): Promise<any>;

		/**
		 * 获得日志保存时间
		 */
		getKeep(data?: any): Promise<any>;

		/**
		 * 清理
		 */
		clear(data?: any): Promise<any>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysLogPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { setKeep: string; getKeep: string; clear: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { setKeep: boolean; getKeep: boolean; clear: boolean; page: boolean };

		request: Request;
	}

	interface BaseSysMenu {
		/**
		 * 创建代码
		 */
		create(data?: any): Promise<any>;

		/**
		 * 导出
		 */
		export(data?: any): Promise<any>;

		/**
		 * 导入
		 */
		import(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 解析
		 */
		parse(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysMenuEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysMenuEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysMenuPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			create: string;
			export: string;
			import: string;
			delete: string;
			update: string;
			parse: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			create: boolean;
			export: boolean;
			import: boolean;
			delete: boolean;
			update: boolean;
			parse: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysParam {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 获得网页内容的参数值
		 */
		html(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysParamEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysParamPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			html: string;
			info: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			html: boolean;
			info: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysRole {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysRoleEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysRoleEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysRolePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface BaseSysUser {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 移动部门
		 */
		move(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<BaseSysUserEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<BaseSysUserEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<BaseSysUserPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			move: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			move: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CartItem {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CartItemEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CartItemEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CartItemPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ClothingCategory {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ClothingCategoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ClothingCategoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ClothingCategoryPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ClothingCollect {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ClothingCollectEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ClothingCollectEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ClothingCollectPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ClothingGoods {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ClothingGoodsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ClothingGoodsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ClothingGoodsPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ClothingGoodsSku {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ClothingGoodsSkuEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ClothingGoodsSkuEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ClothingGoodsSkuPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface ClothingReview {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<ClothingReviewEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<ClothingReviewEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<ClothingReviewPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityArticle {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityArticleEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityArticleEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityArticlePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityCollect {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityCollectEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityCollectEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityCollectPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityComment {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityCommentEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityCommentEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityCommentPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityFollow {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityFollowEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityFollowEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityFollowPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityImage {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityImageEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityImageEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityImagePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityLike {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityLikeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityLikeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityLikePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityReport {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityReportEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityReportEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityReportPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityTag {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityTagEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityTagEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityTagPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityTopic {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityTopicEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityTopicEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityTopicPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface CommunityVideo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<CommunityVideoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<CommunityVideoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<CommunityVideoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DemoGoods {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DemoGoodsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DemoGoodsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DemoGoodsPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DemoTenant {
		/**
		 * 局部不使用多租户
		 */
		noTenant(data?: any): Promise<any>;

		/**
		 * 不使用多租户
		 */
		noUse(data?: any): Promise<any>;

		/**
		 * use
		 */
		use(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: { noTenant: string; noUse: string; use: string };

		/**
		 * 权限状态
		 */
		_permission: { noTenant: boolean; noUse: boolean; use: boolean };

		request: Request;
	}

	interface DictInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 获得所有字典类型
		 */
		types(data?: any): Promise<any>;

		/**
		 * 获得字典数据
		 */
		data(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DictInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			types: string;
			data: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			types: boolean;
			data: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface DictType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<DictTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<DictTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<DictTypePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface FoodAgricultureCategory {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FoodAgricultureCategoryEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FoodAgricultureCategoryEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodAgricultureCategoryPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface FoodAgricultureGoods {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FoodAgricultureGoodsEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FoodAgricultureGoodsEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodAgricultureGoodsPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface FoodCollect {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FoodCollectEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FoodCollectEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodCollectPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface FoodDish {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FoodDishEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FoodDishEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodDishPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface FoodRestaurant {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FoodRestaurantEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FoodRestaurantEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodRestaurantPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface FoodReview {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FoodReviewEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FoodReviewEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodReviewPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface FoodTimeSlot {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<FoodTimeSlotEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<FoodTimeSlotEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<FoodTimeSlotPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface LodgingCalendar {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<LodgingCalendarEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<LodgingCalendarEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<LodgingCalendarPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface LodgingCollect {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<LodgingCollectEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<LodgingCollectEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<LodgingCollectPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface LodgingHostel {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<LodgingHostelEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<LodgingHostelEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<LodgingHostelPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface LodgingHostelPolicy {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<LodgingHostelPolicyEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<LodgingHostelPolicyEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<LodgingHostelPolicyPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface LodgingReview {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<LodgingReviewEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<LodgingReviewEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<LodgingReviewPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface LodgingRoomType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<LodgingRoomTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<LodgingRoomTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<LodgingRoomTypePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface Merchant {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<MerchantEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<MerchantEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<MerchantPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface OrderBase {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<OrderBaseEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<OrderBaseEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<OrderBasePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PaymentRecord {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PaymentRecordEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PaymentRecordEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PaymentRecordPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PaymentRefund {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RefundRecordEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<RefundRecordEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PaymentRefundPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PlatformBanner {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PlatformBannerEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PlatformBannerEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PlatformBannerPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PlatformMerchantApply {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PlatformMerchantApplyEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PlatformMerchantApplyEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PlatformMerchantApplyPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PlatformNotice {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PlatformNoticeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PlatformNoticeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PlatformNoticePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PlatformRecommend {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PlatformRecommendEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PlatformRecommendEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PlatformRecommendPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PlatformSensitiveWord {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PlatformSensitiveWordEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PlatformSensitiveWordEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PlatformSensitiveWordPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PlatformStat {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PlatformStatEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PlatformStatEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PlatformStatPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface PluginInfo {
		/**
		 * 安装插件
		 */
		install(data?: any): Promise<any>;

		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<PluginInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<PluginInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<PluginInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			install: string;
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			install: boolean;
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface RecycleData {
		/**
		 * 恢复数据
		 */
		restore(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<RecycleDataEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<RecycleDataPageResponse>;

		/**
		 * 权限标识
		 */
		permission: { restore: string; info: string; page: string };

		/**
		 * 权限状态
		 */
		_permission: { restore: boolean; info: boolean; page: boolean };

		request: Request;
	}

	interface SpaceInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SpaceInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface SpaceType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<SpaceTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<SpaceTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<SpaceTypePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TaskInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 开始
		 */
		start(data?: any): Promise<any>;

		/**
		 * 执行一次
		 */
		once(data?: any): Promise<any>;

		/**
		 * 停止
		 */
		stop(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TaskInfoEntity>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TaskInfoPageResponse>;

		/**
		 * 日志
		 */
		log(data?: any): Promise<any>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			start: string;
			once: string;
			stop: string;
			info: string;
			page: string;
			log: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			start: boolean;
			once: boolean;
			stop: boolean;
			info: boolean;
			page: boolean;
			log: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelCollect {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelCollectEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelCollectEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelCollectPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelETicket {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelETicketEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelETicketEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelETicketPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelGuide {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelGuideEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelGuideEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelGuidePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelReview {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelReviewEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelReviewEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelReviewPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelRoute {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelRouteEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelRouteEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelRoutePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelRouteDay {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelRouteDayEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelRouteDayEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelRouteDayPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelScenic {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelScenicEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelScenicEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelScenicPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface TravelTicketType {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<TravelTicketTypeEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<TravelTicketTypeEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<TravelTicketTypePageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserAddress {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserAddressEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserAddressEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserAddressPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface UserInfo {
		/**
		 * 删除
		 */
		delete(data?: any): Promise<any>;

		/**
		 * 修改
		 */
		update(data?: any): Promise<any>;

		/**
		 * 单个信息
		 */
		info(data?: any): Promise<UserInfoEntity>;

		/**
		 * 列表查询
		 */
		list(data?: any): Promise<UserInfoEntity[]>;

		/**
		 * 分页查询
		 */
		page(data?: any): Promise<UserInfoPageResponse>;

		/**
		 * 新增
		 */
		add(data?: any): Promise<any>;

		/**
		 * 权限标识
		 */
		permission: {
			delete: string;
			update: string;
			info: string;
			list: string;
			page: string;
			add: string;
		};

		/**
		 * 权限状态
		 */
		_permission: {
			delete: boolean;
			update: boolean;
			info: boolean;
			list: boolean;
			page: boolean;
			add: boolean;
		};

		request: Request;
	}

	interface RequestOptions {
		url: string;
		method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";
		data?: any;
		params?: any;
		headers?: any;
		timeout?: number;
		[key: string]: any;
	}

	type Request = (options: RequestOptions) => Promise<any>;

	type DictKey = "brand" | "occupation";

	type Service = {
		request: Request;

		base: {
			coding: BaseCoding;
			comm: BaseComm;
			open: BaseOpen;
			sys: {
				department: BaseSysDepartment;
				log: BaseSysLog;
				menu: BaseSysMenu;
				param: BaseSysParam;
				role: BaseSysRole;
				user: BaseSysUser;
			};
		};
		cart: { item: CartItem };
		clothing: {
			category: ClothingCategory;
			collect: ClothingCollect;
			goods: ClothingGoods;
			goodsSku: ClothingGoodsSku;
			review: ClothingReview;
		};
		community: {
			article: CommunityArticle;
			collect: CommunityCollect;
			comment: CommunityComment;
			follow: CommunityFollow;
			image: CommunityImage;
			like: CommunityLike;
			report: CommunityReport;
			tag: CommunityTag;
			topic: CommunityTopic;
			video: CommunityVideo;
		};
		demo: { goods: DemoGoods; tenant: DemoTenant };
		dict: { info: DictInfo; type: DictType };
		food: {
			agricultureCategory: FoodAgricultureCategory;
			agricultureGoods: FoodAgricultureGoods;
			collect: FoodCollect;
			dish: FoodDish;
			restaurant: FoodRestaurant;
			review: FoodReview;
			timeSlot: FoodTimeSlot;
		};
		lodging: {
			calendar: LodgingCalendar;
			collect: LodgingCollect;
			hostel: LodgingHostel;
			hostelPolicy: LodgingHostelPolicy;
			review: LodgingReview;
			roomType: LodgingRoomType;
		};
		merchant: Merchant;
		order: { base: OrderBase };
		payment: { record: PaymentRecord; refund: PaymentRefund };
		platform: {
			banner: PlatformBanner;
			merchantApply: PlatformMerchantApply;
			notice: PlatformNotice;
			recommend: PlatformRecommend;
			sensitiveWord: PlatformSensitiveWord;
			stat: PlatformStat;
		};
		plugin: { info: PluginInfo };
		recycle: { data: RecycleData };
		space: { info: SpaceInfo; type: SpaceType };
		task: { info: TaskInfo };
		travel: {
			collect: TravelCollect;
			eTicket: TravelETicket;
			guide: TravelGuide;
			review: TravelReview;
			route: TravelRoute;
			routeDay: TravelRouteDay;
			scenic: TravelScenic;
			ticketType: TravelTicketType;
		};
		user: { address: UserAddress; info: UserInfo };
	};
}
