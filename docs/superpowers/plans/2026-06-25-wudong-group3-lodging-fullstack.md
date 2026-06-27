# 乌东文旅第3组【住·苗寨民宿预订】全栈四端项目 — 架构规划 & 文件清单

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建乌东文旅第3组"住·苗寨民宿预订"全栈四端项目，含后端、PC游客端、管理后台、微信小程序

**Architecture:** Monorepo 四端分离架构。backend 提供 REST API（端口3000），web 与 admin 为独立 Vite+React SPA，miniprogram 为原生微信小程序；三端前端统一对接 /api/lodging/* 接口。管理后台额外提供房态日历批量库存/价格管理功能。

**Tech Stack:** cool-admin-midway + Midway3 + TypeORM + MySQL (后端) | React18 + Vite + TS (PC游客端) | React18 + Vite + TS + Ant Design5 (管理后台) | 原生微信小程序

---

## Global Constraints

- 接口前缀 `/api/lodging`，REST 小写连字符，统一返回 `{code, message, data}`
- 分页统一 `?page=1&pageSize=20`，返回 `{total, page, pageSize, list}`
- 所有数据表必须含 `id`、`created_at`、`updated_at`、`is_deleted` 软删除字段
- 时间统一 ISO8601 东八区；管理接口携带 `Authorization: Bearer token`，游客端免登录
- UI 严格遵循乌东视觉规范：主色 `#1F5FA8`，辅色 `#E85D2F`，8px 基准栅格
- 模块3核心数据表：民宿、房型、房态日历、入住须知、住宿订单、住宿评价、民宿收藏
- 核心业务规则：最少入住1晚，最多提前90天预订；阶梯退改规则；房态库存自动锁定；入住核销二维码
- 后端端口 3000，PC Web 游客端端口 5173，管理后台端口 5174

---

## 完整本地目录文件清单

> 本地根目录：`C:\Users\huangjiaxin\乌东项目5\wudong-group3\`

---

### 一、Backend（cool-admin-midway + Midway3 + TypeORM + MySQL）

#### 1.1 根配置文件

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 1 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\package.json` | 项目依赖与脚本：@cool-midway/core、@midwayjs/core、typeorm、mysql2 |
| 2 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\tsconfig.json` | TypeScript 编译配置 |
| 3 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\jest.config.js` | 测试框架配置 |

#### 1.2 配置模块 `backend/src/config/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 4 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\config\config.default.ts` | 默认配置：数据库连接、JWT密钥、CORS、分页默认值 |
| 5 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\config\config.local.ts` | 本地开发配置：端口 3000、MySQL 本地连接 |
| 6 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\config\config.prod.ts` | 生产环境配置 |
| 7 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\config\plugin.ts` | 插件注册（cool-admin 核心插件） |

#### 1.3 住宿业务模块 `backend/src/modules/lodging/`

##### 1.3.1 实体层 Entity

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 8 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\homestay.ts` | 民宿实体：名称、地址、经纬度、封面图、简介、设施标签、联系方式、最低价格、状态 |
| 9 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\room.ts` | 房型实体：所属民宿ID、房型名称、床型、面积、可住人数、基础价格、图片列表、设施列表、房型描述 |
| 10 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\calendar.ts` | 房态日历实体：房型ID、日期、可售库存、已订库存、当日价格（可覆盖基础价）、状态（可售/满房/关房） |
| 11 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\house-rule.ts` | 入住须知实体：民宿ID、入住时间、退房时间、取消规则（阶梯JSON）、注意事项、携带宠物等 |
| 12 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\order.ts` | 订单实体：订单号、用户ID、房型ID、民宿ID、入住日期、离店日期、晚数、总价、状态（待支付/已支付/已入住/已完成/已取消/退款中）、联系人信息、核销码 |
| 13 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\review.ts` | 评价实体：订单ID、用户ID、民宿ID、评分、内容、图片、房东回复 |
| 14 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\entity\favorite.ts` | 收藏实体：用户ID、民宿ID、收藏时间 |

##### 1.3.2 数据传输对象 DTO

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 15 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\homestay.ts` | 民宿查询/创建/更新 DTO |
| 16 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\room.ts` | 房型查询/创建/更新 DTO |
| 17 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\calendar.ts` | 房态日历查询/批量更新 DTO（date 数组 + 价格/库存批量操作） |
| 18 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\order.ts` | 订单创建/查询/状态更新 DTO |
| 19 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\review.ts` | 评价创建/查询/回复 DTO |
| 20 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\dto\favorite.ts` | 收藏操作 DTO |

##### 1.3.3 服务层 Service

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 21 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\homestay.ts` | 民宿CRUD、列表查询（支持搜索/筛选/排序）、详情查询（含房型嵌套） |
| 22 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\room.ts` | 房型CRUD、按民宿ID查询房型列表 |
| 23 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\calendar.ts` | 房态查询（按房型+日期范围）、批量更新库存/价格、库存锁定/释放（事务） |
| 24 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\order.ts` | 订单创建（含库存锁定事务）、订单列表/详情、状态流转（支付→入住→完成/取消）、退改逻辑（阶梯规则匹配）、核销码生成与验证 |
| 25 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\review.ts` | 评价创建、按民宿查询评价列表、房东回复 |
| 26 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\favorite.ts` | 添加/取消收藏、用户收藏列表查询 |
| 27 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\service\house-rule.ts` | 入住须知管理（CRUD，按民宿ID关联） |

##### 1.3.4 控制器层 Controller

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 28 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\homestay.ts` | `GET /api/lodging/homestays`（游客列表）`POST/PUT/DELETE /api/lodging/admin/homestays`（管理CRUD）|
| 29 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\room.ts` | `GET /api/lodging/homestays/:id/rooms`（游客看房型）`POST/PUT/DELETE /api/lodging/admin/rooms`（管理CRUD）|
| 30 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\calendar.ts` | `GET /api/lodging/rooms/:roomId/calendar`（游客看房态）`PUT /api/lodging/admin/calendar/batch`（管理批量更新库存/价格）|
| 31 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\order.ts` | `POST /api/lodging/orders`（游客下单）`GET /api/lodging/orders/:id`（订单详情）`GET /api/lodging/orders`（用户订单列表）`PUT /api/lodging/admin/orders/:id/status`（管理状态变更）`POST /api/lodging/admin/orders/:id/verify`（核销）|
| 32 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\review.ts` | `GET /api/lodging/homestays/:id/reviews`（游客看评价）`POST /api/lodging/reviews`（提交评价）`POST /api/lodging/admin/reviews/:id/reply`（房东回复）|
| 33 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\favorite.ts` | `GET /api/lodging/favorites`（收藏列表）`POST/DELETE /api/lodging/favorites/:homestayId`（收藏/取消）|
| 34 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\controller\house-rule.ts` | `GET /api/lodging/homestays/:id/rules`（游客看须知）`POST/PUT /api/lodging/admin/homestays/:id/rules`（管理）|

##### 1.3.5 中间件

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 35 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\middleware\auth.ts` | JWT Bearer Token 校验中间件，挂载 `/api/lodging/admin/*` 路由前，游客路由不经过此中间件 |

##### 1.3.6 模块入口

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 36 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\modules\lodging\index.ts` | Lodging 模块注册入口，声明 controllers / services / entities |

#### 1.4 数据库 `backend/sql/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 37 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\sql\init.sql` | 全套建表 SQL：homestay、room、calendar、house_rule、`order`、review、favorite；含索引、外键、软删除字段、默认数据种子 |

#### 1.5 应用入口

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 38 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\configuration.ts` | Midway 生命周期配置，注册中间件、数据库连接 |
| 39 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\src\interface.ts` | 公共类型/接口定义 |

---

### 二、PC Web 游客端（React18 + Vite + TypeScript，端口 5173）

#### 2.1 根配置文件

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 40 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\package.json` | 依赖：react18、react-router-dom6、antd5、axios、dayjs、vite、@vitejs/plugin-react |
| 41 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\vite.config.ts` | Vite 配置：端口 5173、API 代理到 localhost:3000 |
| 42 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\tsconfig.json` | TypeScript 配置 |
| 43 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\tsconfig.node.json` | Vite Node 端 TS 配置 |
| 44 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\index.html` | SPA 入口 HTML，`<div id="root">` |
| 45 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\.env` | 开发环境变量：`VITE_API_BASE=http://localhost:3000` |
| 46 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\.env.production` | 生产环境变量 |

#### 2.2 源码入口 `web/src/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 47 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\main.tsx` | ReactDOM.createRoot 挂载 App |
| 48 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\App.tsx` | 顶层组件：ConfigProvider（乌东主题色）+ RouterProvider |
| 49 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\vite-env.d.ts` | Vite 环境类型声明 |

#### 2.3 路由 `web/src/router/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 50 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\router\index.tsx` | React Router 路由表定义（免登录，直接访问） |

#### 2.4 API 层 `web/src/api/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 51 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\api\index.ts` | Axios 实例：baseURL、请求拦截、响应拦截、统一错误处理 |
| 52 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\api\lodging.ts` | 民宿 API 封装：getHomestays / getHomestayDetail / getRooms / getCalendar / createOrder / getOrders / getOrderDetail / cancelOrder / getReviews / postReview / getFavorites / toggleFavorite |

#### 2.5 页面 `web/src/pages/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 53 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\home\index.tsx` | 首页：搜索栏 + 精品民宿推荐 + 热门目的地 |
| 54 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\homestay\list.tsx` | 民宿列表页：筛选（区域/价格/设施/评分）、排序、分页 |
| 55 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\homestay\detail.tsx` | 民宿详情页：图片轮播、房型列表、房态日历（选择日期→计算价格）、评价列表、收藏按钮→预订入口 |
| 56 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\order\create.tsx` | 下单页：确认入住/离店日期→房型→间数→联系人信息→价格明细→阶梯退改规则展示→提交订单 |
| 57 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\order\list.tsx` | 我的订单列表：按状态筛选、分页 |
| 58 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\order\detail.tsx` | 订单详情：订单信息、核销码展示、取消/退款按钮 |
| 59 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\mine\index.tsx` | 个人中心：我的订单入口、我的收藏、浏览历史 |
| 60 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\mine\favorites.tsx` | 我的收藏列表 |
| 61 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\pages\search\index.tsx` | 搜索结果页 |

#### 2.6 通用组件 `web/src/components/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 62 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\layout\header.tsx` | 全局顶栏：Logo、导航、搜索入口、我的入口 |
| 63 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\layout\footer.tsx` | 全局页脚 |
| 64 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\layout\index.tsx` | Layout 组合（Header + Outlet + Footer）|
| 65 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\homestay-card\index.tsx` | 民宿卡片：封面图、名称、地址、最低价、评分、收藏按钮 |
| 66 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\calendar\index.tsx` | 日期范围选择组件：最多选90天范围、标记不可选日期、计算晚数 |
| 67 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\image-gallery\index.tsx` | 图片画廊：轮播/网格切换、点击放大 |
| 68 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\components\review-list\index.tsx` | 评价列表：用户头像、评分星、内容、图片、房东回复 |

#### 2.7 样式 `web/src/styles/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 69 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\styles\theme.ts` | 乌东主题色常量：`PRIMARY=#1F5FA8`, `ACCENT=#E85D2F`，导出 Ant Design ConfigProvider theme token |
| 70 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\styles\variables.css` | CSS 自定义变量：颜色、间距（8px 基准）、字体 |
| 71 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\styles\global.css` | 全局样式重置 + 基础排版 |

#### 2.8 工具与状态 `web/src/utils/` `web/src/store/` `web/src/hooks/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 72 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\utils\index.ts` | 通用工具函数（日期格式化、价格格式化） |
| 73 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\utils\constants.ts` | 业务常量：退改阶梯规则文案、设施标签映射 |
| 74 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\store\index.ts` | 轻量级状态管理（Context + useReducer）：用户临时身份（设备ID）、购物车（待下单房间） |
| 75 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\src\hooks\use-lodging.ts` | 封装民宿相关数据请求逻辑 |

#### 2.9 静态资源 `web/public/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 76 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\web\public\favicon.ico` | 网站图标 |

---

### 三、管理后台（React18 + Vite + TypeScript + Ant Design5，端口 5174）

#### 3.1 根配置文件

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 77 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\package.json` | 依赖：react18、react-router-dom6、antd5、axios、dayjs、@ant-design/pro-components |
| 78 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\vite.config.ts` | Vite 配置：端口 5174、API 代理到 localhost:3000 |
| 79 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\tsconfig.json` | TypeScript 配置 |
| 80 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\tsconfig.node.json` | Vite Node 端 TS 配置 |
| 81 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\index.html` | SPA 入口 HTML |
| 82 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\.env` | 开发环境变量：`VITE_API_BASE=http://localhost:3000` |

#### 3.2 源码入口 `admin/src/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 83 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\main.tsx` | ReactDOM.createRoot 挂载 App |
| 84 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\App.tsx` | 顶层：ConfigProvider（乌东主题）+ AuthGuard（登录校验）+ RouterProvider |
| 85 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\vite-env.d.ts` | Vite 环境类型声明 |

#### 3.3 路由与权限 `admin/src/router/` `admin/src/store/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 86 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\router\index.tsx` | 管理后台路由表：民宿管理、房型管理、房态日历、订单管理、评价管理（均需登录） |
| 87 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\store\auth.ts` | 登录态管理：token 存储、登录/登出、AuthGuard 高阶组件 |

#### 3.4 API 层 `admin/src/api/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 88 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\api\index.ts` | Axios 实例：自动附带 `Authorization: Bearer token` |
| 89 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\api\lodging.ts` | 管理端 API 封装：所有 admin/* 接口，含批量操作 |

#### 3.5 页面 `admin/src/pages/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 90 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\login\index.tsx` | 管理员登录页 |
| 91 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\dashboard\index.tsx` | 仪表盘：订单统计、入住率、收益概览 |
| 92 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\homestay\list.tsx` | 民宿管理列表：增删改查、上下架 |
| 93 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\homestay\form.tsx` | 民宿新增/编辑表单（含设施标签、图片上传） |
| 94 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\room\list.tsx` | 房型管理列表：按民宿筛选 |
| 95 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\room\form.tsx` | 房型新增/编辑表单 |
| 96 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\calendar\index.tsx` | **★ 房态日历批量管理**：日历视图选择房型→日期范围→批量设置库存/价格；单个日期点击修改；颜色标记可售/满房/关房 |
| 97 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\order\list.tsx` | 订单管理列表：按状态筛选、搜索、分页 |
| 98 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\order\detail.tsx` | 订单详情：完整信息、状态流转按钮（确认/入住/取消）、核销二维码验证弹窗 |
| 99 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\review\list.tsx` | 评价管理列表：查看/隐藏/回复 |
| 100 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\pages\house-rule\form.tsx` | 入住须知编辑（按民宿） |

#### 3.6 通用组件 `admin/src/components/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 101 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\components\layout\index.tsx` | Ant Design ProLayout：侧边栏菜单 + 顶栏 + 内容区 |
| 102 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\components\auth-guard\index.tsx` | 路由守卫：无 token 跳转登录页 |
| 103 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\components\calendar-manager\index.tsx` | **★ 日历网格组件**：月份切换、日期单元格（库存+价格显示）、批量选择模式、快捷操作栏 |
| 104 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\components\image-upload\index.tsx` | 图片上传组件（对接 OSS 或本地存储） |
| 105 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\components\qr-verify\index.tsx` | 核销二维码扫描/手动输入验证模态框 |

#### 3.7 样式与工具

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 106 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\styles\theme.ts` | 乌东主题色 + Ant Design ConfigProvider theme token |
| 107 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\styles\global.css` | 全局样式 |
| 108 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\utils\index.ts` | 工具函数 |
| 109 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin\src\utils\constants.ts` | 业务常量 |

---

### 四、微信小程序（原生框架，对接 localhost:3000）

#### 4.1 根配置文件

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 110 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\app.json` | 小程序配置：pages 注册、window 样式（导航栏颜色 #1F5FA8）、tabBar（首页/订单/我的）|
| 111 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\app.js` | App 入口：全局数据、登录态管理 |
| 112 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\app.wxss` | 全局样式：乌东色系变量、通用样式类 |
| 113 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\project.config.json` | 开发者工具项目配置 |
| 114 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\sitemap.json` | 小程序搜索配置 |

#### 4.2 工具与API `miniprogram/utils/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 115 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\utils\api.js` | 封装 wx.request：baseURL、统一错误处理、Promise 化 |
| 116 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\utils\constants.js` | 业务常量 |
| 117 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\utils\util.js` | 通用工具函数（日期、价格格式化） |

#### 4.3 公共组件 `miniprogram/components/`

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 118 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\homestay-card\homestay-card.wxml` | 民宿卡片模板 |
| 119 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\homestay-card\homestay-card.wxss` | 民宿卡片样式 |
| 120 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\homestay-card\homestay-card.js` | 民宿卡片逻辑 |
| 121 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\homestay-card\homestay-card.json` | 组件配置 |
| 122 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\calendar\calendar.wxml` | 日期范围选择组件模板 |
| 123 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\calendar\calendar.wxss` | 日期范围选择组件样式 |
| 124 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\calendar\calendar.js` | 日期范围选择组件逻辑（最多90天） |
| 125 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\calendar\calendar.json` | 组件配置 |
| 126 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\empty\empty.wxml` | 空状态组件 |
| 127 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\empty\empty.wxss` | 空状态样式 |
| 128 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\empty\empty.js` | 空状态逻辑 |
| 129 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\components\empty\empty.json` | 组件配置 |

#### 4.4 页面 `miniprogram/pages/`

##### 4.4.1 首页 Tab

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 130 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\index\index.wxml` | 首页模板：搜索框 + Banner + 精品推荐列表 |
| 131 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\index\index.wxss` | 首页样式 |
| 132 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\index\index.js` | 首页逻辑：加载推荐民宿 |
| 133 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\index\index.json` | 首页配置 |

##### 4.4.2 民宿模块

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 134 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\homestay\list.wxml` | 民宿列表模板 |
| 135 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\homestay\list.wxss` | 民宿列表样式 |
| 136 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\homestay\list.js` | 民宿列表逻辑：筛选、分页加载 |
| 137 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\homestay\list.json` | 民宿列表配置 |
| 138 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\homestay\detail.wxml` | 民宿详情模板 |
| 139 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\homestay\detail.wxss` | 民宿详情样式 |
| 140 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\homestay\detail.js` | 民宿详情逻辑：图片轮播、房型、日历、评价 |
| 141 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\homestay\detail.json` | 民宿详情配置 |

##### 4.4.3 订单模块

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 142 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\create.wxml` | 下单页模板：日期确认、房型选择、联系人表单、价格明细、退改规则 |
| 143 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\create.wxss` | 下单页样式 |
| 144 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\create.js` | 下单逻辑：计算总价、提交订单 |
| 145 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\create.json` | 下单页配置 |
| 146 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\list.wxml` | 订单列表模板（Tab 页） |
| 147 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\list.wxss` | 订单列表样式 |
| 148 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\list.js` | 订单列表逻辑：按状态筛选、分页 |
| 149 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\list.json` | 订单列表配置 |
| 150 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\detail.wxml` | 订单详情模板：信息、核销码二维码、操作按钮 |
| 151 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\detail.wxss` | 订单详情样式 |
| 152 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\detail.js` | 订单详情逻辑：核销码展示、取消订单 |
| 153 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\order\detail.json` | 订单详情配置 |

##### 4.4.4 我的 Tab

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 154 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\mine\index.wxml` | 个人中心模板 |
| 155 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\mine\index.wxss` | 个人中心样式 |
| 156 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\mine\index.js` | 个人中心逻辑：订单入口、收藏、设置 |
| 157 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\mine\index.json` | 个人中心配置 |
| 158 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\mine\favorites.wxml` | 我的收藏模板 |
| 159 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\mine\favorites.wxss` | 我的收藏样式 |
| 160 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\mine\favorites.js` | 我的收藏逻辑 |
| 161 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\mine\favorites.json` | 我的收藏配置 |

##### 4.4.5 搜索

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 162 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\search\index.wxml` | 搜索页模板 |
| 163 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\search\index.wxss` | 搜索页样式 |
| 164 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\search\index.js` | 搜索逻辑：关键词搜索、历史记录 |
| 165 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram\pages\search\index.json` | 搜索页配置 |

---

### 五、项目根目录

| 序号 | 完整路径 | 职责说明 |
|------|----------|----------|
| 166 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\README.md` | 项目说明：启动命令、本地路径说明、四端访问地址 |
| 167 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\.gitignore` | Git 忽略规则 |
| 168 | `C:\Users\huangjiaxin\乌东项目5\wudong-group3\docs\superpowers\plans\2026-06-25-wudong-group3-lodging-fullstack.md` | 本架构规划文档 |

---

## 架构校验对照表

| 规范要求 | 落地方案 | 状态 |
|----------|----------|------|
| 接口前缀 `/api/lodging` | Controller 路由统一 `@Prefix('/api/lodging')`，管理端 `/api/lodging/admin/*` | ✅ |
| REST 小写连字符 | 所有路由路径使用 `homestays`、`orders`、`house-rules` 等 | ✅ |
| 统一返回 `{code,message,data}` | cool-admin 中间件 + 自定义响应拦截器 | ✅ |
| 分页 `?page=1&pageSize=20` | Controller 层接收 query，Service 层统一 `.skip().take()` | ✅ |
| `id/created_at/updated_at/is_deleted` | BaseEntity 抽象类，所有实体继承 | ✅ |
| ISO8601 东八区 | `dayjs.tz` / MySQL `timestamp` 类型 | ✅ |
| 管理端 `Authorization: Bearer token` | auth 中间件挂 `/admin/*` 路由前；axios 拦截器自动注入 | ✅ |
| 游客端免登录 | 游客路由不经过 auth 中间件；设备ID临时标识 | ✅ |
| 主色 `#1F5FA8` 辅色 `#E85D2F` | theme.ts → Ant Design ConfigProvider token | ✅ |
| 8px 栅格 | CSS 变量 `--spacing-unit: 8px`，全局布局依此 | ✅ |
| 最少入住1晚/最多提前90天 | 下单校验 + 日历组件限制 | ✅ |
| 阶梯退改规则 | house_rule 表存 JSON 规则，order service 匹配计算 | ✅ |
| 房态库存自动锁定 | 下单事务内 `SELECT ... FOR UPDATE` + 库存扣减 | ✅ |
| 入住核销二维码 | 订单生成时写入随机核销码，小程序/管理端扫码验证 | ✅ |
| 房态日历批量库存/价格 | admin calendar-manager 组件 + 后端 `PUT /batch` 接口 | ✅ |

---

## 总体文件统计

| 子系统 | 文件数 |
|--------|--------|
| Backend（后端） | 39 |
| PC Web 游客端 | 37 |
| 管理后台 | 33 |
| 微信小程序 | 56 |
| 根目录 | 3 |
| **合计** | **168** |

---

> **确认以上架构和文件清单无误后，方可开始逐文件生成代码。**
> 代码生成顺序建议：Backend SQL → Backend Entity → Backend Service → Backend Controller → Backend Config → Web API 层 → Web 页面 → Admin API 层 → Admin 页面 → 小程序
