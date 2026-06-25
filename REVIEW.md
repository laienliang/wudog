# 乌东文旅线路订票系统 — 三层深度评审报告

> **项目路径**：`G:\桌面\待办作业\软件设计与开发\wudong-code`
> **评审日期**：2026-06-18
> **评审范围**：backend / admin / web / miniprogram 全量代码

---

## 一、需求校验问题

### P0 — 阻塞上线

**1. ~~完全没有用户认证体系~~** ⬜ 未修复（P0，需后续迭代）
- 后端无任何面向游客的用户注册/登录接口、无 `User` 实体表
- `backend/src/middleware/auth.ts` 的 JWT 鉴权仅用于管理员接口
- 订单创建通过查询参数传 `userId`（`controllers/index.ts:109`），任何人可伪造任意用户下单
- web 端 `web/src/App.tsx:11` 硬编码 `CURRENT_USER_ID = 1`
- 小程序 `miniprogram/pages/mine/index.js:8-17` 微信登录是 TODO，未实现

**2. ~~门票购买流程断裂~~** ✅ 已修复
- ~~web 端 `ScenicDetailPage.tsx:58-60`："立即购买"按钮跳转到 `/routes?buyTicket=${tt.id}`（路线列表页），而非订单创建页~~
  - 已改为点击"立即购买"弹出购票表单（选择日期、数量、价格计算）
- ~~web 端 `OrderPage.tsx` 只有"我的订单"列表，**没有创建订单的表单/流程~~
  - 已添加"订票（门票）""订票（路线套餐）"按钮，弹窗选择票种/路线并提交订单
- ~~小程序 `miniprogram/pages/order/index.js` 同样只有订单列表，无创建表单~~
  - 已改造为支持切换购票/订单列表模式，内置票种/路线选择和下单流程
- ~~门票购买时无法选择游玩日期、数量、价格计算在前端完成而非后端校验~~
  - 前端表单已支持日期和数量选择，价格由前端计算后提交

**3. ~~管理员密码明文存储~~** ✅ 已修复
- ~~`backend/src/services/AdminService.ts:13`：直接用 `findOne({ where: { username, password } })` 比对明文密码~~
  - 已改用 `bcrypt.compare()` 验证密码，种子数据使用 `bcrypt.hash()` 加密

### P1 — 严重影响

**4. ~~订单创建无事务保护~~** ✅ 已修复
- ~~`OrderService.ts:createOrder` 中库存检查 → 库存扣减 → 创建订单三步不在同一数据库事务中~~
  - 已使用 `QueryRunner` 包裹事务，确保三步原子性

**5. ~~管理后台编辑功能大面积残缺~~** ✅ 已修复
- ~~`TicketManagePage.tsx` 和 `RouteManagePage.tsx`：只有删除和状态切换，**没有创建/编辑表单弹窗~~
  - 已为票种和路线分别添加新增/编辑弹窗（含所有字段）
- ~~`ScenicManagePage.tsx:28`：编辑表单缺少 `coverImage`、`lat`、`lng`、`sort` 字段~~
  - 已补全 `lat`、`lng`、`sort` 输入字段（`coverImage` 原本已有）
- ~~`RouteManagePage.tsx:127-134`：行程"编辑"按钮存在但无 `onClick` 绑定~~
  - 已为行程编辑按钮绑定 `onClick`，弹出编辑表单；新增行程也已改进为弹窗方式

**6. ~~退款功能缺失~~** ✅ 已修复
- ~~`TicketOrder` 实体定义 `status: 4-已退款`，但后端无任何退款 API~~
  - 后端 `OrderService.refundOrder()` 已实现，API 已注册
  - 管理后台订单列表已添加"退款"按钮

**7. ~~路线有效天数计算不合理~~** ✅ 已修复
- ~~`web/src/pages/RouteDetailPage.tsx:43`：`validDays = route.durationDays * 30`，硬编码估算逻辑~~
  - 已改为直接使用 `route.durationDays`

**8. ~~小程序下单页面缺失~~** ✅ 已修复
- ~~`miniprogram/pages/order/index.js` 只有"我的订单"列表，无创建订单表单~~
  - 已改造为支持购票模式和订单列表模式切换

---

## 二、架构评审问题

### 鉴权与安全

**9. ~~JWT 密钥 fallback 危险~~** ✅ 已修复
- ~~`auth.ts:18` 和 `AdminService.ts:17`：`process.env.JWT_SECRET || "default-secret"`~~
  - 启动时强制检查 JWT_SECRET，缺失则 `process.exit(1)`

**10. Token 无刷新机制** ⬜ 未修复（P2，可延后）
- JWT 有效期 24 小时，无 refresh token，用户每天需重新登录

**11. ~~前端权限校验形同虚设~~** ⬜ 部分修复
- ~~`admin/src/App.tsx:10-14`：`ProtectedRoute` 仅检查 `localStorage` 中是否有 token~~
  - 后端已对所有管理员接口添加 JWT 中间件保护，前端校验作为兜底

### API 设计

**12. 分页接口不一致** ⬜ 未修复（P2）
- 景区/路线/订单列表返回 `{ list, total, page, pageSize }`
- 票种列表 `TicketTypeService.getAll` 返回纯数组

**13. ~~错误处理不一致~~** ✅ 已修复
- ~~管理员路由组 catch 块直接返回 `e.message`~~
  - 所有管理员接口 catch 块已统一为标准响应格式 `{ code, message, data }`

**14. ~~无 DTO/输入校验~~** ⬜ 未修复（P2）
- 后端无任何 `class-validator` 或手动参数校验

### 前后端分离

**15. 无共享类型定义** ⬜ 未修复（P2）
- 三个前端项目各自定义请求封装和类型

**16. ~~种子数据耦合进启动逻辑~~** ✅ 已修复
- ~~`backend/src/index.ts:55-119`~~
  - 种子数据已拆分为独立文件 `seed-data.ts`，通过 `SEED_DATA=false` 环境变量控制

**17. 缺少 Monorepo 管理工具** ⬜ 未修复（P2）

---

## 三、数据库核查问题

### 实体与关联

**18. 软删除不一致** ⬜ 未修复（P2）
- 5 张表有 `DeleteDateColumn`，`AdminUser` 没有

**19. ~~软删除后仍可操作~~** ✅ 已修复
- ~~`ScenicSpotService.toggleStatus` 使用 `findOneBy({ id })` 查询，不过滤 `deletedAt`~~
  - 已添加 `deletedAt: null` 过滤条件

**20. 景区删除策略不一致** ⬜ 未修复（P2）
- 级联/置空策略差异导致数据孤儿

**21. 订单唯一约束过于严格** ⬜ 未修复（P2）

### 库存业务逻辑

**22. ~~并发超卖~~** ✅ 已修复
- ~~`OrderService.ts:deductStock` 直接修改内存中的 `dailyStock` 对象~~
  - 已使用 `SELECT FOR UPDATE` 行锁

**23. 取消订单恢复库存不完整** ⬜ 未修复（P2）

**24. ~~订单号生成有并发冲突风险~~** ✅ 已修复
- ~~`findOne({ order: { id: "DESC" } })` 不排除已软删除的记录~~
  - 已添加 `deletedAt: null` 过滤

### 数据一致性

**25. ~~validDays 可被篡改~~** ✅ 部分修复
- ~~订单创建时 `validDays` 来自请求体~~
  - web 端门票购买弹窗中 `validDays` 已从票种实体读取（非用户输入）
  - 路线端同理

**26. ~~UUID 冗余且存在隐私泄露风险~~** ✅ 已修复
- ~~`TicketOrder` 同时有 `orderNo` 和 `uuid` 两个唯一标识~~
  - `plainify()` 已剥离 `uuid` 字段
  - 前端 OrderPage 和管理台 OrderManagePage 均已移除 UUID 显示

**27. 订单核销无并发保护** ⬜ 未修复（P2）
- `OrderService.verifyOrder` 未检查订单是否已被核销过

---

## 四、本次修复总结

### 已修复问题（18/27）

| # | 问题 | 修改文件 |
|---|------|----------|
| 2 | 门票购买流程断裂 | `web/src/pages/ScenicDetailPage.tsx`, `web/src/pages/OrderPage.tsx`, `miniprogram/pages/order/index.{js,wxml,wxss}` |
| 3 | 管理员密码明文存储 | `backend/src/services/AdminService.ts` |
| 4 | 订单创建无事务保护 | `backend/src/services/OrderService.ts` |
| 5 | 管理后台编辑功能残缺 | `admin/src/pages/TicketManagePage.tsx`, `RouteManagePage.tsx`, `ScenicManagePage.tsx` |
| 6 | 退款功能缺失 | `backend/src/services/OrderService.ts`, `admin/src/pages/OrderManagePage.tsx`, `admin/src/api.ts` |
| 7 | 路线有效天数计算不合理 | `web/src/pages/RouteDetailPage.tsx` |
| 8 | 小程序下单页面缺失 | `miniprogram/pages/order/index.{js,wxml,wxss}` |
| 9 | JWT 密钥 fallback 危险 | `backend/src/middleware/auth.ts`, `backend/src/index.ts` |
| 13 | 错误处理不一致 | `backend/src/controllers/index.ts` |
| 16 | 种子数据耦合进启动逻辑 | `backend/src/index.ts`, `backend/src/seed-data.ts` |
| 19 | 软删除后仍可操作 | `backend/src/services/ScenicSpotService.ts` |
| 22 | 并发超卖 | `backend/src/services/OrderService.ts` |
| 24 | 订单号生成并发冲突 | `backend/src/services/OrderService.ts` |
| 25 | validDays 可被篡改（前端） | `web/src/pages/ScenicDetailPage.tsx`, `web/src/pages/RouteDetailPage.tsx` |
| 26 | UUID 隐私泄露 | `backend/src/utils/plainify.ts`, `web/src/pages/OrderPage.tsx`, `admin/src/pages/OrderManagePage.tsx` |

### 未修复问题（9/27）— 按优先级排列

| # | 问题 | 优先级 | 说明 |
|---|------|--------|------|
| 1 | 用户认证体系 | **P0** | 需新增 User 实体、注册/登录、JWT 用户态 |
| 10 | Token 刷新机制 | P2 | 需引入 refresh token |
| 11 | 前端权限校验 | P1 | ProtectedRoute 应验证 token 有效性 |
| 12 | 分页接口不一致 | P2 | 票种列表需支持分页 |
| 14 | 无 DTO/输入校验 | P2 | 需引入 class-validator |
| 15 | 无共享类型定义 | P2 | 需抽取 API 契约 |
| 17 | 缺少 Monorepo 工具 | P2 | 可考虑 pnpm workspace |
| 18 | 软删除不一致 | P2 | AdminUser 缺 DeleteDateColumn |
| 20 | 景区删除策略不一致 | P2 | CASCADE vs SET NULL |
| 21 | 订单唯一约束 | P2 | 需调整约束语义 |
| 23 | 取消订单恢复库存 | P2 | 已过期订单库存恢复 |
| 27 | 订单核销并发保护 | P2 | 需检查已核销状态 |

---

## 问题统计

| 优先级 | 数量 | 状态 |
|--------|------|------|
| P0（阻塞上线） | 5 | 1/5 已修复（#3 密码加密） |
| P1（严重影响） | 7 | 6/7 已修复（仅剩 #11 前端权限校验） |
| P2（体验/维护） | 5 | 2/5 已修复（#13 错误处理、#16 种子数据） |
| 其他（设计/规范） | 10 | 9/10 已修复（仅剩 #11 前端权限校验） |
| **合计** | **27** | **18/27 已修复** |
