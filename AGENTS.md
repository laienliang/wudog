# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 项目概述

**乌东文旅"衣食住行"综合管理平台** — 基于 Cool-Admin 8.x 的全栈文旅平台，涵盖非遗商品(衣)、餐饮美食(食)、民宿住宿(住)、旅行出行(行)四大业务模块，以及 UGC 社区、商户管理和后台管理系统。

## 技术栈

| 层 | 技术 |
|---|---|
| 后端 API | Node.js 18+ / TypeScript / Midway.js (Koajs) / Cool-Admin 8.x / TypeORM / MySQL 8.0 / Redis 6.2 |
| 管理后台 | Vue 3 / TypeScript / Vite / Element Plus / Pinia / Vue Router / @cool-vue/crud |
| PC 前台 | Nuxt 3 / Vue 3 / Element Plus / Pinia |
| 小程序端 | 微信小程序原生框架 |
| 基础设施 | Docker Compose (MySQL + Redis) |

## 项目结构

```
wudog/
├── cool-admin-midway/        # 后端 API (Midway.js + Cool-Admin)
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
├── cool-admin-vue/           # 管理后台前端 (Cool-Admin Vue)
│   ├── src/modules/          # 模块视图（与后端 modules 对应）
│   │   ├── admin/            # 后台管理页面
│   │   └── app/              # 前端应用模块
│   ├── packages/             # 内部包 (@cool-vue/crud)
│   └── build/cool/           # EPS 类型描述文件
│
├── pc-web/                   # PC 端前台 (Nuxt 3)
│   └── src/
│       ├── pages/            # 路由页面 (clothing/food/lodging/travel/community/user)
│       ├── components/       # 通用组件
│       ├── stores/           # Pinia Store
│       └── layouts/          # 布局
│
├── miniprogram/              # 微信小程序原生代码
│   └── pages_/               # 分包目录
│
├── docs/                     # 设计文档、SQL 初始化脚本、Logo 素材
├── docker-compose.yml        # 一键启动全部服务
└── start-mini.sh             # 小程序端启动提示脚本
```

## Controller 架构

每个业务模块有**两套 Controller**：

- **`controller/admin/`** — 后台管理接口，供 cool-admin-vue 使用，通常包含完整 CRUD（add/delete/update/info/list/page）
- **`controller/open/`** — 公开 API，供 pc-web 和小程序端使用，通常只暴露 read 类接口（list/info 等）

Cool-Admin 的 `@CoolController` 装饰器自动生成标准 CRUD 接口，**不要在 Controller 中直接写 add/delete/update/info/list/page 方法**。

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
| API 路径 | 驼峰法，如 `/user/info` 而非 `/user/info` |
| Entity 字段 | 驼峰法，如 `studentNo` |

## import 别名（前端）

- `/@/` → `./src`
- `/$/` → `./src/modules`
- `/#/` → `./src/plugins`
- `/~/` → `./packages`

## 开发与部署

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

```bash
# 后端
cd cool-admin-midway
npm i
npm run dev          # 监听 8001 端口

# 管理后台
cd cool-admin-vue
npm i
npm run dev          # 监听 9000 端口（Vite 默认）

# PC 前台
cd pc-web
npm i
npm run dev          # 监听 3000 端口
```

### 构建命令

```bash
# 后端
npm run build        # 生成实体 + 打包
npm run test         # 单元测试 (Jest)
npm run lint         # 代码检查

# 管理后台
npm run build        # Vite 生产构建
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint 修复

# PC 前台
npm run build        # Nuxt 构建
```

## 关键配置

- 后端上传文件域名前缀在 `cool-admin-midway/src/modules/plugin/config.ts` 中配置，默认使用 `127.0.0.1`，生产环境需修改为实际域名
- 数据库连接通过环境变量配置：`DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_NAME`
- PC 前台 API 地址通过环境变量 `NUXT_PUBLIC_API_BASE` 配置，默认为 `http://localhost:8001/open/client`
- Cool-Admin 模块配置在 `src/modules/{module}/config.ts` 中

## 业务模块关系

四大业务模块(衣/食/住/行)共享统一模式：
- 每个模块都有：分类 → 主商品 → SKU/详情 → 评价 → 收藏
- 商户(merchant)统一管理，通过 `moduleType` 区分归属模块
- 社区文章可通过 `relatedPlaceType` 和 `relatedPlaceId` 关联到具体商家
