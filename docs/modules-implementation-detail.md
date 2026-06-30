# 六大功能模块详细实现过程

---

## 模块一：衣·非遗商品

### 1.1 功能概述

衣模块实现了一个完整的苗族非遗手工艺品电商系统，覆盖商品展示、搜索筛选、购物车、下单购买、收藏评价等全链路功能。面向游客提供浏览和购买入口，面向商家提供商品管理和订单处理能力。

### 1.2 数据实体与流向

**核心数据表：**
- `wd_clothing_product` — 商品主表（名称、价格、库存、销量、评分、分类、描述、主图）
- `wd_clothing_sku` — SKU规格表（所属商品、规格名称、属性JSON、价格、库存、图片）
- `wd_clothing_category` — 分类表（名称、父级ID、排序）
- `wd_clothing_review` — 评价表（所属商品、用户、评分、内容、图片、状态）
- `wd_cart_item` — 购物车表（用户ID、商品ID、SKU ID、数量）
- `wd_clothing_product_image` — 商品图片表（商品ID、图片URL、排序）

**数据流向：**
```
管理员后台新增商品 → wd_clothing_product表
                    → wd_clothing_sku表（多个SKU）
                    → wd_clothing_product_image表（多张图片）

游客PC端浏览 → GET /api/v1/products（分页+筛选+排序）
              → GET /api/v1/products/:id（详情+SKU+评价）

游客加购 → POST /api/v1/cart/add → wd_cart_item表
游客下单 → POST /api/v1/orders → wd_order表 + wd_order_item表
游客评价 → POST /api/v1/products/:id/reviews → wd_clothing_review表
```

### 1.3 后端API实现（共8个端点）

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/products` | GET | 商品列表，支持 page/pageSize/keyword/categoryId/sortBy 参数 |
| `/api/v1/products/:id` | GET | 商品详情，同时加载SKU列表和评价统计 |
| `/api/v1/products` | POST | 新增商品 |
| `/api/v1/products/:id` | PUT | 更新商品 |
| `/api/v1/products/:id` | DELETE | 删除商品（软删除） |
| `/api/v1/products/categories` | GET | 分类列表 |
| `/api/v1/products/:id/skus` | GET | 指定商品的SKU列表 |
| `/api/v1/products/:id/reviews` | GET | 指定商品的评价列表 |

**关键实现细节：**
- 商品列表接口使用 TypeORM 的 QueryBuilder 构建动态查询，根据传入参数拼接 WHERE 条件，支持分类筛选、关键字搜索、价格区间过滤和多字段排序（销量、价格、评分、创建时间）
- 商品详情接口使用 `findOne` 查询主表后，手动查询关联的 SKU 表和评价表，不使用 TypeORM 的 relations 配置（避免加载不存在的关联导致 500 错误）
- 所有删除操作使用 `softDelete` 软删除，设置 `deleted_at` 字段而非物理删除
- 评价接口支持分页查询和状态过滤（公开/待审核/隐藏）

### 1.4 PC前端实现

**商品列表页（`/clothing`）：**
- 顶部分类导航栏，从 `GET /api/v1/products/categories` 动态加载分类数据
- 排序切换：综合、销量优先、价格从低到高、价格从高到低、评分优先
- 搜索框：输入关键词后重新请求商品列表，前端持续将 keyword 参数传递给 API
- 商品卡片网格：展示商品主图、名称、价格、销量、评分
- 分页组件：支持每页 12/24/36 件切换

**商品详情页（`/clothing/:id`）：**
- 商品主图展示（左侧大图 + 右侧缩略图列表）
- 商品基本信息：名称、价格（¥128.00 格式，橙色加粗）、市场价（灰色划线）、评分星级、累计销量
- SKU 规格选择：根据当前商品加载 SKU 列表，用户选择规格后更新显示价格和库存
- 数量选择器（InputNumber 组件，最小值 1，最大值=库存）
- "加入购物车"按钮：调用 `POST /api/v1/cart/add`，传递 userId/productId/skuId/quantity
- "立即购买"按钮：直接跳转到订单确认页（简化为加入购物车后跳转购物车）
- 收藏按钮：先检查 localStorage 中的收藏列表，已收藏则显示红色实心图标，未收藏显示空心图标
- 商品评价区域：Tab 切换全部评价/好评/中评/差评，展示用户头像、昵称、评分、评价内容、评价时间

**购物车页（`/cart`）：**
- 商品列表：展示加购商品，支持修改数量和删除
- 跨模块合并：衣模块商品和食模块农产品可同时存在于购物车
- 合计金额计算：实时计算选中商品的总价（Price × Quantity）
- "去结算"按钮：将选中的商品信息传递给订单创建接口

**收藏夹页（`/favorites`）：**
- 从 localStorage 读取收藏的商品 ID 列表，调用 API 加载商品详情
- 支持取消收藏（从 localStorage 移除 ID）

### 1.5 管理后台实现

**商品管理（`/modules/clothing`）：**
- ProTable 列表：展示商品ID、主图、名称、分类、价格、市场价、库存、销量、评分、状态、创建时间
- 搜索筛选栏：关键字搜索、分类下拉选择、状态下拉筛选
- 工具栏：新增商品按钮、批量导入按钮
- 行操作：编辑（弹窗表单）、上架/下架切换（Switch 组件）、删除（Popconfirm 确认）
- 新增/编辑弹窗：表单包含商品名称、分类选择、商品编码、价格、市场价、库存、销量、评分、主图URL、描述
- 批量操作：选择多行后出现批量上架/批量下架/批量删除按钮

**分类管理（`/modules/clothing/categories`）：**
- 分类列表：展示排序序号、分类名称（带图标和背景色块）、商品数量统计、父级分类、创建时间
- 新增/编辑弹窗：分类名称、排序序号、父级分类ID

**订单管理（`/modules/clothing/orders`）：**
- 订单 ProTable：订单号、用户ID、金额、状态（Tag 标签）、创建时间
- 操作：待支付订单可取消，已支付订单可确认发货
- 状态映射：pending_pay→待支付(橙)、paid→已支付(蓝)、confirmed→已确认(青)、completed→已完成(绿)、cancelled→已取消(灰)、refunded→已退款(红)

**评价管理（`/modules/clothing/reviews`）：**
- 评价列表：商品信息、评价内容（敏感词高亮）、评分、评价人、时间、状态
- 状态操作：待审核→审核通过/屏蔽，已公开→屏蔽，已屏蔽→恢复公开
- 回复评价：弹窗表单输入回复内容

**库存管理（`/modules/clothing/inventory`）：**
- 四Tab切换：衣·商品SKU、食·农产品、住·房型、行·门票
- 衣Tab：商品ID、商品名（缩略图）、款式、价格、库存、销量，低库存红色预警
- 食Tab：农产品列表，展示商品名、单位、价格、库存、状态
- 住Tab：房型列表，展示房型名、床型、平日价、周末价、房量
- 行Tab：门票列表，展示票种名、所属景区、价格、库存、有效期

**数据统计（`/modules/clothing/statistics`）：**
- 顶部统计卡片：商品数/餐厅数/民宿数/景区数 + 农产品数/房型数/票种数/总销售额
- 底部热销Top5：四Tab切换（衣/食/住/行），按销量/库存/价格排序

### 1.6 小程序实现

**商品列表页（`pages/clothing/list`）：**
- 分类导航水平滚动
- 商品列表瀑布流，支持下拉刷新和上拉加载更多
- 排序切换：综合、价格、销量

**商品详情页（`pages/clothing/detail`）：**
- 主图轮播（swiper 组件）
- SKU 选择弹窗（底部弹出）
- 加入购物车和立即购买按钮

**购物车页（`pages/cart/index`）：**
- 商品列表，支持数量加减和删除
- 合计金额和结算按钮

---

## 模块二：食·餐饮美食

### 2.1 功能概述

食模块涵盖苗家餐厅展示、餐位预订、农产品在线购买三大功能。游客可以浏览餐厅列表、查看菜单菜品、预订餐位，也可以购买苗家土特产农产品。

### 2.2 数据实体与流向

**核心数据表：**
- `wd_food_restaurant` — 餐厅表（名称、封面图、电话、地址、营业时间、菜系标签、评分、状态）
- `wd_food_dish` — 菜品表（所属餐厅、名称、价格、主图、描述、招牌菜标识、状态）
- `wd_food_meal_slot` — 餐位时段表（所属餐厅、日期、时段、可预订数量）
- `wd_food_product` — 农产品表（名称、主图、价格、单位、库存、描述、状态）

**数据流向：**
```
餐厅管理 → wd_food_restaurant表 → GET /restaurants（PC端餐厅列表）
菜品管理 → wd_food_dish表 → 关联餐厅详情页展示
餐位预订 → POST /restaurants/booking → 校验时段 → 生成订单
农产品管理 → wd_food_product表 → GET /food-products（PC端农产品列表）
购物车加购 → POST /api/v1/cart/add → wd_cart_item表（与衣模块共用）
```

### 2.3 后端API实现

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/restaurants` | GET | 餐厅列表（分页+评分排序） |
| `/api/v1/restaurants/all` | GET | 所有餐厅（无分页，用于下拉选择） |
| `/api/v1/restaurants/:id` | GET | 餐厅详情 |
| `/api/v1/restaurants` | POST | 新增餐厅 |
| `/api/v1/restaurants/:id` | PUT | 更新餐厅 |
| `/api/v1/restaurants/:id` | DELETE | 删除餐厅 |
| `/api/v1/restaurants/:id/slots` | GET | 获取餐位时段 |
| `/api/v1/restaurants/:id/dishes` | GET | 获取菜品列表 |
| `/api/v1/restaurants/booking` | POST | 创建餐位预订 |
| `/api/v1/food-products` | GET | 农产品列表 |
| `/api/v1/food-products/:id` | GET | 农产品详情 |
| `/api/v1/food-products` | POST | 新增农产品 |
| `/api/v1/food-products/:id` | PUT | 更新农产品 |
| `/api/v1/food-products/:id` | DELETE | 删除农产品 |
| `/api/v1/dishes` | GET | 菜品列表 |
| `/api/v1/dishes` | POST | 新增菜品 |
| `/api/v1/dishes/:id` | PUT | 更新菜品 |
| `/api/v1/dishes/:id` | DELETE | 删除菜品 |

### 2.4 PC前端实现

**餐饮首页（`/food`）：**
- 餐厅列表：卡片网格展示餐厅封面图、名称、评分、特色标签（Tag）
- 农产品列表：Tab 切换展示，卡片网格展示

**餐厅详情页（`/food/restaurant/:id`）：**
- 餐厅基础信息：封面图、名称、评分、营业时间、地址、电话
- 菜品列表：招牌菜标记（⭐图标），菜品名称和价格
- 餐位预订区域：日期选择、时段选择、人数选择、联系人姓名电话输入
- 预订按钮：调用预订接口

**农产品详情页（`/food/product/:id`）：**
- 商品主图、名称、价格、单位、库存、描述
- 加入购物车按钮

### 2.5 管理后台实现

- 餐厅管理：ProTable 列表，支持新增/编辑/删除，含封面图片预览
- 农产品管理：列表+新增/编辑弹窗，含价格/库存/单位字段
- 菜品管理：列表+新增/编辑弹窗，含所属餐厅选择、招牌菜开关
- 订单管理：复用统一订单列表，按 `food_meal` 和 `food_product` 类型筛选
- 评价管理：列表+状态操作+回复

### 2.6 小程序实现

**餐厅列表页（`pages/food/list`）：**
- 卡片列表展示餐厅，支持评分排序和距离排序（Mock）

**餐厅详情页（`pages/food/detail`）：**
- 主图轮播、基本信息、菜品列表、餐位预订表单

**餐位预订（`pages/food/booking`）：**
- 日期日历选择、时段选择、人数选择、联系人表单、提交预订

---

## 模块三：住·住宿预订

### 3.1 功能概述

住模块实现了苗寨特色民宿的在线搜索、查看和预订功能。核心特色是房态日历系统——用户可以按月查看民宿的每日房价和可预订房量，商家可以批量设置未来一段时间的价格和库存。

### 3.2 数据实体与流向

**核心数据表：**
- `wd_accommodation_homestay` — 民宿表（名称、封面图、电话、地址、描述、设施标签、评分、状态）
- `wd_accommodation_room_type` — 房型表（所属民宿、名称、面积、床型、可住人数、价格、周末价、图片、设施、数量）
- `wd_accommodation_calendar` — 房态日历表（所属房型、日期、价格、库存、状态：正常/满房/维护）

**数据流向：**
```
民宿管理 → wd_accommodation_homestay表
房型管理 → wd_accommodation_room_type表（关联homestay）
日历管理 → wd_accommodation_calendar表（关联room_type）

游客搜索 → GET /api/v1/homestays（分页+搜索+排序）
           → 返回列表含min_price（从room_type表子查询最低价）

游客查看详情 → GET /api/v1/homestays/:id
              → 返回民宿信息 + 关联的room_types列表

游客查看日历 → GET /api/v1/room-types/:id/calendar?month=2026-07
              → 返回该月每天的price/stock/status

商家批量设置日历 → POST /api/v1/calendar/batch
                   → 接收roomTypeId/startDate/endDate/price/stock/status
                   → 逐日upsert到calendar表

游客预订 → 调用统一订单接口 → wd_order表 + wd_order_item表
```

### 3.3 后端API实现（共11个端点）

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/homestays` | GET | 民宿列表（分页+关键字搜索） |
| `/api/v1/homestays/all` | GET | 所有民宿（无分页，下拉选择用） |
| `/api/v1/homestays/:id` | GET | 民宿详情（含关联房型列表） |
| `/api/v1/homestays` | POST | 新增民宿 |
| `/api/v1/homestays/:id` | PUT | 更新民宿 |
| `/api/v1/homestays/:id` | DELETE | 删除民宿 |
| `/api/v1/homestays/:id/room-types` | GET | 民宿的房型列表 |
| `/api/v1/room-types/all` | GET | 所有房型 |
| `/api/v1/room-types` | POST | 新增房型 |
| `/api/v1/room-types/:id` | PUT | 更新房型 |
| `/api/v1/room-types/:id` | DELETE | 删除房型 |
| `/api/v1/room-types/:id/calendar?month=2026-07` | GET | 按月查询房态日历 |
| `/api/v1/calendar/batch` | POST | 批量设置房态日历（逐日upsert） |
| `/api/v1/accommodation-orders` | GET | 住宿订单列表 |
| `/api/v1/accommodation-reviews` | GET | 住宿评价列表 |

**关键实现细节：**
- 民宿列表接口使用原生SQL查询，通过子查询 `(SELECT MIN(price) FROM wd_accommodation_room_type WHERE homestay_id = h.id)` 计算最低房价返回给前端展示
- `facilities` 字段为 `simple-json` 类型，存储设施标签数组（如 WiFi/空调/独立卫浴/观景台），后端使用原生SQL查询时需手动 `JSON.parse()`
- 日历批量设置接口的核心逻辑：遍历 startDate 到 endDate 的每一天，检查是否已有记录，有则更新、无则插入（upsert模式）
- 民宿列表返回的数据经过设施字段的 JSON 解析处理，确保前端拿到的是 JavaScript 数组而非字符串

### 3.4 PC前端实现

**民宿列表页（`/accommodation`）：**
- 搜索框：输入关键字搜索民宿名称
- 排序切换：评分最高、价格最低、默认排序
- 卡片网格：展示民宿封面图、名称、最低价（¥XXX起）、评分、设施标签（取前2个）
- 封面图使用 `<img>` 标签渲染，设置 `onError` 默认兜底图防止加载失败产生碎图

**民宿详情页（`/accommodation/:id`）：**
- 民宿封面大图、名称、评分、地址、电话
- 设施标签展示（从 `facilities` 数组渲染为 Tag 组件）
- 民宿介绍文字
- 房型列表：每个房型卡片展示名称、面积、床型、可住人数、价格/周末价

**预订页（`/accommodation/booking/:id`）：**
- 入住日期和离店日期选择（DatePicker）
- 选择房型后显示对应价格
- 联系人信息表单
- 提交预订生成订单

### 3.5 管理后台实现

**民宿管理：**
- ProTable 列表：民宿名称（缩略图）、评分（Rate组件）、设施标签、电话、营业状态（Switch）、操作
- 新增/编辑弹窗：名称、封面图URL、电话、地址、评分、设施多选（Select mode="multiple"）、描述

**房型管理：**
- 列表：房型名（图片）、所属民宿（Tag）、床型、面积、可住人数、平日价、周末价、房量
- 新增/编辑弹窗：所属民宿选择、房型名称、床型、面积、可住人数、价格、周末价、房量、图片URL列表
- 所属民宿下拉框：数据从 `GET /api/v1/homestays/all` 加载
- 按民宿筛选：Select 选择民宿后前端过滤列表

**房态日历：**
- 月份选择器（month picker）
- 先选择民宿，再选择房型
- 日历网格展示：按月显示每一天的日期、价格、库存、状态
- 批量设置区域：日期范围、价格、库存、状态，点击保存后循环 upsert 到 calendar 表

**住宿订单管理：**
- 从统一订单中心筛选 order_type='accommodation' 的订单
- 展示订单号、民宿名称、房型名称、入住人信息、金额、状态

**住宿评价管理：**
- 评价列表（从 wd_clothing_review 表按 product_id 关联查询）

### 3.6 小程序实现

**民宿列表（`pages/accommodation/index`）：**
- 卡片列表展示民宿封面和基本信息
- 下拉加载更多

**民宿详情（`pages/accommodation/detail`）：**
- 封面图、名称、评分、地址、描述、设施
- 房型选择列表
- 预订入口按钮

**民宿预订（`pages/accommodation/booking`）：**
- 入住/离店日期选择
- 房型选择和价格展示
- 联系人表单：姓名、手机号
- 预订提交按钮

---

## 模块四：行·线路订票

### 4.1 功能概述

行模块实现了苗寨景区门票和路线套餐的在线购买与电子票核销功能。游客可以在线购买景区门票、浏览苗寨游路线套餐（一日游/两日游），支持电子票生成和现场核销。

### 4.2 数据实体与流向

**核心数据表：**
- `wd_travel_scenic_spot` — 景区表（名称、封面图、地址、描述、营业时间、评分、状态）
- `wd_travel_ticket_type` — 票种表（所属景区、名称、价格、库存、有效天数、描述、状态）
- `wd_travel_route` — 路线套餐表（名称、封面图、行程天数、价格、最大人数、包含景点ID列表、描述、行程安排JSON）
- `wd_travel_e_ticket` — 电子票表（所属订单、票码、状态：未使用/已核销/已过期、核销时间）

**数据流向：**
```
景区管理 → wd_travel_scenic_spot表
票种管理 → wd_travel_ticket_type表（关联scenic_spot）
路线管理 → wd_travel_route表

游客浏览景区 → GET /api/v1/scenic-spots（列表）
              → GET /api/v1/scenic-spots/:id（详情+ticketTypes）

游客浏览路线 → GET /api/v1/routes（列表）
              → GET /api/v1/routes/:id（详情）

游客购票 → POST /api/v1/orders（生成订单+电子票）
电子票核销 → POST /api/v1/e-tickets/verify（输入票码→状态变更）
```

### 4.3 后端API实现（共13个端点）

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/scenic-spots` | GET | 景区列表（分页+搜索） |
| `/api/v1/scenic-spots/all` | GET | 所有景区（下拉选择用） |
| `/api/v1/scenic-spots/:id` | GET | 景区详情（含关联票种） |
| `/api/v1/scenic-spots` | POST | 新增景区 |
| `/api/v1/scenic-spots/:id` | PUT | 更新景区 |
| `/api/v1/scenic-spots/:id` | DELETE | 删除景区 |
| `/api/v1/scenic-spots/:id/ticket-types` | GET | 景区的票种列表 |
| `/api/v1/ticket-types/all` | GET | 所有票种 |
| `/api/v1/ticket-types` | POST | 新增票种 |
| `/api/v1/ticket-types/:id` | PUT | 更新票种 |
| `/api/v1/ticket-types/:id` | DELETE | 删除票种 |
| `/api/v1/routes` | GET | 路线列表 |
| `/api/v1/routes/:id` | GET | 路线详情 |
| `/api/v1/routes` | POST | 新增路线 |
| `/api/v1/routes/:id` | PUT | 更新路线 |
| `/api/v1/routes/:id` | DELETE | 删除路线 |
| `/api/v1/e-tickets` | GET | 电子票列表（分页+状态筛选） |
| `/api/v1/e-tickets/verify` | POST | 核销电子票（输入ticketCode→标记已使用） |

**关键实现细节：**
- 景区详情接口在返回景区信息的同时，手动查询 `wd_travel_ticket_type` 表获取关联票种列表
- 电子票核销接口：根据 ticketCode 查询电子票，检查状态是否为未使用(0)，是则更新为已核销(1)并记录核销时间，不是则抛出错误
- 路线套餐的 `scenic_ids` 字段使用 `simple-json` 存储包含的景点ID数组，`itinerary` 字段存储行程安排的JSON对象
- 电子票列表接口在返回每条记录时，额外查询 `wd_order` 表获取订单号和金额

### 4.4 PC前端实现

**出行首页（`/travel`）：**
- Tab 切换：景区门票 / 路线套餐
- 景区Tab：卡片网格展示景区封面图、名称、评分、地址、营业时间
- 路线Tab：卡片网格展示路线封面图、名称、行程天数（Tag）、最大人数、价格（¥XXX/人）

**景区详情页（`/travel/scenic/:id`）：**
- 封面大图、名称、评分、地址、营业时间、描述
- 票种列表：每个票种卡片展示名称、价格、库存、有效天数
- "立即购买"按钮：跳转预订流程

**路线详情页（`/travel/route/:id`）：**
- 路线封面图、名称、行程天数、价格、最大人数、描述
- 行程安排展示：从 `itinerary` JSON 字段渲染
- "立即预订"按钮

### 4.5 管理后台实现

**景区管理：**
- ProTable 列表：景区名称（缩略图）、评分、地址、营业时间、状态
- 新增/编辑弹窗：名称、封面图URL、地址、营业时间、评分、描述

**票种管理：**
- 列表：票种名称、所属景区（Tag）、价格、库存、有效天数、状态
- 新增/编辑弹窗：所属景区选择、名称、价格、库存、有效天数、状态

**路线管理：**
- 列表：路线名称（缩略图）、行程天数、价格、最大人数、状态
- 新增/编辑弹窗：名称、封面图、行程天数、价格、最大人数、描述

**电子票核销：**
- 电子票列表：票码、订单号、金额、状态（未使用/已核销）、核销时间
- 核销输入框：输入票码点击核销，调用 `POST /api/v1/e-tickets/verify`

**订单管理：**
- 筛选 order_type='travel' 的订单列表

### 4.6 小程序实现

**出行列表（`pages/travel/index`）：**
- Tab 切换景区和路线
- 卡片网格展示

**出行详情（`pages/travel/detail`）：**
- 景区/路线详情展示
- 票种列表/行程安排

**出行预订（`pages/travel/booking`）：**
- 票种选择、数量选择
- 联系人表单
- 提交预订

---

## 模块五：社区·照片分享

### 5.1 功能概述

社区模块构建了一个完整的 UGC（用户生成内容）生态。游客可以发布游记、上传照片、发表评论、点赞互动、关注其他用户、收藏感兴趣的内容、举报违规内容。管理后台可以对内容进行审核和管控。

### 5.2 数据实体与流向

**核心数据表（7张）：**
- `wd_community_travelogue` — 游记表（用户ID、标题、内容、封面图、图片列表、视频URL、位置、话题ID、审核状态、浏览/点赞/评论/分享计数、关联业务类型和ID）
- `wd_community_comment` — 评论表（用户ID、游记/评论ID、父评论ID、内容）
- `wd_community_like` — 点赞表（用户ID、游记/评论ID、目标类型）
- `wd_community_topic` — 话题表（名称、图标、排序）
- `wd_community_follow` — 关注表（关注者ID、被关注者ID）
- `wd_community_favorite` — 收藏表（用户ID、游记/商品ID、目标类型）
- `wd_community_report` — 举报表（举报用户ID、目标类型和ID、原因、处理状态）

**数据流向：**
```
用户发布游记 → POST /api/v1/travelogues → wd_community_travelogue表（status=0待审核）
用户发表评论 → POST /api/v1/comments → wd_community_comment表
              → wd_community_travelogue.commentCount+1

用户点赞 → POST /api/v1/likes → 检查是否已赞
          → 已赞：删除点赞记录，likeCount-1
          → 未赞：插入点赞记录，likeCount+1

用户关注 → POST /api/v1/follows → toggle（关注/取消）
用户收藏 → POST /api/v1/favorites → toggle（收藏/取消）
用户举报 → POST /api/v1/reports → wd_community_report表（status=0待处理）

管理员审核游记 → PUT /api/v1/travelogues/:id/status → 修改status字段（0→待审,1→通过,2→驳回）

浏览社区首页 → GET /api/v1/travelogues（分页+状态+搜索）
              → 每条游记附带用户昵称和头像（从wd_user表关联查询）
              
查看游记详情 → GET /api/v1/travelogues/:id
              → 游记信息 + 用户信息（关联wd_user表）
              → 评论列表（关联wd_user表获取评论用户昵称）
              → 浏览量+1
```

### 5.3 后端API实现（共15个端点）

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/travelogues` | GET | 游记列表（分页+状态+关键字搜索） |
| `/api/v1/travelogues/:id` | GET | 游记详情（含评论列表，viewCount+1） |
| `/api/v1/travelogues` | POST | 发布游记 |
| `/api/v1/travelogues/:id` | PUT | 更新游记 |
| `/api/v1/travelogues/:id/status` | PUT | 审核游记（修改状态） |
| `/api/v1/travelogues/:id` | DELETE | 删除游记 |
| `/api/v1/comments` | GET | 评论列表（支持targetType+targetId筛选） |
| `/api/v1/comments` | POST | 发表评论（同时游记commentCount+1） |
| `/api/v1/comments/:id` | DELETE | 删除评论 |
| `/api/v1/likes` | POST | 切换点赞（已赞→取消，未赞→点赞） |
| `/api/v1/topics` | GET | 话题列表（按sortOrder排序） |
| `/api/v1/topics` | POST | 新增话题 |
| `/api/v1/topics/:id` | PUT | 更新话题 |
| `/api/v1/topics/:id` | DELETE | 删除话题 |
| `/api/v1/follows` | POST | 切换关注（关注/取消） |
| `/api/v1/favorites` | POST | 切换收藏（收藏/取消） |
| `/api/v1/reports` | GET | 举报列表（分页+状态筛选） |
| `/api/v1/reports` | POST | 提交举报 |
| `/api/v1/reports/:id/status` | PUT | 处理举报（修改状态） |
| `/api/v1/community/stats` | GET | 社区数据统计 |

**关键实现细节：**
- 游记列表每条记录都关联查询 `wd_user` 表获取用户昵称和头像，使用 `Promise.all` 并行查询提高效率
- 游记详情接口增加 viewCount 浏览计数（每次调用 +1）
- 创建评论时，如果评论对象是游记（targetType='travelogue'），自动递增游记的 commentCount 字段
- 点赞切换使用 `findOne` 检查是否已存在记录，存在则删除并递减计数，不存在则插入并递增计数（乐观锁模式）
- 游记的 `status` 字段支持三态：0=待审核、1=已发布、2=驳回
- 游记的 `linkedType` 和 `linkedId` 字段支持关联到其他模块的业务（如关联到某家餐厅或民宿），实现跨模块内容联动

### 5.4 PC前端实现

**社区首页（`/community`）：**
- 左侧主区域：游记瀑布流列表（3列网格），每个卡片展示封面图、标题、用户头像昵称、浏览/点赞/评论数量
- 右侧边栏：热门话题列表（Tag 标签），点击跳转到话题详情页
- 搜索框：搜索游记标题

**游记详情页（`/community/travelogue/:id`）：**
- 游记标题、封面图/内容图片
- 作者信息：头像、昵称
- 互动按钮：点赞（心形图标切换）、评论数
- 评论列表：用户头像、昵称、评论内容、评论时间
- 评论输入框：发表评论

**话题页（`/community/topic/:id`）：**
- 展示话题下的游记列表

**用户页（`/community/user/:id`）：**
- 用户信息和发布的游记列表

### 5.5 管理后台实现

**游记管理（6个Tab）：**
- 待审核Tab：展示 status=0 的游记，操作通过/驳回
- 游记管理Tab：展示所有游记，支持搜索和状态筛选
- 评论管理Tab：评论列表，支持删除
- 话题管理Tab：话题增删改
- 举报处理Tab：举报列表，处理（通过/驳回）
- 数据统计Tab：游记总数、评论总数、话题统计等

### 5.6 小程序实现

**社区首页（`pages/community/index`）：**
- 话题列表导航
- 最新游记列表

**游记详情（`pages/community/detail`）：**
- 游记完整展示、评论列表、点赞/评论操作

**发布游记（`pages/community/publish`）：**
- 标题、正文、图片上传（选择本地图片）
- 选择话题
- 定位信息

**话题页（`pages/community/topic`）：**
- 话题下的游记列表

---

## 模块六：平台管理后台

### 6.1 功能概述

管理后台是项目中体量最大的模块，为平台运营方提供全面的管理能力。包括管理员鉴权、数据可视化看板、用户与商家管理、内容运营配置、财务结算、系统设置等功能。同时提供独立的商家后台框架，供已入驻商家管理自己的店铺。

### 6.2 数据实体（共12张表）

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| `wd_admin` | 管理员账号 | username, password(bcrypt), realName, roleId, status, lastLoginAt |
| `wd_admin_role` | 角色定义 | name, permissions(JSON数组) |
| `wd_admin_merchant` | 商家信息 | userId, shopName, module, contactPerson, contactPhone, status |
| `wd_admin_merchant_application` | 入驻申请 | userId, shopName, module, credentials(资质材料), status, rejectReason |
| `wd_admin_banner` | 轮播图 | title, imageUrl, linkUrl, sortOrder, status |
| `wd_admin_announcement` | 公告 | title, content, status, publishedAt |
| `wd_admin_recommendation` | 推荐位 | name, contentType, contentId, sortOrder, status |
| `wd_admin_activity_banner` | 活动横幅 | title, imageUrl, linkUrl, startDate, endDate, sortOrder |
| `wd_admin_system_message` | 系统消息 | userId(null=群发), type, title, content, isRead |
| `wd_admin_message_template` | 消息模板 | name, type, title, content, status |
| `wd_admin_finance_record` | 财务记录 | orderId, merchantId, amount, platformFee, merchantIncome, status |
| `wd_admin_system_config` | 系统配置 | key, value, description |
| `wd_admin_operation_log` | 操作日志 | adminId, action, target, detail, ip |
| `wd_admin_sensitive_word` | 敏感词 | word, status |

### 6.3 数据流向

```
管理员登录 → POST /api/v1/admin/auth/login → JWT Token → localStorage
            → 后续请求在Authorization Header携带Token

数据看板 → GET /api/v1/admin/dashboard
           → 实时查询多张表聚合计算：
           → wd_order（订单数/GMV/模块占比/趋势）
           → wd_user（DAU/新增用户/用户分层）
           → wd_community_travelogue（游记数）
           → wd_community_like（点赞数）
           → wd_admin_merchant（商家数）
           → wd_food_restaurant / wd_accommodation_homestay / wd_clothing_product / wd_travel_scenic_spot（商家总数统计）
           → 按模块抽佣比例实时计算财务数据

商家入驻流程 → 用户提交申请 → wd_admin_merchant_application表
              → 管理员审核 → 通过则创建wd_admin_merchant记录
              → 分配所属模块（衣/食/住/行）

首页运营 → 轮播图CRUD → wd_admin_banner表
          → 公告CRUD → wd_admin_announcement表
          → 推荐位CRUD → wd_admin_recommendation表
```

### 6.4 后端API实现（共40+端点）

**认证端点（3个）：**
- `POST /api/v1/admin/auth/login` — 管理员登录，验证用户名密码，返回JWT Token
- `POST /api/v1/admin/auth/refresh` — 刷新Token
- `POST /api/v1/admin/auth/logout` — 退出登录

**用户管理端点（3个）：**
- `GET /api/v1/admin/users` — 用户列表（分页+关键字搜索）
- `GET /api/v1/admin/users/:id` — 用户详情
- `PUT /api/v1/admin/users/:id` — 修改用户资料
- `PUT /api/v1/admin/users/:id/status` — 封禁/解封用户

**商家管理端点（5个）：**
- `GET /api/v1/admin/merchants` — 商家列表（分页+状态+模块筛选）
- `GET /api/v1/admin/merchant-applications` — 入驻申请列表
- `POST /api/v1/admin/merchant-applications/:id/review` — 审核入驻申请
- `POST /api/v1/admin/merchants/:id/force-logout` — 强制商家下线

**角色权限端点（4个）：**
- `GET/POST /api/v1/admin/roles` — 角色列表/新增
- `PUT/DEL /api/v1/admin/roles/:id` — 编辑/删除角色

**数据看板（1个）：**
- `GET /api/v1/admin/dashboard` — 返回23个指标数据

**运营配置端点（若干）：**
- CRUD `/api/v1/admin/banners` — 轮播图管理
- CRUD `/api/v1/admin/announcements` — 公告管理
- CRUD `/api/v1/admin/recommendations` — 推荐位管理
- CRUD `/api/v1/admin/activity-banners` — 活动横幅管理

**消息端点（4个）：**
- `GET/POST /api/v1/admin/messages` — 消息列表/发送
- CRUD `/api/v1/admin/message-templates` — 消息模板管理

**财务端点（1个）：**
- `GET /api/v1/admin/finance` — 结算记录列表

**系统设置端点（4个）：**
- `GET/PUT /api/v1/admin/config` — 系统配置读写
- CRUD `/api/v1/admin/sensitive-words` — 敏感词管理
- `GET /api/v1/admin/operation-logs` — 操作日志列表

**关键实现细节：**
- 首页运营的配置通过 `wd_admin_system_config` 表存储，key-value 结构，支持动态扩展
- 财务数据使用 SQL 实时计算，按订单类型应用不同的抽佣比例（clothing=5%, food=10%, accommodation=10%, travel=10%）
- 数据看板的涨跌幅（较昨日）通过两次 SQL 查询分别获取今日和昨日的聚合数据后计算百分比

### 6.5 管理前端实现（22个页面）

**登录页（`/login`）：**
- 居中卡片式登录表单，乌东文旅品牌色背景
- 用户名+密码输入，登录成功后存储 Token 到 localStorage
- 已登录自动跳转 Dashboard

**数据看板（`/dashboard`）：**
- 23个数据指标，5个区域：
  1. KPI卡片行：GMV（蓝）、总订单数（蓝）、已支付订单（绿）、新增用户（金）、活跃商家（紫）
  2. 图表行：近7日订单趋势折线图、订单占比环形图、各模块GMV柱状图
  3. 中间行：近7日新增用户折线图、用户分层饼图、热门话题排行、辅助指标2×3网格
  4. 底部：今日DAU、支付转化率、待结算金额、导出CSV按钮
  5. 最近订单表格

**用户管理（`/user/list`）：**
- ProTable 用户列表，支持关键词搜索
- 封禁/解封按钮（使用软删除模拟）
- 查看详情弹窗（Descriptions 展示完整信息）
- 编辑资料弹窗（修改昵称和手机号）

**商家管理（`/user/merchants`）：**
- ProTable 商家列表，支持按模块和状态筛选
- 封面图展示（从对应业务表关联查询）
- 查看详情弹窗、修改状态、强制下线

**角色权限（`/user/roles`）：**
- ProTable 角色列表
- 新增/编辑弹窗：角色名 + 9种权限的 Checkbox 选择
- 删除角色（Popconfirm 确认）

**入驻审核（`/user/applications`）：**
- 三 Tab 切换：待审核/已通过/已驳回
- 审核弹窗：展示申请人资质材料（JSON格式化显示）
- 通过时选择所属模块（衣·商品/食·餐饮/住·民宿/行·线路）
- 驳回时填写驳回原因

**全局订单（`/order`）：**
- 三 Tab 切换：全部订单/异常订单（cancelled）/退款审批（refunded）
- ProTable 展示，支持按订单类型和状态下拉筛选
- 查看详情弹窗

**首页运营（`/operation`）：**
- 四 Tab 切换：轮播图管理/公告管理/推荐位管理/活动横幅管理
- 各自的 ProTable CRUD 页面

**消息中心（`/message`）：**
- 双 Tab：消息发送（历史列表 + 发送新消息弹窗）/ 消息模板管理

**财务结算（`/finance`）：**
- ProTable 结算记录列表，展示订单号、商家名称、订单金额、平台抽佣、商家收入、状态、结算时间

**系统设置（`/system`）：**
- 五 Tab：系统配置（抽佣比例Form）/ 运费模板 / 支付配置 / 短信配置 / 敏感词库 / 操作日志

### 6.6 商家后台实现

**商家登录页（`/merchant/login`）：**
- 独立的商家登录入口，区别于管理员后台

**商家工作台（`/merchant/dashboard`）：**
- 统计卡片：今日订单、待处理、本月营业额、好评率
- 最近订单列表（简化版）

**店铺设置（`/merchant/settings`）：**
- 店铺信息表单：名称、联系人、电话、简介、封面图

**消息通知（`/merchant/messages`）：**
- 消息列表，展示系统发送给商家的通知

**账号设置（`/merchant/account`）：**
- 修改密码表单、绑定手机号表单

---

## 公共服务

### 7.1 用户认证服务

**数据表：** `wd_user`

**端点：**
- `POST /api/v1/auth/register` — 用户注册（手机号+密码）
- `POST /api/v1/auth/login` — 用户登录
- `POST /api/v1/auth/refresh` — 刷新 Token

**实现细节：**
- 密码使用 bcrypt cost=12 加密存储
- JWT Access Token 有效期7天，Refresh Token 有效期30天
- Refresh Token 不可作为 Access Token 使用（中间件校验 type 字段）
- Redis 黑名单机制：管理员强制退出时将 Token 加入黑名单

### 7.2 统一订单服务

**数据表：** `wd_order`, `wd_order_item`

**端点：**
- `GET /api/v1/orders` — 订单列表（分页+类型+状态筛选）
- `GET /api/v1/orders/:id` — 订单详情
- `POST /api/v1/orders` — 创建订单
- `POST /api/v1/orders/:id/cancel` — 取消订单
- `POST /api/v1/orders/:id/pay` — 支付订单
- `POST /api/v1/orders/:id/confirm` — 确认收货

**订单状态机：**
```
待支付 → 支付成功 → 待确认 → 商家确认 → 已确认 → 用户确认 → 已完成
  ↓          ↓                        ↓                     ↓
用户取消   15分钟自动取消             商家拒绝(退款)       7日自动确认
```

**订单类型：** clothing（商品）、food_meal（餐饮）、food_product（农产品）、accommodation（住宿）、travel（出行）

### 7.3 统一购物车服务

**数据表：** `wd_cart_item`

**功能：**
- 衣模块商品和食模块农产品可加入同一购物车
- 支持增删改、数量调整、合计金额计算
- 购物车数据持久化到数据库

### 7.4 认证中间件

**实现细节：**
- 全局中间件，匹配 `/api/*` 路径
- 白名单机制：认证接口、GET列表接口、各模块业务接口免登录
- 管理后台接口 MVP 阶段全部放行（带安全注释）
- Token 验证 → 拒绝 Refresh Token → 检查 Redis 黑名单 → 挂载 user 信息到 ctx
