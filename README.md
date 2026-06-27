# 乌东文旅 · 第 3 组【住·苗寨民宿预订】全栈四端项目

> 项目本地根目录：`C:\Users\huangjiaxin\乌东项目5\wudong-group3`

---

## 一、技术架构

| 端 | 技术栈 | 端口 | 本地路径 |
|---|--------|------|----------|
| 🖥️ 后端 API | cool-admin-midway + Midway.js + TypeORM + MySQL | **3000** | `backend/` |
| 🌐 PC 游客端 | React 18 + Vite + TypeScript + Ant Design 5 | **5173** | `web/` |
| 🛠️ 管理后台 | React 18 + Vite + TypeScript + Ant Design 5 | **5174** | `admin/` |
| 📱 微信小程序 | 原生微信小程序 | — | `miniprogram/` |

---

## 二、完整目录结构

```
C:\Users\huangjiaxin\乌东项目5\wudong-group3\
│
├── README.md                          # 本文件
├── docs/                              # 项目文档
│   └── superpowers/plans/             # 架构规划文档
│
├── backend/                           # ★ 后端服务 (端口 3000)
│   ├── package.json
│   ├── tsconfig.json
│   ├── bootstrap.js                   # 生产环境启动入口
│   ├── sql/
│   │   └── init.sql                   # 7 张表全套建表 SQL + 种子数据
│   ├── docs/
│   │   └── postman-api-test-guide.md  # Postman 接口测试清单（37 接口）
│   └── src/
│       ├── configuration.ts           # Midway 生命周期配置
│       ├── interface.ts               # 公共类型 / 枚举
│       ├── config/
│       │   ├── config.default.ts      # 默认配置
│       │   ├── config.local.ts        # 本地开发（端口 3000 + DB 连接）
│       │   └── config.prod.ts         # 生产环境端口配置
│       └── modules/lodging/
│           ├── index.ts               # 模块入口
│           ├── middleware/auth.ts     # JWT Bearer 认证中间件
│           ├── entity/                # 7 个 TypeORM 实体
│           │   ├── homestay.ts        # 民宿
│           │   ├── room.ts            # 房型
│           │   ├── calendar.ts        # 房态日历
│           │   ├── house-rule.ts      # 入住须知
│           │   ├── order.ts           # 住宿订单
│           │   ├── review.ts          # 住宿评价
│           │   └── favorite.ts        # 民宿收藏
│           ├── dto/                   # 7 个数据传输对象
│           ├── service/               # 7 个业务服务层
│           └── controller/            # 7 个 REST 控制器
│
├── web/                               # ★ PC 游客端 (端口 5173)
│   ├── package.json / vite.config.ts / tsconfig.json / index.html
│   └── src/
│       ├── main.tsx / App.tsx         # 入口 + Ant Design 主题
│       ├── styles/
│       │   ├── variables.css          # CSS 变量（色值 #1F5FA8 / 栅格 8px）
│       │   └── global.css             # 全局样式
│       ├── utils/request.ts           # Axios 封装（拦截 / loading / 错误提示）
│       ├── api/lodging.ts             # 接口封装（民宿 / 房型 / 订单 / 评价 / 收藏）
│       ├── router/index.tsx           # 路由：/list /detail/:id /book/:roomId
│       ├── components/
│       │   ├── Layout/                # 全局布局（顶栏 + 底栏）
│       │   ├── HomestayCard/          # 民宿卡片
│       │   ├── Calendar/              # 日期范围选择器（30 天房态）
│       │   ├── ImageGallery/          # 图片画廊
│       │   └── ReviewList/            # 评价列表
│       └── pages/
│           ├── List/                  # 民宿列表（日期筛选 / 排序 / 分页）
│           ├── Detail/                # 民宿详情（轮播 / 房型 / 评价 / 收藏）
│           └── Book/                  # 预订下单（日期 + 入住人 + 提交）
│
├── admin/                             # ★ 管理后台 (端口 5174)
│   ├── package.json / vite.config.ts / tsconfig.json / index.html
│   └── src/
│       ├── main.tsx / App.tsx         # 入口 + Ant Design 主题
│       ├── utils/request.ts           # Axios（自动注入 Bearer token）
│       ├── api/lodging.ts             # 管理端全部 API
│       ├── store/auth.ts              # 登录态（localStorage token）
│       ├── router/index.tsx           # 7 个管理路由 + AuthGuard
│       ├── components/
│       │   ├── Layout/                # Sider 菜单 + Header 布局
│       │   ├── AuthGuard/             # 路由守卫（无 token → 跳转登录）
│       │   ├── CalendarManager/       # ★ 房态日历网格（批量库存/调价）
│       │   └── QrVerify/              # 核销码验证弹窗
│       └── pages/
│           ├── Login/                 # 登录页
│           ├── Dashboard/             # 仪表盘
│           ├── Homestay/              # 民宿管理 (CRUD)
│           ├── Room/                  # 房型管理 (CRUD)
│           ├── Calendar/              # ★ 房态日历页（核心专属）
│           ├── Order/                 # 订单管理（状态流转 + 核销）
│           ├── Review/                # 评价管理（房东回复）
│           └── HouseRule/             # 入住须知管理
│
└── miniprogram/                       # ★ 微信小程序
    ├── app.json                       # 页面注册 + 底部 TabBar
    ├── app.js                         # 入口（临时 userId 生成）
    ├── app.wxss                       # 全局样式变量
    ├── project.config.json            # 微信开发者工具配置
    ├── utils/
    │   ├── request.js                 # wx.request 封装
    │   ├── constants.js               # 订单状态 / 退改规则
    │   └── util.js                    # 日期工具函数
    ├── components/
    │   ├── empty/                     # 空状态组件
    │   ├── loading/                   # 加载中组件
    │   └── homestay-card/             # 民宿卡片组件
    └── pages/
        ├── index/                     # 首页（日期筛选 / 瀑布流 / 下拉刷新）
        ├── homestay/detail/           # 民宿详情（轮播 / 房型 / 评价）
        ├── order/create/              # 预订下单（入住人 / 核销码展示）
        ├── order/list/                # 我的订单 Tab（状态 Tab 切换）
        ├── order/detail/              # 订单详情（核销码展示）
        └── mine/favorites/            # 我的收藏 Tab
```

---

## 三、安装与启动

### 环境要求

- Node.js ≥ 18
- MySQL ≥ 5.7（本地 127.0.0.1:3306）
- 微信开发者工具（仅小程序端需要）

### 1. 数据库初始化

```bash
# 打开 MySQL 客户端，执行建表脚本
mysql -u root -p < "C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\sql\init.sql"

# 脚本内容：7 张表建表 SQL + 3 条种子数据 + 存储过程生成 90 天房态
# 数据库名：wudong_group3
# 字符集：utf8mb4
```

> ⚠️ 本地 `config.local.ts` 中 MySQL 密码默认 `123456`，请根据本地环境修改。

### 2. 后端服务（端口 3000）

```bash
cd "C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend"

# 安装依赖（首次）
npm install

# 开发模式启动（NODE_ENV=local，entity 自动建表）
npm run dev

# 生产模式启动
npm run build
NODE_ENV=production node bootstrap.js

# 验证
curl http://localhost:3000/api/lodging/homestays?page=1&pageSize=10
```

### 3. PC 游客端（端口 5173）

```bash
cd "C:\Users\huangjiaxin\乌东项目5\wudong-group3\web"

npm install
npm run dev

# 浏览器打开 http://localhost:5173
```

### 4. 管理后台（端口 5174）

```bash
cd "C:\Users\huangjiaxin\乌东项目5\wudong-group3\admin"

npm install
npm run dev

# 浏览器打开 http://localhost:5174
# 登录页输入任意用户名/密码即可进入（生产需对接 JWT 认证）
```

### 5. 微信小程序

1. 打开**微信开发者工具**
2. 导入项目 → 目录选择：
   ```
   C:\Users\huangjiaxin\乌东项目5\wudong-group3\miniprogram
   ```
3. AppID 填写测试号
4. **设置 → 项目设置 → 不校验合法域名**（勾选 ✅）
5. 确保后端 `http://localhost:3000` 已启动
6. 点击编译运行

---

## 四、接口文档

### Postman 测试清单

📄 `C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\docs\postman-api-test-guide.md`

> ⚠️ **Postman 接口截图存放目录**：`C:\Users\huangjiaxin\乌东项目5\wudong-group3\backend\docs`
> 建议在此目录下创建 `screenshots/` 子文件夹存放截图。

### 接口规范

| 规范 | 说明 |
|------|------|
| 前缀 | `/api/lodging` |
| 返回格式 | `{ code: 0, message: "ok", data: {} }` |
| 分页 | `?page=1&pageSize=20` → `{ total, page, pageSize, list }` |
| 游客接口 | `GET /api/lodging/*`（免登录） |
| 管理接口 | `/api/lodging/admin/*`（Header: `Authorization: Bearer <token>`） |

### 核心业务接口

| 接口 | 说明 |
|------|------|
| `GET /api/lodging/motel/search` | 按入住/离店日期 + 价格 + 设施筛选民宿 |
| `PUT /api/lodging/room-calendar/batch-edit` | ★ 后台批量修改日期库存/价格 |
| `POST /api/lodging/orders` | 下单（事务锁库存） |
| `POST /api/lodging/order/cancel` | 取消订单（返还库存 + 阶梯退改） |
| `GET /api/lodging/order/check-in-code/:id` | 获取核销二维码字符串 |
| `POST /api/lodging/admin/orders/verify` | 核销验证 |

### 退改规则

| 距入住时间 | 退款比例 |
|-----------|---------|
| ≥ 3 天 | 100% 全额退 |
| 1 – 3 天 | 50% 退 |
| < 24 小时 | 不可退 |

---

## 五、小组分工模板

| 角色 | 负责模块 | 技术栈 | 本地路径 |
|------|----------|--------|----------|
| 🧑‍💻 **后端开发** | 数据库 + API + 业务逻辑 | Midway.js + TypeORM + MySQL | `backend/` |
| 🎨 **Web 前端** | PC 游客端 3 页面 | React + Vite + Ant Design 5 | `web/` |
| 📱 **小程序开发** | 微信小程序 6 页面 | 原生 WXML/WXSS/JS | `miniprogram/` |
| 🛠️ **管理后台** | 商家后台 8 页面 + 房态日历 | React + Vite + Ant Design 5 | `admin/` |

### 协作建议

1. **后端优先**：先完成数据库建表 + 基础 CRUD 接口，其他端并行开发
2. **接口 Mock**：后端开发期间，前端可用 Vite 代理转发到 `localhost:3000`
3. **分支管理**：每人在 Git 上创建独立分支（如 `feat/web-list`），合并前 CR
4. **Postman 共享**：后端导出 Postman Collection JSON 放入 `backend/docs/` 共享

---

## 六、视觉规范

| 属性 | 值 |
|------|-----|
| 主色 | `#1F5FA8` |
| 辅色 / 价格高亮 | `#E85D2F` |
| 栅格基准 | **8px**（Web 用 CSS 变量 `--spacing-*`，小程序用 rpx） |
| 圆角 | `8px` / `16rpx` |
| 字体 | PingFang SC / Microsoft YaHei |

---

## 七、常见问题

**Q: 启动后端报 `Access denied for user 'root'@'localhost'`？**
> 修改 `config.local.ts` 中的 `password` 为本机 MySQL 密码，或用环境变量 `DB_PASSWORD=你的密码`。

**Q: `npm run dev` 后端报 `Table doesn't exist`？**
> 确认 `config.local.ts` 中 `synchronize: true` 已开启，重启后 TypeORM 会自动建表。

**Q: 小程序报 `request:fail url not in domain list`？**
> 微信开发者工具 → 详情 → 本地设置 → 勾选「不校验合法域名」。

**Q: 管理后台登录后仍然跳回登录页？**
> 确认后端 JWT 中间件未拦截 `/admin/login` 路由（当前版本使用简化登录，直接存 token）。
