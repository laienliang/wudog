# 乌东文旅 · 线路订票系统

> 景区门票 + 苗寨路线套餐预订系统

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 API | Node.js + Express + TypeScript + TypeORM + MySQL 8 + JWT |
| PC Web（游客端） | React + TypeScript + Vite |
| 微信小程序 | 原生 WXML/WXSS/JS |
| 管理后台 | React + TypeScript + Vite |

## 项目结构

```
wudong-code/
├── backend/              # 后端 API 服务（端口 3000）
│   └── src/
│       ├── entities/     # TypeORM 实体（6张表）
│       ├── services/     # 业务逻辑层
│       ├── controllers/  # 路由 + 接口
│       ├── middleware/   # JWT 鉴权
│       └── index.ts      # 入口
├── web/                  # PC Web 游客端（端口 5173）
│   └── src/
│       ├── pages/        # 页面组件
│       ├── api.ts        # API 封装
│       └── App.tsx       # 路由
├── miniprogram/          # 微信小程序
│   └── pages/            # 页面（首页/景区/路线/订单/我的）
├── admin/                # 管理后台（端口 5174）
│   └── src/
│       ├── pages/        # 管理页面
│       ├── api.ts        # 管理员 API 封装
│       └── App.tsx       # 路由 + 侧边栏
└── README.md
```

## 数据表

| 表名 | 说明 |
|------|------|
| `scenic_spot` | 景区表 |
| `ticket_type` | 票种表（含 JSON daily_stock 按日期库存） |
| `route_package` | 路线套餐表（含 JSON daily_stock） |
| `route_itinerary` | 路线行程表 |
| `ticket_order` | 电子票订单表（UUID + 订单号） |
| `admin_user` | 管理员表 |

## 快速启动

### 前置条件

- Node.js >= 18
- MySQL 8.0

### 1. 启动后端

```bash
cd backend
cp .env.example .env
# 编辑 .env 填入你的 MySQL 账号密码
npm install
npm run dev
```

后端运行在 **http://localhost:3000**

首次启动会自动：
- 创建所有数据表（synchronize）
- 插入默认管理员：`admin / Admin@123456`

### 2. 启动 PC Web（游客端）

```bash
cd web
npm install
npm run dev
```

PC Web 运行在 **http://localhost:5173**

### 3. 启动管理后台

```bash
cd admin
npm install
npm run dev
```

管理后台运行在 **http://localhost:5174**

用 `admin / Admin@123456` 登录。

### 4. 微信小程序

用微信开发者工具打开 `miniprogram/` 目录即可。

需要在开发者工具中配置请求合法域名：`http://localhost:3000`

或在 `miniprogram/utils/request.js` 中设置 BASE 为空（本地调试关闭域名校验）。

## 端口一览

| 服务 | 端口 |
|------|------|
| 后端 API | 3000 |
| PC Web | 5173 |
| 管理后台 | 5174 |

## API 接口

完整接口文档见步骤分析文档。核心接口分类：

- **公开接口**：`/api/scenic-spots`, `/api/routes`, `/api/orders`
- **管理员接口**（需 JWT）：`/api/admin/*`
- **日期库存**：`PUT /api/admin/ticket-types/:id/daily-stock`

## 核心业务

1. **按日期库存管理**：票种和路线套餐均支持 `daily_stock` JSON 字段逐日设置库存覆盖值
2. **下单幂等**：同一用户同一商品同一日期不允许重复下单
3. **电子票 UUID**：每个订单生成唯一 UUID 作为电子票凭证
4. **软删除**：所有表支持 `deleted_at` 软删除
5. **统一响应格式**：`{ code, message, data }`

## 已知问题 & 注意事项

1. **图片资源**：小程序 TabBar 图标和占位图暂用 CSS 渐变替代，实际部署时请替换为真实图片
2. **用户登录**：小程序和 PC Web 均使用演示用户 ID（userId=1），实际需对接微信登录
3. **数据库同步**：`synchronize: true` 仅在开发环境使用，生产环境应改为迁移模式
4. **并发安全**：库存扣减和订单号生成在高并发场景下需加事务锁
5. **输入校验**：管理员接口暂无 DTO 校验，建议接入 `class-validator`
