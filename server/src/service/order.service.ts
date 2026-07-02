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
      orders.push({
        id: o.id, orderNo: o.order_no, userId: o.user_id, type: o.type,
        status: o.status, totalAmount: o.total_amount, payAmount: o.pay_amount,
        addressSnapshot: o.address_snapshot, remark: o.remark,
        payTime: o.pay_time, cancelTime: o.cancel_time, finishTime: o.finish_time,
        createdAt: o.created_at, updatedAt: o.updated_at,
        items: items.map(i => ({
          id: i.id, orderId: i.order_id, itemType: i.item_type,
          itemId: i.item_id, itemName: i.item_name, itemImage: i.item_image,
          price: i.price, quantity: i.quantity, snapshotJson: i.snapshot_json,
        })),
      });
    }

    return { list: orders, total, page: parseInt(String(page)), pageSize: parseInt(String(pageSize)) };
  }

  async getOrderDetail(id: number, userId?: number) {
    const where: any = { id, is_deleted: 0 };
    if (userId) where.user_id = userId;
    const order = await this.orderRepo.findOne({ where });
    if (!order) throw new Error('订单不存在');
    const items = await this.orderItemRepo.find({ where: { order_id: id } });
    const payment = await this.paymentRepo.findOne({ where: { order_id: id } });
    return {
      id: order.id, orderNo: order.order_no, userId: order.user_id, type: order.type,
      status: order.status, totalAmount: order.total_amount, payAmount: order.pay_amount,
      addressSnapshot: order.address_snapshot, remark: order.remark,
      payTime: order.pay_time, cancelTime: order.cancel_time, finishTime: order.finish_time,
      createdAt: order.created_at, updatedAt: order.updated_at,
      items: items.map(i => ({
        id: i.id, orderId: i.order_id, itemType: i.item_type,
        itemId: i.item_id, itemName: i.item_name, itemImage: i.item_image,
        price: i.price, quantity: i.quantity, snapshotJson: i.snapshot_json,
      })),
      payment,
    };
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

    const orders = list.map(o => ({
      id: o.id, orderNo: o.order_no, userId: o.user_id, type: o.type,
      status: o.status, totalAmount: o.total_amount, payAmount: o.pay_amount,
      addressSnapshot: o.address_snapshot, remark: o.remark,
      payTime: o.pay_time, cancelTime: o.cancel_time, finishTime: o.finish_time,
      createdAt: o.created_at, updatedAt: o.updated_at,
    }));

    return { list: orders, total, page: parseInt(String(page)), pageSize: parseInt(String(pageSize)) };
  }
}
