# 乌东文旅综合服务平台

基于 Koa + React + 微信小程序的文旅综合服务平台，覆盖**衣·食·住·行·社区·管理**六大业务模块。

## 技术栈

| 层 | 技术 |
|---|------|
| 后端 | Koa 2 + TypeORM + MySQL 8.0 + TypeScript |
| 管理后台 | React 18 + Ant Design 5 + Vite |
| 用户端 | React 18 + Vite（纯 CSS） |
| 小程序 | 微信原生小程序 |
| 认证 | JWT（含角色：tourist / merchant / admin / super_admin） |

## 项目结构

```
wudong-village/
├── server/               # 统一后端（端口 3000）
│   ├── src/
│   │   ├── app.ts                  # 入口：DataSource → 仓库 → 服务 → 路由
│   │   ├── config/config.ts        # 数据库/JWT/上传配置
│   │   ├── entity/                 # 42 个 TypeORM 实体
│   │   ├── service/                # 18 个业务服务
│   │   ├── controller/             # 26 个路由控制器
│   │   └── middleware/             # JWT 认证 + 角色校验中间件
│   └── sql/init.sql                # 47 张表建表脚本 + 种子数据
├── admin/                # 管理后台（端口 5174）
│   └── src/pages/                  # 20+ 管理页面（各模块 CRUD + 平台管理）
├── web/                  # 用户端（端口 5173）
│   └── src/pages/                  # 各模块列表/详情/订单页
└── miniprogram/          # 微信小程序
    └── pages/                      # 首页 + 5 业务模块 + 社区 + 用户
```

## 业务模块

### 模块 1 — 衣 · 非遗商城
商品管理（CRUD + 审核流程）、商品分类、SKU 规格、商品评价、收藏、购物车、统一订单

### 模块 2 — 食 · 餐饮美食
餐厅管理、菜品管理、用餐时段、餐厅预订、农产品商城、农产品分类、餐饮评价

### 模块 3 — 住 · 民宿酒店
民宿管理、房型管理、房间日历、民宿预订、入住核销码、民宿评价

### 模块 4 — 行 · 出行旅游
景区管理、门票类型、电子票、核销验证、旅游路线、行程安排、交通指南

### 模块 5 — 社区 · 游记分享
游记发布/编辑/审核、话题管理、评论、点赞、收藏、关注、举报

### 模块 6 — 平台管理
仪表盘统计、商户入驻审核、Banner 管理、消息通知推送、全局订单管理、操作日志

## 数据库

47 张表，统一数据库 `wudong_village`：

| 分类 | 表数 | 核心表 |
|------|------|--------|
| 公共模块 | 10 | users, addresses, shopping_cart, orders, payments, notifications, uploads, banners, merchant_applications, operation_logs |
| 模块 1 衣 | 6 | product_categories, products, product_skus, product_images, product_reviews, product_favorites |
| 模块 2 食 | 7 | restaurants, restaurant_dishes, meal_time_slots, restaurant_bookings, farm_product_categories, farm_products, restaurant_reviews |
| 模块 3 住 | 5 | homestays, room_types, room_calendars, homestay_bookings, homestay_reviews |
| 模块 4 行 | 6 | scenic_spots, ticket_types, e_tickets, tour_routes, tour_itineraries, transport_guides |
| 模块 5 社区 | 7 | travel_notes, comments, topics, follows, likes, favorites, reports |
| 模块 6 管理 | 6 | 复用公共表 + admin 路由 |

所有表均使用 `utf8mb4` 字符集，支持软删除（`is_deleted` 字段）。

## 快速开始

### 环境要求
- Node.js 18+
- MySQL 8.0+
- 微信开发者工具（小程序调试）

### 1. 初始化数据库

```bash
mysql -u root -p < server/sql/init.sql
```

默认数据库配置：host `127.0.0.1`，端口 `3306`，用户 `root`，密码 `123456`，库名 `wudong_village`。可通过环境变量覆盖：`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`。

### 2. 启动后端

```bash
cd server
npm install
npm run dev        # http://localhost:3000
```

管理员账号：`admin` / `admin123`（super_admin 角色）

### 3. 启动管理后台

```bash
cd admin
npm install
npm run dev        # http://localhost:5174
```

### 4. 启动用户端

```bash
cd web
npm install
npm run dev        # http://localhost:5173
```

### 5. 微信小程序

用微信开发者工具打开 `miniprogram/` 目录。小程序通过 `utils/request.js` 连接后端 API，默认指向 `http://localhost:3000`，部署时需修改为服务器实际地址。

## API 路由一览

```
/public/auth/*          认证（注册/登录/用户信息）
/public/upload          文件上传
/public/cart/*          购物车
/public/order/*         用户订单（创建/支付/取消/确认）

/admin/*                管理后台（仪表盘/用户/商户审核/Banner/通知/日志/订单）

/api/travel-note/*      游记（CRUD/审核/搜索）
/api/comment/*          评论
/api/topic/*            话题
/api/follow/*           关注
/api/like/*             点赞
/api/favorite/*         收藏
/api/report/*           举报

/api/product-category/* 非遗商品分类
/api/product/*          非遗商品
/api/product-review/*   商品评价
/api/product-favorite/* 商品收藏

/api/restaurant/*       餐厅 + 菜品 + 时段
/api/restaurant-booking/* 餐厅预订
/api/farm-product/*     农产品 + 分类
/api/restaurant-review/* 餐饮评价

/api/homestay/*         民宿 + 房型 + 日历
/api/homestay-booking/* 民宿预订
/api/homestay-review/*  民宿评价

/api/scenic-spot/*      景区 + 门票类型
/api/tour-route/*       旅游路线 + 行程 + 交通指南
/api/e-ticket/*         电子票
```

响应格式统一为 `{ code: 200, message: "success", data: ... }`。

## 构建部署

```bash
# 后端编译
cd server && npm run build

# 管理后台构建
cd admin && npm run build

# 用户端构建
cd web && npm run build
```

## 设计约定

- **实体映射**：TypeORM Entity 属性使用 camelCase，通过 `@Column({ name: 'snake_case' })` 映射数据库字段
- **软删除**：绝大多数表使用 `is_deleted = 0` 过滤有效数据
- **状态流转**：Service 层维护 status 状态机，防止非法状态变更
- **角色校验**：`requireAuth()` 验证登录，`requireAuth('admin')` 验证管理员
- **DI 模式**：Service 构造函数注入 Repository，Controller 工厂函数注入 Service
