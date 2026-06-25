-- =====================================================================
-- 乌东文旅平台 - 住宿预订 / 苗寨民宿搜索 数据库初始化脚本
-- 技术栈: MySQL 5.7+ / 8.0  字符集: utf8mb4
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS wudong_tourism;

CREATE DATABASE wudong_tourism
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE wudong_tourism;

-- ---------------------------------------------------------------------
-- 1. 用户表 user
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username`    VARCHAR(64)  NOT NULL                COMMENT '用户名',
  `password`    VARCHAR(128) NOT NULL                COMMENT '密码(加密)',
  `nickname`    VARCHAR(64)  NULL                    COMMENT '昵称',
  `phone`       VARCHAR(20)  NULL                    COMMENT '手机号',
  `avatar`      VARCHAR(255) NULL                    COMMENT '头像URL',
  `gender`      TINYINT      NULL DEFAULT 0          COMMENT '性别:0未知 1男 2女',
  `status`      TINYINT      NOT NULL DEFAULT 1      COMMENT '状态:0禁用 1启用',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted`  TINYINT      NOT NULL DEFAULT 0      COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ---------------------------------------------------------------------
-- 2. 苗寨/景区表 miao_village
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `miao_village`;
CREATE TABLE `miao_village` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name`          VARCHAR(128) NOT NULL                COMMENT '苗寨名称',
  `description`   TEXT         NULL                    COMMENT '苗寨简介',
  `address`       VARCHAR(255) NULL                    COMMENT '详细地址',
  `longitude`     DECIMAL(10,6) NULL                   COMMENT '经度',
  `latitude`      DECIMAL(10,6) NULL                   COMMENT '纬度',
  `cover_image`   VARCHAR(255) NULL                    COMMENT '封面图URL',
  `images`        TEXT         NULL                    COMMENT '图片列表(JSON数组)',
  `ticket_price`  DECIMAL(10,2) NULL                   COMMENT '门票价格',
  `open_time`     VARCHAR(128) NULL                    COMMENT '开放时间',
  `status`        TINYINT      NOT NULL DEFAULT 1      COMMENT '状态:0下架 1上架',
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted`    TINYINT      NOT NULL DEFAULT 0      COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='苗寨/景区表';

-- ---------------------------------------------------------------------
-- 3. 住宿/民宿表 accommodation
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `accommodation`;
CREATE TABLE `accommodation` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `village_id`    BIGINT UNSIGNED NOT NULL                COMMENT '所属苗寨ID',
  `name`          VARCHAR(128)  NOT NULL                  COMMENT '民宿名称',
  `type`          VARCHAR(32)   NULL DEFAULT 'minsute'    COMMENT '类型:minsute民宿 inn客栈 hotel酒店',
  `description`   TEXT          NULL                      COMMENT '民宿详情',
  `address`       VARCHAR(255)  NULL                      COMMENT '详细地址',
  `longitude`     DECIMAL(10,6) NULL                      COMMENT '经度',
  `latitude`      DECIMAL(10,6) NULL                      COMMENT '纬度',
  `cover_image`   VARCHAR(255)  NULL                      COMMENT '封面图URL',
  `images`        TEXT          NULL                      COMMENT '图片列表(JSON)',
  `lowest_price`  DECIMAL(10,2) NOT NULL DEFAULT 0.00     COMMENT '最低价格',
  `highest_price` DECIMAL(10,2) NULL                      COMMENT '最高价格',
  `rating`        DECIMAL(2,1)  NULL DEFAULT 5.0          COMMENT '评分',
  `review_count`  INT           NOT NULL DEFAULT 0        COMMENT '评价数',
  `facilities`    TEXT          NULL                      COMMENT '设施(JSON)',
  `house_rules`   TEXT          NULL                      COMMENT '入住须知',
  `status`        TINYINT       NOT NULL DEFAULT 1        COMMENT '状态:0下架 1上架',
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted`    TINYINT       NOT NULL DEFAULT 0        COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`),
  KEY `idx_village_id` (`village_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='住宿/民宿表';

-- ---------------------------------------------------------------------
-- 4. 房型表 room
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room` (
  `id`                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `accommodation_id`  BIGINT UNSIGNED NOT NULL                COMMENT '所属住宿ID',
  `name`              VARCHAR(128) NOT NULL                   COMMENT '房型名称',
  `description`       TEXT         NULL                       COMMENT '房型描述',
  `cover_image`       VARCHAR(255) NULL                       COMMENT '封面图URL',
  `images`            TEXT         NULL                       COMMENT '图片列表(JSON)',
  `area`              DECIMAL(8,2) NULL                       COMMENT '面积(平方米)',
  `max_guests`        INT          NOT NULL DEFAULT 2         COMMENT '最大入住人数',
  `bed_type`          VARCHAR(32)  NULL DEFAULT '大床房'       COMMENT '床型',
  `floor`             VARCHAR(32)  NULL                       COMMENT '楼层',
  `price`             DECIMAL(10,2) NOT NULL DEFAULT 0.00     COMMENT '价格/晚',
  `stock`             INT          NOT NULL DEFAULT 1         COMMENT '库存数量',
  `facilities`        TEXT         NULL                       COMMENT '房间设施(JSON)',
  `status`            TINYINT      NOT NULL DEFAULT 1         COMMENT '状态:0下架 1上架',
  `created_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted`        TINYINT      NOT NULL DEFAULT 0         COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`),
  KEY `idx_accommodation_id` (`accommodation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房型表';

-- ---------------------------------------------------------------------
-- 5. 房态日历表 room_calendar  (每天库存+价格可不同)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `room_calendar`;
CREATE TABLE `room_calendar` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `room_id`          BIGINT UNSIGNED NOT NULL                 COMMENT '房型ID',
  `accommodation_id` BIGINT UNSIGNED NOT NULL                 COMMENT '住宿ID（冗余，便于查询）',
  `date`             DATE         NOT NULL                    COMMENT '日期',
  `price`            DECIMAL(10,2) NOT NULL                   COMMENT '当日价格/晚',
  `stock`            INT          NOT NULL DEFAULT 0          COMMENT '当日可用库存',
  `is_closed`        TINYINT      NOT NULL DEFAULT 0          COMMENT '是否关闭:0正常 1关闭（节假日封锁等）',
  `remark`           VARCHAR(128) NULL                        COMMENT '备注（如：节假日加价）',
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted`       TINYINT      NOT NULL DEFAULT 0          COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_room_date` (`room_id`, `date`),
  KEY `idx_accommodation_date` (`accommodation_id`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房态日历表（每日库存价格）';

-- ---------------------------------------------------------------------
-- 6. 预订订单表 `order`
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `order_no`         VARCHAR(64)  NOT NULL                    COMMENT '订单编号',
  `user_id`          BIGINT UNSIGNED NOT NULL                 COMMENT '用户ID',
  `accommodation_id` BIGINT UNSIGNED NOT NULL                 COMMENT '住宿ID',
  `room_id`          BIGINT UNSIGNED NOT NULL                 COMMENT '房型ID',
  `check_in_date`    DATE         NOT NULL                    COMMENT '入住日期',
  `check_out_date`   DATE         NOT NULL                    COMMENT '退房日期',
  `nights`           INT          NOT NULL DEFAULT 1          COMMENT '入住晚数',
  `guests`           INT          NOT NULL DEFAULT 1          COMMENT '入住人数',
  `guest_name`       VARCHAR(64)  NULL                        COMMENT '入住人姓名',
  `guest_phone`      VARCHAR(20)  NULL                        COMMENT '入住人手机',
  `total_price`      DECIMAL(10,2) NOT NULL DEFAULT 0.00      COMMENT '订单总价',
  `remark`           VARCHAR(255) NULL                        COMMENT '备注',
  `status`           TINYINT      NOT NULL DEFAULT 0          COMMENT '状态:0待支付 1已支付 2已取消 3已完成 4已退款',
  `cancel_policy`    VARCHAR(512) NULL                        COMMENT '退订政策说明（预留字段）',
  `cancel_deadline`  DATETIME     NULL                        COMMENT '最晚免费取消时间（预留字段）',
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted`       TINYINT      NOT NULL DEFAULT 0          COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_accommodation_id` (`accommodation_id`),
  KEY `idx_room_id` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预订订单表';

-- ---------------------------------------------------------------------
-- 7. 评价表 review
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review` (
  `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id`          BIGINT UNSIGNED NOT NULL                 COMMENT '用户ID',
  `accommodation_id` BIGINT UNSIGNED NOT NULL                 COMMENT '住宿ID',
  `order_id`         BIGINT UNSIGNED NULL                     COMMENT '订单ID',
  `rating`           TINYINT      NOT NULL DEFAULT 5          COMMENT '评分1-5',
  `content`          TEXT         NULL                        COMMENT '评价内容',
  `images`           TEXT         NULL                        COMMENT '评价图片(JSON)',
  `is_anonymous`     TINYINT      NOT NULL DEFAULT 0          COMMENT '是否匿名:0否 1是',
  `status`           TINYINT      NOT NULL DEFAULT 1          COMMENT '状态:0隐藏 1显示',
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted`       TINYINT      NOT NULL DEFAULT 0          COMMENT '软删除:0未删 1已删',
  PRIMARY KEY (`id`),
  KEY `idx_accommodation_id` (`accommodation_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';

-- =====================================================================
-- 初始示例数据（可选，便于联调）
-- =====================================================================
INSERT INTO `miao_village` (`name`, `description`, `address`, `cover_image`, `ticket_price`, `open_time`)
VALUES
  ('西江千户苗寨', '世界上最大的苗族聚居村寨，吊脚楼依山而建，夜景璀璨。', '贵州省黔东南州雷山县西江镇', '/images/xijiang.jpg', 100.00, '08:00-22:00'),
  ('肇兴侗寨', '侗族文化中心，鼓楼与风雨桥闻名遐迩。', '贵州省黔东南州黎平县肇兴乡', '/images/zhaoxing.jpg', 80.00, '08:00-18:00');

INSERT INTO `accommodation` (`village_id`, `name`, `type`, `description`, `address`, `lowest_price`, `highest_price`, `rating`, `review_count`, `cover_image`)
VALUES
  (1, '苗岭云宿', 'minsute', '苗寨山顶观景民宿，推窗见万家灯火。', '西江千户苗寨观景台旁', 388.00, 888.00, 4.8, 126, '/images/miaoling.jpg'),
  (1, '风雨桥客栈', 'inn', '风雨桥畔临水客栈，清晨可听溪流鸟鸣。', '西江千户苗寨风雨桥边', 258.00, 458.00, 4.6, 89, '/images/fengyuqiao.jpg'),
  (2, '侗寨山居', 'minsute', '鼓楼旁木楼民宿，体验侗族大歌文化。', '肇兴侗寨核心区', 298.00, 598.00, 4.7, 64, '/images/dongzhai.jpg');

INSERT INTO `room` (`accommodation_id`, `name`, `description`, `area`, `max_guests`, `bed_type`, `price`, `stock`, `cover_image`)
VALUES
  (1, '观景大床房', '全景落地窗，直面苗寨夜景', 28.00, 2, '1.8m大床', 588.00, 3, '/images/room1.jpg'),
  (1, '星空双床房', '独立阳台，可观星赏月', 32.00, 3, '1.2m双床', 688.00, 2, '/images/room2.jpg'),
  (2, '临水标准间', '推窗即见风雨桥', 22.00, 2, '1.2m双床', 358.00, 5, '/images/room3.jpg'),
  (3, '鼓楼景观房', '木楼结构，鼓楼景观', 26.00, 2, '1.8m大床', 458.00, 4, '/images/room4.jpg');

INSERT INTO `user` (`username`, `password`, `nickname`, `phone`)
VALUES
  ('tourist01', 'e10adc3949ba59abbe56e057f20f883e', '游客小王', '13800138000'),
  ('traveler02', 'e10adc3949ba59abbe56e057f20f883e', '旅人小李', '13900139000');

-- 房态日历示例数据（room_id=1 观景大床房，2026-07-01 ~ 2026-07-07）
INSERT INTO `room_calendar` (`room_id`, `accommodation_id`, `date`, `price`, `stock`, `is_closed`, `remark`)
VALUES
  (1, 1, '2026-07-01', 588.00, 3, 0, NULL),
  (1, 1, '2026-07-02', 588.00, 3, 0, NULL),
  (1, 1, '2026-07-03', 688.00, 2, 0, '周末加价'),
  (1, 1, '2026-07-04', 688.00, 2, 0, '周末加价'),
  (1, 1, '2026-07-05', 588.00, 3, 0, NULL),
  (1, 1, '2026-07-06', 588.00, 3, 0, NULL),
  (1, 1, '2026-07-07', 588.00, 1, 0, NULL),
  -- room_id=2 星空双床房
  (2, 1, '2026-07-01', 688.00, 2, 0, NULL),
  (2, 1, '2026-07-02', 688.00, 2, 0, NULL),
  (2, 1, '2026-07-03', 888.00, 1, 0, '周末加价'),
  (2, 1, '2026-07-04', 888.00, 0, 1, '已满房'),
  (2, 1, '2026-07-05', 688.00, 2, 0, NULL),
  -- room_id=3 临水标准间
  (3, 2, '2026-07-01', 358.00, 5, 0, NULL),
  (3, 2, '2026-07-02', 358.00, 4, 0, NULL),
  (3, 2, '2026-07-03', 458.00, 3, 0, '周末加价');

SET FOREIGN_KEY_CHECKS = 1;
