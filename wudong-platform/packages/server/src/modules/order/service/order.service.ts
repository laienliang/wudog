import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Order } from '../../../common/entity/order.entity';
import { OrderItem } from '../../../common/entity/order-item.entity';
import { SnowflakeService } from './snowflake.service';
import {
  OrderStatus,
  CreateOrderInput,
  OrderVO,
  OrderQueryInput,
} from '../interface/order.interface';

@Provide()
export class OrderService {
  @InjectEntityModel(Order)
  orderModel: Repository<Order>;

  @InjectEntityModel(OrderItem)
  orderItemModel: Repository<OrderItem>;

  @Inject()
  snowflakeService: SnowflakeService;

  /**
   * 创建订单
   *
   * 1. 生成雪花订单号
   * 2. 计算总金额（服务端计算，不信任客户端）
   * 3. 保存 Order 主记录
   * 4. 遍历 items 创建 OrderItem 明细并计算 subtotal
   * 5. 记录状态日志
   */
  async createOrder(userId: number, input: CreateOrderInput): Promise<OrderVO | null> {
    const orderNo = this.snowflakeService.nextId();
    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    // 1) 保存订单主记录
    const order = this.orderModel.create({
      orderNo,
      userId,
      merchantId: input.merchantId,
      orderType: input.orderType,
      totalAmount,
      payAmount: totalAmount,
      status: OrderStatus.PENDING_PAY,
      remark: input.remark || '',
    });
    const savedOrder = await this.orderModel.save(order);

    // 2) 遍历 items 创建 OrderItem 明细并计算 subtotal
    const orderItems = input.items.map(item => {
      const orderItem = new OrderItem();
      orderItem.order = savedOrder; // 通过 ManyToOne 关系设置外键
      orderItem.productType = item.productType;
      orderItem.productId = item.productId;
      orderItem.productName = item.productName;
      orderItem.productImage = item.productImage || '';
      orderItem.skuId = item.skuId || 0;
      orderItem.skuName = item.skuName || '';
      orderItem.unitPrice = item.unitPrice;
      orderItem.quantity = item.quantity;
      orderItem.subtotal = item.unitPrice * item.quantity;
      return orderItem;
    });
    await this.orderItemModel.save(orderItems);

    // 3) 记录状态日志
    await this.orderModel.query(
      `INSERT INTO wd_order_status_log (order_id, from_status, to_status, operator, remark)
       VALUES (?, NULL, ?, ?, ?)`,
      [savedOrder.id, OrderStatus.PENDING_PAY, `user:${userId}`, '创建订单']
    );

    return this.getOrderById(savedOrder.id);
  }

  /**
   * 查询订单详情（含明细 + 状态日志）
   */
  async getOrderById(orderId: number, userId?: number): Promise<OrderVO | null> {
    const where: any = { id: orderId };
    if (userId) {
      where.userId = userId;
    }

    const order = await this.orderModel.findOne({
      where,
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
   * 查询订单列表（分页）
   */
  async listOrders(
    userId: number,
    query: OrderQueryInput
  ): Promise<{
    list: OrderVO[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { page = 1, pageSize = 10, orderType, status } = query;

    const qb = this.orderModel
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.items', 'item')
      .where('o.userId = :userId', { userId })
      .andWhere('o.deletedAt IS NULL')
      .orderBy('o.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (orderType) {
      qb.andWhere('o.orderType = :orderType', { orderType });
    }
    if (status) {
      qb.andWhere('o.status = :status', { status });
    }

    const [list, total] = await qb.getManyAndCount();

    return {
      list: list.map(o => this.toOrderVO(o, [])),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 取消订单（仅 pending_pay 状态可取消）
   */
  async cancelOrder(orderId: number, userId: number): Promise<OrderVO | null> {
    const order = await this.orderModel.findOne({
      where: { id: orderId, userId },
    });
    if (!order) throw new Error('订单不存在');
    if (order.status !== OrderStatus.PENDING_PAY) {
      throw new Error('当前状态不允许取消');
    }

    const fromStatus = order.status;
    await this.orderModel.update(orderId, { status: OrderStatus.CANCELLED });

    await this.orderModel.query(
      `INSERT INTO wd_order_status_log (order_id, from_status, to_status, operator, remark)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, fromStatus, OrderStatus.CANCELLED, `user:${userId}`, '用户取消订单']
    );

    return this.getOrderById(orderId);
  }

  /**
   * 支付回调（更新状态为 paid，记录支付时间）
   */
  async payOrder(orderId: number, payType: string = 'wechat'): Promise<OrderVO | null> {
    const order = await this.orderModel.findOne({ where: { id: orderId } });
    if (!order) throw new Error('订单不存在');
    if (order.status !== OrderStatus.PENDING_PAY) {
      throw new Error('订单状态异常');
    }

    await this.orderModel.update(orderId, {
      status: OrderStatus.PAID,
      payType,
      payTime: new Date(),
    });

    await this.orderModel.query(
      `INSERT INTO wd_order_status_log (order_id, from_status, to_status, operator, remark)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, OrderStatus.PENDING_PAY, OrderStatus.PAID, 'system', '支付成功']
    );

    return this.getOrderById(orderId);
  }

  /**
   * 确认完成（paid 或 confirmed 状态可确认）
   */
  async confirmOrder(orderId: number, userId: number): Promise<OrderVO | null> {
    const order = await this.orderModel.findOne({
      where: { id: orderId, userId },
    });
    if (!order) throw new Error('订单不存在');
    if (order.status !== OrderStatus.CONFIRMED && order.status !== OrderStatus.PAID) {
      throw new Error('当前状态不允许确认');
    }

    const fromStatus = order.status;
    await this.orderModel.update(orderId, { status: OrderStatus.COMPLETED });

    await this.orderModel.query(
      `INSERT INTO wd_order_status_log (order_id, from_status, to_status, operator, remark)
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, fromStatus, OrderStatus.COMPLETED, `user:${userId}`, '确认完成']
    );

    return this.getOrderById(orderId);
  }

  /* ---------- 私有辅助方法 ---------- */

  /**
   * 将 Order 实体 + 日志记录 转换为前端 VO
   */
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
        skuId: item.skuId,
        skuName: item.skuName,
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
