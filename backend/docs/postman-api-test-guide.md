# 乌东文旅第3组【住·苗寨民宿预订】— Postman API 测试清单

> 后端地址: `http://localhost:3000`
> API 前缀: `/api/lodging`
> 管理接口需 Header: `Authorization: Bearer <token>`

---

## 一、民宿 Homestay

### 游客端

| # | Method | URL | 说明 | 示例 Body / Query |
|---|--------|-----|------|-------------------|
| 1 | `GET` | `/api/lodging/homestays` | 民宿分页列表 | `?page=1&pageSize=20&keyword=云舍&sort=rating_desc` |
| 2 | `GET` | `/api/lodging/homestays/1` | 民宿详情（含房型+须知） | |
| 3 | `GET` | `/api/lodging/motel/search` | ★ 按日期+价格+设施搜索 | `?checkInDate=2026-07-01&checkOutDate=2026-07-03&minPrice=200&maxPrice=500&facilities[]=WiFi&facilities[]=停车场&page=1&pageSize=20` |

### 管理端（需 Bearer Token）

| # | Method | URL | 说明 | 示例 Body |
|---|--------|-----|------|-----------|
| 4 | `POST` | `/api/lodging/admin/homestays` | 新增民宿 | `{"name":"苗寨·半山","address":"贵州省...","facilities":["WiFi","空调"],"contact_phone":"0855-1112222","status":1}` |
| 5 | `PUT` | `/api/lodging/admin/homestays/1` | 编辑民宿 | `{"name":"苗寨·半山(改名)"}` |
| 6 | `DELETE` | `/api/lodging/admin/homestays/1` | 软删除民宿 | |

---

## 二、房型 Room

### 游客端

| # | Method | URL | 说明 | 示例 |
|---|--------|-----|------|------|
| 7 | `GET` | `/api/lodging/rooms` | 房型列表 | `?homestay_id=1&page=1&pageSize=20` |
| 8 | `GET` | `/api/lodging/rooms/1` | 房型详情 | |

### 管理端

| # | Method | URL | 说明 | 示例 Body |
|---|--------|-----|------|-----------|
| 9 | `POST` | `/api/lodging/admin/rooms` | 新增房型 | `{"homestay_id":1,"name":"豪华套房","bed_type":"大床1.8m","area":40,"max_guests":2,"base_price":398,"default_stock":3,"status":1}` |
| 10 | `PUT` | `/api/lodging/admin/rooms/1` | 编辑房型 | `{"base_price":358}` |
| 11 | `DELETE` | `/api/lodging/admin/rooms/1` | 软删除房型 | |

---

## 三、房态日历 Calendar

### 游客端

| # | Method | URL | 说明 | 示例 |
|---|--------|-----|------|------|
| 12 | `GET` | `/api/lodging/calendar/1` | 查询房型日期范围房态 | `?startDate=2026-07-01&endDate=2026-07-31` |

### 管理端

| # | Method | URL | 说明 | 示例 Body |
|---|--------|-----|------|-----------|
| 13 | `GET` | `/api/lodging/admin/calendar` | 分页列表 | `?page=1&pageSize=50&room_id=1&startDate=2026-07-01&endDate=2026-07-31` |
| 14 | `PUT` | `/api/lodging/room-calendar/batch-edit` | ★ 批量修改库存/价格 | `{"roomId":1,"startDate":"2026-07-01","endDate":"2026-07-10","availableStock":8,"price":398,"status":1}` |
| 15 | `PATCH` | `/api/lodging/admin/calendar/single` | 单日编辑 | `{"roomId":1,"date":"2026-07-15","price":498,"availableStock":3}` |

---

## 四、住宿订单 Order

### 游客端

| # | Method | URL | 说明 | 示例 Body |
|---|--------|-----|------|-----------|
| 16 | `POST` | `/api/lodging/orders` | ★ 创建订单（下单扣库存） | `{"homestay_id":1,"room_id":1,"check_in_date":"2026-07-05","check_out_date":"2026-07-07","room_count":1,"contact_name":"张三","contact_phone":"13800138000","guest_count":2}` |
| 17 | `GET` | `/api/lodging/orders` | 我的订单列表 | `?page=1&pageSize=20&status=paid` |
| 18 | `GET` | `/api/lodging/orders/1` | 订单详情 | |
| 19 | `POST` | `/api/lodging/order/cancel` | ★ 取消订单（返还库存+退改） | `{"orderId":1,"reason":"行程变更"}` |
| 20 | `GET` | `/api/lodging/order/check-in-code/1` | ★ 获取核销码 | |

### 管理端

| # | Method | URL | 说明 | 示例 Body |
|---|--------|-----|------|-----------|
| 21 | `GET` | `/api/lodging/admin/orders` | 订单管理列表 | `?page=1&pageSize=20&status=paid` |
| 22 | `PUT` | `/api/lodging/admin/orders/1/status` | 状态流转 | `{"status":"confirmed"}` |
| 23 | `POST` | `/api/lodging/admin/orders/verify` | ★ 核销验证 | `{"code":"ABC123"}` |
| 24 | `DELETE` | `/api/lodging/admin/orders/1` | 软删除订单 | |

---

## 五、入住须知 House Rule

### 游客端

| # | Method | URL | 说明 |
|---|--------|-----|------|
| 25 | `GET` | `/api/lodging/homestays/1/rules` | 获取民宿入住须知 |

### 管理端

| # | Method | URL | 说明 | 示例 Body |
|---|--------|-----|------|-----------|
| 26 | `GET` | `/api/lodging/admin/house-rules` | 分页列表 | `?page=1&pageSize=20` |
| 27 | `POST` | `/api/lodging/admin/house-rules` | 新增须知 | `{"homestay_id":1,"check_in_time":"14:00","check_out_time":"12:00","cancellation_rules":[{"daysBefore":3,"refundPercent":100,"description":"入住前3天以上取消，全额退款"},{"daysBefore":1,"refundPercent":50,"description":"入住前1-3天取消，退款50%"},{"daysBefore":0,"refundPercent":0,"description":"入住前24小时内取消，不可退款"}],"notes":"禁止吸烟，保持安静"}` |
| 28 | `PUT` | `/api/lodging/admin/house-rules/1` | 编辑须知 | |
| 29 | `DELETE` | `/api/lodging/admin/house-rules/1` | 软删除 | |

---

## 六、住宿评价 Review

### 游客端

| # | Method | URL | 说明 | 示例 Body |
|---|--------|-----|------|-----------|
| 30 | `GET` | `/api/lodging/reviews` | 评价列表 | `?homestay_id=1&page=1&pageSize=20` |
| 31 | `POST` | `/api/lodging/reviews` | 提交评价 | `{"order_id":1,"rating":5,"content":"非常好的体验！","images":[]}` |

### 管理端

| # | Method | URL | 说明 | 示例 Body |
|---|--------|-----|------|-----------|
| 32 | `POST` | `/api/lodging/admin/reviews/1/reply` | 房东回复 | `{"id":1,"owner_reply":"感谢您的评价！"}` |
| 33 | `PUT` | `/api/lodging/admin/reviews/1/status` | 切换显示/隐藏 | `{"status":0}` |
| 34 | `DELETE` | `/api/lodging/admin/reviews/1` | 软删除 | |

---

## 七、民宿收藏 Favorite

### 游客端

| # | Method | URL | 说明 | 示例 Body |
|---|--------|-----|------|-----------|
| 35 | `GET` | `/api/lodging/favorites` | 我的收藏列表 | `?page=1&pageSize=20` |
| 36 | `POST` | `/api/lodging/favorites` | 收藏/取消收藏 | `{"homestay_id":1}` |
| 37 | `GET` | `/api/lodging/favorites/check/1` | 检查是否已收藏 | |

---

## 业务场景测试流程

### 完整预订流程测试

```
1. GET  /api/lodging/motel/search?checkInDate=2026-07-05&checkOutDate=2026-07-07
   → 拿到可预订民宿列表

2. GET  /api/lodging/homestays/1
   → 查看民宿详情 + 房型

3. GET  /api/lodging/calendar/1?startDate=2026-07-01&endDate=2026-07-31
   → 查看房态和价格

4. POST /api/lodging/orders
   → 下单 {"homestay_id":1,"room_id":1,"check_in_date":"2026-07-05","check_out_date":"2026-07-07","room_count":1,"contact_name":"张三","contact_phone":"13800138000","guest_count":2}

5. GET  /api/lodging/order/check-in-code/<订单ID>
   → 获取核销码

6. POST /api/lodging/order/cancel
   → 取消订单 {"orderId":<订单ID>,"reason":"行程变更"}
   → 验证库存返还、退款金额（大于3天 = 全额退）
```

### 管理后台测试流程

```
1. PUT  /api/lodging/room-calendar/batch-edit
   → 批量设置7月1-10日的库存和价格

2. PUT  /api/lodging/admin/orders/<ID>/status
   → 订单状态: paid → confirmed → checking_in

3. POST /api/lodging/admin/orders/verify
   → {"code":"核销码"} 验证核销

4. POST /api/lodging/admin/reviews/<ID>/reply
   → 房东回复评价
```

---

## 统一返回格式

```json
{
  "code": 0,        // 0=成功, 400=参数错误, 401=未登录, 404=不存在
  "message": "ok",  // 提示信息
  "data": {}        // 业务数据；分页时为 {total, page, pageSize, list}
}
```

## 退改规则说明

| 距入住时间 | 退款比例 | 说明 |
|-----------|---------|------|
| ≥ 3天 | 100% | 全额退款 |
| 1-3天 | 50% | 退款一半 |
| < 24小时 | 0% | 不可退款 |
