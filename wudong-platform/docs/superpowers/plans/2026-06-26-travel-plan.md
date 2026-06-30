# 出行模块实施计划

**Goal:** 完成出行模块后端API + 管理后台

**Architecture:** 后端 Midway.js 分层（entity→service→controller），管理后台 React + Ant Design Pro，Tabs 切分5个子页面，复用统一订单服务。

**Tech Stack:** Midway.js v3, TypeORM, React 18, Ant Design 5.x, ProTable

## Global Constraints
- 后端实体命名 `wd_travel_*` 蛇形表名
- 所有 API 基础路径 `/api/v1`
- 管理后台品牌色 `#1F5FA8`
- 新增路由必须在 auth.middleware.ts 注册
- 遵循住宿模块相同的代码 patterns

---

### Task 1: 后端实体 + Service + Controller

**Files:**
- Create: `packages/server/src/modules/travel/entity/scenic-spot.entity.ts`
- Create: `packages/server/src/modules/travel/entity/ticket-type.entity.ts`
- Create: `packages/server/src/modules/travel/entity/route.entity.ts`
- Create: `packages/server/src/modules/travel/entity/e-ticket.entity.ts`
- Create: `packages/server/src/modules/travel/service/travel.service.ts`
- Create: `packages/server/src/modules/travel/controller/travel.controller.ts`
- Modify: `packages/server/src/common/middleware/auth.middleware.ts`

- [ ] **Step 1-6:** Create entity files, service, controller, auth whitelist, seed data, restart backend

### Task 2: 管理后台路由 + Tabs布局

**Files:**
- Create: `packages/web-admin/src/services/travel.ts`
- Create: `packages/web-admin/src/pages/modules/travel/index.tsx`
- Modify: `packages/web-admin/src/App.tsx`

### Task 3-7: 各管理 Tab 页面

- scenic-spot.tsx (景区管理)
- ticket-type.tsx (票种管理)
- route.tsx (路线管理)
- e-ticket.tsx (电子票核销)
- orders.tsx (订单管理)

### Task 8: 集成验证
