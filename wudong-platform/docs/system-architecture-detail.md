# 系统设计与架构搭建

---

## 一、业务架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                          客户端层                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────┐  │
│  │  微信小程序端    │  │   PC 网页端      │  │   管理后台         │  │
│  │  (游客)          │  │  (游客 + 商家)    │  │  (商家 + 管理员)   │  │
│  │  port: 小程序    │  │  port: 3000      │  │  port: 3001       │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬───────────┘  │
└───────────┼────────────────────┼────────────────────┼──────────────┘
            │                    │                    │
            │    HTTP / JSON     │    HTTP / JSON     │  HTTP / JSON
            ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API 网关层                                   │
│                                                                     │
│              Midway.js 服务（port: 7001）                             │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  AuthMiddleware│  │ResponseInter │  │   DefaultErrorFilter    │  │
│  │  JWT验证+白名单│  │ ceptor统一   │  │   + BusinessErrorFilter │  │
│  │  Redis黑名单   │  │ 响应格式化   │  │   统一异常处理           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         业务服务层                                    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    6 大业务模块                               │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │  │
│  │  │ 衣模块 │ │ 食模块 │ │ 住模块 │ │ 行模块 │ │ 社区   │    │  │
│  │  │clothing│ │  food  │ │accommo-│ │ travel │ │community│    │  │
│  │  │        │ │        │ │dation  │ │        │ │        │    │  │
│  │  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘    │  │
│  └──────┼──────────┼──────────┼──────────┼──────────┼─────────┘  │
│         │          │          │          │          │            │
│  ┌──────┴──────────┴──────────┴──────────┴──────────┴─────────┐  │
│  │                    公共服务                                 │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │  │
│  │  │ 认证服务 │ │ 订单服务 │ │ 购物车   │ │  支付服务    │   │  │
│  │  │   auth   │ │  order   │ │   cart   │ │  (预留)      │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         数据存储层                                    │
│                                                                     │
│  ┌─────────────────────────────────────┐  ┌────────────────────┐   │
│  │          MySQL 8.0                  │  │      Redis         │   │
│  │          wudong_platform            │  │                    │   │
│  │                                     │  │  • Token黑名单     │   │
│  │  公共: wd_user / wd_order / ...     │  │  • 缓存(预留)      │   │
│  │  衣:   wd_clothing_product / ...    │  │                    │   │
│  │  食:   wd_food_restaurant / ...     │  └────────────────────┘   │
│  │  住:   wd_accommodation_homestay    │                           │
│  │  行:   wd_travel_scenic_spot / ...  │                           │
│  │  社区: wd_community_travelogue/...  │                           │
│  │  管理: wd_admin / wd_admin_role/... │                           │
│  │         共 51 张表                   │                           │
│  └─────────────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

**架构说明：**

| 层级 | 职责 | 技术实现 |
|:----|:-----|:---------|
| **客户端层** | 三端独立部署，各端通过 HTTP/JSON 与后端通信 | 微信小程序、React SPA、Ant Design Pro |
| **API网关层** | 统一处理认证鉴权、请求参数校验、响应格式化、异常拦截 | Midway.js 中间件 + 过滤器 |
| **业务服务层** | 6大模块 + 4个公共服务，模块间通过API调用，不直读对方数据表 | Midway.js Controller + Service |
| **数据存储层** | 业务数据持久化 + 缓存 | MySQL 51张表 + Redis |

---

## 二、部署架构图

```
┌────────────────────────────────────────────────────────────────┐
│                        开发环境                                  │
│                                                                │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────────┐   │
│  │  微信小程序   │    │  Vite Dev   │    │   Vite Dev       │   │
│  │  开发工具    │    │  PC前端      │    │   管理后台       │   │
│  │  port: 自由  │    │  port: 3000  │    │   port: 3001     │   │
│  └──────┬──────┘    └──────┬──────┘    └───────┬──────────┘   │
│         │                  │                    │              │
│         │  直接请求        │  proxy /api →      │  proxy /api →│
│         │  127.0.0.1:7001  │  localhost:7001    │  localhost:7001
│         ▼                  ▼                    ▼              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Midway.js 后端服务                          │   │
│  │              port: 7001                                 │   │
│  │              hot reload: midway-bin dev                  │   │
│  └────────────────────┬────────────────────────────────────┘   │
│                       │                                        │
│                       ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           MySQL 8.0 (localhost:3306)                     │   │
│  │           Database: wudong_platform                      │   │
│  │           Charset: utf8mb4                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Redis 3.x (localhost:6379)                     │   │
│  │           Token 黑名单管理                               │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

                         Git 版本控制
                    ┌──────────────────┐
                    │  Gitee 代码仓库   │
                    │  hong-dailing/   │
                    │  wudong-platform │
                    │  分支: master    │
                    │  分支: module/   │
                    │  admin-platform  │
                    └──────────────────┘
```

**部署关键配置：**

```javascript
// Vite 代理配置（web-pc/vite.config.ts 和 web-admin/vite.config.ts）
proxy: {
  '/api': {
    target: 'http://localhost:7001',  // 后端地址
    changeOrigin: true,
  },
}

// 后端数据库配置（server/src/config/config.default.ts）
orm: {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '******',
  database: 'wudong_platform',
  charset: 'utf8mb4',
  synchronize: false,        // 手动建表，关闭自动同步
  entities: ['**/entity/*.entity.{ts,js}'],
}

// Redis 配置
redis: {
  client: {
    host: '127.0.0.1',
    port: 6379,
    db: 0,
  },
}
```

**前后端分离与缓存机制：**

| 机制 | 实现方式 |
|:----|:---------|
| **前后端分离** | 三端前端独立部署，通过 HTTP API 与后端通信，后端返回统一 JSON 格式数据 |
| **跨域解决** | Vite 开发服务器 proxy 代理转发 `/api` 请求到后端 7001 端口 |
| **缓存机制** | Redis 用于 Token 黑名单管理：管理员强制退出时将 Token 加入黑名单，后续请求在中间件中校验 |
| **无状态认证** | JWT Token 由客户端保存，后端不维护会话状态，Access Token 7天有效期 |
| **统一响应格式** | 后端 ResponseInterceptor 将所有响应格式化为 `{code, message, data, timestamp, requestId}` |
| **统一异常处理** | DefaultErrorFilter 捕获未预期异常返回500，BusinessErrorFilter 捕获业务异常返回对应状态码 |

---

## 三、数据库 ER 图分析

### 3.1 核心表关系总览

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   wd_user    │     │   wd_order       │     │  wd_order_item   │
│──────────────│     │──────────────────│     │──────────────────│
│ id (PK)      │◄───►│ user_id (FK)     │◄───►│ order_id (FK)    │
│ nickname     │     │ id (PK)          │     │ id (PK)          │
│ phone        │     │ order_no         │     │ product_type     │
│ password     │     │ order_type       │     │ product_name     │
│ avatar       │     │ total_amount     │     │ unit_price       │
│ role         │     │ pay_amount       │     │ quantity         │
│ created_at   │     │ status           │     │ subtotal         │
│ deleted_at   │     │ pay_time         │     │ product_image    │
└──────────────┘     │ created_at       │     └──────────────────┘
                     │ deleted_at       │
                     └──────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│ wd_clothing_     │ │ wd_food_     │ │ wd_accommodation_│
│ product          │ │ product      │ │ room_type        │
│──────────────────│ │──────────────│ │──────────────────│
│ id (PK)          │ │ id (PK)      │ │ id (PK)          │
│ name             │ │ name         │ │ homestay_id (FK) │
│ category_id (FK) │ │ price        │ │ name              │
│ price            │ │ stock        │ │ price             │
│ stock            │ │ unit         │ │ quantity          │
│ sales            │ │ status       │ │ max_guests        │
│ status           │ │ main_image   │ │ images(JSON)      │
│ main_image       │ └──────────────┘ └──────────────────┘
│ created_at       │                        │
│ deleted_at       │                        │
└──────────────────┘                        ▼
         │                     ┌──────────────────────────┐
         ▼                     │ wd_accommodation_homestay │
┌──────────────────┐          │──────────────────────────│
│ wd_clothing_sku  │          │ id (PK)                  │
│──────────────────│          │ name                     │
│ id (PK)          │          │ cover_image              │
│ product_id (FK)  │          │ facilities(JSON)         │
│ name             │          │ rating                   │
│ price            │          │ status                   │
│ stock            │          └──────────────────────────┘
│ image            │
│ attrs(JSON)      │    ┌──────────────────────┐
└──────────────────┘    │ wd_community_        │
                        │ travelogue           │
┌──────────────────┐    │──────────────────────│
│ wd_travel_       │    │ id (PK)              │
│ ticket_type      │    │ user_id (FK)         │
│──────────────────│    │ title                │
│ id (PK)          │    │ content              │
│ scenic_id (FK)   │    │ images(JSON)         │
│ name             │    │ status(0待审/1已发/2驳回)│
│ price            │    │ like_count           │
│ stock            │    │ comment_count        │
│ valid_days       │    │ linked_type          │
│ status           │    │ linked_id            │
└──────────────────┘    └──────────────────────┘
```

### 3.2 核心表结构详细设计

#### 用户与订单体系（公共服务）

```sql
-- 用户表（所有模块共享）
CREATE TABLE wd_user (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  openid      VARCHAR(100) COMMENT '微信openid',
  phone       VARCHAR(20) COMMENT '手机号',
  nickname    VARCHAR(100) COMMENT '昵称',
  avatar      VARCHAR(500) COMMENT '头像URL',
  password    VARCHAR(255) COMMENT 'bcrypt加密密码',
  role        VARCHAR(50) DEFAULT 'user' COMMENT '角色: user/merchant/admin',
  last_login_at DATETIME COMMENT '最后登录时间',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME COMMENT '软删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 订单表（5种订单类型统一存储）
CREATE TABLE wd_order (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_no    VARCHAR(50) NOT NULL COMMENT '订单号（雪花算法生成）',
  user_id     BIGINT NOT NULL COMMENT '用户ID',
  merchant_id BIGINT COMMENT '商家ID',
  order_type  VARCHAR(30) NOT NULL COMMENT 'clothing/food_meal/food_product/accommodation/travel',
  total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  pay_amount  DECIMAL(10,2) COMMENT '实付金额',
  status      VARCHAR(30) DEFAULT 'pending_pay' COMMENT '订单状态',
  pay_type    VARCHAR(20) COMMENT '支付方式',
  pay_time    DATETIME COMMENT '支付时间',
  remark      VARCHAR(500) COMMENT '订单备注',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 模块一：衣·商品

```sql
CREATE TABLE wd_clothing_product (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200) NOT NULL COMMENT '商品名称',
  subtitle    VARCHAR(500) COMMENT '副标题',
  category_id BIGINT NOT NULL COMMENT '分类ID',
  merchant_id BIGINT DEFAULT 0 COMMENT '商家ID',
  main_image  VARCHAR(500) NOT NULL COMMENT '主图URL',
  price       DECIMAL(10,2) NOT NULL COMMENT '销售价',
  market_price DECIMAL(10,2) COMMENT '市场价',
  stock       INT DEFAULT 0 COMMENT '库存',
  sales       INT DEFAULT 0 COMMENT '销量',
  rating      DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  description TEXT COMMENT '商品描述',
  status      TINYINT DEFAULT 1 COMMENT '0下架/1上架',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 模块二：食·餐厅

```sql
CREATE TABLE wd_food_restaurant (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  merchant_id  INT NOT NULL COMMENT '商家ID',
  name         VARCHAR(200) NOT NULL COMMENT '餐厅名称',
  cover_image  VARCHAR(500) NOT NULL COMMENT '封面图',
  phone        VARCHAR(20) COMMENT '联系电话',
  address      VARCHAR(500) COMMENT '地址',
  opening_hours VARCHAR(200) COMMENT '营业时间',
  cuisine_tags JSON COMMENT '菜系标签（simple-json）',
  description  TEXT COMMENT '餐厅介绍',
  rating       DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  status       TINYINT DEFAULT 1 COMMENT '0关闭/1营业',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 模块三：住·民宿与房态日历

```sql
CREATE TABLE wd_accommodation_calendar (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_type_id BIGINT NOT NULL COMMENT '房型ID',
  date         DATE NOT NULL COMMENT '日期',
  price        DECIMAL(10,2) NOT NULL COMMENT '当日价格',
  stock        INT DEFAULT 0 COMMENT '当日库存',
  status       TINYINT COMMENT 'NULL正常/1满房/2维护',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- 关键索引：UNIQUE INDEX idx_room_date (room_type_id, date)
```

#### 模块四：行·电子票

```sql
CREATE TABLE wd_travel_e_ticket (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id     BIGINT NOT NULL COMMENT '订单ID',
  ticket_code  VARCHAR(100) NOT NULL COMMENT '电子票码',
  status       TINYINT DEFAULT 0 COMMENT '0未使用/1已核销/2已过期',
  used_at      DATETIME COMMENT '核销时间',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- 关键索引：UNIQUE INDEX idx_ticket_code (ticket_code)
```

#### 模块五：社区·游记

```sql
CREATE TABLE wd_community_travelogue (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT NOT NULL COMMENT '作者ID',
  title        VARCHAR(200) NOT NULL COMMENT '标题',
  content      TEXT COMMENT '正文',
  cover_image  VARCHAR(500) COMMENT '封面图',
  images       JSON COMMENT '图片列表（simple-json）',
  video_url    VARCHAR(500) COMMENT '视频URL',
  location     VARCHAR(200) COMMENT '位置',
  topic_id     BIGINT COMMENT '话题ID',
  status       TINYINT DEFAULT 0 COMMENT '0待审/1已发布/2驳回',
  view_count   INT DEFAULT 0 COMMENT '浏览数',
  like_count   INT DEFAULT 0 COMMENT '点赞数',
  comment_count INT DEFAULT 0 COMMENT '评论数',
  linked_type  VARCHAR(20) COMMENT '关联业务类型',
  linked_id    BIGINT COMMENT '关联业务ID',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 模块六：管理后台

```sql
CREATE TABLE wd_admin (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(50) NOT NULL UNIQUE COMMENT '管理员账号',
  password     VARCHAR(200) NOT NULL COMMENT 'bcrypt加密密码',
  realName     VARCHAR(50) COMMENT '真实姓名',
  role_id      INT NOT NULL COMMENT '角色ID',
  status       TINYINT DEFAULT 1 COMMENT '0禁用/1启用',
  last_login_at DATETIME COMMENT '最后登录时间',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE wd_admin_role (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(50) NOT NULL COMMENT '角色名称',
  permissions  JSON COMMENT '权限标识列表（simple-json）',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at   DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 四、数据库设计规范

### 4.1 通用规范

| 规范项 | 要求 | 说明 |
|:------|:-----|:------|
| 数据库名 | `wudong_platform` | 所有表共用同一数据库 |
| 表命名 | `wd_{模块}_{业务}` | 如 wd_clothing_product |
| 字段命名 | 小写蛇形 | 如 product_name |
| 主键 | `id BIGINT UNSIGNED AUTO_INCREMENT` | 统一主键策略 |
| 必备字段 | `id, created_at, updated_at, deleted_at` | 每表必有 |
| 字符集 | `utf8mb4` | 支持 emoji |
| 排序规则 | `utf8mb4_unicode_ci` | 统一排序 |
| 引擎 | `InnoDB` | 事务支持 |
| 软删除 | `deleted_at DATETIME DEFAULT NULL` | 不物理删除 |

### 4.2 索引原则

- 每个外键字段必须建索引
- 频繁查询条件字段建索引（status、type、date）
- 组合索引遵循最左前缀原则
- 唯一标识字段建 UNIQUE 索引（ticket_code、order_no）

### 4.3 JSON 字段使用

TypeORM 的 `simple-json` 类型在 MySQL 中存储为 TEXT 列，存储时自动 `JSON.stringify()`，读取时自动 `JSON.parse()`。本项目中使用 `simple-json` 的字段包括：

| 表 | 字段 | 存储内容 |
|:---|:-----|:---------|
| wd_clothing_sku | attrs | SKU属性对象（颜色/尺寸等） |
| wd_food_restaurant | cuisine_tags | 菜系标签数组 |
| wd_accommodation_homestay | facilities | 设施标签数组 |
| wd_accommodation_homestay | images | 图片数组 |
| wd_community_travelogue | images | 游记图片数组 |
| wd_admin_role | permissions | 权限标识数组 |

> **注意：** 使用原生 SQL 查询时，`simple-json` 字段返回的是原始字符串，需要手动 `JSON.parse()`。使用 TypeORM 的 `find()` 或 `createQueryBuilder().getMany()` 时，TypeORM 会自动解析。

---

## 五、AI 辅助数据库设计与优化

### 5.1 AI 辅助设计数据库

在项目开发中，AI 根据需求文档的描述自动生成了完整的数据库实体定义。具体流程如下：

```
需求文档描述：
"民宿表需要存储名称、封面图、电话、地址、描述、设施、评分、状态"

→ AI 生成 TypeORM 实体：

@Entity('wd_accommodation_homestay')
export class Homestay extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 500 })
  coverImage: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  facilities: string[];

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  rating: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;
  // ... 自动添加 BaseEntity 继承的 id/created_at/updated_at/deleted_at
}
```

### 5.2 AI 辅助优化

在代码审查环节，AI 发现了以下数据库相关问题：

| 问题 | 发现方式 | 修复 |
|:----|:---------|:-----|
| 分类名称乱码 | MySQL 客户端 GBK 编码 | 设置 `--default-character-set=utf8mb4` |
| synchronize:true 改表结构 | 启动时 ALTER TABLE 报错 | 关闭 synchronize，手动建表 |
| JSON 字段返回字符串 | 前端 `.map()` 报错 | 增加 `Array.isArray` 判断 + `JSON.parse` 兜底 |
| 列名不匹配 | 表格显示为空 | 统一前后端字段名为驼峰/蛇形 |

---

## 六、AI 工具快速生成接口文档

### 6.1 基于装饰器的自动文档生成

本项目利用 Midway.js 框架的装饰器特性，结合 Swagger 自动生成接口文档。Controller 代码中的装饰器直接映射为 OpenAPI 规范：

```typescript
@Controller('/api/v1/products')
export class ProductController {
  @Get('/')
  @ApiOperation({ summary: '商品列表' })
  async list(@Query() query: ProductListDTO): Promise<PaginatedResponse<ProductVO>> {
    // 实现逻辑
  }

  @Get('/:id')
  @ApiOperation({ summary: '商品详情' })
  async detail(@Param('id') id: number): Promise<ApiSuccessResponse<ProductVO>> {
    // 实现逻辑
  }
}
```

### 6.2 AI 根据需求文档生成 API 代码

AI 的工作流程如下：

```
输入：需求文档中的 API 描述
"商品列表接口：支持分页、分类筛选、关键字搜索、多维度排序"

↓ AI 分析并生成

1. DTO 类（参数校验规则）
2. Controller 方法（路由装饰器）
3. Service 方法（业务逻辑 + 数据库查询）
4. 接口文档注释

↓ 生成示例

@Rule(RuleType.number().min(1).default(1))
page: number;

@Rule(RuleType.string().empty('').optional())
keyword: string;

@Rule(RuleType.number().optional())
categoryId: number;
```

### 6.3 文档与代码的一致性保障

| 机制 | 说明 |
|:----|:------|
| **装饰器即文档** | Controller 的路由、参数、校验规则都由装饰器定义，文档自动同步 |
| **DTO 参数校验** | class-validator 装饰器同时实现了校验和文档参数描述 |
| **AI 审查一致性** | 代码审查时会检查 API 实现是否与需求文档描述一致 |
| **自动更新** | 需求变更时，AI 定位受影响的 Controller 同步更新 |

### 6.4 统一 API 响应格式

所有 API 返回统一的 JSON 结构，由 ResponseInterceptor 中间件自动包装：

```typescript
// 成功响应
{
  code: 200,
  message: "success",
  data: { ... },           // 业务数据
  timestamp: 1687680000000, // 服务器时间戳
  requestId: "xxx-xxx"     // 请求追踪ID
}

// 分页响应
{
  code: 200,
  message: "success",
  data: {
    list: [ ... ],           // 数据列表
    pagination: {
      page: 1,               // 当前页码
      pageSize: 10,          // 每页条数
      total: 100,            // 总记录数
      totalPages: 10         // 总页数
    }
  },
  timestamp: ...,
  requestId: "..."
}

// 错误响应
{
  code: 400,                // 业务错误码
  message: "参数校验失败",   // 面向用户的错误信息
  data: null,
  errors: [                 // 字段级错误详情
    { field: "phone", message: "手机号格式不正确" }
  ],
  timestamp: ...,
  requestId: "..."
}
```

**业务状态码定义：**

| code | 含义 |
|:----:|:-----|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 422 | 业务校验失败 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |
