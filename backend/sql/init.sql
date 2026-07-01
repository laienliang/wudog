-- 乌东文旅平台 - 衣·非遗商品模块
-- 数据库初始化脚本

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS wudong DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wudong;

-- 商品分类表
CREATE TABLE IF NOT EXISTS product_category (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '分类名称',
  sort_order INT DEFAULT 0 COMMENT '排序',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT '商品分类表';

-- 商品表
CREATE TABLE IF NOT EXISTS product (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL COMMENT '分类ID',
  name VARCHAR(200) NOT NULL COMMENT '商品名称',
  description TEXT COMMENT '商品描述',
  craft_intro TEXT COMMENT '工艺介绍',
  artisan_info TEXT COMMENT '传承人信息',
  price DECIMAL(10,2) COMMENT '价格',
  stock INT DEFAULT 0 COMMENT '库存',
  status TINYINT DEFAULT 1 COMMENT '状态：1在售 0下架',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category_id (category_id),
  INDEX idx_status (status)
) COMMENT '商品表';

-- 商品SKU表
CREATE TABLE IF NOT EXISTS product_sku (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL COMMENT '商品ID',
  spec_name VARCHAR(100) NOT NULL COMMENT '规格名称',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  stock INT DEFAULT 0 COMMENT '库存',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_id (product_id)
) COMMENT '商品SKU表';

-- 商品图片表
CREATE TABLE IF NOT EXISTS product_image (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL COMMENT '商品ID',
  image_url VARCHAR(500) NOT NULL COMMENT '图片URL',
  sort_order INT DEFAULT 0 COMMENT '排序',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_id (product_id)
) COMMENT '商品图片表';

-- 收藏表
CREATE TABLE IF NOT EXISTS product_favorite (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL COMMENT '商品ID',
  user_id INT NOT NULL COMMENT '用户ID',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_product_user (product_id, user_id)
) COMMENT '收藏表';

-- 订单表
CREATE TABLE IF NOT EXISTS product_order (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号',
  product_id INT NOT NULL COMMENT '商品ID',
  sku_id INT NOT NULL COMMENT 'SKU ID',
  product_name VARCHAR(100) NOT NULL COMMENT '商品名称快照',
  spec_name VARCHAR(100) NOT NULL COMMENT '规格名称快照',
  price DECIMAL(10,2) NOT NULL COMMENT '价格快照',
  quantity INT DEFAULT 1 COMMENT '数量',
  receiver_name VARCHAR(50) NOT NULL COMMENT '收货人',
  receiver_phone VARCHAR(20) NOT NULL COMMENT '手机号',
  receiver_address VARCHAR(500) NOT NULL COMMENT '收货地址',
  user_id INT DEFAULT 0 COMMENT '用户ID',
  status TINYINT DEFAULT 0 COMMENT '0待处理 1已确认 2已发货 3已完成 4已取消',
  cancel_request TINYINT DEFAULT 0 COMMENT '0无取消请求 1用户已申请取消',
  cancel_type TINYINT DEFAULT 0 COMMENT '0无 1取消 2退货',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_order_no (order_no)
) COMMENT '订单表';

-- 管理员表
CREATE TABLE IF NOT EXISTS admin_user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT '管理员表';

-- 插入默认管理员 (密码: admin123)
INSERT INTO admin_user (username, password) VALUES ('admin', 'admin123');

-- 插入示例分类
INSERT INTO product_category (name, sort_order) VALUES ('银饰', 1), ('蜡染', 2), ('刺绣', 3);

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  nickname VARCHAR(50) COMMENT '昵称',
  phone VARCHAR(20) COMMENT '手机号',
  avatar VARCHAR(255) COMMENT '头像URL',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT '用户表';

-- 购物车表
CREATE TABLE IF NOT EXISTS cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '用户ID',
  product_id INT NOT NULL COMMENT '商品ID',
  sku_id INT NOT NULL COMMENT 'SKU ID',
  quantity INT DEFAULT 1 COMMENT '数量',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
) COMMENT '购物车表';

-- 客服聊天消息表
CREATE TABLE IF NOT EXISTS chat_message (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_type VARCHAR(20) NOT NULL COMMENT '发送方类型: user/admin',
  sender_id INT NOT NULL COMMENT '发送方ID',
  receiver_type VARCHAR(20) NOT NULL COMMENT '接收方类型: user/admin',
  receiver_id INT NOT NULL COMMENT '接收方ID',
  content TEXT NOT NULL COMMENT '消息内容',
  is_read TINYINT DEFAULT 0 COMMENT '0未读 1已读',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT '客服聊天消息表';

-- 评价表
CREATE TABLE IF NOT EXISTS review (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '用户ID',
  product_id INT NOT NULL COMMENT '商品ID',
  order_id INT NOT NULL COMMENT '订单ID',
  rating INT DEFAULT 5 COMMENT '评分1-5星',
  content TEXT COMMENT '评价内容',
  images VARCHAR(500) COMMENT '图片URL',
  reply TEXT COMMENT '管理员回复',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id)
) COMMENT '评价表';

-- 地址表
CREATE TABLE IF NOT EXISTS address (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT '用户ID',
  name VARCHAR(50) NOT NULL COMMENT '收货人',
  phone VARCHAR(20) NOT NULL COMMENT '手机号',
  province VARCHAR(50) NOT NULL COMMENT '省份',
  city VARCHAR(50) NOT NULL COMMENT '城市',
  district VARCHAR(50) NOT NULL COMMENT '区县',
  town VARCHAR(50) DEFAULT NULL COMMENT '镇/街道',
  detail VARCHAR(200) NOT NULL COMMENT '详细地址',
  is_default TINYINT DEFAULT 0 COMMENT '是否默认地址',
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除标志',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
) COMMENT '地址表';
