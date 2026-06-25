# 乌东文旅平台 - 接口联调文档（curl）

> 服务地址：`http://localhost:3000`
> 全局前缀：`/api`

---

## 一、苗寨/景区 miao-village

### 1.1 苗寨列表（分页 + 搜索）

```bash
curl "http://localhost:3000/api/miao-village/list?page=1&pageSize=20&keyword=苗寨"
```

### 1.2 苗寨详情

```bash
curl "http://localhost:3000/api/miao-village/detail/1"
```

### 1.3 新增苗寨

```bash
curl -X POST "http://localhost:3000/api/miao-village/create" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "郎德上寨",
    "description": "原生态苗族村寨，奥运圣火走过的地方",
    "address": "贵州省黔东南州雷山县郎德镇",
    "coverImage": "/images/langde.jpg",
    "ticketPrice": 60.00,
    "openTime": "08:00-17:30",
    "status": 1
  }'
```

### 1.4 更新苗寨

```bash
curl -X PUT "http://localhost:3000/api/miao-village/update/1" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "世界上最大的苗族聚居村寨，夜景璀璨，吊脚楼依山而建。",
    "ticketPrice": 110.00
  }'
```

### 1.5 软删除苗寨

```bash
curl -X DELETE "http://localhost:3000/api/miao-village/delete/3"
```

---

## 二、住宿/民宿 accommodation

### 2.1 住宿列表（分页 + 多条件搜索）⭐ 核心

```bash
# 按名称关键词搜索
curl "http://localhost:3000/api/accommodation/list?page=1&pageSize=20&keyword=苗岭"

# 按苗寨筛选
curl "http://localhost:3000/api/accommodation/list?page=1&pageSize=20&villageId=1"

# 按价格区间筛选（200~600元）
curl "http://localhost:3000/api/accommodation/list?page=1&pageSize=20&minPrice=200&maxPrice=600"

# 按类型筛选（民宿 minsute / 客栈 inn / 酒店 hotel）
curl "http://localhost:3000/api/accommodation/list?page=1&pageSize=20&type=minsute"
```

### 2.2 住宿详情

```bash
curl "http://localhost:3000/api/accommodation/detail/1"
```

### 2.3 新增住宿

```bash
curl -X POST "http://localhost:3000/api/accommodation/create" \
  -H "Content-Type: application/json" \
  -d '{
    "villageId": 1,
    "name": "云上苗家",
    "type": "minsute",
    "description": "半山腰观景民宿，可俯瞰整个苗寨",
    "address": "西江千户苗寨半山",
    "coverImage": "/images/yunshang.jpg",
    "lowestPrice": 468.00,
    "highestPrice": 968.00,
    "rating": 4.9,
    "reviewCount": 0,
    "facilities": "[\"WiFi\",\"停车场\",\"早餐\",\"观景台\"]",
    "houseRules": "14:00后入住，12:00前退房",
    "status": 1
  }'
```

### 2.4 更新住宿

```bash
curl -X PUT "http://localhost:3000/api/accommodation/update/1" \
  -H "Content-Type: application/json" \
  -d '{
    "lowestPrice": 408.00,
    "rating": 4.9
  }'
```

### 2.5 软删除住宿

```bash
curl -X DELETE "http://localhost:3000/api/accommodation/delete/4"
```

---

## 三、房型 room

### 3.1 房型列表（按住宿筛选）

```bash
# 查询住宿ID=1下的所有房型
curl "http://localhost:3000/api/room/list?page=1&pageSize=20&accommodationId=1"
```

### 3.2 房型详情

```bash
curl "http://localhost:3000/api/room/detail/1"
```

### 3.3 新增房型

```bash
curl -X POST "http://localhost:3000/api/room/create" \
  -H "Content-Type: application/json" \
  -d '{
    "accommodationId": 1,
    "name": "亲子套房",
    "description": "两室一厅，适合家庭出行",
    "area": 45.00,
    "maxGuests": 4,
    "bedType": "1.8m大床+1.2m单人床",
    "price": 888.00,
    "stock": 2,
    "coverImage": "/images/room-family.jpg",
    "facilities": "[\"WiFi\",\"空调\",\"独立卫浴\"]",
    "status": 1
  }'
```

### 3.4 更新房型

```bash
curl -X PUT "http://localhost:3000/api/room/update/1" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 528.00,
    "stock": 5
  }'
```

### 3.5 软删除房型

```bash
curl -X DELETE "http://localhost:3000/api/room/delete/5"
```

---

## 四、预订订单 order

### 4.1 订单列表（按用户/状态筛选）

```bash
# 查询用户ID=1的订单
curl "http://localhost:3000/api/order/list?page=1&pageSize=20&userId=1"

# 查询待支付订单（status=0）
curl "http://localhost:3000/api/order/list?page=1&pageSize=20&status=0"
```

### 4.2 订单详情

```bash
curl "http://localhost:3000/api/order/detail/1"
```

### 4.3 创建预订订单 ⭐ 核心

```bash
curl -X POST "http://localhost:3000/api/order/create" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "accommodationId": 1,
    "roomId": 1,
    "checkInDate": "2026-07-01",
    "checkOutDate": "2026-07-03",
    "guests": 2,
    "guestName": "王游客",
    "guestPhone": "13800138000",
    "totalPrice": 1176.00,
    "remark": "请安排高楼层观景房",
    "status": 0
  }'
```

> 订单编号（orderNo）与入住晚数（nights）由后端自动生成。

### 4.4 更新订单（如：确认支付）

```bash
curl -X PUT "http://localhost:3000/api/order/update/1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": 1,
    "remark": "已支付，等待入住"
  }'
```

### 4.5 软删除订单

```bash
curl -X DELETE "http://localhost:3000/api/order/delete/1"
```

---

## 五、评价 review

### 5.1 评价列表（按住宿筛选）

```bash
curl "http://localhost:3000/api/review/list?page=1&pageSize=20&accommodationId=1"
```

### 5.2 评价详情

```bash
curl "http://localhost:3000/api/review/detail/1"
```

### 5.3 新增评价

```bash
curl -X POST "http://localhost:3000/api/review/create" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "accommodationId": 1,
    "orderId": 1,
    "rating": 5,
    "content": "夜景太美了，推开窗就是万家灯火，老板热情，房间干净整洁，强烈推荐！",
    "images": "[\"/images/review1.jpg\",\"/images/review2.jpg\"]",
    "isAnonymous": 0,
    "status": 1
  }'
```

### 5.4 更新评价

```bash
curl -X PUT "http://localhost:3000/api/review/update/1" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "夜景太美了，强烈推荐！",
    "rating": 5
  }'
```

### 5.5 软删除评价

```bash
curl -X DELETE "http://localhost:3000/api/review/delete/1"
```

---

## 六、用户 user

### 6.1 用户列表

```bash
curl "http://localhost:3000/api/user/list?page=1&pageSize=20"
```

### 6.2 用户详情

```bash
curl "http://localhost:3000/api/user/detail/1"
```

### 6.3 新增用户

```bash
curl -X POST "http://localhost:3000/api/user/create" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tourist03",
    "password": "e10adc3949ba59abbe56e057f20f883e",
    "nickname": "背包客小张",
    "phone": "13700137000",
    "gender": 1,
    "status": 1
  }'
```

### 6.4 更新用户

```bash
curl -X PUT "http://localhost:3000/api/user/update/1" \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "资深游客小王",
    "avatar": "/images/avatar1.jpg"
  }'
```

### 6.5 软删除用户

```bash
curl -X DELETE "http://localhost:3000/api/user/delete/3"
```

---

## 联调说明

1. 以上 curl 命令中的 ID（如 `/detail/1`）请根据实际数据调整。
2. 所有列表接口均支持 `page` 和 `pageSize` 参数，不传时默认 `page=1, pageSize=20`。
3. 接口返回统一 JSON 格式：`{ "code": 200, "message": "success", "data": {...} }`。
4. 可使用 Postman 导入上述请求进行可视化测试，建议将测试截图保存至本 `docs/` 目录。
