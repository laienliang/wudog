# 人工智能工程实践 — 课程设计大作业报告

## 乌东文旅"衣食住行"综合服务平台

| 项目 | 内容 |
|------|------|
| 项目名称 | 乌东文旅"衣食住行"综合服务平台 |
| 开发周期 | 2026年6月 |
| 技术栈 | Midway.js + React + Ant Design + 微信小程序 |
| 开发工具 | Claude AI (Superpowers 工作流) |
| 代码仓库 | Gitee: hong-dailing/wudong-platform |

---

## 目录

1. [项目概述](#1-项目概述)
2. [需求分析](#2-需求分析)
3. [系统架构设计](#3-系统架构设计)
4. [模块详细设计](#4-模块详细设计)
5. [数据库设计](#5-数据库设计)
6. [前端实现](#6-前端实现)
7. [AI 辅助开发实践](#7-ai-辅助开发实践)
8. [遇到的问题与解决方案](#8-遇到的问题与解决方案)
9. [项目总结](#9-项目总结)

---

## 1. 项目概述

### 1.1 项目背景

乌东村位于贵州黔东南苗族侗族自治州雷山县，是典型的特色苗寨，拥有丰富的苗族非遗文化旅游资源（苗绣、蜡染、银饰、吊脚楼、苗族歌舞、节庆文化等）。原有运营以线下为主，缺乏统一的线上服务入口。

本项目以"衣、食、住、行"为业务主线，构建一站式数字化综合服务平台，帮助游客完成从种草、浏览到预订/购买、分享、社区互动的全链路体验，同时为商家和平台运营方提供管理后台。

### 1.2 项目目标

| 维度 | 目标 |
|------|------|
| 业务目标 | 建成乌东一站式数字化旅游服务平台，覆盖衣食住行全链路 |
| 技术目标 | Midway.js + React 全栈架构，6 大模块并行开发 |
| 教学目标 | 掌握 AI 全栈开发流程，具备独立完成商业项目的能力 |

### 1.3 三端覆盖

| 端 | 主要用户 | 技术选型 |
|----|----------|----------|
| 微信小程序端 | 游客（C 端消费者） | 微信原生小程序框架 |
| PC 网页端 | 游客、商家 | React 18 + Ant Design 5.x |
| 管理后台（Web） | 商家、平台运营人员 | React 18 + Ant Design Pro + ECharts |

---

## 2. 需求分析

### 2.1 用户角色

| 角色 | 描述 | 权限范围 |
|------|------|---------|
| 游客 | 浏览、搜索、下单、预订、发布游记 | 全部前台功能 |
| 商家 | 管理商品/房源/餐位/线路 | 后台商家端 |
| 平台管理员 | 平台运营管理 | 全部后台功能 |

### 2.2 六大模块划分

| 模块 | 业务定位 | 核心功能 |
|:----:|----------|----------|
| 衣 | 苗绣、蜡染、银饰等手工艺品电商 | 商品展示、购物车、下单、评价 |
| 食 | 特色餐饮、餐位预订、农产品购买 | 餐厅展示、餐位预订、农产品购买 |
| 住 | 苗寨特色民宿在线预订 | 民宿搜索、房型选择、房态日历 |
| 行 | 景区门票、苗寨游路线套餐 | 门票购买、路线预订、电子票核销 |
| 社区 | 游客 UGC 内容社区 | 游记发布、点赞评论、话题互动 |
| 管理后台 | 平台全局管理 | 用户/商家/订单/财务/运营管理 |

### 2.3 公共服务

| 服务 | 说明 |
|------|------|
| 用户注册/登录 | 手机号+密码登录，JWT Token 鉴权 |
| 统一购物车 | 跨模块加购、合并结算 |
| 统一订单 | 统一订单状态机（待支付→已支付→已确认→已完成→已退款） |
| 图片上传 | OSS 预签名 URL 直传（预留） |

---

## 3. 系统架构设计

### 3.1 整体技术架构

```
┌─────────────────────────────────────────────────┐
│                  客户端层                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ 微信小程序 │  │ PC 网页端│  │  管理后台    │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└──────────────────┬──────────────────────────────┘
                   │ HTTP / WebSocket
┌──────────────────▼──────────────────────────────┐
│                API 网关层                        │
│        Midway.js (端口 7001)                     │
│    认证中间件 / 响应拦截器 / 统一异常处理         │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│               业务服务层                          │
│  ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌────┐│
│  │  衣  ││  食  ││  住  ││  行  ││ 社区 ││后台││
│  └──────┘└──────┘└──────┘└──────┘└──────┘└────┘│
│  ┌──────┐┌──────┐┌──────┐┌──────┐              │
│  │ 订单  ││ 支付  ││ 购物车││ 认证  │              │
│  └──────┘└──────┘└──────┘└──────┘              │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│               数据存储层                          │
│  ┌────────────────┐  ┌────────────────┐         │
│  │   MySQL 8.0    │  │    Redis       │         │
│  │  (51张业务表)   │  │  (Token黑名单)  │         │
│  └────────────────┘  └────────────────┘         │
└─────────────────────────────────────────────────┘
```

### 3.2 技术栈详情

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 后端框架 | Midway.js | v3.x | 基于 TypeScript 的 Node.js IOC 框架 |
| ORM | TypeORM | 0.3.x | 参数化查询，防止 SQL 注入 |
| 数据库 | MySQL | 8.0.44 | 关系型数据库 |
| 缓存 | Redis | 3.0.504 | Token 黑名单管理 |
| PC 前端 | React | 18.x | Hooks + Function Component |
| UI 框架 | Ant Design | 5.x | 企业级 UI 组件库 |
| 管理后台 | Ant Design Pro | — | ProLayout + ProTable + ECharts |
| 小程序 | 微信原生框架 | 8.0+ | 移动端入口 |
| 认证 | JWT | RS256 | Access Token 7天 + Refresh Token 30天 |
| 密码 | bcrypt | cost=12 | 密码哈希存储 |
| 包管理 | pnpm | 9.x | Monorepo 管理 |

### 3.3 目录结构（Monorepo）

```
wudong-platform/
├── packages/
│   ├── server/          # 后端服务（Midway.js）
│   │   └── src/
│   │       ├── modules/ # 业务模块
│   │       │   ├── clothing/
│   │       │   ├── food/
│   │       │   ├── accommodation/
│   │       │   ├── travel/
│   │       │   ├── community/
│   │       │   ├── admin/
│   │       │   ├── auth/
│   │       │   └── order/
│   │       ├── common/  # 公共中间件/过滤器/实体
│   │       └── config/  # 配置文件
│   ├── web-pc/          # PC 网页端（React）
│   ├── web-admin/       # 管理后台（React）
│   └── mini-program/    # 微信小程序
├── shared/              # 共享类型定义
└── docs/                # 项目文档
```

---

## 4. 模块详细设计

### 4.1 模块一：衣·非遗商品

**数据表：** `wd_clothing_product`, `wd_clothing_sku`, `wd_clothing_category`, `wd_clothing_review`, `wd_clothing_product_image`

**API 端点（8个）：**
- `GET /products` — 商品列表（分页+分类+搜索+排序）
- `GET /products/:id` — 商品详情
- `POST /products` — 新增商品
- `PUT /products/:id` — 更新商品
- `DELETE /products/:id` — 删除商品（软删除）
- `GET /products/categories` — 分类列表
- `GET /products/:id/skus` — SKU 列表
- `GET /products/:id/reviews` — 商品评价

**前端页面：**
- PC 端：商品列表、商品详情、购物车、收藏夹、评价中心
- 小程序：商品列表、商品详情、购物车
- 管理后台：商品管理、分类管理、订单管理、评价管理、库存管理、数据统计

### 4.2 模块二：食·餐饮美食

**数据表：** `wd_food_restaurant`, `wd_food_dish`, `wd_food_meal_slot`, `wd_food_product`, `wd_food_category`

**API 端点：**
- `GET /restaurants` — 餐厅列表
- `GET /restaurants/:id` — 餐厅详情
- `POST /restaurants/booking` — 餐位预订
- `GET /food-products` — 农产品列表
- `GET /dishes` — 菜品列表

### 4.3 模块三：住·住宿预订

**数据表：** `wd_accommodation_homestay`, `wd_accommodation_room_type`, `wd_accommodation_calendar`

**API 端点：**
- `GET /homestays` — 民宿列表
- `GET /homestays/:id` — 民宿详情（含房型）
- `GET /room-types/:id/calendar?month=` — 房态日历
- `POST /calendar/batch` — 批量设置日历价格/库存

**特色功能：** 房态日历系统，支持每日价格/库存/状态（正常/满房/维护）管理

### 4.4 模块四：行·线路订票

**数据表：** `wd_travel_scenic_spot`, `wd_travel_ticket_type`, `wd_travel_route`, `wd_travel_e_ticket`

**API 端点：**
- `GET /scenic-spots` — 景区列表
- `GET /routes` — 路线套餐列表
- `POST /e-tickets/verify` — 电子票核销

**特色功能：** 电子票核销系统，支持二维码验证

### 4.5 模块五：社区·照片分享

**数据表：** `wd_community_travelogue`, `wd_community_comment`, `wd_community_like`, `wd_community_topic`, `wd_community_follow`, `wd_community_favorite`, `wd_community_report`

**API 端点：**
- `GET /travelogues` — 游记列表
- `POST /travelogues` — 发布游记
- `POST /likes` — 点赞/取消点赞
- `POST /comments` — 发表评论
- `POST /favorites` — 收藏/取消收藏
- `POST /reports` — 举报内容

**特色功能：** 完整的 UGC 社区生态：游记+评论+点赞+关注+收藏+举报+话题

### 4.6 模块六：平台管理后台

**数据表（12张）：** `wd_admin`, `wd_admin_role`, `wd_admin_merchant`, `wd_admin_banner`, `wd_admin_announcement`, `wd_admin_system_config`, `wd_admin_operation_log`, `wd_admin_sensitive_word` 等

**功能模块：**

| 功能 | 说明 |
|------|------|
| 数据看板 | ECharts 可视化：DAU/GMV/订单趋势/用户分层/商家排行 |
| 用户管理 | 游客列表、封禁/解封、查看详情、编辑资料 |
| 商家管理 | 商家列表、入驻审核、状态修改、强制下线 |
| 角色权限 | RBAC 角色增删改、权限分配 |
| 首页运营 | 轮播图、公告、推荐位、活动横幅管理 |
| 消息中心 | 系统消息发送、消息模板管理 |
| 财务结算 | 结算记录列表（按模块抽佣比例计算） |
| 全局订单 | 全模块订单查询、异常订单、退款审批 |
| 系统设置 | 抽佣比例、运费模板、支付/短信配置、敏感词库 |
| 商家后台 | 商家登录、工作台、店铺设置、消息通知、账号设置 |

---

## 5. 数据库设计

### 5.1 设计规范

| 规范项 | 要求 |
|--------|------|
| 数据库名 | `wudong_platform` |
| 表名前缀 | `wd_{模块缩写}_`（如 `wd_clothing_product`） |
| 字符集 | `utf8mb4`（支持 emoji） |
| 引擎 | `InnoDB`（支持事务） |
| 主键 | `id BIGINT UNSIGNED AUTO_INCREMENT` |
| 必备字段 | `id`, `created_at`, `updated_at`, `deleted_at`（软删除） |

### 5.2 核心数据表（共51张）

| 模块 | 表名 | 说明 |
|:----:|------|------|
| 公共 | `wd_user` | 用户表 |
| 公共 | `wd_order` | 订单表 |
| 公共 | `wd_order_item` | 订单项表 |
| 公共 | `wd_cart_item` | 购物车表 |
| 衣 | `wd_clothing_product` | 商品主表 |
| 衣 | `wd_clothing_sku` | SKU 规格表 |
| 衣 | `wd_clothing_category` | 分类表 |
| 衣 | `wd_clothing_review` | 评价表 |
| 食 | `wd_food_restaurant` | 餐厅表 |
| 食 | `wd_food_dish` | 菜品表 |
| 食 | `wd_food_product` | 农产品表 |
| 食 | `wd_food_meal_slot` | 餐位时段表 |
| 住 | `wd_accommodation_homestay` | 民宿表 |
| 住 | `wd_accommodation_room_type` | 房型表 |
| 住 | `wd_accommodation_calendar` | 房态日历表 |
| 行 | `wd_travel_scenic_spot` | 景区表 |
| 行 | `wd_travel_ticket_type` | 票种表 |
| 行 | `wd_travel_route` | 路线表 |
| 行 | `wd_travel_e_ticket` | 电子票表 |
| 社区 | `wd_community_travelogue` | 游记表 |
| 社区 | `wd_community_comment` | 评论表 |
| 社区 | `wd_community_like` | 点赞表 |
| 社区 | `wd_community_topic` | 话题表 |
| 管理 | `wd_admin` | 管理员表 |
| 管理 | `wd_admin_role` | 角色表 |
| 管理 | `wd_admin_merchant` | 商家表 |
| 管理 | `wd_admin_banner` | 轮播图表 |
| 管理 | `wd_admin_system_config` | 系统配置表 |

---

## 6. 前端实现

### 6.1 PC 网页端

| 页面 | 路由 | 功能 |
|:----|:----|------|
| 首页 | `/` | Hero Banner、服务入口、推荐商品、民宿/景区、游记 |
| 商品列表 | `/clothing` | 分类、排序、搜索、分页 |
| 商品详情 | `/clothing/:id` | SKU、加购、收藏、评价 |
| 餐厅列表 | `/food` | Tab 切换景区/路线 |
| 民宿列表 | `/accommodation` | 搜索、排序、卡片网格 |
| 社区 | `/community` | 瀑布流游记、话题 |
| 购物车 | `/cart` | 增删改、合计、结算 |
| 订单 | `/orders` | 订单列表、状态筛选 |

### 6.2 管理后台

| 页面 | 功能 |
|:----|------|
| 数据看板 | ECharts 图表 + 统计卡片 + 最近订单 |
| 用户管理 | 游客列表、封禁、详情、编辑 |
| 商家管理 | 商家列表、入驻审核、强制下线 |
| 商品管理 | ProTable CRUD、搜索筛选、批量操作 |
| 订单管理 | 跨模块订单查询、异常订单处理 |
| 首页运营 | 轮播图、公告、推荐位 CRUD |
| 系统设置 | 抽佣配置、敏感词库、操作日志 |

### 6.3 视觉设计规范

| 规范项 | 值 |
|--------|-----|
| 品牌主色 | `#1F5FA8` 苗银蓝 |
| 辅色 | `#6B8E3D` 苗绣绿、`#E8A838` 蜡染黄、`#D94A4A` 银饰红 |
| 价格色 | `#E85D2F` 苗绣橙 |
| 卡片圆角 | 10px |
| 卡片阴影 | `0 1px 4px rgba(0,0,0,0.06)` |
| 最大宽度 | 1200px 居中 |
| 字体 | `-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei` |

---

## 7. AI 辅助开发实践

### 7.1 开发流程（Superpowers 工作流）

本项目采用了结构化的 AI 辅助开发流程：

```
① 需求分析
   └── 阅读需求规格说明书 → 理解模块边界

② /superpowers:brainstorming
   └── 需求澄清 → 确定技术方案 → 确认设计

③ /superpowers:writing-plans
   └── 拆解任务 → 编写实施计划（含完整代码示例）

④ Subagent-Driven Development
   ├── Task 1: 后端实体创建
   ├── Task 2: Service/Controller 实现
   ├── Task 3: 管理后台页面
   ├── Task 4~N: 逐步迭代
   └── 每 Task 经过 Review 循环

⑤ /superpowers:requesting-code-review
   └── 最终代码审查 → 修复问题 → 合并
```

### 7.2 AI 辅助数据统计

| 维度 | 数据 |
|:----|:----:|
| 总代码行数 | ~18000+ 行 |
| 后端文件数 | 100+ 个 |
| 前端页面数 | 50+ 个 |
| Git 提交次数 | 110+ 次 |
| 分支数 | 1（module/admin-platform） |
| 数据库表数 | 51 张 |
| 开发周期 | 约 3 周 |

### 7.3 AI 辅助的优势

1. **代码质量一致性**：所有模块遵循相同的代码模板，实体→Service→Controller 分层清晰
2. **快速原型开发**：从需求到可运行代码的时间大幅缩短
3. **多端同步**：后端API → PC端 → 管理后台 → 小程序，四端同步开发
4. **代码审查自动化**：每个 Task 都有自动化的 Spec 审查 + 代码质量审查

---

## 8. 遇到的问题与解决方案

| # | 问题 | 原因 | 解决方案 |
|:-:|------|------|---------|
| 1 | 分类名称乱码 | MySQL 客户端 GBK 编码 | 设置 `--default-character-set=utf8mb4` 重新插入 |
| 2 | 商品详情 500 | 加载不存在的关联关系 | 删除 TypeORM relations 配置 |
| 3 | 管理后台菜单不显示 | ProLayout 版本兼容 | 改用 `menuDataRender` 属性 |
| 4 | 小程序网络错误 | localhost 解析 | 改用 `127.0.0.1` |
| 5 | TypeORM 同步改表结构 | synchronize:true 导致数据丢失 | 手动建表，关闭 synchronize |
| 6 | JSON 字段解析失败 | `cuisineTags` 存为字符串 | 加 `Array.isArray` + `try JSON.parse` 防御 |
| 7 | 全站 .map() 报错 | 数组字段实际是 JSON 字符串 | 统一加类型检查 + 防御性解析 |
| 8 | 财务数据不准 | 统计口径不一致 | 统一按模块抽佣比例计算 |
| 9 | 看板 Mock 数据 | 开发时未接真实 API | 全部替换为 SQL 实时查询 |
| 10 | 三端数据不通 | 各端独立开发 | 统一后端 API + 数据库，确保数据连通 |

---

## 9. 项目总结

### 9.1 完成情况

| 模块 | 后端 API | PC 端 | 管理后台 | 小程序 |
|:----:|:--------:|:-----:|:--------:|:------:|
| 衣·商品 | ✅ | ✅ | ✅ | ✅ |
| 食·餐饮 | ✅ | ✅ | ✅ | ✅ |
| 住·住宿 | ✅ | ✅ | ✅ | ✅ |
| 行·线路 | ✅ | ✅ | ✅ | ✅ |
| 社区 | ✅ | ✅ | ✅ | ✅ |
| 管理后台 | ✅ | — | ✅ | — |

### 9.2 技术亮点

1. **全栈 Monorepo 架构**：6 大模块共享同一后端，公共服���复用，代码组织清晰
2. **Superpowers AI 工作流**：从计划→开发→审查全流程 AI 驱动，显著提升效率
3. **房态日历系统**：住宿模块的日历管理支持批量价格/库存设置
4. **电子票核销**：出行模块支持电子票生成与二维码核销
5. **RBAC 权限模型**：管理后台支持角色-权限分配
6. **ECharts 数据看板**：23 个指标实时展示，支持 CSV 导出
7. **三端数据打通**：PC 端、小程序、管理后台共享同一数据库，数据实时同步

### 9.3 可优化方向

- 微信支付对接（需商户号资质）
- 图片/视频上传（需 OSS 配置）
- 消息通知系统（微信模板消息）
- 搜索引擎（MySQL LIKE → Elasticsearch）
- 自动化测试覆盖（目前缺失单元测试）
- Docker 容器化部署
- CI/CD 流水线

### 9.4 心得体会

通过本项目，实践了从需求分析→系统设计→编码实现→测试部署的完整软件开发生命周期。在 AI 辅助下，一个 6 人小组规模的 full-stack 项目可以在 3 周内完成核心功能开发，体现了 AI 辅助编程在快速原型和全栈开发中的巨大潜力。同时，也认识到了代码质量保证、数据一致性、安全性等方面的重要性。

---

*报告生成日期：2026-06-27*
*版本：V1.0*
*代码仓库：https://gitee.com/hong-dailing/wudong-platform*
