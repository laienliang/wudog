# 订单列表不可见问题 — 排查与修复计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复小程序用户下单后进入【我的订单】页面看不到新订单的问题（含 Tab 状态残留、userId 不一致、缺失"已支付"Tab 三个根因）。

**Architecture:** 问题涉及两个层面的 bug：(1) 小程序端 Tab 页状态持久化导致 `activeTab` 未重置，`onShow` 时沿用旧过滤条件；(2) 后端 `create` 与 `list` 接口在无鉴权时使用了不一致的 `userId` 回退逻辑，导致订单归属断裂。修复方案是统一 userId 提取逻辑 + 在 `onShow` 重置 Tab 状态 + 补充缺失的"已支付"Tab。

**Tech Stack:** MidwayJS (Koa + TypeORM) 后端，微信小程序 (原生 Page/Component)，MySQL

## 根因分析摘要

| # | 根因 | 严重度 | 文件 |
|---|------|--------|------|
| 1 | Tab 页 `activeTab` 状态残留：`wx.switchTab` 不销毁页面实例，`onShow` 沿用旧 `activeTab` 导致按"已完成"(status=4) 过滤 | 🔴 高 | `miniprogram/pages/order/list.js:10,13` |
| 2 | userId 回退不一致：`create` 用 `contact_phone` 兜底，`list` 用 `1` 兜底，无鉴权时订单归属断裂 | 🔴 高 | `backend/src/modules/lodging/controller/order.ts:24,42` |
| 3 | Tab 栏缺少"已支付"(status=1)筛选项，支付后订单状态为 1 时无法单独筛选 | 🟡 中 | `miniprogram/pages/order/list.wxml:8-12` |
| 4 | `list` 接口 catch 块吞掉异常返回空列表，导致排查困难 | 🟡 中 | `backend/src/modules/lodging/controller/order.ts:46-48` |

## Global Constraints

- 后端端口 3000，小程序 BASE_URL 为 `http://127.0.0.1:3000`
- 订单状态枚举：0-待支付, 1-已支付, 2-已确认, 3-入住中, 4-已完成, 5-已取消, 6-退款中, 7-已退款
- 小程序 Tab 页通过 `wx.switchTab` 导航，页面实例持久化，`onShow` 触发但 `data` 不重置
- 当前系统无真实鉴权中间件，`ctx.currentUser` 通常为 undefined
- 数据库 `booking_order` 表 `user_id` 字段为 bigint

---

### Task 1: 修复后端 userId 回退逻辑不一致（根因 #2）

**Files:**
- Modify: `backend/src/modules/lodging/controller/order.ts:22-48`

**Interfaces:**
- Consumes: 无（首个任务）
- Produces: `OrderController.create()` 和 `OrderController.list()` 使用统一的 userId 提取逻辑 — 当 `ctx.currentUser?.id` 为空时，统一回退到 `1`（不再用 `contact_phone` 作为 userId）

**问题说明：**
`create()` 第 24 行：`(ctx as any).currentUser?.id || body.contact_phone || 1` — 无鉴权时 userId = 手机号字符串（如 `"13800138000"`）。
`list()` 第 42 行：`(ctx as any).currentUser?.id || 1` — 无鉴权时 userId = `1`。
`cancel()` 第 65 行：`(ctx as any).currentUser?.id || 1` — 无鉴权时 userId = `1`。

结果：`create` 创建的订单 `user_id = 13800138000`，而 `list` 查询 `user_id = 1`，查不到订单。

- [ ] **Step 1: 提取私有辅助方法 `getUserId`**

打开 `backend/src/modules/lodging/controller/order.ts`，在 `export class OrderController` 类的顶部（`orderService` 注入之后、`create()` 方法之前）添加：

```ts
  /**
   * 统一获取当前用户 ID。
   * 规则：优先取 JWT 注入的 currentUser.id；无鉴权时统一回退到 1（游客/开发环境）。
   */
  private getUserId(ctx: Context): number {
    const id = (ctx as any).currentUser?.id;
    if (id != null) return Number(id);
    return 1; // 游客或开发环境统一回退
  }
```

- [ ] **Step 2: 修改 `create()` 方法的 userId 提取逻辑**

将第 24 行：
```ts
    const userId = (ctx as any).currentUser?.id || body.contact_phone || 1;
```

替换为：
```ts
    const userId = this.getUserId(ctx);
```

同时删除 `create()` 中对 `body` 参数的 `userId` 依赖——`body` 参数已通过 `@Body() body: OrderCreateDTO` 获取，不需要再从 body 取 userId。修改后的 `create()` 方法签名和首行为：

```ts
  @Post('/orders')
  async create(@Body() body: OrderCreateDTO, ctx: Context) {
    const userId = this.getUserId(ctx);
    // ... 其余不变
```

- [ ] **Step 3: 修改 `list()` 方法的 userId 提取逻辑**

将第 42 行：
```ts
      const userId = (ctx as any).currentUser?.id || 1;
```

替换为：
```ts
      const userId = this.getUserId(ctx);
```

- [ ] **Step 4: 修改 `cancel()` 方法的 userId 提取逻辑**

将第 65 行：
```ts
    const userId = (ctx as any).currentUser?.id || 1;
```

替换为：
```ts
    const userId = this.getUserId(ctx);
```

- [ ] **Step 5: 验证后端编译通过**

```bash
cd backend && npx tsc --noEmit
```

预期：无编译错误。

- [ ] **Step 6: 重启后端服务**

```bash
cd backend && npm run dev
```

预期：服务启动在 3000 端口，无报错。

- [ ] **Step 7: 用 curl 验证 userId 一致性**

创建一个订单，记录返回的 `id`，然后查询列表验证订单可见：

```bash
# 创建订单
curl -s -X POST http://127.0.0.1:3000/api/lodging/orders \
  -H "Content-Type: application/json" \
  -d '{"homestay_id":1,"room_id":1,"check_in_date":"2026-07-15","check_out_date":"2026-07-17","room_count":1,"contact_name":"测试用户","contact_phone":"13800138000","guest_count":2}' | python -m json.tool

# 记住返回的 order id，假设为 123

# 查询订单列表（应包含刚创建的订单）
curl -s "http://127.0.0.1:3000/api/lodging/orders?pageSize=10" | python -m json.tool

# 验证返回的 list 中包含 id=123 的订单
```

- [ ] **Step 8: Commit**

```bash
git add backend/src/modules/lodging/controller/order.ts
git commit -m "fix: unify userId extraction in order controller to prevent order ownership mismatch"
```

---

### Task 2: 修复小程序 Tab 状态残留 + 补充缺失的"已支付"Tab（根因 #1、#3）

**Files:**
- Modify: `miniprogram/pages/order/list.js:8-13`
- Modify: `miniprogram/pages/order/list.wxml:8-12`

**Interfaces:**
- Consumes: Task 1 修复后的 `GET /api/lodging/orders` 接口（userId 一致）
- Produces: `list.js` 在 `onShow` 时将 `activeTab` 重置为 `''`（全部）；`list.wxml` 新增 `data-tab="1"` 的"已支付"筛选项

- [ ] **Step 1: 在 `onShow` 中重置 `activeTab` 为"全部"**

打开 `miniprogram/pages/order/list.js`，将第 13 行的 `onShow` 方法：

```js
  onShow() { this.fetchData(); },
```

修改为：

```js
  onShow() {
    // 每次进入页面默认展示"全部"Tab，避免旧 Tab 筛选条件残留
    // （wx.switchTab 不销毁页面实例，data 保持上次的值）
    this.setData({ activeTab: '' });
    this.fetchData();
  },
```

- [ ] **Step 2: 在 WXML 中新增"已支付"(status=1) Tab**

打开 `miniprogram/pages/order/list.wxml`，在第 9 行（"待支付"Tab）之后、"已确认"Tab 之前，插入"已支付"Tab：

```xml
    <view class="tab-item {{activeTab === '0' ? 'active' : ''}}" bindtap="onTab" data-tab="0">待支付</view>
    <view class="tab-item {{activeTab === '1' ? 'active' : ''}}" bindtap="onTab" data-tab="1">已支付</view>
    <view class="tab-item {{activeTab === '2' ? 'active' : ''}}" bindtap="onTab" data-tab="2">已确认</view>
```

修改后的完整 Tab 栏为：

```xml
  <scroll-view scroll-x class="tab-bar">
    <view class="tab-item {{activeTab === '' ? 'active' : ''}}" bindtap="onTab" data-tab="">全部</view>
    <view class="tab-item {{activeTab === '0' ? 'active' : ''}}" bindtap="onTab" data-tab="0">待支付</view>
    <view class="tab-item {{activeTab === '1' ? 'active' : ''}}" bindtap="onTab" data-tab="1">已支付</view>
    <view class="tab-item {{activeTab === '2' ? 'active' : ''}}" bindtap="onTab" data-tab="2">已确认</view>
    <view class="tab-item {{activeTab === '3' ? 'active' : ''}}" bindtap="onTab" data-tab="3">入住中</view>
    <view class="tab-item {{activeTab === '4' ? 'active' : ''}}" bindtap="onTab" data-tab="4">已完成</view>
  </scroll-view>
```

- [ ] **Step 3: 在微信开发者工具中验证**

操作步骤：
1. 打开小程序，进入【我的订单】页面 → 应默认选中"全部"Tab，显示所有订单
2. 切换到"已完成"Tab → 应只显示 status=4 的订单
3. 切换到"已支付"Tab → 应只显示 status=1 的订单
4. 跳转到下单页，创建一个新订单
5. 在下单成功页点击"查看我的订单"→ 应自动跳转到订单列表，"全部"Tab 选中，新订单在列表顶部
6. 切换到"待支付"Tab → 应能看到刚创建的订单（status=0）

- [ ] **Step 4: Commit**

```bash
git add miniprogram/pages/order/list.js miniprogram/pages/order/list.wxml
git commit -m "fix: reset activeTab onShow and add '已支付' tab to order list"
```

---

### Task 3: 改善 list 接口的错误日志（根因 #4）

**Files:**
- Modify: `backend/src/modules/lodging/controller/order.ts:46-48`

**Interfaces:**
- Consumes: Task 1 修改后的 `OrderController.list()`
- Produces: 错误时打印日志到控制台，便于排查

- [ ] **Step 1: 在 `list()` 的 catch 块中添加 `console.error`**

打开 `backend/src/modules/lodging/controller/order.ts`，找到 `list()` 方法的 catch 块（约第 46-48 行）：

当前代码：
```ts
    } catch (err: any) {
      return { code: 200, message: 'success', data: { total: 0, list: [] } };
    }
```

修改为：
```ts
    } catch (err: any) {
      console.error('[OrderController.list] 查询订单列表失败:', err.message || err);
      return { code: 200, message: 'success', data: { total: 0, list: [] } };
    }
```

- [ ] **Step 2: 对 `adminList()` 的 catch 块做同样处理**

在 `adminList()` 方法的 catch 块（约第 108-110 行）中同样添加日志：

```ts
    } catch (err: any) {
      console.error('[OrderController.adminList] 查询订单列表失败:', err.message || err);
      return { code: 200, message: 'success', data: { total: 0, list: [] } };
    }
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/modules/lodging/controller/order.ts
git commit -m "fix: add error logging to order list endpoints for easier debugging"
```

---

### Task 4: 端到端回归验证

**Files:** 无新建/修改（验证任务）

**Interfaces:**
- Consumes: Task 1-3 的所有修改
- Produces: 验证报告（通过/失败）

- [ ] **Step 1: 清理测试数据（可选）**

```bash
# 如需清空测试订单（谨慎操作）
# mysql -u root -e "DELETE FROM booking_order WHERE contact_name = '测试用户';"
```

- [ ] **Step 2: 场景1 — 下单后立即查看订单列表（全部Tab）**

```bash
# 1. 创建订单
curl -s -X POST http://127.0.0.1:3000/api/lodging/orders \
  -H "Content-Type: application/json" \
  -d '{"homestay_id":1,"room_id":1,"check_in_date":"2026-07-20","check_out_date":"2026-07-22","room_count":1,"contact_name":"回归测试","contact_phone":"13900001111","guest_count":1}'

# 2. 查询全部订单列表
curl -s "http://127.0.0.1:3000/api/lodging/orders?pageSize=10"
```

验证点：第 2 步返回的 `list` 中应包含第 1 步创建的订单（按 id DESC 排序，新订单应在最前面）。

- [ ] **Step 3: 场景2 — 按状态筛选**

```bash
# 查询"待支付"(status=0) 订单
curl -s "http://127.0.0.1:3000/api/lodging/orders?status=0&pageSize=10"

# 查询"已支付"(status=1) 订单（新建订单不在其中，应返回空列表）
curl -s "http://127.0.0.1:3000/api/lodging/orders?status=1&pageSize=10"

# 查询"已完成"(status=4) 订单（新建订单不在其中，应返回空列表）
curl -s "http://127.0.0.1:3000/api/lodging/orders?status=4&pageSize=10"
```

验证点：
- `status=0` 返回包含新订单
- `status=1` 返回空（或只有真正已支付的）
- `status=4` 返回空（或只有真正已完成的）

- [ ] **Step 4: 场景3 — 取消后验证列表不显示已取消订单（状态过滤验证）**

```bash
# 取消订单（替换 123 为实际订单 ID）
curl -s -X POST http://127.0.0.1:3000/api/lodging/order/cancel \
  -H "Content-Type: application/json" \
  -d '{"orderId":123,"reason":"测试取消"}'

# 查询全部订单列表 — 已取消订单仍会显示（只是状态变了）
curl -s "http://127.0.0.1:3000/api/lodging/orders?pageSize=10"
```

验证点：已取消的订单仍在列表中，但 status 变为 5（已取消）或 6（退款中）。

- [ ] **Step 5: 场景4 — 小程序端完整流程验证**

在微信开发者工具中操作：
1. 进入首页 → 选择民宿 → 选择房型 → 填写信息 → 提交订单
2. 下单成功后点击"查看我的订单"
3. 确认跳转到订单列表页，"全部"Tab 默认选中
4. 确认刚创建的订单出现在列表顶部
5. 分别点击各 Tab（待支付/已支付/已确认/入住中/已完成），确认筛选正确
6. 点击订单卡片进入详情页，确认信息正确
7. 返回列表页，确认"全部"Tab 再次默认选中

- [ ] **Step 6: 记录验证结果**

在终端输出验证结果摘要，格式：

```
=== 订单列表可见性修复验证 ===
[PASS/FALL] 场景1: 下单后全部Tab可见
[PASS/FALL] 场景2: 状态筛选正确
[PASS/FALL] 场景3: 取消后列表更新
[PASS/FALL] 场景4: 小程序端完整流程
```

---

### 修改文件汇总

| 文件 | 修改内容 | 对应任务 |
|------|---------|---------|
| `backend/src/modules/lodging/controller/order.ts` | 提取 `getUserId()` 方法，统一 create/list/cancel 的 userId 提取逻辑；添加错误日志 | Task 1, Task 3 |
| `miniprogram/pages/order/list.js` | `onShow` 重置 `activeTab` 为 `''` | Task 2 |
| `miniprogram/pages/order/list.wxml` | 新增 `data-tab="1"` 的"已支付"Tab | Task 2 |

