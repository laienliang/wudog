-- ============================================================
-- 乌东文旅"衣食住行"综合服务平台 - 数据库初始化脚本
-- 数据库名：wudong_platform
-- 字符集：utf8mb4 · 排序：utf8mb4_unicode_ci · 引擎：InnoDB
-- 适用版本：MySQL 8.0+
-- 注意：执行前请确保 MySQL 客户端使用 utf8mb4 编码
--       mysql -u root -p --default-character-set=utf8mb4 < init.sql
-- ============================================================

SET NAMES utf8mb4;

-- 创建数据库（如已存在则跳过）
CREATE DATABASE IF NOT EXISTS `wudong_platform`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `wudong_platform`;

-- ============================================================
-- 模块 1：衣·民族特色商品（wd_clothing_*）
-- ============================================================

-- 商品分类表
CREATE TABLE `wd_clothing_category` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL COMMENT '分类名称（如苗绣、蜡染、银饰）',
  `parent_id`   BIGINT UNSIGNED DEFAULT 0 COMMENT '父分类ID（0=顶级）',
  `sort_order`  INT DEFAULT 0 COMMENT '排序',
  `icon`        VARCHAR(500) DEFAULT NULL COMMENT '图标URL',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='衣·商品分类';

-- 商品表（从 Entity 生成）
CREATE TABLE `wd_clothing_product` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`             VARCHAR(200) NOT NULL COMMENT '商品标题',
  `subtitle`         VARCHAR(500) DEFAULT NULL COMMENT '副标题',
  `category_id`      BIGINT UNSIGNED NOT NULL COMMENT '分类ID',
  `merchant_id`      BIGINT UNSIGNED NOT NULL COMMENT '商家ID',
  `main_image`       VARCHAR(500) NOT NULL COMMENT '主图URL',
  `price`            DECIMAL(10,2) NOT NULL COMMENT '售价',
  `market_price`     DECIMAL(10,2) DEFAULT NULL COMMENT '市场价',
  `sales`            INT DEFAULT 0 COMMENT '销量',
  `rating`           DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  `description`      TEXT DEFAULT NULL COMMENT '富文本详情',
  `craft_description` TEXT DEFAULT NULL COMMENT '制作工艺/文化介绍',
  `status`           TINYINT DEFAULT 1 COMMENT '状态：0下架 1上架',
  `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`       DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='衣·商品';

-- 商品 SKU 表
CREATE TABLE `wd_clothing_sku` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `name`        VARCHAR(100) NOT NULL COMMENT 'SKU名称（如"大号·红色"）',
  `attrs`       JSON DEFAULT NULL COMMENT '规格属性（如{"颜色":"红","尺寸":"M"}）',
  `price`       DECIMAL(10,2) NOT NULL COMMENT 'SKU售价',
  `stock`       INT NOT NULL DEFAULT 0 COMMENT '库存',
  `image`       VARCHAR(500) DEFAULT NULL COMMENT 'SKU图片',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='衣·商品SKU';

-- 商品图片表
CREATE TABLE `wd_clothing_product_image` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `url`         VARCHAR(500) NOT NULL COMMENT '图片URL',
  `sort_order`  INT DEFAULT 0 COMMENT '排序',
  `type`        TINYINT DEFAULT 1 COMMENT '类型：1详情图 2轮播图',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='衣·商品图片';

-- 商品评论表
CREATE TABLE `wd_clothing_review` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `user_id`     BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `order_id`    BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `rating`      TINYINT NOT NULL COMMENT '评分1-5',
  `content`     TEXT DEFAULT NULL COMMENT '评价内容',
  `images`      JSON DEFAULT NULL COMMENT '图片列表',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='衣·商品评论';

-- ============================================================
-- 模块 2：食·餐饮美食（wd_food_*）
-- ============================================================

-- 餐厅表
CREATE TABLE `wd_food_restaurant` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `merchant_id`   BIGINT UNSIGNED NOT NULL COMMENT '商家ID',
  `name`          VARCHAR(200) NOT NULL COMMENT '餐厅名称',
  `cover_image`   VARCHAR(500) NOT NULL COMMENT '封面图',
  `images`        JSON DEFAULT NULL COMMENT '餐厅图片列表',
  `phone`         VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `address`       VARCHAR(500) DEFAULT NULL COMMENT '地址',
  `lng_lat`       POINT DEFAULT NULL COMMENT '经纬度（GIS）',
  `opening_hours` VARCHAR(200) DEFAULT NULL COMMENT '营业时间',
  `cuisine_tags`  JSON DEFAULT NULL COMMENT '菜系标签（如["苗家菜","酸汤鱼"]）',
  `description`   TEXT DEFAULT NULL COMMENT '餐厅介绍',
  `rating`        DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  `status`        TINYINT DEFAULT 1 COMMENT '状态：0关闭 1营业',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='食·餐厅';

-- 餐位时段表
CREATE TABLE `wd_food_meal_slot` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `restaurant_id` BIGINT UNSIGNED NOT NULL COMMENT '餐厅ID',
  `name`          VARCHAR(100) NOT NULL COMMENT '时段名称（如午餐、晚餐）',
  `start_time`    TIME NOT NULL COMMENT '开始时间',
  `end_time`      TIME NOT NULL COMMENT '结束时间',
  `max_capacity`  INT NOT NULL DEFAULT 0 COMMENT '最大容量',
  `price`         DECIMAL(10,2) DEFAULT 0.00 COMMENT '餐位价格',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_restaurant_id` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='食·餐位时段';

-- 农产品/土特产表
CREATE TABLE `wd_food_product` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `merchant_id`   BIGINT UNSIGNED NOT NULL COMMENT '商家ID',
  `name`          VARCHAR(200) NOT NULL COMMENT '产品名称',
  `main_image`    VARCHAR(500) NOT NULL COMMENT '主图',
  `price`         DECIMAL(10,2) NOT NULL COMMENT '售价',
  `unit`          VARCHAR(20) DEFAULT NULL COMMENT '单位（斤/份/袋）',
  `stock`         INT DEFAULT 0 COMMENT '库存',
  `description`   TEXT DEFAULT NULL COMMENT '产品介绍',
  `status`        TINYINT DEFAULT 1 COMMENT '状态：0下架 1上架',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='食·农产品/土特产';

-- ============================================================
-- 模块 3：住·住宿预订（wd_accommodation_*）
-- ============================================================

-- 民宿表
CREATE TABLE `wd_accommodation_homestay` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `merchant_id`   BIGINT UNSIGNED NOT NULL COMMENT '商家ID',
  `name`          VARCHAR(200) NOT NULL COMMENT '民宿名称',
  `cover_image`   VARCHAR(500) NOT NULL COMMENT '封面图',
  `images`        JSON DEFAULT NULL COMMENT '图片列表',
  `phone`         VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `address`       VARCHAR(500) DEFAULT NULL COMMENT '地址',
  `lng_lat`       POINT DEFAULT NULL COMMENT '经纬度',
  `description`   TEXT DEFAULT NULL COMMENT '民宿介绍',
  `facilities`    JSON DEFAULT NULL COMMENT '设施列表',
  `rating`        DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  `status`        TINYINT DEFAULT 1 COMMENT '状态：0关闭 1营业',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='住·民宿';

-- 房型表
CREATE TABLE `wd_accommodation_room_type` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `homestay_id`   BIGINT UNSIGNED NOT NULL COMMENT '民宿ID',
  `name`          VARCHAR(100) NOT NULL COMMENT '房型名称',
  `area`          VARCHAR(50) DEFAULT NULL COMMENT '面积（如"30㎡"）',
  `bed_type`      VARCHAR(100) DEFAULT NULL COMMENT '床型',
  `max_guests`    INT DEFAULT 2 COMMENT '最多入住人数',
  `price`         DECIMAL(10,2) NOT NULL COMMENT '平日价',
  `weekend_price` DECIMAL(10,2) DEFAULT NULL COMMENT '周末价',
  `images`        JSON DEFAULT NULL COMMENT '房型图片',
  `facilities`    JSON DEFAULT NULL COMMENT '设施',
  `quantity`      INT NOT NULL DEFAULT 1 COMMENT '房间数量',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_homestay_id` (`homestay_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='住·房型';

-- 房态日历表
CREATE TABLE `wd_accommodation_calendar` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `room_type_id`  BIGINT UNSIGNED NOT NULL COMMENT '房型ID',
  `date`          DATE NOT NULL COMMENT '日期',
  `price`         DECIMAL(10,2) NOT NULL COMMENT '当日价格',
  `stock`         INT NOT NULL COMMENT '剩余房间数',
  `status`        TINYINT DEFAULT 0 COMMENT '状态：0可订 1满房 2维护',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_room_date` (`room_type_id`, `date`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='住·房态日历';

-- ============================================================
-- 模块 4：行·线路订票（wd_travel_*）
-- ============================================================

-- 景区表
CREATE TABLE `wd_travel_scenic_spot` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(200) NOT NULL COMMENT '景区名称',
  `cover_image`   VARCHAR(500) NOT NULL COMMENT '封面图',
  `images`        JSON DEFAULT NULL COMMENT '图片列表',
  `address`       VARCHAR(500) DEFAULT NULL COMMENT '地址',
  `lng_lat`       POINT DEFAULT NULL COMMENT '经纬度',
  `description`   TEXT DEFAULT NULL COMMENT '景区介绍',
  `opening_hours` VARCHAR(200) DEFAULT NULL COMMENT '开放时间',
  `rating`        DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  `status`        TINYINT DEFAULT 1 COMMENT '状态：0关闭 1开放',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='行·景区';

-- 票种表
CREATE TABLE `wd_travel_ticket_type` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `scenic_id`     BIGINT UNSIGNED NOT NULL COMMENT '景区ID',
  `name`          VARCHAR(100) NOT NULL COMMENT '票种名称（成人票/儿童票/套票）',
  `price`         DECIMAL(10,2) NOT NULL COMMENT '售价',
  `stock`         INT DEFAULT 0 COMMENT '库存',
  `valid_days`    INT DEFAULT 1 COMMENT '有效期天数',
  `description`   TEXT DEFAULT NULL COMMENT '说明',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_scenic_id` (`scenic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='行·票种';

-- 苗寨游路线表
CREATE TABLE `wd_travel_route` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(200) NOT NULL COMMENT '路线名称',
  `cover_image`   VARCHAR(500) NOT NULL COMMENT '封面图',
  `duration`      VARCHAR(50) DEFAULT NULL COMMENT '行程时长（如"2天1晚"）',
  `price`         DECIMAL(10,2) NOT NULL COMMENT '套餐价',
  `max_people`    INT DEFAULT 20 COMMENT '成团人数上限',
  `scenic_ids`    JSON DEFAULT NULL COMMENT '包含景区ID列表',
  `description`   TEXT DEFAULT NULL COMMENT '路线详情',
  `itinerary`     JSON DEFAULT NULL COMMENT '行程安排',
  `status`        TINYINT DEFAULT 1 COMMENT '状态：0下架 1上架',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='行·路线';

-- 电子票表（核销记录）
CREATE TABLE `wd_travel_e_ticket` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`      BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `ticket_code`   VARCHAR(100) NOT NULL COMMENT '核销码',
  `status`        TINYINT DEFAULT 0 COMMENT '状态：0未使用 1已核销 2已过期',
  `used_at`       DATETIME DEFAULT NULL COMMENT '核销时间',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_ticket_code` (`ticket_code`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='行·电子票';

-- ============================================================
-- 模块 5：社区·照片分享（wd_community_*）
-- ============================================================

-- 话题表
CREATE TABLE `wd_community_topic` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL COMMENT '话题名称',
  `icon`        VARCHAR(500) DEFAULT NULL COMMENT '图标',
  `sort_order`  INT DEFAULT 0 COMMENT '排序',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='社区·话题';

-- 游记表
CREATE TABLE `wd_community_travelogue` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED NOT NULL COMMENT '作者ID',
  `title`         VARCHAR(200) NOT NULL COMMENT '标题',
  `content`       TEXT NOT NULL COMMENT '内容（富文本）',
  `cover_image`   VARCHAR(500) DEFAULT NULL COMMENT '封面图',
  `images`        JSON DEFAULT NULL COMMENT '图片列表',
  `video_url`     VARCHAR(500) DEFAULT NULL COMMENT '视频URL',
  `location`      VARCHAR(200) DEFAULT NULL COMMENT '发布位置',
  `topic_id`      BIGINT UNSIGNED DEFAULT NULL COMMENT '关联话题ID',
  `status`        TINYINT DEFAULT 0 COMMENT '状态：0待审核 1已发布 2驳回',
  `view_count`    INT DEFAULT 0 COMMENT '浏览数',
  `like_count`    INT DEFAULT 0 COMMENT '点赞数',
  `comment_count` INT DEFAULT 0 COMMENT '评论数',
  `share_count`   INT DEFAULT 0 COMMENT '分享数',
  `linked_type`   VARCHAR(20) DEFAULT NULL COMMENT '关联类型（restaurant/homestay/scenic）',
  `linked_id`     BIGINT UNSIGNED DEFAULT NULL COMMENT '关联业务ID',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_topic_id` (`topic_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='社区·游记';

-- 评论表（社区评论，与商品评论分开）
CREATE TABLE `wd_community_comment` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       BIGINT UNSIGNED NOT NULL COMMENT '评论者ID',
  `target_type`   VARCHAR(50) NOT NULL COMMENT '目标类型（travelogue/comment）',
  `target_id`     BIGINT UNSIGNED NOT NULL COMMENT '目标ID',
  `parent_id`     BIGINT UNSIGNED DEFAULT NULL COMMENT '父评论ID（回复）',
  `content`       TEXT NOT NULL COMMENT '评论内容',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_target` (`target_type`, `target_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='社区·评论';

-- 点赞表
CREATE TABLE `wd_community_like` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(50) NOT NULL COMMENT '目标类型（travelogue/comment）',
  `target_id`   BIGINT UNSIGNED NOT NULL COMMENT '目标ID',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_target` (`user_id`, `target_type`, `target_id`),
  KEY `idx_target` (`target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='社区·点赞';

-- 收藏表
CREATE TABLE `wd_community_favorite` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `target_type` VARCHAR(50) NOT NULL COMMENT '目标类型',
  `target_id`   BIGINT UNSIGNED NOT NULL COMMENT '目标ID',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_target` (`user_id`, `target_type`, `target_id`),
  KEY `idx_target` (`target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='社区·收藏';

-- 关注表
CREATE TABLE `wd_community_follow` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `follower_id` BIGINT UNSIGNED NOT NULL COMMENT '关注者ID',
  `following_id` BIGINT UNSIGNED NOT NULL COMMENT '被关注者ID',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_follow` (`follower_id`, `following_id`),
  KEY `idx_following_id` (`following_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='社区·关注';

-- ============================================================
-- 公共服务：用户（wd_user_*）
-- ============================================================

-- 用户表
CREATE TABLE `wd_user` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `openid`        VARCHAR(100) DEFAULT NULL COMMENT '微信openid',
  `unionid`       VARCHAR(100) DEFAULT NULL COMMENT '微信unionid',
  `phone`         VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `nickname`      VARCHAR(100) DEFAULT NULL COMMENT '昵称',
  `avatar`        VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `gender`        TINYINT DEFAULT 0 COMMENT '性别：0未知 1男 2女',
  `region`        VARCHAR(100) DEFAULT NULL COMMENT '地区',
  `bio`           VARCHAR(200) DEFAULT NULL COMMENT '个人简介',
  `role`          VARCHAR(50) DEFAULT 'user' COMMENT '角色：user/merchant/admin',
  `password`      VARCHAR(255) DEFAULT NULL COMMENT '密码（bcrypt）',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_openid` (`openid`),
  UNIQUE KEY `uniq_phone` (`phone`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户';

-- 短信验证码表
CREATE TABLE `wd_sms_code` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone`      VARCHAR(20) NOT NULL COMMENT '手机号',
  `code`       VARCHAR(6) NOT NULL COMMENT '验证码',
  `used`       TINYINT DEFAULT 0 COMMENT '是否已使用',
  `expire_at`  DATETIME NOT NULL COMMENT '过期时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_phone` (`phone`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='短信验证码';

-- ============================================================
-- 公共服务：购物车（wd_cart_*）
-- ============================================================

CREATE TABLE `wd_cart_item` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `product_type` VARCHAR(50) NOT NULL COMMENT '商品类型（clothing/food_product）',
  `product_id`  BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `sku_id`      BIGINT UNSIGNED DEFAULT NULL COMMENT 'SKU ID',
  `quantity`    INT NOT NULL DEFAULT 1 COMMENT '数量',
  `selected`    TINYINT DEFAULT 1 COMMENT '是否选中',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_user_product` (`user_id`, `product_type`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车';

-- ============================================================
-- 公共服务：订单（wd_order_*）
-- ============================================================

-- 主订单表
CREATE TABLE `wd_order` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_no`      VARCHAR(64) NOT NULL COMMENT '订单号',
  `user_id`       BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `merchant_id`   BIGINT UNSIGNED DEFAULT NULL COMMENT '商家ID',
  `order_type`    VARCHAR(50) NOT NULL COMMENT '订单类型（clothing/food_meal/food_product/accommodation/travel）',
  `total_amount`  DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `pay_amount`    DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  `status`        VARCHAR(20) NOT NULL DEFAULT 'pending_pay' COMMENT '状态：pending_pay/paid/confirmed/completed/refunded/cancelled',
  `pay_type`      VARCHAR(20) DEFAULT NULL COMMENT '支付方式（wechat）',
  `pay_time`      DATETIME DEFAULT NULL COMMENT '支付时间',
  `remark`        VARCHAR(500) DEFAULT NULL COMMENT '备注',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`    DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`),
  KEY `idx_order_type` (`order_type`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单';

-- 订单明细表
CREATE TABLE `wd_order_item` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`      BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `product_type`  VARCHAR(50) NOT NULL COMMENT '商品类型',
  `product_id`    BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `product_name`  VARCHAR(200) NOT NULL COMMENT '商品名称',
  `product_image` VARCHAR(500) DEFAULT NULL COMMENT '商品图片',
  `sku_id`        BIGINT UNSIGNED DEFAULT NULL COMMENT 'SKU ID',
  `sku_name`      VARCHAR(100) DEFAULT NULL COMMENT 'SKU名称',
  `unit_price`    DECIMAL(10,2) NOT NULL COMMENT '单价',
  `quantity`      INT NOT NULL DEFAULT 1 COMMENT '数量',
  `subtotal`      DECIMAL(10,2) NOT NULL COMMENT '小计',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细';

-- 订单状态快照表（审计）
CREATE TABLE `wd_order_status_log` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`    BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `from_status` VARCHAR(20) DEFAULT NULL COMMENT '原状态',
  `to_status`   VARCHAR(20) NOT NULL COMMENT '新状态',
  `operator`    VARCHAR(100) DEFAULT 'system' COMMENT '操作人',
  `remark`      VARCHAR(500) DEFAULT NULL COMMENT '备注',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单状态日志';

-- ============================================================
-- 模块 6：平台管理后台（wd_admin_*）
-- ============================================================

-- 管理员表
CREATE TABLE `wd_admin_user` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`    VARCHAR(100) NOT NULL COMMENT '用户名',
  `password`    VARCHAR(255) NOT NULL COMMENT '密码（bcrypt）',
  `real_name`   VARCHAR(100) DEFAULT NULL COMMENT '真实姓名',
  `phone`       VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `email`       VARCHAR(200) DEFAULT NULL COMMENT '邮箱',
  `role_id`     BIGINT UNSIGNED DEFAULT NULL COMMENT '角色ID',
  `status`      TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username` (`username`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理·管理员';

-- 角色表
CREATE TABLE `wd_admin_role` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL COMMENT '角色名称',
  `permissions` JSON DEFAULT NULL COMMENT '权限列表',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '描述',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理·角色';

-- 商家表
CREATE TABLE `wd_admin_merchant` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     BIGINT UNSIGNED NOT NULL COMMENT '关联用户ID',
  `shop_name`   VARCHAR(200) NOT NULL COMMENT '店铺名称',
  `shop_type`   VARCHAR(50) NOT NULL COMMENT '店铺类型（clothing/food/accommodation/travel）',
  `contact_name` VARCHAR(100) DEFAULT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `status`      TINYINT DEFAULT 0 COMMENT '状态：0待审核 1已通过 2驳回',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at`  DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理·商家';

-- 操作审计日志表
CREATE TABLE `wd_admin_audit_log` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id`    BIGINT UNSIGNED DEFAULT NULL COMMENT '管理员ID',
  `action`      VARCHAR(100) NOT NULL COMMENT '操作类型',
  `target_type` VARCHAR(50) DEFAULT NULL COMMENT '操作对象类型',
  `target_id`   BIGINT UNSIGNED DEFAULT NULL COMMENT '操作对象ID',
  `detail`      JSON DEFAULT NULL COMMENT '操作详情',
  `ip`          VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理·审计日志';

-- ============================================================
-- 插入基础数据
-- ============================================================

-- 商品分类（衣）
INSERT INTO `wd_clothing_category` (`id`, `name`, `parent_id`, `sort_order`, `icon`) VALUES
(1, '苗绣',   0, 1, NULL),
(2, '蜡染',   0, 2, NULL),
(3, '银饰',   0, 3, NULL),
(4, '民族服饰', 0, 4, NULL),
(5, '手工艺品', 0, 5, NULL);

-- 管理员角色
INSERT INTO `wd_admin_role` (`id`, `name`, `permissions`, `description`) VALUES
(1, '超级管理员', '[\"*\"]', '全平台管理权限'),
(2, '商家管理员', '[\"product_manage\",\"order_manage\"]', '商家后台管理'),
(3, '运营人员',  '[\"content_audit\",\"operation_config\"]', '内容审核与运营配置');

-- 默认管理员（密码：admin123，bcrypt cost=12）
INSERT INTO `wd_admin_user` (`id`, `username`, `password`, `real_name`, `role_id`, `status`) VALUES
(1, 'admin', '$2a$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Ql0vGq1Kq1Kq1Kq1Kq1Kq1Kq1O', '系统管理员', 1, 1);

-- 社区话题
INSERT INTO `wd_community_topic` (`id`, `name`, `sort_order`) VALUES
(1, '苗寨风情', 1),
(2, '蜡染体验', 2),
(3, '美食探店', 3),
(4, '民宿推荐', 4),
(5, '苗家节日', 5);
