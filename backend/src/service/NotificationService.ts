import { Provide, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/Order';
import { Review } from '../entity/Review';

@Provide()
export class NotificationService {
  @InjectEntityModel(Order)
  orderRepo: Repository<Order>;

  @InjectEntityModel(Review)
  reviewRepo: Repository<Review>;

  async getCounts(userId: number) {
    // 未读订单状态变更：status_read=0 且 status != 0（排除刚创建的待处理）
    const orderStatusCount = await this.orderRepo.count({
      where: { user_id: userId, status_read: 0, is_deleted: 0 },
    });

    // 已完成但未评价的订单数
    const completedOrders = await this.orderRepo.find({
      where: { user_id: userId, status: 3, is_deleted: 0 },
    });
    const reviewedOrderIds = new Set<number>();
    if (completedOrders.length > 0) {
      const reviews = await this.reviewRepo.find({
        where: completedOrders.map(o => ({ order_id: o.id, user_id: userId, is_deleted: 0 } as any)),
      });
      reviews.forEach(r => reviewedOrderIds.add(r.order_id));
    }
    const unreviewedCount = completedOrders.filter(o => !reviewedOrderIds.has(o.id)).length;

    // 未读评价回复
    const replyCount = await this.reviewRepo.count({
      where: { user_id: userId, is_deleted: 0, reply_read: 0 } as any,
    });

    return {
      orderStatus: orderStatusCount,
      unreviewed: unreviewedCount,
      reviewReply: replyCount,
    };
  }

  async markOrdersRead(userId: number) {
    await this.orderRepo.update(
      { user_id: userId, status_read: 0 },
      { status_read: 1 },
    );
  }

  async markReviewsRead(userId: number) {
    await this.reviewRepo.update(
      { user_id: userId, reply_read: 0 } as any,
      { reply_read: 1 },
    );
  }
}
