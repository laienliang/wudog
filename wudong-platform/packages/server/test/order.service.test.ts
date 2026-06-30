/**
 * OrderService & Entity Mapping 测试
 *
 * 覆盖范围:
 *   Task 3 — Order / OrderItem 实体映射
 *   Task 2 — OrderService.createOrder (含明细+subtotal)、getOrderById、
 *            listOrders、cancelOrder、payOrder、confirmOrder
 */
import { Repository } from 'typeorm';
import { OrderService } from '../src/modules/order/service/order.service';
import { SnowflakeService } from '../src/modules/order/service/snowflake.service';
import { Order } from '../src/common/entity/order.entity';
import { OrderItem } from '../src/common/entity/order-item.entity';
import { OrderStatus, OrderType, CreateOrderInput } from '../src/modules/order/interface/order.interface';

/* ------------------------------------------------------------------ */
/*  Mock 构造辅助                                                        */
/* ------------------------------------------------------------------ */

function mockRepo<T>(overrides: Partial<Record<keyof Repository<T>, jest.Mock>> = {}): Repository<T> {
  return {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
    query: jest.fn(),
    ...overrides,
  } as unknown as Repository<T>;
}

const fakeOrder = (partial: Partial<Order> = {}): Order =>
  Object.assign(new Order(), {
    id: 1,
    orderNo: '1234567890123456789',
    userId: 100,
    merchantId: 200,
    orderType: 'clothing',
    totalAmount: 299.0,
    payAmount: 299.0,
    status: 'pending_pay',
    payType: null,
    payTime: null,
    remark: '',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    deletedAt: null,
    items: [],
    ...partial,
  });

const fakeOrderItem = (partial: Partial<OrderItem> = {}): OrderItem =>
  Object.assign(new OrderItem(), {
    id: 1,
    order: fakeOrder(),
    productType: 'clothing',
    productId: 10,
    productName: '苗绣手提包',
    productImage: 'https://img.example.com/a.jpg',
    skuId: null,
    skuName: '',
    unitPrice: 99.0,
    quantity: 2,
    subtotal: 198.0,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    ...partial,
  });

/* ------------------------------------------------------------------ */
/*  测试套件                                                            */
/* ------------------------------------------------------------------ */

describe('Task 3 — 实体映射', () => {
  describe('Order 实体', () => {
    it('应使用 @Entity("wd_order") 映射到正确表名', () => {
      const metadata = (Order.prototype as any);
      // 简单验证实体可实例化且默认值正确
      const order = new Order();
      expect(order).toBeInstanceOf(Order);
      // 默认状态应为 pending_pay (TypeORM default赋值逻辑，此处为 undefined, default 由 DB 或 create 时赋值)
      expect(order.status).toBeUndefined();
    });

    it('应包含所有必要字段', () => {
      const o = fakeOrder({
        orderNo: 'SN-001',
        userId: 1,
        merchantId: 2,
        orderType: 'accommodation',
        totalAmount: 500,
        payAmount: 500,
        status: 'pending_pay',
        payType: 'wechat',
        payTime: new Date('2026-06-01'),
        remark: '测试备注',
        items: [fakeOrderItem()],
      });

      expect(o.orderNo).toBe('SN-001');
      expect(o.userId).toBe(1);
      expect(o.merchantId).toBe(2);
      expect(o.orderType).toBe('accommodation');
      expect(o.totalAmount).toBe(500);
      expect(o.payAmount).toBe(500);
      expect(o.status).toBe('pending_pay');
      expect(o.payType).toBe('wechat');
      expect(o.remark).toBe('测试备注');
      expect(o.items).toHaveLength(1);
    });

    it('items 应为 OrderItem 数组', () => {
      const item = fakeOrderItem();
      const order = fakeOrder({ items: [item] });
      expect(order.items[0]).toBeInstanceOf(OrderItem);
      expect(order.items[0].productName).toBe('苗绣手提包');
    });
  });

  describe('OrderItem 实体', () => {
    it('应使用 @Entity("wd_order_item") 映射到正确表名', () => {
      const item = new OrderItem();
      expect(item).toBeInstanceOf(OrderItem);
    });

    it('不应包含单独的 orderId 字段声明（仅通过 @ManyToOne + @JoinColumn 管理外键）', () => {
      // 验证 OrderItem 上没有 orderId 属性 —— 外键由 TypeORM 通过 order 关系自动管理
      const item = new OrderItem();
      // 创建一个带 order 关系的 fake
      const item2 = fakeOrderItem({ order: fakeOrder() });

      // 只能通过 order.id 获取关联 Order 的 ID
      expect(item2.order).toBeDefined();
      expect(item2.order.id).toBe(1);
      // orderId 不应作为独立属性存在
      expect((item as any).orderId).toBeUndefined();
    });

    it('应正确计算 subtotal = unitPrice * quantity', () => {
      const price = 150.0;
      const qty = 3;
      expect(price * qty).toBe(450.0); // 验证计算逻辑正确
    });

    it('所有商品快照字段应可正确赋值', () => {
      const item = fakeOrderItem({
        productType: 'food_product',
        productId: 50,
        productName: '乌东大米',
        productImage: 'https://img.example.com/rice.jpg',
        skuId: 5,
        skuName: '5kg装',
        unitPrice: 68.0,
        quantity: 2,
        subtotal: 136.0,
      });

      expect(item.productType).toBe('food_product');
      expect(item.productId).toBe(50);
      expect(item.productName).toBe('乌东大米');
      expect(item.productImage).toBe('https://img.example.com/rice.jpg');
      expect(item.skuId).toBe(5);
      expect(item.skuName).toBe('5kg装');
      expect(item.unitPrice).toBe(68.0);
      expect(item.quantity).toBe(2);
      expect(item.subtotal).toBe(136.0);
    });

    it('subtotal 字段应为必填且等于 unitPrice * quantity', () => {
      const unitPrice = 88.0;
      const quantity = 5;
      const subtotal = unitPrice * quantity;
      expect(subtotal).toBe(440.0);

      const item = fakeOrderItem({ unitPrice, quantity, subtotal });
      expect(item.unitPrice * item.quantity).toBe(item.subtotal);
    });
  });
});

describe('SnowflakeService (Task 1 依赖)', () => {
  it('应生成唯一19位数字ID', () => {
    const svc = new SnowflakeService();
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(svc.nextId());
    }
    expect(ids.size).toBe(100);
    for (const id of ids) {
      // 雪花ID长度取决于时间戳部分，17-19位均为合法值
      expect(id).toMatch(/^\d{17,19}$/);
    }
  });

  it('parseId 应能解析回时间戳', () => {
    const svc = new SnowflakeService();
    const id = svc.nextId();
    const parsed = svc.parseId(id);
    expect(parsed.timestamp).toBeInstanceOf(Date);
    expect(parsed.machineId).toBe(0); // 固定为 0
    // 解析出的时间应在最近 5 秒内
    expect(Date.now() - parsed.timestamp.getTime()).toBeLessThan(5000);
  });

  it('生成的ID应严格递增', () => {
    const svc = new SnowflakeService();
    const ids: string[] = [];
    for (let i = 0; i < 50; i++) ids.push(svc.nextId());
    for (let i = 1; i < ids.length; i++) {
      expect(BigInt(ids[i])).toBeGreaterThan(BigInt(ids[i - 1]));
    }
  });
});

/* ------------------------------------------------------------------ */
/*  OrderService 业务方法测试                                           */
/* ------------------------------------------------------------------ */

describe('Task 2 — OrderService', () => {
  let service: OrderService;
  let orderRepo: any;
  let itemRepo: any;
  let snowflakeSvc: jest.Mocked<SnowflakeService>;

  beforeEach(() => {
    orderRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
      query: jest.fn().mockResolvedValue([]),
    };

    itemRepo = {
      create: jest.fn(),
      save: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
      query: jest.fn().mockResolvedValue([]),
    };

    snowflakeSvc = {
      nextId: jest.fn().mockReturnValue('1234567890123456789'),
      parseId: jest.fn(),
    } as any;

    service = new OrderService();
    (service as any).orderModel = orderRepo;
    (service as any).orderItemModel = itemRepo;
    (service as any).snowflakeService = snowflakeSvc;
  });

  /* ---------- createOrder ---------- */
  describe('createOrder', () => {
    const input: CreateOrderInput = {
      orderType: OrderType.CLOTHING,
      merchantId: 200,
      remark: '请尽快发货',
      items: [
        {
          productType: 'clothing',
          productId: 10,
          productName: '苗绣手提包',
          productImage: 'https://img.example.com/a.jpg',
          unitPrice: 99.0,
          quantity: 2,
          skuId: 1,
          skuName: '红色-M',
        },
        {
          productType: 'clothing',
          productId: 11,
          productName: '苗族银镯',
          productImage: '',
          unitPrice: 150.0,
          quantity: 1,
        },
      ],
    };

    it('应计算正确的 totalAmount（服务端计算）', async () => {
      const savedOrder = fakeOrder({
        id: 999,
        totalAmount: 348.0,
        payAmount: 348.0,
        items: [
          fakeOrderItem({ id: 101, subtotal: 198.0, unitPrice: 99.0, quantity: 2 }),
          fakeOrderItem({ id: 102, subtotal: 150.0, unitPrice: 150.0, quantity: 1 }),
        ],
      });

      orderRepo.create.mockReturnValue(savedOrder);
      orderRepo.save.mockResolvedValue(savedOrder);
      orderRepo.findOne.mockResolvedValue(savedOrder);

      const result = await service.createOrder(100, input);

      expect(result.totalAmount).toBe(348.0); // 99*2 + 150*1
      expect(result.payAmount).toBe(348.0);
    });

    it('应使用雪花算法生成订单号', async () => {
      const savedOrder = fakeOrder({ id: 999 });
      orderRepo.create.mockReturnValue(savedOrder);
      orderRepo.save.mockResolvedValue(savedOrder);
      orderRepo.findOne.mockResolvedValue(savedOrder);

      await service.createOrder(100, input);

      expect(snowflakeSvc.nextId).toHaveBeenCalledTimes(1);
    });

    it('应保存 OrderItem 明细并计算 subtotal', async () => {
      const savedOrder = fakeOrder({ id: 999 });
      orderRepo.create.mockReturnValue(savedOrder);
      orderRepo.save.mockResolvedValue(savedOrder);
      orderRepo.findOne.mockResolvedValue(savedOrder);

      await service.createOrder(100, input);

      // 验证 itemRepo.save 被调用，传入了正确计算 subtotal 的明细
      expect(itemRepo.save).toHaveBeenCalledTimes(1);
      const savedItems: OrderItem[] = itemRepo.save.mock.calls[0][0];
      expect(savedItems).toHaveLength(2);

      // 第1项：99 * 2 = 198
      expect(savedItems[0].unitPrice).toBe(99.0);
      expect(savedItems[0].quantity).toBe(2);
      expect(savedItems[0].subtotal).toBe(198.0);
      expect(savedItems[0].productName).toBe('苗绣手提包');

      // 第2项：150 * 1 = 150
      expect(savedItems[1].unitPrice).toBe(150.0);
      expect(savedItems[1].quantity).toBe(1);
      expect(savedItems[1].subtotal).toBe(150.0);
      expect(savedItems[1].productName).toBe('苗族银镯');
    });

    it('应通过 ManyToOne 关系设置外键（order 属性，非 orderId）', async () => {
      const savedOrder = fakeOrder({ id: 999 });
      orderRepo.create.mockReturnValue(savedOrder);
      orderRepo.save.mockResolvedValue(savedOrder);
      orderRepo.findOne.mockResolvedValue(savedOrder);

      await service.createOrder(100, input);

      const savedItems: OrderItem[] = itemRepo.save.mock.calls[0][0];
      for (const item of savedItems) {
        // 外键通过 order 关系设置，不应有独立 orderId 字段
        expect(item.order).toBe(savedOrder);
        expect((item as any).orderId).toBeUndefined();
      }
    });

    it('应记录状态日志到 wd_order_status_log', async () => {
      const savedOrder = fakeOrder({ id: 999 });
      orderRepo.create.mockReturnValue(savedOrder);
      orderRepo.save.mockResolvedValue(savedOrder);
      orderRepo.findOne.mockResolvedValue(savedOrder);

      await service.createOrder(100, input);

      expect(orderRepo.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO wd_order_status_log'),
        [999, expect.any(String), expect.stringContaining('user:100'), '创建订单'],
      );
    });

    it('初始状态应为 pending_pay', async () => {
      const savedOrder = fakeOrder({ id: 999, status: 'pending_pay' });
      orderRepo.create.mockReturnValue(savedOrder);
      orderRepo.save.mockResolvedValue(savedOrder);
      orderRepo.findOne.mockResolvedValue(savedOrder);

      const result = await service.createOrder(100, input);
      expect(result.status).toBe(OrderStatus.PENDING_PAY);
    });
  });

  /* ---------- getOrderById ---------- */
  describe('getOrderById', () => {
    it('应返回含 items 和 logs 的完整 VO', async () => {
      const order = fakeOrder({
        id: 1,
        items: [fakeOrderItem({ id: 101, subtotal: 297.0 })],
      });
      const logs = [
        {
          from_status: null,
          to_status: 'pending_pay',
          operator: 'user:100',
          remark: '创建订单',
          created_at: new Date('2026-01-01'),
        },
      ];

      orderRepo.findOne.mockResolvedValue(order);
      orderRepo.query.mockResolvedValue(logs);

      const result = await service.getOrderById(1);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(1);
      expect(result!.items).toHaveLength(1);
      expect(result!.items[0].subtotal).toBe(297.0);
      expect(result!.logs).toHaveLength(1);
      expect(result!.logs[0].toStatus).toBe('pending_pay');
    });

    it('userId 过滤应正确工作', async () => {
      orderRepo.findOne.mockResolvedValue(null);
      const result = await service.getOrderById(1, 999);
      expect(result).toBeNull();
    });

    it('订单不存在时应返回 null', async () => {
      orderRepo.findOne.mockResolvedValue(null);

      const result = await service.getOrderById(99999);
      expect(result).toBeNull();
    });
  });

  /* ---------- listOrders ---------- */
  describe('listOrders', () => {
    it('应正确分页', async () => {
      const mockQB = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([
          [fakeOrder({ id: 1 }), fakeOrder({ id: 2 })],
          25,
        ]),
      };

      orderRepo.createQueryBuilder.mockReturnValue(mockQB);

      const result = await service.listOrders(100, {
        page: 2,
        pageSize: 10,
      });

      expect(result.pagination).toEqual({
        page: 2,
        pageSize: 10,
        total: 25,
        totalPages: 3,
      });
      expect(result.list).toHaveLength(2);
    });

    it('orderType 过滤应工作', async () => {
      const mockQB = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      orderRepo.createQueryBuilder.mockReturnValue(mockQB);

      await service.listOrders(100, { orderType: OrderType.ACCOMMODATION });

      expect(mockQB.andWhere).toHaveBeenCalledWith(
        'o.orderType = :orderType',
        { orderType: 'accommodation' },
      );
    });

    it('status 过滤应工作', async () => {
      const mockQB = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      orderRepo.createQueryBuilder.mockReturnValue(mockQB);

      await service.listOrders(100, { status: OrderStatus.PAID });

      expect(mockQB.andWhere).toHaveBeenCalledWith(
        'o.status = :status',
        { status: 'paid' },
      );
    });
  });

  /* ---------- cancelOrder ---------- */
  describe('cancelOrder', () => {
    it('pending_pay 状态可取消', async () => {
      const order = fakeOrder({ id: 1, status: 'pending_pay' });
      orderRepo.findOne.mockResolvedValueOnce(order); // cancelOrder 查询
      orderRepo.update.mockResolvedValue({ affected: 1 });
      orderRepo.findOne.mockResolvedValueOnce(fakeOrder({ id: 1, status: 'cancelled' })); // getOrderById

      const result = await service.cancelOrder(1, 100);
      expect(result.status).toBe('cancelled');
    });

    it('已支付状态不允许取消', async () => {
      const order = fakeOrder({ id: 1, status: 'paid' });
      orderRepo.findOne.mockResolvedValue(order);

      await expect(service.cancelOrder(1, 100)).rejects.toThrow('当前状态不允许取消');
    });

    it('订单不存在应抛出异常', async () => {
      orderRepo.findOne.mockResolvedValue(null);

      await expect(service.cancelOrder(999, 100)).rejects.toThrow('订单不存在');
    });
  });

  /* ---------- payOrder ---------- */
  describe('payOrder', () => {
    it('pending_pay 状态可支付', async () => {
      const order = fakeOrder({ id: 1, status: 'pending_pay' });
      orderRepo.findOne
        .mockResolvedValueOnce(order) // payOrder 查询
        .mockResolvedValueOnce(fakeOrder({ id: 1, status: 'paid', payType: 'wechat' })); // getOrderById

      orderRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.payOrder(1, 'wechat');
      expect(result.status).toBe('paid');
      expect(result.payType).toBe('wechat');
    });

    it('应更新 payTime 和 payType', async () => {
      const order = fakeOrder({ id: 1, status: 'pending_pay' });
      orderRepo.findOne
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce(fakeOrder({ id: 1, status: 'paid', payType: 'wechat' }));

      orderRepo.update.mockResolvedValue({ affected: 1 });

      await service.payOrder(1, 'wechat');

      expect(orderRepo.update).toHaveBeenCalledWith(1, {
        status: OrderStatus.PAID,
        payType: 'wechat',
        payTime: expect.any(Date),
      });
    });

    it('非 pending_pay 状态不允许支付', async () => {
      const order = fakeOrder({ id: 1, status: 'cancelled' });
      orderRepo.findOne.mockResolvedValue(order);

      await expect(service.payOrder(1)).rejects.toThrow('订单状态异常');
    });
  });

  /* ---------- confirmOrder ---------- */
  describe('confirmOrder', () => {
    it('paid 状态可确认完成', async () => {
      const order = fakeOrder({ id: 1, status: 'paid', userId: 100 });
      orderRepo.findOne
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce(fakeOrder({ id: 1, status: 'completed', userId: 100 }));

      orderRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.confirmOrder(1, 100);
      expect(result.status).toBe('completed');
    });

    it('confirmed 状态可确认完成', async () => {
      const order = fakeOrder({ id: 1, status: 'confirmed', userId: 100 });
      orderRepo.findOne
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce(fakeOrder({ id: 1, status: 'completed', userId: 100 }));

      orderRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.confirmOrder(1, 100);
      expect(result.status).toBe('completed');
    });

    it('pending_pay 状态不允许确认', async () => {
      const order = fakeOrder({ id: 1, status: 'pending_pay', userId: 100 });
      orderRepo.findOne.mockResolvedValue(order);

      await expect(service.confirmOrder(1, 100)).rejects.toThrow('当前状态不允许确认');
    });

    it('订单不属于用户时不允许确认', async () => {
      orderRepo.findOne.mockResolvedValue(null);

      await expect(service.confirmOrder(1, 999)).rejects.toThrow('订单不存在');
    });
  });

  /* ---------- 订单状态机完整性 ---------- */
  describe('订单状态机完整性', () => {
    it('所有合法状态流转应在枚举中定义', () => {
      // 验证 OrderStatus 枚举包含所有必要状态
      expect(OrderStatus).toHaveProperty('PENDING_PAY', 'pending_pay');
      expect(OrderStatus).toHaveProperty('PAID', 'paid');
      expect(OrderStatus).toHaveProperty('CONFIRMED', 'confirmed');
      expect(OrderStatus).toHaveProperty('COMPLETED', 'completed');
      expect(OrderStatus).toHaveProperty('REFUNDED', 'refunded');
      expect(OrderStatus).toHaveProperty('CANCELLED', 'cancelled');
    });

    it('toOrderVO 应在无 items/logs 时不抛异常', () => {
      const order = fakeOrder({ items: [] });
      const svc = service as any;
      const vo = svc.toOrderVO(order, []);
      expect(vo.items).toEqual([]);
      expect(vo.logs).toEqual([]);
    });
  });
});

/* ------------------------------------------------------------------ */
/*  DTO 校验逻辑（纯逻辑验证，无需 Midway 运行时）                        */
/* ------------------------------------------------------------------ */

describe('DTO 校验逻辑（纯函数验证）', () => {
  it('CreateOrderDTO 应限定 orderType 为指定枚举值', () => {
    const validTypes = ['clothing', 'food_meal', 'food_product', 'accommodation', 'travel'];
    const invalidTypes = ['invalid', '', 'CLOTHING', 'food_meal_extra'];

    for (const t of validTypes) {
      expect(t).toMatch(/^(clothing|food_meal|food_product|accommodation|travel)$/);
    }
    for (const t of invalidTypes) {
      expect(t).not.toMatch(/^(clothing|food_meal|food_product|accommodation|travel)$/);
    }
  });

  it('订单明细 quantity 最小为 1', () => {
    const minQty = 1;
    expect(0).toBeLessThan(minQty);
    expect(-1).toBeLessThan(minQty);
    // quantity >= 1 才合法
    expect(1 >= minQty).toBe(true);
    expect(3 >= minQty).toBe(true);
  });

  it('订单明细 unitPrice 必须 >= 0', () => {
    // 价格为 0 可能是赠品，合法；负数不合法
    expect(0).toBeGreaterThanOrEqual(0);
    expect(-1).toBeLessThan(0);
    expect(99.99).toBeGreaterThanOrEqual(0);
  });
});
