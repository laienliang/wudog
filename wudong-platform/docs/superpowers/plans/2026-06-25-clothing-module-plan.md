# 衣·非遗商品模块 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完成衣模块的完整前后端：后端增强（分类/SKU/评价）+ PC 端页面（列表/详情/购物车）+ 管理后台（商品/分类/订单/评价管理）

**Architecture:** 后端基于已有 Product CRUD 增强，前端 React + Ant Design 5.x，购物车 localStorage，管理后台 ProTable

**Tech Stack:** Midway.js v3 + React 18 + Ant Design 5.x + axios + React Router v6

## Global Constraints

- 购物车数据存在 localStorage，key 为 `wudong_cart`
- 管理后台页面嵌入现有 ProLayout 框架的路由中
- 商品列表默认显示 status=1（上架）的商品
- API 路径以 `/api/v1/` 开头
- 视觉主色 #1F5FA8（苗银蓝）

---

### Task C1: 后端 — 分类 + SKU + 评价 API

**Files:**
- Modify: `packages/server/src/modules/clothing/controller/product.controller.ts`（添加分类/SKU/评价接口）

- [ ] **Step 1: 在 controller 中添加分类列表接口**

```typescript
// 在 ProductController 中添加：
@Get('/categories')
async categories() {
  return this.productService.getCategories();
}
```

- [ ] **Step 2: 在 controller 中添加 SKU 列表接口**

```typescript
// 添加：
@Get('/:id/skus')
async skus(@Param('id') id: number) {
  return this.productService.getSkus(id);
}
```

- [ ] **Step 3: 在 controller 中添加评价接口**

```typescript
// 添加：
@Get('/:id/reviews')
async reviews(@Param('id') id: number) {
  return this.productService.getReviews(id);
}
```

- [ ] **Step 4: 在 ProductService 中补充方法**

在 `product.service.ts` 中添加 `getCategories()`, `getSkus(productId)`, `getReviews(productId)` 方法，直接使用 TypeORM Repository 查询对应数据表（wd_clothing_category, wd_clothing_sku, wd_clothing_review）。

- [ ] **Step 5: 提交**

```bash
git add packages/server/src/modules/clothing/
git commit -m "feat(clothing): add category, sku, review API"
```

---

### Task C2: PC 端 — 商品列表页

**Files:**
- Create: `packages/web-pc/src/pages/clothing/index.tsx`
- Modify: `packages/web-pc/src/services/api.ts`（添加 API 调用）

- [ ] **Step 1: 创建 API 服务封装**

```typescript
// packages/web-pc/src/services/api.ts
import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

export const productApi = {
  list(params: any) { return api.get('/products', { params }); },
  detail(id: number) { return api.get(`/products/${id}`); },
  categories() { return api.get('/categories'); },
  skus(productId: number) { return api.get(`/products/${productId}/skus`); },
  reviews(productId: number, params?: any) { return api.get(`/products/${productId}/reviews`, { params }); },
};
```

- [ ] **Step 2: 创建商品列表页**

```typescript
// packages/web-pc/src/pages/clothing/index.tsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Input, Select, Pagination, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

// 页面布局：顶部搜索+排序 → 商品卡片网格 → 分页
// 加载分类列表到左侧筛选区
// 商品卡片显示：主图、名称、价格(苗绣橙)、销量、评分
// 点击卡片跳转 /clothing/:id
```

- [ ] **Step 3: 在 App.tsx 中添加路由**

在 `web-pc/src/App.tsx` 中确认已有路由：`<Route path="/clothing" element={<ClothingList />} />`

- [ ] **Step 4: 提交**

```bash
git add packages/web-pc/src/pages/clothing/ packages/web-pc/src/services/api.ts
git commit -m "feat(pc): add clothing product list page"
```

---

### Task C3: PC 端 — 商品详情页

**Files:**
- Create: `packages/web-pc/src/pages/clothing/detail.tsx`

- [ ] **Step 1: 创建商品详情页**

```typescript
// packages/web-pc/src/pages/clothing/detail.tsx
// 功能：
// 1. 主图轮播（Ant Design Image）
// 2. 商品信息：标题/价格/销量/评分
// 3. SKU 选择：按钮组切换规格
// 4. 工艺介绍：折叠面板
// 5. 操作按钮：加入购物车 + 立即购买
// 6. 评价列表

// 加入购物车逻辑：
const addToCart = (sku: any) => {
  const cart = JSON.parse(localStorage.getItem('wudong_cart') || '[]');
  const idx = cart.findIndex((item: any) => item.skuId === sku.id);
  if (idx >= 0) cart[idx].quantity += 1;
  else cart.push({ productId, skuId: sku.id, name, price, image, quantity: 1 });
  localStorage.setItem('wudong_cart', JSON.stringify(cart));
  message.success('已加入购物车');
};
```

- [ ] **Step 2: 在 App.tsx 添加路由**

```tsx
<Route path="/clothing/:id" element={<ClothingDetail />} />
```

- [ ] **Step 3: 提交**

```bash
git add packages/web-pc/src/pages/clothing/detail.tsx
git commit -m "feat(pc): add clothing product detail page"
```

---

### Task C4: PC 端 — 购物车页面

**Files:**
- Create: `packages/web-pc/src/pages/clothing/cart.tsx`

- [ ] **Step 1: 创建购物车页面**

```typescript
// packages/web-pc/src/pages/clothing/cart.tsx
// 功能：
// 1. 读取 localStorage 中的购物车数据
// 2. 商品列表：缩略图+名称+单价+数量调整+小计
// 3. 数量加减按钮
// 4. 删除商品
// 5. 底部合计金额
// 6. 去结算按钮（调订单 API 创建订单，需登录）

// 数据结构：
interface CartItem {
  productId: number;
  skuId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
```

- [ ] **Step 2: 在 App.tsx 添加路由**

```tsx
<Route path="/cart" element={<CartPage />} />
```

同时更新顶部导航栏中的购物车按钮，点击跳转到 `/cart`。

- [ ] **Step 3: 提交**

```bash
git add packages/web-pc/src/pages/clothing/cart.tsx
git commit -m "feat(pc): add shopping cart page with localStorage"
```

---

### Task C5: 管理后台 — 商品管理页

**Files:**
- Create: `packages/web-admin/src/pages/clothing/product-list.tsx`
- Create: `packages/web-admin/src/pages/clothing/product-form.tsx`

- [ ] **Step 1: 创建商品列表页（ProTable）**

```typescript
// packages/web-admin/src/pages/clothing/product-list.tsx
import { ProTable } from '@ant-design/pro-table';
// 列：ID, 主图(缩略图), 名称, 分类, 价格, 销量, 状态(上架/下架Tag), 创建时间
// 操作：编辑/上下架/删除
// 顶部：搜索框+新增按钮
```

- [ ] **Step 2: 创建商品表单（弹窗）**

```typescript
// packages/web-admin/src/pages/clothing/product-form.tsx
// Modal 表单：名称、副标题、分类(Select)、主图URL、价格、市场价、描述(Textarea)
```

- [ ] **Step 3: 在管理后台 App.tsx 中替换占位页面**

将 `Placeholder name="商品管理"` 替换为 `<ProductList />`

- [ ] **Step 4: 提交**

```bash
git add packages/web-admin/src/pages/clothing/product-list.tsx packages/web-admin/src/pages/clothing/product-form.tsx
git commit -m "feat(admin): add product management page"
```

---

### Task C6: 管理后台 — 分类/订单/评价管理

**Files:**
- Create: `packages/web-admin/src/pages/clothing/category-list.tsx`
- Create: `packages/web-admin/src/pages/clothing/orders.tsx`
- Create: `packages/web-admin/src/pages/clothing/reviews.tsx`

- [ ] **Step 1: 分类管理页**

ProTable 表格：ID/名称/排序/操作(编辑/删除)
新增/编辑用 Modal 表单

- [ ] **Step 2: 订单管理页**

ProTable 表格：订单号/用户/金额/状态(Tag)/时间
状态筛选 Tab：全部/待支付/已支付/已发货/已完成/已退款

- [ ] **Step 3: 评价管理页**

ProTable 表格：商品/用户/评分(Star)/内容/时间
操作：回复/隐藏

- [ ] **Step 4: 替换管理后台路由中的占位页面**

```tsx
<Route path="/modules/clothing" element={<ProductList />} />
```
以及分类/订单/评价路由

- [ ] **Step 5: 提交**

```bash
git add packages/web-admin/src/pages/clothing/
git commit -m "feat(admin): add category, order, review management pages"
```

---

### Task C7: 后端 — 收藏 + 搜索历史 + 批量导入 API

**Files:**
- Modify: `packages/server/src/modules/clothing/controller/product.controller.ts`
- Modify: `packages/server/src/modules/clothing/service/product.service.ts`

- [ ] **Step 1: 添加收藏 API**

```typescript
// controller 中添加：
@Post('/:id/favorite')
async favorite(@Param('id') id: number, @Query() ctx: any) {
  const userId = ctx.user?.userId;
  return this.productService.toggleFavorite(id, userId);
}
// service 中添加 toggleFavorite 方法，查询 wd_community_favorite 表
```

- [ ] **Step 2: 添加热门搜索 API**

```typescript
@Get('/search/hot')
async hotSearch() {
  return ['苗绣', '银饰', '蜡染', '苗族服饰', '手工艺品'];
}
```

- [ ] **Step 3: 添加批量导入 API**

```typescript
@Post('/batch-import')
async batchImport(@Body() body: any) {
  return this.productService.batchImport(body.products);
}
```

- [ ] **Step 4: 提交**

```bash
git add packages/server/src/modules/clothing/
git commit -m "feat(clothing): add favorite, hot search, batch import API"
```

---

### Task C8: PC 端 — 收藏夹 + 评价中心 + 搜索增强

**Files:**
- Create: `packages/web-pc/src/pages/clothing/favorites.tsx`
- Create: `packages/web-pc/src/pages/clothing/my-reviews.tsx`
- Modify: `packages/web-pc/src/pages/clothing/index.tsx`（添加搜索历史+多条件筛选）
- Modify: `packages/web-pc/src/pages/clothing/detail.tsx`（添加收藏按钮+传承人信息）

- [ ] **Step 1: 收藏夹页**

从 localStorage 读取收藏列表，展示商品卡片网格，取消收藏功能

- [ ] **Step 2: 评价中心页**

调 API 获取当前用户的评价列表，展示评分/内容/时间/商家回复

- [ ] **Step 3: 商品列表页增强**

添加：搜索历史（localStorage 存储最近5条）、多条件筛选（价格区间输入/风格Select/材质Select）、热门搜索词展示

- [ ] **Step 4: 商品详情页增强**

添加：收藏按钮（心形图标，点击切换）、传承人信息区域

- [ ] **Step 5: 提交**

```bash
git add packages/web-pc/src/pages/clothing/
git commit -m "feat(pc): add favorites, reviews, search enhancement"
```

---

### Task C9: 管理后台 — 库存管理 + 批量导入

**Files:**
- Create: `packages/web-admin/src/pages/clothing/inventory.tsx`
- Modify: `packages/web-admin/src/pages/clothing/product-list.tsx`（添加批量导入按钮）

- [ ] **Step 1: 库存管理页**

ProTable 显示所有 SKU 的库存：商品名/规格/SKU ID/当前库存
库存 < 10 的行红色高亮
每行可手动调整库存数量

- [ ] **Step 2: 商品列表添加批量导入按钮**

表格顶部添加"批量导入"按钮，点击弹出 Modal，支持粘贴 JSON 或上传文件

- [ ] **Step 3: 在管理后台路由中添加库存管理**

```tsx
<Route path="/modules/clothing/inventory" element={<Inventory />} />
```

- [ ] **Step 4: 提交**

```bash
git add packages/web-admin/src/pages/clothing/
git commit -m "feat(admin): add inventory management and batch import"
```

---

### Task C10: 小程序端 — 衣模块页面（骨架）

**Files:**
- Create: `packages/mini-program/pages/clothing/list.{wxml,js,json,wxss}`
- Create: `packages/mini-program/pages/clothing/detail.{wxml,js,json,wxss}`
- Create: `packages/mini-program/pages/clothing/cart.{wxml,js,json,wxss}`

- [ ] **Step 1: 商品列表页骨架**

微信小程序页面：分类 Tab + 商品列表（图片+名称+价格）

- [ ] **Step 2: 商品详情页骨架**

主图轮播 + 商品信息 + 加入购物车按钮

- [ ] **Step 3: 提交**

```bash
git add packages/mini-program/pages/clothing/
git commit -m "feat(mini): add clothing module pages skeleton"
```

---

### Task C11: 集成验证

- [ ] **Step 1: 启动三端服务**

```bash
# 启动后端
cd E:/乌东项目实训/wudong-platform && pnpm dev:server
# 新终端启动 PC 端
pnpm dev:web-pc
# 新终端启动管理后台
pnpm dev:web-admin
```

- [ ] **Step 2: 验证后端 API**

```bash
curl -s http://localhost:7001/api/v1/categories
curl -s http://localhost:7001/api/v1/products
curl -s http://localhost:7001/api/v1/products/1/skus
curl -s http://localhost:7001/api/v1/products/1/reviews
```

- [ ] **Step 3: 打开浏览器确认页面**

- http://localhost:3000/clothing — 商品列表页
- http://localhost:3000/clothing/1 — 商品详情页
- http://localhost:3000/cart — 购物车页
- http://localhost:3001/modules/clothing — 管理后台

- [ ] **Step 4: 提交并推送**

```bash
git add . && git commit -m "feat(clothing): complete full-stack module"
git push origin master
```

---

## Spec Coverage Check

| 设计文档要求 | 对应 Task |
|-------------|----------|
| 分类列表 API | C1 |
| SKU 列表 API | C1 |
| 评价 API | C1 |
| 收藏 API | C7 |
| 热门搜索 API | C7 |
| 批量导入 API | C7 |
| PC 商品列表（分类+价格+风格+材质+搜索+排序+分页） | C2 + C8 |
| PC 商品详情（主图+SKU+工艺+传承人+收藏+评价） | C3 + C8 |
| PC 本地购物车 | C4 |
| PC 收藏夹 | C8 |
| PC 评价中心（我的评价） | C8 |
| 搜索历史 + 热门搜索 | C8 |
| 管理后台商品管理（表格CRUD+批量导入） | C5 + C9 |
| 管理后台分类管理 | C6 |
| 管理后台订单管理 | C6 |
| 管理后台评价管理 | C6 |
| 管理后台库存管理（库存预警+调整） | C9 |
| 小程序端页面 | C10 |
