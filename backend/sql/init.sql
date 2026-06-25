-- 乌东文旅 · 线路订票系统 - 建表语句
-- 数据库: wudong_travel

CREATE DATABASE IF NOT EXISTS `wudong_travel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wudong_travel`;

-- 景区表
CREATE TABLE IF NOT EXISTS `scenic_spot` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `cover_image` VARCHAR(500) NOT NULL DEFAULT '',
  `images` JSON NULL,
  `description` TEXT NULL,
  `address` VARCHAR(200) NOT NULL,
  `lat` DECIMAL(10,6) NULL,
  `lng` DECIMAL(10,6) NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `sort` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_scenic_spot_status_sort` (`status`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 票种表
CREATE TABLE IF NOT EXISTS `ticket_type` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `scenic_id` BIGINT NULL,
  `name` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `sell_price` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `daily_stock` JSON NULL COMMENT '按日期库存覆盖映射 {"2026-07-01": 100}',
  `valid_days` INT NOT NULL DEFAULT 1,
  `description` VARCHAR(500) NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_ticket_type_scenic` (`scenic_id`),
  FOREIGN KEY (`scenic_id`) REFERENCES `scenic_spot`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 路线套餐表
CREATE TABLE IF NOT EXISTS `route_package` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `scenic_id` BIGINT NULL,
  `name` VARCHAR(100) NOT NULL,
  `cover_image` VARCHAR(500) NOT NULL,
  `images` JSON NULL,
  `description` TEXT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `original_price` DECIMAL(10,2) NULL,
  `duration_days` INT NOT NULL,
  `min_people` INT NOT NULL DEFAULT 1,
  `max_people` INT NOT NULL DEFAULT 20,
  `stock` INT NOT NULL DEFAULT 0,
  `daily_stock` JSON NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `sort` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_route_package_scenic` (`scenic_id`),
  FOREIGN KEY (`scenic_id`) REFERENCES `scenic_spot`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 路线行程表
CREATE TABLE IF NOT EXISTS `route_itinerary` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `route_id` BIGINT NOT NULL,
  `day_order` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  `includes` JSON NULL,
  `not_includes` JSON NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_route_itinerary_route` (`route_id`),
  FOREIGN KEY (`route_id`) REFERENCES `route_package`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 电子票订单表
CREATE TABLE IF NOT EXISTS `ticket_order` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_no` VARCHAR(32) NOT NULL,
  `uuid` VARCHAR(36) NOT NULL,
  `user_id` BIGINT NOT NULL,
  `order_type` TINYINT NOT NULL COMMENT '1=门票 2=路线套餐',
  `item_id` BIGINT NOT NULL,
  `item_name` VARCHAR(200) NOT NULL,
  `ticket_type_id` BIGINT NULL,
  `quantity` INT NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `visit_date` DATE NULL,
  `valid_until` DATETIME NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '0-待使用 1-已核销 2-已过期 3-已取消 4-已退款',
  `remark` VARCHAR(500) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  UNIQUE KEY `uk_uuid` (`uuid`),
  INDEX `idx_ticket_order_user` (`user_id`),
  FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_type`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 管理员表
CREATE TABLE IF NOT EXISTS `admin_user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(50) NOT NULL DEFAULT '管理员',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
