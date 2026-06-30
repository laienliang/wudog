# 出行模块设计文档

> 对应需求：需求规格说明书第9章「行——线路订票模块」
> 开发范围：后端 API + 管理后台（第一期），PC 端 + 小程序端（第二期）

---

## 一、数据实体

### 1.1 ScenicSpot（景区）
表名：`wd_travel_scenic_spot`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| name | VARCHAR(200) | 景区名称 |
| cover_image | VARCHAR(500) | 封面图 |
| images | JSON | 图片列表 |
| address | VARCHAR(500) | 地址 |
| description | TEXT | 景区介绍 |
| opening_hours | VARCHAR(200) | 开放时间 |
| rating | DECIMAL(2,1) | 评分 |
| status | TINYINT | 0关闭 1开放 |

### 1.2 TicketType（票种）
表名：`wd_travel_ticket_type`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| scenic_id | BIGINT FK | 所属景区 |
| name | VARCHAR(100) | 票种名（成人票/儿童票/套票） |
| price | DECIMAL(10,2) | 价格 |
| stock | INT | 库存 |
| valid_days | INT | 有效期天数 |
| description | TEXT | 说明 |

### 1.3 Route（路线套餐）
表名：`wd_travel_route`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| name | VARCHAR(200) | 路线名称 |
| cover_image | VARCHAR(500) | 封面图 |
| duration | VARCHAR(50) | 行程天数（如"2天1晚"） |
| price | DECIMAL(10,2) | 套餐价 |
| max_people | INT | 成团人数上限 |
| scenic_ids | JSON | 包含景区ID列表 |
| description | TEXT | 路线详情 |
| itinerary | JSON | 行程安排 |
| status | TINYINT | 0下架 1上架 |

### 1.4 ETicket（电子票）
表名：`wd_travel_e_ticket`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| order_id | BIGINT FK | 订单ID |
| ticket_code | VARCHAR(100) | 核销码 |
| status | TINYINT | 0未使用 1已核销 2已过期 |
| used_at | DATETIME | 核销时间 |

---

## 二、后端 API

### 2.1 景区
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/scenic-spots | 景区列表（分页+搜索） |
| GET | /api/v1/scenic-spots/all | 全部景区（供下拉） |
| GET | /api/v1/scenic-spots/:id | 景区详情（含票种） |
| POST | /api/v1/scenic-spots | 新增景区 |
| PUT | /api/v1/scenic-spots/:id | 更新景区 |
| DELETE | /api/v1/scenic-spots/:id | 删除景区 |

### 2.2 票种
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/scenic-spots/:id/ticket-types | 某景区票种列表 |
| POST | /api/v1/ticket-types | 新增票种 |
| PUT | /api/v1/ticket-types/:id | 更新票种 |
| DELETE | /api/v1/ticket-types/:id | 删除票种 |

### 2.3 路线套餐
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/routes | 路线列表 |
| GET | /api/v1/routes/:id | 路线详情 |
| POST | /api/v1/routes | 新增路线 |
| PUT | /api/v1/routes/:id | 更新路线 |
| DELETE | /api/v1/routes/:id | 删除路线 |

### 2.4 电子票
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/e-tickets | 电子票列表 |
| POST | /api/v1/e-tickets/verify | 核销电子票 |

### 2.5 出行订单
复用统一订单，`order_type = 'travel'`。通过统一订单接口查询。

---

## 三、管理后台页面

### 3.1 布局
放在 `业务管理 → 线路管理` 路由 `/modules/travel`
使用 Tabs 组件，5 个 Tab：

### 3.2 景区管理 Tab
- 统计卡片：景区总数 / 开放中 / 已关闭
- 表格列：排序 → 封面+名称 → 评分 → 地址 → 开放时间 → 状态(Switch)
- 操作：管理票种 → 编辑 → 删除
- 搜索：按名称搜索

### 3.3 票种管理 Tab
- 顶部筛选：所属景区下拉
- 表格列：排序 → 票种名 → 所属景区 → 价格 → 库存 → 有效期 → 操作
- 库存<10 红色预警

### 3.4 路线管理 Tab
- 统计卡片：路线总数 / 上架中
- 表格列：排序 → 封面+名称 → 天数 → 价格 → 人数上限 → 包含景区 → 状态
- 弹窗：名称/封面/天数/价格/人数/景区选择/行程安排(富文本)/描述

### 3.5 电子票核销 Tab
- 表格列：票码 / 订单号 / 所属路线/景区 / 状态 / 创建时间
- 操作：核销按钮（弹出确认）
- 筛选：按状态

### 3.6 订单管理 Tab
- 复用住宿订单管理模式，filter order_type='travel'

---

## 四、目录结构

```
server/src/modules/travel/
├── controller/
│   └── travel.controller.ts
├── service/
│   └── travel.service.ts
├── entity/
│   ├── scenic-spot.entity.ts
│   ├── ticket-type.entity.ts
│   ├── route.entity.ts
│   └── e-ticket.entity.ts

web-admin/src/pages/modules/travel/
├── index.tsx        # Tabs 主页面
├── scenic-spot.tsx  # 景区管理 Tab
├── ticket-type.tsx  # 票种管理 Tab
├── route.tsx       # 路线管理 Tab
├── e-ticket.tsx    # 电子票核销 Tab
└── orders.tsx      # 订单管理 Tab
```

---

## 五、业务规则

1. 门票按使用日期区分库存
2. 路线套餐最少提前 1 天预订
3. 电子票有效期：购买当日有效
4. 退票政策：使用日期前 24 小时可退，扣 10% 手续费
5. 景区状态：0关闭 1开放
6. 库存<10 时预警提示
