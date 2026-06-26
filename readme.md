# 乌东文旅 · "衣食住行"综合管理平台

> 基于 Cool-Admin 8.x 的全栈文旅平台，涵盖非遗商品(衣)、餐饮美食(食)、民宿住宿(住)、旅行出行(行)四大业务模块，以及 UGC 社区、商户管理和后台管理系统

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端 API | Node.js / TypeScript / Midway.js 3.20.3 / Cool-Admin 8.x / TypeORM / MySQL / Redis | Node >= 18 |
| 管理后台 | Vue 3.5.13 / TypeScript 5.5.4 / Vite 5.4.14 / Element Plus 2.10.2 / Pinia 2.3.1 / Vue Router 4.5.0 / @cool-vue/crud 8.0.6 | Node >= 20 |
| PC 前台 | Nuxt 3.15.0 / Vue 3.5.0 / TypeScript / Element Plus 2.10.2 / Pinia 3.0.4 / Swiper 11.0.0 | Node >= 22 |
| 小程序 & H5 | UniApp / Vue 3 / TypeScript | — |
| 基础设施 | Docker Compose (MySQL + Redis) | — |

## 项目结构

```
wudog/
├── cool-admin-midway/        # 后端 API (Midway.js + Cool-Admin) 端口 8001
│   ├── src/
│   │   ├── modules/          # 业务模块（每个模块含 controller/service/entity/config.ts）
│   │   │   ├── base          # 后台权限管理（用户、角色、菜单等）
│   │   │   ├── clothing      # 衣：非遗商品
│   │   │   ├── food          # 食：餐厅、菜品、农产品
│   │   │   ├── lodging       # 住：民宿、房型
│   │   │   ├── travel        # 行：景点、路线、票务
│   │   │   ├── community     # 社区：UGC 文章、话题、互动
│   │   │   ├── platform      # 平台管理：Banner、公告、敏感词、统计
│   │   │   ├── user          # 用户信息、地址、微信登录
│   │   │   ├── cart          # 购物车
│   │   │   ├── order         # 订单
│   │   │   ├── payment       # 支付
│   │   │   ├── merchant      # 商户管理
│   │   │   └── demo/dict/space/recycle/task/helper  # 系统模块
│   │   ├── comm/             # 公共工具函数
│   │   ├── config/           # 环境配置 (default/local/prod)
│   │   └── configuration.ts  # Midway 应用配置入口
│   └── package.json
│
├── cool-admin-vue/           # 管理后台前端 (Cool-Admin Vue) 端口 9000/8080
│   ├── src/modules/          # 模块视图（与后端 modules 对应）
│   │   ├── admin/            # 后台管理页面
│   │   └── app/              # 前端应用模块
│   ├── packages/             # 内部包 (@cool-vue/crud)
│   └── build/cool/           # EPS 类型描述文件
│
├── pc-web/                   # PC 端前台 (Nuxt 3) 端口 3000
│   └── src/
│       ├── pages/            # 路由页面 (clothing/food/lodging/travel/community/user)
│       ├── components/       # 通用组件
│       ├── stores/           # Pinia Store
│       └── layouts/          # 布局
│
├── miniprogram/              # UniApp 小程序 & H5 (支持微信小程序、H5)
│   └── src/                  # 源代码
│
├── docs/                     # 设计文档、SQL 初始化脚本、Logo 素材
├── docker-compose.yml        # 一键启动全部服务
├── start-mini.sh             # 小程序端启动提示脚本
└── README.md
```

## 业务模块关系

四大业务模块(衣/食/住/行)共享统一模式：
- 每个模块都有：**分类 → 主商品 → SKU/详情 → 评价 → 收藏**
- 商户(merchant)统一管理，通过 `moduleType` 区分归属模块
- 社区文章可通过 `relatedPlaceType` 和 `relatedPlaceId` 关联到具体商家

## Controller 架构

每个业务模块有**两套 Controller**：

- **`controller/admin/`** — 后台管理接口，供 cool-admin-vue 使用，通常包含完整 CRUD（add/delete/update/info/list/page）
- **`controller/open/`** — 公开 API，供 pc-web 和小程序端使用，通常只暴露 read 类接口（list/info 等）

Cool-Admin 的 `@CoolController` 装饰器自动生成标准 CRUD 接口，**不要在 Controller 中直接写 add/delete/update/info/list/page 方法**。

## 快速启动

### 前置条件

- Node.js >= 18
- MySQL 8.0
- Redis 6.2
- Docker & Docker Compose（推荐）

### 使用 Docker Compose 一键启动（推荐）

```bash
docker-compose up --build
```

启动服务：
- **MySQL**: `localhost:13306` (root/123456, 数据库: cool)
- **Redis**: `localhost:16379`
- **后端 API**: `http://localhost:8001`
- **管理后台**: `http://localhost:8080`
- **PC 前台**: `http://localhost:3000`

### 本地开发

#### 1. 启动后端

```bash
cd cool-admin-midway
npm install
npm run dev          # 监听 8001 端口
```

#### 2. 启动管理后台

```bash
cd cool-admin-vue
npm install
npm run dev          # 监听 9000 端口（Vite 默认）
```

#### 3. 启动 PC 前台

```bash
cd pc-web
npm install
npm run dev          # 监听 3000 端口
```

#### 4. UniApp（小程序 & H5）

```bash
cd miniprogram
npm install
npm run dev          # 启动开发服务
npm run build:mp     # 构建小程序
npm run build:h5     # 构建 H5
```

支持微信小程序和 H5 两种编译产物，在开发者工具中配置请求合法域名为：`http://localhost:8001`

## 端口一览

| 服务 | 端口 | 地址 |
|------|------|------|
| 后端 API | 8001 | http://localhost:8001 |
| 管理后台 | 9000/8080 | http://localhost:9000 |
| PC 前台 | 3000 | http://localhost:3000 |
| MySQL | 13306 | localhost:13306 |
| Redis | 16379 | localhost:16379 |

## 构建命令

### 后端

```bash
cd cool-admin-midway
npm run build        # 生成实体 + 打包
npm run test         # 单元测试 (Jest)
npm run lint         # 代码检查
```

### 管理后台

```bash
cd cool-admin-vue
npm run build        # Vite 生产构建
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint 修复
```

### PC 前台

```bash
cd pc-web
npm run build        # Nuxt 构建
```

## 关键配置

- **上传文件域名**：在 `cool-admin-midway/src/modules/plugin/config.ts` 中配置，默认使用 `127.0.0.1`，生产环境需修改为实际域名
- **数据库连接**：通过环境变量配置 `DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_NAME`
- **PC 前台 API 地址**：通过环境变量 `NUXT_PUBLIC_API_BASE` 配置，默认为 `http://localhost:8001/open/client`
- **模块配置**：Cool-Admin 模块配置在 `src/modules/{module}/config.ts` 中

## Entity 规范

- 继承 `BaseEntity`，import 路径固定为 `'../../base/entity/base'`
- **禁止使用** `@ManyToOne`、`@OneToMany` 等外键关联
- 字段使用驼峰命名（`userName`），但文件名使用下划线命名（`user_info.entity.ts`）
- 使用 TypeORM API 而非原生 SQL（统计类查询可使用原生 SQL）

## 命名约定

| 类型 | 规则 |
|---|---|
| Entity 文件名 | 下划线法，如 `user_info.ts` |
| Controller 文件名 | 下划线法，如 `user_info.ts` |
| Service 文件名 | 下划线法 |
| Vue 组件/文件 | 短横线法，如 `user-info.vue` |
| API 路径 | 驼峰法，如 `/user/info` |
| Entity 字段 | 驼峰法，如 `studentNo` |

## 前端 import 别名

- `/@/` → `./src`
- `/$/` → `./src/modules`
- `/#/` → `./src/plugins`
- `/~/` → `./packages`

## API 接口

- **管理员接口**：`/admin/*` 需要后台权限认证
- **公开接口**：`/open/client/*` 供 PC 前台和小程序使用
- 所有接口统一返回格式：`{ code, message, data }`

## 缓存策略

各业务模块的公开接口（`/open/*`）已集成 Redis 缓存，包括：
- clothing 模块前台接口
- food 模块前台接口
- lodging 模块前台接口
- travel 模块前台接口
- community 模块前台接口

缓存配置可在各模块的 `config.ts` 中调整。
