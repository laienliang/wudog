# 乌东文旅平台 AI 全栈实践

## 项目概览
本仓库当前已经从“文档设计阶段”推进到“后端可联调、前端三端骨架已落地”的状态，面向课程第 1 组“衣·非遗商品”模块。

最终技术栈保持为：

- `backend`：Cool Admin Midway + Midway.js + MySQL + Redis 预留 + Swagger
- `pc-web`：React + Vite + React Router
- `admin-web`：React + Vite + Ant Design
- `miniapp`：原生微信小程序
- `postman`：接口联调集合
- `docs`：课程设计文档与开发说明

## 当前完成情况

- `backend` 已恢复为标准 Cool `dist` 启动链路，固定端口为 `3000`，全局前缀为 `/api`
- `backend/src/modules/wudong` 已完成商品分类、商品、SKU、商品图片、收藏的核心后端实现
- `backend/src/modules/wudong/menu.json` 已接入 Cool 菜单与权限体系
- Swagger 已能生成 `wudong` 真实接口路径
- `pc-web` 已完成分类筛选、商品列表、详情页、收藏页与密码登录收藏流程
- `admin-web` 已完成 Cool 后台登录、分类管理、商品管理、SKU/图片编辑、上下架与软删除
- `miniapp` 已完成原生小程序的列表、详情、收藏页和密码登录
- `postman` 已提供后台登录、分类、商品、收藏流程集合
- `backend/sql/init.sql` 已提供业务表和最小演示数据初始化脚本

## 目录结构

- `backend/`：Cool Admin Midway 后端
- `pc-web/`：普通用户 PC Web
- `admin-web/`：React 管理后台
- `miniapp/`：原生微信小程序
- `postman/`：Postman 集合与本地环境
- `docs/`：课程文档

## 本地运行

### 1. 后端

```bash
cd backend
npm run build
npm run start:local
```

后端地址：`http://127.0.0.1:3000/api`

Swagger：

- `http://127.0.0.1:3000/api/swagger/`
- `http://127.0.0.1:3000/api/swagger/json`

### 2. PC Web

```bash
cd pc-web
npm run dev
```

默认地址：`http://127.0.0.1:5173`

### 3. React 管理后台

```bash
cd admin-web
npm run dev
```

默认地址：`http://127.0.0.1:5174`

### 4. 原生微信小程序

使用微信开发者工具打开 `miniapp/` 目录。

说明：

- 当前 `project.config.json` 已关闭本地开发域名校验
- 小程序默认调用 `http://127.0.0.1:3000/api`

## 演示账号

- 后台管理员：`admin / 123456`
- 普通用户：`13800000000 / 123456`

## 已验证内容

- 后端真实构建成功：`backend -> npm run build`
- PC Web 真实构建成功：`pc-web -> npm run build`
- React 管理后台真实构建成功：`admin-web -> npm run build`
- 后端真实冒烟通过：
  - Swagger 包含 `wudong` 路由
  - 管理员登录成功
  - 商品上架前校验生效
  - 商品列表/详情可见
  - 收藏去重生效
  - 全部 SKU 库存为 `0` 时详情返回售罄
  - 分类禁用后用户端不可见
  - 商品软删除后用户端不可见

## 2026-06-19 联调现状

- 本地服务已同时运行：
  - `backend`：`http://127.0.0.1:3000`
  - `pc-web`：`http://127.0.0.1:5173`
  - `admin-web`：`http://127.0.0.1:5174`
- 已通过真实接口验证：
  - `GET /api/app/wudong/product-categories/list` 返回启用分类
  - `GET /api/app/wudong/products/page?page=1&pageSize=10` 返回演示商品
  - `GET /api/app/wudong/products/detail?id=3` 稳定返回 `craftIntro`、`inheritorName`、`inheritorIntro`、图片集、SKU 集和售罄状态
  - 普通用户 `13800000000 / 123456` 可真实登录并完成收藏
  - 管理端真实调用商品上下架接口后，用户端商品可见性立即同步变化
- 已通过浏览器验证：
  - `pc-web` 可完成“列表 -> 详情 -> 收藏 -> 我的收藏”闭环
- 尚待手工验证：
  - `miniapp` 需在微信开发者工具内按 [miniapp/README.md](/D:/临时文件/水课任务/人工智能实践/miniapp/README.md) 完成联调
  - `admin-web` 可打开登录页，但完整页面操作仍需人工输入验证码登录后确认

## 验收说明

- 四端联调、启动顺序、演示账号、人工检查清单见 [docs/11_四端联调与验收操作说明.md](/D:/临时文件/水课任务/人工智能实践/docs/11_四端联调与验收操作说明.md)
- 小程序开发者工具联调步骤见 [miniapp/README.md](/D:/临时文件/水课任务/人工智能实践/miniapp/README.md)

## 文档索引

- [docs/00_作业要求与第一组任务摘要.md](/D:/临时文件/水课任务/人工智能实践/docs/00_作业要求与第一组任务摘要.md)
- [docs/01_功能范围与用户角色设计.md](/D:/临时文件/水课任务/人工智能实践/docs/01_功能范围与用户角色设计.md)
- [docs/02_系统总体架构设计.md](/D:/临时文件/水课任务/人工智能实践/docs/02_系统总体架构设计.md)
- [docs/03_数据库设计.md](/D:/临时文件/水课任务/人工智能实践/docs/03_数据库设计.md)
- [docs/04_后端API接口设计.md](/D:/临时文件/水课任务/人工智能实践/docs/04_后端API接口设计.md)
- [docs/05_PC_Web端页面与交互设计.md](/D:/临时文件/水课任务/人工智能实践/docs/05_PC_Web端页面与交互设计.md)
- [docs/06_微信小程序端页面与交互设计.md](/D:/临时文件/水课任务/人工智能实践/docs/06_微信小程序端页面与交互设计.md)
- [docs/07_管理后台页面与运营功能设计.md](/D:/临时文件/水课任务/人工智能实践/docs/07_管理后台页面与运营功能设计.md)
- [docs/08_分阶段开发与联调验收计划.md](/D:/临时文件/水课任务/人工智能实践/docs/08_分阶段开发与联调验收计划.md)
- [docs/09_Gemini_CLI开发交接说明.md](/D:/临时文件/水课任务/人工智能实践/docs/09_Gemini_CLI开发交接说明.md)
- [docs/10_Cool_Admin_Midway与课程技术栈适配说明.md](/D:/临时文件/水课任务/人工智能实践/docs/10_Cool_Admin_Midway与课程技术栈适配说明.md)
- [docs/11_四端联调与验收操作说明.md](/D:/临时文件/水课任务/人工智能实践/docs/11_四端联调与验收操作说明.md)
