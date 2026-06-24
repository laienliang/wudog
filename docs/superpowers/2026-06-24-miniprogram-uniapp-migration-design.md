---
name: miniprogram-uniapp-migration
description: 小程序从原生 wx 框架迁移到 UniApp + Vue 3，同时支持微信小程序与 H5
metadata:
  type: project
  created: 2026-06-24
---

# 小程序迁移到 UniApp 设计文档

## 背景

当前 `miniprogram/` 目录使用微信小程序原生框架（`.vue` 单文件组件 + `wx.xxx` API），仅能编译为小程序，无法满足 H5 端需求。

## 目标

将小程序项目迁移到 UniApp + Vue 3 + Vite 技术栈，一次编码同时输出：
- 微信小程序（`mp-weixin`）
- H5（`h5`）

## 技术方案

| 项 | 选择 |
|---|------|
| 框架 | UniApp（Vue 3 + Vite 模板） |
| 语法 | `<script setup>` + Composition API |
| 样式 | CSS 变量 + `rpx` 单位（两端兼容） |
| API | `wx.xxx` → `uni.xxx` |
| 构建 | Vite + `@dcloudio/vite-plugin-uni` |

## 项目结构

```
miniprogram/
├── pages/                    # 统一页面目录
│   ├── index/               # 首页（Banner + 金刚区 + 热门 + 游记）
│   ├── category/            # 分类
│   ├── community/           # 社区列表
│   ├── mine/                # 我的
│   ├── search/              # 搜索
│   ├── clothing/            # 衣
│   ├── food/                # 食（餐厅 + 农产品）
│   ├── lodging/             # 住
│   ├── travel/              # 行（景点 + 路线）
│   ├── cart/                # 购物车
│   └── user/                # 登录/订单/地址/收藏/相册/资料
├── components/              # 通用组件
├── utils/                   # request.js 等
├── static/                  # 图片等资源
├── pages.json               # 页面路由 + tabBar
├── manifest.json            # 多端应用配置
├── App.vue                  # 应用入口
├── main.js                  # Vue 挂载
├── index.html               # H5 入口
├── vite.config.js           # Vite 配置（API 代理）
└── package.json
```

## 迁移清单

### 需要转换的文件（~26 个页面 + 3 个工具文件）

1. **页面文件**：所有 `.vue` 文件
   - `wx.` → `uni.` API 替换
   - 页面 `.json` 配置合并到 `pages.json`
   - `app.json` 中的 tabBar/subPackages 配置合并到 `pages.json`

2. **工具文件**：
   - `utils/request.js` → `utils/request.js`（`wx.request` → `uni.request`）
   - `app.js` → `App.vue`（`App()` → Vue 应用）
   - `app.wxss` → `App.vue` 全局样式

3. **静态资源**：
   - `static/tab/*.png` → 保持不变
   - 需要确认 H5 端是否有对应的图标资源

### 不需要迁移的文件

- `project.config.json`、`project.private.config.json`、`sitemap.json` — 微信开发者工具专用，UniApp 有自己的配置体系

## 关键适配点

1. **API 映射**：`uni.request`、`uni.navigateTo`、`uni.switchTab`、`uni.showToast` 等与 `wx.*` 完全兼容
2. **路由**：UniApp 使用 `pages.json` 统一管理，不再需要单独的页面 `.json` 配置
3. **条件编译**：使用 `#ifdef MP-WEIXIN` / `#ifdef H5` 做平台差异化
4. **H5 登录**：小程序用微信登录，H5 可能需要额外支持网页授权或账号密码登录
5. **tabBar**：H5 端 tabBar 渲染为顶部/底部导航栏，不需要 iconPath 属性

## 构建命令

```bash
npm run dev:mp     # 小程序开发
npm run dev:h5     # H5 开发
npm run build:mp   # 小程序构建
npm run build:h5   # H5 构建
```
