# 乌东文旅"衣食住行"综合服务平台

> 贵州黔东南·雷山县·西江镇·乌东苗寨

一站式数字化旅游服务平台，覆盖苗寨文旅的 **衣（民族商品）、食（餐饮美食）、住（民宿预订）、行（线路订票）、社区（照片分享）、管理后台** 六大业务模块，三端（微信小程序 + PC 网页 + 管理后台）全覆盖。

## 项目架构

```
wudong-platform/
├── packages/
│   ├── server/          # 后端服务（Midway.js + TypeORM + MySQL）
│   ├── web-pc/          # PC 网页端（React 18 + Ant Design 5.x）
│   ├── web-admin/       # 管理后台（React 18 + Ant Design Pro）
│   └── mini-program/    # 微信小程序端（原生框架）
├── shared/types/        # 共享类型定义（@wudong/shared）
├── docs/                # 文档
└── .github/workflows/   # CI 配置
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | **Midway.js v3**（TypeScript + IOC） |
| 前端框架 | **React 18**（Hooks + Function Component） |
| UI 组件 | **Ant Design 5.x** / **Ant Design Pro** |
| 小程序 | 微信原生小程序（微信 8.0+） |
| 数据库 | **MySQL 8.0+** + **TypeORM** |
| 缓存 | **Redis** |
| 文件存储 | **OSS**（阿里云 / S3 兼容） |
| 支付 | **微信支付**（JSAPI + Native） |
| 包管理 | **pnpm**（Monorepo） |

## 快速开始

### 前置要求

- Node.js >= 18
- pnpm >= 8（`npm install -g pnpm`）
- MySQL 8.0+
- Redis

### 安装与启动

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量
cp packages/server/.env.example packages/server/.env
# 编辑 .env 填写数据库、Redis、OSS 等配置

# 3. 创建数据库
mysql -u root -p -e "CREATE DATABASE wudong_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. 运行数据库迁移
pnpm db:migrate

# 5. 启动开发服务（同时启动后端 + PC 端 + 管理后台）
pnpm dev

# 单独启动各端
pnpm dev:server    # 后端 → http://localhost:7001
pnpm dev:web-pc    # PC端  → http://localhost:3000
pnpm dev:web-admin # 后台  → http://localhost:3001
```

### 小程序端

小程序端需使用微信开发者工具打开 `packages/mini-program` 目录，并配置合法的小程序 AppID。

## 六大模块

| # | 模块 | 组 | 业务定位 |
|---|------|----|----------|
| 1 | 衣·民族特色商品 | 第 1 组 | 苗绣/蜡染/银饰等手工艺品电商 |
| 2 | 食·餐饮美食 | 第 2 组 | 特色餐饮展示、餐位预订、农产品购买 |
| 3 | 住·住宿预订 | 第 3 组 | 苗寨特色民宿/客栈在线预订 |
| 4 | 行·线路订票 | 第 4 组 | 景区门票、苗寨游路线套餐、电子票 |
| 5 | 社区·照片分享 | 第 5 组 | UGC 游记/照片/短视频社区 |
| 6 | 平台管理后台 | 第 6 组 | 全局管理 + 公共后台框架 |

## 开发规范

详见 [CLAUDE.md](./CLAUDE.md) —— 包含完整的 API 规范、数据库设计原则、目录结构约定、安全要求等。

## 文档

- `docs/api/` — API 接口文档（Swagger / Apifox）
- `docs/database/` — 数据库设计（ER 图）
- `docs/specs/` — 需求规格说明书
- `/swagger-ui` — 本地 Swagger 文档（开发环境启动后访问）

## 许可

本项目为教育实训项目，仅供学习使用。
