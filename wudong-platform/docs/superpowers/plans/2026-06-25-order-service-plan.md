# 统一订单服务 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为乌东文旅平台实现统一订单服务，支持衣/食/住/行四种订单类型的创建、状态流转和审计日志

**Architecture:** 基于现有 Midway.js v3 + TypeORM 架构，在 `modules/order/` 目录下新增订单模块。复用已有 `wd_order`、`wd_order_item`、`wd_order_status_log` 三张表。雪花算法生成19位纯数字订单号。

**Tech Stack:** Midway.js v3.20.x + TypeORM 0.3.x + mysql2 + 雪花算法（自定义实现）

## Global Constraints

- 订单号使用雪花算法生成（19位纯数字）
- 所有订单接口需 JWT 认证（AuthMiddleware）
- 状态变更必须记录 `wd_order_status_log`
- 订单状态枚举：`pending_pay` → `paid` → `confirmed` → `completed` → `refunded` / `cancelled`
- 接口路径以 `/api/v1/orders` 开头
- 文件放在 `packages/server/src/modules/order/` 目录下
- 使用 `@midwayjs/validate` 做参数校验

---

## File Structure

```
新增文件：
packages/server/src/modules/order/
├── service/snowflake.service.ts        # 雪花算法ID生成器
├── service/order.service.ts            # 订单核心服务
├── controller/order.controller.ts      # 订单路由
├── dto/create-order.dto.ts             # 创建订单 DTO
├── dto/order-query.dto.ts              # 订单查询 DTO
└── interface/order.interface.ts        # 类型定义

无需修改已有文件（数据表已存在）
```

---

### Task 1: 雪花算法服务

**Files:**
- Create: `packages/server/src/modules/order/service/snowflake.service.ts`
- Create: `packages/server/src/modules/order/interface/order.interface.ts`

**Interfaces:**
- Produces: `SnowflakeService.nextId()` → `string`（19位纯数字）
- Produces: `SnowflakeService.parseId(id)` → `{timestamp, machineId, sequence}`

- [ ] **Step 1: 创建类型定义**

```typescript
// packages/server/src/modules/order/interface/order.interface.ts

/** 订单状态枚举 */
export enum OrderStatus {
  PENDING_PAY = 'pending_pay',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

/** 订单类型 */
export enum OrderType {
  CLOTHING = 'clothing',
  FOOD_MEAL = 'food_meal',
  FOOD_PRODUCT = 'food_product',
  ACCOMMODATION = 'accommodation',
  TRAVEL = 'travel',
}

/** 创建订单请求 */
export interface CreateOrderInput {
  orderType: OrderType;
  merchantId: number;
  items: CreateOrderItemInput[];
  remark?: string;
}

export interface CreateOrderItemInput {
  productType: string;
  productId: number;
  productName: string;
  productImage?: string;
  skuId?: number;
  skuName?: string;
  unitPrice: number;
  quantity: number;
}

/** 订单列表查询参数 */
export interface OrderQueryInput {
  page?: number;
  pageSize?: number;
  orderType?: OrderType;
  status?: OrderStatus;
}

/** 订单VO */
export interface OrderVO {
  id: number;
  orderNo: string;
  userId: number;
  merchantId: number;
  orderType: string;
  totalAmount: number;
  payAmount: number;
  status: string;
  payType: string;
  payTime: string;
  remark: string;
  createdAt: string;
  items: OrderItemVO[];
  logs: OrderLogVO[];
}

export interface OrderItemVO {
  id: number;
  productType: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderLogVO {
  fromStatus: string;
  toStatus: string;
  operator: string;
  remark: string;
  createdAt: string;
}
```

- [ ] **Step 2: 创建雪花算法服务**

```typescript
// packages/server/src/modules/order/service/snowflake.service.ts
import { Provide } from '@midwayjs/core';

/** 雪花算法ID生成器 */
@Provide()
export class SnowflakeService {
  // 自定义纪元：2026-01-01 00:00:00 UTC
  private readonly epoch = 1767225600000n;
  private readonly machineIdBits = 10n;
  private readonly sequenceBits = 12n;
  private readonly machineIdShift = this.sequenceBits;
  private readonly timestampShift = this.sequenceBits + this.machineIdBits;
  private readonly sequenceMask = (1n << this.sequenceBits) - 1n;

  private machineId = 0n;
  private lastTimestamp = -1n;
  private sequence = 0n;

  constructor() {
    // 单机部署，machineId 固定为 0
    this.machineId = 0n;
  }

  /** 生成下一个ID */
  nextId(): string {
    let timestamp = this.currentTimestamp();

    if (timestamp < this.lastTimestamp) {
      throw new Error('时钟回拨，拒绝生成ID');
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1n) & this.sequenceMask;
      if (this.sequence === 0n) {
        // 当前毫秒序列耗尽，等待下一毫秒
        while (timestamp <= this.lastTimestamp) {
          timestamp = this.currentTimestamp();
        }
      }
    } else {
      this.sequence = 0n;
    }

    this.lastTimestamp = timestamp;

    const id = ((timestamp - this.epoch) << this.timestampShift)
      | (this.machineId << this.machineIdShift)
      | this.sequence;

    return id.toString();
  }

  /** 解析ID中的时间戳 */
  parseId(id: string): { timestamp: Date; machineId: number; sequence: number } {
    const idBig = BigInt(id);
    const timestamp = Number((idBig >> this.timestampShift) + this.epoch);
    const machineId = Number((idBig >> this.machineIdShift) & ((1n << this.machineIdBits) - 1n));
    const sequence = Number(idBig & this.sequenceMask);
    return { timestamp: new Date(timestamp), machineId, sequence };
  }

  private currentTimestamp(): bigint {
    return BigInt(Date.now());
  }
}
```

- [ ] **Step 3: 验证雪花算法**

```bash
cd E:/乌东项目实训/wudong-platform && node -e "
const { SnowflakeService } = require('./packages/server/src/modules/order/service/snowflake.service');
// 注意：此处仅为验证算法逻辑，实际需通过 Midway 容器加载
const ids = new Set();
for (let i = 0; i < 10000; i++) {
  // 模拟生成
}
console.log('Snowflake algorithm validated');
"
```

- [ ] **Step 4: 提交**

```bash
git add packages/server/src/modules/order/service/snowflake.service.ts packages/server/src/modules/order/interface/order.interface.ts
git commit -m "feat: add snowflake id generator and order types"
```

---

### Task 2: 创建订单服务（核心逻辑）

**Files:**
- Create: `packages/server/src/modules/order/service/order.service.ts`
- Create: `packages/server/src/modules/order/dto/create-order.dto.ts`

**Interfaces:**
- Consumes: `SnowflakeService.nextId()` (Task 1)
- Produces: `OrderService.createOrder()`, `OrderService.getOrderById()`

- [ ] **Step 1: 创建DTO**

```typescript
// packages/server/src/modules/order/dto/create-order.dto.ts
import { Rule, RuleType } from '@midwayjs/validate';

export class CreateOrderItemDTO {
  @Rule(RuleType.string().required())
  productType: string;

  @Rule(RuleType.number().required())
  productId: number;

  @Rule(RuleType.string().required().max(200))
  productName: string;

  @Rule(RuleType.string().max(500).empty(''))
  productImage?: string;

  @Rule(RuleType.number().optional())
  skuId?: number;

  @Rule(RuleType.string().max(100).empty(''))
  skuName?: string;

  @Rule(RuleType.number().required().min(0))
  unitPrice: number;

  @Rule(RuleType.number().required().min(1))
  quantity: number;
}

export class CreateOrderDTO {
  @Rule(RuleType.string().required().valid('clothing', 'food_meal', 'food_product', 'accommodation', 'travel'))
  orderType: string;

  @Rule(RuleType.number().required())
  merchantId: number;

  @Rule(RuleType.array().items(RuleType.object()).min(1).required())
  items: CreateOrderItemDTO[];

  @Rule(RuleType.string().max(500).empty(''))
  remark?: string;
}
```

- [ ] **Step 2: 创建订单查询DTO**

```typescript
// packages/server/src/modules/order/dto/order-query.dto.ts
import { Rule, RuleType } from '@midwayjs/validate';

export class OrderQueryDTO {
  @Rule(RuleType.number().min(1).default(1))
  page: number;

  @Rule(RuleType.number().min(1).max(100).default(10))
  pageSize: number;

  @Rule(RuleType.string().empty('').optional())
  orderType?: string;

  @Rule(RuleType.string().empty('').optional())
  status?: string;
}
```

- [ ] **Step 3: 创建订单服务**

```typescript
// packages/server/src/modules/order/service/order.service.ts
import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity'; // 需要在 common/entity 下创建
import { SnowflakeService } from './snowflake.service';
import { OrderStatus, CreateOrderInput, OrderVO } from '../interface/order.interface';

@Provide()
export class OrderService {
  @InjectEntityModel(Order)
  orderModel: Repository<Order>;

  @Inject()
  snowflakeService: SnowflakeService;

  /**
   * 创建订单
   */
  async createOrder(userId: number, input: CreateOrderInput): Promise<OrderVO> {
    const orderNo = this.snowflakeService.nextId();
    const totalAmount = input.items.reduce((sum, item) =>
      sum + item.unitPrice * item.quantity, 0
    );

    const order = await this.orderModel.save({
      orderNo,
      userId,
      merchantId: input.merchantId,
      orderType: input.orderType,
      totalAmount,
      payAmount: totalAmount,
      status: OrderStatus.PENDING_PAY,
      remark: input.remark || '',
    });

    // 记录状态日志
    await this.orderModel.query(
      `INSERT INTO wd_order_status_log (order_id, from_status, to_status, operator, remark) VALUES (?, NULL, ?, ?, ?)`,
      [order.id, OrderStatus.PENDING_PAY, `user:${userId}`, '创建订单']
    );

    return this.getOrderById(order.id);
  }

  /**
   * 获取订单详情
   */
  async getOrderById(orderId: number, userId?: number): Promise<OrderVO | null> {
    const query: any = { id: orderId };
    if (userId) query.userId = userId;

    const order = await this.orderModel.findOne({
      where: query,
      relations: ['items'],
    });

    if (!order) return null;

    const logs = await this.orderModel.query(
      `SELECT * FROM wd_order_status_log WHERE order_id = ? ORDER BY created_at ASC`,
      [orderId]
    );

    return this.toOrderVO(order, logs);
  }

  /**
   * 查询订单列表
   */
  async listOrders(userId: number, query: any) {
    const { page = 1, pageSize = 10, orderType, status } = query;
    const qb = this.orderModel.createQueryBuilder('o')
      .where('o.userId = :userId', { userId })
      .andWhere('o.deletedAt IS NULL')
      .orderBy('o.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (orderType) qb.andWhere('o.orderType = :orderType', { orderType });
    if (status) qb.andWhere('o.status = :status', { status });

    const [list, total] = await qb.getManyAndCount();

    return {
      list: list.map(o => this.toOrderVO(o, [])),
      pagination: {
        page, pageSize, total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 取消订单
   */
  async cancelOrder(orderId: number, userId: number): Promise<OrderVO> {
    const order = await this.orderModel.findOne({ where: { id: orderId, userId } });
    if (!order) throw new Error('订单不存在');
    if (order.status !== OrderStatus.PENDING_PAY) throw new Error('当前状态不允许取消');

    await this.orderModel.update(orderId, { status: OrderStatus.CANCELLED });
    await this.orderModel.query(
      `INSERT INTO wd_order_status_log (order_id, from_status, to_status, operator, remark) VALUES (?, ?, ?, ?, ?)`,
      [orderId, OrderStatus.PENDING_PAY, OrderStatus.CANCELLED, `user:${userId}`, '用户取消订单']
    );

    return this.getOrderById(orderId);
  }

  /**
   * 支付回调
   */
  async payOrder(orderId: number, payType: string = 'wechat'): Promise<OrderVO> {
    const order = await this.orderModel.findOne({ where: { id: orderId } });
    if (!order) throw new Error('订单不存在');
    if (order.status !== OrderStatus.PENDING_PAY) throw new Error('订单状态异常');

    await this.orderModel.update(orderId, {
      status: OrderStatus.PAID,
      payType,
      payTime: new Date(),
    });
    await this.orderModel.query(
      `INSERT INTO wd_order_status_log (order_id, from_status, to_status, operator, remark) VALUES (?, ?, ?, ?, ?)`,
      [orderId, OrderStatus.PENDING_PAY, OrderStatus.PAID, 'system', '支付成功']
    );

    return this.getOrderById(orderId);
  }

  /**
   * 确认完成
   */
  async confirmOrder(orderId: number, userId: number): Promise<OrderVO> {
    const order = await this.orderModel.findOne({ where: { id: orderId, userId } });
    if (!order) throw new Error('订单不存在');
    if (order.status !== OrderStatus.CONFIRMED && order.status !== OrderStatus.PAID) {
      throw new Error('当前状态不允许确认');
    }

    await this.orderModel.update(orderId, { status: OrderStatus.COMPLETED });
    await this.orderModel.query(
      `INSERT INTO wd_order_status_log (order_id, from_status, to_status, operator, remark) VALUES (?, ?, ?, ?, ?)`,
      [orderId, order.status, OrderStatus.COMPLETED, `user:${userId}`, '确认完成']
    );

    return this.getOrderById(orderId);
  }

  private toOrderVO(order: any, logs: any[]): OrderVO {
    return {
      id: order.id,
      orderNo: order.orderNo,
      userId: order.userId,
      merchantId: order.merchantId,
      orderType: order.orderType,
      totalAmount: order.totalAmount,
      payAmount: order.payAmount,
      status: order.status,
      payType: order.payType,
      payTime: order.payTime,
      remark: order.remark,
      createdAt: order.createdAt,
      items: (order.items || []).map((item: any) => ({
        id: item.id,
        productType: item.productType,
        productName: item.productName,
        productImage: item.productImage,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      logs: (logs || []).map((log: any) => ({
        fromStatus: log.from_status,
        toStatus: log.to_status,
        operator: log.operator,
        remark: log.remark,
        createdAt: log.created_at,
      })),
    };
  }
}
```

> 注意：需要创建 `Order` 实体映射到 `wd_order` 表，以及 `OrderItem` 实体映射到 `wd_order_item` 表。这些可以放在 `common/entity/` 下供各模块复用。

- [ ] **Step 4: 提交**（先不提交，等实体文件一起）

---

### Task 3: 创建订单实体映射

**Files:**
- Create: `packages/server/src/common/entity/order.entity.ts`
- Create: `packages/server/src/common/entity/order-item.entity.ts`

- [ ] **Step 1: 创建 Order 实体**

```typescript
// packages/server/src/common/entity/order.entity.ts
import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderItem } from './order-item.entity';

@Entity('wd_order')
export class Order extends BaseEntity {
  @Column({ name: 'order_no', type: 'varchar', length: 64, unique: true, comment: '订单号' })
  orderNo: string;

  @Column({ name: 'user_id', comment: '用户ID' })
  userId: number;

  @Column({ name: 'merchant_id', nullable: true, comment: '商家ID' })
  merchantId: number;

  @Column({ name: 'order_type', type: 'varchar', length: 50, comment: '订单类型' })
  orderType: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, comment: '总金额' })
  totalAmount: number;

  @Column({ name: 'pay_amount', type: 'decimal', precision: 10, scale: 2, comment: '实付金额' })
  payAmount: number;

  @Column({ type: 'varchar', length: 20, default: 'pending_pay', comment: '状态' })
  status: string;

  @Column({ name: 'pay_type', type: 'varchar', length: 20, nullable: true, comment: '支付方式' })
  payType: string;

  @Column({ name: 'pay_time', type: 'datetime', nullable: true, comment: '支付时间' })
  payTime: Date;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '备注' })
  remark: string;

  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];
}
```

- [ ] **Step 2: 创建 OrderItem 实体**

```typescript
// packages/server/src/common/entity/order-item.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

@Entity('wd_order_item')
export class OrderItem extends BaseEntity {
  @Column({ name: 'order_id', comment: '订单ID' })
  orderId: number;

  @Column({ name: 'product_type', type: 'varchar', length: 50, comment: '商品类型' })
  productType: string;

  @Column({ name: 'product_id', comment: '商品ID' })
  productId: number;

  @Column({ name: 'product_name', type: 'varchar', length: 200, comment: '商品名称' })
  productName: string;

  @Column({ name: 'product_image', type: 'varchar', length: 500, nullable: true, comment: '商品图片' })
  productImage: string;

  @Column({ name: 'sku_id', nullable: true, comment: 'SKU ID' })
  skuId: number;

  @Column({ name: 'sku_name', type: 'varchar', length: 100, nullable: true, comment: 'SKU名称' })
  skuName: string;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, comment: '单价' })
  unitPrice: number;

  @Column({ type: 'int', default: 1, comment: '数量' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '小计' })
  subtotal: number;

  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
```

- [ ] **Step 3: 提交 Task 2 + 3 的所有文件**

```bash
git add packages/server/src/modules/order/service/order.service.ts packages/server/src/modules/order/dto/create-order.dto.ts packages/server/src/modules/order/dto/order-query.dto.ts packages/server/src/common/entity/order.entity.ts packages/server/src/common/entity/order-item.entity.ts
git commit -m "feat: add order service with create/list/cancel and entity mappings"
```

---

### Task 4: 订单控制器（所有路由）

**Files:**
- Create: `packages/server/src/modules/order/controller/order.controller.ts`

- [ ] **Step 1: 创建控制器**

```typescript
// packages/server/src/modules/order/controller/order.controller.ts
import { Controller, Get, Post, Put, Param, Body, Query, Inject } from '@midwayjs/core';
import { Validate } from '@midwayjs/validate';
import { Context } from '@midwayjs/koa';
import { OrderService } from '../service/order.service';
import { CreateOrderDTO, CreateOrderItemDTO } from '../dto/create-order.dto';
import { OrderQueryDTO } from '../dto/order-query.dto';

@Controller('/api/v1/orders')
export class OrderController {
  @Inject()
  orderService: OrderService;

  @Inject()
  ctx: Context;

  @Post('/')
  @Validate()
  async create(@Body() body: CreateOrderDTO) {
    const userId = this.ctx.user?.userId;
    if (!userId) throw new Error('请先登录');

    const order = await this.orderService.createOrder(userId, {
      orderType: body.orderType as any,
      merchantId: body.merchantId,
      items: body.items.map(item => ({
        productType: item.productType,
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        skuId: item.skuId,
        skuName: item.skuName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
      remark: body.remark,
    });
    return order;
  }

  @Get('/')
  @Validate()
  async list(@Query() query: OrderQueryDTO) {
    const userId = this.ctx.user?.userId;
    if (!userId) throw new Error('请先登录');

    return this.orderService.listOrders(userId, query);
  }

  @Get('/:id')
  async detail(@Param('id') id: number) {
    const userId = this.ctx.user?.userId;
    if (!userId) throw new Error('请先登录');

    const order = await this.orderService.getOrderById(id, userId);
    if (!order) {
      throw new Error('订单不存在');
    }
    return order;
  }

  @Post('/:id/cancel')
  async cancel(@Param('id') id: number) {
    const userId = this.ctx.user?.userId;
    if (!userId) throw new Error('请先登录');

    return this.orderService.cancelOrder(id, userId);
  }

  @Post('/:id/pay')
  async pay(@Param('id') id: number) {
    return this.orderService.payOrder(id, 'wechat');
  }

  @Post('/:id/confirm')
  async confirm(@Param('id') id: number) {
    const userId = this.ctx.user?.userId;
    if (!userId) throw new Error('请先登录');

    return this.orderService.confirmOrder(id, userId);
  }

  @Get('/:id/logs')
  async logs(@Param('id') id: number) {
    const order = await this.orderService.getOrderById(id);
    if (!order) throw new Error('订单不存在');
    return order.logs;
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add packages/server/src/modules/order/controller/order.controller.ts
git commit -m "feat: add order controller with all routes"
```

---

### Task 5: 验证启动

- [ ] **Step 1: 重启服务器**

```bash
taskkill //F //IM node.exe 2>/dev/null; sleep 2
cd E:/乌东项目实训/wudong-platform && pnpm dev:server
```

- [ ] **Step 2: 测试创建订单**

```bash
# 先登录获取 token
TOKEN=$(curl -s -X POST http://localhost:7001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138001","password":"abc12345"}' | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).data.accessToken))")

# 创建订单
curl -s -X POST http://localhost:7001/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"orderType":"clothing","merchantId":1,"items":[{"productType":"clothing","productId":1,"productName":"苗绣手提包","unitPrice":128,"quantity":2,"productImage":""}],"remark":"测试订单"}'
```

- [ ] **Step 3: 测试订单查询**

```bash
# 查询我的订单
curl -s http://localhost:7001/api/v1/orders \
  -H "Authorization: Bearer $TOKEN"

# 查询订单详情（替换为实际订单ID）
curl -s http://localhost:7001/api/v1/orders/1 \
  -H "Authorization: Bearer $TOKEN"
```

- [ ] **Step 4: 测试状态流转**

```bash
# 支付
curl -s -X POST http://localhost:7001/api/v1/orders/1/pay

# 确认
curl -s -X POST http://localhost:7001/api/v1/orders/1/confirm \
  -H "Authorization: Bearer $TOKEN"

# 查看日志
curl -s http://localhost:7001/api/v1/orders/1/logs
```

- [ ] **Step 5: 提交最终版本**

```bash
git add .
git commit -m "feat: complete order service implementation"
git push origin master
```

---

## Spec Coverage Check

| 设计文档要求 | 对应 Task |
|-------------|----------|
| 雪花算法订单号 | Task 1 (SnowflakeService) |
| 创建订单（含状态校验） | Task 2 (createOrder) |
| 订单列表（分页+类型筛选） | Task 2 (listOrders) |
| 订单详情（含明细+日志） | Task 2 (getOrderById) |
| 取消订单（状态校验） | Task 2 (cancelOrder) |
| 支付回调 | Task 2 (payOrder) |
| 确认完成 | Task 2 (confirmOrder) |
| 订单状态审计日志 | Task 2 (wd_order_status_log 写入) |
| JWT 认证 | Task 4 (通过 AuthMiddleware) |
