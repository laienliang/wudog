import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/Order';
import { ProductSku } from '../entity/ProductSku';
import { Product } from '../entity/Product';

@Provide()
export class OrderService {
  @InjectEntityModel(Order)
  orderRepo: Repository<Order>;

  @InjectEntityModel(ProductSku)
  skuRepo: Repository<ProductSku>;

  @InjectEntityModel(Product)
  productRepo: Repository<Product>;

  async create(data: {
    product_id: number;
    sku_id?: number;
    product_name: string;
    spec_name?: string;
    price: number;
    quantity: number;
    receiver_name: string;
    receiver_phone: string;
    receiver_address: string;
    payment_method?: string;
    user_id: number;
  }) {
    const orderNo = 'WD' + Date.now() + Math.random().toString(36).slice(2, 6);

    const order = this.orderRepo.create({
      order_no: orderNo,
      ...data,
      status: 0,
    });

    await this.orderRepo.save(order);

    // 扣减商品库存
    await this.productRepo.decrement({ id: data.product_id }, 'stock', data.quantity);

    // 有规格时也扣减SKU库存
    if (data.sku_id) {
      await this.skuRepo.decrement({ id: data.sku_id }, 'stock', data.quantity);
    }

    return order;
  }

  async list(page = 1, pageSize = 20, userId?: number) {
    const where: any = { is_deleted: 0 };
    if (userId) {
      where.user_id = userId;
    }

    const [list, total] = await this.orderRepo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { total, page, pageSize, list };
  }

  async detail(id: number) {
    return await this.orderRepo.findOne({
      where: { id, is_deleted: 0 },
    });
  }

  async updateStatus(id: number, status: number) {
    await this.orderRepo.update(id, { status });
    return await this.orderRepo.findOne({ where: { id } });
  }

  async delete(id: number) {
    await this.orderRepo.update(id, { is_deleted: 1 });
    return true;
  }

  async requestCancel(id: number, userId: number, cancelType: number = 1) {
    const order = await this.orderRepo.findOne({ where: { id, is_deleted: 0 } });
    if (!order) return { code: 404, message: '订单不存在' };
    if (order.user_id !== userId) return { code: 403, message: '无权操作' };
    if (order.status !== 0 && order.status !== 1 && order.status !== 3) return { code: 400, message: '当前订单状态不可取消' };
    if (order.cancel_request === 1) return { code: 400, message: '已提交申请，请等待审批' };

    await this.orderRepo.update(id, { cancel_request: 1, cancel_type: cancelType });
    return { code: 200, message: '申请已提交' };
  }

  async revokeCancel(id: number, userId: number) {
    const order = await this.orderRepo.findOne({ where: { id, is_deleted: 0 } });
    if (!order) return { code: 404, message: '订单不存在' };
    if (order.user_id !== userId) return { code: 403, message: '无权操作' };
    if (order.cancel_request !== 1) return { code: 400, message: '该订单无取消申请' };

    await this.orderRepo.update(id, { cancel_request: 0, cancel_type: 0 });
    return { code: 200, message: '已撤销取消申请' };
  }

  async approveCancel(id: number) {
    const order = await this.orderRepo.findOne({ where: { id, is_deleted: 0 } });
    if (!order) return { code: 404, message: '订单不存在' };
    if (order.cancel_request !== 1) return { code: 400, message: '该订单无取消申请' };

    await this.orderRepo.update(id, { status: 4, cancel_request: 0, cancel_type: 0 });

    // 恢复库存
    await this.productRepo.increment({ id: order.product_id }, 'stock', order.quantity);
    if (order.sku_id) {
      await this.skuRepo.increment({ id: order.sku_id }, 'stock', order.quantity);
    }

    return { code: 200, message: '审批通过，订单已取消' };
  }

  async rejectCancel(id: number) {
    const order = await this.orderRepo.findOne({ where: { id, is_deleted: 0 } });
    if (!order) return { code: 404, message: '订单不存在' };
    if (order.cancel_request !== 1) return { code: 400, message: '该订单无取消申请' };

    await this.orderRepo.update(id, { cancel_request: 0, cancel_type: 0 });
    return { code: 200, message: '已驳回取消申请' };
  }
}
