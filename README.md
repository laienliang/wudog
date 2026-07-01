# 乌东非遗文旅电商平台

乌东非遗商品电商平台，展示和销售非物质文化遗产手工艺品（银饰、蜡染、刺绣）。支持 Web 端、微信小程序和管理后台三端使用。

## 技术栈

| 模块 | 技术 |
|------|------|
| **后端** | Node.js + Midway.js + TypeORM + MySQL 8.0 + Redis 7 |
| **Web 消费者端** | React 18 + Vite 5 + React Router 6 |
| **管理后台** | React 18 + Vite 5 + Ant Design 5 |
| **微信小程序** | 原生开发（WXML/WXSS/JS） |
| **部署** | Docker Compose（5 个服务） |

## 项目结构

```
wudong/
├── backend/            # 后端服务（Midway.js）
│   ├── src/
│   │   ├── config/     # 数据库、Redis 等配置
│   │   ├── controller/ # API 控制器（14 个）
│   │   ├── entity/     # 数据库实体（12 张表）
│   │   ├── service/    # 业务逻辑层（13 个）
│   │   ├── middleware/  # JWT 鉴权中间件
│   │   └── utils/      # 工具函数
│   ├── sql/init.sql    # 数据库初始化脚本
│   ├── uploads/        # 上传文件存储
│   └── Dockerfile
├── web/                # 消费者前端（React）
│   ├── src/
│   │   ├── pages/      # 页面组件（11 个）
│   │   ├── components/ # 公共组件
│   │   ├── contexts/   # React Context（鉴权）
│   │   └── utils/      # API 请求封装
│   ├── nginx.conf
│   └── Dockerfile
├── admin/              # 管理后台（React + Ant Design）
│   ├── src/
│   │   └── pages/      # 页面组件（5 个）
│   ├── nginx.conf
│   └── Dockerfile
├── miniprogram/        # 微信小程序（原生开发）
│   ├── pages/          # 页面（12 个）
│   └── utils/          # HTTP 请求封装
├── docker-compose.yml  # Docker 编排文件
└── PRODUCT.md          # 产品需求文档
```

## 快速开始

### 环境要求

- Node.js >= 20
- Docker & Docker Compose（推荐）
- 微信开发者工具（小程序开发）

### Docker 一键部署（推荐）

```bash
# 克隆项目
git clone <仓库地址>
cd wudong

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

启动后访问地址：

| 服务 | 地址 | 说明 |
|------|------|------|
| 消费者 Web 端 | http://localhost:8081 | 商品浏览、下单 |
| 管理后台 | http://localhost:8080 | 商品/订单管理 |
| 后端 API | http://localhost:3000 | RESTful 接口 |
| MySQL | localhost:3307 | 数据库连接 |
| Redis | localhost:6379 | 缓存服务 |

### 本地开发

```bash
# 1. 启动 MySQL 和 Redis（用 Docker 或本地安装）
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=wudong -p 3307:3306 mysql:8.0
docker run -d --name redis -p 6379:6379 redis:7-alpine

# 2. 启动后端
cd backend
npm install
npm run dev

# 3. 启动 Web 前端
cd web
npm install
npm run dev

# 4. 启动管理后台
cd admin
npm install
npm run dev
```

## 数据库设计

共 12 张表，全部使用软删除（`is_deleted` 标记）：

| 表名 | 说明 | 核心字段 |
|------|------|---------|
| `admin_user` | 管理员 | username, password |
| `user` | 用户 | username, password(bcrypt), nickname, phone, avatar |
| `product_category` | 商品分类 | name, sort_order |
| `product` | 商品 | category_id, name, description, craft_intro, artisan_info, price, stock, status |
| `product_sku` | 商品规格 | product_id, spec_name, price, stock |
| `product_image` | 商品图片 | product_id, image_url, sort_order |
| `product_favorite` | 收藏 | product_id, user_id |
| `cart` | 购物车 | user_id, product_id, sku_id, quantity |
| `product_order` | 订单 | order_no(WD+时间戳+随机数), 状态机(待付款→已确认→已发货→已完成/已取消) |
| `chat_message` | 客服消息 | sender_type(user/admin), content, is_read |
| `review` | 商品评价 | rating(1-5), content, images, reply(管理员回复) |
| `address` | 收货地址 | name, phone, province, city, district, town, detail, is_default |

## API 接口

所有接口以 `/api` 为前缀，使用 JWT 鉴权（`Authorization: Bearer <token>`）。

### 公开接口（无需登录）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/product/list` | 商品列表（分页、搜索、分类筛选） |
| GET | `/api/product/detail/:id` | 商品详情 |
| GET | `/api/product-category/list` | 商品分类列表 |
| POST | `/api/user/register` | 用户注册 |
| POST | `/api/user/login` | 用户登录 |
| POST | `/api/admin/login` | 管理员登录 |
| POST | `/api/upload/image` | 上传图片（max 5MB） |

### 用户接口（需 user token）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/user/info` | 获取用户信息 |
| PUT | `/api/user/update-profile` | 更新用户资料 |
| PUT | `/api/user/update-password` | 修改密码 |
| POST | `/api/cart/add` | 添加购物车 |
| GET | `/api/cart/list` | 购物车列表 |
| PUT | `/api/cart/update/:id` | 修改购物车数量 |
| DELETE | `/api/cart/delete/:id` | 删除购物车项 |
| POST | `/api/order/create` | 创建订单 |
| PUT | `/api/order/request-cancel/:id` | 申请取消订单 |
| PUT | `/api/order/request-return/:id` | 申请退货 |
| PUT | `/api/order/revoke-cancel/:id` | 撤销取消申请 |
| POST | `/api/product-favorite/toggle` | 收藏/取消收藏 |
| GET | `/api/product-favorite/list` | 收藏列表 |
| POST | `/api/review/create` | 发表评价 |
| GET | `/api/review/my` | 我的评价 |

### 管理员接口（需 admin token）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/product/create` | 创建商品 |
| PUT | `/api/product/update/:id` | 更新商品 |
| DELETE | `/api/product/delete/:id` | 删除商品 |
| PUT | `/api/product/toggle-status/:id` | 上下架切换 |
| POST | `/api/product-category/create` | 创建分类 |
| PUT | `/api/product-category/update/:id` | 更新分类 |
| DELETE | `/api/product-category/delete/:id` | 删除分类 |
| POST | `/api/product-sku/create` | 创建 SKU |
| PUT | `/api/product-sku/update/:id` | 更新 SKU |
| DELETE | `/api/product-sku/delete/:id` | 删除 SKU |
| PUT | `/api/order/update-status/:id` | 更新订单状态 |
| PUT | `/api/order/approve-cancel/:id` | 批准取消（恢复库存） |
| PUT | `/api/order/reject-cancel/:id` | 驳回取消 |
| PUT | `/api/review/reply/:id` | 回复评价 |

### 共享接口（user 或 admin token）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/order/list` | 订单列表 |
| GET | `/api/order/detail/:id` | 订单详情 |
| POST | `/api/chat/send` | 发送客服消息 |
| GET | `/api/chat/conversation/:targetId` | 获取对话记录 |
| GET | `/api/chat/unread/:targetId` | 未读消息数 |
| GET | `/api/chat/admin/conversations` | 管理员获取会话列表 |
| GET | `/api/notification/count` | 未读通知统计 |

## 核心功能

### 订单状态机

```
待付款(0) → 已确认(1) → 已发货(2) → 已完成(3)
    ↓                        ↓
  取消申请(4) ←─────────── 退货申请
    ↓
  管理员批准 → 恢复库存
  管理员驳回 → 维持原状态
```

### 客服聊天

基于 HTTP 轮询的实时客服系统，支持用户与管理员双向沟通：

- Web 端：每 3 秒轮询
- 管理后台：消息每 3 秒轮询，会话列表每 5 秒轮询
- 小程序：每 3 秒轮询
- 已读标记：打开对话时自动标记为已读

### Redis 缓存

商品列表查询结果缓存至 Redis，TTL 60 秒。商品增删改操作自动清除缓存。Redis 不可用时自动降级为直接查询数据库。

### 通知系统

用户端通知三类消息：
- 订单状态变更提醒
- 已完成但未评价的订单提醒
- 管理员回复评价的提醒

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `MYSQL_HOST` | localhost | MySQL 主机 |
| `MYSQL_PORT` | 3306 | MySQL 端口 |
| `MYSQL_USER` | root | MySQL 用户名 |
| `MYSQL_PASSWORD` | 123456 | MySQL 密码 |
| `MYSQL_DATABASE` | wudong | 数据库名 |
| `REDIS_HOST` | localhost | Redis 主机 |
| `REDIS_PORT` | 6380 | Redis 端口 |
| `JWT_SECRET` | wudong-jwt-secret | JWT 签名密钥 |
| `PORT` | 3000 | 后端服务端口 |

## 默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |

普通用户需自行注册。

## 设计规范

- **品牌色**：`#c9a96e`（暖金色）
- **深色背景**：`#1a1a2e` / `#16213e`（深海蓝）
- **设计原则**：内容优先、操作简洁、四端视觉一致
- **品牌调性**：文化传承、质朴温暖、简洁可信
