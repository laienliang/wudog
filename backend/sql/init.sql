CREATE DATABASE IF NOT EXISTS `wudong_group3` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wudong_group3`;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `booking_order`;
DROP TABLE IF EXISTS `favorite`;
DROP TABLE IF EXISTS `review`;
DROP TABLE IF EXISTS `room_calendar`;
DROP TABLE IF EXISTS `checkin_notice`;
DROP TABLE IF EXISTS `room`;
DROP TABLE IF EXISTS `homestay`;

CREATE TABLE `homestay` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `merchant_id`   BIGINT UNSIGNED DEFAULT NULL,
  `name`          VARCHAR(100) NOT NULL,
  `address`       VARCHAR(200) DEFAULT NULL,
  `lng`           DECIMAL(10,6) DEFAULT NULL,
  `lat`           DECIMAL(10,6) DEFAULT NULL,
  `style_tags`    VARCHAR(200) DEFAULT NULL,
  `facility_tags` VARCHAR(200) DEFAULT NULL,
  `cover_image`   VARCHAR(255) DEFAULT NULL,
  `description`   TEXT DEFAULT NULL,
  `rating`        DECIMAL(2,1) DEFAULT 5.0,
  `status`        TINYINT DEFAULT 1,
  `is_deleted`    TINYINT(1) DEFAULT 0 COMMENT '软删除:0正常,1已删除',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_merchant` (`merchant_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `homestay` (`id`, `merchant_id`, `name`, `address`, `lng`, `lat`, `style_tags`, `facility_tags`, `cover_image`, `description`, `rating`, `status`) VALUES
(1, 1, '乌东苗寨·云舍', '贵州省黔东南州雷山县西江镇乌东村1号', 108.224300, 26.389700, '苗寨风情,山景,吊脚楼', 'WiFi,空调,停车场,餐厅,茶室,洗衣服务,行李寄存', '/src/assets/image/homestay/homestay_01.png', '坐落在乌东苗寨半山腰的精品民宿，推窗即见梯田云海。每间客房均由苗家吊脚楼改造而成，保留传统建筑风貌的同时融入现代舒适设施，是体验苗族文化的绝佳落脚处。', 4.8, 1),
(2, 1, '梯田·半山居', '贵州省黔东南州雷山县西江镇乌东村2号', 108.231500, 26.392100, '田园风光,山景,家庭,独栋', 'WiFi,空调,停车场,厨房,烧烤,儿童乐园', '/src/assets/image/homestay/homestay_02.png', '独栋别墅式民宿，每栋带独立庭院，可远眺千亩梯田。适合家庭出游和亲友聚会，提供烧烤设备和厨房，让您在山水间享受家一般的温暖。', 4.6, 1),
(3, 2, '苗韵·山居客栈', '贵州省黔东南州雷山县丹江镇苗寨大道88号', 108.215800, 26.401200, '苗族文化,民族风情,经济型', 'WiFi,空调,行李寄存,旅游咨询,叫醒服务', '/src/assets/image/homestay/homestay_03.png', '主打苗族文化体验的经济型客栈，房间装饰充满蜡染、苗绣元素。提供苗族服饰试穿、蜡染体验等特色活动，是深度体验苗族文化的高性价比之选。', 4.5, 1),
(4, 3, '云溪·观景民宿', '贵州省黔东南州雷山县西江镇山顶路6号', 108.219400, 26.385600, '云海景观,日出,摄影,情侣', 'WiFi,空调,停车场,观景台,茶室,摄影器材租赁', '/src/assets/image/homestay/homestay_04.png', '位于山顶，拥有360度全景视野。清晨可观云海日出，傍晚可见落日余晖。每间客房均为落地窗设计，躺在床上就能欣赏苗寨全景，是摄影爱好者和情侣的理想之选。', 4.9, 1),
(5, 1, '竹里·轻奢民宿', '贵州省黔东南州雷山县西江镇竹林路12号', 108.226800, 26.387300, '轻奢,竹林,静修,禅意', 'WiFi,空调,停车场,泳池,SPA,健身房,私人管家', '/src/assets/image/homestay/homestay_05.png', '隐匿于竹林深处的轻奢民宿，采用极简禅意设计。配有无边泳池、SPA、健身房等高端设施，私人管家服务让您的度假体验无微不至。', 4.7, 1);

CREATE TABLE `room` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `homestay_id`  BIGINT UNSIGNED NOT NULL,
  `room_name`    VARCHAR(100) NOT NULL,
  `bed_type`     VARCHAR(50) DEFAULT NULL,
  `area`         INT DEFAULT NULL,
  `max_people`   INT DEFAULT 2,
  `facility`     TEXT DEFAULT NULL,
  `base_price`   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `stock`        INT DEFAULT 5,
  `is_deleted`   TINYINT(1) DEFAULT 0 COMMENT '软删除:0正常,1已删除',
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_homestay` (`homestay_id`),
  INDEX `idx_is_deleted` (`is_deleted`),
  CONSTRAINT `fk_room_homestay` FOREIGN KEY (`homestay_id`) REFERENCES `homestay`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `room` (`id`, `homestay_id`, `room_name`, `bed_type`, `area`, `max_people`, `facility`, `base_price`, `stock`) VALUES
(1, 1, '观云大床房', '大床1.8m×2m', 35, 2, '独立卫浴,观景阳台,茶具,地暖,智能马桶,浴缸', 298.00, 5),
(2, 1, '苗韵双床房', '单人床1.5m×2', 30, 2, '独立卫浴,山景窗,茶具,地暖', 268.00, 4),
(3, 1, '亲子家庭房', '大床1.8m+单人床1.2m', 50, 4, '独立卫浴,观景阳台,儿童用品,浴缸,地暖', 498.00, 3),
(4, 2, '独栋·两居庭院', '大床1.8m+双床1.5m', 120, 6, '独立卫浴×2,庭院,厨房,烧烤设备,空调,地暖', 1280.00, 2),
(5, 2, '独栋·一居山景', '大床1.8m', 60, 2, '独立卫浴,庭院,厨房,观景露台,空调,地暖', 798.00, 3),
(6, 2, '普通大床房', '大床1.5m', 28, 2, '独立卫浴,空调', 388.00, 6),
(7, 3, '苗绣大床房', '大床1.8m', 25, 2, '独立卫浴,苗绣装饰,空调', 188.00, 8),
(8, 3, '苗族风情双床房', '单人床1.2m×2', 22, 2, '独立卫浴,蜡染装饰,空调', 168.00, 6),
(9, 3, '亲子苗族套房', '大床1.8m+单人床1.2m', 40, 3, '独立卫浴,苗族服饰试穿,空调', 298.00, 4),
(10, 4, '云端大床房', '大床1.8m', 40, 2, '独立卫浴,落地窗,观景阳台,浴缸,地暖,咖啡机', 598.00, 4),
(11, 4, '云海全景套房', '大床2.0m', 65, 2, '独立卫浴,270°全景落地窗,观景阳台,按摩浴缸,地暖', 998.00, 2),
(12, 4, '星空双床房', '单人床1.5m×2', 35, 2, '独立卫浴,天窗,观景台,地暖', 458.00, 3),
(13, 5, '竹林静修大床房', '大床1.8m', 45, 2, '独立卫浴,竹林景观,禅意茶室,地暖,智能家居', 888.00, 3),
(14, 5, '竹林轻奢套房', '大床2.0m', 80, 2, '独立卫浴,私人泳池,SPA浴缸,衣帽间,智能家居,私人管家', 1580.00, 2),
(15, 5, '竹林家庭套房', '大床1.8m+单人床1.2m×2', 75, 4, '独立卫浴×2,儿童乐园,厨房,智能家居', 1280.00, 2);

CREATE TABLE `room_calendar` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `room_id`         BIGINT UNSIGNED NOT NULL,
  `booking_date`    DATE NOT NULL,
  `available_stock` INT DEFAULT 5,
  `price`           DECIMAL(10,2) DEFAULT NULL,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_room_date` (`room_id`, `booking_date`),
  INDEX `idx_date` (`booking_date`),
  CONSTRAINT `fk_calendar_room` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `room_calendar` (`room_id`, `booking_date`, `available_stock`, `price`) VALUES
(1, '2026-07-01', 5, 298.00), (1, '2026-07-02', 5, 298.00), (1, '2026-07-03', 5, 328.00),
(1, '2026-07-04', 5, 328.00), (1, '2026-07-05', 5, 328.00), (1, '2026-07-06', 5, 298.00),
(2, '2026-07-01', 4, 268.00), (2, '2026-07-02', 4, 268.00), (2, '2026-07-03', 4, 298.00),
(3, '2026-07-01', 3, 498.00), (3, '2026-07-02', 3, 498.00), (3, '2026-07-03', 3, 558.00),
(7, '2026-07-01', 8, 188.00), (7, '2026-07-02', 8, 188.00), (7, '2026-07-03', 8, 188.00),
(8, '2026-07-01', 6, 168.00), (8, '2026-07-02', 6, 168.00), (8, '2026-07-03', 6, 168.00),
(10, '2026-07-01', 4, 598.00), (10, '2026-07-02', 4, 598.00), (10, '2026-07-03', 4, 658.00),
(13, '2026-07-01', 3, 888.00), (13, '2026-07-02', 3, 888.00), (13, '2026-07-03', 3, 888.00);

DELIMITER //
CREATE PROCEDURE `gen_calendar`()
BEGIN
  DECLARE i INT;
  DECLARE d DATE;
  DECLARE r INT DEFAULT 1;
  DECLARE s INT;
  DECLARE p DECIMAL(10,2);
  WHILE r <= 15 DO
    SELECT stock, base_price INTO s, p FROM `room` WHERE id = r;
    SET i = 0;
    WHILE i < 30 DO
      SET d = DATE_ADD('2026-07-01', INTERVAL i DAY);
      IF DAYOFWEEK(d) IN (1,7) THEN SET p = p * 1.2; END IF;
      INSERT IGNORE INTO `room_calendar` (`room_id`, `booking_date`, `available_stock`, `price`) VALUES (r, d, s, p);
      SET i = i + 1;
    END WHILE;
    SET r = r + 1;
  END WHILE;
END //
DELIMITER ;
CALL `gen_calendar`();
DROP PROCEDURE IF EXISTS `gen_calendar`;

CREATE TABLE `checkin_notice` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `homestay_id`    BIGINT UNSIGNED NOT NULL,
  `checkin_time`   VARCHAR(30) DEFAULT '14:00',
  `checkout_time`  VARCHAR(30) DEFAULT '12:00',
  `pet_policy`     VARCHAR(100) DEFAULT NULL,
  `has_breakfast`  TINYINT DEFAULT 0,
  `deposit`        DECIMAL(10,2) DEFAULT 0.00,
  `is_deleted`     TINYINT(1) DEFAULT 0 COMMENT '软删除:0正常,1已删除',
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_homestay` (`homestay_id`),
  INDEX `idx_is_deleted` (`is_deleted`),
  CONSTRAINT `fk_notice_homestay` FOREIGN KEY (`homestay_id`) REFERENCES `homestay`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `checkin_notice` (`id`, `homestay_id`, `checkin_time`, `checkout_time`, `pet_policy`, `has_breakfast`, `deposit`) VALUES
(1, 1, '14:00', '12:00', '可携带小型犬，需提前告知，收取清洁费50元/晚', 1, 200.00),
(2, 2, '15:00', '11:00', '庭院可携带宠物，室内请勿进入卧室', 1, 500.00),
(3, 3, '14:00', '12:00', '不可携带宠物', 0, 100.00),
(4, 4, '14:00', '12:00', '不可携带宠物', 1, 300.00),
(5, 5, '14:00', '12:00', '可携带宠物，不额外收费', 1, 500.00);

CREATE TABLE `review` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`       BIGINT UNSIGNED DEFAULT NULL,
  `homestay_id`    BIGINT UNSIGNED NOT NULL,
  `user_id`        BIGINT UNSIGNED NOT NULL,
  `rating`         INT DEFAULT 5,
  `content`        TEXT DEFAULT NULL,
  `images`         VARCHAR(500) DEFAULT NULL,
  `merchant_reply` TEXT DEFAULT NULL,
  `is_deleted`     TINYINT(1) DEFAULT 0 COMMENT '软删除:0正常,1已删除',
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_homestay` (`homestay_id`),
  INDEX `idx_order` (`order_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `review` (`id`, `order_id`, `homestay_id`, `user_id`, `rating`, `content`, `images`, `merchant_reply`) VALUES
(1, NULL, 1, 101, 5, '非常棒的民宿体验！推开窗就是梯田云海，房间干净整洁，苗族风格的装饰很有特色。房东热情好客，早餐的苗家酸汤粉超级好吃！下次还会再来。', NULL, '感谢您的入住和好评！欢迎下次再来乌东，我们会准备更多苗族特色美食等您品尝~'),
(2, NULL, 1, 102, 4, '民宿位置很好，在半山腰可以看到整个苗寨。房间设施齐全，地暖在冬天很给力。唯一美中不足的是上山的路不太好找，建议提前联系房东发定位。', NULL, '谢谢您的反馈！我们已经更新了导航指引，下次来一定更好找。期待再次接待您！'),
(3, NULL, 1, 103, 5, '亲子家庭房太适合带孩子了，房间宽敞，有儿童用品和玩具。孩子在苗寨玩得很开心，还体验了蜡染。推荐给有小朋友的家庭！', NULL, '很高兴小朋友在苗寨玩得开心！蜡染体验是我们特别为亲子家庭准备的，期待您全家再次光临~'),
(4, NULL, 2, 104, 5, '独栋庭院太赞了！6个人住得很舒服，晚上在院子里烧烤看星星，白天徒步梯田。设施齐全，厨房用具一应俱全，自己做饭也很方便。', NULL, '感谢您的分享！独栋庭院确实很适合朋友聚会，烧烤和星空是我们这里的标配。欢迎再来！'),
(5, NULL, 3, 105, 4, '性价比很高的苗族风情客栈，房间虽不大但干净舒适。苗族服饰试穿和蜡染体验很有特色，老板娘人很好。早餐简单但味道不错。', NULL, '感谢您的入住！我们致力于提供地道的苗族文化体验，干净舒适是我们最基本的要求。欢迎再来！'),
(6, NULL, 4, 106, 5, '云海日出太震撼了！落地窗设计太棒，躺在床上就能看到云海。房东是摄影爱好者，还带我们去最佳机位拍照。这次的住宿体验终身难忘！', NULL, '您的满意是我们最大的动力！云海日出确实是云溪最美的时刻，很高兴能为您留下美好的回忆。'),
(7, NULL, 4, 107, 5, '蜜月旅行选择了云溪，果然没有失望。360度全景、无边泳池、烛光晚餐……每一处细节都很用心。服务也非常周到，强烈推荐！', NULL, '恭喜二位！很荣幸能成为您蜜月旅行的一部分，祝您幸福美满！随时欢迎再来~'),
(8, NULL, 5, 108, 4, '轻奢体验名副其实，私人管家服务确实到位。竹林环境非常安静，很适合放松身心。SPA和泳池都很棒，价格稍贵但物有所值。', NULL, '感谢您的认可！竹里的定位就是让客人在竹林深处享受最放松的度假体验。期待您的再次光临！');

CREATE TABLE `favorite` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`      BIGINT UNSIGNED NOT NULL,
  `homestay_id`  BIGINT UNSIGNED NOT NULL,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_user_homestay` (`user_id`, `homestay_id`),
  INDEX `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `favorite` (`id`, `user_id`, `homestay_id`) VALUES
(1, 101, 1), (2, 101, 4), (3, 102, 1), (4, 103, 2), (5, 104, 5);

CREATE TABLE `booking_order` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_no`      VARCHAR(32) NOT NULL,
  `user_id`       BIGINT UNSIGNED NOT NULL,
  `homestay_id`   BIGINT UNSIGNED NOT NULL,
  `room_id`       BIGINT UNSIGNED NOT NULL,
  `checkin_date`  DATE NOT NULL,
  `checkout_date` DATE NOT NULL,
  `nights`        INT DEFAULT 1,
  `total_price`   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status`        TINYINT DEFAULT 0,
  `checkin_code`  VARCHAR(32) DEFAULT NULL,
  `refund_status` TINYINT DEFAULT 0,
  `is_deleted`    TINYINT(1) DEFAULT 0 COMMENT '软删除:0正常,1已删除',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_order_no` (`order_no`),
  UNIQUE INDEX `uk_checkin_code` (`checkin_code`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_homestay` (`homestay_id`),
  INDEX `idx_room` (`room_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_date` (`checkin_date`),
  INDEX `idx_is_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 管理员表
-- ============================================================
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`   VARCHAR(50) NOT NULL,
  `password`   VARCHAR(100) NOT NULL,
  `nickname`   VARCHAR(50) DEFAULT NULL,
  `role`       VARCHAR(20) DEFAULT 'admin',
  `is_deleted` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `admin` (`id`, `username`, `password`, `nickname`, `role`) VALUES
(1, 'admin', '123456', '超级管理员', 'admin');

-- ============================================================
-- 民宿种子数据（补充演示数据，不影响已有5条）
-- ============================================================
INSERT INTO `homestay` (`id`, `merchant_id`, `name`, `address`, `lng`, `lat`, `style_tags`, `facility_tags`, `cover_image`, `description`, `rating`, `status`) VALUES
(6, 2, '西江·千户苗寨观景客栈', '贵州省黔东南州雷山县西江千户苗寨景区内', 108.212000, 26.395000, '千户苗寨,观景,摄影,苗族风情', 'WiFi,空调,停车场,观景台,茶室', '/src/assets/image/homestay/homestay_06.png', '位于西江千户苗寨核心景区，步行3分钟至观景台。房间采用传统苗式建筑风格，窗外即是万家灯火的苗寨夜景，是深度感受苗族文化的理想之选。', 4.7, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ============================================================
-- 房型种子数据（补充演示数据）
-- ============================================================
INSERT INTO `room` (`id`, `homestay_id`, `room_name`, `bed_type`, `area`, `max_people`, `facility`, `base_price`, `stock`) VALUES
(16, 6, '观景大床房', '大床1.8m×2m', 32, 2, '独立卫浴,观景阳台,苗绣床品,空调,茶具', 358.00, 6),
(17, 6, '苗寨全景套房', '大床2.0m', 55, 2, '独立卫浴,全景落地窗,观景露台,浴缸,高端苗绣床品,迷你吧', 698.00, 3),
(18, 6, '家庭亲子间', '大床1.8m+单人床1.2m', 48, 3, '独立卫浴,儿童用品,苗寨故事绘本,空调', 458.00, 4)
ON DUPLICATE KEY UPDATE `room_name` = VALUES(`room_name`);

-- ============================================================
-- 房态日历数据（补充7月1-30日房间16-18日历）
-- ============================================================
INSERT INTO `room_calendar` (`room_id`, `booking_date`, `available_stock`, `price`) VALUES
(16, '2026-07-01', 6, 358.00), (16, '2026-07-02', 6, 358.00), (16, '2026-07-05', 5, 388.00),
(17, '2026-07-01', 3, 698.00), (17, '2026-07-02', 3, 698.00), (17, '2026-07-03', 3, 758.00)
ON DUPLICATE KEY UPDATE `available_stock` = VALUES(`available_stock`);

-- ============================================================
-- 预订订单数据（覆盖多种状态，用于小程序/后台分页展示）
-- status: 0=待支付 1=已支付 2=已确认 3=已入住 4=已完成 5=已取消
-- ============================================================
INSERT INTO `booking_order` (`id`, `order_no`, `user_id`, `homestay_id`, `room_id`, `checkin_date`, `checkout_date`, `nights`, `total_price`, `status`, `checkin_code`, `refund_status`) VALUES
(1, 'WD20260701A8X3K2', 101, 1, 1, '2026-07-05', '2026-07-07', 2, 656.00, 3, 'WDK38F', 0),
(2, 'WD20260702B7Y9M4', 102, 4, 10, '2026-07-10', '2026-07-12', 2, 1196.00, 2, 'WDN92A', 0),
(3, 'WD20260703C2Z1Q7', 103, 3, 7, '2026-07-08', '2026-07-09', 1, 188.00, 4, 'WDQ15C', 0),
(4, 'WD20260704D5V8R1', 104, 2, 5, '2026-07-15', '2026-07-17', 2, 1596.00, 0, 'WDV82R', 0),
(5, 'WD20260705E3W6G9', 105, 5, 13, '2026-07-20', '2026-07-22', 2, 1776.00, 5, NULL, 1),
(6, 'WD20260706F7U2H4', 106, 6, 16, '2026-07-12', '2026-07-14', 2, 716.00, 1, 'WDF16H', 0)
ON DUPLICATE KEY UPDATE `order_no` = VALUES(`order_no`);

-- ============================================================
-- 追加测试数据块：管理员 / 民宿 / 房型 / 房态日历 / 订单
-- 图片路径占位 /img/，后期替换真实图片
-- ============================================================

-- ------------------ 管理员（补充2个测试账号）------------------
INSERT IGNORE INTO `admin` (`id`, `username`, `password`, `nickname`, `role`) VALUES
(2, 'merchant01', '123456', '云舍民宿掌柜', 'merchant'),
(3, 'merchant02', '123456', '半山居民宿掌柜', 'merchant');

-- ------------------ 民宿（补充到8条）------------------
INSERT INTO `homestay` (`id`, `merchant_id`, `name`, `address`, `lng`, `lat`, `style_tags`, `facility_tags`, `cover_image`, `description`, `rating`, `status`) VALUES
(7, 2, '花溪·水岸民宿', '贵州省黔东南州雷山县丹江镇清水巷9号', 108.209800, 26.403500, '水岸,田园,情侣,家庭', 'WiFi,空调,停车场,垂钓,烧烤,自行车租赁', '/src/assets/image/homestay/homestay_07.png', '临溪而建的花园民宿，推窗即见潺潺溪水。每间客房带独立小院，种满四季花草。提供垂钓、骑行等乡村体验活动，是远离喧嚣、亲近自然的理想度假地。', 4.4, 1),
(8, 3, '苗岭·观山精品民宿', '贵州省黔东南州雷山县西江镇观山路22号', 108.228600, 26.391200, '观景,商务,会议,团队', 'WiFi,空调,停车场,会议室,餐厅,健身房,商务中心', '/src/assets/image/homestay/homestay_08.png', '定位中高端的精品民宿，设有小型会议室和多功能厅，适合商务团队出行。餐厅提供苗家特色菜品和西式简餐，满足不同口味需求。', 4.3, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ------------------ 房型（补充到22条）------------------
INSERT INTO `room` (`id`, `homestay_id`, `room_name`, `bed_type`, `area`, `max_people`, `facility`, `base_price`, `stock`) VALUES
(19, 7, '溪畔大床房', '大床1.8m', 30, 2, '独立卫浴,小院,溪景,空调', 328.00, 5),
(20, 7, '花园家庭房', '大床1.8m+单人床1.2m', 52, 4, '独立卫浴,花园,儿童乐园,空调', 528.00, 3),
(21, 8, '商务大床房', '大床1.8m', 38, 2, '独立卫浴,办公桌,智能电视,空调,保险箱', 458.00, 8),
(22, 8, '观山套房', '大床2.0m', 68, 2, '独立卫浴,山景阳台,浴缸,衣帽间,智能家居,迷你吧', 788.00, 4)
ON DUPLICATE KEY UPDATE `room_name` = VALUES(`room_name`);

-- ------------------ 房态日历（房间19-22的7月日历）------------------
INSERT INTO `room_calendar` (`room_id`, `booking_date`, `available_stock`, `price`) VALUES
(19, '2026-07-01', 5, 328.00), (19, '2026-07-02', 5, 328.00), (19, '2026-07-03', 5, 328.00),
(19, '2026-07-05', 5, 358.00), (19, '2026-07-06', 5, 358.00),
(20, '2026-07-01', 3, 528.00), (20, '2026-07-02', 3, 528.00), (20, '2026-07-05', 3, 588.00),
(21, '2026-07-01', 8, 458.00), (21, '2026-07-02', 8, 458.00), (21, '2026-07-03', 8, 458.00),
(22, '2026-07-01', 4, 788.00), (22, '2026-07-02', 4, 788.00), (22, '2026-07-05', 4, 888.00)
ON DUPLICATE KEY UPDATE `available_stock` = VALUES(`available_stock`);

-- 存储过程：为房间19-22补全7月30天日历
DELIMITER //
CREATE PROCEDURE `gen_calendar_v2`()
BEGIN
  DECLARE i INT;
  DECLARE d DATE;
  DECLARE r INT DEFAULT 19;
  DECLARE s INT;
  DECLARE p DECIMAL(10,2);
  WHILE r <= 22 DO
    SELECT stock, base_price INTO s, p FROM `room` WHERE id = r;
    SET i = 0;
    WHILE i < 30 DO
      SET d = DATE_ADD('2026-07-01', INTERVAL i DAY);
      IF DAYOFWEEK(d) IN (1,7) THEN SET p = p * 1.2; END IF;
      INSERT IGNORE INTO `room_calendar` (`room_id`, `booking_date`, `available_stock`, `price`) VALUES (r, d, s, p);
      SET i = i + 1;
    END WHILE;
    SET r = r + 1;
  END WHILE;
END //
DELIMITER ;
CALL `gen_calendar_v2`();
DROP PROCEDURE IF EXISTS `gen_calendar_v2`;

-- ------------------ 订单（追加4条，覆盖更多状态）------------------
-- status: 0=待支付 1=已支付 2=已确认 3=已入住 4=已完成 5=已取消
INSERT INTO `booking_order` (`id`, `order_no`, `user_id`, `homestay_id`, `room_id`, `checkin_date`, `checkout_date`, `nights`, `total_price`, `status`, `checkin_code`, `refund_status`) VALUES
(7, 'WD20260707G9P5L3', 107, 1, 2, '2026-07-18', '2026-07-20', 2, 536.00, 0, 'WDG07P', 0),
(8, 'WD20260708H4J6M1', 108, 6, 17, '2026-07-22', '2026-07-24', 2, 1396.00, 2, 'WDH08J', 0),
(9, 'WD20260709K2S8N7', 109, 7, 19, '2026-07-08', '2026-07-10', 2, 656.00, 3, 'WDK09S', 0),
(10, 'WD20260710R1T4V9', 110, 8, 22, '2026-07-05', '2026-07-06', 1, 788.00, 1, 'WDR10T', 0)
ON DUPLICATE KEY UPDATE `order_no` = VALUES(`order_no`);

-- ------------------ 评价（追加4条）------------------
INSERT IGNORE INTO `review` (`id`, `order_id`, `homestay_id`, `user_id`, `rating`, `content`, `images`, `merchant_reply`) VALUES
(9, NULL, 6, 109, 5, '千户苗寨的夜景太震撼了！房间窗外就是万家灯火，服务也非常贴心，老板娘还送了自己酿的米酒。强烈推荐！', NULL, '谢谢！米酒是我们自己酿的，能喜欢我们很开心~欢迎再来！'),
(10, NULL, 7, 110, 4, '溪畔环境很好，早上被鸟叫声叫醒的感觉太棒了。垂钓设备可以免费使用，钓了条小鱼很有成就感。就是蚊子有点多，建议带驱蚊液。', NULL, '感谢您的建议！我们已经在每间客房增加了电蚊香，下次来一定会更舒适！'),
(11, NULL, 7, 111, 5, '带父母来住了两晚，花园打理得很美，父母非常喜欢。房间干净，老板做的苗家酸汤鱼一级棒！', NULL, '为长辈们服务是我们的荣幸，酸汤鱼是老板的拿手菜，您喜欢就好！'),
(12, NULL, 8, 112, 3, '商务出差选择了这家，会议室设施还可以，但投影仪有些旧。房间舒适度不错，早餐品种可以再丰富一些。', NULL, '感谢反馈！投影仪已下单更换，早餐品种下周就会增加到20种以上。期待再次为您服务！');

-- ============================================================
-- 追加测试数据 v3（2026-06-26）
-- 补充民宿/房型/日历/订单数据，覆盖更多演示场景
-- ============================================================

-- ---------- 民宿（追加2条，共10条）----------
INSERT IGNORE INTO `homestay` (`id`, `merchant_id`, `name`, `address`, `lng`, `lat`, `style_tags`, `facility_tags`, `cover_image`, `description`, `rating`, `status`) VALUES
(9, 2, '吊脚楼·苗家小院', '贵州省黔东南州雷山县西江镇苗寨古巷3号', 108.223400, 26.388900, '古巷,吊脚楼,苗族,原生态', 'WiFi,停车场,公共厨房,行李寄存', '/src/assets/image/homestay/homestay_09.png', '百年吊脚楼改造的原生态民宿，保留传统木结构和苗族火塘文化。虽设施简朴但韵味十足，适合喜欢深度体验苗族日常生活的旅行者。', 4.2, 1),
(10, 3, '星空·帐篷营地', '贵州省黔东南州雷山县西江镇高山草甸8号', 108.235100, 26.383200, '帐篷,星空,露营,户外,摄影', 'WiFi,停车场,公共卫浴,烧烤区,摄影指导', '/src/assets/image/homestay/homestay_10.png', '高山草甸上的轻奢帐篷营地，每顶帐篷配有舒适床品和观星天窗。夜晚银河清晰可见，营地提供专业天文望远镜和摄影指导。', 4.6, 1);

-- ---------- 房型（追加4条，共26条）----------
INSERT IGNORE INTO `room` (`id`, `homestay_id`, `room_name`, `bed_type`, `area`, `max_people`, `facility`, `base_price`, `stock`) VALUES
(23, 9, '苗家火塘大床房', '大床1.5m', 20, 2, '苗家火塘,苗族刺绣床品,公共卫浴', 128.00, 4),
(24, 9, '古巷双床房', '单人床1.2m×2', 18, 2, '苗族蜡染装饰,公共卫浴', 108.00, 4),
(25, 10, '星空大床帐篷', '大床1.8m', 25, 2, '天窗,观星设备,羽绒被,营地公共卫浴', 398.00, 6),
(26, 10, '家庭双帐篷套间', '大床1.8m+双床1.2m', 40, 4, '双帐篷连通,天窗,独立卫浴帐篷,烧烤炉', 698.00, 3);

-- ---------- 房态日历（房间23-26，7月15天）----------
INSERT IGNORE INTO `room_calendar` (`room_id`, `booking_date`, `available_stock`, `price`) VALUES
(23, '2026-07-01', 4, 128.00), (23, '2026-07-02', 4, 128.00), (23, '2026-07-05', 4, 148.00),
(24, '2026-07-01', 4, 108.00), (24, '2026-07-02', 4, 108.00), (24, '2026-07-05', 4, 128.00),
(25, '2026-07-01', 6, 398.00), (25, '2026-07-02', 6, 398.00), (25, '2026-07-05', 6, 458.00), (25, '2026-07-06', 6, 458.00),
(26, '2026-07-01', 3, 698.00), (26, '2026-07-02', 3, 698.00), (26, '2026-07-05', 3, 798.00), (26, '2026-07-06', 3, 798.00);

-- ---------- 订单（追加5条，覆盖更多日期/状态，共15条）----------
INSERT IGNORE INTO `booking_order` (`id`, `order_no`, `user_id`, `homestay_id`, `room_id`, `checkin_date`, `checkout_date`, `nights`, `total_price`, `status`, `checkin_code`, `refund_status`) VALUES
(11, 'WD20260711M5Y2X8', 111, 5, 14, '2026-07-25', '2026-07-27', 2, 3160.00, 1, 'WDM11Y', 0),
(12, 'WD20260712N8V6Z4', 112, 9, 23, '2026-07-03', '2026-07-05', 2, 256.00, 2, 'WDN12V', 0),
(13, 'WD20260713P2W9Q1', 113, 10, 25, '2026-07-08', '2026-07-09', 1, 398.00, 3, 'WDP13W', 0),
(14, 'WD20260714Q7K4B3', 114, 1, 3, '2026-07-12', '2026-07-14', 2, 996.00, 5, NULL, 1),
(15, 'WD20260715S3R1C6', 115, 6, 17, '2026-07-30', '2026-08-01', 2, 1396.00, 0, 'WDS15R', 0);

-- ---------- 收藏（追加5条，共10条）----------
INSERT IGNORE INTO `favorite` (`id`, `user_id`, `homestay_id`) VALUES
(6, 106, 6), (7, 107, 5), (8, 108, 10), (9, 109, 9), (10, 101, 7);

SET FOREIGN_KEY_CHECKS = 1;
