import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entity/Review';

@Provide()
export class ReviewService {
  @InjectEntityModel(Review)
  reviewRepo: Repository<Review>;

  async create(data: {
    user_id: number;
    product_id: number;
    order_id: number;
    rating: number;
    content?: string;
    images?: string;
  }) {
    // 检查是否已评价
    const exists = await this.reviewRepo.findOne({
      where: { user_id: data.user_id, order_id: data.order_id, is_deleted: 0 },
    });
    if (exists) return { code: 400, message: '该订单已评价' };

    const review = this.reviewRepo.create(data);
    return { code: 200, message: '评价成功', data: await this.reviewRepo.save(review) };
  }

  async getProductReviews(productId: number, page = 1, pageSize = 10) {
    const [list, total] = await this.reviewRepo.findAndCount({
      where: { product_id: productId, is_deleted: 0 },
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { total, page, pageSize, list };
  }

  async getUserReviews(userId: number, page = 1, pageSize = 20) {
    const [list, total] = await this.reviewRepo.findAndCount({
      where: { user_id: userId, is_deleted: 0 },
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { total, page, pageSize, list };
  }

  async reply(id: number, reply: string) {
    await this.reviewRepo.update(id, { reply });
    return { code: 200, message: '回复成功' };
  }

  async delete(id: number) {
    await this.reviewRepo.update(id, { is_deleted: 1 });
    return { code: 200, message: '删除成功' };
  }

  async getAllReviews(page = 1, pageSize = 20) {
    const [list, total] = await this.reviewRepo.findAndCount({
      where: { is_deleted: 0 },
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { total, page, pageSize, list };
  }
}
