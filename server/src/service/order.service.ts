import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { OrderItem } from '../entity/order-item.entity';
import { Payment } from '../entity/payment.entity';
import { Notification } from '../entity/notification.entity';
import { v4 as uuidv4 } from 'uuid';

export class OrderService {
  private orderRepo: Repository<Order>;
  private orderItemRepo: Repository<OrderItem>;
  private paymentRepo: Repository<Payment>;
  private notifRepo: Repository<Notification>;

  constructor(
    orderRepo: Repository<Order>,
    orderItemRepo: Repository<OrderItem>,
    paymentRepo: Repository<Payment>,
    notifRepo: Repository<Notification>,
  ) {
    this.orderRepo = orderRepo;
    this.orderItemRepo = orderItemRepo;
    this.paymentRepo = paymentRepo;
    this.notifRepo = notifRepo;
  }

  async createOrder(userId: number, body: any) {
    const { type, items, address_id, remark } = body;
    if (!type || !items || !items.length) throw new Error('订单类型和商品不能为空');

    const orderNo = `WD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    const order = this.orderRepo.create({
      order_no: orderNo,
      user_id: userId,
      type,
      status: 'pending',
      total_amount: totalAmount,
      pay_amount: totalAmount,
      remark: remark || null,
      address_snapshot: address_id ? { address_id } : null,
    });
    const saved = await this.orderRepo.save(order);

    for (const item of items) {
      const oi = this.orderItemRepo.create({
        order_id: saved.id,
        item_type: item.item_type || 'product',
        item_id: item.item_id,
        item_name: item.item_name,
        item_image: item.item_image || null,
        price: item.price,
        quantity: item.quantity,
        snapshot_json: item,
      });
      await this.orderItemRepo.save(oi);
    }

    return { id: saved.id, order_no: saved.order_no, total_amount: totalAmount };
  }

  async getUserOrders(userId: number, query: any) {
    const { type, status, page = 1, pageSize = 20 } = query;
    const where: any = { user_id: userId, is_deleted: 0 };
    if (type) where.type = type;
    if (status) where.status = status;

    const [list, total] = await this.orderRepo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const orders = [];
    for (const o of list) {
      const items = await this.orderItemRepo.find({ where: { order_id: o.id } });
      orders.push({ ...o, items });
    }

    return { list: orders, total, page: parseInt(String(page)), pageSize: parseInt(String(pageSize)) };
  }

  async getOrderDetail(id: number) {
    const order = await this.orderRepo.findOne({ where: { id, is_deleted: 0 } });
    if (!order) throw new Error('订单不存在');
    const items = await this.orderItemRepo.find({ where: { order_id: id } });
    const payment = await this.paymentRepo.findOne({ where: { order_id: id } });
    return { ...order, items, payment };
  }

  async cancelOrder(userId: number, orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, user_id: userId } });
    if (!order) throw new Error('订单不存在');
    if (order.status !== 'pending') throw new Error('只能取消待支付订单');
    order.status = 'cancelled';
    order.cancel_time = new Date();
    return this.orderRepo.save(order);
  }

  async mockPay(userId: number, orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, user_id: userId } });
    if (!order) throw new Error('订单不存在');
    if (order.status !== 'pending') throw new Error('订单状态不正确');

    order.status = 'paid';
    order.pay_time = new Date();
    await this.orderRepo.save(order);

    const payment = this.paymentRepo.create({
      order_id: orderId,
      amount: order.pay_amount,
      method: 'mock',
      transaction_id: `MOCK_${Date.now()}`,
      status: 'success',
      paid_at: new Date(),
    });
    await this.paymentRepo.save(payment);

    // 发送通知
    const notif = this.notifRepo.create({
      user_id: userId,
      type: 'order',
      title: '支付成功',
      content: `订单 ${order.order_no} 支付成功，金额 ¥${order.pay_amount}`,
    });
    await this.notifRepo.save(notif);

    return { order, payment };
  }

  async confirmReceive(userId: number, orderId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, user_id: userId } });
    if (!order) throw new Error('订单不存在');
    if (order.status !== 'shipped') throw new Error('订单未发货');
    order.status = 'completed';
    order.finish_time = new Date();
    return this.orderRepo.save(order);
  }

  async getAllOrders(query: any) {
    const { type, status, keyword, page = 1, pageSize = 20 } = query;
    const where: any = { is_deleted: 0 };
    if (type) where.type = type;
    if (status) where.status = status;

    const qb = this.orderRepo.createQueryBuilder('o')
      .where('o.is_deleted = 0');
    if (type) qb.andWhere('o.type = :type', { type });
    if (status) qb.andWhere('o.status = :status', { status });
    if (keyword) qb.andWhere('o.order_no LIKE :kw', { kw: `%${keyword}%` });

    const [list, total] = await qb
      .orderBy('o.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { list, total, page: parseInt(String(page)), pageSize: parseInt(String(pageSize)) };
  }
}
