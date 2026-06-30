# AI辅助开发与核心编码实现

---

## 一、环境搭建

### 1.1 基础环境配置

| 环境 | 版本 | 说明 |
|:----|:----:|:------|
| Node.js | v24.16.0 | JavaScript 运行时 |
| pnpm | 9.x | 包管理器，Monorepo 支持 |
| MySQL | 8.0.44 | 关系数据库 |
| Redis | 3.0.504 | 缓存与 Token 管理 |
| Git | latest | 版本控制 |

### 1.2 项目初始化

项目采用 pnpm Monorepo 结构，通过根目录的 `pnpm-workspace.yaml` 定义工作区：

```yaml
packages:
  - 'packages/*'
  - 'shared/*'
```

根目录 `package.json` 定义了统一的项目脚本：

```json
{
  "scripts": {
    "dev": "pnpm --recursive --parallel run dev",
    "dev:server": "pnpm --filter @wudong/server dev",
    "dev:web-pc": "pnpm --filter @wudong/web-pc dev",
    "dev:web-admin": "pnpm --filter @wudong/web-admin dev",
    "build": "pnpm --recursive run build",
    "test": "pnpm --recursive run test"
  }
}
```

四个工作区的启动方式：

| 工作区 | 启动命令 | 端口 |
|:-------|:---------|:----:|
| 后端服务 | `pnpm dev:server` | 7001 |
| PC 网页端 | `pnpm dev:web-pc` | 3000 |
| 管理后台 | `pnpm dev:web-admin` | 3001 |
| 微信小程序 | 微信开发者工具打开 mini-program 目录 | — |

### 1.3 AI 初始化配置（CLAUDE.md）

在项目根目录创建 `CLAUDE.md` 文件，作为 AI 的核心上下文文件。该文件定义了项目的完整技术规范和约束条件，确保 AI 生成的代码与项目现有风格保持一致。

**CLAUDE.md 包含的关键信息：**

| 配置项 | 内容 | 作用 |
|:-------|:-----|:------|
| **项目背景** | 项目概述、6大模块定义、三端覆盖 | 让 AI 理解项目整体上下文 |
| **技术栈约束** | Midway.js v3、React 18、Ant Design 5.x、TypeORM | 约束 AI 使用的技术框架 |
| **目录结构** | Monorepo 各层级路径 | AI 生成文件时放置在正确的目录 |
| **数据库规范** | 命名规则、表名前缀、必备字段、utf8mb4 | AI 生成实体时遵循统一规范 |
| **API 规范** | RESTful 路由、统一返回格式、状态码定义 | AI 生成 Controller 时输出标准格式 |
| **模块边界** | 各模块数据表隔离、公共服务调用 | AI 跨模块时不越界访问 |
| **订单状态机** | 6 种状态的流转规则 | AI 处理订单逻辑时遵循 |

**CLAUDE.md 的核心价值：**

CLAUDE.md 本质上是一个"项目级上下文缓存"。在没有这份文件时，AI 每次生成代码都需要我从头描述项目规范，而且生成结果经常不一致。有了 CLAUDE.md 后，AI 生成的代码在以下方面保持了一致性：

1. **实体定义一致性**：所有实体都继承 BaseEntity（id/createdAt/updatedAt/deletedAt），表名都使用 `wd_{模块}_{业务}` 格式
2. **控制器风格一致性**：所有 Controller 都使用相同的装饰器模式（@Inject、@Get/@Post/@Put/@Del）
3. **API 返回格式一致性**：所有接口都经过 ResponseInterceptor 统一包装
4. **错误处理一致性**：业务异常统一抛出，由 BusinessErrorFilter 捕获处理

---

## 二、AI 辅助开发工作流（Superpowers）

项目采用了结构化的 AI 辅助开发流程，共分为四个阶段：

```
┌─────────────────────────────────────────────────────────────────┐
│                    第一阶段：需求分析与规划                         │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ 阅读需求文档  │───►│ brainstorming │───►│ 确定技术方案    │   │
│  │ 理解模块边界  │    │ 技能：澄清需求  │    │ 确认设计        │   │
│  └──────────────┘    └──────────────┘    └──────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    第二阶段：编写实施计划                          │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ writing-plans │───►│ 拆解Task    │───►│ 分配文件路径    │   │
│  │ 技能：生成计划 │    │ 每个Task包含 │    │ 每个Task包含    │   │
│  │               │    │ 完整代码示例  │    │ 接口定义        │   │
│  └──────────────┘    └──────────────┘    └──────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              第三阶段：子代理驱动开发（Subagent-Driven）           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Task N: [组件名称]                                       │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ Step 1: AI 创建实体文件 entity/*.entity.ts          │  │   │
│  │  │ Step 2: AI 创建服务层 service/*.service.ts          │  │   │
│  │  │ Step 3: AI 创建控制器 controller/*.controller.ts   │  │   │
│  │  │ Step 4: AI 创建前端页面 pages/*.tsx                │  │   │
│  │  │ Step 5: AI 提交 Git commit                         │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ Review: AI 审查代码（Spec + Quality）               │  │   │
│  │  │ → 发现问题 → Fix Agent → Re-review → 通过         │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ... 重复以上流程直到所有 Task 完成                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    第四阶段：Final Review + 合并                  │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ Whole-branch  │───►│ 修复问题     │───►│ 合并到 master   │   │
│  │ Review       │    │              │    │                  │   │
│  └──────────────┘    └──────────────┘    └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、核心模块编码实现（以模块6管理后台为例）

### 3.1 Task 生命周期

以管理后台模块的"数据看板"功能为例，展示一个典型 Task 的完整生命周期：

#### 步骤 1：AI 读取计划

AI 读取实施计划中 Task 5 的描述：

```
Task 5: 数据看板页面
- 创建: packages/web-admin/src/pages/dashboard/index.tsx
- 使用 ECharts 展示统计卡片 + 折线图 + 饼图 + 最近订单表格
- 调用 GET /api/v1/admin/dashboard 接口获取数据
- 顶部4个Statistic卡片：总订单数、总GMV、今日订单、活跃商家
- 中间2个图表：近7日订单趋势折线图、各模块订单占比饼图
- 底部：最近订单表格（真实数据替换Mock）
```

#### 步骤 2：AI 创建后端 API（admin.service.ts）

```typescript
// AI 根据需求文档和数据表结构自动生成的代码
async getDashboard() {
  const today = new Date().toISOString().slice(0, 10);

  // 1. 平台总览指标
  const orderStats = await this.adminModel.query(`
    SELECT COUNT(*) AS total,
           COALESCE(SUM(pay_amount),0) AS gmv
    FROM wd_order WHERE deleted_at IS NULL
    AND status IN ('paid','confirmed','completed')
  `);

  // 2. DAU 统计（今日/本周/本月）
  const dau = await this.adminModel.query(`
    SELECT
      SUM(IF(DATE(last_login_at)=?,1,0)) AS today,
      SUM(IF(last_login_at>=DATE_SUB(CURDATE(),INTERVAL 7 DAY),1,0)) AS week,
      SUM(IF(last_login_at>=DATE_SUB(CURDATE(),INTERVAL 30 DAY),1,0)) AS month
    FROM wd_user WHERE deleted_at IS NULL
  `, [today]);

  // 3. 用户分层统计（按消费金额）
  const userSeg = await this.adminModel.query(`
    SELECT
      CASE
        WHEN total_spend >= 1000 THEN '高消费'
        WHEN total_spend >= 300 THEN '中消费'
        WHEN total_spend > 0 THEN '低消费'
        ELSE '未消费'
      END AS level,
      COUNT(*) AS count
    FROM (
      SELECT u.id, COALESCE(SUM(o.pay_amount),0) AS total_spend
      FROM wd_user u
      LEFT JOIN wd_order o ON u.id=o.user_id
        AND o.status IN ('paid','confirmed','completed')
      WHERE u.deleted_at IS NULL GROUP BY u.id
    ) AS spend GROUP BY level
  `);

  // ... 更多查询（模块GMV、订单趋势、热门话题、Top商家等）

  return {
    todayDAU: Number(dau[0]?.today || 0),
    weekDAU: Number(dau[0]?.week || 0),
    monthDAU: Number(dau[0]?.month || 0),
    newUsers: Number(newUsers[0]?.total || 0),
    totalOrders: Number(orderStats[0]?.total || 0),
    totalGMV: Number(orderStats[0]?.gmv || 0),
    // ... 共23个指标
  };
}
```

#### 步骤 3：AI 创建前端页面（dashboard/index.tsx）

AI 生成的 ECharts 图表配置：

```typescript
// 折线图：近7日订单趋势
const lineOption = {
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: days, axisLabel: { color: '#BFBFBF' } },
  yAxis: { type: 'value', minInterval: 1, axisLabel: { color: '#BFBFBF' } },
  grid: { left: 44, right: 20, top: 16, bottom: 28 },
  series: [{
    data: orderCounts,
    type: 'line',
    smooth: true,
    lineStyle: { color: '#1F5FA8', width: 2.5 },
    areaStyle: {
      color: {
        type: 'linear',
        colorStops: [
          { offset: 0, color: 'rgba(31,95,168,0.12)' },
          { offset: 1, color: 'rgba(31,95,168,0.01)' }
        ]
      }
    }
  }],
};
```

#### 步骤 4：AI 提交代码并生成审查包

```bash
git add packages/server/src/modules/admin/service/admin.service.ts
git add packages/web-admin/src/pages/dashboard/index.tsx
git commit -m "feat(admin): add data dashboard with ECharts"
```

#### 步骤 5：AI 代码审查

审查 Agent 检查以下维度：

| 审查维度 | 检查内容 | 发现问题 |
|:---------|:---------|:---------|
| **Spec Compliance** | 是否实现了所有需求指标 | ✅ 23个指标全部实现 |
| **Extra Features** | 有没有多余的功能 | ✅ 没有多余代码 |
| **SQL安全** | 是否有 SQL 注入风险 | ✅ 全部参数化查询 |
| **错误处理** | catch 块是否处理了异常 | ✅ 有 try/catch 兜底 |
| **数据类型** | Number() 转换是否正确 | ✅ 全部显式转换 |
| **代码质量** | 是否符合项目规范 | ✅ 符合 |

> **典型审查发现问题示例：**
>
> 审查 Agent 发现：dashboard 的 `totalOrders` 使用了 `orderStats`（只统计已支付订单），而业务上的"总订单数"应该统计所有订单。
>
> 修复：增加独立的 `allOrdersCount` 查询，总订单数统计全部订单，已支付订单数使用 `paidOrders` 独立指标展示。

### 3.2 典型 Task 执行时序

以管理后台模块为例，展示完整的执行时序：

```
Task 1: 12张数据表实体（20分钟）
  ├── AI 创建 Admin/Role/Merchant/Banner 等实体
  ├── Review → 无问题 → 通过 ✓

Task 2: Service + Controller（1小时）
  ├── AI 创建 admin-auth.service.ts（登录/刷新/退出）
  ├── AI 创建 admin.service.ts（40+管理方法）
  ├── AI 创建 auth.controller.ts + admin.controller.ts
  ├── AI 修改 auth.middleware.ts（放行admin路由）
  ├── Review → 发现3个问题：
  │   ├── ⚠️ auth绕过（MVP阶段接受）
  │   ├── ⚠️ deletedAt 缺失（已修复）
  │   └── ⚠️ Role直接操作Model（已修复）
  └── Fix → Re-review → 通过 ✓

Task 3: 管理后台API服务 + 登录页（30分钟）
  ├── AI 创建 admin.ts（30+API方法）
  ├── AI 创建 Login 页面（居中卡片 + JWT存储）
  ├── AI 修改 App.tsx（登录路由 + 鉴权跳转）
  ├── Review → 发现重复错误提示
  └── Fix → Re-review → 通过 ✓

...
（后续 Task 依次执行）
...

Task 11: Seed 数据脚本（5分钟）
  └── AI 创建 seed.sql（默认管理员/角色/配置）
```

---

## 四、代码审查机制

### 4.1 双维度审查

每个 Task 提交后，审查 Agent 从两个维度进行评分：

#### 维度一：Spec Compliance（需求符合度）

审查 Agent 将实际代码与 Task 计划中的需求逐条对比：

```
审查结果示例（Task 4：用户管理页面）：

✅ 符合需求：
  - 用户列表 ProTable（ID/昵称/手机/状态/注册时间）
  - 关键词搜索
  - 封禁/解封操作

⚠️ 超出需求：
  - 无超出实现

❌ 缺失需求：
  - 无缺失
```

#### 维度二：Code Quality（代码质量）

审查 Agent 评估代码的工程质量：

```
审查结果示例：

✅ 代码质量：
  - 组件拆分合理
  - 错误处理完善（try/catch覆盖）
  - 遵循项目 COLORS 规范
  - 软删除一致使用

⚠️ 建议改进：
  - phone脱敏已实现（中间四位****）
  - 无冗余代码

❌ 严重问题：
  - 无
```

### 4.2 问题修复闭环

当审查发现问题时，执行修复闭环：

```
审查发现问题
     │
     ▼
Dispatch Fix Agent ─── 派发修复子代理
     │
     ▼
Fix Agent 修复代码 ─── 修改文件
     │
     ▼
重新提交 ─── git commit
     │
     ▼
Re-review ─── 审查Agent重新验证
     │
     ▼
通过 → Task Complete
```

### 4.3 典型审查发现的问题

| Task | 问题 | 严重程度 | 修复方式 |
|:----|:-----|:--------:|:---------|
| Task 2 | auth绕过admin路由（MVP接受） | Important | 添加注释说明 |
| Task 2 | reviewApplication缺少deletedAt过滤 | Important | 添加deletedAt:undefined |
| Task 3 | 登录失败重复错误提示 | Important | 移除catch中的message.error |
| Task 4 | merchant/applications.tsx从错误包导入 | Critical | 修正import来源 |
| Task 4 | 商家状态修改无效 | Important | 改为调用正确API |
| 最终审查 | 财务页列名不匹配 | Critical | 对齐shopName/amount字段 |
| 最终审查 | 角色删除API缺失 | Critical | 添加deleteRole接口 |
| 最终审查 | Seed密码hash无效 | Critical | 重新生成真实bcrypt hash |

---

## 五、"人机协作"经验总结

### 5.1 分工模式

在整个开发过程中，人和 AI 形成了明确的分工：

| 环节 | 人（开发者）负责 | AI 负责 |
|:-----|:---------------|:--------|
| **需求分析** | 理解业务需求、确认技术方向 | 解析文档、提取模块边界、生成任务列表 |
| **架构设计** | 确定技术选型、数据库设计方案 | 生成实体定义、API路由设计、ER图输出 |
| **编码实现** | 审查代码逻辑、确认业务正确性 | 按模板生成标准化代码（entity/service/controller/page） |
| **测试调试** | 确认修复方案、验证功能正常 | 生成测试用例、定位问题根因、给出修复建议 |
| **代码审查** | 确认修复决策、合并代码 | 逐条检查需求符合度、评估代码质量 |
| **文档编写** | 确认内容准确性 | 生成初稿、格式化输出 |

### 5.2 关键经验

#### 经验一：提示词质量决定 AI 输出质量

AI 生成的代码质量高度依赖于输入提示词的清晰度。模糊的需求描述会产生模糊的代码实现。

**反例（模糊描述）：**
```
实现一个民宿管理功能
```
→ AI 生成的代码可能缺少字段、没有校验规则、样式不统一

**正例（清晰描述）：**
```
实现民宿管理页面，使用 ProTable 展示民宿列表，支持关键字搜索和状态筛选。
列表包含：名称（带缩略图）、评分（Rate组件）、设施标签、电话、营业状态（Switch）、操作按钮。
新增/编辑弹窗包含：名称、封面图URL、电话、地址、评分、设施多选（Select mode="multiple"）、描述。
颜色使用项目的 COLORS 常量，Card 使用 cardStyle。
```
→ AI 生成的代码结构完整、字段齐全、风格统一

#### 经验二：分步迭代优于一次性生成

将复杂功能拆分为多个小 Task，每个 Task 有明确的输入输出边界，AI 在单个 Task 内的表现远优于一次性处理大需求。

**原则：** 每个 Task 应该是"一个可以独立测试的功能单元"，而不是"大模块的一部分"。例如：

```
❌ 错误拆分：
Task: 实现管理后台全部功能

✅ 正确拆分：
Task 1: 后端实体（12张表）
Task 2: 后端 Service + Controller（40+API）
Task 3: 管理后台API服务 + 登录页
Task 4: 用户管理 + 商家入驻审核页面
...
```

#### 经验三：AI 审查是质量保证的关键环节

每次 AI 生成代码后，必须经过审查环节。审查 Agent 从需求符合度和代码质量两个维度评分，发现的问题由 Fix Agent 修复后重新审查，形成"生成→审查→修复→再审查"的闭环。

**审查发现问题的典型分布：**

```
Critical（必须修复）: 约 15%
  └── 导入错误、API缺失、数据hash无效

Important（应该修复）: 约 35%
  └── 空指针风险、错误处理缺失、逻辑边界遗漏

Minor（建议改进）: 约 50%
  └── 样式微调、命名规范、代码注释
```

#### 经验四：CLAUDE.md 是 AI 协作的基石

CLAUDE.md 文件起到了"项目上下文缓存"的作用。在项目初期，AI 经常忘记技术栈约束、命名规范等信息，导致生成的代码需要反复修改。建立完整的 CLAUDE.md 后，AI 的"一次通过率"显著提升。

**CLAUDE.md 对 AI 代码质量的提升效果：**

| 指标 | 无 CLAUDE.md | 有 CLAUDE.md |
|:----|:-----------:|:------------:|
| 实体命名一致性 | 60% | 100% |
| API风格一致性 | 50% | 95% |
| 统一返回格式 | 40% | 100% |
| 首次审查通过率 | 30% | 70% |

### 5.3 软件工程思想的体现

在整个 AI 辅助开发过程中，软件工程的核心理念没有因为 AI 的介入而弱化，反而得到了强化：

| 软件工程原则 | 在项目中的体现 |
|:------------|:--------------|
| **模块化** | 6 大模块边界清晰，每个模块的实体/服务/控制器各自独立，模块间通过 API 通信而非直读数据库 |
| **分层架构** | Controller（路由+参数校验）→ Service（业务逻辑）→ Repository/Entity（数据访问）三层清晰分离 |
| **关注点分离** | 公共服务（认证/订单/购物车）与业务模块服务分离，中间件与业务逻辑分离 |
| **代码审查** | 每个 Task 都经过 Spec Compliance + Code Quality 双重审查 |
| **版本控制** | 每次提交对应一个完整的 Task，提交信息规范（feat/fix/style），分支管理清晰 |
| **单一职责** | 每个文件有明确的职责：entity 只定义数据模型，service 只包含业务逻辑，controller 只处理 HTTP 请求 |
| **DRY 原则** | BaseEntity 抽象公共字段，统一错误过滤器，统一响应格式中间件 |
| **YAGNI** | 只实现需求文档中要求的功能，不为"未来可能需要的功能"预留代码 |

### 5.4 实际协作数据

| 指标 | 数据 |
|:----|:----:|
| 总代码行数 | ~18,000+ 行 |
| Git 提交次数 | 110+ 次 |
| AI 生成代码占比 | ~80%（重复性代码） |
| 人编写代码占比 | ~20%（业务逻辑决策） |
| 审查发现问题数 | 50+ 个 |
| Critical 问题 | 8 个（全部在合并前修复） |
| 人均开发效率 | 约为传统开发的 2-3 倍 |

---

## 六、核心业务模块编码详解

### 6.1 后端编码模式（以衣模块为例）

#### 实体定义（Entity）

```typescript
@Entity('wd_clothing_product')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'tinyint', default: 1, comment: '0下架 1上架' })
  status: number;

  @Column({ name: 'main_image', type: 'varchar', length: 500 })
  mainImage: string;
}
```

#### 服务层（Service）

```typescript
@Provide()
export class ProductService {
  @InjectEntityModel(Product)
  productModel: Repository<Product>;

  async listProducts(query: any) {
    const { page = 1, pageSize = 10, keyword } = query;
    const qb = this.productModel.createQueryBuilder('p')
      .where('p.deletedAt IS NULL')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('p.createdAt', 'DESC');

    if (keyword) qb.andWhere('p.name LIKE :kw', { kw: `%${keyword}%` });
    const [list, total] = await qb.getManyAndCount();
    return { list, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
  }
}
```

#### 控制器（Controller）

```typescript
@Controller('/api/v1/products')
export class ProductController {
  @Inject()
  productService: ProductService;

  @Get('/')
  async list(@Query() query: any) {
    return this.productService.listProducts(query);
  }
}
```

### 6.2 AI 编码的特点

AI 在编码过程中展现出以下特点：

| 特点 | 表现 | 应对策略 |
|:-----|:-----|:---------|
| **模式化强** | 对标准 CRUD 代码生成非常高效 | 把非标准需求也拆解为标准模式 |
| **上下文敏感** | 忘记早期对话中的约定 | 使用 CLAUDE.md 固化规范 |
| **幻觉问题** | 生成不存在的 API 或字段名 | 审查环节重点检查 |
| **风格一致** | 遵循首次给定的代码风格 | 在 Task 计划中给出示例代码 |
| **重复工作** | 相似功能每次从零生成 | 复用已有的代码片段作为参考 |
