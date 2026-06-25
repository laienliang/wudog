# 乌东文旅订票系统 — 上线前评估报告

> **项目路径**：`G:\桌面\待办作业\软件设计与开发\wudong-code`
> **评估日期**：2026-06-18
> **结论**：演示/测试用途可正常运行，生产上线前需修复若干问题

---

## 评估结论

当前代码在演示和测试场景下可以正常运行。**P0 问题中仅 #2（小程序 baseUrl 未连接）和 #3（购票参数名不匹配）会影响核心流程**，其余 P0 问题属于安全/架构层面的风险，演示场景可接受。

---

## 🔴 P0 — 阻塞上线（演示可暂不修复）

| # | 问题 | 模块 | 文件 | 影响 |
|---|------|------|------|------|
| 1 | 无用户认证体系 | 全栈 | 后端无 User 实体，所有接口通过 `userId` 参数信任客户端 | 演示可用，生产任何人可伪造用户 |
| 2 | 小程序 `request.js` 未连接 baseUrl | 小程序 | `utils/request.js:2` — `BASE = ''` 硬编码为空，未读取 `app.globalData.baseUrl` | **小程序所有请求走相对路径，真机无法连接后端** |
| 3 | 小程序购票参数名不匹配 | 小程序 | `scenic/detail.js:29` / `route/detail.js:23` 传 `orderType=1/2`，但 `order/index.js:28` 检查 `options.buyType` | **从景区/路线详情页点击购买永远无法进入购票模式** |
| 4 | 订单核销并发保护缺失 | 后端 | `OrderService.ts:197-204` — `verifyOrder` 无 `pessimistic_write` 锁 | 高并发下同一订单可被重复核销 |
| 5 | JWT 密钥写入代码库 | 后端 | `.env` 中 `JWT_SECRET=wudong-admin-secret-key-2024` 是弱密钥且提交到版本控制 | 攻击者可伪造管理员 Token |

---

## 🟠 P1 — 严重影响（建议上线前修复）

| # | 问题 | 模块 | 文件 |
|---|------|------|------|
| 6 | Admin 接口无 `plainify` 处理 | 后端 | `controllers/index.ts:203-212` — 返回 TypeORM 内部属性 |
| 7 | 景区管理表单字段类型未转换 | Admin | `ScenicManagePage.tsx:8` — `lat`/`lng`/`sort` 以空字符串发送 |
| 8 | Admin Dashboard 静默吞掉所有错误 | Admin | `DashboardPage.tsx:22` — `.catch(() => {})` 吞掉所有 API 错误 |
| 9 | Web 端 `api.ts` 网络错误崩溃 | Web | `api.ts:8` — `fetch` 失败时 `res.json()` 抛出 TypeError 无 try/catch |
| 10 | Web 端所有列表页无空状态 | Web | `HomePage.tsx`、`ScenicListPage.tsx`、`RouteListPage.tsx` — 数据为空时只显示标题 |
| 11 | 订单号生成非原子 | 后端 | `OrderService.ts:247-255` — 并发下单可能生成重复订单号 |
| 12 | 退款操作无事务保护 | 后端 | `OrderService.ts:185-195` — 恢复库存和更新订单状态不在同一事务 |
| 13 | Admin 缺少 CSS 类 | Admin | `OrderManagePage.tsx:107` 引用 `.btn-warning`，`:118` 引用 `.pagination`，`styles.css` 中未定义 |
| 14 | 小程序 N+1 查询性能问题 | 小程序 | `order/index.js:57-71` — 20 个景区 = 21 次 API 调用 |

---

## 🟡 P2 — 体验/维护（可上线后迭代）

| # | 问题 | 模块 |
|---|------|------|
| 15 | 无速率限制（admin 登录可暴力破解） | 后端 |
| 16 | CORS 开放所有来源 | 后端 `index.ts:68` |
| 17 | `synchronize: true` 在生产环境风险 | 后端 `index.ts:34` |
| 18 | 无全局错误处理中间件 | 后端 |
| 19 | Admin 前端大量 `any` 类型，无类型安全 | `api.ts`、各页面 |
| 20 | Web 前端使用 `window.location` 而非 React Router 导航 | 多个页面 |
| 21 | 小程序无图片加载（列表页全是 CSS 渐变占位） | 小程序 |
| 22 | 密码哈希轮数 10，建议 12+ | `AdminService.ts:6` |
| 23 | 无健康检查（/health 不验证数据库） | 后端 |
| 24 | 无结构化日志、无请求 ID 追踪 | 后端 |

---

## 历史修复记录（18/27 已修复）

| # | 已修复问题 | 文件 |
|---|-----------|------|
| 2 | 门票购买流程断裂 | `web/src/pages/ScenicDetailPage.tsx`, `OrderPage.tsx`, `miniprogram/pages/order/` |
| 3 | 管理员密码明文存储 | `backend/src/services/AdminService.ts` |
| 4 | 订单创建无事务保护 | `backend/src/services/OrderService.ts` |
| 5 | 管理后台编辑功能残缺 | `admin/src/pages/TicketManagePage.tsx`, `RouteManagePage.tsx`, `ScenicManagePage.tsx` |
| 6 | 退款功能缺失 | `backend/src/services/OrderService.ts`, `admin/src/pages/OrderManagePage.tsx` |
| 7 | 路线有效天数计算不合理 | `web/src/pages/RouteDetailPage.tsx` |
| 8 | 小程序下单页面缺失 | `miniprogram/pages/order/index.{js,wxml,wxss}` |
| 9 | JWT 密钥 fallback 危险 | `backend/src/middleware/auth.ts`, `backend/src/index.ts` |
| 13 | 错误处理不一致 | `backend/src/controllers/index.ts` |
| 16 | 种子数据耦合进启动逻辑 | `backend/src/index.ts`, `backend/src/seed-data.ts` |
| 19 | 软删除后仍可操作 | `backend/src/services/ScenicSpotService.ts` |
| 22 | 并发超卖 | `backend/src/services/OrderService.ts` |
| 24 | 订单号生成并发冲突 | `backend/src/services/OrderService.ts` |
| 25 | validDays 可被篡改（前端） | `web/src/pages/ScenicDetailPage.tsx`, `RouteDetailPage.tsx` |
| 26 | UUID 隐私泄露 | `backend/src/utils/plainify.ts`, `web/src/pages/OrderPage.tsx`, `admin/src/pages/OrderManagePage.tsx` |
| 29 | Controller totalPrice 校验 | `backend/src/controllers/index.ts:110`（`!totalPrice` → `typeof` 检查） |

---

## 本次会话操作

- **修复**：后端 `dist/` 编译产物过期，已重新编译 `tsc` 使 `dist/` 匹配 `src/` 最新代码
- **新增**：Controller 第 110 行 `!totalPrice` 误判问题已在源码中修复（`quantity === undefined || quantity === null` + `typeof totalPrice !== "number"`），编译产物已同步

---

## 建议

当前代码用于**演示和测试完全可用**。如需生产上线，优先处理：

1. **P0 #2**：修复小程序 `request.js` 连接 baseUrl
2. **P0 #3**：修复小程序购票参数名 `orderType` → `buyType`
3. **P0 #5**：更换 JWT 密钥，排除 `.env` 到 `.gitignore`
4. **P1 #9**：修复 Web 端 `api.ts` 网络错误处理
5. **P1 #13**：补充 Admin 缺失的 CSS 类
