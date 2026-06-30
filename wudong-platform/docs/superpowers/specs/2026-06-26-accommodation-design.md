# 住宿模块设计文档

> 对应需求：需求规格说明书第8章「住——住宿预订模块」
> 开发范围：后端 API + 管理后台
> 日期：2026-06-26

---

## 一、数据实体

### 1.1 Homestay（民宿）
表名：`wd_accommodation_homestay`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| merchant_id | BIGINT | 商家ID |
| name | VARCHAR(200) | 民宿名称 |
| cover_image | VARCHAR(500) | 封面图URL |
| images | JSON | 图片列表 |
| phone | VARCHAR(20) | 联系电话 |
| address | VARCHAR(500) | 地址 |
| description | TEXT | 民宿介绍 |
| facilities | JSON | 设施列表（如：WiFi/空调/独立卫浴/苗族特色） |
| rating | DECIMAL(2,1) | 评分 |
| status | TINYINT | 0关闭 1营业 |
| created_at / updated_at / deleted_at | | 必备字段 |

### 1.2 RoomType（房型）
表名：`wd_accommodation_room_type`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| homestay_id | BIGINT FK | 所属民宿 |
| name | VARCHAR(100) | 房型名称（如：苗族木屋大床房）|
| area | VARCHAR(50) | 面积（如"30㎡"） |
| bed_type | VARCHAR(100) | 床型（如：1.8m大床/1.2m双床） |
| max_guests | INT | 最大入住人数 |
| price | DECIMAL(10,2) | 平日价 |
| weekend_price | DECIMAL(10,2) | 周末价 |
| images | JSON | 房型图片 |
| facilities | JSON | 房间设施 |
| quantity | INT | 房间数量（同房型几间） |

### 1.3 Calendar（房态日历）
表名：`wd_accommodation_calendar`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| room_type_id | BIGINT FK | 房型ID |
| date | DATE | 日期 |
| price | DECIMAL(10,2) | 当日价格 |
| stock | INT | 剩余房间数 |
| status | TINYINT | NULL正常 1满房 2维护 |

### 1.4 评价
复用 `wd_clothing_review` 模式，通过 product_type 区分，或独立评价表。MVP阶段先简化处理。

---

## 二、后端 API

### 2.1 民宿

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/homestays | 民宿列表（分页+搜索+筛选） |
| GET | /api/v1/homestays/all | 全部民宿（供下拉选择） |
| GET | /api/v1/homestays/:id | 民宿详情（含房型列表） |
| POST | /api/v1/homestays | 新增民宿 |
| PUT | /api/v1/homestays/:id | 更新民宿 |
| DELETE | /api/v1/homestays/:id | 删除民宿（软删除） |

### 2.2 房型

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/homestays/:id/room-types | 某民宿的房型列表 |
| POST | /api/v1/room-types | 新增房型 |
| PUT | /api/v1/room-types/:id | 更新房型 |
| DELETE | /api/v1/room-types/:id | 删除房型 |

### 2.3 房态日历

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/room-types/:id/calendar?month=2026-07 | 某房型某月日历 |
| POST | /api/v1/calendar/batch | 批量设置日历（日期范围+价格+库存） |

### 2.4 住宿订单

住宿订单复用统一订单（`wd_order`），`order_type = 'accommodation'`。

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/accommodation-orders | 住宿订单列表（分页+状态筛选） |

订单操作（确认/取消/退款）复用统一订单接口。

---

## 三、管理后台页面

### 3.1 布局
放在 `业务管理 → 住宿管理` 路由 `/modules/accommodation`
使用 Tabs 组件，5个Tab：

### 3.2 民宿管理 Tab
- **统计卡片**：民宿总数 / 营业中 / 已关闭
- **表格列**：排序 → 封面图+名称 → 评分 → 设施标签(Tag) → 电话 → 状态(营业/关闭 Switch)
- **操作**：管理房型(跳转房型Tab+筛选) → 编辑 → 删除
- **新增/编辑弹窗**：名称/封面图/电话/地址/设施标签(多选)/介绍
- 搜索：支持按名称搜索

### 3.3 房型管理 Tab
- **顶部筛选**：所属民宿下拉选择（默认全部）
- **表格列**：排序 → 房型名+图片 → 床型 → 面积 → 容纳人数 → 平日价 → 周末价 → 库存 → 操作
- **操作**：编辑 → 删除
- **库存预警**：库存<10时红色标注
- **新增/编辑弹窗**：所属民宿(必选) / 房型名 / 床型 / 面积 / 容纳人数 / 平日价 / 周末价 / 库存 / 图片

### 3.4 房态日历 Tab
- **顶部筛选**：选择民宿 → 选择房型 → 选择月份
- **日历展示**：按月展示日历网格，每天显示价格+余房数
- **状态色标**：绿色=可订 / 灰色=满房 / 红色=维护
- **批量操作**：选择日期范围 → 设置价格/库存/状态

### 3.5 订单管理 Tab
- **统计卡片**：全部订单 / 待确认 / 进行中 / 已完成
- **表格列**：订单号 / 民宿名 / 房型 / 入住日期 / 离店日期 / 金额 / 状态 / 创建时间
- **操作**：确认 / 取消 / 标记完成
- **筛选**：按状态/日期范围

### 3.6 评价管理 Tab
- **表格列**：民宿名 → 用户 → 评分 → 内容 → 时间 → 状态
- **操作**：回复 / 隐藏
- **筛选**：按状态/民宿

---

## 四、视觉规范

遵循视觉设计规范：
- 主色：`#1F5FA8` | 辅色：`#E85D2F` | 成功：`#6B8E3D`
- 卡片圆角：12px | 阴影：`0 2px 8px rgba(0,0,0,0.06)`
- 表格使用 Ant Design ProTable
- 统计卡片使用 Ant Design Pro 风格（浅色背景图标+右上装饰圆）

---

## 五、业务规则

1. 预订需预付房费
2. 取消政策：入住前3天免费取消，1-3天扣30%，当天不可退
3. 民宿状态：0关闭 1营业
4. 日历批量设置支持未来90天
5. 库存<10时前端预警提示

---

## 六、目录结构

```
server/src/modules/accommodation/
├── controller/
│   └── accommodation.controller.ts
├── service/
│   └── accommodation.service.ts
├── entity/
│   ├── homestay.entity.ts
│   ├── room-type.entity.ts
│   └── calendar.entity.ts
├── dto/
│   ├── create-homestay.dto.ts
│   └── update-homestay.dto.ts

web-admin/src/pages/modules/
└── accommodation/
    ├── index.tsx          # Tabs 主页面
    ├── homestay.tsx       # 民宿管理 Tab
    ├── room-type.tsx      # 房型管理 Tab
    ├── calendar.tsx       # 房态日历 Tab
    ├── orders.tsx         # 订单管理 Tab
    └── reviews.tsx        # 评价管理 Tab
```
