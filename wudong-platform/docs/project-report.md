# 乌东文旅"衣食住行"综合服务平台 — 项目开发报告

## 衣·非遗商品模块开发总结

---

### 一、模块概况

| 项目 | 内容 |
|------|------|
| 模块名称 | 衣·非遗商品模块 |
| 业务定位 | 苗族非遗手工艺品（苗绣、蜡染、银饰、民族服饰）的电商交易 |
| 覆盖终端 | 后端 API + PC 网页端 + 管理后台 + 微信小程序（四端） |
| 开发模式 | Superpowers 流程 + Claude AI 辅助开发 |

### 二、四端功能清单

#### 1. 后端 API（8 个接口）

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v1/products` | GET | 商品列表（分页+分类+搜索+排序） |
| `/api/v1/products/:id` | GET | 商品详情 |
| `/api/v1/products` | POST | 新增商品 |
| `/api/v1/products/:id` | PUT | 更新商品 |
| `/api/v1/products/:id` | DELETE | 删除商品（软删除） |
| `/api/v1/products/categories` | GET | 分类列表 |
| `/api/v1/products/:id/skus` | GET | SKU 列表 |
| `/api/v1/products/:id/reviews` | GET | 商品评价 |

#### 2. PC 网页端（5 个页面）

| 页面 | 路由 | 核心功能 |
|------|------|---------|
| 商品列表 | `/clothing` | 分类筛选、排序、搜索、分页、商品卡片 |
| 商品详情 | `/clothing/:id` | 主图展示、SKU 规格选择、工艺介绍、收藏、加入购物车、立即购买、评价列表 |
| 购物车 | `/cart` | 增删改商品、数量调整、合计金额、去结算（localStorage） |
| 收藏夹 | `/favorites` | 收藏商品列表、取消收藏 |
| 评价中心 | `/my-reviews` | 我的评价列表 |
| 登录弹窗 | — | 手机号+密码登录，JWT Token 存储 |

#### 3. 管理后台（4 个管理页面）

| 页面 | 路由 | 核心功能 |
|------|------|---------|
| 商品管理 | `/modules/clothing` | 商品表格 CRUD、搜索筛选、上架/下架、删除 |
| 分类管理 | `/modules/clothing/categories` | 分类增删改查 |
| 订单管理 | `/modules/clothing/orders` | 订单列表、状态筛选、发货/取消操作 |
| 评价管理 | `/modules/clothing/reviews` | 评价列表、隐藏不当评价 |

#### 4. 微信小程序（5 个页面）

| 页面 | 路径 | 核心功能 |
|------|------|---------|
| 首页 | `pages/home/index` | Banner、金刚区入口、热门商品 |
| 商品列表 | `pages/clothing/list` | 分类导航、排序、搜索、下拉刷新、上拉加载 |
| 商品详情 | `pages/clothing/detail` | 主图轮播、SKU 选择、数量、收藏、加购、工艺介绍、评价 |
| 购物车 | `pages/cart/index` | 数量调整、删除、合计金额、结算 |
| 我的 | `pages/user/index` | 收藏入口 |

### 三、技术实现

| 层级 | 技术 | 版本 |
|------|------|------|
| 后端框架 | Midway.js | v3.20.x |
| ORM | TypeORM | 0.3.x |
| 数据库 | MySQL | 8.0.44 |
| 缓存 | Redis | 3.0.504 |
| PC 前端 | React + Ant Design | 18 + 5.x |
| 管理后台 | Ant Design Pro | ProLayout + ProTable |
| 小程序 | 微信原生框架 | — |
| 包管理 | pnpm | 9.x |

### 四、视觉规范应用

| 规范项 | 规范要求 | 实际应用 |
|--------|---------|---------|
| 品牌主色 | `#1F5FA8` 苗银蓝 | ConfigProvider 全局主题 |
| 价格色 | `#E85D2F` 苗绣橙 | 商品价格、金额展示 |
| 价格字重 | Bold 700 | 价格加粗显示 |
| 卡片圆角 | 12px | 商品卡片 |
| 卡片阴影 | `0 2px 8px rgba(0,0,0,0.06)` | 商品卡片默认态 |
| 按钮文案 | 使用动词 | "加入购物车"、"立即购买" |
| 单行截断 | text-overflow: ellipsis | 商品名称 |
| 页面宽度 | 最大 1200px，居中 | PC 端容器 |
| 页面边距 | 24px | PC 端内容区 |

### 五、数据库表

| 表名 | 说明 |
|------|------|
| `wd_clothing_category` | 商品分类 |
| `wd_clothing_product` | 商品主表 |
| `wd_clothing_sku` | SKU 规格 |
| `wd_clothing_product_image` | 商品图片 |
| `wd_clothing_review` | 商品评价 |

### 六、开发流程（Superpowers）

```
① /superpowers:brainstorming
   └── 需求澄清 → 出设计文档 → 确认方案

② /superpowers:writing-plans
   └── 拆解任务 → 生成实施计划

③ Subagent-Driven Development
   ├── Task C1: 后端增强（分类/SKU/评价 API）
   ├── Task C2-C4: PC 端页面（列表+详情+购物车+收藏+评价）
   ├── Task C5-C6: 管理后台（商品+分类+订单+评价管理）
   ├── Task C7-C9: 收藏+搜索+库存+批量导入
   ├── Task C10: 小程序端页面
   └── Task C11: 集成验证

④ 每次提交 → Git 记录
```

### 七、Gitee 提交记录

```
f7c7aa0  feat: add login modal and user dropdown menu
6752766  fix: apply visual design spec - primary color #1F5FA8
956ac59  fix: improve error logging for mini-program API
73edb9b  feat(mini): add home, user, community pages
965018a  fix: add menuItemRender for navigation
52e6975  fix: use menuDataRender instead of menu.routes
...（共 25 次提交）
```

### 八、遇到的问题与解决方案

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 分类名称乱码 | MySQL 客户端 GBK 编码导致 | 设置 `--default-character-set=utf8mb4` 重新插入 |
| 商品详情 500 | 加载不存在的关联关系 | 删除 relations 配置 |
| 收藏刷新不持久 | 状态未保存到 localStorage | 改为 localStorage 存取 |
| 收藏重复 | 未检查已存在就 push | 添加 `includes` 判断 |
| 管理后台菜单不显示 | ProLayout 版本兼容问题 | 改用 `menuDataRender` |
| 小程序网络错误 | 微信开发者工具 localhost 解析问题 | 改用 `127.0.0.1` |
| 提交订单无响应 | 详情页未导入 orderApi | 添加 import |
| 主题色不对 | Ant Design 默认 #1677ff | 改为 #1F5FA8 |

### 九、自评与优化方向

**已完成的核心功能：**
- ✅ 商品浏览（列表+分类+搜索+详情）
- ✅ 购物车（加入+增删改+结算）
- ✅ 收藏（收藏+取消+收藏夹）
- ✅ 评价（查看+评价中心）
- ✅ 用户登录（手机号+密码+Token）
- ✅ 管理后台（商品+分类+订单+评价管理）

**可继续优化的方向：**
- ⬜ 商品搜索历史与热门搜索
- ⬜ 图片上传功能（目前用占位 URL）
- ⬜ 微信支付对接
- ⬜ 订单物流追踪
- ⬜ 商品数据统计报表

---

*报告生成日期：2026-06-25*
