# 乌东文旅"衣食住行"综合服务平台 — CLAUDE.md

> 本文档由技术架构师基于《乌东文旅_衣食住行_需求规格说明书_完整版.docx》生成，作为 AI 辅助开发的核心上下文文件。

---

## 一、项目背景

### 1.1 项目概述

乌东村位于贵州黔东南苗族侗族自治州，是典型的特色苗寨，拥有丰富的民族文化旅游资源（苗绣、蜡染、吊脚楼、苗族歌舞、节庆文化等）。本项目以 **"衣食住行"为业务主线**，构建一站式数字化综合服务平台，帮助游客完成从种草、浏览到预订/购买、分享、社区互动的全链路体验，同时为商家和平台运营方提供管理后台。

- **项目名称**：乌东文旅"衣食住行"综合服务平台
- **文档版本**：V1.0（2026-06-09）
- **实施方式**：6 个学生小组并行开发，6 大模块边界清晰、功能独立、关注点分离
- **用户体系**：6 大模块共用同一用户体系（统一注册/登录/个人中心/购物车/订单）
- **三端覆盖**：微信小程序端、PC 网页端、管理后台（Web）

### 1.2 项目目标

| 维度 | 目标 | 量化指标 |
|------|------|----------|
| 业务目标 | 建成乌东一站式数字化旅游服务平台，覆盖衣食住行全链路 | 6 大业务模块全部上线，新用户 500+，GMV 月环比增长 20%+ |
| 用户目标 | 游客浏览 10 秒内完成种草到支付全路径 | 关键转化路径 ≤ 4 步，支付成功率 ≥ 95%，用户评分 4.5+ |
| 架构目标 | Midway + React 全栈架构，6 组并行开发，3 个月交付 | API P95 ≤ 500ms，页面加载 ≤ 2s，测试覆盖率 ≥ 70% |
| 教学目标 | 学生掌握 AI 全栈开发流程，具备独立完成商业项目的能力 | 每位学生独立完成所分配模块的完整开发与部署 |

### 1.3 参考资料

| # | 文档/资源 | 说明 |
|---|-----------|------|
| [1] | 乌东 OPC 文旅融合知识库体系_建设说明.docx | 项目顶层设计规范，含 8 个 OPC 业态、10 个知识域 |
| [2] | [Midway.js 官方文档 v3.x](https://midwayjs.org) | 后端框架技术参考 |
| [3] | [React 官方文档 v18.x](https://react.dev) | 前端框架技术参考 |
| [4] | 微信小程序开发文档 | 小程序端开发规范 |
| [5] | [Ant Design 5.x 组件库文档](https://ant.design) | PC 端和管理后台 UI 组件规范 |
| [6] | OpenClaw AI Agent 平台文档 | AI 辅助协作开发参考 |
| [7] | [OWASP Top 10（2024 版）](https://owasp.org/Top10/) | 安全防护规范参考 |

---

## 二、六大模块与三端功能定义

### 2.1 模块划分

6 大模块由 6 个学生开发组**并行开发**，边界清晰，关注点分离：

| 组 | 模块 | 业务定位 | 数据核心 |
|----|------|----------|----------|
| 1 | **衣·民族特色商品** | 苗绣、蜡染、银饰、民族服饰等手工艺品的电商交易 | 商品表、SKU 表、订单表、评论表 |
| 2 | **食·餐饮美食** | 特色餐饮展示、餐位预订、农产品/土特产线上购买 | 餐厅表、餐位时段表、农产品表、订单表 |
| 3 | **住·住宿预订** | 苗寨特色民宿/客栈在线预订（含房态日历） | 民宿表、房型表、房态日历表、订单表 |
| 4 | **行·线路订票** | 景区门票购买、苗寨游路线套餐、电子票核销 | 景区表、票种表、路线表、电子票表、订单表 |
| 5 | **社区·照片分享** | 游客 UGC 内容（游记、照片、短视频）社区 | 游记表、评论表、话题表、点赞/关注/收藏表 |
| 6 | **平台管理后台** | 全局用户/商家/订单/财务/运营管理 + 公共后台框架 | 管理员表、角色表、商家表、财务表、日志表 |

### 2.2 三端定位

| 端 | 主要用户 | 核心定位 | 技术选型 |
|----|----------|----------|----------|
| **微信小程序** | 游客（C 端消费者） | 移动端首要入口，扫码即用，轻量快捷 | 微信原生小程序框架 |
| **PC 网页端** | 游客、商家 | 大屏沉浸式浏览，详情展示丰富 | React 18 + Ant Design 5.x |
| **管理后台（Web）** | 商家、平台运营人员 | 后台管理、经营分析、运营配置 | React 18 + Ant Design 5.x + ECharts |

### 2.3 公共服务（跨模块共享）

| 服务 | 调用方 | 说明 |
|------|--------|------|
| 用户注册/登录 | 全部模块 | 微信一键登录 + 手机号注册 + 账号密码登录；JWT Token |
| 统一购物车 | 模块 1、2（特产） | 跨模块加购、合并结算 |
| 统一订单 | 全部下单模块 | 统一订单状态机（待支付→已支付→已确认→已完成→已退款） |
| 统一支付 | 全部下单模块 | 微信支付（小程序 JSAPI / PC Native 扫码） |
| 图片/视频上传 | 全部模块 | OSS 预签名 URL → 客户端直传 OSS → 服务端回调校验 |
| 消息通知 | 全部模块 | 微信订阅消息 + 站内信 |
| 统一搜索 | 全部模块 | MVP 阶段 MySQL LIKE，后续迁移至 Elasticsearch |

---

## 三、技术栈约束

### 3.1 强制技术栈

| 层级 | 技术 | 版本约束 | 说明 |
|------|------|----------|------|
| **后端框架** | Midway.js | v3.x | 基于 TypeScript 的 Node.js IOC 框架，6 组共享同一项目规范 |
| **前端框架** | React | v18.x | Hooks + Function Component 范式 |
| **前端 UI** | Ant Design | 5.x | PC 端和管理后台统一 UI |
| **小程序** | 微信原生框架 | 微信 8.0+ | 移动端入口 |
| **数据库** | MySQL | 8.0+ | 关系型数据库 |
| **ORM** | TypeORM | 配合 Midway.js | 参数化查询，禁止拼接 SQL |
| **认证** | JWT | RS256 签名 | 7 天过期 + 30 天刷新 Token |
| **密码** | bcrypt | cost=12 | 密码哈希存储 |
| **文件存储** | OSS | 阿里云 OSS 或兼容 S3 | 预签名 URL 直传 |

### 3.2 推荐工具链

| 类别 | 推荐工具 |
|------|----------|
| API 文档 | Swagger / OpenAPI 或 Apifox |
| 代码规范 | ESLint + Prettier（无 Error 级别警告） |
| 包管理 | pnpm（推荐）或 npm |
| 状态管理 | React Context + useReducer（轻量）/ Zustand（复杂场景） |
| 路由 | React Router v6 |
| 样式方案 | CSS Modules + Ant Design 主题定制 |
| 图表 | ECharts（管理后台数据看板） |
| 测试 | Jest + React Testing Library（前端）/ Midway Test（后端） |
| 埋点 | 前端自定义埋点上报 |
| 数据看板原型 | Streamlit（数据分析报告） |

### 3.3 兼容性要求

| 端 | 兼容范围 |
|----|----------|
| 小程序 | 微信 8.0+ |
| PC 端 | Chrome 90+、Edge 90+、Safari 14+ |
| 管理后台 | Chrome 90+、Edge 90+ |
| 屏幕适配 | 移动端 375px–414px；PC 端 1280px+ |

### 3.4 国际化预留

- MVP 阶段仅支持简体中文（zh-CN），硬编码字符串
- 预留 react-i18next 迁移路径，所有中文文案统一管理
- 时间统一 UTC+8（北京时间），数据库存储 UTC 时间戳
- 货币使用人民币（CNY/¥）

---

## 四、目录结构规划

### 4.1 整体仓库结构（建议 Monorepo）

```
wudong-platform/
├── packages/
│   ├── server/                    # 后端服务（Midway.js）
│   │   ├── src/
│   │   │   ├── common/            # 公共模块（跨组共享）
│   │   │   │   ├── decorator/     # 自定义装饰器
│   │   │   │   ├── filter/        # 异常过滤器
│   │   │   │   ├── middleware/    # 中间件（鉴权/限流/日志）
│   │   │   │   ├── dto/           # 通用数据传输对象
│   │   │   │   ├── utils/         # 工具函数
│   │   │   │   └── constant/      # 常量定义（状态码、枚举）
│   │   │   ├── modules/          # 按业务模块划分
│   │   │   │   ├── clothing/      # 衣·商品模块
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── service/
│   │   │   │   │   ├── entity/    # TypeORM 实体
│   │   │   │   │   ├── dto/
│   │   │   │   │   └── test/
│   │   │   │   ├── food/          # 食·餐饮模块
│   │   │   │   ├── accommodation/ # 住·住宿模块
│   │   │   │   ├── travel/        # 行·线路模块
│   │   │   │   ├── community/     # 社区·分享模块
│   │   │   │   └── admin/         # 管理后台模块
│   │   │   ├── shared/           # 公共服务
│   │   │   │   ├── auth/          # 认证服务（登录/注册/Token）
│   │   │   │   ├── order/         # 订单服务
│   │   │   │   ├── payment/       # 支付服务
│   │   │   │   ├── cart/          # 购物车服务
│   │   │   │   ├── upload/        # 文件上传服务
│   │   │   │   ├── notification/  # 消息通知服务
│   │   │   │   └── search/        # 搜索服务
│   │   │   └── config/            # 配置
│   │   ├── test/                  # 集成测试
│   │   ├── migration/             # 数据库迁移文件
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web-pc/                    # PC 网页端（React）
│   │   ├── src/
│   │   │   ├── components/        # 公共组件
│   │   │   ├── pages/             # 按模块划分页面
│   │   │   │   ├── home/
│   │   │   │   ├── clothing/
│   │   │   │   ├── food/
│   │   │   │   ├── accommodation/
│   │   │   │   ├── travel/
│   │   │   │   ├── community/
│   │   │   │   └── user/
│   │   │   ├── hooks/
│   │   │   ├── services/          # API 请求封装
│   │   │   ├── store/             # 状态管理
│   │   │   ├── utils/
│   │   │   └── config/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── web-admin/                 # 管理后台（React）
│   │   ├── src/
│   │   │   ├── components/        # 公共后台组件
│   │   │   ├── layouts/           # 后台布局框架（由组6提供）
│   │   │   ├── pages/
│   │   │   │   ├── user/          # 用户管理
│   │   │   │   ├── merchant/      # 商家管理
│   │   │   │   ├── order/         # 全局订单
│   │   │   │   ├── finance/       # 财务结算
│   │   │   │   ├── content/       # 内容审核
│   │   │   │   ├── operation/     # 首页运营
│   │   │   │   ├── system/        # 系统设置
│   │   │   │   ├── dashboard/     # 数据看板
│   │   │   │   └── modules/       # 各业务模块嵌入页面
│   │   │   │       ├── clothing/  # 组1：商品管理（商家后台子页）
│   │   │   │       ├── food/      # 组2：餐饮管理
│   │   │   │       ├── accommodation/ # 组3：住宿管理
│   │   │   │       └── travel/    # 组4：线路管理
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── config/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── mini-program/              # 微信小程序端
│       ├── pages/
│       ├── components/
│       ├── services/
│       ├── utils/
│       ├── app.json
│       └── project.config.json
│
├── docs/                          # 项目文档
│   ├── api/                       # API 接口文档
│   ├── database/                  # 数据库设计文档（ER图）
│   └── specs/                     # 需求规格说明
│
├── shared/                        # 跨包共享类型定义
│   └── types/                     # TypeScript 类型定义
│       ├── api.ts                 # API 统一返回类型
│       ├── order.ts               # 订单相关类型
│       ├── user.ts                # 用户相关类型
│       └── ...
│
├── .github/
│   └── workflows/                 # CI 配置
├── package.json                   # 根 Monorepo 配置
├── pnpm-workspace.yaml
└── README.md
```

### 4.2 模块后端目录约定（每个模块内部）

```
src/modules/{moduleName}/
├── controller/        # 路由控制器
│   └── {entity}.controller.ts
├── service/           # 业务逻辑层
│   └── {entity}.service.ts
├── entity/            # TypeORM 实体定义
│   └── {entity}.entity.ts
├── dto/               # 请求/响应 DTO（含 class-validator 校验规则）
│   ├── create-{entity}.dto.ts
│   └── update-{entity}.dto.ts
├── interface/         # 接口类型定义
│   └── {entity}.interface.ts
└── test/              # 单元测试
    └── {service}.test.ts
```

---

## 五、数据库设计原则

### 5.1 通用规范

1. **命名规范**
   - 数据库名：`wudong_platform`
   - 表名：`wd_{模块缩写}_{业务表名}`（小写蛇形，如 `wd_clothing_product`）
   - 字段名：小写蛇形（如 `product_name`、`created_at`）
   - 主键统一用 `id`（BIGINT UNSIGNED AUTO_INCREMENT）
   - 外键字段格式：`{关联表名}_{id}`（如 `product_id`、`user_id`）

2. **必备字段**（每张表都必须包含）
   ```sql
   `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
   `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   `deleted_at`  DATETIME DEFAULT NULL,  -- 软删除
   PRIMARY KEY (`id`)
   ```

3. **编码与引擎**
   - 字符集：`utf8mb4`（支持 emoji 和生僻字）
   - 排序规则：`utf8mb4_unicode_ci`
   - 引擎：`InnoDB`（支持事务）

4. **索引原则**
   - 每个外键字段必须建索引
   - 频繁查询条件字段（状态、类型、时间）建索引
   - 组合索引遵循最左前缀原则
   - 避免在长文本字段上建索引，改用前缀索引或全文索引

### 5.2 数据隔离原则

- **私有表归各模块独占**：每个业务模块只能操作自己模块的数据表（严格代码审查）
- **公共表由公共服务管理**：用户、购物车、订单、支付等公共数据通过约定接口访问
- **模块间不直接读写对方私有表**：如需跨模块查询，通过 API 调用或事件通知完成
- 模块 6（管理后台）对全平台数据有**只读查询**权限 + 特定管控操作权限

### 5.3 软删除与审计

- 所有业务数据采用**软删除**（`deleted_at` 字段）
- 敏感操作（审核、封号、退款等）记录**操作日志**（`wd_admin_audit_log`），不可删除
- 订单状态变更记录**状态快照**（便于追踪和财务对账）

---

## 六、API 接口规范

### 6.1 通用规范

- **协议**：HTTPS（TLS 1.3），敏感参数仅通过 POST body 传递
- **基础路径**：`/api/v1`
- **请求方法**：GET（查询）、POST（创建）、PUT（全量更新）、PATCH（部分更新）、DELETE（删除）
- **请求体**：`Content-Type: application/json`
- **响应体**：统一 JSON 格式（见下文）
- **认证**：`Authorization: Bearer <token>`（JWT Token）

### 6.2 统一返回格式

```typescript
// 成功响应
interface ApiSuccessResponse<T = any> {
  code: number;       // 业务状态码（200 表示成功）
  message: string;    // 提示信息
  data: T;            // 响应数据（泛型）
  timestamp: number;  // 服务端时间戳（毫秒）
  requestId: string;  // 请求追踪 ID（用于排查问题）
}

// 分页响应
interface PaginatedResponse<T> {
  code: number;
  message: string;
  data: {
    list: T[];              // 数据列表
    pagination: {
      page: number;         // 当前页码
      pageSize: number;     // 每页条数
      total: number;        // 总记录数
      totalPages: number;   // 总页数
    };
  };
  timestamp: number;
  requestId: string;
}

// 错误响应
interface ApiErrorResponse {
  code: number;       // 业务错误码（非 200）
  message: string;    // 错误提示（面向用户友好文案）
  data: null;
  errors?: Array<{    // 字段级错误详情（可选）
    field: string;
    message: string;
  }>;
  timestamp: number;
  requestId: string;
}
```

### 6.3 业务状态码定义

| code | 含义 | 说明 |
|------|------|------|
| 200 | 成功 | 请求正常处理完成 |
| 400 | 请求参数错误 | 参数校验不通过，参考 `errors` 字段 |
| 401 | 未认证 | Token 缺失或已过期 |
| 403 | 无权限 | 已认证但无操作权限（角色/资源级） |
| 404 | 资源不存在 | 请求的资源未找到 |
| 409 | 资源冲突 | 重复提交、库存不足等业务冲突 |
| 422 | 业务校验失败 | 业务规则校验不通过（如：预订时间不可早于今日） |
| 429 | 请求过于频繁 | 触发限流 |
| 500 | 服务器内部错误 | 未预期的错误（不暴露技术细节给客户端） |

### 6.4 URL 路由命名规范

```
# RESTful 资源路由
GET    /api/v1/products                  # 查询商品列表（分页）
POST   /api/v1/products                  # 创建商品
GET    /api/v1/products/:id              # 查询商品详情
PUT    /api/v1/products/:id              # 全量更新商品
PATCH  /api/v1/products/:id              # 部分更新商品
DELETE /api/v1/products/:id              # 删除商品（软删除）

# 子资源路由
GET    /api/v1/products/:id/reviews      # 查询商品评论
POST   /api/v1/products/:id/reviews      # 创建商品评论

# 业务操作路由（用动词表示非 CRUD 操作）
POST   /api/v1/orders/:id/cancel         # 取消订单
POST   /api/v1/orders/:id/pay            # 支付订单
POST   /api/v1/orders/:id/confirm        # 确认收货

# 公共服务路由
POST   /api/v1/auth/login                # 登录
POST   /api/v1/auth/refresh              # 刷新 Token
GET    /api/v1/cart                       # 获取购物车
POST   /api/v1/upload/apply              # 申请上传凭证（OSS 预签名 URL）
```

### 6.5 Midway.js 控制器示例规范

```typescript
import { Controller, Get, Post, Body, Param, Query } from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';

@Controller('/api/v1/products')
export class ProductController {
  @Inject()
  productService: ProductService;

  @Get('/')
  async list(@Query() query: ProductListDTO): Promise<PaginatedResponse<ProductVO>> {
    const result = await this.productService.paginate(query);
    return this.ok(result);
  }

  @Get('/:id')
  async detail(@Param('id') id: number): Promise<ApiSuccessResponse<ProductVO>> {
    const product = await this.productService.getById(id);
    if (!product) throw new NotFoundError('商品不存在');
    return this.ok(product);
  }

  @Post('/')
  @Validate()
  async create(@Body() body: CreateProductDTO): Promise<ApiSuccessResponse<ProductVO>> {
    const product = await this.productService.create(body);
    return this.created(product);
  }
}
```

### 6.6 接口文档要求

- 必须使用 Swagger/OpenAPI 或 Apifox 生成接口文档
- 每个 API 需包含：请求示例（Request Example）和响应示例（Response Example）
- 参数必须有类型和校验规则说明（class-validator 装饰器）

---

## 七、开发注意事项

### 7.1 模块边界与协作约束

1. **公共服务优先调用**：模块 1-5 在开发 API 时应**优先调用公共服务接口**（用户、购物车、订单、支付、上传、搜索），不重复造轮子，不绕过公共服务直读数据库。
2. **数据隔离**：每个模块只操作自己模块的数据表，不直接读写其他模块的私有表。跨模块数据查询通过 API 调用或事件机制完成。
3. **商户后台嵌入**：模块 1-4 的业务管理页面（商品管理、订单管理、房源管理等）需要作为商家后台的子模块嵌入模块 6 的框架中。开发时需保持模块独立性，通过微前端或 iframe 嵌入方式集成。

### 7.2 鉴权与安全要点

1. **JWT 双 Token 机制**：Access Token（7 天） + Refresh Token（30 天），Redis 黑名单实现强制退出
2. **接口鉴权**：所有接口做权限校验；敏感接口限流（每分钟每 IP ≤ 10 次）
3. **支付安全**：支付金额必须在服务端计算，绝不信任客户端传入的金额；微信支付回调签名验证（HMAC）；防重放攻击（幂等 key）
4. **密码安全**：bcrypt 加密（cost=12），不存储明文
5. **防注入**：全部使用 TypeORM 参数化查询，禁止拼接 SQL
6. **XSS 防护**：前端对用户输入内容转义，富文本使用 DOMPurify 白名单过滤，配置 CSP Header
7. **数据隐私**：手机号、身份证号脱敏展示（中间 4 位替换为 `****`）

### 7.3 性能关注点

| 关注点 | 要求 |
|--------|------|
| 首页加载 | ≤ 2 秒（4G 网络） |
| API 响应 | P95 ≤ 500ms（正常负载） |
| 并发 | 支持 1000 并发用户 |
| 图片 | 缩略图 ≤ 200KB，原图懒加载 |
| 搜索 | ≤ 1 秒返回结果；MVP 阶段 MySQL LIKE，后续 ES |
| 操作反馈 | 按钮点击 150ms 内有响应（loading/结果），防止重复点击 |

### 7.4 Web 端（React）开发要点

1. **移动端优先（Mobile First）**：小程序端页面设计优先考虑移动端尺寸（375px–414px），PC 端在此基础上增强
2. **状态管理**：推荐 React Context + useReducer（轻量场景）或 Zustand（复杂跨组件场景）
3. **PC 端布局**：管理后台使用 Ant Design Pro Layout 或自建布局；PC 首页使用 1280px+ 宽屏设计（Banner 1920×600px）
4. **国际化预留**：尽管 MVP 阶段只用中文，但所有文案集中管理，方便后续迁移至 react-i18next

### 7.5 数据安全与合规

1. **UGC 审核**：游记发布后进入审核队列（通常 1 小时内），通过后公开展示
2. **敏感词过滤**：实时过滤（替换为 `***` 或拒绝提交），覆盖评论、游记、商品描述
3. **图片安全**：接入内容安全 API 自动鉴黄、暴恐检测
4. **视频安全**：上传后异步审核，前端展示审核状态
5. **举报机制**：用户可举报游记/评论；收到 ≥ 3 次举报自动隐藏并进入人工审核

### 7.6 交付物要求

每组必须提交：
1. **源代码** — Git 仓库（按模块分 branch），含完整提交历史
2. **数据库 Migration** — SQL 或 TypeORM Migration，可一键建表
3. **接口文档** — Swagger/OpenAPI 或 Apifox，含请求/响应示例
4. **测试报告** — 单元测试覆盖率 ≥ 70%（HTML 或 PDF）
5. **部署说明** — README.md（环境变量、启动命令、依赖服务）
6. **演示视频** — MP4，3–5 分钟核心功能流程
7. **项目总结报告** — Word/PDF，≥ 2000 字

### 7.7 集成验收关键场景

| 场景 | 标准 |
|------|------|
| 跨模块购物 | 同一用户在衣 + 食（特产）模块可加购至同一购物车，合并结算 |
| 统一订单 | 个人中心「我的订单」正确展示 4 类订单 |
| 支付全链路 | 加购 → 下单 → 微信支付 → 成功 → 状态变更 |
| 游记关联 | 社区游记可关联餐厅/民宿/景区，点击跳转 |
| 跨模块查询 | 管理员可查询任意模块的订单 |
| 消息通知 | 支付成功、商家确认、发货等关键节点通知正常 |
| 统一搜索 | 可搜索到商品、餐厅、民宿、路线、游记 |

### 7.8 团队协作规范

1. **Git 分支管理**：每组在独立 branch 上开发（如 `module/clothing`、`module/food`），main 分支用于集成
2. **API 协商**：跨模块调用的接口需与对接组协商，并由项目指导老师统一审批路由设计
3. **定期联调**：建议每两周进行一次跨模块联调，验证公共服务集成
4. **代码审查**：每个 PR 需经另一组成员 Review，通过 ESLint + Prettier 检查后方可合并
5. **变更管理**：如需调整模块边界或新增需求，需经指导老师审批并更新需求规格说明书

---

## 附录：订单状态机

```
                                  ┌─ 取消订单（15分钟未支付自动取消）
待支付 ──────────────────────────┼─ 用户主动取消
  │
  ├─ 支付成功 → 待确认 ──────────┼─ 商家确认 → 已确认
  │                             ├─ 24小时未确认自动确认
  │                             └─ 商家拒绝（退款）
  │
  ├─ 已确认 → 已使用/已完成 ─────┼─ 用户确认收货（7日自动确认）
  │                             ├─ 扫码核销（电子票）
  │                             └─ 入住完成（住宿）
  │
  ├─ 申请退款 ──────────────────┼─ 商家/管理员同意 → 原路退回
  │                             └─ 驳回 → 维持原状态
  │
  └─ 已完成 ──→ 评价（文字+图片+1-5星）
```

---

*本文档基于《乌东文旅_衣食住行_需求规格说明书_完整版.docx》（V1.0，2026-06-09）自动生成，随项目迭代持续更新。*
