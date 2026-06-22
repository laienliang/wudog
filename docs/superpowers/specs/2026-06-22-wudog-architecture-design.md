# 乌东文旅平台 整体架构设计

| 项目 | 内容 |
|---|---|
| 文档版本 | V1.0 |
| 编制日期 | 2026-06-22 |
| 适用项目 | 乌东文旅"衣食住行"综合服务平台 |
| 架构方案 | 方案C：单体后端 + 公共模块抽取 |

---

## 1. 系统架构

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                    客户端三层                              │
│  微信小程序(uni-app)   PC网页(Nuxt3)   管理后台(cool-admin-vue) │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS (/api/)
              ┌──────────▼──────────┐
              │   Cool-Admin 后端    │
              │   Midway.js + TypeORM │
              └──────────┬──────────┘
                         │
         ┌───────────────┼───────────────┐
         │  公共模块层     │               │
         │  用户/订单/支付 │  上传/消息/搜索 │
         └───────────────┼───────────────┘
                         │
         ┌───────────────┼───────────────┐
         │  业务模块层     │               │
         │  衣 食 住 行 社区 │   平台管理后台  │
         └───────────────┼───────────────┘
                         │
              ┌──────────▼──────────┐
              │   MySQL + Redis     │
              │   OSS 对象存储       │
              └─────────────────────┘
```

### 1.2 三端技术栈

| 端 | 技术栈 | 端口 | 说明 |
|---|--------|------|------|
| 微信小程序 | uni-app + Vue3 + Pinia | 5173 | 游客移动端主入口 |
| PC 网页 | Nuxt3 + Element Plus + Pinia | 3000 | 游客桌面端，SSR + SEO |
| 管理后台 | cool-admin-vue (Vue3) | 80 | 商家/管理员后台 |
| 后端 | cool-admin (Midway.js + TypeORM) | 8001 | 单体架构，MySQL 8.0 |

---

## 2. 数据库设计

### 2.1 表命名规范

所有业务表以模块名为前缀：`模块名_表名`

| 模块 | 前缀 |
|------|------|
| 衣 | `clothing_` |
| 食 | `food_` |
| 住 | `lodging_` |
| 行 | `travel_` |
| 社区 | `community_` |
| 管理后台 | `admin_` |

### 2.2 公共表

| 表名 | 说明 | 关键字段 |
|------|------|---------|
| `user_info` | 用户主表 | id, phone, nickname, avatar |
| `user_address` | 收货地址 | id, user_id, name, phone, detail |
| `user_wx` | 微信绑定 | id, user_id, openid, session_key, unionid |
| `order_base` | 统一订单主表 | id, order_no, user_id, module_type, total_amount, status |
| `cart_item` | 购物车 | id, user_id, goods_id, quantity |
| `payment_record` | 支付记录 | id, order_no, amount, status, transaction_id |
| `refund_record` | 退款记录 | id, order_no, amount, reason, status |
| `upload_file` | 文件上传 | id, url, size, type |
| `message_record` | 消息通知 | id, user_id, type, content, is_read |

### 2.3 订单模型

```
order_base (订单主表)
├── id: 订单ID
├── order_no: 订单编号（全局唯一）
├── user_id: 用户ID
├── module_type: 模块类型 (1=衣, 2=食, 3=住, 4=行)
├── merchant_id: 商家ID（可为空）
├── total_amount: 总金额
├── pay_amount: 实付金额
├── status: 订单状态
├── pay_time / finish_time / cancel_time
└── create_time

order_item_{module} (各模块订单明细表)
├── clothing_order_item (衣)
├── food_order_item (食)
├── lodging_order_item (住)
└── travel_order_item (行)
```

### 2.4 业务表清单

**第1组·衣**：`clothing_category`, `clothing_goods`, `clothing_goods_sku`, `clothing_review`, `clothing_collect`

**第2组·食**：`food_restaurant`, `food_dish`, `food_time_slot`, `food_agriculture_category`, `food_agriculture_goods`, `food_review`, `food_booking`

**第3组·住**：`lodging_hostel`, `lodging_room_type`, `lodging_calendar`, `lodging_review`, `lodging_collect`

**第4组·行**：`travel_scenic`, `travel_ticket_type`, `travel_route`, `travel_route_day`, `travel_e_ticket`, `travel_guide`, `travel_review`, `travel_collect`

**第5组·社区**：`community_article`, `community_comment`, `community_topic`, `community_follow`, `community_like`, `community_report`, `community_image`, `community_video`

**第6组·管理后台**：`admin_user`, `admin_role`, `admin_merchant_apply`, `admin_platform_banner`, `admin_platform_stat`, `admin_sensitive_word`, `admin_system_log`

---

## 3. API 接口设计

### 3.1 接口前缀

| 前缀 | 说明 | 调用方 |
|------|------|--------|
| `/api/open/` | 面向游客的公开接口 | 小程序、PC端 |
| `/api/admin/` | 面向管理员/商家的后台接口 | 管理后台 |

### 3.2 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 3.3 公共接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/user/login` | POST | 微信登录 / 手机登录 |
| `/user/info` | GET | 获取用户信息 |
| `/user/address/page` | POST | 地址管理 |
| `/order/page` | POST | 我的订单列表 |
| `/order/info` | POST | 订单详情 |
| `/order/cancel` | POST | 取消订单 |
| `/payment/wechat` | POST | 发起微信支付 |
| `/cart/page` | POST | 购物车列表 |
| `/cart/add` | POST | 加入购物车 |
| `/upload/file` | POST | 文件上传 |
| `/search` | POST | 全局搜索 |
| `/collect/page` | POST | 我的收藏 |

### 3.4 业务接口

**衣**：`/clothing/category/tree`, `/clothing/goods/page`, `/clothing/goods/info`, `/clothing/goods/review/page`

**食**：`/food/restaurant/page`, `/food/restaurant/info`, `/food/restaurant/booking`, `/food/agriculture/page`, `/food/agriculture/info`

**住**：`/lodging/hostel/page`, `/lodging/hostel/info`, `/lodging/calendar`, `/lodging/booking`, `/lodging/review/page`

**行**：`/travel/scenic/page`, `/travel/scenic/info`, `/travel/ticket/buy`, `/travel/route/page`, `/travel/route/info`, `/travel/route/buy`, `/travel/eticket/verify`, `/travel/guide/page`

**社区**：`/community/article/page`, `/community/article/info`, `/community/article/add`, `/community/comment/page`, `/community/like`, `/community/follow`, `/community/topic/page`, `/community/report`

**管理后台**：`/admin/user/page`, `/admin/merchant/apply/page`, `/admin/order/page`, `/admin/stat/dashboard`, `/admin/banner/page`, `/admin/sensitive/word/page`

### 3.5 统一接口规范

- 认证：`Authorization: Bearer {token}`
- 来源标识：`Client-Type: miniprogram | pc | admin`
- 分页参数：`{ page, pageSize, orderBy, orderDir }`

---

## 4. 前端设计

### 4.1 微信小程序（uni-app + Vue3）

**底部 TabBar（4个）**：首页 | 分类 | 社区 | 我的

**页面结构**：
```
pages/
├── index/           # 首页（Banner、金刚区、推荐）
├── clothing/        # 衣模块（category, list, detail）
├── food/            # 食模块（restaurant, agriculture）
├── lodging/         # 住模块（list, detail）
├── travel/          # 行模块（scenic, route, guide）
├── community/       # 社区（feed, article）
├── user/            # 个人中心（profile, orders, collect, album）
└── cart/            # 购物车
```

### 4.2 PC 网页（Nuxt3 + Element Plus）

**顶部导航**：[Logo] 衣 食 住 行 社区 [搜索框] [登录/个人中心]

**页面结构**：
```
pages/
├── index.vue            # 首页
├── clothing/            # 商品列表 + 详情
├── food/                # 餐厅 + 农产品
├── lodging/             # 民宿列表 + 详情
├── travel/              # 景区/路线/攻略
├── community/           # 游记列表 + 详情
├── user/                # 登录 + 个人中心
└── cart.vue             # 购物车
```

**性能优化**：SSR 首屏渲染、图片懒加载、路由级代码分割、CDN 加速

### 4.3 管理后台（cool-admin-vue）

**侧边栏菜单**：
```
平台管理
├── 数据看板 / 用户管理 / 商家管理
├── 订单管理（全部订单 / 退款管理 / 财务结算）
├── 衣模块管理（商品 / 分类 / 评价）
├── 食模块管理（餐厅 / 农产品 / 预订）
├── 住模块管理（民宿 / 房型 / 房态）
├── 行模块管理（景区 / 票种 / 路线 / 核销）
├── 社区管理（审核 / 游记 / 话题）
├── 运营管理（轮播图 / 公告）
└── 系统设置
```

### 4.4 共通组件

`GoodsCard` | `RestaurantCard` | `HostelCard` | `TicketCard` | `ArticleCard` | `OrderCard` | `SearchBar` | `EmptyState` | `RatingStars` | `ImageCarousel`

---

## 5. 部署与协作

### 5.1 开发环境

- MySQL 8.0 + Redis 7 通过 Docker Compose 启动
- 后端端口 8001，小程序 5173，PC 端 3000，管理后台 80
- `synchronize: true` 自动建表（仅开发环境）

### 5.2 Git 分支策略

```
master（主分支）
├── feature/clothing      ← 第1组
├── feature/food          ← 第2组
├── feature/lodging       ← 第3组
├── feature/travel        ← 第4组
├── feature/community     ← 第5组
└── feature/platform      ← 第6组
```

### 5.3 模块代码组织

```
cool-admin-midway/src/modules/
├── common/           # 公共模块
│   ├── user/
│   ├── order/
│   ├── payment/
│   ├── cart/
│   ├── upload/
│   └── message/
├── clothing/         # 第1组
├── food/             # 第2组
├── lodging/          # 第3组
├── travel/           # 第4组
├── community/        # 第5组
└── platform/         # 第6组
```

### 5.4 接口契约管理

第6组负责维护 API 契约文档，放在 `docs/api/` 下，包含 `open-api.md`、`admin-api.md`、`common-types.md`。

---

## 6. 模块间依赖关系

```
衣 ← 用户、订单、支付、购物车、上传、搜索
食 ← 用户、订单、支付、购物车、上传、搜索
住 ← 用户、订单、支付、上传、搜索
行 ← 用户、订单、支付、上传、搜索
社区 ← 用户、上传、搜索、消息
管理后台 ← 用户、订单、消息、上传
```

---

*本文档基于需求规格说明书和视觉设计规范产出，作为 6 个学生小组并行开发的共同技术依据。*
