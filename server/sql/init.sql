-- ============================================
-- 乌东文旅"衣食住行"统一平台 — 数据库初始化脚本
-- 数据库: wudong_village
-- ============================================

CREATE DATABASE IF NOT EXISTS wudong_village DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wudong_village;

-- ============================================
-- 一、公共模块表（10张）
-- ============================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT 'bcrypt加密密码',
  phone VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  avatar VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  role ENUM('tourist','merchant','admin','super_admin') DEFAULT 'tourist' COMMENT '角色',
  status TINYINT DEFAULT 1 COMMENT '1正常 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0 COMMENT '软删除',
  INDEX idx_role (role),
  INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 2. 用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE COMMENT '用户ID',
  nickname VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  gender ENUM('male','female','other') DEFAULT NULL COMMENT '性别',
  region VARCHAR(100) DEFAULT NULL COMMENT '地区',
  bio VARCHAR(500) DEFAULT NULL COMMENT '个人简介',
  follow_count INT DEFAULT 0 COMMENT '关注数',
  follower_count INT DEFAULT 0 COMMENT '粉丝数',
  note_count INT DEFAULT 0 COMMENT '游记数',
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户资料表';

-- 3. 收货地址表
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  name VARCHAR(50) NOT NULL COMMENT '收件人',
  phone VARCHAR(20) NOT NULL COMMENT '联系电话',
  province VARCHAR(50) DEFAULT NULL COMMENT '省',
  city VARCHAR(50) DEFAULT NULL COMMENT '市',
  district VARCHAR(50) DEFAULT NULL COMMENT '区',
  detail VARCHAR(200) NOT NULL COMMENT '详细地址',
  is_default TINYINT DEFAULT 0 COMMENT '是否默认',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收货地址表';

-- 4. 统一购物车表
CREATE TABLE IF NOT EXISTS shopping_cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  product_id INT NOT NULL COMMENT '商品ID',
  sku_id INT DEFAULT NULL COMMENT 'SKU ID',
  quantity INT DEFAULT 1 COMMENT '数量',
  source_module VARCHAR(20) DEFAULT 'module1' COMMENT '来源模块 module1衣/module2食特产',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_product_sku (user_id, product_id, sku_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- 5. 统一订单表
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '订单号',
  user_id INT NOT NULL COMMENT '用户ID',
  type ENUM('product','restaurant','homestay','ticket','tour') NOT NULL COMMENT '订单类型',
  status ENUM('pending','paid','confirmed','shipped','completed','cancelled','refunding','refunded') DEFAULT 'pending' COMMENT '订单状态',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  pay_amount DECIMAL(10,2) DEFAULT NULL COMMENT '实付金额',
  address_snapshot JSON DEFAULT NULL COMMENT '收货地址快照',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  pay_time DATETIME DEFAULT NULL COMMENT '支付时间',
  cancel_time DATETIME DEFAULT NULL COMMENT '取消时间',
  finish_time DATETIME DEFAULT NULL COMMENT '完成时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_user_id (user_id),
  INDEX idx_order_no (order_no),
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一订单表';

-- 6. 订单明细表
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL COMMENT '订单ID',
  item_type VARCHAR(30) NOT NULL COMMENT '项目类型 product/sku/ticket/room等',
  item_id INT NOT NULL COMMENT '项目ID',
  item_name VARCHAR(200) NOT NULL COMMENT '项目名称',
  item_image VARCHAR(500) DEFAULT NULL COMMENT '项目主图',
  price DECIMAL(10,2) NOT NULL COMMENT '单价',
  quantity INT DEFAULT 1 COMMENT '数量',
  snapshot_json JSON DEFAULT NULL COMMENT '下单时项目快照',
  INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

-- 7. 支付记录表
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL COMMENT '订单ID',
  amount DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  method VARCHAR(20) DEFAULT 'wechat' COMMENT '支付方式 wechat/alipay/mock',
  transaction_id VARCHAR(64) DEFAULT NULL COMMENT '第三方交易流水号',
  status ENUM('pending','success','failed','refunded') DEFAULT 'pending' COMMENT '支付状态',
  paid_at DATETIME DEFAULT NULL COMMENT '支付时间',
  refund_at DATETIME DEFAULT NULL COMMENT '退款时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_id (order_id),
  INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付记录表';

-- 8. 系统消息表
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '接收用户ID',
  type ENUM('system','order','interact','merchant') NOT NULL COMMENT '消息类型',
  title VARCHAR(200) NOT NULL COMMENT '消息标题',
  content TEXT COMMENT '消息内容',
  is_read TINYINT DEFAULT 0 COMMENT '是否已读',
  ref_id INT DEFAULT NULL COMMENT '关联业务ID',
  ref_type VARCHAR(30) DEFAULT NULL COMMENT '关联业务类型',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id_read (user_id, is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统消息表';

-- 9. 搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL COMMENT '用户ID 未登录为NULL',
  keyword VARCHAR(100) NOT NULL COMMENT '搜索关键词',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_keyword (keyword)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='搜索历史表';

-- 10. 文件上传记录表
CREATE TABLE IF NOT EXISTS uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL COMMENT '上传用户ID',
  filename VARCHAR(255) NOT NULL COMMENT '存储文件名',
  original_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
  url VARCHAR(500) NOT NULL COMMENT '访问URL',
  size INT DEFAULT 0 COMMENT '文件大小(字节)',
  mime_type VARCHAR(50) DEFAULT NULL COMMENT 'MIME类型',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件上传记录表';

-- ============================================
-- 二、模块1 -- 衣·非遗商品（6张）
-- ============================================

-- 11. 商品分类表
CREATE TABLE IF NOT EXISTS product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  icon VARCHAR(500) DEFAULT NULL COMMENT '分类图标',
  parent_id INT DEFAULT NULL COMMENT '父分类ID 二级分类',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '1启用 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_parent_id (parent_id),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- 12. 商品表
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT '商品标题',
  subtitle VARCHAR(200) DEFAULT NULL COMMENT '副标题',
  category_id INT NOT NULL COMMENT '分类ID',
  merchant_id INT DEFAULT NULL COMMENT '商家ID(对应users.id)',
  main_image VARCHAR(500) DEFAULT NULL COMMENT '主图',
  price DECIMAL(10,2) NOT NULL COMMENT '售价',
  market_price DECIMAL(10,2) DEFAULT NULL COMMENT '市场价/原价',
  stock INT DEFAULT 0 COMMENT '总库存',
  sales INT DEFAULT 0 COMMENT '销量',
  detail TEXT COMMENT '商品详情(富文本)',
  craft_intro VARCHAR(1000) DEFAULT NULL COMMENT '工艺介绍',
  inheritor_name VARCHAR(50) DEFAULT NULL COMMENT '传承人姓名',
  status ENUM('draft','reviewing','published','rejected','removed') DEFAULT 'draft' COMMENT '状态',
  review_count INT DEFAULT 0 COMMENT '评价数',
  avg_rating DECIMAL(2,1) DEFAULT NULL COMMENT '平均评分',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_category_id (category_id),
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_status (status),
  INDEX idx_price (price),
  INDEX idx_sales (sales)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 13. 商品SKU表
CREATE TABLE IF NOT EXISTS product_skus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL COMMENT '商品ID',
  spec_name VARCHAR(100) NOT NULL COMMENT '规格名称 如"银饰-手镯-中号"',
  price DECIMAL(10,2) DEFAULT NULL COMMENT '规格价 为NULL则用商品价',
  stock INT DEFAULT 0 COMMENT '规格库存',
  image VARCHAR(500) DEFAULT NULL COMMENT '规格图片',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品SKU表';

-- 14. 商品图片表
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL COMMENT '商品ID',
  url VARCHAR(500) NOT NULL COMMENT '图片URL',
  sort_order INT DEFAULT 0 COMMENT '排序',
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品图片表';

-- 15. 商品评价表
CREATE TABLE IF NOT EXISTS product_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL COMMENT '商品ID',
  order_id INT DEFAULT NULL COMMENT '订单ID',
  user_id INT NOT NULL COMMENT '用户ID',
  rating TINYINT NOT NULL COMMENT '评分 1-5',
  content TEXT COMMENT '评价内容',
  images JSON DEFAULT NULL COMMENT '评价图片',
  merchant_reply TEXT DEFAULT NULL COMMENT '商家回复',
  is_anonymous TINYINT DEFAULT 0 COMMENT '匿名评价',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价表';

-- 16. 商品收藏表
CREATE TABLE IF NOT EXISTS product_favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  product_id INT NOT NULL COMMENT '商品ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_product (user_id, product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品收藏表';

-- ============================================
-- 三、模块2 -- 食·餐饮美食（7张）
-- ============================================

-- 17. 餐厅表
CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '餐厅名称',
  merchant_id INT DEFAULT NULL COMMENT '商家ID',
  address VARCHAR(200) DEFAULT NULL COMMENT '地址',
  latitude DECIMAL(10,6) DEFAULT NULL COMMENT '纬度',
  longitude DECIMAL(10,6) DEFAULT NULL COMMENT '经度',
  business_hours VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  capacity INT DEFAULT 0 COMMENT '容纳人数',
  intro TEXT COMMENT '餐厅介绍',
  main_image VARCHAR(500) DEFAULT NULL COMMENT '主图',
  images JSON DEFAULT NULL COMMENT '餐厅图片集',
  avg_rating DECIMAL(2,1) DEFAULT NULL COMMENT '平均评分',
  status TINYINT DEFAULT 1 COMMENT '1营业 0停业',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_status (status),
  INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐厅表';

-- 18. 餐厅菜品表
CREATE TABLE IF NOT EXISTS restaurant_dishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL COMMENT '餐厅ID',
  name VARCHAR(100) NOT NULL COMMENT '菜品名',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  image VARCHAR(500) DEFAULT NULL COMMENT '菜品图',
  intro VARCHAR(500) DEFAULT NULL COMMENT '菜品介绍',
  is_signature TINYINT DEFAULT 0 COMMENT '是否招牌菜',
  status TINYINT DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_restaurant_id (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐厅菜品表';

-- 19. 餐位时段表
CREATE TABLE IF NOT EXISTS meal_time_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL COMMENT '餐厅ID',
  slot_name VARCHAR(50) NOT NULL COMMENT '时段名 如"午餐11:30-13:30"',
  max_bookings INT DEFAULT 20 COMMENT '最大预订数',
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_restaurant_id (restaurant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位时段表';

-- 20. 餐位预订表
CREATE TABLE IF NOT EXISTS restaurant_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL COMMENT '餐厅ID',
  user_id INT NOT NULL COMMENT '用户ID',
  order_id INT DEFAULT NULL COMMENT '关联订单ID',
  booking_date DATE NOT NULL COMMENT '预订日期',
  slot_id INT NOT NULL COMMENT '时段ID',
  guest_count INT NOT NULL COMMENT '用餐人数',
  contact_name VARCHAR(50) NOT NULL COMMENT '联系人',
  contact_phone VARCHAR(20) NOT NULL COMMENT '联系电话',
  remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
  status ENUM('pending','confirmed','rejected','cancelled','completed') DEFAULT 'pending' COMMENT '状态',
  merchant_remark VARCHAR(500) DEFAULT NULL COMMENT '商家备注/拒绝原因',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_restaurant_id (restaurant_id),
  INDEX idx_user_id (user_id),
  INDEX idx_booking_date (booking_date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位预订表';

-- 21. 农产品分类表
CREATE TABLE IF NOT EXISTS farm_product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  icon VARCHAR(500) DEFAULT NULL,
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品分类表';

-- 22. 农产品表
CREATE TABLE IF NOT EXISTS farm_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL COMMENT '分类ID',
  merchant_id INT DEFAULT NULL COMMENT '商家ID',
  name VARCHAR(100) NOT NULL COMMENT '产品名称',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  stock INT DEFAULT 0 COMMENT '库存',
  sales INT DEFAULT 0 COMMENT '销量',
  main_image VARCHAR(500) DEFAULT NULL COMMENT '主图',
  detail TEXT COMMENT '商品详情',
  origin VARCHAR(100) DEFAULT NULL COMMENT '产地',
  shelf_life VARCHAR(50) DEFAULT NULL COMMENT '保质期',
  storage_method VARCHAR(100) DEFAULT NULL COMMENT '储存方式',
  spec VARCHAR(100) DEFAULT NULL COMMENT '规格',
  status ENUM('draft','published','removed') DEFAULT 'draft' COMMENT '状态',
  avg_rating DECIMAL(2,1) DEFAULT NULL,
  review_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_category_id (category_id),
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品表';

-- 23. 餐厅/农产品评价表（复用结构）
CREATE TABLE IF NOT EXISTS restaurant_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  target_type ENUM('restaurant','dish','farm_product') NOT NULL COMMENT '评价对象类型',
  target_id INT NOT NULL COMMENT '评价对象ID',
  order_id INT DEFAULT NULL COMMENT '订单ID',
  user_id INT NOT NULL COMMENT '用户ID',
  rating TINYINT NOT NULL COMMENT '评分 1-5',
  content TEXT COMMENT '评价内容',
  images JSON DEFAULT NULL COMMENT '评价图片',
  merchant_reply TEXT DEFAULT NULL COMMENT '商家回复',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_target (target_type, target_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食模块评价表';

-- ============================================
-- 四、模块3 -- 住·民宿预订（5张）
-- ============================================

-- 24. 民宿表
CREATE TABLE IF NOT EXISTS homestays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '民宿名称',
  merchant_id INT DEFAULT NULL COMMENT '商家ID',
  address VARCHAR(200) DEFAULT NULL COMMENT '地址',
  latitude DECIMAL(10,6) DEFAULT NULL,
  longitude DECIMAL(10,6) DEFAULT NULL,
  style_tags VARCHAR(200) DEFAULT NULL COMMENT '风格标签 逗号分隔',
  facility_tags VARCHAR(200) DEFAULT NULL COMMENT '设施标签 WiFi/空调/独立卫浴等',
  main_image VARCHAR(500) DEFAULT NULL COMMENT '主图',
  images JSON DEFAULT NULL COMMENT '图片集',
  intro TEXT COMMENT '民宿介绍',
  avg_rating DECIMAL(2,1) DEFAULT NULL COMMENT '平均评分',
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_status (status),
  INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='民宿表';

-- 25. 房型表
CREATE TABLE IF NOT EXISTS room_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  homestay_id INT NOT NULL COMMENT '民宿ID',
  name VARCHAR(100) NOT NULL COMMENT '房型名',
  bed_type VARCHAR(50) DEFAULT NULL COMMENT '床型 大床/双床/家庭房',
  area INT DEFAULT NULL COMMENT '面积(㎡)',
  capacity INT DEFAULT 2 COMMENT '容纳人数',
  facilities VARCHAR(200) DEFAULT NULL COMMENT '房间设施',
  base_price DECIMAL(10,2) NOT NULL COMMENT '基础价格/晚',
  total_rooms INT DEFAULT 1 COMMENT '该房型总房间数',
  main_image VARCHAR(500) DEFAULT NULL COMMENT '房型图',
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_homestay_id (homestay_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房型表';

-- 26. 房态日历表
CREATE TABLE IF NOT EXISTS room_calendars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_type_id INT NOT NULL COMMENT '房型ID',
  date DATE NOT NULL COMMENT '日期',
  available_rooms INT DEFAULT 0 COMMENT '可用房间数',
  price DECIMAL(10,2) DEFAULT NULL COMMENT '当日价格 为NULL则用base_price',
  status ENUM('available','sold_out','closed') DEFAULT 'available' COMMENT '状态',
  UNIQUE KEY uk_room_date (room_type_id, date),
  INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房态日历表';

-- 27. 民宿预订表
CREATE TABLE IF NOT EXISTS homestay_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT DEFAULT NULL COMMENT '关联订单ID',
  user_id INT NOT NULL COMMENT '用户ID',
  homestay_id INT NOT NULL COMMENT '民宿ID',
  room_type_id INT NOT NULL COMMENT '房型ID',
  check_in_date DATE NOT NULL COMMENT '入住日期',
  check_out_date DATE NOT NULL COMMENT '离店日期',
  nights INT NOT NULL COMMENT '入住晚数',
  room_count INT DEFAULT 1 COMMENT '房间数',
  guest_name VARCHAR(50) NOT NULL COMMENT '入住人姓名',
  guest_phone VARCHAR(20) NOT NULL COMMENT '入住人电话',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '总金额',
  check_in_code VARCHAR(20) DEFAULT NULL COMMENT '入住码',
  status ENUM('pending','paid','confirmed','cancelled','refunding','refunded','completed') DEFAULT 'pending' COMMENT '状态',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_user_id (user_id),
  INDEX idx_homestay_id (homestay_id),
  INDEX idx_room_type_id (room_type_id),
  INDEX idx_check_in_date (check_in_date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='民宿预订表';

-- 28. 民宿评价表
CREATE TABLE IF NOT EXISTS homestay_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  homestay_id INT NOT NULL COMMENT '民宿ID',
  order_id INT DEFAULT NULL COMMENT '订单ID',
  user_id INT NOT NULL COMMENT '用户ID',
  rating TINYINT NOT NULL COMMENT '评分 1-5',
  content TEXT COMMENT '评价内容',
  images JSON DEFAULT NULL COMMENT '评价图片',
  merchant_reply TEXT DEFAULT NULL COMMENT '商家回复',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_homestay_id (homestay_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='民宿评价表';

-- ============================================
-- 五、模块4 -- 行·景区出行（6张）
-- ============================================

-- 29. 景区表
CREATE TABLE IF NOT EXISTS scenic_spots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '景区名称',
  address VARCHAR(200) DEFAULT NULL COMMENT '地址',
  latitude DECIMAL(10,6) DEFAULT NULL,
  longitude DECIMAL(10,6) DEFAULT NULL,
  open_time VARCHAR(100) DEFAULT NULL COMMENT '开放时间',
  intro TEXT COMMENT '景区介绍',
  main_image VARCHAR(500) DEFAULT NULL COMMENT '主图',
  images JSON DEFAULT NULL COMMENT '图片集',
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景区表';

-- 30. 票种表
CREATE TABLE IF NOT EXISTS ticket_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  spot_id INT NOT NULL COMMENT '景区ID',
  name VARCHAR(100) NOT NULL COMMENT '票种名 成人票/儿童票/学生票等',
  price DECIMAL(10,2) NOT NULL COMMENT '售价',
  stock INT DEFAULT -1 COMMENT '库存 -1表示不限',
  valid_days INT DEFAULT 1 COMMENT '有效期(天)',
  description VARCHAR(500) DEFAULT NULL COMMENT '票种说明',
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_spot_id (spot_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='票种表';

-- 31. 电子票表
CREATE TABLE IF NOT EXISTS e_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT DEFAULT NULL COMMENT '订单ID',
  ticket_type_id INT NOT NULL COMMENT '票种ID',
  user_id INT NOT NULL COMMENT '用户ID',
  ticket_code VARCHAR(32) NOT NULL UNIQUE COMMENT '电子票号',
  qr_code_url VARCHAR(500) DEFAULT NULL COMMENT '二维码图片URL',
  visit_date DATE NOT NULL COMMENT '游玩日期',
  visitor_name VARCHAR(50) NOT NULL COMMENT '游客姓名',
  visitor_id_card VARCHAR(20) DEFAULT NULL COMMENT '游客身份证号',
  quantity INT DEFAULT 1 COMMENT '数量',
  price DECIMAL(10,2) NOT NULL COMMENT '单价',
  status ENUM('unused','used','refunded','expired') DEFAULT 'unused' COMMENT '状态',
  used_at DATETIME DEFAULT NULL COMMENT '核销时间',
  expire_at DATE DEFAULT NULL COMMENT '有效期截止',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_id (order_id),
  INDEX idx_user_id (user_id),
  INDEX idx_ticket_code (ticket_code),
  INDEX idx_visit_date (visit_date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='电子票表';

-- 32. 路线套餐表
CREATE TABLE IF NOT EXISTS tour_routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT '路线标题',
  merchant_id INT DEFAULT NULL COMMENT '商家ID',
  days INT DEFAULT 1 COMMENT '行程天数',
  theme VARCHAR(50) DEFAULT NULL COMMENT '主题 亲子/摄影/研学/节庆',
  price DECIMAL(10,2) NOT NULL COMMENT '套餐价格',
  main_image VARCHAR(500) DEFAULT NULL COMMENT '主图',
  images JSON DEFAULT NULL COMMENT '图片集',
  intro TEXT COMMENT '路线简介',
  includes TEXT COMMENT '包含项目',
  excludes TEXT COMMENT '不包含项目',
  notes TEXT COMMENT '注意事项',
  status TINYINT DEFAULT 1,
  sales INT DEFAULT 0 COMMENT '销量',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_theme (theme),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线套餐表';

-- 33. 路线行程表
CREATE TABLE IF NOT EXISTS tour_itineraries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL COMMENT '路线ID',
  day_number INT NOT NULL COMMENT '第几天',
  description TEXT COMMENT '行程描述',
  spots VARCHAR(500) DEFAULT NULL COMMENT '途经景点',
  meals VARCHAR(100) DEFAULT NULL COMMENT '用餐安排',
  accommodation VARCHAR(100) DEFAULT NULL COMMENT '住宿安排',
  transport VARCHAR(100) DEFAULT NULL COMMENT '交通方式',
  sort_order INT DEFAULT 0 COMMENT '排序',
  INDEX idx_route_id (route_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线行程表';

-- 34. 交通攻略表
CREATE TABLE IF NOT EXISTS transport_guides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT '攻略标题',
  departure VARCHAR(50) DEFAULT NULL COMMENT '出发地',
  destination VARCHAR(50) NOT NULL COMMENT '目的地',
  transport_type VARCHAR(50) DEFAULT NULL COMMENT '交通方式 高铁/大巴/自驾/飞机',
  duration VARCHAR(50) DEFAULT NULL COMMENT '耗时',
  cost VARCHAR(50) DEFAULT NULL COMMENT '参考费用',
  description TEXT COMMENT '详细说明',
  image VARCHAR(500) DEFAULT NULL COMMENT '攻略图',
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_departure (departure),
  INDEX idx_destination (destination)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='交通攻略表';

-- ============================================
-- 六、模块5 -- 社区·分享（7张 从group5迁移）
-- ============================================

-- 35. 游记表
CREATE TABLE IF NOT EXISTS travel_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  images JSON DEFAULT NULL,
  video_url VARCHAR(500) DEFAULT NULL,
  location VARCHAR(200) DEFAULT NULL,
  topic_id INT DEFAULT NULL,
  status ENUM('draft','reviewing','published','rejected','removed') DEFAULT 'draft',
  reject_reason VARCHAR(500) DEFAULT NULL,
  like_count INT DEFAULT 0,
  favorite_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  report_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_user_id (user_id),
  INDEX idx_topic_id (topic_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记表';

-- 36. 评论表
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '评论者ID',
  note_id INT NOT NULL COMMENT '游记ID',
  parent_id INT DEFAULT NULL COMMENT '父评论ID 支持嵌套回复',
  content TEXT COMMENT '评论内容',
  like_count INT DEFAULT 0,
  report_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_note_id (note_id),
  INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 37. 话题表
CREATE TABLE IF NOT EXISTS topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500) DEFAULT NULL,
  cover_image VARCHAR(500) DEFAULT NULL,
  note_count INT DEFAULT 0,
  follow_count INT DEFAULT 0,
  is_pinned TINYINT DEFAULT 0,
  is_recommended TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  UNIQUE KEY uk_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='话题表';

-- 38. 关注表
CREATE TABLE IF NOT EXISTS follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  follower_id INT NOT NULL COMMENT '关注者ID',
  followed_id INT NOT NULL COMMENT '被关注者ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_follow (follower_id, followed_id),
  INDEX idx_followed_id (followed_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='关注表';

-- 39. 点赞表
CREATE TABLE IF NOT EXISTS likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  target_type VARCHAR(20) NOT NULL COMMENT 'note/comment/product等',
  target_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_like (user_id, target_type, target_id),
  INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- 40. 收藏表（游记收藏 社区用）
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  note_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_favorite (user_id, note_id),
  INDEX idx_note_id (note_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记收藏表';

-- 41. 举报表
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT NOT NULL COMMENT '举报者ID',
  target_type VARCHAR(20) NOT NULL COMMENT 'note/comment',
  target_id INT NOT NULL,
  reason VARCHAR(500) NOT NULL COMMENT '举报原因',
  status ENUM('pending','handled','dismissed') DEFAULT 'pending',
  handle_result VARCHAR(500) DEFAULT NULL,
  handled_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_target (target_type, target_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='举报表';

-- ============================================
-- 七、模块6 -- 管理后台（7张）
-- ============================================

-- 42. 商家入驻申请表
CREATE TABLE IF NOT EXISTS merchant_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '申请用户ID',
  shop_name VARCHAR(100) NOT NULL COMMENT '店铺名称',
  module VARCHAR(20) NOT NULL COMMENT '入驻模块 module1/module2/module3/module4',
  business_type VARCHAR(50) NOT NULL COMMENT '业务类型 非遗手工坊/特色餐厅/民宿客栈等',
  contact_name VARCHAR(50) NOT NULL COMMENT '联系人',
  contact_phone VARCHAR(20) NOT NULL COMMENT '联系电话',
  materials JSON DEFAULT NULL COMMENT '资质材料',
  status ENUM('pending','approved','rejected') DEFAULT 'pending' COMMENT '审核状态',
  review_remark VARCHAR(500) DEFAULT NULL COMMENT '审核备注/驳回原因',
  reviewer_id INT DEFAULT NULL COMMENT '审核人ID',
  reviewed_at DATETIME DEFAULT NULL COMMENT '审核时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家入驻申请表';

-- 43. 平台公告表
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT '公告标题',
  content TEXT COMMENT '公告内容',
  status TINYINT DEFAULT 1 COMMENT '1发布 0草稿',
  creator_id INT DEFAULT NULL COMMENT '发布人ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='平台公告表';

-- 44. 轮播图表
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) DEFAULT NULL COMMENT '标题',
  image_url VARCHAR(500) NOT NULL COMMENT '图片URL',
  link_url VARCHAR(500) DEFAULT NULL COMMENT '跳转链接',
  position VARCHAR(50) DEFAULT 'home' COMMENT '展示位置 home/miniprogram/pc',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_position (position),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 45. 推荐位表
CREATE TABLE IF NOT EXISTS recommendation_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slot_name VARCHAR(50) NOT NULL COMMENT '推荐位名称',
  target_type VARCHAR(30) NOT NULL COMMENT '关联内容类型',
  target_id INT NOT NULL COMMENT '关联内容ID',
  position VARCHAR(50) DEFAULT 'home' COMMENT '展示位置',
  sort_order INT DEFAULT 0,
  start_time DATETIME DEFAULT NULL COMMENT '展示开始时间',
  end_time DATETIME DEFAULT NULL COMMENT '展示结束时间',
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0,
  INDEX idx_position (position),
  INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='推荐位表';

-- 46. 操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  operator_id INT NOT NULL COMMENT '操作人ID',
  operator_name VARCHAR(50) DEFAULT NULL COMMENT '操作人姓名',
  action VARCHAR(50) NOT NULL COMMENT '操作类型',
  target_type VARCHAR(30) DEFAULT NULL COMMENT '操作对象类型',
  target_id INT DEFAULT NULL COMMENT '操作对象ID',
  content TEXT COMMENT '操作内容描述',
  ip VARCHAR(50) DEFAULT NULL COMMENT '操作IP',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_operator_id (operator_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- 47. 结算记录表
CREATE TABLE IF NOT EXISTS settlement_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  merchant_id INT NOT NULL COMMENT '商家ID',
  period_start DATE NOT NULL COMMENT '结算周期开始',
  period_end DATE NOT NULL COMMENT '结算周期结束',
  order_count INT DEFAULT 0 COMMENT '订单数',
  total_amount DECIMAL(10,2) DEFAULT 0 COMMENT '订单总额',
  commission_rate DECIMAL(4,2) DEFAULT NULL COMMENT '抽佣比例(%)',
  commission_amount DECIMAL(10,2) DEFAULT 0 COMMENT '平台抽佣',
  settlement_amount DECIMAL(10,2) DEFAULT 0 COMMENT '商家结算金额',
  status ENUM('pending','settled') DEFAULT 'pending' COMMENT '结算状态',
  settled_at DATETIME DEFAULT NULL COMMENT '结算时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_period (period_start, period_end),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='结算记录表';

-- ============================================
-- 初始化数据
-- ============================================

-- 创建默认管理员 admin/admin123
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$12$Fp8aLBRMCTGKFl1/Ei7C7eTB6HfJGzD0yzj1OMvG.2wMVbCoHgE4u', 'super_admin');
-- 密码: admin123 (bcrypt hash)

-- 默认商品分类
INSERT INTO product_categories (name, sort_order) VALUES
('银饰', 1), ('蜡染', 2), ('刺绣', 3), ('苗族服饰', 4), ('其他', 99);

-- 默认农产品分类
INSERT INTO farm_product_categories (name, sort_order) VALUES
('茶叶', 1), ('腊肉', 2), ('米酒', 3), ('酸食', 4), ('其他', 99);

-- 默认话题
INSERT INTO topics (name, description, note_count) VALUES
('乌东风光', '分享你在乌东村拍摄的美景', 0),
('苗寨美食', '记录苗家美味时刻', 0),
('民宿体验', '分享特色民宿入住体验', 0),
('非遗文化', '探索苗族非物质文化遗产', 0),
('出行攻略', '分享你的乌东出行经验', 0);
