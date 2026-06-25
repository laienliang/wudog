# 乌东文旅综合管理平台 (wudog)

> 23软工3班 第3组 | 基于 Midway + React + 微信小程序的文旅综合管理平台

---

## 项目结构

```
wudong-group3/
├── backend/          # Midway.js 后端（接口层）
│   ├── src/
│   │   ├── controller/    # 控制器（7个模块）
│   │   ├── service/       # 业务逻辑层
│   │   ├── entity/        # 数据库实体（7张表）
│   │   └── utils/         # 工具类（统一响应格式）
│   └── sql/               # 建表语句 & 种子数据
├── web/              # React + Vite（PC Web 端）
│   └── src/
│       ├── api/           # API 接口封装
│       ├── components/    # 通用组件
│       └── pages/         # 页面组件
├── miniprogram/      # 微信小程序（原生开发）
│   └── pages/
│       ├── index/         # 首页（住宿列表 + 苗寨筛选）
│       ├── detail/        # 住宿详情 + 房型 + 日期选择
│       ├── order/         # 下单页
│       ├── order-list/    # 个人订单（模拟支付 + 评价）
│       └── review/        # 评价页
├── admin/            # React + Vite + Ant Design（后台管理端）
│   └── src/
│       └── pages/         # 住宿/房型/订单/评论/苗寨/日历管理
└── README.md
```

---

## 技术栈

| 模块 | 技术 | 版本 |
|------|------|------|
| 后端 | Midway.js + TypeORM + MySQL | Midway v3 |
| PC Web | React 18 + Vite + React Router v6 | — |
| 小程序 | 微信原生小程序 | — |
| 后台管理 | React 18 + Vite + Ant Design | — |
| 数据库 | MySQL 8.0 | — |

---

## 运行说明

### 环境要求

- Node.js >= 18
- MySQL 8.0+
- 微信开发者工具（小程序）

### 1. 数据库初始化

```bash
# 登录 MySQL，创建数据库
mysql -u root -p
CREATE DATABASE IF NOT EXISTS wudong_tourism DEFAULT CHARACTER SET utf8mb4;

# 导入建表语句和种子数据
cd backend/sql
mysql -u root -p wudong_tourism < init.sql
mysql -u root -p wudong_tourism < seed_data.sql
```

### 2. 启动后端

```bash
cd backend
npm install
npm run dev        # 默认端口 3000
```

### 3. 启动 PC Web 端

```bash
cd web
npm install
npm run dev        # 默认端口 5173
```

### 4. 启动后台管理端

```bash
cd admin
npm install
npm run dev        # 默认端口 5174
```

后台管理账号：`admin` / `admin123`

### 5. 启动微信小程序

1. 打开**微信开发者工具**
2. 导入项目 → 选择 `miniprogram/` 目录
3. AppID 使用测试号
4. 勾选「不校验合法域名」

---

## 接口文档

| 模块 | 方法 | 路径 | 说明 |
|------|------|------|------|
| **苗寨** | GET | `/api/miao-village/list` | 苗寨列表（支持分页） |
| | GET | `/api/miao-village/detail/:id` | 苗寨详情 |
| | POST | `/api/miao-village/create` | 新增苗寨 |
| | PUT | `/api/miao-village/update/:id` | 修改苗寨 |
| | DELETE | `/api/miao-village/delete/:id` | 删除苗寨 |
| **住宿** | GET | `/api/accommodation/list` | 住宿列表（支持苗寨/日期筛选） |
| | GET | `/api/accommodation/detail/:id` | 住宿详情（含房型列表） |
| | POST | `/api/accommodation/create` | 新增住宿 |
| | PUT | `/api/accommodation/update/:id` | 修改住宿 |
| | DELETE | `/api/accommodation/delete/:id` | 删除住宿 |
| **房型** | GET | `/api/room/list` | 房型列表 |
| | GET | `/api/room/detail/:id` | 房型详情 |
| | POST | `/api/room/create` | 新增房型 |
| | PUT | `/api/room/update/:id` | 修改房型 |
| | DELETE | `/api/room/delete/:id` | 删除房型 |
| **订单** | GET | `/api/order/list` | 订单列表 |
| | GET | `/api/order/detail/:id` | 订单详情 |
| | POST | `/api/order/create` | 创建订单 |
| | PUT | `/api/order/update/:id` | 修改订单 |
| | DELETE | `/api/order/delete/:id` | 删除订单 |
| **评论** | GET | `/api/review/list` | 评论列表 |
| | GET | `/api/review/detail/:id` | 评论详情 |
| | POST | `/api/review/create` | 发表评论 |
| | PUT | `/api/review/update/:id` | 修改评论 |
| | DELETE | `/api/review/delete/:id` | 删除评论 |
| **房态日历** | GET | `/api/room-calendar/list` | 房态列表 |
| | GET | `/api/room-calendar/query` | 按日期查询房态 |
| | POST | `/api/room-calendar/create` | 新增房态 |
| | POST | `/api/room-calendar/batch` | 批量设置房态 |
| | PUT | `/api/room-calendar/update/:id` | 修改房态 |
| | DELETE | `/api/room-calendar/delete/:id` | 删除房态 |
| **用户** | GET | `/api/user/list` | 用户列表 |
| | GET | `/api/user/detail/:id` | 用户详情 |
| | POST | `/api/user/create` | 新增用户 |
| | PUT | `/api/user/update/:id` | 修改用户 |
| | DELETE | `/api/user/delete/:id` | 删除用户 |

**统一响应格式**：`{ code: 200, message: "success", data: {...} }`

---

## 数据库设计（7张表）

| 表名 | 说明 | 主要字段 |
|------|------|------|
| `user` | 用户 | username, phone, avatar |
| `miao_village` | 苗寨 | name, description, cover_image, location |
| `accommodation` | 住宿 | name, village_id, cover_image, images, facilities, house_rules |
| `room` | 房型 | accommodation_id, name, price, bed_type, max_guests |
| `order` | 订单 | room_id, user_id, check_in_date, check_out_date, total_price, status |
| `room_calendar` | 房态日历 | room_id, date, price, available_count, status |
| `review` | 评论 | order_id, accommodation_id, user_id, rating, content |

---

## 成员分工

| 成员 | 负责模块 |
|------|----------|
| 成员 | 后端 API + 数据库设计 |
| 成员 | PC Web 端（住宿浏览/订单） |
| 成员 | 微信小程序端 |
| 成员 | 后台管理端 |

---

## Git 分支说明

- 主分支：`master`
- 开发分支：`23软工3_group_03`

