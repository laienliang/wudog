# 测试、部署与交付

---

## 一、AI 辅助测试

### 1.1 测试策略

本项目采用轻量级的 API 测试策略，通过 curl 命令模拟 HTTP 请求，逐个验证后端 API 端点的正确性。AI 在测试用例生成、测试执行和结果分析三个环节提供了辅助。

```
测试金字塔（本项目适用层级）：

        ╱╲
       ╱  ╲          E2E 测试（少量）
      ╱    ╲         模拟完整业务流程
     ╱──────╲
    ╱        ╲        API 测试（大量）
   ╱          ╲       curl 验证每个端点
  ╱──────────────╲
 ╱                ╲    单元测试（缺失，待补充）
╱                  ╲  Jest + Midway Test
────────────────────
```

> **说明：** 由于时间限制，本项目重点覆盖了 API 测试层，单元测试层目前缺失，计划后续补充。

### 1.2 AI 生成测试用例

AI 根据 API 接口定义自动生成对应的 curl 测试命令。以商品模块为例：

```bash
# AI 生成的测试用例集

# 1. 商品列表（默认分页）
curl -s "http://localhost:7001/api/v1/products"
# 期望：返回 code=200，data.list 为数组，data.pagination 包含 total/page/pageSize

# 2. 商品列表（带搜索关键词）
curl -s "http://localhost:7001/api/v1/products?keyword=苗绣"
# 期望：只返回名称包含"苗绣"的商品

# 3. 商品列表（按分类筛选）
curl -s "http://localhost:7001/api/v1/products?categoryId=1"
# 期望：只返回分类ID为1的商品

# 4. 商品详情（有效ID）
curl -s "http://localhost:7001/api/v1/products/1"
# 期望：返回单个商品对象，包含 SKU 列表

# 5. 商品详情（无效ID）
curl -s "http://localhost:7001/api/v1/products/99999"
# 期望：返回 code=404，message 包含"商品不存在"

# 6. SKU 列表
curl -s "http://localhost:7001/api/v1/products/1/skus"
# 期望：返回数组，每项包含 name/price/stock

# 7. 评价列表
curl -s "http://localhost:7001/api/v1/products/1/reviews"
# 期望：返回分页的评价列表

# 8. 分类列表
curl -s "http://localhost:7001/api/v1/products/categories"
# 期望：返回分类数组
```

### 1.3 测试用例组织方式

测试用例按模块组织，存放在项目文档中，每个新功能开发完成后立即运行对应的测试用例：

```bash
# 测试脚本示例（直接执行）
echo "=== 1. 商品列表 ==="
curl -s "http://localhost:7001/api/v1/products?page=1&pageSize=3" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    const r = JSON.parse(d);
    console.log('状态:', r.code === 200 ? '✅' : '❌');
    console.log('商品数:', r.data?.list?.length);
    console.log('总数:', r.data?.pagination?.total);
  });
"

echo "=== 2. 民宿列表 ==="
curl -s "http://localhost:7001/api/v1/homestays" | node -e "
  let d='';
  process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{
    const r = JSON.parse(d);
    console.log('状态:', r.code === 200 ? '✅' : '❌');
    console.log('民宿数:', r.data?.list?.length);
    r.data?.list?.forEach(h => console.log('  -', h.name, '¥'+h.min_price));
  });
"
```

### 1.4 集成测试脚本

对于核心业务流程，编写了端到端的集成测试脚本：

```bash
# 完整下单流程测试
echo "=== 完整下单流程 ==="

# Step 1: 用户登录
TOKEN=$(curl -s -X POST "http://localhost:7001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138001","password":"123456"}' | node -e "
  let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
    try{console.log(JSON.parse(d).data.accessToken)}catch(e){console.log('')}
  });
")

echo "登录Token: ${TOKEN:0:20}..."

# Step 2: 获取商品列表
PRODUCT_ID=$(curl -s "http://localhost:7001/api/v1/products?page=1&pageSize=1" | node -e "
  let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
    try{console.log(JSON.parse(d).data.list[0].id)}catch(e){console.log(1)}
  });
")
echo "商品ID: $PRODUCT_ID"

# Step 3: 加入购物车
CART_RESULT=$(curl -s -X POST "http://localhost:7001/api/v1/cart/add" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"userId\":1,\"productId\":$PRODUCT_ID,\"quantity\":1}")
echo "加购结果: $CART_RESULT"

# Step 4: 创建订单
ORDER_RESULT=$(curl -s -X POST "http://localhost:7001/api/v1/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"userId\":1,\"itemIds\":[$PRODUCT_ID]}")
echo "下单结果: $ORDER_RESULT"
```

---

## 二、AI 发现的业务逻辑漏洞

在实际开发过程中，AI 通过代码审查和测试发现了一批典型的业务逻辑漏洞。以下按严重程度列出：

### 2.1 严重漏洞（Critical）

| # | 漏洞描述 | 发现方式 | 根因分析 | 修复方案 |
|:-:|:---------|:---------|:---------|:---------|
| 1 | **JSON字段.map()报错**：前端调用 `v.map()` 时报 `TypeError: v.map is not a function` | 页面白屏报错 | 数据库 `simple-json` 类型字段（cuisineTags、facilities、permissions）通过 TypeORM 查询或原生 SQL 返回原始 JSON 字符串，不是数组。`v?.length` 对字符串返回 true，但字符串没有 `.map()` 方法 | 前端渲染时增加 `Array.isArray(v) ? v : (typeof v === 'string' ? JSON.parse(v) : [])` 防御性判断 |
| 2 | **财务页表格为空**：财务结算页面显示空白列 | UI 检查 | 后端 API 返回的字段名为 `shopName`、`amount`、`platformFee`，但前端 ProTable 的 dataIndex 使用了 `merchantName`、`totalAmount`、`commission`，前后端字段名不匹配 | 将 dataIndex 统一改为 `shopName`、`amount`、`platformFee` |
| 3 | **角色删除失败**：角色管理页面点击删除后无响应 | 功能测试 | 前端调用了 `DELETE /api/v1/admin/roles/:id`，但后端 Controller 中没有定义 `@Del('/roles/:id')` 路由 | 后端新增 `deleteRole` 方法 + `@Del` 路由 |
| 4 | **Seed 密码无法登录**：默认管理员密码无效 | 登录测试 | seed.sql 中的 bcrypt hash 是手动构造的占位符 `$2a$12$...`，不是真实的 bcrypt 输出，`bcrypt.compare('admin123', hash)` 返回 false | 使用 Node.js 的 `bcrypt.hashSync('admin123', 12)` 重新生成真实 hash |

### 2.2 重要漏洞（Important）

| # | 漏洞描述 | 发现方式 | 修复方案 |
|:-:|:---------|:---------|:---------|
| 5 | **数据统计口径不一致**：看板总订单=4，统计总订单=16 | UI 对比 | 统一口径：总订单数统计全部订单，已支付订单作为独立指标展示 |
| 6 | **分页总数不准确**：搜索时总记录数未按关键词过滤 | 代码审查 | COUNT 查询也加上 keyword WHERE 条件 |
| 7 | **配置读取格式错误**：系统配置返回数组，前端当对象用 | 功能测试 | 前端将数组转为 key-value 映射对象 |
| 8 | **财务收入计算错误**：平台收入=所有订单总额（含未支付） | 代码审查 | 只统计 paid/confirmed/completed 状态的订单，并按模块抽佣比例计算 |
| 9 | **游客管理 500 错误**：用户列表页面报服务器内部错误 | 页面测试 | wd_user 表没有 status 列，SQL 查询了不存在的字段，改用 `IF(deleted_at IS NULL, 1, 0)` 模拟状态 |
| 10 | **商家状态显示未知**：商家管理页面状态列显示"未知" | UI 检查 | ProTable 的 valueType:select 导致 render 函数接收到的 v 值被转换，改用 `record.status` 取值 |

### 2.3 发现漏洞的流程

以漏洞 #6（分页总数不准确）为例，展示完整的发现和修复流程：

```
Step 1: 代码审查
审查 Agent 读取 listUsers 方法的代码：

  async listUsers(query: any) {
    let sql = 'SELECT ... FROM wd_user WHERE deleted_at IS NULL';
    if (keyword) { sql += ' AND (nickname LIKE ? OR phone LIKE ?)'; }
    // data query ✓ 带 keyword 过滤

    const countResult = await this.adminModel.query(
      'SELECT COUNT(*) AS total FROM wd_user WHERE deleted_at IS NULL',
      [],  // ← 问题：COUNT 查询始终没有 keyword 过滤
    );
  }

Step 2: 审查 Agent 标记为 Important 问题
"listUsers COUNT query does not include the keyword filter"

Step 3: Fix Agent 修复
  let countSql = 'SELECT COUNT(*) AS total FROM wd_user WHERE deleted_at IS NULL';
  const countParams: any[] = [];
  if (keyword) {
    countSql += ' AND (nickname LIKE ? OR phone LIKE ?)';
    countParams.push(`%${keyword}%`, `%${keyword}%`);
  }
  const countResult = await this.adminModel.query(countSql, countParams);

Step 4: Re-review 确认修复通过
```

---

## 三、项目部署流程

### 3.1 本地开发环境部署

#### 前提条件

```
Node.js >= 18.0.0
pnpm >= 8.0.0
MySQL >= 8.0
Redis >= 3.0
```

#### 部署步骤

```bash
# Step 1: 克隆代码
git clone https://gitee.com/hong-dailing/wudong-platform.git
cd wudong-platform

# Step 2: 安装依赖
pnpm install

# Step 3: 创建数据库
mysql -u root -p
CREATE DATABASE wudong_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Step 4: 导入表结构（手动建表）
# 说明：TypeORM synchronize 已关闭，需要手动创建表
# 方式一：临时开启 synchronize=true 启动一次后关闭
# 方式二：执行项目中的 migration SQL 文件

# 临时开启同步建表（仅首次）
# 修改 packages/server/src/config/config.default.ts:
#   synchronize: false → synchronize: true
# 启动后端 → 自动建表 → 关闭 → 改回 false

# Step 5: 导入种子数据
mysql -u root -p wudong_platform < scripts/seed.sql

# Step 6: 启动后端服务
cd packages/server
pnpm dev
# 服务启动在 http://localhost:7001

# Step 7: 启动 PC 前端（新终端窗口）
cd packages/web-pc
pnpm dev
# 服务启动在 http://localhost:3000

# Step 8: 启动管理后台（新终端窗口）
cd packages/web-admin
pnpm dev
# 服务启动在 http://localhost:3001

# Step 9: 启动 Redis（如需）
redis-server
```

#### 验证部署

```bash
# 验证后端
curl http://localhost:7001/api/v1/products
# 预期返回: {"code":200,"data":{...}}

# 验证 PC 前端
curl http://localhost:3000
# 预期返回: HTML 页面

# 验证管理后台
curl http://localhost:3001
# 预期返回: HTML 页面
```

### 3.2 各服务端口一览

| 服务 | 端口 | 访问地址 |
|:----|:----:|:---------|
| 后端 API | 7001 | http://localhost:7001 |
| PC 网页端 | 3000 | http://localhost:3000 |
| 管理后台 | 3001 | http://localhost:3001 |
| MySQL | 3306 | localhost:3306 |
| Redis | 6379 | localhost:6379 |

### 3.3 默认账号

| 角色 | 用户名 | 密码 | 说明 |
|:----|:------|:----:|:------|
| 管理员 | admin | admin123 | 管理后台登录（http://localhost:3001） |
| 普通用户 | 13800138001 | 123456 | PC端登录（http://localhost:3000） |

### 3.4 Vite 代理配置

前后端分离架构下，前端开发服务器通过 Vite proxy 解决跨域问题：

```typescript
// packages/web-pc/vite.config.ts 和 packages/web-admin/vite.config.ts
export default defineConfig({
  server: {
    port: 3000,  // PC端用3000，管理后台用3001
    proxy: {
      '/api': {
        target: 'http://localhost:7001',  // 所有 /api 请求转发到后端
        changeOrigin: true,
      },
    },
  },
});
```

### 3.5 数据库配置文件

```typescript
// packages/server/src/config/config.default.ts
export default (appInfo: any) => {
  return {
    orm: {
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '050228hdl',
      database: process.env.DB_NAME || 'wudong_platform',
      charset: 'utf8mb4',
      synchronize: false,
      logging: false,
      dateStrings: true,
      entities: ['**/entity/*.entity.{ts,js}'],
    },

    jwt: {
      secret: process.env.JWT_SECRET || 'wudong-dev-secret-key',
      accessTokenExpiresIn: '7d',
      refreshTokenExpiresIn: '30d',
    },

    redis: {
      client: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || '',
        db: 0,
      },
    },
  };
};
```

### 3.6 项目依赖关系

```
wudong-platform (根 Monorepo)
│
├── packages/server（后端）
│   ├── midway.js + typeorm
│   ├── 6 大业务模块 + 4 公共服务
│   ├── 依赖：MySQL + Redis
│   └── 启动：pnpm dev:server → 7001
│
├── packages/web-pc（PC端）
│   ├── react 18 + antd 5.x
│   ├── 10+ 页面（首页/商品/餐饮/民宿/出行/社区/购物车/订单）
│   ├── 依赖：后端 API（通过 Vite proxy）
│   └── 启动：pnpm dev:web-pc → 3000
│
├── packages/web-admin（管理后台）
│   ├── react 18 + antd pro + echarts
│   ├── 20+ 管理页面（登录/看板/用户/商家/订单/运营/系统）
│   ├── 依赖：后端 API（通过 Vite proxy）
│   └── 启动：pnpm dev:web-admin → 3001
│
└── packages/mini-program（小程序）
    ├── 微信原生框架
    ├── 5+ 页面（首页/商品/社区/购物车/我的）
    ├── 依赖：后端 API（直接请求 127.0.0.1:7001）
    └── 启动：微信开发者工具
```

---

## 四、Git 版本控制

### 4.1 分支策略

本项目采用简单的分支策略：

```
master（主分支）
  └── module/admin-platform（功能分支：模块6开发）
       ├── 110+ 次提交
       └── 开发完成后合并回 master
```

### 4.2 提交规范

每次提交遵循 conventional commits 格式：

```
<type>(<scope>): <description>

类型说明：
feat:    新功能
fix:     修复 bug
style:   样式调整（UI 美化）
refactor: 代码重构
docs:    文档更新
chore:   构建/配置/工具
```

**典型提交示例：**

```
feat(admin): add user/merchant/role management pages
fix(admin): roles.tsx permissions.map crash when permissions is a string
style(dashboard): unify color palette with product management page
refactor(pc): CSS grid layout restructure for alignment
docs: add course design report
chore: seed merchant data from existing restaurants
```

### 4.3 提交统计

| 指标 | 数据 |
|:----|:----:|
| 总提交次数 | 110+ |
| feat 类型 | ~60% |
| fix 类型 | ~20% |
| style 类型 | ~10% |
| docs 类型 | ~5% |
| refactor 类型 | ~5% |
| 分支数 | 2（master + module/admin-platform） |

---

## 五、交付物清单

| 交付物 | 路径 | 说明 |
|:-------|:-----|:------|
| 源代码 | `wudong-platform/` | 完整 Monorepo 代码 |
| 数据库脚本 | 表结构由 TypeORM 实体自动生成 | 实体文件：`packages/server/src/modules/*/entity/*.entity.ts` |
| 种子数据 | `packages/server/src/modules/admin/seed.sql` | 默认管理员、角色、配置 |
| 接口文档 | 基于 Swagger 自动生成 | 访问 `http://localhost:7001/swagger-ui` |
| 测试报告 | 本文档 | API 测试用例 + 发现的问题修复记录 |
| 部署说明 | 本文档第3节 | 本地开发环境部署步骤 |
| 演示视频 | 待录制 | 3-5 分钟核心功能流程 |
| 项目总结报告 | `docs/course-design-report.md` | 完整项目总结 |
