# 乌东文旅平台 实施计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现乌东文旅"衣食住行"综合服务平台的完整后端架构，包括公共模块和6个业务模块的数据库表、Entity、Controller、Service，以及管理后台前端 CRUD 页面。

**Architecture:** 单体后端 (cool-admin/Midway.js + TypeORM + MySQL)，公共模块统一管理用户/订单/支付/购物车，6个业务模块各自独立。管理后台使用 cool-admin-vue 的 CRUD 组件自动生成页面。小程序端和 PC 端后续搭建。

**Tech Stack:** Midway.js + TypeORM + MySQL 8.0 + Redis + cool-admin 框架

---

## 阶段划分

整个实施分为 4 个阶段，按依赖顺序执行：

```
阶段 0: 基础设施准备 → 阶段 1: 公共模块 → 阶段 2: 业务模块 → 阶段 3: 管理后台前端
```

---

## 阶段 0: 基础设施准备

在开始编码之前，确保开发环境就绪。

### Task 0.1: 验证开发环境

**Files:** N/A

- [ ] **Step 1: 确认 Docker Compose 安装**

  运行: `docker --version && docker compose version`
  预期: Docker Desktop 20+ 和 Compose v2+

- [ ] **Step 2: 启动 MySQL + Redis**

  运行: `cd cool-admin-midway && docker compose up -d mysql redis`
  预期: 两个容器 Running

- [ ] **Step 3: 验证后端可启动**

  运行: `cd cool-admin-midway && pnpm install && pnpm dev`
  预期: 控制台输出 `Midwayjs koa service is running at http://localhost:8001`
  注意: 如果端口被占用，按 Ctrl+C 停止后重试

- [ ] **Step 4: 验证管理后台可访问**

  运行: `cd cool-admin-vue && pnpm install && pnpm dev`
  预期: 浏览器访问 `http://localhost:9000` 可看到登录页面
  默认账号: `admin` / `admin123`

---

## 阶段 1: 公共模块

公共模块是所有业务模块的基础，包含用户、订单、支付、购物车等。

### Task 1.1: 商家模块

**Files:**
- Create: `cool-admin-midway/src/modules/common/merchant/entity/merchant.ts`
- Create: `cool-admin-midway/src/modules/common/merchant/config.ts`
- Create: `cool-admin-midway/src/modules/common/merchant/controller/admin/merchant.ts`
- Create: `cool-admin-midway/src/modules/common/merchant/service/merchant.ts`

**说明：** 商家表用于管理审核通过后的商家账号。商家通过 `user_info` 表的用户体系登录，本表建立用户ID到商家的映射。

**entity/merchant.ts 内容：**

```typescript
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('merchant')
export class MerchantEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '关联用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '所属模块 1=衣 2=食 3=住 4=行', type: 'tinyint' })
  moduleType: number;

  @Column({ comment: '店铺名称', length: 100 })
  shopName: string;

  @Column({ comment: '联系人', length: 50, nullable: true })
  contactName: string;

  @Column({ comment: '联系电话', length: 20, nullable: true })
  contactPhone: string;

  @Column({ comment: '状态 0=禁用 1=正常', default: 1 })
  status: number;
}
```

**config.ts：**

```typescript
import { ModuleConfig } from '@cool-midway/core';
export default () => { return { name: '商家模块', description: '商家管理', order: 5 } as ModuleConfig; };
```

**controller/admin/merchant.ts：**

```typescript
import { CoolController, BaseController } from '@cool-midway/core';
import { MerchantEntity } from '../../entity/merchant';
import { MerchantService } from '../../service/merchant';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: MerchantEntity,
  service: MerchantService,
  pageQueryOp: {
    keyWordLikeFields: ['a.shopName', 'a.contactName'],
    fieldEq: ['a.moduleType', 'a.status'],
  },
})
export class AdminMerchantController extends BaseController {}
```

**service/merchant.ts：**

```typescript
import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity } from '../entity/merchant';

@Provide()
export class MerchantService extends BaseService {
  @InjectEntityModel(MerchantEntity)
  merchantEntity: Repository<MerchantEntity>;
}
```

- [ ] **Step 1: 创建 merchant 目录结构**

  运行: `mkdir -p cool-admin-midway/src/modules/common/merchant/{entity,controller/admin,service}`

- [ ] **Step 2: 创建 entity/merchant.ts**

  写入上述 Entity 代码

- [ ] **Step 3: 创建 config.ts**

  写入上述配置代码

- [ ] **Step 4: 创建 controller/admin/merchant.ts**

  写入上述 Controller 代码

- [ ] **Step 5: 创建 service/merchant.ts**

  写入上述 Service 代码

- [ ] **Step 6: 重启后端验证**

  运行: `curl -s http://localhost:8001/admin/common/merchant/page -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{"page":1,"pageSize":10}'`
  预期: 返回 `{"code":0,"data":{"list":[],"totalCount":0}}`

- [ ] **Step 7: 提交代码**

  运行: `git add cool-admin-midway/src/modules/common/merchant/ && git commit -m "feat: 添加商家模块"`

### Task 1.2: 订单模块

**Files:**
- Create: `cool-admin-midway/src/modules/common/order/entity/base.ts`
- Create: `cool-admin-midway/src/modules/common/order/entity/clothing.ts`
- Create: `cool-admin-midway/src/modules/common/order/entity/food.ts`
- Create: `cool-admin-midway/src/modules/common/order/entity/lodging.ts`
- Create: `cool-admin-midway/src/modules/common/order/entity/travel.ts`
- Create: `cool-admin-midway/src/modules/common/order/config.ts`
- Create: `cool-admin-midway/src/modules/common/order/controller/admin/base.ts`
- Create: `cool-admin-midway/src/modules/common/order/service/base.ts`

**说明：** 订单模块包含一个统一订单主表 `order_base` 和四个模块的订单明细表。管理后台通过 `order_base` 查看所有订单，通过明细表查看各模块详情。

**entity/base.ts（订单主表）：**

```typescript
import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('order_base')
export class OrderBaseEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '商家ID', type: 'int', nullable: true })
  merchantId: number;

  @Column({ comment: '模块类型 1=衣 2=食 3=住 4=行', type: 'tinyint' })
  moduleType: number;

  @Column({ comment: '订单总金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ comment: '实付金额', type: 'decimal', precision: 10, scale: 2 })
  payAmount: number;

  @Column({ comment: '优惠金额', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ comment: '订单状态 0=待支付 1=已支付 2=已确认 3=进行中 4=已完成 5=已取消 6=已退款', type: 'tinyint', default: 0 })
  status: number;

  @Column({ comment: '支付时间', type: 'datetime', nullable: true })
  payTime: Date;

  @Column({ comment: '完成时间', type: 'datetime', nullable: true })
  finishTime: Date;

  @Column({ comment: '取消时间', type: 'datetime', nullable: true })
  cancelTime: Date;

  @Column({ comment: '用户备注', length: 500, nullable: true })
  remark: string;

  @Column({ comment: '订单明细(JSON)', type: 'json', nullable: true })
  items: any[];
}
```

**entity/clothing.ts（衣订单明细）：**

```typescript
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('order_clothing')
export class OrderClothingEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '商品ID', type: 'int' })
  goodsId: number;

  @Column({ comment: '商品标题', length: 100 })
  goodsTitle: string;

  @Column({ comment: 'SKU ID', type: 'int' })
  skuId: number;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '单价', type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
```

**entity/food.ts（食订单明细，包含农产品和餐位预订两种类型）：**

```typescript
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

// 农产品订单明细
@Entity('order_food_product')
export class OrderFoodProductEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '农产品ID', type: 'int' })
  goodsId: number;

  @Column({ comment: '商品标题', length: 100 })
  goodsTitle: string;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '单价', type: 'decimal', precision: 10, scale: 2 })
  price: number;
}

// 餐位预订订单
@Entity('order_food_booking')
export class OrderFoodBookingEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '餐厅ID', type: 'int' })
  restaurantId: number;

  @Column({ comment: '餐厅名称', length: 100 })
  restaurantName: string;

  @Column({ comment: '预订日期', type: 'date' })
  bookingDate: Date;

  @Column({ comment: '时段ID', type: 'int' })
  timeSlotId: number;

  @Column({ comment: '人数', default: 1 })
  personCount: number;

  @Column({ comment: '总金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ comment: '预订人姓名', length: 50 })
  contactName: string;

  @Column({ comment: '联系电话', length: 20 })
  contactPhone: string;

  @Column({ comment: '备注', length: 200, nullable: true })
  remark: string;
}
```

**entity/lodging.ts（住订单明细）：**

```typescript
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('order_lodging')
export class OrderLodgingEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '民宿ID', type: 'int' })
  hostelId: number;

  @Column({ comment: '民宿名称', length: 100 })
  hostelName: string;

  @Column({ comment: '房型ID', type: 'int' })
  roomTypeId: number;

  @Column({ comment: '房型名', length: 50 })
  roomTypeName: string;

  @Column({ comment: '入住日期', type: 'date' })
  checkInDate: Date;

  @Column({ comment: '离店日期', type: 'date' })
  checkOutDate: Date;

  @Column({ comment: '晚数', default: 1 })
  nights: number;

  @Column({ comment: '人数', default: 1 })
  guestCount: number;

  @Column({ comment: '总金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ comment: '入住人姓名', length: 50 })
  guestName: string;

  @Column({ comment: '身份证号', length: 20, nullable: true })
  idCard: string;
}
```

**entity/travel.ts（行订单明细）：**

```typescript
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('order_travel')
export class OrderTravelEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '类型 1=门票 2=路线', type: 'tinyint' })
  itemType: number;

  @Column({ comment: '关联ID(景区ID或路线ID)', type: 'int' })
  targetId: number;

  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '单价', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '使用日期', type: 'date', nullable: true })
  useDate: Date;

  @Column({ comment: '游客姓名', length: 50 })
  visitorName: string;

  @Column({ comment: '联系电话', length: 20 })
  visitorPhone: string;
}
```

**controller/admin/base.ts：**

```typescript
import { CoolController, BaseController } from '@cool-midway/core';
import { OrderBaseEntity } from '../../entity/base';
import { OrderService } from '../../service/base';

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: OrderBaseEntity,
  service: OrderService,
  pageQueryOp: {
    keyWordLikeFields: ['a.orderNo'],
    fieldEq: ['a.moduleType', 'a.status'],
    orderBy: 'a.createTime',
    orderDir: 'DESC',
  },
})
export class AdminOrderBaseController extends BaseController {}
```

**service/base.ts：**

```typescript
import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OrderBaseEntity } from '../entity/base';

@Provide()
export class OrderService extends BaseService {
  @InjectEntityModel(OrderBaseEntity)
  orderBaseEntity: Repository<OrderBaseEntity>;

  /** 生成唯一订单编号 */
  async generateOrderNo(): Promise<string> {
    const prefix = 'WD';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
  }
}
```

**config.ts：**

```typescript
import { ModuleConfig } from '@cool-midway/core';
export default () => { return { name: '订单模块', description: '统一订单管理', order: 4 } as ModuleConfig; };
```

- [ ] **Step 1: 创建订单目录结构**

  运行: `mkdir -p cool-admin-midway/src/modules/common/order/{entity,controller/admin,service}`

- [ ] **Step 2: 创建 config.ts**

  写入上述配置代码

- [ ] **Step 3: 创建 entity/base.ts**

  写入 OrderBaseEntity

- [ ] **Step 4: 创建 entity/clothing.ts**

  写入 OrderClothingEntity

- [ ] **Step 5: 创建 entity/food.ts**

  写入 OrderFoodProductEntity + OrderFoodBookingEntity

- [ ] **Step 6: 创建 entity/lodging.ts**

  写入 OrderLodgingEntity

- [ ] **Step 7: 创建 entity/travel.ts**

  写入 OrderTravelEntity

- [ ] **Step 8: 创建 controller/admin/base.ts**

  写入 AdminOrderBaseController

- [ ] **Step 9: 创建 service/base.ts**

  写入 OrderService（含 generateOrderNo 方法）

- [ ] **Step 10: 重启后端验证**

  运行: `curl -s http://localhost:8001/admin/order/base/page -X POST -H "Authorization: Bearer YOUR_TOKEN" -d '{"page":1,"pageSize":10}'`
  预期: 返回空列表

- [ ] **Step 11: 提交代码**

  运行: `git add cool-admin-midway/src/modules/common/order/ && git commit -m "feat: 添加订单模块"`

### Task 1.3: 支付模块

**Files:**
- Create: `cool-admin-midway/src/modules/common/payment/entity/record.ts`
- Create: `cool-admin-midway/src/modules/common/payment/entity/refund.ts`
- Create: `cool-admin-midway/src/modules/common/payment/config.ts`
- Create: `cool-admin-midway/src/modules/common/payment/controller/admin/record.ts`
- Create: `cool-admin-midway/src/modules/common/payment/service/record.ts`

**entity/record.ts：**

```typescript
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('payment_record')
export class PaymentRecordEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index({ unique: true })
  @Column({ comment: '支付流水号', length: 64, nullable: true })
  transactionId: string;

  @Column({ comment: '支付金额', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ comment: '支付方式 1=微信支付', type: 'tinyint', default: 1 })
  payType: number;

  @Column({ comment: '状态 0=待支付 1=已支付 2=支付失败', type: 'tinyint', default: 0 })
  status: number;

  @Column({ comment: '支付时间', type: 'datetime', nullable: true })
  payTime: Date;

  @Column({ comment: '回调数据', type: 'text', nullable: true })
  callbackData: string;
}
```

**entity/refund.ts：**

```typescript
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('refund_record')
export class RefundRecordEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单编号', length: 32 })
  orderNo: string;

  @Index()
  @Column({ comment: '支付流水号', length: 64, nullable: true })
  transactionId: string;

  @Column({ comment: '退款金额', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ comment: '退款原因', length: 200, nullable: true })
  reason: string;

  @Column({ comment: '状态 0=申请中 1=已退款 2=拒绝退款', type: 'tinyint', default: 0 })
  status: number;

  @Column({ comment: '退款时间', type: 'datetime', nullable: true })
  refundTime: Date;
}
```

**controller/admin/record.ts：**

```typescript
import { CoolController, BaseController } from '@cool-midway/core';
import { PaymentRecordEntity } from '../../entity/record';
import { PaymentService } from '../../service/record';

@CoolController({
  api: ['page', 'info', 'list'],
  entity: PaymentRecordEntity,
  service: PaymentService,
  pageQueryOp: {
    keyWordLikeFields: ['a.orderNo'],
    fieldEq: ['a.status', 'a.payType'],
    orderBy: 'a.createTime',
    orderDir: 'DESC',
  },
})
export class AdminPaymentController extends BaseController {}
```

**service/record.ts：**

```typescript
import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRecordEntity } from '../entity/record';

@Provide()
export class PaymentService extends BaseService {
  @InjectEntityModel(PaymentRecordEntity)
  paymentRecordEntity: Repository<PaymentRecordEntity>;
}
```

**config.ts：**

```typescript
import { ModuleConfig } from '@cool-midway/core';
export default () => { return { name: '支付模块', description: '支付与退款记录', order: 3 } as ModuleConfig; };
```

- [ ] **Step 1: 创建目录**

  运行: `mkdir -p cool-admin-midway/src/modules/common/payment/{entity,controller/admin,service}`

- [ ] **Step 2: 创建所有文件**

  依次创建 config.ts, entity/record.ts, entity/refund.ts, controller/admin/record.ts, service/record.ts

- [ ] **Step 3: 重启后端验证**

  运行: `curl -s http://localhost:8001/admin/payment/record/page -X POST -H "Authorization: Bearer YOUR_TOKEN" -d '{"page":1,"pageSize":10}'`

- [ ] **Step 4: 提交代码**

  运行: `git add cool-admin-midway/src/modules/common/payment/ && git commit -m "feat: 添加支付模块"`

### Task 1.4: 购物车模块

**Files:**
- Create: `cool-admin-midway/src/modules/common/cart/entity/item.ts`
- Create: `cool-admin-midway/src/modules/common/cart/config.ts`
- Create: `cool-admin-midway/src/modules/common/cart/controller/admin/item.ts`
- Create: `cool-admin-midway/src/modules/common/cart/controller/open/item.ts`
- Create: `cool-admin-midway/src/modules/common/cart/service/item.ts`

**entity/item.ts：**

```typescript
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('cart_item')
export class CartItemEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Index()
  @Column({ comment: '商品ID', type: 'int' })
  goodsId: number;

  @Column({ comment: '商品标题', length: 100 })
  goodsTitle: string;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: 'SKU ID', type: 'int', nullable: true })
  skuId: number;

  @Column({ comment: 'SKU名称', length: 100, nullable: true })
  skuName: string;

  @Column({ comment: '单价', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '是否选中 0=否 1=是', default: 1 })
  checked: number;

  @Column({ comment: '来源模块 1=衣 2=食-农产品', type: 'tinyint' })
  moduleType: number;
}
```

**controller/open/item.ts（面向小程序/PC端）：**

```typescript
import { CoolController, BaseController } from '@cool-midway/core';
import { CartItemEntity } from '../../entity/item';
import { CartService } from '../../service/item';

@CoolController({
  api: ['add', 'update', 'delete', 'info', 'list', 'page'],
  entity: CartItemEntity,
  service: CartService,
  // 只读自己的购物车
  pageQueryOp: {
    where: [['userId = :userId', { userId: 0 }]], // 实际通过 middleware 注入 userId
  },
})
export class OpenCartItemController extends BaseController {}
```

**config.ts：**

```typescript
import { ModuleConfig } from '@cool-midway/core';
export default () => { return { name: '购物车模块', description: '统一购物车', order: 2 } as ModuleConfig; };
```

- [ ] **Step 1: 创建目录**

  运行: `mkdir -p cool-admin-midway/src/modules/common/cart/{entity,controller/admin,controller/open,service}`

- [ ] **Step 2: 创建所有文件**

- [ ] **Step 3: 验证**

- [ ] **Step 4: 提交**

### Task 1.5: 其他公共模块

**Files:**

1. **文件上传** - `cool-admin-midway/src/modules/common/upload/`
2. **消息通知** - `cool-admin-midway/src/modules/common/message/`
3. **运费模板** - `cool-admin-midway/src/modules/common/shipping/`
4. **财务结算** - `cool-admin-midway/src/modules/common/finance/`

这些模块的结构与上面相同（entity + config + controller/admin + service），按设计文档中的表结构创建即可。

---

## 阶段 2: 业务模块

每个业务模块包含：Entity（衣/食/住/行/社区各自的表）、Admin Controller（管理后台 CRUD）、Open Controller（小程序/PC端 API）。

### Task 2.1: 衣模块（第1组）

**Files:**
- Create: `cool-admin-midway/src/modules/clothing/entity/category.ts`
- Create: `cool-admin-midway/src/modules/clothing/entity/goods.ts`
- Create: `cool-admin-midway/src/modules/clothing/entity/goodsSku.ts`
- Create: `cool-admin-midway/src/modules/clothing/entity/review.ts`
- Create: `cool-admin-midway/src/modules/clothing/entity/collect.ts`
- Create: `cool-admin-midway/src/modules/clothing/config.ts`
- Create: `cool-admin-midway/src/modules/clothing/controller/admin/*.ts` (每个 entity 对应一个)
- Create: `cool-admin-midway/src/modules/clothing/controller/open/*.ts`
- Create: `cool-admin-midway/src/modules/clothing/service/*.ts`

**关键 entity 设计：**

```typescript
// entity/goods.ts
@Entity('clothing_goods')
export class ClothingGoodsEntity extends BaseEntity {
  @Index()
  @Column({ comment: '分类ID', type: 'int' })
  categoryId: number;

  @Index()
  @Column({ comment: '商家ID', type: 'int', nullable: true })
  merchantId: number;

  @Column({ comment: '商品标题', length: 100 })
  title: string;

  @Column({ comment: '副标题', length: 200, nullable: true })
  subtitle: string;

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: '图片列表', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '市场价', type: 'decimal', precision: 10, scale: 2, nullable: true })
  marketPrice: number;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 2, default: 5 })
  rating: number;

  @Column({ comment: '工艺介绍', type: 'text', nullable: true })
  craftIntro: string;

  @Column({ comment: '传承人', length: 50, nullable: true })
  inheritorName: string;

  @Column({ comment: '详情', type: 'text', nullable: true })
  detailContent: string;

  @Column({ comment: '状态 0=下架 1=上架', default: 1 })
  status: number;
}
```

**Admin Controller 示例（goods）：**

```typescript
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ClothingGoodsEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.title', 'a.subtitle'],
    fieldEq: ['a.status', 'a.categoryId', 'a.merchantId'],
    orderBy: 'a.createTime',
    orderDir: 'DESC',
  },
})
export class AdminClothingGoodsController extends BaseController {}
```

**Open Controller 示例（goods）：**

```typescript
import { Inject, Post } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ClothingGoodsEntity } from '../../entity/goods';
import { ClothingService } from '../../service/goods';

@CoolController({
  api: ['page', 'info', 'list'],
  entity: ClothingGoodsEntity,
  service: ClothingService,
  pageQueryOp: {
    keyWordLikeFields: ['title', 'subtitle'],
    fieldEq: ['status'],
    orderBy: 'createTime',
    orderDir: 'DESC',
  },
})
export class OpenClothingGoodsController extends BaseController {
  @Inject()
  clothingService: ClothingService;

  @Post('/hot', { summary: '热门商品' })
  async hot() {
    return this.ok(await this.clothingService.getHotGoods());
  }
}
```

- [ ] **Step 1: 创建目录**

  运行: `mkdir -p cool-admin-midway/src/modules/clothing/{entity,controller/admin,controller/open,service}`

- [ ] **Step 2: 创建所有 entity 文件**

  category.ts, goods.ts, goodsSku.ts, review.ts, collect.ts

- [ ] **Step 3: 创建 config.ts**

- [ ] **Step 4: 创建 admin controller（每个 entity 一个）**

- [ ] **Step 5: 创建 open controller**

- [ ] **Step 6: 创建 service**

- [ ] **Step 7: 验证 API**

- [ ] **Step 8: 提交**

### Task 2.2: 食模块（第2组）

**Files:**
- Create: `cool-admin-midway/src/modules/food/entity/restaurant.ts`
- Create: `cool-admin-midway/src/modules/food/entity/dish.ts`
- Create: `cool-admin-midway/src/modules/food/entity/timeSlot.ts`
- Create: `cool-admin-midway/src/modules/food/entity/agricultureCategory.ts`
- Create: `cool-admin-midway/src/modules/food/entity/agricultureGoods.ts`
- Create: `cool-admin-midway/src/modules/food/entity/review.ts`
- Create: `cool-admin-midway/src/modules/food/entity/collect.ts`
- Create: `cool-admin-midway/src/modules/food/config.ts`
- Create: `cool-admin-midway/src/modules/food/controller/admin/*.ts`
- Create: `cool-admin-midway/src/modules/food/controller/open/*.ts`
- Create: `cool-admin-midway/src/modules/food/service/*.ts`

### Task 2.3: 住模块（第3组）

**Files:**
- Create: `cool-admin-midway/src/modules/lodging/entity/hostel.ts`
- Create: `cool-admin-midway/src/modules/lodging/entity/roomType.ts`
- Create: `cool-admin-midway/src/modules/lodging/entity/calendar.ts`
- Create: `cool-admin-midway/src/modules/lodging/entity/hostelPolicy.ts`
- Create: `cool-admin-midway/src/modules/lodging/entity/review.ts`
- Create: `cool-admin-midway/src/modules/lodging/entity/collect.ts`
- Create: `cool-admin-midway/src/modules/lodging/config.ts`
- Create: `cool-admin-midway/src/modules/lodging/controller/admin/*.ts`
- Create: `cool-admin-midway/src/modules/lodging/controller/open/*.ts`
- Create: `cool-admin-midway/src/modules/lodging/service/*.ts`

**关键 - calendar.ts（房态日历）：**

```typescript
@Entity('lodging_calendar')
export class LodgingCalendarEntity extends BaseEntity {
  @Index()
  @Column({ comment: '房型ID', type: 'int' })
  roomTypeId: number;

  @Column({ comment: '日期', type: 'date' })
  date: Date;

  @Column({ comment: '可用库存', default: 0 })
  availableStock: number;

  @Column({ comment: '当日价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '是否可订 0=不可订 1=可订', default: 1 })
  isAvailable: number;
}
```

### Task 2.4: 行模块（第4组）

**Files:**
- Create: `cool-admin-midway/src/modules/travel/entity/scenic.ts`
- Create: `cool-admin-midway/src/modules/travel/entity/ticketType.ts`
- Create: `cool-admin-midway/src/modules/travel/entity/route.ts`
- Create: `cool-admin-midway/src/modules/travel/entity/routeDay.ts`
- Create: `cool-admin-midway/src/modules/travel/entity/eTicket.ts`
- Create: `cool-admin-midway/src/modules/travel/entity/guide.ts`
- Create: `cool-admin-midway/src/modules/travel/entity/review.ts`
- Create: `cool-admin-midway/src/modules/travel/entity/collect.ts`
- Create: `cool-admin-midway/src/modules/travel/config.ts`
- Create: `cool-admin-midway/src/modules/travel/controller/admin/*.ts`
- Create: `cool-admin-midway/src/modules/travel/controller/open/*.ts`
- Create: `cool-admin-midway/src/modules/travel/service/*.ts`

### Task 2.5: 社区模块（第5组）

**Files:**
- Create: `cool-admin-midway/src/modules/community/entity/article.ts`
- Create: `cool-admin-midway/src/modules/community/entity/comment.ts`
- Create: `cool-admin-midway/src/modules/community/entity/topic.ts`
- Create: `cool-admin-midway/src/modules/community/entity/follow.ts`
- Create: `cool-admin-midway/src/modules/community/entity/like.ts`
- Create: `cool-admin-midway/src/modules/community/entity/collect.ts`
- Create: `cool-admin-midway/src/modules/community/entity/report.ts`
- Create: `cool-admin-midway/src/modules/community/entity/image.ts`
- Create: `cool-admin-midway/src/modules/community/entity/video.ts`
- Create: `cool-admin-midway/src/modules/community/config.ts`
- Create: `cool-admin-midway/src/modules/community/controller/admin/*.ts`
- Create: `cool-admin-midway/src/modules/community/controller/open/*.ts`
- Create: `cool-admin-midway/src/modules/community/service/*.ts`

**关键 - article.ts（游记）：**

```typescript
@Entity('community_article')
export class CommunityArticleEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID', type: 'int' })
  userId: number;

  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '文字内容', type: 'text' })
  content: string;

  @Column({ comment: '图片列表', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '视频URL', length: 500, nullable: true })
  videoUrl: string;

  @Column({ comment: '话题ID列表', type: 'json', nullable: true })
  topicIds: number[];

  @Column({ comment: '关联地点类型 1=餐厅 2=民宿 3=景区', type: 'tinyint', nullable: true })
  relatedPlaceType: number;

  @Column({ comment: '关联地点ID', type: 'int', nullable: true })
  relatedPlaceId: number;

  @Column({ comment: '点赞数', default: 0 })
  likes: number;

  @Column({ comment: '评论数', default: 0 })
  comments: number;

  @Column({ comment: '收藏数', default: 0 })
  collects: number;

  @Column({ comment: '浏览数', default: 0 })
  views: number;

  @Column({ comment: '状态 0=待审核 1=正常 2=已下架', default: 0 })
  status: number;
}
```

### Task 2.6: 管理后台扩展模块（第6组）

**Files:**
- Create: `cool-admin-midway/src/modules/platform/entity/merchantApply.ts`
- Create: `cool-admin-midway/src/modules/platform/entity/banner.ts`
- Create: `cool-admin-midway/src/modules/platform/entity/notice.ts`
- Create: `cool-admin-midway/src/modules/platform/entity/recommend.ts`
- Create: `cool-admin-midway/src/modules/platform/entity/sensitiveWord.ts`
- Create: `cool-admin-midway/src/modules/platform/entity/stat.ts`
- Create: `cool-admin-midway/src/modules/platform/config.ts`
- Create: `cool-admin-midway/src/modules/platform/controller/admin/*.ts`
- Create: `cool-admin-midway/src/modules/platform/service/*.ts`

**注意：** 管理后台的用户/角色/菜单/日志复用 cool-admin 内置的 `base_sys_*` 表，不需要新建。

---

## 阶段 3: 管理后台前端

每个后端模块都需要对应的管理后台前端页面。使用 cool-admin 的 CRUD 组件自动生成。

### Task 3.1: 衣模块前端

**Files:**
- Create: `cool-admin-vue/src/modules/clothing/config.ts`
- Create: `cool-admin-vue/src/modules/clothing/views/crud/index.vue`
- Create: `cool-admin-vue/src/modules/clothing/views/crud/components/goods/index.vue`
- Create: `cool-admin-vue/src/modules/clothing/views/crud/components/category/index.vue`
- Create: `cool-admin-vue/src/modules/clothing/locales/zh-cn.json`

**config.ts：**

```typescript
import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
  return {
    label: '衣模块',
    views: [
      { path: '/clothing/goods', meta: { label: '商品管理' }, component: () => import('./views/crud/goods/index.vue') },
      { path: '/clothing/category', meta: { label: '分类管理' }, component: () => import('./views/crud/category/index.vue') },
      { path: '/clothing/review', meta: { label: '评价管理' }, component: () => import('./views/crud/review/index.vue') },
    ],
  };
};
```

**views/crud/goods/index.vue（标准 CRUD 模板）：**

```vue
<template>
  <cl-crud ref="Crud">
    <cl-row>
      <cl-refresh-btn />
      <cl-add-btn />
      <cl-search-key placeholder="搜索商品标题" />
    </cl-row>
    <cl-row>
      <cl-flex1 />
      <cl-table ref="Table" />
    </cl-row>
    <cl-row>
      <cl-flex1 />
      <cl-pagination />
    </cl-row>
    <cl-upsert ref="Upsert" />
  </cl-crud>
</template>

<script setup>
import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
import { useCool } from '/@/cool';

const { service } = useCool();

const Crud = useCrud(
  { service: 'clothing.goods' },
  (app) => {
    app.refresh({ size: 10, status: 1 });
  }
);

const Table = useTable({
  columns: [
    { type: 'selection' },
    { label: '商品标题', prop: 'title', minWidth: 150 },
    { label: '分类', prop: 'categoryId', dict: { dict: 'clothingCategory' } },
    { label: '价格', prop: 'price', minWidth: 100 },
    { label: '库存', prop: 'stock', minWidth: 80 },
    { label: '销量', prop: 'sales', minWidth: 80 },
    {
      label: '状态', prop: 'status', dict: { type: 'tag', data: [{ label: '下架', value: 0, color: 'info' }, { label: '上架', value: 1, color: 'success' }] }, minWidth: 80
    },
    { label: '创建时间', prop: 'createTime', minWidth: 170 },
    {
      label: '操作',
      type: 'op',
      buttons: ['edit', 'delete', { label: '上下架', action: 'toggle', ifShow: (row) => true }],
    },
  ],
});

const Upsert = useUpsert({
  items: [
    { label: '商品标题', prop: 'title', components: [{ name: 'el-input' }] },
    { label: '副标题', prop: 'subtitle', components: [{ name: 'el-input' }] },
    { label: '分类ID', prop: 'categoryId', components: [{ name: 'el-input-number' }] },
    { label: '价格', prop: 'price', components: [{ name: 'el-input-number', props: { precision: 2 } }] },
    { label: '市场价', prop: 'marketPrice', components: [{ name: 'el-input-number', props: { precision: 2 } }] },
    { label: '库存', prop: 'stock', components: [{ name: 'el-input-number' }] },
    { label: '主图URL', prop: 'mainImage', components: [{ name: 'el-input' }] },
    { label: '工艺介绍', prop: 'craftIntro', components: [{ name: 'el-input', props: { type: 'textarea', rows: 3 } }] },
    { label: '传承人', prop: 'inheritorName', components: [{ name: 'el-input' }] },
    { label: '状态', prop: 'status', components: [{ name: 'el-switch', props: { activeValue: 1, inactiveValue: 0 } }] },
  ],
});
</script>
```

- [ ] **Step 1: 创建目录**

  运行: `mkdir -p cool-admin-vue/src/modules/clothing/{views/crud/{goods,category,review},locales}`

- [ ] **Step 2: 创建 config.ts**

- [ ] **Step 3: 创建 goods/index.vue**

- [ ] **Step 4: 创建 category/index.vue**（类似结构）

- [ ] **Step 5: 创建 review/index.vue**

- [ ] **Step 6: 创建 locales/zh-cn.json**

- [ ] **Step 7: 在管理后台验证路由可见**

  访问 `http://localhost:9000`，查看左侧菜单是否出现"衣模块"相关菜单项

- [ ] **Step 8: 提交**

### Task 3.2-3.6: 其他模块前端

重复 Task 3.1 的模式，为食/住/行/社区/平台各创建对应的前端 CRUD 页面。

**文件映射：**

| 模块 | 前端目录 | 页面 |
|------|---------|------|
| 食 | `cool-admin-vue/src/modules/food/` | restaurant, agriculture, booking |
| 住 | `cool-admin-vue/src/modules/lodging/` | hostel, roomType, calendar |
| 行 | `cool-admin-vue/src/modules/travel/` | scenic, ticket, route, guide |
| 社区 | `cool-admin-vue/src/modules/community/` | article, comment, topic |
| 平台 | `cool-admin-vue/src/modules/platform/` | merchantApply, banner, notice, sensitiveWord |

---

## 阶段 4: 小程序端 + PC 端（后续）

> 以下为后续阶段，不在本次实施范围内：

### 小程序端（uni-app）

- 新建 `wudog-miniprogram/` 项目
- 配置 manifest.json（微信小程序 AppID）
- 配置 API 请求 baseURL 指向 `http://localhost:8001/api/open/`
- 按架构设计的页面结构逐页开发

### PC 端（Nuxt3）

- 新建 `wudog-pc/` 项目
- 配置 nuxt.config.ts
- 配置 server proxy 转发 `/api/` 到 `http://localhost:8001`
- 按架构设计的页面结构逐页开发

---

## 开发注意事项

1. **实体命名**：Entity 类名 `XxxEntity`，表名 `snake_case`，通过 `@Entity('table_name')` 指定
2. **继承 BaseEntity**：所有实体必须 extends `BaseEntity`，获得 id/createTime/updateTime/tenantId
3. **decimal 精度**：金额字段统一 `precision: 10, scale: 2`
4. **软删除**：cool-admin 默认开启 softDelete，delete API 不会物理删除
5. **菜单自动生成**：后端 controller 部署后，cool-admin 会自动生成管理后台菜单（需 `initMenu: true`）
6. **字典配置**：使用 `dict` 属性让前端自动渲染下拉选择
7. **模块 order**：数字越小越先加载，建议 common 模块 order 设为 1-5，业务模块 10+
8. **跨模块引用**：业务模块的 Controller 如果需要引用 common 模块的 Entity，使用相对路径 `../../../common/order/entity/base'`

---

*本计划基于 cool-admin 脚手架模式和架构设计文档制定。*
